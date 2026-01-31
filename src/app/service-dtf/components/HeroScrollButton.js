// app/service-dtf/components/HeroScrollButton.js
'use client';

/**
 * HeroScrollButton - Client Component for scroll-to-configurator functionality
 * 
 * Architecture:
 * - ✅ Client Component (minimal JS)
 * - Isolated from Hero (Server Component)
 * - Smooth scroll with offset
 * - Mobile-optimized
 * 
 * @param {Object} props
 * @param {string} props.targetId - ID of target element to scroll to
 */
export default function HeroScrollButton({ targetId = 'configurator-section' }) {
  const scrollToTarget = () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    
    // Offset for fixed header
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };
  
  return (
    <button
      onClick={scrollToTarget}
      className="px-8 py-4 bg-white text-indigo-700 rounded-xl font-bold text-lg hover:bg-gray-100 active:bg-gray-200 transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50"
      aria-label="Vai al configuratore DTF"
    >
      Configura Ordine
    </button>
  );
}
