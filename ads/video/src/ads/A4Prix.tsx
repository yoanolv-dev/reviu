import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, EASE } from "../theme";
import { prog } from "../lib/anim";
import { FaceVariant } from "../components/Presentoir3D";
import { Grain, SafeZones } from "../components/Bits";
import { Mention } from "../components/Legal";
import { SfxTrack } from "../components/Sfx";
import { A4_HOOK, A4Hook } from "../scenes/A4Hook";
import { A4_DEMO, A4Demo } from "../scenes/A4Demo";
import { A4_INCLUS, A4Inclus } from "../scenes/A4Inclus";
import { A4Fin } from "../scenes/A4Fin";
import type { AdProps } from "./A1Geste";

/**
 * A4 "29,90 €. Une fois." (offre d'abord, Stories et reciblage) : 15 s,
 * 450 frames, 7,5 mesures a 120 BPM. Coupes sur les temps : 60, 165, 300.
 *
 *   0-60    accroche cobalt : "29,90 €" et "Une fois." deja poses a la frame 0,
 *           pastille "Sans abonnement" sur le temps 15, presentoir de 3/4.
 *   60-165  mini-demo au comptoir : contact 90, banniere 94, le doigt la touche
 *           a 120, page d’avis a 126 (etoiles vides, rien n’est publie).
 *           "Un geste, votre page d’avis Google s’ouvre." (62 a 165, 103 frames
 *           pour 92 requises).
 *   165-300 5 pastilles, une par temps (165, 180, 195, 210, 225), poussee de
 *           camera, vague de rappel (243 a 252), garantie mise en avant a 255.
 *   300-450 carte de fin (A4Fin, copie de EndCard aux sons ajustes), entree avancee
 *           de 8 frames (logo, nom et prix poses sur le coup final de la musique a
 *           300), pastille "30 jours" 314, CTA 320.
 *
 * Retire : l'apercu de l'Espace Reviu (sa mention "Aperçu. Chiffres d’exemple."
 * demande 90 frames et aucun emplacement de bandeau n'est libre a 15 s). L'Espace
 * et le lien modifiable restent annonces par deux pastilles.
 *
 * Derogation a faire valider par ecrit par le client (brief 5.0 et 9.5) : pas de
 * bandeau "Scène reconstituée. Avis fictif." sur la mini-demo. Motif : aucun avis
 * n'est ecrit ni publie (maquette generique, etoiles vides, "Publier" grise), et un
 * 2e bandeau couvrirait la page ouverte. Si elle est refusee : passer a une coupe
 * de 17 s, ne pas ajouter de 3e bandeau.
 *
 * Plan des bandeaux (deux emplacements ; jamais deux bandeaux dans le meme
 * emplacement au meme moment ; un seul bandeau sur la demo) :
 *   bas (lift 0, y 1147 a 1248)
 *     -6 a 165  independance de Google, encre sur le cobalt puis blanche a 60 :
 *               opaque de 0 a 159 (160 frames, 150 requises pour 2 lignes),
 *               seul bandeau pendant toute la demo ; le telephone reste cache
 *               derriere (son bas ne ressort jamais sous y 1248).
 *     165-fin   TVA + livraison (blanche) : avant "Livraison offerte" (210) et
 *               sous le prix de la carte de fin jusqu'a la derniere image.
 *   lift 109 (y 1038 a 1139)
 *     -6 a 60   TVA + livraison (encre) sous le prix de l'accroche, opaque de la
 *               frame 0 a la frame 59, coupee net avec l'image a 60 (le prix est a
 *               l'ecran de 0 a 59 ; il revient a 300, TVA en place depuis 171).
 *     60-219    vide (la demo n'a qu'un bandeau).
 *     219-fin   "*Conditions : reviu.fr/cgv", opaque a 225 avec la pastille
 *               "30 jours satisfait ou remboursé*", jusqu'a la fin.
 * Les textes des scenes restent au-dessus de y 1038 (accroche : produit <= ~1008).
 *
 * Vignette : posterFrame 60 (Root.tsx, fichier partage) tombe sur la coupe ;
 * demander posterFrame 45 pour Reviu-A4 (offre entiere, pastille posee).
 */
