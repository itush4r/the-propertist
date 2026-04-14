'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SinglePropertyImageProps {
  src: string;
  alt: string;
  propertyType: 'buy' | 'rent';
}

export default function SinglePropertyImage({ src, alt, propertyType }: SinglePropertyImageProps) {
  const [isBroken, setIsBroken] = useState(false);

  return (
    <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-stone-100 shadow-sm border border-stone-100">
      {isBroken ? (
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
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          onError={() => setIsBroken(true)}
        />
      )}
      <div className="absolute top-4 left-4 flex gap-2">
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide ${
          propertyType === 'buy' ? 'bg-amber-500 text-white' : 'bg-teal-500 text-white'
        }`}>
          {propertyType === 'buy' ? 'For Sale' : 'For Rent'}
        </span>
      </div>
    </div>
  );
}
