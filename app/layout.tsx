import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MoodJournal - Suivez votre humeur, préparez vos consultations",
  description:
    "Application de suivi d'humeur pour patients en santé mentale. Suivez votre humeur quotidienne, gérez vos médicaments et préparez vos consultations.",
  keywords: [
    "humeur",
    "santé mentale",
    "bipolarité",
    "suivi",
    "médicaments",
    "consultation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "bg-background h-full font-sans antialiased",
          inter.variable
        )}
      >
        <NuqsAdapter>
          <Providers>
            <Suspense fallback={null}>{children}</Suspense>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
