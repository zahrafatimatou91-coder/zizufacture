import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  const settings = await getSettings();

  const user = {
    name: settings ? `${settings.first_name} ${settings.last_name}`.trim() : authUser?.email || "Utilisateur",
    company: settings?.company_name || "Mon Entreprise"
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-40">
        <Sidebar user={user} />
      </div>

      <div className="flex flex-1 flex-col md:pl-72 min-w-0">
        <Header user={user} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-[100vw] overflow-x-hidden md:max-w-none md:overflow-x-visible">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
