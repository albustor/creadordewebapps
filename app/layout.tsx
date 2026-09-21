import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DocenteProvider } from "@/context/DocenteContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diagnóstico & Dashboard - Formación Tecnológica",
  description: "Entorno interactivo para la aplicación del diagnóstico de 9° año y dashboard analítico de resultados.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900`}>
        <DocenteProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </DocenteProvider>
      </body>
    </html>
  );
}
