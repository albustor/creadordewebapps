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
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  ChartBar,
  FileXls,
  FilePdf,
  MagnifyingGlass,
  Trash,
  CheckCircle,
  User,
  ShieldCheck,
  NotePencil,
  ArrowSquareOut,
  GraduationCap,
  Sparkle,
  Cpu,
  GameController,
  Lightbulb,
  Buildings,
  IdentificationCard,
  ChalkboardTeacher,
  Gauge,
  Desktop,
} from "@phosphor-icons/react";

export default function DashboardAnaliticoPage() {
  const {
    docente,
    telemetria,
    actualizarResultadoTelemetria,
    eliminarResultado,
    limpiarTelemetria,
  } = useDocente();

  // Nivel activo seleccionado por pestañas (7mo, 8vo, 9no)
  const [nivelActivo, setNivelActivo] = useState<"7mo" | "8vo" | "9no">("7mo");

  // Pestaña activa del bloque analítico inferior (Semáforo, Analítica por Secciones, Recomendaciones IA)
  const [pestanaAnalitica, setPestanaAnalitica] = useState<"semaforo" | "analitica" | "recomendaciones">("semaforo");

  // Centro educativo activo seleccionado para el docente (en caso de tener varios)
  const [centroActivoIdx, setCentroActivoIdx] = useState<number>(0);

  // Filtros de búsqueda secundarios dentro del nivel
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroInstitucion, setFiltroInstitucion] = useState("Todas");
  const [filtroNivelLogro, setFiltroNivelLogro] = useState("Todos");

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

  // Lista normalizada de centros educativos registrados del docente para el nivel activo
  const listaCentrosDocente = useMemo(() => {
    const nivelKey = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
    if (docente?.centrosEducativos && Array.isArray(docente.centrosEducativos) && docente.centrosEducativos.length > 0) {
      // Filtrar únicamente los colegios que tengan activo el nivel seleccionado y que tengan secciones atendidas
      const centrosConNivel = docente.centrosEducativos.filter((c) => {
        if (!c) return false;
        if (c.desgloseNiveles && Array.isArray(c.desgloseNiveles) && c.desgloseNiveles.length > 0) {
          const dn = c.desgloseNiveles.find((d) => d && typeof d.nivel === "string" && d.nivel.includes(nivelKey));
          return Boolean(dn && dn.activo === true && Array.isArray(dn.seccionesAtendidasDocente) && dn.seccionesAtendidasDocente.length > 0);
        }
        if ((c as any).niveles) {
          if (Array.isArray((c as any).niveles)) return (c as any).niveles.some((n: any) => typeof n === "string" && n.includes(nivelKey));
          if (typeof (c as any).niveles === "object") return Boolean((c as any).niveles[nivelKey]);
        }
        return false;
      });

      return centrosConNivel.map((c, idx) => {
        const dn = c.desgloseNiveles?.find((d) => d && typeof d.nivel === "string" && d.nivel.includes(nivelKey));
        let seccionesDoc: string[] = [];
        if (dn?.seccionesAtendidasDocente && Array.isArray(dn.seccionesAtendidasDocente) && dn.seccionesAtendidasDocente.length > 0) {
          seccionesDoc = dn.seccionesAtendidasDocente.filter(Boolean);
        } else if ((c as any).secciones && (c as any).secciones[nivelKey]?.selected && Array.isArray((c as any).secciones[nivelKey].selected)) {
          seccionesDoc = (c as any).secciones[nivelKey].selected.filter(Boolean);
        } else if (Array.isArray((c as any).seccionesAtendidas) && (c as any).seccionesAtendidas.length > 0) {
          seccionesDoc = (c as any).seccionesAtendidas.filter((s: string) => typeof s === "string" && s.includes(nivelKey));
        }

        if (seccionesDoc.length === 0) {
          seccionesDoc = [`${nivelKey}-1`];
        }

        const nomFinal = c.nombre || (c as any).colegio || `Institución ${idx + 1}`;
        return {
          id: c.id || `centro-${idx}`,
          nombre: nomFinal,
          dreCodigo: c.dreCodigo || "DRE-01",
          dreNombre: c.dreNombre || "San José Central",
          circuito: c.circuito || "Circuito 01",
          seccionesAtendidas: seccionesDoc,
        };
      });
    }
    if (docente?.institucionNombre) {
      if (docente.institucionNombre.includes("/")) {
        const parts = docente.institucionNombre.split("/").map((p) => p.trim()).filter(Boolean);
        return parts.map((p, idx) => ({
          id: `centro-${idx}`,
          nombre: p,
          dreCodigo: idx === 0 ? (docente.dreCodigo || "DRE-01") : "DRE-17",
          dreNombre: idx === 0 ? (docente.dreNombre || "San José Central") : "Grande de Térraba",
          circuito: docente.circuito || "Circuito 01",
          seccionesAtendidas: [`${nivelKey}-1`],
        }));
      }
      return [
        {
          id: "centro-principal",
          nombre: docente.institucionNombre,
          dreCodigo: docente.dreCodigo || "DRE-01",
          dreNombre: docente.dreNombre || "San José Central",
          circuito: docente.circuito || "Circuito 01",
          seccionesAtendidas: [`${nivelKey}-1`],
        },
      ];
    }
    return [
      {
        id: "centro-principal",
        nombre: "LICEO MEP",
        dreCodigo: "DRE-01",
        dreNombre: "San José Central",
        circuito: "Circuito 01",
        seccionesAtendidas: [`${nivelKey}-1`],
      },
    ];
  }, [docente, nivelActivo]);

  // Centro educativo actualmente seleccionado asegurando límites válidos
  const centroActivo =
    listaCentrosDocente && listaCentrosDocente.length > 0
      ? (listaCentrosDocente[centroActivoIdx] || listaCentrosDocente[0])
      : {
          id: "centro-default",
          nombre: docente?.institucionNombre || "Centro Educativo MEP",
          dreCodigo: docente?.dreCodigo || "DRE-01",
          dreNombre: docente?.dreNombre || "San José Central",
          circuito: docente?.circuito || "Circuito 01",
          seccionesAtendidas: [`${nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9"}-1`],
        };

  // Ajustar índice de centro si la lista filtrada cambia al cambiar de nivel
  useEffect(() => {
    if (centroActivoIdx >= listaCentrosDocente.length) {
      setCentroActivoIdx(0);
    }
  }, [listaCentrosDocente.length, centroActivoIdx]);

  // Helper para generar URL al evaluador de un colegio específico (blindada y limpia)
  const getUrlEvaluador = (centro?: typeof listaCentrosDocente[0]) => {
    const baseWebapp =
      nivelActivo === "7mo"
        ? "diagnostico_7mo_modulo01_docente_evaluador.html"
        : nivelActivo === "8vo"
        ? "diagnostico_8vo_modulo01_docente_evaluador.html"
        : "diagnostico_9no_modulo01_docente_evaluador.html";

    return `/webapps/${baseWebapp}`;
  };

  // Reiniciar filtro de grupo al cambiar de nivel para evitar secciones huérfanas
  const cambiarNivel = (nuevoNivel: "7mo" | "8vo" | "9no") => {
    setNivelActivo(nuevoNivel);
    setCentroActivoIdx(0);
    setFiltroGrupo("Todos");
    setFiltroInstitucion("Todas");
  };

  // Lista de secciones disponibles filtradas dinámicamente según el centro activo y telemetría
  const gruposDisponibles = useMemo(() => {
    const seccionesSet = new Set<string>();
    const prefix = nivelActivo === "7mo" ? "7-" : nivelActivo === "8vo" ? "8-" : "9-";

    // 1. Agregar las secciones asignadas al centro educativo activo
    if (centroActivo?.seccionesAtendidas && Array.isArray(centroActivo.seccionesAtendidas)) {
      centroActivo.seccionesAtendidas.forEach((sec) => {
        if (!sec || typeof sec !== "string") return;
        const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
        if (limpia) seccionesSet.add(`Sección ${limpia}`);
      });
    }

    // Si aún está vacío, agregar al menos las 4 primeras del nivel
    if (seccionesSet.size === 0) {
      for (let i = 1; i <= 4; i++) {
        seccionesSet.add(`Sección ${prefix}${i}`);
      }
    }

    // 2. Agregar secciones que tengan datos de telemetría existentes para este nivel
    (telemetria || []).forEach((t) => {
      if (t?.seccionOGrupo && typeof t.seccionOGrupo === "string" && t.seccionOGrupo.trim()) {
        const sec = t.seccionOGrupo.trim();
        if (sec.includes(prefix)) {
          const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
          if (limpia) seccionesSet.add(`Sección ${limpia}`);
        }
      }
    });

    return Array.from(seccionesSet).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [telemetria, nivelActivo, centroActivo]);

  // Nivel de logro dinámico según umbrales oficiales
  const obtenerNivelDinamico = (puntaje: number): string => {
    if (puntaje >= configuracion.umbralAvanzadoMin) {
      return "Consolidado (Nivel A)";
    }
    if (puntaje <= configuracion.umbralInicialMax) {
      return "Requiere Acompañamiento (Nivel C)";
    }
    return "En Desarrollo (Nivel B)";
  };

  // Filtrado reactivo de telemetría con aislamiento estricto por cuenta docente y nivel activo
  const telemetriaFiltrada = useMemo(() => {
    const correoDocenteLimpio = docente?.correoInstitucional?.toLowerCase()?.trim() || "";
    const esSuperAdmin = correoDocenteLimpio === "alberto.bustos.ortega@mep.go.cr";
    const esAsesorNacional =
      correoDocenteLimpio === "allan.morera.araya@mep.go.cr" || docente?.tipoRol === "Asesor Nacional";

    const idDoc = (docente?.idDocente || "").trim().toLowerCase();
    const cedDoc = (docente?.cedula || "").trim().toLowerCase();

    const filtrados = (telemetria || []).filter((r) => {
      if (!r) return false;

      const estNom = (r.estudianteNombre || "").toLowerCase().trim();
      const estCor = (r.estudianteCorreo || "").toLowerCase().trim();

      // Bloquear registros de prueba inapropiados
      if (estNom.includes("yo si jodo") || estNom.includes("yosijodo") || estNom.includes("augrey")) {
        return false;
      }

      // Excluir si el registro coincide con el nombre o correo del propio docente
      if (docente?.nombreCompleto && estNom && estNom === docente.nombreCompleto.toLowerCase().trim()) {
        return false;
      }
      if (correoDocenteLimpio && estCor && estCor === correoDocenteLimpio) {
        return false;
      }

      // Aislamiento por Docente: Todo docente ve ÚNICAMENTE los registros vinculados a su ID, cédula, correo o nombre
      if (!esSuperAdmin && !esAsesorNacional) {
        const rDocId = (r.docenteId || "").trim().toLowerCase();
        const rDocCed = ((r as any)?.docenteCedula || "").trim().toLowerCase();
        const rDocEmail = ((r as any)?.docenteEmail || "").trim().toLowerCase();
        const rDocNom = ((r as any)?.docenteNombre || "").trim().toLowerCase();
        const docNom = (docente?.nombreCompleto || "").trim().toLowerCase();

        const cedDocClean = cedDoc.replace(/\D/g, "");
        const rDocIdClean = rDocId.replace(/\D/g, "");
        const rDocCedClean = rDocCed.replace(/\D/g, "");

        const matchId = idDoc && (rDocId === idDoc || rDocId.includes(idDoc) || idDoc.includes(rDocId));
        const matchCed = cedDocClean && (rDocIdClean === cedDocClean || rDocCedClean === cedDocClean);
        const matchEmail = correoDocenteLimpio && (rDocEmail === correoDocenteLimpio || rDocEmail.includes(correoDocenteLimpio));
        const matchNom = docNom && rDocNom && (rDocNom === docNom || rDocNom.includes(docNom) || docNom.includes(rDocNom));

        const perteneceAlDocente = matchId || matchCed || matchEmail || matchNom;

        if (!perteneceAlDocente) {
          return false;
        }
      }

      // Filtro por Nivel Activo (Pestaña)
      const rNivel = (r.nivel || "").toString();
      const rSec = (r.seccionOGrupo || "").toString();
      const rTit = (r.webAppTitulo || "").toString();
      const rWebId = (r.webAppId || "").toString();

      if (nivelActivo === "7mo") {
        const es7mo = rNivel === "7°" || rNivel === "7mo" || rSec.includes("7-") || rTit.includes("7") || rWebId.includes("7mo");
        if (!es7mo) return false;
      } else if (nivelActivo === "8vo") {
        const es8vo = rNivel === "8°" || rNivel === "8vo" || rSec.includes("8-") || rTit.includes("8") || rWebId.includes("8vo");
        if (!es8vo) return false;
      } else if (nivelActivo === "9no") {
        const es9no = rNivel === "9°" || rNivel === "9no" || rSec.includes("9-") || rTit.includes("9") || rWebId.includes("9no");
        if (!es9no) return false;
      }

      // Filtro por Institución seleccionada
      if (filtroInstitucion !== "Todas") {
        const rInst = ((r as any)?.institucionNombre || (r as any)?.institucion || (r as any)?.colegio || "").toLowerCase();
        if (rInst && !rInst.includes(filtroInstitucion.toLowerCase())) {
          return false;
        }
      }

      const estNombre = (r.estudianteNombre || "").toLowerCase();
      const webTitulo = (r.webAppTitulo || "").toLowerCase();
      const textoLimpio = (filtroTexto || "").trim().toLowerCase();
      const coincideTexto = !textoLimpio || estNombre.includes(textoLimpio) || webTitulo.includes(textoLimpio);

      const rGrupo = (r.seccionOGrupo || "").trim();
      const coincideGrupo =
        filtroGrupo === "Todos" ||
        rGrupo === filtroGrupo ||
        rGrupo.replace(/^secci[oó]n\s*/i, "") === filtroGrupo.replace(/^secci[oó]n\s*/i, "");

      const puntajeVal = typeof r.porcentaje === "number" ? r.porcentaje : (typeof r.puntaje === "number" ? r.puntaje : 0);
      const nivelDinamico = obtenerNivelDinamico(puntajeVal);
      const rNivelLogro = (r.nivelLogro || "").toLowerCase();
      const coincideNivel =
        filtroNivelLogro === "Todos" ||
        nivelDinamico.toLowerCase().includes(filtroNivelLogro.toLowerCase()) ||
        rNivelLogro.includes(filtroNivelLogro.toLowerCase());

      return Boolean(coincideTexto && coincideGrupo && coincideNivel);
    });

    // Deduplicación estricta: 1 única fila por estudiante y sección
    const mapaUnicos = new Map<string, PayloadTelemetria>();
    filtrados.forEach((item) => {
      const nom = (item.estudianteNombre || "").toLowerCase().trim();
      const sec = (item.seccionOGrupo || "").toLowerCase().trim();
      const clave = `${nom}::${sec}`;
      if (!mapaUnicos.has(clave)) {
        mapaUnicos.set(clave, item);
      } else {
        const exist = mapaUnicos.get(clave)!;
        if (item.estadoProgreso === "completado" && exist.estadoProgreso !== "completado") {
          mapaUnicos.set(clave, item);
        } else if ((item.timestamp || 0) >= (exist.timestamp || 0)) {
          mapaUnicos.set(clave, item);
        }
      }
    });

    return Array.from(mapaUnicos.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [telemetria, nivelActivo, filtroTexto, filtroGrupo, filtroInstitucion, filtroNivelLogro, docente, configuracion]);

  const abrirEditar = (item: PayloadTelemetria) => {
    const defSec = nivelActivo === "7mo" ? "Sección 7-1" : nivelActivo === "8vo" ? "Sección 8-1" : "Sección 9-1";
    setRegistroEditando(item);
    setEditNombre(item.estudianteNombre);
    setEditGrupo(item.seccionOGrupo || defSec);
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
                MEP • Diagnóstico Secundaria 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Dashboard Analítico y Telemetría
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Consolidación en tiempo real de los resultados por nivel curricular, acceso a los instrumentos de evaluación docente y exportación oficial de actas a Excel y PDF.
            </p>
          </div>

          {/* Botones de Exportación */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() =>
                exportarAExcel(telemetriaFiltrada, {
                  nivel: nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año",
                  seccion: filtroGrupo,
                  institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
                  docente: docente?.nombreCompleto || "Docente MEP",
                  dre: centroActivo?.dreCodigo || centroActivo?.dreNombre || docente?.dreCodigo || "DRE",
                })
              }
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              title="Descargar Acta Oficial en Excel del Nivel Seleccionado"
            >
              <FileXls size={18} weight="bold" />
              <span>Exportar Excel ({nivelActivo === "7mo" ? "7.°" : nivelActivo === "8vo" ? "8.°" : "9.°"})</span>
            </button>

            <button
              onClick={() =>
                exportarAPDF(telemetriaFiltrada, {
                  nivel: nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año",
                  seccion: filtroGrupo,
                  institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
                  docente: docente?.nombreCompleto || "Docente MEP",
                  dre: centroActivo?.dreCodigo || centroActivo?.dreNombre || docente?.dreCodigo || "DRE",
                })
              }
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer"
              title="Descargar Informe Institucional en PDF del Nivel Seleccionado"
            >
              <FilePdf size={18} weight="bold" />
              <span>Informe PDF ({nivelActivo === "7mo" ? "7.°" : nivelActivo === "8vo" ? "8.°" : "9.°"})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PESTAÑAS / SELECTOR DE NIVELES (7MO, 8VO, 9NO)                            */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap size={22} className="text-slate-800" weight="duotone" />
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Seleccione el Nivel Educativo para Evaluación y Analítica:
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Visualizando actualmente: <strong className="text-slate-900 uppercase">{nivelActivo === "7mo" ? "Séptimo Año (7.°)" : nivelActivo === "8vo" ? "Octavo Año (8.°)" : "Noveno Año (9.°)"}</strong>
            </span>
          </div>

          {/* Selector de Pestañas de Nivel */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200">
            
            {/* Pestaña 7mo */}
            <button
              type="button"
              onClick={() => cambiarNivel("7mo")}
              className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                nivelActivo === "7mo"
                  ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20 border border-indigo-800 scale-[1.01]"
                  : "bg-white/70 hover:bg-white text-slate-700 hover:text-indigo-900 border border-transparent"
              }`}
            >
              <GameController size={20} weight={nivelActivo === "7mo" ? "fill" : "bold"} />
              <span>7.° Séptimo</span>
            </button>

            {/* Pestaña 8vo */}
            <button
              type="button"
              onClick={() => cambiarNivel("8vo")}
              className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                nivelActivo === "8vo"
                  ? "bg-teal-700 text-white shadow-md shadow-teal-700/20 border border-teal-800 scale-[1.01]"
                  : "bg-white/70 hover:bg-white text-slate-700 hover:text-teal-900 border border-transparent"
              }`}
            >
              <Cpu size={20} weight={nivelActivo === "8vo" ? "fill" : "bold"} />
              <span>8.° Octavo</span>
            </button>

            {/* Pestaña 9no */}
            <button
              type="button"
              onClick={() => cambiarNivel("9no")}
              className={`flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
                nivelActivo === "9no"
                  ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20 border border-emerald-800 scale-[1.01]"
                  : "bg-white/70 hover:bg-white text-slate-700 hover:text-emerald-900 border border-transparent"
              }`}
            >
              <Lightbulb size={20} weight={nivelActivo === "9no" ? "fill" : "bold"} />
              <span>9.° Noveno</span>
            </button>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* TARJETA GRANDE VISUAL DEL INSTRUMENTO EVALUADOR DEL NIVEL SELECCIONADO     */}
        {/* ========================================================================= */}
        {nivelActivo === "7mo" && (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-400 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 text-[11px] font-black uppercase tracking-wider">
                    🎮 Herramienta Oficial • 7.° Año
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 text-[10px] font-bold">
                    Módulo 1: CyberQuest
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-200 text-[10px] font-bold">
                    III Ciclo MEP 2026
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                  Herramienta de evaluación diagnóstica docente: 7.° Año
                </h3>

                <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
                  Aplicativo central para la valoración y registro de criterios de logro, observación docente en tiempo real, gestión de enlaces para la aplicación del diagnóstico y generación automática de actas pedagógicas con los datos obtenidos.
                </p>

                {/* Metadatos del Docente */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-indigo-200">
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <ChalkboardTeacher size={16} className="text-indigo-300" weight="bold" />
                    <span>Docente: <strong>{docente?.nombreCompleto || "Docente MEP"}</strong></span>
                  </div>
                </div>

                {/* SELECTOR DE COLEGIOS REGISTRADOS */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-black uppercase text-indigo-300 tracking-wider flex items-center gap-1.5">
                    <Buildings size={15} weight="bold" />
                    <span>Centros Educativos Asignados ({listaCentrosDocente.length}):</span>
                  </label>
                  {listaCentrosDocente.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {listaCentrosDocente.map((c, idx) => (
                        <button
                          key={c.id || idx}
                          type="button"
                          onClick={() => setCentroActivoIdx(idx)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                            centroActivoIdx === idx
                              ? "bg-white text-slate-900 border-white shadow-md font-black scale-[1.02]"
                              : "bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold"
                          }`}
                        >
                          <span>🏫 {c.nombre}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            centroActivoIdx === idx ? "bg-slate-200 text-slate-800" : "bg-black/30 text-stone-200"
                          }`}>
                            {c.dreCodigo || c.dreNombre}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-indigo-200 flex items-center justify-between gap-3">
                      <span>No tienes secciones asignadas para 7.° Año en tu perfil.</span>
                      <Link href="/registro" className="px-2.5 py-1 bg-white text-slate-900 font-bold rounded-lg text-[11px] hover:bg-slate-100">
                        Editar en Mi Perfil
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              {/* Botones de Apertura de la Tarjeta */}
              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                {listaCentrosDocente.length > 0 && centroActivo ? (
                  <>
                    <a
                      href={getUrlEvaluador(centroActivo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 px-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] cursor-pointer text-center"
                    >
                      <span>Abrir Herramienta 7.° Año</span>
                      <ArrowSquareOut size={20} weight="bold" />
                    </a>
                    <a
                      href="/docs/GUIA_PEDAGOGICA_EVALUACION_DIAGNOSTICA_MEP.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all shadow text-center cursor-pointer"
                      title="Ver o descargar la Guía Pedagógica y Operativa oficial en PDF"
                    >
                      <span>📘 Guía Pedagógica Docente (PDF)</span>
                      <ArrowSquareOut size={16} weight="bold" />
                    </a>
                  </>
                ) : (
                  <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-indigo-200/70 font-medium text-center">
                    Nivel no asignado
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {nivelActivo === "8vo" && (
          <div className="bg-gradient-to-br from-teal-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-teal-400 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/50 text-[11px] font-black uppercase tracking-wider">
                    🤖 Herramienta Oficial • 8.° Año
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 text-[10px] font-bold">
                    Módulo 1: Robótica y Automatización
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-bold">
                    III Ciclo MEP 2026
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                  Herramienta de evaluación diagnóstica docente: 8.° Año
                </h3>

                <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                  Aplicativo central para la valoración y registro de criterios de logro, observación docente en tiempo real, gestión de enlaces para la aplicación del diagnóstico y generación automática de actas pedagógicas con los datos obtenidos.
                </p>

                {/* Metadatos del Docente */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-teal-200">
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <ChalkboardTeacher size={16} className="text-teal-300" weight="bold" />
                    <span>Docente: <strong>{docente?.nombreCompleto || "Docente MEP"}</strong></span>
                  </div>
                </div>

                {/* SELECTOR DE COLEGIOS REGISTRADOS */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-black uppercase text-teal-300 tracking-wider flex items-center gap-1.5">
                    <Buildings size={15} weight="bold" />
                    <span>Centros Educativos Asignados ({listaCentrosDocente.length}):</span>
                  </label>
                  {listaCentrosDocente.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {listaCentrosDocente.map((c, idx) => (
                        <button
                          key={c.id || idx}
                          type="button"
                          onClick={() => setCentroActivoIdx(idx)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                            centroActivoIdx === idx
                              ? "bg-white text-slate-900 border-white shadow-md font-black scale-[1.02]"
                              : "bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold"
                          }`}
                        >
                          <span>🏫 {c.nombre}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            centroActivoIdx === idx ? "bg-slate-200 text-slate-800" : "bg-black/30 text-stone-200"
                          }`}>
                            {c.dreCodigo || c.dreNombre}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-teal-200 flex items-center justify-between gap-3">
                      <span>No tienes secciones asignadas para 8.° Año en tu perfil.</span>
                      <Link href="/registro" className="px-2.5 py-1 bg-white text-slate-900 font-bold rounded-lg text-[11px] hover:bg-slate-100">
                        Editar en Mi Perfil
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              {/* Botones de Apertura de la Tarjeta */}
              <div className="shrink-0 flex flex-col gap-2.5">
                {listaCentrosDocente.length > 0 && centroActivo ? (
                  <a
                    href={getUrlEvaluador(centroActivo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 px-6 py-4 bg-teal-500 hover:bg-teal-400 text-white font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-teal-500/30 hover:scale-[1.02] cursor-pointer text-center"
                  >
                    <span>Abrir Herramienta 8.° Año</span>
                    <ArrowSquareOut size={20} weight="bold" />
                  </a>
                ) : (
                  <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-teal-200/70 font-medium text-center">
                    Nivel no asignado
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {nivelActivo === "9no" && (
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-400 relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-[11px] font-black uppercase tracking-wider">
                    💡 Herramienta Oficial • 9.° Año
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-200 text-[10px] font-bold">
                    Módulo 1: Aula Inteligente (IoT)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold">
                    III Ciclo MEP 2026
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                  Herramienta de evaluación diagnóstica docente: 9.° Año
                </h3>

                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Aplicativo central para la valoración y registro de criterios de logro, observación docente en tiempo real, gestión de enlaces para la aplicación del diagnóstico y generación automática de actas pedagógicas con los datos obtenidos.
                </p>

                {/* Metadatos del Docente */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200">
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                    <ChalkboardTeacher size={16} className="text-emerald-300" weight="bold" />
                    <span>Docente: <strong>{docente?.nombreCompleto || "Docente MEP"}</strong></span>
                  </div>
                </div>

                {/* SELECTOR DE COLEGIOS REGISTRADOS */}
                <div className="space-y-2 pt-1">
                  <label className="text-[11px] font-black uppercase text-emerald-300 tracking-wider flex items-center gap-1.5">
                    <Buildings size={15} weight="bold" />
                    <span>Centros Educativos Asignados ({listaCentrosDocente.length}):</span>
                  </label>
                  {listaCentrosDocente.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {listaCentrosDocente.map((c, idx) => (
                        <button
                          key={c.id || idx}
                          type="button"
                          onClick={() => setCentroActivoIdx(idx)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                            centroActivoIdx === idx
                              ? "bg-white text-slate-900 border-white shadow-md font-black scale-[1.02]"
                              : "bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold"
                          }`}
                        >
                          <span>🏫 {c.nombre}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            centroActivoIdx === idx ? "bg-slate-200 text-slate-800" : "bg-black/30 text-stone-200"
                          }`}>
                            {c.dreCodigo || c.dreNombre}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-white/10 border border-white/20 rounded-xl text-xs text-emerald-200 flex items-center justify-between gap-3">
                      <span>No tienes secciones asignadas para 9.° Año en tu perfil.</span>
                      <Link href="/registro" className="px-2.5 py-1 bg-white text-slate-900 font-bold rounded-lg text-[11px] hover:bg-slate-100">
                        Editar en Mi Perfil
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              {/* Botones de Apertura de la Tarjeta */}
              <div className="shrink-0 flex flex-col gap-2.5">
                {listaCentrosDocente.length > 0 && centroActivo ? (
                  <>
                    <a
                      href={getUrlEvaluador(centroActivo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] cursor-pointer text-center"
                    >
                      <span>Abrir Herramienta 9.° Año (Evaluador)</span>
                      <ArrowSquareOut size={20} weight="bold" />
                    </a>

                    <a
                      href="/webapps/diagnostico_9no_modulo01_desconectado_offline.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-emerald-100 hover:text-white border border-emerald-400/40 font-bold text-xs rounded-2xl transition-all hover:scale-[1.02] cursor-pointer text-center"
                    >
                      <Desktop size={18} weight="duotone" />
                      <span>Herramienta de Evaluación Diagnóstica Docente Sin Conexión o Local</span>
                    </a>
                  </>
                ) : (
                  <div className="flex items-center justify-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs text-emerald-200/70 font-medium text-center">
                    Nivel no asignado
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TABLA DE REGISTROS DE TELEMETRÍA SECCIONADA POR EL NIVEL ACTIVO           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-softPastel p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-black text-lg text-slate-900">
                  Registros Consolidados de Telemetría • {nivelActivo === "7mo" ? "7.° Séptimo Año" : nivelActivo === "8vo" ? "8.° Octavo Año" : "9.° Noveno Año"} ({telemetriaFiltrada.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Seguimiento de entregas en vivo categorizadas para las secciones de {nivelActivo === "7mo" ? "7.°" : nivelActivo === "8vo" ? "8.°" : "9.°"} Año.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs border border-stone-200">
                {telemetriaFiltrada.length} entregas registradas
              </span>
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

            {/* Filtro por Colegio si tiene varios */}
            {listaCentrosDocente.length > 1 && (
              <select
                value={filtroInstitucion}
                onChange={(e) => setFiltroInstitucion(e.target.value)}
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="Todas">Todos los colegios</option>
                {listaCentrosDocente.map((c, idx) => (
                  <option key={c.id || `${c.nombre}-${idx}`} value={c.nombre}>
                    🏫 {c.nombre}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="Todos">Todas las secciones de {nivelActivo === "7mo" ? "7.°" : nivelActivo === "8vo" ? "8.°" : "9.°"}</option>
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
                if (confirm(`⚠️ ¿Deseas vaciar la telemetría de ${nivelActivo === "7mo" ? "7.°" : nivelActivo === "8vo" ? "8.°" : "9.°"} Año para iniciar de cero con tus grupos reales?`)) {
                  limpiarTelemetria();
                }
              }}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
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
                  <th className="p-3 text-center">Saberes Demostrados</th>
                  <th className="p-3 text-center">Nivel de Logro</th>
                  <th className="p-3 text-right">Fecha / Hora</th>
                  <th className="p-3 text-center rounded-r-xl">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {telemetriaFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center">
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                          <CheckCircle size={24} weight="duotone" />
                        </div>
                        <div className="font-extrabold text-slate-800 text-sm">
                          Sin registros de telemetría en {nivelActivo === "7mo" ? "7.° Séptimo" : nivelActivo === "8vo" ? "8.° Octavo" : "9.° Noveno"} Año
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                           Este espacio se encuentra completamente listo. Al aplicar el diagnóstico con sus estudiantes de este nivel, sus entregas y evaluaciones aparecerán aquí en tiempo real.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  telemetriaFiltrada.map((item, idx) => {
                    const puntajeFinal = item.porcentaje ?? item.puntaje ?? 0;
                    const logroDinamico = obtenerNivelDinamico(puntajeFinal);
                    const saberesCount = Math.max(1, Math.min(10, Math.round((puntajeFinal / 100) * 10)));
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
                        <td className="p-3 text-center">
                          <span className="font-extrabold text-slate-800 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200 text-xs">
                            {saberesCount}/10 Saberes
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10.5px] font-black uppercase inline-flex items-center gap-1.5 shadow-sm ${
                              logroDinamico.includes("Consolidado")
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                : logroDinamico.includes("Desarrollo")
                                ? "bg-amber-100 text-amber-900 border border-amber-300"
                                : "bg-rose-100 text-rose-900 border border-rose-300"
                            }`}
                          >
                            <span className="text-[10px]">{logroDinamico.includes("Consolidado") ? "🟢" : logroDinamico.includes("Desarrollo") ? "🟡" : "🔴"}</span>
                            <span>{logroDinamico}</span>
                          </span>
                        </td>
                        <td className="p-3 text-right text-stone-400 text-[11px] font-mono">
                          {item.timestamp && !isNaN(new Date(item.timestamp).getTime())
                            ? new Date(item.timestamp).toLocaleString("es-CR")
                            : "—"}
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => abrirEditar(item)}
                              className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Editar registro"
                            >
                              <NotePencil size={15} weight="bold" />
                            </button>
                            <button
                              onClick={() => eliminarResultado(item.estudianteNombre || item.timestamp)}
                              className="p-1.5 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

        {/* ========================================================================= */}
        {/* PANEL ANALÍTICO Y PEDAGÓGICO POR PESTAÑAS HORIZONTALES                   */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {/* Barra de Pestañas Principales */}
          <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-1 sm:pb-0">
              
              {/* Pestaña 1: Semáforo Diagnóstico */}
              <button
                type="button"
                onClick={() => setPestanaAnalitica("semaforo")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                  pestanaAnalitica === "semaforo"
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.01]"
                    : "bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200"
                }`}
              >
                <Gauge size={18} weight={pestanaAnalitica === "semaforo" ? "fill" : "bold"} className={pestanaAnalitica === "semaforo" ? "text-amber-400" : "text-slate-500"} />
                <span>1. Semáforo Diagnóstico de Saberes</span>
              </button>

              {/* Pestaña 2: Analítica Visual Comparativa */}
              <button
                type="button"
                onClick={() => setPestanaAnalitica("analitica")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                  pestanaAnalitica === "analitica"
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-[1.01]"
                    : "bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200"
                }`}
              >
                <ChartBar size={18} weight={pestanaAnalitica === "analitica" ? "fill" : "bold"} className={pestanaAnalitica === "analitica" ? "text-cyan-400" : "text-slate-500"} />
                <span>2. Analítica Visual & Comparativa de Secciones</span>
              </button>

              {/* Pestaña 3: Recomendaciones Pedagógicas & IA */}
              <button
                type="button"
                onClick={() => setPestanaAnalitica("recomendaciones")}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all cursor-pointer whitespace-nowrap ${
                  pestanaAnalitica === "recomendaciones"
                    ? "bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-md shadow-indigo-900/20 scale-[1.01]"
                    : "bg-stone-50 hover:bg-stone-100 text-slate-700 border border-stone-200"
                }`}
              >
                <Sparkle size={18} weight="fill" className={pestanaAnalitica === "recomendaciones" ? "text-amber-300" : "text-indigo-600"} />
                <span>3. Recomendaciones Pedagógicas & Asistente IA</span>
              </button>

            </div>
          </div>

          {/* Renderizado de la Pestaña Activa a Ancho Completo */}
          <div className="transition-all duration-300">
            {pestanaAnalitica === "semaforo" && (
              <ErrorBoundary
                fallbackTitle="Semáforo Diagnóstico"
                fallbackMessage="No se pudo procesar la distribución visual del semáforo con los datos actuales. Puedes continuar usando la tabla y los instrumentos."
              >
                <SemaforoLogro
                  registros={telemetriaFiltrada}
                  configuracion={configuracion}
                  nivel={nivelActivo}
                />
              </ErrorBoundary>
            )}

            {pestanaAnalitica === "analitica" && (
              <ErrorBoundary
                fallbackTitle="Analítica Visual & Desglose de Indicadores"
                fallbackMessage="No se pudo renderizar la comparativa gráfica por secciones. Los datos tabulares continúan completamente disponibles."
              >
                <GraficasSecciones
                  registros={telemetriaFiltrada}
                  configuracion={configuracion}
                  nivel={nivelActivo}
                />
              </ErrorBoundary>
            )}

            {pestanaAnalitica === "recomendaciones" && (
              <ErrorBoundary
                fallbackTitle="Recomendaciones Pedagógicas DUA"
                fallbackMessage="El generador de recomendaciones está calibrando los datos del grupo."
              >
                <RecomendacionesDUA
                  registros={telemetriaFiltrada}
                  configuracion={configuracion}
                  nivel={nivelActivo}
                />
              </ErrorBoundary>
            )}
          </div>
        </div>

        {/* MODAL EDITAR REGISTRO */}
        {registroEditando && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-black text-slate-900 text-sm">Editar Registro de Estudiante</h3>
                <button
                  onClick={() => setRegistroEditando(null)}
                  className="text-stone-400 hover:text-slate-700 font-bold text-xs cursor-pointer"
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
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
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
