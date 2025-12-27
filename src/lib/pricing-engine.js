
export const PRICING_CONFIG = {
  // COSTS
  COSTO_IMPIANTO: 25.00, // Euro per colore/lato (Serigrafia)
  COSTO_CONTROLLO_FILE: 10.00, // Euro una tantum per ordine

  // 1. ABBIGLIAMENTO (Serigrafia / Digitale)
  ABBIGLIAMENTO: {
    SOGLIA_IBRIDA: 30, // <30 Digitale, >=30 Serigrafia
    DIGITALE: 5.00,    // Prezzo fisso stampa digitale
    SERIGRAFIA: {
      SCAGLIONI: [
        { min: 30, max: 99, cols: { 1: 3.50, 2: 4.50, full: 6.00 } },
        { min: 100, max: 299, cols: { 1: 2.50, 2: 3.20, full: 4.50 } },
        { min: 300, max: 9999, cols: { 1: 1.80, 2: 2.40, full: 3.50 } },
      ]
    }
  },

  // 2. DTF SERVICE (Stampa su Bobina)
  DTF_SERVICE: {
    BOBINA_WIDTH_CM: 58,
    BOBINA_USABLE_WIDTH_CM: 56, 
    SCAGLIONI: [
      { max: 5, price: 18.00 },   // 1-5 mt
      { max: 10, price: 15.00 },  // 5-10 mt
      { max: Infinity, price: 12.00 } // >10 mt
    ]
  },

  // 3. PELLICOLE SERIGRAFICHE (Lucidi)
  PELLICOLE: {
    A4: { price: 8.00 },
    A3: { price: 12.00 },
    BOBINA: { price: 15.00 } // Prezzo al metro lineare
  },

  // 4. GADGET SUBLIMAZIONE (Prezzi segnaposto)
  GADGET: {
    DEFAULTS: [ // Default fallback se modello non trovato
      { min: 1, max: 10, price: 10.00 },
      { min: 11, max: 50, price: 8.50 },
      { min: 51, max: Infinity, price: 7.00 }
    ],
    // Esempio specifico modello
    'tazza-standard': [
      { min: 1, max: 36, price: 6.50 },
      { min: 37, max: Infinity, price: 5.50 }
    ]
  },

  // 5. CALENDARI (Prezzi segnaposto)
  CALENDARI: {
    DEFAULTS: [
      { min: 1, max: 50, price: 4.50 },
      { min: 51, max: 100, price: 3.50 },
      { min: 101, max: Infinity, price: 2.50 }
    ]
  },

  SPEDIZIONE: {
    COSTO_BASE: 6.90,
    SOGLIA_GRATUITA: 100.00
  }
};

// ================= CALCULATION FUNCTIONS =================

/**
 * 1. Calculate Clothing Price (Abbigliamento)
 * Signature Standard: (quantity, productPrice, options)
 */
export function calculateClothingPrice(quantity = 1, productPrice = 0, options = {}) {
  // Destructure options with defaults
  const { frontColors = 0, backColors = 0, fileCheck = false } = options;

  const isSerigrafia = quantity >= PRICING_CONFIG.ABBIGLIAMENTO.SOGLIA_IBRIDA;
  const method = isSerigrafia ? 'SERIGRAFIA' : 'DIGITALE';
  
  let printCostTotal = 0;
  let setupCostTotal = 0;
  let unitPrintCost = 0;

  if (isSerigrafia) {
    const totalSetupSides = (frontColors > 0 ? frontColors : 0) + (backColors > 0 ? backColors : 0);
    setupCostTotal = totalSetupSides * PRICING_CONFIG.COSTO_IMPIANTO;

    const scaglione = PRICING_CONFIG.ABBIGLIAMENTO.SERIGRAFIA.SCAGLIONI.find(s => quantity >= s.min && quantity <= s.max) 
                      || PRICING_CONFIG.ABBIGLIAMENTO.SERIGRAFIA.SCAGLIONI[PRICING_CONFIG.ABBIGLIAMENTO.SERIGRAFIA.SCAGLIONI.length - 1];

    const getPriceForSide = (colors) => {
      if (colors <= 0) return 0;
      if (colors === 1) return scaglione.cols[1];
      if (colors === 2) return scaglione.cols[2];
      return scaglione.cols.full;
    };

    unitPrintCost = getPriceForSide(frontColors) + getPriceForSide(backColors);
    printCostTotal = unitPrintCost * quantity;
  } else {
    // Digitale
    let costPerItem = 0;
    if (frontColors > 0) costPerItem += PRICING_CONFIG.ABBIGLIAMENTO.DIGITALE;
    if (backColors > 0) costPerItem += PRICING_CONFIG.ABBIGLIAMENTO.DIGITALE;
    
    unitPrintCost = costPerItem;
    printCostTotal = costPerItem * quantity;
    setupCostTotal = 0;
  }

  const extraCosts = fileCheck ? PRICING_CONFIG.COSTO_CONTROLLO_FILE : 0;
  const productTotal = productPrice * quantity;
  
  // Total including everything
  const totalPrice = productTotal + printCostTotal + setupCostTotal + extraCosts;
  const unitPrice = quantity > 0 ? totalPrice / quantity : 0;

  return {
    unitPrice,
    totalPrice,
    method,
    setupCost: setupCostTotal,
    printCost: printCostTotal,
    productCost: productTotal,
    extraCosts,
    breakdown: {
      productUnit: productPrice,
      printUnit: unitPrintCost,
      setupTotal: setupCostTotal,
      fileCheck: extraCosts
    }
  };
}

