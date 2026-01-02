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
      title: 'Grafica HD',
      desc: 'Prepariamo il tuo design in alta definizione per una stampa sublimatica perfetta a Roma.',
    },
    {
      num: '02',
      title: 'Trasferimento Termico',
      desc: 'Il calore trasforma l\'inchiostro in gas, facendolo fondere direttamente con le fibre del tessuto.',
    },
    {
      num: '03',
      title: 'Resa Indelebile',
      desc: 'Il risultato è una stampa impalpabile, traspirante e che non sbiadirà mai col tempo.',
    },
  ];

  const sublimazioneBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Resa Fotografica',
      desc: 'Colori brillanti e sfumature perfette per i tuoi capi sportivi a Roma.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Stampa Impalpabile',
      desc: 'La stampa entra nel tessuto: non si sente al tatto e lascia traspirare la pelle.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Durata Infinita',
      desc: 'Garantiamo che la stampa sublimatica non si screpola e non si stacca mai.',
    },
  ];

  const sublimazioneFaqs = [
    {
      q: 'Su quali materiali funziona la sublimazione?',
      a: 'La sublimazione a Roma è perfetta su tessuti con almeno il 60% di poliestere e su superfici rigide pre-trattate.',
    },
    {
      q: 'I colori sbiadiscono con il sudore o il sole?',
      a: 'Assolutamente no, è la tecnica ideale per abbigliamento tecnico sportivo usato all\'aperto.',
    },
    {
      q: 'Posso stampare su tessuti neri?',
      a: 'No, la sublimazione richiede tessuti bianchi o molto chiari per rendere i colori visibili.',
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

      <HowItWorks steps={sublimazioneSteps} titoloTecnica="Sublimazione" />
      <Benefits benefits={sublimazioneBenefits} titoloTecnica="Sublimazione" />
      <FAQ faqs={sublimazioneFaqs} titoloTecnica="Sublimazione" />
    </>
  );
}
