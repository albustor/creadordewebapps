"use client";

import React from "react";
import { Lightning, Sparkle, Laptop } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-[#FCFBF9] text-slate-600 border-t border-stone-200/90 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contenedor Principal Unificado: Diagnóstico Secundaria PNFT + Elaborado por */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-6">
          <div className="h-1.5 bg-gradient-to-r from-[#0f2d4a] via-[#1B5E59] to-emerald-600 w-full" />
          
          <div className="p-6 sm:p-8 space-y-6">
            {/* Cabecera Integrada: Título del Sistema e Institucionalidad */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-200/80">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shadow-xs shrink-0">
                    <Lightning size={22} weight="fill" className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-2 flex-wrap">
                      Diagnóstico Secundaria PNFT
                      <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        MEP 2027
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      Recurso oficial para desarrollar la evaluación diagnóstica formativa y el Panel de Evaluación en Tecnologías de la Información.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dependencias Institucionales */}
              <div className="bg-stone-50/80 border border-stone-200/80 rounded-xl p-3.5 sm:px-4 text-xs space-y-0.5 text-stone-600 lg:text-right shrink-0">
                <span className="font-extrabold text-[#0f2d4a] block text-xs sm:text-sm">
                  Ministerio de Educación Pública (MEP)
                </span>
                <p className="font-medium text-stone-700">Dirección de Recursos Tecnológicos en Educación (DRTE)</p>
                <p className="text-[11px] text-stone-500">Departamento de Investigación, Desarrollo e Implementación</p>
              </div>
            </div>

            {/* Sección de Asesoría Nacional y Equipos por Nivel (Organizado Horizontalmente) */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkle size={16} weight="fill" className="text-amber-500" />
                  <h4 className="text-xs sm:text-sm font-black text-[#0f2d4a] uppercase tracking-wider">
                    Elaborado por: Asesorías Nacionales de Formación Tecnológica
                  </h4>
                </div>
                <span className="text-xs font-bold text-stone-400">
                  Febrero 2027
                </span>
              </div>

              {/* Grid Horizontal de 7.° y 9.° Año */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 7.° Año */}
                <div className="bg-gradient-to-br from-teal-50/60 to-cyan-50/30 border border-teal-200/80 rounded-xl p-4 transition-all hover:border-teal-300 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-800 text-white font-extrabold text-xs shadow-xs tracking-wide">
                      ⚡ 7.° AÑO
                    </span>
                    <span className="text-xs font-bold text-teal-900/80">
                      Diagnóstico Sétimo
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white/95 border border-teal-200 rounded-lg px-3 py-2 text-center shadow-2xs">
                      <span className="block text-xs font-black text-slate-900">
                        Heidy María Cascante Cruz
                      </span>
                      <span className="block text-[10px] text-teal-800 font-semibold uppercase tracking-wider">
                        Asesora Nacional PNFT
                      </span>
                    </div>
                    <div className="bg-white/95 border border-teal-200 rounded-lg px-3 py-2 text-center shadow-2xs">
                      <span className="block text-xs font-black text-slate-900">
                        Rodolfo Pérez Juárez
                      </span>
                      <span className="block text-[10px] text-teal-800 font-semibold uppercase tracking-wider">
                        Asesor Nacional PNFT
                      </span>
                    </div>
                  </div>
                </div>

                {/* 9.° Año */}
                <div className="bg-gradient-to-br from-emerald-50/60 to-emerald-50/20 border border-emerald-200/80 rounded-xl p-4 transition-all hover:border-emerald-300 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-800 text-white font-extrabold text-xs shadow-xs tracking-wide">
                      🤖 9.° AÑO
                    </span>
                    <span className="text-xs font-bold text-emerald-900/80">
                      Diagnóstico Noveno
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-white/95 border border-emerald-200 rounded-lg px-3 py-2 text-center shadow-2xs">
                      <span className="block text-xs font-black text-slate-900">
                        Allan Morera Araya
                      </span>
                      <span className="block text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">
                        Asesor Nacional PNFT
                      </span>
                    </div>
                    <div className="bg-white/95 border border-emerald-200 rounded-lg px-3 py-2 text-center shadow-2xs">
                      <span className="block text-xs font-black text-slate-900">
                        Alberto Bustos Ortega
                      </span>
                      <span className="block text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">
                        Asesor Nacional PNFT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior de Derechos y Optimización */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-500 font-medium px-2">
          <div className="flex items-center gap-2">
            <span>© 2027 Diagnóstico & Panel de Evaluación • Tecnologías de la Información (7.° y 9.° año).</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-400">
            <Laptop size={15} />
            <span>Optimizado para computadoras de laboratorios, PCs y portátiles.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
