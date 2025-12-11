import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Créez votre profil",
    description: "Renseignez vos informations de base et configurez les variables que vous souhaitez suivre.",
  },
  {
    number: "02",
    title: "Faites votre check-in quotidien",
    description: "Chaque jour, prenez 2-3 minutes pour noter votre humeur, sommeil et contexte.",
  },
  {
    number: "03",
    title: "Suivez vos évolutions",
    description: "Consultez votre timeline et identifiez les tendances et corrélations.",
  },
  {
    number: "04",
    title: "Préparez vos consultations",
    description: "Générez un rapport clair à partager avec votre professionnel de santé.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20 bg-card">
      <div className="container mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Comment ça marche
          </h2>
          <p className="text-lg text-muted-foreground">
            Un processus simple pour vous aider à mieux comprendre votre quotidien.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector line (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-gradient-to-r from-primary/30 to-primary/10 lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-md">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
