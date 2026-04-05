export default function ProductsUnavailable({ message }: { message: string }) {
  return (
    <div className="tech-card border border-rose-500/40 bg-rose-950/20 p-6 text-sm text-rose-100">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">
        Product feed unavailable
      </p>
      <p className="leading-6">{message}</p>
    </div>
  );
}
