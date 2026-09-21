"use client";

import React, { useState } from "react";
import { SafeStorage } from "@/lib/firebase";
import {
  Sliders,
  UploadSimple,
  Sparkle,
  Check,
  FloppyDisk,
  Article,
  GraduationCap,
  Percent,
  X,
  FileText,
  ShieldCheck,
  CheckCircle,
} from "@phosphor-icons/react";

export interface ConfiguracionDashboardDocente {
  tipoProceso: "diagnostico" | "cotidiano";
  nombreInstrumento: string;
  asignatura: string;
  nivelEducativo: string;
  periodo: string;
  saberConceptual?: string;
  saberProcedimental?: string;
  saberActitudinal?: string;
  indicadorCodigo?: string;
  umbralInicialMax: number; // Ej: 59%
  umbralIntermedioMax: number; // Ej: 79%
  umbralAvanzadoMin: number; // Ej: 80%
  criteriosPersonalizados: {
    inicial: string;
    intermedio: string;
    avanzado: string;
  };
  indicadoresClave: string[];
  archivoFuenteNombre?: string;
  fechaActualizacion: string;
}

export const CONFIGURACION_DEFAULT: ConfiguracionDashboardDocente = {
  tipoProceso: "diagnostico",
  nombreInstrumento: "Diagnóstico Integrado 9°: «Aula Inteligente»",
  asignatura: "Formación Tecnológica",
  nivelEducativo: "9° Año - Secundaria",
  periodo: "Diagnóstico Inicial (Módulo 1)",
  umbralInicialMax: 59,
  umbralIntermedioMax: 79,
  umbralAvanzadoMin: 80,
  criteriosPersonalizados: {
    inicial: "Requiere acompañamiento para conectar circuitos y formular la lógica condicional en la simulación.",
    intermedio: "Diseña circuitos básicos y formula secuencias algorítmicas con asistencia guiada.",
    avanzado: "Diseña, conecta y programa sistemas automatizados y algoritmos con total autonomía y precisión.",
  },
  indicadoresClave: [
    "SEC.9NO.DIAG.01: Análisis y conexión de sensores, circuitos y lógica de control automatizado en el aula inteligente",
  ],
  fechaActualizacion: new Date().toISOString(),
};

interface Props {
  abierto: boolean;
  alCerrar: () => void;
  configuracionActual: ConfiguracionDashboardDocente;
  alGuardarConfiguracion: (nuevaConfig: ConfiguracionDashboardDocente) => void;
}

