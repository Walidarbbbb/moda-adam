import type { CartItem, Order } from './types';
import { WHATSAPP_NUMBER } from './constants';

// ============================================================================
//  UTILIDADES PEQUEÑAS
// ============================================================================

// Formatea un número como euros en español: 12.9 -> "12,90 €"
export const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

// Convierte un texto en un "slug" apto para identificadores/URLs:
// "Azul Marino" -> "azul-marino"
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')                  // separa los acentos de las letras
    .replace(/[̀-ͯ]/g, '')   // y los elimina (rango Unicode de acentos)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Suma total de unidades de un carrito.
export const totalUnits = (items: CartItem[]) =>
  items.reduce((acc, it) => acc + it.qty, 0);

// Importe total de un carrito (precio × cantidad).
export const totalPrice = (items: CartItem[]) =>
  items.reduce((acc, it) => acc + it.price * it.qty, 0);

// Construye el enlace de WhatsApp (https://wa.me/...) con el resumen del pedido
// ya escrito. Al pulsarlo, se abre WhatsApp con el mensaje preparado.
//
// 👉 EN REAL: además de este enlace manual, se podría avisar automáticamente al
//    negocio con la API de WhatsApp Business (mensajes automáticos sin abrir el chat).
export const whatsappLink = (order: Order) => {
  const lineas = order.items.map(
    (it) => `• ${it.qty}x ${it.name} (${it.color}, talla ${it.size}) — ${eur(it.price * it.qty)}`,
  );
  const mensaje = [
    `*Nuevo pedido ${order.id}* — Moda Adam`,
    `Cliente: ${order.userName} (${order.userEmail})`,
    '',
    ...lineas,
    '',
    `Unidades: ${order.units}`,
    `Total: ${eur(order.total)} (IVA no incluido)`,
  ].join('\n');

  // encodeURIComponent convierte el texto en algo que cabe en una URL.
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
};

// Fecha legible en español: "24 jun 2026, 14:30"
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
