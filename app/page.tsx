import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Disclaimer } from "@/components/landing/Disclaimer";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}
