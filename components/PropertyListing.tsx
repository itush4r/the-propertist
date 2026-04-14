'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Property, PropertyType, BHKFilter, PropertyCategory, PriceRange } from '@/types/property';
import PropertyCard from '@/components/PropertyCard';
import SkeletonCard from '@/components/SkeletonCard';
import SearchBar from '@/components/SearchBar';
import FilterModal from '@/components/FilterModal';
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
  const [propertyCategory, setPropertyCategory] = useState<PropertyCategory>('all');
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setIsLoading(false);
  }, []);


  // Price filter helper
  const getPriceRange = (price: number): PriceRange => {
    const crore = 10000000;
    const lakh = 100000;
    if (price < 50 * lakh) return '0-50L';
    if (price < 1 * crore) return '50L-1Cr';
    if (price < 2 * crore) return '1Cr-2Cr';
    return '2Cr+';
  };

  const matchesPriceRange = (price: number): boolean => {
    if (priceRange === 'all') return true;
    return getPriceRange(price) === priceRange;
  };

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchesType = p.type === propertyType;
      const matchesBHK = bhkFilter === 'all' || (bhkFilter === 4 ? p.bhk >= 4 : p.bhk === bhkFilter);
      const matchesCategory = propertyCategory === 'all' || p.propertyCategory === propertyCategory;
      const matchesPrice = matchesPriceRange(p.price);

      const matchesAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every(amenity => p.amenities.includes(amenity));

      const matchesSearch =
        debouncedSearch.trim() === '' ||
        p.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.propertyCategory.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchesType && matchesBHK && matchesCategory && matchesPrice && matchesAmenities && matchesSearch;
    });
  }, [properties, propertyType, bhkFilter, propertyCategory, priceRange, selectedAmenities, debouncedSearch]);

  // Reset displayCount when filters change
  useEffect(() => {
    setDisplayCount(INITIAL_LOAD);
  }, [propertyType, bhkFilter, propertyCategory, priceRange, selectedAmenities, debouncedSearch]);

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

  // Reset all filters
  const handleResetFilters = () => {
    setBHKFilter('all');
    setPropertyCategory('all');
    setPriceRange('all');
    setSelectedAmenities([]);
  };

  // Apply filters handler
  const handleApplyFilters = () => {
    // Filters are already updated via state setters
    // This is just for modal closing logic
  };

  // Count active filters
  const activeFilterCount = [
    bhkFilter !== 'all' ? 1 : 0,
    propertyCategory !== 'all' ? 1 : 0,
    priceRange !== 'all' ? 1 : 0,
    selectedAmenities.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div>
      {/* Search + Filters Section */}
      <div className="space-y-3 mb-8">
        {/* Search Bar */}
        <SearchBar value={searchInput} onChange={setSearchInput} />

        {/* Buy/Rent Toggle + Filters Button */}
        <div className="flex gap-3 items-center">
          {/* Buy/Rent Toggle */}
          <div className="flex bg-stone-100 p-1 rounded-xl shrink-0">
            {(['buy', 'rent'] as PropertyType[]).map((type) => (
              <button
                key={type}
                onClick={() => setPropertyType(type)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                  propertyType === type
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Filters Button with Indicator */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="relative px-4 py-2.5 bg-white border border-stone-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center gap-2 text-stone-700 font-semibold text-sm whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters

            {/* Active Filters Indicator */}
            {activeFilterCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                {activeFilterCount}
              </div>
            )}
          </button>
        </div>
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
          <p className="text-stone-400 text-sm mt-3">Try adjusting your search or filters.</p>
          <button
            onClick={handleResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors text-sm uppercase tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
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

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        bhkFilter={bhkFilter}
        onBHKChange={setBHKFilter}
        propertyCategory={propertyCategory}
        onCategoryChange={setPropertyCategory}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        amenities={selectedAmenities}
        onAmenitiesChange={setSelectedAmenities}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
