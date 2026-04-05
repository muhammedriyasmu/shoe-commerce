import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { getAllProducts } from '@/lib/services/googleSheets';

export const revalidate = 60;

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const search = String(sp.search || '').toLowerCase().trim();
  const category = String(sp.category || '').toLowerCase();
  const size = Number(sp.size || 0);
  const minPrice = Number(sp.minPrice || 0);
  const maxPrice = Number(sp.maxPrice || 0);
  const page = Math.max(1, Number(sp.page || 1));
  const limit = Math.max(1, Number(sp.limit || DEFAULT_PAGE_SIZE));

  const all = await getAllProducts();
  const filtered = all.filter((item) => {
    const searchOk = !search || item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
    const categoryOk = !category || category === 'all' || item.category === category;
    const sizeOk = !size || item.sizes.includes(size);
    const minOk = !minPrice || item.price >= minPrice;
    const maxOk = !maxPrice || item.price <= maxPrice;
    return searchOk && categoryOk && sizeOk && minOk && maxOk;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const items = filtered.slice((page - 1) * limit, (page - 1) * limit + limit);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
      <ProductFilters />
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-100">Product Vault</h1>
          <p className="text-sm text-slate-400">{total} records</p>
        </div>

        {items.length === 0 ? (
          <div className="tech-card p-8 text-slate-400">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          query={{
            search: search || undefined,
            category: category || undefined,
            size: size ? String(size) : undefined,
            minPrice: minPrice ? String(minPrice) : undefined,
            maxPrice: maxPrice ? String(maxPrice) : undefined,
            limit: String(limit),
          }}
        />
      </section>
    </div>
  );
}
