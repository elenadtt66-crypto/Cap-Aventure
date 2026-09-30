import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, title, reservationId, customerEmail } = body;

    // Convert amount to cents (e.g., 150 EUR -> 15000 cents)
    const unitAmount = Math.round((parseFloat(amount) || 100) * 100);
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'https://cap-aventures.fr';

    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
      return NextResponse.json(
        {
          hasStripe: false,
          error: 'Clé secrète Stripe (STRIPE_SECRET_KEY) non configurée dans les variables d\'environnement du serveur.',
        },
        { status: 400 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: title || 'Réservation Véhicule Cap-Aventure',
              description: reservationId ? `Dossier de réservation #${reservationId}` : 'Location de van & camping-car Cap-Aventure',
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      metadata: {
        reservationId: reservationId || '',
      },
      success_url: `${origin}/reservation?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/reservation?canceled=true`,
    });

    return NextResponse.json({ hasStripe: true, url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { 
        hasStripe: false, 
        error: error.message || 'Erreur lors de l\'initialisation du paiement Stripe Checkout' 
      },
      { status: 500 }
    );
  }
}
