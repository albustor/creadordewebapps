"use client";

import React, { useState } from "react";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { ConfiguracionDashboardDocente } from "./ConfiguradorInstrumentoDashboard";
import {
  generarRecomendacionesPedagogicas,
  RecomendacionesEstructuradas,
} from "@/lib/recomendacionesPedagogicas";
import {
  Lightbulb,
  WarningCircle,
  CheckCircle,
  FileText,
  CaretRight,
  BookOpen,
  Gear,
  Handshake,
  Target,
} from "@phosphor-icons/react";

interface RecomendacionesDUAProps {
  registros: PayloadTelemetria[];
  configuracion?: ConfiguracionDashboardDocente;
}

export default function RecomendacionesDUA({
  registros,
  configuracion,
}: RecomendacionesDUAProps) {
  const [tabActiva, setTabActiva] = useState<"todos" | "conceptual" | "procedimental" | "actitudinal">("todos");

  const minAvanzado = configuracion?.umbralAvanzadoMin ?? 80;
  const maxInicial = configuracion?.umbralInicialMax ?? 59;

  // Estudiantes que requieren acompañamiento prioritario
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

  // Generar recomendaciones pedagógicas contextualizadas
  const recomendaciones: RecomendacionesEstructuradas = generarRecomendacionesPedagogicas({
    nivel: configuracion?.nivelEducativo || "9° Año - Secundaria",
    saberConceptual: configuracion?.saberConceptual || "Fundamentos y conceptos clave de circuitos, sensores y microcontroladores",
    saberProcedimental: "Formulación de algoritmos, análisis y conexionado práctico en simulador 2D",
    saberActitudinal: "Pensamiento crítico, perseverancia y aprendizaje reflexivo del error",
    indicadorCodigo: configuracion?.indicadorCodigo || "SEC.9NO.DIAG.01",
    indicadorNombre: configuracion?.nombreInstrumento || "Diagnóstico Integrado 9°: «Aula Inteligente»",
    porcentajePromedio: promedioPuntaje,
    tasaRezago: tasaAlerta,
    esDiagnostico: true,
    estudiantesRezago: estudiantesRezago.map((e) => e.estudianteNombre),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Cabecera Horizontal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Lightbulb size={22} weight="bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Ajustes por diagnóstico
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Formación tecnológica • 9° año
              </span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
              Recomendaciones pedagógicas y sugerencias de mediación
            </h3>
          </div>
        </div>

        {tasaAlerta > 0 && (
          <span className="px-3 py-1 bg-amber-100 text-amber-950 font-bold text-xs rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <WarningCircle size={16} weight="fill" className="text-amber-600" />
            <span>
              {estudiantesRezago.length} en acompañamiento ({tasaAlerta}%)
            </span>
          </span>
        )}
      </div>

      {/* Alerta de estudiantes en acompañamiento si existen */}
      {estudiantesRezago.length > 0 && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <WarningCircle size={16} className="text-amber-700" weight="fill" />
            <span>
              Estudiantes que requieren acompañamiento pedagógico focalizado:
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {estudiantesRezago.map((est, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white border border-amber-300 text-amber-950 text-xs font-semibold rounded-lg shadow-2xs"
              >
                {est.estudianteNombre} ({est.porcentaje ?? est.puntaje}% • {est.seccionOGrupo || "General"})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* DISTRIBUCIÓN HORIZONTAL EN 3 COLUMNAS AMPLIAS PARA LOS SABERES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Columna 1: Saber Conceptual */}
        <div className="bg-slate-50 border border-blue-200 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-black text-xs uppercase tracking-wide">
              <BookOpen size={18} weight="bold" className="text-blue-700" />
              <span>Saber Conceptual</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {recomendaciones.ajustesSaberConceptual.titulo}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {recomendaciones.ajustesSaberConceptual.descripcion}
            </p>
          </div>

          <div className="pt-2 border-t border-blue-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-950 block mb-1.5">
              Acciones didácticas sugeridas:
            </span>
            <ul className="space-y-1.5">
              {recomendaciones.ajustesSaberConceptual.accionesConcretas.map((acc, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <CaretRight size={13} className="text-blue-700 shrink-0 mt-0.5" weight="bold" />
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna 2: Saber Procedimental */}
        <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-black text-xs uppercase tracking-wide">
              <Gear size={18} weight="bold" className="text-emerald-700" />
              <span>Saber Procedimental</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {recomendaciones.ajustesSaberProcedimental.titulo}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {recomendaciones.ajustesSaberProcedimental.descripcion}
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 block mb-1.5">
              Estrategias de aplicación en laboratorio:
            </span>
            <ul className="space-y-1.5">
              {recomendaciones.ajustesSaberProcedimental.accionesConcretas.map((acc, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <CaretRight size={13} className="text-emerald-700 shrink-0 mt-0.5" weight="bold" />
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Columna 3: Saber Actitudinal */}
        <div className="bg-slate-50 border border-purple-200 rounded-2xl p-4.5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-900 font-black text-xs uppercase tracking-wide">
              <Handshake size={18} weight="bold" className="text-purple-700" />
              <span>Saber Actitudinal</span>
            </div>
            <h4 className="text-xs font-bold text-slate-900">
              {recomendaciones.ajustesSaberActitudinal.titulo}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {recomendaciones.ajustesSaberActitudinal.descripcion}
            </p>
          </div>

          <div className="pt-2 border-t border-purple-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-950 block mb-1.5">
              Fomento del clima de aula:
            </span>
            <ul className="space-y-1.5">
              {recomendaciones.ajustesSaberActitudinal.accionesConcretas.map((acc, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                  <CaretRight size={13} className="text-purple-700 shrink-0 mt-0.5" weight="bold" />
                  <span>{acc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Franja Horizontal: Orientación para el Planeamiento Didáctico */}
      <div className="p-4.5 rounded-2xl border border-emerald-300 bg-emerald-950/5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
          <FileText size={18} className="text-emerald-800" weight="fill" />
          <span>{recomendaciones.orientacionPlaneamientoDidactico.titulo}</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {recomendaciones.orientacionPlaneamientoDidactico.fundamentacion}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {recomendaciones.orientacionPlaneamientoDidactico.pasosIntegracionPlaneamiento.map(
            (paso, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
                <span>{paso}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
