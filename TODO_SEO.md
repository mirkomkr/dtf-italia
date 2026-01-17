# TODO List - Dati da Completare Prima del Lancio

## Riepilogo
Sono stati identificati **13 commenti TODO** distribuiti in **6 file** che richiedono l'inserimento di dati aziendali reali.

---

## 📋 File da Modificare

### 1. [lib/schemas/localBusiness.js](file:///home/mirko/Documenti/DTF%20Italia/Nextjs+WC%202026/dtf-italia/src/lib/schemas/localBusiness.js) 
**8 TODO** - File principale con tutti i dati aziendali

#### Dati da Inserire:

| Linea | Campo | Valore Attuale | Azione Richiesta |
|-------|-------|----------------|------------------|
| 18 | `telephone` | `+39-XXX-XXXXXXX` | Inserire numero di telefono reale |
| 19 | `email` | `info@dtfitalia.it` | Verificare/confermare email |
| 22 | `streetAddress` | `Via XXXXX` | Inserire indirizzo completo |
| 25 | `postalCode` | `00XXX` | Inserire CAP reale |
| 30 | `latitude` | `41.9028` | Inserire latitudine esatta |
| 31 | `longitude` | `12.4964` | Inserire longitudine esatta |
| 43 | `mainEntityOfPage` | Commentato | Inserire URL Google Business Profile |
| 47 | `openingHoursSpecification` | `[]` | Aggiungere orari di apertura |

**Esempio Orari di Apertura**:
```javascript
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Saturday",
    "opens": "09:00",
    "closes": "13:00"
  }
]
```

---

### 2. [app/stampa-serigrafica/page.js](file:///home/mirko/Documenti/DTF%20Italia/Nextjs+WC%202026/dtf-italia/src/app/stampa-serigrafica/page.js)
**1 TODO** - Linea 67

```javascript
// TODO: Insert Google Business Profile URL when available
// "mainEntityOfPage": "https://www.google.com/maps/place/...",
```

**Azione**: Decommentare e inserire URL Google Business Profile

---

### 3. [app/stampa-sublimazione/page.js](file:///home/mirko/Documenti/DTF%20Italia/Nextjs+WC%202026/dtf-italia/src/app/stampa-sublimazione/page.js)
**1 TODO** - Linea 63

```javascript
// TODO: Insert Google Business Profile URL when available
// "mainEntityOfPage": "https://www.google.com/maps/place/...",
```

**Azione**: Decommentare e inserire URL Google Business Profile

---

### 4. [app/stampa-calendari/page.js](file:///home/mirko/Documenti/DTF%20Italia/Nextjs+WC%202026/dtf-italia/src/app/stampa-calendari/page.js)
**1 TODO** - Linea 63

```javascript
// TODO: Insert Google Business Profile URL when available
// "mainEntityOfPage": "https://www.google.com/maps/place/...",
```

**Azione**: Decommentare e inserire URL Google Business Profile

---

### 5. [app/pellicole-serigrafia/page.js](file:///home/mirko/Documenti/DTF%20Italia/Nextjs+WC%202026/dtf-italia/src/app/pellicole-serigrafia/page.js)
**1 TODO** - Linea 48

```javascript
// TODO: Insert Google Business Profile URL when available
// "mainEntityOfPage": "https://www.google.com/maps/place/...",
```

**Azione**: Decommentare e inserire URL Google Business Profile

---

### 6. [app/service-dtf/page.js](file:///home/mirko/Documenti/DTF%20Italia/Nextjs+WC%202026/dtf-italia/src/app/service-dtf/page.js)
**1 TODO** - Linea 79

```javascript
// TODO: Insert Google Business Profile URL when available
// "mainEntityOfPage": "https://www.google.com/maps/place/...",
```

**Azione**: Decommentare e inserire URL Google Business Profile

---

## 🎯 Priorità di Completamento

### Priorità ALTA (Blocca SEO)
1. **Google Business Profile URL** (5 file)
   - Necessario per `mainEntityOfPage` in tutti gli schema Service/Product
   - Migliora Local SEO e SGE

2. **Coordinate GPS Esatte** (localBusiness.js)
   - Necessarie per Local SEO e Google Maps integration
   - Usare [Google Maps](https://www.google.com/maps) per ottenere coordinate precise

### Priorità MEDIA (Migliora SEO)
3. **Indirizzo Completo** (localBusiness.js)
   - Via, CAP
   - Necessario per Rich Snippets

4. **Telefono** (localBusiness.js)
   - Necessario per Click-to-Call in SERP

### Priorità BASSA (Opzionale)
5. **Email** (localBusiness.js)
   - Verificare se `info@dtfitalia.it` è corretto

6. **Orari di Apertura** (localBusiness.js)
   - Migliora Local SEO ma non bloccante

---

## 📝 Come Ottenere Google Business Profile URL

1. Vai su [Google Business Profile](https://business.google.com/)
2. Accedi con l'account Google associato all'attività
3. Seleziona la tua attività "DTF Italia"
4. Clicca su "Visualizza profilo" o "Share"
5. Copia l'URL completo (formato: `https://www.google.com/maps/place/...`)

**Esempio URL**:
```
https://www.google.com/maps/place/DTF+Italia/@41.9028,12.4964,15z/data=...
```

---

## 🔧 Come Ottenere Coordinate GPS Esatte

1. Vai su [Google Maps](https://www.google.com/maps)
2. Cerca l'indirizzo esatto della sede
3. Click destro sul marker
4. Seleziona "Cosa c'è qui?"
5. Copia latitudine e longitudine dal popup

**Formato**:
- Latitudine: `41.902800` (esempio)
- Longitudine: `12.496400` (esempio)

---

## ✅ Checklist Completamento

- [ ] Inserire telefono in `localBusiness.js`
- [ ] Verificare email in `localBusiness.js`
- [ ] Inserire indirizzo completo in `localBusiness.js`
- [ ] Inserire CAP in `localBusiness.js`
- [ ] Inserire coordinate GPS esatte in `localBusiness.js`
- [ ] Inserire Google Business Profile URL in `localBusiness.js`
- [ ] Aggiungere orari di apertura in `localBusiness.js`
- [ ] Inserire Google Business Profile URL in `stampa-serigrafica/page.js`
- [ ] Inserire Google Business Profile URL in `stampa-sublimazione/page.js`
- [ ] Inserire Google Business Profile URL in `stampa-calendari/page.js`
- [ ] Inserire Google Business Profile URL in `pellicole-serigrafia/page.js`
- [ ] Inserire Google Business Profile URL in `service-dtf/page.js`
- [ ] Processare tutte le immagini con metadati EXIF (GPS + Brand)

---

## 🚀 Impatto SEO

Una volta completati tutti i TODO:
- ✅ **Local SEO**: Coordinate GPS + indirizzo completo
- ✅ **Rich Snippets**: Telefono, orari, indirizzo visibili in SERP
- ✅ **Google Maps Integration**: Link diretto al profilo business
- ✅ **SGE Optimization**: `mainEntityOfPage` migliora comprensione AI
- ✅ **Click-to-Call**: Telefono cliccabile nei risultati mobile
