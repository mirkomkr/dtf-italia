import HeroSublimazione from './components/HeroSublimazione';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

export const metadata = {
  title: "Stampa Sublimazione",
  description: "Servizio di stampa sublimazione professionale a Roma. Ideale per tessuti in poliestere, abbigliamento sportivo e gadget personalizzati.",
  robots: { index: true, follow: true },
};

export default function SublimationPage() {
  const sublimazioneSteps = [
    {
      num: '01',
      title: 'Design Creativo',
      desc: 'Dacci la tua idea: trasformiamo grafiche e foto in un layout pronto per brillare su ogni oggetto.',
    },
    {
      num: '02',
      title: 'Saturazione Colore',
      desc: 'In questa fase il calore fonde il colore direttamente nel materiale, creando un legame indissolubile.',
    },
    {
      num: '03',
      title: 'Effetto WOW',
      desc: 'Il risultato finale è un prodotto unico con colori saturi e una definizione che lascia senza parole.',
    },
  ];

  const sublimazioneBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Brillantezza Eterna',
      desc: 'I colori non sbiadiscono mai perché diventano parte integrante del materiale stesso.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Personalizzazione Totale',
      desc: 'Crea gadget unici nel nostro centro specializzato di Roma, anche per singoli pezzi o campionature.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Consegna Versatile',
      desc: 'Spediamo i tuoi regali o il tuo merchandising ovunque in tempi brevissimi con cura artigianale.',
    },
  ];

  const sublimazioneFaqs = [
    {
      q: 'Quali oggetti posso personalizzare?',
      a: 'Dalle tazze alle maglie tecniche, dai tappetini mouse alle borracce: praticamente tutto ciò che ha un fondo in poliestere.',
    },
    {
      q: 'La stampa si sente al tatto?',
      a: 'Assolutamente no. La sublimazione è impercettibile, rendendo i tessuti traspiranti e morbidissimi.',
    },
    {
      q: 'È possibile stampare fotografie?',
      a: 'Certamente! È la tecnica regina per la resa fotografica, ideale per regali personalizzati a Roma.',
    },
  ];

  return (
    <>
      <HeroSublimazione />
      
      {/* Future: Product grid section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prodotti in arrivo</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo prodotti per la sublimazione a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={sublimazioneSteps} sectionTitle="Come trasformiamo le tue idee in oggetti unici" />
      <Benefits benefits={sublimazioneBenefits} sectionTitle="Massima resa cromatica per i tuoi gadget a Roma" />
      <FAQ faqs={sublimazioneFaqs} sectionTitle="Domande comuni sulla personalizzazione sublimatica" />
    </>
  );
}
