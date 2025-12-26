'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * LazyLoader
 * Renders children only when the element enters the viewport.
 * Uses IntersectionObserver to trigger loading.
 */
export default function LazyLoader({ children, placeholder }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Falls background if IntersectionObserver is not supported (SSR or very old browsers)
    if (!('IntersectionObserver' in window)) {
        setIsVisible(true);
        return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
       rootMargin: "200px", // Preload slightly before it comes into view
       threshold: 0.01 
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-[600px] w-full">
      {isVisible ? children : placeholder}
    </div>
  );
}
