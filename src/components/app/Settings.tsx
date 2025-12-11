import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Download, 
  Trash2, 
  ChevronRight, 
  Moon, 
  Sun,
  FileText,
  Shield,
  Users
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Réglages</h1>
        <p className="text-muted-foreground">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profile section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-semibold">
              P
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Patient Demo</p>
              <p className="text-sm text-muted-foreground">demo@moodtrace.app</p>
            </div>
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </div>

          <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Changer le mot de passe</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardContent>
      </Card>

      {/* Caregivers section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Aidants
          </CardTitle>
          <CardDescription>
            Invitez des proches à suivre vos observations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun aidant invité</p>
            <Button variant="outline" size="sm" className="mt-3">
              Inviter un aidant
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Préférences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Dark mode */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">Mode sombre</p>
                <p className="text-xs text-muted-foreground">
                  {darkMode ? "Activé" : "Désactivé"}
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Rappels quotidiens</p>
                <p className="text-xs text-muted-foreground">
                  Recevoir un rappel pour le check-in
                </p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Rapports
          </CardTitle>
          <CardDescription>
            Générez des rapports pour vos consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Générer un rapport PDF
          </Button>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Exporter mes données</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-destructive/5 transition-colors text-destructive">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5" />
              <span className="text-sm font-medium">Supprimer mon compte</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </button>
        </CardContent>
      </Card>

      {/* App info */}
      <div className="text-center text-sm text-muted-foreground pt-4">
        <p>MoodTrace v1.0.0</p>
        <p className="mt-1">Application non médicale</p>
      </div>
    </div>
  );
}
