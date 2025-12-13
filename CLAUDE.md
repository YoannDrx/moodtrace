# AGENTS.md

This file provides guidance to AI Agents.

## About MoodTrace

**MoodTrace** est une application web PWA de suivi de santé mentale conçue pour les personnes atteintes de troubles de l'humeur (bipolaire, dépression, TDAH, anxiété).

### Mission

Permettre aux patients de suivre objectivement l'évolution de leur traitement médicamenteux et son impact sur leur humeur, afin d'optimiser leur parcours de soins en collaboration avec leur médecin.

### Claim

> "Medication-aware mood tracker" - Pas juste un mood tracker, mais un outil qui corrèle médication et bien-être.

### Fonctionnalités Principales

**MVP (Phase 1)** :
- Suivi quotidien d'humeur (échelle 1-10, énergie, sommeil)
- Gestion des médicaments (nom, dosage, fréquence, adhérence)
- Timeline des changements de dosage
- Dashboard trends (7/30 jours)
- Rôle aidant (observations externes)
- Export PDF pour consultations
- Ressources de crise

**Phase 2** :
- Corrélations (sommeil/humeur, médication/humeur)
- Détection de patterns
- Notifications/rappels
- Wearables (Apple Health, Google Fit)
- Freemium avec Stripe

**Phase 3** :
- Dashboard clinicien
- Questionnaires standardisés (PHQ-9)
- Multi-organisation B2B

### Cibles Utilisateurs

| Segment | Description | Pricing |
|---------|-------------|---------|
| Patient | Personne suivie pour trouble de l'humeur | Free / Pro 4.99€/mois |
| Aidant | Proche aidant (famille, ami) | Gratuit |
| Clinicien | Psychiatre, psychologue (Phase 3) | 29-99€/mois |

### Positionnement Marché

**Concurrents** :
- Bearable : Symptom tracker générique, pas focalisé médication
- eMoods : Simple mais basique, pas d'aidant
- Daylio : Journal d'humeur, pas de suivi médical

**Différenciation MoodTrace** :
- Focus médication + corrélations
- Rôle aidant intégré
- Export médical structuré
- Avant/après changement de traitement

### Avertissements Légaux (YMYL)

MoodTrace est un **outil de suivi**, PAS un dispositif médical.
- Ne fournit PAS de diagnostic
- Ne recommande PAS d'ajustement de traitement
- Toute décision médicale doit être prise avec un professionnel de santé

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm ts` - Run TypeScript type checking
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm lint:ci` - Run ESLint without auto-fix for CI
- `pnpm clean` - Run lint, type check, and format code
- `pnpm format` - Format code with Prettier

### Testing Commands

**CRITICAL - ALWAYS use CI commands for testing (non-interactive mode):**

- **ALWAYS run `pnpm test:ci`** - Run unit tests in CI mode (located in `__tests__/`)
- **ALWAYS run `pnpm test:e2e:ci`** - Run e2e tests in CI mode (headless) (located in `e2e/`)

**NEVER run these interactive commands:**

- **NEVER** `pnpm test` - Interactive mode (not compatible with Claude Code)
- **NEVER** `pnpm test:e2e` - Interactive mode (not compatible with Claude Code)

### Database Commands

- `pnpm prisma:seed` - Seed the database
- `pnpm better-auth:migrate` - Generate better-auth Prisma schema

### Development Tools

- `pnpm email` - Email development server
- `pnpm stripe-webhooks` - Listen for Stripe webhooks
- `pnpm knip` - Run knip for unused code detection

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 with Shadcn/UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with organization support
- **Forms**: TanStack Form with Zod validation (~~React Hook Form~~ deprecated)
- **Email**: React Email with Resend
- **Payments**: Stripe integration
- **Testing**: Vitest for unit tests, Playwright for e2e
- **Package Manager**: pnpm

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `src/components/` - UI components (Shadcn/UI in `ui/`, custom in `nowts/`)
- `src/features/` - Feature-specific components and logic
- `src/lib/` - Utilities, configurations, and services
- `src/hooks/` - Custom React hooks
- `emails/` - Email templates using React Email
- `prisma/` - Database schema and migrations
- `e2e/` - End-to-end tests
- `__tests__/` - Unit tests

### Key Features

- **Multi-tenant Organizations**: Full organization management with roles and permissions
- **Authentication**: Email/password, magic links, OAuth (GitHub, Google)
- **Billing**: Stripe subscriptions with plan management
- **Dialog System**: Global dialog manager for modals and confirmations
- **Forms**: TanStack Form with Zod validation and server actions
- **Email System**: Transactional emails with React Email

