import { TopFacility } from '@/types/property';

interface TopFacilitiesGridProps {
  topFacilities: TopFacility[];
}

// Icon SVG paths for different amenities
const ICON_PATHS: Record<string, string> = {
  pool: 'M2 16h20v2H2zm0-6h20v2H2zm0-6h20v2H2z',
  gym: 'M6 2h12v2H6V2zm3 4h1v8H9V6zm5 0h1v8h-1V6zM2 18h20v2H2z',
  parking: 'M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 2c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z',
  security: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
  wifi: 'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  garden: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
  lift: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 18h-4v-2h4v2zm5-8h-14V5h14v8z',
  concierge: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  ac: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-6-9.5c0 .83-.67 1.5-1.5 1.5S10 10.33 10 9.5 10.67 8 11.5 8 13 8.67 13 9.5zm5 0c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-10 0c0 .83-.67 1.5-1.5 1.5S6 10.33 6 9.5 6.67 8 7.5 8 9 8.67 9 9.5z',
  furnished: 'M10 10.5c0 .83-.67 1.5-1.5 1.5S7 11.33 7 10.5 7.67 9 8.5 9 10 9.67 10 10.5zm8-7H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V5.5c0-1.1-.9-2-2-2zm0 12H6v-9.5h12V15.5z',
  default: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
};

export default function TopFacilitiesGrid({ topFacilities }: TopFacilitiesGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {topFacilities.map((facility) => (
        <div
          key={facility.name}
          className="flex flex-col  border border-amber-500 p-6 items-center gap-2 rounded-xl px-3 py-4 hover:bg-amber-50 transition-colors"
        >
          <svg className="w-6 h-6 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d={ICON_PATHS[facility.icon] || ICON_PATHS.default} />
          </svg>
          <span className="text-xs font-medium text-stone-700 text-center line-clamp-2">{facility.name}</span>
        </div>
      ))}
    </div>
  );
}
