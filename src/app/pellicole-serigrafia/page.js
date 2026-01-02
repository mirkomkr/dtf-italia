/**
 * Pellicole Serigrafia - Pellicole professionali per serigrafia
 */
import HeroPellicoleSerigrafia from './components/HeroPellicoleSerigrafia';

export const metadata = {
  title: "Pellicole per Serigrafia",
  description: "Pellicole professionali Inkjet e Laser per serigrafia. Massima densità ottica e stabilità dimensionale per telai perfetti.",
  robots: { index: true, follow: true },
};

export default function PellicolePage() {
  return (
    <>
      <HeroPellicoleSerigrafia />
      
      {/* Future: Product catalog, technical specs */}
      <main className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Catalogo in arrivo</h2>
          <p className="text-gray-600">Stiamo preparando il catalogo pellicole professionali.</p>
        </div>
      </main>
    </>
  );
}
