"""Génère les effets sonores de la vidéo Reviu (synthèse pure, aucun échantillon).

Usage : python3 scripts/audio/sfx.py [dossier_sortie]
Sortie par défaut : public/audio/sfx/*.wav + manifest.json

Chaque fichier : WAV PCM 16 bits, stéréo, 48 kHz, sans silence de tête (le son
commence à l'échantillon 0), fondu d'entrée de 1 à 2 ms, fondu de sortie,
crête à -3 dBFS (impact : -1.5 dBFS). Le manifeste donne pour chaque son sa
durée et son "hit_s" : l'instant perceptif (attaque ou crête d'énergie) à
caler sur l'événement visuel. Dans Remotion, pour que le hit tombe sur la frame
F à 30 i/s, démarrer le son à la frame F - hit_s * 30.
"""
import json
import zlib
import os
import sys

import numpy as np
from scipy.ndimage import uniform_filter1d

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, attack_env, butter, convolve, exp_interp, fade,  # noqa: E402
                 lin_to_db, lufs, n_samples, normalize_peak, note_freq, pan,
                 reverb_ir, smoothstep, svf, time_axis, to_stereo,
                 trim_leading, write_wav)

SFX_TARGET_LUFS = -14.0
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_OUT = os.path.join(ROOT, "public", "audio", "sfx")


def rms(x):
    return float(np.sqrt(np.mean(np.square(x)))) + 1e-12


def unit(x):
    """Normalise une couche à RMS 1 (pour doser les couches entre elles)."""
    return x / rms(x)


def peak1(x):
    return x / (np.max(np.abs(x)) + 1e-12)


def sweep_phase(freq):
    """Phase d'un oscillateur à fréquence variable, qui vaut 0 à t = 0."""
    return 2.0 * np.pi * (np.cumsum(freq) - freq[0]) / SR


def add_room(x, wet, rt60=0.5, seed=5):
    """Petite pièce synthétique pour arrondir les sons tonals (même longueur)."""
    ir = reverb_ir(rt60=rt60, predelay=0.008, damp_start=8000, damp_end=2500, seed=seed)
    w = convolve(to_stereo(x), ir)[: len(x)]
    return to_stereo(x) + wet * w


# ------------------------------------------------------------------ whooshes

def whoosh_core(dur, tp, f_start, f_peak, f_end, q, pan_from, pan_to,
                body, air, whistle, seed):
    """Bruit passe-bande dont le centre monte puis redescend (effet de passage),
    enveloppe en cloche avec crête à tp, panoramique gauche -> droite."""
    rng = np.random.default_rng(seed)
    n = n_samples(dur)
    t = time_axis(n)
    rise = t < tp
    ur = t / tp
    uf = (t - tp) / (dur - tp)
    shape = np.where(rise, 0.5 - 0.5 * np.cos(np.pi * ur), 0.5 + 0.5 * np.cos(np.pi * uf))
    # petit plancher au départ (-32 dB) : le son démarre à l'échantillon 0
    env = np.where(rise, 0.025 + 0.975 * shape ** 1.3, shape ** 1.6)
    fc = np.where(rise, exp_interp(f_start, f_peak, smoothstep(ur)),
                  exp_interp(f_peak, f_end, smoothstep(uf)))

    main = unit(svf(rng.standard_normal(n), fc, q, "bp"))
    whis = unit(svf(rng.standard_normal(n), fc * 1.6, 3.0, "bp"))
    low = unit(svf(rng.standard_normal(n), np.maximum(fc * 0.22, 140.0), 0.7, "lp"))
    mono = (main + whistle * whis + body * low) * env
    pos = pan_from + (pan_to - pan_from) * smoothstep(t / dur)
    x = pan(mono, pos)
    # couche d'air décorrélée G/D pour la largeur, très discrète
    airl = unit(butter(rng.standard_normal((n, 2)), "high", 5500, 2)) * (env ** 2)[:, None]
    x = x + air * airl
    return butter(x, "low", 11000, 2)


