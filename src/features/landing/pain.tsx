"use client";

import { Typography } from "@/components/nowts/typography";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SectionLayout } from "./section-layout";

export const PainSection = () => {
  return (
    <SectionLayout
      variant="card"
      size="base"
      className="flex flex-col items-center justify-center gap-4"
    >
      <div className="flex w-full flex-col items-center gap-3 lg:gap-4 xl:gap-6">
        <Typography variant="h2" className="text-center">
          Le suivi de l&apos;humeur peut etre difficile...
        </Typography>
        <Typography
          variant="lead"
          className="text-muted-foreground text-center"
        >
          Entre les consultations, il est complique de communiquer objectivement
          avec son medecin
        </Typography>
        <div className="mt-4 flex items-start gap-6 max-lg:flex-col">
          <div className="bg-destructive/5 border-destructive/20 flex-1 rounded-xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <AlertCircle className="text-destructive size-6" />
              <Typography variant="h4" className="text-destructive">
                Sans MoodTrace
              </Typography>
            </div>
            <ul className="text-foreground/80 flex flex-col gap-3 text-base">
              <PainPoint text="Difficulte a se souvenir de son etat entre les consultations" />
              <PainPoint text="Impressions subjectives difficiles a communiquer" />
              <PainPoint text="Impossible de voir l'impact des changements de traitement" />
              <PainPoint text="L'entourage ne sait pas comment aider" />
              <PainPoint text="Pas de vision globale de son evolution" />
            </ul>
          </div>
          <div className="bg-secondary/5 border-secondary/20 flex-1 rounded-xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-secondary size-6" />
              <Typography variant="h4" className="text-secondary">
                Avec MoodTrace
              </Typography>
            </div>
            <ul className="text-foreground/80 flex flex-col gap-3 text-base">
              <SolutionPoint text="Donnees objectives sur 30 jours pour chaque consultation" />
              <SolutionPoint text="Rapports PDF clairs a partager avec votre medecin" />
              <SolutionPoint text="Correlations visibles entre medication et humeur" />
              <SolutionPoint text="Votre aidant peut ajouter ses observations" />
              <SolutionPoint text="Dashboard avec tendances et patterns" />
            </ul>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

function PainPoint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-destructive mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
      <span>{text}</span>
    </li>
  );
}

function SolutionPoint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="text-secondary mt-0.5 size-4 shrink-0" />
      <span>{text}</span>
    </li>
  );
}
