export const PRICING_CONFIG = {
  serigrafia: {
    base_shirt: 5.50, // Prezzo base t-shirt bianca/colorata standard
    impianto_stampa: 25.00, // Costo fisso impianto per colore/lato (una tantum)
    auto_outline: 5.00, // Costo fisso per "Contorno Salvavita"
    pro_check: 7.00, // Costo fisso "Check-up Grafico Totale"
    setup_fee_threshold: 100, // Quantità sopra la quale l'impianto è gratis (esempio)
    
    // SOGLIA DIGITALE/SERIGRAFIA
    digital_threshold: 30, // Sotto questa quantità: Stampa Digitale (No Impianto, Prezzo Unitario Maggiorato)
    
    print_costs: {
      'none': 0,
      '1_color': 1.50,
      '2_colors': 2.80,
      'full_color': 4.50
    },
    // Listino Stampa Digitale (Prezzi unitari più alti, ma senza costo impianto)
    digital_print_costs: {
        'none': 0,
        '1_color': 4.00,   // Esempio: Più alto vs 1.50
        '2_colors': 5.50,  // Esempio: Più alto vs 2.80
        'full_color': 7.50 // Esempio: Più alto vs 4.50
    },
    quantity_discounts: [
      { min: 0, discount: 0 },
      { min: 10, discount: 0.05 },
      { min: 30, discount: 0.10 },
      { min: 50, discount: 0.15 },
      { min: 100, discount: 0.20 },
      { min: 300, discount: 0.30 }
    ],
    
    // ========================================
    // POSITION-BASED PRICING (FUTURE USE)
    // ========================================
    // Uncomment to enable position-based pricing surcharges
    // Current status: Positions are included in base price (no surcharge)
    // 
    // position_costs: {
    //   // Front positions
    //   'center': 0,        // Standard position, no surcharge
    //   'right': 0.50,      // Right side: +€0.50 per unit
    //   'heart': 0.50,      // Heart side: +€0.50 per unit
    //   
    //   // Back positions
    //   'classic': 0,       // Classic back: standard, no surcharge
    //   'internal_label': 1.00,  // Internal label: +€1.00 per unit (more complex)
    //   'external_label': 0.75   // External label: +€0.75 per unit
    // }
  },
  dtf: {
    BASE_PRICE_METER: 18.00,
    MIN_ORDER_PRICE: 18.00,
    DISCOUNT_STEP: 2.50, // Euro per 10mt
    DISCOUNT_STEP_METERS: 10,
    MIN_PRICE_METER: 10.50,
    pro_check: 7.00,
    FLASH_ORDER_MARKUP: 0.10,
    BOBINA_WIDTH: 58, // cm
    MAX_CUSTOM_HEIGHT: 300, // cm
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
  },
  
  // ========================================
  // SHIPPING CONFIGURATION
  // ========================================
  shipping: {
    // Costo fisso spedizione (tutte le destinazioni Italia)
    fixedCost: 10.00,
    
    // Soglia spedizione gratuita (opzionale, commentato per ora)
    // freeThreshold: 100.00,
    
    // Informazioni corriere
    // carrier: 'BRT',
    // estimatedDays: '3-5 giorni lavorativi',
    
    // Note: Per implementazione futura con opzioni multiple (Express/Standard/Economy)
    // vedere: .agent/docs/shipping_system_plan.md
  }
};