"""Construit les pages HTML de la charte reviu (aperçu local ou import Canva)."""
import sys, html as H
from PIL import ImageFont

MODE = sys.argv[1] if len(sys.argv) > 1 else "local"
ROOT = sys.argv[2] if len(sys.argv) > 2 else ".."

COBALT, STRONG, BRUME, INK = "#1B4DFF", "#1139C9", "#EDF1FF", "#0A0D16"
SOFT, MUTED, LINE, PERLE = "#333A49", "#6B7382", "#E6E8EF", "#F5F6F8"
GOLD, WHITE, PALE = "#FBBC04", "#FFFFFF", "#DCE4FF"
GRAY_DARK = "#9AA3B5"

_fonts = {}
def width(text, size, weight=500, ls=0):
    name = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold"}[weight]
    key = (name, size)
    if key not in _fonts:
        _fonts[key] = ImageFont.truetype(f"static/Inter-{name}.ttf", size)
    return _fonts[key].getlength(text) + ls * size * max(len(text) - 1, 0)

def A(p):
    # Les images binaires passent par raw.githubusercontent (githack les redirige).
    if MODE != "local" and p.endswith((".jpg", ".png")):
        return ROOT.replace("https://raw.githack.com/", "https://raw.githubusercontent.com/") + "/" + p
    return f"{ROOT}/{p}"

# ---------- primitives (chaque élément est positionné en absolu : import Canva fidèle) ----------
def T(x, y, w, txt, size, weight=500, color=INK, lh=1.35, ls=0.0, align="left"):
    return (f'<div class="t" style="left:{x}px;top:{y}px;width:{w}px;font-size:{size}px;font-weight:{weight};'
            f'color:{color};line-height:{lh};letter-spacing:{ls}em;text-align:{align}">{txt}</div>')

import re as _re
WARN = []
def HEAD(x, y, w, txt, size, color=INK, lh=1.04, ls=-0.03, weight=800, align="left"):
    for line in txt.split("<br>"):
        plain = H.unescape(_re.sub(r"<[^>]+>", "", line))
        lw = width(plain, size, weight, ls)
        if lw > w * 0.94:
            WARN.append(f"{plain!r} {lw:.0f}/{w}")
    return T(x, y, w, txt, size, weight, color, lh, ls, align)

def R(x, y, w, h, bg, r=0, border=None, opacity=None):
    b = f"border:{border};" if border else ""
    o = f"opacity:{opacity};" if opacity is not None else ""
    return f'<div class="r" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;background:{bg};border-radius:{r}px;{b}{o}"></div>'

def P(x, y, w, h, src, r=0, pos="50% 50%"):
    return (f'<div class="r" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{r}px;'
            f'background-image:url({A(src if "/" in src else "photos/" + src)});background-size:cover;background-position:{pos}"></div>')

def I(x, y, w, src, h=None):
    hh = f"height:{h}px;" if h else ""
    return f'<img class="i" src="{A(src)}" style="left:{x}px;top:{y}px;width:{w}px;{hh}">'

LOGO_RATIO = 2636 / 800          # logo horizontal
VLOGO_RATIO = None

def logo(x, y, h, variant="couleur"):
    return I(x, y, round(h * LOGO_RATIO, 2), f"logo/svg/reviu-logo-horizontal-{variant}.svg", h)

def c(t):  # accent cobalt
    return f'<span style="color:{COBALT}">{t}</span>'

def g(t="."):  # point doré
    return f'<span style="color:{GOLD}">{t}</span>'

def pill(x, y, text, size=28, bg=WHITE, fg=INK, icon="icons/check-cobalt.svg", h=None, weight=600, pad=26, border=None):
    h = h or round(size * 2.3)
    tw = width(text, size, weight)
    isz = round(size * 1.15) if icon else 0
    gap = round(size * 0.45) if icon else 0
    w = round(pad * 0.85 + isz + gap + tw + pad) if icon else round(pad * 2 + tw)
    out = R(x, y, w, h, bg, h / 2, border)
    tx = x + (round(pad * 0.85) if icon else pad)
    if icon:
        out += I(tx, round(y + (h - isz) / 2), isz, icon)
        tx += isz + gap
    out += T(tx, round(y + (h - size * 1.3) / 2), round(tw + 8), H.escape(text), size, weight, fg, 1.3)
    return out, w

def pills_flow(x, y, maxw, items, size=30, gap=16, rowgap=18, **kw):
    out, cx, cy = "", x, y
    h = round(size * 2.3)
    for it in items:
        opts = dict(kw)
        if isinstance(it, tuple):
            it, extra = it; opts.update(extra)
        _, w = pill(0, 0, it, size, **opts)
        if cx + w > x + maxw:
            cx, cy = x, cy + h + rowgap
        o, w = pill(cx, cy, it, size, **opts)
        out += o; cx += w + gap
    return out, cy + h

def check_list(x, y, items, size=30, color=INK, icon="icons/check-cobalt.svg", step=None, w=700, weight=600):
    out, step = "", step or round(size * 2.2)
    isz = round(size * 1.2)
    import math
    yy = y
    for it in items:
        lines = it.count("<br>") + 1 if "<br>" in it else max(1, math.ceil(width(it, size, weight) / (w - 10)))
        out += I(x, yy + round((size * 1.3 - isz) / 2), isz, icon)
        out += T(x + isz + round(size * 0.6), yy, w, it, size, weight, color, 1.3)
        yy += step + round((lines - 1) * size * 1.3)
    return out

def page(w, h, bg, inner, label):
    return f'<section class="page" data-document-role="page" data-label="{H.escape(label)}" style="width:{w}px;height:{h}px;background:{bg}">{inner}</section>'

