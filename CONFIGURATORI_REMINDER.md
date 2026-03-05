# 🛠️ Reminder — Configuratori DTF Italia

## Come funziona l'integrazione Configuratore → Carrello

Il flusso di ogni configuratore segue questi passaggi:

```
Configuratore ([type]Container.jsx)
  ↓ productData={{ ... }}
CartSummaryStep (shared)
  ↓ addItem()
cart-context (sessionStorage)
  ↓
CartPage.jsx (CartItemCard)
  ↓
/api/order/route.js (WooCommerce)
```

---

## ✅ Checklist obbligatoria per ogni nuovo configuratore

Quando crei un nuovo configuratore (sublimazione, calendari, pellicole, ecc.), assicurati di includere **sempre** questi campi nel `productData` passato a `<CartSummaryStep>`:

```jsx
<CartSummaryStep
  type="[tipo]"          // 'sublimazione' | 'calendari' | 'pellicole' | ecc.
  priceData={price}
  productData={{
    // ── OBBLIGATORI ──────────────────────────────────────
    productName: product?.name || '',   // ← nome da WooCommerce → appare nel carrello
    totalQuantity,                       // ← quantità totale pezzi
    // ── TIPO-SPECIFICI ───────────────────────────────────
    // Aggiungi qui i campi specifici del tuo configuratore
  }}
  fileKey={fileKeys}
  cartItemId={cartItemId}
  brandColor="[colore]"
  onBack={...}
/>
```

---

## ✅ Checklist TYPE_LABELS in CartPage.jsx

Ogni nuovo tipo deve essere aggiunto a `TYPE_LABELS` in `src/components/cart/CartPage.jsx`:

```js
const TYPE_LABELS = {
  dtf: {
    label: "Stampa DTF",
    color: "bg-indigo-100 text-indigo-700",
    border: "border-indigo-200",
  },
  serigrafia: {
    label: "Stampa Serigrafica",
    color: "bg-red-100 text-red-700",
    border: "border-red-200",
  },
  sublimazione: {
    label: "Sublimazione",
    color: "bg-purple-100 text-purple-700",
    border: "border-purple-200",
  },
  calendari: {
    label: "Calendari",
    color: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
  },
  pellicole: {
    label: "Pellicole Serigrafia",
    color: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
  },
  // ← aggiungi qui i nuovi tipi
};
```

---

## ✅ Checklist colori brand (coerenza tra tutti gli snippet)

| Tipo           | Colore HEX | Note       |
| -------------- | ---------- | ---------- |
| `dtf`          | `#4f46e5`  | Indigo-600 |
| `serigrafia`   | `#dc2626`  | Red-600    |
| `sublimazione` | `#7c3aed`  | Violet-600 |
| `calendari`    | `#0891b2`  | Cyan-600   |
| `pellicole`    | `#0369a1`  | Sky-700    |

Questi colori vanno mantenuti coerenti in:

- `CartPage.jsx` → `TYPE_LABELS`
- `SerigrafiaContainer.jsx` (e ogni altro Container) → brand_colors PHP
- Tutti gli snippet PHP WooCommerce (Formattatore v5.0, Colonna Reparto, Colonna File)

---

## 🤖 Prompt da usare quando crei un nuovo configuratore

Copia e incolla questo prompt quando avvii lo sviluppo di un nuovo configuratore:

---

```
Devo creare un nuovo configuratore per il prodotto [NOME PRODOTTO] nel progetto DTF Italia (Next.js App Router).

Studia prima di tutto questi file per capire il pattern esistente:
- src/components/configurator/serigrafia/SerigrafiaContainer.jsx  (configuratore di riferimento)
- src/components/configurator/shared/CartSummaryStep.jsx          (step riepilogo comune)
- src/components/configurator/shared/FileUploader.jsx             (uploader S3)
- src/components/configurator/shared/ShippingSelector.jsx         (selezione spedizione)
- src/components/cart/CartPage.jsx                                 (carrello)
- src/lib/cart-context.jsx                                         (gestione stato carrello)
- src/app/api/order/route.js                                       (API creazione ordine WooCommerce)
- CONFIGURATORI_REMINDER.md                                        (questo file — checklist!)

Il nuovo configuratore deve:
1. Ricevere `product` come prop (oggetto WooCommerce con almeno `product.name`, `product.id`, `product.slug`)
2. Passare `productName: product?.name || ''` nel productData della CartSummaryStep
3. Usare `type="[tipo]"` con il tipo appropriato già presente in CartPage.jsx TYPE_LABELS
4. Integrare FileUploader in modalità `uploadMode="s3"` con `cartItemId` e `position`
5. Seguire il pattern a step: Step 1 (Config) → Step 2 (Upload file) → Step 3 (Riepilogo)
6. Essere un Client Component ('use client')

Tipo del nuovo configuratore: [TIPO es: sublimazione / calendari / pellicole]
Prodotti WooCommerce target: [es. Tazze, Calzini, Felpe tecniche]
Posizioni di stampa disponibili: [es. solo fronte / fronte+retro / nessuna]
Ha selezione taglie/colori? [SI/NO — se SI studia ConfigStep.jsx di serigrafia]
```

---

## 📁 File chiave del sistema

| File                                                             | Responsabilità                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| `src/components/configurator/serigrafia/SerigrafiaContainer.jsx` | Configuratore serigrafia (usa come template)            |
| `src/components/configurator/shared/CartSummaryStep.jsx`         | Step riepilogo (comune a tutti)                         |
| `src/components/configurator/shared/FileUploader.jsx`            | Upload S3 con posizione                                 |
| `src/components/cart/CartPage.jsx`                               | Carrello — TYPE_LABELS, CartItemCard                    |
| `src/lib/cart-context.jsx`                                       | Stato carrello in sessionStorage                        |
| `src/app/api/order/route.js`                                     | Ordine WooCommerce — Branch A (cart)                    |
| `src/lib/breadcrumb-config.js`                                   | Breadcrumb — aggiungi le route del nuovo configuratore! |
