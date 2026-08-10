"use client";

import { useState, useEffect } from "react";
import type { Invoice, InvoiceStatus } from "@/lib/types";
import { getInvoices } from "@/lib/actions/invoices";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
};

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "tous">("tous");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadInvoices() {
      try {
        const data = await getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error("Failed to load invoices", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInvoices();
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    const clientName = invoice.clients?.name || "";
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 rounded-full px-3 py-0.5 font-medium">Payée</Badge>;
      case "envoyée":
        return <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 rounded-full px-3 py-0.5 font-medium">Envoyée</Badge>;
      case "brouillon":
        return <Badge className="bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-full px-3 py-0.5 font-medium">Brouillon</Badge>;
      case "en retard":
        return <Badge className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-full px-3 py-0.5 font-medium">En retard</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Factures</h1>
          <p className="text-slate-500 mt-1">Gérez vos factures et suivez vos paiements.</p>
        </div>
        <Link href="/dashboard/factures/new">
          <Button className="rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white px-6 h-11">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
          </Button>
        </Link>
      </div>

      <Card className="rounded-2xl border-0 shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border-b border-slate-50 py-5 gap-4 min-w-0">
          <div className="relative w-full sm:max-w-xs shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Rechercher un client..." 
              className="w-full rounded-full border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide min-w-0">
            <Button 
              variant={statusFilter === "tous" ? "default" : "outline"}
              onClick={() => { setStatusFilter("tous"); setCurrentPage(1); }}
              className={`rounded-full h-10 px-5 ${statusFilter === "tous" ? "bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Tous
            </Button>
            <Button 
              variant={statusFilter === "brouillon" ? "default" : "outline"}
              onClick={() => { setStatusFilter("brouillon"); setCurrentPage(1); }}
              className={`rounded-full h-10 px-5 ${statusFilter === "brouillon" ? "bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Brouillon
            </Button>
            <Button 
              variant={statusFilter === "envoyée" ? "default" : "outline"}
              onClick={() => { setStatusFilter("envoyée"); setCurrentPage(1); }}
              className={`rounded-full h-10 px-5 ${statusFilter === "envoyée" ? "bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Envoyée
            </Button>
            <Button 
              variant={statusFilter === "payée" ? "default" : "outline"}
              onClick={() => { setStatusFilter("payée"); setCurrentPage(1); }}
              className={`rounded-full h-10 px-5 ${statusFilter === "payée" ? "bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              Payée
            </Button>
            <Button 
              variant={statusFilter === "en retard" ? "default" : "outline"}
              onClick={() => { setStatusFilter("en retard"); setCurrentPage(1); }}
              className={`rounded-full h-10 px-5 ${statusFilter === "en retard" ? "bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              En retard
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-slate-50/30 sm:bg-white">
          {isLoading ? (
            <div className="w-full">
              {/* DESKTOP SKELETON */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-medium"><Skeleton className="h-4 w-20" /></th>
                      <th className="px-6 py-4 font-medium"><Skeleton className="h-4 w-24" /></th>
                      <th className="px-6 py-4 font-medium"><Skeleton className="h-4 w-24" /></th>
                      <th className="px-6 py-4 font-medium"><Skeleton className="h-4 w-24" /></th>
                      <th className="px-6 py-4 font-medium"><Skeleton className="h-4 w-24" /></th>
                      <th className="px-6 py-4 font-medium text-right"><Skeleton className="h-4 w-16 ml-auto" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-5 w-28" /></td>
                        <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE SKELETON */}
              <div className="block md:hidden p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="pr-2 space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    
                    <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="space-y-2 flex flex-col items-end">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase tracking-wider bg-slate-50/80 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-medium">N° Facture</th>
                      <th className="px-6 py-4 font-medium">Client</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Échéance</th>
                      <th className="px-6 py-4 font-medium">Montant TTC</th>
                      <th className="px-6 py-4 font-medium text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {paginatedInvoices.map((invoice) => {
                      const clientName = invoice.clients?.name || "Client Inconnu";
                      return (
                        <tr 
                          key={invoice.id} 
                          onClick={() => router.push(`/dashboard/factures/${invoice.id}`)}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4 font-medium text-indigo-600 group-hover:text-indigo-700">{invoice.display_id}</td>
                          <td className="px-6 py-4 text-slate-700 font-medium">{clientName}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</td>
                          <td className="px-6 py-4 text-slate-500">{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900">{formatFCFA(invoice.total_amount)}</td>
                          <td className="px-6 py-4 text-right">
                            {getStatusBadge(invoice.status)}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredInvoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          Aucune facture trouvée pour ces critères.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* MOBILE LIST */}
              <div className="block md:hidden">
                <div className="p-4 space-y-4">
                  {paginatedInvoices.map((invoice) => {
                    const clientName = invoice.clients?.name || "Client Inconnu";
                    return (
                      <div 
                        key={invoice.id} 
                        onClick={() => router.push(`/dashboard/factures/${invoice.id}`)}
                        className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="pr-2">
                            <div className="font-bold text-slate-900 text-base">{clientName}</div>
                            <div className="text-sm font-semibold text-indigo-600 mt-1">{invoice.display_id}</div>
                          </div>
                          <div>{getStatusBadge(invoice.status)}</div>
                        </div>
                        
                        <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                          <div className="text-xs text-slate-500">
                            <span className="block mb-1 font-medium text-slate-400 uppercase tracking-wider">Échéance</span>
                            <span className="font-medium text-slate-700">{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total TTC</span>
                            <div className="font-bold text-slate-900 text-base">{formatFCFA(invoice.total_amount)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredInvoices.length === 0 && (
                    <div className="py-12 text-center text-slate-500 text-sm">
                      Aucune facture trouvée pour ces critères.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
        {/* PAGINATION */}
        {!isLoading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-50 bg-white/50 gap-4">
            <div className="text-sm text-slate-500 text-center sm:text-left w-full sm:w-auto">
              Affichage de {filteredInvoices.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} sur {filteredInvoices.length} factures
            </div>
            <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline" size="sm" 
                className="rounded-lg text-slate-600 h-8 hover:bg-slate-50 hover:text-indigo-600 hover:-translate-y-0.5 transition-all" 
              >
                Précédent
              </Button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm" 
                  className={`rounded-lg h-8 w-8 p-0 transition-all hover:-translate-y-0.5 ${currentPage === i + 1 ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}
                >
                  {i + 1}
                </Button>
              ))}

              <Button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                variant="outline" size="sm" 
                className="rounded-lg text-slate-600 h-8 hover:bg-slate-50 hover:text-indigo-600 hover:-translate-y-0.5 transition-all" 
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
