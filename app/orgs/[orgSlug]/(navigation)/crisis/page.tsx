import { Typography } from "@/components/nowts/typography";
import {
  CrisisDisclaimer,
  CrisisResourcesGrid,
} from "@/components/nowts/crisis-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { HeartHandshake, AlertTriangle } from "lucide-react";

export default function CrisisPage() {
  return (
    <Layout size="default">
      <LayoutHeader>
        <LayoutTitle className="flex items-center gap-2">
          <HeartHandshake className="text-primary size-6" />
          Ressources de crise
        </LayoutTitle>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-6">
        <Typography variant="muted">
          Si vous traversez une periode difficile, vous n'etes pas seul. Voici
          des ressources disponibles pour vous aider.
        </Typography>

        {/* Emergency Banner */}
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="flex items-start gap-4 p-4">
            <AlertTriangle className="text-destructive mt-0.5 size-6 shrink-0" />
            <div>
              <Typography variant="h5" className="text-destructive mb-1">
                En cas d'urgence vitale
              </Typography>
              <Typography variant="muted">
                Si vous ou quelqu'un d'autre est en danger immediat, appelez le{" "}
                <a href="tel:15" className="text-destructive font-bold">
                  15 (SAMU)
                </a>{" "}
                ou le{" "}
                <a href="tel:112" className="text-destructive font-bold">
                  112 (Urgences europeennes)
                </a>
                .
              </Typography>
            </div>
          </CardContent>
        </Card>

        {/* Crisis Resources */}
        <section>
          <Typography variant="h4" className="mb-4">
            Lignes d'ecoute
          </Typography>
          <CrisisResourcesGrid />
        </section>

        {/* Additional Resources */}
        <section>
          <Typography variant="h4" className="mb-4">
            Autres ressources
          </Typography>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Suicide Ecoute</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <a
                  href="tel:0145394000"
                  className="text-primary text-lg font-bold hover:underline"
                >
                  01 45 39 40 00
                </a>
                <Typography
                  variant="caption"
                  className="text-muted-foreground block"
                >
                  24h/24, 7j/7
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">France Depression</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <a
                  href="tel:0189019515"
                  className="text-primary text-lg font-bold hover:underline"
                >
                  01 89 01 95 15
                </a>
                <Typography
                  variant="caption"
                  className="text-muted-foreground block"
                >
                  Association d'aide aux personnes depressives
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Phare Enfants-Parents
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <a
                  href="tel:0145394000"
                  className="text-primary text-lg font-bold hover:underline"
                >
                  01 43 46 00 62
                </a>
                <Typography
                  variant="caption"
                  className="text-muted-foreground block"
                >
                  Prevention du mal-etre et du suicide des jeunes
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">SOS Psychiatrie</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <a
                  href="tel:0145395000"
                  className="text-primary text-lg font-bold hover:underline"
                >
                  01 45 39 50 00
                </a>
                <Typography
                  variant="caption"
                  className="text-muted-foreground block"
                >
                  Permanence psychiatrique
                </Typography>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Disclaimer */}
        <CrisisDisclaimer className="mt-4" />
      </LayoutContent>
    </Layout>
  );
}
