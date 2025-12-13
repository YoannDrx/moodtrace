import Stripe from "stripe";
import { env } from "./env";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  : null;

/**
 * Retourne le client Stripe ou throw une erreur si non configuré.
 * Utiliser cette fonction dans les contextes où Stripe est requis.
 */
export function getStripeOrThrow(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.",
    );
  }
  return stripe;
}
