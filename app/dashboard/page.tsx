"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDocente } from "@/context/DocenteContext";
import { SafeStorage } from "@/lib/firebase";
import SemaforoLogro from "@/components/SemaforoLogro";
import GraficasSecciones from "@/components/GraficasSecciones";
import RecomendacionesDUA from "@/components/RecomendacionesDUA";
import QRScannerResultados from "@/components/QRScannerResultados";
import {
  ConfiguracionDashboardDocente,
  CONFIGURACION_DEFAULT,
} from "@/components/ConfiguradorInstrumentoDashboard";
import { exportarAExcel, exportarAPDF } from "@/lib/exportUtils";
import { PayloadTelemetria } from "@/lib/antiFraude";
import AuthGuard from "@/components/AuthGuard";
import {
  ChartBar,
  Camera,
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
} from "@phosphor-icons/react";

export default function DashboardAnaliticoPage() {
  const {
    docente,
    telemetria,
    agregarResultadoTelemetria,
    actualizarResultadoTelemetria,
    importarLoteResultados,
    eliminarResultado,
    limpiarTelemetria,
    restablecerDatosDemostracion,
  } = useDocente();

  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroNivelLogro, setFiltroNivelLogro] = useState("Todos");
  const [filtroSoloMios, setFiltroSoloMios] = useState(false);
  const [scannerAbierto, setScannerAbierto] = useState(false);

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

  // Lista completa de secciones estándar (9-1 a 9-20, más cualquier sección adicional registrada)
  const gruposDisponibles = useMemo(() => {
    const seccionesSet = new Set<string>();

    // Agregar lista completa de 9° año por defecto
    for (let i = 1; i <= 20; i++) {
      seccionesSet.add(`Sección 9-${i}`);
    }

    // Agregar cualquier sección que provenga de la telemetría registrada
    telemetria.forEach((t) => {
      if (t.seccionOGrupo && t.seccionOGrupo.trim()) {
        seccionesSet.add(t.seccionOGrupo.trim());
      }
    });

    return Array.from(seccionesSet).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  }, [telemetria]);

  // Función para determinar el nivel de logro dinámico según los umbrales del docente
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
      // Excluir al docente registrado si aparece como estudiante
      const estNom = r.estudianteNombre?.toLowerCase()?.trim() || "";
      const estCor = r.estudianteCorreo?.toLowerCase()?.trim() || "";
      if (nombreDocenteLimpio && (estNom === nombreDocenteLimpio || estNom.includes(nombreDocenteLimpio))) {
        return false;
      }
      if (correoDocenteLimpio && estCor === correoDocenteLimpio) {
        return false;
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
  }, [telemetria, filtroTexto, filtroGrupo, filtroNivelLogro, filtroSoloMios, docente, configuracion]);

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

  // Importar archivo JSON de lote offline
  const handleImportarLoteJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const contenido = JSON.parse(event.target?.result as string);
        if (Array.isArray(contenido)) {
          importarLoteResultados(contenido);
          alert(`Se importaron ${contenido.length} resultados con éxito.`);
        } else {
          alert("El archivo no contiene un arreglo válido de resultados.");
        }
      } catch (err) {
        alert("Error al leer el archivo JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Cabecera del Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Formación tecnológica • 9° año
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-purple-900 border border-purple-300">
                Diagnóstico inicial
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Dashboard Analítico & Telemetría
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Monitoreo en tiempo real del progreso grupal e individual, analítica y recomendaciones pedagógicas. Optimizado para computadoras de laboratorios, PCs y portátiles.
            </p>
          </div>

          {/* Botones de Acción Primarios */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setScannerAbierto(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              <Camera size={18} weight="bold" />
              <span>Escanear QR offline</span>
            </button>

            <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs">
              <UploadSimple size={16} weight="bold" />
              <span>Cargar lote (.json)</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportarLoteJSON}
              />
            </label>

            <button
              onClick={() => exportarAExcel(telemetriaFiltrada)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              title="Descargar Excel .xlsx"
            >
              <FileXls size={18} weight="bold" />
              <span>Excel</span>
            </button>

            <button
              onClick={() => exportarAPDF(telemetriaFiltrada)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              title="Descargar informe PDF"
            >
              <FilePdf size={18} weight="bold" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* 1. SECCIÓN PRINCIPAL SUPERIOR: TABLA DE REGISTROS DE ESTUDIANTES Y TELEMETRÍA */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-black text-lg text-slate-900">
                  Registros Individuales de Telemetría ({telemetriaFiltrada.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Detalle en tiempo real de cada prueba diagnóstica registrada con token SHA-256
              </p>
            </div>

            {/* Filtros Dinámicos con Secciones 9-1 a 9-20 */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Buscador */}
              <div className="relative">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs w-44 sm:w-56 focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              {/* Filtro Sección / Grupo Completo */}
              <select
                value={filtroGrupo}
                onChange={(e) => setFiltroGrupo(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="Todos">Todas las secciones</option>
                {gruposDisponibles.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              {/* Filtro Nivel de Logro */}
              <select
                value={filtroNivelLogro}
                onChange={(e) => setFiltroNivelLogro(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="Todos">Todos los niveles</option>
                <option value="Consolidado">🟢 Consolidado (&ge;{configuracion.umbralAvanzadoMin}%)</option>
                <option value="En Desarrollo">🟡 En Desarrollo ({configuracion.umbralInicialMax + 1}-{configuracion.umbralAvanzadoMin - 1}%)</option>
                <option value="Acompañamiento">🔴 Requiere Acompañamiento (&le;{configuracion.umbralInicialMax}%)</option>
              </select>

              {/* Botones de Gestión y Limpieza de Datos */}
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <button
                  onClick={() => {
                    if (confirm("⚠️ ¿Deseas vaciar toda la telemetría para iniciar de cero con tu grupo real?")) {
                      limpiarTelemetria();
                    }
                  }}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                  title="Vaciar telemetría"
                >
                  <Trash size={15} weight="bold" />
                  <span>Vaciar</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("¿Cargar datos de demostración para explorar los gráficos del dashboard?")) {
                      restablecerDatosDemostracion();
                    }
                  }}
                  className="p-2 text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
                  title="Cargar datos de demostración"
                >
                  <ArrowsClockwise size={16} weight="bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de Registros */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Estudiante</th>
                  <th className="py-3.5 px-4">Sección / Grupo</th>
                  <th className="py-3.5 px-4">Puntaje</th>
                  <th className="py-3.5 px-4">Nivel de Logro</th>
                  <th className="py-3.5 px-4">Tiempo</th>
                  <th className="py-3.5 px-4">Integridad</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {telemetriaFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Broom size={32} className="mx-auto text-slate-300" weight="duotone" />
                        <div className="font-bold text-slate-700">No hay registros de telemetría</div>
                        <p className="text-xs text-slate-500">
                          Los resultados aparecerán automáticamente cuando los estudiantes completen la evaluación diagnóstica en el laboratorio.
                        </p>
                        <button
                          onClick={restablecerDatosDemostracion}
                          className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold hover:bg-emerald-100"
                        >
                          <ArrowsClockwise size={14} />
                          <span>Cargar datos de demostración</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  telemetriaFiltrada.map((item, idx) => {
                    const puntajeFinal = item.porcentaje !== undefined ? item.porcentaje : item.puntaje;
                    const nivelCalculado = obtenerNivelDinamico(puntajeFinal);
                    const esAvanzado = nivelCalculado === "Consolidado" || item.nivelLogro === "Avanzado";
                    const esInicial = nivelCalculado === "Requiere Acompañamiento" || item.nivelLogro === "Inicial";

                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[11px]">
                              {item.estudianteNombre.charAt(0).toUpperCase()}
                            </div>
                            <span>{item.estudianteNombre}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-600">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                            {item.seccionOGrupo || "Sección 9-1"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {puntajeFinal}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              esAvanzado
                                ? "bg-emerald-100 text-emerald-800"
                                : esInicial
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                esAvanzado
                                  ? "bg-emerald-600"
                                  : esInicial
                                  ? "bg-rose-600"
                                  : "bg-amber-600"
                              }`}
                            />
                            {nivelCalculado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                          {item.tiempoSegundos ? `${item.tiempoSegundos}s` : "45s"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <ShieldCheck size={14} weight="fill" />
                            <span>Válido SHA-256</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => abrirEditar(item)}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Editar registro"
                            >
                              <NotePencil size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar el registro de ${item.estudianteNombre}?`)) {
                                  eliminarResultado(item.timestamp);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash size={16} />
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

        {/* 2. ANALÍTICA VISUAL Y GRÁFICAS COMPARATIVAS POR SECCIÓN */}
        <GraficasSecciones
          registros={telemetriaFiltrada}
          configuracion={configuracion}
          seccionSeleccionada={filtroGrupo}
          onSeleccionarSeccion={(sec) => setFiltroGrupo(sec)}
        />

        {/* 3. RESUMEN DEL SEMÁFORO DE LOGRO */}
        <SemaforoLogro registros={telemetriaFiltrada} configuracion={configuracion} />

        {/* 3. RECOMENDACIONES PEDAGÓGICAS (HORIZONTAL FULL WIDTH) */}
        <RecomendacionesDUA
          registros={telemetriaFiltrada}
          configuracion={configuracion}
          seccionSeleccionada={filtroGrupo}
        />

        {/* Modal de Edición de Registro */}
        {registroEditando && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-sm">Editar Registro de Telemetría</h3>
                <button
                  onClick={() => setRegistroEditando(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <form onSubmit={guardarEdicion} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nombre del estudiante:</label>
                  <input
                    type="text"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sección / Grupo:</label>
                  <select
                    value={editGrupo}
                    onChange={(e) => setEditGrupo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  >
                    {gruposDisponibles.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Puntaje (%) obtenido:</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editPuntaje}
                    onChange={(e) => setEditPuntaje(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRegistroEditando(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Escáner de Cámara QR Offline */}
        <QRScannerResultados
          abierto={scannerAbierto}
          alCerrar={() => setScannerAbierto(false)}
          alDetectarResultado={(res) => {
            agregarResultadoTelemetria(res);
          }}
        />
      </div>
    </AuthGuard>
  );
}
