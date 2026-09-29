"""Génère le fond musical de la vidéo Reviu (synthèse pure, aucun échantillon).

Usage : python3 scripts/audio/music.py arrangement.json sortie.wav

Électro claire et positive (house légère / future pop), 120 BPM fixes :
1 temps = 0.5 s = 15 frames à 30 i/s, 1 mesure = 2 s = 60 frames.
L'arrangement est piloté par le JSON, par exemple :

{"bars": 13,
 "sections": [{"from_bar": 0, "to_bar": 1, "energy": "intro"},
              {"from_bar": 1, "to_bar": 5, "energy": "build"},
              {"from_bar": 5, "to_bar": 10, "energy": "drop"},
              {"from_bar": 10, "to_bar": 11, "energy": "break"},
              {"from_bar": 11, "to_bar": 13, "energy": "outro"}],
 "final_hit_bar": 11, "tail_s": 1.0}

Énergies : intro (accords filtrés + charleston léger), build (+ kick, basse,
filtre qui s'ouvre, montée sur la fin), drop (groove complet : kick sur chaque
temps, clap sur 2 et 4, charleston ouvert à contretemps, basse, stabs d'accords
et pad pompés par le kick, mélodie pluck), break (sans batterie : accords et
mélodie filtrés), outro (groove complet puis fin). final_hit_bar (optionnel) :
gros accord + impact au début de cette mesure. tail_s : queue propre après la
dernière mesure (défaut 1.0). end_button (optionnel, défaut true) : accord final
de tonique sur le dernier temps fort (à bars * 2 s), qui résonne dans la queue.
Durée du fichier : exactement bars * 2 s + tail_s.

Harmonie : Fa majeur, grille Fa - Do - Rém - Sib (I V vi IV), qui repart sur Fa
au début de chaque section. La mesure avant final_hit_bar et la dernière mesure
passent sur Do (V) pour résoudre sur Fa (la dernière mesure seulement si
elle n'ouvre pas sa section). Mélodie en pentatonique de Fa majeur.
Master : environ -16 LUFS intégrés, crête vraie sous -1.5 dBTP (pour rester
sous les effets sonores et une éventuelle voix).
"""
import json
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsp import (SR, attack_env, butter, convolve, db_to_lin, exp_interp,  # noqa: E402
                 fade, lin_to_db, limiter, lp_mag, lufs, n_samples, note_freq,
                 pan, reverb_ir, svf, time_axis, to_stereo, true_peak,
                 write_wav)

BPM = 120
BEAT = SR * 60 // BPM          # 24000 échantillons
STEP = BEAT // 4               # double croche : 6000 échantillons
BAR = 4 * BEAT                 # 96000 échantillons = 2 s
ENERGIES = ("intro", "build", "drop", "break", "outro")
TARGET_LUFS = -16.0
CEILING_DBTP = -2.0            # marge sous l'exigence de -1.5 dBTP

PROG = ["F", "C", "Dm", "Bb"]
VOICING = {"F": ["A3", "C4", "F4"], "C": ["G3", "C4", "E4"],
           "Dm": ["A3", "D4", "F4"], "Bb": ["Bb3", "D4", "F4"]}
BASS_ROOT = {"F": "F2", "C": "C2", "Dm": "D2", "Bb": "Bb1"}
# Motif mélodique par accord : (double croche, note, durée en doubles croches).
# Rythme 3-3-4-2 accrocheur, uniquement des notes de la pentatonique de Fa.
MOTIF = {
    "F": [(0, "C6", 2), (3, "A5", 2), (6, "C6", 3), (10, "D6", 2), (12, "C6", 3)],
    "C": [(0, "G5", 2), (3, "C6", 2), (6, "G5", 3), (10, "A5", 2), (12, "G5", 3)],
    "Dm": [(0, "A5", 2), (3, "D6", 2), (6, "A5", 3), (10, "C6", 2), (12, "A5", 3)],
    "Bb": [(0, "F5", 2), (3, "G5", 2), (6, "F5", 2), (8, "D5", 2), (10, "F5", 2),
           (12, "G5", 2), (14, "A5", 2)],
}

