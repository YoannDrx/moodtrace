import { Typography } from "@/components/nowts/typography";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { SectionLayout } from "../section-layout";

export type CtaSectionProps = {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
};

export function CtaSection({
  title = "Commencez votre suivi des aujourd'hui",
  description = "Rejoignez les utilisateurs qui prennent en main leur sante mentale.",
  ctaText = "Creer mon compte gratuit",
  ctaHref = "/signin",
}: CtaSectionProps) {
  return (
    <SectionLayout className="lg:flex lg:items-center lg:justify-between lg:px-8">
      <Typography variant="h3">
        <Typography variant="h2" as="span">
          {title}
        </Typography>
        <br />
        <span className="text-muted-foreground">{description}</span>
      </Typography>
      <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
        <Link className={buttonVariants({ size: "lg" })} href={ctaHref}>
          {ctaText}
        </Link>
      </div>
    </SectionLayout>
  );
}
