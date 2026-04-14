'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Property, PropertyType, BHKFilter } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import SkeletonCard from '@/components/SkeletonCard';
import SearchBar from '@/components/SearchBar';
import Filters from '@/components/Filters';
import { useDebounce } from '@/hooks/useDebounce';

interface PropertyListingProps {
  properties: Property[];
}

const INITIAL_LOAD = 10;
const LOAD_MORE_COUNT = 10;

export default function PropertyListing({ properties }: PropertyListingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('buy');
  const [bhkFilter, setBHKFilter] = useState<BHKFilter>('all');
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const observerTarget = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchesType = p.type === propertyType;
      const matchesBHK = bhkFilter === 'all' || (bhkFilter === 4 ? p.bhk >= 4 : p.bhk === bhkFilter);
      const matchesSearch =
        debouncedSearch.trim() === '' ||
        p.location.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchesType && matchesBHK && matchesSearch;
    });
  }, [properties, propertyType, bhkFilter, debouncedSearch]);

  // Reset displayCount when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_LOAD);
  }, [propertyType, bhkFilter, debouncedSearch]);

  // Infinite scroll observer
  useEffect(() => {
    // Wait for content to load before setting up observer
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < filtered.length) {
          setIsLoadingMore(true);
          setDisplayCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filtered.length));
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading, filtered.length, displayCount]);

  // Simulate loading delay for skeleton loaders
  useEffect(() => {
    if (!isLoadingMore) return;

    const timer = setTimeout(() => {
      setIsLoadingMore(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [isLoadingMore]);

  return (
    <div>
      {/* Search + Filters */}
      <div className="space-y-3 mb-8">
        <SearchBar value={searchInput} onChange={setSearchInput} />
        <Filters
          propertyType={propertyType}
          onTypeChange={setPropertyType}
          bhkFilter={bhkFilter}
          onBHKChange={setBHKFilter}
        />
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-stone-500 mb-4">
          {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">🏚️</div>
          <h3 className="text-lg font-semibold text-stone-700">No properties found</h3>
          <p className="text-stone-400 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.slice(0, displayCount).map((property, idx) => (
              <PropertyCard key={property.id} property={property} priority={idx === 0} />
            ))}

            {/* Skeleton loaders while loading more */}
            {isLoadingMore && (
              <>
                {Array.from({ length: LOAD_MORE_COUNT }).map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))}
              </>
            )}
          </div>

          {/* Observer target and loading area - always render to prevent layout shift */}
          {displayCount < filtered.length && (
            <div ref={observerTarget} className="py-12 text-center min-h-16">
              {!isLoadingMore && (
                <>
                  <div className="inline-flex items-center gap-2">
                    <div className="h-2 w-2 bg-stone-300 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-stone-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-stone-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <p className="text-sm text-stone-400 mt-2">Loading more properties...</p>
                </>
              )}
            </div>
          )}

          {/* Final message area */}
          {displayCount >= filtered.length && filtered.length > INITIAL_LOAD && (
            <div className="py-8 text-center min-h-12">
              <p className="text-sm text-stone-400">No more properties to load</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
