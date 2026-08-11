"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup, resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, CheckCircle2, ArrowLeft, Eye, EyeOff, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";

type Mode = "login" | "signup" | "forgot_password";

import Link from "next/link";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check for URL error params (from auth callback)
  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError === "confirmation_failed") {
      setError("La confirmation a échoué. Veuillez réessayer de vous inscrire.");
      setMode("signup");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    
    // Custom validation for password confirmation
    if (mode === "signup") {
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        setIsPending(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        setIsPending(false);
        return;
      }
    }

    try {
      let result;
      if (mode === "login") result = await login(formData);
      else if (mode === "signup") result = await signup(formData);
      else result = await resetPassword(formData);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue s'est produite.");
    } finally {
      setIsPending(false);
    }
  };


  // Render the success view if we have a success message (for signup or reset password)
  if (success) {
    return (
      <div className="min-h-screen w-full flex bg-landing-background items-center justify-center p-6">
        <Card className="w-full max-w-md p-10 rounded-[2rem] border-0 shadow-2xl shadow-indigo-100/50 bg-white text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Succès !</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {success}
          </p>
          <Button 
            onClick={() => {
              setSuccess(null);
              setMode("login");
            }}
            className="w-full rounded-xl bg-landing-primary text-white hover:bg-landing-primary/90 py-6 font-semibold"
          >
            Retour à la connexion
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-landing-background">
      
      {/* Left Side - Brand & Presentation */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-landing-primary to-landing-primary-container p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity w-fit text-white">
            <Receipt className="w-8 h-8" />
            <span className="text-2xl font-black tracking-tight">zizuFacture</span>
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Gérez vos factures <br/>
            <span className="text-landing-secondary-fixed">en toute simplicité.</span>
          </h1>
          <p className="text-landing-on-primary-fixed text-lg max-w-md">
            L'outil indispensable pour les entrepreneurs. Créez, envoyez et suivez vos factures en un clin d'œil.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 w-fit">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-landing-primary-container bg-landing-secondary-fixed" />
              ))}
            </div>
            <div className="text-sm text-landing-primary-fixed">
              Rejoignez plus de <span className="font-bold text-white">1,000+</span> utilisateurs
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-landing-background to-white lg:hidden" />
        
        <Card className="w-full max-w-md p-8 sm:p-10 rounded-[2rem] border-0 shadow-2xl shadow-indigo-100/50 bg-white/80 backdrop-blur-xl relative z-10">
          
          <Link href="/" className="lg:hidden flex items-center gap-2 mb-10 justify-center hover:opacity-80 transition-opacity text-landing-primary">
            <Receipt className="w-8 h-8" />
            <span className="text-slate-900 text-2xl font-black tracking-tight">zizuFacture</span>
          </Link>

          {mode !== "forgot_password" ? (
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => { setMode("login"); setError(null); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === "login" ? 'bg-white text-landing-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 ${mode === "signup" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                S'inscrire
              </button>
            </div>
          ) : (
            <button 
              type="button" 
              onClick={() => { setMode("login"); setError(null); }}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </button>
          )}

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {mode === "login" && "Bon retour ! 👋"}
              {mode === "signup" && "Créez votre compte 🚀"}
              {mode === "forgot_password" && "Mot de passe oublié ?"}
            </h2>
            <p className="text-slate-500 text-sm">
              {mode === "login" && "Entrez vos identifiants pour accéder à votre espace."}
              {mode === "signup" && "Remplissez les informations ci-dessous pour commencer."}
              {mode === "forgot_password" && "Entrez votre adresse email, nous vous enverrons un lien de réinitialisation."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 text-red-600 border border-red-100 rounded-xl text-sm text-center font-medium flex items-center justify-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="text-left">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 px-1">Nom complet (Optionnel)</label>
                <div className="relative">
                  <input 
                    type="text"
                    name="name"
                    placeholder="Jean Dupont"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 px-1">Adresse Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  type="email"
                  name="email"
                  placeholder="exemple@email.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {mode !== "forgot_password" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                  {mode === "login" && (
                     <button 
                      type="button" 
                      onClick={() => { setMode("forgot_password"); setError(null); }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={mode === "login" ? "••••••••" : "Minimum 6 caractères"}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 px-1">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-400"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full rounded-xl bg-gradient-primary border-0 hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] text-white py-6 mt-4 transition-all duration-300 font-semibold text-base"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                mode === "login" ? "Connexion" : 
                mode === "signup" ? "Créer mon compte" : 
                "Envoyer le lien"
              )}
            </Button>
          </form>

        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