/**
 * 2. Calculate DTF Service Price
 * Signature Standard: (quantity, productPrice, options)
 */
export function calculateDTFServicePrice(quantity = 1, productPrice = 0, options = {}) {
  // Destructure options (width/height required for DTF Service)
  const { width = 0, height = 0, fileCheck = false } = options;

  const usableWidth = PRICING_CONFIG.DTF_SERVICE.BOBINA_USABLE_WIDTH_CM;
  
  // Guard clause for invalid dimensions
  if (width <= 0 || height <= 0) {
      return {
          unitPrice: 0, totalPrice: 0, setupCost: 0, extraCosts: 0, itemsPerRow: 0, linearMeters: 0,
          breakdown: { meters: 0, tierPrice: 0, fileCheck: 0 }
      };
  }

  let itemsPerRow = Math.floor(usableWidth / width);
  if (itemsPerRow < 1) itemsPerRow = 1;

  const totalRows = Math.ceil(quantity / itemsPerRow);
  const linearMeters = (totalRows * height) / 100;

  const tier = PRICING_CONFIG.DTF_SERVICE.SCAGLIONI.find(s => linearMeters <= s.max) 
               || PRICING_CONFIG.DTF_SERVICE.SCAGLIONI[PRICING_CONFIG.DTF_SERVICE.SCAGLIONI.length - 1];
  
  const unitPricePerMeter = tier.price;
  const printCostTotal = linearMeters * unitPricePerMeter;
  const extraCosts = fileCheck ? PRICING_CONFIG.COSTO_CONTROLLO_FILE : 0;
  
  // productPrice is usually 0 for service, but we add it if present
  const productTotal = productPrice * quantity;
  const totalPrice = printCostTotal + extraCosts + productTotal; // + productTotal usually 0

  return {
    linearMeters: parseFloat(linearMeters.toFixed(2)),
    unitPricePerMeter,
    totalPrice,
    unitPrice: quantity > 0 ? totalPrice / quantity : 0,
    itemsPerRow,
    extraCosts,
    setupCost: 0,
    productCost: productTotal,
    printCost: printCostTotal,
    breakdown: {
      meters: parseFloat(linearMeters.toFixed(2)),
      tierPrice: unitPricePerMeter,
      fileCheck: extraCosts
    }
  };
}

/**
 * 3. Calculate Pellicole Price
 * Signature Standard: (quantity, productPrice, options)
 * quantity maps to "metric quantity" (pieces for A3/A4, meters for Coil)
 */
export function calculatePellicolePrice(quantity = 1, productPrice = 0, options = {}) {
  const { format = 'A4', fileCheck = false } = options;
  const normFormat = format.toUpperCase();
  let unitPriceBase = 0;

  if (normFormat === 'BOBINA') {
    unitPriceBase = PRICING_CONFIG.PELLICOLE.BOBINA.price;
  } else if (normFormat === 'A3') {
    unitPriceBase = PRICING_CONFIG.PELLICOLE.A3.price;
  } else {
    unitPriceBase = PRICING_CONFIG.PELLICOLE.A4.price;
  }

  // Override unitPriceBase if productPrice is passed and > 0 (e.g. from WC), otherwise use config
  const finalUnitPrice = productPrice > 0 ? productPrice : unitPriceBase;

  const printCostTotal = finalUnitPrice * quantity;
  const extraCosts = fileCheck ? PRICING_CONFIG.COSTO_CONTROLLO_FILE : 0;
  const totalPrice = printCostTotal + extraCosts;

  return {
    unitPrice: finalUnitPrice,
    totalPrice,
    extraCosts,
    setupCost: 0,
    printCost: printCostTotal,
    productCost: 0, // In this model 'product' is the print itself
    breakdown: {
      format: normFormat,
      qtyOrMeters: quantity,
      unitBase: finalUnitPrice,
      fileCheck: extraCosts
    }
  };
}

