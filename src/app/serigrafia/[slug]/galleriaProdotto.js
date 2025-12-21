"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({ images = [], name }) {
  const gallery =
    images.length > 0
      ? images
      : [{ src: "/placeholder.png", alt: name }];

  const [current, setCurrent] = useState(0);

  return (
    <section aria-label="Galleria immagini prodotto">
      <div className="relative aspect-square border rounded-xl overflow-hidden">
        <Image
          src={gallery[current].src}
          alt={gallery[current].alt || name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />

        {gallery.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrent(current === 0 ? gallery.length - 1 : current - 1)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              aria-label="Immagine precedente"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() =>
                setCurrent(current === gallery.length - 1 ? 0 : current + 1)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
              aria-label="Immagine successiva"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
