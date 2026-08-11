"use client";

import { FileX, Calculator, Banknote } from "lucide-react";
import "./landing.css";

export default function Features() {
  return (
    <section id="features" className="relative py-landing-margin-desktop px-landing-margin-mobile md:px-landing-margin-desktop bg-landing-surface-container-low overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 landing-bg-grid-pattern text-landing-primary/5 z-0"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-landing-primary-fixed rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-0 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-landing-secondary-container rounded-full mix-blend-multiply filter blur-[60px] opacity-30 z-0 -translate-x-1/4 translate-y-1/4"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center mb-landing-unit-xl landing-fade-in-up visible">
        <h2 className="font-headline-lg text-headline-lg text-landing-on-surface">
          Pourquoi la facturation manuelle freine votre croissance ?
        </h2>
      </div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-landing-gutter max-w-5xl mx-auto">
        
        {/* Feature 1 */}
        <div 
          className="bg-landing-surface-container-lowest/80 backdrop-blur-sm p-landing-unit-lg rounded-xl shadow-[0px_10px_30px_rgba(108,92,231,0.08)] landing-hand-drawn-border flex flex-col items-center text-center landing-fade-in-up hover:shadow-lg transition-all hover:-translate-y-2 duration-300 visible group" 
          style={{ transitionDelay: '100ms' }}
        >
          <div className="w-16 h-16 bg-landing-error-container text-landing-error rounded-full flex items-center justify-center mb-landing-unit-md group-hover:scale-110 transition-transform duration-300">
            <FileX className="w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-headline-md text-landing-on-surface mb-landing-unit-sm">
            Factures non professionnelles
          </h3>
          <p className="font-body-md text-body-md text-landing-on-surface-variant">
            Des documents mal formatés qui nuisent à l'image de votre entreprise face aux clients exigeants.
          </p>
        </div>
        
        {/* Feature 2 */}
        <div 
          className="bg-landing-surface-container-lowest/80 backdrop-blur-sm p-landing-unit-lg rounded-xl shadow-[0px_10px_30px_rgba(108,92,231,0.08)] landing-hand-drawn-border flex flex-col items-center text-center landing-fade-in-up hover:shadow-lg transition-all hover:-translate-y-2 duration-300 visible group" 
          style={{ transitionDelay: '200ms' }}
        >
          <div className="w-16 h-16 bg-landing-secondary-fixed text-landing-on-secondary-fixed-variant rounded-full flex items-center justify-center mb-landing-unit-md relative group-hover:scale-110 transition-transform duration-300">
            <Calculator className="w-8 h-8 relative z-10" />
            <svg className="absolute inset-0 w-full h-full text-landing-secondary -rotate-12 scale-125 opacity-50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" strokeDasharray="10 5"></circle>
            </svg>
          </div>
          <h3 className="font-headline-md text-headline-md text-landing-on-surface mb-landing-unit-sm">
            Calculs de TVA manuels (18%)
          </h3>
          <p className="font-body-md text-body-md text-landing-on-surface-variant">
            Perte de temps et risque d'erreurs récurrentes dans vos déclarations fiscales.
          </p>
        </div>
        
        {/* Feature 3 */}
        <div 
          className="bg-landing-surface-container-lowest/80 backdrop-blur-sm p-landing-unit-lg rounded-xl shadow-[0px_10px_30px_rgba(108,92,231,0.08)] landing-hand-drawn-border flex flex-col items-center text-center landing-fade-in-up hover:shadow-lg transition-all hover:-translate-y-2 duration-300 visible group" 
          style={{ transitionDelay: '300ms' }}
        >
          <div className="w-16 h-16 bg-landing-primary-fixed text-landing-on-primary-fixed-variant rounded-full flex items-center justify-center mb-landing-unit-md group-hover:scale-110 transition-transform duration-300">
            <Banknote className="w-8 h-8" />
          </div>
          <h3 className="font-headline-md text-headline-md text-landing-on-surface mb-landing-unit-sm">
            Suivi des paiements impossible
          </h3>
          <p className="font-body-md text-body-md text-landing-on-surface-variant">
            Difficile de savoir qui a payé et qui relancer, impactant directement votre trésorerie.
          </p>
        </div>
        
      </div>
    </section>
  );
}
