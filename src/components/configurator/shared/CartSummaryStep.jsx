'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, CheckCircle2, FileText, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount ?? 0);
}

export default function CartSummaryStep({ 
  type,
  priceData,
  productData,
  fileKey,          // S3 key (string o oggetto {front, back} per serigrafia)
  cartItemId,       // UUID associato al file S3 in uploads/cart/{cartItemId}/
  brandColor = 'indigo',
  onBack,
}) {
  const { addItem, cart } = useCart();
  const router = useRouter();

  const isRed = brandColor === 'red';

  const btnClass = isRed
    ? 'bg-red-600 hover:bg-red-700 shadow-red-100 focus-visible:ring-red-500'
    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 focus-visible:ring-indigo-500';

  const hasFile = fileKey
    ? typeof fileKey === 'object'
      ? Object.values(fileKey).some(Boolean)
      : true
    : false;

  const handleAddToCart = () => {
    addItem({
      cartItemId,
      type,
      config: productData,
      priceData,
      fileKey,
      addedAt: new Date().toISOString(),
    });
    // Redirect al carrello
    router.push('/carrello');
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6">

      {/* Titolo */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Riepilogo Ordine</h2>
        <p className="text-sm text-gray-500 mt-1">
          Controlla i dettagli prima di aggiungere al carrello.
        </p>
      </div>

      {/* Riepilogo ordine inline */}
      <div className={cn(
        'rounded-2xl border p-4 space-y-3',
        isRed ? 'border-red-100 bg-red-50/40' : 'border-indigo-100 bg-indigo-50/40'
      )}>
        <div className="flex items-center gap-2">
          <Tag className={cn('w-4 h-4', isRed ? 'text-red-600' : 'text-indigo-600')} />
          <span className={cn('text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
            isRed ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
          )}>
            {type}
          </span>
        </div>
        {priceData?.technique && (
          <p className="text-sm text-gray-600">Tecnica: <strong>{priceData.technique}</strong></p>
        )}
        {priceData?.totalQuantity > 0 && (
          <p className="text-sm text-gray-600">Quantità: <strong>{priceData.totalQuantity} pz</strong></p>
        )}
        <div className={cn('flex justify-between items-center pt-2 border-t font-bold text-base',
          isRed ? 'border-red-200 text-red-700' : 'border-indigo-200 text-indigo-700'
        )}>
          <span>Totale</span>
          <span>{formatCurrency(priceData?.totalPrice ?? priceData?.finalTotal)}</span>
        </div>
      </div>

      {/* Stato File Caricato */}
      {hasFile ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600" />
          <span>File caricato e associato a questo ordine</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span>Nessun file caricato — puoi procedere e caricarlo in seguito.</span>
        </div>
      )}

      {/* Contatore carrello attuale */}
      {cart.items.length > 0 && (
        <p className="text-center text-xs text-gray-400">
          Hai già{' '}
          <span className="font-semibold text-gray-600">
            {cart.items.length} {cart.items.length === 1 ? 'prodotto' : 'prodotti'}
          </span>{' '}
          nel carrello
        </p>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className={cn(
            'w-full py-4 rounded-xl font-bold text-white text-sm uppercase tracking-widest',
            'transition-all shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            btnClass
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Aggiungi al Carrello
          </span>
        </button>

        <button 
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna all'upload
        </button>
      </div>
    </div>
  );
}
