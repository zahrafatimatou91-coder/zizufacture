"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Search, Book, MessageCircle, PlayCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Comment créer ma première facture ?",
    a: "Rendez-vous dans la section 'Factures' depuis le menu de gauche, puis cliquez sur 'Nouvelle Facture'. Remplissez les informations de votre client et vos articles, puis cliquez sur 'Envoyer' ou 'Brouillon'."
  },
  {
    q: "Puis-je changer la devise de mes factures ?",
    a: "Pour l'instant, Zizu Facture est optimisé pour les entrepreneurs africains avec la devise FCFA par défaut. La gestion multi-devises arrivera dans une prochaine mise à jour."
  },
  {
    q: "Comment ajouter la TVA à ma facture ?",
    a: "La TVA de 18% est calculée automatiquement par notre système pour le moment. Vous pourrez ajuster ce taux dans les paramètres de votre entreprise très bientôt."
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Oui, toutes vos données (factures, clients, informations d'entreprise) sont chiffrées et hébergées sur des serveurs sécurisés."
  }
];

export default function HelpPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 sm:p-0 max-w-5xl mx-auto">
      <div className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">Comment pouvons-nous vous aider ?</h1>
        <p className="text-slate-500 max-w-xl mx-auto mb-8">Recherchez dans notre documentation, suivez nos tutoriels vidéo ou contactez notre support client.</p>
        
        <div className="relative w-full max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Posez votre question (ex: comment supprimer un client...)" 
            className="w-full rounded-full border-0 shadow-lg shadow-slate-200/50 bg-white pl-12 pr-4 py-4 text-base focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-0 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-center p-6">
          <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Book className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Documentation</h3>
          <p className="text-sm text-slate-500">Guides détaillés et manuels d'utilisation de la plateforme.</p>
        </Card>
        
        <Card className="rounded-2xl border-0 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-center p-6">
          <div className="mx-auto w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PlayCircle className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Tutoriels Vidéo</h3>
          <p className="text-sm text-slate-500">Apprenez à maîtriser Zizu avec nos vidéos pas à pas.</p>
        </Card>

        <Card className="rounded-2xl border-0 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer text-center p-6">
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Support Client</h3>
          <p className="text-sm text-slate-500">Contactez directement notre équipe pour une aide personnalisée.</p>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
          <HelpCircle className="mr-3 h-6 w-6 text-indigo-600" /> Questions Fréquentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 sm:p-12 text-center text-white mt-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-tr-full" />
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">Notre équipe est disponible 7j/7 pour vous accompagner dans la gestion de votre entreprise.</p>
          <Button className="rounded-full bg-white text-indigo-900 hover:bg-slate-50 border-0 shadow-lg px-8 py-6 text-base font-bold transition-all hover:scale-105">
            Ouvrir un ticket
          </Button>
        </div>
      </div>
    </div>
  );
}
