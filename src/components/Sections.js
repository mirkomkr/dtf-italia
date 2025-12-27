import { Truck, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Carica il File',
      desc: 'Carica il tuo design in formato PNG o PDF. Il nostro sistema verificherà automaticamente la qualità.',
    },
    {
      num: '02',
      title: 'Scegli il Formato',
      desc: 'Seleziona tra i nostri formati standard ottimizzati o inserisci dimensioni personalizzate.',
    },
    {
      num: '03',
      title: 'Ricevi e Stampa',
      desc: 'Spediamo in 24h. Ricevi le tue stampe DTF pronte per essere pressate su qualsiasi tessuto.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white" aria-labelledby="how-it-works-title">
      <div className="container mx-auto px-4">
        <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Come Funziona</h2>
        <ol className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <li key={i} className="relative p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-6xl font-black text-indigo-100 absolute -top-6 -left-4 select-none" aria-hidden="true">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 relative z-10">{step.title}</h3>
              <p className="text-gray-600 relative z-10">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Benefits() {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" aria-hidden="true" />,
      title: 'Spedizione Lampo',
      desc: 'Ordina entro le 14:00 e spediamo in giornata.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-500" aria-hidden="true" />,
      title: 'Qualità Garantita',
      desc: 'Colori brillanti, bianco coprente e resistenza ai lavaggi.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-500" aria-hidden="true" />,
      title: 'Spedizione Gratuita',
      desc: 'Per ordini superiori a 100€.',
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white" aria-labelledby="benefits-title" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <h2 id="benefits-title" className="text-3xl md:text-4xl font-bold text-center mb-16">Perché Scegliere Noi</h2>
        <ul className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800 border border-gray-700">
              <div className="p-3 bg-gray-700 rounded-full mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FAQ() {
  const faqs = [
    {
      q: 'Quali file accettate?',
      a: 'Accettiamo PNG con sfondo trasparente (300dpi consigliati) e PDF vettoriali.',
    },
    {
      q: 'Come si applicano le stampe?',
      a: 'Pressa a 160°C per 15 secondi, pressione media. Spellicolamento a freddo.',
    },
    {
      q: 'C\'è un minimo d\'ordine?',
      a: 'Assolutamente no. Puoi ordinare anche una sola stampa.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50" aria-labelledby="faq-title" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Domande Frequenti</h2>
        <ul className="space-y-4">
          {faqs.map((faq, i) => (
            <li key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                {faq.q}
              </h3>
              <p className="text-gray-600 ml-7">{faq.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
