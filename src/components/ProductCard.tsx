'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { STOCK_LOW_THRESHOLD } from '@/lib/constants';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<number | null>(product.sizes[0] ?? null);
  const canAdd = product.inStock && product.stock > 0 && selectedSize !== null;

  return (
    <article className="tech-card p-4 transition tech-glow">
      <Link href={`/products/${product.id}`}>
        <img src={product.imageUrl} alt={product.name} className="mb-3 h-52 w-full border object-cover" style={{ borderColor: 'var(--line)' }} />
      </Link>

      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="line-clamp-1 text-base font-semibold text-slate-100">{product.name}</h3>
        {!product.inStock ? (
          <span className="border px-2 py-1 text-xs font-medium text-rose-400" style={{ borderColor: '#5a2432' }}>OUT</span>
        ) : product.stock <= STOCK_LOW_THRESHOLD ? (
          <span className="border px-2 py-1 text-xs font-medium text-amber-300" style={{ borderColor: '#5b4a1b' }}>ONLY {product.stock}</span>
        ) : null}
      </div>

      <p className="line-clamp-2 text-sm" style={{ color: 'var(--muted)' }}>{product.description}</p>
      <p className="my-3 text-lg font-bold" style={{ color: 'var(--neon)' }}>₹{product.price}</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {product.sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(size)}
            className={`border px-2 py-1 text-xs ${
              selectedSize === size
                ? 'border-[var(--neon)] bg-[var(--neon)] text-black'
                : 'border-[var(--line)] text-slate-300'
            }`}
          >
            UK {size}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          disabled={!canAdd}
          onClick={() => {
            if (selectedSize === null) {
              toast.error('Select a size first');
              return;
            }
            addItem({
              id: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              size: selectedSize,
              quantity: 1,
              stock: product.stock,
            });
            toast.success(`Added size UK ${selectedSize}`);
          }}
          className="tech-btn-primary flex-1 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          {canAdd ? 'INITIATE' : 'UNAVAILABLE'}
        </button>
        <Link href={`/products/${product.id}`} className="tech-btn px-4 py-2 text-sm font-semibold">
          Spec
        </Link>
      </div>
    </article>
  );
}
