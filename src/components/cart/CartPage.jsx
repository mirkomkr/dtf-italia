'use client';

import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/pricing-engine';
import { Trash2, ShoppingCart, ArrowLeft, Package, Zap, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CartCheckoutForm from './CartCheckoutForm';

// ─── Labels per tipo prodotto ──────────────────────────────────────────────
const TYPE_LABELS = {
  dtf:          { label: 'Stampa DTF',          color: 'bg-indigo-100 text-indigo-700',  border: 'border-indigo-200'  },
  serigrafia:   { label: 'Stampa Serigrafica',  color: 'bg-red-100 text-red-700',        border: 'border-red-200'     },
  sublimazione: { label: 'Sublimazione',        color: 'bg-purple-100 text-purple-700',  border: 'border-purple-200'  },
  calendari:    { label: 'Calendari',           color: 'bg-emerald-100 text-emerald-700',border: 'border-emerald-200' },
  pellicole:    { label: 'Pellicole Serigrafia',color: 'bg-sky-100 text-sky-700',        border: 'border-sky-200'     },
};

// ─── Etichette leggibili per i formati DTF ────────────────────────────────
const FORMAT_LABELS = {
  logo_cuore:             'Logo Cuore / Tascabile — 10×10 cm',
  manica_corta:           'Manica Corta / Spalla — 7×7 cm',
  cappello_front:         'Cappello (Frontale) — 12×6 cm',
  manica_lunga_striscia:  'Manica Lunga (Striscia) — 6×40 cm',
  manica_lunga_polso:     'Manica Lunga (Polso) — 4×10 cm',
  neck_tag:               'Etichetta Collo (Tag) — 8×8 cm',
  a4:                     'Medio (A4) — 21×29.7 cm',
  a3:                     'Grande (A3) — 28×40 cm',
  meter:                  'Bobina al Metro Lineare — 58×100 cm',
};

// ─── Label italiano per posizioni di stampa serigrafia ───────────────────────
const POS_LABELS = {
  right:          'Lato Destro',
  heart:          'Lato Cuore',
  center:         'Fronte',
  sleeve_right:   'Manica Destra',
  sleeve_left:    'Manica Sinistra',
  internal_label: 'Etichetta Interna',
  external_label: 'Etichetta Esterna',
  classic:        'Retro',
};

// ─── Breakdown quantità serigrafia ─────────────────────────────────────────
function buildSerigrafiaQuantityDetails(cfg) {
  if (!cfg) return null;
  const lines = [];

  // Struttura quantities: { colore: { genere: { taglia: qty } } }
  if (cfg.quantities && typeof cfg.quantities === 'object') {
    const colorKeys = Object.keys(cfg.quantities);
    if (colorKeys.length > 0) {
      const sizeMap = {};
      let colorCount = 0;
      colorKeys.forEach(colorId => {
        const genders = cfg.quantities[colorId];
        if (!genders) return;
        let colorHasItems = false;
        Object.values(genders).forEach(gender => {
          Object.entries(gender).forEach(([size, qty]) => {
            const n = parseInt(qty) || 0;
            if (n > 0) {
              sizeMap[size] = (sizeMap[size] || 0) + n;
              colorHasItems = true;
            }
          });
        });
        if (colorHasItems) colorCount++;
      });

      const sizeEntries = Object.entries(sizeMap).filter(([, v]) => v > 0);

      // Prodotti con taglia UNICA (cappello, shopper…): mostra solo il totale pezzi
      const isUnicaOnly = sizeEntries.length === 1 && sizeEntries[0][0].toUpperCase() === 'UNICA';
      if (isUnicaOnly) {
        lines.push(`${sizeEntries[0][1]} pz`);
      } else {
        // T-shirt, felpe ecc.: mostra breakdown taglie
        const sizes = sizeEntries.map(([s, v]) => `${s}×${v}`);
        if (sizes.length > 0) lines.push(sizes.join('  '));
        if (colorCount > 0) lines.push(`${colorCount} ${colorCount === 1 ? 'colore' : 'colori'}`);
      }
    }
  } else if (cfg.singleQuantity > 0) {
    // Prodotti senza struttura taglie
    lines.push(`${cfg.singleQuantity} pz`);
  } else if (cfg.totalQuantity > 0) {
    lines.push(`${cfg.totalQuantity} pz`);
  }

  return lines.length > 0 ? lines.join(' — ') : null;
}


// ─── Card singolo item ────────────────────────────────────────────────────
function CartItemCard({ item, onRemove }) {
  const meta  = TYPE_LABELS[item.type] || { label: item.type, color: 'bg-gray-100 text-gray-700', border: 'border-gray-200' };
  const price = item.priceData;
  const cfg   = item.config;

  const hasFile = item.fileKey
    ? typeof item.fileKey === 'object' ? Object.values(item.fileKey).some(Boolean) : true
    : false;

  return (
    <div className={cn(
      'rounded-2xl border bg-white p-4 md:p-5 flex flex-col gap-4',
      'shadow-sm hover:shadow-md transition-shadow duration-200',
      meta.border
    )}>
      {/* Header card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap', meta.color)}>
              {meta.label}
            </span>
            {cfg?.isFlashOrder && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                <Zap className="w-3 h-3" /> Flash
              </span>
            )}
          </div>
          {cfg?.productName && (
            <span className="text-sm font-semibold text-gray-800 truncate">
              {cfg.productName}
            </span>
          )}
        </div>
        <button
          onClick={() => onRemove(item.cartItemId)}
          aria-label="Rimuovi prodotto dal carrello"
          className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dettagli prodotto */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
        {/* DTF */}
        {item.type === 'dtf' && (
          <>
            {cfg?.format && (
              <Detail
                label="Formato"
                value={
                  cfg.format === 'custom'
                    ? `Personalizzato — ${cfg.width ?? '?'}×${cfg.height ?? '?'} cm`
                    : (FORMAT_LABELS[cfg.format] ?? cfg.format.toUpperCase())
                }
              />
            )}
            {cfg?.quantity > 0 && <Detail label="Quantità" value={`${cfg.quantity} pz`} />}
            {cfg?.isFullService && <Detail label="Controllo File" value="Incluso" accent />}
          </>
        )}

        {/* Serigrafia */}
        {item.type === 'serigrafia' && (() => {
          const breakdown = buildSerigrafiaQuantityDetails(cfg);
          const frontPos = Array.isArray(cfg.frontPosition) ? cfg.frontPosition.map(p => POS_LABELS[p] || p) : [];
          const backPos = Array.isArray(cfg.backPosition) ? cfg.backPosition.map(p => POS_LABELS[p] || p) : [];
          return (
            <>
              {cfg?.totalQuantity > 0 && <Detail label="Quantità totale" value={`${cfg.totalQuantity} pz`} />}
              {breakdown && <Detail label="Taglie e Colori" value={breakdown} />}
              {cfg?.frontPrint && cfg.frontPrint !== 'none' && (
                <Detail 
                  label="Stampa fronte" 
                  value={`${cfg.frontPrint.replace('_', ' ')}${frontPos.length > 0 ? ` (${frontPos.join(', ')})` : ''}`} 
                />
              )}
              {cfg?.backPrint  && cfg.backPrint  !== 'none' && (
                <Detail 
                  label="Stampa retro"  
                  value={`${cfg.backPrint.replace('_', ' ')}${backPos.length > 0 ? ` (${backPos.join(', ')})` : ''}`} 
                />
              )}
              {cfg?.technique && <Detail label="Tecnica" value={cfg.technique} />}
            </>
          );
        })()}
      </div>

      {/* Stato file */}
      <div className={cn(
        'flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl',
        hasFile ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
      )}>
        {hasFile
          ? <><Package className="w-3.5 h-3.5 shrink-0" /> File caricato</>
          : <><FileText className="w-3.5 h-3.5 shrink-0" /> Nessun file — caricare in seguito</>
        }
      </div>

      {/* Prezzo */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 font-medium">Subtotale prodotto</span>
        <span className="text-lg font-black text-gray-900">
          {formatCurrency(price?.totalPrice ?? 0)}
        </span>
      </div>
    </div>
  );
}

function Detail({ label, value, accent = false }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
      <p className={cn('text-sm font-bold', accent ? 'text-indigo-600' : 'text-gray-800')}>{value}</p>
    </div>
  );
}

// ─── Carrello vuoto ────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center">
        <ShoppingCart className="w-9 h-9 text-indigo-300" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Carrello vuoto</h2>
        <p className="text-gray-500 text-sm">Configura un prodotto per iniziare.</p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna alla home
      </Link>
    </div>
  );
}