def doc(pages, title):
    if MODE == "local":
        fonts = '<link rel="stylesheet" href="../../fonts/inter.css">'
    else:
        fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
                 '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">')
    css = ("*{margin:0;padding:0;box-sizing:border-box}html,body{background:#fff}"
           "body{font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}"
           ".page{position:relative;overflow:hidden;break-after:page}.page:last-child{break-after:auto}"
           ".t,.r,.i{position:absolute}.t{white-space:normal}")
    return f'<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>{title}</title>{fonts}<style>{css}</style></head><body>{"".join(pages)}</body></html>'

# ======================================================================
# POSTS INSTAGRAM 1080 x 1350
# ======================================================================
PW, PH = 1080, 1350

def post_header(variant="couleur", url_color=MUTED):
    return logo(80, 72, 58, variant) + T(760, 84, 240, "reviu.fr", 26, 600, url_color, 1.3, 0, "right")

def posts():
    ps = []
    # 1. Produit
    inner = post_header()
    inner += HEAD(80, 190, 940, f"Plus d’avis Google,<br>directement depuis<br>votre {c('comptoir')}{g()}", 94)
    inner += P(80, 560, 920, 640, "etape-3.jpg", 44, "50% 58%")
    inner += R(700, 500, 250, 250, COBALT, 125)
    inner += T(700, 573, 250, "29,90 €", 66, 800, WHITE, 1.1, -0.04, "center")
    inner += T(700, 650, 250, "une seule fois", 24, 600, PALE, 1.3, 0, "center")
    o1, w1 = pill(80, 1232, "Sans abonnement", 28)
    o2, _ = pill(80 + w1 + 16, 1232, "Livraison offerte", 28)
    inner += o1 + o2
    ps.append(page(PW, PH, BRUME, inner, "Post 1 - Le présentoir"))

    # 2. Comment ça marche
    inner = post_header()
    inner += HEAD(80, 190, 940, f"Comment ça<br>{c('marche')} {g('?')}", 110)
    steps = [
        ("1", "Posez-le sur votre comptoir", "Visible toute la journée, là où vos clients attendent quelques secondes."),
        ("2", "Le client approche son téléphone", "Sans contact ou QR code : votre page d’avis Google s’ouvre aussitôt."),
        ("3", "Il laisse son avis", "Aucune application à installer. Compatible iPhone et Android."),
    ]
    y = 480
    for n, t, d in steps:
        inner += R(80, y, 920, 236, BRUME, 36)
        inner += R(120, y + 40, 96, 96, COBALT, 31)
        inner += T(120, y + 58, 96, n, 50, 800, WHITE, 1.2, -0.03, "center")
        inner += T(252, y + 42, 700, t, 38, 800, INK, 1.2, -0.025)
        inner += T(252, y + 100, 700, d, 28, 500, SOFT, 1.4)
        y += 256
    ps.append(page(PW, PH, WHITE, inner, "Post 2 - Comment ça marche"))

    # 3. Comparatif (fond encre)
    inner = post_header("blanc-sur-encre", GRAY_DARK)
    inner += HEAD(80, 190, 940, f"Plus simple qu’à l’oral,<br>plus complet qu’un<br>QR code imprimé{g()}", 80, WHITE)
    cy, ch = 500, 640
    inner += R(80, cy, 920, ch, WHITE, 40)
    inner += R(858, cy + 18, 124, ch - 36, BRUME, 28)
    cols = [(640, "À l’oral"), (785, "QR imprimé"), (920, "Reviu")]
    for cx, lab in cols:
        col = COBALT if lab == "Reviu" else MUTED
        inner += T(cx - 70, cy + 44, 140, lab, 22, 700, col, 1.25, 0, "center")
    rows = [
        ("Le client trouve votre fiche sans chercher", "x", "v", "v"),
        ("Il suffit d’approcher le téléphone", "x", "x", "v"),
        ("Lien modifiable sans rien réimprimer", "x", "x", "v"),
        ("Statistiques de scans", "x", "x", "v"),
    ]
    ry = cy + 110
    for lab, *marks in rows:
        inner += R(120, ry, 700, 2, LINE)
        inner += T(120, ry + 28, 470, lab, 28, 600, INK, 1.25)
        for (cx, _), m in zip(cols, marks):
            ic = "icons/check-cobalt.svg" if m == "v" else "icons/cross-muted.svg"
            inner += I(cx - 24, ry + 38, 48, ic)
        ry += 128
    inner += T(80, 1196, 920, f"Reviu : 29,90 € une seule fois, sans abonnement{g()}", 32, 700, WHITE, 1.3, -0.01)
    ps.append(page(PW, PH, INK, inner, "Post 3 - Comparatif"))

    # 4. Offre (fond cobalt)
    inner = post_header("blanc-sur-cobalt", PALE)
    inner += HEAD(80, 190, 940, f"29,90 €,<br>une seule fois{g()}", 130, WHITE, 1.0, -0.04)
    inner += T(80, 480, 900, "Un seul nouveau client qui vous choisit grâce à vos avis, et le présentoir est rentabilisé.", 32, 500, PALE, 1.4)
    inner += check_list(80, 690, ["Livraison offerte", "Satisfait ou<br>remboursé 30 jours", "Sans abonnement", "iPhone et Android"],
                        32, WHITE, "icons/check-gold.svg", step=92, w=400)
    inner += R(540, 650, 460, 460, WHITE, 40)
    inner += P(560, 670, 420, 420, "presentoir.jpg", 28)
    o, w = pill(80, 1180, "Commander sur reviu.fr", 30, WHITE, COBALT, None, h=80, weight=700, pad=38)
    inner += o
    ps.append(page(PW, PH, COBALT, inner, "Post 4 - L’offre"))

    # 5. Métiers
    inner = post_header()
    inner += HEAD(80, 190, 940, f"Pensé pour tous<br>les {c('comptoirs')}{g()}", 104)
    inner += T(80, 430, 900, "Du restaurant au cabinet dentaire, un geste suffit pour que vos clients laissent leur avis.", 30, 500, SOFT, 1.4)
    metiers = ["Restaurant", "Salon de coiffure", "Garage", "Boulangerie", "Institut de beauté", "Hôtel",
               "Boutique", "Cabinet dentaire", "Salle de sport",
               ("Et le vôtre", dict(bg=COBALT, fg=WHITE, icon="icons/check-gold.svg"))]
    o, yend = pills_flow(80, 580, 920, metiers, 28, 14, 16, bg=WHITE, fg=INK, icon=None, border=None)
    inner += o
    inner += P(80, yend + 44, 920, 1270 - yend - 44, "presentoir-comptoir.jpg", 44, "50% 62%")
    ps.append(page(PW, PH, PERLE, inner, "Post 5 - Les métiers"))
    return ps

