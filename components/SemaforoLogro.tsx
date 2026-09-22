"use client";

import React from "react";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { ConfiguracionDashboardDocente } from "./ConfiguradorInstrumentoDashboard";
import { CheckCircle, Warning, XCircle, Users, Sparkle, Article } from "@phosphor-icons/react";

interface SemaforoLogroProps {
  registros: PayloadTelemetria[];
  configuracion?: ConfiguracionDashboardDocente;
}

export default function SemaforoLogro({ registros, configuracion }: SemaforoLogroProps) {
  const esDiagnostico = configuracion?.tipoProceso === "diagnostico";
  const minAvanzado = configuracion?.umbralAvanzadoMin ?? 80;
  const maxInicial = configuracion?.umbralInicialMax ?? 59;

  const total = registros.length;

  // Clasificación dinámica según umbrales configurados
  const avanzados = registros.filter((r) => {
    const valor = r.porcentaje !== undefined ? r.porcentaje : r.puntaje;
    return valor >= minAvanzado;
  }).length;

  const iniciales = registros.filter((r) => {
    const valor = r.porcentaje !== undefined ? r.porcentaje : r.puntaje;
    return valor <= maxInicial;
  }).length;

  const intermedios = Math.max(0, total - avanzados - iniciales);

  const pctAvanzado = total > 0 ? Math.round((avanzados / total) * 100) : 0;
  const pctIntermedio = total > 0 ? Math.round((intermedios / total) * 100) : 0;
  const pctInicial = total > 0 ? Math.round((iniciales / total) * 100) : 0;

  const promedioPuntaje =
    total > 0 ? Math.round(registros.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje), 0) / total) : 0;

  const tiempoPromedioSegundos =
    total > 0
      ? Math.round(registros.reduce((acc, curr) => acc + curr.tiempoSegundos, 0) / total)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-200">
              Enfoque: Diagnóstico Integrado 9°
            </span>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
              {total} Evaluaciones
            </span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900">
            Semáforo Diagnóstico de Saberes Previos
          </h3>
          <p className="text-xs text-slate-500">
            Detección de necesidades formativas y acompañamiento pedagógico en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-slate-700 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
          <div>
            Promedio: <span className="text-emerald-800 font-black">{total > 0 ? (promedioPuntaje / 10).toFixed(1) : "0.0"}/10 Saberes</span>
          </div>
          <div className="text-stone-300">|</div>
          <div>
            Tiempo medio: <span className="text-amber-700 font-black">{tiempoPromedioSegundos}s</span>
          </div>
        </div>
      </div>

      {/* Barra Proporcional Combinada */}
      <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner border border-slate-200">
        <div
          style={{ width: `${pctAvanzado}%` }}
          className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] text-white font-black"
          title={`${esDiagnostico ? "Consolidado" : "Avanzado"}: ${pctAvanzado}%`}
        >
          {pctAvanzado > 10 ? `${pctAvanzado}%` : ""}
        </div>
        <div
          style={{ width: `${pctIntermedio}%` }}
          className="bg-amber-400 h-full transition-all duration-500 flex items-center justify-center text-[10px] text-amber-950 font-black"
          title={`${esDiagnostico ? "En Desarrollo" : "Intermedio"}: ${pctIntermedio}%`}
        >
          {pctIntermedio > 10 ? `${pctIntermedio}%` : ""}
        </div>
        <div
          style={{ width: `${pctInicial}%` }}
          className="bg-rose-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] text-white font-black"
          title={`${esDiagnostico ? "Acompañamiento" : "Inicial"}: ${pctInicial}%`}
        >
          {pctInicial > 10 ? `${pctInicial}%` : ""}
        </div>
      </div>

      {/* Tres Tarjetas del Semáforo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Nivel Avanzado / Consolidado */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <CheckCircle size={18} weight="fill" className="text-emerald-600" />
              <span>{esDiagnostico ? "Consolidado" : "Avanzado"}</span>
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-md">
              ≥ {minAvanzado}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-emerald-900">{avanzados}</span>
            <span className="text-sm font-bold text-emerald-700">{pctAvanzado}% del grupo</span>
          </div>
          {configuracion?.criteriosPersonalizados?.avanzado && (
            <p className="text-[11px] text-emerald-950 mt-2 line-clamp-2 italic">
              {configuracion.criteriosPersonalizados.avanzado}
            </p>
          )}
        </div>

        {/* Nivel Intermedio / En Desarrollo */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Warning size={18} weight="fill" className="text-amber-500" />
              <span>{esDiagnostico ? "En Desarrollo" : "Intermedio"}</span>
            </span>
            <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
              {maxInicial + 1}% - {minAvanzado - 1}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-amber-900">{intermedios}</span>
            <span className="text-sm font-bold text-amber-700">{pctIntermedio}% del grupo</span>
          </div>
          {configuracion?.criteriosPersonalizados?.intermedio && (
            <p className="text-[11px] text-amber-950 mt-2 line-clamp-2 italic">
              {configuracion.criteriosPersonalizados.intermedio}
            </p>
          )}
        </div>

        {/* Nivel Inicial / Requiere Acompañamiento */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <XCircle size={18} weight="fill" className="text-rose-500" />
              <span>{esDiagnostico ? "Acompañamiento" : "Inicial"}</span>
            </span>
            <span className="text-xs font-bold text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded-md">
              ≤ {maxInicial}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-rose-900">{iniciales}</span>
            <span className="text-sm font-bold text-rose-700">{pctInicial}% del grupo</span>
          </div>
          {configuracion?.criteriosPersonalizados?.inicial && (
            <p className="text-[11px] text-rose-950 mt-2 line-clamp-2 italic">
              {configuracion.criteriosPersonalizados.inicial}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
