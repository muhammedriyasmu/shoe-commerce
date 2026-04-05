'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloating() {
  const pathname = usePathname();

  const link = useMemo(() => {
    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '911234567890';
    const message = encodeURIComponent(`Hi, I need help with your shoe store. I am currently on: ${pathname}`);
    return `https://wa.me/${number}?text=${message}`;
  }, [pathname]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 border border-green-700 bg-green-500 px-4 py-3 text-sm font-black text-black shadow-lg"
    >
      WHATSAPP SUPPORT
    </a>
  );
}
