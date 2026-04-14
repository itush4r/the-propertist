'use client';

interface SuccessToastProps {
  title: string;
  message: string;
}

export default function SuccessToast({ title, message }: SuccessToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden max-w-sm">
        <div className="flex gap-4 p-5">
          {/* Success Icon */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-stone-900">{title}</h3>
            <p className="text-sm text-stone-600 mt-1">{message}</p>
          </div>

          {/* Close Button */}
          <button className="text-stone-400 hover:text-stone-600 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-green-500 to-green-400 animate-pulse" />
      </div>
    </div>
  );
}
