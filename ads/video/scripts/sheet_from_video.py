"""Planche contact depuis une video : python3 sheet_from_video.py video.mp4 debut fin pas sortie.jpg [colonnes]
(frames a 30 i/s)."""
import subprocess, sys, tempfile, os, glob
import imageio_ffmpeg
from PIL import Image, ImageDraw

video, a, b, step, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 8
FF = imageio_ffmpeg.get_ffmpeg_exe()
tmp = tempfile.mkdtemp()
frames = list(range(a, b + 1, step))
sel = "+".join(f"eq(n\\,{f})" for f in frames)
subprocess.run([FF, "-loglevel", "error", "-i", video, "-vf", f"select='{sel}',scale=270:480", "-vsync", "0", f"{tmp}/%04d.png"], check=True)
files = sorted(glob.glob(f"{tmp}/*.png"))
W, H = 270, 480
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 22)), "white")
d = ImageDraw.Draw(sheet)
for i, (f, n) in enumerate(zip(files, frames)):
    x, y = (i % cols) * W, (i // cols) * (H + 22)
    sheet.paste(Image.open(f).convert("RGB"), (x, y + 22))
    d.text((x + 6, y + 5), f"{n}", fill="black")
sheet.save(out, quality=85)
print(out, len(files))
