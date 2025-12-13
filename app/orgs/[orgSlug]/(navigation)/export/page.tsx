"use client";

import { Typography } from "@/components/nowts/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Layout,
  LayoutActions,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { FileText, Printer } from "lucide-react";

export default function ExportPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout size="default">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <FileText className="text-primary size-6" />
          Export
        </LayoutTitle>
      </LayoutHeader>
      <LayoutActions className="print:hidden">
        <Button onClick={handlePrint}>
          <Printer className="mr-2 size-4" />
          Imprimer / PDF
        </Button>
      </LayoutActions>
      <LayoutContent className="flex flex-col gap-6">
        <Typography variant="muted" className="print:hidden">
          Generez un rapport de vos donnees pour votre medecin. Cliquez sur
          "Imprimer" et selectionnez "Enregistrer en PDF" pour creer un fichier
          PDF.
        </Typography>

        {/* Printable Report */}
        <div className="print:block">
          <Card className="print:border-0 print:shadow-none">
            <CardHeader className="print:pb-2">
              <CardTitle className="text-2xl print:text-xl">
                Rapport MoodTrace
              </CardTitle>
              <Typography variant="muted">
                Genere le{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Disclaimer */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950">
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Avertissement
                </p>
                <p className="text-amber-700 dark:text-amber-300">
                  Ce rapport est un outil de suivi personnel et ne constitue pas
                  un diagnostic medical. Les donnees doivent etre interpretees
                  par un professionnel de sante.
                </p>
              </div>

              {/* Instructions */}
              <div className="text-muted-foreground text-sm">
                <p>
                  Pour generer un rapport complet, allez sur la page{" "}
                  <strong>Tendances</strong> pour voir vos statistiques
                  detaillees, puis utilisez le bouton "Imprimer" ci-dessus.
                </p>
              </div>

              {/* Contact info */}
              <div className="border-t pt-4 text-sm">
                <p className="text-muted-foreground">
                  Rapport genere par MoodTrace - Medication-aware mood tracker
                </p>
                <p className="text-muted-foreground">
                  Pour toute question medicale, consultez votre medecin.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutContent>
    </Layout>
  );
}