# ======================================================================
# STORIES 1080 x 1920 (zone sûre : 250 px en haut et en bas)
# ======================================================================
SW, SH = 1080, 1920

def stories():
    ss = []
    # 1. Accroche (encre)
    inner = I(80, 330, 470, "icons/stars-5-gold.svg")
    inner += HEAD(80, 520, 940, "Vos clients<br>vous adorent.", 128, GRAY_DARK)
    inner += HEAD(80, 820, 940, f"Google ne<br>le sait pas<br>encore{g()}", 128, WHITE)
    inner += T(80, 1290, 860, "Le présentoir Reviu transforme vos clients satisfaits en avis Google, directement depuis votre comptoir.", 36, 500, GRAY_DARK, 1.4)
    inner += logo(80, 1560, 64, "blanc-sur-encre")
    inner += T(700, 1574, 300, "reviu.fr", 30, 600, GRAY_DARK, 1.3, 0, "right")
    ss.append(page(SW, SH, INK, inner, "Story 1 - Accroche"))

    # 2. Un geste suffit (brume)
    inner = logo(80, 250, 58)
    inner += HEAD(80, 380, 940, f"Un geste<br>{c('suffit')}{g()}", 140)
    inner += T(80, 690, 900, "Le client approche son téléphone du présentoir : votre page d’avis Google s’ouvre, sans application.", 36, 500, SOFT, 1.4)
    inner += P(80, 900, 920, 760, "etape-1.jpg", 48, "50% 50%")
    o1, w1 = pill(120, 1560, "Sans contact", 28)
    o2, _ = pill(120 + w1 + 14, 1560, "QR code", 28)
    inner += o1 + o2
    ss.append(page(SW, SH, BRUME, inner, "Story 2 - Un geste suffit"))

    # 3. Sondage (cobalt)
    inner = logo(80, 250, 58, "blanc-sur-cobalt")
    inner += HEAD(80, 420, 940, f"Combien d’avis<br>Google avez-vous<br>aujourd’hui {g('?')}", 96, WHITE)
    inner += R(130, 840, 820, 460, STRONG, 48)
    inner += I(390, 930, 300, "icons/stars-5-gold.svg")
    inner += T(130, 1030, 820, "Ajoutez ici le sticker Sondage", 32, 700, WHITE, 1.3, 0, "center")
    inner += T(130, 1085, 820, "Moins de 20 · 20 à 100 · Plus de 100", 28, 500, PALE, 1.35, 0, "center")
    inner += T(80, 1400, 920, "Demain en story : nos conseils pour en obtenir plus, sans forcer la main à vos clients.", 36, 600, WHITE, 1.4)
    ss.append(page(SW, SH, COBALT, inner, "Story 3 - Sondage"))

    # 4. Offre (blanc)
    inner = logo(80, 250, 58)
    inner += P(80, 350, 920, 680, "presentoir-angle.jpg", 48, "50% 45%")
    inner += HEAD(80, 1075, 940, f"29,90 €{g()}", 168, INK, 1.0, -0.045)
    inner += T(80, 1262, 900, "une seule fois, livraison offerte", 38, 600, MUTED, 1.3)
    inner += check_list(80, 1345, ["Sans abonnement", "Satisfait ou remboursé 30 jours", "iPhone et Android"], 32, INK, step=66, w=860)
    o, w = pill(80, 1560, "Commandez sur reviu.fr", 32, COBALT, WHITE, None, h=84, weight=700, pad=40)
    inner += o
    ss.append(page(SW, SH, WHITE, inner, "Story 4 - L’offre"))

    # 5. Outil gratuit (encre)
    inner = logo(80, 250, 58, "blanc-sur-encre")
    inner += HEAD(80, 400, 940, f"Votre QR code<br>d’avis Google,<br>gratuit{g()}", 124, WHITE)
    inner += T(80, 820, 880, "Générez-le en quelques secondes, prêt à imprimer. Sans inscription.", 38, 500, GRAY_DARK, 1.4)
    inner += R(240, 1000, 600, 440, "#161B29", 48)
    inner += I(420, 1080, 240, "icons/qr-cobalt.svg")
    inner += T(240, 1350, 600, "PNG, SVG et affiche", 28, 600, GRAY_DARK, 1.3, 0, "center")
    o, w = pill(0, 0, "reviu.fr/outils/qr-code-avis-google", 28, WHITE, INK, None, h=76, weight=700, pad=34)
    o, w = pill(round((1080 - w) / 2), 1540, "reviu.fr/outils/qr-code-avis-google", 28, WHITE, INK, None, h=76, weight=700, pad=34)
    inner += o
    ss.append(page(SW, SH, INK, inner, "Story 5 - Outil gratuit"))
    return ss

