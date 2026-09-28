"""Stories à la une Instagram de reviu (1080 x 1920) : une story par à la une."""
import sys, math, os
MODE = sys.argv[1] if len(sys.argv) > 1 else "local"
import build as B
from build import (T, HEAD, R, P, I, pill, check_list, page, doc, logo, c, g, width,
                   COBALT, STRONG, BRUME, INK, SOFT, MUTED, LINE, PERLE, GOLD, WHITE, PALE, GRAY_DARK)

SW, SH = 1080, 1920

def lines(text, size, weight, w):
    return max(1, math.ceil(width(text, size, weight) / (w * 0.97)))

def top(variant, icon, dark=False):
    """Logo à gauche, pictogramme de l'à la une à droite (rappel de la couverture)."""
    tile = f"icons/alaune-{icon}-{'blanc' if dark else 'cobalt'}.svg"
    return logo(80, 250, 58, variant) + I(920, 239, 80, tile)

def steps(y, items, dark=False, num_bg=COBALT, gap=40, tw=760, ts=36, ds=28):
    out = ""
    tcol, dcol = (WHITE, GRAY_DARK) if dark else (INK, SOFT)
    for i, (t, d) in enumerate(items):
        out += R(80, y, 76, 76, num_bg, 25)
        out += T(80, y + 13, 76, str(i + 1), 40, 800, WHITE if num_bg != GOLD else INK, 1.2, -0.03, "center")
        out += T(190, y + 2, tw, t, ts, 800, tcol, 1.2, -0.025)
        tl = lines(t, ts, 800, tw)
        dy = y + 2 + round(tl * ts * 1.2) + 10
        out += T(190, dy, tw, d, ds, 500, dcol, 1.4)
        y = dy + round(lines(d, ds, 500, tw) * ds * 1.4) + gap
    return out, y

def cta(y, text, bg, fg, center=True):
    o, w = pill(0, 0, text, 32, bg, fg, None, h=92, weight=700, pad=44)
    x = round((SW - w) / 2) if center else 80
    o, w = pill(x, y, text, 32, bg, fg, None, h=92, weight=700, pad=44)
    return o

def s_demo():
    i = top("couleur", "demo")
    i += HEAD(80, 380, 940, f"Comment ça<br>{c('marche')} {g('?')}", 120)
    i += P(80, 660, 920, 440, "etape-3.jpg", 44, "50% 58%")
    o, _ = steps(1150, [
        ("Posez-le sur votre comptoir", "Visible toute la journée, prêt à l’emploi."),
        ("Le client approche son téléphone", "Sans contact ou QR code, sans application."),
        ("Sa page d’avis Google s’ouvre", "Il note et publie en quelques secondes."),
    ], gap=34)
    return page(SW, SH, BRUME, i + o, "À la une 1 - Démo")

def s_offre():
    i = top("blanc-sur-cobalt", "offre", dark=True)
    i += HEAD(80, 380, 940, f"29,90 €,<br>une seule fois{g()}", 128, WHITE, 1.0, -0.04)
    i += check_list(80, 690, ["Le Présentoir Reviu, prêt à poser",
                              "Espace Reviu inclus : statistiques et lien modifiable",
                              "Livraison offerte en 3 à 5 jours",
                              "Satisfait ou remboursé 30 jours",
                              "Sans abonnement"], 34, WHITE, "icons/check-gold.svg", step=84, w=820)
    y = 1190
    i += R(80, y, 920, 250, WHITE, 36)
    i += T(120, y + 32, 840, "Prix dégressif, par présentoir", 26, 700, MUTED, 1.3)
    for k, (q, p) in enumerate([("1 à 2", "29,90 €"), ("3 à 4", "27,00 €"), ("5 et plus", "25,00 €")]):
        x = 120 + k * 290
        i += T(x, y + 88, 260, p, 52, 800, COBALT if k else INK, 1.1, -0.04)
        i += T(x, y + 160, 260, q, 26, 600, SOFT, 1.3)
    i += cta(1500, "Commander sur reviu.fr", WHITE, COBALT)
    return page(SW, SH, COBALT, i, "À la une 2 - Offre")

def s_faq():
    i = top("couleur", "faq")
    i += HEAD(80, 380, 940, f"Vos questions,<br>nos {c('réponses')}{g()}", 104)
    qa = [("Faut-il une application ?", "Non. Le client approche son téléphone ou scanne le QR code, c’est tout."),
          ("Ça marche sur tous les téléphones ?", "Oui. QR code sur tous, sans contact sur les iPhone récents et la plupart des Android."),
          ("Je peux changer de lien ?", "À tout moment, depuis votre espace Reviu, sans rien réimprimer."),
          ("Reviu filtre-t-il les avis négatifs ?", "Non. Tous vos clients accèdent à votre page d’avis : c’est la règle de Google, et ce qui rend vos avis crédibles.")]
    y, w = 640, 840
    for q, a in qa:
        ql, al = lines(q, 32, 800, w), lines(a, 27, 500, w)
        h = 36 + round(ql * 32 * 1.25) + 12 + round(al * 27 * 1.4) + 36
        i += R(80, y, 920, h, BRUME, 32)
        i += T(120, y + 36, w, q, 32, 800, INK, 1.25, -0.02)
        i += T(120, y + 36 + round(ql * 32 * 1.25) + 12, w, a, 27, 500, SOFT, 1.4)
        y += h + 20
    B.WARN.append(f"faq fin y={y}") if y > 1680 else None
    return page(SW, SH, WHITE, i, "À la une 3 - FAQ")

