import Stripe from "stripe";
import { env } from "./env";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  : null;

/**
 * Returns the Stripe client or throws an error if not configured.
 * Use this function in contexts where Stripe is required.
 */
export function getStripeOrThrow(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable."
    );
  }
  return stripe;
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return stripe !== null;
}
