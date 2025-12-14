export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <img
        src={product.images?.[0]?.src || "/placeholder.png"}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      {product.price_html ? (
        <p className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: product.price_html }} />
      ) : (
        <p className="text-gray-600 mb-2">Prezzo non disponibile</p>
      )}
    </div>
  );
}
