export default function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="tech-card animate-pulse p-4">
          <div className="mb-4 h-48 bg-slate-800" />
          <div className="mb-2 h-4 w-2/3 bg-slate-700" />
          <div className="mb-3 h-3 w-full bg-slate-800" />
          <div className="h-9 bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
