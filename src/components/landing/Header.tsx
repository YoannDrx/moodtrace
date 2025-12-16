"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            M
          </div>
          <span className="text-xl font-bold text-foreground">MoodJournal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Fonctionnalités
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Comment ça marche
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/signin">Se connecter</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/space/demo">Commencer</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
            <hr className="border-border" />
            <Link
              href="/auth/signin"
              className="text-base font-medium text-muted-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Se connecter
            </Link>
            <Button asChild className="w-full">
              <Link href="/space/demo" onClick={() => setIsMenuOpen(false)}>
                Commencer
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
