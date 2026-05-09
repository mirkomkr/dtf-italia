'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/configurator/shared/CustomerForm';
import ShippingSelector from '@/components/configurator/shared/ShippingSelector';
import PaymentActions from '@/components/configurator/shared/PaymentActions';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// Validazione (ripresa da UnifiedCheckout)
// ──────────────────────────────────────────────────────────────────────────────
function validateField(name, value, formData) {
  const v = (value ?? '').toString().trim();
  switch (name) {
    case 'email':     return v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Email non valida';
    case 'firstName': return v.length >= 2 ? null : 'Nome obbligatorio (min. 2 caratteri)';
    case 'lastName':  return v.length >= 2 ? null : 'Cognome obbligatorio (min. 2 caratteri)';
    case 'codiceFiscale':
      return /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/i.test(v)
        ? null : 'Codice fiscale non valido';
    case 'companyName':  return v.length >= 2  ? null : 'Ragione sociale obbligatoria';
    case 'partitaIva':   return /^\d{11}$/.test(v) ? null : 'Partita IVA non valida (11 cifre)';
    case 'sdiCode':       return v.length >= 6  ? null : 'Codice SDI non valido';
    case 'pec':           return v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'PEC non valida';
    case 'address':  return v.length >= 5  ? null : 'Indirizzo obbligatorio';
    case 'city':     return v.length >= 2  ? null : 'Città obbligatoria';
    case 'zip':      return /^\d{5}$/.test(v) ? null : 'CAP non valido (5 cifre)';
    case 'billingAddress': return v.length >= 5 ? null : 'Indirizzo fatturazione obbligatorio';
    case 'billingCity':    return v.length >= 2 ? null : 'Città fatturazione obbligatoria';
    case 'billingZip':    return /^\d{5}$/.test(v) ? null : 'CAP fatturazione non valido';
    default: return null;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
export default function CartCheckoutForm({ shippingCost, subtotal, isDevTest = false }) {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    customerType: 'private',
    firstName: '', lastName: '', email: '', phone: '',
    codiceFiscale: '', companyName: '', partitaIva: '', sdiCode: '', pec: '',
    referencePerson: '',
    address: '', city: '', zip: '',
    billingSameAsShipping: true,
    billingAddress: '', billingCity: '', billingZip: '',
    notes: '',
  });

  const [shippingOption, setShippingOption] = useState('shipping');
  const [errors, setErrors]                 = useState({});
  const [isProcessing, setIsProcessing]     = useState(false);
  const [submitError, setSubmitError]       = useState(null);
  const [success, setSuccess]               = useState(false);
  const [orderIds, setOrderIds]             = useState([]);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  // ── Payment handler ───────────────────────────────────────────────────
  // In dev test mode: skipS3 è sempre true per evitare operazioni S3 reali
  const handlePayment = async (paymentMethod, skipS3 = false) => {
    const effectiveSkipS3 = isDevTest ? true : skipS3;
    // 1. Validazione
    const newErrors = {};
    const fieldsToValidate = [
      'email',
      ...(formData.customerType === 'private'
        ? ['firstName', 'lastName', 'codiceFiscale']
        : ['companyName', 'partitaIva', 'sdiCode', 'pec']),
      ...(shippingOption === 'shipping' ? ['address', 'city', 'zip'] : []),
      ...(!formData.billingSameAsShipping ? ['billingAddress', 'billingCity', 'billingZip'] : []),
    ];

    fieldsToValidate.forEach(f => {
      const err = validateField(f, formData[f], formData);
      if (err) newErrors[f] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      document.getElementById(firstKey)?.focus();
      return;
    }

    setIsProcessing(true);
    setSubmitError(null);

    try {
      // 2. Costruiamo il payload multi-item
      const cartItems = cart.items.map(item => ({
        type:         item.type,
        cartItemId:   item.cartItemId,
        fileKey:      effectiveSkipS3 ? null : item.fileKey,
        productData:  item.config,
        pricing: {
          ...item.priceData,
        },
      }));

      const grandTotal = subtotal + shippingCost;

      const payload = {
        mode: 'cart',
        customer: formData,
        shipping: { option: shippingOption, cost: shippingCost },
        paymentMethod,
        cartItems,
        pricing: {
          subtotal:   Number(subtotal.toFixed(2)),
          shippingCost,
          grandTotal: Number(grandTotal.toFixed(2)),
        },
        testOptions: { skipS3: effectiveSkipS3 },
      };

      const response = await fetch('/api/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setOrderIds(result.orderIds || [result.orderId]);
        setSuccess(true);
        clearCart();
        // Redirect alla pagina di successo dopo 1,5s
        setTimeout(() => {
          router.push(`/grazie?ids=${(result.orderIds || [result.orderId]).join(',')}`);
        }, 1500);
      } else {
        throw new Error(result.error || "Errore durante la creazione dell'ordine");
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Success state ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <div>
          <p className="font-black text-gray-900 text-lg">Ordine confermato!</p>
          <p className="text-sm text-gray-500 mt-1">
            {orderIds.length > 1
              ? `${orderIds.length} ordini creati: ${orderIds.join(', ')}`
              : `Ordine #${orderIds[0]}`}
          </p>
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Shipping */}
      <ShippingSelector
        selectedOption={shippingOption}
        onOptionChange={setShippingOption}
        brandColor="indigo"
      />

      {/* Customer form */}
      <CustomerForm
        formData={formData}
        onChange={(e) => {
          setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
          if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
        }}
        onBlur={handleBlur}
        errors={errors}
        onAddressSelect={(addr) => {
          setFormData(prev => ({ ...prev, ...addr }));
          setErrors(prev => ({ ...prev, address: null, city: null, zip: null }));
        }}
        showAddress={shippingOption === 'shipping'}
        brandColor="indigo"
      />

      {/* Error */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Dev test indicator */}
      {isDevTest && (
        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-700 font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          Modalità DEV — skipS3 attivo, nessuna operazione reale su S3
        </div>
      )}

      {/* Payment */}
      <PaymentActions
        onPaymentSelect={handlePayment}
        isProcessing={isProcessing}
        brandColor="indigo"
      />
    </div>
  );
}
