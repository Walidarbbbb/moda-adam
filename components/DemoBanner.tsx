// Barra fina superior que deja claro que es una web de demostración.
export default function DemoBanner() {
  return (
    <div className="bg-ink text-bone">
      <div className="wrap flex items-center justify-center gap-2 py-1.5 text-center text-[11px] sm:text-xs">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-clay-light" />
        <span className="font-medium tracking-wide">
          Versión de demostración · Los pagos son simulados, no se cobra nada
        </span>
      </div>
    </div>
  );
}