/**
 * 4 & 5. Generic Fixed Item Price (Gadgets & Calendari)
 * Signature Standard: (quantity, productPrice, options)
 */
export function calculateFixedItemPrice(quantity = 1, productPrice = 0, options = {}) {
  const { category = 'GADGET', model = '', fileCheck = false } = options;

  const catConfig = PRICING_CONFIG[category.toUpperCase()] || PRICING_CONFIG.GADGET;
  const tiers = catConfig[model] || catConfig.DEFAULTS;

  const tier = tiers.find(s => quantity >= s.min && quantity <= s.max) 
               || tiers[tiers.length - 1];

  // Logic: Use Config Price if productPrice is 0, otherwise use productPrice (allows WC override)
  // Actually, usually for tiers we WANT to use the tier price.
  // The 'productPrice' passed from WC might be a base or placeholder.
  // Let's rely on Tiers as primary source of truth for volume discounts.
  const unitPrice = tier.price;
  
  const productTotal = unitPrice * quantity;
  const extraCosts = fileCheck ? PRICING_CONFIG.COSTO_CONTROLLO_FILE : 0;
  const totalPrice = productTotal + extraCosts;

  return {
    unitPrice,
    totalPrice,
    extraCosts,
    setupCost: 0,
    printCost: 0, // It's a finished product
    productCost: productTotal, 
    breakdown: {
      tierUsed: tier,
      fileCheck: extraCosts
    }
  };
}

/**
 * Router to get the correct calculation logic based on SEO Slugs
 */
export function getPricingLogicByCategory(categorySlug) {
  // Normalize checking
  const slug = categorySlug?.toLowerCase() || '';

  // 1. Abbigliamento Serigrafia
  if (slug.includes('abbigliamento') || slug.includes('serigrafia')) {
      return calculateClothingPrice;
  }
  
  // 2. DTF Service
  if (slug.includes('service-stampa-dtf') || slug === 'dtf') {
      return calculateDTFServicePrice;
  }

  // 3. Pellicole Serigrafiche
  if (slug.includes('pellicole-serigrafiche')) {
      return calculatePellicolePrice;
  }

  // 4. Gadget Sublimazione
  if (slug.includes('sublimazione-gadget')) {
      // Wrapper to inject category
      return (qty, price, opts) => calculateFixedItemPrice(qty, price, { ...opts, category: 'GADGET' });
  }

  // 5. Calendari
  if (slug.includes('calendari')) {
      // Wrapper to inject category
      return (qty, price, opts) => calculateFixedItemPrice(qty, price, { ...opts, category: 'CALENDARI' });
  }

  // Fallback
  console.warn(`Pricing Router: Unknown slug '${slug}', falling back to Clothing Logic.`);
  return calculateClothingPrice;
}

// ================= SHARED UTILS =================

export function calculateShipping(cartTotal) {
  if (cartTotal >= PRICING_CONFIG.SPEDIZIONE.SOGLIA_GRATUITA) {
    return 0;
  }
  return PRICING_CONFIG.SPEDIZIONE.COSTO_BASE;
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phone));
}

export function validatePIVA(piva) {
  const re = /^[0-9]{11}$/;
  return re.test(String(piva));
}

export function validateCF(cf) {
  const re = /^[A-Z0-9]{16}$/i;
  return re.test(String(cf));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function getUpsellMessage(type, currentQty) {
  if (type === 'SERIGRAFIA') {
    const scaglioni = PRICING_CONFIG.ABBIGLIAMENTO.SERIGRAFIA.SCAGLIONI;
    const nextTier = scaglioni.find(s => s.min > currentQty);
    
    if (nextTier) {
       const diff = nextTier.min - currentQty;
       return `Aggiungi ${diff} pezzi per accedere al prezzo scontato di ${formatCurrency(nextTier.cols[1])}/cad!`;
    }
  }
  return null;
}
