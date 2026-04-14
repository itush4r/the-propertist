'use client';

import { useState, useEffect } from 'react';
import { BHKFilter, PropertyCategory, PriceRange } from '@/types/property';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  bhkFilter: BHKFilter;
  onBHKChange: (bhk: BHKFilter) => void;
  propertyCategory: PropertyCategory;
  onCategoryChange: (category: PropertyCategory) => void;
  priceRange: PriceRange;
  onPriceChange: (price: PriceRange) => void;
  amenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const BHK_OPTIONS: { label: string; value: BHKFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '1 BHK', value: 1 },
  { label: '2 BHK', value: 2 },
  { label: '3 BHK', value: 3 },
  { label: '4+ BHK', value: 4 },
];

const PROPERTY_CATEGORY_OPTIONS: { label: string; value: PropertyCategory }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'House', value: 'House' },
  { label: 'Townhouse', value: 'Townhouse' },
  { label: 'Studio', value: 'Studio' },
  { label: 'Duplex', value: 'Duplex' },
];

const PRICE_RANGE_OPTIONS: { label: string; value: PriceRange }[] = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹50L', value: '0-50L' },
  { label: '₹50L - ₹1Cr', value: '50L-1Cr' },
  { label: '₹1Cr - ₹2Cr', value: '1Cr-2Cr' },
  { label: '₹2Cr+', value: '2Cr+' },
];

const AMENITIES_OPTIONS = [
  'Parking',
  'Security',
  'Gym',
  'Lift',
  'Pool',
  'AC',
  'Furnished',
];

export default function FilterModal({
  isOpen,
  onClose,
  bhkFilter,
  onBHKChange,
  propertyCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  amenities,
  onAmenitiesChange,
  onApplyFilters,
  onResetFilters,
}: FilterModalProps) {
  const [tempBHK, setTempBHK] = useState<BHKFilter>(bhkFilter);
  const [tempCategory, setTempCategory] = useState<PropertyCategory>(propertyCategory);
  const [tempPrice, setTempPrice] = useState<PriceRange>(priceRange);
  const [tempAmenities, setTempAmenities] = useState<string[]>(amenities);

  // Sync temporary state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempBHK(bhkFilter);
      setTempCategory(propertyCategory);
      setTempPrice(priceRange);
      setTempAmenities(amenities);
    }
  }, [isOpen, bhkFilter, propertyCategory, priceRange, amenities]);

  const handleAmenityToggle = (amenity: string) => {
    if (tempAmenities.includes(amenity)) {
      setTempAmenities(tempAmenities.filter(a => a !== amenity));
    } else {
      setTempAmenities([...tempAmenities, amenity]);
    }
  };

  const handleApply = () => {
    onBHKChange(tempBHK);
    onCategoryChange(tempCategory);
    onPriceChange(tempPrice);
    onAmenitiesChange(tempAmenities);
    onApplyFilters();
    onClose();
  };

  const handleReset = () => {
    setTempBHK('all');
    setTempCategory('all');
    setTempPrice('all');
    setTempAmenities([]);
    onResetFilters();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto sm:rounded-3xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Filters</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors p-1"
              aria-label="Close filters"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters Content */}
          <div className="p-6 space-y-6">
            {/* BHK Filter */}
            <div>
              <p className="text-sm font-semibold text-stone-900 mb-3">BHK</p>
              <div className="flex flex-wrap gap-2">
                {BHK_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setTempBHK(value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      tempBHK === value
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Category Filter */}
            <div>
              <p className="text-sm font-semibold text-stone-900 mb-3">Property Type</p>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_CATEGORY_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setTempCategory(value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      tempCategory === value
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <p className="text-sm font-semibold text-stone-900 mb-3">Price Range</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGE_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setTempPrice(value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      tempPrice === value
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div>
              <p className="text-sm font-semibold text-stone-900 mb-3">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                      tempAmenities.includes(amenity)
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-stone-50 border-t border-stone-100 px-6 py-4 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors text-sm uppercase tracking-wide"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors text-sm uppercase tracking-wide"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
