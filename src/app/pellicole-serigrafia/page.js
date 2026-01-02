import HeroPellicoleSerigrafia from './components/HeroPellicoleSerigrafia';
import { HowItWorks, Benefits, FAQ } from '@/components/Sections';
import { Zap, ShieldCheck, Truck } from 'lucide-react';

export const metadata = {
  title: "Pellicole per Serigrafia Professionali - DTF Italia Roma",
  description: "Pellicole professionali Inkjet e Laser per serigrafia a Roma. Massima densità ottica (Dmax > 4.0) e stabilità dimensionale per telai perfetti.",
  robots: { index: true, follow: true },
};

export default function PellicolePage() {
  const pellicoleSteps = [
    {
      num: '01',
      title: 'Nero Pieno',
      desc: 'Utilizziamo inchiostri specifici per ottenere pellicole con una densità del nero assoluta (Dmax > 4.0).',
    },
    {
      num: '02',
      title: 'Stampa di Precisione',
      desc: 'La calibrazione dei nostri sistemi Inkjet garantisce registri perfetti anche per i micro-dettagli a Roma.',
    },
    {
      num: '03',
      title: 'Verifica Qualità',
      desc: 'Ogni set di pellicole viene controllato al lentino per assicurare l\'assenza di imperfezioni prima della consegna.',
    },
  ];

  const pellicoleBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Opacità Garantita',
      desc: 'Il miglior contrasto possibile a Roma per un\'esposizione perfetta dei tuoi telai serigrafici.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Precisione Micro-Dettaglio',
      desc: 'Ideale per mezzetinte e linee sottili che richiedono una stabilità dimensionale superiore.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Pronta Consegna',
      desc: 'Disponiamo sempre di scorte a Roma per garantirti pellicole inkjet/laser in tempi record.',
    },
  ];

  const pellicoleFaqs = [
    {
      q: 'Qual è la densità UV delle vostre pellicole?',
      a: 'Le nostre pellicole professionali a Roma superano una densità UV di 4.0, bloccando completamente la luce espotrice.',
    },
    {
      q: 'Sono compatibili con stampanti Inkjet standard?',
      a: 'Sì, ma per risultati professionali a Roma consigliamo l\'uso di software RIP e inchiostri specifici.',
    },
    {
      q: 'Offrite anche il servizio di incisione telai?',
      a: 'Attualmente a Roma ci concentriamo sulla fornitura di pellicole di alta qualità per i tuoi impianti.',
    },
  ];

  return (
    <>
      <HeroPellicoleSerigrafia />
      
      {/* Future: Product catalog section */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Soluzioni Professionali</h2>
          <p className="text-gray-600">Esplora la nostra gamma di supporti per serigrafia a Roma.</p>
        </div>
      </main>

      <HowItWorks steps={pellicoleSteps} titoloTecnica="Pellicole" />
      <Benefits benefits={pellicoleBenefits} titoloTecnica="Pellicole" />
      <FAQ faqs={pellicoleFaqs} titoloTecnica="Pellicole" />
    </>
  );
}
