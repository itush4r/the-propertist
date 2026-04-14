'use client';

import { useState, useEffect } from 'react';

interface PropertyNavTabsProps {
  hasAmenities: boolean;
  hasFacilities: boolean;
  hasPolicies: boolean;
}

export default function PropertyNavTabs({ hasAmenities, hasFacilities, hasPolicies }: PropertyNavTabsProps) {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'amenities', 'policies'];
      let activeSection = 'overview';
      const triggerHeight = 300; // Trigger point from top

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();

          // Highlight if section is near the trigger point (300px from top)
          // OR if we're at the very bottom of the page and this is the policies section
          if (rect.top <= triggerHeight && rect.bottom >= 0) {
            activeSection = section;
          }

          // Special case: if policies section is visible, prioritize it when near bottom
          if (section === 'policies' && rect.top <= window.innerHeight * 0.6) {
            activeSection = 'policies';
          }
        }
      }

      setActiveSection(activeSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);

    if (element) {
      // Scroll to element with smooth behavior, accounting for header + nav tabs
      const pageHeader = 57; // height of sticky page header
      const navTabs = 57; // height of sticky nav tabs
      const extraPadding = 30; // extra space for visibility
      const totalOffset = pageHeader + navTabs + extraPadding;

      const elementPosition = element.getBoundingClientRect().top + window.scrollY - totalOffset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      // Set active section immediately for instant feedback
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="border-b border-stone-200 flex gap-8 overflow-x-auto sticky top-[57px] bg-white -mx-4 sm:-mx-6 lg:-mx-0 px-4 sm:px-6 lg:px-0 z-40">
      <a
        href="#overview"
        onClick={(e) => handleTabClick(e, 'overview')}
        className={`font-semibold text-sm uppercase tracking-widest whitespace-nowrap py-4 border-b-2 transition-colors ${
          activeSection === 'overview'
            ? 'text-amber-500 border-amber-500'
            : 'text-stone-500 border-transparent hover:text-stone-900 hover:border-stone-300'
        }`}
      >
        Overview
      </a>
      {hasAmenities && (
        <a
          href="#amenities"
          onClick={(e) => handleTabClick(e, 'amenities')}
          className={`font-semibold text-sm uppercase tracking-widest whitespace-nowrap py-4 border-b-2 transition-colors ${
            activeSection === 'amenities'
              ? 'text-amber-500 border-amber-500'
              : 'text-stone-500 border-transparent hover:text-stone-900 hover:border-stone-300'
          }`}
        >
          Amenities
        </a>
      )}
      {hasPolicies && (
        <a
          href="#policies"
          onClick={(e) => handleTabClick(e, 'policies')}
          className={`font-semibold text-sm uppercase tracking-widest whitespace-nowrap py-4 border-b-2 transition-colors ${
            activeSection === 'policies'
              ? 'text-amber-500 border-amber-500'
              : 'text-stone-500 border-transparent hover:text-stone-900 hover:border-stone-300'
          }`}
        >
          Policies
        </a>
      )}
    </div>
  );
}
