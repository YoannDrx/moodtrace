"use client";

import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { ClientMarkdown } from "@/features/markdown/client-markdown";
import {
  FileText,
  Heart,
  HeartHandshake,
  LineChart,
  Pill,
  Users,
} from "lucide-react";
import { SectionLayout } from "./section-layout";

type FeatureData = {
  badge: string;
  icon: React.ElementType;
  title: string;
  description: string;
};

const DEFAULT_FEATURES: FeatureData[] = [
  {
    badge: "Suivi quotidien",
    icon: Heart,
    title: "Enregistrez votre humeur en quelques secondes",
    description:
      "Notez votre humeur sur une echelle de 1 a 10, votre niveau d'energie et la qualite de votre sommeil. Ajoutez des notes personnelles pour capturer le contexte de votre journee.",
  },
  {
    badge: "Medicaments",
    icon: Pill,
    title: "Gerez vos traitements et leur adherence",
    description:
      "Suivez vos medicaments, leurs dosages et l'historique des changements. MoodTrace vous aide a maintenir une adherence constante a votre traitement.",
  },
  {
    badge: "Insights",
    icon: LineChart,
    title: "Decouvrez les correlations",
    description:
      "Visualisez les tendances sur 7 ou 30 jours. Identifiez les liens entre vos medicaments, votre sommeil et votre humeur pour mieux comprendre ce qui vous aide.",
  },
  {
    badge: "Aidant",
    icon: Users,
    title: "Impliquez vos proches",
    description:
      "Permettez a un aidant de confiance d'ajouter ses observations. Une vision externe peut reveler des patterns que vous ne percevez pas vous-meme.",
  },
  {
    badge: "Export",
    icon: FileText,
    title: "Partagez avec votre medecin",
    description:
      "Generez des rapports PDF structures pour vos consultations. Facilitez la communication avec votre equipe medicale grace a des donnees objectives.",
  },
  {
    badge: "Ressources",
    icon: HeartHandshake,
    title: "Acces rapide en cas de crise",
    description:
      "Des ressources d'aide sont toujours accessibles. MoodTrace vous accompagne dans les moments difficiles avec des numeros d'urgence a portee de main.",
  },
];

export const FeaturesSection = ({
  title = "Tout ce dont vous avez besoin",
  subtitle = "Des outils concus pour vous aider a mieux comprendre votre sante mentale.",
}: {
  title?: string;
  subtitle?: string;
}) => {
  return (
    <SectionLayout size="sm" className="relative" id="features">
      <div className="relative flex flex-col gap-12 lg:gap-16">
        <div className="flex flex-col items-center gap-4">
          <Badge>Fonctionnalites</Badge>
          <Typography variant="h2" className="m-auto max-w-xl text-center">
            {title}
          </Typography>
          <Typography
            variant="muted"
            className="m-auto max-w-lg text-center text-base"
          >
            {subtitle}
          </Typography>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_FEATURES.map((f, i) => (
            <FeatureLine key={i} {...f} />
          ))}
        </div>
      </div>
    </SectionLayout>
  );
};

const FeatureLine = (props: FeatureData) => {
  const Icon = props.icon;

  return (
    <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
          <Icon className="text-primary size-5" />
        </div>
        <Badge variant="secondary">{props.badge}</Badge>
      </div>
      <Typography variant="h4" className="text-foreground">
        {props.title}
      </Typography>
      <ClientMarkdown className="text-muted-foreground prose-sm">
        {props.description}
      </ClientMarkdown>
    </div>
  );
};
