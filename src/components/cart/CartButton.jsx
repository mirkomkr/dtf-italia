'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const { itemCount } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Mostra il bottone solo se ci sono item nel carrello
  useEffect(() => {
    setIsVisible(itemCount > 0);
  }, [itemCount]);

  // Bounce animation ogni volta che un nuovo item viene aggiunto
  useEffect(() => {
    if (itemCount > prevCount && prevCount >= 0) {
      setIsBouncing(true);
      const t = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount]);

  if (!isVisible) return null;

  return (
    <Link
      href="/carrello"
      aria-label={`Carrello — ${itemCount} ${itemCount === 1 ? 'prodotto' : 'prodotti'}`}
      className={cn(
        // Posizione e base
        'fixed bottom-6 right-5 z-50',
        // Shape
        'flex items-center gap-2.5 rounded-full',
        'px-4 py-3 md:px-5',
        // Colori e shadow premium
        'bg-indigo-600 text-white',
        'shadow-[0_8px_30px_rgba(79,70,229,0.45)]',
        // Transizioni e hover
        'transition-all duration-300 ease-out',
        'hover:bg-indigo-700 hover:shadow-[0_12px_40px_rgba(79,70,229,0.55)] hover:-translate-y-1',
        'active:scale-95 active:translate-y-0',
        // Focus accessibilità
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2',
        // Bounce
        isBouncing && 'animate-bounce'
      )}
    >
      {/* Icona carrello */}
      <div className="relative">
        <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
        {/* Badge superiore */}
        <span
          className={cn(
            'absolute -top-2.5 -right-2.5',
            'flex items-center justify-center',
            'min-w-[18px] h-[18px] px-1',
            'rounded-full bg-red-500 text-white',
            'text-[10px] font-black leading-none',
            'ring-2 ring-indigo-600',
            'transition-transform duration-300',
            isBouncing ? 'scale-125' : 'scale-100'
          )}
          aria-hidden="true"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      </div>

      {/* Label — visibile su schermi md+ */}
      <span className="hidden md:inline text-sm font-bold tracking-wide whitespace-nowrap">
        Carrello
      </span>
    </Link>
  );
}
