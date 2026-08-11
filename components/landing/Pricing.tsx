"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import "./landing.css";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-landing-margin-desktop px-landing-margin-mobile md:px-landing-margin-desktop bg-landing-background overflow-hidden">
      
      <div className="relative z-10 max-w-5xl mx-auto text-center mb-landing-unit-xl landing-fade-in-up visible">
        <h2 className="font-headline-lg text-headline-lg text-landing-on-surface mb-4">
          Des tarifs simples, sans surprise.
        </h2>
        <p className="font-body-md text-landing-on-surface-variant max-w-xl mx-auto">
          Choisissez l'offre qui correspond le mieux à l'évolution de votre entreprise. Vous pouvez changer à tout moment.
        </p>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Plan Gratuit */}
        <div 
          className="bg-white p-8 rounded-2xl shadow-sm border border-landing-outline-variant/30 flex flex-col landing-fade-in-up hover:shadow-xl transition-all hover:-translate-y-2 duration-300 visible relative" 
          style={{ transitionDelay: '100ms' }}
        >
          <h3 className="font-headline-md text-xl font-bold text-landing-on-surface mb-2">Démarrage</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-landing-on-surface">0 FCFA</span>
            <span className="text-landing-on-surface-variant">/mois</span>
          </div>
          <p className="text-landing-on-surface-variant text-sm mb-6 pb-6 border-b border-landing-outline-variant/20">
            Parfait pour les freelances qui se lancent et ont peu de clients.
          </p>
          <ul className="flex flex-col gap-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Jusqu'à 5 factures par mois
            </li>
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Gestion de 3 clients
            </li>
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Modèles de factures standards
            </li>
          </ul>
          <Link 
            href="/login" 
            className="w-full py-3 rounded-xl border-2 border-landing-primary text-landing-primary text-center font-semibold hover:bg-landing-primary hover:text-white transition-colors"
          >
            Commencer gratuitement
          </Link>
        </div>
        
        {/* Plan Pro */}
        <div 
          className="bg-landing-primary p-8 rounded-2xl shadow-xl border-0 flex flex-col landing-fade-in-up hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 visible relative md:-translate-y-4" 
          style={{ transitionDelay: '200ms' }}
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-landing-secondary-fixed text-landing-on-secondary-fixed-variant text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Recommandé
          </div>
          <h3 className="font-headline-md text-xl font-bold text-white mb-2">Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">5 000 FCFA</span>
            <span className="text-indigo-200">/mois</span>
          </div>
          <p className="text-indigo-100 text-sm mb-6 pb-6 border-b border-indigo-400/30">
            Pour les entrepreneurs qui facturent régulièrement.
          </p>
          <ul className="flex flex-col gap-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-sm text-white">
              <Check className="w-5 h-5 text-landing-secondary-fixed" />
              Factures et devis illimités
            </li>
            <li className="flex items-center gap-3 text-sm text-white">
              <Check className="w-5 h-5 text-landing-secondary-fixed" />
              Clients illimités
            </li>
            <li className="flex items-center gap-3 text-sm text-white">
              <Check className="w-5 h-5 text-landing-secondary-fixed" />
              Calcul automatique de TVA
            </li>
            <li className="flex items-center gap-3 text-sm text-white">
              <Check className="w-5 h-5 text-landing-secondary-fixed" />
              Support par email
            </li>
          </ul>
          <Link 
            href="/login" 
            className="w-full py-3 rounded-xl bg-white text-landing-primary text-center font-semibold hover:bg-indigo-50 transition-colors"
          >
            Choisir ce plan
          </Link>
        </div>
        
        {/* Plan Entreprise */}
        <div 
          className="bg-white p-8 rounded-2xl shadow-sm border border-landing-outline-variant/30 flex flex-col landing-fade-in-up hover:shadow-xl transition-all hover:-translate-y-2 duration-300 visible relative" 
          style={{ transitionDelay: '300ms' }}
        >
          <h3 className="font-headline-md text-xl font-bold text-landing-on-surface mb-2">Entreprise</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-landing-on-surface">15 000 FCFA</span>
            <span className="text-landing-on-surface-variant">/mois</span>
          </div>
          <p className="text-landing-on-surface-variant text-sm mb-6 pb-6 border-b border-landing-outline-variant/20">
            Pour les équipes et les PME ayant des besoins avancés.
          </p>
          <ul className="flex flex-col gap-4 mb-8 flex-grow">
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Toutes les options Pro
            </li>
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Comptes multi-utilisateurs
            </li>
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Personnalisation avancée
            </li>
            <li className="flex items-center gap-3 text-sm text-landing-on-surface-variant">
              <Check className="w-5 h-5 text-landing-primary" />
              Support prioritaire 24/7
            </li>
          </ul>
          <Link 
            href="/login" 
            className="w-full py-3 rounded-xl border border-landing-outline-variant/50 text-landing-on-surface font-semibold hover:border-landing-primary hover:text-landing-primary transition-colors text-center"
          >
            Contacter les ventes
          </Link>
        </div>
        
      </div>
    </section>
  );
}
