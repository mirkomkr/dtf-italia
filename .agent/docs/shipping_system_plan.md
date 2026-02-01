# Piano Implementazione Sistema Shipping Dinamico 2026

## 🎯 Obiettivo

Implementare un sistema di spedizione dinamico che:
1. **Separa** costo prodotto da costo spedizione
2. **Offre opzioni** basate su tempistiche (Express/Standard/Economy)
3. **Calcola tariffe** in tempo reale o con logica configurabile
4. **Integra** con corrieri italiani (BRT, GLS, Poste Italiane, DHL, UPS)

---

## 📊 Best Practice E-commerce 2026

### Tendenze Mercato Italiano

**Priorità Consumatori IT**:
- ✅ **Trasparenza costi**: Spese spedizione chiare prima del checkout
- ✅ **Scelta tempistiche**: Opzioni multiple (veloce vs economica)
- ✅ **Tracking real-time**: Monitoraggio ordine
- ✅ **Resi semplici**: Gestione resi integrata

**Aspettative Delivery**:
- 🚀 **Express**: 24-48h (€8-15)
- 📦 **Standard**: 3-5 giorni (€5-8)
- 💰 **Economy**: 5-7 giorni (€3-5)
- 🎁 **Gratis**: Soglia minima (es. >€50)

---

## 🏗️ Architettura Proposta

### Livello 1: Separazione Costi (Immediato)

**Frontend (Configuratore)**:
```javascript
const pricing = {
  productCost: 125.50,    // Costo produzione + margine
  shippingCost: 7.90,     // Costo spedizione
  totalCost: 133.40       // Totale
}
```

**Visualizzazione**:
```
┌─────────────────────────────────┐
│ Riepilogo Ordine                │
├─────────────────────────────────┤
│ Prodotto personalizzato  €125.50│
│ Spedizione Standard      €  7.90│
├─────────────────────────────────┤
│ TOTALE                   €133.40│
└─────────────────────────────────┘
```

### Livello 2: Opzioni Tempistiche

**Selezione Shipping**:
```javascript
const shippingOptions = [
  {
    id: 'express',
    name: 'Express 24-48h',
    cost: 12.90,
    deliveryDays: '1-2',
    carrier: 'DHL Express'
  },
  {
    id: 'standard',
    name: 'Standard 3-5 giorni',
    cost: 7.90,
    deliveryDays: '3-5',
    carrier: 'BRT'
  },
  {
    id: 'economy',
    name: 'Economy 5-7 giorni',
    cost: 4.90,
    deliveryDays: '5-7',
    carrier: 'Poste Italiane'
  }
]
```

---

## 🔧 Opzioni Implementazione

### Opzione A: Base (WooCommerce Nativo) ⭐

**Pro**:
- ✅ Nessun costo aggiuntivo
- ✅ Setup veloce (1-2 ore)
- ✅ Manutenzione semplice

**Contro**:
- ❌ Tariffe statiche (no real-time)
- ❌ Logica limitata
- ❌ Aggiornamento manuale

**Implementazione**:
1. **WooCommerce Shipping Zones**
2. **Flat Rate** per ogni opzione (Express/Standard/Economy)
3. **Conditional Logic** per soglie gratuite

**Costo**: €0  
**Tempo**: 2 ore  
**Complessità**: Bassa

---

### Opzione B: Intermedia (Table Rate Plugin) ⭐⭐⭐

**Pro**:
- ✅ Logica condizionale avanzata
- ✅ Tariffe basate su peso/dimensioni/valore
- ✅ Tempistiche configurabili
- ✅ Costo contenuto

**Contro**:
- ⚠️ Richiede plugin (€49-99/anno)
- ⚠️ Configurazione manuale tariffe
- ⚠️ No integrazione real-time corrieri

**Plugin Consigliati**:
1. **WooCommerce Table Rate Shipping** (Ufficiale) - €99/anno
2. **Flexible Shipping PRO** - €49/anno
3. **Conditional Shipping Rates** - €79/anno

**Implementazione**:
1. Installare plugin Table Rate
2. Configurare zone Italia
3. Definire regole per Express/Standard/Economy
4. Impostare condizioni (peso, valore, destinazione)

**Costo**: €49-99/anno  
**Tempo**: 4-6 ore  
**Complessità**: Media

