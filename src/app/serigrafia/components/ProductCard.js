// components/ProductCard.jsx
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <article className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition focus-within:ring-2 focus-within:ring-indigo-600">
      
      <Link
        href={`/serigrafia/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`Configura ${product.name}`}
      />

      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-50">
        <Image
          src={image?.src || "/placeholder.png"}
          alt={image?.alt || product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {product.name}
        </h3>

        {product.price_html ? (
          <p
            className="text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.price_html }}
          />
        ) : (
          <p className="text-gray-500">Prezzo su richiesta</p>
        )}

        <span className="mt-4 inline-block text-sm font-semibold text-indigo-600">
          Configura →
        </span>
      </div>
    </article>
  );
}
