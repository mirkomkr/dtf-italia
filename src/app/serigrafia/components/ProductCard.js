import Link from "next/link";
import Image from "next/image";
import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product, priority = false }) {
  const image = product.images?.[0];

  const imageSrc = image?.src || "/placeholder.webp";
  const imageAlt =
    image?.alt ||
    `${product.name} personalizzata con serigrafia a Roma – DTF Italia`;

  return (
    <article
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm
                 hover:shadow-lg transition focus-within:ring-2 focus-within:ring-[var(--brand-color)]"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Link overlay accessibile - No Prefetch to save main thread */}
      <Link
        href={`/serigrafia/${product.slug}`}
        aria-label={`Configura ${product.name}`}
        className="absolute inset-0 z-10"
        prefetch={false}
      />

      {/* Immagine prodotto */}
      <div 
        className="relative overflow-hidden rounded-t-xl"
        style={{ backgroundColor: '#f3f4f6' }} 
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={400}
          quality={60}
          priority={priority}
          sizes="(max-width: 640px) 50vw,
                 (max-width: 1024px) 33vw,
                 25vw"
          className="w-full h-auto object-cover" 
          itemProp="image"
        />
      </div>

      {/* Contenuto */}
      <div className="p-5 flex flex-col gap-2">
        <h3
          className="text-lg font-bold text-gray-900 leading-snug"
          itemProp="name"
        >
          {product.name}
        </h3>

        {/* Prezzo */}
        {product.price ? (
          <p
            className="text-gray-800 text-sm"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            {/* Formattazione base, ideale sarebbe un formatter dedicato */}
            € {parseFloat(product.price).toFixed(2).replace('.', ',')}
          </p>
        ) : (
          <p className="text-gray-700 text-sm">
            Prezzo su richiesta
          </p>
        )}

        {/* CTA */}
        <span
          className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--brand-color)]"
          aria-hidden="true"
        >
          Configura
          <span className="ml-1">→</span>
        </span>
      </div>
    </article>
  );
});

export default ProductCard;
