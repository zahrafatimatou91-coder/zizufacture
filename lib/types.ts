// ---- Shared types for Zizu Facture ----

export interface Client {
  id: string;           // UUID from Supabase
  display_id: string;   // "CLI-001"
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
}

export type InvoiceStatus = "brouillon" | "envoyée" | "payée" | "en retard";

export interface Invoice {
  id: string;             // UUID from Supabase
  display_id: string;     // "FAC-2026-0001"
  client_id: string | null;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  sub_total: number;
  tax: number;
  total_amount: number;
  pdf_url?: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data (not always present)
  clients?: Client;
  invoice_lines?: InvoiceLine[];
}

export interface CompanySettings {
  id: string;
  user_id: string;
  company_name: string;
  address: string;
  email: string;
  phone: string;
  ninea: string;
  first_name: string;
  last_name: string;
  updated_at: string;
}
