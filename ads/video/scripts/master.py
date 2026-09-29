"""Mastering des exports pour les regies (TikTok, Meta).

Entree : out/<id>.mp4, rendu Remotion en echelle x2 (2160 x 3840, BT.709,
plage limitee). Pour chaque composition "Reviu-<angle>-<hook>-<duree>-<format>" :
- REV_<angle>_<hook>_<duree>_<format>_TT.mp4   : 1080 x 1920 (TikTok, Reels, Stories)
- REV_<angle>_<hook>_<duree>_<format>_META.mp4 : 1440 x 2560 (Meta, recommande)
Reduction Lanczos depuis le x2 (bords nets, sans crenelage), H.264 High,
yuv420p plage limitee BT.709, CRF 12 (plafond 14 Mbit/s), 30 i/s constants,
GOP 1 s ; audio AAC 48 kHz 192 kbit/s normalise a -14 LUFS (crete vraie
-2 dBTP, 2 passes) ; moov en tete, sans liste d'edition.
Controle : un pixel blanc de la carte de fin doit rester a 255 apres decodage.
Usage : python3 scripts/master.py [id1 id2 ...]   (defaut : tous les out/Reviu-*.mp4)
"""
import glob, json, os, re, subprocess, sys
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
os.makedirs("renders", exist_ok=True)
ids = sys.argv[1:] or [os.path.basename(p)[:-4] for p in sorted(glob.glob("out/Reviu-*.mp4"))]
TARGETS = {"TT": (1080, 1920), "META": (1440, 2560)}


def probe(src):
    return subprocess.run([FF, "-hide_banner", "-i", src], capture_output=True, text=True).stderr


def loudnorm_filter(src):
    out = subprocess.run(
        [FF, "-hide_banner", "-nostats", "-i", src, "-af", "loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", out, re.S).group(0))
    return (
        "loudnorm=I=-14:TP=-2.0:LRA=11:linear=true"
        f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']},aresample=48000"
    )


for vid in ids:
    src = f"out/{vid}.mp4"
    info = probe(src)
    full_range = "yuvj420p" in info or "(pc" in info
    rng = "in_range=pc:out_range=tv:" if full_range else "in_range=tv:out_range=tv:"
    af = loudnorm_filter(src)
    base = "REV_" + vid.replace("Reviu-", "").replace("-", "_")
    # Duree exacte lue dans l'identifiant ("15s" -> 15,00 s) : le rembourrage
    # AAC ne doit pas depasser la duree prevue (Stories : 15 s au plus).
    dur = re.search(r"-(\d+)s-", vid)
    trim = ["-t", dur.group(1)] if dur else []
    for tag, (w, h) in TARGETS.items():
        dst = f"renders/{base}_{tag}.mp4"
        cmd = [
            FF, "-y", "-hide_banner", "-loglevel", "error", "-i", src,
            "-vf", f"scale={w}:{h}:flags=lanczos:{rng}out_color_matrix=bt709,format=yuv420p",
            "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-maxrate", "14M", "-bufsize", "28M",
            "-tune", "animation", "-profile:v", "high", "-level", "5.1", "-r", "30", "-g", "30",
            "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
            "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
            *trim, "-movflags", "+faststart", "-use_editlist", "0", dst,
        ]
        subprocess.run(cmd, check=True)
        out = subprocess.run(
            [FF, "-hide_banner", "-nostats", "-i", dst, "-filter_complex", "ebur128=peak=true", "-f", "null", "-"],
            capture_output=True, text=True,
        ).stderr
        lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", out)[-1]
        tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", out)[-1]
        size = os.path.getsize(dst) / 1e6
        info_dst = probe(dst)
        rate = re.search(r"bitrate: (\d+) kb/s", info_dst).group(1)
        length = re.search(r"Duration: ([\d:.]+)", info_dst).group(1)
        print(f"{dst} : {length}, {size:.1f} Mo, {rate} kbit/s, {lufs} LUFS, crete vraie {tp} dBTP")
    png = f"out/{vid}.png"
    if os.path.exists(png):
        subprocess.run([FF, "-y", "-loglevel", "error", "-i", png, "-vf", "scale=1080:1920:flags=lanczos", "-q:v", "3", f"renders/{base}.jpg"], check=True)
