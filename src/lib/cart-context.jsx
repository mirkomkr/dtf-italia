'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
/**
 * CartItem shape:
 * {
 *   cartItemId: string,        // uuid v4 generato al momento dell'upload
 *   type: string,              // 'dtf' | 'serigrafia' | 'sublimazione' | 'calendari'
 *   config: object,            // configurazione prodotto (formato, quantità, ecc.)
 *   priceData: object,         // dati prezzo calcolati
 *   fileKey: string | null,    // S3 key: uploads/cart/{cartItemId}/file.pdf
 *   addedAt: string,           // ISO timestamp
 * }
 */

// ─── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Evita duplicati per lo stesso cartItemId
      const exists = state.items.some(i => i.cartItemId === action.payload.cartItemId);
      if (exists) return state;
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.cartItemId !== action.cartItemId) };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext(null);

const STORAGE_KEY = 'dtf-cart';

function initCart() {
  if (typeof window === 'undefined') return { items: [] };
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, initCart);

  // Sincronizza con sessionStorage ad ogni cambiamento
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // sessionStorage non disponibile (es. modalità privata con storage pieno)
    }
  }, [cart]);

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((cartItemId) => {
    dispatch({ type: 'REMOVE_ITEM', cartItemId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  }, []);

  // Totale aggregato di tutti gli item nel carrello
  const cartTotal = cart.items.reduce((sum, item) => {
    return sum + (item.priceData?.totalPrice ?? 0);
  }, 0);

  const value = {
    cart,
    cartTotal,
    itemCount: cart.items.length,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart deve essere usato all\'interno di <CartProvider>');
  }
  return ctx;
}
