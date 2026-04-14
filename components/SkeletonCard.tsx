export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm animate-pulse">
      <div className="h-52 bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded-full w-3/4" />
        <div className="h-3 bg-stone-200 rounded-full w-1/2" />
        <div className="flex justify-between items-center pt-3 border-t border-stone-100">
          <div className="h-5 bg-stone-200 rounded-full w-1/3" />
          <div className="h-3 bg-stone-200 rounded-full w-1/4" />
        </div>
      </div>
    </div>
  );
}
