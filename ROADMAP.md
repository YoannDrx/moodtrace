# MoodTrace Roadmap

> Medication-aware mood tracker pour le suivi de santé mentale

---

## Vision

Devenir l'outil de référence pour les patients atteints de troubles de l'humeur qui souhaitent suivre objectivement l'impact de leur traitement médicamenteux.

**Année 1** : 5,000 utilisateurs, 500 Pro, validation PMF
**Année 2** : 50,000 utilisateurs, premiers clients cliniques, €400k ARR

---

## Phase 1 : MVP (8-10 semaines)

### Objectif

Lancer une version fonctionnelle permettant le tracking quotidien humeur + médication.

### Métriques de Succès

- 500 inscriptions
- 100 utilisateurs actifs quotidiens
- 50% rétention J7
- NPS > 30

### Features

#### Core Tracking

- [ ] Modèle Prisma MoodEntry
- [ ] Page daily log : mood slider (1-10) + energy + sleep
- [ ] Notes libres optionnelles
- [ ] Historique des entrées (liste + calendrier)

#### Médication

- [ ] Modèle Prisma Medication + MedicationIntake
- [ ] CRUD médicaments (nom, dosage, fréquence)
- [ ] Checkbox "pris aujourd'hui"
- [ ] Timeline changements dosage (MedicationChange)
- [ ] Vue avant/après changement (comparaison simple)

#### Aidant

- [ ] Invitation aidant par email (Better Auth member)
- [ ] Modèle CaregiverObservation
- [ ] Formulaire observation (mood perçu + notes)
- [ ] Vue patient des observations aidant

#### Dashboard

- [ ] Trend humeur 7/30 jours (Recharts line chart)
- [ ] Adhérence médication (% ce mois)
- [ ] Résumé semaine (meilleur/pire jour)

#### Export

- [ ] PDF simple : période + graphique + notes clés
- [ ] Download pour consultation médecin

#### Sécurité & Légal

- [ ] Page ressources crise (3114, SOS Amitié, etc.)
- [ ] Disclaimer ToS : outil de suivi, pas dispositif médical
- [ ] RGPD : export données, suppression compte

#### i18n

- [ ] Setup next-intl
- [ ] Traductions FR/EN pour toutes les pages

### Non-inclus (reporté)

- Corrélations automatiques
- Notifications/rappels
- Wearables
- Templates par condition
- Stripe/paiements

### Tech Tasks

- [ ] Prisma migrations (5 tables)
- [ ] API routes CRUD (/api/orgs/[orgId]/moods, medications)
- [ ] Server actions mood.action.ts, medication.action.ts
- [ ] Components : MoodSlider, MedicationCard, MoodChart
- [ ] Pages : /orgs/[slug]/mood, /orgs/[slug]/medications

---

## Phase 2 : Traction & Analytics (12 semaines)

### Objectif

Valider le product-market fit avec des insights différenciants et monétiser.

### Métriques de Succès

- 5,000 utilisateurs
- 200 abonnés Pro
- €1,000 MRR
- Rétention M1 > 40%

### Features

#### Corrélations & Insights

- [ ] Sleep → mood (corrélation next day)
- [ ] Med adherence → mood trend
- [ ] Algorithme simple (moyenne mobile, pas ML)
- [ ] UI "Insight cards" sur dashboard

#### Patterns

- [ ] Détection patterns hebdo (lundi vs dimanche)
- [ ] Trends mensuels (amélioration/dégradation)
- [ ] Alerte douce si pattern négatif

#### Tracking Avancé

- [ ] Symptômes (20 checkboxes + sévérité)
- [ ] Effets secondaires médicaments
- [ ] Events/triggers (stress, conflit, etc.)
- [ ] Tags personnalisés

#### Wearables

- [ ] Apple HealthKit (sleep, heart rate, steps)
- [ ] Google Fit API
- [ ] Import automatique nuit précédente

#### Notifications

- [ ] Rappels prise médicament (PWA push)
- [ ] Rappels check-in humeur (matin/soir)
- [ ] Paramétrage horaires utilisateur

#### Monétisation

- [ ] Stripe checkout integration
- [ ] Plan Pro : €4.99/mois ou €49/an
- [ ] Features Pro : analytics, historique illimité, export

### Tech Tasks

- [ ] Tables : Symptom, Event, WearableSync
- [ ] Cron jobs : daily correlation calc
- [ ] Stripe webhooks extension
- [ ] PWA push notifications setup

---

## Phase 3 : B2B Launch (12 semaines)

### Objectif

Ouvrir le marché B2B avec cliniciens et organisations.

### Métriques de Succès

- 500 abonnés Pro B2C
- 10 clients Clinic
- 2 pilots Employer
- €4,000 MRR

### Features

#### Dashboard Clinicien

- [ ] Rôle "clinician" dans permissions
- [ ] Vue patients (read-only)
- [ ] Pré-visite summary
- [ ] Notes cliniques (visibles patient)

#### Questionnaires Standardisés

- [ ] PHQ-9 (dépression)
- [ ] BDII (manie bipolaire)
- [ ] Auto-administration avant RDV
- [ ] Historique scores

#### Organisation Avancée

- [ ] Multi-patients par clinicien
- [ ] Facturation organisation (Stripe)
- [ ] Dashboard admin clinic
- [ ] Bulk patient invite

#### Caregiver Avancé

- [ ] 4 tiers : family, clinical, therapist, emergency
- [ ] Notes privées (non visibles patient)
- [ ] Messaging in-app
- [ ] Check-in hebdo guidé

### Pricing B2B

- Clinic Solo : €29/mois (jusqu'à 20 patients)
- Clinic Pro : €99/mois (illimité)
- Employer : €1.50/employé/mois

---

## Phase 4+ : Scale (6+ mois)

### Features Futures

- [ ] Apps natives (React Native)
- [ ] AI insights (patterns complexes)
- [ ] Multi-langue (ES, DE, IT)
- [ ] API publique pour intégrations
- [ ] CE mark pathway (si prescription digital)

### Business

- Levée de fonds seed si traction B2B validée
- Partenariats : mutuelles santé, EAP providers
- Expansion EU

---

## Risques & Mitigations

| Risque               | Impact | Mitigation                                       |
| -------------------- | ------ | ------------------------------------------------ |
| Faible rétention     | Élevé  | Focus UX 30 sec/jour, rappels non-culpabilisants |
| Régulation YMYL      | Élevé  | Disclaimers clairs, pas de conseils médicaux     |
| Concurrence Bearable | Moyen  | Focus médication + aidant comme différenciateurs |
| Complexité B2B       | Moyen  | Reporter Phase 3 jusqu'à PMF B2C validé          |

---

## Ressources Existantes

- **Design System** : Shadcn/UI + TailwindCSS (déjà en place)
- **Auth** : Better Auth multi-org (aidant = member)
- **Billing** : Stripe intégré avec webhooks
- **Charts** : Recharts disponible
- **Email** : Resend + React Email
- **i18n** : À implémenter (next-intl)

---

_Dernière mise à jour : Décembre 2024_
