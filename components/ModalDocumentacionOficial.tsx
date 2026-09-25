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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#002b49] text-white flex items-center justify-center text-2xl shadow-xs">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider">
                  MEP • DRTE • IDI
                </span>
                <span className="text-[11px] text-slate-400 font-bold">Febrero 2027</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mt-0.5">
                Centro de Documentación Técnica Oficial
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Descripción */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Acceda y descargue los documentos técnicos de la <strong>Herramienta de Diagnóstico Estudiantes</strong>. Elaborados por <strong>Allan Morera Araya y Alberto Bustos Ortega</strong> para orientar la aplicación de la arquitectura evaluativa híbrida en el marco de la Formación Tecnológica 2027.
        </p>

        {/* Tarjetas de Documentos */}
        <div className="space-y-4">
          
          {/* Tarjeta 7.° Año */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-sky-50/30 border border-sky-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  7°
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    Propuesta de Arquitectura Evaluativa Híbrida — 7.° Año
                  </h4>
                  <span className="text-[11px] text-sky-700 font-bold">
                    CyberQuest: Fundamentos Digitales, Pensamiento Computacional y Motricidad Fina
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 shrink-0">
                Oficial MEP
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Detalla la autocalificación de 10 reactivos cognitivos, la telemetría sensorio-motora (P1 a P3), la observación de motricidad fina (P4) y las dinámicas socioafectivas de piloto y copiloto en parejas (S1 a S4).
            </p>

            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <a
                href="/docs/PROPUESTA_ARQUITECTURA_EVALUATIVA_HIBRIDA_7MO_MEP_2027.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="PROPUESTA_ARQUITECTURA_EVALUATIVA_HIBRIDA_7MO_MEP_2027.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
              >
                <FilePdf size={16} weight="bold" />
                <span>Descargar PDF (7°)</span>
              </a>
              <a
                href="/docs/PROPUESTA_ARQUITECTURA_EVALUATIVA_HIBRIDA_7MO_MEP_2027.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 text-sky-900 border border-sky-300 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Ver Documento Web</span>
              </a>
            </div>
          </div>

          {/* Tarjeta Marco Integrador Tri-Modal 9.° Año (Nuevo) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/30 border border-indigo-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#002b49] text-white flex items-center justify-center font-black text-xs shadow-xs">
                  9° TM
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    Marco Integrador de Evaluación Tri-Modal y Telemetría — 9.° Año
                  </h4>
                  <span className="text-[11px] text-indigo-700 font-bold">
                    Ecosistema Tri-Modal: En Línea, Local Desconectado (QR/USB) e Impreso
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 shrink-0">
                Nuevo Oficial
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Define la arquitectura tri-modal estandarizada (en línea, HTML offline con QR condensado &lt; 300 caracteres y formato impreso), matriz de 10 reactivos e indicadores MEP, telemetría automática y protocolo de validación docente.
            </p>

            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <a
                href="/docs/MARCO_INTEGRADOR_EVALUACION_TRI_MODAL_Y_TELEMETRIA_9NO_MEP.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="MARCO_INTEGRADOR_EVALUACION_TRI_MODAL_Y_TELEMETRIA_9NO_MEP.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
              >
                <FilePdf size={16} weight="bold" />
                <span>Descargar PDF Tri-Modal</span>
              </a>
              <a
                href="/docs/MARCO_INTEGRADOR_EVALUACION_TRI_MODAL_Y_TELEMETRIA_9NO_MEP.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-300 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Ver Documento Web</span>
              </a>
            </div>
          </div>

          {/* Tarjeta 9.° Año */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border border-emerald-200 shadow-2xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  9°
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    Propuesta de Arquitectura Evaluativa Híbrida — 9.° Año
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    Aula Inteligente: Hardware, Programación Condicional y Depuración
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                Oficial MEP
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Establece la evaluación híbrida del circuito automatizado: autovalidación de cableado y polaridad (P1 a P3), observación en vivo de umbrales y depuración (P4 a P6), y contención socioafectiva formativa (S1 a S4).
            </p>

            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <a
                href="/docs/PROPUESTA_ARQUITECTURA_EVALUATIVA_HIBRIDA_MEP_2027.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download="PROPUESTA_ARQUITECTURA_EVALUATIVA_HIBRIDA_MEP_2027.pdf"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
              >
                <FilePdf size={16} weight="bold" />
                <span>Descargar PDF (9°)</span>
              </a>
              <a
                href="/docs/PROPUESTA_ARQUITECTURA_EVALUATIVA_HIBRIDA_MEP_2027.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowSquareOut size={16} weight="bold" />
                <span>Ver Documento Web</span>
              </a>
            </div>
          </div>

        </div>

        {/* Nota Institucional */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between flex-wrap gap-2">
          <span>Ministerio de Educación Pública • Dirección de Recursos Tecnológicos en Educación</span>
          <span className="font-semibold text-slate-700">Versión Final Consolidada</span>
        </div>

      </div>
    </div>
  );
}
