"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Traduction des erreurs Supabase en français
function translateError(message: string): string {
  if (message.includes("Invalid login credentials")) return "Email ou mot de passe incorrect. Vérifiez vos identifiants.";
  if (message.includes("Email not confirmed")) return "Votre email n'est pas encore confirmé. Consultez votre boîte mail et cliquez sur le lien de confirmation.";
  if (message.includes("email rate limit exceeded")) return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
  if (message.includes("User already registered")) return "Un compte existe déjà avec cette adresse email. Essayez de vous connecter.";
  if (message.includes("Password should be at least")) return "Le mot de passe doit contenir au moins 6 caractères.";
  if (message.includes("signup is disabled")) return "Les inscriptions sont temporairement désactivées.";
  if (message.includes("over_email_send_rate_limit")) return "Trop d'emails envoyés. Patientez quelques minutes avant de réessayer.";
  return message;
}

export async function login(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  // Si Supabase a créé une session directement (confirmation email désactivée)
  if (data.session) {
    redirect("/dashboard");
  }

  // Si confirmation email est activée, on informe l'utilisateur
  return { 
    success: "Inscription réussie ! Un email de confirmation vous a été envoyé. Cliquez sur le lien dans l'email pour activer votre compte et accéder au tableau de bord." 
  };
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "L'adresse email est requise." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/dashboard/settings`,
  });

  if (error) {
    return { error: translateError(error.message) };
  }

  return { success: "Un lien de réinitialisation vous a été envoyé par email. Vérifiez votre boîte de réception." };
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
