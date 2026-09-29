import React from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { fontsReady } from "./fonts";
import { VIDEO } from "./theme";
import { Lab } from "./Lab";
import { Lab2 } from "./Lab2";

const handle = delayRender("polices");
fontsReady.then(() => continueRender(handle));

export const Root: React.FC = () => (
  <>
    <Composition id="Lab" component={Lab} durationInFrames={90} {...VIDEO} />
    <Composition id="Lab2" component={Lab2} durationInFrames={90} {...VIDEO} />
  </>
);
