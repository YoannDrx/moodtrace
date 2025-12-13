"use client";

import { BentoGrid, BentoGridItem } from "@/components/nowts/bentoo";
import { Typography } from "@/components/nowts/typography";
import { cn } from "@/lib/utils";
import { FileText, Heart, LineChart, Pill, Users } from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { SectionLayout } from "./section-layout";

export function BentoGridSection() {
  return (
    <SectionLayout>
      <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </SectionLayout>
  );
}

const MoodTrackerSkeleton = () => {
  const variants: Variants = {
    initial: { scale: 1 },
    animate: { scale: 1.05 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex h-full flex-col gap-3"
    >
      <div className="text-muted-foreground mb-2 text-sm">
        Comment vous sentez-vous ?
      </div>
      <div className="flex items-center justify-between gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
          <motion.div
            key={mood}
            variants={mood === 7 ? variants : undefined}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-medium",
              mood === 7
                ? "bg-mood-7 text-white shadow-lg"
                : "bg-muted text-muted-foreground",
            )}
          >
            {mood}
          </motion.div>
        ))}
      </div>
      <div className="bg-background mt-2 rounded-lg border p-3">
        <Typography variant="caption" className="text-muted-foreground">
          Note du jour
        </Typography>
        <Typography variant="small" className="text-foreground mt-1">
          Bonne journee, energie stable apres le changement de dosage.
        </Typography>
      </div>
    </motion.div>
  );
};

const MedicationSkeleton = () => {
  const variants: Variants = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex h-full flex-col gap-2"
    >
      {[
        { name: "Lamictal", dosage: "200mg", time: "08:00", taken: true },
        { name: "Lithium", dosage: "400mg", time: "20:00", taken: true },
        { name: "Seroquel", dosage: "50mg", time: "22:00", taken: false },
      ].map((med, i) => (
        <motion.div
          key={i}
          variants={variants}
          className="bg-background flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <Typography variant="small" className="text-foreground font-medium">
              {med.name}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground">
              {med.dosage} - {med.time}
            </Typography>
          </div>
          <div
            className={cn(
              "size-6 rounded-full",
              med.taken ? "bg-secondary" : "bg-muted",
            )}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

const CorrelationSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex h-full flex-col gap-2"
    >
      <div className="flex flex-1 items-end gap-1">
        {[4, 5, 6, 5, 7, 8, 7, 8, 9, 8].map((value, i) => (
          <motion.div
            key={i}
            className="bg-primary/60 flex-1 rounded-t"
            style={{ height: `${value * 10}%` }}
            initial={{ scaleY: 0.8 }}
            whileHover={{ scaleY: 1 }}
          />
        ))}
      </div>
      <div className="bg-background rounded-lg border p-3">
        <Typography variant="caption" className="text-secondary">
          Correlation detectee
        </Typography>
        <Typography variant="small" className="text-foreground">
          +0.72 entre sommeil et humeur
        </Typography>
      </div>
    </motion.div>
  );
};

const CaregiverSkeleton = () => {
  const variants: Variants = {
    initial: { x: 0 },
    animate: { x: 5 },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex h-full flex-col gap-3"
    >
      <motion.div
        variants={variants}
        className="bg-background flex items-start gap-3 rounded-lg border p-3"
      >
        <div className="bg-secondary/20 flex size-10 items-center justify-center rounded-full">
          <Users className="text-secondary size-5" />
        </div>
        <div>
          <Typography variant="small" className="text-foreground font-medium">
            Marie (Aidante)
          </Typography>
          <Typography variant="caption" className="text-muted-foreground">
            A ajoute une observation
          </Typography>
        </div>
      </motion.div>
      <div className="bg-secondary/5 rounded-lg border p-3">
        <Typography variant="caption" className="text-muted-foreground">
          Observation externe
        </Typography>
        <Typography variant="small" className="text-foreground mt-1">
          Semble plus detendu cette semaine, meilleure qualite de sommeil.
        </Typography>
      </div>
    </motion.div>
  );
};

const ExportSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex h-full items-center justify-center"
    >
      <motion.div
        className="bg-background relative flex flex-col items-center rounded-lg border p-6 shadow-lg"
        whileHover={{ scale: 1.02 }}
      >
        <FileText className="text-primary mb-2 size-12" />
        <Typography variant="small" className="text-foreground font-medium">
          Rapport PDF
        </Typography>
        <Typography variant="caption" className="text-muted-foreground">
          30 derniers jours
        </Typography>
        <motion.div
          className="bg-secondary absolute -top-2 -right-2 rounded-full px-2 py-1 text-xs text-white"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
        >
          Nouveau
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "Suivi d'humeur quotidien",
    description: (
      <span className="text-sm">
        Notez votre humeur de 1 a 10 en quelques secondes chaque jour.
      </span>
    ),
    header: <MoodTrackerSkeleton />,
    className: "md:col-span-1",
    icon: <Heart className="text-primary size-5" />,
  },
  {
    title: "Gestion des medicaments",
    description: (
      <span className="text-sm">
        Suivez vos traitements, dosages et adherence quotidienne.
      </span>
    ),
    header: <MedicationSkeleton />,
    className: "md:col-span-1",
    icon: <Pill className="text-primary size-5" />,
  },
  {
    title: "Correlations & insights",
    description: (
      <span className="text-sm">
        Decouvrez les liens entre sommeil, medication et humeur.
      </span>
    ),
    header: <CorrelationSkeleton />,
    className: "md:col-span-1",
    icon: <LineChart className="text-primary size-5" />,
  },
  {
    title: "Role aidant",
    description: (
      <span className="text-sm">
        Permettez a un proche d&apos;ajouter des observations externes.
      </span>
    ),
    header: <CaregiverSkeleton />,
    className: "md:col-span-2",
    icon: <Users className="text-primary size-5" />,
  },
  {
    title: "Export pour medecin",
    description: (
      <span className="text-sm">
        Generez des rapports PDF structures pour vos consultations.
      </span>
    ),
    header: <ExportSkeleton />,
    className: "md:col-span-1",
    icon: <FileText className="text-primary size-5" />,
  },
];
