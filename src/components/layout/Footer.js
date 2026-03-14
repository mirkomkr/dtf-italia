import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-black text-white tracking-tighter cursor-pointer hover:opacity-80 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md px-1"
              aria-label="DTF Italia - Torna alla Home"
            >
              <span aria-hidden="true">
                DTF_<span className="text-green-600">IT</span>
                <span className="text-white">AL</span>
                <span className="text-red-600">IA</span>
              </span>
            </Link>
            <p className="text-sm">
              Il servizio di stampa DTF professionale per creativi e aziende.
            </p>
          </div>

          <nav aria-label="Link Servizio">
            <h4 className="text-white font-bold mb-4">Servizio</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Ordina Ora
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Listino Prezzi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Tempi di Spedizione
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Link Supporto">
            <h4 className="text-white font-bold mb-4">Supporto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/chi-siamo"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Contattaci
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Guida ai File
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Link Legali">
            <h4 className="text-white font-bold mb-4">Legale</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Termini e Condizioni
                </Link>
              </li>
              <li>
                <Link
                  href="/credits"
                  className="hover:text-white transition-all duration-200 focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                >
                  Credits Immagini
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="text-center text-xs pt-8 border-t border-gray-800 space-y-1">
          <p>© {currentYear} DTF Italia. Tutti i diritti riservati.</p>
          <p>
            Sviluppato con ❤️ da{" "}
            <a
              href="https://mirkopasseri.it"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              aria-label="Portfolio di Mirko Passeri - Sviluppatore & Web Designer"
            >
              Mirko Passeri
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
