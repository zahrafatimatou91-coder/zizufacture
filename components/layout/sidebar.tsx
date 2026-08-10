"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Factures", href: "/dashboard/factures", icon: FileText },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ onNavigate, user }: { onNavigate?: () => void, user?: { name: string, company: string } }) {
  const pathname = usePathname() || "";

  return (
    <div className="flex h-full flex-col bg-white md:border-r border-slate-100 px-4 py-6 md:shadow-sm">
      <div className="mb-6 px-2 flex items-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Zizu Facture
        </h1>
      </div>
      <nav className="flex-1 space-y-3 mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={cn(
                "group flex items-center rounded-xl px-4 py-3.5 md:py-3 text-base font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
              )}
            >
              <item.icon
                className={cn(
                  "mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-indigo-700" : "text-slate-400 group-hover:text-indigo-600"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-2 space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100/50">
          <h3 className="text-sm font-semibold text-indigo-900">Besoin d'aide ?</h3>
          <p className="mt-1 text-xs text-indigo-600/80 mb-3">Consultez notre documentation pour démarrer.</p>
          <Link href="/dashboard/help" className="block" onClick={() => onNavigate?.()}>
            <button className="text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 w-full py-2 rounded-full transition-colors">
              Voir le guide
            </button>
          </Link>
        </div>
        
        <div className="md:hidden flex items-center gap-3 pt-4 border-t border-slate-100">
          <Avatar className="h-10 w-10 border-2 border-indigo-100">
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback className="bg-indigo-50 text-indigo-700 font-medium">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-base font-medium text-slate-700 truncate">{user?.name || "Utilisateur"}</p>
            <p className="text-sm text-slate-500 truncate">{user?.company || "Mon Entreprise"}</p>
          </div>
          <button 
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors md:hidden"
            title="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        
        <div className="hidden md:block pt-4 border-t border-slate-100">
          <button 
            onClick={() => logout()}
            className="flex items-center w-full rounded-xl px-4 py-3 text-base font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="mr-4 h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
