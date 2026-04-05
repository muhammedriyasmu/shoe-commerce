import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/services/googleSheets';

export const revalidate = 60;

export default async function HomePage() {
  const products = (await getAllProducts()).slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10">
      <section className="tech-card mb-10 grid gap-6 p-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-2 text-xs tracking-widest text-slate-400">SYSTEM ONLINE // GOOGLE SHEETS LINKED</p>
          <h1 className="mb-3 text-3xl font-black uppercase tracking-wide text-slate-100 sm:text-5xl">
            Performance Tech Footwear
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Discover engineered shoes by category, drill into specs, and deploy orders via WhatsApp in seconds.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="tech-btn-primary inline-block px-5 py-3 text-sm">
              Enter The Vault
            </Link>
            <Link href="/products?category=sports" className="tech-btn inline-block px-5 py-3 text-sm font-semibold">
              Sports Feed
            </Link>
          </div>
        </div>

        <div className="relative min-h-[260px] lg:min-h-[300px]">
          <div className="floating absolute inset-6 border border-[var(--line)] bg-[#0d0f15] p-4">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400"
              alt="Flagship shoe"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute left-0 top-4 flex items-center gap-2 text-xs text-slate-300">
            <span className="hud-dot" />
            <span>PROPULSION +14%</span>
            <span className="hud-line" style={{ left: '120px', top: '8px' }} />
          </div>

          <div className="absolute bottom-6 right-0 flex items-center gap-2 text-xs text-slate-300">
            <span className="hud-line" style={{ right: '130px', top: '8px' }} />
            <span>WEIGHT 210g</span>
            <span className="hud-dot" />
          </div>
        </div>
      </section>

      <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {['sports', 'casual', 'formal', 'sneakers'].map((c) => (
          <Link key={c} href={`/products?category=${c}`} className="tech-card px-4 py-5 text-center text-sm font-semibold capitalize text-slate-100 tech-glow">
            {c}
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Latest Drops</h2>
          <Link href="/products" className="text-sm font-semibold" style={{ color: 'var(--neon)' }}>
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
