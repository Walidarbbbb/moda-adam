import Link from 'next/link';

// Página que se muestra cuando una dirección no existe (error 404).
export default function NotFound() {
  return (
    <div className="wrap py-28 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Página no encontrada</h1>
      <p className="mt-3 text-muted">La dirección que buscas no existe o se ha movido.</p>
      <div className="mt-7 flex justify-center gap-3">
        <Link href="/" className="btn-ink">Ir al inicio</Link>
        <Link href="/catalogo/camisetas" className="btn-outline">Ver catálogo</Link>
      </div>
    </div>
  );
}
