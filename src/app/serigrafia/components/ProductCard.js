import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  const imageSrc = image?.src || "/placeholder.webp";
  const imageAlt =
    image?.alt ||
    `${product.name} personalizzata con serigrafia a Roma – DTF Italia`;

  return (
    <article
      className="group relative bg-white rounded-xl border border-gray-200 shadow-sm
                 hover:shadow-lg transition focus-within:ring-2 focus-within:ring-indigo-600"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Link overlay accessibile */}
      <Link
        href={`/serigrafia/${product.slug}`}
        aria-label={`Configura ${product.name}`}
        className="absolute inset-0 z-10"
      />

      {/* Immagine prodotto */}
      <div className="relative overflow-hidden rounded-t-xl bg-gray-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={400}
          height={400}
          quality={80}
          sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 50vw,
                 33vw"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
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
        {product.price_html ? (
          <p
            className="text-gray-700 text-sm"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            dangerouslySetInnerHTML={{ __html: product.price_html }}
          />
        ) : (
          <p className="text-gray-500 text-sm">
            Prezzo su richiesta
          </p>
        )}

        {/* CTA */}
        <span
          className="mt-3 inline-flex items-center text-sm font-semibold text-indigo-600"
          aria-hidden="true"
        >
          Configura
          <span className="ml-1">→</span>
        </span>
      </div>
    </article>
  );
}
