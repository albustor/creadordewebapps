"use client";

import React from "react";
import { NivelEducativo, LISTA_NIVELES_III_CICLO, obtenerDiagnosticoPorNivel } from "@/lib/diagnosticos";
import { GameController, Cpu, Circuitry, Sparkle } from "@phosphor-icons/react";

interface SelectorNivelDiagnosticoTabsProps {
  nivelSeleccionado: NivelEducativo;
  onSelectNivel: (nivel: NivelEducativo) => void;
}

export default function SelectorNivelDiagnosticoTabs({
  nivelSeleccionado,
  onSelectNivel,
}: SelectorNivelDiagnosticoTabsProps) {
  const getIconoNivel = (nivel: NivelEducativo) => {
    switch (nivel) {
      case "7°":
        return <GameController size={20} weight="duotone" />;
      case "8°":
        return <Cpu size={20} weight="duotone" />;
      case "9°":
        return <Circuitry size={20} weight="duotone" />;
    }
  };

  const getSubtituloNivel = (nivel: NivelEducativo) => {
    switch (nivel) {
      case "7°":
        return "CyberQuest • Ciudadanía Digital y Algoritmos";
      case "8°":
        return "14 Reactivos • HW/SW, Programación y Robótica";
      case "9°":
        return "Aula Inteligente • IoT y Microcontroladores";
    }
  };

  return (
    <div className="bg-white p-2 rounded-3xl border border-stone-200 shadow-softPastel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {LISTA_NIVELES_III_CICLO.map((nivel) => {
          const isActivo = nivelSeleccionado === nivel;
          const config = obtenerDiagnosticoPorNivel(nivel);

          return (
            <button
              key={nivel}
              onClick={() => onSelectNivel(nivel)}
              className={`flex items-center gap-3 p-3.5 rounded-2xl text-left transition-all duration-200 ${
                isActivo
                  ? "bg-gradient-to-r from-sky-900 to-sky-950 text-white shadow-md scale-[1.01]"
                  : "bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200/60"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isActivo
                    ? "bg-amber-500 text-slate-950 shadow-sm"
                    : "bg-white text-sky-800 border border-stone-200"
                }`}
              >
                {getIconoNivel(nivel)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider">
                    {nivel} Año — Secundaria
                  </span>
                  {isActivo && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <div
                  className={`text-[11px] truncate font-medium ${
                    isActivo ? "text-sky-200" : "text-slate-500"
                  }`}
                >
                  {getSubtituloNivel(nivel)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
