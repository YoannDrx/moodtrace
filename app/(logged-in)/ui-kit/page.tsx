"use client";

import { useState } from "react";
import { TrendingUp, CheckCircle, Settings, Filter } from "lucide-react";

// Design tokens
import {
  type MoodValueBipolar,
  moodBipolarColors,
  moodBipolarLabels,
  type ContextTag,
  type SideEffect,
  type SleepQuality,
} from "@/lib/design-tokens";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

// Custom Components
import { Typography } from "@/components/nowts/typography";
import {
  MoodIndicatorBipolar,
  MoodSliderBipolar,
  WeekMoodViewBipolar,
} from "@/components/nowts/mood-slider-bipolar";
import { SliderInput, QualitySelector } from "@/components/nowts/slider-input";
import {
  ContextTagsSelector,
  SideEffectsSelector,
} from "@/components/nowts/tag-selector";
import {
  StatCard,
  StepIndicator,
  PeriodSelector,
} from "@/components/nowts/stat-card";
import { TimelineEntry, MoodChart } from "@/components/nowts/timeline-entry";
import {
  MedicationCard,
  MedicationIntakeToggle,
  MedicationChangeItem,
  AdherenceSummaryCard,
} from "@/components/nowts/medication-card";
import {
  SettingsSection,
  SettingsRow,
  SettingsDivider,
} from "@/components/nowts/settings-section";

// ============================================================================
// UI Kit Section Component
// ============================================================================

function UIKitSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6">
        <Typography variant="h2" className="mb-2">
          {title}
        </Typography>
        {description && <Typography variant="muted">{description}</Typography>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function ComponentShowcase({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ============================================================================
// Main UI Kit Page
// ============================================================================

export default function UIKitPage() {
  // State for interactive demos
  const [mood, setMood] = useState<MoodValueBipolar>(0);
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(3);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(
    "average",
  );
  const [contextTags, setContextTags] = useState<ContextTag[]>(["sport"]);
  const [sideEffects, setSideEffects] = useState<SideEffect[]>([]);
  const [currentStep, setCurrentStep] = useState(2);
  const [period, setPeriod] = useState<"7" | "30" | "90">("7");
  const [darkMode, setDarkMode] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [medicationTaken, setMedicationTaken] = useState(true);

  // Mock data
  const weekMoodData = [
    { day: "Lun", mood: -1 as MoodValueBipolar },
    { day: "Mar", mood: 0 as MoodValueBipolar },
    { day: "Mer", mood: -2 as MoodValueBipolar },
    { day: "Jeu", mood: 0 as MoodValueBipolar },
    { day: "Ven", mood: 1 as MoodValueBipolar },
    { day: "Sam", mood: 2 as MoodValueBipolar },
    { day: "Dim", mood: 1 as MoodValueBipolar },
  ];

  const chartData = [
    { date: "15", mood: 2 as MoodValueBipolar },
    { date: "14", mood: 1 as MoodValueBipolar },
    { date: "13", mood: 0 as MoodValueBipolar },
    { date: "12", mood: -1 as MoodValueBipolar },
    { date: "11", mood: 0 as MoodValueBipolar },
    { date: "10", mood: 1 as MoodValueBipolar },
    { date: "9", mood: 2 as MoodValueBipolar },
  ];

  // Navigation items for quick access
  const navItems = [
    { id: "typography", label: "Typography" },
    { id: "colors", label: "Colors" },
    { id: "buttons", label: "Buttons" },
    { id: "inputs", label: "Inputs" },
    { id: "sliders", label: "Sliders" },
    { id: "cards", label: "Cards" },
    { id: "mood", label: "Mood" },
    { id: "tags", label: "Tags" },
    { id: "navigation", label: "Navigation" },
    { id: "dialogs", label: "Dialogs" },
    { id: "feedback", label: "Feedback" },
    { id: "medication", label: "Medication" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="bg-card sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r p-6 lg:block">
        <Typography variant="h3" className="mb-6">
          UI Kit
        </Typography>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="hover:bg-muted text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <Typography variant="display" className="mb-4">
              MoodTrace UI Kit
            </Typography>
            <Typography variant="lead">
              Tous les composants réutilisables du design system MoodTrace.
              Cette page présente les composants avec leurs variantes et états.
            </Typography>
          </div>

          <div className="flex flex-col gap-16">
            {/* Typography */}
            <UIKitSection
              id="typography"
              title="Typography"
              description="Composant Typography polymorphe avec tous les variants disponibles."
            >
              <ComponentShowcase title="Headings">
                <div className="flex flex-col gap-4">
                  <Typography variant="display">Display</Typography>
                  <Typography variant="h1">Heading 1</Typography>
                  <Typography variant="h2">Heading 2</Typography>
                  <Typography variant="h3">Heading 3</Typography>
                  <Typography variant="h4">Heading 4</Typography>
                  <Typography variant="h5">Heading 5</Typography>
                  <Typography variant="h6">Heading 6</Typography>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Text Variants">
                <div className="flex flex-col gap-4">
                  <Typography variant="p">
                    Paragraph - Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua.
                  </Typography>
                  <Typography variant="lead">
                    Lead - Texte d&apos;accroche pour les introductions.
                  </Typography>
                  <Typography variant="large">
                    Large - Texte important
                  </Typography>
                  <Typography variant="small">Small - Texte petit</Typography>
                  <Typography variant="muted">
                    Muted - Texte secondaire
                  </Typography>
                  <Typography variant="caption">Caption - Légende</Typography>
                  <Typography variant="overline">OVERLINE</Typography>
                  <Typography variant="code">code: inline</Typography>
                  <Typography variant="quote">
                    &quot;Citation - Un texte de citation avec mise en forme
                    italique.&quot;
                  </Typography>
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Colors */}
            <UIKitSection
              id="colors"
              title="Colors"
              description="Palette de couleurs MoodTrace incluant les couleurs d'humeur bipolaires."
            >
              <ComponentShowcase title="Brand Colors">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <div className="bg-primary h-16 rounded-lg" />
                    <span className="text-sm font-medium">Primary</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-secondary h-16 rounded-lg" />
                    <span className="text-sm font-medium">Secondary</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-accent h-16 rounded-lg" />
                    <span className="text-sm font-medium">Accent</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-muted h-16 rounded-lg" />
                    <span className="text-sm font-medium">Muted</span>
                  </div>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Semantic Colors">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="flex flex-col gap-2">
                    <div className="bg-success h-16 rounded-lg" />
                    <span className="text-sm font-medium">Success</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-warning h-16 rounded-lg" />
                    <span className="text-sm font-medium">Warning</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-destructive h-16 rounded-lg" />
                    <span className="text-sm font-medium">Destructive</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="bg-info h-16 rounded-lg" />
                    <span className="text-sm font-medium">Info</span>
                  </div>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Bipolar Mood Colors (-3 to +3)">
                <div className="flex flex-wrap gap-4">
                  {(
                    Object.keys(
                      moodBipolarColors,
                    ) as (keyof typeof moodBipolarColors)[]
                  ).map((key) => (
                    <div key={key} className="flex flex-col items-center gap-2">
                      <div
                        className="size-12 rounded-full shadow-sm"
                        style={{ backgroundColor: moodBipolarColors[key] }}
                      />
                      <span className="text-xs font-medium">
                        {Number(key) > 0 ? `+${key}` : key}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {moodBipolarLabels[Number(key) as MoodValueBipolar]}
                      </span>
                    </div>
                  ))}
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Buttons */}
            <UIKitSection
              id="buttons"
              title="Buttons"
              description="Boutons avec différentes variantes et tailles."
            >
              <ComponentShowcase title="Variants">
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Sizes">
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Settings className="size-4" />
                  </Button>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="States">
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Inputs */}
            <UIKitSection
              id="inputs"
              title="Inputs"
              description="Champs de formulaire : input, textarea, select, checkbox, radio, switch."
            >
              <ComponentShowcase title="Text Inputs">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="input-default">Input Default</Label>
                    <Input
                      id="input-default"
                      placeholder="Entrez du texte..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="input-disabled">Input Disabled</Label>
                    <Input
                      id="input-disabled"
                      placeholder="Disabled..."
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="textarea">Textarea</Label>
                    <Textarea
                      id="textarea"
                      placeholder="Écrivez vos notes ici..."
                    />
                  </div>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Select">
                <div className="flex flex-col gap-2">
                  <Label>Select</Label>
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sélectionnez..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Checkbox & Radio">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="checkbox" />
                    <Label htmlFor="checkbox">Checkbox option</Label>
                  </div>
                  <RadioGroup defaultValue="option1">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="option1" id="radio1" />
                      <Label htmlFor="radio1">Radio Option 1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="option2" id="radio2" />
                      <Label htmlFor="radio2">Radio Option 2</Label>
                    </div>
                  </RadioGroup>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Switch">
                <div className="flex items-center gap-4">
                  <Switch id="switch-demo" />
                  <Label htmlFor="switch-demo">Toggle switch</Label>
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Sliders */}
            <UIKitSection
              id="sliders"
              title="Sliders"
              description="Sliders personnalisés pour les valeurs numériques."
            >
              <ComponentShowcase title="SliderInput">
                <div className="flex flex-col gap-6">
                  <SliderInput
                    label="Niveau d'énergie"
                    value={energy}
                    onChange={setEnergy}
                    min={0}
                    max={10}
                    showLabels={{ min: "Épuisé", max: "Très énergique" }}
                  />
                  <SliderInput
                    label="Niveau d'anxiété"
                    value={anxiety}
                    onChange={setAnxiety}
                    min={0}
                    max={10}
                    showLabels={{ min: "Calme", max: "Très anxieux" }}
                  />
                  <SliderInput
                    label="Heures de sommeil"
                    value={sleepHours}
                    onChange={setSleepHours}
                    min={0}
                    max={14}
                    unit="h"
                    showLabels={{ min: "0h", max: "14h" }}
                  />
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="QualitySelector">
                <div className="flex flex-col gap-2">
                  <Label>Qualité du sommeil</Label>
                  <QualitySelector
                    value={sleepQuality}
                    onChange={setSleepQuality}
                  />
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Cards */}
            <UIKitSection
              id="cards"
              title="Cards"
              description="Conteneurs Card et StatCard."
            >
              <ComponentShowcase title="Card">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>
                      Description de la carte avec des informations
                      supplémentaires.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Contenu de la carte.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Action</Button>
                  </CardFooter>
                </Card>
              </ComponentShowcase>

              <ComponentShowcase title="StatCard">
                <div className="grid gap-4 md:grid-cols-2">
                  <StatCard
                    icon={TrendingUp}
                    label="Série"
                    value={7}
                    unit="jours"
                    variant="primary"
                  />
                  <StatCard
                    icon={CheckCircle}
                    label="Observance"
                    value={92}
                    unit="%"
                    variant="success"
                  />
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Mood Components */}
            <UIKitSection
              id="mood"
              title="Mood Components"
              description="Composants spécifiques au suivi d'humeur bipolaire (-3 à +3)."
            >
              <ComponentShowcase title="MoodIndicatorBipolar">
                <div className="flex flex-wrap items-center gap-4">
                  {([-3, -2, -1, 0, 1, 2, 3] as MoodValueBipolar[]).map((v) => (
                    <MoodIndicatorBipolar
                      key={v}
                      value={v}
                      size="lg"
                      showTooltip
                    />
                  ))}
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="MoodIndicatorBipolar Variants">
                <div className="flex flex-wrap items-center gap-4">
                  <MoodIndicatorBipolar value={0} size="md" />
                  <MoodIndicatorBipolar value={0} size="md" variant="outline" />
                  <MoodIndicatorBipolar value={0} size="md" variant="ghost" />
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="MoodSliderBipolar">
                <div className="flex flex-col gap-4">
                  <Typography variant="small" className="text-muted-foreground">
                    Valeur sélectionnée: {mood > 0 ? `+${mood}` : mood} (
                    {moodBipolarLabels[mood]})
                  </Typography>
                  <MoodSliderBipolar value={mood} onChange={setMood} />
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="WeekMoodViewBipolar">
                <WeekMoodViewBipolar data={weekMoodData} />
              </ComponentShowcase>

              <ComponentShowcase title="MoodChart">
                <MoodChart data={chartData} />
              </ComponentShowcase>
            </UIKitSection>

            {/* Tags */}
            <UIKitSection
              id="tags"
              title="Tags"
              description="Sélecteurs de tags multi-choix."
            >
              <ComponentShowcase title="ContextTagsSelector">
                <ContextTagsSelector
                  selectedTags={contextTags}
                  onChange={setContextTags}
                />
              </ComponentShowcase>

              <ComponentShowcase title="SideEffectsSelector">
                <SideEffectsSelector
                  selectedTags={sideEffects}
                  onChange={setSideEffects}
                />
              </ComponentShowcase>
            </UIKitSection>

            {/* Navigation */}
            <UIKitSection
              id="navigation"
              title="Navigation"
              description="Composants de navigation : tabs, stepper, period selector."
            >
              <ComponentShowcase title="Tabs">
                <Tabs defaultValue="tab1">
                  <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tab1" className="mt-4">
                    Contenu du Tab 1
                  </TabsContent>
                  <TabsContent value="tab2" className="mt-4">
                    Contenu du Tab 2
                  </TabsContent>
                  <TabsContent value="tab3" className="mt-4">
                    Contenu du Tab 3
                  </TabsContent>
                </Tabs>
              </ComponentShowcase>

              <ComponentShowcase title="StepIndicator">
                <div className="flex flex-col gap-4">
                  <StepIndicator
                    totalSteps={4}
                    currentStep={currentStep}
                    labels={["Humeur", "Sommeil", "Médication", "Contexte"]}
                  />
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentStep(Math.max(1, currentStep - 1))
                      }
                    >
                      Précédent
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        setCurrentStep(Math.min(4, currentStep + 1))
                      }
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="PeriodSelector">
                <PeriodSelector value={period} onChange={setPeriod} />
              </ComponentShowcase>
            </UIKitSection>

            {/* Dialogs */}
            <UIKitSection
              id="dialogs"
              title="Dialogs"
              description="Modales : Dialog, AlertDialog, Sheet."
            >
              <ComponentShowcase title="Dialog">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Ouvrir Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog Title</DialogTitle>
                      <DialogDescription>
                        Description du dialog avec des informations
                        supplémentaires.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">Contenu du dialog.</div>
                    <DialogFooter>
                      <Button variant="outline">Annuler</Button>
                      <Button>Confirmer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </ComponentShowcase>

              <ComponentShowcase title="AlertDialog">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Supprimer</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Vos données seront
                        définitivement supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction>Confirmer</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ComponentShowcase>

              <ComponentShowcase title="Sheet">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Filter className="mr-2 size-4" />
                      Filtrer
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filtres</SheetTitle>
                      <SheetDescription>
                        Affinez votre recherche avec les filtres ci-dessous.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p>Contenu des filtres...</p>
                    </div>
                  </SheetContent>
                </Sheet>
              </ComponentShowcase>
            </UIKitSection>

            {/* Feedback */}
            <UIKitSection
              id="feedback"
              title="Feedback"
              description="Composants de feedback : Alert, Badge, Progress, Toast."
            >
              <ComponentShowcase title="Alert">
                <div className="flex flex-col gap-4">
                  <Alert>
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      Ceci est un message d&apos;information standard.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>
                      Une erreur s&apos;est produite. Veuillez réessayer.
                    </AlertDescription>
                  </Alert>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Badge">
                <div className="flex flex-wrap gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Progress">
                <div className="flex flex-col gap-4">
                  <Progress value={33} />
                  <Progress value={66} />
                  <Progress value={100} />
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="Toast">
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => toast.success("Enregistré avec succès !")}
                  >
                    Toast Success
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.error("Une erreur s'est produite")}
                  >
                    Toast Error
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info("Information")}
                  >
                    Toast Info
                  </Button>
                </div>
              </ComponentShowcase>
            </UIKitSection>

            {/* Medication */}
            <UIKitSection
              id="medication"
              title="Medication"
              description="Composants pour la gestion des médicaments."
            >
              <ComponentShowcase title="MedicationCard">
                <MedicationCard
                  name="Lithium"
                  dosageMg={400}
                  timeOfDay={["Matin", "Soir"]}
                  startDate="15/06/2023"
                  adherence={95}
                  onEdit={() => toast.info("Edit medication")}
                />
              </ComponentShowcase>

              <ComponentShowcase title="MedicationIntakeToggle">
                <div className="flex flex-col gap-2">
                  <MedicationIntakeToggle
                    name="Lithium"
                    dosage="400mg"
                    timeOfDay="matin"
                    taken={medicationTaken}
                    onChange={setMedicationTaken}
                  />
                  <MedicationIntakeToggle
                    name="Quetiapine"
                    dosage="100mg"
                    timeOfDay="soir"
                    taken={false}
                    onChange={() => toast.info("Toggle Quetiapine")}
                  />
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="MedicationChangeItem">
                <div className="flex flex-col gap-4">
                  <MedicationChangeItem
                    name="Lithium"
                    changeType="dose_increase"
                    previousDosage={300}
                    newDosage={400}
                    reason="Augmentation suite à consultation"
                    date="10 janvier 2024"
                  />
                  <MedicationChangeItem
                    name="Quetiapine"
                    changeType="started"
                    newDosage={100}
                    reason="Ajout pour améliorer le sommeil"
                    date="1 septembre 2023"
                  />
                  <MedicationChangeItem
                    name="Lamotrigine"
                    changeType="stopped"
                    reason="Arrêt progressif"
                    date="20 août 2023"
                  />
                </div>
              </ComponentShowcase>

              <ComponentShowcase title="AdherenceSummaryCard">
                <AdherenceSummaryCard percentage={92} period="30 jours" />
              </ComponentShowcase>
            </UIKitSection>

            {/* Timeline */}
            <ComponentShowcase title="TimelineEntry">
              <div className="flex flex-col gap-4">
                <TimelineEntry
                  date="lundi 15 janvier"
                  mood={2}
                  sleep={{ hours: 7.5 }}
                  tags={["Sport"]}
                  onClick={() => toast.info("Open entry")}
                />
                <TimelineEntry
                  date="dimanche 14 janvier"
                  mood={1}
                  sleep={{ hours: 6 }}
                />
                <TimelineEntry
                  date="samedi 13 janvier"
                  mood={0}
                  sleep={{ hours: 7 }}
                  tags={["Stress pro"]}
                />
              </div>
            </ComponentShowcase>

            {/* Settings */}
            <UIKitSection
              id="settings"
              title="Settings"
              description="Composants pour les pages de paramètres."
            >
              <ComponentShowcase title="SettingsSection">
                <SettingsSection
                  title="Préférences"
                  description="Personnalisez votre expérience"
                  icon={Settings}
                >
                  <SettingsRow
                    label="Mode sombre"
                    description="Activer le thème sombre"
                  >
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </SettingsRow>
                  <SettingsDivider />
                  <SettingsRow
                    label="Rappels quotidiens"
                    description="Recevoir un rappel pour le check-in"
                  >
                    <Switch
                      checked={reminders}
                      onCheckedChange={setReminders}
                    />
                  </SettingsRow>
                </SettingsSection>
              </ComponentShowcase>

              <ComponentShowcase title="SettingsRow Variants">
                <Card>
                  <CardContent className="py-4">
                    <SettingsRow
                      label="Changer le mot de passe"
                      onClick={() => toast.info("Open password dialog")}
                      showChevron
                    />
                    <SettingsDivider />
                    <SettingsRow
                      label="Exporter mes données"
                      onClick={() => toast.info("Export data")}
                      showChevron
                    />
                    <SettingsDivider />
                    <SettingsRow
                      label="Supprimer mon compte"
                      onClick={() => toast.error("Delete account dialog")}
                      destructive
                      showChevron
                    />
                  </CardContent>
                </Card>
              </ComponentShowcase>
            </UIKitSection>
          </div>
        </div>
      </main>
    </div>
  );
}
