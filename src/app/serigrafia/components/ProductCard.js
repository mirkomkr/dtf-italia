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
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm
                 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 focus-within:ring-4 focus-within:ring-red-600/10"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Link overlay accessibile - No Prefetch per preservare il main thread */}
      <Link
        href={`/serigrafia/${product.slug}`}
        aria-label={`Configura ${product.name}`}
        className="absolute inset-0 z-10"
        prefetch={false}
      />

      {/* Immagine prodotto */}
      <div 
        className="relative overflow-hidden rounded-t-2xl"
        style={{ backgroundColor: '#f8fafc' }} 
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={400}
          quality={80}
          priority={priority} 
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
          itemProp="image"
        />
      </div>

      {/* Contenuto */}
      <div className="p-6 flex flex-col gap-2">
        <h3
          className="text-lg font-black text-gray-900 leading-snug tracking-tight"
          itemProp="name"
        >
          {product.name}
        </h3>

        {/* Nota informativa */}
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest italic">
          Prezzo Configurabile
        </p>

        {/* CTA */}
        <span
          className="mt-4 inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-red-600"
          aria-hidden="true"
        >
          Configura
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
        </span>
      </div>
    </article>
  );
});

export default ProductCard;