export default function ConfiguradorInstrumentoDashboard({
  abierto,
  alCerrar,
  configuracionActual,
  alGuardarConfiguracion,
}: Props) {
  const [tipoProceso, setTipoProceso] = useState<"diagnostico" | "cotidiano">(
    configuracionActual.tipoProceso
  );
  const [nombreInstrumento, setNombreInstrumento] = useState(
    configuracionActual.nombreInstrumento
  );
  const [asignatura, setAsignatura] = useState(configuracionActual.asignatura);
  const [nivelEducativo, setNivelEducativo] = useState(
    configuracionActual.nivelEducativo
  );
  const [periodo, setPeriodo] = useState(configuracionActual.periodo);

  const [umbralInicialMax, setUmbralInicialMax] = useState(
    configuracionActual.umbralInicialMax
  );
  const [umbralIntermedioMax, setUmbralIntermedioMax] = useState(
    configuracionActual.umbralIntermedioMax
  );
  const [umbralAvanzadoMin, setUmbralAvanzadoMin] = useState(
    configuracionActual.umbralAvanzadoMin
  );

  const [criterioInicial, setCriterioInicial] = useState(
    configuracionActual.criteriosPersonalizados.inicial
  );
  const [criterioIntermedio, setCriterioIntermedio] = useState(
    configuracionActual.criteriosPersonalizados.intermedio
  );
  const [criterioAvanzado, setCriterioAvanzado] = useState(
    configuracionActual.criteriosPersonalizados.avanzado
  );

  const [archivoTexto, setArchivoTexto] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState(
    configuracionActual.archivoFuenteNombre || ""
  );
  const [analizandoIA, setAnalizandoIA] = useState(false);
  const [guardadoFeedback, setGuardadoFeedback] = useState(false);

  if (!abierto) return null;

  // Procesar archivo subido (.txt, .docx, .json)
  const handleProcesarArchivo = (file: File) => {
    setNombreArchivo(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target?.result as string;
      setArchivoTexto(contenido);
    };
    reader.readAsText(file);
  };

  // Analizar archivo con IA para extraer parámetros del instrumento
  const handleAnalizarConIA = async () => {
    if (!archivoTexto.trim()) {
      alert("Por favor sube un archivo o escribe el texto de tu instrumento primero.");
      return;
    }

    setAnalizandoIA(true);
    try {
      const resp = await fetch("/api/ia/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textoDocumento: archivoTexto }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.asignatura) setAsignatura(data.asignatura);
        if (data.nivelSugerido) setNivelEducativo(data.nivelSugerido);
        if (data.saberesDetectados && data.saberesDetectados[0]) {
          setNombreInstrumento(
            `Instrumento Personalizado: ${data.saberesDetectados[0].saberConceptual || "Evaluación"}`
          );
          if (data.saberesDetectados[0].criteriosLogro) {
            setCriterioInicial(data.saberesDetectados[0].criteriosLogro.inicial || criterioInicial);
            setCriterioIntermedio(data.saberesDetectados[0].criteriosLogro.intermedio || criterioIntermedio);
            setCriterioAvanzado(data.saberesDetectados[0].criteriosLogro.avanzado || criterioAvanzado);
          }
        }
      }
    } catch (err) {
      console.warn("Error analizando con IA:", err);
    } finally {
      setAnalizandoIA(false);
    }
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    const nuevaConfig: ConfiguracionDashboardDocente = {
      tipoProceso,
      nombreInstrumento,
      asignatura,
      nivelEducativo,
      periodo,
      umbralInicialMax: Number(umbralInicialMax),
      umbralIntermedioMax: Number(umbralIntermedioMax),
      umbralAvanzadoMin: Number(umbralAvanzadoMin),
      criteriosPersonalizados: {
        inicial: criterioInicial,
        intermedio: criterioIntermedio,
        avanzado: criterioAvanzado,
      },
      indicadoresClave: configuracionActual.indicadoresClave,
      archivoFuenteNombre: nombreArchivo || undefined,
      fechaActualizacion: new Date().toISOString(),
    };

    SafeStorage.setItem("configuracion_dashboard_docente", JSON.stringify(nuevaConfig));
    alGuardarConfiguracion(nuevaConfig);
    setGuardadoFeedback(true);
    setTimeout(() => {
      setGuardadoFeedback(false);
      alCerrar();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
        {/* Cabecera Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 text-[11px] font-black rounded-md uppercase">
                Personalización Docente
              </span>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-md">
                Diagnóstico & Trabajo Cotidiano
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Configurador del Dashboard & Carga de Instrumento Base
            </h2>
            <p className="text-xs text-slate-500">
              Personaliza el enfoque evaluativo, las escalas de logro y los criterios de tu planeamiento oficial
            </p>
          </div>

          <button
            onClick={alCerrar}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleGuardar} className="space-y-6">
          {/* Selector de Tipo de Proceso (Diagnóstico vs Trabajo Cotidiano) */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              1. Enfoque / Modo de Evaluación del Dashboard:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoProceso("diagnostico")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  tipoProceso === "diagnostico"
                    ? "bg-purple-50 border-purple-600 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-purple-950 flex items-center gap-1.5">
                    <Sparkle size={18} weight="fill" className="text-amber-500" />
                    <span>Evaluación Diagnóstica Inicial</span>
                  </span>
                  {tipoProceso === "diagnostico" && (
                    <CheckCircle size={18} weight="fill" className="text-purple-700" />
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Detección de conocimientos previos, rezago pedagógico y clasificación en <em>Requiere Acompañamiento, En Desarrollo, Consolidado</em>.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTipoProceso("cotidiano")}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  tipoProceso === "cotidiano"
                    ? "bg-blue-50 border-blue-600 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-blue-950 flex items-center gap-1.5">
                    <Article size={18} weight="duotone" className="text-blue-700" />
                    <span>Trabajo Cotidiano (Formativo)</span>
                  </span>
                  {tipoProceso === "cotidiano" && (
                    <CheckCircle size={18} weight="fill" className="text-blue-700" />
                  )}
                </div>
                <p className="text-xs text-slate-600">
                  Rúbrica formativa oficial de III Ciclo (Inicial, Intermedio, Avanzado) con verificación anti-fraude por token SHA-256.
                </p>
              </button>
            </div>
          </div>

          {/* Carga de Archivo Base o Instrumento del Docente */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
                <UploadSimple size={16} className="text-blue-700" weight="bold" />
                <span>2. Subir Archivo Base o Instrumento de Evaluación:</span>
              </span>
              {nombreArchivo && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check size={14} weight="bold" />
                  <span>{nombreArchivo}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Sube tu guía pedagógica, planeamiento, lista de cotejo o rúbrica (.docx, .txt, .json) para que la IA extraiga los indicadores automáticamente.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs">
                <UploadSimple size={16} />
                <span>{nombreArchivo ? "Cambiar Archivo Base" : "Seleccionar Archivo (.docx, .txt, .json)"}</span>
                <input
                  type="file"
                  accept=".docx,.txt,.json,.csv"
                  className="hidden"
                  onChange={(e) => e.target.files && handleProcesarArchivo(e.target.files[0])}
                />
              </label>

              {archivoTexto && (
                <button
                  type="button"
                  onClick={handleAnalizarConIA}
                  disabled={analizandoIA}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  <Sparkle size={16} weight="fill" className="text-amber-400" />
                  <span>{analizandoIA ? "Analizando con IA..." : "Extraer con IA"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Metadatos del Instrumento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre del Instrumento de Evaluación:
              </label>
              <input
                type="text"
                value={nombreInstrumento}
                onChange={(e) => setNombreInstrumento(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Asignatura / Área:
              </label>
              <input
                type="text"
                value={asignatura}
                onChange={(e) => setAsignatura(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nivel Educativo (Secundaria):
              </label>
              <select
                value={nivelEducativo}
                onChange={(e) => setNivelEducativo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
              >
                <option value="7° Año - Secundaria">7° Año - Secundaria</option>
                <option value="8° Año - Secundaria">8° Año - Secundaria</option>
                <option value="9° Año - Secundaria">9° Año - Secundaria</option>
              </select>
            </div>
          </div>

          {/* Umbrales de Ponderación / Semáforo */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              <Percent size={16} className="text-blue-700" weight="bold" />
              <span>3. Umbrales de Calificación del Semáforo:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <label className="block text-[11px] font-bold text-rose-900">
                  🔴 Nivel Inicial (&lt; %):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={umbralInicialMax}
                  onChange={(e) => setUmbralInicialMax(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded-lg text-xs font-bold text-rose-950"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <label className="block text-[11px] font-bold text-amber-900">
                  🟡 Nivel Intermedio (hasta %):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={umbralIntermedioMax}
                  onChange={(e) => setUmbralIntermedioMax(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-950"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <label className="block text-[11px] font-bold text-emerald-900">
                  🟢 Nivel Avanzado (≥ %):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={umbralAvanzadoMin}
                  onChange={(e) => setUmbralAvanzadoMin(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950"
                />
              </div>
            </div>
          </div>

          {/* Criterios Descriptivos Personalizados */}
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-slate-800 uppercase block">
              4. Descriptores de Logro Personalizados:
            </span>

            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Descriptor Nivel Inicial:
                </label>
                <textarea
                  value={criterioInicial}
                  onChange={(e) => setCriterioInicial(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Descriptor Nivel Intermedio:
                </label>
                <textarea
                  value={criterioIntermedio}
                  onChange={(e) => setCriterioIntermedio(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Descriptor Nivel Avanzado:
                </label>
                <textarea
                  value={criterioAvanzado}
                  onChange={(e) => setCriterioAvanzado(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div>
              {guardadoFeedback && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fadeIn">
                  <Check size={16} weight="bold" />
                  <span>¡Instrumento guardado y aplicado al Dashboard!</span>
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={alCerrar}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <FloppyDisk size={18} weight="bold" />
                <span>Aplicar al Dashboard</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
