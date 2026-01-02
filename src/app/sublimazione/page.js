/**
 * Sublimazione - Stampa sublimazione professionale
 */
import HeroSublimazione from './components/HeroSublimazione';

export const metadata = {
  title: "Stampa Sublimazione",
  description: "Servizio di stampa sublimazione professionale. Ideale per tessuti in poliestere, abbigliamento sportivo e gadget personalizzati.",
  robots: { index: true, follow: true },
};

export default function SublimationPage() {
  return (
    <>
      <HeroSublimazione />
      
      {/* Future: Product grid, How it works, FAQ sections */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contenuti in arrivo</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo prodotti per la sublimazione.</p>
        </div>
      </main>
    </>
  );
}
