"use client";

import { useState, useEffect } from "react";
import { getClients } from "@/lib/actions/clients";
import { getSettings } from "@/lib/actions/settings";
import { createInvoice } from "@/lib/actions/invoices";
import type { Client, CompanySettings, InvoiceStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, ArrowLeft, Send, Save, ChevronDown, Check, Calendar as CalendarIcon, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Popover from '@radix-ui/react-popover';
import { Skeleton } from "@/components/ui/skeleton";
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const formatFCFA = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(Math.round(amount)) + ' FCFA';
};

const CustomSelect = ({ value, onChange, options, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.value === value);
  
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm cursor-pointer hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 shadow-sm transition-all"
      >
        <span className={selectedOption ? "text-slate-900 font-medium" : "text-slate-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-200 p-1">
            {options.map((o: any) => (
              <div 
                key={o.value} 
                onClick={() => { onChange(o.value); setIsOpen(false); }} 
                className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-lg cursor-pointer transition-colors ${o.value === value ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-slate-50 text-slate-700"}`}
              >
                {o.label}
                {o.value === value && <Check className="h-4 w-4 text-indigo-600" />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const DatePicker = ({ date, setDate, placeholder }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className="w-full flex justify-between items-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm cursor-pointer hover:border-indigo-400 hover:ring-1 hover:ring-indigo-400 shadow-sm transition-all">
          <span className={date ? "text-slate-900 font-medium" : "text-slate-500"}>
            {date ? format(date, "PP", { locale: fr }) : placeholder}
          </span>
          <CalendarIcon className="h-4 w-4 text-slate-400" />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="z-50 bg-white border border-slate-100 rounded-2xl shadow-xl p-3 animate-in fade-in zoom-in-95" sideOffset={8}>
          <style>{`
            .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #4f46e5; --rdp-background-color: #e0e7ff; margin: 0; }
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover { background-color: var(--rdp-accent-color); color: white; border-radius: 8px; }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--rdp-background-color); border-radius: 8px; color: #4f46e5; }
            .rdp-day_today:not(.rdp-day_selected) { font-weight: bold; color: #4f46e5; }
          `}</style>
          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => { setDate(d); setOpen(false); }}
            locale={fr}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default function NewInvoicePage() {
  const router = useRouter();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [clientId, setClientId] = useState<string>("");
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [lines, setLines] = useState<{ id: string, description: string, quantity: number | string, unitPrice: number | string }[]>([
    { id: Date.now().toString(), description: "", quantity: 1, unitPrice: "" }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedStatus, setSavedStatus] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [cliData, settsData] = await Promise.all([getClients(), getSettings()]);
        setClients(cliData);
        setSettings(settsData);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsDataLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedClient = clients.find(c => c.id === clientId);

  const subTotal = lines.reduce((acc, line) => acc + ((Number(line.quantity) || 0) * (Number(line.unitPrice) || 0)), 0);
  const tax = subTotal * 0.18;
  const totalAmount = subTotal + tax;

  const handleAddLine = () => {
    setLines([...lines, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: "" }]);
  };

  const handleRemoveLine = (id: string) => {
    setLines(lines.filter(l => l.id !== id));
  };

  const updateLine = (id: string, field: string, value: string | number) => {
    setLines(lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleSave = async (status: InvoiceStatus) => {
    if (!clientId) {
      setErrorMessage("Veuillez sélectionner un client pour pouvoir enregistrer la facture.");
      setShowErrorModal(true);
      return;
    }
    
    setIsSaving(true);
    try {
      await createInvoice({
        client_id: clientId,
        issue_date: issueDate ? issueDate.toISOString() : new Date().toISOString(),
        due_date: dueDate ? dueDate.toISOString() : new Date().toISOString(),
        status,
        sub_total: subTotal,
        tax,
        total_amount: totalAmount,
        lines: lines.map(l => ({
          description: l.description,
          quantity: Number(l.quantity) || 0,
          unit_price: Number(l.unitPrice) || 0,
          total: (Number(l.quantity) || 0) * (Number(l.unitPrice) || 0)
        }))
      });
      
      setSavedStatus(status);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to save invoice", error);
      setErrorMessage("Une erreur s'est produite lors de l'enregistrement de la facture.");
      setShowErrorModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const clientOptions = clients.map(c => ({ label: c.name, value: c.id }));

  if (isDataLoading) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="p-6 rounded-2xl border-0 shadow-soft">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="space-y-5">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 rounded-2xl border-0 shadow-soft">
              <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_80px_120px_auto] gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                    <div className="col-span-2 sm:col-span-1 space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <div className="col-span-2 sm:col-span-1 pt-0 sm:pt-6 flex justify-end">
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="lg:sticky lg:top-24">
            <Card className="p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-xl min-h-[600px] flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="text-right space-y-2 flex flex-col items-end">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
              <div className="flex-1 mt-10">
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-4 w-3/4 mb-4" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-0">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in print:hidden">
          <Card className="w-full max-w-md p-6 rounded-2xl shadow-2xl border-0 animate-in zoom-in-95 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Facture enregistrée !</h2>
              <p className="text-slate-500">
                Votre facture a été enregistrée avec succès en tant que <span className="font-semibold text-slate-700">{savedStatus}</span>.
              </p>
              <div className="w-full pt-4 space-y-3">
                <Button 
                  onClick={() => window.print()}
                  className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                >
                  Télécharger (PDF)
                </Button>
                <Button 
                  onClick={() => router.push('/dashboard/factures')}
                  variant="outline"
                  className="w-full rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Retour aux factures
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in print:hidden">
          <Card className="w-full max-w-sm p-6 rounded-2xl shadow-2xl border-0 animate-in zoom-in-95 relative">
            <button 
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Erreur</h2>
              <p className="text-slate-500 text-sm">
                {errorMessage}
              </p>
              <div className="w-full pt-4">
                <Button 
                  onClick={() => setShowErrorModal(false)}
                  className="w-full rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                >
                  Compris
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Nouvelle Facture</h1>
            <p className="text-slate-500 text-sm mt-1">Créez et envoyez une facture en quelques clics.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button disabled={isSaving} onClick={() => handleSave('brouillon')} variant="outline" className="flex-1 sm:flex-none rounded-full border-slate-200 text-slate-600 hover:bg-slate-50 px-6">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Brouillon
          </Button>
          <Button disabled={isSaving} onClick={() => handleSave('envoyée')} className="flex-1 sm:flex-none rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white px-6">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Envoyer
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6 print:hidden">
          <Card className="p-6 rounded-2xl border-0 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Informations Générales</h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Client</label>
                <CustomSelect 
                  options={clientOptions}
                  value={clientId}
                  onChange={setClientId}
                  placeholder="Sélectionner un client..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date d'émission</label>
                  <DatePicker 
                    date={issueDate}
                    setDate={setIssueDate}
                    placeholder="jj/mm/aaaa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date d'échéance</label>
                  <DatePicker 
                    date={dueDate}
                    setDate={setDueDate}
                    placeholder="jj/mm/aaaa"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl border-0 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Lignes de la facture</h2>
              <Button onClick={handleAddLine} variant="outline" size="sm" className="rounded-full border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </div>

            <div className="space-y-4">
              {lines.map((line) => (
                <div key={line.id} className="group relative grid grid-cols-2 sm:grid-cols-[1fr_80px_120px_auto] gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                    <input 
                      type="text"
                      placeholder="Description..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                      value={line.description}
                      onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Qté</label>
                    <input 
                      type="number"
                      min="1"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                      value={line.quantity}
                      onChange={(e) => updateLine(line.id, 'quantity', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Prix U.</label>
                    <input 
                      type="number"
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
                      value={line.unitPrice}
                      onChange={(e) => updateLine(line.id, 'unitPrice', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 pt-0 sm:pt-6 flex justify-end">
                    <Button 
                      onClick={() => handleRemoveLine(line.id)}
                      variant="ghost" 
                      className="w-full sm:w-10 h-10 rounded-xl sm:rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 sm:opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2"
                      disabled={lines.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:hidden text-sm font-medium">Supprimer la ligne</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24">
          <Card className="p-5 sm:p-8 rounded-2xl border border-slate-100 shadow-xl bg-white min-h-[600px] flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-[0.03] rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-50/50 rounded-tr-full" />

            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{settings?.company_name || "Mon Entreprise"}</h1>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">{settings?.address || "Adresse non renseignée"}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 uppercase tracking-wider">Facture</h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">Brouillon</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mb-10 text-sm gap-6 sm:gap-0">
                <div>
                  <p className="text-slate-400 font-medium mb-1 text-xs uppercase tracking-wider">Facturé à :</p>
                  {selectedClient ? (
                    <div>
                      <p className="font-bold text-slate-900 text-base">{selectedClient.name}</p>
                      <p className="text-slate-600 mt-0.5">{selectedClient.address}</p>
                      <p className="text-slate-600">{selectedClient.email}</p>
                      <p className="text-slate-600">{selectedClient.phone}</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">Aucun client sélectionné</p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <div className="mb-3">
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Date d'émission</p>
                    <span className="font-semibold text-slate-900">{issueDate ? format(issueDate, "PP", { locale: fr }) : "-"}</span>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Date d'échéance</p>
                    <span className="font-semibold text-slate-900">{dueDate ? format(dueDate, "PP", { locale: fr }) : "-"}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm text-left mb-6">
                  <thead className="text-xs text-slate-400 uppercase tracking-wider border-b-2 border-slate-100">
                    <tr>
                      <th className="pb-3 font-medium">Description</th>
                      <th className="pb-3 font-medium text-center">Qté</th>
                      <th className="pb-3 font-medium text-right">Prix Unitaire</th>
                      <th className="pb-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {lines.map((line, i) => {
                      const qty = Number(line.quantity) || 0;
                      const price = Number(line.unitPrice) || 0;
                      return (
                        <tr key={i} className="group/row">
                          <td className="py-4 text-slate-900 font-medium">{line.description || <span className="text-slate-300 italic">...</span>}</td>
                          <td className="py-4 text-center text-slate-600">{qty}</td>
                          <td className="py-4 text-right text-slate-600">{formatFCFA(price)}</td>
                          <td className="py-4 text-right font-semibold text-slate-900">{formatFCFA(qty * price)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border-t-2 border-slate-100 pt-5 flex sm:justify-end">
                <div className="w-full sm:w-64 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Sous-total</span>
                    <span className="text-slate-900">{formatFCFA(subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>TVA (18%)</span>
                    <span className="text-slate-900">{formatFCFA(tax)}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total TTC</span>
                    <span className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">{formatFCFA(totalAmount)}</span>
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
