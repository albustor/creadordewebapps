"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Sparkle,
  ArrowsClockwise,
  Cpu,
  Check,
} from "@phosphor-icons/react";

interface AIAnalisisResponse {
  resumenEjecutivo?: string;
  nivelGlobal?: string;
  ajustesSaberConceptual?: {
    titulo: string;
    descripcion: string;
    accionesConcretas: string[];
  };
  ajustesSaberProcedimental?: {
    titulo: string;
    descripcion: string;
    accionesConcretas: string[];
  };
  ajustesSaberActitudinal?: {
    titulo: string;
    descripcion: string;
    accionesConcretas: string[];
  };
  orientacionPlaneamientoDidactico?: {
    fundamentacion: string;
    pasosIntegracionPlaneamiento: string[];
    llamadoAccion: string;
  };
  estudiantesPrioritarios?: Array<{
    nombre: string;
    puntaje: number;
    accionFocalizada: string;
  }>;
}

interface RecomendacionesDUAProps {
  registros: PayloadTelemetria[];
  configuracion?: ConfiguracionDashboardDocente;
  nivel?: "todos" | "7mo" | "8vo" | "9no";
  seccionSeleccionada?: string;
}

export default function RecomendacionesDUA({
  registros,
  configuracion,
  nivel = "todos",
  seccionSeleccionada = "Todas",
}: RecomendacionesDUAProps) {
  const [aiData, setAiData] = useState<AIAnalisisResponse | null>(null);
  const [cargandoIA, setCargandoIA] = useState<boolean>(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);
  const [metaIA, setMetaIA] = useState<{
    providerUsed: string;
    modelUsed: string;
    latencyMs: number;
    cached: boolean;
    fechaGeneracion: string;
  } | null>(null);

  const minAvanzado = configuracion?.umbralAvanzadoMin ?? 80;
  const maxInicial = configuracion?.umbralInicialMax ?? 59;

  const nivelEtiqueta =
    nivel === "7mo"
      ? "7.° Año (CyberQuest)"
      : nivel === "8vo"
      ? "8.° Año (PNFT)"
      : nivel === "9no"
      ? "9.° Año (Aula Inteligente)"
      : "General";

  const getPuntajeVal = (r: PayloadTelemetria): number => {
    if (typeof r.porcentaje === "number" && !isNaN(r.porcentaje)) return r.porcentaje;
    if (typeof r.puntaje === "number" && !isNaN(r.puntaje)) return r.puntaje;
    return 0;
  };

  // Estudiantes que requieren acompañamiento prioritario
  const estudiantesRezago = registros.filter((r) => {
    const valor = getPuntajeVal(r);
    return valor <= maxInicial;
  });

  const total = registros.length;
  const avanzados = registros.filter((r) => getPuntajeVal(r) >= minAvanzado).length;
  const iniciales = estudiantesRezago.length;
  const intermedios = Math.max(0, total - avanzados - iniciales);

  const pctAvanzado = total > 0 ? Math.round((avanzados / total) * 100) : 0;
  const pctIntermedio = total > 0 ? Math.round((intermedios / total) * 100) : 0;
  const pctInicial = total > 0 ? Math.round((iniciales / total) * 100) : 0;
  const tasaAlerta = pctInicial;

  const promedioPuntaje =
    total > 0
      ? Math.round(
          registros.reduce((acc, curr) => acc + getPuntajeVal(curr), 0) / total
        )
      : 70;

  // Generar análisis heurístico inmediato basado en datos
  const recomendacionesBase: RecomendacionesEstructuradas = generarRecomendacionesPedagogicas({
    nivel:
      nivel === "7mo"
        ? "7° Año - Secundaria"
        : nivel === "8vo"
        ? "8° Año - Secundaria"
        : nivel === "9no"
        ? "9° Año - Secundaria"
        : configuracion?.nivelEducativo || "Secundaria - MEP",
    saberConceptual:
      nivel === "7mo"
        ? "Fundamentos de hardware, software, sistemas operativos y algoritmos básicos"
        : nivel === "8vo"
        ? "Lógica algorítmica, variables, estructuras condicionales dobles y bucles"
        : configuracion?.saberConceptual ||
          "Fundamentos y conceptos clave de circuitos, sensores y microcontroladores",
    saberProcedimental:
      nivel === "7mo"
        ? "Resolución de retos conceptuales, clasificación de componentes y secuencias"
        : nivel === "8vo"
        ? "Construcción de diagramas de flujo y depuración de código interactivo"
        : "Formulación de algoritmos, análisis y conexionado práctico en simulador 2D",
    saberActitudinal: "Pensamiento crítico, perseverancia y aprendizaje reflexivo del error",
    indicadorCodigo:
      nivel === "7mo"
        ? "SEC.7MO.DIAG.01"
        : nivel === "8vo"
        ? "SEC.8VO.DIAG.01"
        : configuracion?.indicadorCodigo || "SEC.9NO.DIAG.01",
    indicadorNombre:
      nivel === "7mo"
        ? "CyberQuest 7°: Diagnóstico de Fundamentos Digitales"
        : nivel === "8vo"
        ? "Diagnóstico 8° PNFT: Pensamiento Computacional"
        : configuracion?.nombreInstrumento || "Diagnóstico Integrado 9°: «Aula Inteligente»",
    porcentajePromedio: promedioPuntaje,
    tasaRezago: tasaAlerta,
    esDiagnostico: true,
    estudiantesRezago: estudiantesRezago.map((e) => e.estudianteNombre),
  });

  // Si no hay registros, mostramos el empty state limpio
  if (total === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-3">
          <Sparkle size={24} weight="duotone" />
        </div>
        <h3 className="font-black text-base text-slate-900 mb-1">
          Recomendaciones Pedagógicas DUA & Asistente IA ({nivelEtiqueta})
        </h3>
        <p className="text-xs text-slate-500 max-w-md leading-relaxed mb-3">
          El generador de estrategias de mediación pedagógica diferenciada, ajustes DUA (Diseño Universal para el Aprendizaje) y análisis con IA multi-proveedor se activará automáticamente con los primeros registros de entrega diagnóstica.
        </p>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-[11px] font-bold text-purple-800">
          <span>✨ Cascada Multi-Proveedor (Gemini, Groq, Qwen) en espera de datos</span>
        </div>
      </div>
    );
  }

  // Función para solicitar a la IA en Cascada Multi-Proveedor el análisis pedagógico
  const ejecutarAnalisisConIA = useCallback(async () => {
    setCargandoIA(true);
    setErrorIA(null);

    try {
      const payload = {
        registros: registros.map((r) => ({
          estudiante: r.estudianteNombre,
          puntaje: r.porcentaje ?? r.puntaje,
          seccion: r.seccionOGrupo,
          tiempoSegundos: r.tiempoSegundos,
        })),
        seccion: seccionSeleccionada,
        promedio: promedioPuntaje,
        totalEstudiantes: total,
        porcentajeAvanzado: pctAvanzado,
        porcentajeIntermedio: pctIntermedio,
        porcentajeInicial: pctInicial,
        estudiantesAcompaniamiento: estudiantesRezago.map((e) => ({
          nombre: e.estudianteNombre,
          puntaje: e.porcentaje ?? e.puntaje,
          seccion: e.seccionOGrupo,
        })),
        indicador: configuracion?.nombreInstrumento || "Diagnóstico Integrado 9°: «Aula Inteligente»",
        asignatura: configuracion?.asignatura || "Formación Tecnológica",
        nivel: configuracion?.nivelEducativo || "9° Año - Secundaria",
      };

      const res = await fetch("/api/ia/analisis-telemetria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiData(data.data);
        setMetaIA(data.meta);
      } else {
        setErrorIA(data.error || "No se pudo completar el análisis con IA.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de conexión";
      setErrorIA(msg);
    } finally {
      setCargandoIA(false);
    }
  }, [
    registros,
    seccionSeleccionada,
    promedioPuntaje,
    total,
    pctAvanzado,
    pctIntermedio,
    pctInicial,
    estudiantesRezago,
    configuracion,
  ]);

  // Selección de datos finales: IA si está disponible, o heurístico contextual
  const conceptualFinal = {
    titulo:
      aiData?.ajustesSaberConceptual?.titulo || recomendacionesBase.ajustesSaberConceptual?.titulo || "Ajustes Conceptuales",
    descripcion:
      aiData?.ajustesSaberConceptual?.descripcion ||
      recomendacionesBase.ajustesSaberConceptual?.descripcion || "",
    acciones:
      Array.isArray(aiData?.ajustesSaberConceptual?.accionesConcretas) && aiData.ajustesSaberConceptual.accionesConcretas.length > 0
        ? aiData.ajustesSaberConceptual.accionesConcretas
        : Array.isArray(recomendacionesBase.ajustesSaberConceptual?.accionesConcretas)
        ? recomendacionesBase.ajustesSaberConceptual.accionesConcretas
        : [],
  };

  const procedimentalFinal = {
    titulo:
      aiData?.ajustesSaberProcedimental?.titulo ||
      recomendacionesBase.ajustesSaberProcedimental?.titulo || "Ajustes Procedimentales",
    descripcion:
      aiData?.ajustesSaberProcedimental?.descripcion ||
      recomendacionesBase.ajustesSaberProcedimental?.descripcion || "",
    acciones:
      Array.isArray(aiData?.ajustesSaberProcedimental?.accionesConcretas) && aiData.ajustesSaberProcedimental.accionesConcretas.length > 0
        ? aiData.ajustesSaberProcedimental.accionesConcretas
        : Array.isArray(recomendacionesBase.ajustesSaberProcedimental?.accionesConcretas)
        ? recomendacionesBase.ajustesSaberProcedimental.accionesConcretas
        : [],
  };

  const actitudinalFinal = {
    titulo:
      aiData?.ajustesSaberActitudinal?.titulo || recomendacionesBase.ajustesSaberActitudinal?.titulo || "Ajustes Actitudinales",
    descripcion:
      aiData?.ajustesSaberActitudinal?.descripcion ||
      recomendacionesBase.ajustesSaberActitudinal?.descripcion || "",
    acciones:
      Array.isArray(aiData?.ajustesSaberActitudinal?.accionesConcretas) && aiData.ajustesSaberActitudinal.accionesConcretas.length > 0
        ? aiData.ajustesSaberActitudinal.accionesConcretas
        : Array.isArray(recomendacionesBase.ajustesSaberActitudinal?.accionesConcretas)
        ? recomendacionesBase.ajustesSaberActitudinal.accionesConcretas
        : [],
  };

  const planeamientoFundamentacion =
    aiData?.orientacionPlaneamientoDidactico?.fundamentacion ||
    recomendacionesBase.orientacionPlaneamientoDidactico?.fundamentacion ||
    "Integración en el planeamiento didáctico con base en los resultados del diagnóstico formativo.";

  const planeamientoPasos =
    Array.isArray(aiData?.orientacionPlaneamientoDidactico?.pasosIntegracionPlaneamiento) && aiData.orientacionPlaneamientoDidactico.pasosIntegracionPlaneamiento.length > 0
      ? aiData.orientacionPlaneamientoDidactico.pasosIntegracionPlaneamiento
      : Array.isArray(recomendacionesBase.orientacionPlaneamientoDidactico?.pasosIntegracionPlaneamiento)
      ? recomendacionesBase.orientacionPlaneamientoDidactico.pasosIntegracionPlaneamiento
      : [];

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
                Formación tecnológica • {nivel === "7mo" ? "7.° año" : nivel === "8vo" ? "8.° año" : "9.° año"}
              </span>
              {metaIA && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 flex items-center gap-1 border border-blue-200">
                  <Cpu size={12} weight="bold" />
                  <span>{metaIA.modelUsed}</span>
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
              Recomendaciones pedagógicas y sugerencias de mediación
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {tasaAlerta > 0 && (
            <span className="px-3 py-1 bg-amber-100 text-amber-950 font-bold text-xs rounded-full flex items-center gap-1.5">
              <WarningCircle size={16} weight="fill" className="text-amber-600" />
              <span>
                {estudiantesRezago.length} en acompañamiento ({tasaAlerta}%)
              </span>
            </span>
          )}

          <button
            onClick={ejecutarAnalisisConIA}
            disabled={cargandoIA || total === 0}
            title={
              total === 0
                ? "Se requieren registros de telemetría para analizar con IA"
                : "Ejecutar análisis en cascada multi-proveedor sobre los datos del grupo"
            }
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
              cargandoIA
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : total === 0
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer active:scale-95"
            }`}
          >
            {cargandoIA ? (
              <>
                <ArrowsClockwise size={14} className="animate-spin" />
                <span>Analizando datos con IA...</span>
              </>
            ) : aiData ? (
              <>
                <Sparkle size={14} weight="fill" className="text-amber-300" />
                <span>Re-analizar con IA</span>
              </>
            ) : (
              <>
                <Sparkle size={14} weight="bold" />
                <span>Generar análisis con IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resumen Ejecutivo si fue generado por la IA */}
      {aiData?.resumenEjecutivo && (
        <div className="p-4 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-indigo-950 font-extrabold text-xs uppercase tracking-wide">
            <Sparkle size={15} weight="fill" className="text-indigo-600" />
            <span>Diagnóstico Ejecutivo de Aula (IA Multi-Proveedor):</span>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed font-medium">
            {aiData.resumenEjecutivo}
          </p>
        </div>
      )}

      {/* Error de IA si ocurrió */}
      {errorIA && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
          ⚠️ {errorIA}. Se están mostrando las recomendaciones pedagógicas adaptativas calculadas a partir de los datos.
        </div>
      )}

      {/* Alerta de estudiantes en acompañamiento si existen */}
      {estudiantesRezago.length > 0 && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
            <WarningCircle size={16} className="text-amber-700" weight="fill" />
            <span>
              Estudiantes que requieren acompañamiento pedagógico focalizado ({estudiantesRezago.length}):
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
              {conceptualFinal.titulo}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {conceptualFinal.descripcion}
            </p>
          </div>

          <div className="pt-2 border-t border-blue-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-950 block mb-1.5">
              Acciones didácticas sugeridas:
            </span>
            <ul className="space-y-1.5">
              {conceptualFinal.acciones.map((acc, idx) => (
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
              {procedimentalFinal.titulo}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {procedimentalFinal.descripcion}
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 block mb-1.5">
              Estrategias de aplicación en laboratorio:
            </span>
            <ul className="space-y-1.5">
              {procedimentalFinal.acciones.map((acc, idx) => (
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
              {actitudinalFinal.titulo}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {actitudinalFinal.descripcion}
            </p>
          </div>

          <div className="pt-2 border-t border-purple-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-950 block mb-1.5">
              Fomento del clima de aula:
            </span>
            <ul className="space-y-1.5">
              {actitudinalFinal.acciones.map((acc, idx) => (
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
          <span>Integración en el Planeamiento Didáctico Oficial (Diagnóstico {nivel === "7mo" ? "7.°" : nivel === "8vo" ? "8.°" : "9.°"})</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {planeamientoFundamentacion}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {planeamientoPasos.map((paso, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
            >
              <CheckCircle size={15} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
              <span>{paso}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
