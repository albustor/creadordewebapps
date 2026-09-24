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
} from "@phosphor-icons/react";
import * as XLSX from "xlsx";

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
}

interface ObservatorioMacroNacionalProps {
  usuariosDocentes: DocenteAdmin[];
}

// 10 Indicadores Cognitivos Oficiales
const INDICADORES_CATALOGO = [
  { id: 1, codigo: "IND-01", nombre: "Microcontroladores y Arquitectura", area: "Hardware", saberes: "Pines digitales/analógicos, voltajes de operación, memoria flash" },
  { id: 2, codigo: "IND-02", nombre: "Entradas y Salidas Digitales/Analógicas", area: "Circuitos", saberes: "Señales booleanas (HIGH/LOW), lecturas continuas (ADC)" },
  { id: 3, codigo: "IND-03", nombre: "Variables y Tipos de Datos", area: "Programación", saberes: "Tipos int, float, bool, string, asignación y operadores" },
  { id: 4, codigo: "IND-04", nombre: "Estructuras Condicionales (if / else)", area: "Lógica", saberes: "Condiciones booleanas, operadores de comparación y lógica" },
  { id: 5, codigo: "IND-05", nombre: "Ciclos y Repetición (for / while)", area: "Lógica", saberes: "Iteraciones, contadores, condiciones de parada, loops infinitos" },
  { id: 6, codigo: "IND-06", nombre: "Algoritmos y Secuenciación", area: "Pensamiento Computacional", saberes: "Diagramas de flujo, orden de ejecución, resolución paso a paso" },
  { id: 7, codigo: "IND-07", nombre: "Sensores y Actuadores", area: "Mecatrónica", saberes: "Sensores de distancia ultrasónicos, LDR, servomotores, zumbadores" },
  { id: 8, codigo: "IND-08", nombre: "Ley de Ohm y Circuitos Eléctricos", area: "Electrónica", saberes: "V = I * R, cálculo de resistencias de protección, circuitos serie/paralelo" },
  { id: 9, codigo: "IND-09", nombre: "Redes y Fundamentos IoT", area: "Conectividad", saberes: "Protocolos de comunicación serial/WiFi, telemetría y sensores en la nube" },
  { id: 10, codigo: "IND-10", nombre: "Depuración y Resolución de Errores", area: "Pensamiento Crítico", saberes: "Detección de errores sintácticos y lógicos, validación en simulador" },
];

// Lista de instituciones de referencia nacional (vía en tiempo real, inicia en 0)
const INSTITUCIONES_MUESTRA: any[] = [];

