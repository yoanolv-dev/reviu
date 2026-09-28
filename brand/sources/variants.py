"""SVG des usages interdits du logo (page « À éviter » de la charte)."""
from logo import *
import re

def base(**kw):
    return lockup_h(mark=200, mark_dot=None, **kw)

def wrap(inner_svg, w, h, transform, W, H):
    body = re.sub(r'^<svg[^>]*>|</svg>$', '', inner_svg)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" width="{W:.0f}" height="{H:.0f}"><g transform="{transform}">{body}</g></svg>'

out = {}
s, w, h = base()
out['interdit-deforme'] = wrap(s, w, h, 'scale(1.35 0.72)', w * 1.35, h * 0.72)
s2, _, _ = lockup_h(mark=200, mark_dot=None, word_color='#7C3AED', dot_color='#16A34A', mark_bg='#16A34A')
out['interdit-couleurs'] = s2
import math
a = math.radians(-12)
W = w * math.cos(-a) + h * math.sin(-a); H = w * math.sin(-a) + h * math.cos(-a)
out['interdit-incline'] = wrap(s, w, h, f'translate({W/2:.1f} {H/2:.1f}) rotate(-12) translate({-w/2:.1f} {-h/2:.1f})', W, H)
out['interdit-contour'] = s.replace(f'fill="{INK}"/>', f'fill="#FFFFFF" stroke="{INK}" stroke-width="34"/>')
# recomposé : monogramme à droite du wordmark, point doré retiré du i et replacé sur le carré
wg, ww, wh = wordmark_group(200 * 0.5 / wordmark_metrics()["xh"], 0, 20, INK, INK)
out['interdit-recompose'] = svg(ww + 60 + 200, 200, wg + mark_group(200, ww + 60, 0, COBALT, WHITE, GOLD))
out['interdit-contraste'] = s
for k, v in out.items():
    open(f'out/icons/{k}.svg', 'w').write(v)
print(list(out))