// ─── Riepilogo Prezzi (Sidebar/Footer) ────────────────────────────────────
function PriceSummary({ items }) {
  const subtotal     = items.reduce((s, i) => s + (i.priceData?.totalPrice ?? 0), 0);
  const shippingCost = 7.50; // verrà scelto nel checkout (step 6)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3 text-sm">
      <h3 className="font-bold text-gray-900 text-base mb-4">Riepilogo</h3>

      {items.map(item => {
        const meta = TYPE_LABELS[item.type] || { label: item.type };
        return (
          <div key={item.cartItemId} className="flex justify-between items-center text-gray-600">
            <span className="font-medium truncate pr-2">{meta.label}</span>
            <span className="font-semibold whitespace-nowrap">{formatCurrency(item.priceData?.totalPrice ?? 0)}</span>
          </div>
        );
      })}

      <div className="flex justify-between items-center text-gray-500 pt-2 border-t border-dashed border-gray-200">
        <span>Spedizione stimata</span>
        <span className="font-semibold text-gray-700">{formatCurrency(shippingCost)}</span>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="font-black text-gray-900 text-base">Totale</span>
        <span className="font-black text-indigo-600 text-xl">
          {formatCurrency(subtotal + shippingCost)}
        </span>
      </div>

      <p className="text-[11px] text-gray-400 text-center pt-1">
        La spedizione definitiva viene calcolata al checkout.
      </p>
    </div>
  );
}

// ─── Main CartPage ─────────────────────────────────────────────────────────
export default function CartPage() {
  const { cart, removeItem } = useCart();
  const items = cart.items;
  const SHIPPING_ESTIMATE = 7.50;
  const subtotal = items.reduce((s, i) => s + (i.priceData?.totalPrice ?? 0), 0);

  return (
    <section className="min-h-[80vh] w-full max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          aria-label="Torna alla home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">
            Il tuo Carrello
          </h1>
          {items.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {items.length} {items.length === 1 ? 'prodotto' : 'prodotti'} — completa il checkout per confermare
            </p>
          )}
        </div>
      </div>

      {/* Contenuto */}
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Colonna sinistra: lista item ── */}
          <div className="space-y-4">
            {items.map(item => (
              <CartItemCard
                key={item.cartItemId}
                item={item}
                onRemove={removeItem}
              />
            ))}

            {/* Continua shopping */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Aggiungi un altro prodotto
            </Link>
          </div>

          {/* ── Colonna destra: riepilogo prezzi sticky ── */}
          <div className="lg:sticky lg:top-28 space-y-4">
            <PriceSummary items={items} />

            {/* Form di checkout */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base mb-5">Completa l'ordine</h3>
              <CartCheckoutForm
                shippingCost={SHIPPING_ESTIMATE}
                subtotal={subtotal}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
