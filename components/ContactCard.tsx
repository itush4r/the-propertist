import { ContactInfo } from '@/types/property';

interface ContactCardProps {
  contact: ContactInfo;
}

export default function ContactCard({ contact }: ContactCardProps) {
  if (!contact) return null;

  const hasAnyContact = Array.isArray(contact.phone) || Array.isArray(contact.email) || contact.website;
  if (!hasAnyContact) return null;

  return (
    <div className="space-y-3">
      {/* Phone Numbers */}
      {Array.isArray(contact.phone) && contact.phone.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-stone-500 uppercase tracking-widest font-semibold">Call us</div>
            <a
              href={`tel:${contact.phone[0]}`}
              className="text-amber-600 hover:text-amber-700 font-bold text-sm transition-colors"
            >
              {contact.phone[0]}
            </a>
          </div>
        </div>
      )}

      {/* Email */}
      {Array.isArray(contact.email) && contact.email.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-stone-500 uppercase tracking-widest font-semibold">Email us</div>
            <a
              href={`mailto:${contact.email[0]}`}
              className="text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors truncate block"
            >
              {contact.email[0]}
            </a>
          </div>
        </div>
      )}

      {/* Website */}
      {contact.website && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-stone-500 uppercase tracking-widest font-semibold">Visit us</div>
            <a
              href={contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-bold text-sm transition-colors truncate block"
            >
              Website
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
