import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import type { AdProps } from "./A1Geste";

/** A2 Vous connaissez la suite (amorce, a remplacer). */
export const A2_DURATION = 630;

export const A2Suite: React.FC<AdProps> = () => <AbsoluteFill style={{ background: C.brume }} />;
