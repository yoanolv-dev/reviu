import QRCode from "qrcode";
import { REDIRECT_BASE } from "./brand";

/** URL physique d'un présentoir, avec canal optionnel (nfc|qr) pour l'attribution. */
export function standUrl(code: string, channel?: "nfc" | "qr") {
  const url = `${REDIRECT_BASE}/${code}`;
  return channel ? `${url}?s=${channel}` : url;
}

/** QR code vectoriel (SVG) encodant l'URL du présentoir - prêt pour le fournisseur. */
export async function qrSvg(code: string): Promise<string> {
  return QRCode.toString(standUrl(code, "qr"), {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 4,
    color: { dark: "#0a0d16", light: "#ffffff" },
  });
}