def make_whoosh():
    # Crête d'énergie vers 0.19 s (mesurée et écrite dans manifest.json : hit_s).
    x = whoosh_core(dur=0.45, tp=0.20, f_start=350, f_peak=2600, f_end=650,
                    q=1.1, pan_from=-0.7, pan_to=0.7, body=0.5, air=0.15,
                    whistle=0.3, seed=11)
    return x, dict(desc="Passage d'air, balayage de filtre montant puis descendant, "
                        "panoramique gauche vers droite. Transitions de scènes.",
                   hit="env_peak", search=(0.08, 0.35), fade_out=0.03, win=0.02)


def make_whoosh_short():
    x = whoosh_core(dur=0.22, tp=0.09, f_start=900, f_peak=4200, f_end=1800,
                    q=1.3, pan_from=-0.35, pan_to=0.35, body=0.15, air=0.2,
                    whistle=0.25, seed=12)
    return x, dict(desc="Whoosh léger et court pour les apparitions de texte.",
                   hit="env_peak", search=(0.03, 0.18), fade_out=0.02, win=0.015)


def make_swipe_up():
    rng = np.random.default_rng(13)
    dur, tp = 0.30, 0.23
    n = n_samples(dur)
    t = time_axis(n)
    u = t / dur
    fc = exp_interp(450, 7000, u ** 1.25)
    q = 1.4 + 1.2 * u
    a = rng.standard_normal(n)
    b = rng.standard_normal(n)
    nl = unit(svf(a, fc, q, "bp"))
    nr = unit(svf(0.8 * a + 0.6 * b, fc, q, "bp"))
    env = np.where(t < tp, 0.03 + 0.97 * (t / tp) ** 2,
                   0.5 + 0.5 * np.cos(np.pi * np.clip((t - tp) / (dur - tp), 0, 1)))
    ft = exp_interp(320, 1400, u ** 1.1)
    ph = sweep_phase(ft)
    tone = unit(np.sin(ph) + 0.25 * np.sin(2 * ph)) * 0.3
    x = np.stack([nl + tone, nr + tone], axis=1) * env[:, None]
    x = butter(x, "low", 12000, 2)
    return x, dict(desc="Montée filtrée (bruit + sinus montant discret) pour les transitions vers le haut.",
                   hit="env_peak", search=(0.12, 0.29), fade_out=0.015, win=0.015)


# ------------------------------------------------------------------ UI / tap

def make_pop():
    rng = np.random.default_rng(21)
    n = n_samples(0.12)
    t = time_axis(n)
    f = 280.0 * (900.0 / 280.0) ** np.exp(-t / 0.014)
    ph = sweep_phase(f)
    tone = (np.sin(ph) + 0.1 * np.sin(2 * ph)) * attack_env(n, 0.001) * np.exp(-t / 0.03)
    click = peak1(butter(rng.standard_normal(n), "high", 2500, 2) * np.exp(-t / 0.0006))
    x = peak1(tone) + 0.3 * click
    return to_stereo(x), dict(desc="Pop rond et amical (sinus 900 vers 280 Hz + petit clic).",
                              hit="env_peak", search=(0.0, 0.03), fade_out=0.02, win=0.004, hpf=60, fade_in=0.001)


def make_tap():
    rng = np.random.default_rng(22)
    n = n_samples(0.15)
    t = time_axis(n)
    # clic clair : téléphone qui touche la plaque acrylique
    burst = peak1(butter(rng.standard_normal(n), "bandpass", [2000, 9000], 2) * np.exp(-t / 0.0008))
    # modes de la plaque (inharmoniques) + petit "toc" de corps vers 820 Hz
    modes = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t / tau)
                for f, a, tau in [(2350, 0.6, 0.014), (3900, 0.4, 0.008), (5600, 0.25, 0.005),
                                  (820, 0.5, 0.009)])
    click = peak1(0.8 * burst + modes)
    # choc sourd ~150 Hz, légère saturation pour rester audible sur haut-parleur de téléphone
    f = 130.0 * (185.0 / 130.0) ** np.exp(-t / 0.018)
    thump = np.sin(sweep_phase(f)) * attack_env(n, 0.002) * np.exp(-t / 0.04)
    thump = np.tanh(1.5 * thump) / np.tanh(1.5)
    x = peak1(thump) + 0.9 * click
    return to_stereo(x), dict(desc="Tap du téléphone sur le présentoir : clic clair + choc sourd ~150 Hz.",
                              hit="env_peak", search=(0.0, 0.02), fade_out=0.02, win=0.004, hpf=40, fade_in=0.001)


