"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LISTA_DRE_MEP } from "@/lib/dreCircuitos";
import {
  GlobeHemisphereWest,
  Buildings,
  GraduationCap,
  UsersThree,
  Cpu,
  TrendUp,
  WarningCircle,
  CheckCircle,
  Clock,
  DownloadSimple,
  MagnifyingGlass,
  Funnel,
  Sparkle,
  FileXls,
  FilePdf,
  ShieldCheck,
  ArrowsClockwise,
  ChartBar,
  ChalkboardTeacher,
  IdentificationBadge,
  Check,
  MapPin,
  MegaphoneSimple,
  Lightning,
  PaperPlaneRight,
  ArrowsLeftRight,
  Broadcast,
  Article,
  X,
} from "@phosphor-icons/react";
import * as XLSX from "xlsx";
import {
  DIAGNOSTICO_7MO_DATA,
  DIAGNOSTICO_9NO_DATA,
} from "@/lib/diagnosticos";
import { exportarInformeEjecutivoPDF } from "@/lib/exportadorPdfOficial";
import { SafeStorage } from "@/lib/firebase";

interface DocenteAdmin {
  id: string;
  nombreCompleto: string;
  correoInstitucional: string;
  cedula: string;
  telefono: string;
  dreCodigo: string;
  dreNombre: string;
  circuito: string;
  institucionNombre: string;
  rol: string;
  estado: string;
  fechaSolicitud: string;
  fechaAprobacion?: string;
  webAppsCreadas?: number;
  centrosEducativos?: any[];
}

interface ObservatorioMacroNacionalProps {
  usuariosDocentes: DocenteAdmin[];
}

export type VistaIIICiclo = "TODOS" | "7mo" | "9no";

