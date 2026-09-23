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

  // Generador de Enlace Blindado por Nivel y Centro Educativo
  const [nivelesCentros, setNivelesCentros] = useState<Record<string, "7mo" | "8vo" | "9no">>({});
  const [copiadoCentro, setCopiadoCentro] = useState<Record<string, boolean>>({});

  // Lista de centros educativos registrados del docente
  const listaCentrosDocente = useMemo(() => {
    if (docente?.centrosEducativos && docente.centrosEducativos.length > 0) {
      return docente.centrosEducativos;
    }
    return [
      {
        id: "centro-principal",
        nombre: docente?.institucionNombre || "Centro Educativo MEP",
        dreCodigo: docente?.dreCodigo || "DRE-01",
        dreNombre: docente?.dreNombre || "Dirección Regional",
        circuito: docente?.circuito || "Circuito 01",
        desgloseNiveles: [],
      },
    ];
  }, [docente]);

  const getNivelCentro = (centroId: string): "7mo" | "8vo" | "9no" => {
    return nivelesCentros[centroId] || "9no";
  };

  const setNivelCentro = (centroId: string, nivel: "7mo" | "8vo" | "9no") => {
    setNivelesCentros((prev) => ({ ...prev, [centroId]: nivel }));
  };

  const generarUrlParaEstudiante = (
    centro: { nombre: string; dreCodigo: string; dreNombre: string; circuito?: string },
    nivel: "7mo" | "8vo" | "9no"
  ): string => {
    const payload = {
      docId: docente?.idDocente || "DOC-MEP-2026",
      doc: docente?.nombreCompleto || "Docente Evaluador",
      inst: centro.nombre || "Centro Educativo MEP",
      dre: centro.dreCodigo || centro.dreNombre || "DRE-01",
      nivel: nivel === "7mo" ? 7 : nivel === "8vo" ? 8 : 9,
      ts: Date.now(),
    };

    let tokenB64 = "";
    try {
      tokenB64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch {
      tokenB64 = "token_mep_diagnostico";
    }

    const archivoWebapp =
      nivel === "7mo"
        ? "diagnostico_7mo_modulo01_cyberquest.html"
        : nivel === "8vo"
        ? "diagnostico_8vo_modulo01_en_linea.html"
        : "diagnostico_9no_modulo01_en_linea.html";

    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://diagnosticosecundaria.vercel.app";
    return `${origin}/webapps/${archivoWebapp}?token=${tokenB64}&docenteId=${encodeURIComponent(
      docente?.idDocente || ""
    )}&docente=${encodeURIComponent(docente?.nombreCompleto || "")}&institucion=${encodeURIComponent(
      centro.nombre
    )}&dre=${encodeURIComponent(centro.dreCodigo || centro.dreNombre || "")}`;
  };

  const copiarEnlaceCentro = (centroId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiadoCentro((prev) => ({ ...prev, [centroId]: true }));
    setTimeout(() => {
      setCopiadoCentro((prev) => ({ ...prev, [centroId]: false }));
    }, 2500);
  };

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
        !filtroSoloMios ||
        (docente &&
          (r.docenteId === docente.idDocente ||
            r.docenteId === docente.cedula ||
            r.docenteId === "ASESOR-FT-7729" ||
            r.docenteId === "5-0305-0179" ||
            r.docenteId === "DOC-MEP-7MO" ||
            r.docenteId === "DOC-MEP-AUTONOMO"));

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

        {/* 1. GENERADOR DE ENLACES BLINDADOS POR NIVEL (REPLICADO POR CADA CENTRO EDUCATIVO REGISTRADO) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
                <LinkSimple size={20} weight="bold" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Generador de Enlaces Únicos por Nivel para Laboratorio
                </h3>
                <p className="text-xs text-slate-500">
                  Un único enlace oficial por nivel (sin selector de sección manual). Cada institución registrada genera su propia URL blindada con telemetría integrada.
                </p>
              </div>
            </div>
            {listaCentrosDocente.length > 1 && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black">
                {listaCentrosDocente.length} Centros Educativos Registrados
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {listaCentrosDocente.map((centro, cIdx) => {
              const centroId = centro.id || `centro-${cIdx}`;
              const nivelSeleccionado = getNivelCentro(centroId);
              const urlGenerada = generarUrlParaEstudiante(centro, nivelSeleccionado);
              const estaCopiado = !!copiadoCentro[centroId];

              return (
                <div
                  key={centroId}
                  className="bg-white border-2 border-emerald-400 rounded-3xl p-6 sm:p-7 shadow-softPastel space-y-5"
                >
                  {/* Cabecera del Centro Educativo */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm shadow-xs">
                        {cIdx + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-slate-900 text-base sm:text-lg">
                            {centro.nombre || "Centro Educativo MEP"}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold">
                            {centro.dreCodigo || centro.dreNombre || "DRE"}
                          </span>
                          {centro.circuito && (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-300 text-[10px] font-bold">
                              {centro.circuito}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Enlace inmutable con credenciales y telemetría vinculada a esta institución.
                        </p>
                      </div>
                    </div>

                    {/* Selector de Nivel para este Centro */}
                    <div className="flex items-center gap-1.5 self-start lg:self-auto bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setNivelCentro(centroId, "7mo")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          nivelSeleccionado === "7mo"
                            ? "bg-indigo-700 text-white shadow-xs"
                            : "text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        7.° Año
                      </button>
                      <button
                        type="button"
                        onClick={() => setNivelCentro(centroId, "8vo")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          nivelSeleccionado === "8vo"
                            ? "bg-teal-700 text-white shadow-xs"
                            : "text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        8.° Año
                      </button>
                      <button
                        type="button"
                        onClick={() => setNivelCentro(centroId, "9no")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          nivelSeleccionado === "9no"
                            ? "bg-emerald-700 text-white shadow-xs"
                            : "text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        9.° Año
                      </button>
                    </div>
                  </div>

                  {/* Input con URL y Botones de Acción */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-end">
                    
                    {/* Campo de URL */}
                    <div className="lg:col-span-8">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>
                          Enlace Oficial •{" "}
                          {nivelSeleccionado === "7mo"
                            ? "7.° Año (CyberQuest)"
                            : nivelSeleccionado === "8vo"
                            ? "8.° Año (PNFT)"
                            : "9.° Año (Aula Inteligente)"}
                          :
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold lowercase">
                          1 único link para todas las secciones de este nivel
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={urlGenerada}
                          className="w-full pl-3.5 pr-4 py-2.5 bg-stone-100 border border-stone-300 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                    </div>

                    {/* Botón Copiar Enlace */}
                    <div className="lg:col-span-3">
                      <button
                        type="button"
                        onClick={() => copiarEnlaceCentro(centroId, urlGenerada)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer ${
                          estaCopiado
                            ? "bg-emerald-800 text-white"
                            : "bg-emerald-700 hover:bg-emerald-800 text-white"
                        }`}
                      >
                        {estaCopiado ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                        <span>{estaCopiado ? "¡Enlace Copiado!" : "Copiar Enlace para Lab"}</span>
                      </button>
                    </div>

                    {/* Botón Probar Enlace Estudiante */}
                    <div className="lg:col-span-1">
                      <a
                        href={urlGenerada}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-all shadow-xs cursor-pointer"
                        title="Probar enlace de estudiante en nueva pestaña"
                      >
                        <ArrowSquareOut size={18} weight="bold" />
                      </a>
                    </div>

                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-[11.5px] text-emerald-950 leading-relaxed font-medium flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-emerald-700 shrink-0" weight="fill" />
                    <span>
                      <strong>Uso en Laboratorio:</strong> Proyecte o entregue este enlace a sus grupos de {nivelSeleccionado === "7mo" ? "7.°" : nivelSeleccionado === "8vo" ? "8.°" : "9.°"} Año en {centro.nombre || "la institución"}. Al abrir la herramienta, los estudiantes de cualquier sección ingresan y sus respuestas se consolidan de inmediato en este dashboard.
                    </span>
                  </div>
                </div>
              );
            })}
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
              href={`/webapps/diagnostico_7mo_modulo01_docente_evaluador.html?docenteId=${encodeURIComponent(
                docente?.idDocente || docente?.cedula || ""
              )}&docente=${encodeURIComponent(docente?.nombreCompleto || "")}&institucion=${encodeURIComponent(
                docente?.institucionNombre || ""
              )}&dre=${encodeURIComponent(docente?.dreCodigo || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
              title="Abrir evaluador de 7mo con perfil docente activo"
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
              href={`/webapps/diagnostico_8vo_modulo01_docente_evaluador.html?docenteId=${encodeURIComponent(
                docente?.idDocente || docente?.cedula || ""
              )}&docente=${encodeURIComponent(docente?.nombreCompleto || "")}&institucion=${encodeURIComponent(
                docente?.institucionNombre || ""
              )}&dre=${encodeURIComponent(docente?.dreCodigo || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
              title="Abrir evaluador de 8vo con perfil docente activo"
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
              href={`/webapps/diagnostico_9no_modulo01_docente_evaluador.html?docenteId=${encodeURIComponent(
                docente?.idDocente || docente?.cedula || ""
              )}&docente=${encodeURIComponent(docente?.nombreCompleto || "")}&institucion=${encodeURIComponent(
                docente?.institucionNombre || ""
              )}&dre=${encodeURIComponent(docente?.dreCodigo || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shrink-0 transition-all shadow-xs"
              title="Abrir evaluador de 9no con perfil docente activo"
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
