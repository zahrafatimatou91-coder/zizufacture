import { supabase } from "@/lib/supabase-client";
import type { Invoice, InvoiceLine, InvoiceStatus } from "@/lib/types";

export async function getInvoices(): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(id, display_id, name, email, phone, address)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, clients(id, display_id, name, email, phone, address), invoice_lines(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  
  // Sort lines by sort_order
  if (data?.invoice_lines) {
    data.invoice_lines.sort((a: InvoiceLine, b: InvoiceLine) => a.sort_order - b.sort_order);
  }
  
  return data;
}

export async function createInvoice(invoiceData: {
  client_id: string;
  issue_date: string;
  due_date: string;
  status: InvoiceStatus;
  sub_total: number;
  tax: number;
  total_amount: number;
  lines: { description: string; quantity: number; unit_price: number; total: number }[];
}): Promise<Invoice> {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Generate display_id
  const { data: lastInvoice } = await supabase
    .from("invoices")
    .select("display_id")
    .order("created_at", { ascending: false })
    .limit(1);

  const nextNum = lastInvoice && lastInvoice.length > 0
    ? parseInt(lastInvoice[0].display_id.split("-").pop() || "0") + 1
    : 1;
  const display_id = `FAC-${new Date().getFullYear()}-${String(nextNum).padStart(4, "0")}`;

  // Insert invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      display_id,
      client_id: invoiceData.client_id,
      issue_date: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      status: invoiceData.status,
      sub_total: invoiceData.sub_total,
      tax: invoiceData.tax,
      total_amount: invoiceData.total_amount,
      user_id: user?.id,
    })
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  // Insert invoice lines
  if (invoiceData.lines.length > 0) {
    const linesToInsert = invoiceData.lines.map((line, i) => ({
      invoice_id: invoice.id,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unit_price,
      total: line.total,
      sort_order: i,
    }));

    const { error: linesError } = await supabase
      .from("invoice_lines")
      .insert(linesToInsert);

    if (linesError) throw linesError;
  }

  return invoice;
}

export async function updateInvoiceStatus(
  id: string,
  status: InvoiceStatus
): Promise<void> {
  const { error } = await supabase
    .from("invoices")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}

export async function updateInvoice(
  id: string,
  invoiceData: {
    client_id: string;
    issue_date: string;
    due_date: string;
    status: InvoiceStatus;
    sub_total: number;
    tax: number;
    total_amount: number;
    lines: { description: string; quantity: number; unit_price: number; total: number }[];
  }
): Promise<void> {
  // Update invoice
  const { error: invoiceError } = await supabase
    .from("invoices")
    .update({
      client_id: invoiceData.client_id,
      issue_date: invoiceData.issue_date,
      due_date: invoiceData.due_date,
      status: invoiceData.status,
      sub_total: invoiceData.sub_total,
      tax: invoiceData.tax,
      total_amount: invoiceData.total_amount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (invoiceError) throw invoiceError;

  // Delete existing lines
  const { error: deleteError } = await supabase
    .from("invoice_lines")
    .delete()
    .eq("invoice_id", id);

  if (deleteError) throw deleteError;

  // Insert new lines
  if (invoiceData.lines.length > 0) {
    const linesToInsert = invoiceData.lines.map((line, i) => ({
      invoice_id: id,
      description: line.description,
      quantity: line.quantity,
      unit_price: line.unit_price,
      total: line.total,
      sort_order: i,
    }));

    const { error: linesError } = await supabase
      .from("invoice_lines")
      .insert(linesToInsert);

    if (linesError) throw linesError;
  }
}

export async function deleteInvoice(id: string): Promise<void> {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateInvoicePdf(id: string, pdf_url: string): Promise<void> {
  const { error } = await supabase
    .from("invoices")
    .update({ pdf_url })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
