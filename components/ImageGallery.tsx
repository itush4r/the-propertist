'use client';

import Image from 'next/image';
import { useState } from 'react';
import { PropertyImage } from '@/types/property';

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setBrokenImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      {/* Hero Image */}
      <div className="relative h-80 sm:h-[480px] rounded-2xl overflow-hidden bg-stone-200 group">
        {brokenImages.has(activeIndex) ? (
          // Error image fallback
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-400">
            <div className="text-center">
              <svg className="w-20 h-20 mx-auto text-stone-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium text-stone-600">Image unavailable</p>
            </div>
          </div>
        ) : (
          <Image
            src={images[activeIndex].url}
            alt={images[activeIndex].caption || title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 85vw"
            onError={() => handleImageError(activeIndex)}
          />
        )}

        {/* Caption Overlay */}
        {images[activeIndex].caption && !brokenImages.has(activeIndex) && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
            <p className="text-white text-sm font-medium">{images[activeIndex].caption}</p>
          </div>
        )}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <p className="text-white text-xs font-medium">
            {activeIndex + 1} / {images.length}
          </p>
        </div>

        {/* Prev Button */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              aria-current={idx === activeIndex ? 'true' : 'false'}
              className={`relative h-16 w-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors flex items-center justify-center ${
                idx === activeIndex ? 'border-amber-500' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {brokenImages.has(idx) ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-300 to-stone-400">
                  <svg className="w-6 h-6 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <Image
                  src={img.url}
                  alt={img.caption || `Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                  onError={() => handleImageError(idx)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
