import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import WhatsAppFloating from '@/components/WhatsAppFloating';

export const metadata: Metadata = {
  title: 'ShoeSheet Store',
  description: 'Performance tech eCommerce using Google Sheets as CMS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Suspense fallback={<div className="h-[73px] border-b" style={{ borderColor: 'var(--line)', background: '#0b0d12' }} />}>
            <Navbar />
          </Suspense>
          <main className="min-h-[calc(100vh-140px)]">{children}</main>
          <Footer />
          <WhatsAppFloating />
        </Providers>
      </body>
    </html>
  );
}
