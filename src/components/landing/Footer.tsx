import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & tagline */}
          <div className="text-center md:text-left">
            <Link to="/" className="text-xl font-bold text-primary">
              MoodTrace
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Suivez votre humeur, préparez vos consultations.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/app" className="text-muted-foreground hover:text-primary transition-colors">
              Application
            </Link>
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Fonctionnalités
            </a>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              À propos
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Confidentialité
            </Link>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MoodTrace. Tous droits réservés.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Conçu avec <Heart className="h-4 w-4 text-destructive" /> pour le bien-être
          </p>
        </div>
      </div>
    </footer>
  );
}