def make_click():
    rng = np.random.default_rng(23)
    n = n_samples(0.05)
    t = time_axis(n)
    x = (0.6 * np.sin(2 * np.pi * 2800 * t) * attack_env(n, 0.0004) * np.exp(-t / 0.0025)
         + 0.5 * np.sin(2 * np.pi * 1300 * t) * attack_env(n, 0.0004) * np.exp(-t / 0.004)
         + 0.35 * np.sin(2 * np.pi * 450 * t) * attack_env(n, 0.0005) * np.exp(-t / 0.006)
         + 0.4 * peak1(butter(rng.standard_normal(n), "high", 4000, 2) * attack_env(n, 0.0005)
                       * np.exp(-t / 0.0006)))
    return to_stereo(x), dict(desc="Clic d'interface net (appui bouton).",
                              hit="env_peak", search=(0.0, 0.01), fade_out=0.01, win=0.002, hpf=150, fade_in=0.001)


def make_tick():
    rng = np.random.default_rng(24)
    n = n_samples(0.05)
    t = time_axis(n)
    x = (1.0 * np.sin(2 * np.pi * 1750 * t) * np.exp(-t / 0.003)
         + 0.2 * np.sin(2 * np.pi * 3600 * t) * np.exp(-t / 0.0012)
         + 0.15 * peak1(butter(rng.standard_normal(n), "low", 6000, 2) * np.exp(-t / 0.0003)))
    return to_stereo(x), dict(desc="Tic très court et doux (compteurs, coches).",
                              hit="env_peak", search=(0.0, 0.01), fade_out=0.01, win=0.002, hpf=300, fade_in=0.001)


# ------------------------------------------------------------- sons tonals

def partial_sum(freq, n, partials, tau, attack):
    """Somme de partiels sinusoïdaux (rapport, amplitude, facteur de décroissance)."""
    t = time_axis(n)
    y = np.zeros(n)
    for ratio, amp, m in partials:
        if ratio * freq < 0.45 * SR:
            y += amp * np.sin(2 * np.pi * ratio * freq * t) * np.exp(-t / (tau * m))
    return y * attack_env(n, attack)


CHIME = [(1.0, 1.0, 1.0), (2.0, 0.22, 0.55), (3.0, 0.07, 0.35), (4.0, 0.05, 0.25), (5.43, 0.025, 0.12)]
BELL_PLUCK = [(1.0, 1.0, 1.0), (2.0, 0.35, 0.5), (3.0, 0.12, 0.33), (4.2, 0.07, 0.2), (6.3, 0.03, 0.1)]


def marimba_partials(hard):
    # lames de marimba accordées 1 : 4 : 10, plus un soupçon d'octave (côté cloche)
    return [(1.0, 1.0, 1.0), (2.0, 0.12, 0.5), (4.0, 0.3 * hard, 0.28), (10.0, 0.08 * hard, 0.1)]


def place(buf, x, start_s):
    i = n_samples(start_s)
    x = to_stereo(x)
    m = min(len(x), len(buf) - i)
    buf[i:i + m] += x[:m]


def mallet_noise(n, rng, level):
    t = time_axis(n)
    return level * peak1(butter(rng.standard_normal(n), "low", 3000, 2) * np.exp(-t / 0.0015))


