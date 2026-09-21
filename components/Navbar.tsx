"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocente } from "@/context/DocenteContext";
import {
  Sparkle,
  ChartBar,
  CodeBlock,
  UserCircle,
  List,
  X,
  ShieldCheck,
  ShieldStar,
  SignOut,
  SignIn,
  Lightning,
  UsersThree,
} from "@phosphor-icons/react";

export default function Navbar() {
  const pathname = usePathname();
  const { docente, cerrarSesion } = useDocente();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Navegación principal consolidada:
  // 1. Inicio | 2. Creación WebApps | 3. Zona Común | 4. Diagnóstico IA | 5. Dashboard
  const enlaces = [
    {
      href: "/",
      label: "Inicio",
      icon: <Sparkle size={18} weight="duotone" />,
      titulo: "Página Principal",
    },
    {
      href: "/taller-webapps",
      label: "Creación WebApps",
      icon: <CodeBlock size={18} weight="duotone" />,
      titulo: "Recurso para Creación de WebApps Educativas",
    },
    {
      href: "/comunidad",
      label: "Zona Común",
      icon: <UsersThree size={18} weight="duotone" />,
      titulo: "Espacio Común y Galería de WebApps Creadas",
    },
    {
      href: "/diagnostico",
      label: "Diagnóstico IA",
      icon: <Lightning size={18} weight="fill" className="text-amber-300" />,
      titulo: "Diagnóstico por Documentos y Planeamiento",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <ChartBar size={18} weight="duotone" />,
      titulo: "Dashboard Analítico y Telemetría",
    },
  ];

  const esAdminOAsesor =
    docente?.rol?.includes("Asesor") ||
    docente?.rol?.includes("Administrador") ||
    docente?.correoInstitucional === "alberto.bustos.ortega@mep.go.cr" ||
    docente?.idDocente?.startsWith("ASESOR");

  return (
    <header className="sticky top-0 z-50 bg-emerald-950/85 backdrop-blur-xl border-b border-emerald-500/25 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Marca con Estilo Verde Esmeralda Traslúcido */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group py-1 focus:outline-none"
            title="Creador de WebApps - III Ciclo Secundaria"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/60 group-hover:scale-105 border border-emerald-400/30 transition-all">
              <CodeBlock size={24} weight="bold" className="text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-black text-base sm:text-lg tracking-tight text-white leading-none whitespace-nowrap drop-shadow-xs">
                Creador de WebApps
              </span>
              <span className="text-[11px] font-extrabold text-emerald-400 tracking-wider uppercase leading-none mt-1.5 whitespace-nowrap flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                III Ciclo • Secundaria
              </span>
            </div>
          </Link>

          {/* Navegación Desktop - Botones de Mayor Tamaño y Traslúcidos */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {enlaces.map((enlace) => {
              const activo = pathname === enlace.href;
              return (
                <Link
                  key={enlace.href}
                  href={enlace.href}
                  title={enlace.titulo}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all select-none ${
                    activo
                      ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 shadow-md shadow-emerald-950/40 backdrop-blur-md"
                      : "text-emerald-100/80 hover:text-white hover:bg-emerald-900/50 border border-transparent"
                  }`}
                >
                  <span className={activo ? "text-emerald-300" : "text-emerald-400/80"}>
                    {enlace.icon}
                  </span>
                  <span>{enlace.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Perfil Docente / Panel Asesores & Cerrar Sesión */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {docente ? (
              <>
                {/* Enlace directo a Administración si es Asesor / Super Admin */}
                {esAdminOAsesor && (
                  <Link
                    href="/admin"
                    title="Panel de Administración, Asesorías y Gobernanza"
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      pathname === "/admin"
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm"
                        : "bg-emerald-900/40 text-emerald-200 hover:text-white hover:bg-emerald-900/70 border-emerald-700/40"
                    }`}
                  >
                    <ShieldCheck size={16} weight="fill" className="text-amber-400" />
                    <span>Administración</span>
                  </Link>
                )}

                <Link
                  href="/registro"
                  title={
                    esAdminOAsesor
                      ? "Perfil Asesor & Administrador General"
                      : "Configuración de Perfil y Credenciales Docente"
                  }
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all shadow-md group ${
                    esAdminOAsesor
                      ? "border-amber-400/40 bg-gradient-to-r from-emerald-900/90 to-teal-950/90 hover:border-amber-300 text-white"
                      : "border-emerald-700/50 bg-emerald-900/50 hover:bg-emerald-900/80 text-white"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-xs ${
                      esAdminOAsesor
                        ? "bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 group-hover:scale-105"
                        : "bg-emerald-700 group-hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {esAdminOAsesor ? (
                      <ShieldStar size={20} weight="fill" />
                    ) : (
                      <UserCircle size={20} weight="bold" />
                    )}
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-xs font-extrabold text-white leading-none whitespace-nowrap flex items-center gap-1">
                      {(() => {
                        const raw = docente?.nombreCompleto || "Alberto Bustos";
                        const limpio = raw
                          .replace(/^(Prof\.|Profa\.|Lic\.|Licda\.|Ing\.|Dr\.|Dra\.|Don|Doña)\s+/i, "")
                          .trim();
                        const partes = limpio.split(/\s+/).filter(Boolean);
                        if (partes.length >= 2) {
                          return `${partes[0]} ${partes[1]}`;
                        }
                        return partes[0] || "Alberto Bustos";
                      })()}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold leading-none mt-1 whitespace-nowrap ${
                        esAdminOAsesor ? "text-amber-300 font-extrabold" : "text-emerald-300"
                      }`}
                    >
                      {docente?.idDocente || "DOC-7729"}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => cerrarSesion()}
                  title="Cerrar Sesión"
                  className="p-2.5 rounded-xl text-emerald-200 hover:text-rose-300 hover:bg-rose-950/40 border border-emerald-700/40 transition-colors"
                >
                  <SignOut size={18} weight="bold" />
                </button>
              </>
            ) : (
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg transition-all"
              >
                <SignIn size={18} weight="bold" />
                <span>Ingreso Docente</span>
              </Link>
            )}
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-900/60 border border-emerald-700/40 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {menuAbierto ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {menuAbierto && (
        <div className="md:hidden border-t border-emerald-800/60 bg-emerald-950/98 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fadeIn text-white">
          {enlaces.map((enlace) => {
            const activo = pathname === enlace.href;
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                  activo
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40"
                    : "text-emerald-100 hover:bg-emerald-900/50"
                }`}
              >
                <span className={activo ? "text-emerald-300" : "text-emerald-400"}>{enlace.icon}</span>
                <span>{enlace.label}</span>
              </Link>
            );
          })}

          {esAdminOAsesor && (
            <Link
              href="/admin"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/10 border border-amber-400/30"
            >
              <ShieldCheck size={20} weight="fill" className="text-amber-400" />
              <span>Administración</span>
            </Link>
          )}

          <div className="pt-3 mt-2 border-t border-emerald-800/60 space-y-2">
            {docente ? (
              <>
                <Link
                  href="/registro"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between p-3.5 bg-emerald-900/40 border border-emerald-700/40 rounded-xl text-xs font-bold text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                      {esAdminOAsesor ? (
                        <ShieldStar size={22} weight="fill" className="text-amber-300" />
                      ) : (
                        <UserCircle size={22} weight="bold" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white leading-none">
                        {docente?.nombreCompleto || "Prof. Alberto Bustos Ortega"}
                      </div>
                      <div className="text-[11px] text-emerald-300/80 font-mono mt-1">
                        {docente?.correoInstitucional || "alberto.bustos.ortega@mep.go.cr"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-300 font-mono font-extrabold bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-600/40">
                    {docente?.idDocente || "DOC-7729"}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    cerrarSesion();
                    setMenuAbierto(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-rose-950/40 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-bold transition-colors"
                >
                  <SignOut size={18} weight="bold" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/registro"
                onClick={() => setMenuAbierto(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg"
              >
                <SignIn size={18} weight="bold" />
                <span>Ingreso Docente</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

