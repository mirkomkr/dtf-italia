// components/AboutSection.js

/**
 * AboutSection - "Chi Siamo" section for homepage
 * 
 * Architecture:
 * - ✅ Server Component (zero client JS)
 * - SEO optimized with semantic HTML
 * - WCAG 2.1 Level AA compliant
 * - Mobile-first responsive design
 * 
 * Purpose: Brand awareness, local SEO (Roma), E-E-A-T signals
 */
export default function AboutSection() {
  return (
    <section 
      className="py-20 bg-white"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Section Heading */}
          <h2 
            id="about-heading"
            className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900"
          >
            DTF Italia - Il Tuo Partner per la Stampa Professionale a Roma
          </h2>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 text-gray-700 leading-relaxed">
            
            {/* Column 1: Storia ed Esperienza */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Esperienza e Innovazione
              </h3>
              <p>
                {/* PLACEHOLDER: Inserire storia aziendale reale */}
                Da anni punto di riferimento a Roma per la stampa professionale, DTF Italia nasce dall'esperienza di professionisti del settore grafico e della personalizzazione. La nostra missione è offrire servizi di stampa di altissima qualità, combinando tecnologie all'avanguardia con un servizio clienti attento e personalizzato.
              </p>
              <p>
                {/* PLACEHOLDER: Inserire dettagli su tecnologie e macchinari */}
                Investiamo costantemente in tecnologie di ultima generazione: dalla stampa DTF (Direct-To-Film) alla serigrafia tradizionale, dalla sublimazione alla stampa offset per calendari. Ogni tecnica è scelta per garantire il miglior risultato possibile su ogni tipo di supporto.
              </p>
            </div>

            {/* Column 2: Valori e Target */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                I Nostri Valori
              </h3>
              <p>
                {/* PLACEHOLDER: Inserire valori aziendali reali */}
                <strong className="text-gray-900">Qualità garantita</strong>: ogni stampa è controllata nei minimi dettagli prima della consegna. 
                <strong className="text-gray-900 ml-2">Velocità</strong>: spedizione in 24h in tutta Italia e ritiro gratuito a Roma. 
                <strong className="text-gray-900 ml-2">Flessibilità</strong>: nessun minimo d'ordine, dalla singola stampa alle grandi quantità.
              </p>
              <p>
                {/* PLACEHOLDER: Inserire target clienti reale */}
                Serviamo professionisti della personalizzazione, rivenditori, aziende e privati. Il nostro <strong className="text-gray-900">service per terzi</strong> è pensato per chi cerca un partner affidabile per la produzione, mentre i nostri configuratori online rendono semplice ordinare anche per chi non ha esperienza nel settore.
              </p>
            </div>

          </div>

          {/* Zone Servite (Local SEO) */}
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Zone Servite a Roma
            </h3>
            <p className="text-gray-700 text-center leading-relaxed">
              {/* PLACEHOLDER: Inserire indirizzo reale quando disponibile */}
              Serviamo tutta Roma e provincia con <strong className="text-gray-900">ritiro gratuito</strong> presso il nostro punto di produzione. 
              Raggiungiamo facilmente Centro Storico, Prati, EUR, Tiburtina, Ostiense e tutti i quartieri della capitale. 
              <span className="block mt-2 text-indigo-700 font-semibold">
                Spedizione nazionale in 24/48h in tutta Italia.
              </span>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
