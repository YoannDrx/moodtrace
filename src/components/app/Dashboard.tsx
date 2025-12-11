import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, TrendingUp, Calendar, Pill, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for demo
const mockStats = {
  streakDays: 7,
  avgMood: 0.5,
  lastCheckin: "Aujourd'hui, 09:30",
  medicationAdherence: 92,
};

const recentDays = [
  { date: "Lun", mood: 1 },
  { date: "Mar", mood: 0 },
  { date: "Mer", mood: -1 },
  { date: "Jeu", mood: 0 },
  { date: "Ven", mood: 1 },
  { date: "Sam", mood: 2 },
  { date: "Dim", mood: 1 },
];

const getMoodColor = (mood: number) => {
  if (mood <= -2) return "bg-mood-very-low";
  if (mood === -1) return "bg-mood-low";
  if (mood === 0) return "bg-mood-stable";
  if (mood === 1) return "bg-mood-high/70";
  if (mood >= 2) return "bg-mood-high";
  return "bg-muted";
};

export function Dashboard() {
  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Bonjour 👋</h1>
        <p className="text-muted-foreground">Comment allez-vous aujourd'hui ?</p>
      </div>

      {/* Quick check-in CTA */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Check-in quotidien</h2>
              <p className="text-primary-foreground/80 text-sm">
                Prenez 2 minutes pour noter votre journée
              </p>
            </div>
            <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Link to="/app/checkin">
                <PenLine className="mr-2 h-4 w-4" />
                Commencer
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Série</p>
                <p className="text-lg font-semibold text-foreground">{mockStats.streakDays} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Observance</p>
                <p className="text-lg font-semibold text-foreground">{mockStats.medicationAdherence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly mood overview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Cette semaine</CardTitle>
            <Link to="/app/timeline" className="text-sm text-primary hover:underline flex items-center">
              Voir plus <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2">
            {recentDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full ${getMoodColor(day.mood)} transition-all duration-300`}
                  title={`Humeur: ${day.mood}`}
                />
                <span className="text-xs text-muted-foreground">{day.date}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-mood-very-low" />
              <span>Bas</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-mood-stable" />
              <span>Stable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-mood-high" />
              <span>Élevé</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Accès rapide</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/app/timeline">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Timeline</span>
              </CardContent>
            </Card>
          </Link>
          <Link to="/app/medication">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Pill className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Médication</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
