import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { getAllProducts } from '@/lib/services/googleSheets';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const all = await getAllProducts();
    const { searchParams } = new URL(request.url);

    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const category = (searchParams.get('category') || '').toLowerCase();
    const size = Number(searchParams.get('size') || '0');
    const minPrice = Number(searchParams.get('minPrice') || '0');
    const maxPrice = Number(searchParams.get('maxPrice') || '0');
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const limit = Math.max(1, Number(searchParams.get('limit') || DEFAULT_PAGE_SIZE));

    const filtered = all.filter((item) => {
      const searchOk =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search);
      const categoryOk = !category || category === 'all' || item.category === category;
      const sizeOk = !size || item.sizes.includes(size);
      const minOk = !minPrice || item.price >= minPrice;
      const maxOk = !maxPrice || item.price <= maxPrice;
      return searchOk && categoryOk && sizeOk && minOk && maxOk;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return NextResponse.json({ items, page, limit, total, totalPages });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch products.' },
      { status: 500 }
    );
  }
}
