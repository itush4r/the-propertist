export interface PropertyImage {
  url: string;
  caption?: string;
}

export interface TopFacility {
  name: string;
  icon: string;
}

export interface FacilityGroup {
  name: string;
  facility_items: string[];
}

export interface ContactInfo {
  phone?: string[];
  email?: string[];
  website?: string;
}

export interface Policy {
  type: string;
  text: string[];
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bhk: number;
  type: 'buy' | 'rent';
  area: number;
  description: string;
  image: string;
  amenities: string[];
  // Optional rich fields for enhanced detail page
  images?: PropertyImage[];
  descriptions?: string[];
  topFacilities?: TopFacility[];
  facilityGroups?: FacilityGroup[];
  contact?: ContactInfo;
  policies?: Policy[];
}

export type PropertyType = 'buy' | 'rent';
export type BHKFilter = 1 | 2 | 3 | 4 | 'all';
