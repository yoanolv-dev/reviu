import type { ReactNode } from "react";
import { GUARANTEE, SHIPPING } from "@/lib/brand";
import { IconShield, IconSmartphone, IconTruck } from "@/components/ui/icons";

const MESSAGES: { icon: ReactNode; text: string }[] = [
  { icon: <IconTruck size={15} />, text: `${SHIPPING.label} dès 1 présentoir` },
  { icon: <IconShield size={15} />, text: GUARANTEE.label },
  { icon: <IconSmartphone size={15} />, text: "Sans abonnement · iPhone et Android" },
];

/**
 * Bandeau d'annonce au-dessus du header (réassurance commerciale).
 * Non-sticky : il défile hors de l'écran, le header reste épinglé.
 * Desktop : les trois messages côte à côte. Mobile / tablette : un message à la
 * fois, en rotation verticale douce (CSS pur, figée si mouvement réduit).
 */
export function AnnounceBar() {
  return (
    <div className="bg-brand text-white">
      <div className="mx-auto h-9 max-w-6xl px-5 text-[13px] font-medium">
        {/* Desktop */}
        <ul className="hidden h-full items-center justify-center gap-8 lg:flex">
          {MESSAGES.map((m) => (
            <li key={m.text} className="inline-flex items-center gap-1.5">
              <span className="text-white/85">{m.icon}</span>
              {m.text}
            </li>
          ))}
        </ul>
        {/* Mobile / tablette : rotation */}
        <div className="announce-ticker h-full overflow-hidden lg:hidden">
          <ul className="announce-track">
            {[...MESSAGES, MESSAGES[0]].map((m, i) => (
              <li
                key={i}
                aria-hidden={i > 0 ? true : undefined}
                className="flex h-9 items-center justify-center gap-1.5 text-center"
              >
                <span className="text-white/85">{m.icon}</span>
                {m.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
