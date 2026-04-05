'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

export default function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const defaultSize = product.sizes[0] ?? null;
  const [size, setSize] = useState<number | null>(defaultSize);
  const [qty, setQty] = useState(1);

  const total = useMemo(() => product.price * qty, [product.price, qty]);

  const whatsappUrl = useMemo(() => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '911234567890';
    const sizeText = size ? size : 'N/A';
    const message = `Hi, I want to order:\nProduct: ${product.name}\nSize: ${sizeText}\nQuantity: ${qty}\nTotal: ₹${total}`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [product.name, qty, size, total]);

  const isAvailable = product.inStock && product.stock > 0 && size !== null;

  return (
    <div className="tech-card space-y-4 p-5">
      <p className="text-xs tracking-widest text-slate-400">CHECKOUT TERMINAL</p>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400">SIZE DIAL</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((item) => (
            <button
              key={item}
              onClick={() => setSize(item)}
              className={`border px-3 py-1.5 text-sm ${size === item ? 'bg-[var(--neon)] text-black border-[var(--neon)]' : 'border-[var(--line)] text-slate-200'}`}
            >
              UK {item}
            </button>
          ))}
          {!product.sizes.length && <span className="text-sm text-amber-300">No size data available</span>}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400">QUANTITY</p>
        <input
          type="number"
          min={1}
          max={Math.max(1, product.stock)}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Math.min(Number(e.target.value) || 1, product.stock || 1)))}
          className="tech-input w-24 rounded-none px-3 py-2"
        />
      </div>

      <p className="text-lg font-semibold text-slate-100">Total: <span style={{ color: 'var(--neon)' }}>₹{total}</span></p>

      <button
        disabled={!isAvailable}
        onClick={() => {
          if (size === null) {
            toast.error('No size available for this product');
            return;
          }
          addItem({ id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.price, size, quantity: qty, stock: product.stock });
          toast.success(`Added size UK ${size}`);
        }}
        className="tech-btn-primary w-full px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
      </button>

      <a
        href={isAvailable ? whatsappUrl : '#'}
        target="_blank"
        rel="noreferrer"
        aria-disabled={!isAvailable}
        className="block w-full border border-green-600 px-4 py-3 text-center text-sm font-semibold text-green-400 aria-disabled:pointer-events-none aria-disabled:opacity-40"
      >
        ORDER VIA WHATSAPP
      </a>
    </div>
  );
}
