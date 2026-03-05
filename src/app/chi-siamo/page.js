// app/chi-siamo/page.js
import AboutSection from "@/components/home/AboutSection";
import Breadcrumb from "@/components/common/Breadcrumb";
import { BREADCRUMB_ITEMS } from "@/lib/breadcrumb-config";
import { BASE_URL } from "@/lib/config";

// Metadata SEO
export const metadata = {
  title: {
    absolute: "Chi Siamo - DTF Italia | Stampa Professionale Roma",
  },
  description:
    "Scopri DTF Italia: esperienza, tecnologie all'avanguardia e servizio professionale per la stampa a Roma. Service per terzi, qualità garantita e spedizione 24h.",
  keywords:
    "chi siamo dtf italia, stampa professionale roma, service stampa terzi, laboratorio stampa roma",
  canonical: `${BASE_URL}/chi-siamo`,
  openGraph: {
    title: "Chi Siamo - DTF Italia",
    description:
      "Scopri la nostra storia, i nostri valori e le tecnologie che utilizziamo per offrirti il miglior servizio di stampa a Roma.",
    url: `${BASE_URL}/chi-siamo`,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
  },
};

export default function ChiSiamoPage() {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "DTF Italia",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description:
      "Stampa professionale a Roma: DTF, serigrafia, sublimazione, calendari e pellicole serigrafiche. Service per terzi con spedizione 24h.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Roma",
      addressRegion: "RM",
      addressCountry: "IT",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Roma",
      },
      {
        "@type": "Country",
        name: "Italia",
      },
    ],
    sameAs: [
      // TODO: Aggiungere social media links quando disponibili
      // "https://www.facebook.com/dtfitalia",
      // "https://www.instagram.com/dtfitalia"
    ],
  };

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Chi Siamo
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            La tua stamperia di fiducia a Roma per servizi professionali e
            personalizzazione di qualità
          </p>
        </div>
      </section>

      {/* About Content */}
      <div className="container mx-auto px-4 pt-4 pb-2">
        <Breadcrumb items={BREADCRUMB_ITEMS["/chi-siamo"]} />
      </div>
      <AboutSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-900 via-slate-900 to-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto a Iniziare il Tuo Progetto?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Scopri i nostri servizi di stampa professionale a Roma e richiedi un
            preventivo gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-block px-8 py-4 bg-white text-indigo-700 hover:bg-gray-100 active:bg-gray-200 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-600/25"
            >
              Scopri i Servizi
            </a>
            <a
              href="/service-dtf"
              className="inline-block px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 rounded-xl font-bold text-lg transition-all border-2 border-white/20"
            >
              Configura Ordine DTF
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
