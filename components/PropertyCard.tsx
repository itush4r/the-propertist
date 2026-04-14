'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, memo, useRef, useEffect } from 'react';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}


function formatPrice(price: number, type: 'buy' | 'rent'): string {
  if (type === 'rent') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

function PropertyCardComponent({ property, priority = false }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasMultipleImages = property.images && property.images.length > 0;
  const images = hasMultipleImages ? property.images! : [];
  const totalImages = images.length;

  const handleImageError = (index: number) => {
    setBrokenImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollLeft = index * containerWidth;
      setCurrentImageIndex(index);
      // Use setTimeout to ensure DOM is updated before scrolling
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = scrollLeft;
        }
      }, 0);
      resetAutoScroll();
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
    scrollToImage(newIndex);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = currentImageIndex === totalImages - 1 ? 0 : currentImageIndex + 1;
    scrollToImage(newIndex);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const index = Math.round(scrollLeft / containerWidth);
      setCurrentImageIndex(Math.min(index, totalImages - 1));
    }
  };

  const resetAutoScroll = () => {
    if (autoScrollTimeoutRef.current) {
      clearTimeout(autoScrollTimeoutRef.current);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!hasMultipleImages || totalImages <= 1) return;

    const autoScroll = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalImages;
        if (scrollContainerRef.current) {
          const containerWidth = scrollContainerRef.current.clientWidth;
          const scrollLeft = nextIndex * containerWidth;
          scrollContainerRef.current.scrollLeft = scrollLeft;
        }
        return nextIndex;
      });
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(autoScroll);
  }, [totalImages, hasMultipleImages]);

  return (
    <Link href={`/property/${property.id}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden bg-stone-200">
          {hasMultipleImages ? (
            <>
              {/* Carousel */}
              <div
                ref={scrollContainerRef}
                className="flex h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
                onScroll={handleScroll}
              >
                {images.map((img, idx) => (
                  <div key={idx} className="relative min-w-full h-full snap-start flex-shrink-0 bg-stone-300 overflow-hidden">
                    {brokenImages.has(idx) ? (
                      // Error image fallback
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-400">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto text-stone-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-medium text-stone-600">Image unavailable</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={img.url}
                        alt={img.caption || property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(50vw - 20px), calc(33vw - 16px)"
                        priority={priority && idx === 0}
                        fetchPriority={idx === 0 ? 'high' : 'auto'}
                        quality={75}
                        onError={() => handleImageError(idx)}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-900 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-900 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToImage(idx);
                    }}
                    className={`rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'bg-amber-500 w-2 h-2'
                        : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {currentImageIndex + 1}/{totalImages}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Single Image */}
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(50vw - 20px), calc(33vw - 16px)"
                priority={priority}
                fetchPriority={priority ? 'high' : 'auto'}
                quality={75}
              />
              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {property.bhk} BHK
                </span>
              </div>
            </>
          )}

          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
              property.type === 'buy'
                ? 'bg-amber-500 text-white'
                : 'bg-teal-500 text-white'
            }`}>
              {property.type === 'buy' ? 'For Sale' : 'For Rent'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="font-semibold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-amber-700 transition-colors">
            {property.title}
          </h2>

          <p className="text-stone-500 text-sm mt-1 flex items-center gap-1 line-clamp-1">
            <svg className="w-3.5 h-3.5 shrink-0 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
            <span className="text-lg font-bold text-stone-900">
              {formatPrice(property.price, property.type)}
            </span>
            <span className="text-stone-400 text-xs">
              {property.area.toLocaleString()} sq.ft
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// Memoize to prevent unnecessary re-renders when props haven't changed
const PropertyCard = memo(PropertyCardComponent, (prevProps, nextProps) => {
  return prevProps.property.id === nextProps.property.id &&
         prevProps.priority === nextProps.priority;
});

export default PropertyCard;