def make_nfc():
    # Do6 puis Sol6 (quinte), dans la tonalité de la musique (Fa majeur)
    dur = 0.6
    n = n_samples(dur)
    buf = np.zeros((n, 2))
    notes = [(note_freq("C6"), 0.0, 0.80, 0.16, -0.15), (note_freq("G6"), 0.085, 1.0, 0.24, 0.15)]
    for f, t0, a, tau, p in notes:
        m = n - n_samples(t0)
        place(buf, pan(a * partial_sum(f, m, CHIME, tau, 0.004), p), t0)
    x = add_room(buf, 0.18, rt60=0.5, seed=31)
    return x, dict(desc="Confirmation sans contact : deux notes de carillon à la quinte (Do6 puis Sol6), attaque douce.",
                   hit="env_peak", search=(0.0, 0.03), fade_out=0.06, win=0.004,
                   markers={"note_1_s": 0.0, "note_2_s": 0.085})


STAR_NOTES = ["C6", "D6", "F6", "G6", "A6"]  # pentatonique de Fa majeur, montante


def make_star(i):
    n = n_samples(0.25)
    f = note_freq(STAR_NOTES[i])
    y = partial_sum(f, n, BELL_PLUCK, 0.085, 0.0015)
    # les étoiles se remplissent de gauche à droite : léger panoramique qui suit
    x = add_room(pan(y, -0.35 + 0.175 * i), 0.15, rt60=0.45, seed=40 + i)
    return x, dict(desc=f"Étoile {i + 1}/5 : pluck clochette {STAR_NOTES[i]} ({f:.1f} Hz), "
                        "gamme pentatonique montante, même timbre pour les 5.",
                   hit="env_peak", search=(0.0, 0.02), fade_out=0.05, win=0.004, group="stars")


def make_success():
    rng = np.random.default_rng(51)
    dur = 0.9
    n = n_samples(dur)
    buf = np.zeros((n, 2))
    seq = [("F5", 0.000, 0.75, 0.12, -0.2), ("A5", 0.075, 0.80, 0.12, -0.07),
           ("C6", 0.150, 0.85, 0.13, 0.07), ("F6", 0.225, 1.00, 0.32, 0.2)]
    for name, t0, a, tau, p in seq:
        m = n - n_samples(t0)
        y = partial_sum(note_freq(name), m, marimba_partials(1.0), tau, 0.0015)
        y += mallet_noise(m, rng, 0.12)
        if name == "F6":  # la dernière note est doublée à l'octave inférieure
            y += 0.5 * partial_sum(note_freq("F5"), m, marimba_partials(0.7), 0.3, 0.0015)
        place(buf, pan(a * y, p), t0)
    x = add_room(buf, 0.2, rt60=0.7, seed=52)
    return x, dict(desc="Arpège de validation (Fa La Do Fa, accord parfait + octave), marimba/cloche. Pour 'Avis publié'.",
                   hit="env_peak", search=(0.0, 0.03), fade_out=0.12, win=0.004,
                   markers={"note_1_s": 0.0, "note_2_s": 0.075, "note_3_s": 0.15, "note_4_s": 0.225})


def make_notif():
    rng = np.random.default_rng(61)
    dur = 0.5
    n = n_samples(dur)
    buf = np.zeros((n, 2))
    for name, t0, a, tau, p in [("C5", 0.0, 0.8, 0.13, -0.1), ("F5", 0.11, 1.0, 0.22, 0.1)]:
        m = n - n_samples(t0)
        y = partial_sum(note_freq(name), m, marimba_partials(0.6), tau, 0.002)
        y += mallet_noise(m, rng, 0.06)
        place(buf, pan(a * y, p), t0)
    x = add_room(buf, 0.15, rt60=0.6, seed=62)
    return x, dict(desc="Notification douce deux notes (Do5 puis Fa5), marimba, originale.",
                   hit="env_peak", search=(0.0, 0.03), fade_out=0.08, win=0.004,
                   markers={"note_1_s": 0.0, "note_2_s": 0.11})


# ------------------------------------------------------------ impact / riser

