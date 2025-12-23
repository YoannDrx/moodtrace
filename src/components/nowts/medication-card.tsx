"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pill,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Calendar,
} from "lucide-react";

export type MedicationCardProps = {
  /** Medication name */
  name: string;
  /** Dosage in mg */
  dosageMg: number;
  /** Time of day labels */
  timeOfDay: string[];
  /** Start date (formatted string) */
  startDate?: string;
  /** End date for stopped medications (formatted string) */
  endDate?: string;
  /** Adherence percentage (0-100) */
  adherence?: number;
  /** Whether the medication is active */
  isActive?: boolean;
  /** Status of the medication */
  status?: "active" | "stopped";
  /** Callback when edit is clicked */
  onEdit?: () => void;
  /** Additional CSS classes */
  className?: string;
};

/**
 * MedicationCard Component
 *
 * Displays a medication with its details (name, dosage, time, adherence).
 * Used in the medication management page.
 *
 * @example
 * ```tsx
 * <MedicationCard
 *   name="Lithium"
 *   dosageMg={400}
 *   timeOfDay={['Matin', 'Soir']}
 *   startDate="15/06/2023"
 *   adherence={95}
 *   onEdit={() => openEditDialog(id)}
 * />
 *
 * // Stopped medication
 * <MedicationCard
 *   name="Lamotrigine"
 *   dosageMg={200}
 *   timeOfDay={['Soir']}
 *   endDate="20/08/2023"
 *   status="stopped"
 * />
 * ```
 */
export function MedicationCard({
  name,
  dosageMg,
  timeOfDay,
  startDate,
  endDate,
  adherence,
  isActive = true,
  status = "active",
  onEdit,
  className,
}: MedicationCardProps) {
  const isStopped = status === "stopped" || !isActive;

  return (
    <Card className={cn(isStopped && "opacity-60", className)}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "rounded-full p-2",
              isStopped
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            <Pill className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-semibold",
                  isStopped && "text-muted-foreground",
                )}
              >
                {name}
              </span>
              <span className="text-muted-foreground text-sm">
                {dosageMg} mg
              </span>
            </div>
            {!isStopped && (
              <div className="flex flex-wrap gap-1">
                {timeOfDay.map((time) => (
                  <span
                    key={time}
                    className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
                  >
                    {time}
                  </span>
                ))}
              </div>
            )}
            {isStopped && endDate && (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Calendar className="size-3" />
                Arrêté le {endDate}
              </span>
            )}
            {!isStopped && startDate && (
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Calendar className="size-3" />
                Depuis le {startDate}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isStopped && adherence !== undefined && (
            <div className="text-right">
              <span
                className={cn(
                  "text-lg font-semibold",
                  adherence >= 80 ? "text-success" : "text-warning",
                )}
              >
                {adherence}%
              </span>
              <span className="text-muted-foreground block text-xs">
                observance
              </span>
            </div>
          )}
          {!isStopped && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="Modifier"
            >
              <Pill className="size-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export type MedicationIntakeToggleProps = {
  /** Medication name */
  name: string;
  /** Dosage string (e.g., "400mg") */
  dosage: string;
  /** Time of day (e.g., "matin") */
  timeOfDay: string;
  /** Whether taken */
  taken: boolean;
  /** Callback when toggle changes */
  onChange: (taken: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
};

/**
 * MedicationIntakeToggle Component
 *
 * Checkbox-style toggle for marking medication as taken.
 * Used in the daily check-in medication step.
 *
 * @example
 * ```tsx
 * <MedicationIntakeToggle
 *   name="Lithium"
 *   dosage="400mg"
 *   timeOfDay="matin"
 *   taken={taken}
 *   onChange={setTaken}
 * />
 * ```
 */
export function MedicationIntakeToggle({
  name,
  dosage,
  timeOfDay,
  taken,
  onChange,
  disabled = false,
  className,
}: MedicationIntakeToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-4 transition-all",
        taken ? "bg-primary/10" : "bg-muted",
        className,
      )}
    >
      <Checkbox
        checked={taken}
        onCheckedChange={(checked) => onChange(checked === true)}
        disabled={disabled}
        className="size-5"
      />
      <div className="flex flex-1 flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-muted-foreground text-sm">
          {dosage} · {timeOfDay}
        </span>
      </div>
      {taken && <span className="text-success text-sm font-medium">Pris</span>}
    </div>
  );
}

export type MedicationChangeType =
  | "dose_increase"
  | "dose_decrease"
  | "started"
  | "stopped";

export type MedicationChangeItemProps = {
  /** Medication name */
  name: string;
  /** Type of change */
  changeType: MedicationChangeType;
  /** Previous dosage (for dose changes) */
  previousDosage?: number;
  /** New dosage (for dose changes) */
  newDosage?: number;
  /** Reason for the change */
  reason?: string;
  /** Date of the change */
  date: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * MedicationChangeItem Component
 *
 * Displays a medication change in the history timeline.
 * Shows icon, dosage change, reason, and date.
 *
 * @example
 * ```tsx
 * <MedicationChangeItem
 *   name="Lithium"
 *   changeType="dose_increase"
 *   previousDosage={300}
 *   newDosage={400}
 *   reason="Augmentation suite à consultation"
 *   date="10 janvier 2024"
 * />
 * ```
 */
export function MedicationChangeItem({
  name,
  changeType,
  previousDosage,
  newDosage,
  reason,
  date,
  className,
}: MedicationChangeItemProps) {
  const icons = {
    dose_increase: { icon: TrendingUp, color: "text-warning bg-warning/10" },
    dose_decrease: { icon: TrendingDown, color: "text-info bg-info/10" },
    started: { icon: Plus, color: "text-success bg-success/10" },
    stopped: { icon: X, color: "text-destructive bg-destructive/10" },
  };

  const labels = {
    dose_increase: "Augmentation",
    dose_decrease: "Diminution",
    started: "Début du traitement",
    stopped: "Arrêt du traitement",
  };

  const { icon: Icon, color } = icons[changeType];

  return (
    <Card className={className}>
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn("rounded-full p-2", color)}>
          <Icon className="size-4" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="font-semibold">{name}</span>
          <span className="text-foreground text-sm">
            {labels[changeType]}
            {previousDosage !== undefined && newDosage !== undefined && (
              <>
                : {previousDosage}mg → {newDosage}mg
              </>
            )}
            {changeType === "started" && newDosage !== undefined && (
              <>: {newDosage}mg</>
            )}
          </span>
          {reason && (
            <span className="text-muted-foreground text-sm italic">
              "{reason}"
            </span>
          )}
          <span className="text-muted-foreground text-xs">{date}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export type AdherenceSummaryCardProps = {
  /** Adherence percentage (0-100) */
  percentage: number;
  /** Period label (e.g., "30 jours") */
  period?: string;
  /** Additional CSS classes */
  className?: string;
};

/**
 * AdherenceSummaryCard Component
 *
 * Displays the overall medication adherence percentage.
 *
 * @example
 * ```tsx
 * <AdherenceSummaryCard percentage={92} period="30 jours" />
 * ```
 */
export function AdherenceSummaryCard({
  percentage,
  period = "30 jours",
  className,
}: AdherenceSummaryCardProps) {
  return (
    <Card className={cn("bg-success/10", className)}>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="bg-success/20 text-success rounded-full p-2">
          <svg
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-sm">
            Observance moyenne ({period})
          </span>
          <span className="text-2xl font-bold">{percentage}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
