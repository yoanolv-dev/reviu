import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { fontsReady } from "./fonts";
import { VIDEO } from "./theme";
import { A1Geste, A1_DURATION, AdProps } from "./ads/A1Geste";

const handle = delayRender("polices");
fontsReady.then(() => continueRender(handle));

const base: AdProps = { hook: "H1", logoFlou: false, safeZones: false, posterFrame: 60 };

/**
 * Nommage des compositions : Reviu-<angle>-<hook>-<duree>-<format>.
 * Seules les compositions "Reviu-..." sont exportees par scripts/render-all.mjs.
 */
export const Root: React.FC = () => (
  <>
    <Composition id="Reviu-A1-H1-24s-916" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={base} />
    <Composition id="Reviu-A1-H2-24s-916" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, hook: "H2" }} />
    <Composition id="Reviu-A1-H3-24s-916" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, hook: "H3" }} />
    <Composition id="Reviu-A1-H1-24s-916-LogoFlou" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, logoFlou: true }} />
    <Composition id="Check-A1" component={A1Geste} durationInFrames={A1_DURATION} {...VIDEO} defaultProps={{ ...base, safeZones: true }} />
  </>
);
