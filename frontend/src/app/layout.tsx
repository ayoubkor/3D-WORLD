import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
  title: "Print3D Shop - Impression 3D Anime & Créative",
  description: "Boutique en ligne de produits d'impression 3D bilingue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-zinc-950 border-t border-zinc-900 py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center text-zinc-500 text-sm">
              © 2026 Print3D Shop. Tous droits réservés.
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
