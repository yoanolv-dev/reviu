#!/usr/bin/env python3
"""
Remplace le QR code imprimé sur les photos du présentoir par un vrai QR Reviu.

Les photos produit fournies portaient un QR code qui renvoyait vers le site d'un
concurrent. Ce script le remplace, sans toucher au reste de l'image, par un QR
de même format (version 2, 25 x 25 modules) vers https://reviu.fr/demo, dont la
matrice est générée par la librairie `qrcode` du projet.

Méthode, pour chaque photo de `brand/photos/` :
1. ZXing localise le QR et donne ses 4 coins.
2. Un modèle du QR est ajusté sur la photo : homographie depuis la grille des
   modules (perspective), position de chaque ligne et colonne de la grille,
   flou optique et renforcement de netteté, couleurs du clair et du foncé.
3. La grille est relue sur la photo : elle doit redonner le contenu lu par
   ZXing, ce qui valide la géométrie.
4. La zone des modules est redessinée avec le nouveau QR sur la même géométrie
   (antialiasing, même flou, mêmes couleurs, variations de lumière de la photo),
   avec un fondu d'un demi-module dans le blanc qui entoure le QR.
5. Le JPEG est réenregistré en ne recodant que les blocs 16 x 16 touchés, avec
   ses tables de quantification : le reste de l'image est identique au bit
   près. La version WebP du site est régénérée (1254 x 1254, qualité 92).

Les aperçus des réseaux sociaux (`brand/apercus/`) contiennent ces photos en
réduction : on y reporte la différence avant/après de la photo, recalée sur
l'aperçu par points SIFT.

Enfin, chaque image est relue avec OpenCV et ZXing de 0,5x à 3x : seule
l'adresse Reviu doit en sortir.

Usage, depuis la racine du dépôt (`pnpm install` fait) :
    pip install opencv-python-headless zxing-cpp jpeglib pillow numpy scipy
    python3 scripts/replace-qr.py           # remplacement puis vérification
    python3 scripts/replace-qr.py --check   # vérification seule
"""
import json
import subprocess
import sys
from pathlib import Path

import cv2
import jpeglib
import numpy as np
import zxingcpp
from PIL import Image
from scipy.optimize import least_squares

ROOT = Path(__file__).resolve().parent.parent
TARGET = "https://reviu.fr/demo"
N = 25  # QR version 2

PHOTOS = ["presentoir", "presentoir-angle", "presentoir-comptoir", "etape-1", "etape-2", "etape-3"]
# Aperçu -> photo qu'il contient (voir brand/sources/build.py).
APERCUS = {
    "post-1": "etape-3",
    "post-4": "presentoir",
    "post-5": "presentoir-comptoir",
    "story-2": "etape-1",
    "story-4": "presentoir-angle",
}
WEBP_QUALITY = 92
SCALES = [0.5, 0.75, 1, 1.5, 2, 3]

M_PX, PAD, SS = 48, 3, 4  # grille de référence : px par module, marge ; suréchantillonnage
FIT_MARGIN = 0.8          # zone d'ajustement autour des modules (en modules)
PAINT_IN, PAINT_OUT = 0.4, 0.9  # fondu du redessin (en modules hors de la grille)


# ---------- modèle du QR ----------

def homography(corners):
    src = np.float32([[0, 0], [N, 0], [N, N], [0, N]])
    return cv2.getPerspectiveTransform(src, np.float32(corners)).astype(float)


def shift(d):
    return np.array([[1, 0, d], [0, 1, d], [0, 0, 1]], float)


def grid_image(g, du, dv):
    """Grille en haute résolution (M_PX px par module), lignes décalées de du/dv."""
    t = (np.arange((N + 2 * PAD) * M_PX) + 0.5) / M_PX - PAD
    ci = np.clip(np.searchsorted(np.arange(N + 1) + du, t) - 1, -1, N) + 1
    ri = np.clip(np.searchsorted(np.arange(N + 1) + dv, t) - 1, -1, N) + 1
    gp = np.zeros((N + 2, N + 2), np.float32)
    gp[1:-1, 1:-1] = g
    return gp[ri[:, None], ci[None, :]]


