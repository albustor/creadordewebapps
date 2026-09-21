"use client";

import React, { useState, useMemo } from "react";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { ConfiguracionDashboardDocente } from "./ConfiguradorInstrumentoDashboard";
import {
  ChartBar,
  ChartPie,
  TrendUp,
  WarningCircle,
  CheckCircle,
  UsersThree,
  Cpu,
  Clock,
  Sparkle,
  Funnel,
  CaretRight,
  Gauge,
  Lightning,
} from "@phosphor-icons/react";

interface GraficasSeccionesProps {
  registros: PayloadTelemetria[];
  configuracion: ConfiguracionDashboardDocente;
  seccionSeleccionada?: string;
  onSeleccionarSeccion?: (seccion: string) => void;
}

// Catálogo oficial de los 10 Indicadores Cognitivos
const INDICADORES_CATALOGO = [
  { id: 1, codigo: "IND-01", nombre: "Microcontroladores y Arquitectura", area: "Hardware", descripcion: "Identificación de pines, voltajes y función de la placa" },
  { id: 2, codigo: "IND-02", nombre: "Entradas y Salidas Digitales/Analógicas", area: "Circuitos", descripcion: "Diferenciación entre señales discretas y continuas" },
  { id: 3, codigo: "IND-03", nombre: "Variables y Tipos de Datos", area: "Programación", descripcion: "Manejo de variables numéricas, booleanas y de texto" },
  { id: 4, codigo: "IND-04", nombre: "Estructuras Condicionales (if / else)", area: "Lógica", descripcion: "Toma de decisiones lógicas según lectura de sensores" },
  { id: 5, codigo: "IND-05", nombre: "Ciclos y Repetición (for / while)", area: "Lógica", descripcion: "Automatización de secuencias e iteraciones de código" },
  { id: 6, codigo: "IND-06", nombre: "Algoritmos y Secuenciación", area: "Pensamiento Computacional", descripcion: "Planificación paso a paso para resolver un problema" },
  { id: 7, codigo: "IND-07", nombre: "Sensores y Actuadores", area: "Mecatrónica", descripcion: "Integración de sensores ultrasónicos, luz y servomotores" },
  { id: 8, codigo: "IND-08", nombre: "Ley de Ohm y Análisis de Circuitos", area: "Electrónica", descripcion: "Cálculo de voltaje, corriente y dimensionamiento de resistencias" },
  { id: 9, codigo: "IND-09", nombre: "Redes y Fundamentos IoT", area: "Conectividad", descripcion: "Protocolos de comunicación y telemetría de dispositivos" },
  { id: 10, codigo: "IND-10", nombre: "Depuración y Resolución de Errores", area: "Pensamiento Crítico", descripcion: "Detección y corrección de bugs en hardware y código" },
];

