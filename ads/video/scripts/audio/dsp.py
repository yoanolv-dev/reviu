"""Outils DSP partagés par sfx.py et music.py (vidéos publicitaires Reviu).

Tout est synthétisé à partir de zéro avec numpy et scipy : aucun échantillon,
aucune banque de sons, aucun contenu tiers.
"""
import os

import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import minimum_filter1d, uniform_filter1d

SR = 48000

NOTE_INDEX = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


# ---------------------------------------------------------------- utilitaires

def db_to_lin(d):
    return 10.0 ** (np.asarray(d, dtype=float) / 20.0)


def lin_to_db(x):
    return 20.0 * np.log10(np.maximum(np.asarray(x, dtype=float), 1e-12))


def n_samples(seconds):
    return int(round(seconds * SR))


def time_axis(n):
    return np.arange(n) / SR


def note_freq(name):
    """'F5', 'Bb3', 'C#4' -> fréquence en Hz (La4 = 440 Hz)."""
    letter = name[0].upper()
    rest = name[1:]
    semi = NOTE_INDEX[letter]
    while rest and rest[0] in "#b":
        semi += 1 if rest[0] == "#" else -1
        rest = rest[1:]
    midi = 12 * (int(rest) + 1) + semi
    return 440.0 * 2.0 ** ((midi - 69) / 12.0)


def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3.0 - 2.0 * x)


def exp_interp(a, b, u):
    """Interpolation géométrique (pour les fréquences) : a -> b quand u va de 0 à 1."""
    return a * (b / a) ** np.clip(u, 0.0, 1.0)


def to_stereo(x):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1:
        return np.stack([x, x], axis=1)
    return x


def pan(mono, pos):
    """Panoramique à puissance constante, pos dans [-1, 1] (scalaire ou tableau).

    Le centre vaut 1.0 sur chaque canal (pas de perte de niveau au centre).
    """
    theta = (np.clip(pos, -1.0, 1.0) + 1.0) * np.pi / 4.0
    g = np.sqrt(2.0)
    return np.stack([mono * g * np.cos(theta), mono * g * np.sin(theta)], axis=1)


def fade(x, fade_in_s=0.0015, fade_out_s=0.01):
    """Fondus en cosinus surélevé. Le premier et le dernier échantillon valent 0."""
    x = np.array(x, dtype=float, copy=True)
    n = len(x)
    ni = min(n_samples(fade_in_s), n)
    no = min(n_samples(fade_out_s), n)
    if ni > 0:
        r = 0.5 - 0.5 * np.cos(np.pi * np.arange(ni) / ni)
        x[:ni] *= r[:, None] if x.ndim == 2 else r
    if no > 0:
        r = 0.5 + 0.5 * np.cos(np.pi * (np.arange(no) + 1) / no)
        x[n - no:] *= r[:, None] if x.ndim == 2 else r
    return x


def attack_env(n, attack_s):
    """Montée en cosinus sur attack_s puis 1."""
    env = np.ones(n)
    na = min(n_samples(attack_s), n)
    if na > 0:
        env[:na] = 0.5 - 0.5 * np.cos(np.pi * np.arange(na) / na)
    return env


def normalize_peak(x, peak_db):
    p = np.max(np.abs(x))
    if p <= 0:
        return x
    return x * (db_to_lin(peak_db) / p)


