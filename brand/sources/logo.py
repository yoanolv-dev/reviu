"""Générateur du logo reviu : wordmark vectorisé (Plus Jakarta Sans) + monogramme."""
import json
import uharfbuzz as hb

COBALT = "#1B4DFF"
INK = "#0A0D16"
GOLD = "#FBBC04"
WHITE = "#FFFFFF"

# Monogramme « r » du site (viewBox 48, carré 40x40 décalé de 4) ramené à un repère 40x40.
R_PATH = "M14 31V12.5h5.4v3.1c1.2-2.2 3.3-3.4 6.1-3.4.6 0 1.1.05 1.6.15v5.1c-.7-.2-1.4-.3-2.2-.3-3.3 0-5.5 2-5.5 5.6V31H14Z"
MARK_DOT = (29.5, 10.5, 3.6)  # cx, cy, r dans le repère 40x40


def _shape(text, wght):
    blob = hb.Blob.from_file_path("ttf/PlusJakartaSans[wght].ttf")
    font = hb.Font(hb.Face(blob))
    font.set_variations({"wght": wght})
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True})
    return [p.x_advance for p in buf.glyph_positions]


def wordmark(wght=700, tracking=-18, dot_scale=1.22):
    """Renvoie (paths, dot, width, top, bottom) en unités de police (y vers le haut)."""
    data = json.load(open(f"pjs{wght}.json"))
    g = data["glyphs"]
    chars = ["r", "e", "v", "ı", "u"]
    advs = _shape("revıu", wght)
    x = 0
    parts = []
    dot = None
    for ch, adv in zip(chars, advs):
        parts.append((x, g[ch]["d"]))
        if ch == "ı":
            b = g["ı"]["bounds"]
            d = data["idot"]
            cx = x + (b[0] + b[2]) / 2
            cy = (d[1] + d[3]) / 2
            r = (d[3] - d[1]) / 2 * dot_scale
            dot = (cx, cy, r)
        x += adv + tracking
    x -= tracking
    last = g["u"]["bounds"]
    width = x - (advs[-1] - last[2])  # bord droit réel du « u »
    left = g["r"]["bounds"][0]
    top = max(745, dot[1] + dot[2])
    return parts, dot, left, width, top, -12


def wordmark_group(scale, ox, oy, color, dot_color, wght=700):
    """Groupe SVG du wordmark ; (ox, oy) = coin haut-gauche de la boîte visuelle."""
    parts, dot, left, right, top, bottom = wordmark(wght)
    s = scale
    out = [f'<g transform="translate({ox - left*s:.3f} {oy + top*s:.3f}) scale({s:.6f} {-s:.6f})">']
    for x, d in parts:
        out.append(f'<path transform="translate({x} 0)" d="{d}" fill="{color}"/>')
    out.append(f'<circle cx="{dot[0]:.2f}" cy="{dot[1]:.2f}" r="{dot[2]:.2f}" fill="{dot_color}"/>')
    out.append("</g>")
    w = (right - left) * s
    h = (top - bottom) * s
    return "\n".join(out), w, h


def wordmark_metrics(wght=700):
    parts, dot, left, right, top, bottom = wordmark(wght)
    return dict(left=left, right=right, top=top, bottom=bottom, xh=json.load(open(f"pjs{wght}.json"))["xHeight"])


def mark_group(size, ox, oy, bg=COBALT, fg=WHITE, dot=GOLD, rx_ratio=13/40):
    s = size / 40
    out = [f'<g transform="translate({ox:.3f} {oy:.3f}) scale({s:.6f})">',
           f'<rect width="40" height="40" rx="{40*rx_ratio:.3f}" fill="{bg}"/>',
           f'<path d="{R_PATH}" fill="{fg}"/>']
    if dot:
        cx, cy, r = MARK_DOT
        out.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{dot}"/>')
    out.append("</g>")
    return "\n".join(out)


def svg(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.2f} {h:.2f}" width="{w:.0f}" height="{h:.0f}">{rect}{body}</svg>'


def lockup_h(mark=100, word_color=INK, dot_color=GOLD, mark_bg=COBALT, mark_fg=WHITE, mark_dot=GOLD, wght=700, pad=0, bg=None, gap_ratio=0.30, xh_ratio=0.50):
    """Logo horizontal : monogramme + wordmark. xh_ratio = hauteur d'x / hauteur du carré."""
    m = wordmark_metrics(wght)
    s = mark * xh_ratio / m["xh"]
    word_w = (m["right"] - m["left"]) * s
    gap = mark * gap_ratio
    # centre optique : la bande de hauteur d'x centrée sur le carré, légèrement remontée
    baseline_y = pad + mark / 2 + m["xh"] * s / 2 + mark * 0.02
    oy = baseline_y - m["top"] * s
    wg, _, _ = wordmark_group(s, pad + mark + gap, oy, word_color, dot_color, wght)
    W = pad * 2 + mark + gap + word_w
    H = pad * 2 + mark
    body = mark_group(mark, pad, pad, mark_bg, mark_fg, mark_dot) + wg
    return svg(W, H, body, bg), W, H


def lockup_v(mark=100, word_color=INK, dot_color=GOLD, mark_bg=COBALT, mark_fg=WHITE, mark_dot=GOLD, wght=700, pad=0, bg=None, word_ratio=1.6):
    m = wordmark_metrics(wght)
    word_w = mark * word_ratio
    s = word_w / (m["right"] - m["left"])
    word_h = (m["top"] - m["bottom"]) * s
    gap = mark * 0.30
    W = pad * 2 + max(mark, word_w)
    H = pad * 2 + mark + gap + word_h
    mx = (W - mark) / 2
    wg, _, _ = wordmark_group(s, (W - word_w) / 2, pad + mark + gap, word_color, dot_color, wght)
    body = mark_group(mark, mx, pad, mark_bg, mark_fg, mark_dot) + wg
    return svg(W, H, body, bg), W, H


def wordmark_only(height=100, color=INK, dot_color=GOLD, wght=700, pad=0, bg=None):
    m = wordmark_metrics(wght)
    s = height / (m["top"] - m["bottom"])
    wg, w, h = wordmark_group(s, pad, pad, color, dot_color, wght)
    return svg(w + 2 * pad, h + 2 * pad, wg, bg), w + 2 * pad, h + 2 * pad


def mark_only(size=100, bg=COBALT, fg=WHITE, dot=GOLD, pad=0, page_bg=None):
    return svg(size + 2 * pad, size + 2 * pad, mark_group(size, pad, pad, bg, fg, dot), page_bg)
