import { redirect } from 'next/navigation';

// Si alguien entra en /catalogo sin sección, le llevamos a Camisetas.
export default function CatalogoIndex() {
  redirect('/catalogo/camisetas');
}
