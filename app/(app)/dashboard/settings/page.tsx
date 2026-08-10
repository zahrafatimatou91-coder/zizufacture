"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Bell, Lock, LogOut, Check, Loader2 } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/actions/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [company, setCompany] = useState("");
  const [ninea, setNinea] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getSettings();
        if (data) {
          setCompany(data.company_name);
          setNinea(data.ninea);
          setPhone(data.phone);
          setAddress(data.address);
          setFirstName(data.first_name);
          setLastName(data.last_name);
          setProfileEmail(data.email);
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateCompany = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        company_name: company,
        ninea,
        phone,
        address
      });
      setShowModal(true);
    } catch (error) {
      console.error("Failed to update company", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        first_name: firstName,
        last_name: lastName,
        email: profileEmail
      });
      setShowModal(true);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-0 relative">
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm p-6 rounded-2xl shadow-2xl border-0 animate-in zoom-in-95 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Mise à jour réussie</h2>
              <p className="text-slate-500 text-sm">
                Les paramètres ont été enregistrés avec succès.
              </p>
              <div className="w-full pt-4">
                <Button 
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">Gérez les préférences de votre compte et de votre entreprise.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Settings */}
          <div className="w-full md:w-64 space-y-2">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === "profile" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}
            >
              <User className="h-5 w-5" /> Mon Profil
            </button>
            <button 
              onClick={() => setActiveTab("company")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === "company" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}
            >
              <Building2 className="h-5 w-5" /> Mon Entreprise
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === "notifications" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}
            >
              <Bell className="h-5 w-5" /> Notifications
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === "security" ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"}`}
            >
              <Lock className="h-5 w-5" /> Sécurité
            </button>
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-red-600 hover:bg-red-50">
                <LogOut className="h-5 w-5" /> Déconnexion
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <Card className="rounded-2xl border-0 shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="bg-white border-b border-slate-50 py-5">
                  <h2 className="text-xl font-bold text-slate-900">Informations Personnelles</h2>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-3xl font-bold text-indigo-700 shadow-sm border-2 border-white ring-4 ring-indigo-50">
                      {firstName.charAt(0) || "J"}{lastName.charAt(0) || "D"}
                    </div>
                    <div>
                      <Button variant="outline" className="rounded-full border-slate-200 text-slate-600 mb-2">
                        Changer la photo
                      </Button>
                      <p className="text-xs text-slate-400">JPG, GIF ou PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
                      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse Email</label>
                      <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button disabled={isSaving} onClick={handleUpdateProfile} className="rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white px-8">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Enregistrer les modifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "company" && (
              <Card className="rounded-2xl border-0 shadow-soft overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="bg-white border-b border-slate-50 py-5">
                  <h2 className="text-xl font-bold text-slate-900">Paramètres de l'entreprise</h2>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom de l'entreprise</label>
                      <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Numéro d'immatriculation (NINEA)</label>
                      <input type="text" value={ninea} onChange={e => setNinea(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Numéro de téléphone</label>
                      <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse du siège social</label>
                      <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button disabled={isSaving} onClick={handleUpdateCompany} className="rounded-full bg-gradient-primary border-0 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all text-white px-8">
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Mettre à jour l'entreprise
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab !== "profile" && activeTab !== "company" && (
              <Card className="rounded-2xl border-0 shadow-soft overflow-hidden p-12 text-center">
                <h3 className="text-lg font-medium text-slate-900 mb-2">Section en construction</h3>
                <p className="text-slate-500">Ces paramètres seront disponibles prochainement.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
