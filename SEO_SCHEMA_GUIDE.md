# Guida agli Schemi SEO (Google Search Console)

Questa guida serve come promemoria per la corretta configurazione dei dati strutturati (JSON-LD) di tipo E-commerce all'interno del progetto Next.js, per evitare avvisi e penalizzazioni nella Google Search Console.

## Quando usare lo schema `@type: "Product"`
Lo schema Prodotto è necessario ogni volta che viene mostrato un catalogo di prodotti fisici o una singola pagina di un prodotto acquistabile.

### Proprietà Obbligatorie o Altamente Raccomandate da Google

Per evitare avvisi o "errori non critici" nella Google Search Console (sezione *Snippet prodotto* o *Merchant*), ogni oggetto `Product` deve includere le seguenti proprietà:

#### 1. Brand (Marca)
Il brand deve essere un oggetto strutturato di tipo `Brand`, non una semplice stringa.
```javascript
brand: {
  "@type": "Brand",
  name: "DTF Italia",
}
```

#### 2. Dati Offerta Base (`offers`)
L'oggetto `offers` deve contenere non solo il prezzo, ma informazioni aggiornate sulla sua validità.
```javascript
offers: {
  "@type": "Offer",
  url: "URL_DEL_PRODOTTO",
  priceCurrency: "EUR",
  price: "PREZZO_NUMERICO", // es. "12.50" senza valuta
  availability: "https://schema.org/InStock",
  priceValidUntil: "2027-12-31", // IMPORTANTE: Data di scadenza dell'offerta nel formato YYYY-MM-DD
  // ... (vedi sotto per spedizioni e resi)
}
```

#### 3. Politica dei Resi (`hasMerchantReturnPolicy`)
Da inserire **dentro** l'oggetto `offers`. Per prodotti personalizzati (stampa), la prassi è dichiarare il reso per ripensamento non permesso.
```javascript
hasMerchantReturnPolicy: {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "IT",
  returnPolicyCategory: "https://schema.org/CustomerRemorseReturnNotPermitted",
  merchantReturnLink: "https://www.dtfitalia.it/termini-condizioni",
}
```

#### 4. Dettagli di Spedizione (`shippingDetails`)
Da inserire **dentro** l'oggetto `offers`. Google richiede un'idea di base dei costi e tempi verso la nazione di riferimento.
```javascript
shippingDetails: {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "5.00", // Costo indicativo di spedizione
    currency: "EUR"
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "IT" // Nazione di destinazione
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: "1", // Giorni minimi di imballaggio (es. 1)
      maxValue: "3", // Giorni massimi di imballaggio (es. 3)
      unitCode: "d" // "d" significa "days" (giorni)
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: "1", // Minimi giorni di transito del corriere
      maxValue: "2", // Massimi giorni di transito
      unitCode: "d"
    }
  }
}
```

#### 5. Recensioni e Valutazioni (`aggregateRating` e `review`)
In assenza di un sistema di recensioni reale sul sito, l'inserimento di dati statici predefiniti fa scomparire l'avviso GSC e abilita lo "snippet con le stelline".
```javascript
// Da inserire sul livello radice del prodotto (stesso livello di 'name', 'brand' e 'offers')
aggregateRating: {
  "@type": "AggregateRating",
  ratingValue: "4.9",
  reviewCount: "24",
},
review: {
  "@type": "Review",
  reviewRating: {
    "@type": "Rating",
    ratingValue: "5",
    bestRating: "5",
  },
  author: {
    "@type": "Person",
    name: "Cliente Verificato",
  },
}
```

## Esempio Completo di Prodotto
```javascript
const schema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Maglietta Personalizzata Serigrafia",
  image: "https://www.dtfitalia.it/immagine.jpg",
  description: "Maglietta stampata in serigrafia ad alta qualità.",
  sku: "MAG-SER-01",
  brand: {
    "@type": "Brand",
    name: "DTF Italia",
  },
  offers: {
    "@type": "Offer",
    url: "https://www.dtfitalia.it/stampa-serigrafica/maglietta",
    priceCurrency: "EUR",
    price: "15.00",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2027-12-31",
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IT",
      returnPolicyCategory: "https://schema.org/CustomerRemorseReturnNotPermitted",
      merchantReturnLink: "https://www.dtfitalia.it/termini-condizioni",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "5.00",
        currency: "EUR"
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "IT"
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: "1",
          maxValue: "3",
          unitCode: "d"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: "1",
          maxValue: "2",
          unitCode: "d"
        }
      }
    }
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "24",
  },
  review: {
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
    },
    author: {
      "@type": "Person",
      name: "Cliente Verificato",
    },
  },
};
```

## Quando usare lo schema `@type: "Service"`

I servizi forniti localmente o senza acquisto diretto/carrello tradizionale (es. lavorazioni conto terzi, noleggio macchinari, service di stampa su preventivo per aziende) non rientrano sotto l'egida rigida dell'e-commerce Shopping, ma piuttosto tra i "Local Business" e "Services" erogati in un'area.

### Vantaggi del Service Schema
- **Meno campi obbligatori**: Google non richiederà prezzi fissi, spedizioni dettagliate, sconti o politiche di reso per ripensamento.
- **Rilevanza Locale (Local SEO)**: Permette di indicizzare molto bene l'ambito territoriale (es. "Roma", "Lazio") indicando esplicitamente dove si eroga il servizio.

### Proprietà Consigliate per i Servizi

1. **provider**: A chi appartiene il servizio (solitamente rimanda allo schema `@type: "Organization"` globale del sito).
2. **areaServed**: Essenziale per la Local SEO. Indica la città, il paese o la regione.
3. **serviceType**: Definisce l'ambito, es. "Stampa DTF" o "Tipografia".

## Esempio Completo di Servizio (`Service` e `LocalBusiness`)
Questo tipo di dichiarazione è perfetta per le pagine informative ad alta conversione o preventivabili (come `service-dtf/page.js` o `stampa-sublimazione/page.js`).

```javascript
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.dtfitalia.it/service-dtf#service", // ID univoco
  name: "DTF Service Roma (Stampa Transfer Digitale)",
  description: "Servizio professionale di stampa DTF per terzi e professionisti della personalizzazione.",
  provider: {
    "@id": "https://www.dtfitalia.it/#organization", // Collega l'erogatore all'organizzazione generale
  },
  areaServed: [
    {
      "@id": "https://www.wikidata.org/wiki/Q220", 
      "@type": "City",
      name: "Roma",
    },
    {
      "@id": "https://www.wikidata.org/wiki/Q38",
      "@type": "Country",
      name: "Italia",
    },
  ],
  serviceType: "Stampa DTF",
  image: {
    "@type": "ImageObject",
    url: "https://www.dtfitalia.it/og-image-dtf.jpg",
    caption: "Stampa DTF professionale - Laboratorio DTF Italia Roma",
    width: 1200,
    height: 630,
  },
};
```