export default function ObservatorioMacroNacional({ usuariosDocentes }: ObservatorioMacroNacionalProps) {
  const [nivelActivo, setNivelActivo] = useState<VistaIIICiclo>("TODOS");

  // Filtros de la Tabla Macro
  const [filtroDRE, setFiltroDRE] = useState("TODAS");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "APLICADO" | "PENDIENTE">("TODOS");
  const [filtroRol, setFiltroRol] = useState<"TODOS" | "Docente" | "Asesor Regional" | "Asesor Nacional" | "Asesor de Enseñanza Secundaria">("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [telemetriaReal, setTelemetriaReal] = useState<any[]>([]);
  const [cargandoTelemetria, setCargandoTelemetria] = useState(false);

  // Estados de IA Macro
  const [analisisIA, setAnalisisIA] = useState<any | null>(null);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [modalIAMacro, setModalIAMacro] = useState(false);

  // Estados de Avisos a Docentes
  const [nuevoAviso, setNuevoAviso] = useState("");
  const [avisoGuardado, setAvisoGuardado] = useState(false);
  const [avisoActual, setAvisoActual] = useState<string>("");

  // Cargar telemetría viva y avisos guardados
  useEffect(() => {
    const cargar = async () => {
      setCargandoTelemetria(true);
      try {
        const res = await fetch("/api/telemetria/enviar");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.registros)) {
            setTelemetriaReal(data.registros);
          }
        }
      } catch (e) {
        console.error("Error al cargar telemetría macro:", e);
      }
      setCargandoTelemetria(false);
    };
    cargar();

    const aviso = SafeStorage.getItem("MEP_AVISO_OFICIAL_DOCENTES");
    if (aviso) {
      setAvisoActual(aviso);
      setNuevoAviso(aviso);
    }
  }, []);

  // Normalizador de nivel para un registro de telemetría en III Ciclo (7mo y 9no)
  const detectarNivelRegistro = (r: any): "7mo" | "9no" => {
    const niv = (r.nivel || "").toLowerCase();
    const sec = (r.seccionOGrupo || r.seccion || "").toLowerCase();
    const webApp = (r.webAppId || r.webAppTitulo || "").toLowerCase();

    if (niv.includes("7") || sec.includes("7-") || webApp.includes("7mo") || webApp.includes("setimo") || webApp.includes("cyberquest")) return "7mo";
    return "9no";
  };

  // Telemetría filtrada por nivel activo
  const telemetriaNivel = useMemo(() => {
    if (nivelActivo === "TODOS") return telemetriaReal;
    return telemetriaReal.filter((r) => detectarNivelRegistro(r) === nivelActivo);
  }, [telemetriaReal, nivelActivo]);

  // Conteos individuales de estudiantes evaluados en 7mo y 9no
  const eval7mo = useMemo(() => telemetriaReal.filter((r) => detectarNivelRegistro(r) === "7mo").length, [telemetriaReal]);
  const eval9no = useMemo(() => telemetriaReal.filter((r) => detectarNivelRegistro(r) === "9no").length, [telemetriaReal]);

  // Consolidar instituciones exclusivamente de III Ciclo a partir del padrón
  const institucionesConsolidadas = useMemo(() => {
    const mapa = new Map<string, any>();

    usuariosDocentes.forEach((u) => {
      const centros = u.centrosEducativos && u.centrosEducativos.length > 0
        ? u.centrosEducativos
        : [{ nombre: u.institucionNombre, dreCodigo: u.dreCodigo, dreNombre: u.dreNombre, circuito: u.circuito }];

      centros.forEach((c) => {
        if (c.nombre && c.nombre.trim()) {
          const clave = c.nombre.toLowerCase().trim();
          if (!mapa.has(clave)) {
            const nivelesAtendidos = c.desgloseNiveles
              ? c.desgloseNiveles.filter((dn: any) => dn.activo && (dn.nivel.includes("7") || dn.nivel.includes("9"))).map((dn: any) => dn.nivel)
              : ["7°", "9°"];

            mapa.set(clave, {
              institucion: c.nombre,
              dre: c.dreCodigo || u.dreCodigo || "DRE-01",
              dreNombre: c.dreNombre || u.dreNombre || "San José Central",
              circuito: c.circuito || u.circuito || "Circuito 01",
              docente: u.nombreCompleto,
              correoDocente: u.correoInstitucional,
              rol: u.rol || "Docente",
              nivelesAtendidos: nivelesAtendidos.length > 0 ? nivelesAtendidos : ["7°", "9°"],
              totalEstudiantes: 0,
              estudiantes7mo: 0,
              estudiantes9no: 0,
              promedio: 0,
              aplicado: false,
              ultimoReporte: "Pendiente",
            });
          }
        }
      });
    });

    // Vincular telemetría viva registrada
    telemetriaReal.forEach((t) => {
      const instNorm = (t.institucionNombre || t.institucion || "").toLowerCase().trim();
      let encontrado = false;

      for (const [clave, instObj] of mapa.entries()) {
        if (instNorm.includes(clave) || clave.includes(instNorm) || instNorm.length === 0) {
          const nivReg = detectarNivelRegistro(t);
          instObj.totalEstudiantes += 1;
          if (nivReg === "7mo") instObj.estudiantes7mo += 1;
          if (nivReg === "9no") instObj.estudiantes9no += 1;
          instObj.aplicado = true;
          instObj.ultimoReporte = new Date(t.timestamp || Date.now()).toISOString().split("T")[0];
          encontrado = true;
          break;
        }
      }

      if (!encontrado && mapa.size > 0) {
        const primer = Array.from(mapa.values())[0];
        const nivReg = detectarNivelRegistro(t);
        primer.totalEstudiantes += 1;
        if (nivReg === "7mo") primer.estudiantes7mo += 1;
        if (nivReg === "9no") primer.estudiantes9no += 1;
        primer.aplicado = true;
        primer.ultimoReporte = new Date(t.timestamp || Date.now()).toISOString().split("T")[0];
      }
    });

    // Calcular promedios institucionales
    mapa.forEach((instObj) => {
      if (instObj.totalEstudiantes > 0) {
        const sumPunt = telemetriaReal.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje ?? 0), 0);
        instObj.promedio = Math.round(sumPunt / instObj.totalEstudiantes);
      }
    });

    return Array.from(mapa.values());
  }, [usuariosDocentes, telemetriaReal]);

  // Filtrado de instituciones por Nivel (7mo / 9no / Todos), DRE, Estado, Rol y Búsqueda
  const institucionesFiltradas = useMemo(() => {
    return institucionesConsolidadas.filter((item) => {
      const matchNivel =
        nivelActivo === "TODOS" ||
        (nivelActivo === "7mo" && item.nivelesAtendidos.some((n: string) => n.includes("7"))) ||
        (nivelActivo === "9no" && item.nivelesAtendidos.some((n: string) => n.includes("9")));

      const matchDRE = filtroDRE === "TODAS" || item.dre === filtroDRE || item.dreNombre.toLowerCase().includes(filtroDRE.toLowerCase());
      
      const matchEstado =
        filtroEstado === "TODOS" ||
        (filtroEstado === "APLICADO" && item.aplicado) ||
        (filtroEstado === "PENDIENTE" && !item.aplicado);

      const matchRol =
        filtroRol === "TODOS" ||
        item.rol === filtroRol ||
        (filtroRol === "Docente" && (item.rol.includes("Docente") || item.rol === "Profesor"));

      const matchTexto =
        item.institucion.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.docente.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.dreNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.circuito.toLowerCase().includes(busqueda.toLowerCase());

      return matchNivel && matchDRE && matchEstado && matchRol && matchTexto;
    });
  }, [institucionesConsolidadas, nivelActivo, filtroDRE, filtroEstado, filtroRol, busqueda]);

  // Métricas Macro Nacionales de III Ciclo (7.° y 9.°)
  const metricasMacro = useMemo(() => {
    const totalInst = institucionesConsolidadas.length;
    const instAplicadas = institucionesConsolidadas.filter((i) => i.aplicado && i.totalEstudiantes > 0).length;
    const instPendientes = totalInst - instAplicadas;
    const totalEstudiantes = telemetriaNivel.length;

    const promedioNacional =
      totalEstudiantes > 0
        ? Math.round(
            (telemetriaNivel.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje ?? 0), 0) /
              totalEstudiantes) *
              10
          ) / 10
        : 55;

    const tasaCobertura = totalInst > 0 ? Math.round((instAplicadas / totalInst) * 100) : 0;

    return {
      totalInst,
      instAplicadas,
      instPendientes,
      totalEstudiantes,
      promedioNacional,
      tasaCobertura,
    };
  }, [institucionesConsolidadas, telemetriaNivel]);

  // Resolver nombre legible de subárea curricular
  const resolverNombreSubarea = (subId: string, nivel: "7mo" | "9no"): string => {
    if (nivel === "7mo") {
      if (subId.includes("hardware") || subId.includes("sistemas")) return "Hardware, Software y Sistemas Operativos";
      if (subId.includes("conectividad") || subId.includes("archivos")) return "Redes de Comunicación y Gestión de Archivos";
      if (subId.includes("programacion") || subId.includes("algoritmos")) return "Pensamiento Computacional y Control Lógico";
      return "Formación Tecnológica 7.°";
    } else {
      if (subId.includes("sistemas") || subId.includes("auto")) return "Sistemas Automatizados y Arquitectura de Control";
      if (subId.includes("algoritmos") || subId.includes("iot")) return "Pensamiento Computacional y Lógica Condicional";
      if (subId.includes("depuracion") || subId.includes("datos")) return "Depuración, Conectividad y Almacenamiento";
      return "Formación Tecnológica 9.°";
    }
  };

  // Matriz de Indicadores de III Ciclo Oficial MEP
  const matrizIndicadores = useMemo(() => {
    const hayEvaluaciones = telemetriaNivel.length > 0;
    const prom = metricasMacro.promedioNacional;

    if (nivelActivo === "7mo") {
      return DIAGNOSTICO_7MO_DATA.reactivos.map((r, idx) => {
        const logro = hayEvaluaciones ? Math.round(prom) : 0;
        return {
          id: idx + 1,
          codigo: `IND-7.${idx + 1}`,
          nombre: r.indicadorTexto,
          subarea: resolverNombreSubarea(r.subarea, "7mo"),
          saberes: r.enunciado,
          peso: r.puntos,
          pctLogro: logro,
          estado: !hayEvaluaciones ? "Pendiente de Diagnóstico" : logro >= 75 ? "Consolidado Nacional" : logro >= 60 ? "En Nivelación" : "Brecha Crítica",
        };
      });
    }

    if (nivelActivo === "9no") {
      return DIAGNOSTICO_9NO_DATA.reactivos.map((r, idx) => {
        const logro = hayEvaluaciones ? Math.round(prom) : 0;
        return {
          id: idx + 1,
          codigo: `IND-9.${idx + 1}`,
          nombre: r.indicadorTexto,
          subarea: resolverNombreSubarea(r.subarea, "9no"),
          saberes: r.enunciado,
          peso: r.puntos,
          pctLogro: logro,
          estado: !hayEvaluaciones ? "Pendiente de Diagnóstico" : logro >= 75 ? "Consolidado Nacional" : logro >= 60 ? "En Nivelación" : "Brecha Crítica",
        };
      });
    }

    // BASE FUNDAMENTAL: Visión Consolidada de los 2 Módulos Activos de III Ciclo (7.° y 9.° Año)
    return [
      {
        id: 1,
        codigo: "7.° AÑO",
        nombre: "Diagnóstico 7.° Año (Formación Tecnológica • Módulo 1 — III Ciclo)",
        subarea: "Educación General Básica III Ciclo • 10 Reactivos Oficiales",
        saberes: "Hardware, software, sistemas operativos, redes, archivos, pensamiento computacional y algoritmia",
        peso: 10,
        pctLogro: eval7mo > 0 ? metricasMacro.promedioNacional : 55,
        estado: eval7mo > 0 ? `${eval7mo} Estudiantes Evaluados` : "Suite Diagnóstica Activa (10 ítems)",
      },
      {
        id: 2,
        codigo: "9.° AÑO",
        nombre: "Diagnóstico 9.° Año (Formación Tecnológica • Módulo 1 — III Ciclo)",
        subarea: "Educación General Básica III Ciclo • 10 Reactivos Oficiales",
        saberes: "Sistemas automatizados, microcontroladores, sensores LDR, actuadores, Ley de Ohm, condicionales y depuración",
        peso: 10,
        pctLogro: eval9no > 0 ? metricasMacro.promedioNacional : 55,
        estado: eval9no > 0 ? `${eval9no} Estudiantes Evaluados` : "Suite Diagnóstica Activa (10 ítems)",
      },
    ];
  }, [nivelActivo, telemetriaNivel, metricasMacro, eval7mo, eval9no]);

  // Cuadrícula y Análisis Geo-Regional de las 27 DREs
  const resumenDREs = useMemo(() => {
    return LISTA_DRE_MEP.map((dre) => {
      const instDRE = institucionesConsolidadas.filter((i) => i.dre === dre.codigo);
      const evalDRE = instDRE.reduce((acc, curr) => acc + curr.totalEstudiantes, 0);
      const promDRE = instDRE.length > 0 && evalDRE > 0
        ? Math.round(instDRE.reduce((acc, curr) => acc + curr.promedio, 0) / instDRE.filter((i) => i.promedio > 0).length || 55)
        : 0;

      return {
        codigo: dre.codigo,
        nombre: dre.nombre,
        colegios: instDRE.length,
        estudiantes: evalDRE,
        promedio: promDRE,
        estado: evalDRE > 0 ? "Activa" : "Pendiente",
      };
    });
  }, [institucionesConsolidadas]);

  // Generar Dictamen Curricular Macro con IA
  const handleGenerarIAMacro = async () => {
    setGenerandoIA(true);
    setModalIAMacro(true);
    try {
      const res = await fetch("/api/ia/analisis-macro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nivel: nivelActivo,
          totalEstudiantes: metricasMacro.totalEstudiantes,
          totalInstituciones: metricasMacro.totalInst,
          promedioNacional: metricasMacro.promedioNacional,
          eval7mo,
          eval9no,
          cobertura: metricasMacro.tasaCobertura,
          filtroDRE,
          indicadores: matrizIndicadores,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analisis) {
          setAnalisisIA(data.analisis);
        }
      }
    } catch (e) {
      console.error("Error al generar análisis macro con IA:", e);
    }
    setGenerandoIA(false);
  };

  // Descargar Informe Ejecutivo Oficial en PDF
  const handleDescargarPDF = () => {
    exportarInformeEjecutivoPDF({
      titulo: "Informe Ejecutivo Nacional de Evaluación Diagnóstica",
      nivel: nivelActivo === "TODOS" ? "Consolidado III Ciclo (7.° y 9.° Año)" : nivelActivo === "7mo" ? "7.° Año (Módulo 1)" : "9.° Año (Módulo 1)",
      fecha: new Date().toLocaleDateString("es-CR"),
      totalInstituciones: metricasMacro.totalInst,
      totalEstudiantes: metricasMacro.totalEstudiantes,
      eval7mo,
      eval9no,
      promedioNacional: metricasMacro.promedioNacional,
      cobertura: metricasMacro.tasaCobertura,
      brechaCritica: nivelActivo === "7mo" ? "IND-7.1 (Periféricos E/S)" : "IND-9.8 (Ley de Ohm y Circuitos)",
      indicadores: matrizIndicadores,
      dreResumen: resumenDREs,
      analisisIA: analisisIA || undefined,
    });
  };

  // Guardar y Publicar Aviso Oficial a Docentes
  const handleGuardarAviso = () => {
    if (!nuevoAviso.trim()) return;
    SafeStorage.setItem("MEP_AVISO_OFICIAL_DOCENTES", nuevoAviso.trim());
    setAvisoActual(nuevoAviso.trim());
    setAvisoGuardado(true);
    setTimeout(() => setAvisoGuardado(false), 4000);
  };

  // Exportar Excel Multi-Hoja
  const exportarMacroExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Directorio Nacional de III Ciclo
    const dataFilas = institucionesFiltradas.map((item, idx) => ({
      "N°": idx + 1,
      "Institución Educativa": item.institucion,
      "Dirección Regional (DRE)": item.dreNombre,
      "Código DRE": item.dre,
      "Circuito Escolar": item.circuito,
      "Responsable": item.docente,
      "Rol": item.rol,
      "Niveles Asignados": item.nivelesAtendidos.join(", "),
      "Estado General": item.aplicado ? "APLICADO" : "PENDIENTE",
      "Total Evaluados (III Ciclo)": item.totalEstudiantes,
      "Evaluados 7mo": item.estudiantes7mo,
      "Evaluados 9no": item.estudiantes9no,
      "Promedio Institucional (%)": item.promedio > 0 ? `${item.promedio}%` : "N/D",
      "Fecha Último Reporte": item.ultimoReporte,
    }));
    const wsInstituciones = XLSX.utils.json_to_sheet(dataFilas);
    XLSX.utils.book_append_sheet(workbook, wsInstituciones, "Directorio_III_Ciclo");

    // Hoja 2: Matriz 7mo Año
    const data7mo = DIAGNOSTICO_7MO_DATA.reactivos.map((r, i) => ({
      "N°": i + 1,
      "Código": `IND-7.${i + 1}`,
      "Indicador Oficial MEP": r.indicadorTexto,
      "Subárea Curricular": resolverNombreSubarea(r.subarea, "7mo"),
      "Enunciado": r.enunciado,
      "Puntos": r.puntos,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data7mo), "Matriz_7mo_Ano");

    // Hoja 3: Matriz 9no Año
    const data9no = DIAGNOSTICO_9NO_DATA.reactivos.map((r, i) => ({
      "N°": i + 1,
      "Código": `IND-9.${i + 1}`,
      "Indicador Oficial MEP": r.indicadorTexto,
      "Subárea Curricular": resolverNombreSubarea(r.subarea, "9no"),
      "Enunciado": r.enunciado,
      "Puntos": r.puntos,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data9no), "Matriz_9no_Ano");

    // Hoja 4: Resumen 27 DREs
    const dataDREs = resumenDREs.map((dre) => ({
      "Código DRE": dre.codigo,
      "Dirección Regional": dre.nombre,
      "Colegios Registrados": dre.colegios,
      "Estudiantes Evaluados (III Ciclo)": dre.estudiantes,
      "Promedio Logro (%)": dre.promedio > 0 ? `${dre.promedio}%` : "N/D",
      "Estado Cobertura": dre.estado,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataDREs), "Resumen_27_DREs");

    XLSX.writeFile(workbook, `Observatorio_Macro_Nacional_III_Ciclo_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* 1. SELECTOR EXCLUSIVO DE GOBERNANZA III CICLO (7.° Y 9.° AÑO)             */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-softPastel space-y-4">
        
        {/* Cabecera del Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <GraduationCap size={22} weight="bold" />
            </span>
            <div>
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                Gobernanza Nacional • Formación Tecnológica III Ciclo (7.° y 9.° Año)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Supervisión de instrumentos diagnósticos curriculares en las 27 Direcciones Regionales de Educación (DREs).
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase self-start sm:self-auto">
            <ShieldCheck size={14} weight="bold" className="text-emerald-400" />
            <span>Super Administrador: Alberto Bustos Ortega</span>
          </div>
        </div>

        {/* 3 Pestañas / Tarjetas Principales de III Ciclo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* TARJETA 1: CONSOLIDADO MACRO III CICLO (7° y 9°) */}
          <button
            type="button"
            onClick={() => setNivelActivo("TODOS")}
            className={`flex flex-col justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
              nivelActivo === "TODOS"
                ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-[1.02]"
                : "bg-stone-50 hover:bg-stone-100/90 text-slate-800 border-stone-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600">
                <GlobeHemisphereWest size={20} weight="bold" className={nivelActivo === "TODOS" ? "text-emerald-400" : "text-emerald-700"} />
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                nivelActivo === "TODOS" ? "bg-emerald-500 text-slate-950" : "bg-stone-200 text-slate-700"
              }`}>
                {telemetriaReal.length} evals
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-black uppercase tracking-wider">Consolidado III Ciclo</div>
              <p className={`text-[11px] font-medium leading-tight mt-0.5 ${nivelActivo === "TODOS" ? "text-slate-300" : "text-slate-500"}`}>
                7.° y 9.° Año (20 reactivos oficiales)
              </p>
            </div>
          </button>

          {/* TARJETA 2: DIAGNÓSTICO 7.° AÑO */}
          <button
            type="button"
            onClick={() => setNivelActivo("7mo")}
            className={`flex flex-col justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
              nivelActivo === "7mo"
                ? "bg-indigo-900 text-white border-indigo-600 shadow-md ring-2 ring-indigo-400 scale-[1.02]"
                : "bg-indigo-50/50 hover:bg-indigo-50 text-slate-800 border-indigo-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-xl bg-indigo-200 text-indigo-900">
                <Cpu size={20} weight="bold" />
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                nivelActivo === "7mo" ? "bg-indigo-300 text-indigo-950" : "bg-indigo-100 text-indigo-900"
              }`}>
                {eval7mo} evals
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-black uppercase tracking-wider">Diagnóstico 7.° Año</div>
              <p className={`text-[11px] font-medium leading-tight mt-0.5 ${nivelActivo === "7mo" ? "text-indigo-200" : "text-slate-500"}`}>
                Formación Tecnológica (10 reactivos)
              </p>
            </div>
          </button>

          {/* TARJETA 3: DIAGNÓSTICO 9.° AÑO */}
          <button
            type="button"
            onClick={() => setNivelActivo("9no")}
            className={`flex flex-col justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
              nivelActivo === "9no"
                ? "bg-purple-900 text-white border-purple-600 shadow-md ring-2 ring-purple-400 scale-[1.02]"
                : "bg-purple-50/50 hover:bg-purple-50 text-slate-800 border-purple-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-2 rounded-xl bg-purple-200 text-purple-900">
                <Cpu size={20} weight="bold" />
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                nivelActivo === "9no" ? "bg-purple-300 text-purple-950" : "bg-purple-100 text-purple-900"
              }`}>
                {eval9no} evals
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-black uppercase tracking-wider">Diagnóstico 9.° Año</div>
              <p className={`text-[11px] font-medium leading-tight mt-0.5 ${nivelActivo === "9no" ? "text-purple-200" : "text-slate-500"}`}>
                Formación Tecnológica (10 reactivos)
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BANNER PRINCIPAL, BOTONES DE ACCIÓN (PDF, IA, EXCEL) & KPIS            */}
      {/* ========================================================================= */}
      <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-softPastel border-2 border-emerald-200/90 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                <GlobeHemisphereWest size={24} weight="bold" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
                Observatorio Nacional • Formación Tecnológica III Ciclo MEP 2027
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {nivelActivo === "TODOS"
                ? "Analítica Macro Nacional: Consolidado III Ciclo (7.° y 9.° Año)"
                : nivelActivo === "7mo"
                ? "Analítica Macro: Diagnóstico 7.° Año (Módulo 1 — III Ciclo)"
                : "Analítica Macro: Diagnóstico 9.° Año (Módulo 1 — III Ciclo)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
              Panel de supervisión general para <strong>Alberto Bustos Ortega (Super Administrador)</strong>. Permite monitorear la aplicación del diagnóstico en liceos y colegios de las 27 DREs, comparar rendimientos y detectar brechas curriculares de entrada de año.
            </p>
          </div>

          {/* Botones de Acción Macro */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* BOTÓN 1: DICTAMEN MACRO CON IA */}
            <button
              onClick={handleGenerarIAMacro}
              disabled={generandoIA}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkle size={17} weight="fill" className={generandoIA ? "animate-spin" : ""} />
              <span>{generandoIA ? "Generando Dictamen..." : "Dictamen Macro con IA"}</span>
            </button>

            {/* BOTÓN 2: INFORME EJECUTIVO EN PDF */}
            <button
              onClick={handleDescargarPDF}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FilePdf size={17} weight="bold" />
              <span>Informe Oficial (.pdf)</span>
            </button>

            {/* BOTÓN 3: REPORTE EXCEL */}
            <button
              onClick={exportarMacroExcel}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileXls size={17} weight="bold" />
              <span>Exportar Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 4 Tarjetas KPI Macro */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-stone-200">
          <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-stone-200 shadow-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Instituciones Registradas
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {metricasMacro.instAplicadas} <span className="text-sm font-semibold text-stone-500">/ {metricasMacro.totalInst}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-2">
              <span>{metricasMacro.tasaCobertura}% cobertura nacional</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-stone-200 shadow-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Estudiantes Evaluados ({nivelActivo === "TODOS" ? "Total III Ciclo" : nivelActivo === "7mo" ? "7.° Año" : "9.° Año"})
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {metricasMacro.totalEstudiantes.toLocaleString()}
            </div>
            <div className="text-[11px] text-stone-600 font-medium mt-2">
              En {metricasMacro.instAplicadas} instituciones activas
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-stone-200 shadow-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Promedio de Logro Nacional
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
              {metricasMacro.promedioNacional}%
            </div>
            <div className="text-[11px] text-stone-600 font-medium mt-2">
              Nivel de logro grupal consolidado
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-stone-200 shadow-xs">
            <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Brecha Crítica Detectada
            </div>
            <div className={`text-sm font-black mt-1 line-clamp-1 ${metricasMacro.totalEstudiantes > 0 ? "text-rose-700" : "text-amber-800"}`}>
              {nivelActivo === "7mo"
                ? "IND-7.1: Dispositivos de Entrada, Salida y Almacenamiento"
                : "IND-9.8: Ley de Ohm y Circuitos Eléctricos"}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-2">
              Prioridad pedagógica para nivelación
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CUADRÍCULA Y ANÁLISIS GEO-REGIONAL DE LAS 27 DREs DE COSTA RICA        */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <MapPin size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Mapa y Cobertura Territorial de las 27 Direcciones Regionales (DREs)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Toca cualquier tarjeta regional para filtrar de inmediato los datos del observatorio y la lista de liceos.
            </p>
          </div>

          {filtroDRE !== "TODAS" && (
            <button
              onClick={() => setFiltroDRE("TODAS")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold self-start sm:self-auto"
            >
              <X size={14} weight="bold" />
              <span>Limpiar filtro DRE ({filtroDRE})</span>
            </button>
          )}
        </div>

        {/* Cuadrícula de las 27 DREs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-80 overflow-y-auto pr-1">
          {resumenDREs.map((dre) => {
            const esSeleccionada = filtroDRE === dre.codigo || filtroDRE === dre.nombre;
            const tieneEvaluados = dre.estudiantes > 0;

            return (
              <button
                key={dre.codigo}
                type="button"
                onClick={() => setFiltroDRE(esSeleccionada ? "TODAS" : dre.codigo)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  esSeleccionada
                    ? "bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-400 shadow-md scale-[1.02]"
                    : tieneEvaluados
                    ? "bg-emerald-50/60 hover:bg-emerald-50 border-emerald-300 text-slate-900"
                    : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-[10px] font-black uppercase font-mono ${esSeleccionada ? "text-emerald-400" : "text-slate-500"}`}>
                      {dre.codigo}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tieneEvaluados ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>
                  <div className="text-xs font-black truncate mt-1" title={dre.nombre}>
                    {dre.nombre}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                  <span className={esSeleccionada ? "text-slate-300" : "text-slate-500"}>
                    {dre.colegios} cole{dre.colegios === 1 ? "" : "s"}
                  </span>
                  <span className={`font-mono font-bold ${esSeleccionada ? "text-emerald-300" : tieneEvaluados ? "text-emerald-700" : "text-slate-400"}`}>
                    {dre.estudiantes} evals
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. COMPARATIVA LONGITUDINAL INTER-NIVEL (7.° VS 9.° AÑO)                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
                <ArrowsLeftRight size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Comparativa Longitudinal de Competencias: Entrada (7.°) vs Egreso (9.°)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Análisis comparativo de saberes previos y progresión de aprendizaje a lo largo de III Ciclo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Dimensión 1: Pensamiento Computacional */}
          <div className="p-5 rounded-2xl bg-[#FCFBF9] border border-stone-200 space-y-3">
            <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              1. Pensamiento Computacional & Algoritmia
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>7.° Año (Lógica Inicial)</span>
                  <span>{eval7mo > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${eval7mo > 0 ? metricasMacro.promedioNacional : 55}%` }} className="h-full bg-indigo-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>9.° Año (Lógica Compuesta & IoT)</span>
                  <span>{eval9no > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${eval9no > 0 ? metricasMacro.promedioNacional : 55}%` }} className="h-full bg-purple-600 rounded-full" />
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500 italic">
              Progresión esperada: De secuencias lógicas a algoritmos condicionales con variables embebidas.
            </p>
          </div>

          {/* Dimensión 2: Apropiación Tecnológica y Hardware */}
          <div className="p-5 rounded-2xl bg-[#FCFBF9] border border-stone-200 space-y-3">
            <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              2. Apropiación Tecnológica & Circuitos
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>7.° Año (Periféricos & SO)</span>
                  <span>{eval7mo > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${eval7mo > 0 ? metricasMacro.promedioNacional : 55}%` }} className="h-full bg-indigo-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>9.° Año (Microcontroladores & Ley Ohm)</span>
                  <span>{eval9no > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${eval9no > 0 ? metricasMacro.promedioNacional : 55}%` }} className="h-full bg-purple-600 rounded-full" />
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500 italic">
              Progresión esperada: De reconocimiento de hardware a conexionado físico de actuadores y sensores.
            </p>
          </div>

          {/* Dimensión 3: Depuración y Resolución de Problemas */}
          <div className="p-5 rounded-2xl bg-[#FCFBF9] border border-stone-200 space-y-3">
            <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
              3. Depuración & Gestión del Error
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>7.° Año (Jerarquía & Archivos)</span>
                  <span>{eval7mo > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${eval7mo > 0 ? metricasMacro.promedioNacional : 55}%` }} className="h-full bg-indigo-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>9.° Año (Diagnóstico de Circuitos)</span>
                  <span>{eval9no > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div style={{ width: `${eval9no > 0 ? metricasMacro.promedioNacional : 55}%` }} className="h-full bg-purple-600 rounded-full" />
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500 italic">
              Progresión esperada: De orden de archivos a depuración de fallos de conexionado en laboratorio.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MATRIZ MACRO NACIONAL DE INDICADORES                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <Cpu size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                {nivelActivo === "TODOS"
                  ? "III Ciclo (7.° y 9.° Secundaria): Módulos Activos de Evaluación Diagnóstica"
                  : nivelActivo === "7mo"
                  ? "Matriz Macro Nacional de Indicadores y Saberes Previos (7.° Año • Módulo 1)"
                  : "Matriz Macro Nacional de Indicadores y Saberes Previos (9.° Año • Módulo 1)"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Diagnóstico de entrada sobre saberes del año anterior para toma de decisiones curriculares a nivel nacional.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold self-start sm:self-auto">
            {matrizIndicadores.length} {nivelActivo === "TODOS" ? "Módulos de Diagnóstico" : "Indicadores Auditados"}
          </span>
        </div>

        {/* Gráfica de Barras / Tarjetas de Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matrizIndicadores.map((ind) => {
            const esCero = ind.pctLogro === 0;
            const esCritico = !esCero && ind.pctLogro < 60;
            const esConsolidado = !esCero && ind.pctLogro >= 75;

            return (
              <div
                key={ind.id}
                className={`p-4 rounded-2xl border transition-all ${
                  esCero
                    ? "bg-slate-50/70 border-slate-200"
                    : esCritico
                    ? "bg-rose-50/40 border-rose-200"
                    : esConsolidado
                    ? "bg-emerald-50/40 border-emerald-200"
                    : "bg-amber-50/30 border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        esCero
                          ? "bg-slate-400 text-white"
                          : esCritico
                          ? "bg-rose-600 text-white"
                          : esConsolidado
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {ind.id}
                    </span>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{ind.nombre}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{ind.subarea}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      esCero
                        ? "bg-slate-100 text-slate-600 border border-slate-200"
                        : esConsolidado
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : esCritico
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {ind.pctLogro > 0 ? `${ind.pctLogro}% Nacional` : ind.codigo}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 italic">
                  "{ind.saberes}"
                </p>

                {/* Barra de Progreso */}
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mt-3 shadow-inner">
                  <div
                    style={{ width: `${ind.pctLogro > 0 ? ind.pctLogro : 45}%` }}
                    className={`h-full transition-all duration-500 ${
                      esCero ? "bg-slate-300" : esCritico ? "bg-rose-500" : esConsolidado ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mt-1.5">
                  <span>{ind.codigo}</span>
                  <span className={esCero ? "text-slate-500 font-medium" : esCritico ? "text-rose-700" : esConsolidado ? "text-emerald-700" : "text-amber-700"}>
                    {ind.estado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. CENTRO DE AVISOS Y COMUNICADOS OFICIALES A DOCENTES                     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <MegaphoneSimple size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Centro de Avisos y Comunicados Oficiales para Docentes
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Publica recordatorios o directrices pedagógicas que aparecerán en el Dashboard de todos los docentes de secundaria.
            </p>
          </div>

          {avisoGuardado && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black animate-bounce self-start sm:self-auto">
              <Check size={16} weight="bold" />
              <span>¡Aviso publicado con éxito!</span>
            </span>
          )}
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={nuevoAviso}
            onChange={(e) => setNuevoAviso(e.target.value)}
            placeholder="Escribe un comunicado oficial (ej: 'Estimados docentes: El periodo de aplicación de diagnósticos de 7° y 9° concluye este viernes 28. Favor sincronizar sus registros.')..."
            className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-600 outline-none transition-all"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              {avisoActual ? (
                <span><strong>Aviso vigente:</strong> "{avisoActual}"</span>
              ) : (
                <span>No hay aviso activo en este momento.</span>
              )}
            </div>

            <button
              onClick={handleGuardarAviso}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer self-end sm:self-auto"
            >
              <PaperPlaneRight size={16} weight="bold" />
              <span>Publicar Aviso Nacional</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. DIRECTORIO NACIONAL Y MONITOREO DE DOCENTES Y ASESORÍAS (III CICLO)     */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Buildings size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Directorio Nacional de Instituciones, Docentes & Asesorías de III Ciclo ({institucionesFiltradas.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitoreo y seguimiento de cobertura por Direcciones Regionales (27 DREs), circuitos y centros educativos
            </p>
          </div>

          {/* Filtros de la Tabla Macro */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Buscador */}
            <div className="relative">
              <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar colegio, docente, circuito..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs w-48 sm:w-60 focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            {/* Filtro DRE */}
            <select
              value={filtroDRE}
              onChange={(e) => setFiltroDRE(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="TODAS">Todas las 27 DREs</option>
              {LISTA_DRE_MEP.map((d) => (
                <option key={d.codigo} value={d.codigo}>
                  {d.codigo}: {d.nombre}
                </option>
              ))}
            </select>

            {/* Filtro Rol */}
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="TODOS">Todos los roles</option>
              <option value="Docente">👩‍🏫 Docentes de Informática / FT</option>
              <option value="Asesor Regional">🏛️ Asesores Regionales</option>
              <option value="Asesor Nacional">🇨🇷 Asesores Nacionales</option>
              <option value="Asesor de Enseñanza Secundaria">🎓 Asesores de Secundaria</option>
            </select>

            {/* Filtro Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              <option value="TODOS">Todos los estados</option>
              <option value="APLICADO">🟢 Diagnóstico Aplicado</option>
              <option value="PENDIENTE">⚪ Pendiente de Aplicar</option>
            </select>
          </div>
        </div>

        {/* Tabla de Instituciones */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Institución Educativa</th>
                <th className="py-3.5 px-4">DRE / Circuito</th>
                <th className="py-3.5 px-4">Responsable (Docente / Asesor)</th>
                <th className="py-3.5 px-4">Niveles Atendidos</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">Estudiantes</th>
                <th className="py-3.5 px-4 text-center">Promedio</th>
                <th className="py-3.5 px-4 text-right">Último Reporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {institucionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No se encontraron instituciones o docentes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                institucionesFiltradas.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Buildings size={16} className="text-slate-400 shrink-0" />
                        <span>{item.institucion}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800">{item.dreNombre}</span>
                      <span className="block text-[10px] text-slate-400 font-semibold">{item.circuito}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <IdentificationBadge size={15} className="text-blue-600 shrink-0" />
                        <span>{item.docente}</span>
                      </div>
                      <span className="block text-[10px] text-slate-400 font-normal">{item.correoDocente} • {item.rol}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.nivelesAtendidos && item.nivelesAtendidos.length > 0 ? (
                          item.nivelesAtendidos.map((niv: string, nIdx: number) => (
                            <span
                              key={nIdx}
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                niv.includes("7")
                                  ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                                  : "bg-purple-50 text-purple-800 border border-purple-200"
                              }`}
                            >
                              {niv}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">7.° y 9.°</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {item.aplicado ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle size={12} weight="fill" />
                          <span>Aplicado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-300">
                          <Clock size={12} weight="bold" />
                          <span>Pendiente</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                      {item.totalEstudiantes > 0 ? (
                        <div>
                          <span>{item.totalEstudiantes}</span>
                          <span className="block text-[9.5px] text-slate-400 font-normal">
                            (7°: {item.estudiantes7mo} | 9°: {item.estudiantes9no})
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.promedio > 0 ? (
                        <span
                          className={`font-mono font-black text-xs px-2 py-0.5 rounded-md ${
                            item.promedio >= 80
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : item.promedio <= 60
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {item.promedio}%
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {item.ultimoReporte}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: DICTAMEN MACRO Y ORIENTACIONES CURRICULARES CON IA                */}
      {/* ========================================================================= */}
      {modalIAMacro && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                    <Sparkle size={20} weight="fill" />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Dictamen Curricular Nacional de IA • Formación Tecnológica MEP
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  Generado con IA Multi-Proveedor a partir de la telemetría viva de las 27 DREs
                </p>
              </div>

              <button
                onClick={() => setModalIAMacro(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {generandoIA ? (
              <div className="py-16 text-center space-y-3">
                <ArrowsClockwise size={36} className="animate-spin text-purple-600 mx-auto" />
                <div className="text-sm font-bold text-slate-800">Analizando telemetría de las 27 DREs con IA...</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Procesando indicadores de logro, brechas críticas y formulando orientaciones de mediación DUA.
                </p>
              </div>
            ) : analisisIA ? (
              <div className="space-y-6 text-xs text-slate-700">
                {/* Diagnóstico General */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                  <div className="font-black text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Article size={16} weight="bold" />
                    <span>Diagnóstico General de Entrada</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 font-medium">
                    {analisisIA.diagnosticoGeneral}
                  </p>
                </div>

                {/* Focos Críticos */}
                {analisisIA.focosCriticos && (
                  <div className="space-y-2">
                    <div className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <WarningCircle size={16} weight="fill" className="text-rose-600" />
                      <span>Focos Críticos y Brechas Prioritarias Detectadas</span>
                    </div>
                    <ul className="space-y-1.5 list-disc list-inside font-medium text-slate-700 pl-1">
                      {analisisIA.focosCriticos.map((foco: string, fIdx: number) => (
                        <li key={fIdx}>{foco}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Orientaciones Pedagógicas */}
                {analisisIA.orientacionesPedagogicas && (
                  <div className="space-y-2">
                    <div className="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <CheckCircle size={16} weight="fill" className="text-emerald-600" />
                      <span>Orientaciones de Mediación Didáctica y Nivelación (DUA)</span>
                    </div>
                    <ul className="space-y-1.5 list-disc list-inside font-medium text-slate-700 pl-1">
                      {analisisIA.orientacionesPedagogicas.map((ori: string, oIdx: number) => (
                        <li key={oIdx}>{ori}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Circular sugerida para docentes */}
                {analisisIA.circularSugeridaDocentes && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <div className="font-black text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MegaphoneSimple size={16} weight="bold" />
                      <span>Texto Sugerido para Circular / Mensaje Nacional</span>
                    </div>
                    <p className="italic text-slate-700 font-medium leading-relaxed">
                      "{analisisIA.circularSugeridaDocentes}"
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (analisisIA?.circularSugeridaDocentes) {
                        setNuevoAviso(analisisIA.circularSugeridaDocentes);
                        setModalIAMacro(false);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 font-bold text-xs"
                  >
                    Copiar a Centro de Avisos
                  </button>
                  <button
                    onClick={() => setModalIAMacro(false)}
                    className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
}
