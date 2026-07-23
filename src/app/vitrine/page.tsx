import { redirect } from "next/navigation";

// L'ancienne vitrine est remplacée par la landing /home (source unique).
export default function Vitrine() {
  redirect("/home");
}
