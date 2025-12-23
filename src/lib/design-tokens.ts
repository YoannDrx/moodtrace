/**
 * MoodJournal Design Tokens
 *
 * Fichier central contenant TOUS les tokens de design.
 * Aucune valeur en dur dans le code - tout est centralisé ici.
 *
 * @see https://moodjournal.app
 */

// =============================================================================
// COULEURS
// =============================================================================

/**
 * Palette de couleurs MoodJournal
 *
 * Primary (Teal) : Confiance, calme, aspect médical
 * Secondary (Vert) : Guérison, progrès
 */
export const colors = {
  brand: {
    primary: {
      DEFAULT: "#0E7980",
      50: "#ECF4F5",
      100: "#D8EAEB",
      200: "#B2D4D6",
      300: "#8BBFC2",
      400: "#65A9AE",
      500: "#0E7980",
      600: "#0C6A71",
      700: "#0B5C61",
      800: "#094D52",
      900: "#073F43",
    },
    secondary: {
      DEFAULT: "#48A878",
      50: "#E9F5EF",
      100: "#D3EBDF",
      200: "#A7D7BF",
      300: "#7BC39F",
      400: "#4FAF7F",
      500: "#48A878",
      600: "#3A8660",
      700: "#2B6548",
      800: "#1D4330",
      900: "#0E2218",
    },
  },

  background: {
    light: "#FDFBF7",
    dark: "#1A1A1A",
    card: {
      light: "#FFFFFF",
      dark: "#2D2D2D",
    },
  },

  foreground: {
    light: "#1A202C",
    dark: "#F3F4F6",
    muted: {
      light: "#718096",
      dark: "#9CA3AF",
    },
  },

  semantic: {
    success: {
      DEFAULT: "#22C55E",
      foreground: "#FFFFFF",
      light: "#DCFCE7",
      dark: "#166534",
    },
    warning: {
      DEFAULT: "#F59E0B",
      foreground: "#FFFFFF",
      light: "#FEF3C7",
      dark: "#92400E",
    },
    destructive: {
      DEFAULT: "#EF4444",
      foreground: "#FFFFFF",
      light: "#FEE2E2",
      dark: "#991B1B",
    },
    info: {
      DEFAULT: "#3B82F6",
      foreground: "#FFFFFF",
      light: "#DBEAFE",
      dark: "#1E40AF",
    },
  },

  /**
   * Couleurs d'humeur (échelle 1-10)
   * Gradient du rouge/marron (très bas) au cyan (optimal)
   */
  mood: {
    1: "#7C2D12", // Très bas - marron rouge
    2: "#B91C1C", // Bas - rouge foncé
    3: "#DC2626", // Bas-moyen - rouge
    4: "#EA580C", // Moyen-bas - orange foncé
    5: "#F59E0B", // Moyen - orange/jaune
    6: "#84CC16", // Moyen-haut - vert lime
    7: "#22C55E", // Bon - vert
    8: "#10B981", // Très bon - émeraude
    9: "#14B8A6", // Excellent - teal
    10: "#06B6D4", // Optimal - cyan
  },

  /**
   * Couleurs pour les graphiques
   */
  chart: {
    1: "#0E7980", // Primary teal
    2: "#48A878", // Secondary green
    3: "#F59E0B", // Warning orange
    4: "#8B5CF6", // Violet
    5: "#EC4899", // Pink
  },

  border: {
    light: "#EDF2F7",
    dark: "#374151",
  },

  input: {
    light: "#EDF2F7",
    dark: "#4B5563",
  },
} as const;

// =============================================================================
// COULEURS OKLCH (pour CSS)
// =============================================================================

/**
 * Valeurs OKLch pour les variables CSS
 * Plus perceptuellement uniformes que HSL
 */
