"use client";

import { Typography } from "@/components/nowts/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { SectionLayout } from "../section-layout";

export type CTASectionCardProps = {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
};

export function CTASectionCard({
  title = "Pret a mieux comprendre votre sante mentale ?",
  description = "Commencez gratuitement et decouvrez comment MoodTrace peut vous aider.",
  ctaText = "Commencer maintenant",
  ctaHref = "/signin",
  secondaryCtaText,
  secondaryCtaHref,
}: CTASectionCardProps) {
  return (
    <SectionLayout>
      <Card className="bg-primary/5 border-primary/20 relative isolate overflow-hidden py-16 text-center shadow-lg lg:rounded-3xl lg:py-24">
        <Typography
          as="h2"
          className="text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {title}
        </Typography>
        <Typography className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg/8 text-pretty">
          {description}
        </Typography>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link href={ctaHref} className={buttonVariants({ size: "lg" })}>
            {ctaText}
          </Link>

          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              {secondaryCtaText}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
      </Card>
    </SectionLayout>
  );
}
