'use client';

import { BHKFilter, PropertyType } from '@/types/property';

interface FiltersProps {
  propertyType: PropertyType;
  onTypeChange: (type: PropertyType) => void;
  bhkFilter: BHKFilter;
  onBHKChange: (bhk: BHKFilter) => void;
}

const BHK_OPTIONS: { label: string; value: BHKFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '1 BHK', value: 1 },
  { label: '2 BHK', value: 2 },
  { label: '3 BHK', value: 3 },
  { label: '4+ BHK', value: 4 },
];

export default function Filters({ propertyType, onTypeChange, bhkFilter, onBHKChange }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Buy / Rent Toggle */}
      <div className="flex bg-stone-100 p-1 rounded-xl shrink-0">
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
  );
}
