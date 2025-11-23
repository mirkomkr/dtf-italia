import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity" aria-label="Torna alla Home">
              <div className="text-2xl font-black text-white tracking-tighter">
                DTF<span className="text-indigo-400">PRO</span>
              </div>
            </Link>
            <p className="text-sm">
              Il servizio di stampa DTF professionale per creativi e aziende.
            </p>
          </div>
          
          <nav aria-label="Link Servizio">
            <h4 className="text-white font-bold mb-4">Servizio</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Ordina Ora</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Listino Prezzi</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tempi di Spedizione</Link></li>
            </ul>
          </nav>

          <nav aria-label="Link Supporto">
            <h4 className="text-white font-bold mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Contattaci</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Guida ai File</Link></li>
            </ul>
          </nav>

          <nav aria-label="Link Legali">
            <h4 className="text-white font-bold mb-4">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Termini e Condizioni</Link></li>
            </ul>
          </nav>
        </div>
        <div className="text-center text-xs pt-8 border-t border-gray-800">
          © {currentYear} DTF PRO. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
