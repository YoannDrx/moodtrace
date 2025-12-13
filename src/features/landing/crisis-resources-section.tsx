import { Typography } from "@/components/nowts/typography";
import {
  CrisisDisclaimer,
  CrisisResourcesGrid,
} from "@/components/nowts/crisis-card";
import { SectionLayout } from "./section-layout";
import { HeartHandshake } from "lucide-react";

/**
 * CrisisResourcesSection Component
 *
 * YMYL (Your Money or Your Life) compliant section displaying crisis resources.
 * Required for mental health applications to provide immediate help resources.
 */
export function CrisisResourcesSection() {
  return (
    <SectionLayout
      variant="card"
      className="border-destructive/20 bg-destructive/5 border-t"
    >
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <div className="bg-destructive/10 mx-auto flex size-16 items-center justify-center rounded-full">
            <HeartHandshake className="text-destructive size-8" />
          </div>
          <Typography variant="h2" className="text-foreground">
            Besoin d&apos;aide immediate ?
          </Typography>
          <Typography
            variant="lead"
            className="text-muted-foreground mx-auto max-w-2xl"
          >
            Si vous etes en situation de crise ou avez des pensees suicidaires,
            contactez immediatement l&apos;un de ces services d&apos;aide.
          </Typography>
        </div>

        <CrisisResourcesGrid className="mx-auto max-w-4xl" />

        <CrisisDisclaimer className="mt-8" />
      </div>
    </SectionLayout>
  );
}
