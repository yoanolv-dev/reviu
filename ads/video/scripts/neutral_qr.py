"""Remplace le QR code imprime sur la photo produit par un motif de QR non lisible.

Le QR de la photo fournie renvoie vers le site d'un concurrent. Dans les pubs,
on garde exactement l'aspect du produit (reperes d'angle, alignement, densite)
mais les donnees sont brouillees et les informations de format detruites :
aucun lecteur ne peut le decoder (verifie avec OpenCV et ZXing).
Entree : public/img/presentoir-face.png (sortie de cutout.py).
Sorties : ecrase presentoir-face.png et presentoir-face-2x.png (copie de
l'original dans assets-src/presentoir-face-qr-origine.png).
"""
import random
import shutil
import numpy as np
from PIL import Image, ImageFilter

FACE = "public/img/presentoir-face.png"
N = 25  # QR version 2
# Coins du QR sur la face 852 x 904 (mesures OpenCV).
X0, Y0, X1, Y1 = 599.0, 620.0, 746.0, 772.0


def grid_from_photo(img):
    a = np.asarray(img.convert("L")).astype(float)
    mx, my = (X1 - X0) / N, (Y1 - Y0) / N
    g = np.zeros((N, N), bool)
    for r in range(N):
        for c in range(N):
            y = int(Y0 + (r + 0.5) * my)
            x = int(X0 + (c + 0.5) * mx)
            g[r, c] = a[y - 1:y + 2, x - 1:x + 2].mean() < 128
    return g


def is_function(r, c):
    finder = (r < 8 and c < 8) or (r < 8 and c >= N - 8) or (r >= N - 8 and c < 8)
    align = 16 <= r <= 20 and 16 <= c <= 20
    timing = r == 6 or c == 6
    return finder or align or timing


def is_format(r, c):
    return (r == 8 and (c < 9 or c >= N - 8)) or (c == 8 and (r < 9 or r >= N - 8))


def scramble(g, seed=29):
    rnd = random.Random(seed)
    out = g.copy()
    for r in range(N):
        for c in range(N):
            if is_format(r, c):
                out[r, c] = not g[r, c]  # format illisible
            elif not is_function(r, c) and rnd.random() < 0.5:
                out[r, c] = rnd.random() < 0.5
    return out


def paint(img, grid, scale):
    """Redessine la zone du QR a partir de la grille, avec antialiasing."""
    ss = 8
    x0, y0, x1, y1 = X0 * scale, Y0 * scale, X1 * scale, Y1 * scale
    bx0, by0 = int(np.floor(x0)), int(np.floor(y0))
    bx1, by1 = int(np.ceil(x1)), int(np.ceil(y1))
    w, h = (bx1 - bx0) * ss, (by1 - by0) * ss
    src = np.asarray(img).astype(float)
    dark = np.array([22, 20, 24], float)
    light = np.median(src[by0 - 6:by0 - 2, bx0:bx1, :3].reshape(-1, 3), axis=0)
    big = Image.new("L", (w, h), 0)
    px = big.load()
    mx, my = (x1 - x0) * ss / N, (y1 - y0) * ss / N
    ox, oy = (x0 - bx0) * ss, (y0 - by0) * ss
    for yy in range(h):
        r = int((yy - oy) // my)
        for xx in range(w):
            c = int((xx - ox) // mx)
            if 0 <= r < N and 0 <= c < N and grid[r, c]:
                px[xx, yy] = 255
    m = big.resize((bx1 - bx0, by1 - by0), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.35 * scale))
    k = np.asarray(m).astype(float)[..., None] / 255.0
    region = light * (1 - k) + dark * k
    out = src.copy()
    out[by0:by1, bx0:bx1, :3] = region
    return Image.fromarray(out.astype(np.uint8), "RGBA")


if __name__ == "__main__":
    ORIG = "assets-src/presentoir-face-qr-origine.png"
    import os
    if not os.path.exists(ORIG):
        shutil.copy(FACE, ORIG)
    base = Image.open(ORIG).convert("RGBA")
    g = grid_from_photo(base)
    s = scramble(g)
    face = paint(base, s, 1)
    face.save(FACE, optimize=True)
    big = Image.open(ORIG).convert("RGBA")
    big = big.resize((big.width * 2, big.height * 2), Image.LANCZOS)
    face2 = paint(big, s, 2)
    rgb2 = face2.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    rgb2.putalpha(face2.getchannel("A"))
    rgb2.save("public/img/presentoir-face-2x.png", optimize=True)
    print("modules modifies :", int((g != s).sum()), "sur", N * N)
