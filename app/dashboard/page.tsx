"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useDocente } from "@/context/DocenteContext";
import { SafeStorage } from "@/lib/firebase";
import SemaforoLogro from "@/components/SemaforoLogro";
import AnaliticaReactivos from "@/components/AnaliticaReactivos";
import RecomendacionesDUA from "@/components/RecomendacionesDUA";
import QRScannerResultados from "@/components/QRScannerResultados";
import ConfiguradorInstrumentoDashboard, {
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
  Funnel,
  Trash,
  CheckCircle,
  WarningCircle,
  Clock,
  User,
  ShieldCheck,
  Sparkle,
  Sliders,
  Article,
  GraduationCap,
  NotePencil,
  Broom,
  ArrowsClockwise,
  Check,
  X,
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
  const [modalConfigurador, setModalConfigurador] = useState(false);

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

  const esDiagnostico = configuracion.tipoProceso === "diagnostico";

  // Extraer grupos únicos disponibles
  const gruposDisponibles = useMemo(() => {
    const set = new Set<string>();
    telemetria.forEach((t) => {
      if (t.seccionOGrupo) set.add(t.seccionOGrupo);
    });
    return Array.from(set);
  }, [telemetria]);

  // Función para determinar el nivel de logro dinámico según los umbrales del docente
  const obtenerNivelDinamico = (puntaje: number): string => {
    if (puntaje >= configuracion.umbralAvanzadoMin) {
      return esDiagnostico ? "Consolidado" : "Avanzado";
    }
    if (puntaje <= configuracion.umbralInicialMax) {
      return esDiagnostico ? "Acompañamiento" : "Inicial";
    }
    return esDiagnostico ? "En Desarrollo" : "Intermedio";
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
      const coincideGrupo = filtroGrupo === "Todos" || r.seccionOGrupo === filtroGrupo;
      
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
    setEditGrupo(item.seccionOGrupo || "Sección 7-1");
    setEditPuntaje(item.porcentaje ?? item.puntaje ?? 100);
  };

  const guardarEdicionRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registroEditando) return;
    const nuevoPorcentaje = Math.min(100, Math.max(0, Number(editPuntaje)));
    const nivelBase: "Inicial" | "Intermedio" | "Avanzado" =
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
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  esDiagnostico
                    ? "bg-purple-100 text-purple-900 border border-purple-300"
                    : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                }`}
              >
                {esDiagnostico ? "Diagnóstico inicial" : "Trabajo cotidiano"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Dashboard Analítico & Telemetría
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Monitoreo en tiempo real del progreso grupal e individual, analítica de reactivos y recomendaciones pedagógicas. Optimizado para computadoras de laboratorios, PCs y portátiles.
            </p>
          </div>

        {/* Botones de Acción Primarios */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* BOTÓN PERSONALIZAR INSTRUMENTO */}
          <button
            onClick={() => setModalConfigurador(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-700 to-blue-700 hover:from-indigo-600 hover:to-blue-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            title="Configurar escala de logro, umbrales y subir instrumento de evaluación base"
          >
            <Sliders size={18} weight="bold" />
            <span>Configurar Instrumento Base</span>
          </button>

          <button
            onClick={() => setScannerAbierto(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            <Camera size={18} weight="bold" />
            <span>Escanear QR Offline</span>
          </button>

          <label className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs">
            <UploadSimple size={16} weight="bold" />
            <span>Cargar Lote (.json)</span>
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
            title="Descargar Informe PDF Oficial"
          >
            <FilePdf size={18} weight="bold" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Banner de Instrumento Docente Activo */}
      <div
        className={`p-5 rounded-2xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
          esDiagnostico
            ? "bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white border-purple-800/50"
            : "bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border-blue-800/50"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                esDiagnostico ? "bg-amber-400 text-slate-950" : "bg-sky-400 text-slate-950"
              }`}
            >
              {esDiagnostico ? "Instrumento Diagnóstico Activo" : "Instrumento de Cotidiano Activo"}
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              {configuracion.asignatura} • {configuracion.nivelEducativo}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white">
            {configuracion.nombreInstrumento}
          </h3>

          <p className="text-xs text-slate-300 max-w-2xl line-clamp-1">
            Umbrales aplicados: Inicial (&le;{configuracion.umbralInicialMax}%), Intermedio ({configuracion.umbralInicialMax + 1}%-{configuracion.umbralAvanzadoMin - 1}%), Avanzado (&ge;{configuracion.umbralAvanzadoMin}%)
            {configuracion.archivoFuenteNombre && ` • Fuente: ${configuracion.archivoFuenteNombre}`}
          </p>
        </div>

        <button
          onClick={() => setModalConfigurador(true)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all shrink-0 flex items-center gap-1.5"
        >
          <Sliders size={16} weight="bold" />
          <span>Personalizar Parámetros</span>
        </button>
      </div>

      {/* Semáforo de Logro Formativo */}
      <SemaforoLogro registros={telemetriaFiltrada} configuracion={configuracion} />

      {/* Analítica de Reactivos y Recomendaciones DUA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnaliticaReactivos registros={telemetriaFiltrada} />
        <RecomendacionesDUA registros={telemetriaFiltrada} configuracion={configuracion} />
      </div>

      {/* Tabla de Registros Detallados con Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-mepCard p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Registros Individuales de Telemetría ({telemetriaFiltrada.length})
            </h3>
            <p className="text-xs text-slate-500">
              Detalle de cada prueba realizada con token de autenticidad SHA-256
            </p>
          </div>

          {/* Filtros Dinámicos y Controles de Telemetría Docente */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filtro Solo Mi Aula */}
            <button
              onClick={() => setFiltroSoloMios(!filtroSoloMios)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                filtroSoloMios
                  ? "bg-blue-700 text-white border-blue-800 shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
              }`}
              title="Filtrar por el ID institucional del docente activo"
            >
              <User size={15} weight={filtroSoloMios ? "fill" : "bold"} />
              <span>{filtroSoloMios ? "Solo Mi Aula" : "Todas las Aulas"}</span>
            </button>

            {/* Buscador */}
            <div className="relative">
              <MagnifyingGlass
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar estudiante o WebApp..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs w-44 sm:w-56 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            {/* Filtro Grupo */}
            <select
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="Todos">Todos los Grupos</option>
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
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="Todos">Todos los Niveles</option>
              {esDiagnostico ? (
                <>
                  <option value="Consolidado">🟢 Consolidado (&ge;{configuracion.umbralAvanzadoMin}%)</option>
                  <option value="En Desarrollo">🟡 En Desarrollo ({configuracion.umbralInicialMax + 1}-{configuracion.umbralAvanzadoMin - 1}%)</option>
                  <option value="Acompañamiento">🔴 Requiere Acompañamiento (&le;{configuracion.umbralInicialMax}%)</option>
                </>
              ) : (
                <>
                  <option value="Avanzado">🟢 Avanzado (&ge;{configuracion.umbralAvanzadoMin}%)</option>
                  <option value="Intermedio">🟡 Intermedio ({configuracion.umbralInicialMax + 1}-{configuracion.umbralAvanzadoMin - 1}%)</option>
                  <option value="Inicial">🔴 Inicial (&le;{configuracion.umbralInicialMax}%)</option>
                </>
              )}
            </select>

            {/* Botones de Gestión y Limpieza de Datos */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <button
                onClick={() => {
                  if (confirm("⚠️ ¿Estás seguro de vaciar toda la telemetría y lista de estudiantes para iniciar de cero con tu grupo real? Esta acción no se puede deshacer.")) {
                    limpiarTelemetria();
                  }
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border-1.5 border-rose-200 hover:border-rose-300 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-xs"
                title="Limpiar y vaciar toda la telemetría (Empezar en blanco con tu aula)"
              >
                <Trash size={17} weight="bold" className="text-rose-600" />
                <Broom size={17} weight="bold" className="text-rose-600" />
                <span>Vaciar / Iniciar en Blanco</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("¿Deseas cargar datos de demostración para explorar los gráficos y analítica del dashboard?")) {
                    restablecerDatosDemostracion();
                  }
                }}
                className="p-2 text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors"
                title="Cargar datos de prueba de demostración (opcional)"
              >
                <ArrowsClockwise size={17} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Sección / Grupo</th>
                <th className="py-3 px-4">Actividad WebApp</th>
                <th className="py-3 px-4">Puntaje</th>
                <th className="py-3 px-4">Nivel de Logro</th>
                <th className="py-3 px-4">Tiempo</th>
                <th className="py-3 px-4">Integridad</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {telemetriaFiltrada.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Broom size={32} className="mx-auto text-slate-300" weight="duotone" />
                      <div className="font-bold text-slate-700">No hay registros de telemetría</div>
                      <p className="text-xs text-slate-500">
                        Los resultados aparecerán automáticamente cuando tus estudiantes resuelvan las WebApps en el aula.
                      </p>
                      <button
                        onClick={restablecerDatosDemostracion}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-100 transition-colors mt-2"
                      >
                        <ArrowsClockwise size={14} weight="bold" />
                        <span>Cargar Datos de Demostración</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                telemetriaFiltrada.map((item, idx) => {
                  const nivelDinamico = obtenerNivelDinamico(item.porcentaje ?? item.puntaje);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                          {item.estudianteNombre.charAt(0)}
                        </div>
                        <span>{item.estudianteNombre}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {item.seccionOGrupo || "General"}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate">
                        {item.webAppTitulo}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-blue-900 text-sm">
                        {item.puntaje}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            nivelDinamico.includes("Avanzado") || nivelDinamico.includes("Consolidado")
                              ? "bg-emerald-100 text-emerald-900"
                              : nivelDinamico.includes("Intermedio") || nivelDinamico.includes("En Desarrollo")
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          {nivelDinamico}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {item.tiempoSegundos}s
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono"
                          title={item.tokenAntiFraude}
                        >
                          <ShieldCheck size={14} className="text-emerald-600" />
                          SHA-256
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Editar registro */}
                          <button
                            onClick={() => abrirEditar(item)}
                            className="p-2 text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-xs"
                            title="Editar datos del registro"
                          >
                            <NotePencil size={18} weight="bold" />
                          </button>

                          {/* Eliminar registro */}
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar registro de ${item.estudianteNombre}?`)) {
                                eliminarResultado(item.timestamp);
                              }
                            }}
                            className="p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-xl transition-all shadow-xs"
                            title={`Eliminar registro de ${item.estudianteNombre}`}
                          >
                            <Trash size={18} weight="bold" />
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

      {/* Modal de Edición de Registro de Telemetría */}
      {registroEditando && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <form
            onSubmit={guardarEdicionRegistro}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <NotePencil size={20} className="text-blue-700" weight="bold" />
                <h3 className="text-sm font-extrabold text-slate-900">Editar Registro de Telemetría</h3>
              </div>
              <button
                type="button"
                onClick={() => setRegistroEditando(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Estudiante:</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sección o Grupo:</label>
                <input
                  type="text"
                  value={editGrupo}
                  onChange={(e) => setEditGrupo(e.target.value)}
                  required
                  placeholder="Ej: Sección 7-1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Puntaje Obtenido (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editPuntaje}
                  onChange={(e) => setEditPuntaje(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-extrabold text-blue-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRegistroEditando(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors"
              >
                <Check size={16} weight="bold" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Configurador de Instrumento Base */}
      <ConfiguradorInstrumentoDashboard
        abierto={modalConfigurador}
        alCerrar={() => setModalConfigurador(false)}
        configuracionActual={configuracion}
        alGuardarConfiguracion={(nueva) => setConfiguracion(nueva)}
      />

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
