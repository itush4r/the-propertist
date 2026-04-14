import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Property not found</h1>
        <p className="text-stone-500 mb-6">This listing may have been removed or doesn't exist.</p>
        <Link
          href="/"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors inline-block"
        >
          Back to listings
        </Link>
      </div>
    </main>
  );
}
