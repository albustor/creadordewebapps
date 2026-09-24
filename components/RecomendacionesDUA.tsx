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
  const [subTabActiva, setSubTabActiva] = useState<"conceptual" | "procedimental" | "actitudinal" | "planeamiento" | "decisiones" | "todos">("conceptual");
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

  // Función para solicitar a la IA en Cascada Multi-Proveedor el análisis pedagógico (Hook en el tope)
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
    <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
      {/* BOTÓN PROMINENTE Y CABECERA DE ANÁLISIS IA */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10.5px] font-black uppercase tracking-wider">
              ✨ Asistente IA Multi-Proveedor
            </span>
            <span className="text-xs text-indigo-200/80 font-semibold">
              Formación Tecnológica • {nivel === "7mo" ? "7.° Año (CyberQuest)" : nivel === "8vo" ? "8.° Año" : "9.° Año"}
            </span>
            {metaIA && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Cpu size={12} weight="bold" />
                <span>{metaIA.modelUsed} ({metaIA.latencyMs}ms)</span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">
            Recomendaciones Pedagógicas y Sugerencias de Mediación
          </h3>
          <p className="text-xs text-indigo-100/80 max-w-2xl leading-relaxed">
            Generación automatizada de estrategias de aula, vinculación DUA y acciones diferenciadas para nivelar saberes conceptuales, psicomotores y socioafectivos.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2.5">
          {tasaAlerta > 0 && (
            <span className="px-3 py-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-xs rounded-xl flex items-center gap-1.5">
              <WarningCircle size={16} weight="fill" className="text-amber-400" />
              <span>{estudiantesRezago.length} en acompañamiento ({tasaAlerta}%)</span>
            </span>
          )}

          <button
            onClick={ejecutarAnalisisConIA}
            disabled={cargandoIA || total === 0}
            title={
              total === 0
                ? "Se requieren registros de telemetría para analizar con IA"
                : "Ejecutar análisis en cascada multi-proveedor (Gemini, Groq, Qwen)"
            }
            className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
              cargandoIA
                ? "bg-indigo-800 text-indigo-300 cursor-not-allowed"
                : total === 0
                ? "bg-white/10 text-stone-400 cursor-not-allowed border border-white/10"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
            }`}
          >
            {cargandoIA ? (
              <>
                <ArrowsClockwise size={16} className="animate-spin" />
                <span>Analizando datos en tiempo real...</span>
              </>
            ) : aiData ? (
              <>
                <Sparkle size={16} weight="fill" className="text-amber-300" />
                <span>Re-analizar con IA</span>
              </>
            ) : (
              <>
                <Sparkle size={16} weight="fill" className="text-amber-300" />
                <span>Generar Análisis con IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Resumen Ejecutivo si fue generado por la IA */}
      {aiData?.resumenEjecutivo && (
        <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-2xl space-y-1.5 shadow-2xs">
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
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl space-y-2 shadow-2xs">
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

      {/* ========================================================================= */}
      {/* SUB-BOTONES / PESTAÑAS INTERNAS DE SABERES Y PLANEAMIENTO                  */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200">
          
          <button
            type="button"
            onClick={() => setSubTabActiva("conceptual")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTabActiva === "conceptual"
                ? "bg-blue-700 text-white shadow-sm scale-[1.01]"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-blue-900 border border-transparent"
            }`}
          >
            <BookOpen size={16} weight={subTabActiva === "conceptual" ? "fill" : "bold"} />
            <span>1. Saber Conceptual (Cognitivo)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTabActiva("procedimental")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTabActiva === "procedimental"
                ? "bg-emerald-700 text-white shadow-sm scale-[1.01]"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-900 border border-transparent"
            }`}
          >
            <Gear size={16} weight={subTabActiva === "procedimental" ? "fill" : "bold"} />
            <span>2. Saber Procedimental (Psicomotor)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTabActiva("actitudinal")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTabActiva === "actitudinal"
                ? "bg-purple-700 text-white shadow-sm scale-[1.01]"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-purple-900 border border-transparent"
            }`}
          >
            <Handshake size={16} weight={subTabActiva === "actitudinal" ? "fill" : "bold"} />
            <span>3. Saber Actitudinal (Socioafectivo)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTabActiva("planeamiento")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTabActiva === "planeamiento"
                ? "bg-slate-900 text-white shadow-sm scale-[1.01]"
                : "bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-transparent"
            }`}
          >
            <FileText size={16} weight={subTabActiva === "planeamiento" ? "fill" : "bold"} />
            <span>4. Integración al Planeamiento MEP</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTabActiva("decisiones")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTabActiva === "decisiones"
                ? "bg-purple-900 text-white shadow-sm scale-[1.01]"
                : "bg-white/80 hover:bg-white text-purple-900 hover:text-purple-950 border border-transparent"
            }`}
          >
            <Lightbulb size={16} weight={subTabActiva === "decisiones" ? "fill" : "bold"} />
            <span>5. Decisiones Pedagógicas (Matriz MEP)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTabActiva("todos")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ml-auto ${
              subTabActiva === "todos"
                ? "bg-stone-800 text-white shadow-sm"
                : "bg-transparent text-slate-600 hover:text-slate-900 font-bold"
            }`}
          >
            <span>Ver Todos</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CONTENIDO SEGÚN SUB-PESTAÑA SELECCIONADA                                   */}
        {/* ========================================================================= */}
        
        {/* 1. SABER CONCEPTUAL */}
        {(subTabActiva === "conceptual" || subTabActiva === "todos") && (
          <div className="bg-blue-50/50 border-2 border-blue-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/70 pb-3">
              <div className="flex items-center gap-2 text-blue-900 font-black text-sm uppercase tracking-wide">
                <BookOpen size={20} weight="bold" className="text-blue-700" />
                <span>1. Saber Conceptual • Área Cognitiva</span>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] font-bold rounded-lg border border-blue-200">
                Fundamentos Teóricos, Lógica y Ciberseguridad
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-white p-4 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                  Diagnóstico y Nivel Identificado:
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  {conceptualFinal.titulo}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {conceptualFinal.descripcion}
                </p>
                <div className="p-2.5 bg-blue-50/70 rounded-lg text-[11px] text-blue-950 font-medium">
                  📡 <strong>Vínculo con Telemetría:</strong> Cuestionarios interactivos, preguntas conceptuales de hardware/software, ciberseguridad y secuencias lógicas resueltas en CyberQuest 7°.
                </div>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-xl border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-1.5">
                  Acciones Didácticas Sugeridas en el Aula:
                </span>
                <ul className="space-y-2">
                  {conceptualFinal.acciones.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CaretRight size={14} className="text-blue-700 shrink-0 mt-0.5" weight="bold" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. SABER PROCEDIMENTAL / PSICOMOTOR */}
        {(subTabActiva === "procedimental" || subTabActiva === "todos") && (
          <div className="bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/70 pb-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-sm uppercase tracking-wide">
                <Gear size={20} weight="bold" className="text-emerald-700" />
                <span>2. Saber Procedimental • Área Psicomotriz / Motricidad Fina</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-lg border border-emerald-200">
                Coordinación Visomotriz, Precisión y Tiempos de Reacción
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-white p-4 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">
                  Diagnóstico y Destreza Práctica:
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  {procedimentalFinal.titulo}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {procedimentalFinal.descripcion}
                </p>
                <div className="p-2.5 bg-emerald-50/70 rounded-lg text-[11px] text-emerald-950 font-medium">
                  🖐️ <strong>Vínculo con Sensores Psicomotores:</strong> Métricas en tiempo real de P1 (lateralidad y laberinto), P2 (semáforo de reflejos y reacción), P3 (pulso y motricidad fina) y P4 (trazado guiado).
                </div>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-xl border border-emerald-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1.5">
                  Estrategias de Aplicación en Laboratorio:
                </span>
                <ul className="space-y-2">
                  {procedimentalFinal.acciones.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CaretRight size={14} className="text-emerald-700 shrink-0 mt-0.5" weight="bold" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 3. SABER ACTITUDINAL / SOCIOAFECTIVO */}
        {(subTabActiva === "actitudinal" || subTabActiva === "todos") && (
          <div className="bg-purple-50/50 border-2 border-purple-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200/70 pb-3">
              <div className="flex items-center gap-2 text-purple-900 font-black text-sm uppercase tracking-wide">
                <Handshake size={20} weight="bold" className="text-purple-700" />
                <span>3. Saber Actitudinal • Área Socioafectiva & Convivencia</span>
              </div>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200">
                Persistencia, Aprendizaje del Error y Colaboración
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 bg-white p-4 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block">
                  Diagnóstico Actitudinal y Clima:
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  {actitudinalFinal.titulo}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {actitudinalFinal.descripcion}
                </p>
                <div className="p-2.5 bg-purple-50/70 rounded-lg text-[11px] text-purple-950 font-medium">
                  ❤️ <strong>Vínculo con Telemetría Actitudinal:</strong> Escala de autopercepción, persistencia ante el error en reintentos, tiempos de reflexión y dinámicas de cooperación en parejas.
                </div>
              </div>

              <div className="space-y-2 bg-white p-4 rounded-xl border border-purple-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block mb-1.5">
                  Fomento del Clima de Aula y Habilidades Blandas:
                </span>
                <ul className="space-y-2">
                  {actitudinalFinal.acciones.map((acc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CaretRight size={14} className="text-purple-700 shrink-0 mt-0.5" weight="bold" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. INTEGRACIÓN AL PLANEAMIENTO DIDÁCTICO OFICIAL MEP */}
        {(subTabActiva === "planeamiento" || subTabActiva === "todos") && (
          <div className="bg-emerald-950/5 border-2 border-emerald-300 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                <FileText size={20} className="text-emerald-800" weight="fill" />
                <span>4. Integración en el Planeamiento Didáctico Oficial (Diagnóstico {nivel === "7mo" ? "7.°" : nivel === "8vo" ? "8.°" : "9.°"})</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-bold rounded-lg border border-emerald-200">
                Orientaciones Curriculares MEP & DUA
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-emerald-100">
              {planeamientoFundamentacion}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {planeamientoPasos.map((paso, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs hover:border-emerald-300 transition-colors"
                >
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" weight="fill" />
                  <span className="leading-relaxed">{paso}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. MATRIZ OFICIAL DE DECISIONES PEDAGÓGICAS (MEP PÁG. 10) */}
        {(subTabActiva === "decisiones" || subTabActiva === "todos") && (
          <div className="bg-gradient-to-br from-purple-950/5 via-indigo-950/5 to-slate-900/5 border-2 border-purple-300/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-200 pb-3">
              <div className="flex items-center gap-2 text-purple-950 font-black text-sm">
                <Lightbulb size={20} className="text-purple-700" weight="fill" />
                <span>5. Criterios de decisión docente y estrategias de mediación • {nivelEtiqueta}</span>
              </div>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200">
                Protocolo oficial MEP • Formación Tecnológica
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-purple-100">
              Con base en los datos de telemetría y observación directa, el docente aplica la siguiente matriz de decisiones pedagógicas para ajustar las experiencias de mediación en el aula:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {/* Criterio 1 */}
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-md uppercase">C1 • Lógica</span>
                    <span className="text-[10px] font-semibold text-slate-400">Algoritmos</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Dificultad en Algoritmo y Lógica de Control
                  </h5>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    <strong>Hallazgo:</strong> Confusión en condiciones booleanas (`LDR &lt; 300`), condicionales dobles o bucles.
                  </p>
                </div>
                <div className="p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-lg text-[11px] text-blue-950 space-y-1">
                  <span className="font-bold block text-blue-900">🎯 Mediación Recomendada:</span>
                  <span>Descomposición con pseudocódigo guiado y diagramas de flujo interactivos previo al bloque de código.</span>
                </div>
              </div>

              {/* Criterio 2 */}
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-md uppercase">C2 • Sensores</span>
                    <span className="text-[10px] font-semibold text-slate-400">Entradas / Salidas</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Dificultad en Sensores y Actuadores
                  </h5>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    <strong>Hallazgo:</strong> Error al interpretar la lectura analógica (0-1023) del LDR o el disparo del relevador.
                  </p>
                </div>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-950 space-y-1">
                  <span className="font-bold block text-amber-900">🎯 Mediación Recomendada:</span>
                  <span>Prácticas con multímetro/voltaje virtual, curvas luz vs resistencia y tablas de estados de actuador.</span>
                </div>
              </div>

              {/* Criterio 3 */}
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-md uppercase">C3 • Depuración</span>
                    <span className="text-[10px] font-semibold text-slate-400">Conexionado</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Dificultad en Depuración de Circuitos
                  </h5>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    <strong>Hallazgo:</strong> Inversión de terminales VCC/GND, líneas flotantes o ausencia de tierra común.
                  </p>
                </div>
                <div className="p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-lg text-[11px] text-rose-950 space-y-1">
                  <span className="font-bold block text-rose-900">🎯 Mediación Recomendada:</span>
                  <span>Protocolo de cableado ordenado (VCC → GND → Señal), simulador 2D libre y aislamiento metódico de fallas.</span>
                </div>
              </div>

              {/* Criterio 4 */}
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-black rounded-md uppercase">C4 • Socioafectivo</span>
                    <span className="text-[10px] font-semibold text-slate-400">Persistencia</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Dificultad Socioafectiva y Resiliencia
                  </h5>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    <strong>Hallazgo:</strong> Frustración rápida ante el error o múltiples reintentos ciegos sin análisis previo.
                  </p>
                </div>
                <div className="p-2.5 bg-purple-50/70 border border-purple-200/60 rounded-lg text-[11px] text-purple-950 space-y-1">
                  <span className="font-bold block text-purple-900">🎯 Mediación Recomendada:</span>
                  <span>Trabajo en parejas colaborativas, gamificación y validación pedagógica del error como fuente de aprendizaje.</span>
                </div>
              </div>

              {/* Criterio 5 */}
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md uppercase">C5 • Psicomotor</span>
                    <span className="text-[10px] font-semibold text-slate-400">Motricidad Fina</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Dificultad Psicomotora y Ensamblaje
                  </h5>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    <strong>Hallazgo:</strong> Imprecisión en el puntero, lentitud en trazado o fatiga de manipulación visomotriz.
                  </p>
                </div>
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg text-[11px] text-emerald-950 space-y-1">
                  <span className="font-bold block text-emerald-900">🎯 Mediación Recomendada:</span>
                  <span>Ajustes DUA de accesibilidad (alto contraste, terminales agrandadas) y ejercicios progresivos de precisión.</span>
                </div>
              </div>

              {/* Criterio 6 */}
              <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-2xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-black rounded-md uppercase">C6 • Avanzado</span>
                    <span className="text-[10px] font-semibold text-slate-400">Enriquecimiento</span>
                  </div>
                  <h5 className="font-extrabold text-xs text-slate-900 leading-snug">
                    Alto Desempeño y Dominio Inicial
                  </h5>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed">
                    <strong>Hallazgo:</strong> Dominio conceptual y conexionado rápido sin errores, alta autonomía técnica.
                  </p>
                </div>
                <div className="p-2.5 bg-teal-50/70 border border-teal-200/60 rounded-lg text-[11px] text-teal-950 space-y-1">
                  <span className="font-bold block text-teal-900">🎯 Mediación Recomendada:</span>
                  <span>Retos de ampliación (control PWM de luz, histéresis anti-rebote) y designación como monitor tutor de aula.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
