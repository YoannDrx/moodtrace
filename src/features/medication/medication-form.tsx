"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Loader2, X, Pill, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  FREQUENCY_LABELS,
  TIME_OF_DAY_LABELS,
  MEDICATION_COLORS,
  COMMON_MEDICATIONS,
} from "./medication.schema";
import {
  createMedicationAction,
  updateMedicationAction,
} from "./medication.action";

type MedicationFormProps = {
  existingMedication?: {
    id: string;
    name: string;
    molecule?: string | null;
    dosageMg: number;
    frequency: string;
    timeOfDay?: string | null;
    color?: string | null;
    startDate: Date;
    endDate?: Date | null;
    notes?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function MedicationForm({
  existingMedication,
  onSuccess,
  onCancel,
}: MedicationFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!existingMedication;

  // Form state
  const [name, setName] = useState(existingMedication?.name ?? "");
  const [molecule, setMolecule] = useState(existingMedication?.molecule ?? "");
  const [dosageMg, setDosageMg] = useState(
    existingMedication?.dosageMg?.toString() ?? "",
  );
  const [frequency, setFrequency] = useState(
    existingMedication?.frequency ?? "daily",
  );
  const [timeOfDay, setTimeOfDay] = useState(
    existingMedication?.timeOfDay ?? "morning",
  );
  const [color, setColor] = useState(
    existingMedication?.color ?? MEDICATION_COLORS[10],
  );
  const [startDate, setStartDate] = useState(
    existingMedication
      ? format(new Date(existingMedication.startDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  );
  const [notes, setNotes] = useState(existingMedication?.notes ?? "");

  // Autocomplete
  const [nameOpen, setNameOpen] = useState(false);

  const filteredMedications = useMemo(() => {
    if (!name || name.length < 2) return [];
    const lower = name.toLowerCase();
    return COMMON_MEDICATIONS.filter(
      (med) =>
        med.name.toLowerCase().includes(lower) ||
        med.molecule.toLowerCase().includes(lower),
    ).slice(0, 8);
  }, [name]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const result = await createMedicationAction({
        name,
        molecule: molecule || null,
        dosageMg: parseInt(dosageMg, 10),
        frequency: frequency as "daily" | "twice_daily" | "three_times_daily" | "as_needed" | "weekly",
        timeOfDay: timeOfDay as "morning" | "evening" | "both" | "any" | "night" | null,
        color,
        startDate,
        notes: notes || null,
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Médicament ajouté avec succès");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!existingMedication) return;
      const result = await updateMedicationAction({
        id: existingMedication.id,
        name,
        molecule: molecule || null,
        dosageMg: parseInt(dosageMg, 10),
        frequency: frequency as "daily" | "twice_daily" | "three_times_daily" | "as_needed" | "weekly",
        timeOfDay: timeOfDay as "morning" | "evening" | "both" | "any" | "night" | null,
        color,
        startDate,
        notes: notes || null,
      });
      if (result?.serverError) {
        throw new Error(result.serverError);
      }
      return result?.data;
    },
    onSuccess: () => {
      toast.success("Médicament mis à jour avec succès");
      void queryClient.invalidateQueries({ queryKey: ["medications"] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = () => {
    if (!name || !dosageMg) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (isEditing) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const handleSelectMedication = (med: (typeof COMMON_MEDICATIONS)[number]) => {
    setName(med.name);
    setMolecule(med.molecule);
    setNameOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-5" />
          {isEditing ? "Modifier le médicament" : "Nouveau médicament"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name with autocomplete */}
        <div className="space-y-2">
          <Label htmlFor="name">Nom du médicament *</Label>
          <Popover open={nameOpen} onOpenChange={setNameOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.length >= 2) {
                      setNameOpen(true);
                    }
                  }}
                  placeholder="Ex: Lamictal, Seroquel..."
                  className="pl-9"
                />
              </div>
            </PopoverTrigger>
            {filteredMedications.length > 0 && (
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandList>
                    <CommandGroup heading="Suggestions">
                      {filteredMedications.map((med) => (
                        <CommandItem
                          key={med.name}
                          onSelect={() => handleSelectMedication(med)}
                        >
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {med.molecule}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        </div>

        {/* Molecule */}
        <div className="space-y-2">
          <Label htmlFor="molecule">Molécule</Label>
          <Input
            id="molecule"
            value={molecule}
            onChange={(e) => setMolecule(e.target.value)}
            placeholder="Ex: Lamotrigine, Quetiapine..."
          />
        </div>

        {/* Dosage and Frequency */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dosageMg">Dosage (mg) *</Label>
            <Input
              id="dosageMg"
              type="number"
              value={dosageMg}
              onChange={(e) => setDosageMg(e.target.value)}
              placeholder="Ex: 100, 200..."
              min={0}
              max={10000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Fréquence *</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Time of day and Start date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timeOfDay">Moment de prise</Label>
            <Select value={timeOfDay} onValueChange={setTimeOfDay}>
              <SelectTrigger id="timeOfDay">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TIME_OF_DAY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Date de début *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        {/* Color picker */}
        <div className="space-y-2">
          <Label>Couleur</Label>
          <div className="flex flex-wrap gap-2">
            {MEDICATION_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn(
                  "size-8 rounded-full transition-all",
                  color === c && "ring-2 ring-offset-2 ring-primary",
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes sur ce médicament (effets secondaires, instructions spéciales...)"
            rows={3}
            maxLength={1000}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 size-4" />
              Annuler
            </Button>
          )}
          <Button type="button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {isEditing ? "Mise à jour..." : "Ajout..."}
              </>
            ) : (
              <>
                <Check className="mr-2 size-4" />
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
