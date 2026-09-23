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
  nivel?: "todos" | "7mo" | "8vo" | "9no";
  seccionSeleccionada?: string;
  onSeleccionarSeccion?: (seccion: string) => void;
}

// Catálogo oficial dinámico de los 10 Indicadores Cognitivos según el Nivel
const INDICADORES_POR_NIVEL: Record<string, Array<{ id: number; codigo: string; nombre: string; area: string; descripcion: string }>> = {
  "7mo": [
    { id: 1, codigo: "IND-01", nombre: "Hardware y Periféricos", area: "Hardware", descripcion: "Identificación de periféricos de entrada, salida y almacenamiento" },
    { id: 2, codigo: "IND-02", nombre: "Software y Aplicaciones", area: "Software", descripcion: "Diferenciación entre software de sistema y aplicaciones" },
    { id: 3, codigo: "IND-03", nombre: "Sistemas Operativos y Archivos", area: "Gestión", descripcion: "Estructura jerárquica de carpetas y extensiones de archivos" },
    { id: 4, codigo: "IND-04", nombre: "Seguridad Digital y Contraseñas", area: "Ciberseguridad", descripcion: "Buenas prácticas de contraseñas robustas y autenticación" },
    { id: 5, codigo: "IND-05", nombre: "Ciudadanía y Convivencia Digital", area: "Ética Digital", descripcion: "Uso responsable, huella digital y netiqueta estudiantil" },
    { id: 6, codigo: "IND-06", nombre: "Algoritmos y Secuencias", area: "Pensamiento Computacional", descripcion: "Instrucciones lógicas ordenadas paso a paso" },
    { id: 7, codigo: "IND-07", nombre: "Descomposición de Problemas", area: "Pensamiento Computacional", descripcion: "División de retos complejos en subproblemas sencillos" },
    { id: 8, codigo: "IND-08", nombre: "Reconocimiento de Patrones", area: "Lógica", descripcion: "Identificación de regularidades y secuencias repetitivas" },
    { id: 9, codigo: "IND-09", nombre: "Programación por Bloques", area: "Programación", descripcion: "Construcción de secuencias con eventos y acciones" },
    { id: 10, codigo: "IND-10", nombre: "Depuración y Corrección", area: "Pensamiento Crítico", descripcion: "Localización y ajuste de fallas en algoritmos" },
  ],
  "8vo": [
    { id: 1, codigo: "IND-01", nombre: "Lógica Algorítmica y Diagramas", area: "Pensamiento Computacional", descripcion: "Modelado de flujos y toma de decisiones estructuradas" },
    { id: 2, codigo: "IND-02", nombre: "Variables y Operadores Lógicos", area: "Programación", descripcion: "Manejo de variables numéricas, booleanas y comparaciones" },
    { id: 3, codigo: "IND-03", nombre: "Estructuras Condicionales Dobles", area: "Lógica", descripcion: "Bifurcaciones si-entonces-sino según condiciones lógicas" },
    { id: 4, codigo: "IND-04", nombre: "Bucles y Repetición Controlada", area: "Lógica", descripcion: "Automatización con ciclos de repetición controlados" },
    { id: 5, codigo: "IND-05", nombre: "Entorno Físico y Sensado", area: "Mecatrónica", descripcion: "Interacción con magnitudes físicas del entorno" },
    { id: 6, codigo: "IND-06", nombre: "Circuitos Básicos y Señales", area: "Electrónica", descripcion: "Conexión elemental de componentes, alimentación y señales" },
    { id: 7, codigo: "IND-07", nombre: "Depuración y Corrección de Bugs", area: "Pensamiento Crítico", descripcion: "Aislamiento y corrección de inconsistencias lógicas" },
    { id: 8, codigo: "IND-08", nombre: "Pensamiento Crítico y Abstracción", area: "Pensamiento Computacional", descripcion: "Generalización y modelos simplificados" },
    { id: 9, codigo: "IND-09", nombre: "Seguridad y Privacidad de Datos", area: "Ciberseguridad", descripcion: "Cuidado de la privacidad y navegación segura" },
    { id: 10, codigo: "IND-10", nombre: "Metacognición y Transferencia", area: "Metacognición", descripcion: "Reflexión del propio aprendizaje y resolución autónoma" },
  ],
  "9no": [
    { id: 1, codigo: "IND-01", nombre: "Microcontrolador MCU y 328P", area: "Hardware", descripcion: "Identificación de pines digitales, voltajes 5V/GND y MCU" },
    { id: 2, codigo: "IND-02", nombre: "Sensor LDR y Actuador LED", area: "Componentes", descripcion: "Entradas sensoriales analógicas y salidas de potencia" },
    { id: 3, codigo: "IND-03", nombre: "Modelo E-P-S (Entrada-Proceso-Salida)", area: "Sistémica", descripcion: "Comprensión del flujo sistémico del dato interactivo" },
    { id: 4, codigo: "IND-04", nombre: "Algoritmo de Automatización", area: "Lógica", descripcion: "Secuencia de instrucciones para conmutación automática" },
    { id: 5, codigo: "IND-05", nombre: "Umbral de Activación (Lux/Voltaje)", area: "Sensado", descripcion: "Definición del punto de corte para conmutación del actuador" },
    { id: 6, codigo: "IND-06", nombre: "Relación de Componentes e Interconexión", area: "Circuitos", descripcion: "Conexionado en placa y circuito cerrado" },
    { id: 7, codigo: "IND-07", nombre: "Lectura Analógica vs Digital", area: "Señales", descripcion: "Voltajes continuos en A0 frente a estados HIGH/LOW" },
    { id: 8, codigo: "IND-08", nombre: "Estructura Condicional Doble", area: "Programación", descripcion: "Ejecución de ramas según nivel de iluminación" },
    { id: 9, codigo: "IND-09", nombre: "Reto de Ensamble y Simulación 2D", area: "Simulación", descripcion: "Montaje práctico en el banco virtual interactivo" },
    { id: 10, codigo: "IND-10", nombre: "Ciclo del Dato y Metacognición", area: "Reflexión", descripcion: "Seguridad en taller tecnológico y justificación técnica" },
  ],
};

