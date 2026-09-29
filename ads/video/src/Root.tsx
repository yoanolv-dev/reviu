import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { fontsReady } from "./fonts";
import { VIDEO } from "./theme";
import { A1Geste, A1_DURATION, AdProps } from "./ads/A1Geste";
import { A1Court, A1C_DURATION } from "./ads/A1Court";
import { A2Suite, A2_DURATION } from "./ads/A2Suite";
import { A3Chemin, A3_DURATION } from "./ads/A3Chemin";
import { A4Prix, A4_DURATION } from "./ads/A4Prix";

const handle = delayRender("polices");
fontsReady.then(() => continueRender(handle));

const base: AdProps = { hook: "H1", logoFlou: false, safeZones: false, posterFrame: 60 };
const check: AdProps = { ...base, safeZones: true };

/**
 * Nommage des compositions : Reviu-<angle>-<hook>-<duree>-<format>.
 * Seules les compositions "Reviu-..." sont exportees par scripts/render-all.mjs ;
 * les "Check-..." affichent les zones sures (controle uniquement).
 */
export const Root: React.FC = () => (
  <>
    <Composition id="Reviu-A1-H1-24s-916" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={base} />
    <Composition id="Reviu-A1-H2-24s-916" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, hook: "H2" }} />
    <Composition id="Reviu-A1-H3-24s-916" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, hook: "H3" }} />
    <Composition id="Reviu-A1-H1-24s-916-LogoFlou" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, logoFlou: true }} />
    <Composition id="Reviu-A1-H1-15s-916" component={A1Court} durationInFrames={A1C_DURATION} {...VIDEO} defaultProps={base} />
    <Composition id="Reviu-A2-H2-21s-916" component={A2Suite} durationInFrames={A2_DURATION} {...VIDEO} defaultProps={{ ...base, hook: "H2" }} />
    <Composition id="Reviu-A3-H1-20s-916" component={A3Chemin} durationInFrames={A3_DURATION} {...VIDEO} defaultProps={base} />
    <Composition id="Reviu-A4-H1-15s-916" component={A4Prix} durationInFrames={A4_DURATION} {...VIDEO} defaultProps={base} />

    <Composition id="Check-A1" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={check} />
    <Composition id="Check-A1C" component={A1Court} durationInFrames={A1C_DURATION} {...VIDEO} defaultProps={check} />
    <Composition id="Check-A2" component={A2Suite} durationInFrames={A2_DURATION} {...VIDEO} defaultProps={{ ...check, hook: "H2" }} />
    <Composition id="Check-A3" component={A3Chemin} durationInFrames={A3_DURATION} {...VIDEO} defaultProps={check} />
    <Composition id="Check-A4" component={A4Prix} durationInFrames={A4_DURATION} {...VIDEO} defaultProps={check} />
  </>
);