class Model:
    """Géométrie et optique d'un QR sur la photo. Coordonnées module : (colonne, ligne) dans [0, N]."""

    NP = 8 + 2 * (N - 1) + 3

    def __init__(self, corners):
        self.corners = np.array(corners, float)
        self.du = np.zeros(N + 1)  # décalage des frontières de colonnes (en modules)
        self.dv = np.zeros(N + 1)  # idem pour les lignes
        self.sigma = 0.6           # flou optique (px)
        self.amount = 0.0          # renforcement de netteté
        self.sigma2 = 1.5          # rayon du renforcement (px)

    def pack(self):
        return np.r_[self.corners.reshape(-1), self.du[1:N], self.dv[1:N], self.sigma, self.amount, self.sigma2]

    @classmethod
    def unpack(cls, p):
        m = cls(p[:8].reshape(4, 2))
        m.du[1:N] = p[8:8 + N - 1]
        m.dv[1:N] = p[8 + N - 1:8 + 2 * (N - 1)]
        m.sigma, m.amount, m.sigma2 = p[-3:]
        return m

    @property
    def H(self):
        return homography(self.corners)

    def roi(self, margin):
        pts = np.array([[-margin, -margin, 1], [N + margin, -margin, 1], [N + margin, N + margin, 1],
                        [-margin, N + margin, 1]]) @ self.H.T
        pts = pts[:, :2] / pts[:, 2:]
        x0, y0 = np.floor(pts.min(0)).astype(int) - 3
        x1, y1 = np.ceil(pts.max(0)).astype(int) + 3
        return int(x0), int(y0), int(x1 - x0), int(y1 - y0)

    def module_coords(self, roi):
        x0, y0, w, h = roi
        xs, ys = np.meshgrid(np.arange(w) + x0 + 0.5, np.arange(h) + y0 + 0.5)
        p = np.stack([xs, ys, np.ones_like(xs)], -1) @ np.linalg.inv(self.H).T
        return p[..., 0] / p[..., 2], p[..., 1] / p[..., 2]

    def outside(self, roi):
        """Distance (en modules) à la zone des modules, 0 à l'intérieur."""
        u, v = self.module_coords(roi)
        return np.maximum(np.maximum(-u, u - N), np.maximum(np.maximum(-v, v - N), 0))

    def coverage(self, g, roi):
        """Part de chaque pixel couverte par les modules noirs, après flou et netteté."""
        x0, y0, w, h = roi
        a_g2m = np.array([[1 / M_PX, 0, -PAD], [0, 1 / M_PX, -PAD], [0, 0, 1]])
        a_i2s = np.array([[SS, 0, -SS * x0], [0, SS, -SS * y0], [0, 0, 1]])
        m = shift(-0.5) @ a_i2s @ self.H @ a_g2m @ shift(0.5)
        k = cv2.warpPerspective(grid_image(g, self.du, self.dv), m, (w * SS, h * SS),
                                flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)
        k = cv2.resize(k, (w, h), interpolation=cv2.INTER_AREA).astype(float)
        k = cv2.GaussianBlur(k, (0, 0), self.sigma)
        return k + self.amount * (k - cv2.GaussianBlur(k, (0, 0), self.sigma2))

    def module_center(self, r, c, fx=0.5, fy=0.5):
        bu, bv = np.arange(N + 1) + self.du, np.arange(N + 1) + self.dv
        u = bu[c] + fx * (bu[c + 1] - bu[c])
        v = bv[r] + fy * (bv[r + 1] - bv[r])
        p = self.H @ np.array([u, v, 1.0])
        return p[:2] / p[2]


def basis(roi):
    x0, y0, w, h = roi
    xs, ys = np.meshgrid((np.arange(w) + 0.5) / w - 0.5, (np.arange(h) + 0.5) / h - 0.5)
    return np.stack([np.ones_like(xs), xs, ys, xs * xs, xs * ys, ys * ys], -1).reshape(-1, 6)