def make_impact():
    rng = np.random.default_rng(71)
    dur = 1.2
    n = n_samples(dur)
    t = time_axis(n)
    f = 45.0 * (110.0 / 45.0) ** np.exp(-t / 0.09)
    sub = np.sin(sweep_phase(f)) * attack_env(n, 0.0015) * np.exp(-t / 0.38)
    sub = np.tanh(2.5 * sub) / np.tanh(2.5)
    # couche "punch" 230 vers 85 Hz saturée : c'est elle qu'on entend sur un téléphone
    fp = 100.0 * (300.0 / 100.0) ** np.exp(-t / 0.03)
    punch = np.sin(sweep_phase(fp)) * attack_env(n, 0.001) * np.exp(-t / 0.08)
    punch = np.tanh(3.0 * punch) / np.tanh(3.0)
    trans = peak1(butter(rng.standard_normal(n), "bandpass", [300, 5000], 2) * np.exp(-t / 0.015))
    body = peak1(svf(rng.standard_normal(n), 700, 0.7, "lp") * np.exp(-t / 0.18))
    tail_env = (1 - np.exp(-t / 0.02)) * np.exp(-t / 0.4)
    tail = np.stack([svf(rng.standard_normal(n), exp_interp(1500, 300, t / dur), 0.7, "lp")
                     for _ in range(2)], axis=1)
    tail = tail / np.max(np.abs(tail)) * tail_env[:, None]
    x = to_stereo(sub + 0.6 * punch + 0.7 * trans + 0.5 * body) + 0.3 * tail
    x = butter(x, "high", 28, 2)
    return x, dict(desc="Impact cinématique grave (sub 110 vers 45 Hz + transitoire + queue douce). Grandes révélations.",
                   hit="env_peak", search=(0.0, 0.03), fade_out=0.15, win=0.004, peak_db=-1.5)


