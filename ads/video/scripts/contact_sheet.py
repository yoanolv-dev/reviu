"""Planche contact : python3 contact_sheet.py sortie.jpg colonnes image1 image2 ..."""
import sys, re
from PIL import Image, ImageDraw, ImageFont

out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
W, H = 360, 640
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 28)), "white")
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((W, H), Image.LANCZOS)
    x, y = (i % cols) * W, (i // cols) * (H + 28)
    sheet.paste(im, (x, y + 28))
    m = re.search(r"f(\d+)", f)
    d.text((x + 8, y + 6), f"frame {int(m.group(1)) if m else i}", fill="black")
sheet.save(out, quality=88)
print(out)
