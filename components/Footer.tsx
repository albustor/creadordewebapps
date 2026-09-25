"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lightning } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-[#FCFBF9] text-slate-600 border-t border-stone-200/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                <Lightning size={18} weight="fill" className="text-amber-600" />
              </div>
              <span className="font-extrabold text-base sm:text-lg">Diagnóstico Secundaria PNFT</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Recurso oficial para desarrollar el diagnóstico formativo basándose en el Programa Nacional de Formación Tecnológica (PNFT) de la materia de Tecnología.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Navegación</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-800 transition-colors">
                  Inicio y autenticación docente
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-800 transition-colors font-semibold text-emerald-800">
                  Panel de Evaluación (7.° y 9.°)
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="hover:text-emerald-800 transition-colors">
                  Módulo de Asesoría & Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Seguridad & Resiliencia</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Persistencia en memoria y almacenamiento local</span>
              </li>
              <li className="flex items-center gap-2">
                <Lightning size={14} className="text-amber-600" />
                <span>Sincronización QR sin conexión a internet</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Verificación de tokens e integridad de datos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tarjeta Oficial de Autoría y Desarrollo Conceptual */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden mb-8">
          <div className="h-1.5 bg-[#0f2d4a] w-full" />
          <div className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Elaborado por */}
            <div className="space-y-1">
              <h4 className="text-sm font-black text-[#0f2d4a]">
                Elaborado por:
              </h4>
              <p className="text-xs sm:text-sm font-bold text-slate-900">
                Asesores Nacionales del Programa Nacional de Formación Tecnológica
              </p>
              <div className="text-xs text-stone-500 space-y-0.5 pt-0.5">
                <p>Departamento de Investigación, Desarrollo e Implementación</p>
                <p>Dirección de Recursos Tecnológicos en Educación</p>
                <p>Ministerio de Educación Pública</p>
              </div>
            </div>

            {/* Elaborado por: Asesorías Nacionales MEP por Nivel */}
            <div className="space-y-3 md:text-right">
              <div>
                <span className="text-[11px] font-black text-[#1B5E59] uppercase tracking-wider block">
                  7.° Año • CyberQuest 7.°
                </span>
                <div className="flex flex-col md:items-end gap-1 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-teal-50 text-teal-950 font-bold text-xs border border-teal-200 shadow-2xs">
                    Heidy María Cascante Cruz
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-teal-50 text-teal-950 font-bold text-xs border border-teal-200 shadow-2xs">
                    Rodolfo Pérez Juárez
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-black text-[#1B5E59] uppercase tracking-wider block">
                  9.° Año • Aula Inteligente
                </span>
                <div className="flex flex-col md:items-end gap-1 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-950 font-bold text-xs border border-emerald-300 shadow-2xs">
                    Allan Morera Araya
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-emerald-50 text-emerald-950 font-bold text-xs border border-emerald-300 shadow-2xs">
                    Alberto Bustos Ortega
                  </span>
                </div>
              </div>

              <p className="text-xs font-bold text-stone-500 pt-0.5">
                Febrero 2027.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-500">
          <div>
            © Diagnóstico & Panel de Evaluación • Tecnologías de la Información (7.° y 9.° año).
          </div>
          <div>
            Optimizado para computadoras de laboratorios, PCs y portátiles.
          </div>
        </div>
      </div>
    </footer>
  );
}
