"""Textes vectorisés en Plus Jakarta Sans (spécimen de la page Typographie)."""
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

def text_svg(text, wght, size, color, ls=0.0):
    font = TTFont(f"static/PlusJakartaSans-{ {500:'Medium',600:'SemiBold',700:'Bold',800:'ExtraBold'}[wght] }.ttf")
    upm = font["head"].unitsPerEm
    gs = font.getGlyphSet(); order = font.getGlyphOrder()
    blob = hb.Blob.from_file_path(f"static/PlusJakartaSans-{ {500:'Medium',600:'SemiBold',700:'Bold',800:'ExtraBold'}[wght] }.ttf")
    f = hb.Font(hb.Face(blob)); buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(f, buf, {"kern": True})
    x = 0; paths = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        pen = SVGPathPen(gs); gs[order[info.codepoint]].draw(pen)
        d = pen.getCommands()
        if d:
            paths.append(f'<path transform="translate({x + pos.x_offset} 0)" d="{d}"/>')
        x += pos.x_advance + ls * upm
    x -= ls * upm
    asc, desc = font["hhea"].ascent, font["hhea"].descent
    s = size / upm
    W, H = x * s, (asc - desc) * s
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" width="{W:.0f}" height="{H:.0f}">'
            f'<g transform="translate(0 {asc * s:.2f}) scale({s:.5f} {-s:.5f})" fill="{color}">{"".join(paths)}</g></svg>'), W, H

if __name__ == "__main__":
    for name, (t, w, sz, col, ls) in {
        "specimen-pjs-aa": ("Aa", 800, 400, "#0A0D16", -0.05),
        "specimen-pjs-nom": ("Plus Jakarta Sans", 800, 100, "#0A0D16", -0.03),
        "specimen-pjs-alphabet": ("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 600, 60, "#333A49", 0.02),
        "specimen-pjs-alphabet-bas": ("abcdefghijklmnopqrstuvwxyz 0123456789", 600, 60, "#333A49", 0.02),
    }.items():
        svg, W, H = text_svg(t, w, sz, col, ls)
        open(f"out/icons/{name}.svg", "w").write(svg)
        print(name, round(W), round(H))
