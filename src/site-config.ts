export const SiteConfig = {
  title: "MoodJournal",
  description:
    "Medication-aware mood tracker - Suivez votre humeur et optimisez votre traitement",
  prodUrl: "https://moodjournal.app",
  appId: "moodjournal",
  domain: "moodjournal.app",
  appIcon: "/images/moodjournal-icon.png",
  company: {
    name: "MoodJournal",
    address: "Paris, France",
  },
  brand: {
    primary: "#0E7980", // Teal - Trust, calm, medical
    secondary: "#48A878", // Green - Healing, progress
  },
  team: {
    image: "/images/team.jpg",
    website: "https://moodjournal.app",
    twitter: "https://twitter.com/moodjournal",
    name: "MoodJournal Team",
  },
  features: {
    /**
     * If enable, you need to specify the logic of upload here : src/features/images/uploadImageAction.tsx
     * You can use Vercel Blob Storage : https://vercel.com/docs/storage/vercel-blob
     * Or you can use Cloudflare R2 : https://mlv.sh/cloudflare-r2-tutorial
     * Or you can use AWS S3 : https://mlv.sh/aws-s3-tutorial
     */
    enableImageUpload: false as boolean,
    /**
     * If enable, the user will be redirected to `/space` when he visits the landing page at `/`
     * The logic is located in middleware.ts
     */
    enableLandingRedirection: true as boolean,
  },
  /**
   * MoodJournal specific configuration
   */
  moodjournal: {
    /** Mood scale configuration */
    moodScale: {
      min: 1,
      max: 10,
    },
    /** Default language */
    defaultLanguage: "fr" as const,
    /** Supported languages */
    supportedLanguages: ["fr", "en"] as const,
    /** Crisis resources (France) */
    crisisResources: [
      {
        name: "SOS Amitie",
        phone: "09 72 39 40 50",
        available: "24h/24, 7j/7",
      },
      {
        name: "Fil Sante Jeunes",
        phone: "0 800 235 236",
        available: "9h-23h",
      },
      {
        name: "Urgences (SAMU)",
        phone: "15",
        available: "24h/24, 7j/7",
      },
    ],
  },
  /**
   * SEO & Social metadata
   */
  seo: {
    keywords: [
      "mood tracker",
      "medication tracking",
      "mental health",
      "bipolar",
      "depression",
      "ADHD",
      "anxiety",
      "suivi humeur",
      "suivi medicaments",
      "sante mentale",
    ],
    ogImage: "/images/og-image.png",
    twitterHandle: "@moodjournal",
  },
};
