import { Typography } from "@/components/nowts/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dayjs } from "@/lib/dayjs";
import {
  AlertTriangle,
  EyeOff,
  MessageSquare,
  Pill,
  ShoppingCart,
  Star,
  Swords,
  type LucideIcon,
} from "lucide-react";

// Configuration des types d'événements
const EVENT_CONFIG: Record<
  string,
  { label: string; Icon: LucideIcon; color: string }
> = {
  compulsive_purchase: {
    label: "Achat compulsif",
    Icon: ShoppingCart,
    color: "text-orange-500",
  },
  crisis: { label: "Crise", Icon: AlertTriangle, color: "text-red-500" },
  conflict: { label: "Conflit", Icon: Swords, color: "text-yellow-500" },
  milestone: {
    label: "Événement marquant",
    Icon: Star,
    color: "text-blue-500",
  },
  medication_issue: {
    label: "Problème médicament",
    Icon: Pill,
    color: "text-purple-500",
  },
  other: { label: "Autre", Icon: AlertTriangle, color: "text-gray-500" },
};

const SEVERITY_COLORS = [
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-orange-100 text-orange-800",
  "bg-red-100 text-red-800",
  "bg-red-200 text-red-900",
];

const SEVERITY_LABELS = ["Mineur", "Léger", "Modéré", "Important", "Grave"];

type EventCardProps = {
  event: {
    id: string;
    occurredAt: Date;
    eventType: string;
    severity: number;
    title: string;
    details?: string | null;
    patientVisibility: string;
    author: {
      name: string | null;
    };
  };
};

export const EventCard = ({ event }: EventCardProps) => {
  const isHidden = event.patientVisibility === "hidden";
  const config = EVENT_CONFIG[event.eventType] ?? EVENT_CONFIG.other;
  const Icon = config.Icon;

  return (
    <Card className={isHidden ? "border-dashed opacity-75" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className={`size-4 ${config.color}`} />
            {event.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={SEVERITY_COLORS[event.severity - 1]}>
              {SEVERITY_LABELS[event.severity - 1]}
            </Badge>
            {isHidden && (
              <Badge variant="secondary" className="gap-1">
                <EyeOff className="size-3" />
                Caché
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{config.label}</Badge>
          <Typography variant="muted" className="text-xs">
            {dayjs(event.occurredAt).locale("fr").format("D MMMM [à] HH:mm")} -
            par {event.author.name ?? "Anonyme"}
          </Typography>
        </div>
      </CardHeader>
      {event.details && (
        <CardContent>
          <div className="bg-muted/50 flex items-start gap-2 rounded-md p-3">
            <MessageSquare className="text-muted-foreground mt-0.5 size-4" />
            <Typography variant="small">{event.details}</Typography>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
