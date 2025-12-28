export const PRICING_CONFIG = {
  serigrafia: {
    base_shirt: 5.50, // Prezzo base t-shirt bianca/colorata standard
    impianto_stampa: 25.00, // Costo fisso impianto per colore/lato (una tantum)
    setup_fee_threshold: 100, // Quantità sopra la quale l'impianto è gratis (esempio)
    print_costs: {
      'none': 0,
      '1_color': 1.50,
      '2_colors': 2.80,
      'full_color': 4.50
    },
    quantity_discounts: [
      { min: 0, discount: 0 },
      { min: 10, discount: 0.05 },
      { min: 30, discount: 0.10 },
      { min: 50, discount: 0.15 },
      { min: 100, discount: 0.20 },
      { min: 300, discount: 0.30 }
    ]
  },
  dtf: {
    price_per_sqm: 40.00, // Prezzo al metro quadro
    min_order_price: 15.00, // Minimo d'ordine
    fixed_fees: {
       file_check: 10.00
    }
  },
  calendari: {
    // Esempio logica a scaglioni secchi
    tiers: [
      { max: 50, unit_price: 3.50 },
      { max: 100, unit_price: 3.00 },
      { max: 500, unit_price: 2.50 },
      { max: 1000, unit_price: 2.10 }
    ]
  }
};