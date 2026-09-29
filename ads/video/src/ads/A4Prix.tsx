import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import type { AdProps } from "./A1Geste";

/** A4 29,90 EUR une fois (amorce, a remplacer). */
export const A4_DURATION = 450;

export const A4Prix: React.FC<AdProps> = () => <AbsoluteFill style={{ background: C.brume }} />;
