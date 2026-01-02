/**
 * Calendari - Calendari personalizzati
 */
import HeroCalendari from './components/HeroCalendari';

export const metadata = {
  title: "Calendari Personalizzati",
  description: "Stampa calendari personalizzati per aziende ed eventi. Modelli da muro e da scrivania con alta qualità di stampa.",
  robots: { index: true, follow: true },
};

export default function CalendariPage() {
  return (
    <>
      <HeroCalendari />
      
      {/* Future: Product grid, customization options */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modelli in arrivo</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo calendari 2026.</p>
        </div>
      </main>
    </>
  );
}