### Domain Models (MoodTrace)

Les modèles Prisma spécifiques à MoodTrace :

**MoodEntry** - Entrée quotidienne d'humeur
```prisma
model MoodEntry {
  id              String   @id @default(cuid())
  userId          String
  organizationId  String
  date            DateTime @db.Date
  mood            Int      // 1-10
  energy          Int?     // 1-10
  sleepHours      Float?
  sleepQuality    Int?     // 1-10
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId, date])
}
```

**Medication** - Médicament du patient
```prisma
model Medication {
  id              String    @id @default(cuid())
  userId          String
  organizationId  String
  name            String    // "Lamictal"
  molecule        String?   // "Lamotrigine"
  dosageMg        Int
  frequency       String    // "daily", "twice_daily", "as_needed"
  timeOfDay       String?   // "morning", "evening", "both"
  startDate       DateTime  @db.Date
  endDate         DateTime? @db.Date
  isActive        Boolean   @default(true)
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user         User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  intakes      MedicationIntake[]
  changes      MedicationChange[]

  @@index([userId, isActive])
}
```

**MedicationIntake** - Prise quotidienne
```prisma
model MedicationIntake {
  id            String   @id @default(cuid())
  userId        String
  medicationId  String
  date          DateTime @db.Date
  plannedTime   String?  // "08:00"
  takenTime     String?  // "08:15" ou null si non pris
  status        String   // "taken", "missed", "delayed"
  notes         String?
  createdAt     DateTime @default(now())

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  medication Medication @relation(fields: [medicationId], references: [id], onDelete: Cascade)

  @@unique([medicationId, date])
  @@index([userId, date])
}
```

**MedicationChange** - Historique changements dosage
```prisma
model MedicationChange {
  id               String   @id @default(cuid())
  medicationId     String
  previousDosageMg Int
  newDosageMg      Int
  changeDate       DateTime @db.Date
  reason           String?  // "augmentation palier", "effet secondaire"
  createdAt        DateTime @default(now())

  medication Medication @relation(fields: [medicationId], references: [id], onDelete: Cascade)

  @@index([medicationId, changeDate])
}
```

**CaregiverObservation** - Observation de l'aidant
```prisma
model CaregiverObservation {
  id              String   @id @default(cuid())
  caregiverId     String   // User ID de l'aidant
  patientId       String   // User ID du patient
  organizationId  String
  date            DateTime @db.Date
  moodObservation String   // "good", "neutral", "down", "concerning"
  notes           String?
  isPrivate       Boolean  @default(false)
  createdAt       DateTime @default(now())

  caregiver    User         @relation("CaregiverObservations", fields: [caregiverId], references: [id], onDelete: Cascade)
  patient      User         @relation("PatientObservations", fields: [patientId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([patientId, date])
}
```

## Code Conventions

### TypeScript

- Use `type` over `interface` (enforced by ESLint)
- Prefer functional components with TypeScript types
- No enums - use maps instead
- Strict TypeScript configuration

### React/Next.js

- Prefer React Server Components over client components
- Use `"use client"` only for Web API access in small components
- Wrap client components in `Suspense` with fallback
- Use dynamic loading for non-critical components
- **ALWAYS use the global `PageProps<"/route/path">` type for page components** - NEVER create local `PageProps` type definitions
  - Example: `export default async function MyPage(props: PageProps<"/admin/users">) {}`

### Styling

- Mobile-first approach with TailwindCSS
- Use Shadcn/UI components from `src/components/ui/`
- Custom components in `src/components/nowts/`

### Styling preferences

- Use the shared typography components in `@src/components/ui/typography.tsx` for paragraphs and headings (instead of creating custom `p`, `h1`, `h2`, etc.).
- For spacing, prefer utility layouts like `flex flex-col gap-4` for vertical spacing and `flex gap-4` for horizontal spacing (instead of `space-y-4`).
- Prefer the card container `@src/components/ui/card.tsx` for styled wrappers rather than adding custom styles directly to `<div>` elements.

### State Management

- Use `nuqs` for URL search parameter state
- Zustand for global state (see dialog-store.ts)
- TanStack Query for server state

### Internationalization (i18n)

MoodTrace supporte Français et Anglais via next-intl.

**Structure** :
```
/messages
  ├── fr.json
  └── en.json
```

**Usage** :
```tsx
import { useTranslations } from 'next-intl';

export function MoodLogger() {
  const t = useTranslations('mood');
  return <h1>{t('title')}</h1>; // "Comment vous sentez-vous ?" / "How are you feeling?"
}
```

