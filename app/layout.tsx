import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: "--font-be-vietnam-pro" 
});

export const metadata: Metadata = {
  title: "Facture Zizu",
  description: "SaaS de facturation pour entrepreneurs africains",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans antialiased", inter.variable, montserrat.variable, beVietnamPro.variable)}>
      <body className="overflow-x-hidden max-w-[100vw]">
        {children}
      </body>
    </html>
  );
}
