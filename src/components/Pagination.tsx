import Link from 'next/link';

export default function Pagination({
  page,
  totalPages,
  query,
}: {
  page: number;
  totalPages: number;
  query: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const buildLink = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries({ ...query, page: String(nextPage) }).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return `/products?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Link href={buildLink(Math.max(1, page - 1))} className="tech-btn px-4 py-2 text-sm">
        Prev
      </Link>
      <span className="text-sm text-slate-400">Page {page} / {totalPages}</span>
      <Link href={buildLink(Math.min(totalPages, page + 1))} className="tech-btn px-4 py-2 text-sm">
        Next
      </Link>
    </div>
  );
}