---

### Opzione C: Avanzata (Real-Time API) ⭐⭐⭐⭐⭐

**Pro**:
- ✅ Tariffe real-time da corrieri
- ✅ Calcolo automatico tempi consegna
- ✅ Tracking integrato
- ✅ Gestione resi automatica
- ✅ Scalabile e professionale

**Contro**:
- ❌ Costo mensile API
- ❌ Setup complesso (8-12 ore)
- ❌ Manutenzione tecnica

**Servizi Consigliati 2026**:

#### 1. **Shippo** (Consigliato) 🏆

**Caratteristiche**:
- 40+ corrieri globali (DHL, UPS, FedEx, Poste Italiane)
- API real-time rates
- Label generation automatica
- Tracking integrato
- Sconti negoziati con corrieri

**Pricing**:
- Free tier: 50 spedizioni/mese
- Pro: $10/mese + $0.05/label
- Enterprise: Custom

**API Example**:
```javascript
// GET /shipments/{id}/rates
{
  "rates": [
    {
      "carrier": "DHL Express",
      "service": "Express 24h",
      "amount": "12.90",
      "currency": "EUR",
      "delivery_days": 1,
      "estimated_delivery": "2026-02-03"
    },
    {
      "carrier": "BRT",
      "service": "Standard",
      "amount": "7.90",
      "currency": "EUR",
      "delivery_days": 3,
      "estimated_delivery": "2026-02-05"
    }
  ]
}
```

#### 2. **Sendcloud** (Focalizzato Europa)

**Caratteristiche**:
- Forte presenza Italia (acquisizione isendu 2024)
- Integrazione BRT, GLS, TNT, InPost
- Tariffe pre-negoziate o contratti custom
- Delivery deadlines garantite

**Pricing**:
- Essential: €25/mese (100 spedizioni)
- Plus: €45/mese (500 spedizioni)
- Premium: €99/mese (illimitate)

#### 3. **ShipEngine**

**Caratteristiche**:
- Multi-carrier rate comparison
- Label generation
- Address validation
- Tracking

**Pricing**:
- Pay-as-you-go: $0.05/label
- Volume discounts disponibili

**Costo**: €25-99/mese + €0.05/spedizione  
**Tempo**: 8-12 ore sviluppo  
**Complessità**: Alta

---

## 💡 Soluzione Consigliata: Approccio Ibrido

### Fase 1: Immediata (1 settimana)

**Setup Base con Table Rate**:
1. Installare **Flexible Shipping PRO** (€49/anno)
2. Configurare 3 opzioni shipping
3. Separare costi nel configuratore
4. Testare con ordini reali

**Configurazione Tariffe**:

| Opzione | Peso <5kg | Peso 5-10kg | Peso >10kg | Tempo |
|---------|-----------|-------------|------------|-------|
| **Express** | €12.90 | €18.90 | €24.90 | 24-48h |
| **Standard** | €7.90 | €11.90 | €15.90 | 3-5gg |
| **Economy** | €4.90 | €7.90 | €10.90 | 5-7gg |

**Soglia Gratuita**: >€80 (solo Standard/Economy)

### Fase 2: Evoluzione (2-3 mesi)

**Integrazione Shippo API**:
1. Account Shippo (Free tier)
2. Endpoint Next.js `/api/shipping/rates`
3. Calcolo real-time al checkout
4. Fallback su tariffe statiche

**Architettura**:
```
Frontend → /api/shipping/rates → Shippo API → Corrieri
                ↓ (fallback)
         Table Rate Plugin (WooCommerce)
```

---

## 🔨 Implementazione Tecnica

### Step 1: Separazione Costi nel Configuratore

**File**: `pricing-config.js`

