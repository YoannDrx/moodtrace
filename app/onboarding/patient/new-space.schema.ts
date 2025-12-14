import { RESERVED_SLUGS } from "@/lib/organizations/reserved-slugs";
import { z } from "zod";

export const CreateSpaceSchema = z.object({
  slug: z
    .string()
    .min(3, "L'identifiant doit contenir au moins 3 caractères")
    .max(50, "L'identifiant ne peut pas dépasser 50 caractères")
    .refine((v) => !RESERVED_SLUGS.includes(v), {
      message: "Cet identifiant est réservé",
    }),
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
});

export type CreateSpaceSchemaType = z.infer<typeof CreateSpaceSchema>;