**Conventions** :
- Clés en snake_case : `mood.entry_saved`
- Grouper par feature : `mood.*`, `medication.*`, `caregiver.*`
- Fallback anglais si traduction manquante

### Forms and Server Actions

**CRITICAL**: Use TanStack Form for ALL forms - ~~React Hook Form~~ is deprecated

- Use `useForm` from `@/features/form/tanstack-form.tsx` with Zod validation
- Use `Form` wrapper component for form submission handling
- Use `form.AppField` for field binding with built-in components (Input, Select, Textarea, Checkbox, Switch)
- Server actions in `.action.ts` files
- Use `resolveActionResult` helper for mutations

**Example pattern:**
```tsx
const form = useForm({
  schema: z.object({ email: z.string().email() }),
  defaultValues: { email: '' },
  onSubmit: async (values) => { /* handle submit */ },
})

<Form form={form}>
  <form.AppField name="email">
    {(field) => (
      <field.Field>
        <field.Label>Email</field.Label>
        <field.Content>
          <field.Input type="email" />
          <field.Message />
        </field.Content>
      </field.Field>
    )}
  </form.AppField>
  <form.SubmitButton>Submit</form.SubmitButton>
</Form>
```

### Authentication

- Use `getUser()` for optional user (server-side)
- Use `getRequiredUser()` for required user (server-side)
- Use `useSession()` from auth-client.ts (client-side)
- Use `getCurrentOrgCache()` to get the current org

### Database

- Prisma ORM with PostgreSQL
- Database hooks for user creation setup
- Organization-based data access patterns

### Dialog System

- Use `dialogManager` for global modals
- Types: confirm, input, custom dialogs
- Automatic loading states and error handling

## Testing

### Unit Tests

- Located in `__tests__/` directory
- Use Vitest with React Testing Library
- Mock extended with `vitest-mock-extended`

### E2E Tests

- Located in `e2e/` directory
- Use Playwright with custom test utilities
- Helper functions in `e2e/utils/`

## Important Files

- `src/lib/auth.ts` - Authentication configuration
- `src/features/dialog-manager/` - Global dialog system
- `src/lib/actions/actions-utils.ts` - Server action utilities
- `src/features/form/tanstack-form.tsx` - TanStack Form components (useForm, Form, field components)
- `src/site-config.ts` - Site configuration
- `src/lib/actions/safe-actions.ts` - All Server Action SHOULD use this logic
- `src/lib/zod-route.ts` - All Next.js route (inside the folder `/app/api` and name `route.ts`) SHOULD use this logic

### Database Schemas

- `prisma/schema/schema.prisma` - Main database schema
- `prisma/schema/better-auth.prisma` - Better Auth schema (auto-generated)

## Development Notes

- Always use `pnpm` for package management
- Use TypeScript strict mode - no `any` types
- Prefer server components and avoid unnecessary client-side state
- Prefer using `??` than `||`
- All API Route SHOULD use @src/lib/zod-route.ts, each file name `route.ts` should use Zod Route. ALWAYS READ zod-route.ts before creating any routes.
- All API Request SHOULD use @src/lib/up-fetch.ts and NEVER use `fetch`

## Files naming

- All server actions should be suffix by `.action.ts` eg. `user.action.ts`, `dashboard.action.ts`

## Debugging and complexe tasks

- For complexe logic and debugging, use logs. Add a lot of logs at each steps and ASK ME TO SEND YOU the logs so you can debugs easily.

## TypeScript imports

Important, when you import thing try to always use TypeScript paths :

- `@/*` is link to @src
- `@email/*` is link to @emails
- `@app/*` is link to @app

## Workflow modification

🚨 **CRITICAL RULE - ALWAYS FOLLOW THIS** 🚨

**BEFORE editing any files, you MUST Read at least 3 files** that will help you to understand how to make a coherent and consistency.

This is **NON-NEGOTIABLE**. Do not skip this step under any circumstances. Reading existing files ensures:

- Code consistency with project patterns
- Proper understanding of conventions
- Following established architecture
- Avoiding breaking changes

**Types of files you MUST read:**

1. **Similar files**: Read files that do similar functionality to understand patterns and conventions
2. **Imported dependencies**: Read the definition/implementation of any imports you're not 100% sure how to use correctly - understand their API, types, and usage patterns

**Steps to follow:**

1. Read at least 3 relevant existing files (similar functionality + imported dependencies)
2. Understand the patterns, conventions, and API usage
3. Only then proceed with creating/editing files

## UI / UX experiences

- Never use emojis (prefer Lucide Icon for illustration)
- Never use gradients unless explicitly asked by user