def light_dark(k, img, mask, B):
    """img = a + b * k, a (clair) et b (foncé - clair) quadratiques en x, y."""
    A = np.concatenate([B, B * k.reshape(-1, 1)], 1)
    coef, *_ = np.linalg.lstsq(A[mask], img[mask], rcond=None)
    return A @ coef, B @ coef[:6], B @ coef[6:]


def fit(Y, model, g, full):
    """Ajuste la géométrie et l'optique du modèle sur la luminance Y (moindres carrés)."""
    roi = model.roi(FIT_MARGIN + 1)
    x0, y0, w, h = roi
    Yr = Y[y0:y0 + h, x0:x0 + w].reshape(-1)
    mask = (model.outside(roi) < FIT_MARGIN).reshape(-1)
    B = basis(roi)
    base = model.pack()
    free = np.ones(Model.NP, bool)
    if not full:  # premier passage : coins et flou seulement
        free[8:-3] = False
        free[-2:] = False
    lo = np.r_[base[:8] - 6, np.full(2 * (N - 1), -0.3), 0.15, -0.3, 0.4]
    hi = np.r_[base[:8] + 6, np.full(2 * (N - 1), 0.3), 2.5, 2.0, 4.0]
    base = np.clip(base, lo + 1e-6, hi - 1e-6)

    def full_params(q):
        p = base.copy()
        p[free] = q
        return p

    def res(q):
        m = Model.unpack(full_params(q))
        pred, _, _ = light_dark(m.coverage(g, roi), Yr, mask, B)
        # léger rappel des lignes de grille vers la grille régulière
        return np.r_[(pred - Yr)[mask], 3.0 * m.du[1:N], 3.0 * m.dv[1:N]]

    # Jacobien à pas fixes : le rendu est interpolé, un pas trop fin ne voit rien.
    steps = np.r_[np.full(8, 0.1), np.full(2 * (N - 1), 0.02), 0.05, 0.05, 0.1][free]

    def jac(q):
        f0 = res(q)
        cols = []
        for i, st in enumerate(steps):
            d = np.zeros_like(q)
            d[i] = st
            cols.append((res(q + d) - f0) / st)
        return np.stack(cols, 1)

    r = least_squares(res, base[free], jac=jac, bounds=(lo[free], hi[free]), max_nfev=40)
    rms = np.sqrt(np.mean(r.fun[:mask.sum()] ** 2))
    return Model.unpack(full_params(r.x)), rms


def initial_grid(Y, model):
    Yf = Y.astype(np.float32)
    vals = np.array([[cv2.getRectSubPix(Yf, (3, 3), tuple(model.module_center(r, c) - 0.5)).mean()
                      for c in range(N)] for r in range(N)])
    return vals < (np.percentile(vals, 10) + np.percentile(vals, 90)) / 2


def sample_grid(Y, model, g):
    """Relit la grille : noirceur normalisée par le modèle, moyennée au cœur de chaque module."""
    roi = model.roi(FIT_MARGIN + 1)
    x0, y0, w, h = roi
    Yr = Y[y0:y0 + h, x0:x0 + w]
    mask = (model.outside(roi) < FIT_MARGIN).reshape(-1)
    _, a, b = light_dark(model.coverage(g, roi), Yr.reshape(-1), mask, basis(roi))
    kobs = ((Yr - a.reshape(h, w)) / b.reshape(h, w)).astype(np.float32)
    val = np.zeros((N, N))
    for r in range(N):
        for c in range(N):
            val[r, c] = np.mean([cv2.getRectSubPix(kobs, (1, 1), tuple(model.module_center(r, c, fx, fy) - [x0 + 0.5, y0 + 0.5]))[0, 0]
                                 for fy in (0.3, 0.5, 0.7) for fx in (0.3, 0.5, 0.7)])
    return val > 0.5, np.abs(val - 0.5).min()


