'use client';

import { CartProvider } from '@/lib/cart-context';

/**
 * Wrapper client-side che raggruppa tutti i providers dell'app.
 * Necessario perché layout.js è un Server Component e non può 
 * importare direttamente Client Contexts.
 */
export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}

