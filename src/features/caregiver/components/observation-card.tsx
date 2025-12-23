import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dayjs } from "@/lib/dayjs";
import {
  Battery,
  BedDouble,
  Eye,
  EyeOff,
  Heart,
  MessageSquare,
  Users,
} from "lucide-react";

// Labels pour l'affichage
const MOOD_LABELS: Record<string, string> = {
  very_good: "Très bien",
  good: "Bien",
  neutral: "Neutre",
  down: "Bas",
  very_down: "Très bas",
  concerning: "Préoccupant",
};

const ENERGY_LABELS: Record<string, string> = {
  high: "Élevée",
  normal: "Normale",
  low: "Basse",
  very_low: "Très basse",
};

const SOCIAL_LABELS: Record<string, string> = {
  engaged: "Engagé",
  normal: "Normal",
  withdrawn: "Replié",
  isolated: "Isolé",
};

const SLEEP_LABELS: Record<string, string> = {
  good: "Bon",
  restless: "Agité",
  insomnia: "Insomnie",
  oversleeping: "Hypersomnie",
};

type ObservationCardProps = {
  observation: {
    id: string;
    date: Date;
    moodObserved?: string | null;
    energyObserved?: string | null;
    socialBehavior?: string | null;
    sleepObserved?: string | null;
    notes?: string | null;
    patientVisibility: string;
    author: {
      name: string | null;
    };
  };
};

export const ObservationCard = ({ observation }: ObservationCardProps) => {
  const isHidden = observation.patientVisibility === "hidden";

  return (
    <Card className={isHidden ? "border-dashed opacity-75" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="text-primary size-4" />
            {dayjs(observation.date).locale("fr").format("dddd D MMMM")}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isHidden && (
              <Badge variant="secondary" className="gap-1">
                <EyeOff className="size-3" />
                Caché
              </Badge>
            )}
            <Typography variant="muted" className="text-xs">
              par {observation.author.name ?? "Anonyme"}
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {observation.moodObserved && (
            <div className="flex items-center gap-2">
              <Heart className="text-muted-foreground size-4" />
              <span className="text-sm">
                Humeur : {MOOD_LABELS[observation.moodObserved]}
              </span>
            </div>
          )}
          {observation.energyObserved && (
            <div className="flex items-center gap-2">
              <Battery className="text-muted-foreground size-4" />
              <span className="text-sm">
                Énergie : {ENERGY_LABELS[observation.energyObserved]}
              </span>
            </div>
          )}
          {observation.socialBehavior && (
            <div className="flex items-center gap-2">
              <Users className="text-muted-foreground size-4" />
              <span className="text-sm">
                Social : {SOCIAL_LABELS[observation.socialBehavior]}
              </span>
            </div>
          )}
          {observation.sleepObserved && (
            <div className="flex items-center gap-2">
              <BedDouble className="text-muted-foreground size-4" />
              <span className="text-sm">
                Sommeil : {SLEEP_LABELS[observation.sleepObserved]}
              </span>
            </div>
          )}
        </div>
        {observation.notes && (
          <div className="bg-muted/50 flex items-start gap-2 rounded-md p-3">
            <MessageSquare className="text-muted-foreground mt-0.5 size-4" />
            <Typography variant="small">{observation.notes}</Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
