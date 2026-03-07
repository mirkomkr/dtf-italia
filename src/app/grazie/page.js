import { Suspense } from "react";
import GraziePage from "@/components/common/GraziePage";

export const metadata = {
  title: "Grazie per il tuo ordine! — DTF Italia",
  description: "Il tuo ordine è stato ricevuto con successo.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GraziePage />
    </Suspense>
  );
}
