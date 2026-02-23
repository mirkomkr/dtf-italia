# 🖼️ IMAGE SPECS — DTF Italia

Specifiche tecniche ottimizzate per tutti gli asset immagine del progetto Next.js.

---

## 📐 Regole Generali

| Proprietà            | Valore                                                    |
| -------------------- | --------------------------------------------------------- |
| **Formato primario** | WebP                                                      |
| **Formato fallback** | JPG (Safari < 14)                                         |
| **Qualità default**  | 85                                                        |
| **Ottimizzazione**   | Next.js `<Image>` — conversione automatica in WebP        |
| **Tool consigliato** | [Squoosh](https://squoosh.app) · Figma Export · Sharp CLI |

> Tutte le immagini vanno posizionate in `/public/images/`.  
> Next.js le servirà ottimizzate automaticamente dalla route `/_next/image`.

---

## 🃏 Hero Images (Above-the-fold / LCP)

Usate nel slot destro del layout 50/50 delle pagine di servizio.

| Pagina               | File                     | Dimensioni       | Quality | `priority`      |
| -------------------- | ------------------------ | ---------------- | ------- | --------------- |
| Service DTF          | `hero-dtf.webp`          | **800 × 600 px** | 85      | ✅ obbligatorio |
| Stampa Serigrafica   | `hero-serigrafia.webp`   | **800 × 600 px** | 85      | ✅ obbligatorio |
| Stampa Sublimazione  | `hero-sublimazione.webp` | **800 × 600 px** | 85      | ✅ obbligatorio |
| Stampa Calendari     | `hero-calendari.webp`    | **800 × 600 px** | 85      | ✅ obbligatorio |
| Pellicole Serigrafia | `hero-pellicole.webp`    | **800 × 600 px** | 85      | ✅ obbligatorio |

**Aspect ratio:** `4/3`  
**`sizes` prop:** `(max-width: 1024px) 100vw, 50vw`  
**`className`:** `w-full h-auto rounded-2xl shadow-2xl object-cover`

```jsx
<Image
  src="/images/hero-[servizio].webp"
  alt="[Descrizione SEO specifica del servizio] - DTF Italia Roma"
  width={800}
  height={600}
  priority          {/* OBBLIGATORIO — è il LCP element */}
  quality={85}
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
/>
```

---

## 🏷️ Logo

| Variante                         | File                        | Dimensioni       | Formato | Note                                               |
| -------------------------------- | --------------------------- | ---------------- | ------- | -------------------------------------------------- |
| Principale (sfondo chiaro)       | `dtf-italia-logo.svg`       | vettoriale       | **SVG** | Sharpness infinita, zero bytes per rasterizzazione |
| Negativo (sfondo scuro / header) | `dtf-italia-logo-white.svg` | vettoriale       | **SVG** | Header e hero scuri                                |
| Social / Open Graph              | `dtf-italia-og.png`         | **512 × 512 px** | PNG-32  | Trasparenza richiesta                              |

**Path:** `/public/images/logos/`

---

## 🌐 Open Graph / Social Preview

Usata nei meta tag `og:image` e `twitter:image`.

| File                  | Dimensioni        | Formato | Quality |
| --------------------- | ----------------- | ------- | ------- |
| `og-default.jpg`      | **1200 × 630 px** | JPG     | 90      |
| `og-dtf.jpg`          | 1200 × 630 px     | JPG     | 90      |
| `og-serigrafia.jpg`   | 1200 × 630 px     | JPG     | 90      |
| `og-sublimazione.jpg` | 1200 × 630 px     | JPG     | 90      |
| `og-calendari.jpg`    | 1200 × 630 px     | JPG     | 90      |
| `og-pellicole.jpg`    | 1200 × 630 px     | JPG     | 90      |

**Path:** `/public/images/og/`

```js
// In ogni page.js / layout.js
export const metadata = {
  openGraph: {
    images: [{ url: "/images/og/og-[servizio].jpg", width: 1200, height: 630 }],
  },
};
```

---

## 🌟 Favicon & App Icons

Posizionare direttamente in `src/app/` — Next.js li rileva automaticamente.

| File             | Dimensioni                   | Formato | Note                 |
| ---------------- | ---------------------------- | ------- | -------------------- |
| `favicon.ico`    | 16 · 32 · 48 px (multi-size) | ICO     | Browser tab standard |
| `icon.png`       | **32 × 32 px**               | PNG-8   | PWA / shortcut       |
| `apple-icon.png` | **180 × 180 px**             | PNG-24  | iOS homescreen       |
| `icon-192.png`   | 192 × 192 px                 | PNG     | Android PWA          |
| `icon-512.png`   | 512 × 512 px                 | PNG     | Android PWA splash   |

> ⚠️ Non usare nomi diversi: Next.js usa convention-based discovery per `favicon.ico`, `icon.*`, `apple-icon.*`.

---

## 🗂️ Struttura Directory Completa

```
public/
└── images/
    ├── logos/
    │   ├── dtf-italia-logo.svg          ← logo principale
    │   ├── dtf-italia-logo-white.svg    ← variante negativa (header/hero)
    │   └── dtf-italia-og.png            ← 512×512 per OG/social
    ├── og/
    │   ├── og-default.jpg               ← 1200×630 — fallback globale
    │   ├── og-dtf.jpg
    │   ├── og-serigrafia.jpg
    │   ├── og-sublimazione.jpg
    │   ├── og-calendari.jpg
    │   └── og-pellicole.jpg
    ├── hero-dtf.webp                    ← 800×600
    ├── hero-serigrafia.webp             ← 800×600
    ├── hero-sublimazione.webp           ← 800×600
    ├── hero-calendari.webp              ← 800×600
    └── hero-pellicole.webp              ← 800×600

src/app/
├── favicon.ico                          ← multi-size 16/32/48px
├── icon.png                             ← 32×32
└── apple-icon.png                       ← 180×180
```

---

## ⚙️ Configurazione Next.js (`next.config.mjs`)

Impostazioni attualmente configurate:

```js
images: {
  // Formato output automatico: WebP per browser compatibili
  // Fallback: JPEG per browser legacy
  remotePatterns: [
    { protocol: 'https', hostname: 'wp.dtfitalia.it', pathname: '/wp-content/uploads/**' },
    { protocol: 'https', hostname: 'dtfitalia.it',    pathname: '/wp-content/uploads/**' },
  ],
}
```

Per abilitare AVIF (formato più efficiente di WebP, ~30% più leggero):

```js
images: {
  formats: ['image/avif', 'image/webp'], // AVIF prima, WebP come fallback
}
```

## 🔄 Workflow Placeholder → Image

> Il `<div>` placeholder **non va rimosso subito**. Va tenuto finché l'asset WebP non è pronto.  
> Solo quando il file è disponibile in `/public/images/`, esegui questi 3 passi:

**Step 1** — Posiziona il file in `/public/images/`:

```
landing-dtf.webp        (o hero-dtf.webp per gli Hero)
landing-serigrafia.webp
ecc.
```

**Step 2** — Decommentare il blocco `<Image>` (rimuovi i `/*` e `*/`):

```jsx
// prima (commentato)
{
  /*
   * <Image src={...} .../>
   */
}

// dopo (attivo)
<Image
  src={`/images/landing-${id}.webp`}
  alt={`${title} - DTF Italia Roma`}
  width={800}
  height={600}
  priority={id === "dtf"}
  quality={85}
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="w-full h-auto rounded-2xl shadow-2xl object-cover"
/>;
```

**Step 3** — Rimuovere il `<div>` placeholder sotto (quello con il commento `{/* Placeholder visivo */}`):

```jsx
// rimuovere questo intero blocco:
{
  /* Placeholder visivo — rimuovere quando l'<Image> sopra è attivo */
}
<div className="w-full max-w-md aspect-[4/3] ...">...</div>;
```

> ⚠️ Rimuovi il `<div>` **solo dopo** aver verificato che l'`<Image>` carica correttamente nel browser.

---

1. **Esporta** da Figma/Photoshop in PNG o TIFF lossless
2. **Converti in WebP** con [Squoosh](https://squoosh.app):
   - Codec: `WebP`
   - Quality: `85`
   - Effort: `6` (bilanciato velocità/compressione)
3. **Verifica dimensioni** rispettino le specifiche della tabella sopra
4. **Posiziona** in `/public/images/` con il nome esatto indicato
5. **Decommentare** il blocco `<Image>` nel rispettivo Hero component
6. **Rimuovere** il `<div>` placeholder sottostante
7. **Verificare LCP** con Lighthouse o PageSpeed Insights

---

_Ultima revisione: 2026-02-23_