export const oklchColors = {
  light: {
    background: "oklch(0.98 0.01 95)", // #FDFBF7
    foreground: "oklch(0.25 0.02 250)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.25 0.02 250)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.25 0.02 250)",
    primary: "oklch(0.52 0.12 205)", // #0E7980
    primaryForeground: "oklch(1 0 0)",
    secondary: "oklch(0.65 0.13 155)", // #48A878
    secondaryForeground: "oklch(1 0 0)",
    muted: "oklch(0.96 0.005 85)",
    mutedForeground: "oklch(0.55 0.03 260)",
    accent: "oklch(0.92 0.03 195)",
    accentForeground: "oklch(0.25 0.02 250)",
    destructive: "oklch(0.55 0.2 25)",
    destructiveForeground: "oklch(1 0 0)",
    success: "oklch(0.65 0.2 145)",
    successForeground: "oklch(1 0 0)",
    warning: "oklch(0.75 0.15 75)",
    warningForeground: "oklch(0.2 0.05 75)",
    info: "oklch(0.6 0.15 250)",
    infoForeground: "oklch(1 0 0)",
    border: "oklch(0.9 0.005 250)",
    input: "oklch(0.9 0.005 250)",
    ring: "oklch(0.52 0.12 205)",
  },
  dark: {
    background: "oklch(0.18 0.01 250)", // #1A1A1A
    foreground: "oklch(0.92 0.01 250)",
    card: "oklch(0.22 0.01 250)",
    cardForeground: "oklch(0.92 0.01 250)",
    popover: "oklch(0.22 0.01 250)",
    popoverForeground: "oklch(0.92 0.01 250)",
    primary: "oklch(0.65 0.12 195)", // Plus lumineux en dark
    primaryForeground: "oklch(0.15 0.01 250)",
    secondary: "oklch(0.70 0.13 155)",
    secondaryForeground: "oklch(0.15 0.01 250)",
    muted: "oklch(0.25 0.01 250)",
    mutedForeground: "oklch(0.65 0.01 250)",
    accent: "oklch(0.30 0.02 195)",
    accentForeground: "oklch(0.92 0.01 250)",
    destructive: "oklch(0.55 0.2 25)",
    destructiveForeground: "oklch(1 0 0)",
    success: "oklch(0.65 0.2 145)",
    successForeground: "oklch(1 0 0)",
    warning: "oklch(0.75 0.15 75)",
    warningForeground: "oklch(0.2 0.05 75)",
    info: "oklch(0.6 0.15 250)",
    infoForeground: "oklch(1 0 0)",
    border: "oklch(0.30 0.01 250)",
    input: "oklch(0.30 0.01 250)",
    ring: "oklch(0.65 0.12 195)",
  },
  mood: {
    1: "oklch(0.35 0.12 30)",
    2: "oklch(0.45 0.2 25)",
    3: "oklch(0.55 0.2 25)",
    4: "oklch(0.60 0.18 45)",
    5: "oklch(0.75 0.15 85)",
    6: "oklch(0.70 0.18 125)",
    7: "oklch(0.65 0.17 145)",
    8: "oklch(0.65 0.14 165)",
    9: "oklch(0.65 0.12 185)",
    10: "oklch(0.70 0.13 195)",
  },
} as const;

// =============================================================================
// TYPOGRAPHIE
// =============================================================================

export const typography = {
  fontFamily: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "'Source Serif 4', Georgia, 'Times New Roman', serif",
    mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  },

  fontSize: {
    xs: { size: "0.75rem", lineHeight: "1rem" }, // 12px
    sm: { size: "0.875rem", lineHeight: "1.25rem" }, // 14px
    base: { size: "1rem", lineHeight: "1.5rem" }, // 16px
    lg: { size: "1.125rem", lineHeight: "1.75rem" }, // 18px
    xl: { size: "1.25rem", lineHeight: "1.75rem" }, // 20px
    "2xl": { size: "1.5rem", lineHeight: "2rem" }, // 24px
    "3xl": { size: "1.875rem", lineHeight: "2.25rem" }, // 30px
    "4xl": { size: "2.25rem", lineHeight: "2.5rem" }, // 36px
    "5xl": { size: "3rem", lineHeight: "1.1" }, // 48px
    "6xl": { size: "3.75rem", lineHeight: "1" }, // 60px
    "7xl": { size: "4.5rem", lineHeight: "1" }, // 72px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// =============================================================================
// ESPACEMENT
// =============================================================================

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: "0",
  sm: "0.25rem", // 4px
  DEFAULT: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  full: "9999px",
} as const;

