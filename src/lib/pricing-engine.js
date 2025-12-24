import { PRICING_CONFIG } from './pricing-config';

/**
 * Base Strategy Interface (Implicit)
 * method calculate(params): { unitPrice, totalPrice, details }
 */

class SerigrafiaStrategy {
  calculate(params) {
    const config = PRICING_CONFIG.serigrafia;
    const { quantity, frontPrint, backPrint, fileCheck } = params;
    
    // Safety check
    if (!quantity || quantity <= 0) return { unitPrice: 0, totalPrice: 0 };

    // 1. Base Cost
    let unitBase = config.base_shirt;
    
    // 2. Print Costs
    const frontCost = config.print_costs[frontPrint] || 0;
    const backCost = config.print_costs[backPrint] || 0;
    
    const unitPrintCost = frontCost + backCost;
    
    // 3. Setup Fees (Impianti) - Esempio: calcolati sul totale non per unità, ma qui li spalmiamo o aggiungiamo fissi?
    // Solitamente l'impianto è un costo fisso. 
    // Se frontPrint != none => 1 impianto.
    // Se backPrint != none => 1 impianto.
    // Costo Impianto Totale:
    let setupCost = 0;
    if (quantity < config.setup_fee_threshold) {
       if (frontPrint && frontPrint !== 'none') setupCost += config.impianto_stampa;
       if (backPrint && backPrint !== 'none') setupCost += config.impianto_stampa;
    }

    // 4. Quantity Discount (Applied on Unit Price + Print Cost)
    let discount = 0;
    // Troviamo lo scaglione corretto (il più alto minore o uguale alla quantità)
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
    if (fileCheck) totalParams += 10.00; // Hardcoded or from common config

    // Recalculate effective unit price for display
    let finalUnitPrice = totalParams / quantity;

    return {
      unitPrice: Number(finalUnitPrice.toFixed(2)),
      totalPrice: Number(totalParams.toFixed(2)),
      details: {
        setupCost,
        discountPercentage: discount * 100
      }
    };
  }
}

class DTFStrategy {
  calculate(params) {
    // Placeholder logic for DTF
    // params: { quantity, width, height (cm) ?? }
    const config = PRICING_CONFIG.dtf;
    return { unitPrice: 0, totalPrice: 0 };
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
