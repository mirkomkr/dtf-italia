'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Home, Package } from 'lucide-react';
import Link from 'next/link';

const REDIRECT_SECONDS = 3;

export default function GraziePage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // Legge i codici ordine dall'URL: /grazie?ids=123,456
  const rawIds   = searchParams.get('ids') || searchParams.get('id') || '';
  const orderIds = rawIds ? rawIds.split(',').filter(Boolean) : [];

  // ── Countdown ───────────────────────────────────────────────────────────────
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [router]);

  // Progress ring size & circumference
  const RADIUS      = 20;
  const CIRC        = 2 * Math.PI * RADIUS;
  const progress    = ((REDIRECT_SECONDS - secondsLeft) / REDIRECT_SECONDS) * CIRC;

  return (
    <main
      className="min-h-[82vh] flex flex-col items-center justify-center px-4 py-16 text-center"
      role="main"
      aria-label="Pagina di conferma ordine"
    >
      {/* ── Icona successo ───────────────────────────────────────────────── */}
      <div
        className="relative w-24 h-24 mb-8"
        aria-hidden="true"
      >
        {/* Cerchio verde palesato */}
        <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-40" />
        <div className="relative w-24 h-24 bg-green-100 rounded-3xl rotate-6 ring-8 ring-offset-4 ring-offset-white ring-green-50 flex items-center justify-center shadow-xl">
          <Check className="w-11 h-11 text-green-600" strokeWidth={3.5} />
        </div>
      </div>

      {/* ── Titolo ───────────────────────────────────────────────────────── */}
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">
        Grazie!
      </h1>
      <p className="text-slate-500 text-base md:text-lg font-medium mb-8 max-w-sm">
        Il tuo ordine è stato ricevuto correttamente.<br />
        Riceverai un'email di conferma a breve.
      </p>

      {/* ── Lista ordini ──────────────────────────────────────────────────── */}
      {orderIds.length > 0 && (
        <div
          className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left"
          aria-label="Riepilogo numeri ordine"
        >
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-slate-400" aria-hidden="true" />
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500">
              {orderIds.length === 1 ? 'Numero Ordine' : 'Numeri Ordine'}
            </span>
          </div>
          <ul className="space-y-2" aria-label="Lista ordini">
            {orderIds.map((id, i) => (
              <li key={id} className="flex items-center gap-3">
                {orderIds.length > 1 && (
                  <span className="text-[10px] text-slate-400 font-bold w-4 text-center">{i + 1}</span>
                )}
                <span className="font-mono text-2xl font-black text-slate-900 tracking-tighter">
                  #{id}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-slate-400 font-semibold mt-3">
            Conserva questi codici per eventuali richieste di assistenza.
          </p>
        </div>
      )}

      {/* ── Countdown ring + testo ───────────────────────────────────────── */}
      <div
        className="flex flex-col items-center gap-4 mb-8"
        aria-live="polite"
        aria-label={`Reindirizzamento alla home tra ${secondsLeft} secondi`}
      >
        {/* SVG ring */}
        <div className="relative w-14 h-14" aria-hidden="true">
          <svg
            className="w-14 h-14 -rotate-90"
            viewBox="0 0 48 48"
          >
            {/* Track */}
            <circle
              cx="24" cy="24" r={RADIUS}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
            />
            {/* Progress */}
            <circle
              cx="24" cy="24" r={RADIUS}
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC - progress}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          {/* Numero al centro */}
          <span className="absolute inset-0 flex items-center justify-center font-black text-xl text-indigo-600">
            {secondsLeft}
          </span>
        </div>
        <p className="text-sm text-slate-400 font-medium">
          Sarai reindirizzato alla home tra{' '}
          <strong className="text-slate-600">{secondsLeft}</strong>{' '}
          {secondsLeft === 1 ? 'secondo' : 'secondi'}
        </p>
      </div>

      {/* ── Pulsante manuale ─────────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white text-sm uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        aria-label="Torna subito alla home page"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
        Torna alla Home
      </Link>
    </main>
  );
}
