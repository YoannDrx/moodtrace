import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pill, Check, Edit2, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for demo
const mockMedications = [
  {
    id: "1",
    name: "Lithium",
    dose: 400,
    unit: "mg",
    times: ["matin", "soir"],
    startDate: "2023-06-15",
    isActive: true,
    adherence: 95,
  },
  {
    id: "2",
    name: "Quetiapine",
    dose: 100,
    unit: "mg",
    times: ["soir"],
    startDate: "2023-09-01",
    isActive: true,
    adherence: 88,
  },
  {
    id: "3",
    name: "Lamotrigine",
    dose: 200,
    unit: "mg",
    times: ["matin"],
    startDate: "2023-03-10",
    endDate: "2023-08-20",
    isActive: false,
    adherence: 82,
  },
];

const mockHistory = [
  {
    id: "1",
    medicationName: "Lithium",
    type: "dose_increase",
    date: "2024-01-10",
    previousDose: 300,
    newDose: 400,
    notes: "Augmentation suite à consultation",
  },
  {
    id: "2",
    medicationName: "Quetiapine",
    type: "started",
    date: "2023-09-01",
    newDose: 100,
    notes: "Ajout pour améliorer le sommeil",
  },
  {
    id: "3",
    medicationName: "Lamotrigine",
    type: "stopped",
    date: "2023-08-20",
    previousDose: 200,
    notes: "Arrêt progressif",
  },
];

const timeLabels: Record<string, string> = {
  matin: "Matin",
  midi: "Midi",
  soir: "Soir",
  nuit: "Nuit",
};

export function Medication() {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");
  const activeMeds = mockMedications.filter((m) => m.isActive);
  const inactiveMeds = mockMedications.filter((m) => !m.isActive);

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Médication</h1>
          <p className="text-muted-foreground">Gérez vos traitements</p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("current")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "current"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          En cours
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === "history"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Historique
        </button>
      </div>

      {activeTab === "current" && (
        <>
          {/* Adherence summary */}
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Observance moyenne (30 jours)</p>
                  <p className="text-2xl font-bold text-foreground">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active medications */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Traitements actifs</h2>
            {activeMeds.map((med) => (
              <Card key={med.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {med.dose} {med.unit}
                        </p>
                        <div className="flex gap-1 mt-2">
                          {med.times.map((time) => (
                            <span
                              key={time}
                              className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground"
                            >
                              {timeLabels[time] || time}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-success">
                        <span className="text-lg font-semibold">{med.adherence}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">observance</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Depuis le {new Date(med.startDate).toLocaleDateString("fr-FR")}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Inactive medications */}
          {inactiveMeds.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-muted-foreground">Traitements arrêtés</h2>
              {inactiveMeds.map((med) => (
                <Card key={med.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {med.dose} {med.unit} · Arrêté le{" "}
                          {new Date(med.endDate!).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Modifications récentes</h2>
          {mockHistory.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      entry.type === "dose_increase" && "bg-warning/10 text-warning",
                      entry.type === "dose_decrease" && "bg-primary/10 text-primary",
                      entry.type === "started" && "bg-success/10 text-success",
                      entry.type === "stopped" && "bg-destructive/10 text-destructive"
                    )}
                  >
                    {entry.type === "dose_increase" && <TrendingUp className="h-5 w-5" />}
                    {entry.type === "dose_decrease" && <TrendingDown className="h-5 w-5" />}
                    {entry.type === "started" && <Plus className="h-5 w-5" />}
                    {entry.type === "stopped" && <Pill className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{entry.medicationName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {entry.type === "dose_increase" &&
                        `Augmentation: ${entry.previousDose}mg → ${entry.newDose}mg`}
                      {entry.type === "dose_decrease" &&
                        `Diminution: ${entry.previousDose}mg → ${entry.newDose}mg`}
                      {entry.type === "started" && `Début du traitement: ${entry.newDose}mg`}
                      {entry.type === "stopped" && `Arrêt du traitement`}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        "{entry.notes}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(entry.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
