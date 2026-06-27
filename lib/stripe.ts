import Stripe from 'stripe';

// 👉 EN REAL: STRIPE_SECRET_KEY en variables de entorno de Vercel
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2026-06-24.dahlia',
});

export const STRIPE_CURRENCY = 'eur';

/** Crea una sesión de pago de Stripe y devuelve la URL de redirección. */
export async function createCheckoutSession({
  orderId,
  lineItems,
  customerEmail,
  successUrl,
  cancelUrl,
}: {
  orderId: string;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: STRIPE_CURRENCY,
    customer_email: customerEmail,
    line_items: lineItems,
    metadata: { orderId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return session;
}