def make_riser():
    rng = np.random.default_rng(81)
    dur = 1.5
    n = n_samples(dur)
    t = time_axis(n)
    u = t / dur
    amp = 10 ** ((-28 + 28 * u ** 0.8) / 20)
    fc = exp_interp(250, 6500, u ** 1.4)
    q = 1.4 + 1.6 * u
    common = rng.standard_normal(n)
    corr = 0.9 - 0.6 * u  # s'élargit en montant
    chans = []
    for _ in range(2):
        src = corr * common + np.sqrt(1 - corr ** 2) * rng.standard_normal(n)
        chans.append(unit(svf(src, fc, q, "bp")))
    noise = np.stack(chans, axis=1)
    wash = unit(svf(rng.standard_normal(n), exp_interp(400, 3000, u), 0.7, "lp"))
    noise = noise + 0.5 * wash[:, None]
    ft = exp_interp(180, 1440, u ** 1.3)
    ph = sweep_phase(ft)
    lfo_rate = 5 + 17 * u ** 2
    lfo = 1 - 0.35 * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(lfo_rate) / SR))
    tone = unit(np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * lfo * 0.35
    x = (noise + tone[:, None]) * amp[:, None]
    x = butter(x, "low", 13000, 2)
    return x, dict(desc="Montée de tension, finit net à pleine intensité : caler la FIN (hit_s) sur la coupe.",
                   hit="end", fade_out=0.002, trim=False)


# ---------------------------------------------------------------- pipeline

SOUNDS = [
    ("whoosh", make_whoosh),
    ("whoosh-short", make_whoosh_short),
    ("swipe-up", make_swipe_up),
    ("pop", make_pop),
    ("tap", make_tap),
    ("nfc", make_nfc),
    *[(f"star-{i + 1}", (lambda i=i: make_star(i))) for i in range(5)],
    ("success", make_success),
    ("notif", make_notif),
    ("impact", make_impact),
    ("riser", make_riser),
    ("click", make_click),
    ("tick", make_tick),
]


def hit_time(q, meta):
    x = q.astype(float) / 32768.0
    dur = len(x) / SR
    if meta["hit"] == "end":
        return dur
    mono = x.mean(axis=1)
    env = np.sqrt(uniform_filter1d(mono ** 2, size=max(1, n_samples(meta.get("win", 0.005)))))
    lo, hi = meta["search"]
    a, b = n_samples(lo), min(len(env), n_samples(hi))
    return (a + int(np.argmax(env[a:b]))) / SR


def process(x, meta):
    """Chaîne commune : anti-continu, suppression du silence de tête, fondus, crête."""
    x = to_stereo(x)
    fin = meta.get("fade_in", 0.0015)
    # fondu d'entrée AVANT le passe-haut : la composante continue créée par le
    # fondu sur une attaque très raide est ainsi retirée elle aussi
    x = fade(x, fade_in_s=fin, fade_out_s=0.0)
    hpf = meta.get("hpf")
    # passe-haut anti-continu (plus haut pour les clics courts, dont la queue
    # de filtre doit s'éteindre bien avant la fin du fichier)
    x = butter(x, "high", hpf, 2) if hpf else butter(x, "high", 20, 1)
    off = 0
    if meta.get("trim", True):
        x, off = trim_leading(x, rel_db=-45.0)
    x = fade(x, fade_in_s=fin, fade_out_s=meta.get("fade_out", 0.01))
    return normalize_peak(x, meta.get("peak_db", -3.0)), off


def render_all(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    manifest = {
        "format": "WAV PCM 16 bits, stéréo, 48000 Hz",
        "note": "hit_s = instant perceptif à caler sur l'événement visuel. "
                "Démarrer le son à la frame (F - hit_s * fps) pour que le hit tombe sur la frame F. "
                "loudness_lufs est indicatif (sons courts complétés à 400 ms). "
                "suggested_volume : point de départ pour le volume Remotion au-dessus de la musique.",
        "origin": "Synthèse originale (numpy/scipy), aucun échantillon ni contenu tiers.",
        "sounds": [],
    }
    rendered = []
    for name, fn in SOUNDS:
        x, meta = fn()
        x, off = process(x, meta)
        rendered.append([name, x, meta, off])
    # les sons d'un même groupe (les 5 étoiles) sont alignés en loudness : le
    # plus faible garde sa crête à -3 dBFS, les autres sont baissés d'autant
    groups = {}
    for item in rendered:
        if "group" in item[2]:
            groups.setdefault(item[2]["group"], []).append(item)
    for items in groups.values():
        target = min(lufs(it[1]) for it in items)
        for it in items:
            it[1] = it[1] * 10 ** ((target - lufs(it[1])) / 20)
    for name, x, meta, off in rendered:
        path = os.path.join(out_dir, f"{name}.wav")
        q = write_wav(path, x, seed=zlib.crc32(name.encode()))
        hit = hit_time(q, meta)
        xf = q.astype(float) / 32768.0
        entry = {
            "file": f"{name}.wav",
            "duration_s": round(len(q) / SR, 4),
            "hit_s": round(hit, 4),
            "hit_frames_30fps": round(hit * 30, 2),
            "peak_dbfs": round(float(lin_to_db(np.max(np.abs(xf)))), 2),
            "loudness_lufs": round(float(lufs(xf)), 1),
            # volume de départ conseillé pour ressortir d'environ 2 LU au-dessus
            # de la musique (-16 LUFS), plafonné à 1
            "suggested_volume": round(float(min(1.0, 10 ** ((SFX_TARGET_LUFS - lufs(xf)) / 20))), 2),
            "description": meta["desc"],
        }
        if "markers" in meta:
            entry["markers_s"] = {k: round(max(0.0, v - off / SR), 4) for k, v in meta["markers"].items()}
        manifest["sounds"].append(entry)
        print(f"{name:14s} {entry['duration_s']:.3f} s  hit {entry['hit_s']:.4f} s  "
              f"peak {entry['peak_dbfs']:6.2f} dBFS  {entry['loudness_lufs']:6.1f} LUFS  (trim {off} éch.)")
    with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


if __name__ == "__main__":
    render_all(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT)
