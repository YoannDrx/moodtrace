import { RESERVED_SLUGS } from "@/lib/organizations/reserved-slugs";
import { z } from "zod";

/**
 * Schéma pour les détails de l'espace
 */
export const SpaceDetailsFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  logo: z.string().nullable().optional(),
});

/**
 * Schéma pour la zone danger (modification du slug)
 */
export const SpaceDangerFormSchema = z.object({
  slug: z.string().refine((v) => !RESERVED_SLUGS.includes(v), {
    message: "Cet identifiant est réservé",
  }),
});

export type SpaceDetailsFormSchemaType = z.infer<typeof SpaceDetailsFormSchema>;
export type SpaceDangerFormSchemaType = z.infer<typeof SpaceDangerFormSchema>;
