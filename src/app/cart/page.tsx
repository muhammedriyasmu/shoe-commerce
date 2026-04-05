'use client';

import Link from 'next/link';
import CartWhatsAppButton from '@/components/cart/CartWhatsAppButton';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, updateQty, removeItem, totalAmount, clear } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="tech-card p-8 text-center">
          <p className="mb-4 text-slate-400">Your cart is empty.</p>
          <Link href="/products" className="tech-btn-primary px-4 py-2 text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-5 text-2xl font-bold text-slate-100">Current Payload</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="tech-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <img src={item.imageUrl} alt={item.name} className="h-24 w-24 border object-cover" style={{ borderColor: 'var(--line)' }} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-100">{item.name}</p>
              <p className="text-sm text-slate-400">Size: UK {item.size}</p>
              <p className="text-sm text-slate-400">₹{item.price} each</p>
            </div>
            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQty(item.id, item.size, Number(e.target.value) || 1)}
              className="tech-input w-20 rounded-none px-2 py-1"
            />
            <button onClick={() => removeItem(item.id, item.size)} className="border border-rose-700 px-3 py-2 text-sm text-rose-400">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-lg font-semibold text-slate-100">Total: <span style={{ color: 'var(--neon)' }}>₹{totalAmount}</span></p>
        <CartWhatsAppButton />
        <button onClick={clear} className="tech-btn px-4 py-2 text-sm font-semibold">
          Clear Cart
        </button>
      </div>
    </div>
  );
}
