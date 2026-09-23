"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import SelectorVersionesDiagnostico from "@/components/SelectorVersionesDiagnostico";
import SelectorNivelDiagnosticoTabs from "@/components/SelectorNivelDiagnosticoTabs";
import AuthGuard from "@/components/AuthGuard";
import { NivelEducativo, obtenerDiagnosticoPorNivel } from "@/lib/diagnosticos";
import {
  FileText,
  Play,
  DownloadSimple,
  CheckCircle,
  Cpu,
  Sparkle,
  Wrench,
  Heart,
  ArrowSquareOut,
  Scales,
  GameController,
  Lightning,
  ChalkboardTeacher,
} from "@phosphor-icons/react";

export default function DiagnosticoPage() {
  const { docente } = useDocente();

  // Nivel activo: 7°, 8° o 9°
  const [nivelActivo, setNivelActivo] = useState<NivelEducativo>("8°");
  const [modalComparativaAbierto, setModalComparativaAbierto] = useState(false);

  const configActual = obtenerDiagnosticoPorNivel(nivelActivo);

  const esSuperAdmin =
    docente?.correoInstitucional?.toLowerCase().trim() === "alberto.bustos.ortega@mep.go.cr" ||
    docente?.correoInstitucional?.toLowerCase().trim() === "allan.morera.araya@mep.go.cr";
  const esAsesor =
    esSuperAdmin ||
    docente?.tipoRol === "Asesor Nacional" ||
    docente?.tipoRol === "Asesor Regional" ||
    docente?.dreCodigo === "DRE-NACIONAL";

  if (docente && !esAsesor) {
    return (
      <AuthGuard>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 border border-amber-300 mx-auto flex items-center justify-center shadow-xs">
            <Lightning size={32} weight="fill" className="text-amber-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              Módulo Exclusivo para Asesoría & Recursos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Este apartado está reservado para la Asesoría Nacional y Regional de Formación Tecnológica. Como docente evaluador, todas sus herramientas de diagnóstico, enlaces por nivel y consolidación de resultados están disponibles en su panel central.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-xs transition-all"
            >
              <span>Ir a mi Dashboard Docente</span>
              <ArrowSquareOut size={18} weight="bold" />
            </Link>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Cabecera Principal para Asesores y Docentes */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-300 text-[10px] font-black uppercase tracking-wider">
                Ecosistema Diagnóstico • III Ciclo
              </span>
              <span className="text-xs font-bold text-slate-500">
                Tecnologías de la Información
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Evaluación Diagnóstica: 7.°, 8.° y 9.° Año
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Seleccione el nivel educativo para acceder a los instrumentos diagnósticos basados en el Programa de Estudios de Tecnologías de la Información, WebApps autónomas (en línea y desconectadas con QR) y módulos de evaluación docente con rúbricas socioafectivas y psicomotoras.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => setModalComparativaAbierto(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Scales size={16} weight="bold" className="text-purple-700" />
              <span>Dictamen de Validación MEP</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <span>Ir al Dashboard Docente</span>
              <ArrowSquareOut size={16} weight="bold" />
            </Link>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS DE NIVEL: 7.°, 8.° y 9.° AÑO */}
        <SelectorNivelDiagnosticoTabs
          nivelSeleccionado={nivelActivo}
          onSelectNivel={(n) => setNivelActivo(n)}
        />

        {/* CONTENIDO ESPECÍFICO SEGÚN EL NIVEL */}

        {/* ========================================================= */}
        {/* PESTAÑA: 7.° AÑO («CyberQuest 7° - Misión Tecnológica»)   */}
        {/* ========================================================= */}
        {nivelActivo === "7°" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Banner Destacado 7mo */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    7.° Año • III Ciclo MEP
                  </span>
                  <span className="text-xs text-indigo-300 font-medium">Misión Tecnológica Gamificada</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  <GameController size={32} className="text-cyan-400" weight="fill" />
                  <span>CyberQuest 7°: Misión Tecnológica MEP</span>
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                  Aventura interactiva gamificada que explora fundamentos de computación, ciudadanía digital, secuencias lógicas y coordinación psicomotriz.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                <a
                  href="/documentos/Dossier_Diagnostico_MEP_7mo_CyberQuest.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
                >
                  <DownloadSimple size={18} weight="bold" />
                  <span>Descargar Dossier PDF (7mo)</span>
                </a>

                <a
                  href="/webapps/diagnostico_7mo_modulo01_docente_evaluador.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl border border-indigo-400/50 shadow-xs transition-all"
                >
                  <ChalkboardTeacher size={18} weight="fill" />
                  <span>Módulo Docente (7mo)</span>
                </a>
              </div>
            </div>

            {/* Selector de Versiones Estudiante y Docente */}
            <SelectorVersionesDiagnostico
              nivel="7°"
              docenteNombre={docente?.nombreCompleto}
              institucionNombre={docente?.institucionNombre}
            />

          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: 8.° AÑO («Hardware, Algoritmos y Robótica»)     */}
        {/* ========================================================= */}
        {nivelActivo === "8°" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Banner Destacado 8vo */}
            <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-teal-500/30 text-teal-200 border border-teal-400/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    8.° Año • PNFT Oficial MEP
                  </span>
                  <span className="text-xs text-teal-300 font-medium">14 Indicadores de Logro Oficiales</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  <Cpu size={32} className="text-teal-400" weight="fill" />
                  <span>Diagnóstico 8°: Hardware, Algoritmos y Robótica</span>
                </h2>
                <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-normal">
                  Instrumento oficial articulado en 3 subáreas (HW/SW, Algoritmos y Robótica) con 14 reactivos interactivos, mini-reto socioafectivo y lista de cotejo psicomotora para el docente.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                <a
                  href="/documentos/Informe_Analisis_y_Plan_Diagnostico_8vo_MEP.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
                >
                  <DownloadSimple size={18} weight="bold" />
                  <span>Descargar Informe Técnico PDF</span>
                </a>

                <a
                  href="/webapps/diagnostico_8vo_modulo01_docente_evaluador.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl border border-teal-500/50 shadow-xs transition-all"
                >
                  <ChalkboardTeacher size={18} weight="fill" />
                  <span>Módulo Evaluador Docente</span>
                </a>
              </div>
            </div>

            {/* Selector de Versiones Estudiante y Docente (8° Año) */}
            <SelectorVersionesDiagnostico
              nivel="8°"
              docenteNombre={docente?.nombreCompleto}
              institucionNombre={docente?.institucionNombre}
            />

          </div>
        )}

        {/* ========================================================= */}
        {/* PESTAÑA: 9.° AÑO («Aula Inteligente - LDR + MCU»)         */}
        {/* ========================================================= */}
        {nivelActivo === "9°" && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Banner Destacado 9no */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 rounded-full text-[10px] font-black uppercase tracking-wider">
                    9.° Año • Módulo 1 Oficial MEP
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">Automatización y Computación Física</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                  <Lightning size={32} className="text-amber-400" weight="fill" />
                  <span>Diagnóstico 9°: «Aula Inteligente (LDR + Microcontrolador)»</span>
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
                  Simulador 2D interactivo con conexionado de terminales (VCC 5V, GND, Pin A0, Pin D9), 10 ítems cognitivos de robótica/IoT y matriz de observación docente en tiempo real.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                <a
                  href="/webapps/diagnostico_9no_modulo01_docente_evaluador.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
                >
                  <ChalkboardTeacher size={18} weight="bold" />
                  <span>Módulo Evaluador Docente</span>
                </a>

                <a
                  href="/webapps/diagnostico_9no_modulo01_en_linea.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600/60 shadow-xs transition-all"
                >
                  <Play size={16} weight="fill" />
                  <span>Aplicativo Estudiante (9no)</span>
                </a>
              </div>
            </div>

            {/* Selector de Versiones Estudiante y Docente (9° Año) */}
            <SelectorVersionesDiagnostico
              nivel="9°"
              docenteNombre={docente?.nombreCompleto}
              institucionNombre={docente?.institucionNombre}
            />

          </div>
        )}

        {/* MODAL CUADRO COMPARATIVO Y DICTAMEN DE VALIDACIÓN CURRICULAR OFICIAL */}
        {modalComparativaAbierto && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl border-2 border-purple-600 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Scales size={24} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Dictamen de Validación y Cuadro Comparativo Oficial MEP
                    </h3>
                    <p className="text-xs text-slate-500">
                      Contraste directo entre los documentos base del MEP (7°, 8° y 9°) y la suite digital
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalComparativaAbierto(false)}
                  className="text-slate-400 hover:text-slate-700 font-black text-sm px-3 py-1 bg-slate-100 rounded-lg"
                >
                  ✕ Cerrar
                </button>
              </div>

              {/* Cuadro Comparativo */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-3 border border-slate-700">Nivel / Dimensión</th>
                      <th className="p-3 border border-slate-700">Documento Oficial MEP</th>
                      <th className="p-3 border border-slate-700">Implementación Digital Oficial MEP</th>
                      <th className="p-3 border border-slate-700 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 border border-slate-200">7.° Año (CyberQuest 7°)</td>
                      <td className="p-3 text-slate-600 border border-slate-200">Fundamentos de computación, lateralidad, ritmo, dibujo y algoritmia básica.</td>
                      <td className="p-3 text-slate-700 border border-slate-200">Aventura gamificada con Tone.js, rejilla 4x4, semáforo rítmico, canvas viso-manual y 10 retos.</td>
                      <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% alineado</span></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900 border border-slate-200">8.° Año (Hardware, Algoritmos y Robótica)</td>
                      <td className="p-3 text-slate-600 border border-slate-200">14 indicadores de logro en HW/SW, estructuras E-P-S, variables, condicionales, bucles y robótica.</td>
                      <td className="p-3 text-slate-700 border border-slate-200">Tríada autónoma: WebApp en línea con telemetría, WebApp offline con QR y Módulo Docente Evaluador con observación en vivo.</td>
                      <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% alineado</span></td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 border border-slate-200">9.° Año (Aula Inteligente)</td>
                      <td className="p-3 text-slate-600 border border-slate-200">Automatización con LDR, microcontrolador y actuador LED con rúbricas de 6 saberes P y 4 S.</td>
                      <td className="p-3 text-slate-700 border border-slate-200">Simulador 2D interactivo con cables dinámicos, osciloscopio, 10 retos y rúbrica docente en tiempo real.</td>
                      <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% potenciado</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Dictamen Pedagógico Final */}
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-purple-950">
                  <CheckCircle size={18} weight="fill" className="text-purple-700" />
                  <span>Dictamen Final: Validez Curricular y Tecnológica Ministerial (100%)</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Las aplicaciones preservan con absoluta fidelidad los criterios, saberes procedimentales, cognitivos y actitudinales establecidos en los programas oficiales del MEP para III Ciclo.
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalComparativaAbierto(false)}
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Entendido y cerrar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AuthGuard>
  );
}
