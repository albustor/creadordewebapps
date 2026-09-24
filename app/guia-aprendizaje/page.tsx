"use client";

import React from "react";
import Link from "next/link";
import RecursoAprendizajeAutogestionado from "@/components/RecursoAprendizajeAutogestionado";
import { useDocente } from "@/context/DocenteContext";
import {
  ArrowLeft,
  GraduationCap,
  Sparkle,
  Printer,
  House,
  Compass,
  CheckCircle,
  UserCircle,
} from "@phosphor-icons/react";

export default function GuiaAprendizajePage() {
  const { docente } = useDocente();

  const imprimirPagina = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Barra Superior de Navegación */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-slate-700 hover:text-indigo-700 hover:bg-stone-100 text-xs font-bold transition-all"
            >
              <ArrowLeft size={16} weight="bold" />
              <span>Volver a Inicio</span>
            </Link>

            <div className="h-4 w-px bg-stone-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <GraduationCap size={20} weight="bold" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Guía Interactiva Autogestionada
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  Ruta Sistemática & Bitácora Docente PNFT
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {docente && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-xl border border-stone-200 text-xs text-slate-700 font-medium">
                <UserCircle size={16} weight="bold" className="text-emerald-700" />
                <span className="font-bold truncate max-w-[180px]">{docente.nombreCompleto}</span>
              </div>
            )}

            <button
              onClick={imprimirPagina}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-slate-800 rounded-xl border border-stone-200 text-xs font-extrabold transition-all"
            >
              <Printer size={16} weight="bold" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-extrabold shadow-xs transition-all"
            >
              <Compass size={16} weight="bold" />
              <span>Ir a Diagnóstico</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <RecursoAprendizajeAutogestionado />
      </main>

      {/* Pie de Página */}
      <footer className="bg-white border-t border-stone-200 py-6 text-center text-xs text-stone-500 font-medium print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold text-slate-700">
            Ministerio de Educación Pública de Costa Rica • Programa Nacional de Formación Tecnológica (PNFT)
          </p>
          <p>
            Herramienta WebApps — Sistema de Evaluación Diagnóstica Curricular con Resiliencia y DUA
          </p>
        </div>
      </footer>
    </div>
  );
}
