import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import type { AdProps } from "./A1Geste";

/** A3 Le chemin trop long (amorce, a remplacer). */
export const A3_DURATION = 600;

export const A3Chemin: React.FC<AdProps> = () => <AbsoluteFill style={{ background: C.brume }} />;
