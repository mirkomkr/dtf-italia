export const PRICING_CONSTANTS = {
  pricePerSqCm: 0.0025, // Placeholder price per cm^2
  minPrice: 5.00, // Minimum order price
};

export const STANDARD_SIZES = [
  {
    id: 'logo_heart',
    label: 'Logo Lato Cuore / Tascabile',
    width: 10,
    height: 10,
    note: 'Più richiesto',
    isCustom: false,
  },
  {
    id: 'sleeve_shoulder',
    label: 'Manica Corta / Spalla',
    width: 7,
    height: 7,
    note: '',
    isCustom: false,
  },
  {
    id: 'hat',
    label: 'Cappello (Frontale)',
    width: 12,
    height: 6,
    note: '',
    isCustom: false,
  },
  {
    id: 'sleeve_long_strip',
    label: 'Manica Lunga (Striscia)',
    width: 6,
    height: 40,
    note: '',
    isCustom: false,
  },
  {
    id: 'sleeve_long_wrist',
    label: 'Manica Lunga (Polso)',
    width: 4,
    height: 10,
    note: '',
    isCustom: false,
  },
  {
    id: 'neck_tag',
    label: 'Etichetta Collo (Tag)',
    width: 8,
    height: 8,
    note: '',
    isCustom: false,
  },
  {
    id: 'a3',
    label: 'Grande (A3)',
    width: 28,
    height: 40,
    note: 'Consigliato',
    isCustom: false,
  },
  {
    id: 'meter',
    label: 'Bobina al Metro Lineare',
    width: 58,
    height: 100,
    note: 'Unità',
    isCustom: false,
  },
  {
    id: 'custom',
    label: 'Personalizzato',
    width: 0,
    height: 0,
    note: 'Inserisci dimensioni',
    isCustom: true,
  },
];

export function calculatePrice(width, height, quantity, fileCheck = false) {
  const area = width * height;
  const basePrice = area * PRICING_CONSTANTS.pricePerSqCm;
  let totalPrice = basePrice * quantity;

  if (fileCheck) {
    totalPrice += 10.00;
  }
  
  // Ensure minimum price if needed, though usually per item logic might differ.
  // For now, simple multiplication.
  
  return {
    unitPrice: basePrice,
    totalPrice: totalPrice,
    area: area
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
