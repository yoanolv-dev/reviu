"""Contrôle technique des WAV générés.

Usage : python3 scripts/audio/verify.py fichier.wav [...] [--spectrogram sortie.png]

Pour chaque fichier : en-tête (48 kHz, 16 bits, stéréo), relecture par ffmpeg,
durée, crête (dBFS), crête vraie x4 (dBTP), RMS, loudness intégrée (LUFS),
offset continu, échantillons saturés, premier/dernier échantillon, silence de
tête, centroïde spectral, fréquence dominante, corrélation G/D.
Code de sortie 1 si un contrôle échoue.
"""
import os
import subprocess
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import SR, lin_to_db, lufs, true_peak  # noqa: E402


def ffmpeg_exe():
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:  # pragma: no cover
        return "ffmpeg"


def ffmpeg_probe(path):
    """Décode tout le fichier avec ffmpeg : renvoie (description du flux, erreurs)."""
    exe = ffmpeg_exe()
    p = subprocess.run([exe, "-hide_banner", "-v", "error", "-i", path, "-f", "null", "-"],
                       capture_output=True, text=True)
    info = subprocess.run([exe, "-hide_banner", "-i", path], capture_output=True, text=True).stderr
    stream = next((ln.strip() for ln in info.splitlines() if "Audio:" in ln), "?")
    return stream, (p.stderr.strip() or ("code %d" % p.returncode if p.returncode else ""))


def analyse(path):
    ok = True
    problems = []
    sr, q = wavfile.read(path)
    if sr != SR or q.dtype != np.int16 or q.ndim != 2 or q.shape[1] != 2:
        problems.append(f"format inattendu sr={sr} dtype={q.dtype} shape={q.shape}")
    x = q.astype(float) / 32768.0
    n = len(x)
    stream, err = ffmpeg_probe(path)
    if err:
        problems.append("ffmpeg: " + err)
    if not np.all(np.isfinite(x)):
        problems.append("NaN/Inf")
    peak = float(np.max(np.abs(x)))
    tp = true_peak(x)
    rms = float(np.sqrt(np.mean(x ** 2)))
    loud = lufs(x)
    dc = np.abs(x.mean(axis=0)).max()
    clipped = int(np.sum((q >= 32767) | (q <= -32768)))
    first = int(np.max(np.abs(q[0])))
    last = int(np.max(np.abs(q[-1])))
    mono = x.mean(axis=1)
    thr = peak * 10 ** (-40 / 20)
    lead = int(np.argmax(np.abs(x).max(axis=1) >= thr)) / SR
    f, pxx = signal.welch(mono, SR, nperseg=min(8192, max(256, n // 4)))
    centroid = float(np.sum(f * pxx) / np.sum(pxx))
    dominant = float(f[np.argmax(pxx)])
    hf = float(10 * np.log10(np.sum(pxx[f > 16000]) / np.sum(pxx) + 1e-20))
    l, r = x[:, 0], x[:, 1]
    corr = float(np.sum(l * r) / (np.sqrt(np.sum(l * l) * np.sum(r * r)) + 1e-20))
    if clipped:
        problems.append(f"{clipped} échantillons saturés")
    if tp > 10 ** (-1.0 / 20):
        problems.append(f"crête vraie trop haute ({lin_to_db(tp):.2f} dBTP)")
    if dc > 10 ** (-60 / 20):
        problems.append(f"offset continu {lin_to_db(dc):.1f} dBFS")
    if first > 4 or last > 4:
        problems.append(f"bords non nuls (premier {first}, dernier {last} LSB)")
    if problems:
        ok = False
    print(f"\n{os.path.basename(path)}  [{stream}]")
    print(f"  durée {n / SR:.4f} s ({n} éch.)  crête {lin_to_db(peak):6.2f} dBFS  crête vraie "
          f"{lin_to_db(tp):6.2f} dBTP  RMS {lin_to_db(rms):6.2f} dBFS  loudness {loud:6.2f} LUFS")
    print(f"  DC {lin_to_db(dc):6.1f} dBFS  saturés {clipped}  bords {first}/{last} LSB  "
          f"silence de tête {lead * 1000:.2f} ms  centroïde {centroid:6.0f} Hz  "
          f"dominante {dominant:6.0f} Hz  >16k {hf:6.1f} dB  corr G/D {corr:+.2f}")
    print("  OK" if ok else "  PROBLÈMES : " + " ; ".join(problems))
    return ok


def spectrogram(path, png, bar_s=None):
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    sr, q = wavfile.read(path)
    mono = q.astype(float).mean(axis=1) / 32768.0
    f, t, s = signal.spectrogram(mono, sr, nperseg=4096, noverlap=3072, window="hann")
    sdb = 10 * np.log10(s + 1e-14)
    fig, ax = plt.subplots(2, 1, figsize=(16, 9), gridspec_kw={"height_ratios": [3, 1]}, sharex=True)
    ax[0].pcolormesh(t, f, sdb, shading="auto", vmin=sdb.max() - 90, vmax=sdb.max(), cmap="magma")
    ax[0].set_yscale("symlog", linthresh=200)
    ax[0].set_ylim(20, sr / 2)
    ax[0].set_ylabel("Hz")
    ax[0].set_title(os.path.basename(path))
    hop = sr // 20
    env = [20 * np.log10(np.sqrt(np.mean(mono[i:i + hop] ** 2)) + 1e-9) for i in range(0, len(mono), hop)]
    ax[1].plot(np.arange(len(env)) * hop / sr, env)
    ax[1].set_ylim(-60, 0)
    ax[1].set_ylabel("RMS dBFS (50 ms)")
    ax[1].set_xlabel("s")
    if bar_s:
        for a in ax:
            for b in np.arange(0, len(mono) / sr, bar_s):
                a.axvline(b, color="c", lw=0.5, alpha=0.6)
    fig.tight_layout()
    fig.savefig(png, dpi=90)
    print("spectrogramme :", png)


if __name__ == "__main__":
    args = sys.argv[1:]
    png = None
    if "--spectrogram" in args:
        i = args.index("--spectrogram")
        png = args[i + 1]
        del args[i:i + 2]
    results = [analyse(p) for p in args]
    if png and args:
        spectrogram(args[-1], png, bar_s=2.0)
    print(f"\n{sum(results)}/{len(results)} fichiers OK")
    sys.exit(0 if all(results) else 1)
