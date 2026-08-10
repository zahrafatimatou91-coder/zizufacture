"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Printer, CheckCircle, Send, SendHorizontal, AlertTriangle, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getInvoiceById, updateInvoiceStatus, deleteInvoice, updateInvoicePdf } from "@/lib/actions/invoices";
import { getSettings } from "@/lib/actions/settings";
import type { Invoice, CompanySettings, InvoiceStatus } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

export default function InvoiceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const decodedId = decodeURIComponent(params.id);
  
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  useEffect(() => {
    async function loadData() {
      try {
        const [invData, settsData] = await Promise.all([
          getInvoiceById(decodedId),
          getSettings()
        ]);
        setInvoice(invData);
        setSettings(settsData);
      } catch (error) {
        console.error("Failed to load invoice details", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [decodedId]);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Card className="p-5 sm:p-12 rounded-2xl border border-slate-100 shadow-xl min-h-[600px] flex flex-col relative overflow-hidden">
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-12">
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <div className="text-right space-y-2 flex flex-col items-end">
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between mb-12 gap-8 sm:gap-0">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 mb-3" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                  <div className="text-left sm:text-right space-y-6">
                    <div className="space-y-2 flex flex-col sm:items-end">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="space-y-2 flex flex-col sm:items-end">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="w-full mb-8 space-y-4">
                    <div className="flex justify-between border-b-2 border-slate-100 pb-4">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex gap-16">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex justify-between py-2">
                        <Skeleton className="h-5 w-48" />
                        <div className="flex gap-16">
                          <Skeleton className="h-5 w-8" />
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t-2 border-slate-100 pt-6 flex sm:justify-end mt-auto">
                  <div className="w-full sm:w-72 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="flex justify-between pt-4 border-t border-slate-100">
                      <Skeleton className="h-6 w-28" />
                      <Skeleton className="h-8 w-32 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Facture introuvable</h2>
        <p className="text-slate-500 mb-6">La facture demandée n'existe pas ou a été supprimée.</p>
        <Link href="/dashboard/factures">
          <Button variant="outline" className="rounded-full border-slate-200">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  const client = invoice.clients;

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-3 py-0.5 font-medium">Payée</Badge>;
      case "envoyée":
        return <Badge className="bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-0.5 font-medium">Envoyée</Badge>;
      case "brouillon":
        return <Badge className="bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-3 py-0.5 font-medium">Brouillon</Badge>;
      case "en retard":
        return <Badge className="bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-0.5 font-medium">En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    setIsUpdating(true);
    try {
      await updateInvoiceStatus(invoice.id, newStatus);
      setInvoice({ ...invoice, status: newStatus });
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Erreur lors de la mise à jour du statut.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setIsUpdating(true);
    try {
      await deleteInvoice(invoice.id);
      setDeleteConfirmOpen(false);
      router.push("/dashboard/factures");
    } catch (error) {
      console.error("Failed to delete invoice", error);
      alert("Erreur lors de la suppression de la facture.");
      setIsUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    router.push(`/dashboard/factures/${invoice.id}/edit`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-0 relative">
      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in print:hidden">
          <Card className="w-full max-w-sm p-6 rounded-2xl shadow-2xl border-0 animate-in zoom-in-95 relative">
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Supprimer la facture ?</h2>
              <p className="text-slate-500 text-sm">
                Cette action est irréversible. Êtes-vous sûr de vouloir supprimer définitivement la facture <strong>{invoice.display_id}</strong> ?
              </p>
              <div className="w-full pt-4 flex gap-3">
                <Button 
                  disabled={isUpdating}
                  onClick={() => setDeleteConfirmOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </Button>
                <Button 
                  disabled={isUpdating}
                  onClick={confirmDelete}
                  className="flex-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/factures">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{invoice.display_id}</h1>
              {getStatusBadge(invoice.status)}
            </div>
            <p className="text-slate-500 text-sm mt-1">Gérez et suivez l'état de cette facture.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {invoice.pdf_url && (
            <a href={invoice.pdf_url} target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-full border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                Voir le PDF existant
              </Button>
            </a>
          )}
          <Button onClick={handlePrint} variant="outline" className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">
            <Printer className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
          <Button onClick={handleEdit} variant="outline" className="rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button variant="outline" onClick={handleDelete} className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
          
          {invoice.status === "brouillon" && (
            <Button disabled={isUpdating} onClick={() => handleStatusChange("envoyée")} className="rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SendHorizontal className="mr-2 h-4 w-4" />} Marquer comme Envoyée
            </Button>
          )}
          
          {invoice.status === "envoyée" && (
            <Button disabled={isUpdating} onClick={() => handleStatusChange("payée")} className="rounded-full bg-emerald-500 hover:bg-emerald-600 border-0 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] transition-all text-white">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="mr-2 h-4 w-4" />} Marquer comme Payée
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <Card id="invoice-document" className="p-5 sm:p-12 rounded-2xl border border-slate-100 shadow-xl bg-white min-h-[600px] flex flex-col relative overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-primary opacity-[0.03] rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50/50 rounded-tr-full" />

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{settings?.company_name || "Mon Entreprise"}</h1>
                  <p className="text-slate-500 text-sm">{settings?.address}</p>
                  <p className="text-slate-500 text-sm">{settings?.email}</p>
                  <p className="text-slate-500 text-sm">{settings?.phone}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 uppercase tracking-wider mb-2">Facture</h2>
                  <p className="text-slate-600 font-medium">N° {invoice.display_id}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mb-12 text-sm gap-8 sm:gap-0">
                <div>
                  <p className="text-slate-400 font-medium mb-3 text-xs uppercase tracking-wider">Facturé à :</p>
                  {client ? (
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 text-base">{client.name}</p>
                      <p className="text-slate-600">{client.address}</p>
                      <p className="text-slate-600">{client.email}</p>
                      <p className="text-slate-600">{client.phone}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Client introuvable</p>
                  )}
                </div>
                <div className="text-left sm:text-right space-y-4">
                  <div>
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Date d'émission</p>
                    <span className="font-semibold text-slate-900">{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Date d'échéance</p>
                    <span className="font-semibold text-slate-900">{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left mb-8">
                  <thead className="text-xs text-slate-400 uppercase tracking-wider border-b-2 border-slate-100">
                    <tr>
                      <th className="pb-4 font-medium">Description</th>
                      <th className="pb-4 font-medium text-center">Qté</th>
                      <th className="pb-4 font-medium text-right">Prix Unitaire</th>
                      <th className="pb-4 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(invoice.invoice_lines || []).map((line, i) => (
                      <tr key={i} className="group/row">
                        <td className="py-5 text-slate-900 font-medium">{line.description}</td>
                        <td className="py-5 text-center text-slate-600">{line.quantity}</td>
                        <td className="py-5 text-right text-slate-600">{formatFCFA(line.unit_price)}</td>
                        <td className="py-5 text-right font-semibold text-slate-900">{formatFCFA(line.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t-2 border-slate-100 pt-6 flex sm:justify-end mt-auto">
                <div className="w-full sm:w-72 space-y-4 text-sm">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Sous-total</span>
                    <span className="text-slate-900">{formatFCFA(invoice.sub_total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>TVA (18%)</span>
                    <span className="text-slate-900">{formatFCFA(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-xl text-slate-900 pt-4 border-t border-slate-100">
                    <span>Total TTC</span>
                    <span className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{formatFCFA(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
