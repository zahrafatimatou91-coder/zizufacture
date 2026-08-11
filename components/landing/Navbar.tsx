"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, ArrowUpRight, Menu, X } from "lucide-react";
import "./landing.css";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex flex-col items-center w-full px-landing-margin-mobile">
      <nav className="bg-landing-background/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full flex justify-between items-center w-full max-w-5xl px-6 py-3 mx-auto">
        <Link 
          href="/" 
          className="text-[20px] font-headline-md font-bold text-landing-primary flex items-center gap-2 hover:opacity-90 transition-opacity hover:scale-105 active:scale-95 duration-150 ease-in-out"
        >
          <Receipt className="w-6 h-6" />
          zizuFacture
        </Link>
        
        <div className="hidden md:flex items-center gap-landing-gutter">
          <Link href="#features" className="text-landing-on-surface-variant hover:text-landing-primary transition-colors font-label-md text-label-md hover:scale-105">
            Fonctionnalités
          </Link>
          <Link href="#how-it-works" className="text-landing-on-surface-variant hover:text-landing-primary transition-colors font-label-md text-label-md hover:scale-105">
            Comment ça marche
          </Link>
          <Link href="#pricing" className="text-landing-on-surface-variant hover:text-landing-primary transition-colors font-label-md text-label-md hover:scale-105">
            Tarifs
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-landing-unit-md">
          <Link href="/login" className="text-landing-on-surface-variant hover:text-landing-primary font-label-md text-label-md transition-colors">
            Connexion
          </Link>
          <Link 
            href="/login" 
            className="bg-landing-primary text-landing-on-primary px-5 py-2.5 rounded-full font-label-md text-label-md landing-magnetic-btn flex items-center gap-2 shadow-[0px_4px_14px_rgba(83,65,205,0.3)]"
          >
            Commencer
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        
        <button 
          className="md:hidden text-landing-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full max-w-5xl mx-auto mt-4 bg-landing-surface-container-lowest/90 backdrop-blur-xl border border-landing-outline-variant/30 rounded-2xl p-6 shadow-xl flex flex-col gap-4 animate-in slide-in-from-top-4">
          <Link 
            href="#features" 
            className="text-landing-on-surface font-label-md py-2 border-b border-landing-surface-dim"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Fonctionnalités
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-landing-on-surface font-label-md py-2 border-b border-landing-surface-dim"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Comment ça marche
          </Link>
          <Link 
            href="#pricing" 
            className="text-landing-on-surface font-label-md py-2 border-b border-landing-surface-dim"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Tarifs
          </Link>
          <div className="flex flex-col gap-3 mt-2">
            <Link 
              href="/login" 
              className="w-full text-center py-3 text-landing-primary font-label-md border border-landing-primary rounded-xl"
            >
              Connexion
            </Link>
            <Link 
              href="/login" 
              className="w-full text-center py-3 bg-landing-primary text-landing-on-primary font-label-md rounded-xl"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
