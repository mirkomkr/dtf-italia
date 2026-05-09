export const IS_DEV_MODE = false;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dtfitalia.it';
export const CHECKOUT_ENABLED = false;

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  FLAG DI CONTROLLO ORDINI
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 *  ┌─────────────────┬───────────────────┬───────────────────────────────────────┐
 *  │  IS_DEV_MODE    │  CHECKOUT_ENABLED  │  Scenario                            │
 *  ├─────────────────┼───────────────────┼───────────────────────────────────────┤
 *  │  false          │  false            │  🔒 PROD — Sito online, ordini        │
 *  │                 │                   │     bloccati. Nessuno può ordinare.   │
 *  ├─────────────────┼───────────────────┼───────────────────────────────────────┤
 *  │  false          │  true             │  ✅ PROD — Checkout attivo per i      │
 *  │                 │                   │     clienti. Ordini reali in prod.    │
 *  ├─────────────────┼───────────────────┼───────────────────────────────────────┤
 *  │  true           │  true             │  🧪 DEV — Pannello test visibile in   │
 *  │                 │                   │     localhost. skipS3 attivo, ordini  │
 *  │                 │                   │     di test senza operazioni S3 reali.│
 *  └─────────────────┴───────────────────┴───────────────────────────────────────┘
 *
 *  ⚠️  Questi valori NON sono esposti al browser (nessun prefisso NEXT_PUBLIC_).
 *      Sono valutati solo server-side. Dopo ogni modifica: rebuild + redeploy.
 *
 *  Gate applicato in:
 *    - src/app/api/order/route.js          → blocco API (503 se CHECKOUT_ENABLED false)
 *    - src/components/cart/CartPage.jsx    → blocco UI (banner + form nascosto)
 *    - src/components/cart/CartCheckoutForm.jsx → skipS3 forzato se IS_DEV_MODE
 */
