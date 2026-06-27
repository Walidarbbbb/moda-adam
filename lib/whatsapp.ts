import type { Order, OrderDetail } from '@/types';

const WA_TOKEN   = process.env.WHATSAPP_TOKEN   ?? '';
const WA_PHONE   = process.env.WHATSAPP_PHONE_ID ?? '';   // ID del número de empresa
const OWNER_PHONE = process.env.WHATSAPP_OWNER_NUMBER ?? '34600000000';

// 👉 EN REAL: los template_name deben coincidir con las plantillas aprobadas
//    en Meta Business Suite → WhatsApp → Message Templates.
const TEMPLATES = {
  pedido_confirmado:  'pedido_confirmado',
  pedido_preparacion: 'pedido_preparacion',
  pedido_enviado:     'pedido_enviado',
} as const;

type TemplateName = keyof typeof TEMPLATES;

interface SendTemplateOptions {
  to: string;         // número de destino: "34611223344"
  template: TemplateName;
  components?: object[];
}

/** Envía un mensaje de plantilla por la Cloud API de WhatsApp. */
export async function sendWhatsAppTemplate({ to, template, components = [] }: SendTemplateOptions) {
  if (!WA_TOKEN || !WA_PHONE) {
    console.warn('[WhatsApp] Variables de entorno no configuradas. Mensaje omitido.');
    return null;
  }

  const res = await fetch(
    `https://graph.facebook.com/v21.0/${WA_PHONE}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WA_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: TEMPLATES[template],
          language: { code: 'es_ES' },
          components,
        },
      }),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    console.error('[WhatsApp] Error:', err);
    return null;
  }
  return res.json();
}

/** Avisa al cliente y al dueño cuando se crea un pedido. */
export async function notifyPedidoConfirmado(order: Order, detalles: OrderDetail[], clientePhone: string) {
  const resumen = detalles
    .map((d) => `• ${d.cantidad}x ${d.products?.nombre ?? d.producto_id}`)
    .join('\n');

  const bodyComponents = [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: order.id },
        { type: 'text', text: `${order.total.toFixed(2)} €` },
        { type: 'text', text: resumen },
      ],
    },
  ];

  // Avisa al cliente
  await sendWhatsAppTemplate({ to: clientePhone, template: 'pedido_confirmado', components: bodyComponents });
  // Avisa al dueño del negocio
  await sendWhatsAppTemplate({ to: OWNER_PHONE, template: 'pedido_confirmado', components: bodyComponents });
}

/** Avisa al cliente que su pedido está en preparación. */
export async function notifyPedidoPreparacion(order: Order, clientePhone: string) {
  await sendWhatsAppTemplate({
    to: clientePhone,
    template: 'pedido_preparacion',
    components: [{ type: 'body', parameters: [{ type: 'text', text: order.id }] }],
  });
}

/** Avisa al cliente que su pedido ha sido enviado. */
export async function notifyPedidoEnviado(order: Order, clientePhone: string, trackingUrl?: string) {
  await sendWhatsAppTemplate({
    to: clientePhone,
    template: 'pedido_enviado',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: order.id },
          { type: 'text', text: trackingUrl ?? 'Sin seguimiento' },
        ],
      },
    ],
  });
}
