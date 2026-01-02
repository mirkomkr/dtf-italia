import { Truck, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

/**
 * HowItWorks - Componente dinamico per spiegare il processo di stampa.
 * @param {Object} props
 * @param {Array} props.steps - Array di step { num, title, desc }
 * @param {string} props.titoloTecnica - Nome della tecnica per la SEO (es. "DTF", "Serigrafia")
 */
export function HowItWorks({ steps = [], titoloTecnica = "Stampa" }) {
  return (
    <section id="how-it-works" className="py-20 bg-white" aria-labelledby="how-it-works-title">
      <div className="container mx-auto px-4">
        <h2 id="how-it-works-title" className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
          Come Funziona {titoloTecnica} a Roma
        </h2>
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

/**
 * Benefits - Componente dinamico per i vantaggi del servizio.
 * @param {Object} props
 * @param {Array} props.benefits - Array di vantaggi { icon, title, desc }
 * @param {string} props.titoloTecnica - Nome della tecnica
 */
export function Benefits({ benefits = [], titoloTecnica = "Servizio" }) {
  return (
    <section className="py-20 bg-gray-900 text-white" aria-labelledby="benefits-title" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4">
        <h2 id="benefits-title" className="text-3xl md:text-4xl font-bold text-center mb-16">
          Perché Scegliere il nostro {titoloTecnica} a Roma
        </h2>
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

/**
 * FAQ - Componente dinamico per le domande frequenti.
 * @param {Object} props
 * @param {Array} props.faqs - Array di FAQ { q, a }
 * @param {string} props.titoloTecnica - Nome della tecnica
 */
export function FAQ({ faqs = [], titoloTecnica = "Stampa" }) {
  return (
    <section className="py-20 bg-gray-50" aria-labelledby="faq-title" style={{ contentVisibility: 'auto' }}>
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
          Domande Frequenti {titoloTecnica} Roma
        </h2>
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
