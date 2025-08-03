import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const SUBSCRIPTION_PLANS = {
  single: {
    priceId: 'price_single_property', // Replace with actual Stripe price ID
    name: 'Single Property',
    price: 19,
    description: 'Unlimited leads for 1 property',
  },
  multi: {
    priceId: 'price_multi_property', // Replace with actual Stripe price ID
    name: '5 Properties',
    price: 59,
    description: 'Unlimited leads for up to 5 properties',
  },
};