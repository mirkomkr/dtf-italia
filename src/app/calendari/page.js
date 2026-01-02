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
      title: 'Scelta Template',
      desc: 'Scegli tra i nostri template pronti per il 2026 o inviaci la tua grafica personalizzata a Roma.',
    },
    {
      num: '02',
      title: 'Personalizzazione',
      desc: 'Inserisci il tuo logo, i tuoi contatti e le tue immagini aziendali per un marketing efficace tutto l\'anno.',
    },
    {
      num: '03',
      title: 'Stampa Offset HD',
      desc: 'Stampiamo i tuoi calendari con tecnologie offset di alta qualità per colori brillanti e testi nitidi.',
    },
  ];

  const calendariBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Marketing 365 Giorni',
      desc: 'Il miglior modo per far ricordare il tuo brand ai tuoi clienti di Roma per tutto l\'anno.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Qualità Carta',
      desc: 'Utilizziamo solo carte patinate di alto spessore per un feeling premium e professionale.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Template Pronti',
      desc: 'Ti forniamo template gratuiti per velocizzare la creazione del tuo calendario 2026.',
    },
  ];

  const calendariFaqs = [
    {
      q: 'Esistono diversi formati di calendari?',
      a: 'Certamente! A Roma offriamo calendari da muro (A3/A4), olandesi, da scrivania e tascabili.',
    },
    {
      q: 'Quali sono i tempi di consegna?',
      a: 'Data la stagionalità, i tempi medi a Roma sono di 7-10 giorni lavorativi dall\'approvazione bozza.',
    },
    {
      q: 'Posso richiedere un preventivo per grandi quantità?',
      a: 'Sì, offriamo sconti scalabili molto vantaggiosi per ordini superiori ai 100 pezzi.',
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

      <HowItWorks steps={calendariSteps} titoloTecnica="Calendari" />
      <Benefits benefits={calendariBenefits} titoloTecnica="Calendari" />
      <FAQ faqs={calendariFaqs} titoloTecnica="Calendari" />
    </>
  );
}
