"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Banknote, Wallet } from "lucide-react";
import "./landing.css";

export default function Hero() {
  return (
    <section className="relative pt-32 md:pt-[160px] pb-16 md:pb-landing-margin-desktop px-4 sm:px-6 md:px-landing-margin-desktop max-w-5xl mx-auto flex flex-col items-center justify-center text-center min-h-[70vh] md:min-h-[85vh]">
      {/* Hand-drawn background elements */}
      <div className="absolute top-32 left-20 w-48 h-48 bg-landing-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-40 z-0"></div>
      <div className="absolute bottom-32 right-20 w-64 h-64 bg-landing-primary-fixed rounded-full mix-blend-multiply filter blur-3xl opacity-30 z-0"></div>
      
      <div className="z-10 landing-fade-in-up w-full relative flex flex-col items-center visible">
        
        {/* Floating Decorative Icons */}
        <div className="hidden md:flex absolute top-10 -left-10 bg-white/70 backdrop-blur-md shadow-xl border border-white/50 p-4 rounded-2xl landing-hand-drawn-border landing-floating-icon landing-delay-1 text-landing-primary rotate-[-10deg] items-center justify-center w-20 h-20">
          <FileText className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        <div className="hidden md:flex absolute -top-4 right-10 bg-white/70 backdrop-blur-md shadow-xl border border-white/50 p-4 rounded-full landing-floating-icon landing-delay-2 text-landing-secondary rotate-[15deg] items-center justify-center w-20 h-20">
          <Banknote className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        <div className="hidden md:flex absolute bottom-20 -left-4 bg-white/70 backdrop-blur-md shadow-xl border border-white/50 px-5 py-3 rounded-xl landing-hand-drawn-border landing-floating-icon landing-delay-3 text-landing-secondary-fixed-dim rotate-[5deg] font-headline-md font-bold text-xl">
          FCFA
        </div>
        
        <div className="hidden md:flex absolute bottom-10 right-0 bg-white/70 backdrop-blur-md shadow-xl border border-white/50 p-4 rounded-2xl landing-hand-drawn-border landing-floating-icon landing-delay-4 text-landing-primary-container rotate-[-15deg] items-center justify-center w-20 h-20">
          <Wallet className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        <h1 className="font-headline-xl md:text-[56px] leading-[1.2] md:leading-[1.15] text-landing-on-surface mb-6 md:mb-10 relative inline-block max-w-[800px] text-[36px] sm:text-5xl px-2">
          Fini les factures sur Word et Excel : <br className="hidden md:block" />
          <span className="text-landing-primary relative inline-block mt-2 md:mt-0">
            Facturez comme un pro
            {/* Hand drawn underline SVG */}
            <svg className="absolute w-[110%] h-4 md:h-5 -bottom-1 md:-bottom-2 -left-[5%] text-landing-secondary-container" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 200 10">
              <path d="M0,5 Q50,10 100,5 T200,5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
          </span> 
          {" "}en 2 clics
        </h1>
        
        <p className="font-body-lg text-[16px] md:text-[20px] text-landing-on-surface-variant mb-8 md:mb-12 max-w-2xl mx-auto px-4 leading-relaxed">
          La solution de facturation simple, moderne et pensée pour les entrepreneurs africains.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-landing-unit-md w-full max-w-sm sm:max-w-none">
          <Link 
            href="/login" 
            className="bg-landing-primary text-landing-on-primary px-8 py-4 rounded-full font-label-md text-label-md landing-magnetic-btn text-center shadow-[0px_10px_30px_rgba(83,65,205,0.3)] flex items-center justify-center gap-2"
          >
            Commencer gratuitement
            <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
        <p className="mt-4 text-label-sm text-landing-on-surface-variant/70 font-medium">
          Encaissez vos paiements instantanément. Sans effort.
        </p>
      </div>
    </section>
  );
}