```javascript
export const SHIPPING_CONFIG = {
  options: [
    {
      id: 'express',
      name: 'Express 24-48h',
      description: 'Consegna garantita in 1-2 giorni lavorativi',
      baseCost: 12.90,
      freeThreshold: null, // Mai gratis
      carrier: 'DHL Express',
      deliveryDays: { min: 1, max: 2 }
    },
    {
      id: 'standard',
      name: 'Standard 3-5 giorni',
      description: 'Consegna in 3-5 giorni lavorativi',
      baseCost: 7.90,
      freeThreshold: 80, // Gratis sopra €80
      carrier: 'BRT',
      deliveryDays: { min: 3, max: 5 }
    },
    {
      id: 'economy',
      name: 'Economy 5-7 giorni',
      description: 'Consegna economica in 5-7 giorni lavorativi',
      baseCost: 4.90,
      freeThreshold: 100, // Gratis sopra €100
      carrier: 'Poste Italiane',
      deliveryDays: { min: 5, max: 7 }
    }
  ],
  
  // Incrementi per peso
  weightSurcharges: [
    { maxKg: 5, surcharge: 0 },
    { maxKg: 10, surcharge: 6 },
    { maxKg: 20, surcharge: 12 },
    { maxKg: Infinity, surcharge: 18 }
  ]
};
```

### Step 2: Calcolo Shipping nel Pricing Engine

**File**: `pricing-engine.js`

```javascript
export function calculateShipping(params) {
  const { 
    productTotal, 
    shippingOption = 'standard',
    estimatedWeight = 2 // kg
  } = params;
  
  const option = SHIPPING_CONFIG.options.find(o => o.id === shippingOption);
  if (!option) return { cost: 0, isFree: false };
  
  // Calcola surcharge peso
  const weightSurcharge = SHIPPING_CONFIG.weightSurcharges.find(
    w => estimatedWeight <= w.maxKg
  )?.surcharge || 0;
  
  const shippingCost = option.baseCost + weightSurcharge;
  
  // Verifica soglia gratuita
  const isFree = option.freeThreshold && productTotal >= option.freeThreshold;
  
  return {
    cost: isFree ? 0 : shippingCost,
    isFree,
    option: option.name,
    carrier: option.carrier,
    deliveryDays: option.deliveryDays,
    estimatedDelivery: calculateDeliveryDate(option.deliveryDays.max)
  };
}

function calculateDeliveryDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
}
```

### Step 3: UI Componente Shipping Selector

**File**: `ShippingSelector.jsx`

```jsx
export default function ShippingSelector({ 
  productTotal, 
  selectedOption, 
  onSelect 
}) {
  const options = SHIPPING_CONFIG.options.map(opt => {
    const shipping = calculateShipping({
      productTotal,
      shippingOption: opt.id
    });
    
    return { ...opt, ...shipping };
  });
  
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg">Opzioni Spedizione</h3>
      
      {options.map(option => (
        <label
          key={option.id}
          className={`
            flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer
            transition-all hover:border-red-500
            ${selectedOption === option.id ? 'border-red-600 bg-red-50' : 'border-gray-200'}
          `}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="shipping"
              value={option.id}
              checked={selectedOption === option.id}
              onChange={() => onSelect(option.id)}
              className="w-5 h-5 text-red-600"
            />
            
            <div>
              <div className="font-bold text-gray-900">{option.name}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                📦 {option.carrier} • 📅 Consegna: {option.estimatedDelivery}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {option.isFree ? (
              <span className="text-green-600 font-bold text-lg">GRATIS</span>
            ) : (
              <span className="text-gray-900 font-bold text-lg">
                €{option.cost.toFixed(2)}
              </span>
            )}
            {option.freeThreshold && !option.isFree && (
              <div className="text-xs text-gray-500 mt-1">
                Gratis sopra €{option.freeThreshold}
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
```

### Step 4: Aggiornamento OrderSummary

**File**: `OrderSummary.jsx`

