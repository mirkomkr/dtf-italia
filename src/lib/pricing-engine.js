import { PRICING_CONFIG } from './pricing-config';

/**
 * Base Strategy Interface (Implicit)
 * method calculate(params): { unitPrice, totalPrice, details }
 */

class SerigrafiaStrategy {
  calculate(params) {
    const config = PRICING_CONFIG.serigrafia;
    const { quantity, frontPrint, backPrint, fileCheck, proCheck, autoOutline } = params;
    
    // Supportiamo entrambi i nomi (backward compatibility)
    const activeProCheck = proCheck || fileCheck;
    
    // Safety check
    if (!quantity || quantity <= 0) return { unitPrice: 0, totalPrice: 0 };

    // --- LOGICA SOGLIA TECNICA ---
    const isDigital = quantity < config.digital_threshold;
    const technique = isDigital ? 'Digitale HD' : 'Serigrafia';

    // 1. Base Cost
    let unitBase = config.base_shirt;
    
    // 2. Print Costs
    // Se digitale, usiamo il listino digitale (più caro, no impianti). Altrimenti listino standard.
    const printList = isDigital ? (config.digital_print_costs || config.print_costs) : config.print_costs;
    
    const frontCost = printList[frontPrint] || 0;
    const backCost = printList[backPrint] || 0;
    
    const unitPrintCost = frontCost + backCost;
    
    // 3. Setup Fees (Impianti)
    let setupCost = 0;
    // Solo per Serigrafia si pagano gli impianti (se sotto soglia gratis)
    if (!isDigital && quantity < config.setup_fee_threshold) {
       if (frontPrint && frontPrint !== 'none') setupCost += config.impianto_stampa;
       if (backPrint && backPrint !== 'none') setupCost += config.impianto_stampa;
    }

    // 4. Quantity Discount (Applied on Unit Price)
    let discount = 0;
    const tier = config.quantity_discounts
      .slice()
      .reverse()
      .find(t => quantity >= t.min);
      
    if (tier) discount = tier.discount;

    let subTotalUnit = (unitBase + unitPrintCost);
    let discountedUnit = subTotalUnit * (1 - discount);
    
    // Totale Parziale
    let totalParams = discountedUnit * quantity;
    
    // Aggiungi Costi Fissi
    totalParams += setupCost;
    
    // Costo Pro Check (Check-up Grafico)
    let proCheckCost = 0;
    if (activeProCheck) {
        proCheckCost = config.pro_check || 0;
        totalParams += proCheckCost;
    }
    
    // Costo Auto Outline (Contorno Salvavita)
    let autoOutlineCost = 0;
    if (autoOutline) {
        autoOutlineCost = config.auto_outline || 0;
        totalParams += autoOutlineCost;
    }

    // Recalculate effective unit price for display
    let finalUnitPrice = totalParams / quantity;

    return {
      unitPrice: Number(finalUnitPrice.toFixed(2)),
      totalPrice: Number(totalParams.toFixed(2)),
      details: {
        setupCost,
        autoOutlineCost,
        proCheckCost,
        discountPercentage: discount * 100,
        technique // Pass technique info specifically
      }
    };
  }
}



class DTFStrategy {
  calculate(params) {
    const config = PRICING_CONFIG.dtf;
    const { quantity, format, width, height, isFullService, isFlashOrder } = params;

    // 1. Resolve Dimensions (cm)
    let itemW, itemH;
    
    if (format && config.formats[format] && !config.formats[format].isCustom) {
      itemW = config.formats[format].w;
      itemH = config.formats[format].h;
    } else {
      // Custom format or fallback
      itemW = width || 0;
      itemH = height || 0;
    }

    if (!quantity || quantity <= 0 || itemW <= 0 || itemH <= 0) {
       return { unitPrice: 0, totalPrice: 0, totalMeters: 0, details: {} };
    }

    // 2. Nesting Calculation (Calcolo Ingombro)
    // Quanti pezzi entrano in larghezza (BOBINA_WIDTH = 58cm)
    const piecesPerRow = Math.floor(config.BOBINA_WIDTH / itemW);
    const effectivePiecesPerRow = piecesPerRow < 1 ? 1 : piecesPerRow; // Safety check if width > 58 (e.g. oversize)
    
    // Quante "file" servono
    const rowsNeeded = Math.ceil(quantity / effectivePiecesPerRow);
    
    // 3. Total Linear Meters
    const totalMeters = (rowsNeeded * itemH) / 100; // cm -> meters

    // 4. Dynamic Price Calculation
    // Sconto: 2.50€ ogni 10mt completi
    const discountSteps = Math.floor(totalMeters / config.DISCOUNT_STEP_METERS);
    const discountAmount = discountSteps * config.DISCOUNT_STEP;
    
    let rawPricePerMeter = config.BASE_PRICE_METER - discountAmount;
    
    // Cap at MIN_PRICE_METER
    if (rawPricePerMeter < config.MIN_PRICE_METER) {
      rawPricePerMeter = config.MIN_PRICE_METER;
    }

    const effectiveMeterPrice = Number(rawPricePerMeter.toFixed(2));
    
    // Base Total
    let baseTotal = totalMeters * effectiveMeterPrice;

    // 5. Min Order Check
    let isMinOrderApplied = false;
    if (baseTotal < config.MIN_ORDER_PRICE) {
      baseTotal = config.MIN_ORDER_PRICE;
      isMinOrderApplied = true;
    }

    // 6. Extras (Markups)
    let finalTotal = baseTotal;
    let proCheckCost = 0;
    
    // Check-up Grafico (Fixed Fee)
    if (isFullService) {
      proCheckCost = config.pro_check || 0;
      finalTotal += proCheckCost;
    }
    
    // Flash Order (+10%)
    if (isFlashOrder) {
        finalTotal += (baseTotal * config.FLASH_ORDER_MARKUP);
    }
    
    // 7. Results
    // Unit price per piece = FinalTotal / Quantity
    const unitPricePerPiece = finalTotal / quantity;
    
    // Metri mancanti al prossimo scaglione
    // next tier is at (discountSteps + 1) * 10
    const nextTierMeters = (discountSteps + 1) * config.DISCOUNT_STEP_METERS;
    const savingsNextTier = Number((nextTierMeters - totalMeters).toFixed(2));

    return {
      totalPrice: Number(finalTotal.toFixed(2)),
      unitPrice: Number(unitPricePerPiece.toFixed(2)), // Standard interface property
      details: {
         effectiveMeterPrice,
         totalMeters: Number(totalMeters.toFixed(2)),
         isMinOrderApplied,
         savingsNextTier,
         rowsNeeded,
         piecesPerRow: effectivePiecesPerRow,
         baseTotal: Number(baseTotal.toFixed(2))
      }
    };
  }
}

class GadgetStrategy {
    calculate(params) {
        // Placeholder for Calendars/Gadgets
        // params: { quantity }
        return { unitPrice: 0, totalPrice: 0 };
    }
}

const STRATEGIES = {
  'serigrafia': new SerigrafiaStrategy(),
  'dtf': new DTFStrategy(),
  'gadget': new GadgetStrategy(),
  // Alias
  'calendari': new GadgetStrategy() 
};

export function calculatePrice(type, params) {
  const strategy = STRATEGIES[type];
  if (!strategy) {
    console.error(`Strategy for ${type} not found`);
    return { unitPrice: 0, totalPrice: 0 };
  }
  return strategy.calculate(params);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}