def trim_leading(x, rel_db=-45.0, win_s=0.001):
    """Supprime le silence de tête : le son commence au premier échantillon qui
    dépasse rel_db sous le crête (enveloppe lissée sur win_s). Renvoie (x, offset)."""
    mono = np.max(np.abs(to_stereo(x)), axis=1)
    env = uniform_filter1d(mono, size=max(1, n_samples(win_s)))
    thr = env.max() * db_to_lin(rel_db)
    idx = int(np.argmax(env >= thr))
    # on recule d'une demi fenêtre pour ne pas manger l'attaque
    idx = max(0, idx - n_samples(win_s) // 2)
    return x[idx:], idx


# ------------------------------------------------------------------- filtres

def butter(x, kind, fc, order=2):
    """Filtre Butterworth causal (sos). kind: 'low', 'high', 'bandpass'."""
    sos = signal.butter(order, fc, btype=kind, fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def svf(x, fc, q=0.707, mode="lp"):
    """Filtre à variables d'état TPT (topologie de Zavalishin), échantillon par
    échantillon, stable même avec une fréquence de coupure qui varie à chaque
    échantillon (balayages de whoosh, riser...). fc et q : scalaires ou tableaux.
    mode 'bp' : passe-bande normalisé (gain 1 au centre)."""
    x = np.asarray(x, dtype=float)
    n = x.size
    fc = np.broadcast_to(np.asarray(fc, dtype=float), (n,))
    q = np.broadcast_to(np.asarray(q, dtype=float), (n,))
    g = np.tan(np.pi * np.clip(fc, 5.0, 0.45 * SR) / SR)
    k = 1.0 / q
    a1 = 1.0 / (1.0 + g * (g + k))
    a2 = g * a1
    a3 = g * a2
    xs, A1, A2, A3 = x.tolist(), a1.tolist(), a2.tolist(), a3.tolist()
    lp = [0.0] * n
    bp = [0.0] * n
    ic1 = ic2 = 0.0
    for i in range(n):
        v3 = xs[i] - ic2
        v1 = A1[i] * ic1 + A2[i] * v3
        v2 = ic2 + A2[i] * ic1 + A3[i] * v3
        ic1 = 2.0 * v1 - ic1
        ic2 = 2.0 * v2 - ic2
        lp[i] = v2
        bp[i] = v1
    lp = np.asarray(lp)
    bp = np.asarray(bp)
    if mode == "lp":
        return lp
    if mode == "bp":
        return k * bp
    if mode == "hp":
        return x - k * bp - lp
    raise ValueError(mode)


def lp_mag(f, fc, q=0.707, stages=1):
    """Module d'un passe-bas du 2e ordre (puissance 'stages') : sert à filtrer
    les partiels des oscillateurs additifs, donc sans aucun repliement."""
    r = np.asarray(f, dtype=float) / np.asarray(fc, dtype=float)
    m = 1.0 / np.sqrt((1.0 - r * r) ** 2 + (r / q) ** 2)
    return m ** stages


# ------------------------------------------------------------------ réverbe

def reverb_ir(rt60=1.5, predelay=0.015, damp_start=9000.0, damp_end=2200.0,
              seed=7, length=None):
    """Réponse impulsionnelle stéréo synthétique : bruit décorrélé G/D à
    décroissance exponentielle, de plus en plus sombre avec le temps."""
    rng = np.random.default_rng(seed)
    n = n_samples(length if length else min(rt60 * 1.1, 4.0))
    t = time_axis(n)
    env = np.exp(-6.9078 * t / rt60) * (1.0 - np.exp(-t / 0.004))
    fc = exp_interp(damp_start, damp_end, t / rt60)
    chans = [svf(rng.standard_normal(n) * env, fc, 0.6, "lp") for _ in range(2)]
    ir = np.stack(chans, axis=1)
    ir = np.vstack([np.zeros((n_samples(predelay), 2)), ir])
    ir /= np.sqrt(np.sum(ir ** 2) / 2.0)
    return ir


def convolve(send, ir):
    """Convolue un envoi (mono ou stéréo, sommé en mono) avec une RI stéréo.
    Renvoie len(send) + len(ir) - 1 échantillons."""
    s = send if send.ndim == 1 else send.mean(axis=1)
    return np.stack([signal.fftconvolve(s, ir[:, c]) for c in range(2)], axis=1)


# ------------------------------------------------------------- mesure/master

def lufs(x):
    """Loudness intégrée (ITU-R BS.1770-4) via pyloudnorm. Les sons de moins de
    400 ms sont complétés par du silence (valeur indicative seulement)."""
    import pyloudnorm as pyln

    x = to_stereo(x)
    if len(x) < n_samples(0.4):
        x = np.vstack([x, np.zeros((n_samples(0.4) - len(x), 2))])
    return pyln.Meter(SR).integrated_loudness(x)


def true_peak(x, oversample=4):
    up = signal.resample_poly(to_stereo(x), oversample, 1, axis=0)
    return float(np.max(np.abs(up)))


def limiter(x, ceiling_db=-2.0, window_s=0.012, oversample=4):
    """Limiteur crête vrai à anticipation (hors ligne) : le gain requis, estimé
    sur le signal suréchantillonné x4, passe par un filtre minimum puis une
    moyenne glissante de même largeur, ce qui garantit gain <= gain requis au
    point de crête avec des rampes douces (pas de distorsion audible)."""
    x = to_stereo(x)
    c = db_to_lin(ceiling_db)
    up = signal.resample_poly(x, oversample, 1, axis=0)
    a = np.max(np.abs(up), axis=1)
    a = a[: len(x) * oversample].reshape(len(x), oversample).max(axis=1)
    req = np.minimum(1.0, c / np.maximum(a, 1e-9))
    w = max(3, n_samples(window_s) | 1)
    g = minimum_filter1d(req, size=w, mode="nearest")
    g = uniform_filter1d(g, size=w, mode="nearest")
    return x * g[:, None], float(lin_to_db(g.min()))


# --------------------------------------------------------------------- export

def write_wav(path, x, dither=True, seed=1):
    """Écrit un WAV PCM 16 bits stéréo 48 kHz, avec dither TPDF (atténué sur
    les 5 ms de bord pour que le premier et le dernier échantillon restent à 0)."""
    x = to_stereo(x)
    if not np.all(np.isfinite(x)):
        raise ValueError(f"{path}: NaN ou Inf dans le signal")
    y = x * 32767.0
    if dither:
        rng = np.random.default_rng(seed)
        d = rng.uniform(-0.5, 0.5, x.shape) + rng.uniform(-0.5, 0.5, x.shape)
        edge = max(1, min(len(x) // 4, n_samples(0.005)))
        mask = np.ones(len(x))
        mask[:edge] = np.linspace(0.0, 1.0, edge)
        mask[-edge:] = np.linspace(1.0, 0.0, edge)
        y = y + d * mask[:, None]
    q = np.clip(np.round(y), -32768, 32767).astype(np.int16)
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    wavfile.write(path, SR, q)
    return q
