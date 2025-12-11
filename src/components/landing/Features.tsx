import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarCheck, 
  Pill, 
  LineChart, 
  FileText, 
  Users, 
  Bell 
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Check-in quotidien",
    description: "Renseignez votre humeur, sommeil et contexte en moins de 3 minutes chaque jour.",
  },
  {
    icon: Pill,
    title: "Suivi des traitements",
    description: "Gérez vos médicaments, doses et observance. Historique des modifications inclus.",
  },
  {
    icon: LineChart,
    title: "Timeline visuelle",
    description: "Visualisez l'évolution de votre humeur sur plusieurs semaines ou mois.",
  },
  {
    icon: FileText,
    title: "Rapports PDF",
    description: "Générez des rapports clairs pour vos rendez-vous avec les professionnels de santé.",
  },
  {
    icon: Users,
    title: "Espace aidant",
    description: "Vos proches peuvent ajouter leurs observations, avec gestion de la confidentialité.",
  },
  {
    icon: Bell,
    title: "Rappels personnalisés",
    description: "Configurez des notifications pour ne jamais oublier votre check-in quotidien.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-muted-foreground">
            Des outils simples et respectueux pour suivre votre bien-être au quotidien.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group hover:shadow-md hover:border-primary/20 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
