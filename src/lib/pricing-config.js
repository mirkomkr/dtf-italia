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
    BASE_PRICE_METER: 18.00,
    MIN_ORDER_PRICE: 18.00,
    DISCOUNT_STEP: 2.50, // Euro per 10mt
    DISCOUNT_STEP_METERS: 10,
    MIN_PRICE_METER: 10.50,
    FULL_SERVICE_MARKUP: 0.10,
    FLASH_ORDER_MARKUP: 0.10,
    BOBINA_WIDTH: 58, // cm
    fixed_fees: {
       file_check: 10.00
    },
    formats: {
      logo_cuore: { label: 'Lato Cuore / Tascabile', w: 10, h: 10 },
      manica_corta: { label: 'Manica Corta / Spalla', w: 7, h: 7 },
      cappello_front: { label: 'Cappello (Frontale)', w: 12, h: 6 },
      manica_lunga_striscia: { label: 'Manica Lunga (Striscia)', w: 6, h: 40 },
      manica_lunga_polso: { label: 'Manica Lunga (Polso)', w: 4, h: 10 },
      neck_tag: { label: 'Etichetta Collo (Tag)', w: 8, h: 8 },
      a4: { label: 'Medio (A4)', w: 21, h: 29.7 },
      a3: { label: 'Grande (A3)', w: 28, h: 40 },
      meter: { label: 'Bobina al Metro Lineare', w: 58, h: 100 },
      custom: { label: 'Personalizzato', isCustom: true }
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