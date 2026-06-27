import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Order } from '@/lib/types';

// 👉 EN REAL: pon RESEND_API_KEY en .env.local (consíguela en resend.com, gratis)
//    y RESEND_FROM con un email verificado de tu dominio, p.ej. "pedidos@modaadam.es".
//    Hasta verificar el dominio puedes usar "onboarding@resend.dev" para pruebas.

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sin API key ignoramos sin romper el flujo de compra.
    return NextResponse.json({ ok: false, reason: 'RESEND_API_KEY no configurado' });
  }

  const { order }: { order: Order } = await req.json();
  const FROM = process.env.RESEND_FROM ?? 'Moda Adam <onboarding@resend.dev>';

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to:   order.userEmail,
    subject: `✅ Pedido ${order.id} confirmado — Moda Adam`,
    html: emailHtml(order),
  });

  if (error) {
    console.error('[email-confirmacion]', error);
    return NextResponse.json({ ok: false, error }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}

// ─── Plantilla HTML del correo ────────────────────────────────────────────────
function eur(n: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

function emailHtml(order: Order): string {
  const filas = order.items.map((it) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #E8E1D5;font-size:14px;color:#1A1A1A">
        ${it.name}
        <span style="color:#6B6B6B;font-size:12px"> · ${it.color} · T.${it.size}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #E8E1D5;font-size:14px;color:#1A1A1A;text-align:right;white-space:nowrap">
        ${it.qty} uds · ${eur(it.price * it.qty)}
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:system-ui,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border:1px solid #E8E1D5">

        <!-- Cabecera -->
        <tr>
          <td style="background:#1A1A1A;padding:28px 36px">
            <p style="margin:0;color:#FAF8F5;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase">
              Moda Adam · Mayorista
            </p>
          </td>
        </tr>

        <!-- Título -->
        <tr>
          <td style="padding:36px 36px 24px">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6B6B6B">
              Confirmación de pedido
            </p>
            <h1 style="margin:0;font-size:28px;font-weight:900;color:#1A1A1A;line-height:1.1">
              ¡Pedido confirmado!
            </h1>
            <p style="margin:12px 0 0;font-size:15px;color:#6B6B6B">
              Hola <strong style="color:#1A1A1A">${order.userName}</strong>, hemos recibido tu pedido correctamente.
            </p>
          </td>
        </tr>

        <!-- Referencia -->
        <tr>
          <td style="padding:0 36px 24px">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;border:1px solid #E8E1D5">
              <tr>
                <td style="padding:16px 20px">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6B6B6B">Nº de pedido</p>
                  <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#1A1A1A">${order.id}</p>
                </td>
                <td style="padding:16px 20px;text-align:right">
                  <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6B6B6B">Total</p>
                  <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#1A1A1A">${eur(order.total)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Productos -->
        <tr>
          <td style="padding:0 36px 24px">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#6B6B6B">Detalle del pedido</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${filas}
              <tr>
                <td style="padding:14px 0 4px;font-size:13px;color:#6B6B6B">
                  ${order.units} unidades · Pago con tarjeta simulado
                </td>
                <td style="padding:14px 0 4px;font-size:16px;font-weight:900;color:#1A1A1A;text-align:right">
                  ${eur(order.total)}
                </td>
              </tr>
            </table>
            <p style="margin:4px 0 0;font-size:11px;color:#6B6B6B">IVA no incluido</p>
          </td>
        </tr>

        <!-- Próximos pasos -->
        <tr>
          <td style="padding:0 36px 32px">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1A1A1A;padding-top:20px">
              <tr><td style="padding-top:20px">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1A1A1A">¿Qué pasa ahora?</p>
                <p style="margin:0;font-size:13px;color:#6B6B6B;line-height:1.6">
                  Nuestro equipo revisará tu pedido y se pondrá en contacto contigo en las próximas horas para confirmar el envío. También puedes escribirnos por WhatsApp.
                </p>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Pie -->
        <tr>
          <td style="background:#F5F0E8;padding:20px 36px;border-top:1px solid #E8E1D5">
            <p style="margin:0;font-size:11px;color:#6B6B6B;line-height:1.6">
              <strong style="color:#1A1A1A">Moda Adam</strong> · Calle Teros, 30 — Polígono El Bosch, 03330 Crevillent (Alicante)<br>
              pedidos@modaadam.es · +34 955 146 737 · Lun–Vie 9:00–18:00
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
