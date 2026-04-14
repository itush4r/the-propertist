import { FacilityGroup } from '@/types/property';

interface FacilityGroupsListProps {
  facilityGroups: FacilityGroup[];
}

export default function FacilityGroupsList({ facilityGroups }: FacilityGroupsListProps) {
  return (
    <div className="space-y-6">
      {facilityGroups.map((group) => (
        <div key={group.name}>
          <h3 className="text-sm font-semibold text-stone-900 mb-3 uppercase tracking-wide">{group.name}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.facility_items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
