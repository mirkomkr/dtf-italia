import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 absolute top-0 left-0 w-full z-50 py-6" role="banner">
      <div className="container mx-auto px-4 flex items-center">
        {/* Logo Section */}
        <div className="flex-1">
          <Link 
            href="/" 
            className="inline-block text-2xl font-black text-white tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Torna alla Home"
          >
            DTF<span className="text-indigo-400">PRO</span>
          </Link>
        </div>

        {/* Navigation Section - Centered */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-300" aria-label="Navigazione Principale">
          <Link href="#how-it-works" className="hover:text-white transition-colors">Come Funziona</Link>
          <Link href="/serigrafia" className="hover:text-white transition-colors">Serigrafia</Link>
          <Link href="/sublimazione" className="hover:text-white transition-colors">Sublimazione</Link>
          <Link href="/calendari" className="hover:text-white transition-colors">Calendari</Link>
          <Link href="/pellicole-serigrafia" className="hover:text-white transition-colors">Pellicole Serigrafia</Link>
          <Link href="#" className="hover:text-white transition-colors">FAQ</Link>
        </nav>

      </div>
    </header>
  );
}
