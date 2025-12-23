"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Eye,
  EyeOff,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  CreditCard,
  Users,
  Star,
  Pill,
  FileText,
  Calendar,
  MessageSquare,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MOOD_OBSERVED_LABELS,
  MOOD_OBSERVED_COLORS,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
  SEVERITY_LABELS,
  SEVERITY_COLORS,
} from "./caregiver.schema";
import type {
  CaregiverDailyCheckin,
  CaregiverEvent,
  User,
} from "@/generated/prisma";

const EVENT_TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  compulsive_purchase: <CreditCard className="size-4" />,
  crisis: <AlertTriangle className="size-4" />,
  conflict: <Users className="size-4" />,
  milestone: <Star className="size-4" />,
  medication_issue: <Pill className="size-4" />,
  other: <FileText className="size-4" />,
};

type CheckinWithAuthor = CaregiverDailyCheckin & { author: User };
type EventWithAuthor = CaregiverEvent & { author: User };

type CaregiverCheckinCardProps = {
  checkin: CheckinWithAuthor;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, visibility: "visible" | "hidden") => void;
  showActions?: boolean;
};

export function CaregiverCheckinCard({
  checkin,
  onEdit,
  onDelete,
  onToggleVisibility,
  showActions = true,
}: CaregiverCheckinCardProps) {
  const isHidden = checkin.patientVisibility === "hidden";

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isHidden && "bg-muted/50",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Mood indicator */}
          {checkin.moodObserved && (
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
              style={{
                backgroundColor:
                  MOOD_OBSERVED_COLORS[checkin.moodObserved] ?? "#64748B",
              }}
            >
              <MessageSquare className="size-5" />
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium">
                {format(new Date(checkin.date), "EEEE d MMMM", { locale: fr })}
              </p>
              {isHidden && (
                <EyeOff className="size-3 text-muted-foreground" />
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Par {checkin.author.name}
            </p>

            {/* Mood */}
            {checkin.moodObserved && (
              <p className="mt-2 text-sm">
                <span className="text-muted-foreground">Humeur: </span>
                <span className="font-medium">
                  {MOOD_OBSERVED_LABELS[checkin.moodObserved]}
                </span>
              </p>
            )}

            {/* Notes */}
            {checkin.notes && (
              <p className="mt-2 text-sm text-muted-foreground italic line-clamp-2">
                {checkin.notes}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (onEdit || onDelete || onToggleVisibility) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(checkin.id)}>
                  <Pencil className="mr-2 size-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {onToggleVisibility && (
                <DropdownMenuItem
                  onClick={() =>
                    onToggleVisibility(
                      checkin.id,
                      isHidden ? "visible" : "hidden",
                    )
                  }
                >
                  {isHidden ? (
                    <>
                      <Eye className="mr-2 size-4" />
                      Rendre visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-2 size-4" />
                      Masquer
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(checkin.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

type CaregiverEventCardProps = {
  event: EventWithAuthor;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, visibility: "visible" | "hidden") => void;
  showActions?: boolean;
};

export function CaregiverEventCard({
  event,
  onEdit,
  onDelete,
  onToggleVisibility,
  showActions = true,
}: CaregiverEventCardProps) {
  const isHidden = event.patientVisibility === "hidden";

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        isHidden && "bg-muted/50",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Event type icon */}
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{
              backgroundColor:
                EVENT_TYPE_COLORS[event.eventType] ?? "#64748B",
            }}
          >
            {EVENT_TYPE_ICON_MAP[event.eventType] ?? <FileText className="size-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium">{event.title}</p>
              {isHidden && (
                <EyeOff className="size-3 text-muted-foreground" />
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {format(new Date(event.occurredAt), "d MMM yyyy HH:mm", {
                  locale: fr,
                })}
              </span>
              <span>·</span>
              <span>{EVENT_TYPE_LABELS[event.eventType]}</span>
              <span>·</span>
              <span
                className="font-medium"
                style={{ color: SEVERITY_COLORS[event.severity] }}
              >
                {SEVERITY_LABELS[event.severity]}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              Par {event.author.name}
            </p>

            {/* Details */}
            {event.details && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {event.details}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (onEdit || onDelete || onToggleVisibility) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(event.id)}>
                  <Pencil className="mr-2 size-4" />
                  Modifier
                </DropdownMenuItem>
              )}
              {onToggleVisibility && (
                <DropdownMenuItem
                  onClick={() =>
                    onToggleVisibility(
                      event.id,
                      isHidden ? "visible" : "hidden",
                    )
                  }
                >
                  {isHidden ? (
                    <>
                      <Eye className="mr-2 size-4" />
                      Rendre visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="mr-2 size-4" />
                      Masquer
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(event.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Supprimer
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

type CaregiverActivityListProps = {
  checkins: CheckinWithAuthor[];
  events: EventWithAuthor[];
  onEditCheckin?: (id: string) => void;
  onDeleteCheckin?: (id: string) => void;
  onToggleCheckinVisibility?: (id: string, visibility: "visible" | "hidden") => void;
  onEditEvent?: (id: string) => void;
  onDeleteEvent?: (id: string) => void;
  onToggleEventVisibility?: (id: string, visibility: "visible" | "hidden") => void;
  title?: string;
};

export function CaregiverActivityList({
  checkins,
  events,
  onEditCheckin,
  onDeleteCheckin,
  onToggleCheckinVisibility,
  onEditEvent,
  onDeleteEvent,
  onToggleEventVisibility,
  title = "Activité récente",
}: CaregiverActivityListProps) {
  // Combine and sort by date
  type ActivityItem =
    | { type: "checkin"; date: Date; item: CheckinWithAuthor }
    | { type: "event"; date: Date; item: EventWithAuthor };

  const allActivity: ActivityItem[] = [
    ...checkins.map(
      (c) =>
        ({
          type: "checkin",
          date: new Date(c.date),
          item: c,
        }) as ActivityItem,
    ),
    ...events.map(
      (e) =>
        ({
          type: "event",
          date: new Date(e.occurredAt),
          item: e,
        }) as ActivityItem,
    ),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (allActivity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Aucune activité pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allActivity.map((activity) =>
          activity.type === "checkin" ? (
            <CaregiverCheckinCard
              key={`checkin-${activity.item.id}`}
              checkin={activity.item}
              onEdit={onEditCheckin}
              onDelete={onDeleteCheckin}
              onToggleVisibility={onToggleCheckinVisibility}
            />
          ) : (
            <CaregiverEventCard
              key={`event-${activity.item.id}`}
              event={activity.item}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onToggleVisibility={onToggleEventVisibility}
            />
          ),
        )}
      </CardContent>
    </Card>
  );
}
