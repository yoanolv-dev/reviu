"""Pictogrammes des stories à la une (trait blanc, repère 48 x 48)."""
from logo import COBALT, WHITE, GOLD, INK
STAR = "M12 2.5l2.6 5.85 6.4.56-4.85 4.2 1.46 6.24L12 16.9l-5.61 2.45 1.46-6.24L3 8.91l6.4-.56L12 2.5z"

def glyphs(fg, accent):
    s = f'fill="none" stroke="{fg}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"'
    return {
        "demo": f'<g {s}><rect x="9" y="8" width="16" height="32" rx="4"/><path d="M15 34.5h4"/><path d="M30.5 18.5c2.4 3.3 2.4 7.7 0 11"/><path d="M35.5 14.5c4.3 5.6 4.3 13.4 0 19"/></g>',
        "offre": f'<g {s}><path d="M25 8h11a4 4 0 0 1 4 4v11L23.8 39.2a3 3 0 0 1-4.2 0L8.8 28.4a3 3 0 0 1 0-4.2L25 8z"/></g><circle cx="32.5" cy="15.5" r="2.6" fill="{fg}"/>',
        "faq": f'<g {s}><path d="M11 9h26a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H23l-8 6.5V33h-4a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4z"/><path d="M20.3 17.2a3.9 3.9 0 1 1 5.3 3.6c-1.1.5-1.6 1.3-1.6 2.4v.5"/></g><circle cx="24" cy="28" r="1.9" fill="{fg}"/>',
        "metiers": f'<g {s}><path d="M8 18l3.2-8h25.6L40 18"/><path d="M8 18a4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 8 0 4 4 0 0 0 8 0"/><path d="M11 22v17h26V22"/><path d="M20.5 39v-9h7v9"/></g>',
        "conseils": f'<g {s}><path d="M24 7.5a11.5 11.5 0 0 0-6.8 20.8c1 .8 1.6 2 1.6 3.3V33h10.4v-1.4c0-1.3.6-2.5 1.6-3.3A11.5 11.5 0 0 0 24 7.5z"/><path d="M19.5 37.5h9"/><path d="M21.5 41.5h5"/></g>',
        "qr": f'<g {s}><rect x="9" y="9" width="11" height="11" rx="2"/><rect x="28" y="9" width="11" height="11" rx="2"/><rect x="9" y="28" width="11" height="11" rx="2"/></g><g fill="{fg}"><rect x="13" y="13" width="3" height="3" rx=".6"/><rect x="32" y="13" width="3" height="3" rx=".6"/><rect x="13" y="32" width="3" height="3" rx=".6"/><rect x="28" y="28" width="4.5" height="4.5" rx="1"/><rect x="34.5" y="28" width="4.5" height="4.5" rx="1"/><rect x="31.2" y="34.5" width="4.5" height="4.5" rx="1"/></g>',
        "clients": f'<path transform="translate(1.2 3.3) scale(1.9)" d="{STAR}" fill="{accent}"/>',
    }

NAMES = ["demo", "offre", "faq", "metiers", "conseils", "qr", "clients"]

def tile(name, size=48, bg=COBALT, fg=WHITE, accent=GOLD, radius=15.6):
    g = glyphs(fg, accent)[name]
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="{size}" height="{size}"><rect width="48" height="48" rx="{radius}" fill="{bg}"/>{g}</svg>'

def cover(name, bg=COBALT, fg=WHITE, accent=GOLD):
    """Couverture carrée 1080 : pictogramme centré, lisible une fois rogné en cercle."""
    g = glyphs(fg, accent)[name]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="1080" height="1080">'
            f'<rect width="1080" height="1080" fill="{bg}"/><g transform="translate(240 240) scale(12.5)">{g}</g></svg>')

if __name__ == "__main__":
    import os
    os.makedirs("out/alaune", exist_ok=True)
    for n in NAMES:
        open(f"out/alaune/couverture-{n}.svg", "w").write(cover(n))
        open(f"out/icons/alaune-{n}-cobalt.svg", "w").write(tile(n, 192))
        open(f"out/icons/alaune-{n}-blanc.svg", "w").write(tile(n, 192, bg=WHITE, fg=COBALT))
    print("ok")
