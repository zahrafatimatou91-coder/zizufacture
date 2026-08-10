"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { Input } from "@/components/ui/input";

import { useState } from "react";

export function Header({ user }: { user?: { name: string, company: string } }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 shadow-sm">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger 
          render={<Button variant="ghost" size="icon" className="md:hidden rounded-full" />}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] max-w-[320px] sm:w-80 p-0 border-0">
          <Sidebar onNavigate={() => setIsOpen(false)} user={user} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center gap-4 md:ml-0">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Rechercher..." 
            className="w-full rounded-full bg-slate-50/50 pl-11 border-slate-200 focus-visible:ring-indigo-500 focus-visible:bg-white h-10 transition-colors" 
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{user?.name || "Utilisateur"}</p>
            <p className="text-xs text-slate-500">{user?.company || "Mon Entreprise"}</p>
          </div>
          <Avatar className="h-10 w-10 border-2 border-indigo-100 ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
            <AvatarImage src="" alt="avatar" />
            <AvatarFallback className="bg-indigo-50 text-indigo-700 font-medium">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
