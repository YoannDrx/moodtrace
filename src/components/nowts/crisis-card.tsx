import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Typography } from "./typography";

export type CrisisCardProps = {
  /** Name of the crisis resource */
  title: string;
  /** Phone number to call */
  phone: string;
  /** Availability (e.g., "24h/24", "9h-23h") */
  available: string;
  /** Additional description */
  description?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * CrisisCard Component
 *
 * Displays a crisis resource with contact information.
 * Used in the Crisis Resources section of the landing page.
 *
 * @example
 * ```tsx
 * <CrisisCard
 *   title="SOS Amitie"
 *   phone="09 72 39 40 50"
 *   available="24h/24"
 * />
 * ```
 */
export function CrisisCard({
  title,
  phone,
  available,
  description,
  className,
}: CrisisCardProps) {
  return (
    <Card
      className={cn(
        "border-destructive/20 hover:border-destructive/40 transition-colors",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <Phone className="text-destructive size-6" />
        </div>
        <div className="space-y-1">
          <Typography variant="h5" className="text-foreground">
            {title}
          </Typography>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-destructive block text-xl font-bold hover:underline"
          >
            {phone}
          </a>
          <Typography variant="caption" className="text-muted-foreground">
            {available}
          </Typography>
          {description && (
            <Typography variant="muted" className="mt-2">
              {description}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * CrisisResourcesGrid Component
 *
 * Pre-configured grid of French crisis resources.
 *
 * @example
 * ```tsx
 * <CrisisResourcesGrid />
 * ```
 */
export function CrisisResourcesGrid({ className }: { className?: string }) {
  const resources: CrisisCardProps[] = [
    {
      title: "SOS Amitie",
      phone: "09 72 39 40 50",
      available: "24h/24, 7j/7",
      description: "Ecoute et soutien",
    },
    {
      title: "Fil Sante Jeunes",
      phone: "0 800 235 236",
      available: "9h-23h",
      description: "Gratuit et anonyme",
    },
    {
      title: "Urgences",
      phone: "15",
      available: "24h/24, 7j/7",
      description: "SAMU",
    },
  ];

  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {resources.map((resource) => (
        <CrisisCard key={resource.phone} {...resource} />
      ))}
    </div>
  );
}

/**
 * CrisisDisclaimer Component
 *
 * Medical disclaimer for YMYL compliance.
 *
 * @example
 * ```tsx
 * <CrisisDisclaimer />
 * ```
 */
export function CrisisDisclaimer({ className }: { className?: string }) {
  return (
    <Typography
      variant="muted"
      className={cn("mx-auto max-w-2xl text-center", className)}
    >
      MoodTrace est un outil de suivi et ne remplace pas un avis medical
      professionnel. En cas de crise ou de pensees suicidaires, contactez
      immediatement les services d&apos;urgence ou une ligne d&apos;ecoute.
    </Typography>
  );
}
