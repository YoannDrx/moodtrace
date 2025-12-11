// MoodTrace Data Models

export type UserRole = 'patient' | 'caregiver';

export type DisorderType = 'bipolar' | 'adhd' | 'depression' | 'other' | 'unknown';

export type MoodValue = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export type SleepQuality = 'bad' | 'average' | 'good';

export type Visibility = 'patient_and_caregiver' | 'caregiver_only';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  disorderType: DisorderType;
  trackedVariables: string[];
  reminderTime?: string;
  caregivers: string[]; // caregiver user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface CaregiverProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  patients: string[]; // patient user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  doseMg: number;
  timesOfDay: ('morning' | 'noon' | 'evening' | 'night')[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationChange {
  id: string;
  medicationId: string;
  patientId: string;
  changeType: 'started' | 'stopped' | 'dose_increase' | 'dose_decrease';
  previousDose?: number;
  newDose?: number;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface MedicationIntake {
  medicationId: string;
  medicationName: string;
  taken: boolean;
  dose: number;
  time?: string;
}

export interface SideEffect {
  name: string;
  intensity: 1 | 2 | 3; // mild, moderate, severe
}

export interface DailyCheckin {
  id: string;
  patientId: string;
  date: Date;
  mood: MoodValue;
  energy: number; // 0-10
  anxiety: number; // 0-10
  sleepHours: number;
  sleepQuality: SleepQuality;
  medicationIntakes: MedicationIntake[];
  sideEffects: SideEffect[];
  tags: string[];
  significantEvent?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaregiverObservation {
  id: string;
  patientId: string;
  caregiverId: string;
  date: Date;
  perceivedMood: MoodValue;
  behaviors: string[];
  notes?: string;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface LifeEvent {
  id: string;
  patientId: string;
  date: Date;
  title: string;
  description?: string;
  category: 'health' | 'work' | 'family' | 'social' | 'other';
  impact: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
}

// UI Helper types
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const MOOD_LABELS: Record<MoodValue, string> = {
  [-3]: 'Très bas',
  [-2]: 'Bas',
  [-1]: 'Légèrement bas',
  [0]: 'Stable',
  [1]: 'Légèrement élevé',
  [2]: 'Élevé',
  [3]: 'Très élevé',
};

export const CONTEXT_TAGS = [
  'conflit',
  'stress_pro',
  'alcool',
  'soiree_tardive',
  'voyage',
  'sport',
  'meditation',
  'rdv_medical',
  'fatigue',
  'anxiete',
] as const;

export const SIDE_EFFECTS_OPTIONS = [
  'Maux de tête',
  'Nausées',
  'Tremblements',
  'Somnolence',
  'Insomnie',
  'Prise de poids',
  'Bouche sèche',
  'Vertiges',
] as const;

export const BEHAVIOR_TAGS = [
  'parle_vite',
  'isolement',
  'achats_impulsifs',
  'agitation',
  'irritabilite',
  'euphorie',
  'pleurs',
  'confusion',
] as const;