def s_metiers():
    i = top("couleur", "metiers")
    i += HEAD(80, 380, 940, f"Le bon moment,<br>par {c('métier')}{g()}", 110)
    i += T(80, 628, 900, "Demandez l’avis au pic de satisfaction du client : le présentoir est déjà là.", 30, 500, SOFT, 1.4)
    rows = [("Restaurant, café", "À l’addition"), ("Coiffeur, institut", "Au paiement"),
            ("Garage", "À la remise des clés"), ("Boulangerie, boutique", "À l’encaissement"),
            ("Hôtel", "Au départ, à la réception"), ("Cabinet dentaire", "Au secrétariat"),
            ("Salle de sport", "À la sortie de séance")]
    y = 790
    i += R(80, y, 920, len(rows) * 104 + 20, WHITE, 36)
    y += 10
    for k, (m, t) in enumerate(rows):
        if k:
            i += R(120, y, 840, 2, LINE)
        i += T(120, y + 30, 400, m, 30, 800, INK, 1.3, -0.02)
        i += T(520, y + 32, 440, t, 28, 600, COBALT, 1.3, 0, "right")
        y += 104
    i += T(80, y + 50, 920, "Un guide par métier sur reviu.fr/guides", 28, 600, MUTED, 1.3, 0, "center")
    return page(SW, SH, PERLE, i, "À la une 4 - Métiers")

def s_conseils():
    i = top("blanc-sur-encre", "conseils", dark=True)
    i += HEAD(80, 380, 940, f"3 conseils pour<br>plus d’avis Google{g()}", 100, WHITE)
    o, y = steps(700, [
        ("Demandez au bon moment", "Juste après le paiement, quand le client est satisfait. Le lendemain, l’envie est retombée."),
        ("Réduisez le geste au minimum", "Pas de recherche sur Google : le client approche son téléphone et laisse son avis."),
        ("Jamais de contrepartie", "Offrir un cadeau contre un avis est interdit par Google et peut faire supprimer vos avis."),
    ], dark=True, gap=64, ts=40, ds=31)
    i += o
    i += cta(1520, "Nos guides sur reviu.fr/guides", WHITE, INK)
    return page(SW, SH, INK, i, "À la une 5 - Conseils")

def s_qr():
    i = top("couleur", "qr")
    i += HEAD(80, 380, 940, f"Votre QR code<br>d’avis Google,<br>{c('gratuit')}{g()}", 110)
    i += T(80, 770, 900, "Pas encore de présentoir ? Commencez par un QR code à imprimer. Sans inscription.", 30, 500, SOFT, 1.4)
    i += R(80, 930, 920, 520, BRUME, 40)
    o, _ = steps(990, [
        ("Collez le lien de votre fiche", "Le lien d’avis de votre fiche Google."),
        ("Choisissez le format", "QR code seul, affiche ou format carré."),
        ("Téléchargez", "En PNG ou SVG, prêt à imprimer."),
    ], gap=30, tw=740)
    i += o.replace('left:80px;top:', 'left:120px;top:').replace('left:190px;', 'left:230px;')
    i += cta(1510, "reviu.fr/outils/qr-code-avis-google", COBALT, WHITE)
    return page(SW, SH, WHITE, i, "À la une 6 - QR gratuit")

def s_clients():
    i = top("couleur", "clients")
    i += HEAD(80, 380, 940, f"Ils ont adopté<br>le présentoir {c('Reviu')}{g()}", 96)
    i += R(80, 620, 920, 640, WHITE, 44, f"4px dashed {PALE}")
    i += T(80, 900, 920, "Photo du commerçant avec son présentoir", 30, 600, MUTED, 1.3, 0, "center")
    i += I(80, 1310, 300, "icons/stars-5-gold.svg")
    i += T(80, 1380, 920, "« Remplacez par la phrase du commerçant, en quelques mots. »", 40, 800, INK, 1.25, -0.02)
    i += T(80, 1530, 920, "Prénom · Commerce · Ville", 28, 600, MUTED, 1.3)
    return page(SW, SH, BRUME, i, "À la une 7 - Clients (modèle)")

STORIES = [s_demo, s_offre, s_faq, s_metiers, s_conseils, s_qr, s_clients]

LABELS = ["Démo", "Offre", "FAQ", "Métiers", "Conseils", "QR gratuit", "Clients"]
KEYS = ["demo", "offre", "faq", "metiers", "conseils", "qr", "clients"]

def covers_doc():
    """Couvertures 1080 x 1080 : fond cobalt modifiable + pictogramme centré."""
    pgs = [page(1080, 1080, COBALT, I(240, 240, 600, f"icons/alaune-{k}-picto.svg"), f"Couverture {n + 1} - {LABELS[n]}")
           for n, k in enumerate(KEYS)]
    return doc(pgs, "reviu - Couvertures à la une")

if __name__ == "__main__":
    out = "site/canva" if MODE == "local" else sys.argv[3]
    os.makedirs(out, exist_ok=True)
    open(f"{out}/stories-a-la-une.html", "w").write(doc([f() for f in STORIES], "reviu - Stories à la une"))
    open(f"{out}/couvertures-a-la-une.html", "w").write(covers_doc())
    print("ok")
    for w_ in B.WARN:
        print("ATTENTION", w_)
