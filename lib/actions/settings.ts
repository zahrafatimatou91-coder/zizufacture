import { supabase } from "@/lib/supabase-client";
import type { CompanySettings } from "@/lib/types";

export async function getSettings(): Promise<CompanySettings | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("company_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // If no settings found, create default
    if (error.code === "PGRST116") {
      return createDefaultSettings(user.id);
    }
    return null;
  }
  return data;
}

async function createDefaultSettings(userId: string): Promise<CompanySettings> {
  const { data, error } = await supabase
    .from("company_settings")
    .insert({
      user_id: userId,
      company_name: "Mon Entreprise",
      address: "Dakar, Sénégal",
      email: "",
      phone: "",
      ninea: "",
      first_name: "",
      last_name: "",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSettings(
  updates: Partial<Pick<CompanySettings, "company_name" | "address" | "email" | "phone" | "ninea" | "first_name" | "last_name">>
): Promise<CompanySettings> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data, error } = await supabase
    .from("company_settings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
