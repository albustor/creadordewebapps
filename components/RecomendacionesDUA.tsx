"use client";

import React, { useState } from "react";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { ConfiguracionDashboardDocente } from "./ConfiguradorInstrumentoDashboard";
import {
  generarRecomendacionesPedagogicas,
  RecomendacionesEstructuradas,
} from "@/lib/recomendacionesPedagogicas";
import {
  Sparkle,
  WarningCircle,
  Lightbulb,
  Books,
  ArrowsClockwise,
  Heartbeat,
  CheckCircle,
  FileText,
  Target,
  GraduationCap,
  CaretRight,
} from "@phosphor-icons/react";

interface RecomendacionesDUAProps {
  registros: PayloadTelemetria[];
  configuracion?: ConfiguracionDashboardDocente;
}

export default function RecomendacionesDUA({
  registros,
  configuracion,
}: RecomendacionesDUAProps) {
  const [pestañaSaber, setPestañaSaber] = useState<"conceptual" | "procedimental" | "actitudinal" | "indicador">("conceptual");

  const esDiagnostico = configuracion?.tipoProceso === "diagnostico";
  const minAvanzado = configuracion?.umbralAvanzadoMin ?? 80;
  const maxInicial = configuracion?.umbralInicialMax ?? 59;

  // Estudiantes que requieren apoyo prioritario (Nivel Inicial / Requiere Acompañamiento)
  const estudiantesRezago = registros.filter((r) => {
    const valor = r.porcentaje !== undefined ? r.porcentaje : r.puntaje;
    return valor <= maxInicial;
  });

  const total = registros.length;
  const tasaAlerta = total > 0 ? Math.round((estudiantesRezago.length / total) * 100) : 0;
  const promedioPuntaje =
    total > 0
      ? Math.round(
          registros.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje), 0) / total
        )
      : 70;

  // Generar recomendaciones dinámicas y contextualizadas
  const recomendaciones: RecomendacionesEstructuradas = generarRecomendacionesPedagogicas({
    nivel: configuracion?.nivelEducativo || "III Ciclo de Secundaria",
    saberConceptual: configuracion?.saberConceptual || "Fundamentos y Conceptos Clave",
    saberProcedimental: "Formulación de algoritmos, análisis y resolución práctica",
    saberActitudinal: "Pensamiento crítico, perseverancia y aprendizaje del error",
    indicadorCodigo: configuracion?.indicadorCodigo || "SEC.COT.01",
    indicadorNombre: configuracion?.nombreInstrumento || "Demostración de Desempeño en Trabajo Cotidiano",
    porcentajePromedio: promedioPuntaje,
    tasaRezago: tasaAlerta,
    esDiagnostico,
    estudiantesRezago: estudiantesRezago.map((e) => e.estudianteNombre),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ${
              esDiagnostico ? "bg-purple-700" : "bg-blue-700"
            }`}
          >
            <Lightbulb size={26} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  esDiagnostico ? "bg-purple-100 text-purple-900" : "bg-blue-100 text-blue-900"
                }`}
              >
                {esDiagnostico ? "Ajustes por Diagnóstico" : "Ajustes de Trabajo Cotidiano"}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {configuracion?.nivelEducativo || "III Ciclo"}
              </span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
              Recomendaciones Pedagógicas y Ajustes al Aula
            </h3>
          </div>
        </div>

        {tasaAlerta > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-950 font-bold text-xs rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <WarningCircle size={16} weight="fill" className="text-amber-600" />
            <span>
              {estudiantesRezago.length} en alerta ({tasaAlerta}%)
            </span>
          </span>
        )}
      </div>

      {/* Panel de Estudiantes en Alerta */}
      {estudiantesRezago.length > 0 && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <WarningCircle size={16} className="text-amber-700" weight="fill" />
            <span>
              Estudiantes que requieren acompañamiento pedagógico prioritario:
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {estudiantesRezago.map((est, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white border border-amber-300 text-amber-950 text-xs font-semibold rounded-lg shadow-xs"
              >
                {est.estudianteNombre} ({est.porcentaje ?? est.puntaje}% • {est.seccionOGrupo || "General"})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pestañas de Saberes */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setPestañaSaber("conceptual")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pestañaSaber === "conceptual"
                ? "bg-blue-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            📖 Saber Conceptual
          </button>
          <button
            onClick={() => setPestañaSaber("procedimental")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pestañaSaber === "procedimental"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ⚙️ Saber Procedimental
          </button>
          <button
            onClick={() => setPestañaSaber("actitudinal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pestañaSaber === "actitudinal"
                ? "bg-purple-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🤝 Saber Actitudinal
          </button>
          <button
            onClick={() => setPestañaSaber("indicador")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              pestañaSaber === "indicador"
                ? "bg-indigo-700 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🎯 Indicador de Logro
          </button>
        </div>

        {/* Contenido Dinámico de la Pestaña */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          {pestañaSaber === "conceptual" && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-blue-900">
                {recomendaciones.ajustesSaberConceptual.titulo}
              </h4>
              <p className="text-xs text-slate-600">
                {recomendaciones.ajustesSaberConceptual.descripcion}
              </p>
              <ul className="space-y-1.5 pt-1">
                {recomendaciones.ajustesSaberConceptual.accionesConcretas.map((acc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CaretRight size={14} className="text-blue-700 shrink-0 mt-0.5" weight="bold" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pestañaSaber === "procedimental" && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-900">
                {recomendaciones.ajustesSaberProcedimental.titulo}
              </h4>
              <p className="text-xs text-slate-600">
                {recomendaciones.ajustesSaberProcedimental.descripcion}
              </p>
              <ul className="space-y-1.5 pt-1">
                {recomendaciones.ajustesSaberProcedimental.accionesConcretas.map((acc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CaretRight size={14} className="text-emerald-700 shrink-0 mt-0.5" weight="bold" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pestañaSaber === "actitudinal" && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-purple-900">
                {recomendaciones.ajustesSaberActitudinal.titulo}
              </h4>
              <p className="text-xs text-slate-600">
                {recomendaciones.ajustesSaberActitudinal.descripcion}
              </p>
              <ul className="space-y-1.5 pt-1">
                {recomendaciones.ajustesSaberActitudinal.accionesConcretas.map((acc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CaretRight size={14} className="text-purple-700 shrink-0 mt-0.5" weight="bold" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pestañaSaber === "indicador" && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-indigo-900">
                {recomendaciones.ajustesIndicadorLogro.indicador}
              </h4>
              <div className="p-2.5 bg-white border border-indigo-200 rounded-lg text-xs text-indigo-950 font-semibold">
                {recomendaciones.ajustesIndicadorLogro.criterioAjuste}
              </div>
              <ul className="space-y-1.5 pt-1">
                {recomendaciones.ajustesIndicadorLogro.estrategiasEvaluacionFormativa.map((acc, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CaretRight size={14} className="text-indigo-700 shrink-0 mt-0.5" weight="bold" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN ESPECIAL: INTEGRACIÓN EN EL PLANEAMIENTO DIDÁCTICO */}
      <div
        className={`p-4 rounded-xl border shadow-xs space-y-2.5 transition-all ${
          esDiagnostico
            ? "bg-purple-900/10 border-purple-300 text-purple-950"
            : "bg-blue-900/10 border-blue-300 text-blue-950"
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-black">
          <FileText size={18} className={esDiagnostico ? "text-purple-800" : "text-blue-800"} weight="fill" />
          <span>{recomendaciones.orientacionPlaneamientoDidactico.titulo}</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {recomendaciones.orientacionPlaneamientoDidactico.fundamentacion}
        </p>

        <div className="space-y-1.5 bg-white/80 p-3 rounded-lg border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-800 block uppercase tracking-wider">
            Pasos para reflejar estos resultados en tu planeamiento didáctico:
          </span>
          <ul className="space-y-1 text-xs text-slate-700">
            {recomendaciones.orientacionPlaneamientoDidactico.pasosIntegracionPlaneamiento.map(
              (paso, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
                  <span>{paso}</span>
                </li>
              )
            )}
          </ul>
        </div>

        <div
          className={`p-2.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
            esDiagnostico
              ? "bg-purple-800 text-white shadow-xs"
              : "bg-blue-800 text-white shadow-xs"
          }`}
        >
          <span>{recomendaciones.orientacionPlaneamientoDidactico.llamadoAccion}</span>
        </div>
      </div>
    </div>
  );
}
