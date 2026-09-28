"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] text-slate-600 border-t border-slate-200 mt-auto py-5 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Fila Horizontal Compacta: Elaborado por Asesorías Nacionales */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:px-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-extrabold text-[#0f2d4a] uppercase tracking-wider text-[11px] sm:text-xs">
              Elaborado por:
            </span>
          </div>

          {/* Sétimo y Noveno en una sola línea horizontal */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-slate-700">
            {/* Sétimo */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="text-teal-900 font-bold">Diagnóstico Sétimo:</strong>
              <span>Heidy María Cascante Cruz</span>
              <span className="text-slate-300">•</span>
              <span>Rodolfo Juárez Pérez</span>
            </div>

            <span className="hidden md:inline text-slate-300">|</span>

            {/* Noveno */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <strong className="text-emerald-900 font-bold">Diagnóstico Noveno:</strong>
              <span>Allan Morera Araya</span>
              <span className="text-slate-300">•</span>
              <span>Alberto Bustos Ortega</span>
            </div>
          </div>
        </div>

        {/* Fila Institucional Horizontal Compacta */}
        <div className="text-center text-[11px] text-slate-500 font-medium flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          <span className="font-bold text-slate-700">Ministerio de Educación Pública (MEP)</span>
          <span>•</span>
          <span>Dirección de Recursos Tecnológicos en Educación (DRTE)</span>
          <span>•</span>
          <span>Departamento de Investigación, Desarrollo e Implementación (DIDI)</span>
        </div>

      </div>
    </footer>
  );
}

