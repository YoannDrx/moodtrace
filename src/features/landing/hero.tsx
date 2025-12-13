import { buttonVariants } from "@/components/ui/button";
import { Typography } from "@/components/nowts/typography";
import { MoodTraceLogo } from "@/components/svg/moodtrace-logo";
import { ArrowRight, Heart, LineChart, Pill } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="relative isolate flex flex-col">
      <GridBackground />
      <GradientBackground />
      <main className="relative py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-8 flex justify-center">
              <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
                <Heart className="size-4" />
                Medication-aware mood tracker
              </span>
            </div>

            {/* Title */}
            <Typography
              variant="display"
              className="text-foreground text-balance"
            >
              Suivez votre humeur,{" "}
              <span className="text-primary">optimisez votre traitement</span>
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="lead"
              className="mx-auto mt-8 max-w-2xl text-pretty"
            >
              MoodTrace vous aide a comprendre l&apos;impact de vos medicaments
              sur votre bien-etre quotidien. Partagez des donnees objectives
              avec votre medecin pour optimiser votre parcours de soins.
            </Typography>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/signin"
                className={buttonVariants({ size: "lg", variant: "default" })}
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 size-4" />
              </Link>
              <Link
                href="#features"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Decouvrir les fonctionnalites
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <FeaturePill icon={Heart} label="Suivi d'humeur quotidien" />
              <FeaturePill icon={Pill} label="Gestion des medicaments" />
              <FeaturePill icon={LineChart} label="Correlations & insights" />
            </div>
          </div>

          {/* App Screenshot/Illustration */}
          <div className="mt-16 sm:mt-24">
            <div className="relative mx-auto max-w-4xl">
              {/* Placeholder for app mockup */}
              <div className="bg-card relative overflow-hidden rounded-xl border shadow-2xl">
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-b to-transparent" />
                <div className="p-8">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <MoodTraceLogo size="sm" />
                      <span className="text-muted-foreground text-sm">
                        Aujourd&apos;hui
                      </span>
                    </div>

                    {/* Mood Card Preview */}
                    <div className="bg-background rounded-lg border p-6">
                      <Typography variant="h4" className="mb-4">
                        Comment vous sentez-vous ?
                      </Typography>
                      <div className="flex items-center justify-between gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
                          <div
                            key={mood}
                            className={`flex size-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                              mood === 7
                                ? "bg-mood-7 ring-mood-7/50 text-white shadow-lg ring-2"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {mood}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="grid grid-cols-3 gap-4">
                      <StatPreview
                        label="Humeur moyenne"
                        value="7.2"
                        trend="+0.4"
                      />
                      <StatPreview label="Adherence" value="94%" trend="+2%" />
                      <StatPreview label="Jours suivis" value="23" trend="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <span className="bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm">
      <Icon className="text-primary size-4" />
      {label}
    </span>
  );
}

function StatPreview({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-background rounded-lg border p-4">
      <Typography variant="caption" className="text-muted-foreground">
        {label}
      </Typography>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {trend && (
          <span className="text-secondary text-sm font-medium">{trend}</span>
        )}
      </div>
    </div>
  );
}

const GridBackground = () => {
  return (
    <div className="bg-grid absolute inset-0 [mask-image:linear-gradient(180deg,transparent,var(--foreground),transparent)]" />
  );
};

const GradientBackground = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="bg-primary/20 relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="bg-secondary/20 relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </>
  );
};
