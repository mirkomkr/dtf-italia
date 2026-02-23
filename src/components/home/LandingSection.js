// components/LandingSection.js
import Image from "next/image";

/**
 * CheckIcon - Inline SVG for features list
 */
const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * LandingSection - Fullscreen landing presentation section
 *
 * Architecture:
 * - ✅ Server Component (zero client JS)
 * - Fullscreen (100vh/100dvh)
 * - 50/50 grid layout
 * - Brand color theming (matching Hero components)
 * - Mobile-first responsive
 *
 * @param {Object} props
 * @param {string} props.id - Section ID for anchor
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {Array<string>} props.features - Features list
 * @param {string} props.ctaText - CTA button text
 * @param {string} props.ctaHref - CTA button link
 * @param {string} props.brandColor - Brand color (indigo, orange, cyan, amber, emerald)
 * @param {boolean} props.reverse - Reverse layout (image left)
 * @param {React.Component} props.ServiceIcon - Icon component from react-icons
 */
export default function LandingSection({
  id,
  title,
  description,
  features = [],
  ctaText,
  ctaHref,
  brandColor = "indigo",
  reverse = false,
  ServiceIcon,
}) {
  // Brand colors matching Hero components exactly
  const colorClasses = {
    indigo: {
      gradient: "from-indigo-900 via-slate-900 to-black", // DTF Hero ✅
      cta: "bg-white text-indigo-700 hover:bg-gray-100 active:bg-gray-200 shadow-lg shadow-indigo-600/25",
      ring: "focus-visible:ring-indigo-500/50",
      iconGradient: "from-indigo-300 to-purple-300",
    },
    orange: {
      gradient: "from-orange-700 via-red-700 to-pink-700", // Serigrafia Hero ✅
      cta: "bg-white text-orange-700 hover:bg-gray-100 active:bg-gray-200 shadow-lg shadow-orange-600/25",
      ring: "focus-visible:ring-orange-500/50",
      iconGradient: "from-orange-300 to-pink-300",
    },
    violet: {
      gradient: "from-violet-800 via-purple-700 to-fuchsia-700", // Sublimazione Hero ✅
      cta: "bg-white text-violet-700 hover:bg-gray-100 active:bg-gray-200 shadow-lg shadow-violet-600/25",
      ring: "focus-visible:ring-violet-500/50",
      iconGradient: "from-violet-300 to-fuchsia-300",
    },
    amber: {
      gradient: "from-amber-700 via-orange-600 to-yellow-600", // Calendari Hero ✅
      cta: "bg-white text-amber-700 hover:bg-gray-100 active:bg-gray-200 shadow-lg shadow-amber-600/25",
      ring: "focus-visible:ring-amber-500/50",
      iconGradient: "from-amber-300 to-yellow-300",
    },
    slate: {
      gradient: "from-slate-900 via-gray-900 to-zinc-900", // Pellicole Hero ✅
      cta: "bg-white text-slate-700 hover:bg-gray-100 active:bg-gray-200 shadow-lg shadow-slate-600/25",
      ring: "focus-visible:ring-slate-500/50",
      iconGradient: "from-slate-300 to-zinc-300",
    },
  };

  const colors = colorClasses[brandColor] || colorClasses.indigo;

  return (
    <section
      id={id}
      className={`
        min-h-screen min-h-[100dvh]
        flex items-center justify-center
        bg-gradient-to-br ${colors.gradient}
        py-20
      `}
      aria-labelledby={`${id}-heading`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`
          grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
          ${reverse ? "lg:flex-row-reverse" : ""}
        `}
        >
          {/* Text Column */}
          <div className="space-y-6 text-center lg:text-left">
            <h2
              id={`${id}-heading`}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
            >
              {title}
            </h2>

            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
              {description}
            </p>

            {/* Features List */}
            {features.length > 0 && (
              <ul className="space-y-3 max-w-lg mx-auto lg:mx-0" role="list">
                {features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-white text-lg"
                  >
                    <CheckIcon className="w-6 h-6 text-white/80 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="pt-4">
              <a
                href={ctaHref}
                className={`
                  inline-block px-8 py-4 
                  ${colors.cta}
                  rounded-xl font-bold text-lg
                  transition-all
                  focus-visible:outline-none focus-visible:ring-4 ${colors.ring}
                `}
                aria-label={`Scopri ${title}`}
              >
                {ctaText}
              </a>
            </div>
          </div>

          {/* Image Column */}
          <div
            className={`flex items-center justify-center ${reverse ? "lg:order-first" : ""}`}
          >
            {/* Hidden heading for screen readers */}
            <h2 id={`${id}-placeholder-heading`} className="sr-only">
              Immagine rappresentativa {title}
            </h2>

            {/*
             * ─── SECTION IMAGE ──────────────────────────────────────────────────────
             * Sostituire il <div> placeholder qui sotto con questo blocco <Image>
             * non appena l'asset è disponibile in /public/images/landing-{id}.webp
             *
             * Naming convention asset (corrisponde alla prop `id` passata da page.js):
             *   id="dtf"          → /public/images/landing-dtf.webp
             *   id="serigrafia"   → /public/images/landing-serigrafia.webp
             *   id="sublimazione" → /public/images/landing-sublimazione.webp
             *   id="calendari"    → /public/images/landing-calendari.webp
             *   id="pellicole"    → /public/images/landing-pellicole.webp
             *
             * Specifiche asset richieste:
             *   • Formato   : WebP (con fallback JPG per Safari < 14)
             *   • Dimensioni: 800 × 600 px  (aspect-ratio 4/3)
             *   • Qualità   : 85 — ottimale per immagini di stampa
             *   • `priority`: true SOLO per id="dtf" (primo LCP below-fold visibile)
             *                 false per le altre sezioni (below the fold)
             *   • `sizes`   : (max-width: 1024px) 100vw, 50vw
             *                 corrisponde al layout grid 50/50
             *
             * <Image
             *   src={`/images/landing-${id}.webp`}
             *   alt={`${title} - DTF Italia Roma`}
             *   width={800}
             *   height={600}
             *   priority={id === 'dtf'}
             *   quality={85}
             *   sizes="(max-width: 1024px) 100vw, 50vw"
             *   className="w-full h-auto rounded-2xl shadow-2xl object-cover"
             * />
             * ────────────────────────────────────────────────────────────────────────
             */}

            {/* Placeholder visivo — rimuovere quando l'<Image> sopra è attivo */}
            <div
              className="w-full max-w-md aspect-[4/3] rounded-2xl bg-white/5 border border-white/20 backdrop-blur-sm flex items-center justify-center"
              aria-hidden="true"
              role="presentation"
            >
              <div className="text-center">
                {ServiceIcon && (
                  <ServiceIcon
                    className="text-5xl mb-2 mx-auto text-white/30"
                    aria-hidden="true"
                  />
                )}
                <span className="text-white/30 text-sm font-medium">
                  Image Placeholder
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