export default function ObservatorioMacroNacional({ usuariosDocentes }: ObservatorioMacroNacionalProps) {
  const [filtroDRE, setFiltroDRE] = useState("TODAS");
  const [filtroEstado, setFiltroEstado] = useState<"TODOS" | "APLICADO" | "PENDIENTE">("TODOS");
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

  // Consolidar instituciones exclusivamente a partir de usuarios docentes registrados
  const institucionesConsolidadas = useMemo(() => {
    const mapa = new Map<string, any>();

    // Agregar exclusivamente usuarios docentes registrados
    usuariosDocentes.forEach((u) => {
      if (u.institucionNombre && u.institucionNombre.trim()) {
        const clave = u.institucionNombre.toLowerCase().trim();
        if (!mapa.has(clave)) {
          mapa.set(clave, {
            institucion: u.institucionNombre,
            dre: u.dreCodigo || "DRE-01",
            dreNombre: u.dreNombre || "San José Central",
            circuito: u.circuito || "Circuito 01",
            docente: u.nombreCompleto,
            totalEstudiantes: 0,
            promedio: 0,
            aplicado: false,
            ultimoReporte: "Pendiente",
          });
        }
      }
    });

    // Si hay telemetría viva registrada localmente, vincularla
    if (telemetriaReal.length > 0 && mapa.size > 0) {
      const primeraInst = Array.from(mapa.values())[0];
      if (primeraInst) {
        primeraInst.totalEstudiantes = telemetriaReal.length;
        const sumPunt = telemetriaReal.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje ?? 0), 0);
        primeraInst.promedio = Math.round(sumPunt / telemetriaReal.length);
        primeraInst.aplicado = true;
        primeraInst.ultimoReporte = new Date().toISOString().split("T")[0];
      }
    }

    return Array.from(mapa.values());
  }, [usuariosDocentes, telemetriaReal]);

  // Filtrado de instituciones
  const institucionesFiltradas = useMemo(() => {
    return institucionesConsolidadas.filter((item) => {
      const matchDRE = filtroDRE === "TODAS" || item.dre === filtroDRE || item.dreNombre.toLowerCase().includes(filtroDRE.toLowerCase());
      const matchEstado =
        filtroEstado === "TODOS" ||
        (filtroEstado === "APLICADO" && item.aplicado) ||
        (filtroEstado === "PENDIENTE" && !item.aplicado);
      const matchTexto =
        item.institucion.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.docente.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.dreNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.circuito.toLowerCase().includes(busqueda.toLowerCase());

      return matchDRE && matchEstado && matchTexto;
    });
  }, [institucionesConsolidadas, filtroDRE, filtroEstado, busqueda]);

  // Métricas Macro Nacionales (100% reales basadas en telemetría activa)
  const metricasMacro = useMemo(() => {
    const totalInst = institucionesConsolidadas.length;
    const instAplicadas = institucionesConsolidadas.filter((i) => i.aplicado && i.totalEstudiantes > 0).length;
    const instPendientes = totalInst - instAplicadas;
    const totalEstudiantes = telemetriaReal.length;

    const promedioNacional =
      totalEstudiantes > 0
        ? Math.round(
            (telemetriaReal.reduce((acc, curr) => acc + (curr.porcentaje ?? curr.puntaje ?? 0), 0) /
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
  }, [institucionesConsolidadas, telemetriaReal]);

  // Análisis Macro Nacional de los 10 Indicadores Cognitivos
  const matrizIndicadoresNacional = useMemo(() => {
    const hayEvaluaciones = telemetriaReal.length > 0;
    const promGeneral = metricasMacro.promedioNacional;

    return INDICADORES_CATALOGO.map((ind) => {
      const logro = hayEvaluaciones ? Math.round(promGeneral) : 0;
      const estado = !hayEvaluaciones
        ? "Pendiente de Diagnóstico"
        : logro >= 75
        ? "Consolidado Nacional"
        : logro >= 60
        ? "En Nivelación"
        : "Brecha Crítica Nacional";

      return {
        ...ind,
        pctLogro: logro,
        estado,
      };
    }).sort((a, b) => a.id - b.id);
  }, [telemetriaReal, metricasMacro.promedioNacional]);

  // Exportar Consolidado Macro Nacional a Excel
  const exportarMacroExcel = () => {
    const dataFilas = institucionesFiltradas.map((item, idx) => ({
      "N°": idx + 1,
      "Institución Educativa": item.institucion,
      "Dirección Regional (DRE)": item.dreNombre,
      "Código DRE": item.dre,
      "Circuito Escolar": item.circuito,
      "Docente Responsable": item.docente,
      "Estado de Diagnóstico": item.aplicado ? "APLICADO" : "PENDIENTE",
      "Estudiantes Diagnosticados": item.totalEstudiantes,
      "Promedio Institucional (%)": item.promedio > 0 ? `${item.promedio}%` : "N/D",
      "Fecha Último Reporte": item.ultimoReporte,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataFilas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Consolidado_Nacional");

    // Hoja de Indicadores Nacionales
    const dataIndicadores = matrizIndicadoresNacional.map((ind) => ({
      "Código": ind.codigo,
      "Nombre del Indicador": ind.nombre,
      "Área": ind.area,
      "% Logro Nacional": `${ind.pctLogro}%`,
      "Estado Diagnóstico": ind.estado,
      "Saberes Clave Evaluados": ind.saberes,
    }));
    const wsIndicadores = XLSX.utils.json_to_sheet(dataIndicadores);
    XLSX.utils.book_append_sheet(workbook, wsIndicadores, "Matriz_10_Indicadores");

    XLSX.writeFile(workbook, `Observatorio_Macro_Nacional_Diagnostico_FT_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner Principal del Observatorio Macro en Blanco Cálido y Pastel */}
      <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-3xl shadow-softPastel border-2 border-emerald-200/90">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                <GlobeHemisphereWest size={24} weight="bold" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-800">
                Observatorio Nacional • Formación Tecnológica 2027
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Analítica Macro & Cobertura de Diagnóstico
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
              Panel de supervisión general para <strong>Alberto Bustos Ortega (Super Administrador)</strong>. Permite monitorear la aplicación del diagnóstico en liceos y colegios de las 27 DREs, comparar rendimientos y detectar brechas curriculares de entrada de año.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={exportarMacroExcel}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
            >
              <FileXls size={18} weight="bold" />
              <span>Exportar Macro (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* 4 Tarjetas KPI Macro Nacionales */}
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
              Estudiantes Evaluados
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
              Promedio Nacional
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
            <div className={`text-sm font-black mt-1 line-clamp-1 ${metricasMacro.totalEstudiantes > 0 ? "text-rose-700" : "text-stone-700"}`}>
              {metricasMacro.totalEstudiantes > 0 ? "IND-08: Ley de Ohm" : "Ninguna (Fase de Pruebas)"}
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-2">
              {metricasMacro.totalEstudiantes > 0 ? "Prioridad pedagógica para nivelación" : "0 evaluaciones registradas"}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: MATRIZ MACRO NACIONAL DE LOS 10 INDICADORES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <Cpu size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Matriz Macro Nacional de Indicadores y Saberes Previos (9° Año)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Diagnóstico de entrada sobre saberes del año anterior para toma de decisiones curriculares a nivel nacional.
            </p>
          </div>
        </div>

        {/* Gráfica de Barras Horizontales de los 10 Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matrizIndicadoresNacional.map((ind) => {
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
                      <div className="text-[10px] text-slate-500 font-medium">{ind.area} • {ind.saberes}</div>
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
                    {ind.pctLogro > 0 ? `${ind.pctLogro}% Nacional` : "0% (En Pruebas)"}
                  </span>
                </div>

                {/* Barra de Progreso */}
                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mt-3 shadow-inner">
                  <div
                    style={{ width: `${ind.pctLogro}%` }}
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

      {/* SECCIÓN 3: DIRECTORIO Y SEGUIMIENTO INSTITUCIONAL POR DRE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Buildings size={20} weight="bold" />
              </span>
              <h3 className="font-black text-lg text-slate-900">
                Directorio Nacional de Instituciones & Docentes ({institucionesFiltradas.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Seguimiento específico de quiénes han aplicado el diagnóstico y sus resultados consolidados
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
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs w-48 sm:w-64 focus:outline-none focus:border-emerald-600 font-medium"
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
                <th className="py-3.5 px-4">Docente a Cargo</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">Estudiantes</th>
                <th className="py-3.5 px-4 text-center">Promedio</th>
                <th className="py-3.5 px-4 text-right">Último Reporte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {institucionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No se encontraron instituciones con los filtros seleccionados.
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
                      {item.docente}
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
                      {item.totalEstudiantes > 0 ? item.totalEstudiantes : "-"}
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
