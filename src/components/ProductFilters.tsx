'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/constants';

export default function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    next.set('page', '1');
    router.push(`/products?${next.toString()}`);
  };

  return (
    <aside className="tech-card space-y-4 p-4">
      <p className="text-xs font-semibold tracking-widest text-slate-400">FILTER CONSOLE</p>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-300">Category</label>
        <select
          defaultValue={params.get('category') || 'all'}
          onChange={(e) => update('category', e.target.value)}
          className="tech-input w-full rounded-none px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-300">Size</label>
        <input
          type="number"
          min={1}
          placeholder="9"
          defaultValue={params.get('size') || ''}
          onBlur={(e) => update('size', e.target.value)}
          className="tech-input w-full rounded-none px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-300">Min Price</label>
        <input
          type="number"
          placeholder="1000"
          defaultValue={params.get('minPrice') || ''}
          onBlur={(e) => update('minPrice', e.target.value)}
          className="tech-input w-full rounded-none px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-300">Max Price</label>
        <input
          type="number"
          placeholder="8000"
          defaultValue={params.get('maxPrice') || ''}
          onBlur={(e) => update('maxPrice', e.target.value)}
          className="tech-input w-full rounded-none px-3 py-2 text-sm"
        />
      </div>
    </aside>
  );
}
