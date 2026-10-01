"use client";

import React from "react";
import {
  X,
  FilePdf,
  ArrowSquareOut,
  DownloadSimple,
  BookOpen,
  CheckCircle,
  FileText,
  ShieldCheck,
  Sparkle,
  DeviceMobile,
  Desktop,
  Cpu,
  GraduationCap,
} from "@phosphor-icons/react";

interface ModalDocumentacionOficialProps {
  abierto: boolean;
  alCerrar: () => void;
}

export default function ModalDocumentacionOficial({
  abierto,
  alCerrar,
}: ModalDocumentacionOficialProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#002b49] text-white flex items-center justify-center text-2xl shadow-xs shrink-0">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider">
                  MEP • DRTE • IDI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Versión V3.2 Oficial
                </span>
                <span className="text-[11px] text-slate-400 font-bold">Febrero 2027</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                Centro de Documentación Técnica y Curricular
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cerrar (Esc)"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Descripción Institucional */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1">
          <p>
            Documentación técnica y pedagógica oficial unificada en dos niveles para orientar la aplicación de la arquitectura diagnóstica formativa, telemetría y sistematización en el <strong>Programa Nacional de Formación Tecnológica (PNFT)</strong>.
          </p>
          <p className="text-slate-500 text-[11px]">
            <strong>Autora Curricular Oficial:</strong> Heidi María Cascante Cruz • <strong>Integración Tecnológica:</strong> Allan Morera Araya y Alberto Bustos Ortega.
          </p>
        </div>

        {/* Bloques de Documentación Unificados en 2 Niveles */}
        <div className="space-y-4">
          
          {/* NIVEL 1: SÉTIMO AÑO */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-sky-50/40 border-2 border-teal-300 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  7°
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-200">
                      Nivel 1 • Sétimo Año
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Módulo 1</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base leading-snug mt-1">
                    Documento Técnico-Pedagógico Unificado — 7.° Año
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Marco integrador tri-modal, justificación de equidad en laboratorio institucional, telemetría de interacción y radar docente.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de Acción de Sétimo */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <a
                href="/docs/DOCUMENTO_TECNICO_PEDAGOGICO_UNIFICADO_7MO_MEP.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Ver Documento Maestro (Web)</span>
              </a>

              <a
                href="/docs/diagnostico_7mo_imprimible.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="diagnostico_7mo_imprimible.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <FilePdf size={16} weight="bold" />
                <span>Guía Oficial Imprimible (17 Págs PDF)</span>
              </a>

              <a
                href="/docs/DOCUMENTO_TECNICO_PEDAGOGICO_UNIFICADO_7MO_MEP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-teal-50 text-teal-900 border border-teal-300 text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <FileText size={15} weight="bold" />
                <span>Markdown (.md)</span>
              </a>
            </div>
          </div>

          {/* NIVEL 2: NOVENO AÑO */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 border-2 border-indigo-300 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#002b49] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  9°
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
                      Nivel 2 • Noveno Año
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">Módulo 1</span>
                  </div>
                  <h4 className="font-black text-slate-900 text-base leading-snug mt-1">
                    Documento Técnico-Pedagógico Unificado — 9.° Año
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Arquitectura Dual-QR, simulación 2D en protoboard, telemetría de conexionado de circuitos y sistematización grupal en Excel.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de Acción de Noveno */}
            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <a
                href="/docs/DOCUMENTO_TECNICO_PEDAGOGICO_UNIFICADO_9NO_MEP.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#002b49] hover:bg-[#001f35] text-white text-xs font-black shadow-xs transition-all cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Ver Documento Maestro (Web)</span>
              </a>

              <a
                href="/docs/diagnostico_9no_imprimible.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="diagnostico_9no_imprimible.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <FilePdf size={16} weight="bold" />
                <span>Guía Oficial Imprimible (9.° Año PDF)</span>
              </a>

              <a
                href="/docs/DOCUMENTO_TECNICO_PEDAGOGICO_UNIFICADO_9NO_MEP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-300 text-xs font-bold shadow-2xs transition-all cursor-pointer"
              >
                <FileText size={15} weight="bold" />
                <span>Markdown (.md)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Pie de Página Institucional */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between flex-wrap gap-2">
          <span>Ministerio de Educación Pública • Dirección de Recursos Tecnológicos en Educación</span>
          <span className="font-bold text-slate-700">Versión V3.2 Oficial Consolidada</span>
        </div>

      </div>
    </div>
  );
}