# ======================================================================
# BANNIÈRES
# ======================================================================
def banner_fb():
    W, Hh = 1640, 624
    inner = logo(290, 70, 48, "blanc-sur-cobalt")
    inner += HEAD(290, 162, 720, f"Plus d’avis Google,<br>directement depuis<br>votre comptoir{g()}", 70, WHITE)
    inner += T(290, 410, 700, "Le présentoir Reviu · 29,90 € une seule fois<br>Livraison offerte · Sans abonnement", 24, 600, PALE, 1.5)
    inner += P(1000, 72, 360, 480, "etape-3.jpg", 40, "42% 55%")
    inner += R(900, 452, 320, 80, WHITE, 40)
    inner += I(924, 479, 142, "icons/stars-5-gold.svg")
    inner += T(1080, 472, 130, "Nouvel avis", 22, 700, INK, 1.3)
    return doc([page(W, Hh, COBALT, inner, "Bannière Facebook")], "reviu - Bannière Facebook")

def banner_li():
    W, Hh = 1584, 396
    inner = HEAD(520, 92, 700, f"Plus d’avis Google,<br>directement depuis<br>votre comptoir{g()}", 54, WHITE)
    inner += T(520, 290, 720, "Le présentoir Reviu · reviu.fr", 24, 600, PALE, 1.4)
    inner += P(1230, 48, 300, 300, "etape-3.jpg", 32, "50% 55%")
    inner += logo(1300, 0, 1, "blanc-sur-cobalt") if False else ""
    return doc([page(W, Hh, COBALT, inner, "Bannière LinkedIn")], "reviu - Bannière LinkedIn")

# ======================================================================
# LOGO 1080 x 1080
# ======================================================================
def logo_doc():
    S = 1080
    lw = 780; lh = round(lw / LOGO_RATIO, 2)
    pg = []
    pg.append(page(S, S, WHITE, I((S - lw) / 2, (S - lh) / 2, lw, "logo/svg/reviu-logo-horizontal-couleur.svg"), "Logo principal"))
    pg.append(page(S, S, COBALT, I((S - lw) / 2, (S - lh) / 2, lw, "logo/svg/reviu-logo-horizontal-blanc-sur-cobalt.svg"), "Logo sur cobalt"))
    pg.append(page(S, S, INK, I((S - lw) / 2, (S - lh) / 2, lw, "logo/svg/reviu-logo-horizontal-blanc-sur-encre.svg"), "Logo sur encre"))
    vw = 520  # vertical: ratio from svg
    pg.append(page(S, S, BRUME, I((S - vw) / 2, 300, vw, "logo/svg/reviu-logo-vertical-couleur.svg"), "Logo vertical"))
    pg.append(page(S, S, PERLE, I(330, 330, 420, "logo/svg/reviu-monogramme-cobalt.svg"), "Monogramme"))
    pg.append(page(S, S, COBALT, I(0, 0, 1080, "logo/svg/reviu-avatar-reseaux.svg"), "Avatar réseaux sociaux"))
    return doc(pg, "reviu - Logo")

# ======================================================================
# CHARTE GRAPHIQUE 1920 x 1080
# ======================================================================
CW, CH = 1920, 1080

def foot(n, dark=False):
    col = PALE if dark else MUTED
    return T(120, 1010, 600, "reviu · Charte graphique", 20, 600, col, 1.3) + T(1600, 1010, 200, f"{n:02d}", 20, 700, col, 1.3, 0, "right")

def ctitle(txt, color=INK):
    return HEAD(120, 110, 1680, txt, 76, color)

