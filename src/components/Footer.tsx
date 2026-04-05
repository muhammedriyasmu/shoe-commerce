import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t py-8 text-sm" style={{ borderColor: 'var(--line)', background: '#0b0d12', color: 'var(--muted)' }}>
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} ShoeSheet // Performance Catalog</p>
        <div className="flex items-center gap-4">
          <Link href="/products" className="hover:text-[var(--neon)]">
            Vault
          </Link>
          <Link href="/cart" className="hover:text-[var(--neon)]">
            Cart
          </Link>
        </div>
      </div>
    </footer>
  );
}