export default function GraficasSecciones({
  registros,
  configuracion,
  nivel = "todos",
  seccionSeleccionada = "Todos",
  onSeleccionarSeccion,
}: GraficasSeccionesProps) {
  const [vistaActiva, setVistaActiva] = useState<"secciones" | "indicadores" | "distribucion">("secciones");
  const [tipoGraficoSecciones, setTipoGraficoSecciones] = useState<"vertical" | "horizontal">("vertical");
  const [seccionDetalle, setSeccionDetalle] = useState<string>("Todas");

  const minAvanzado = configuracion?.umbralAvanzadoMin ?? 80;
  const maxInicial = configuracion?.umbralInicialMax ?? 59;

  const nivelClave = nivel === "7mo" ? "7mo" : nivel === "8vo" ? "8vo" : "9no";
  const catalogoIndicadoresActivo = INDICADORES_POR_NIVEL[nivelClave] || INDICADORES_POR_NIVEL["9no"];

  const nivelEtiqueta =
    nivel === "7mo"
      ? "7.° Año"
      : nivel === "8vo"
      ? "8.° Año"
      : nivel === "9no"
      ? "9.° Año"
      : "Todos los Niveles";

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

      // Procesar array cog si existe, o estimar con base en el puntaje
      if (r.cog && Array.isArray(r.cog)) {
        r.cog.forEach((c, idx) => {
          if (idx < 10 && c === "L") {
            item.indicadoresLogrados[idx] += 1;
          }
        });
      } else {
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

    return catalogoIndicadoresActivo.map((ind, idx) => {
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
  }, [registros, seccionDetalle, catalogoIndicadoresActivo]);

  // Promedio global
  const promedioGeneral = useMemo(() => {
    if (registros.length === 0) return 0;
    const total = registros.reduce((acc, r) => acc + (r.porcentaje ?? r.puntaje), 0);
    return Math.round(total / registros.length);
  }, [registros]);

  if (registros.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
          <ChartBar size={24} weight="duotone" />
        </div>
        <h3 className="font-black text-base text-slate-900 mb-1">
          Analítica Visual & Desglose de Indicadores ({nivelEtiqueta})
        </h3>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
          Las gráficas comparativas por sección y el porcentaje de logro en los 10 indicadores curriculares se representarán en este panel en tiempo real tras la aplicación de las pruebas.
        </p>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-bold text-stone-600">
          <span>💡 Indicadores curriculares de {nivelEtiqueta} listos y calibrados</span>
        </div>
      </div>
    );
  }

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

              {/* Gráfico Comparativo de Barras por Sección */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
                  <div>
                    <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <TrendUp size={16} className="text-emerald-700" />
                      <span>Comparativa Visual de Rendimiento (%) por Sección</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Evaluación formativa del porcentaje promedio de logro por cada grupo de 9° año
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Selector de Tipo de Gráfico (Vertical vs Horizontal) */}
                    <div className="inline-flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setTipoGraficoSecciones("vertical")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          tipoGraficoSecciones === "vertical"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        title="Ver en gráfico de barras verticales"
                      >
                        <ChartBar size={15} weight="bold" />
                        <span>Barras Verticales</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoGraficoSecciones("horizontal")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                          tipoGraficoSecciones === "horizontal"
                            ? "bg-white text-emerald-800 shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        title="Ver en barras horizontales"
                      >
                        <span>Horizontales</span>
                      </button>
                    </div>

                    {/* Leyenda de Niveles */}
                    <div className="hidden lg:flex items-center gap-3 text-[11px] font-bold border-l border-slate-200 pl-3">
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
                </div>

                {/* ==================== VISTA VERTICAL ==================== */}
                {tipoGraficoSecciones === "vertical" ? (
                  <div className="pt-4 pb-2">
                    <div className="relative h-72 w-full bg-white rounded-2xl border border-slate-200 p-4 pl-12 pr-4 shadow-xs">
                      {/* Eje Y con líneas de referencia (100%, 80%, 60%, 40%, 20%, 0%) */}
                      <div className="absolute left-3 top-4 bottom-14 flex flex-col justify-between text-[10px] font-mono font-bold text-slate-400 select-none">
                        <span>100%</span>
                        <span className="text-emerald-600">80%</span>
                        <span className="text-amber-600">60%</span>
                        <span>40%</span>
                        <span>20%</span>
                        <span>0%</span>
                      </div>

                      {/* Líneas horizontales punteadas */}
                      <div className="absolute left-12 right-4 top-4 bottom-14 flex flex-col justify-between pointer-events-none">
                        <div className="w-full border-b border-slate-200" />
                        <div className="w-full border-b border-dashed border-emerald-300" />
                        <div className="w-full border-b border-dashed border-amber-300" />
                        <div className="w-full border-b border-slate-100" />
                        <div className="w-full border-b border-slate-100" />
                        <div className="w-full border-b border-slate-300" />
                      </div>

                      {/* Contenedor de Columnas / Barras Verticales */}
                      <div className="relative h-full flex items-end justify-around gap-2 sm:gap-4 pb-10">
                        {datosPorSeccion.map((sec) => {
                          const pct = sec.promedio;
                          const esAvanzado = pct >= minAvanzado;
                          const esInicial = pct <= maxInicial;
                          const colorBarra = esAvanzado
                            ? "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                            : esInicial
                            ? "from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                            : "from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600";
                          const colorBorde = esAvanzado ? "border-emerald-600" : (esInicial ? "border-rose-600" : "border-amber-600");
                          const colorTexto = esAvanzado ? "text-emerald-800 bg-emerald-50 border-emerald-300" : (esInicial ? "text-rose-800 bg-rose-50 border-rose-300" : "text-amber-800 bg-amber-50 border-amber-300");

                          return (
                            <div
                              key={sec.nombre}
                              onClick={() => {
                                if (onSeleccionarSeccion) onSeleccionarSeccion(sec.nombre);
                              }}
                              className="group flex flex-col items-center h-full justify-end flex-1 max-w-[90px] cursor-pointer"
                              title={`${sec.nombre}: Promedio ${sec.promedio}%\n${sec.total} estudiantes evaluados\nConsolidados: ${sec.avanzados}\nEn Desarrollo: ${sec.intermedios}\nAcompañamiento: ${sec.iniciales}`}
                            >
                              {/* Valor numérico encima de la barra */}
                              <div className="mb-1.5 transition-transform group-hover:-translate-y-1">
                                <span className={`text-[11px] font-black font-mono px-1.5 py-0.5 rounded-md border shadow-xs ${colorTexto}`}>
                                  {sec.promedio}%
                                </span>
                              </div>

                              {/* Columna Vertical con Altura Proporcional */}
                              <div className="w-full max-w-[48px] h-full flex items-end">
                                <div
                                  style={{ height: `${Math.max(sec.promedio, 6)}%` }}
                                  className={`w-full rounded-t-xl bg-gradient-to-t ${colorBarra} border-t-2 border-x ${colorBorde} shadow-md transition-all duration-500 group-hover:shadow-lg flex flex-col justify-end p-1`}
                                >
                                  {/* Micro segmentos de desglose interno si hay espacio */}
                                  {sec.promedio > 30 && (
                                    <div className="w-full flex flex-col gap-0.5 opacity-90">
                                      {sec.pctAvanzado > 0 && (
                                        <div style={{ height: `${Math.max((sec.pctAvanzado / 100) * 8, 2)}px` }} className="w-full bg-white/40 rounded-full" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Etiqueta Inferior (Sección y Alumnos) */}
                              <div className="mt-2 text-center select-none">
                                <div className="text-[11.5px] font-black text-slate-800 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                                  {sec.nombre}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500">
                                  {sec.total} est.
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ==================== VISTA HORIZONTAL ==================== */
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
                )}
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
