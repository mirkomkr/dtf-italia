import HeroCalendari from './components/HeroCalendari';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

export const metadata = {
  title: "Calendari Personalizzati 2026 - DTF Italia Roma",
  description: "Stampa calendari personalizzati a Roma per aziende ed eventi. Modelli da muro e da scrivania con alta qualità di stampa e finiture professionali.",
  robots: { index: true, follow: true },
};

export default function CalendariPage() {
  const calendariSteps = [
    {
      num: '01',
      title: 'Visione 2026',
      desc: 'Scegli il formato e il layout più adatto per il tuo brand, con spazio dedicato a loghi e contatti ben visibili.',
    },
    {
      num: '02',
      title: 'Personalizzazione',
      desc: 'Integriamo le tue foto aziendali o grafiche personalizzate per creare un oggetto utile e di design.',
    },
    {
      num: '03',
      title: 'Stampa e Finitura',
      desc: 'Utilizziamo carte premium per una resa tattile e visiva che accompagni i tuoi clienti giorno dopo giorno.',
    },
  ];

  const calendariBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Promozione Continua',
      desc: 'Il tuo logo sotto gli occhi dei clienti per tutto l\'anno: il miglior investimento marketing di Roma.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Qualità Sensoriale',
      desc: 'Carte patinate e finiture di pregio che trasmettono professionalità e cura del dettaglio.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Logistica Puntuale',
      desc: 'Siamo organizzati per gestire le tue urgenze di fine anno con consegne rapide su tutta Roma.',
    },
  ];

  const calendariFaqs = [
    {
      q: 'Quali sono i formati più richiesti?',
      a: 'Dai classici olandesi da muro ai pratici trittici, fino ai modelli da scrivania perfetti per ogni ufficio romano.',
    },
    {
      q: 'Posso fornire la mia grafica completa?',
      a: 'Certamente, forniamo i tracciati di fustella così potrai creare il tuo progetto senza margini di errore.',
    },
    {
      q: 'Quali sono i tempi medi di produzione?',
      a: 'Per garantire la massima qualità a Roma, i tempi variano dai 5 ai 10 giorni lavorativi a seconda della complessità.',
    },
  ];

  return (
    <>
      <HeroCalendari />
      
      {/* Future: Product grid section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">I Nostri Modelli 2026</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo completo dei calendari 2026 a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={calendariSteps} sectionTitle="Pianifica il tuo successo: come creiamo i tuoi calendari" />
      <Benefits benefits={calendariBenefits} sectionTitle="Il modo più efficace per promuovere il tuo brand a Roma tutto l'anno" />
      <FAQ faqs={calendariFaqs} sectionTitle="Info su grafiche, formati e tempi di consegna calendari" />
    </>
  );
}
