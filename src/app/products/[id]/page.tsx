import { notFound } from 'next/navigation';
import ProductDetailActions from '@/components/ProductDetailActions';
import { STOCK_LOW_THRESHOLD } from '@/lib/constants';
import { getProductById } from '@/lib/services/googleSheets';

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return notFound();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <section className="tech-card p-5">
        <div className="relative">
          <img src={product.imageUrl} alt={product.name} className="mb-5 h-[360px] w-full border object-cover" style={{ borderColor: 'var(--line)' }} />
          <div className="absolute right-3 top-3 border border-[var(--line)] bg-black/50 px-2 py-1 text-[10px] tracking-widest text-slate-300">
            LIVE SPEC FEED
          </div>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="border px-3 py-1 text-xs font-medium capitalize text-slate-300" style={{ borderColor: 'var(--line)' }}>
            {product.category}
          </span>
          {!product.inStock ? (
            <span className="border px-3 py-1 text-xs font-medium text-rose-400" style={{ borderColor: '#5a2432' }}>Out of Stock</span>
          ) : product.stock <= STOCK_LOW_THRESHOLD ? (
            <span className="border px-3 py-1 text-xs font-medium text-amber-300" style={{ borderColor: '#5b4a1b' }}>Only {product.stock} left</span>
          ) : null}
        </div>
        <h1 className="mb-2 text-3xl font-black uppercase tracking-wide text-slate-100">{product.name}</h1>
        <p className="mb-3 text-2xl font-semibold" style={{ color: 'var(--neon)' }}>₹{product.price}</p>
        <p className="leading-7 text-slate-300">{product.description}</p>
      </section>

      <ProductDetailActions product={product} />
    </div>
  );
}
