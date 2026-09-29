"""Detoure la photo produit fournie (face du Presentoir Reviu) en PNG transparent.

La face est un rectangle aux angles arrondis mesure sur la photo d'origine
(bords du bleu, ligne d'ombre au pied) : on applique un masque vectoriel
antialiase plutot qu'un detourage automatique, pour un bord net et fidele.
Sortie : public/img/presentoir-face.png (face seule) et
public/img/presentoir-face-2x.png (agrandie x2 pour les gros plans).
"""
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SRC = "assets-src/presentoir-face.webp"
# Mesures (pixels de la photo 1254 x 1254) : voir la note du commit.
LEFT, TOP, RIGHT, BOTTOM = 203.0, 181.5, 1053.0, 1082.5
RADIUS = 95.0
SS = 8  # sur-echantillonnage du masque pour l'antialiasing

im = Image.open(SRC).convert("RGB")
W, H = im.size
mask_big = Image.new("L", (W * SS, H * SS), 0)
d = ImageDraw.Draw(mask_big)
inset = 0.6  # retire le liseré de fond gris
d.rounded_rectangle(
    [(LEFT + inset) * SS, (TOP + inset) * SS, (RIGHT - inset) * SS, (BOTTOM - inset) * SS],
    radius=RADIUS * SS,
    fill=255,
)
mask = mask_big.resize((W, H), Image.LANCZOS)
rgba = im.copy()
rgba.putalpha(mask)
box = (int(LEFT) - 1, int(TOP) - 1, int(np.ceil(RIGHT)) + 1, int(np.ceil(BOTTOM)) + 1)
face = rgba.crop(box)
face.save("public/img/presentoir-face.png", optimize=True)
face2 = face.resize((face.width * 2, face.height * 2), Image.LANCZOS)
# Leger renforcement de la nettete apres agrandissement (texte et QR code).
rgb2 = face2.convert("RGB").filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
rgb2.putalpha(face2.getchannel("A"))
rgb2.save("public/img/presentoir-face-2x.png", optimize=True)
print("face", face.size, "2x", face2.size)

# Texture de tranche (epaisseur 3D) et masque de forme : voir src/components/Presentoir3D.tsx.
from PIL import ImageEnhance
a = face.getchannel("A")
edge = ImageEnhance.Color(ImageEnhance.Brightness(face.convert("RGB")).enhance(0.62)).enhance(1.15)
edge = edge.resize((face.width // 2, face.height // 2), Image.LANCZOS)
edge.putalpha(a.resize(edge.size, Image.LANCZOS))
edge.save("public/img/presentoir-edge.png", optimize=True)
m = Image.new("RGBA", face.size, (255, 255, 255, 0))
m.putalpha(a)
m.resize((face.width // 2, face.height // 2), Image.LANCZOS).save("public/img/presentoir-mask.png", optimize=True)
