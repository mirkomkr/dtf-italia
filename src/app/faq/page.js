import { faqData, getAllFAQs } from "@/data/faqs";
import FAQClient from "./components/FAQClient";
import Breadcrumb from "@/components/common/Breadcrumb";
import { BREADCRUMB_ITEMS } from "@/lib/breadcrumb-config";
import { localBusinessSchema } from "@/lib/schemas/localBusiness";

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const BASE_URL = "https://www.dtfitalia.it";

// Metadata SEO
export const metadata = {
  title: "FAQ Stampa Professionale - Domande e Risposte",
  description:
    "Risposte su stampa DTF, serigrafia, sublimazione. La guida completa per i tuoi dubbi su stampa e spedizioni a Roma e in Italia.",
  keywords:
    "faq stampa dtf, domande serigrafia, sublimazione domande, calendari personalizzati faq, pellicole serigrafia",
  openGraph: {
    title: "FAQ Stampa Professionale - Domande e Risposte",
    description:
      "Risposte complete su DTF, Serigrafia, Sublimazione, Calendari e Pellicole. Service professionale a Roma.",
    url: `${BASE_URL}/faq`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/og-faq.jpg`,
        width: 1200,
        height: 630,
        alt: "FAQ DTF Italia - Domande Frequenti",
      },
    ],
  },
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  // Generate FAQPage Schema
  const allFAQs = getAllFAQs();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            Domande Frequenti
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Tutto quello che devi sapere su stampa DTF, serigrafia,
            sublimazione, calendari personalizzati e pellicole serigrafiche.
            Service professionale a Roma.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 pt-4 pb-2">
        <Breadcrumb items={BREADCRUMB_ITEMS["/faq"]} />
      </div>
      <section aria-label="Contenuto FAQ" className="bg-gray-900 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <FAQClient faqData={faqData} />
        </div>
      </section>
    </>
  );
}
