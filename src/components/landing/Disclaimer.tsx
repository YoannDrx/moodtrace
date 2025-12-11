import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Disclaimer() {
  return (
    <section className="px-4 py-16 bg-background">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning/20">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Information importante
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  MoodTrace <strong>n'est pas un dispositif médical</strong>. Cette application 
                  ne fournit aucun diagnostic ni recommandation médicale. Elle est conçue 
                  uniquement pour vous aider à <strong>organiser vos observations</strong> et 
                  mieux préparer vos rendez-vous avec les professionnels de santé. 
                  <strong> Ne modifiez jamais votre traitement sans avis médical.</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
