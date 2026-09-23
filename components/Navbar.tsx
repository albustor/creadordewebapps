"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDocente } from "@/context/DocenteContext";
import {
  House,
  ChartBar,
  UserCircle,
  List,
  X,
  ShieldCheck,
  ShieldStar,
  SignOut,
  SignIn,
  Lightning,
} from "@phosphor-icons/react";

export default function Navbar() {
  const pathname = usePathname();
  const { docente, cerrarSesion } = useDocente();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const esSuperAdmin =
    docente?.correoInstitucional?.toLowerCase().trim() === "alberto.bustos.ortega@mep.go.cr" ||
    docente?.correoInstitucional?.toLowerCase().trim() === "allan.morera.araya@mep.go.cr";

  const esAsesor =
    esSuperAdmin ||
    docente?.tipoRol === "Asesor Nacional" ||
    docente?.tipoRol === "Asesor Regional" ||
    docente?.dreCodigo === "DRE-NACIONAL";

  // Navegación: Inicio, Dashboard (Docentes), Diagnóstico (Asesoría & Recursos solo para asesores)
  const enlaces = [
    {
      href: "/",
      label: "Inicio",
      icon: <House size={18} weight="bold" />,
      titulo: "Página de inicio y autenticación",
    },
    {
      href: "/dashboard",
      label: "Dashboard Docente",
      icon: <ChartBar size={18} weight="duotone" />,
      titulo: "Panel de control del docente, enlaces seguros y telemetría de 7°, 8° y 9°",
    },
    ...(esAsesor
      ? [
          {
            href: "/diagnostico",
            label: "Asesoría & Recursos",
            icon: <Lightning size={18} weight="fill" className="text-amber-600" />,
            titulo: "Módulo para asesores nacionales, regionales y exploración curricular por nivel",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FCFBF9]/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo & Marca */}
          <Link
            href={docente ? "/dashboard" : "/"}
            className="flex items-center gap-3 shrink-0 group py-1 focus:outline-none"
            title="Diagnóstico Secundaria - Tecnologías de la Información"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 border border-emerald-300/80 flex items-center justify-center text-emerald-800 shadow-xs group-hover:scale-105 transition-all">
              <Lightning size={24} weight="fill" className="text-amber-600" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-none whitespace-nowrap">
                Diagnóstico Secundaria
              </span>
              <span className="text-[11px] font-extrabold text-emerald-700 tracking-wider uppercase leading-none mt-1.5 whitespace-nowrap flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Evaluación Diagnóstica MEP • 7°, 8° y 9°
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
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
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-300/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-stone-100/80 border border-transparent"
                  }`}
                >
                  <span className={activo ? "text-emerald-700" : "text-slate-500"}>
                    {enlace.icon}
                  </span>
                  <span>{enlace.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Perfil Docente / Acceso */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {docente ? (
              <>
                {/* Enlace a Administración EXCLUSIVO para Alberto Bustos Ortega (Super Administrador) */}
                {esSuperAdmin && (
                  <Link
                    href="/admin"
                    title="Panel de administración y gobernanza general"
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      pathname === "/admin"
                        ? "bg-amber-100/80 text-amber-900 border-amber-300 shadow-xs"
                        : "bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 border-stone-300/70"
                    }`}
                  >
                    <ShieldCheck size={16} weight="fill" className="text-amber-600" />
                    <span>Administración</span>
                  </Link>
                )}

                <Link
                  href="/registro"
                  title="Configuración de perfil docente"
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all shadow-xs group ${
                    esSuperAdmin
                      ? "border-amber-300 bg-amber-50/60 hover:bg-amber-50 text-slate-900"
                      : "border-stone-300 bg-white hover:bg-stone-50 text-slate-900"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-xs ${
                      esSuperAdmin
                        ? "bg-amber-500 text-white group-hover:scale-105"
                        : "bg-emerald-700 text-white"
                    }`}
                  >
                    {esSuperAdmin ? (
                      <ShieldStar size={20} weight="fill" />
                    ) : (
                      <UserCircle size={20} weight="bold" />
                    )}
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-xs font-extrabold text-slate-900 leading-none whitespace-nowrap flex items-center gap-1">
                      {(() => {
                        const raw = docente?.nombreCompleto || "Docente";
                        const limpio = raw
                          .replace(/^(Prof\.|Profa\.|Lic\.|Licda\.|Ing\.|Dr\.|Dra\.|Don|Doña)\s+/i, "")
                          .trim();
                        const partes = limpio.split(/\s+/).filter(Boolean);
                        if (partes.length >= 2) {
                          return `${partes[0]} ${partes[1]}`;
                        }
                        return partes[0] || "Docente";
                      })()}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold leading-none mt-1 whitespace-nowrap ${
                        esSuperAdmin ? "text-amber-800 font-extrabold" : "text-emerald-700"
                      }`}
                    >
                      {docente?.idDocente || "DOC-7729"}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => cerrarSesion()}
                  title="Cerrar sesión"
                  className="p-2.5 rounded-xl text-stone-600 hover:text-rose-700 hover:bg-rose-50 border border-stone-300/80 transition-colors"
                >
                  <SignOut size={18} weight="bold" />
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-xl shadow-sm transition-all"
              >
                <SignIn size={18} weight="bold" />
                <span>Ingreso docente</span>
              </Link>
            )}
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2.5 rounded-xl text-stone-700 hover:text-slate-900 hover:bg-stone-100 border border-stone-300 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {menuAbierto ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {menuAbierto && (
        <div className="md:hidden border-t border-stone-200 bg-[#FCFBF9] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {enlaces.map((enlace) => {
            const activo = pathname === enlace.href;
            return (
              <Link
                key={enlace.href}
                href={enlace.href}
                onClick={() => setMenuAbierto(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                  activo
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                    : "text-slate-700 hover:bg-stone-100"
                }`}
              >
                <span className={activo ? "text-emerald-700" : "text-slate-500"}>{enlace.icon}</span>
                <span>{enlace.label}</span>
              </Link>
            );
          })}

          {esSuperAdmin && (
            <Link
              href="/admin"
              onClick={() => setMenuAbierto(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-amber-900 bg-amber-50 border border-amber-300"
            >
              <ShieldCheck size={20} weight="fill" className="text-amber-600" />
              <span>Administración</span>
            </Link>
          )}

          <div className="pt-3 mt-2 border-t border-stone-200 space-y-2">
            {docente ? (
              <>
                <Link
                  href="/registro"
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center justify-between p-3.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-slate-900 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                      {esSuperAdmin ? (
                        <ShieldStar size={22} weight="fill" className="text-amber-300" />
                      ) : (
                        <UserCircle size={22} weight="bold" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-none">
                        {docente?.nombreCompleto || "Docente"}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono mt-1">
                        {docente?.correoInstitucional || ""}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-mono font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {docente?.idDocente || "DOC-7729"}
                  </span>
                </Link>

                <button
                  onClick={() => {
                    cerrarSesion();
                    setMenuAbierto(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
                >
                  <SignOut size={18} weight="bold" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                onClick={() => setMenuAbierto(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm"
              >
                <SignIn size={18} weight="bold" />
                <span>Ingreso docente</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
