// app/page.js (Home)
import HeroHome from "@/components/home/HeroHome";
import LandingSection from "@/components/home/LandingSection";
import { Benefits, FAQ } from "@/components/home/Sections";
import {
  FaPrint,
  FaTshirt,
  FaMugHot,
  FaCalendarAlt,
  FaFilm,
} from "react-icons/fa";
import { BASE_URL } from "@/lib/config";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export const metadata = {
  title: {
    absolute:
      "Service DTF, Serigrafia, Sublimazione, Calendari Personalizzati, Pellicole Serigrafiche | DTF Italia - I Professionisti della Stampa a Roma",
  },
  description:
    "Servizi di stampa professionale a Roma: Service DTF, serigrafia, sublimazione, calendari personalizzati, pellicole serigrafiche. Qualità garantita, spedizione 24h, ritiro gratuito. Preventivo online immediato.",
  keywords: [
    // Local Roma
    "stampa dtf roma",
    "service dtf roma",
    "serigrafia roma",
    "serigrafia magliette",
    "stampa magliette personalizzate",
    "stampa sublimazione roma",
    "stampa tazze personalizzate",
    "stampa sublimazione su tessuto",
    "stampa calendari personalizzati roma",
    "stampa calendari online",
    "stampa calendario personalizzato",
    "stampa calendario aziende",
    "pellicole serigrafia roma",
    "service pellicole serigrafia",
    "service stampa professionale roma",
    "stampa magliette roma",
    "stampa digitale roma",
    "maglietta personalizzata",
    // Near Me
    "stampa dtf vicino a me",
    "stampa tazza vicino a me",
    "stampa magliette vicino a me",
    "stampa calendari vicino a me",
    "serigrafia vicino a me",
    "stampa sublimazione vicino a me",
    "pellicole serigrafiche vicino a me",
    "service stampa vicino a me",
    // Nazionale
    "stampa dtf italia",
    "service dtf",
    "service dtf professionale",
    "serigrafia professionale",
    "stampa sublimazione italia",
  ],
  authors: [{ name: "DTF Italia" }],
  robots: {
    index: true,
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
  },
  openGraph: {
    title: "Stampa Professionale Roma | DTF Italia",
    description:
      "I Professionisti della Stampa a Roma: Service DTF, serigrafia, sublimazione, calendari personalizzati, pellicole serigrafiche. Qualità garantita, spedizione 24h.",
    url: BASE_URL,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Stampa Professionale Roma | DTF Italia",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function Home() {
  // LocalBusiness Schema with geo coordinates for "near me" optimization
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#organization`,
    name: "DTF Italia",
    description:
      "I Professionisti della Stampa a Roma: Service DTF, serigrafia, sublimazione, calendari personalizzati, pellicole serigrafiche",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Roma",
      addressRegion: "RM",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.9028",
      longitude: "12.4964",
    },
    areaServed: [
      { "@type": "City", name: "Roma" },
      { "@type": "Country", name: "Italia" },
    ],
    image: `${BASE_URL}/og-image.jpg`, // Placeholder per immagine negozio fisico
    email: "info@dtfitalia.it",
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        opens: "09:00",
        closes: "18:00"
      }
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servizi di Stampa",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Stampa DTF Roma",
            description: "Service professionale di stampa DTF",
            url: `${BASE_URL}/service-dtf`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Stampa Serigrafica Roma",
            description: "Serigrafia su magliette, shopper, felpe",
            url: `${BASE_URL}/stampa-serigrafica`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Stampa Sublimazione Roma",
            description:
              "Sublimazione su tazze, calzini, abbigliamento sportivo",
            url: `${BASE_URL}/stampa-sublimazione`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Stampa Calendari Roma",
            description:
              "Calendari personalizzati per eventi, aziende, associazioni e regali",
            url: `${BASE_URL}/stampa-calendari`,
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pellicole Serigrafia Roma",
            description: "Pellicole inkjet e laser per serigrafia",
            url: `${BASE_URL}/pellicole-serigrafia`,
          },
        },
      ],
    },
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "DTF Italia",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Benefits data (ottimizzata, contenuto naturale)
  const homeBenefits = [
    {
      icon: "Zap",
      title: "Velocità e Affidabilità",
      desc: "Ordini processati in giornata con spedizione express in tutta Italia. Ritiro gratuito a Roma.",
    },
    {
      icon: "ShieldCheck",
      title: "Qualità Professionale",
      desc: "Tecnologie all'avanguardia e materiali premium per risultati impeccabili su ogni progetto.",
    },
    {
      icon: "Truck",
      title: "Flessibilità Totale",
      desc: "Nessun minimo d'ordine. Dalla singola stampa alle grandi quantità, siamo il tuo partner ideale.",
    },
  ];

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero Section (Fullscreen) */}
      <HeroHome />

      {/* DTF Section */}
      <LandingSection
        id="dtf"
        title="Stampa DTF Roma"
        description="Service professionale di stampa DTF per terzi e professionisti della personalizzazione. Stampe nitide e colori vibranti con testine Epson i3200, consegne rapide."
        features={[
          "Spedizione 24h in tutta Italia",
          "Nessun minimo d'ordine",
          "Qualità professionale garantita",
          "Ritiro gratuito a Roma",
        ]}
        ctaText="Configura Ordine DTF"
        ctaHref="/service-dtf"
        brandColor="indigo"
        ServiceIcon={FaPrint}
      />

      {/* Serigrafia Section */}
      <LandingSection
        id="serigrafia"
        title="Stampa Serigrafica Roma"
        description="Stampa serigrafica professionale su magliette, felpe, shopper e altri gadget. Ideale per grandi tirature."
        features={[
          "Stampa su magliette, felpe e gadget",
          "Ideale per grandi tirature",
          "Colori brillanti e duraturi",
          "Preventivo online immediato",
        ]}
        ctaText="Scopri Prodotti Serigrafia"
        ctaHref="/stampa-serigrafica"
        brandColor="orange"
        reverse
        ServiceIcon={FaTshirt}
      />

      {/* Sublimazione Section */}
      <LandingSection
        id="sublimazione"
        title="Stampa Sublimazione Roma"
        description="Stampa sublimatica per tessuti tecnici, tazze e gadget personalizzati, idee regalo. Colori brillanti e duraturi, resistenti ai lavaggi."
        features={[
          "Colori brillanti e duraturi",
          "Ideale per tessuti tecnici",
          "Stampa fotografica HD",
          "Resistente ai lavaggi",
        ]}
        ctaText="Scopri Prodotti Sublimazione"
        ctaHref="/stampa-sublimazione"
        brandColor="violet"
        ServiceIcon={FaMugHot}
      />

      {/* Calendari Section */}
      <LandingSection
        id="calendari"
        title="Stampa Calendari Roma"
        description="Calendari personalizzati per aziende e professionisti. Multipli formati disponibili: Calendario da tavolo, da parete, tascabile, silhouette e da ufficio."
        features={[
          "Calendari aziendali personalizzati",
          "Stampa professionale",
          "Formati multipli disponibili",
          "Consegna rapida",
        ]}
        ctaText="Scopri Prodotti Calendari"
        ctaHref="/stampa-calendari"
        brandColor="amber"
        reverse
        ServiceIcon={FaCalendarAlt}
      />

      {/* Pellicole Section */}
      <LandingSection
        id="pellicole"
        title="Pellicole Serigrafia Roma"
        description="Pellicole serigrafiche inkjet e laser. Qualità professionale per serigrafie con alta opacità garantita."
        features={[
          "Pellicole inkjet e laser",
          "Alta opacità garantita",
          "Compatibilità universale",
          "Spedizione immediata",
        ]}
        ctaText="Configura Ordine Pellicole"
        ctaHref="/pellicole-serigrafia"
        brandColor="slate"
        ServiceIcon={FaFilm}
      />

      {/* Benefits Section */}
      <Benefits
        benefits={homeBenefits}
        sectionTitle="Perché Scegliere DTF Italia"
      />

      {/* FAQ Section */}
      <FAQ />
    </>
  );
}
