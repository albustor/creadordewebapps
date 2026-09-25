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

  const correoLimpio = docente?.correoInstitucional?.toLowerCase().trim() || "";
  const esSuperAdmin = correoLimpio === "alberto.bustos.ortega@mep.go.cr";
  const esAsesor =
    esSuperAdmin ||
    correoLimpio === "allan.morera.araya@mep.go.cr" ||
    (docente?.tipoRol === "Asesor Nacional" || docente?.tipoRol === "Asesor Regional");

  // Navegación contextual:
  // - Sin autenticar: Se muestra exclusivamente "Inicio"
  // - Con sesión activa: Se oculta "Inicio" y se muestra "Panel Docente" (+ Asesoría si aplica)
  const enlaces = docente
    ? [
        {
          href: "/dashboard",
          label: "Panel Docente",
          icon: <ChartBar size={18} weight="duotone" />,
          titulo: "Panel de control docente, gestión de grupos, áreas y telemetría de 7.° y 9.°",
        },
        ...(esAsesor
          ? [
              {
                href: "/diagnostico",
                label: "Asesoría & Recursos",
                icon: <Lightning size={18} weight="fill" className="text-amber-600" />,
                titulo: "Portal interactivo de asesoría curricular, pilotaje multinivel y recursos",
              },
            ]
          : []),
      ]
    : [
        {
          href: "/",
          label: "Inicio",
          icon: <House size={18} weight="bold" />,
          titulo: "Página de inicio y autenticación institucional",
        },
      ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#CBD5E1]/80 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Marca Stitch / Aula Clara */}
          <Link
            href={docente ? "/dashboard" : "/"}
            className="flex items-center gap-3 shrink-0 group py-1 focus:outline-none"
            title="Diagnóstico Secundaria - Tecnologías de la Información"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#D1EBE7] border border-[#9FD1C9] flex items-center justify-center text-[#1B5E59] shadow-xs group-hover:scale-105 transition-all">
              <Lightning size={24} weight="fill" className="text-[#E07A2C]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-black text-base sm:text-lg tracking-tight text-[#0D1C2E] leading-none whitespace-nowrap">
                Diagnóstico Secundaria PNFT
              </span>
              <span className="text-[11px] font-bold text-[#1B5E59] tracking-wider uppercase leading-none mt-1.5 whitespace-nowrap flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Evaluación MEP • 7.° y 9.° Año
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
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all select-none ${
                    activo
                      ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-xs border border-[#9FD1C9]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent"
                  }`}
                >
                  <span className={activo ? "text-[#1B5E59]" : "text-slate-500"}>
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
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                      pathname === "/admin"
                        ? "bg-amber-100 text-amber-950 border-amber-300 shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border-slate-300"
                    }`}
                  >
                    <ShieldCheck size={16} weight="fill" className="text-[#E07A2C]" />
                    <span>Administración</span>
                  </Link>
                )}

                <Link
                  href="/registro"
                  title="Configuración de perfil docente"
                  className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all shadow-xs group ${
                    esSuperAdmin
                      ? "border-amber-300 bg-amber-50 hover:bg-amber-100 text-slate-900"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-900"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors shadow-xs ${
                      esSuperAdmin
                        ? "bg-[#E07A2C] text-white group-hover:scale-105"
                        : "bg-[#1B5E59] text-white"
                    }`}
                  >
                    {esSuperAdmin ? (
                      <ShieldStar size={20} weight="fill" />
                    ) : (
                      <UserCircle size={20} weight="bold" />
                    )}
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-xs font-bold text-slate-900 leading-none whitespace-nowrap flex items-center gap-1">
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
                        esSuperAdmin ? "text-amber-800 font-extrabold" : "text-[#1B5E59]"
                      }`}
                    >
                      {docente?.idDocente || "DOC-7729"}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => cerrarSesion()}
                  title="Cerrar sesión"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 transition-colors"
                >
                  <SignOut size={18} weight="bold" />
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all"
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
