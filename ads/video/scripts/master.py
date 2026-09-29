"""Mastering des exports pour les regies (TikTok, Meta).

Pour chaque out/<id>.mp4 : video H.264 High, yuv420p plage limitee, BT.709,
CRF 14 (aplats nets apres recompression des plateformes), 30 i/s constants ;
audio AAC 48 kHz 192 kbit/s normalise a -14 LUFS (crete vraie -2 dBTP,
normalisation en 2 passes) ; moov en tete (+faststart). Sortie : renders/.
Usage : python3 scripts/master.py [id1 id2 ...]   (defaut : tous les out/Reviu-*.mp4)
"""
import glob, json, os, re, subprocess, sys
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs("renders", exist_ok=True)
ids = sys.argv[1:] or [os.path.basename(p)[:-4] for p in sorted(glob.glob("out/Reviu-*.mp4"))]

for vid in ids:
    src, dst = f"out/{vid}.mp4", f"renders/{vid}.mp4"
    probe = subprocess.run(
        [FF, "-hide_banner", "-nostats", "-i", src, "-af", "loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", probe, re.S).group(0))
    af = (
        "loudnorm=I=-14:TP=-2.0:LRA=11:linear=true"
        f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']},aresample=48000"
    )
    cmd = [
        FF, "-y", "-hide_banner", "-loglevel", "error", "-i", src,
        "-vf", "scale=in_range=pc:out_range=tv,format=yuv420p",
        "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-tune", "animation",
        "-profile:v", "high", "-level", "4.2", "-r", "30", "-g", "60",
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
        "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
        "-movflags", "+faststart", dst,
    ]
    subprocess.run(cmd, check=True)
    out = subprocess.run(
        [FF, "-hide_banner", "-nostats", "-i", dst, "-filter_complex", "ebur128=peak=true", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", out)[-1]
    tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", out)[-1]
    size = os.path.getsize(dst) / 1e6
    print(f"{dst} : {size:.1f} Mo, {lufs} LUFS, crete vraie {tp} dBTP")
    png = f"out/{vid}.png"
    if os.path.exists(png):
        subprocess.run([FF, "-y", "-loglevel", "error", "-i", png, "-q:v", "3", f"renders/{vid}.jpg"], check=True)
