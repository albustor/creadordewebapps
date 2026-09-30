"use client";

import React from "react";
import { Sparkle } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-[#FCFBF9] border-t border-slate-200 mt-auto py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 max-w-4xl">
          
          {/* Cabecera con ícono estrella, texto y línea divisoria */}
          <div className="flex items-center gap-2">
            <Sparkle size={20} weight="fill" className="text-amber-500 shrink-0" />
            <span className="text-sm sm:text-base font-black text-[#002b49] tracking-wider uppercase">
              ELABORADO POR:
            </span>
            <div className="flex-1 h-[1.5px] bg-slate-200 ml-1" />
          </div>

          {/* Línea horizontal de nombres con separador | */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-bold text-[#002b49]">
            <span>Heidi María Cascante Cruz</span>
            <span className="text-slate-300 font-light">|</span>
            <span>Rodolfo Juárez Pérez</span>
            <span className="text-slate-300 font-light">|</span>
            <span>Alberto Bustos Ortega</span>
            <span className="text-slate-300 font-light">|</span>
            <span>Allan Morera Araya</span>
          </div>

          {/* Bloque Institucional */}
          <div className="space-y-1 text-xs sm:text-sm font-medium text-[#002b49] leading-relaxed">
            <p>Asesores Nacionales del Programa Nacional de Formación Tecnológica</p>
            <p>Departamento de Investigación, Desarrollo e Implementación</p>
            <p>Dirección de Recursos Tecnológicos en Educación</p>
            <p>Ministerio de Educación Pública</p>
          </div>

          {/* Fecha */}
          <div className="pt-2 text-xs sm:text-sm font-bold text-[#002b49]">
            <p>Febrero 2027.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}


