import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "../theme";
import type { AdProps } from "./A1Geste";

/** Coupe de 15 s de A1 (amorce, a remplacer). */
export const A1C_DURATION = 450;

export const A1Court: React.FC<AdProps> = () => <AbsoluteFill style={{ background: C.brume }} />;
