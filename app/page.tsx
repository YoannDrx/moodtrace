import { BentoGridSection } from "@/features/landing/bento-section";
import { CTASectionCard } from "@/features/landing/cta/cta-card-section";
import { CtaSection } from "@/features/landing/cta/cta-section";
import { CrisisResourcesSection } from "@/features/landing/crisis-resources-section";
import { FAQSection } from "@/features/landing/faq-section";
import { FeaturesSection } from "@/features/landing/feature-section";
import { Hero } from "@/features/landing/hero";
import { LandingHeader } from "@/features/landing/landing-header";
import { PainSection } from "@/features/landing/pain";
import { ReviewTriple } from "@/features/landing/review/review-triple";
import { SectionDivider } from "@/features/landing/section-divider";
import { Footer } from "@/features/layout/footer";
import { Pricing } from "@/features/plans/pricing-section";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <div className="mt-16"></div>

      <LandingHeader />

      <Hero />

      <BentoGridSection />

      <PainSection />

      <SectionDivider />

      <ReviewTriple
        reviews={[
          {
            image: "https://i.pravatar.cc/300?u=mt1",
            name: "Marie L.",
            review:
              "MoodTrace m'a permis de **montrer a mon psychiatre exactement comment je me sentais** entre les consultations. Les donnees objectives ont aide a ajuster mon traitement de facon plus precise.",
            role: "Patiente bipolaire",
          },
          {
            image: "https://i.pravatar.cc/300?u=mt2",
            name: "Dr. Dupont",
            review:
              "Les rapports PDF de mes patients sont **precieux pour le suivi des traitements**. Je peux voir les correlations entre les changements de dosage et l'evolution de l'humeur.",
            role: "Psychiatre",
          },
          {
            image: "https://i.pravatar.cc/300?u=mt3",
            name: "Jean-Pierre M.",
            review:
              "Pouvoir noter mes observations en tant qu'aidant **aide ma femme a avoir une vision plus complete** de son etat. C'est un outil precieux pour notre famille.",
            role: "Aidant familial",
          },
        ]}
      />

      <SectionDivider />

      <FeaturesSection />

      <CTASectionCard
        title="Pret a mieux comprendre votre sante mentale ?"
        description="Commencez gratuitement et decouvrez comment MoodTrace peut vous aider a optimiser votre traitement."
        ctaText="Commencer maintenant"
        ctaHref="/signin"
      />

      <Pricing />

      <FAQSection
        faq={[
          {
            question: "MoodTrace est-il un dispositif medical ?",
            answer:
              "Non, MoodTrace est un outil de suivi et d'aide a la decision, pas un dispositif medical. Il ne fournit aucun diagnostic ni recommandation de traitement. Toute decision concernant votre sante doit etre prise avec un professionnel de sante qualifie.",
          },
          {
            question: "Mes donnees sont-elles securisees ?",
            answer:
              "Oui, vos donnees sont chiffrees et stockees de maniere securisee, en conformite avec le RGPD. Vous restez proprietaire de vos donnees et pouvez les exporter ou les supprimer a tout moment.",
          },
          {
            question: "Puis-je partager mes donnees avec mon medecin ?",
            answer:
              "Absolument. Vous pouvez generer des rapports PDF structures contenant vos donnees d'humeur, de medication et vos tendances. Ces rapports sont concus pour faciliter la communication avec votre equipe medicale.",
          },
          {
            question: "Comment fonctionne le role aidant ?",
            answer:
              "Avec votre autorisation, un proche de confiance peut etre invite comme aidant. Il pourra alors ajouter des observations externes sur votre etat, offrant une perspective complementaire a votre auto-evaluation.",
          },
          {
            question: "Quels troubles de l'humeur sont supportes ?",
            answer:
              "MoodTrace est concu pour accompagner les personnes atteintes de divers troubles de l'humeur : trouble bipolaire, depression, anxiete, TDAH, et autres conditions necessitant un suivi de l'humeur et des medicaments.",
          },
          {
            question: "Y a-t-il un essai gratuit ?",
            answer:
              "Oui, le plan gratuit permet de commencer a suivre votre humeur immediatement. Le plan Pro offre un essai gratuit de 14 jours pour tester toutes les fonctionnalites avancees comme les correlations et le role aidant.",
          },
          {
            question: "Comment annuler mon abonnement ?",
            answer:
              "Vous pouvez annuler votre abonnement a tout moment depuis les parametres de votre compte. Vos donnees restent accessibles et exportables meme apres l'annulation.",
          },
        ]}
      />

      <CrisisResourcesSection />

      <CtaSection
        title="Commencez votre suivi des aujourd'hui"
        description="Rejoignez les utilisateurs qui prennent en main leur sante mentale avec MoodTrace."
        ctaText="Creer mon compte gratuit"
        ctaHref="/signin"
      />

      <SectionDivider />

      <Footer />
    </div>
  );
}
