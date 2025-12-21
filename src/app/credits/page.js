// app/credits/page.js
import { Check } from "lucide-react";

export const metadata = {
  title: "Credits Immagini - DTF Italia",
  description: "Credits fotografici per le immagini utilizzate su DTF Italia.",
  keywords: "credits immagini, fotografia, DTF Italia",
  robots: "index, follow",
  openGraph: {
    title: "Credits Immagini - DTF Italia",
    description: "Credits fotografici per le immagini utilizzate su DTF Italia.",
    url: "https://www.dtfitalia.it/credits",
    siteName: "DTF Italia",
    type: "website",
    images: [
      {
        url: "https://www.dtfitalia.it/og-image-credits.jpg",
        width: 1200,
        height: 630,
        alt: "Credits Immagini DTF Italia",
      },
    ],
  },
};

export default function CreditsPage() {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 min-h-screen text-white">
      {/* Hero + Main Content combinati */}
      <section className="relative min-h-[60vh] flex flex-col justify-center py-16 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center lg:items-start gap-6">
          <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold backdrop-blur-sm">
            📸 Credits Immagini
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight text-white">
            Immagini Utilizzate su DTF Italia
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed mb-6">
            Tutte le immagini presenti sul sito sono utilizzate con autorizzazione o provenienti da risorse libere.
          </p>

          <ul className="list-disc list-inside text-gray-200 space-y-2 max-w-3xl">
            <li>
              Foto di <a href="https://unsplash.com/it/@badun?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" className="text-indigo-300 hover:underline">Anastasiya Badun</a> su <a href="https://unsplash.com/it/foto/a-t-maglietta-con-limmagine-di-un-uomo-HXFFRDzZLH8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" className="text-indigo-300 hover:underline">Unsplash</a>
            </li>
            <li>
              Foto di  <a href="https://pixabay.com/users/pedroml-1724523/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8557635" className="text-indigo-300 hover:underline">Pedroml</a> su <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=8557635" className="text-indigo-300 hover:underline">Pixabay</a>
            </li>
              <li>
              Foto di <a href="https://pixabay.com/users/johnnylfc11-41536200/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9915226" className="text-indigo-300 hover:underline">H S</a> su <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=9915226" className="text-indigo-300 hover:underline">Pixabay</a>
            </li>
            <li>
              Foto di <a href="https://unsplash.com/it/@mediamodifier?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" className="text-indigo-300 hover:underline">Mediamodifier</a> su <a href="https://unsplash.com/it/foto/giacca-bianca-con-zip-appesa-su-appendiabiti-in-legno-marrone-kJXGTOY1wLQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" className="text-indigo-300 hover:underline">Unsplash</a>
            </li>
            <li>  
              Foto di <a href="https://it.freepik.com/foto-gratuito/donna-che-indossa-un-modello-di-berretto-bianco_16434138.htm#fromView=search&page=1&position=0&uuid=b5306eac-cf05-48a8-96ed-a7a2085ce6ec&query=cap+mockup" className="text-indigo-300 hover:underline">Immagine di rawpixel.com su Freepik</a>
            </li>
              {/* aggiungi altri credits qui */}
          </ul>
        </div>
      </section>
    </div>
  );
}
