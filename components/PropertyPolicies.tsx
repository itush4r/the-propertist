import { Policy } from '@/types/property';

interface PropertyPoliciesProps {
  policies: Policy[];
}

export default function PropertyPolicies({ policies }: PropertyPoliciesProps) {
  return (
    <div className="space-y-3">
      {policies.map((policy) => (
        <div key={policy.type}>
          <h3 className="text-sm font-semibold text-stone-900 mb-2">{policy.type}</h3>
          <ul className="space-y-1">
            {policy.text.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="w-1 h-1 rounded-full bg-stone-400 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
