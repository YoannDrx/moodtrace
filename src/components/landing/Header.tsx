import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            M
          </div>
          <span className="text-xl font-bold text-foreground">MoodTrace</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Fonctionnalités
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Comment ça marche
          </a>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            À propos
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Se connecter</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/app">Commencer</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-background p-4 shadow-lg md:hidden animate-slide-up">
          <nav className="flex flex-col gap-4">
            <a 
              href="#features" 
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Fonctionnalités
            </a>
            <a 
              href="#how-it-works" 
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Comment ça marche
            </a>
            <Link 
              to="/about" 
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <hr className="border-border" />
            <Link 
              to="/auth" 
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Se connecter
            </Link>
            <Button asChild className="w-full">
              <Link to="/app" onClick={() => setIsMenuOpen(false)}>
                Commencer
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
