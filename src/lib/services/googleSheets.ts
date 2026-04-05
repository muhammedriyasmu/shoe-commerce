import { Product } from '@/types';
import { CATEGORIES } from '@/lib/constants';

function toCsvUrl(url: string): string {
  const trimmed = url.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) return trimmed;

  const sheetId = match[1];

  try {
    const parsed = new URL(trimmed);
    const gid = parsed.searchParams.get('gid') || '0';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  } catch {
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
  }
}

function parseCsvLine(line: string): string[] {
  const output: string[] = [];
  let current = '';
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === ',' && !quoted) {
      output.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  output.push(current.trim());
  return output;
}

function csvToRows(csv: string): Record<string, string>[] {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx] || '';
      return acc;
    }, {} as Record<string, string>);
  });
}

function normalizeProduct(raw: Record<string, string>): Product | null {
  const category = raw.category?.toLowerCase() as Product['category'];
  if (!CATEGORIES.includes(category)) return null;

  const stock = Number(raw.stock || '0');
  const inStockFlag = (raw.in_stock || '').toLowerCase() === 'true';

  return {
    id: raw.id || crypto.randomUUID(),
    name: raw.name || 'Unnamed Product',
    description: raw.description || '',
    price: Number(raw.price || 0),
    category,
    sizes: (raw.sizes || '')
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n) && n > 0),
    imageUrl: raw.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
    stock,
    inStock: inStockFlag && stock > 0,
  };
}

async function fetchFromCsv(csvUrl: string): Promise<Product[]> {
  const normalizedUrl = toCsvUrl(csvUrl);
  const res = await fetch(normalizedUrl, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch Google Sheets CSV.');

  const csv = await res.text();
  const low = csv.trim().toLowerCase();
  if (low.startsWith('<!doctype html') || low.startsWith('<html')) {
    throw new Error('Google Sheet is not publicly readable. Share as Anyone with the link (Viewer).');
  }

  return csvToRows(csv).map(normalizeProduct).filter((x): x is Product => Boolean(x));
}

async function fetchFromSheetsApi(sheetId: string, range: string, apiKey: string): Promise<Product[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch Google Sheets API data.');

  const data = await res.json();
  const values: string[][] = data.values || [];
  if (values.length < 2) return [];

  const headers = values[0].map((h) => h.toLowerCase());
  return values
    .slice(1)
    .map((row) => {
      const mapped: Record<string, string> = {};
      headers.forEach((header, idx) => {
        mapped[header] = row[idx] || '';
      });
      return normalizeProduct(mapped);
    })
    .filter((x): x is Product => Boolean(x));
}

export async function getAllProducts(): Promise<Product[]> {
  const csvUrl = process.env.GOOGLE_SHEETS_CSV_URL;
  if (csvUrl) return fetchFromCsv(csvUrl);

  const sheetId = process.env.GOOGLE_SHEET_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  const range = process.env.GOOGLE_SHEET_RANGE || 'Products!A:I';

  if (!sheetId || !apiKey) return [];

  return fetchFromSheetsApi(sheetId, range, apiKey);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}
