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
      title: 'Analisi Grafica',
      desc: 'Verifichiamo la saturazione del nero nei tuoi file per assicurare uno stop alla luce ultravioletta perfetto.',
    },
    {
      num: '02',
      title: 'Stampa Alta Densità',
      desc: 'Utilizziamo sistemi inkjet calibrati per raggiungere una densità ottica superiore a 4.0.',
    },
    {
      num: '03',
      title: 'Stabilità Dimensionale',
      desc: 'Stampiamo su supporti resistenti al calore che garantiscono registri costanti per ogni telaio inciso.',
    },
  ];

  const pellicoleBenefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Contrasto Assoluto',
      desc: 'Un nero profondo che permette tempi di esposizione precisi senza velature indesiderate.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Registro Perfetto',
      desc: 'Le nostre pellicole inkjet non subiscono dilatazioni termiche, ideali per la serigrafia a più colori a Roma.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Service Roma Express',
      desc: 'Fornitura rapida nel nostro punto vendita di Roma per non fermare mai la tua produzione.',
    },
  ];

  const pellicoleFaqs = [
    {
      q: 'Qual è il Dmax garantito?',
      a: 'Le nostre pellicole inkjet raggiungono costantemente un Dmax di 4.0 o superiore, bloccando il 99.9% degli UV.',
    },
    {
      q: 'Posso usarle con bromografi a LED?',
      a: 'Assolutamente sì, sono state testate con successo sia su lampade classiche che su nuovi sistemi LED a Roma.',
    },
    {
      q: 'Offrite campionature di prova?',
      a: 'Sì, è possibile richiedere un test di stampa per verificare la compatibilità con il tuo processo di incisione.',
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

      <HowItWorks steps={pellicoleSteps} sectionTitle="Precisione micrometrica: dalla tua grafica alla pellicola" />
      <Benefits benefits={pellicoleBenefits} sectionTitle="Pellicole Inkjet ad alta densità: lo standard per i laboratori romani" />
      <FAQ faqs={pellicoleFaqs} sectionTitle="Dettagli tecnici sulle nostre pellicole professionali" />
    </>
  );
}
