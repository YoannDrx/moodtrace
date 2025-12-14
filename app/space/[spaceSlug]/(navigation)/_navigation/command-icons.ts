import type { LucideIcon } from "lucide-react";
import { Eye, Heart, Pill, Users } from "lucide-react";

export const COMMAND_ICONS: Record<string, LucideIcon> = {
  member: Users,
  caregiver: Users,
  mood: Heart,
  medication: Pill,
  observation: Eye,
} as const;
