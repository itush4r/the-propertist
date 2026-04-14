'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types/property';
import ContactCard from './ContactCard';
import ScheduleTourModal from './ScheduleTourModal';

interface PropertyDetailsSidebarProps {
  property: Property;
}

const SAVED_PROPERTIES_KEY = 'saved_properties';

export default function PropertyDetailsSidebar({ property }: PropertyDetailsSidebarProps) {
  const [showTourModal, setShowTourModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareText, setShareText] = useState('Share');
  const [isSharing, setIsSharing] = useState(false);

  // Check if property is saved on component mount
  useEffect(() => {
    const savedProperties = JSON.parse(sessionStorage.getItem(SAVED_PROPERTIES_KEY) || '[]');
    const isPropertySaved = savedProperties.includes(property.id);
    setIsSaved(isPropertySaved);
  }, [property.id]);

  // Handle save property
  const handleSave = () => {
    const savedProperties = JSON.parse(sessionStorage.getItem(SAVED_PROPERTIES_KEY) || '[]');

    if (isSaved) {
      // Remove from saved
      const updated = savedProperties.filter((id: string) => id !== property.id);
      sessionStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(updated));
      setIsSaved(false);
    } else {
      // Add to saved
      if (!savedProperties.includes(property.id)) {
        savedProperties.push(property.id);
        sessionStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(savedProperties));
        setIsSaved(true);
      }
    }
  };

  // Handle share property
  const handleShare = async () => {
    if (isSharing) return;

    try {
      setIsSharing(true);
      const propertyUrl = `${window.location.origin}/property/${property.id}`;

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: propertyUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(propertyUrl);
      }

      setShareText('Copied!');
      setTimeout(() => {
        setShareText('Share');
        setIsSharing(false);
      }, 2000);
    } catch (error) {
      console.error('Share failed:', error);
      setIsSharing(false);
    }
  };

  return (
    <>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8 sticky top-28 space-y-6">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-stone-900">Interested?</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Schedule a private viewing or request more information about this property.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={property.contact?.phone?.[0] ? `tel:${property.contact.phone[0]}` : '#'}
              className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-center uppercase tracking-widest text-sm shadow-lg shadow-amber-500/20"
            >
              Contact Agent
            </a>
            <button
              onClick={() => setShowTourModal(true)}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold py-4 px-6 rounded-2xl transition-colors uppercase tracking-widest text-sm border border-stone-200"
            >
              Schedule a Tour
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 py-4 border-y border-stone-100">
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                isSaved
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-stone-600 hover:text-amber-600'
              }`}
            >
              <svg
                className={`w-4 h-4 transition-all ${isSaved ? 'fill-red-600' : ''}`}
                fill={isSaved ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isSaved ? 'Saved' : 'Save'}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              disabled={isSharing}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                shareText === 'Copied!'
                  ? 'text-green-600'
                  : 'text-stone-600 hover:text-amber-600'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              {shareText}
            </button>
          </div>

          {property.contact && (
            <div className="bg-stone-50 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {property.title.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-stone-900">Verified Partner</div>
                <div className="text-xs text-stone-500">Premium Listing</div>
              </div>
            </div>
          )}

          {property.contact && (property.contact.phone || property.contact.email || property.contact.website) && (
            <div className="pt-4 border-t border-stone-100">
              <ContactCard contact={property.contact} />
            </div>
          )}
        </div>
      </div>

      {/* Tour Modal */}
      <ScheduleTourModal
        isOpen={showTourModal}
        onClose={() => setShowTourModal(false)}
        propertyTitle={property.title}
      />
    </>
  );
}