def charte():
    pg = []
    # 1 Couverture
    inner = logo(120, 110, 72, "blanc-sur-cobalt")
    inner += I(1200, 250, 820, "logo/svg/reviu-monogramme-blanc.svg")
    inner += HEAD(120, 440, 1100, f"Charte<br>graphique{g()}", 190, WHITE, 0.98, -0.045)
    inner += T(120, 850, 900, "Identité visuelle, règles d’usage et gabarits pour les réseaux sociaux.", 34, 500, PALE, 1.4)
    inner += T(120, 1000, 600, "Version 1.0 · Septembre 2026", 22, 600, PALE, 1.3)
    pg.append(page(CW, CH, COBALT, inner, "Couverture"))

    # 2 Sommaire
    items = ["La marque", "Le logo", "Les déclinaisons", "Protection et tailles", "Usages à éviter", "Les couleurs",
             "La typographie", "La signature des titres", "Les éléments graphiques", "La photographie", "Le ton et le vocabulaire", "Les réseaux sociaux"]
    inner = ctitle(f"{c('Sommaire')}{g()}")
    for i, it in enumerate(items):
        col, row = divmod(i, 6)
        x, y = 120 + col * 860, 300 + row * 112
        inner += R(x, y, 800, 2, LINE)
        inner += T(x, y + 34, 80, f"{i + 3:02d}", 26, 800, COBALT, 1.3, -0.02)
        inner += T(x + 90, y + 26, 700, it, 40, 700, INK, 1.2, -0.02)
    inner += foot(2)
    pg.append(page(CW, CH, WHITE, inner, "Sommaire"))

    # 3 La marque
    inner = HEAD(120, 110, 1700, f"Plus d’avis Google, directement<br>depuis votre {c('comptoir')}{g()}", 84)
    cols = [("Mission", "Donner à chaque commerce de proximité un moyen simple de transformer ses clients satisfaits en avis Google."),
            ("Promesse", "Un présentoir posé sur le comptoir, un geste du client, et les avis arrivent. Sans application, sans abonnement."),
            ("Personnalité", "Simple, direct, fiable et chaleureux. Reviu parle comme un bon commerçant parle à ses clients.")]
    for i, (t, d) in enumerate(cols):
        x = 120 + i * 573
        inner += I(x, 385, 20, "icons/dot-gold.svg")
        inner += T(x + 34, 374, 480, t, 30, 800, INK, 1.3, -0.02)
        inner += T(x, 432, 500, d, 28, 500, SOFT, 1.5)
    inner += R(120, 700, 1680, 250, BRUME, 40)
    stats = [("29,90 €", "achat unique"), ("0 €", "d’abonnement"), ("30 jours", "satisfait ou remboursé"), ("1 geste", "sans contact ou QR code")]
    for i, (n, l) in enumerate(stats):
        x = 180 + i * 410
        inner += T(x, 752, 380, n, 72, 800, COBALT, 1.1, -0.04)
        inner += T(x, 850, 380, l, 26, 600, SOFT, 1.3)
    inner += foot(3)
    pg.append(page(CW, CH, WHITE, inner, "La marque"))

    # 4 Le logo
    inner = ctitle(f"Le {c('logo')}{g()}")
    inner += R(120, 270, 1040, 660, PERLE, 40)
    inner += I(640 - 360, 600 - 109, 720, "logo/svg/reviu-logo-horizontal-couleur.svg")
    parts = [("Le monogramme", "Le « r » de reviu, blanc dans un carré cobalt aux angles arrondis. Il vit aussi seul : icône d’application, favicon, avatar."),
             ("Le wordmark", "reviu s’écrit toujours en minuscules. Plus Jakarta Sans Bold, approche légèrement resserrée."),
             ("Le point doré", "Le point du i devient l’étoile de l’avis. C’est la seule touche d’or du logo, elle ne se retire pas.")]
    for i, (t, d) in enumerate(parts):
        y = 280 + i * 220
        inner += T(1240, y, 560, t, 36, 800, INK, 1.2, -0.02)
        inner += T(1240, y + 56, 560, d, 26, 500, SOFT, 1.5)
    inner += foot(4)
    pg.append(page(CW, CH, WHITE, inner, "Le logo"))

    # 5 Déclinaisons
    inner = ctitle(f"Les {c('déclinaisons')}{g()}")
    tiles = [("reviu-logo-horizontal-couleur", WHITE, "Principale, sur fond blanc ou clair", True),
             ("reviu-logo-horizontal-blanc-sur-cobalt", COBALT, "Sur fond cobalt", False),
             ("reviu-logo-horizontal-blanc-sur-encre", INK, "Sur fond sombre", False),
             ("reviu-logo-horizontal-noir", PERLE, "Monochrome noir : impression une couleur", False),
             ("reviu-logo-horizontal-blanc", "photo", "Monochrome blanc : sur photo, zone calme", False),
             ("reviu-logo-vertical-couleur", BRUME, "Verticale : formats carrés et étroits", False)]
    for i, (f, bg, cap, border) in enumerate(tiles):
        col, row = i % 3, i // 3
        x, y = 120 + col * 573, 270 + row * 360
        if bg == "photo":
            inner += P(x, y, 533, 270, "presentoir-comptoir.jpg", 32, "50% 30%")
            inner += R(x, y, 533, 270, INK, 32, opacity=0.45)
        else:
            inner += R(x, y, 533, 270, bg, 32, f"2px solid {LINE}" if border else None)
        if "vertical" in f:
            inner += I(x + 533 / 2 - 90, y + 38, 180, f"logo/svg/{f}.svg")
        else:
            inner += I(x + 533 / 2 - 170, y + 135 - 52, 340, f"logo/svg/{f}.svg")
        inner += T(x, y + 288, 533, cap, 22, 600, MUTED, 1.3)
    inner += foot(5)
    pg.append(page(CW, CH, WHITE, inner, "Les déclinaisons"))

    # 6 Protection et tailles
    inner = ctitle(f"Protection et {c('tailles')}{g()}")
    inner += R(120, 270, 1040, 660, PERLE, 40)
    lw = 560; lh = lw / LOGO_RATIO; X = lh / 2
    lx, ly = 640 - lw / 2, 600 - lh / 2
    inner += R(lx - X, ly - X, lw + 2 * X, lh + 2 * X, "transparent", 12, f"3px solid {COBALT}")
    inner += I(lx, ly, lw, "logo/svg/reviu-logo-horizontal-couleur.svg")
    for (qx, qy) in [(lx - X, ly - X), (lx + lw, ly - X), (lx - X, ly + lh), (lx + lw, ly + lh)]:
        inner += R(qx, qy, X, X, COBALT, 0, opacity=0.14)
        inner += T(qx, qy + X / 2 - 17, X, "x", 26, 700, COBALT, 1.3, 0, "center")
    inner += T(1240, 280, 560, "Zone de protection", 36, 800, INK, 1.2, -0.02)
    inner += T(1240, 336, 560, "Autour du logo, gardez un espace libre au moins égal à x, soit la moitié de la hauteur du monogramme. Aucun texte ni élément n’y entre.", 26, 500, SOFT, 1.5)
    inner += T(1240, 560, 560, "Tailles minimales", 36, 800, INK, 1.2, -0.02)
    inner += I(1240, 632, round(40 * LOGO_RATIO), "logo/svg/reviu-logo-horizontal-couleur.svg")
    inner += T(1240, 690, 560, "Logo horizontal : 24 px de haut à l’écran, 8 mm à l’impression.", 24, 500, SOFT, 1.45)
    inner += I(1240, 790, 44, "logo/svg/reviu-monogramme-cobalt.svg")
    inner += T(1310, 790, 490, "Monogramme seul : 16 px à l’écran, 5 mm à l’impression.", 24, 500, SOFT, 1.45)
    inner += foot(6)
    pg.append(page(CW, CH, WHITE, inner, "Protection et tailles"))

    # 7 À éviter
    inner = ctitle(f"Usages à {c('éviter')}{g()}")
    bad = [("interdit-deforme", PERLE, "Ne pas déformer ni étirer"),
           ("interdit-couleurs", PERLE, "Ne pas changer les couleurs"),
           ("interdit-incline", PERLE, "Ne pas incliner"),
           ("interdit-contour", PERLE, "Ne pas ajouter de contour ni d’effet"),
           ("interdit-recompose", PERLE, "Ne pas recomposer les éléments"),
           ("interdit-contraste", "#3D66FF", "Ne pas poser sur un fond peu contrasté")]
    for i, (f, bg, cap) in enumerate(bad):
        col, row = i % 3, i // 3
        x, y = 120 + col * 573, 270 + row * 360
        inner += R(x, y, 533, 270, bg, 32)
        wlogo = 300 if f != "interdit-deforme" else 360
        if f == "interdit-incline":
            wlogo = 300
        inner += I(x + 533 / 2 - wlogo / 2, y + 135 - 60, wlogo, f"icons/{f}.svg")
        inner += I(x + 533 - 62, y + 20, 42, "icons/cross-muted.svg")
        inner += T(x, y + 288, 533, cap, 22, 600, MUTED, 1.3)
    inner += foot(7)
    pg.append(page(CW, CH, WHITE, inner, "Usages à éviter"))

    # 8 Couleurs
    inner = ctitle(f"Les {c('couleurs')}{g()}")
    main = [("Cobalt Reviu", COBALT, "27 77 255", "89 70 0 0", WHITE, "Couleur de marque"),
            ("Encre", INK, "10 13 22", "55 41 0 91", WHITE, "Textes et fonds sombres"),
            ("Or des avis", GOLD, "251 188 4", "0 25 98 2", INK, "Accent : point, étoiles"),
            ("Blanc", WHITE, "255 255 255", "0 0 0 0", INK, "Respiration, fonds")]
    for i, (n, hx, rgb, cmyk, fg, use) in enumerate(main):
        x = 120 + i * 425
        inner += R(x, 250, 405, 380, hx, 32, f"2px solid {LINE}" if hx == WHITE else None)
        inner += T(x + 32, 282, 340, use, 22, 600, fg, 1.3)
        inner += T(x + 32, 470, 340, n, 34, 800, fg, 1.2, -0.02)
        inner += T(x + 32, 518, 340, f"HEX {hx}<br>RVB {rgb}<br>CMJN {cmyk}", 20, 600, fg, 1.5)
    sec = [("Cobalt profond", STRONG, WHITE, "Survol, profondeur"), ("Brume", BRUME, INK, "Fonds clairs de marque"),
           ("Perle", PERLE, INK, "Fonds neutres"), ("Ardoise", MUTED, WHITE, "Textes secondaires")]
    for i, (n, hx, fg, use) in enumerate(sec):
        x = 120 + i * 425
        inner += R(x, 652, 405, 130, hx, 28, f"2px solid {LINE}" if hx in (PERLE,) else None)
        inner += T(x + 28, 676, 360, n, 26, 800, fg, 1.2, -0.02)
        inner += T(x + 28, 716, 360, f"{hx} · {use}", 20, 600, fg, 1.4)
    inner += T(120, 822, 800, "Répartition conseillée", 24, 800, INK, 1.3, -0.01)
    segs = [(WHITE, 0.50, "Blanc, brume, perle 50 %"), (COBALT, 0.28, "Cobalt 28 %"), (INK, 0.17, "Encre 17 %"), (GOLD, 0.05, "Or 5 %")]
    x = 120
    inner += R(120, 866, 1680, 56, WHITE, 28, f"2px solid {LINE}")
    for col, p, lab in segs:
        w = 1680 * p
        if col != WHITE:
            inner += R(x, 866, w, 56, col, 28 if col == GOLD else 0)
        inner += T(x + (0 if col == WHITE else 0), 936, max(w, 200), lab, 20, 600, MUTED, 1.3)
        x += w
    inner += foot(8)
    pg.append(page(CW, CH, WHITE, inner, "Les couleurs"))

    # 9 Typographie
    inner = ctitle(f"La {c('typographie')}{g()}")
    inner += R(120, 250, 820, 410, PERLE, 36)
    inner += I(160, 290, 250, "icons/specimen-pjs-aa.svg")
    inner += I(440, 306, 440, "icons/specimen-pjs-nom.svg")
    inner += T(440, 392, 460, "Police d’identité : logo, site web et documents imprimés. Gratuite sur Google Fonts.", 22, 500, SOFT, 1.5)
    inner += I(160, 580, 700, "icons/specimen-pjs-alphabet.svg")
    inner += R(980, 250, 820, 410, BRUME, 36)
    inner += T(1016, 318, 270, "Aa", 196, 800, INK, 1.0, -0.04)
    inner += T(1300, 300, 460, "Inter", 64, 800, INK, 1.1, -0.03)
    inner += T(1300, 392, 460, "Police des visuels créés dans Canva : réseaux sociaux, affiches, présentations. Gratuite dans Canva.", 22, 500, SOFT, 1.5)
    inner += T(1020, 580, 740, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", 30, 600, SOFT, 1.3, 0.02)
    rows = [("Titre", f"Plus d’avis{g()}", 56, 800, -0.03, "Inter ExtraBold 800 · interlettrage -3 %"),
            ("Sous-titre", "Votre comptoir", 38, 700, -0.02, "Inter Bold 700 · interlettrage -2 %"),
            ("Texte", "Le client approche son téléphone.", 24, 500, 0, "Inter Medium 500 · interligne 1,4"),
            ("Étiquette", "Commander", 24, 600, 0, "Inter SemiBold 600 · boutons, pastilles")]
    for i, (lab, sample, sz, wt, ls, spec) in enumerate(rows):
        x = 120 + i * 430
        inner += R(x, 700, 390, 2, LINE)
        inner += T(x, 724, 390, lab, 20, 800, COBALT, 1.3)
        if lab == "Étiquette":
            o, _ = pill(x, 772, sample, 24, COBALT, WHITE, None, h=60, weight=600, pad=28)
            inner += o
        else:
            inner += T(x, 770, 400, sample, sz, wt, INK, 1.2, ls)
        inner += T(x, 870, 390, spec, 18, 600, MUTED, 1.4)
    inner += T(120, 950, 1680, "Sur le site web, le texte courant de l’interface utilise Geist. Dans Canva, tout le texte est en Inter.", 20, 600, MUTED, 1.4)
    inner += foot(9)
    pg.append(page(CW, CH, WHITE, inner, "La typographie"))

    # 10 Signature des titres
    inner = ctitle(f"La signature des {c('titres')}{g()}")
    inner += R(120, 260, 1060, 480, WHITE, 40)
    inner += HEAD(190, 330, 940, f"Vos avis Google,<br>enfin au {c('comptoir')}{g()}", 104)
    inner += T(190, 610, 900, "Dernier mot en cobalt, point final en or.", 26, 600, MUTED, 1.3)
    inner += R(120, 770, 1060, 190, INK, 40)
    inner += HEAD(190, 820, 940, f"Google ne le sait pas encore{g()}", 60, WHITE)
    inner += T(190, 900, 900, "Sur fond cobalt ou sombre : titre en blanc, seul le point reste doré.", 22, 600, GRAY_DARK, 1.3)
    rules = ["Le dernier mot du titre passe en cobalt.", "Le point final est doré : c’est la signature Reviu.",
             "Aucun sur-titre au-dessus du titre.", "Des phrases courtes, lisibles d’un coup d’œil.", "Pas de tiret long : un tiret simple ou deux-points."]
    for i, r_ in enumerate(rules):
        y = 280 + i * 136
        inner += R(1260, y, 56, 56, COBALT, 18)
        inner += T(1260, y + 9, 56, str(i + 1), 28, 800, WHITE, 1.3, 0, "center")
        inner += T(1344, y + 4, 460, r_, 26, 600, INK, 1.4)
    inner += foot(10)
    pg.append(page(CW, CH, BRUME, inner, "La signature des titres"))

    # 11 Éléments graphiques
    inner = ctitle(f"Les éléments {c('graphiques')}{g()}")
    blocks = [("Le point doré", "Il ponctue les titres et signale ce qui compte. Une seule fois par visuel, jamais en décoration."),
              ("Les cinq étoiles", "Réservées à l’univers de l’avis : note, satisfaction, témoignage. Toujours en or."),
              ("Les angles arrondis", "Tout est arrondi : 32 % du côté pour les pictogrammes, 40 à 48 px pour les cartes et photos."),
              ("Pictogrammes et pastilles", "Pictogrammes blancs dans un carré cobalt. Pastilles blanches et coche cobalt pour les réassurances.")]
    for i, (t, d) in enumerate(blocks):
        col, row = i % 2, i // 2
        x, y = 120 + col * 860, 250 + row * 370
        inner += R(x, y, 820, 340, PERLE, 36)
        vx, vy = x + 40, y + 40
        if i == 0:
            inner += I(vx + 60, vy + 70, 120, "icons/dot-gold.svg")
        elif i == 1:
            inner += I(vx, vy + 100, 250, "icons/stars-5-gold.svg")
        elif i == 2:
            inner += R(vx, vy + 20, 150, 150, COBALT, 49)
            inner += I(vx + 30, vy + 50, 90, "icons/star-badge-cobalt.svg") if False else ""
            inner += P(vx + 90, vy + 110, 170, 150, "etape-3.jpg", 28, "50% 55%")
        else:
            for k, ic in enumerate(["nfc-cobalt", "qr-cobalt", "phone-cobalt", "star-badge-cobalt"]):
                inner += I(vx + (k % 2) * 110, vy + (k // 2) * 110 + 20, 90, f"icons/{ic}.svg")
        inner += T(x + 330, y + 50, 450, t, 34, 800, INK, 1.2, -0.02)
        inner += T(x + 330, y + 106, 450, d, 24, 500, SOFT, 1.5)
        if i == 3:
            o, _ = pill(x + 330, y + 250, "Sans abonnement", 22, WHITE, INK)
            inner += o
    inner += foot(11)
    pg.append(page(CW, CH, WHITE, inner, "Les éléments graphiques"))

    # 12 Photographie
    inner = ctitle(f"La {c('photographie')}{g()}")
    for i, (f, pos) in enumerate([("etape-3.jpg", "50% 55%"), ("presentoir-comptoir.jpg", "50% 45%"), ("etape-1.jpg", "50% 50%")]):
        inner += P(120 + i * 573, 250, 533, 400, f, 36, pos)
    inner += T(120, 700, 800, "À faire", 32, 800, INK, 1.2, -0.02)
    inner += check_list(120, 764, ["Situations réelles : comptoir, accueil, téléphone en main.",
                                   "Lumière naturelle, tons chauds et neutres.",
                                   "Le présentoir net et lisible, QR code visible."], 24, SOFT, step=62, w=740, weight=500)
    inner += T(980, 700, 800, "À éviter", 32, 800, INK, 1.2, -0.02)
    inner += check_list(980, 764, ["Images de banque génériques et trop mises en scène.",
                                   "Filtres saturés, fonds violets, dégradés.",
                                   "Produit flou, coupé ou illisible."], 24, SOFT, icon="icons/cross-muted.svg", step=62, w=740, weight=500)
    inner += foot(12)
    pg.append(page(CW, CH, WHITE, inner, "La photographie"))

    # 13 Ton et vocabulaire
    inner = ctitle(f"Le ton et le {c('vocabulaire')}{g()}")
    tones = [("Clair", "Une idée par phrase, des mots de tous les jours."),
             ("Concret", "Des gestes, des prix, des résultats. Pas de jargon."),
             ("Honnête", "Reviu ne filtre pas les avis, et le dit."),
             ("Proche", "On vouvoie, on reste chaleureux et direct.")]
    for i, (t, d) in enumerate(tones):
        y = 260 + i * 172
        inner += T(120, y, 700, f"{t}{g()}", 44, 800, INK, 1.1, -0.03)
        inner += T(120, y + 62, 700, d, 24, 500, SOFT, 1.45)
    inner += R(900, 250, 900, 700, PERLE, 36)
    inner += I(950, 294, 36, "icons/check-cobalt.svg")
    inner += T(1000, 292, 360, "On dit", 26, 800, INK, 1.3)
    inner += I(1370, 294, 36, "icons/cross-muted.svg")
    inner += T(1420, 292, 360, "On évite", 26, 800, INK, 1.3)
    pairs = [("Le présentoir Reviu", "présentoir NFC + QR, plaque, borne"),
             ("Sans contact ou QR code", "puce NFC, encodage, redirection"),
             ("29,90 € une seule fois", "offre exceptionnelle, prix choc"),
             ("Vous", "tu"),
             ("Plus d’avis, plus de clients", "révolutionnaire, n°1, magique")]
    for i, (a, b) in enumerate(pairs):
        y = 370 + i * 112
        inner += R(950, y, 800, 2, LINE)
        inner += T(950, y + 28, 390, a, 26, 700, INK, 1.35)
        inner += T(1370, y + 28, 380, b, 26, 500, MUTED, 1.35)
    inner += foot(13)
    pg.append(page(CW, CH, WHITE, inner, "Le ton et le vocabulaire"))

    # 14 Réseaux sociaux
    inner = HEAD(120, 100, 1680, f"Les {c('réseaux sociaux')}{g()}", 76)
    for i in range(5):
        inner += P(120 + i * 272, 230, 248, 310, f"apercus/post-{i + 1}.jpg", 18)
    for i in range(5):
        inner += P(120 + i * 272, 580, 200, 356, f"apercus/story-{i + 1}.jpg", 18)
    rules = ["Posts : 1080 × 1350 px, marges de 80 px.",
             "Stories : 1080 × 1920 px, rien d’important dans les 250 px du haut et du bas.",
             "Logo en haut à gauche, reviu.fr en haut à droite.",
             "Alterner les fonds : blanc, brume, cobalt, encre.",
             "Une photo réelle du présentoir dans un visuel sur deux.",
             "Texte en Inter : titres ExtraBold, texte Medium."]
    for i, r_ in enumerate(rules):
        y = 240 + i * 124
        inner += I(1520, y + 4, 30, "icons/dot-gold.svg") if False else ""
        inner += R(1500, y, 300, 2, LINE)
        inner += T(1500, y + 18, 300, r_, 22, 600, INK, 1.45)
    inner += foot(14)
    pg.append(page(CW, CH, BRUME, inner, "Les réseaux sociaux"))

    # 15 Contact
    inner = I(960 - 330, 330, 660, "logo/svg/reviu-logo-horizontal-blanc-sur-cobalt.svg")
    inner += T(160, 620, 1600, f"Plus d’avis Google, directement depuis votre comptoir{g()}", 46, 800, WHITE, 1.25, -0.02, "center")
    inner += T(160, 720, 1600, "reviu.fr · contact@reviu.fr · 07 81 98 30 42", 28, 600, PALE, 1.4, 0, "center")
    pg.append(page(CW, CH, COBALT, inner, "Contact"))
    return doc(pg, "reviu - Charte graphique")

if __name__ == "__main__":
    out = "site/canva" if MODE == "local" else sys.argv[3]
    import os; os.makedirs(out, exist_ok=True)
    open(f"{out}/posts-instagram.html", "w").write(doc(posts(), "reviu - Posts Instagram"))
    open(f"{out}/stories-instagram.html", "w").write(doc(stories(), "reviu - Stories Instagram"))
    open(f"{out}/banniere-facebook.html", "w").write(banner_fb())
    open(f"{out}/banniere-linkedin.html", "w").write(banner_li())
    open(f"{out}/logo.html", "w").write(logo_doc())
    open(f"{out}/charte-graphique.html", "w").write(charte())
    print("ok", out)
    for w_ in WARN:
        print("TROP LARGE", w_)
