import Script from 'next/script';

// ... (existing imports)

export default function RootLayout({ children }) {
  return (
    <html lang="it" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://wp.dtfitalia.it" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="beforeInteractive"
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-indigo-600 focus:rounded-md focus:shadow-lg"
        >
          Salta al contenuto principale
        </a>
        <Header />
        <main id="main-content" className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