def decode_grid(g):
    img = np.pad(~g, 4, constant_values=True).astype(np.uint8) * 255
    res = zxingcpp.read_barcodes(cv2.resize(img, None, fx=10, fy=10, interpolation=cv2.INTER_NEAREST))
    return res[0].text if res else None


def smooth_field(values, weight, sigma, prior):
    """Lissage pondéré (convolution normalisée), ramené vers `prior` là où les mesures manquent."""
    wsum = cv2.GaussianBlur(weight, (0, 0), sigma)[..., None]
    vsum = cv2.GaussianBlur(values * weight[..., None], (0, 0), sigma)
    return (vsum + 0.05 * prior) / (wsum + 0.05)


def paint(rgb, model, g_old, g_new):
    """Redessine la zone des modules avec la grille g_new ; renvoie l'image modifiée."""
    roi = model.roi(PAINT_OUT + 1.5)
    x0, y0, w, h = roi
    img = rgb[y0:y0 + h, x0:x0 + w].astype(float)
    out_dist = model.outside(roi)
    mask = (out_dist < FIT_MARGIN).reshape(-1)
    k_old = model.coverage(g_old, roi)
    k_new = model.coverage(g_new, roi)
    _, a, b = light_dark(k_old, img.reshape(-1, 3), mask, basis(roi))
    a, b = a.reshape(h, w, 3), b.reshape(h, w, 3)
    # Clair et foncé locaux : moyennes des pixels bien clairs / bien foncés, hors bords des modules.
    module_px = np.linalg.norm(model.module_center(12, 13) - model.module_center(12, 12))
    flat = cv2.erode((np.abs(k_old - np.round(k_old)) < 0.08).astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    near = out_dist < PAINT_OUT + 1
    light = smooth_field(img, (flat & (k_old < 0.5) & near).astype(np.float32), module_px, a)
    dark = smooth_field(img, (flat & (k_old > 0.5) & near).astype(np.float32), module_px, a + b)
    new = light + (dark - light) * k_new[..., None]
    alpha = np.clip((PAINT_OUT - out_dist) / (PAINT_OUT - PAINT_IN), 0, 1)[..., None]
    out = rgb.copy()
    out[y0:y0 + h, x0:x0 + w] = np.clip(np.round(img * (1 - alpha) + new * alpha), 0, 255).astype(np.uint8)
    return out


def replace_qrs(rgb, g_new, label):
    """Remplace chaque QR lisible qui ne renvoie pas vers TARGET."""
    Y = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY).astype(float)
    found = zxingcpp.read_barcodes(rgb, formats=zxingcpp.BarcodeFormat.QRCode)
    out = rgb
    for res in found:
        if res.text == TARGET:
            continue
        p = res.position
        corners = [(q.x + 0.5, q.y + 0.5) for q in (p.top_left, p.top_right, p.bottom_right, p.bottom_left)]
        model = Model(corners)
        g = initial_grid(Y, model)
        model, _ = fit(Y, model, g, full=False)
        g, _ = sample_grid(Y, model, g)
        model, rms = fit(Y, model, g, full=True)
        g, contrast = sample_grid(Y, model, g)
        read = decode_grid(g)
        if read != res.text:
            raise SystemExit(f"{label} : grille relue illisible ({read!r} au lieu de {res.text!r}), rien n'est modifié")
        out = paint(out, model, g, g_new)
        print(f"{label} : QR {res.text} remplacé (écart modèle {rms:.1f}/255, flou {model.sigma:.2f} px, "
              f"netteté {model.amount:.2f}, marge de lecture {contrast:.2f})")
    return out


def target_matrix(text):
    """Matrice du QR (version 2, correction M) générée par la librairie `qrcode` du projet."""
    js = ('const q=require("qrcode").create(process.argv[1],{version:2,errorCorrectionLevel:"M"});'
          'const n=q.modules.size;'
          'console.log(JSON.stringify(Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>q.modules.get(r,c)))))')
    g = np.array(json.loads(subprocess.check_output(["node", "-e", js, text], cwd=ROOT)), bool)
    assert g.shape == (N, N) and decode_grid(g) == text
    return g


