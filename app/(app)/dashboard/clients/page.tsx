"use client";

import { useState, useEffect } from "react";
import type { Client } from "@/lib/types";
import { getClients, createClient, updateClient, deleteClient } from "@/lib/actions/clients";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, Search, AlertTriangle, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;
    
    setIsSaving(true);
    try {
      if (editingId) {
        await updateClient(editingId, newClient);
      } else {
        await createClient(newClient);
      }
      await loadClients();
      
      setNewClient({ name: "", email: "", phone: "", address: "" });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to save client:", error);
      alert("Une erreur s'est produite lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingId(client.id);
    setNewClient({ name: client.name, email: client.email || "", phone: client.phone || "", address: client.address || "" });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId) {
      try {
        await deleteClient(deleteConfirmId);
        await loadClients();
      } catch (error) {
        console.error("Failed to delete client:", error);
        alert("Une erreur s'est produite lors de la suppression.");
      } finally {
        setDeleteConfirmId(null);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-0">
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm p-6 rounded-2xl shadow-2xl border-0 animate-in zoom-in-95 relative">
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Supprimer le client ?</h2>
              <p className="text-slate-500 text-sm">
                Cette action est irréversible. Toutes les données associées pourraient être perdues.
              </p>
              <div className="w-full pt-4 flex gap-3">
                <Button 
                  onClick={() => setDeleteConfirmId(null)}
                  variant="outline"
                  className="flex-1 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="flex-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients</h1>
          <p className="text-slate-500 mt-1">Gérez votre répertoire de clients.</p>
        </div>
        <Button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) {
              setEditingId(null);
              setNewClient({ name: "", email: "", phone: "", address: "" });
            }
          }}
          className="rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white px-6 h-11"
        >
          <Plus className="mr-2 h-4 w-4" /> {showAddForm ? "Annuler" : "Nouveau Client"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-6 rounded-2xl border border-indigo-100 shadow-soft bg-indigo-50/30 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddClient} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? "Modifier le client" : "Ajouter un client"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom de l'entreprise</label>
                <input 
                  required
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input 
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
                <input 
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse complète</label>
                <input 
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <Button disabled={isSaving} type="submit" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Enregistrer
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder="Rechercher un client..." 
          className="w-full rounded-full border border-slate-200 bg-white shadow-sm pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-5" />
                
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full max-w-[200px]" />
                  <Skeleton className="h-4 w-full max-w-[180px]" />
                  <Skeleton className="h-4 w-full max-w-[240px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedClients.map(client => (
              <Card key={client.id} className="rounded-2xl border-0 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button onClick={() => handleEdit(client)} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(client.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{client.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">ID: {client.display_id}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Mail className="h-4 w-4 mr-2 text-slate-400" />
                      {client.email || "Non renseigné"}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Phone className="h-4 w-4 mr-2 text-slate-400" />
                      {client.phone || "Non renseigné"}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
                      <span className="truncate">{client.address || "Non renseigné"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredClients.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Aucun client trouvé.
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-t border-slate-100 gap-4 mt-8">
              <div className="text-sm text-slate-500 text-center sm:text-left w-full sm:w-auto">
                Affichage de {filteredClients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredClients.length)} sur {filteredClients.length} clients
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
        </>
      )}
    </div>
  );
}