```jsx
export default function OrderSummary({ price, shipping }) {
  const productCost = price.totalPrice;
  const shippingCost = shipping.cost;
  const total = productCost + shippingCost;
  
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="font-black text-xl mb-4">Riepilogo Ordine</h3>
      
      {/* Costo Prodotto */}
      <div className="flex justify-between py-3 border-b">
        <span className="text-gray-700">Prodotto personalizzato</span>
        <span className="font-bold">€{productCost.toFixed(2)}</span>
      </div>
      
      {/* Costo Spedizione */}
      <div className="flex justify-between py-3 border-b">
        <div>
          <div className="text-gray-700">Spedizione</div>
          <div className="text-xs text-gray-500">{shipping.option}</div>
        </div>
        {shipping.isFree ? (
          <span className="font-bold text-green-600">GRATIS</span>
        ) : (
          <span className="font-bold">€{shippingCost.toFixed(2)}</span>
        )}
      </div>
      
      {/* Totale */}
      <div className="flex justify-between py-4 text-xl">
        <span className="font-black">TOTALE</span>
        <span className="font-black text-red-600">€{total.toFixed(2)}</span>
      </div>
      
      {/* Info Consegna */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
        <div className="flex items-center gap-2 text-blue-900">
          <span>📅</span>
          <span>Consegna stimata: <strong>{shipping.estimatedDelivery}</strong></span>
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 Checklist Implementazione

### Fase 1: Setup Base (Settimana 1)

- [ ] Installare plugin Flexible Shipping PRO
- [ ] Configurare zone spedizione Italia
- [ ] Definire 3 opzioni (Express/Standard/Economy)
- [ ] Impostare tariffe base + incrementi peso
- [ ] Configurare soglie gratuite
- [ ] Aggiornare `pricing-config.js` con SHIPPING_CONFIG
- [ ] Implementare `calculateShipping()` in pricing-engine
- [ ] Creare componente `ShippingSelector.jsx`
- [ ] Aggiornare `OrderSummary.jsx` con separazione costi
- [ ] Integrare in tutti i configuratori (Serigrafia, DTF, Sublimazione)
- [ ] Test con ordini di prova
- [ ] Verificare calcoli su mobile

### Fase 2: Ottimizzazione (Settimana 2-3)

- [ ] Analizzare dati primi ordini
- [ ] Ottimizzare tariffe in base a costi reali
- [ ] Aggiungere tracking ordini
- [ ] Implementare email notifiche spedizione
- [ ] A/B test soglie gratuite

### Fase 3: API Integration (Mese 2-3) - Opzionale

- [ ] Creare account Shippo
- [ ] Implementare `/api/shipping/rates` endpoint
- [ ] Integrare chiamata API nel configuratore
- [ ] Implementare fallback su tariffe statiche
- [ ] Test con corrieri reali
- [ ] Monitorare performance e costi

---

## 💰 Analisi Costi

### Opzione Consigliata: Table Rate (Anno 1)

| Voce | Costo |
|------|-------|
| Plugin Flexible Shipping PRO | €49/anno |
| Setup iniziale (4h @ €50/h) | €200 (una tantum) |
| **TOTALE Anno 1** | **€249** |
| **TOTALE Anni successivi** | **€49/anno** |

### Opzione Avanzata: API (Anno 1)

| Voce | Costo |
|------|-------|
| Shippo Essential | €25/mese = €300/anno |
| Costo per label (~200 ordini/mese) | €120/anno |
| Setup iniziale (12h @ €50/h) | €600 (una tantum) |
| **TOTALE Anno 1** | **€1.020** |
| **TOTALE Anni successivi** | **€420/anno** |

---

## 🎯 Raccomandazione Finale

### Per DTF Italia - Fase Attuale

**Implementare Opzione B (Table Rate)** perché:

✅ **Costo/Beneficio ottimale**: €249 anno 1, poi €49/anno  
✅ **Setup veloce**: 1 settimana  
✅ **Flessibilità**: Tariffe configurabili senza codice  
✅ **Scalabile**: Upgrade a API quando volumi crescono  
✅ **UX professionale**: Separazione costi + opzioni tempistiche  

### Quando Passare ad API (Fase 2)

Considera Shippo quando:
- 📈 Ordini >100/mese
- 🌍 Espansione internazionale
- ⚡ Necessità tracking real-time
- 💼 Contratti diretti con corrieri

---

## 📚 Risorse

**Plugin WooCommerce**:
- [Flexible Shipping PRO](https://wordpress.org/plugins/flexible-shipping/)
- [WooCommerce Table Rate Shipping](https://woocommerce.com/products/table-rate-shipping/)

**API Shipping**:
- [Shippo API Docs](https://goshippo.com/docs/)
- [Sendcloud API Docs](https://sendcloud.dev/)
- [ShipEngine API Docs](https://shipengine.com/docs/)

**Corrieri Italia**:
- BRT: https://www.brt.it/
- GLS Italy: https://gls-italy.com/
- Poste Italiane: https://www.poste.it/

