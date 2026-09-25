import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DocenteProvider } from "@/context/DocenteContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Diagnóstico Secundaria PNFT - Tecnologías de la Información",
  description: "Recurso oficial para el desarrollo del diagnóstico formativo en 7°, 8° y 9° año con base en el Programa Nacional de Formación Tecnológica (PNFT).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${plusJakartaSans.className} ${inter.variable} min-h-screen flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900 bg-[#EEF2F6]`}>
        <DocenteProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </DocenteProvider>
      </body>
    </html>
  );
}