# Niveaux de mixage (gains linéaires des bus avant mastering)
MIX = {
    "kick": 0.79, "clap": 0.97, "hat": 0.6, "crash": 0.3, "bass": 0.36,
    "pad": 0.48, "stab": 0.72, "lead": 0.6, "delay": 0.32, "reverb": 0.7,
    "riser": 0.35, "hit": 0.4, "boom": 0.5,
}
SEND = {"pad": 0.22, "stab": 0.28, "lead": 0.25, "clap": 0.3, "hit": 0.35}
DUCK = {"pad": 0.8, "stab": 0.45, "bass": 0.5, "lead": 0.2, "reverb": 0.45, "delay": 0.3}


# ------------------------------------------------------------- oscillateurs

def additive(f0, n, fc, spectrum="saw", q=0.707, stages=2, rng=None,
             fmax=15000.0, cr=64, thresh=3e-4):
    """Oscillateur additif à bande limitée (aucun partiel au-dessus de fmax,
    donc aucun repliement) filtré par un passe-bas appliqué partiel par partiel.
    fc : scalaire ou tableau de longueur n (filtre qui varie dans le temps)."""
    K = max(1, int(min(fmax, 0.45 * SR) // f0))
    k = np.arange(1, K + 1)
    if spectrum == "saw":
        base = 1.0 / k
    elif spectrum == "pluck":  # dent de scie + carré : un peu creux, "future pop"
        base = 0.6 / k + 0.4 * np.where(k % 2 == 1, 1.0 / k, 0.0)
    elif spectrum == "bass":
        base = 1.0 / k ** 1.25
    else:
        raise ValueError(spectrum)
    phases = rng.uniform(0, 2 * np.pi, K) if rng is not None else np.zeros(K)
    idx = np.arange(n)
    w = 2 * np.pi * f0 / SR * idx
    out = np.zeros(n)
    fc = np.asarray(fc, dtype=float)
    if fc.ndim == 0:
        g = base * lp_mag(k * f0, fc, q, stages)
        for i in np.nonzero(g > thresh)[0]:
            out += g[i] * np.sin(k[i] * w + phases[i])
        return out
    ci = np.arange(0, n, cr)
    if ci[-1] != n - 1:
        ci = np.append(ci, n - 1)
    G = base[:, None] * lp_mag(k[:, None] * f0, fc[ci][None, :], q, stages)
    for i in range(K):
        if G[i].max() < thresh:
            continue
        out += np.interp(idx, ci, G[i]) * np.sin(k[i] * w + phases[i])
    return out


def gate_env(n, attack_s, gate_s, release_s):
    """Enveloppe attaque / maintien / relâchement en cosinus."""
    env = attack_env(n, attack_s)
    g = n_samples(gate_s)
    r = max(1, n_samples(release_s))
    if g < n:
        m = min(r, n - g)
        env[g:g + m] *= 0.5 + 0.5 * np.cos(np.pi * np.arange(m) / r)
        env[g + m:] = 0.0
    return env


def detune(f, cents):
    return f * 2.0 ** (cents / 1200.0)


# ------------------------------------------------------------- instruments

class Kit:
    """Sons de batterie pré-calculés (synthèse)."""

    def __init__(self, seed=100):
        rng = np.random.default_rng(seed)
        self.kick = self._kick(rng)
        self.clap = self._clap(rng)
        self.hats_c = [self._hat(rng, False) for _ in range(4)]
        self.hats_o = [self._hat(rng, True) for _ in range(2)]
        self.crash = self._crash(rng)

    @staticmethod
    def _kick(rng):
        n = n_samples(0.42)
        t = time_axis(n)
        f = 46.0 + (170.0 - 46.0) * np.exp(-t / 0.03)
        ph = 2 * np.pi * (np.cumsum(f) - f[0]) / SR
        body = np.sin(ph) * np.exp(-t / 0.2) * attack_env(n, 0.0004)
        click = butter(rng.standard_normal(n), "bandpass", [1500, 6000], 2)
        click = click / np.max(np.abs(click)) * np.exp(-t / 0.0015) * attack_env(n, 0.0003)
        k = np.tanh(1.6 * (body + 0.12 * click)) / np.tanh(1.6)
        k = butter(k, "high", 25, 2)
        return to_stereo(fade(k / np.max(np.abs(k)), 0.0003, 0.04))

    @staticmethod
    def _clap(rng):
        n = n_samples(0.35)
        out = np.zeros((n, 2))
        for off in (0.0, 0.008, 0.017, 0.027):
            i = n_samples(off)
            m = n - i
            b = rng.standard_normal(m) * np.exp(-time_axis(m) / 0.0035) * attack_env(m, 0.0003)
            out[i:, :] += b[:, None]
        i = n_samples(0.027)
        m = n - i
        tail = rng.standard_normal((m, 2)) * np.exp(-time_axis(m) / 0.085)[:, None]
        out[i:] += 0.6 * tail
        out = butter(out, "bandpass", [850, 2800], 2)
        out = butter(out, "high", 400, 2)
        return fade(out / np.max(np.abs(out)), 0.0003, 0.03)

    @staticmethod
    def _hat(rng, is_open):
        n = n_samples(0.3 if is_open else 0.07)
        t = time_axis(n)
        a = rng.standard_normal(n)
        b = rng.standard_normal(n)
        x = np.stack([a, 0.75 * a + 0.66 * b], axis=1)  # légère largeur stéréo
        x = butter(x, "high", 6000 if is_open else 7500, 4)
        x = butter(x, "low", 14000, 2)
        env = attack_env(n, 0.0003) * np.exp(-t / (0.075 if is_open else 0.016))
        x = x * env[:, None]
        return fade(x / np.max(np.abs(x)), 0.0003, 0.02)

    @staticmethod
    def _crash(rng):
        n = n_samples(2.6)
        t = time_axis(n)
        x = rng.standard_normal((n, 2))
        x = butter(x, "high", 3500, 2)
        x = butter(x, "low", 11000, 2)
        x = x * (attack_env(n, 0.001) * np.exp(-t / 0.65))[:, None]
        return fade(x / np.max(np.abs(x)), 0.0005, 0.4)


class Synths:
    """Instruments tonals, avec cache (les mêmes notes reviennent souvent)."""

    def __init__(self, seed=200):
        self.rng = np.random.default_rng(seed)
        self.cache = {}

    def pad_bar(self, chord, fc0, fc1, attack_s):
        """Un accord de pad tenu pendant une mesure (+ relâchement 0.25 s),
        2 voix désaccordées de +/- 8 cents par note, ouvertes en stéréo."""
        n = BAR + n_samples(0.25)
        u = np.clip(np.arange(n) / BAR, 0.0, 1.0)
        fc = exp_interp(fc0, fc1, u)
        env = gate_env(n, attack_s, BAR / SR, 0.25)
        out = np.zeros((n, 2))
        for name in VOICING[chord]:
            f = note_freq(name)
            for cents, p in ((-8, -0.55), (8, 0.55)):
                v = additive(detune(f, cents), n, fc, "saw", q=0.9, stages=2, rng=self.rng)
                out += pan(v * env, p)
        return out / 6.0

    def stab(self, chord, bright):
        key = ("stab", chord, bright)
        if key not in self.cache:
            n = n_samples(0.4)
            t = time_axis(n)
            fc = 1000.0 * bright + 2500.0 * bright * np.exp(-t / 0.06)
            env = gate_env(n, 0.003, 0.2, 0.06) * np.exp(-t / 0.12)
            notes = VOICING[chord] + [VOICING[chord][0][:-1] + str(int(VOICING[chord][0][-1]) + 1)]
            out = np.zeros((n, 2))
            for name in notes:
                f = note_freq(name)
                for cents, p in ((-10, -0.6), (10, 0.6)):
                    v = additive(detune(f, cents), n, fc, "saw", q=0.8, stages=2, rng=self.rng)
                    out += pan(v * env, p)
            self.cache[key] = out / 8.0
        return self.cache[key]

    def lead(self, name, steps, fc_hi, fc_lo):
        key = ("lead", name, steps, fc_hi, fc_lo)
        if key not in self.cache:
            n = n_samples(0.7)
            t = time_axis(n)
            f = note_freq(name)
            fc = fc_lo + (fc_hi - fc_lo) * np.exp(-t / 0.07)
            env = gate_env(n, 0.002, steps * STEP / SR, 0.06) * np.exp(-t / 0.22)
            out = np.zeros((n, 2))
            for cents, p in ((-6, -0.25), (6, 0.25)):
                v = additive(detune(f, cents), n, fc, "pluck", q=0.9, stages=2, rng=self.rng)
                out += pan(v * env, p)
            out += to_stereo(0.35 * np.sin(2 * np.pi * f * t) * env)  # corps
            self.cache[key] = out / 2.5
        return self.cache[key]

    def bass(self, name, steps, fc_hi, fc_lo):
        key = ("bass", name, steps, fc_hi, fc_lo)
        if key not in self.cache:
            n = int(steps * STEP) + n_samples(0.05)
            t = time_axis(n)
            f = note_freq(name)
            fc = fc_lo + (fc_hi - fc_lo) * np.exp(-t / 0.06)
            env = gate_env(n, 0.003, steps * STEP / SR, 0.03)
            v = additive(f, n, fc, "bass", q=1.0, stages=2, fmax=4000.0)
            v = v + 0.5 * np.sin(2 * np.pi * f * t)  # sub
            v = np.tanh(1.3 * v * env) / np.tanh(1.3)
            self.cache[key] = to_stereo(v)
        return self.cache[key]

    def hit_chord(self, length_s, tau):
        """Gros accord final de Fa majeur, ouvert et large."""
        n = n_samples(length_s)
        t = time_axis(n)
        fc = 1200.0 + 4000.0 * np.exp(-t / 0.4)
        env = attack_env(n, 0.004) * np.exp(-t / tau)
        out = np.zeros((n, 2))
        for name in ["F3", "A3", "C4", "F4", "A4", "C5"]:
            f = note_freq(name)
            for cents, p in ((-9, -0.7), (9, 0.7)):
                v = additive(detune(f, cents), n, fc, "saw", q=0.8, stages=2, rng=self.rng)
                out += pan(v * env, p)
        low = 0.8 * np.sin(2 * np.pi * note_freq("F2") * t) * env
        out += to_stereo(low)
        return fade(out / 12.0, 0.0, min(0.3, length_s / 3))

    @staticmethod
    def boom(rng):
        n = n_samples(1.6)
        t = time_axis(n)
        f = 40.0 * (95.0 / 40.0) ** np.exp(-t / 0.1)
        ph = 2 * np.pi * (np.cumsum(f) - f[0]) / SR
        x = np.sin(ph) * attack_env(n, 0.002) * np.exp(-t / 0.5)
        x = np.tanh(2.0 * x) / np.tanh(2.0)
        x = butter(x, "high", 25, 2)
        return to_stereo(fade(x, 0.0, 0.3))


def riser(rng, n):
    """Montée de bruit filtré (passe-bande montant) sur n échantillons."""
    u = np.arange(n) / n
    fc = exp_interp(500, 7000, u ** 1.3)
    chans = []
    common = rng.standard_normal(n)
    for _ in range(2):
        src = 0.6 * common + 0.8 * rng.standard_normal(n)
        chans.append(svf(src, fc, 1.8, "bp"))
    x = np.stack(chans, axis=1)
    x = x / np.max(np.abs(x))
    return x * (u ** 2.2)[:, None]


def duck_curve(n_total, triggers, release_s=0.19, attack_s=0.003):
    """Forme de sidechain (0 = pas de ducking, 1 = ducking maximal)."""
    shape = np.zeros(n_total)
    na = n_samples(attack_s)
    nr = n_samples(release_s)
    seg = np.concatenate([0.5 - 0.5 * np.cos(np.pi * np.arange(na) / na),
                          0.5 + 0.5 * np.cos(np.pi * np.arange(nr) / nr)])
    for pos, weight in triggers:
        m = min(len(seg), n_total - pos)
        if m > 0:
            shape[pos:pos + m] = np.maximum(shape[pos:pos + m], weight * seg[:m])
    return shape


def pingpong(x, delay_s=0.375, fb=0.33, taps=5, lp=3500.0):
    """Écho ping-pong à la croche pointée, chaque répétition plus sombre."""
    mono = x.mean(axis=1) if x.ndim == 2 else x
    d = n_samples(delay_s)
    out = np.zeros((len(mono) + d * taps, 2))
    tap = mono
    for k in range(1, taps + 1):
        tap = butter(tap, "low", lp, 1) * fb
        ch = 0 if k % 2 else 1
        out[k * d:k * d + len(tap), ch] += tap
    return out[: len(mono)]


# --------------------------------------------------------------- arrangement

def parse(arr):
    bars = int(arr["bars"])
    if bars < 1:
        raise ValueError("bars doit être >= 1")
    energy = [None] * bars
    start = [0] * bars
    length = [1] * bars
    for s in arr.get("sections", []):
        e = s["energy"]
        if e not in ENERGIES:
            raise ValueError(f"énergie inconnue : {e} (attendu : {', '.join(ENERGIES)})")
        a, b = max(0, int(s["from_bar"])), min(bars, int(s["to_bar"]))
        for i in range(a, b):
            energy[i], start[i], length[i] = e, a, b - a
    for i in range(bars):
        if energy[i] is None:  # trou dans les sections : on prolonge la précédente
            print(f"attention : mesure {i} hors section, énergie reprise de la précédente")
            energy[i] = energy[i - 1] if i else "intro"
            start[i] = start[i - 1] if i else 0
            length[i] = length[i - 1] if i else 1
    hit = arr.get("final_hit_bar")
    hit = None if hit is None else max(0, min(bars, int(hit)))
    tail = max(0.0, float(arr.get("tail_s", 1.0)))
    button = bool(arr.get("end_button", True)) and hit != bars
    chords = []
    for b in range(bars):
        anchor = start[b]
        if hit is not None and anchor <= hit <= b:
            anchor = hit
        c = PROG[(b - anchor) % 4]
        if hit is not None and b == hit - 1:
            c = "C"
        if button and b == bars - 1 and b > start[b]:
            c = "C"
        if hit is not None and b == hit:
            c = "F"
        chords.append(c)
    return bars, energy, start, length, hit, tail, button, chords


def render(arr):
    bars, energy, start, length, hit_bar, tail_s, button, chords = parse(arr)
    n_total = bars * BAR + n_samples(tail_s)
    n_buf = n_total + n_samples(4.0)
    rng = np.random.default_rng(300)
    kit = Kit()
    syn = Synths()
    buses = {k: np.zeros((n_buf, 2)) for k in
             ("kick", "clap", "hat", "crash", "bass", "pad", "stab", "lead", "riser", "hit", "boom")}
    sends = np.zeros((n_buf, 2))
    triggers = []

    def put(bus, x, pos, gain=1.0):
        x = to_stereo(x)
        m = min(len(x), n_buf - pos)
        if m > 0:
            buses[bus][pos:pos + m] += gain * x[:m]

    print("mesures :", " ".join(f"{b}:{energy[b]}/{chords[b]}" for b in range(bars)))
    for b in range(bars):
        e, c, t0 = energy[b], chords[b], b * BAR
        u0 = (b - start[b]) / length[b]
        u1 = (b + 1 - start[b]) / length[b]
        last_of_section = b == start[b] + length[b] - 1
        full = e in ("drop", "outro")

        # --- pad
        if e == "intro":
            fc0, fc1, lvl, att = exp_interp(350, 800, u0), exp_interp(350, 800, u1), 1.0, 0.15
        elif e == "build":
            fc0, fc1, lvl, att = exp_interp(700, 3500, u0), exp_interp(700, 3500, u1), 0.7, 0.05
        elif e == "break":
            fc0, fc1, lvl, att = 800, 800, 0.95, 0.08
        else:
            fc0, fc1, lvl, att = 1600, 1600, 0.55, 0.03
        put("pad", syn.pad_bar(c, fc0, fc1, att), t0, lvl)

        # --- batterie
        build_end = e == "build" and last_of_section
        if e in ("build", "drop", "outro"):
            beats = [0, 4, 8] if build_end else [0, 4, 8, 12]
            for s in beats:
                put("kick", kit.kick, t0 + s * STEP, 0.85 if e == "build" else 1.0)
                triggers.append((t0 + s * STEP, 1.0))
        else:
            for s in (0, 4, 8, 12):  # pulsation fantôme très douce sur le pad
                triggers.append((t0 + s * STEP, 0.25))
        if full:
            for s in (4, 12):
                put("clap", kit.clap, t0 + s * STEP)
        if build_end:  # roulement de clap qui monte vers le drop
            roll = [8, 10, 12, 13, 14, 15]
            for i, s in enumerate(roll):
                put("clap", kit.clap, t0 + s * STEP, 0.25 + 0.45 * i / (len(roll) - 1))
        swing = int(0.08 * STEP)
        if e == "intro":
            for i, s in enumerate((2, 6, 10, 14)):
                put("hat", kit.hats_c[i % 4], t0 + s * STEP, 0.5)
        elif e == "build":
            steps = range(16) if build_end else range(0, 16, 2)
            for s in steps:
                v = 0.3 + 0.4 * s / 15 if build_end else (0.55 if s % 4 == 2 else 0.3)
                put("hat", kit.hats_c[s % 4], t0 + s * STEP + (swing if s % 2 else 0), v)
        elif full:
            for s in range(16):
                if s % 4 == 2:
                    put("hat", kit.hats_o[(s // 4) % 2], t0 + s * STEP, 0.55)
                else:
                    v = 0.35 if s % 4 == 0 else (0.3 if s % 4 == 3 else 0.2)
                    put("hat", kit.hats_c[s % 4], t0 + s * STEP + (swing if s % 2 else 0), v)

        # --- basse (contretemps, octave sur le dernier)
        if e in ("build", "drop", "outro"):
            root = BASS_ROOT[c]
            octave = root[:-1] + str(int(root[-1]) + 1)
            if e == "build":
                hi, lo = exp_interp(300, 900, u0), exp_interp(180, 320, u0)
            else:
                hi, lo = 900, 320
            for s in (2, 6, 10, 14):
                if build_end and s >= 12:
                    continue
                note = octave if s == 14 else root
                put("bass", syn.bass(note, 1.6, round(hi), round(lo)), t0 + s * STEP)

        # --- stabs d'accords à contretemps
        if full:
            for s in (2, 6, 10, 14):
                put("stab", syn.stab(c, 1.0), t0 + s * STEP)

        # --- mélodie
        if e in ("drop", "outro", "break"):
            hi, lo, lvl = (1800, 600, 0.8) if e == "break" else (6000, 1500, 1.0 if e == "drop" else 0.85)
            for s, name, ln in MOTIF[c]:
                put("lead", syn.lead(name, ln, hi, lo), t0 + s * STEP, lvl)

        # --- transitions
        if e == "build" and last_of_section:
            nb = min(2, length[b]) * BAR
            put("riser", riser(rng, nb), t0 + BAR - nb)
        if full and b == start[b] and b != hit_bar:
            put("crash", kit.crash, t0, 0.8)
        if hit_bar is not None and b == hit_bar - 1 and e != "build":
            sw = kit.crash[: n_samples(1.0)][::-1]  # cymbale inversée qui aspire vers le hit
            put("crash", fade(sw, 0.0, 0.002), t0 + BAR - len(sw), 0.5)

    # --- hit final et accord de fin
    def big_hit(pos, groove_continues, scale=1.0):
        length_s = 2.0 if groove_continues else (n_total - pos) / SR + 0.5
        tau = 0.6 if groove_continues else 1.1
        put("hit", syn.hit_chord(length_s, tau), pos, scale)
        put("boom", Synths.boom(rng), pos, scale)
        put("crash", kit.crash, pos, 1.0 * scale)
        put("kick", kit.kick, pos)

    if hit_bar is not None:
        big_hit(hit_bar * BAR, groove_continues=hit_bar < bars)
    if button:
        pos = bars * BAR
        put("stab", syn.stab("F", 1.2), pos, 1.3)
        ring = syn.pad_bar("F", 1400, 600, 0.004)[: n_samples(1.2)]
        ring = fade(ring * np.exp(-time_axis(len(ring)) / 0.35)[:, None], 0.0, 0.2)
        put("pad", ring, pos, 0.7)
        put("bass", syn.bass("F2", 4, 700, 250), pos)
        put("kick", kit.kick, pos)
        put("crash", kit.crash, pos, 0.45)

    # --- sidechain, effets, somme
    shape = duck_curve(n_buf, triggers)
    g = {k: (1.0 - v * shape)[:, None] for k, v in DUCK.items()}
    pad = buses["pad"] * g["pad"]
    stab = buses["stab"] * g["stab"]
    bass = buses["bass"] * g["bass"]
    lead = buses["lead"] * g["lead"]
    sends += SEND["pad"] * pad + SEND["stab"] * stab + SEND["lead"] * lead
    sends += SEND["clap"] * buses["clap"] + SEND["hit"] * buses["hit"]
    sends = butter(sends, "high", 300, 2)
    ir = reverb_ir(rt60=1.8, predelay=0.02, damp_start=7000, damp_end=1800, seed=9, length=2.4)
    verb = convolve(sends, ir)[:n_buf] * g["reverb"]
    delay = pingpong(lead) * g["delay"]

    mix = (MIX["kick"] * buses["kick"] + MIX["clap"] * buses["clap"] + MIX["hat"] * buses["hat"]
           + MIX["crash"] * buses["crash"] + MIX["bass"] * bass + MIX["pad"] * pad
           + MIX["stab"] * stab + MIX["lead"] * lead + MIX["delay"] * MIX["lead"] * delay
           + MIX["reverb"] * verb + MIX["riser"] * buses["riser"] + MIX["hit"] * buses["hit"]
           + MIX["boom"] * buses["boom"])
    stems = {"kick": MIX["kick"] * buses["kick"], "clap": MIX["clap"] * buses["clap"],
             "hat": MIX["hat"] * buses["hat"], "bass": MIX["bass"] * bass, "pad": MIX["pad"] * pad,
             "stab": MIX["stab"] * stab, "lead": MIX["lead"] * lead,
             "fx": MIX["delay"] * MIX["lead"] * delay + MIX["reverb"] * verb,
             "crash": MIX["crash"] * buses["crash"], "riser": MIX["riser"] * buses["riser"],
             "hit": MIX["hit"] * buses["hit"] + MIX["boom"] * buses["boom"]}
    mix = mix[:n_total]
    return mix, {k: v[:n_total] for k, v in stems.items()}, dict(bars=bars, energy=energy, tail_s=tail_s)


def master(mix, tail_s):
    x = butter(mix, "high", 25, 2)
    x = x * db_to_lin(TARGET_LUFS - lufs(x))
    gr = 0.0
    for _ in range(4):
        y, gr = limiter(x, CEILING_DBTP)
        delta = TARGET_LUFS - lufs(y)
        if abs(delta) < 0.05:
            break
        x = x * db_to_lin(delta)
    fo = min(0.6, max(0.05, 0.6 * tail_s))
    y = fade(y, 0.002, fo)
    return y, gr


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    with open(sys.argv[1], encoding="utf-8") as fh:
        arr = json.load(fh)
    mix, stems, info = render(arr)
    y, gr = master(mix, info["tail_s"])
    q = write_wav(sys.argv[2], y, seed=4242)
    yq = q.astype(float) / 32768.0
    print(f"écrit {sys.argv[2]} : {len(q) / SR:.3f} s ({len(q)} éch.), "
          f"{lufs(yq):.2f} LUFS, crête {lin_to_db(np.max(np.abs(yq))):.2f} dBFS, "
          f"crête vraie {lin_to_db(true_peak(yq)):.2f} dBTP, réduction max du limiteur {gr:.2f} dB")
    if os.environ.get("MUSIC_DEBUG"):
        full = lufs(mix)
        for k, v in stems.items():
            print(f"  stem {k:6s} {lufs(v) - full:+6.1f} LU (relatif au mix)")
        for b in range(info["bars"]):
            seg = yq[b * BAR:(b + 1) * BAR]
            print(f"  mesure {b:2d} {info['energy'][b]:6s} {lufs(seg):6.1f} LUFS")


if __name__ == "__main__":
    main()