export const A4_DURATION = 450;

const CUT = {
  demo: A4_HOOK.duration,
  inclus: A4_HOOK.duration + A4_DEMO.duration,
  end: A4_HOOK.duration + A4_DEMO.duration + A4_INCLUS.duration,
} as const;

/** Entree de scene sur le temps : leger zoom qui se pose (copie de A1Geste). */
const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const t = prog(f, 0, 8, EASE.enter);
  return <AbsoluteFill style={{ transform: `scale(${1.03 - 0.03 * t})` }}>{children}</AbsoluteFill>;
};

/** Musique : 8 mesures (16 s) coupees a 15 s, fondu sur les 12 dernieres frames. */
const FADE_FROM = A4_DURATION - 12;
const musicVolume = (f: number) => {
  // Legere baisse sous le geste (contact, banniere, toucher, page) pour que les
  // sons du telephone passent devant le drop.
  const g0 = CUT.demo + A4_DEMO.contact - 6;
  const g1 = CUT.demo + A4_DEMO.sheetAt + 14;
  const duck = 1 - 0.25 * Math.min(prog(f, g0, 6, EASE.inOut), 1 - prog(f, g1, 10, EASE.inOut));
  const fade = Math.min(1, Math.max(0, (A4_DURATION - 1 - f) / (A4_DURATION - 1 - FADE_FROM))) ** 2;
  return 0.75 * duck * fade;
};

const TVA = "TVA non applicable, art.\u00a0293\u00a0B du CGI.\nLivraison offerte en France métropolitaine.";

export const A4Prix: React.FC<AdProps> = ({ logoFlou, safeZones }) => {
  const frame = useCurrentFrame();
  return (
    <FaceVariant.Provider value={logoFlou ? "logoFlou" : "standard"}>
      <AbsoluteFill style={{ background: C.white }}>
        <Sequence durationInFrames={CUT.demo} name="1 Prix (accroche)">
          <A4Hook />
        </Sequence>
        <Sequence from={CUT.demo} durationInFrames={A4_DEMO.duration} name="2 Geste">
          <Punch>
            <A4Demo />
          </Punch>
        </Sequence>
        <Sequence from={CUT.inclus} durationInFrames={A4_INCLUS.duration} name="3 Tout est inclus">
          <Punch>
            <A4Inclus />
          </Punch>
        </Sequence>
        <Sequence from={CUT.end} durationInFrames={A4_DURATION - CUT.end} name="4 Fin">
          <Punch>
            {/* Entree avancee de 8 frames : la carte est deja posee sur le coup final. */}
            <Sequence from={-8}>
              <A4Fin />
            </Sequence>
          </Punch>
        </Sequence>

        {/* Emplacement bas */}
        <Mention
          from={-6}
          to={CUT.inclus - 6}
          dark={frame < CUT.demo}
          text={"Reviu est un service indépendant de Google.\nGoogle est une marque de Google LLC."}
        />
        <Mention from={CUT.inclus} to={A4_DURATION + 10} text={TVA} />
        {/* Emplacement lift 109 */}
        <Sequence durationInFrames={CUT.demo} layout="none" name="TVA accroche">
          {/* Coupee net avec l'image a 60 : pleine opacite tant que le prix est la. */}
          <Mention from={-6} to={CUT.demo + 30} lift={109} dark text={TVA} />
        </Sequence>
        <Mention from={219} to={A4_DURATION + 10} lift={109} text={"*Conditions\u00a0: reviu.fr/cgv"} />

        <Grain opacity={0.035} />
        {safeZones && <SafeZones />}

        <Audio src={staticFile("audio/music/a4.wav")} volume={musicVolume} />
        <SfxTrack
          cues={[
            ["whoosh", CUT.demo, 0.55],
            ["whoosh-short", CUT.inclus, 0.45],
            ["whoosh", CUT.end, 0.45],
          ]}
        />
      </AbsoluteFill>
    </FaceVariant.Provider>
  );
};
