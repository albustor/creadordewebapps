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
  CheckCircle,
  Cpu,
  Sparkle,
  Wrench,
  Heart,
  ArrowSquareOut,
  GameController,
  Lightning,
} from "@phosphor-icons/react";

export default function DiagnosticoPage() {
  const { docente } = useDocente();

  // Nivel activo: 7°, 8° o 9°
  const [nivelActivo, setNivelActivo] = useState<NivelEducativo>("8°");

  const configActual = obtenerDiagnosticoPorNivel(nivelActivo);

  const correoLimpio = docente?.correoInstitucional?.toLowerCase().trim() || "";
  const esSuperAdmin = correoLimpio === "alberto.bustos.ortega@mep.go.cr";
  const esAsesor =
    esSuperAdmin ||
    correoLimpio === "allan.morera.araya@mep.go.cr" ||
    (docente?.tipoRol === "Asesor Nacional" || docente?.tipoRol === "Asesor Regional");

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
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-800 hover:bg-sky-900 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <span>Ir al Dashboard Docente</span>
              <ArrowSquareOut size={16} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Banner Informativo Exclusivo para Asesoría */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-300 rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Lightning size={26} weight="fill" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-black text-[10px] uppercase tracking-wider border border-amber-300">
                  ⚡ Espacio de Asesoría Curricular y Pilotaje
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Guía de Uso para Asesores Nacionales y Regionales
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                ¿Cómo funciona este entorno de prueba para el Asesor?
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Este módulo es un <strong>espejo interactivo</strong> de las herramientas curriculares que tienen los docentes en el aula. Desde aquí, usted como asesor/a puede explorar, interactuar y <strong>realizar simulaciones y pruebas pedagógicas con cada una de las secciones de 7.°, 8.° y 9.° Año</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                  <span className="text-base shrink-0">🎯</span>
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 block font-bold">Simulación Directa por Sección:</strong>
                    Abra cualquier instrumento (estudiante o docente evaluador) para poner a prueba las dinámicas, reactivos y rúbricas socioafectivas.
                  </div>
                </div>
                <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 flex items-start gap-2.5">
                  <span className="text-base shrink-0">📊</span>
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900 block font-bold">Reflejo en su Dashboard:</strong>
                    Al estar logueado/a como asesor/a, todo ensayo o prueba que realice con otras personas aparecerá en su <strong>Dashboard Docente</strong> para analizar telemetría, semáforos y recomendaciones DUA.
                  </div>
                </div>
              </div>
            </div>
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
              <div className="space-y-3 max-w-3xl">
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
              <div className="space-y-3 max-w-3xl">
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
            </div>

            {/* Selector de Versiones Estudiante y Docente (9° Año) */}
            <SelectorVersionesDiagnostico
              nivel="9°"
              docenteNombre={docente?.nombreCompleto}
              institucionNombre={docente?.institucionNombre}
            />

          </div>
        )}

      </div>
    </AuthGuard>
  );
}
