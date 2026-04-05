'use client';

import { useMemo } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CartWhatsAppButton() {
  const { items, totalAmount } = useCart();

  const href = useMemo(() => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '911234567890';
    const lines = ['Hi, I want to order:'];
    items.forEach((item, i) => {
      lines.push(`${i + 1}. Product: ${item.name} | Size: ${item.size} | Quantity: ${item.quantity} | Total: ₹${item.price * item.quantity}`);
    });
    lines.push(`Grand Total: ₹${totalAmount}`);
    return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [items, totalAmount]);

  return (
    <a
      href={items.length ? href : '#'}
      target="_blank"
      rel="noreferrer"
      aria-disabled={!items.length}
      className="border border-green-600 px-4 py-2 text-sm font-semibold text-green-400 aria-disabled:pointer-events-none aria-disabled:opacity-40"
    >
      ORDER CART ON WHATSAPP
    </a>
  );
}
