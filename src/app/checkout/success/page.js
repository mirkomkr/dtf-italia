import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage({ searchParams }) {
  const orderId = searchParams.order;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ordine Ricevuto!</h1>
        <p className="text-gray-500 mb-6">Grazie per il tuo ordine. La tua richiesta è stata presa in carico.</p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
            <p className="text-sm text-gray-500">Numero Ordine</p>
            <p className="text-lg font-mono font-bold text-gray-900">#{orderId}</p>
          </div>
        )}

        <Link href="/" className="block w-full py-3 px-6 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
