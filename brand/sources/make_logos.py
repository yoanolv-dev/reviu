from logo import *
from kit import STAR
V = {}
# Logo principal horizontal
V['reviu-logo-horizontal-couleur'] = lockup_h(mark=200, mark_dot=None)[0]
V['reviu-logo-horizontal-blanc-sur-cobalt'] = lockup_h(mark=200, word_color=WHITE, mark_bg=WHITE, mark_fg=COBALT, mark_dot=None)[0]
V['reviu-logo-horizontal-blanc-sur-encre'] = lockup_h(mark=200, word_color=WHITE, mark_dot=None)[0]
V['reviu-logo-horizontal-noir'] = lockup_h(mark=200, word_color=INK, dot_color=INK, mark_bg=INK, mark_fg=WHITE, mark_dot=None)[0]
V['reviu-logo-horizontal-blanc'] = lockup_h(mark=200, word_color=WHITE, dot_color=WHITE, mark_bg=WHITE, mark_fg=INK, mark_dot=None)[0]
# Vertical
V['reviu-logo-vertical-couleur'] = lockup_v(mark=240, mark_dot=None)[0]
V['reviu-logo-vertical-blanc-sur-cobalt'] = lockup_v(mark=240, word_color=WHITE, mark_bg=WHITE, mark_fg=COBALT, mark_dot=None)[0]
# Wordmark
V['reviu-wordmark-couleur'] = wordmark_only(200)[0]
V['reviu-wordmark-blanc'] = wordmark_only(200, color=WHITE)[0]
V['reviu-wordmark-noir'] = wordmark_only(200, color=INK, dot_color=INK)[0]
# Monogramme / icône (avec point doré)
V['reviu-monogramme-cobalt'] = mark_only(400)
V['reviu-monogramme-blanc'] = mark_only(400, bg=WHITE, fg=COBALT)
V['reviu-monogramme-encre'] = mark_only(400, bg=INK, fg=WHITE)
V['reviu-avatar-reseaux'] = svg(1080, 1080, f'<rect width="1080" height="1080" fill="{COBALT}"/>' + f'<g transform="translate(69 161) scale(20)"><path d="{R_PATH}" fill="#fff"/><circle cx="29.5" cy="10.5" r="3.6" fill="{GOLD}"/></g>')
for k, s in V.items():
    open(f'out/logo/svg/{k}.svg', 'w').write(s)
# Icônes utilitaires pour les gabarits
icons = {
 'check-cobalt': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><circle cx="12" cy="12" r="12" fill="{COBALT}"/><path d="M7 12.4l3.2 3.1L17 8.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'check-gold': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><circle cx="12" cy="12" r="12" fill="{GOLD}"/><path d="M7 12.4l3.2 3.1L17 8.8" fill="none" stroke="{INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'check-white': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M7 12.4l3.2 3.1L17 8.8" fill="none" stroke="{COBALT}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'cross-muted': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96"><circle cx="12" cy="12" r="12" fill="#E6E8EF"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke="#6B7382" stroke-width="2.2" stroke-linecap="round"/></svg>',
 'star-gold': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="2.5 2 19 18" width="190" height="180"><path d="{STAR}" fill="{GOLD}"/></svg>',
 'stars-5-gold': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 20" width="1100" height="200">' + ''.join(f'<path transform="translate({i*22.75-2.5} -2)" d="{STAR}" fill="{GOLD}"/>' for i in range(5)) + '</svg>',
 'dot-gold': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="200" height="200"><circle cx="10" cy="10" r="10" fill="{GOLD}"/></svg>',
 'nfc-cobalt': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="192" height="192"><rect width="48" height="48" rx="15.6" fill="{COBALT}"/><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M17 17.5c2.6 3.8 2.6 9.2 0 13"/><path d="M22.5 13.5c4.4 6.2 4.4 14.8 0 21"/><path d="M28 9.5c6.2 8.6 6.2 20.4 0 29"/></g></svg>',
 'qr-cobalt': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="192" height="192"><rect width="48" height="48" rx="15.6" fill="{COBALT}"/><g fill="#fff"><path d="M12 12h10v10H12zM26 12h10v10H26zM12 26h10v10H12z" fill="none" stroke="#fff" stroke-width="2.6"/><rect x="15.5" y="15.5" width="3" height="3"/><rect x="29.5" y="15.5" width="3" height="3"/><rect x="15.5" y="29.5" width="3" height="3"/><rect x="26" y="26" width="4" height="4"/><rect x="32" y="26" width="4" height="4"/><rect x="29" y="30" width="3" height="3"/><rect x="26" y="33" width="4" height="3"/><rect x="32" y="32" width="4" height="4"/></g></svg>',
 'phone-cobalt': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="192" height="192"><rect width="48" height="48" rx="15.6" fill="{COBALT}"/><rect x="16" y="10" width="16" height="28" rx="4" fill="none" stroke="#fff" stroke-width="2.6"/><path d="M21.5 33.5h5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
 'star-badge-cobalt': f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="192" height="192"><rect width="48" height="48" rx="15.6" fill="{COBALT}"/><path transform="translate(9 9) scale(1.25)" d="{STAR}" fill="{GOLD}"/></svg>',
}
for k, s in icons.items():
    open(f'out/icons/{k}.svg', 'w').write(s)
print(len(V), len(icons))