# ---------- aperçus ----------

def register(photo, apercu, zone):
    """Transformation (similitude) de la photo vers l'aperçu : points SIFT, puis ECC autour de `zone`."""
    sift = cv2.SIFT_create()
    g1 = cv2.cvtColor(photo, cv2.COLOR_RGB2GRAY)
    g2 = cv2.cvtColor(apercu, cv2.COLOR_RGB2GRAY)
    k1, d1 = sift.detectAndCompute(g1, None)
    k2, d2 = sift.detectAndCompute(g2, None)
    matches = [m for m, n in cv2.BFMatcher().knnMatch(d1, d2, k=2) if m.distance < 0.75 * n.distance]
    src = np.float32([k1[m.queryIdx].pt for m in matches])
    dst = np.float32([k2[m.trainIdx].pt for m in matches])
    M, inliers = cv2.estimateAffinePartial2D(src, dst, method=cv2.RANSAC, ransacReprojThreshold=1.5)
    # Affinage ECC entre l'aperçu et la photo réduite à la même échelle, au voisinage du QR.
    s = np.sqrt(abs(np.linalg.det(M[:, :2])))
    small = cv2.resize(g1, None, fx=s, fy=s, interpolation=cv2.INTER_AREA).astype(np.float32)
    to_small = shift(-0.5) @ np.diag([s, s, 1]) @ shift(0.5)
    warp = np.r_[M, [[0, 0, 1]]] @ np.linalg.inv(to_small)  # petite photo -> aperçu
    near = cv2.dilate(zone.astype(np.uint8), np.ones((151, 151), np.uint8))
    near = cv2.resize(near, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
    inv = np.float32(cv2.invertAffineTransform(warp[:2]))
    _, inv = cv2.findTransformECC(g2.astype(np.float32), small, inv, cv2.MOTION_AFFINE,
                                  (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-7), near, 3)
    warp = np.r_[cv2.invertAffineTransform(inv), [[0, 0, 1]]] @ to_small
    return warp[:2], int(inliers.sum())


def warp_to(img, M, size):
    """Réduit `img` (photo) dans l'espace de l'aperçu, avec moyennage (suréchantillonnage x4)."""
    w, h = size
    A = shift(-0.5) @ np.diag([4.0, 4.0, 1.0]) @ shift(0.5) @ np.r_[M, [[0, 0, 1]]]
    big = cv2.warpAffine(img, A[:2], (w * 4, h * 4), flags=cv2.INTER_LINEAR,
                         borderMode=cv2.BORDER_CONSTANT, borderValue=0)
    return cv2.resize(big, (w, h), interpolation=cv2.INTER_AREA)


# ---------- lecture, écriture, vérification ----------

def load(path):
    return np.asarray(Image.open(path).convert("RGB"))


def save_jpeg(rgb, before, path):
    """Réenregistre le JPEG en ne recodant que les blocs 16 x 16 qui ont changé.

    L'image modifiée est encodée avec les tables de quantification d'origine, puis
    seuls les coefficients DCT des blocs touchés remplacent ceux du fichier
    d'origine : le reste de l'image reste identique au bit près.
    """
    src = jpeglib.read_dct(str(path))
    if src.progressive_mode or src.samp_factor.tolist() != [[2, 2], [1, 1], [1, 1]]:
        raise SystemExit(f"{path} : format JPEG non prévu (progressif ou sous-échantillonnage autre que 4:2:0)")
    tmp = path.with_suffix(".tmp.jpg")
    like = Image.open(path)
    Image.fromarray(rgb).save(tmp, "JPEG", qtables=like.quantization, subsampling=2)
    new = jpeglib.read_dct(str(tmp))
    tmp.unlink()
    assert np.array_equal(new.qt, src.qt) and np.array_equal(new.quant_tbl_no, src.quant_tbl_no)
    changed = np.any(rgb != before, -1)
    mh, mw = src.Cb.shape[:2]
    pad = np.zeros((mh * 16, mw * 16), bool)
    pad[:changed.shape[0], :changed.shape[1]] = changed
    mcu = pad.reshape(mh, 16, mw, 16).any((1, 3))
    mcu = cv2.dilate(mcu.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool)
    ys, xs = np.nonzero(mcu)
    for my, mx in zip(ys, xs):
        src.Y[2 * my:2 * my + 2, 2 * mx:2 * mx + 2] = new.Y[2 * my:2 * my + 2, 2 * mx:2 * mx + 2]
        src.Cb[my, mx] = new.Cb[my, mx]
        src.Cr[my, mx] = new.Cr[my, mx]
    src.write_dct(str(path))
    return int(mcu.sum()), mh * mw


def decoded_texts(path):
    rgb = load(path)
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    det = cv2.QRCodeDetector()
    found = {}
    for s in SCALES:
        interp = cv2.INTER_AREA if s < 1 else cv2.INTER_CUBIC
        b = bgr if s == 1 else cv2.resize(bgr, None, fx=s, fy=s, interpolation=interp)
        text, _, _ = det.detectAndDecode(b)
        if text:
            found.setdefault(text, set()).add(f"OpenCV {s}x")
        for r in zxingcpp.read_barcodes(cv2.cvtColor(b, cv2.COLOR_BGR2RGB)):
            if r.text:
                found.setdefault(r.text, set()).add(f"ZXing {s}x")
    return found


def all_images():
    return ([ROOT / f"public/products/{n}.webp" for n in PHOTOS] + [ROOT / f"brand/photos/{n}.jpg" for n in PHOTOS]
            + sorted((ROOT / "brand/apercus").glob("*.jpg")) + sorted((ROOT / "public/installations").glob("*.webp")))


def check():
    ok = True
    for path in all_images():
        found = decoded_texts(path)
        bad = {t: v for t, v in found.items() if t != TARGET}
        ok &= not bad
        status = "ERREUR" if bad else "ok"
        detail = "; ".join(f"{t} ({', '.join(sorted(v))})" for t, v in found.items()) or "aucun QR lisible"
        print(f"[{status}] {path.relative_to(ROOT)} : {detail}")
    return ok


def main():
    g_new = target_matrix(TARGET)
    fixed = {}
    for name in PHOTOS:
        jpg = ROOT / f"brand/photos/{name}.jpg"
        before = load(jpg)
        after = replace_qrs(before, g_new, jpg.relative_to(ROOT))
        if after is before:
            continue
        fixed[name] = (before, after)
        blocks, total = save_jpeg(after, before, jpg)
        print(f"  {blocks}/{total} blocs JPEG recodés, le reste est identique au bit près")
        Image.fromarray(after).save(ROOT / f"public/products/{name}.webp", "WEBP", quality=WEBP_QUALITY, method=6)
    for apercu, name in APERCUS.items():
        if name not in fixed:
            continue
        path = ROOT / f"brand/apercus/{apercu}.jpg"
        img = load(path)
        before, after = fixed[name]
        M, inliers = register(before, img, np.any(after != before, -1))
        size = (img.shape[1], img.shape[0])
        delta = warp_to(after.astype(np.float32) - before.astype(np.float32), M, size)
        # contrôle du recalage : l'ancienne photo réduite doit recouvrir l'aperçu dans la zone modifiée
        zone = np.abs(delta).max(-1) > 1
        err = np.abs(warp_to(before.astype(np.float32), M, size) - img)[zone].mean()
        out = np.clip(np.round(img + delta), 0, 255).astype(np.uint8)
        blocks, total = save_jpeg(out, img, path)
        print(f"{path.relative_to(ROOT)} : report de {name} ({inliers} points SIFT, écart de recalage {err:.1f}/255, "
              f"{blocks}/{total} blocs recodés)")


if __name__ == "__main__":
    if "--check" not in sys.argv:
        main()
    sys.exit(0 if check() else 1)
