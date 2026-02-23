// app/page.js (Home)
import HeroHome from "@/components/home/HeroHome";
import LandingSection from "@/components/home/LandingSection";
import { Benefits, FAQ } from '@/components/home/Sections';
import { FaPrint, FaTshirt, FaMugHot, FaCalendarAlt, FaFilm } from 'react-icons/fa';
import { BASE_URL } from '@/lib/config';

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export const metadata = {
  title: {
    absolute: "DTF Italia - Stampa Professionale Roma | DTF, Serigrafia, Sublimazione"
  },
  description:
    "Servizi di stampa professionale a Roma: DTF, serigrafia, sublimazione, calendari e pellicole serigrafiche. Qualità garantita, spedizione 24h, ritiro gratuito. Preventivo online immediato.",
  keywords: [
    // Local Roma
    "stampa dtf roma",
    "service dtf roma",
    "serigrafia roma",
    "serigrafia magliette",
    "stampa sublimazione roma",
    "stampa sublimazione tazze",
    "stampa sublimazione su tessuto",
    "stampa calendari personalizzati roma",
    "stampa calendari online",
    "stampa calendario personalizzato",
    "stampa calendario aziende",
    "pellicole serigrafia roma",
    "service pellicole serigrafia",
    "service stampa professionale roma",
    "stampa tessuti roma",
    "transfer digitale roma",
    // Near Me
    "stampa dtf vicino a me",
    "serigrafia vicino a me",
    "stampa sublimazione vicino a me",
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
    title: "DTF Italia - Stampa Professionale Roma",
    description:
      "Servizi di stampa professionale a Roma: DTF, serigrafia, sublimazione, calendari e pellicole. Qualità garantita, spedizione 24h.",
    url: BASE_URL,
    siteName: "DTF Italia",
    locale: "it_IT",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "DTF Italia - Stampa Professionale Roma",
      },
    ],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function Home() {
  // LocalBusiness Schema with geo coordinates for "near me" optimization
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${BASE_URL}/#organization`,
    "name": "DTF Italia",
    "description": "Servizi di stampa professionale a Roma: DTF, serigrafia, sublimazione, calendari e pellicole",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Roma",
      "addressRegion": "RM",
      "addressCountry": "IT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "41.9028",
      "longitude": "12.4964"
    },
    "areaServed": [
      { "@type": "City", "name": "Roma" },
      { "@type": "Country", "name": "Italia" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servizi di Stampa",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Stampa DTF Roma",
            "description": "Service professionale di stampa Direct-To-Film",
            "url": `${BASE_URL}/service-dtf`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Stampa Serigrafica Roma",
            "description": "Serigrafia su magliette e tessuti",
            "url": `${BASE_URL}/stampa-serigrafica`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Stampa Sublimazione Roma",
            "description": "Sublimazione su tazze e tessuti",
            "url": `${BASE_URL}/stampa-sublimazione`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Stampa Calendari Roma",
            "description": "Calendari personalizzati per aziende",
            "url": `${BASE_URL}/stampa-calendari`
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Pellicole Serigrafia Roma",
            "description": "Pellicole inkjet e laser per serigrafia",
            "url": `${BASE_URL}/pellicole-serigrafia`
          }
        }
      ]
    }
  };

  // WebSite Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "name": "DTF Italia",
    "url": BASE_URL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  // Benefits data (ottimizzata, contenuto naturale)
  const homeBenefits = [
    {
      icon: 'Zap',
      title: 'Velocità e Affidabilità',
      desc: 'Ordini processati in giornata con spedizione express in tutta Italia. Ritiro gratuito a Roma.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Qualità Professionale',
      desc: 'Tecnologie all\'avanguardia e materiali premium per risultati impeccabili su ogni progetto.',
    },
    {
      icon: 'Truck',
      title: 'Flessibilità Totale',
      desc: 'Nessun minimo d\'ordine. Dalla singola stampa alle grandi quantità, siamo il tuo partner ideale.',
    },
  ];

  return (
    <>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
        description="Service professionale di stampa Direct-To-Film per terzi e professionisti della personalizzazione. Stampe nitide, colori vibranti, consegne rapide."
        features={[
          "Spedizione 24h in tutta Italia",
          "Nessun minimo d'ordine",
          "Qualità professionale garantita",
          "Ritiro gratuito a Roma"
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
        description="Stampa serigrafica professionale su tessuti, magliette e materiali promozionali. Ideale per grandi quantità con colori Pantone certificati."
        features={[
          "Stampa su tessuti e gadget",
          "Ideale per grandi quantità",
          "Colori Pantone certificati",
          "Preventivo online immediato"
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
        description="Stampa sublimatica per tessuti tecnici, tazze e gadget personalizzati. Colori brillanti e duraturi, resistenti ai lavaggi."
        features={[
          "Colori brillanti e duraturi",
          "Ideale per tessuti tecnici",
          "Stampa fotografica HD",
          "Resistente ai lavaggi"
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
        description="Calendari personalizzati per aziende e professionisti. Stampa offset di alta qualità con formati multipli disponibili."
        features={[
          "Calendari aziendali personalizzati",
          "Stampa offset professionale",
          "Formati multipli disponibili",
          "Consegna rapida"
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
        description="Pellicole per serigrafia inkjet e laser. Qualità professionale per serigrafisti con alta opacità garantita."
        features={[
          "Pellicole inkjet e laser",
          "Alta opacità garantita",
          "Compatibilità universale",
          "Spedizione immediata"
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