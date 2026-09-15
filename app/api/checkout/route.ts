import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_development', {
  apiVersion: '2026-07-29.dahlia' as any,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, title, reservationId, customerEmail } = body;

    // Convert amount to cents (e.g., 150 EUR -> 15000 cents)
    const unitAmount = Math.round((parseFloat(amount) || 100) * 100);

    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: title || 'Réservation Cap-Aventure',
              description: `Réservation #${reservationId || 'DEV-101'} sur Cap-Aventure`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      success_url: `${origin}/reservation?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reservation?canceled=true`,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session de paiement' },
      { status: 500 }
    );
  }
}
