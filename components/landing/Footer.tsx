"use client";

import Link from "next/link";
import { Receipt, Share2, Globe } from "lucide-react";
import "./landing.css";

export default function Footer() {
  return (
    <footer className="bg-landing-surface dark:bg-landing-inverse-surface w-full py-20 px-landing-margin-mobile md:px-landing-margin-desktop max-w-5xl mx-auto flex flex-col gap-landing-unit-xl mt-landing-margin-desktop border-t border-landing-outline-variant/30">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left sm:grid-cols-2">
        
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="text-headline-md font-headline-md font-bold text-landing-primary dark:text-landing-primary-fixed-dim flex items-center justify-center md:justify-start gap-2 mb-landing-unit-md hover:opacity-80 transition-opacity">
            <Receipt className="w-6 h-6" />
            zizuFacture
          </Link>
          <p className="text-label-sm text-landing-on-surface-variant max-w-[200px]">
            La facturation simplifiée pour l'Afrique.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-start gap-3 md:gap-2">
          <h4 className="font-label-md text-landing-on-surface mb-1 md:mb-2">Produit</h4>
          <Link href="#features" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Tarifs
          </Link>
          <Link href="#" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Aide
          </Link>
        </div>
        
        <div className="flex flex-col items-center md:items-start gap-3 md:gap-2">
          <h4 className="font-label-md text-landing-on-surface mb-1 md:mb-2">Légal</h4>
          <Link href="#" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Conditions
          </Link>
          <Link href="#" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Confidentialité
          </Link>
        </div>
        
        <div className="flex flex-col items-center md:items-start gap-3 md:gap-2">
          <h4 className="font-label-md text-landing-on-surface mb-1 md:mb-2">Contact</h4>
          <Link href="#" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Support
          </Link>
          <Link href="#" className="text-label-sm text-landing-on-surface-variant hover:text-landing-primary transition-colors py-1 md:py-0">
            Ventes
          </Link>
        </div>
      </div>
      
      <div className="w-full pt-8 border-t border-landing-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="font-body-md text-label-sm text-landing-tertiary dark:text-landing-tertiary-fixed-dim text-center">
          Fait avec fierté en Afrique © {new Date().getFullYear()} zizuFacture
        </p>
        <div className="flex gap-6 md:gap-4">
          <button aria-label="Share" className="text-landing-on-surface-variant cursor-pointer hover:text-landing-primary transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button aria-label="Language" className="text-landing-on-surface-variant cursor-pointer hover:text-landing-primary transition-colors">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
