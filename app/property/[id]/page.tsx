import { notFound } from 'next/navigation';
import Link from 'next/link';
import properties from '@/data/properties.json';
import { Property } from '@/types/property';
import ImageGallery from '@/components/ImageGallery';
import SinglePropertyImage from '@/components/SinglePropertyImage';
import TopFacilitiesGrid from '@/components/TopFacilitiesGrid';
import FacilityGroupsList from '@/components/FacilityGroupsList';
import PropertyPolicies from '@/components/PropertyPolicies';
import PropertyNavTabs from '@/components/PropertyNavTabs';
import PropertyDetailsSidebar from '@/components/PropertyDetailsSidebar';

interface Props {
  params: Promise<{ id: string }>;
}

function formatPrice(price: number, type: 'buy' | 'rent'): string {
  if (type === 'rent') return `₹${price.toLocaleString('en-IN')}/month`;
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export async function generateStaticParams() {
  return (properties as Property[]).map((p) => ({ id: p.id }));
}

export default async function PropertyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const property = (properties as Property[]).find((p) => p.id === resolvedParams.id);

  if (!property) notFound();

  const hasRichImages = property.images && property.images.length > 0;

  return (
    <main className="min-h-screen ">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-600 transition-colors mb-8 font-semibold uppercase tracking-wide"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Listings
        </Link>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2 columns) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            {hasRichImages ? (
              <div className="rounded-3xl overflow-hidden shadow-sm border border-stone-100">
                <ImageGallery images={property.images!} title={property.title} />
              </div>
            ) : (
              <SinglePropertyImage
                src={property.image}
                alt={property.title}
                propertyType={property.type}
              />
            )}

            {/* Title & Location */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-3">{property.title}</h1>
                <div className="flex items-center gap-2 text-stone-600">
                  <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg">{property.location}</span>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-stone-100">
                <div className="text-4xl font-bold text-stone-900">
                  {formatPrice(property.price, property.type)}
                </div>
                <div className="text-sm text-stone-500 uppercase tracking-widest font-semibold mt-1">Estimated Price</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-stone-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">{property.bhk}</div>
                <div className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-1">Bedrooms</div>
              </div>
              <div className="text-center border-x border-stone-100">
                <div className="text-2xl font-bold text-stone-900">{property.area.toLocaleString()}</div>
                <div className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-1">Sq. Ft.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900 capitalize">{property.type}</div>
                <div className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-1">Type</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <PropertyNavTabs
              hasAmenities={!!(property.topFacilities && property.topFacilities.length > 0)}
              hasFacilities={!!(property.facilityGroups && property.facilityGroups.length > 0)}
              hasPolicies={!!(property.policies && property.policies.length > 0)}
            />

            {/* Description */}
            {(property.descriptions || property.description) && (
              <div id="overview" className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-900">About this property</h2>
                {property.descriptions && property.descriptions.length > 0 ? (
                  <div className="space-y-4">
                    {property.descriptions.map((desc, idx) => (
                      <p key={idx} className="text-stone-600 text-lg leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-stone-600 text-lg leading-relaxed">{property.description}</p>
                )}
              </div>
            )}

            {/* Top Facilities */}
            {property.topFacilities && property.topFacilities.length > 0 && (
              <div id="amenities" className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-900">Top Amenities</h2>
                <TopFacilitiesGrid topFacilities={property.topFacilities} />
              </div>
            )}

            {/* Facility Groups */}
            {property.facilityGroups && property.facilityGroups.length > 0 && (
              <div id="facilities" className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-900">Amenities & Facilities</h2>
                <FacilityGroupsList facilityGroups={property.facilityGroups} />
              </div>
            )}


            {/* Legacy Amenities */}
            {!property.facilityGroups && property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-900">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span key={amenity} className="bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-100">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            {property.policies && property.policies.length > 0 && (
              <div id="policies" className="space-y-4">
                <h2 className="text-2xl font-bold text-stone-900">Policies</h2>
                <PropertyPolicies policies={property.policies} />
              </div>
            )}
          </div>

          {/* Sidebar (1 column) */}
          <PropertyDetailsSidebar property={property} />
        </div>
      </div>
    </main>
  );
}
