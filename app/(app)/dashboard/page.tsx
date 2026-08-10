"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Wallet, Users, FileText, CheckCircle2, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getInvoices } from "@/lib/actions/invoices";
import { getClients } from "@/lib/actions/clients";
import { getSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";
import type { Invoice, Client } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function getStatusBadge(status: string) {
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
}

export default function DashboardPage() {
  const router = useRouter();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clientsCount, setClientsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [userName, setUserName] = useState("Utilisateur");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        const [invData, cliData, settings] = await Promise.all([
          getInvoices(), 
          getClients(),
          getSettings()
        ]);
        setInvoices(invData);
        setClientsCount(cliData.length);
        
        if (settings && (settings.first_name || settings.last_name)) {
          setUserName(`${settings.first_name} ${settings.last_name}`.trim());
        } else {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            setUserName(data.user.email?.split('@')[0] || "Utilisateur");
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    if (!startDate && !endDate) return true;
    const invDate = new Date(inv.issue_date);
    invDate.setHours(0, 0, 0, 0); // Normalize time
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (invDate < start) return false;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (invDate > end) return false;
    }
    return true;
  });

  const totalRevenu = filteredInvoices.reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalAttente = filteredInvoices.filter(inv => inv.status === 'envoyée').reduce((sum, inv) => sum + inv.total_amount, 0);
  const totalPayee = filteredInvoices.filter(inv => inv.status === 'payée').reduce((sum, inv) => sum + inv.total_amount, 0);

  const stats = [
    {
      name: "Chiffre d'Affaires Global",
      value: new Intl.NumberFormat('fr-FR').format(totalRevenu) + " FCFA",
      change: "+0%",
      trend: "up",
      icon: Wallet,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "Factures en attente",
      value: new Intl.NumberFormat('fr-FR').format(totalAttente) + " FCFA",
      change: "+0%",
      trend: "up",
      icon: FileText,
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Factures Payées",
      value: new Intl.NumberFormat('fr-FR').format(totalPayee) + " FCFA",
      change: "+0%",
      trend: "up",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      name: "Clients Enregistrés",
      value: clientsCount.toString(),
      change: "+0",
      trend: "up",
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const recentInvoices = filteredInvoices.slice(0, 5).map(inv => ({
    id: inv.display_id,
    original_id: inv.id,
    client: inv.clients?.name || "Client Inconnu",
    amount: new Intl.NumberFormat('fr-FR').format(inv.total_amount) + ' FCFA',
    date: new Date(inv.issue_date).toLocaleDateString('fr-FR'),
    status: inv.status
  }));

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-11 w-48 rounded-full" />
        </div>
        
        <Skeleton className="h-[72px] w-full rounded-2xl" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-0 shadow-soft overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-slate-50">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4"><Skeleton className="h-4 w-20" /></th>
                    <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                    <th className="px-6 py-4"><Skeleton className="h-4 w-24" /></th>
                    <th className="px-6 py-4"><Skeleton className="h-4 w-16 ml-auto" /></th>
                    <th className="px-6 py-4"><Skeleton className="h-4 w-20 ml-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="px-6 py-4 flex justify-end"><Skeleton className="h-5 w-28" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="block md:hidden p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
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
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bonjour, {userName} 👋</h1>
          <p className="text-slate-500 mt-1">Voici un aperçu de votre activité sur Zizu (Données en temps réel).</p>
        </div>
        <Link href="/dashboard/factures/new">
          <Button className="rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white px-6 h-11">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
          </Button>
        </Link>
      </div>
      
      {/* Date Filters */}
      <Card className="p-4 border-0 shadow-soft rounded-2xl flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Du :</label>
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-medium text-slate-600 whitespace-nowrap">Au :</label>
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        {(startDate || endDate) && (
          <Button 
            variant="ghost" 
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="text-slate-500 hover:text-slate-900 w-full sm:w-auto rounded-xl"
          >
            Réinitialiser
          </Button>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={stat.name} className="rounded-2xl border-0 shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.name}
              </CardTitle>
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs mt-1.5 flex items-center font-medium">
                <span className={stat.trend === "up" ? "text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-md" : "text-red-600 flex items-center bg-red-50 px-1.5 py-0.5 rounded-md"}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </span>
                <span className="text-slate-400 ml-2">vs le mois dernier</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-0 shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between bg-white border-b border-slate-50 py-5 min-w-0">
          <CardTitle className="text-lg font-semibold text-slate-900">Dernières Factures</CardTitle>
          <Link href="/dashboard/factures">
            <Button variant="outline" className="rounded-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 h-9 px-4">
              Voir tout <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0 bg-slate-50/30 sm:bg-white min-w-0">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">N° Facture</th>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Montant</th>
                  <th className="px-6 py-4 font-medium text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 bg-white">
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Aucune facture récente.</td>
                  </tr>
                ) : (
                  recentInvoices.map((invoice, i) => (
                    <tr 
                      key={invoice.original_id} 
                      onClick={() => router.push(`/dashboard/factures/${invoice.original_id}`)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-indigo-600 group-hover:text-indigo-700">{invoice.id}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{invoice.client}</td>
                      <td className="px-6 py-4 text-slate-500">{invoice.date}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800 text-right">{invoice.amount}</td>
                      <td className="px-6 py-4 text-right">
                        {getStatusBadge(invoice.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE LIST */}
          <div className="block md:hidden">
            <div className="p-4 space-y-4">
              {recentInvoices.map((invoice) => (
                <div 
                  key={invoice.original_id} 
                  onClick={() => router.push(`/dashboard/factures/${invoice.original_id}`)}
                  className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <div className="font-bold text-slate-900 text-base">{invoice.client}</div>
                      <div className="text-sm font-semibold text-indigo-600 mt-1">{invoice.id}</div>
                    </div>
                    <div>{getStatusBadge(invoice.status)}</div>
                  </div>
                  
                  <div className="flex justify-between items-end pt-3 border-t border-slate-50">
                    <div className="text-xs text-slate-500">
                      <span className="block mb-1 font-medium text-slate-400 uppercase tracking-wider">Date</span>
                      <span className="font-medium text-slate-700">{invoice.date}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Montant</span>
                      <div className="font-bold text-slate-900 text-base">{invoice.amount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
