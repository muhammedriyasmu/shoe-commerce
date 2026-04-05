'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { totalItems } = useCart();
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (search.trim()) next.set('search', search.trim());
    else next.delete('search');
    next.set('page', '1');
    router.push(`/products?${next.toString()}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ borderColor: 'var(--line)', background: 'rgba(8,10,14,0.94)' }}>
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-black tracking-wide" style={{ color: 'var(--neon)' }}>
          SHOE.SHEET
        </Link>
        <form onSubmit={onSubmit} className="ml-2 hidden flex-1 sm:block">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tech, category"
            className="tech-input w-full rounded-none px-4 py-2 text-sm outline-none"
          />
        </form>
        <Link href="/products" className="text-sm font-semibold text-slate-300 hover:text-[var(--neon)]">
          Vault
        </Link>
        <Link href="/cart" className="tech-btn rounded-none px-3 py-2 text-sm font-semibold">
          Cart {totalItems > 0 ? `(${totalItems})` : ''}
        </Link>
      </div>
      <form onSubmit={onSubmit} className="px-4 pb-3 sm:hidden">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shoes"
          className="tech-input w-full rounded-none px-4 py-2 text-sm outline-none"
        />
      </form>
    </header>
  );
}
