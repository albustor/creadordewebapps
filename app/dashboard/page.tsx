"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { SafeStorage } from "@/lib/firebase";
import SemaforoLogro from "@/components/SemaforoLogro";
import GraficasSecciones from "@/components/GraficasSecciones";
import RecomendacionesDUA from "@/components/RecomendacionesDUA";
import {
  ConfiguracionDashboardDocente,
  CONFIGURACION_DEFAULT,
} from "@/components/ConfiguradorInstrumentoDashboard";
import { exportarAExcel, exportarAPDF } from "@/lib/exportUtils";
import { PayloadTelemetria } from "@/lib/antiFraude";
import AuthGuard from "@/components/AuthGuard";
import {
  ChartBar,
  FileXls,
  FilePdf,
  UploadSimple,
  MagnifyingGlass,
  Trash,
  CheckCircle,
  WarningCircle,
  Clock,
  User,
  ShieldCheck,
  NotePencil,
  Broom,
  ArrowsClockwise,
  Check,
  X,
  Lightning,
  LinkSimple,
  Copy,
  ArrowSquareOut,
  FolderOpen,
  UserCheck,
  GameController,
  Cpu,
  GraduationCap,
  Sparkle,
} from "@phosphor-icons/react";

export default function DashboardAnaliticoPage() {
  const {
    docente,
    telemetria,
    actualizarResultadoTelemetria,
    eliminarResultado,
    limpiarTelemetria,
    restablecerDatosDemostracion,
  } = useDocente();

  // Filtros de telemetría
  const [filtroNivelTab, setFiltroNivelTab] = useState<"todos" | "7mo" | "8vo" | "9no">("todos");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroNivelLogro, setFiltroNivelLogro] = useState("Todos");
  const [filtroSoloMios, setFiltroSoloMios] = useState(false);

  // Generador de Enlace Blindado
  const [nivelGen, setNivelGen] = useState<"7mo" | "8vo" | "9no">("9no");
  const [seccionGen, setSeccionGen] = useState("9-1");
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);

  // Modal Edición de Registro
  const [registroEditando, setRegistroEditando] = useState<PayloadTelemetria | null>(null);
  const [editNombre, setEditNombre] = useState("");
  const [editGrupo, setEditGrupo] = useState("");
  const [editPuntaje, setEditPuntaje] = useState<number>(100);

  // Configuración del Instrumento Docente
  const [configuracion, setConfiguracion] = useState<ConfiguracionDashboardDocente>(CONFIGURACION_DEFAULT);

  useEffect(() => {
    const saved = SafeStorage.getItem("configuracion_dashboard_docente");
    if (saved) {
      try {
        setConfiguracion(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Generar Token Encriptado y URL Blindada para el Estudiante (Sin QR)
  const enlaceGeneradoParaEstudiante = useMemo(() => {
    const payload = {
      docId: docente?.idDocente || "DOC-MEP-2026",
      doc: docente?.nombreCompleto || "Alberto Bustos Ortega",
      inst: docente?.institucionNombre || "Centro Educativo MEP",
      dre: docente?.dreCodigo || "DRE-01",
      nivel: nivelGen === "7mo" ? 7 : nivelGen === "8vo" ? 8 : 9,
      sec: seccionGen,
      ts: Date.now(),
    };

    let tokenB64 = "";
    try {
      tokenB64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch {
      tokenB64 = "token_mep_diagnostico";
    }

    const archivoWebapp =
      nivelGen === "7mo"
        ? "diagnostico_7mo_modulo01_cyberquest.html"
        : nivelGen === "8vo"
        ? "diagnostico_8vo_modulo01_en_linea.html"
        : "diagnostico_9no_modulo01_en_linea.html";

    const origin = typeof window !== "undefined" ? window.location.origin : "https://diagnosticosecundaria.vercel.app";
    return `${origin}/webapps/${archivoWebapp}?token=${tokenB64}&sec=${encodeURIComponent(seccionGen)}`;
  }, [docente, nivelGen, seccionGen]);

  const copiarEnlaceGenerado = () => {
    navigator.clipboard.writeText(enlaceGeneradoParaEstudiante);
    setEnlaceCopiado(true);
    setTimeout(() => setEnlaceCopiado(false), 2500);
  };

  // Lista completa de secciones estándar por nivel
  const gruposDisponibles = useMemo(() => {
    const seccionesSet = new Set<string>();

    for (let i = 1; i <= 15; i++) {
      seccionesSet.add(`Sección 7-${i}`);
      seccionesSet.add(`Sección 8-${i}`);
      seccionesSet.add(`Sección 9-${i}`);
    }

    telemetria.forEach((t) => {
      if (t.seccionOGrupo && t.seccionOGrupo.trim()) {
        seccionesSet.add(t.seccionOGrupo.trim());
      }
    });

    return Array.from(seccionesSet).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [telemetria]);

  // Nivel de logro dinámico según umbrales oficiales
  const obtenerNivelDinamico = (puntaje: number): string => {
    if (puntaje >= configuracion.umbralAvanzadoMin) {
      return "Consolidado";
    }
    if (puntaje <= configuracion.umbralInicialMax) {
      return "Requiere Acompañamiento";
    }
    return "En Desarrollo";
  };

  // Filtrado reactivo de telemetría
  const telemetriaFiltrada = useMemo(() => {
    const nombreDocenteLimpio = docente?.nombreCompleto?.toLowerCase()?.trim() || "";
    const correoDocenteLimpio = docente?.correoInstitucional?.toLowerCase()?.trim() || "";

    return telemetria.filter((r) => {
      const estNom = r.estudianteNombre?.toLowerCase()?.trim() || "";
      const estCor = r.estudianteCorreo?.toLowerCase()?.trim() || "";
      if (nombreDocenteLimpio && (estNom === nombreDocenteLimpio || estNom.includes(nombreDocenteLimpio))) {
        return false;
      }
      if (correoDocenteLimpio && estCor === correoDocenteLimpio) {
        return false;
      }

      // Filtro por Nivel Tab
      if (filtroNivelTab === "7mo") {
        const es7mo = (r.seccionOGrupo && r.seccionOGrupo.includes("7-")) || r.webAppTitulo?.includes("7");
        if (!es7mo) return false;
      } else if (filtroNivelTab === "8vo") {
        const es8vo = (r.seccionOGrupo && r.seccionOGrupo.includes("8-")) || r.webAppTitulo?.includes("8");
        if (!es8vo) return false;
      } else if (filtroNivelTab === "9no") {
        const es9no = (r.seccionOGrupo && r.seccionOGrupo.includes("9-")) || r.webAppTitulo?.includes("9");
        if (!es9no) return false;
      }

      const coincideTexto =
        r.estudianteNombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        r.webAppTitulo.toLowerCase().includes(filtroTexto.toLowerCase());
      
      const coincideGrupo =
        filtroGrupo === "Todos" ||
        r.seccionOGrupo === filtroGrupo ||
        r.seccionOGrupo.replace("Sección ", "") === filtroGrupo.replace("Sección ", "");
      
      const nivelDinamico = obtenerNivelDinamico(r.porcentaje ?? r.puntaje);
      const coincideNivel =
        filtroNivelLogro === "Todos" ||
        nivelDinamico.toLowerCase().includes(filtroNivelLogro.toLowerCase()) ||
        r.nivelLogro.toLowerCase().includes(filtroNivelLogro.toLowerCase());

      const coincideDocente =
        !filtroSoloMios || (docente?.idDocente && (r.docenteId === docente.idDocente || r.docenteId === "DOC-DRE01-7729"));

      return coincideTexto && coincideGrupo && coincideNivel && coincideDocente;
    });
  }, [telemetria, filtroNivelTab, filtroTexto, filtroGrupo, filtroNivelLogro, filtroSoloMios, docente, configuracion]);

  const abrirEditar = (item: PayloadTelemetria) => {
    setRegistroEditando(item);
    setEditNombre(item.estudianteNombre);
    setEditGrupo(item.seccionOGrupo || "Sección 9-1");
    setEditPuntaje(item.porcentaje ?? item.puntaje ?? 100);
  };

  const guardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registroEditando) return;

    const nuevoPorcentaje = Math.min(100, Math.max(0, editPuntaje));
    const nivelBase: "Avanzado" | "Inicial" | "Intermedio" =
      nuevoPorcentaje >= configuracion.umbralAvanzadoMin
        ? "Avanzado"
        : nuevoPorcentaje <= configuracion.umbralInicialMax
        ? "Inicial"
        : "Intermedio";

    actualizarResultadoTelemetria(registroEditando.timestamp, {
      estudianteNombre: editNombre.trim(),
      seccionOGrupo: editGrupo.trim(),
      puntaje: nuevoPorcentaje,
      porcentaje: nuevoPorcentaje,
      nivelLogro: nivelBase,
    });
    setRegistroEditando(null);
  };

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Cabecera Principal del Dashboard Docente */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
                Panel Central del Docente Evaluador
              </span>
              <span className="text-xs font-bold text-stone-500">
                MEP • Diagnóstico Secundaria
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Dashboard Analítico y Telemetría
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Consolidación en tiempo real de los resultados de <strong>7.°, 8.° y 9.° Año</strong>, control de asistencia por sección y exportación oficial de actas a Excel y PDF.
            </p>
          </div>

          {/* Botones de Exportación */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => exportarAExcel(telemetriaFiltrada)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-xs"
              title="Descargar Acta Oficial en Excel"
            >
              <FileXls size={18} weight="bold" />
              <span>Exportar Excel</span>
            </button>

            <button
              onClick={() => exportarAPDF(telemetriaFiltrada)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl transition-all shadow-xs"
              title="Descargar Informe Institucional en PDF"
            >
              <FilePdf size={18} weight="bold" />
              <span>Informe PDF</span>
            </button>
          </div>
        </div>

        {/* 1. GENERADOR DE ENLACE BLINDADO E INMUTABLE POR NIVEL Y SECCIÓN (SIN QR) */}
        <div className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0 shadow-xs">
                <LinkSimple size={24} weight="bold" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                  <span>Generador de Enlace Único por Sección (Blindado con Token)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    100% Computadoras
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  El enlace es permanente y contiene las credenciales seguras del docente para evitar cruce de datos.
                </p>
              </div>
            </div>

            {/* Selector de Nivel para el Enlace */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setNivelGen("7mo");
                  setSeccionGen("7-1");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  nivelGen === "7mo"
                    ? "bg-indigo-700 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                7.° Año
              </button>
              <button
                type="button"
                onClick={() => {
                  setNivelGen("8vo");
                  setSeccionGen("8-1");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  nivelGen === "8vo"
                    ? "bg-teal-700 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                8.° Año
              </button>
              <button
                type="button"
                onClick={() => {
                  setNivelGen("9no");
                  setSeccionGen("9-1");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  nivelGen === "9no"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                9.° Año
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Selector de Sección */}
            <div>
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                Sección / Grupo:
              </label>
              <select
                value={seccionGen}
                onChange={(e) => setSeccionGen(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-600"
              >
                {Array.from({ length: 15 }, (_, i) => {
                  const pref = nivelGen === "7mo" ? "7" : nivelGen === "8vo" ? "8" : "9";
                  return `${pref}-${i + 1}`;
                }).map((sec) => (
                  <option key={sec} value={sec}>
                    Sección {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Vista Previa del Enlace Encriptado */}
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                Enlace Oficial Blindado:
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={enlaceGeneradoParaEstudiante}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-stone-100 border border-stone-300 rounded-xl text-xs font-mono text-slate-600 truncate focus:outline-none"
                />
              </div>
            </div>

            {/* Botón de Copiar Enlace */}
            <div>
              <button
                type="button"
                onClick={copiarEnlaceGenerado}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs ${
                  enlaceCopiado
                    ? "bg-emerald-800 text-white"
                    : "bg-emerald-700 hover:bg-emerald-800 text-white"
                }`}
              >
                {enlaceCopiado ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                <span>{enlaceCopiado ? "¡Enlace Copiado!" : "Copiar Enlace para Lab"}</span>
              </button>
            </div>

          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-[11.5px] text-emerald-950 leading-relaxed font-medium flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-emerald-700 shrink-0" weight="fill" />
            <span>
              <strong>Regla de Intento Único y Rezagados:</strong> Cada estudiante realiza la prueba una sola vez. Si un estudiante falta a la clase de informática, el docente le entrega este mismo enlace en su siguiente lección; el estudiante ingresa de forma limpia y se anexa automáticamente al grupo sin sobreescribir nada.
            </span>
          </div>
        </div>

        {/* 2. ACCESO DIRECTO A LAS HERRAMIENTAS DE EVALUACIÓN DIAGNÓSTICA (DOCENTE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 bg-indigo-50/80 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-900 uppercase">Herramienta 7.° Año</span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">CyberQuest 7° (Docente)</h4>
            </div>
            <a
              href="/webapps/diagnostico_7mo_modulo01_docente_evaluador.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
              title="Abrir evaluador de 7mo"
            >
              <ArrowSquareOut size={16} weight="bold" />
            </a>
          </div>

          <div className="p-5 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-teal-900 uppercase">Herramienta 8.° Año</span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Módulo Evaluador 8° PNFT</h4>
            </div>
            <a
              href="/webapps/diagnostico_8vo_modulo01_docente_evaluador.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
              title="Abrir evaluador de 8vo"
            >
              <ArrowSquareOut size={16} weight="bold" />
            </a>
          </div>

          <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-900 uppercase">Herramienta 9.° Año</span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">Aula Inteligente (Docente)</h4>
            </div>
            <a
              href="/webapps/diagnostico_9no_modulo01_docente_evaluador.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
              title="Abrir evaluador de 9no"
            >
              <ArrowSquareOut size={16} weight="bold" />
            </a>
          </div>

        </div>

        {/* 3. TABLA DE REGISTROS DE TELEMETRÍA CON PESTAÑAS POR NIVEL */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-softPastel p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-black text-lg text-slate-900">
                  Registros Consolidados de Telemetría ({telemetriaFiltrada.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Seguimiento de entregas en vivo categorizadas por sección y nivel
              </p>
            </div>

            {/* Pestañas de Nivel para Filtrar la Tabla */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setFiltroNivelTab("todos")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtroNivelTab === "todos"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-stone-600 hover:text-slate-900"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFiltroNivelTab("7mo")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtroNivelTab === "7mo"
                    ? "bg-indigo-700 text-white shadow-xs"
                    : "text-stone-600 hover:text-slate-900"
                }`}
              >
                7.° Año
              </button>
              <button
                type="button"
                onClick={() => setFiltroNivelTab("8vo")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtroNivelTab === "8vo"
                    ? "bg-teal-700 text-white shadow-xs"
                    : "text-stone-600 hover:text-slate-900"
                }`}
              >
                8.° Año
              </button>
              <button
                type="button"
                onClick={() => setFiltroNivelTab("9no")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtroNivelTab === "9no"
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-stone-600 hover:text-slate-900"
                }`}
              >
                9.° Año
              </button>
            </div>
          </div>

          {/* Buscador y Filtros Secundarios */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar estudiante o título..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            <select
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="Todos">Todas las secciones</option>
              {gruposDisponibles.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={filtroNivelLogro}
              onChange={(e) => setFiltroNivelLogro(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="Todos">Todos los niveles de logro</option>
              <option value="Consolidado">🟢 Consolidado (&ge;{configuracion.umbralAvanzadoMin}%)</option>
              <option value="En Desarrollo">🟡 En desarrollo</option>
              <option value="Acompañamiento">🔴 Requiere acompañamiento</option>
            </select>

            <button
              onClick={() => {
                if (confirm("⚠️ ¿Deseas vaciar la telemetría para iniciar de cero con tus grupos reales?")) {
                  limpiarTelemetria();
                }
              }}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Vaciar telemetría"
            >
              <Trash size={15} weight="bold" />
              <span>Vaciar</span>
            </button>
          </div>

          {/* Tabla de Registros */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Estudiante</th>
                  <th className="p-3">Sección</th>
                  <th className="p-3">Diagnóstico / Nivel</th>
                  <th className="p-3 text-center">Porcentaje</th>
                  <th className="p-3 text-center">Nivel de Logro</th>
                  <th className="p-3 text-right">Fecha / Hora</th>
                  <th className="p-3 text-center rounded-r-xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {telemetriaFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No hay registros para los filtros seleccionados. Los envíos de los estudiantes aparecerán aquí automáticamente.
                    </td>
                  </tr>
                ) : (
                  telemetriaFiltrada.map((item, idx) => {
                    const puntajeFinal = item.porcentaje ?? item.puntaje ?? 0;
                    const logroDinamico = obtenerNivelDinamico(puntajeFinal);
                    return (
                      <tr key={item.timestamp || idx} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <User size={16} className="text-stone-400" />
                          <span>{item.estudianteNombre}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-700">
                          {item.seccionOGrupo || "General"}
                        </td>
                        <td className="p-3 text-slate-600 truncate max-w-xs">
                          {item.webAppTitulo}
                        </td>
                        <td className="p-3 text-center font-black text-slate-900">
                          {puntajeFinal}%
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              logroDinamico === "Consolidado"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : logroDinamico === "En Desarrollo"
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-rose-100 text-rose-900 border border-rose-300"
                            }`}
                          >
                            {logroDinamico}
                          </span>
                        </td>
                        <td className="p-3 text-right text-stone-400 text-[11px] font-mono">
                          {new Date(item.timestamp).toLocaleString("es-CR")}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => abrirEditar(item)}
                              className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Editar registro"
                            >
                              <NotePencil size={15} weight="bold" />
                            </button>
                            <button
                              onClick={() => eliminarResultado(item.timestamp)}
                              className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash size={15} weight="bold" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* 4. GRÁFICAS DE SECCIONES Y SEMÁFORO DE LOGRO INSTITUCIONAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SemaforoLogro
            registros={telemetriaFiltrada}
            configuracion={configuracion}
            nivel={filtroNivelTab}
          />
          <GraficasSecciones
            registros={telemetriaFiltrada}
            configuracion={configuracion}
            nivel={filtroNivelTab}
          />
        </div>

        {/* 5. RECOMENDACIONES PEDAGÓGICAS DUA */}
        <RecomendacionesDUA
          registros={telemetriaFiltrada}
          configuracion={configuracion}
          nivel={filtroNivelTab}
        />

        {/* MODAL EDITAR REGISTRO */}
        {registroEditando && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-black text-slate-900 text-sm">Editar Registro de Estudiante</h3>
                <button
                  onClick={() => setRegistroEditando(null)}
                  className="text-stone-400 hover:text-slate-700 font-bold text-xs"
                >
                  ✕ Cerrar
                </button>
              </div>

              <form onSubmit={guardarEdicion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sección:</label>
                  <input
                    type="text"
                    value={editGrupo}
                    onChange={(e) => setEditGrupo(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Porcentaje Obtenido (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editPuntaje}
                    onChange={(e) => setEditPuntaje(Number(e.target.value))}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegistroEditando(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AuthGuard>
  );
}
