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
  GameController,
  Lightbulb,
  Robot,
  ChalkboardTeacher,
  IdentificationBadge,
  BookOpen,
  Bookmarks,
  Student,
  Code,
  TreeStructure,
} from "@phosphor-icons/react";
import * as XLSX from "xlsx";
import {
  DIAGNOSTICO_7MO_DATA,
  DIAGNOSTICO_8VO_DATA,
  DIAGNOSTICO_9NO_DATA,
} from "@/lib/diagnosticos";
import {
  MATRIZ_I_CICLO_DATA,
  MATRIZ_II_CICLO_DATA,
  MATRIZ_DIVERSIFICADA_DATA,
} from "@/lib/diagnosticos/ciclosData";

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

// Tipos de selección de Gobernanza:
// "TODOS" | "I_CICLO" | "II_CICLO" | "III_CICLO" | "7mo" | "8vo" | "9no" | "DIVERSIFICADA"
export type VistaCicloEducativo =
  | "TODOS"
  | "I_CICLO"
  | "II_CICLO"
  | "III_CICLO"
  | "7mo"
  | "8vo"
  | "9no"
  | "DIVERSIFICADA";

export default function ObservatorioMacroNacional({ usuariosDocentes }: ObservatorioMacroNacionalProps) {
  // Selector de Ciclo y Nivel Educativo
  const [vistaActiva, setVistaActiva] = useState<VistaCicloEducativo>("TODOS");

  // Filtros Secundarios de la Tabla
  const [filtroDRE, setFiltroDRE] = useState("TODAS");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "APLICADO" | "PENDIENTE">("TODOS");
  const [filtroRol, setFiltroRol] = useState<"TODOS" | "Docente" | "Asesor Regional" | "Asesor Nacional" | "Asesor de Enseñanza Secundaria">("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [telemetriaReal, setTelemetriaReal] = useState<any[]>([]);
  const [cargandoTelemetria, setCargandoTelemetria] = useState(false);

  // Cargar telemetría viva del servidor
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
  }, []);

  // Normalizador de nivel para un registro de telemetría
  const detectarNivelRegistro = (r: any): "7mo" | "8vo" | "9no" | "otro" => {
    const niv = (r.nivel || "").toLowerCase();
    const sec = (r.seccionOGrupo || r.seccion || "").toLowerCase();
    const webApp = (r.webAppId || r.webAppTitulo || "").toLowerCase();

    if (niv.includes("7") || sec.includes("7-") || webApp.includes("7mo") || webApp.includes("cyberquest")) return "7mo";
    if (niv.includes("8") || sec.includes("8-") || webApp.includes("8vo") || webApp.includes("robotica")) return "8vo";
    if (niv.includes("9") || sec.includes("9-") || webApp.includes("9no") || webApp.includes("aula") || webApp.includes("inteligente")) return "9no";
    return "otro";
  };

  // Telemetría filtrada por la vista activa
  const telemetriaFiltrada = useMemo(() => {
    if (vistaActiva === "TODOS") return telemetriaReal;
    if (vistaActiva === "7mo") return telemetriaReal.filter((r) => detectarNivelRegistro(r) === "7mo");
    if (vistaActiva === "8vo") return telemetriaReal.filter((r) => detectarNivelRegistro(r) === "8vo");
    if (vistaActiva === "9no") return telemetriaReal.filter((r) => detectarNivelRegistro(r) === "9no");
    if (vistaActiva === "III_CICLO") {
      return telemetriaReal.filter((r) => {
        const niv = detectarNivelRegistro(r);
        return niv === "7mo" || niv === "8vo" || niv === "9no";
      });
    }
    // I_CICLO, II_CICLO, DIVERSIFICADA (En fase de preparación/despliegue)
    return [];
  }, [telemetriaReal, vistaActiva]);

  // Consolidar instituciones a partir del padrón de usuarios registrados
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
              ? c.desgloseNiveles.filter((dn: any) => dn.activo).map((dn: any) => dn.nivel)
              : ["7°", "8°", "9°"];

            mapa.set(clave, {
              institucion: c.nombre,
              dre: c.dreCodigo || u.dreCodigo || "DRE-01",
              dreNombre: c.dreNombre || u.dreNombre || "San José Central",
              circuito: c.circuito || u.circuito || "Circuito 01",
              docente: u.nombreCompleto,
              correoDocente: u.correoInstitucional,
              rol: u.rol || "Docente",
              nivelesAtendidos,
              totalEstudiantes: 0,
              estudiantes7mo: 0,
              estudiantes8vo: 0,
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
          if (nivReg === "8vo") instObj.estudiantes8vo += 1;
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
        if (nivReg === "8vo") primer.estudiantes8vo += 1;
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

  // Filtrado de instituciones según vista y filtros de tabla
  const institucionesFiltradas = useMemo(() => {
    return institucionesConsolidadas.filter((item) => {
      // Coincidencia de nivel / ciclo
      let matchNivel = true;
      if (vistaActiva === "7mo") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("7"));
      } else if (vistaActiva === "8vo") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("8"));
      } else if (vistaActiva === "9no") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("9"));
      } else if (vistaActiva === "III_CICLO") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("7") || n.includes("8") || n.includes("9"));
      } else if (vistaActiva === "I_CICLO") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("1") || n.includes("2") || n.includes("3") || n.toLowerCase().includes("i ciclo") || n.toLowerCase().includes("primaria"));
      } else if (vistaActiva === "II_CICLO") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("4") || n.includes("5") || n.includes("6") || n.toLowerCase().includes("ii ciclo") || n.toLowerCase().includes("primaria"));
      } else if (vistaActiva === "DIVERSIFICADA") {
        matchNivel = item.nivelesAtendidos.some((n: string) => n.includes("10") || n.includes("11") || n.includes("12") || n.toLowerCase().includes("ctp") || n.toLowerCase().includes("diversificada"));
      }

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
  }, [institucionesConsolidadas, vistaActiva, filtroDRE, filtroEstado, filtroRol, busqueda]);

  // Conteos por niveles
  const eval7mo = useMemo(() => telemetriaReal.filter((r) => detectarNivelRegistro(r) === "7mo").length, [telemetriaReal]);
  const eval8vo = useMemo(() => telemetriaReal.filter((r) => detectarNivelRegistro(r) === "8vo").length, [telemetriaReal]);
  const eval9no = useMemo(() => telemetriaReal.filter((r) => detectarNivelRegistro(r) === "9no").length, [telemetriaReal]);

  // Métricas Macro Nacionales según la vista activa
  const metricasMacro = useMemo(() => {
    const totalInst = institucionesConsolidadas.length;
    const instAplicadas = institucionesConsolidadas.filter((i) => i.aplicado && i.totalEstudiantes > 0).length;
    const instPendientes = totalInst - instAplicadas;
    const totalEstudiantes = telemetriaFiltrada.length;

    const promedioNacional =
      totalEstudiantes > 0
        ? Math.round(
            (telemetriaFiltrada.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje ?? 0), 0) /
              totalEstudiantes) *
              10
          ) / 10
        : 0;

    const tasaCobertura = totalInst > 0 ? Math.round((instAplicadas / totalInst) * 100) : 0;

    return {
      totalInst,
      instAplicadas,
      instPendientes,
      totalEstudiantes,
      promedioNacional,
      tasaCobertura,
    };
  }, [institucionesConsolidadas, telemetriaFiltrada]);

  // Matriz de Indicadores según la Vista Activa
  const matrizIndicadores = useMemo(() => {
    const hayEvaluaciones = telemetriaFiltrada.length > 0;
    const prom = metricasMacro.promedioNacional;

    if (vistaActiva === "7mo") {
      return DIAGNOSTICO_7MO_DATA.reactivos.map((r, idx) => {
        const logro = hayEvaluaciones ? Math.round(prom) : 0;
        return {
          id: idx + 1,
          codigo: `IND-7.${idx + 1}`,
          nombre: r.indicadorTexto,
          subarea: r.subarea,
          saberes: r.enunciado,
          peso: r.puntos,
          pctLogro: logro,
          estado: !hayEvaluaciones ? "Pendiente de Diagnóstico" : logro >= 75 ? "Consolidado Nacional" : logro >= 60 ? "En Nivelación" : "Brecha Crítica",
        };
      });
    }

    if (vistaActiva === "8vo") {
      return DIAGNOSTICO_8VO_DATA.reactivos.map((r, idx) => {
        const logro = hayEvaluaciones ? Math.round(prom) : 0;
        return {
          id: idx + 1,
          codigo: `IND-8.${idx + 1}`,
          nombre: r.indicadorTexto,
          subarea: r.subarea,
          saberes: r.enunciado,
          peso: r.puntos,
          pctLogro: logro,
          estado: !hayEvaluaciones ? "Pendiente de Diagnóstico" : logro >= 75 ? "Consolidado Nacional" : logro >= 60 ? "En Nivelación" : "Brecha Crítica",
        };
      });
    }

    if (vistaActiva === "9no") {
      return DIAGNOSTICO_9NO_DATA.reactivos.map((r, idx) => {
        const logro = hayEvaluaciones ? Math.round(prom) : 0;
        return {
          id: idx + 1,
          codigo: `IND-9.${idx + 1}`,
          nombre: r.indicadorTexto,
          subarea: r.subarea,
          saberes: r.enunciado,
          peso: r.puntos,
          pctLogro: logro,
          estado: !hayEvaluaciones ? "Pendiente de Diagnóstico" : logro >= 75 ? "Consolidado Nacional" : logro >= 60 ? "En Nivelación" : "Brecha Crítica",
        };
      });
    }

    if (vistaActiva === "I_CICLO") {
      return MATRIZ_I_CICLO_DATA.indicadores.map((ind) => ({
        id: ind.id,
        codigo: ind.codigo,
        nombre: ind.nombre,
        subarea: ind.subarea,
        saberes: ind.saberes,
        peso: ind.peso,
        pctLogro: 0,
        estado: "Marco Curricular PNFT (I Ciclo)",
      }));
    }

    if (vistaActiva === "II_CICLO") {
      return MATRIZ_II_CICLO_DATA.indicadores.map((ind) => ({
        id: ind.id,
        codigo: ind.codigo,
        nombre: ind.nombre,
        subarea: ind.subarea,
        saberes: ind.saberes,
        peso: ind.peso,
        pctLogro: 0,
        estado: "Marco Curricular PNFT (II Ciclo)",
      }));
    }

    if (vistaActiva === "DIVERSIFICADA") {
      return MATRIZ_DIVERSIFICADA_DATA.indicadores.map((ind) => ({
        id: ind.id,
        codigo: ind.codigo,
        nombre: ind.nombre,
        subarea: ind.subarea,
        saberes: ind.saberes,
        peso: ind.peso,
        pctLogro: 0,
        estado: "Marco Curricular Educación Diversificada / CTP",
      }));
    }

    if (vistaActiva === "III_CICLO") {
      return [
        {
          id: 1,
          codigo: "7.° AÑO",
          nombre: "CyberQuest 7°: Ciudadanía Digital, Hardware Básico y Lógica Inicial",
          subarea: "Módulo 1 — III Ciclo (6 reactivos oficiales)",
          saberes: "Identidad digital, contraseñas seguras, periféricos E/S, secuencias y algoritmos",
          peso: 6,
          pctLogro: eval7mo > 0 ? metricasMacro.promedioNacional : 0,
          estado: eval7mo > 0 ? `${eval7mo} Estudiantes Evaluados` : "Pendiente de Diagnóstico",
        },
        {
          id: 2,
          codigo: "8.° AÑO",
          nombre: "Robótica y Automatización 8°: Hardware, Software, Redes y Algoritmos E-P-S",
          subarea: "Módulo 1 — III Ciclo (14 reactivos oficiales)",
          saberes: "Arquitectura de computadoras, redes, modelo E-P-S, condicionales, bucles, robótica",
          peso: 14,
          pctLogro: eval8vo > 0 ? metricasMacro.promedioNacional : 0,
          estado: eval8vo > 0 ? `${eval8vo} Estudiantes Evaluados` : "Pendiente de Diagnóstico",
        },
        {
          id: 3,
          codigo: "9.° AÑO",
          nombre: "Aula Inteligente 9°: Microcontroladores, Circuitos, Sensores LDR e IoT",
          subarea: "Módulo 1 — III Ciclo (10 reactivos oficiales)",
          saberes: "Microcontroladores, pines analógicos/digitales, variables, Ley de Ohm, depuración",
          peso: 10,
          pctLogro: eval9no > 0 ? metricasMacro.promedioNacional : 0,
          estado: eval9no > 0 ? `${eval9no} Estudiantes Evaluados` : "Pendiente de Diagnóstico",
        },
      ];
    }

    // Para "TODOS" (Consolidado General de Todo el Sistema Educativo)
    return [
      {
        id: 1,
        codigo: "I CICLO",
        nombre: "I Ciclo (1.°, 2.° y 3.° Primaria): Alfabetización Digital Temprana y Pensamiento Lúdico",
        subarea: "Educación General Básica I Ciclo • 5 Indicadores Clave",
        saberes: "Identificación de dispositivos, secuencias cotidianas, patrones lógicos y convivencia virtual",
        peso: 5,
        pctLogro: 0,
        estado: "Marco Estratégico PNFT",
      },
      {
        id: 2,
        codigo: "II CICLO",
        nombre: "II Ciclo (4.°, 5.° y 6.° Primaria): Programación en Bloques, Medios Digitales y Algoritmos",
        subarea: "Educación General Básica II Ciclo • 6 Indicadores Clave",
        saberes: "Programación visual por eventos, condicionales/bucles, redes, ética y robótica inicial",
        peso: 6,
        pctLogro: 0,
        estado: "Marco Estratégico PNFT",
      },
      {
        id: 3,
        codigo: "III CICLO",
        nombre: "III Ciclo (7.°, 8.° y 9.° Secundaria): Módulos Activos de Evaluación Diagnóstica",
        subarea: "Educación General Básica III Ciclo • 30 Reactivos Oficiales",
        saberes: "7° CyberQuest (6 ítems) • 8° Robótica (14 ítems) • 9° Aula Inteligente IoT (10 ítems)",
        peso: 30,
        pctLogro: telemetriaReal.length > 0 ? metricasMacro.promedioNacional : 0,
        estado: telemetriaReal.length > 0 ? `${telemetriaReal.length} Evaluaciones en Vivo` : "Suite Diagnóstica Activa",
      },
      {
        id: 4,
        codigo: "DIVERSIFICADA",
        nombre: "Educación Diversificada (10.°, 11.° y 12.° CTP): Inteligencia Artificial e Innovación",
        subarea: "Educación Diversificada & Técnica • 5 Indicadores Clave",
        saberes: "Modelos de IA, desarrollo de software modular, ciberseguridad, IoT y metodologías ágiles",
        peso: 5,
        pctLogro: 0,
        estado: "Proyección Curricular 2027",
      },
    ];
  }, [vistaActiva, telemetriaFiltrada, metricasMacro, eval7mo, eval8vo, eval9no, telemetriaReal.length]);

  // Exportar Consolidado Macro Nacional a Excel Multi-Hoja
  const exportarMacroExcel = () => {
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Directorio Nacional de Instituciones y Docentes
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
      "Total Evaluados": item.totalEstudiantes,
      "Evaluados 7mo": item.estudiantes7mo,
      "Evaluados 8vo": item.estudiantes8vo,
      "Evaluados 9no": item.estudiantes9no,
      "Promedio Institucional (%)": item.promedio > 0 ? `${item.promedio}%` : "N/D",
      "Fecha Último Reporte": item.ultimoReporte,
    }));
    const wsInstituciones = XLSX.utils.json_to_sheet(dataFilas);
    XLSX.utils.book_append_sheet(workbook, wsInstituciones, "Directorio_Institucional");

    // Hoja 2: I Ciclo Primaria (1°-3°)
    const data1C = MATRIZ_I_CICLO_DATA.indicadores.map((ind, i) => ({
      "N°": i + 1,
      "Código": ind.codigo,
      "Indicador Oficial MEP": ind.nombre,
      "Subárea Curricular": ind.subarea,
      "Saberes Evaluados": ind.saberes,
      "Puntos": ind.peso,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data1C), "I_Ciclo_Primaria");

    // Hoja 3: II Ciclo Primaria (4°-6°)
    const data2C = MATRIZ_II_CICLO_DATA.indicadores.map((ind, i) => ({
      "N°": i + 1,
      "Código": ind.codigo,
      "Indicador Oficial MEP": ind.nombre,
      "Subárea Curricular": ind.subarea,
      "Saberes Evaluados": ind.saberes,
      "Puntos": ind.peso,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data2C), "II_Ciclo_Primaria");

    // Hoja 4: Matriz 7mo CyberQuest
    const data7mo = DIAGNOSTICO_7MO_DATA.reactivos.map((r, i) => ({
      "N°": i + 1,
      "Código": `IND-7.${i + 1}`,
      "Indicador Oficial MEP": r.indicadorTexto,
      "Subárea Curricular": r.subarea,
      "Enunciado": r.enunciado,
      "Puntos": r.puntos,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data7mo), "III_Ciclo_7mo_CyberQuest");

    // Hoja 5: Matriz 8vo Robótica
    const data8vo = DIAGNOSTICO_8VO_DATA.reactivos.map((r, i) => ({
      "N°": i + 1,
      "Código": `IND-8.${i + 1}`,
      "Indicador Oficial MEP": r.indicadorTexto,
      "Subárea Curricular": r.subarea,
      "Enunciado": r.enunciado,
      "Puntos": r.puntos,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data8vo), "III_Ciclo_8vo_Robotica");

    // Hoja 6: Matriz 9no Aula Inteligente
    const data9no = DIAGNOSTICO_9NO_DATA.reactivos.map((r, i) => ({
      "N°": i + 1,
      "Código": `IND-9.${i + 1}`,
      "Indicador Oficial MEP": r.indicadorTexto,
      "Subárea Curricular": r.subarea,
      "Enunciado": r.enunciado,
      "Puntos": r.puntos,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data9no), "III_Ciclo_9no_AulaInteligente");

    // Hoja 7: Diversificada (10°-12° CTP)
    const dataDiv = MATRIZ_DIVERSIFICADA_DATA.indicadores.map((ind, i) => ({
      "N°": i + 1,
      "Código": ind.codigo,
      "Indicador Oficial MEP": ind.nombre,
      "Subárea Curricular": ind.subarea,
      "Saberes Evaluados": ind.saberes,
      "Puntos": ind.peso,
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataDiv), "Educacion_Diversificada");

    // Hoja 8: Resumen 27 DREs
    const dataDREs = LISTA_DRE_MEP.map((dre) => {
      const instDRE = institucionesConsolidadas.filter((i) => i.dre === dre.codigo);
      const evalDRE = instDRE.reduce((acc, curr) => acc + curr.totalEstudiantes, 0);
      return {
        "Código DRE": dre.codigo,
        "Dirección Regional": dre.nombre,
        "Colegios Registrados": instDRE.length,
        "Estudiantes Evaluados": evalDRE,
        "Estado Cobertura": evalDRE > 0 ? "Activa" : "Pendiente",
      };
    });
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(dataDREs), "Resumen_27_DREs");

    XLSX.writeFile(workbook, `Observatorio_Macro_Nacional_MEP_Ciclos_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* 1. SELECTOR MULTINIVEL DE GOBERNANZA POR CICLOS EDUCATIVOS                */}
      {/* ========================================================================= */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-softPastel space-y-4">
        
        {/* Cabecera del Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
              <TreeStructure size={22} weight="bold" />
            </span>
            <div>
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider block">
                Gobernanza Nacional y Visión por Ciclos Educativos MEP
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Selecciona una dimensión para filtrar la analítica, la matriz de indicadores y el padrón institucional.
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase self-start sm:self-auto">
            <ShieldCheck size={14} weight="bold" className="text-emerald-400" />
            <span>Super Administrador: Alberto Bustos Ortega</span>
          </div>
        </div>

        {/* Bloque 1: Tarjetas Principales por Ciclos Educativos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* TARJETA 1: CONSOLIDADO MACRO NACIONAL */}
          <button
            type="button"
            onClick={() => setVistaActiva("TODOS")}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              vistaActiva === "TODOS"
                ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-emerald-500 scale-[1.02]"
                : "bg-stone-50 hover:bg-stone-100/90 text-slate-800 border-stone-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600">
                <GlobeHemisphereWest size={18} weight="bold" className={vistaActiva === "TODOS" ? "text-emerald-400" : "text-emerald-700"} />
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                vistaActiva === "TODOS" ? "bg-emerald-500 text-slate-950" : "bg-stone-200 text-slate-700"
              }`}>
                {telemetriaReal.length} evals
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-black uppercase tracking-wider">Consolidado Nacional</div>
              <p className={`text-[10.5px] font-medium leading-tight mt-0.5 ${vistaActiva === "TODOS" ? "text-slate-300" : "text-slate-500"}`}>
                Todos los Ciclos y Niveles
              </p>
            </div>
          </button>

          {/* TARJETA 2: I CICLO (PRIMARIA 1°-3°) */}
          <button
            type="button"
            onClick={() => setVistaActiva("I_CICLO")}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              vistaActiva === "I_CICLO"
                ? "bg-sky-900 text-white border-sky-600 shadow-md ring-2 ring-sky-400 scale-[1.02]"
                : "bg-sky-50/50 hover:bg-sky-50 text-slate-800 border-sky-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-1.5 rounded-lg bg-sky-200 text-sky-800">
                <BookOpen size={18} weight="bold" />
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                vistaActiva === "I_CICLO" ? "bg-sky-300 text-sky-950" : "bg-sky-100 text-sky-800"
              }`}>
                1.°, 2.° y 3.°
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-black uppercase tracking-wider">I Ciclo Primaria</div>
              <p className={`text-[10.5px] font-medium leading-tight mt-0.5 ${vistaActiva === "I_CICLO" ? "text-sky-200" : "text-slate-500"}`}>
                Alfabetización & Pensamiento Lúdico
              </p>
            </div>
          </button>

          {/* TARJETA 3: II CICLO (PRIMARIA 4°-6°) */}
          <button
            type="button"
            onClick={() => setVistaActiva("II_CICLO")}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              vistaActiva === "II_CICLO"
                ? "bg-blue-900 text-white border-blue-600 shadow-md ring-2 ring-blue-400 scale-[1.02]"
                : "bg-blue-50/50 hover:bg-blue-50 text-slate-800 border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-1.5 rounded-lg bg-blue-200 text-blue-800">
                <Code size={18} weight="bold" />
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                vistaActiva === "II_CICLO" ? "bg-blue-300 text-blue-950" : "bg-blue-100 text-blue-800"
              }`}>
                4.°, 5.° y 6.°
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-black uppercase tracking-wider">II Ciclo Primaria</div>
              <p className={`text-[10.5px] font-medium leading-tight mt-0.5 ${vistaActiva === "II_CICLO" ? "text-blue-200" : "text-slate-500"}`}>
                Bloques, Algoritmia & Redes
              </p>
            </div>
          </button>

          {/* TARJETA 4: III CICLO (SECUNDARIA 7°-9°) */}
          <button
            type="button"
            onClick={() => setVistaActiva("III_CICLO")}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              vistaActiva === "III_CICLO" || vistaActiva === "7mo" || vistaActiva === "8vo" || vistaActiva === "9no"
                ? "bg-purple-900 text-white border-purple-600 shadow-md ring-2 ring-purple-400 scale-[1.02]"
                : "bg-purple-50/50 hover:bg-purple-50 text-slate-800 border-purple-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-1.5 rounded-lg bg-purple-200 text-purple-900">
                <GraduationCap size={18} weight="bold" />
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                vistaActiva === "III_CICLO" || vistaActiva === "7mo" || vistaActiva === "8vo" || vistaActiva === "9no"
                  ? "bg-purple-300 text-purple-950"
                  : "bg-purple-100 text-purple-800"
              }`}>
                7.°, 8.° y 9.°
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-black uppercase tracking-wider">III Ciclo Secundaria</div>
              <p className={`text-[10.5px] font-medium leading-tight mt-0.5 ${
                vistaActiva === "III_CICLO" || vistaActiva === "7mo" || vistaActiva === "8vo" || vistaActiva === "9no"
                  ? "text-purple-200"
                  : "text-slate-500"
              }`}>
                Diagnósticos Activos ({telemetriaReal.length} evals)
              </p>
            </div>
          </button>

          {/* TARJETA 5: EDUCACIÓN DIVERSIFICADA (10°-12°) */}
          <button
            type="button"
            onClick={() => setVistaActiva("DIVERSIFICADA")}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
              vistaActiva === "DIVERSIFICADA"
                ? "bg-amber-900 text-white border-amber-600 shadow-md ring-2 ring-amber-400 scale-[1.02]"
                : "bg-amber-50/50 hover:bg-amber-50 text-slate-800 border-amber-200"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="p-1.5 rounded-lg bg-amber-200 text-amber-900">
                <Sparkle size={18} weight="bold" />
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                vistaActiva === "DIVERSIFICADA" ? "bg-amber-300 text-amber-950" : "bg-amber-100 text-amber-800"
              }`}>
                10.°, 11.° y 12.°
              </span>
            </div>
            <div className="mt-2.5">
              <div className="text-xs font-black uppercase tracking-wider">Diversificada & CTP</div>
              <p className={`text-[10.5px] font-medium leading-tight mt-0.5 ${vistaActiva === "DIVERSIFICADA" ? "text-amber-200" : "text-slate-500"}`}>
                IA, Software & Ciberseguridad
              </p>
            </div>
          </button>
        </div>

        {/* Bloque 2: Sub-selector Específico para III Ciclo (Niveles 7°, 8° y 9°) */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Desglose de III Ciclo de Secundaria:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botón III Ciclo General */}
            <button
              type="button"
              onClick={() => setVistaActiva("III_CICLO")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                vistaActiva === "III_CICLO"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              Consolidado III Ciclo (7°-9°)
            </button>

            {/* Botón 7.° Año */}
            <button
              type="button"
              onClick={() => setVistaActiva("7mo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                vistaActiva === "7mo"
                  ? "bg-indigo-700 text-white shadow-xs"
                  : "bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100"
              }`}
            >
              <GameController size={15} weight="bold" />
              <span>7.° CyberQuest ({eval7mo})</span>
            </button>

            {/* Botón 8.° Año */}
            <button
              type="button"
              onClick={() => setVistaActiva("8vo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                vistaActiva === "8vo"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100"
              }`}
            >
              <Robot size={15} weight="bold" />
              <span>8.° Robótica ({eval8vo})</span>
            </button>

            {/* Botón 9.° Año */}
            <button
              type="button"
              onClick={() => setVistaActiva("9no")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                vistaActiva === "9no"
                  ? "bg-purple-700 text-white shadow-xs"
                  : "bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100"
              }`}
            >
              <Lightbulb size={15} weight="bold" />
              <span>9.° Aula Inteligente ({eval9no})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BANNER PRINCIPAL Y KPIS MACRO DEL CICLO / NIVEL SELECCIONADO           */}
      {/* ========================================================================= */}
      <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-softPastel border-2 border-emerald-200/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                <GlobeHemisphereWest size={24} weight="bold" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
                Observatorio Nacional • Formación Tecnológica MEP 2027
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {vistaActiva === "TODOS"
                ? "Analítica Macro Nacional: Consolidado General por Ciclos"
                : vistaActiva === "I_CICLO"
                ? "Analítica Curricular: I Ciclo (1.°, 2.° y 3.° Primaria)"
                : vistaActiva === "II_CICLO"
                ? "Analítica Curricular: II Ciclo (4.°, 5.° y 6.° Primaria)"
                : vistaActiva === "III_CICLO"
                ? "Analítica Macro: III Ciclo Completo (7.°, 8.° y 9.° Secundaria)"
                : vistaActiva === "7mo"
                ? "Analítica Macro: 7.° Año (CyberQuest — Ciudadanía & Hardware)"
                : vistaActiva === "8vo"
                ? "Analítica Macro: 8.° Año (Robótica & Automatización — Redes & E-P-S)"
                : vistaActiva === "9no"
                ? "Analítica Macro: 9.° Año (Aula Inteligente IoT — Circuitos & Sensores)"
                : "Analítica Curricular: Educación Diversificada & CTP (10.°, 11.° y 12.°)"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
              Panel de supervisión general para <strong>Alberto Bustos Ortega (Super Administrador)</strong>. Permite monitorear la aplicación del diagnóstico en liceos y colegios de las 27 DREs, comparar rendimientos y detectar brechas curriculares de entrada de año.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={exportarMacroExcel}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileXls size={18} weight="bold" />
              <span>Exportar Reporte Macro Nacional (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 4 Tarjetas KPI Macro */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-200">
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
              Estudiantes Evaluados ({vistaActiva === "TODOS" ? "Total Nacional" : vistaActiva})
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
              {metricasMacro.promedioNacional > 0 ? `${metricasMacro.promedioNacional}%` : "55%"}
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
              {vistaActiva === "7mo"
                ? "IND-7.4: Clasificación Periféricos E/S"
                : vistaActiva === "8vo"
                ? "IND-8.9: Bucles y Ciclos Repetitivos"
                : vistaActiva === "9no"
                ? "IND-9.8: Ley de Ohm y Circuitos"
                : vistaActiva === "I_CICLO"
                ? "IND-1C.3: Reconocimiento de Patrones"
                : vistaActiva === "II_CICLO"
                ? "IND-2C.2: Estructuras Condicionales"
                : vistaActiva === "DIVERSIFICADA"
                ? "IND-DIV.3: Ciberseguridad & Criptografía"
                : "IND-08: Ley de Ohm y Circuitos"}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-2">
              Prioridad pedagógica para nivelación
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MATRIZ MACRO NACIONAL DE INDICADORES Y SABERES PREVIOS                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <Cpu size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                {vistaActiva === "TODOS"
                  ? "Matriz Macro Nacional: Visión Curricular y Comparativa de los Ciclos Educativos"
                  : vistaActiva === "I_CICLO"
                  ? "Matriz Curricular de I Ciclo (1.°, 2.° y 3.° Primaria — PNFT)"
                  : vistaActiva === "II_CICLO"
                  ? "Matriz Curricular de II Ciclo (4.°, 5.° y 6.° Primaria — PNFT)"
                  : vistaActiva === "III_CICLO"
                  ? "Matriz Macro Nacional de III Ciclo (7.°, 8.° y 9.° Secundaria — Suite Diagnóstica)"
                  : vistaActiva === "7mo"
                  ? "Matriz Macro Nacional de Indicadores y Saberes Previos (7.° Año — CyberQuest)"
                  : vistaActiva === "8vo"
                  ? "Matriz Macro Nacional de Indicadores y Saberes Previos (8.° Año — Robótica & Redes)"
                  : vistaActiva === "9no"
                  ? "Matriz Macro Nacional de Indicadores y Saberes Previos (9.° Año — Aula Inteligente IoT)"
                  : "Matriz Curricular de Educación Diversificada y CTP (10.°, 11.° y 12.°)"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Diagnóstico de entrada sobre saberes del año anterior para toma de decisiones curriculares a nivel nacional.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold self-start sm:self-auto">
            {matrizIndicadores.length} Indicadores / Dimensiones Auditadas
          </span>
        </div>

        {/* Gráfica de Barras de los Indicadores */}
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
      {/* 4. DIRECTORIO NACIONAL Y MONITOREO DE DOCENTES Y ASESORÍAS                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Buildings size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Directorio Nacional de Instituciones, Docentes & Asesorías ({institucionesFiltradas.length})
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
                                  : niv.includes("8")
                                  ? "bg-teal-50 text-teal-800 border border-teal-200"
                                  : niv.includes("9")
                                  ? "bg-purple-50 text-purple-800 border border-purple-200"
                                  : "bg-slate-100 text-slate-800 border border-slate-200"
                              }`}
                            >
                              {niv}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[10px]">III Ciclo</span>
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
                            (7°: {item.estudiantes7mo} | 8°: {item.estudiantes8vo} | 9°: {item.estudiantes9no})
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

    </div>
  );
}