// =============================================================================
// OMBRES
// =============================================================================

export const shadows = {
  none: "none",
  "2xs": "0 1px 2px 0 rgb(0 0 0 / 0.03)",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

export const animations = {
  duration: {
    fastest: "50ms",
    faster: "100ms",
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    slowest: "700ms",
  },

  easing: {
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    // Easing personnalisés pour MoodJournal
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  },

  keyframes: {
    fadeIn: {
      from: { opacity: "0" },
      to: { opacity: "1" },
    },
    fadeOut: {
      from: { opacity: "1" },
      to: { opacity: "0" },
    },
    slideUp: {
      from: { transform: "translateY(10px)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },
    slideDown: {
      from: { transform: "translateY(-10px)", opacity: "0" },
      to: { transform: "translateY(0)", opacity: "1" },
    },
    scaleIn: {
      from: { transform: "scale(0.95)", opacity: "0" },
      to: { transform: "scale(1)", opacity: "1" },
    },
    pulse: {
      "0%, 100%": { opacity: "1" },
      "50%": { opacity: "0.5" },
    },
  },
} as const;

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// =============================================================================
// Z-INDEX
// =============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// =============================================================================
// CONTAINERS
// =============================================================================

export const containers = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  "8xl": "112rem",
  "9xl": "120rem",
  "10xl": "128rem",
} as const;

// =============================================================================
// COMPOSANTS
// =============================================================================

/**
 * Tokens spécifiques aux composants
 */
export const components = {
  button: {
    height: {
      sm: "2rem", // 32px
      DEFAULT: "2.25rem", // 36px
      lg: "2.5rem", // 40px
    },
    padding: {
      sm: { x: "0.75rem", y: "0.25rem" },
      DEFAULT: { x: "1rem", y: "0.5rem" },
      lg: { x: "1.5rem", y: "0.75rem" },
    },
    iconSize: {
      sm: "1rem", // 16px
      DEFAULT: "1.25rem", // 20px
      lg: "1.5rem", // 24px
    },
  },

  input: {
    height: {
      sm: "2rem", // 32px
      DEFAULT: "2.25rem", // 36px
      lg: "2.5rem", // 40px
    },
    padding: {
      x: "0.75rem",
      y: "0.5rem",
    },
  },

  card: {
    padding: {
      sm: "1rem",
      DEFAULT: "1.5rem",
      lg: "2rem",
    },
    borderRadius: "0.75rem", // lg
  },

  sidebar: {
    width: {
      collapsed: "4rem", // 64px
      expanded: "16rem", // 256px
    },
  },

  header: {
    height: "4rem", // 64px
  },

  moodIndicator: {
    size: {
      sm: "1.5rem", // 24px
      DEFAULT: "2rem", // 32px
      lg: "2.5rem", // 40px
      xl: "3rem", // 48px
    },
  },
} as const;

// =============================================================================
// EXPORTS UTILITAIRES
// =============================================================================

/**
 * Récupère la couleur d'humeur par valeur (1-10)
 */
export function getMoodColor(value: number): string {
  const clampedValue = Math.max(1, Math.min(10, Math.round(value)));
  return colors.mood[clampedValue as keyof typeof colors.mood];
}

/**
 * Récupère la couleur OKLch d'humeur par valeur (1-10)
 */
export function getMoodOklchColor(value: number): string {
  const clampedValue = Math.max(1, Math.min(10, Math.round(value)));
  return oklchColors.mood[clampedValue as keyof typeof oklchColors.mood];
}

/**
 * Type pour les valeurs d'humeur valides
 */
export type MoodValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Labels pour les niveaux d'humeur (échelle 1-10)
 */
export const moodLabels: Record<MoodValue, string> = {
  1: "Très difficile",
  2: "Difficile",
  3: "Assez difficile",
  4: "Plutôt bas",
  5: "Neutre",
  6: "Correct",
  7: "Bien",
  8: "Très bien",
  9: "Excellent",
  10: "Optimal",
};

// =============================================================================
// ÉCHELLE D'HUMEUR BIPOLAIRE (-3 à +3)
// =============================================================================

/**
 * Type pour les valeurs d'humeur bipolaires (-3 à +3)
 * Centrée sur 0 (stable), avec valeurs négatives et positives
 */
export type MoodValueBipolar = -3 | -2 | -1 | 0 | 1 | 2 | 3;

/**
 * Couleurs d'humeur bipolaires (-3 à +3)
 * -3: Rouge (très bas/dépressif)
 * -2: Orange foncé
 * -1: Orange
 *  0: Vert (stable)
 * +1: Jaune/Or
 * +2: Cyan clair
 * +3: Violet (très élevé/maniaque)
 */
export const moodBipolarColors = {
  "-3": "#DC2626", // Rouge vif - très bas
  "-2": "#EA580C", // Orange foncé
  "-1": "#F59E0B", // Orange/Ambre
  "0": "#22C55E", // Vert - stable
  "1": "#EAB308", // Jaune/Or
  "2": "#06B6D4", // Cyan
  "3": "#8B5CF6", // Violet - très élevé
} as const;

/**
 * Couleurs OKLch pour mood bipolaire
 */
export const moodBipolarOklchColors = {
  "-3": "oklch(0.55 0.22 25)", // Rouge
  "-2": "oklch(0.60 0.18 45)", // Orange foncé
  "-1": "oklch(0.75 0.15 75)", // Orange/Ambre
  "0": "oklch(0.65 0.20 145)", // Vert stable
  "1": "oklch(0.80 0.17 95)", // Jaune/Or
  "2": "oklch(0.70 0.13 195)", // Cyan
  "3": "oklch(0.60 0.18 295)", // Violet
} as const;

/**
 * Labels pour mood bipolaire (FR)
 */
export const moodBipolarLabels: Record<MoodValueBipolar, string> = {
  "-3": "Très bas",
  "-2": "Bas",
  "-1": "Légèrement bas",
  "0": "Stable",
  "1": "Légèrement élevé",
  "2": "Élevé",
  "3": "Très élevé",
};

/**
 * Labels pour mood bipolaire (EN)
 */
export const moodBipolarLabelsEn: Record<MoodValueBipolar, string> = {
  "-3": "Very low",
  "-2": "Low",
  "-1": "Slightly low",
  "0": "Stable",
  "1": "Slightly elevated",
  "2": "Elevated",
  "3": "Very elevated",
};

/**
 * Récupère la couleur d'humeur bipolaire par valeur (-3 à +3)
 */
export function getMoodBipolarColor(value: MoodValueBipolar): string {
  return moodBipolarColors[String(value) as keyof typeof moodBipolarColors];
}

/**
 * Récupère la couleur OKLch d'humeur bipolaire par valeur (-3 à +3)
 */
export function getMoodBipolarOklchColor(value: MoodValueBipolar): string {
  return moodBipolarOklchColors[
    String(value) as keyof typeof moodBipolarOklchColors
  ];
}

/**
 * Récupère le label d'humeur bipolaire par valeur (-3 à +3)
 */
export function getMoodBipolarLabel(
  value: MoodValueBipolar,
  locale: "fr" | "en" = "fr",
): string {
  return locale === "en"
    ? moodBipolarLabelsEn[value]
    : moodBipolarLabels[value];
}

// =============================================================================
// TAGS & OPTIONS PRÉDÉFINIS
// =============================================================================

/**
 * Tags de contexte pour le check-in quotidien
 */
export const contextTags = [
  "conflit",
  "stress_pro",
  "alcool",
  "soiree_tardive",
  "voyage",
  "sport",
  "meditation",
  "rdv_medical",
  "fatigue",
  "anxiete",
] as const;

export type ContextTag = (typeof contextTags)[number];

/**
 * Labels pour les tags de contexte (FR)
 */
export const contextTagLabels: Record<ContextTag, string> = {
  conflit: "Conflit",
  stress_pro: "Stress pro",
  alcool: "Alcool",
  soiree_tardive: "Soirée tardive",
  voyage: "Voyage",
  sport: "Sport",
  meditation: "Méditation",
  rdv_medical: "RDV médical",
  fatigue: "Fatigue",
  anxiete: "Anxiété",
};

/**
 * Labels pour les tags de contexte (EN)
 */
export const contextTagLabelsEn: Record<ContextTag, string> = {
  conflit: "Conflict",
  stress_pro: "Work stress",
  alcool: "Alcohol",
  soiree_tardive: "Late night",
  voyage: "Travel",
  sport: "Exercise",
  meditation: "Meditation",
  rdv_medical: "Medical appointment",
  fatigue: "Fatigue",
  anxiete: "Anxiety",
};

/**
 * Effets secondaires des médicaments
 */
export const sideEffects = [
  "maux_de_tete",
  "nausees",
  "tremblements",
  "somnolence",
  "insomnie",
  "prise_de_poids",
  "bouche_seche",
  "vertiges",
] as const;

export type SideEffect = (typeof sideEffects)[number];

/**
 * Labels pour les effets secondaires (FR)
 */
export const sideEffectLabels: Record<SideEffect, string> = {
  maux_de_tete: "Maux de tête",
  nausees: "Nausées",
  tremblements: "Tremblements",
  somnolence: "Somnolence",
  insomnie: "Insomnie",
  prise_de_poids: "Prise de poids",
  bouche_seche: "Bouche sèche",
  vertiges: "Vertiges",
};

/**
 * Labels pour les effets secondaires (EN)
 */
export const sideEffectLabelsEn: Record<SideEffect, string> = {
  maux_de_tete: "Headache",
  nausees: "Nausea",
  tremblements: "Tremors",
  somnolence: "Drowsiness",
  insomnie: "Insomnia",
  prise_de_poids: "Weight gain",
  bouche_seche: "Dry mouth",
  vertiges: "Dizziness",
};

/**
 * Qualités de sommeil
 */
export type SleepQuality = "bad" | "average" | "good";

/**
 * Labels pour la qualité de sommeil (FR)
 */
export const sleepQualityLabels: Record<SleepQuality, string> = {
  bad: "Mauvais",
  average: "Moyen",
  good: "Bon",
};

/**
 * Labels pour la qualité de sommeil (EN)
 */
export const sleepQualityLabelsEn: Record<SleepQuality, string> = {
  bad: "Bad",
  average: "Average",
  good: "Good",
};

// =============================================================================
// CAREGIVER EVENT TYPES
// =============================================================================

/**
 * Types d'événements signalés par les aidants
 */
export type EventType =
  | "compulsive_purchase"
  | "crisis"
  | "conflict"
  | "milestone"
  | "medication_issue"
  | "other";

/**
 * Tokens visuels pour les types d'événements
 * Inclut l'icône Lucide et la couleur associée
 */
export const eventTypeTokens: Record<
  EventType,
  { icon: string; color: string; bgColor: string }
> = {
  compulsive_purchase: {
    icon: "ShoppingCart",
    color: "#EA580C", // Orange
    bgColor: "#FFF7ED", // Orange light bg
  },
  crisis: {
    icon: "AlertTriangle",
    color: "#DC2626", // Red
    bgColor: "#FEE2E2", // Red light bg
  },
  conflict: {
    icon: "Swords",
    color: "#CA8A04", // Yellow/amber
    bgColor: "#FEF9C3", // Yellow light bg
  },
  milestone: {
    icon: "Star",
    color: "#2563EB", // Blue
    bgColor: "#DBEAFE", // Blue light bg
  },
  medication_issue: {
    icon: "Pill",
    color: "#7C3AED", // Purple
    bgColor: "#EDE9FE", // Purple light bg
  },
  other: {
    icon: "MoreHorizontal",
    color: "#6B7280", // Gray
    bgColor: "#F3F4F6", // Gray light bg
  },
} as const;

/**
 * Récupère les tokens visuels pour un type d'événement
 */
export function getEventTypeTokens(type: EventType) {
  return eventTypeTokens[type];
}

// =============================================================================
// SEVERITY LEVELS
// =============================================================================

/**
 * Niveaux de sévérité pour les événements (1-5)
 */
export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Tokens visuels pour les niveaux de sévérité
 */
export const severityTokens: Record<
  SeverityLevel,
  { color: string; bgColor: string }
> = {
  1: {
    color: "#22C55E", // Green - minor
    bgColor: "#DCFCE7",
  },
  2: {
    color: "#84CC16", // Lime - moderate
    bgColor: "#ECFCCB",
  },
  3: {
    color: "#F59E0B", // Amber - significant
    bgColor: "#FEF3C7",
  },
  4: {
    color: "#EA580C", // Orange - serious
    bgColor: "#FFEDD5",
  },
  5: {
    color: "#DC2626", // Red - critical
    bgColor: "#FEE2E2",
  },
} as const;

/**
 * Récupère les tokens visuels pour un niveau de sévérité
 */
export function getSeverityTokens(level: SeverityLevel) {
  return severityTokens[level];
}

// =============================================================================
// CAREGIVER OBSERVATION FIELDS
// =============================================================================

/**
 * Options pour l'humeur observée par l'aidant
 */
export type MoodObserved =
  | "very_good"
  | "good"
  | "neutral"
  | "down"
  | "very_down"
  | "concerning";

/**
 * Tokens visuels pour l'humeur observée
 */
export const moodObservedTokens: Record<
  MoodObserved,
  { color: string; bgColor: string }
> = {
  very_good: { color: "#06B6D4", bgColor: "#CFFAFE" },
  good: { color: "#22C55E", bgColor: "#DCFCE7" },
  neutral: { color: "#6B7280", bgColor: "#F3F4F6" },
  down: { color: "#F59E0B", bgColor: "#FEF3C7" },
  very_down: { color: "#EA580C", bgColor: "#FFEDD5" },
  concerning: { color: "#DC2626", bgColor: "#FEE2E2" },
} as const;

/**
 * Options pour l'énergie observée par l'aidant
 */
export type EnergyObserved = "high" | "normal" | "low" | "very_low";

/**
 * Tokens visuels pour l'énergie observée
 */
export const energyObservedTokens: Record<
  EnergyObserved,
  { color: string; bgColor: string }
> = {
  high: { color: "#06B6D4", bgColor: "#CFFAFE" },
  normal: { color: "#22C55E", bgColor: "#DCFCE7" },
  low: { color: "#F59E0B", bgColor: "#FEF3C7" },
  very_low: { color: "#DC2626", bgColor: "#FEE2E2" },
} as const;

/**
 * Options pour le comportement social observé
 */
export type SocialBehavior = "engaged" | "normal" | "withdrawn" | "isolated";

/**
 * Tokens visuels pour le comportement social
 */
export const socialBehaviorTokens: Record<
  SocialBehavior,
  { color: string; bgColor: string }
> = {
  engaged: { color: "#06B6D4", bgColor: "#CFFAFE" },
  normal: { color: "#22C55E", bgColor: "#DCFCE7" },
  withdrawn: { color: "#F59E0B", bgColor: "#FEF3C7" },
  isolated: { color: "#DC2626", bgColor: "#FEE2E2" },
} as const;

/**
 * Options pour le sommeil observé
 */
export type SleepObserved = "good" | "restless" | "insomnia" | "oversleeping";

/**
 * Tokens visuels pour le sommeil observé
 */
export const sleepObservedTokens: Record<
  SleepObserved,
  { color: string; bgColor: string }
> = {
  good: { color: "#22C55E", bgColor: "#DCFCE7" },
  restless: { color: "#F59E0B", bgColor: "#FEF3C7" },
  insomnia: { color: "#EA580C", bgColor: "#FFEDD5" },
  oversleeping: { color: "#7C3AED", bgColor: "#EDE9FE" },
} as const;

/**
 * Options de visibilité patient
 */
export type PatientVisibility = "visible" | "hidden";

/**
 * Tokens visuels pour la visibilité
 */
export const patientVisibilityTokens: Record<
  PatientVisibility,
  { icon: string; color: string }
> = {
  visible: { icon: "Eye", color: "#22C55E" },
  hidden: { icon: "EyeOff", color: "#6B7280" },
} as const;
