"""Variante de secours de la face : le logo Google imprime est floute.

Certaines regies (TikTok) refusent les logos de marques tierces sans
autorisation. Cette variante garde le produit identique, logo floute, pour
une declinaison de la pub si elle est refusee. A lancer apres neutral_qr.py.
Sorties : public/img/presentoir-face-gflou.png et presentoir-face-gflou-2x.png.
"""
from PIL import Image, ImageDraw, ImageFilter

# Cercle blanc du logo sur la face 852 x 904 (centre, rayon).
CX, CY, R = 428.0, 161.0, 100.0

for src, dst, k in [
    ("public/img/presentoir-face.png", "public/img/presentoir-face-gflou.png", 1),
    ("public/img/presentoir-face-2x.png", "public/img/presentoir-face-gflou-2x.png", 2),
]:
    im = Image.open(src).convert("RGBA")
    blurred = im.filter(ImageFilter.GaussianBlur(14 * k))
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).ellipse([(CX - R) * k, (CY - R) * k, (CX + R) * k, (CY + R) * k], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(6 * k))
    out = Image.composite(blurred, im, mask)
    out.putalpha(im.getchannel("A"))
    out.save(dst, optimize=True)
    print(dst, out.size)