export default function GraficasSecciones({
  registros,
  configuracion,
  seccionSeleccionada = "Todos",
  onSeleccionarSeccion,
}: GraficasSeccionesProps) {
  const [vistaActiva, setVistaActiva] = useState<"secciones" | "indicadores" | "distribucion">("secciones");
  const [seccionDetalle, setSeccionDetalle] = useState<string>("Todas");

  const minAvanzado = configuracion?.umbralAvanzadoMin ?? 80;
  const maxInicial = configuracion?.umbralInicialMax ?? 59;

  // Agrupación y cálculo analítico por sección
  const datosPorSeccion = useMemo(() => {
    const mapa = new Map<
      string,
      {
        nombre: string;
        total: number;
        sumaPuntajes: number;
        avanzados: number;
        intermedios: number;
        iniciales: number;
        tiempoTotal: number;
        indicadoresLogrados: number[];
      }
    >();

    registros.forEach((r) => {
      const sec = r.seccionOGrupo?.trim() || "Sección 9-1";
      if (!mapa.has(sec)) {
        mapa.set(sec, {
          nombre: sec,
          total: 0,
          sumaPuntajes: 0,
          avanzados: 0,
          intermedios: 0,
          iniciales: 0,
          tiempoTotal: 0,
          indicadoresLogrados: Array(10).fill(0),
        });
      }

      const item = mapa.get(sec)!;
      item.total += 1;
      const puntaje = r.porcentaje !== undefined ? r.porcentaje : r.puntaje;
      item.sumaPuntajes += puntaje;
      item.tiempoTotal += r.tiempoSegundos || 45;

      if (puntaje >= minAvanzado) {
        item.avanzados += 1;
      } else if (puntaje <= maxInicial) {
        item.iniciales += 1;
      } else {
        item.intermedios += 1;
      }

      // Procesar array cog si existe, o simular con base en el puntaje
      if (r.cog && Array.isArray(r.cog)) {
        r.cog.forEach((c, idx) => {
          if (idx < 10 && c === "L") {
            item.indicadoresLogrados[idx] += 1;
          }
        });
      } else {
        // Estimación heurística de indicadores logrados según porcentaje
        const cantidadLogrados = Math.round((puntaje / 100) * 10);
        for (let i = 0; i < cantidadLogrados; i++) {
          if (i < 10) item.indicadoresLogrados[i] += 1;
        }
      }
    });

    return Array.from(mapa.values())
      .map((s) => ({
        ...s,
        promedio: s.total > 0 ? Math.round(s.sumaPuntajes / s.total) : 0,
        tiempoPromedio: s.total > 0 ? Math.round(s.tiempoTotal / s.total) : 0,
        pctAvanzado: s.total > 0 ? Math.round((s.avanzados / s.total) * 100) : 0,
        pctIntermedio: s.total > 0 ? Math.round((s.intermedios / s.total) * 100) : 0,
        pctInicial: s.total > 0 ? Math.round((s.iniciales / s.total) * 100) : 0,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }));
  }, [registros, minAvanzado, maxInicial]);

  // Cálculo de los 10 Indicadores para la sección seleccionada o global
  const datosIndicadores = useMemo(() => {
    const registrosAFiltrar =
      seccionDetalle === "Todas"
        ? registros
        : registros.filter((r) => (r.seccionOGrupo?.trim() || "Sección 9-1") === seccionDetalle);

    const totalEst = registrosAFiltrar.length;
    const conteoLogros = Array(10).fill(0);
    const conteoEnDesarrollo = Array(10).fill(0);
    const conteoAcomp = Array(10).fill(0);

    registrosAFiltrar.forEach((r) => {
      const puntaje = r.porcentaje !== undefined ? r.porcentaje : r.puntaje;
      if (r.cog && Array.isArray(r.cog)) {
        r.cog.forEach((c, idx) => {
          if (idx < 10) {
            if (c === "L") conteoLogros[idx] += 1;
            else if (c === "ED") conteoEnDesarrollo[idx] += 1;
            else conteoAcomp[idx] += 1;
          }
        });
      } else {
        const cantLogrados = Math.round((puntaje / 100) * 10);
        for (let i = 0; i < 10; i++) {
          if (i < cantLogrados) conteoLogros[i] += 1;
          else if (i === cantLogrados && puntaje > 50) conteoEnDesarrollo[i] += 1;
          else conteoAcomp[i] += 1;
        }
      }
    });

    return INDICADORES_CATALOGO.map((ind, idx) => {
      const logrados = conteoLogros[idx] || 0;
      const enDesarrollo = conteoEnDesarrollo[idx] || 0;
      const acomp = conteoAcomp[idx] || 0;
      const pctLogrado = totalEst > 0 ? Math.round((logrados / totalEst) * 100) : 0;
      const pctED = totalEst > 0 ? Math.round((enDesarrollo / totalEst) * 100) : 0;
      const pctRA = totalEst > 0 ? Math.round((acomp / totalEst) * 100) : 0;

      return {
        ...ind,
        totalEst,
        logrados,
        enDesarrollo,
        acomp,
        pctLogrado,
        pctED,
        pctRA,
        estado:
          pctLogrado >= 75
            ? "Consolidado"
            : pctLogrado >= 50
            ? "En Proceso"
            : "Brecha Crítica",
      };
    });
  }, [registros, seccionDetalle]);

  // Promedio global
  const promedioGeneral = useMemo(() => {
    if (registros.length === 0) return 0;
    const total = registros.reduce((acc, r) => acc + (r.porcentaje ?? r.puntaje), 0);
    return Math.round(total / registros.length);
  }, [registros]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Cabecera del Panel de Gráficas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ChartBar size={20} weight="bold" />
            </span>
            <h3 className="font-black text-lg text-slate-900">
              Analítica Visual & Comparativa de Secciones
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualización estadística de distribución de logro, rendimiento por grupo y diagnóstico cognitivo de los 10 saberes clave.
          </p>
        </div>

        {/* Selector de Pestañas de Gráficos */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setVistaActiva("secciones")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              vistaActiva === "secciones"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UsersThree size={16} weight="bold" />
            <span>Por Sección ({datosPorSeccion.length})</span>
          </button>
          <button
            onClick={() => setVistaActiva("indicadores")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              vistaActiva === "indicadores"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Cpu size={16} weight="bold" />
            <span>10 Indicadores Cognitivos</span>
          </button>
          <button
            onClick={() => setVistaActiva("distribucion")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              vistaActiva === "distribucion"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Gauge size={16} weight="bold" />
            <span>Resumen Ejecutivo</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VISTA 1: COMPARATIVA GRÁFICA ENTRE SECCIONES                */}
      {/* ============================================================ */}
      {vistaActiva === "secciones" && (
        <div className="space-y-6">
          {datosPorSeccion.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ChartBar size={40} className="mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-600">No hay datos suficientes para graficar</p>
              <p className="text-xs text-slate-400">Registra resultados o carga datos de demostración</p>
            </div>
          ) : (
            <>
              {/* Tarjetas de Resumen Rápido de Secciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {datosPorSeccion.map((sec) => (
                  <div
                    key={sec.nombre}
                    onClick={() => {
                      if (onSeleccionarSeccion) onSeleccionarSeccion(sec.nombre);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                      seccionSeleccionada === sec.nombre
                        ? "bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20"
                        : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-sm">{sec.nombre}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        {sec.total} est.
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-2xl font-black text-slate-900">{sec.promedio}%</span>
                      <span
                        className={`text-xs font-extrabold ${
                          sec.promedio >= minAvanzado
                            ? "text-emerald-700"
                            : sec.promedio <= maxInicial
                            ? "text-rose-700"
                            : "text-amber-700"
                        }`}
                      >
                        {sec.promedio >= minAvanzado
                          ? "🟢 Consolidado"
                          : sec.promedio <= maxInicial
                          ? "🔴 Acompañamiento"
                          : "🟡 En Desarrollo"}
                      </span>
                    </div>

                    {/* Barra de Distribución Tricolor */}
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${sec.pctAvanzado}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Consolidado: ${sec.pctAvanzado}%`}
                      />
                      <div
                        style={{ width: `${sec.pctIntermedio}%` }}
                        className="bg-amber-400 h-full"
                        title={`En Desarrollo: ${sec.pctIntermedio}%`}
                      />
                      <div
                        style={{ width: `${sec.pctInicial}%` }}
                        className="bg-rose-500 h-full"
                        title={`Requiere Acompañamiento: ${sec.pctInicial}%`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2">
                      <span className="text-emerald-700">{sec.avanzados} Cons.</span>
                      <span className="text-amber-700">{sec.intermedios} Des.</span>
                      <span className="text-rose-700">{sec.iniciales} Acomp.</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gráfico Comparativo de Barras SVG por Sección */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <TrendUp size={16} className="text-emerald-700" />
                    <span>Comparativa Visual de Rendimiento (%) por Sección</span>
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Consolidado (≥{minAvanzado}%)
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> En Desarrollo
                    </span>
                    <span className="flex items-center gap-1 text-rose-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Acompañamiento (≤{maxInicial}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {datosPorSeccion.map((sec) => (
                    <div key={sec.nombre} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600" />
                          {sec.nombre} ({sec.total} estudiantes evaluados)
                        </span>
                        <div className="flex items-center gap-2 font-mono font-bold">
                          <span className="text-slate-600">Promedio:</span>
                          <span className="text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {sec.promedio}%
                          </span>
                        </div>
                      </div>

                      <div className="h-6 w-full bg-slate-200/80 rounded-xl overflow-hidden flex shadow-inner border border-slate-300/60">
                        <div
                          style={{ width: `${sec.pctAvanzado}%` }}
                          className="bg-emerald-500 hover:bg-emerald-600 transition-all h-full flex items-center justify-center text-[10px] text-white font-black"
                          title={`Consolidados: ${sec.avanzados} (${sec.pctAvanzado}%)`}
                        >
                          {sec.pctAvanzado > 12 ? `${sec.pctAvanzado}%` : ""}
                        </div>
                        <div
                          style={{ width: `${sec.pctIntermedio}%` }}
                          className="bg-amber-400 hover:bg-amber-500 transition-all h-full flex items-center justify-center text-[10px] text-amber-950 font-black"
                          title={`En Desarrollo: ${sec.intermedios} (${sec.pctIntermedio}%)`}
                        >
                          {sec.pctIntermedio > 12 ? `${sec.pctIntermedio}%` : ""}
                        </div>
                        <div
                          style={{ width: `${sec.pctInicial}%` }}
                          className="bg-rose-500 hover:bg-rose-600 transition-all h-full flex items-center justify-center text-[10px] text-white font-black"
                          title={`Requiere Acompañamiento: ${sec.iniciales} (${sec.pctInicial}%)`}
                        >
                          {sec.pctInicial > 12 ? `${sec.pctInicial}%` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 2: DESGLOSE DE LOS 10 INDICADORES COGNITIVOS          */}
      {/* ============================================================ */}
      {vistaActiva === "indicadores" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Cpu size={18} className="text-purple-700" weight="bold" />
                <span>Matriz Diagnóstica de los 10 Indicadores de Logro</span>
              </h4>
              <p className="text-xs text-slate-500">
                Identificación de saberes previos del año anterior: fortalezas y necesidades de nivelación
              </p>
            </div>

            {/* Filtro por Sección para la Matriz */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Filtrar por:</span>
              <select
                value={seccionDetalle}
                onChange={(e) => setSeccionDetalle(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="Todas">Todas las secciones consolidadas</option>
                {datosPorSeccion.map((s) => (
                  <option key={s.nombre} value={s.nombre}>
                    {s.nombre} ({s.total} est.)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grilla de los 10 Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datosIndicadores.map((ind) => {
              const esCritico = ind.pctLogrado < 50;
              const esConsolidado = ind.pctLogrado >= 75;

              return (
                <div
                  key={ind.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    esCritico
                      ? "bg-rose-50/50 border-rose-200"
                      : esConsolidado
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                          esCritico
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
                        <div className="text-[10px] text-slate-500 font-semibold">{ind.area} • {ind.descripcion}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        esConsolidado
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : esCritico
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {ind.pctLogrado}% Logro
                    </span>
                  </div>

                  {/* Barra de Progreso del Indicador */}
                  <div className="space-y-1 mt-3">
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${ind.pctLogrado}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Logrado: ${ind.logrados} estudiantes (${ind.pctLogrado}%)`}
                      />
                      <div
                        style={{ width: `${ind.pctED}%` }}
                        className="bg-amber-400 h-full"
                        title={`En Desarrollo: ${ind.enDesarrollo} estudiantes (${ind.pctED}%)`}
                      />
                      <div
                        style={{ width: `${ind.pctRA}%` }}
                        className="bg-rose-500 h-full"
                        title={`Requiere Acompañamiento: ${ind.acomp} estudiantes (${ind.pctRA}%)`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-slate-500 pt-0.5">
                      <span className="text-emerald-700">🟢 Logrado: {ind.logrados}</span>
                      <span className="text-amber-700">🟡 En proc: {ind.enDesarrollo}</span>
                      <span className="text-rose-700">🔴 Acomp: {ind.acomp}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 3: RESUMEN EJECUTIVO Y DIAGNÓSTICO INSTITUCIONAL      */}
      {/* ============================================================ */}
      {vistaActiva === "distribucion" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                Promedio General Global
              </div>
              <div className="text-3xl font-black text-emerald-950">{promedioGeneral}%</div>
              <p className="text-[11px] text-emerald-800 mt-2 font-medium">
                Calculado sobre {registros.length} evaluaciones registradas en total.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                Secciones Activas
              </div>
              <div className="text-3xl font-black text-blue-950">{datosPorSeccion.length}</div>
              <p className="text-[11px] text-blue-800 mt-2 font-medium">
                Grupos con al menos un estudiante evaluado en la plataforma.
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border border-purple-200">
              <div className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-1">
                Indicadores en Alerta
              </div>
              <div className="text-3xl font-black text-purple-950">
                {datosIndicadores.filter((i) => i.pctLogrado < 50).length} / 10
              </div>
              <p className="text-[11px] text-purple-800 mt-2 font-medium">
                Saberes con logro menor al 50% que requieren plan de nivelación.
              </p>
            </div>
          </div>

          {/* Hallazgos y Sugerencias de Nivelación */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
              <Sparkle size={18} className="text-amber-600" weight="fill" />
              <span>Diagnóstico Pedagógico Automático para Inicio de Curso</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                <div className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle size={15} weight="fill" />
                  <span>Principales Fortalezas Detectadas:</span>
                </div>
                <ul className="list-disc list-inside text-slate-600 font-medium space-y-0.5 text-[11px]">
                  {datosIndicadores
                    .filter((i) => i.pctLogrado >= 65)
                    .slice(0, 3)
                    .map((f) => (
                      <li key={f.id}>
                        <strong className="text-slate-800">{f.nombre}:</strong> {f.pctLogrado}% de logro grupal.
                      </li>
                    ))}
                  {datosIndicadores.filter((i) => i.pctLogrado >= 65).length === 0 && (
                    <li>Aún no se detectan indicadores con más del 65% de consolidación.</li>
                  )}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                <div className="font-extrabold text-rose-800 flex items-center gap-1.5">
                  <WarningCircle size={15} weight="fill" />
                  <span>Prioridades de Nivelación Sugeridas:</span>
                </div>
                <ul className="list-disc list-inside text-slate-600 font-medium space-y-0.5 text-[11px]">
                  {datosIndicadores
                    .filter((i) => i.pctLogrado < 65)
                    .sort((a, b) => a.pctLogrado - b.pctLogrado)
                    .slice(0, 3)
                    .map((d) => (
                      <li key={d.id}>
                        <strong className="text-slate-800">{d.nombre}:</strong> {d.pctLogrado}% logro ({d.acomp} est. en acompañamiento).
                      </li>
                    ))}
                  {datosIndicadores.filter((i) => i.pctLogrado < 65).length === 0 && (
                    <li>Excelente: todos los saberes evaluados superan el 65% de logro.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
