import PropertyListing from '@/components/PropertyListing';
import properties from '@/data/properties.json';
import { Property } from '@/types/property';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-stone-900 tracking-tight">The Propertist</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            Find Your <span className="text-amber-500">Perfect Home</span>
          </h1>
          <p className="text-stone-500 mt-2 text-base">
            Browse thousands of properties across India — buy or rent with confidence.
          </p>
        </div>

        <PropertyListing properties={properties as Property[]} />
      </div>
    </main>
  );
}
