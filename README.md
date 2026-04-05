# ShoeSheet Store (Next.js + Google Sheets CMS)

Production-ready shoe eCommerce app using **Next.js App Router + Tailwind CSS** with **Google Sheets as backend CMS**.

## Features

- Category browsing: sports, casual, formal, sneakers
- Filters: price, category, size
- Search + pagination
- Product details with stock info
- Stock badges: `Out of Stock`, `Only X left`
- LocalStorage cart (update/remove)
- WhatsApp order integration with prefilled message
- Floating WhatsApp support button
- API route caching + revalidation every 60s
- Vercel-ready architecture

## Tech Stack

- Frontend: Next.js (App Router), Tailwind CSS
- Backend: Next.js API routes
- Data source: Google Sheets (CSV or Sheets API)
- Deployment: Vercel

## 1. Local Setup

```bash
npm install
```

Copy env:

```bash
cp .env.example .env.local
```

Fill `.env.local` and run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## 2. Google Sheets Setup

Create sheet columns exactly in row 1:

- `id`
- `name`
- `description`
- `price`
- `category`
- `sizes` (comma separated, e.g. `7,8,9,10`)
- `image_url`
- `stock`
- `in_stock` (`TRUE` or `FALSE`)

### Option A: Public CSV (simplest)

1. Publish or share sheet as public read.
2. Use CSV URL format:
   `https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv&gid=0`
3. Set `GOOGLE_SHEETS_CSV_URL` in `.env.local`.

### Option B: Google Sheets API

1. Create Google Cloud project and enable Sheets API.
2. Create API key (restrict it in production).
3. Set:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SHEETS_API_KEY`
   - `GOOGLE_SHEET_RANGE` (default `Products!A:I`)

## 3. Inventory Management via Sheet

- Update stock in sheet and site auto-refreshes.
- Add rows in sheet and products appear automatically.
- Set `stock=0` or `in_stock=FALSE` to disable ordering.

## 4. API Endpoints

- `GET /api/products`
  - Query params: `search`, `category`, `size`, `minPrice`, `maxPrice`, `page`, `limit`
- `GET /api/products/:id`

Both use revalidation/cached source data (60s).

## 5. WhatsApp Order Message Format

Product page sends:

```text
Hi, I want to order:
Product: {name}
Size: {size}
Quantity: {qty}
Total: ₹{price}
```

Cart page sends all line items + grand total.

## 6. Deployment (Vercel)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example`.
4. Deploy.

No separate backend service required.

## Folder Structure (high-level)

- `src/app` - pages + API routes
- `src/components` - reusable UI
- `src/hooks` - cart state
- `src/lib/services` - Google Sheets fetching/parsing
- `src/types` - shared types
