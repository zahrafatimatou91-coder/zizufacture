import { supabase } from "@/lib/supabase-client";
import type { Client } from "@/lib/types";

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function createClient(client: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}): Promise<Client> {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from("clients")
    .insert({
      ...client,
      user_id: user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(
  id: string,
  updates: Partial<Pick<Client, "name" | "email" | "phone" | "address">>
): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
