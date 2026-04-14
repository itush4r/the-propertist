'use client';

import { BHKFilter, PropertyType, PropertyCategory, PriceRange } from '@/types/property';

interface FiltersProps {
  propertyType: PropertyType;
  onTypeChange: (type: PropertyType) => void;
  bhkFilter: BHKFilter;
  onBHKChange: (bhk: BHKFilter) => void;
  propertyCategory: PropertyCategory;
  onCategoryChange: (category: PropertyCategory) => void;
  priceRange: PriceRange;
  onPriceChange: (price: PriceRange) => void;
  amenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
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

export default function Filters({
  propertyType,
  onTypeChange,
  bhkFilter,
  onBHKChange,
  propertyCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  amenities,
  onAmenitiesChange,
  availableAmenities,
}: FiltersProps) {
  const handleAmenityToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      onAmenitiesChange(amenities.filter(a => a !== amenity));
    } else {
      onAmenitiesChange([...amenities, amenity]);
    }
  };
  return (
    <div className="space-y-4">
      {/* Buy / Rent Toggle */}
      <div className="flex bg-stone-100 p-1 rounded-xl w-fit">
        {(['buy', 'rent'] as PropertyType[]).map((type) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
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

      {/* BHK Filter */}
      <div>
        <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">BHK</p>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onBHKChange(value)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                bhkFilter === value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Category Filter */}
      <div>
        <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Property Type</p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_CATEGORY_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                propertyCategory === value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Price Range</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGE_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => onPriceChange(value)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                priceRange === value
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <p className="text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wide">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_OPTIONS.map((amenity) => (
            <button
              key={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                amenities.includes(amenity)
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
