import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, BarChart3 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 md:pt-40">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/50 to-transparent" />

      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Shield className="h-4 w-4" />
            <span>Application non médicale · Données privées</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-slide-up">
            Suivez votre humeur,{" "}
            <span className="text-primary">préparez vos consultations</span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
            MoodJournal vous aide à organiser vos observations quotidiennes
            pour mieux communiquer avec votre psychiatre ou psychologue.
            Simple, respectueux, sans jugement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/space/demo">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a href="#features">
                En savoir plus
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Conçu avec bienveillance</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Données sécurisées</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Rapports pour votre psy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
