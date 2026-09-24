"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { exportarAExcel, exportarAPDF } from "@/lib/exportUtils";
import SemaforoLogro from "@/components/SemaforoLogro";
import GraficasSecciones from "@/components/GraficasSecciones";
import RecomendacionesDUA from "@/components/RecomendacionesDUA";
import { CONFIGURACION_DEFAULT } from "@/components/ConfiguradorInstrumentoDashboard";
import ModalGuiaRapidaDocente from "@/components/ModalGuiaRapidaDocente";
import {
  CheckCircle,
  Copy,
  DownloadSimple,
  DeviceMobileCamera,
  ArrowSquareOut,
  FileXls,
  FilePdf,
  MagnifyingGlass,
  Sparkle,
  Trash,
  NotePencil,
  Lightbulb,
  CaretDown,
  CaretUp,
  Buildings,
  GraduationCap,
  GameController,
  Robot,
  Cpu,
  WifiSlash,
  Globe,
  IdentificationCard,
  QrCode,
  ShieldCheck,
  ChalkboardTeacher,
} from "@phosphor-icons/react";

export default function PanelDocenteSimplificado() {
  const { docente, telemetria, eliminarResultado, limpiarTelemetria } = useDocente();

  // Paso 1: Nivel y Sección seleccionados
  const [nivelActivo, setNivelActivo] = useState<"7mo" | "8vo" | "9no">("7mo");
  const [seccionActiva, setSeccionActiva] = useState<string>("7-1");

  // Estado del centro educativo activo (si tiene múltiples)
  const [centroIdx, setCentroIdx] = useState<number>(0);

  // Estado de copia de enlace (feedback visual inmediato)
  const [copiado, setCopiado] = useState(false);

  // Estado de búsqueda en lista
  const [busqueda, setBusqueda] = useState("");

  // Estado de apertura del análisis pedagógico detallado (Progressive Disclosure)
  const [mostrarAnalisisAvanzado, setMostrarAnalisisAvanzado] = useState(false);

  // Estado del modal de ayuda rápida en 1 minuto
  const [modalAyuda, setModalAyuda] = useState(false);

  // Modal para proyectar QR / Enlace en pizarra
  const [modalProyectar, setModalProyectar] = useState(false);

  // Lista normalizada de centros educativos
  const centrosDocente = useMemo(() => {
    const nivelKey = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
    if (docente?.centrosEducativos && Array.isArray(docente.centrosEducativos) && docente.centrosEducativos.length > 0) {
      return docente.centrosEducativos.map((c, idx) => {
        const dn = c.desgloseNiveles?.find((d) => d && typeof d.nivel === "string" && d.nivel.includes(nivelKey));
        let secciones: string[] = [];
        if (dn?.seccionesAtendidasDocente && dn.seccionesAtendidasDocente.length > 0) {
          secciones = dn.seccionesAtendidasDocente.filter(Boolean);
        } else if (Array.isArray((c as any).seccionesAtendidas) && (c as any).seccionesAtendidas.length > 0) {
          secciones = (c as any).seccionesAtendidas.filter((s: string) => s.includes(nivelKey));
        }
        if (secciones.length === 0) {
          secciones = [`${nivelKey}-1`, `${nivelKey}-2`, `${nivelKey}-3`];
        }
        return {
          id: c.id || `c-${idx}`,
          nombre: c.nombre || "Centro Educativo MEP",
          dreCodigo: c.dreCodigo || "DRE-01",
          dreNombre: c.dreNombre || "San José Central",
          circuito: c.circuito || "Circuito 01",
          secciones,
        };
      });
    }
    return [
      {
        id: "c-def",
        nombre: docente?.institucionNombre || "Liceo MEP",
        dreCodigo: docente?.dreCodigo || "DRE-01",
        dreNombre: docente?.dreNombre || "San José Central",
        circuito: docente?.circuito || "Circuito 01",
        secciones: nivelActivo === "7mo" ? ["7-1", "7-2", "7-3"] : nivelActivo === "8vo" ? ["8-1", "8-2", "8-3"] : ["9-1", "9-2", "9-3"],
      },
    ];
  }, [docente, nivelActivo]);

  const centroActivo = centrosDocente[centroIdx] || centrosDocente[0];

  // Lista de secciones disponibles para el nivel activo
  const seccionesDisponibles = useMemo(() => {
    const nivelNum = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
    if (centroActivo?.secciones && centroActivo.secciones.length > 0) {
      const filtradas = centroActivo.secciones.filter((s) => s.startsWith(nivelNum));
      if (filtradas.length > 0) return filtradas;
    }
    return [`${nivelNum}-1`, `${nivelNum}-2`, `${nivelNum}-3`, `${nivelNum}-4`];
  }, [centroActivo, nivelActivo]);

  // Al cambiar de nivel, actualizar la sección activa a la primera disponible
  const handleCambiarNivel = (nuevoNivel: "7mo" | "8vo" | "9no") => {
    setNivelActivo(nuevoNivel);
    const nivelNum = nuevoNivel === "7mo" ? "7" : nuevoNivel === "8vo" ? "8" : "9";
    setSeccionActiva(`${nivelNum}-1`);
  };

  // Enlace seguro generado para el alumno
  const urlEstudiante = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://diagnosticosecundaria.vercel.app";
    const appArchivo =
      nivelActivo === "7mo"
        ? "diagnostico_7mo_modulo01_en_linea.html"
        : nivelActivo === "8vo"
        ? "diagnostico_8vo_modulo01_en_linea.html"
        : "diagnostico_9no_modulo01_en_linea.html";

    const payloadRaw = {
      docId: docente?.idDocente || "DOC-7729",
      docNom: docente?.nombreCompleto || "Docente MEP",
      dreCod: centroActivo.dreCodigo,
      dreNom: centroActivo.dreNombre,
      circ: centroActivo.circuito,
      inst: centroActivo.nombre,
      sec: seccionActiva,
      nivel: nivelActivo === "7mo" ? "7°" : nivelActivo === "8vo" ? "8°" : "9°",
    };

    let token = "";
    try {
      token = btoa(unescape(encodeURIComponent(JSON.stringify(payloadRaw))));
    } catch {
      token = "token-seguro";
    }

    return `${baseUrl}/webapps/${appArchivo}?token=${token}`;
  }, [nivelActivo, seccionActiva, centroActivo, docente]);

  // Enlace para el evaluador docente
  const urlEvaluador = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://diagnosticosecundaria.vercel.app";
    const appArchivo =
      nivelActivo === "7mo"
        ? "diagnostico_7mo_modulo01_docente_evaluador.html"
        : nivelActivo === "8vo"
        ? "diagnostico_8vo_modulo01_docente_evaluador.html"
        : "diagnostico_9no_modulo01_docente_evaluador.html";

    const payloadRaw = {
      docId: docente?.idDocente || "DOC-7729",
      docNom: docente?.nombreCompleto || "Docente MEP",
      dreCod: centroActivo.dreCodigo,
      dreNom: centroActivo.dreNombre,
      circ: centroActivo.circuito,
      inst: centroActivo.nombre,
      sec: seccionActiva,
    };

    let token = "";
    try {
      token = btoa(unescape(encodeURIComponent(JSON.stringify(payloadRaw))));
    } catch {
      token = "token-docente";
    }

    return `${baseUrl}/webapps/${appArchivo}?token=${token}`;
  }, [nivelActivo, seccionActiva, centroActivo, docente]);

  // Copiar enlace al portapapeles
  const handleCopiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlEstudiante);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      // Fallback manual
      const input = document.createElement("input");
      input.value = urlEstudiante;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  // Filtrar registros de telemetría de la sección activa
  const registrosSeccion = useMemo(() => {
    const nivelNum = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
    return (telemetria || []).filter((r) => {
      if (!r) return false;
      const nom = (r.estudianteNombre || (r as any).nombreEstudiante || "").toLowerCase();
      const ced = (r.estudianteCedula || (r as any).cedula || "").toLowerCase();
      const sec = (r.seccionOGrupo || (r as any).seccion || "").trim().toLowerCase();
      const niv = (r.nivel || "").toString().toLowerCase();
      const tit = (r.webAppTitulo || "").toLowerCase();

      // Descartar pruebas inapropiadas
      if (nom.includes("yo si jodo") || nom.includes("yosijodo") || nom.includes("augrey")) {
        return false;
      }

      // Excluir si coincide con el docente
      if (docente?.nombreCompleto && nom === docente.nombreCompleto.toLowerCase().trim()) {
        return false;
      }

      const coincideNivel =
        !niv || niv.includes(nivelNum) || tit.includes(nivelNum) || sec.includes(`${nivelNum}-`);

      const secLimpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
      const activaLimpia = seccionActiva.replace(/^secci[oó]n\s*/i, "").trim();
      const coincideSeccion =
        !seccionActiva || secLimpia === activaLimpia || sec === seccionActiva.toLowerCase();

      const busqLimpia = busqueda.trim().toLowerCase();
      const coincideBusqueda =
        !busqLimpia || nom.includes(busqLimpia) || ced.includes(busqLimpia);

      return coincideNivel && coincideSeccion && coincideBusqueda;
    });
  }, [telemetria, nivelActivo, seccionActiva, busqueda, docente]);

  // Descarga de Acta Excel
  const handleDescargarExcel = () => {
    exportarAExcel(registrosSeccion, {
      nivel: nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año",
      seccion: `Sección ${seccionActiva}`,
      institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
      docente: docente?.nombreCompleto || "Docente MEP",
      dre: centroActivo?.dreNombre || docente?.dreNombre || "DRE",
    });
  };

  // Descarga de Acta PDF
  const handleDescargarPDF = () => {
    exportarAPDF(registrosSeccion, {
      nivel: nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año",
      seccion: `Sección ${seccionActiva}`,
      institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
      docente: docente?.nombreCompleto || "Docente MEP",
      dre: centroActivo?.dreNombre || docente?.dreNombre || "DRE",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      
      {/* 1. CABECERA DE SALUDO Y ASISTENTE */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-softPastel flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <ChalkboardTeacher size={16} weight="bold" className="text-emerald-700" />
              <span>Panel Docente Simplificado</span>
            </span>
            <span className="text-xs font-bold text-stone-500">
              Ciclo Lectivo 2026 • III Ciclo MEP
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            👋 ¡Hola, Profe {docente?.nombreCompleto?.split(" ")[0] || "Docente"}!
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
            Siga los <strong>3 pasos numerados</strong> a continuación para aplicar la evaluación diagnóstica en su aula y descargar su acta oficial sin complicaciones.
          </p>

          {/* Selector de Centro Educativo */}
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-700">
            <Buildings size={16} weight="bold" className="text-emerald-700 shrink-0" />
            <span className="font-bold">Colegio:</span>
            {centrosDocente.length > 1 ? (
              <select
                value={centroIdx}
                onChange={(e) => setCentroIdx(Number(e.target.value))}
                className="px-3 py-1.5 bg-stone-100 border border-stone-300 rounded-xl font-extrabold text-slate-900 outline-none focus:border-emerald-600"
              >
                {centrosDocente.map((c, i) => (
                  <option key={c.id} value={i}>
                    {c.nombre} ({c.dreNombre})
                  </option>
                ))}
              </select>
            ) : (
              <strong className="text-slate-900">{centroActivo.nombre} ({centroActivo.dreNombre})</strong>
            )}
          </div>
        </div>

        {/* Botón Destacado de Ayuda en 1 Minuto */}
        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2">
          <button
            type="button"
            onClick={() => setModalAyuda(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm rounded-2xl border border-amber-300 shadow-xs transition-all cursor-pointer"
          >
            <Lightbulb size={20} weight="fill" className="text-amber-600" />
            <span>¿Cómo empiezo? (Guía de 1 min)</span>
          </button>

          <Link
            href="/registro"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition-colors text-center"
          >
            <IdentificationCard size={15} weight="bold" />
            <span>Editar mis colegios y secciones</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PASO 1: SELECCIONE SU GRUPO (NIVEL Y SECCIÓN)                             */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-emerald-500/80 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
            1
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              PASO 1: Seleccione el Nivel y la Sección a evaluar hoy
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Elija el año y toque el botón de la sección que tiene en clase.
            </p>
          </div>
        </div>

        {/* Subpaso 1.1: Selector de Nivel */}
        <div className="space-y-3">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            1. Elija el Nivel Educativo:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 7mo */}
            <button
              type="button"
              onClick={() => handleCambiarNivel("7mo")}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                nivelActivo === "7mo"
                  ? "bg-indigo-50 border-indigo-600 shadow-md scale-[1.01]"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                nivelActivo === "7mo" ? "bg-indigo-600 text-white" : "bg-white text-indigo-700 border border-indigo-200"
              }`}>
                <GameController size={24} weight="fill" />
              </div>
              <div>
                <span className="text-xs font-black text-indigo-950 block">7.° Año</span>
                <span className="text-[11px] font-bold text-indigo-800">CyberQuest (Misión)</span>
              </div>
            </button>

            {/* 8vo */}
            <button
              type="button"
              onClick={() => handleCambiarNivel("8vo")}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                nivelActivo === "8vo"
                  ? "bg-teal-50 border-teal-600 shadow-md scale-[1.01]"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                nivelActivo === "8vo" ? "bg-teal-600 text-white" : "bg-white text-teal-700 border border-teal-200"
              }`}>
                <Robot size={24} weight="fill" />
              </div>
              <div>
                <span className="text-xs font-black text-teal-950 block">8.° Año</span>
                <span className="text-[11px] font-bold text-teal-800">Robótica y Algoritmos</span>
              </div>
            </button>

            {/* 9no */}
            <button
              type="button"
              onClick={() => handleCambiarNivel("9no")}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                nivelActivo === "9no"
                  ? "bg-purple-50 border-purple-600 shadow-md scale-[1.01]"
                  : "bg-stone-50 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                nivelActivo === "9no" ? "bg-purple-600 text-white" : "bg-white text-purple-700 border border-purple-200"
              }`}>
                <Cpu size={24} weight="fill" />
              </div>
              <div>
                <span className="text-xs font-black text-purple-950 block">9.° Año</span>
                <span className="text-[11px] font-bold text-purple-800">Aula Inteligente (Domótica)</span>
              </div>
            </button>
          </div>
        </div>

        {/* Subpaso 1.2: Selector de Sección */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            2. Toque su Sección:
          </label>
          <div className="flex flex-wrap gap-2">
            {seccionesDisponibles.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSeccionActiva(sec)}
                className={`px-5 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer border-2 ${
                  seccionActiva === sec
                    ? "bg-slate-900 text-white border-slate-900 shadow-md scale-105 ring-2 ring-emerald-500/40"
                    : "bg-white text-slate-700 border-stone-300 hover:bg-stone-100"
                }`}
              >
                Sección {sec}
              </button>
            ))}
          </div>
          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
            <CheckCircle size={15} weight="fill" className="text-emerald-700" />
            <span>Grupo seleccionado: <strong>Sección {seccionActiva}</strong> ({centroActivo.nombre})</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PASO 2: ¿CÓMO REALIZARÁ LA ACTIVIDAD EN SU AULA?                           */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-teal-500/80 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-6">
        <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
            2
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              PASO 2: ¿Cómo realizará la actividad en su aula hoy?
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Elija la opción según cuente o no con internet en el laboratorio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* OPCIÓN A: EN LÍNEA (CON INTERNET) */}
          <div className="p-6 rounded-3xl bg-emerald-50/50 border-2 border-emerald-300 flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <Globe size={14} weight="bold" />
                  <span>OPCIÓN A: Con Internet</span>
                </span>
                <span className="text-xs font-bold text-emerald-800">En línea</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                Los alumnos responden en sus computadoras
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Copie el enlace y compártalo en la pizarra o chat. Los estudiantes entran, realizan los retos y las notas se guardan solas en este panel.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCopiarEnlace}
                className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {copiado ? (
                  <>
                    <CheckCircle size={18} weight="fill" className="text-amber-300" />
                    <span>¡Enlace de Sección {seccionActiva} Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} weight="bold" />
                    <span>Copiar Enlace para Alumnos ({seccionActiva})</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModalProyectar(true)}
                  className="py-2.5 px-3 bg-white hover:bg-stone-100 text-slate-800 font-extrabold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <QrCode size={16} weight="bold" className="text-emerald-700" />
                  <span>Proyectar QR</span>
                </button>

                <a
                  href={urlEvaluador}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-white hover:bg-stone-100 text-slate-800 font-extrabold text-xs rounded-xl border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 text-center"
                >
                  <ArrowSquareOut size={16} weight="bold" className="text-emerald-700" />
                  <span>Mi Evaluador</span>
                </a>
              </div>
            </div>
          </div>

          {/* OPCIÓN B: SIN INTERNET (OFFLINE / ESCÁNER CELULAR) */}
          <div className="p-6 rounded-3xl bg-amber-50/50 border-2 border-amber-300 flex flex-col justify-between space-y-4 hover:border-amber-500 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <WifiSlash size={14} weight="bold" />
                  <span>OPCIÓN B: Sin Internet</span>
                </span>
                <span className="text-xs font-bold text-amber-800">Desconectado (QR)</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                Use su teléfono móvil como escáner en el aula
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Los alumnos resuelven localmente en la computadora del laboratorio. Al finalizar generan su código QR y usted lo escanea con la cámara de su celular.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <a
                href="/diagnostico_9no_escaner_datos_locales.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-center active:scale-98"
              >
                <DeviceMobileCamera size={20} weight="bold" />
                <span>📱 Abrir Escáner en mi Celular</span>
              </a>

              <a
                href={`/webapps/diagnostico_${nivelActivo === "7mo" ? "7mo" : nivelActivo === "8vo" ? "8vo" : "9no"}_modulo01_desconectado_offline.html`}
                download={`diagnostico_${nivelActivo}_offline.html`}
                className="w-full py-2.5 px-3 bg-white hover:bg-stone-100 text-slate-800 font-extrabold text-xs rounded-xl border border-amber-300 transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <DownloadSimple size={16} weight="bold" className="text-amber-700" />
                <span>Descargar archivo para PCs de alumnos (.html)</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* PASO 3: NÓMINA Y ACTA OFICIAL (SECCIÓN SELECCIONADA)                      */}
      {/* ========================================================================= */}
      <div className="bg-white border-2 border-indigo-500/80 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-700 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
              3
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                PASO 3: Resultados y Acta Oficial de la Sección {seccionActiva}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {registrosSeccion.length} estudiantes registrados en esta sección.
              </p>
            </div>
          </div>

          {/* Botones Grandes de Descarga Oficial */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDescargarExcel}
              disabled={registrosSeccion.length === 0}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
                registrosSeccion.length > 0
                  ? "bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <FileXls size={18} weight="bold" />
              <span>Descargar Acta en Excel</span>
            </button>

            <button
              type="button"
              onClick={handleDescargarPDF}
              disabled={registrosSeccion.length === 0}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs ${
                registrosSeccion.length > 0
                  ? "bg-indigo-700 hover:bg-indigo-800 text-white cursor-pointer"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              <FilePdf size={18} weight="bold" />
              <span>Descargar Reporte en PDF</span>
            </button>
          </div>
        </div>

        {/* Buscador Rápido de Alumno */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <MagnifyingGlass size={16} />
          </div>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar estudiante por nombre o cédula en esta sección..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Tabla Limpia y Espaciosa de Estudiantes */}
        {registrosSeccion.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Estudiante</th>
                  <th className="py-3 px-4">Cédula</th>
                  <th className="py-3 px-4">Fecha y Hora (CR)</th>
                  <th className="py-3 px-4 text-center">Nivel de Logro</th>
                  <th className="py-3 px-4 text-center">Puntaje</th>
                  <th className="py-3 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white font-medium">
                {registrosSeccion.map((r, i) => {
                  const puntaje = typeof r.porcentaje === "number" ? r.porcentaje : (r.puntaje || 0);
                  const esLogrado = puntaje >= 80;
                  const esEnDesarrollo = puntaje >= 60 && puntaje < 80;

                  return (
                    <tr key={(r as any).id || i} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">{i + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {r.estudianteNombre || (r as any).nombreEstudiante || "Estudiante"}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600 text-[11px]">
                        {r.estudianteCedula || (r as any).cedula || "No indicada"}
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                        {r.fechaHoraRegistro || r.fechaIngreso || (r.timestamp ? new Date(r.timestamp).toLocaleString("es-CR") : "Reciente")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {esLogrado ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] border border-emerald-200">
                            [L] Logrado
                          </span>
                        ) : esEnDesarrollo ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 font-extrabold text-[10px] border border-amber-200">
                            [ED] En Desarrollo
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-extrabold text-[10px] border border-rose-200">
                            [RA] Acompañamiento
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        {puntaje}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const estNom = r.estudianteNombre || (r as any).nombreEstudiante || "este estudiante";
                            if (window.confirm(`¿Desea eliminar la evaluación de ${estNom}?`)) {
                              eliminarResultado(r.estudianteNombre || r.timestamp || (r as any).id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-50/70 border border-stone-200 rounded-2xl space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
              <ChalkboardTeacher size={20} />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800">
              Aún no hay evaluaciones registradas en la Sección {seccionActiva}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Comparta el enlace del <strong>Paso 2</strong> o use el escáner móvil para comenzar a recibir las notas de sus alumnos.
            </p>
          </div>
        )}

        {/* Opcional Desplegable: Análisis Pedagógico, Semáforos y DUA */}
        <div className="pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setMostrarAnalisisAvanzado(!mostrarAnalisisAvanzado)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-slate-800 font-extrabold text-xs border border-stone-200 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkle size={18} weight="fill" className="text-indigo-600" />
              <span>Ver análisis pedagógico detallado, gráficas y apoyos DUA con IA (Opcional)</span>
            </div>
            {mostrarAnalisisAvanzado ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </button>

          {mostrarAnalisisAvanzado && (
            <div className="pt-4 space-y-6 animate-fadeIn">
              <SemaforoLogro registros={registrosSeccion} nivel={nivelActivo} configuracion={CONFIGURACION_DEFAULT} />
              <GraficasSecciones registros={registrosSeccion} configuracion={CONFIGURACION_DEFAULT} nivel={nivelActivo} />
              <RecomendacionesDUA registros={registrosSeccion} nivel={nivelActivo} configuracion={CONFIGURACION_DEFAULT} />
            </div>
          )}
        </div>

      </div>

      {/* MODAL DE PROYECCIÓN DE ENLACE Y QR EN PIZARRA */}
      {modalProyectar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 text-center space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              Proyectar en la Pizarra • Sección {seccionActiva}
            </h3>
            <p className="text-xs text-slate-600">
              Pida a sus estudiantes que abran el enlace o escaneen con sus dispositivos:
            </p>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl font-mono text-xs font-bold text-slate-900 break-all select-all">
              {urlEstudiante}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopiarEnlace}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl"
              >
                {copiado ? "¡Copiado!" : "Copiar Enlace"}
              </button>
              <button
                type="button"
                onClick={() => setModalProyectar(false)}
                className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-slate-800 font-extrabold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Guía Rápida de 1 Minuto */}
      <ModalGuiaRapidaDocente
        abierto={modalAyuda}
        onCerrar={() => setModalAyuda(false)}
      />

    </div>
  );
}
