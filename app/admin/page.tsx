"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import {
  ShieldCheck,
  UserCircle,
  UsersThree,
  CheckCircle,
  XCircle,
  Clock,
  Buildings,
  GraduationCap,
  IdentificationCard,
  EnvelopeSimple,
  DownloadSimple,
  ArrowsClockwise,
  PlusCircle,
  DeviceMobileCamera,
  Cpu,
  FileCode,
  Sparkle,
  LockKey,
  Trash,
  PauseCircle,
  PlayCircle,
  Key,
  ListDashes,
  GlobeHemisphereWest,
  NotePencil,
} from "@phosphor-icons/react";
import AuthGuard from "@/components/AuthGuard";
import ObservatorioMacroNacional from "@/components/ObservatorioMacroNacional";
import { LISTA_DRE_MEP } from "@/lib/dreCircuitos";

export default function AdminPage() {
  const { docente } = useDocente();
  const [tabActiva, setTabActiva] = useState<"observatorio" | "solicitudes" | "docentes" | "historico" | "recursos" | "nueva_solicitud">("observatorio");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensajeAccion, setMensajeAccion] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [filtroDRE, setFiltroDRE] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");

  // Modal / Edición de Usuario
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);

  // Formulario para nueva solicitud
  const [solNombre, setSolNombre] = useState("");
  const [solCorreo, setSolCorreo] = useState("");
  const [solCedula, setSolCedula] = useState("");
  const [solTelefono, setSolTelefono] = useState("");
  const [solDRE, setSolDRE] = useState("DRE-01");
  const [solCircuito, setSolCircuito] = useState("Circuito 01");
  const [solInstitucion, setSolInstitucion] = useState("Asesoría Regional / Nacional");
  const [solRol, setSolRol] = useState<"Asesor Regional" | "Asesor Nacional" | "Asesor de Enseñanza Secundaria" | "Docente">("Asesor Nacional");

  const esSuperAdmin = docente?.correoInstitucional === "alberto.bustos.ortega@mep.go.cr";

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/admin/usuarios");
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.usuarios || []);
        setHistorico(data.historico || []);
      }
    } catch (e) {
      console.error(e);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const ejecutarAccionAdmin = async (idUsuario: string, accion: string, payloadExtra?: any) => {
    if (!esSuperAdmin) {
      setMensajeAccion({
        tipo: "error",
        texto: "Acceso denegado: Solo el Administrador General (Prof. Alberto Bustos Ortega) tiene autorización para ejecutar esta acción.",
      });
      setTimeout(() => setMensajeAccion(null), 4000);
      return;
    }

    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion,
          idUsuario,
          validadorCorreo: docente.correoInstitucional,
          ...payloadExtra,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMensajeAccion({ tipo: "exito", texto: json.mensaje });
        if (json.usuarios) setUsuarios(json.usuarios);
        if (json.historico) setHistorico(json.historico);
        setUsuarioEditando(null);
      } else {
        setMensajeAccion({ tipo: "error", texto: json.error || "No se pudo procesar la acción." });
      }
      setTimeout(() => setMensajeAccion(null), 3500);
    } catch (err: any) {
      setMensajeAccion({ tipo: "error", texto: err.message });
    }
  };

  const handleCrearSolicitud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solCorreo.endsWith("@mep.go.cr")) {
      setMensajeAccion({ tipo: "error", texto: "El correo debe ser institucional (@mep.go.cr)." });
      setTimeout(() => setMensajeAccion(null), 3000);
      return;
    }

    try {
      const dreObj = LISTA_DRE_MEP.find((d) => d.codigo === solDRE);
      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "solicitar_registro",
          usuarioData: {
            nombreCompleto: solNombre,
            correoInstitucional: solCorreo,
            cedula: solCedula,
            telefono: solTelefono,
            dreCodigo: solDRE,
            dreNombre: dreObj?.nombre || "San José Central",
            circuito: solCircuito,
            institucionNombre: solInstitucion,
            rol: solRol,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMensajeAccion({ tipo: "exito", texto: json.mensaje });
        cargarUsuarios();
        setTabActiva("solicitudes");
        setSolNombre("");
        setSolCorreo("");
        setSolCedula("");
        setSolTelefono("");
      } else {
        setMensajeAccion({ tipo: "error", texto: json.error });
      }
      setTimeout(() => setMensajeAccion(null), 3500);
    } catch (err: any) {
      setMensajeAccion({ tipo: "error", texto: err.message });
    }
  };

  const exportarCSV = () => {
    const encabezados = ["ID,Nombre,Correo,Cedula,DRE,Circuito,Institucion,Rol,Estado,FechaSolicitud"];
    const filas = usuarios.map(
      (u) =>
        `"${u.id}","${u.nombreCompleto}","${u.correoInstitucional}","${u.cedula}","${u.dreNombre}","${u.circuito}","${u.institucionNombre}","${u.rol}","${u.estado}","${u.fechaSolicitud}"`
    );
    const contenido = "\uFEFF" + [encabezados, ...filas].join("\n");
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Padron_Docentes_Asesores_MEP_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const solicitudesPendientes = usuarios.filter((u) => u.estado === "Pendiente");
  const docentesYAsesores = usuarios.filter((u) => {
    const matchDRE = filtroDRE === "TODAS" || u.dreCodigo === filtroDRE;
    const matchBusqueda =
      u.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correoInstitucional.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.institucionNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula.includes(busqueda);
    return matchDRE && matchBusqueda;
  });

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Administración • Formación tecnológica
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black border border-emerald-200">
                Gobernanza
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Panel de administración
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Validación de solicitudes docentes, histórico de auditoría y gestión de cuentas.
            </p>
          </div>

        {/* Tarjeta de Identidad del Administrador General */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5 shadow-lg">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
            <ShieldCheck size={26} weight="bold" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              Super Administrador General
            </div>
            <div className="text-xs font-extrabold text-white leading-tight">
              Prof. Alberto Bustos Ortega
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              alberto.bustos.ortega@mep.go.cr
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de Permisos si no está como Super Admin */}
      {!esSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <LockKey size={22} className="text-amber-700 shrink-0 mt-0.5" weight="bold" />
          <div className="space-y-1">
            <div className="font-extrabold text-amber-950">
              Panel de Gobernanza Restringido • Solo Administrador General
            </div>
            <p className="leading-relaxed">
              Estás conectado como <strong>{docente?.nombreCompleto || "Usuario"}</strong> (<em>{docente?.rol || "Asesor / Docente"}</em>). Como Asesor o Docente tienes <strong>acceso completo</strong> para realizar ejercicios, diseñar WebApps, proyectar simulaciones y consultar el <strong>Dashboard Analítico y Telemetría</strong>.
            </p>
            <p className="text-[11px] text-amber-800 font-semibold">
              ℹ️ La activación, aprobación de credenciales y gestión de permisos está reservada exclusivamente para el Administrador General (<strong>Prof. Alberto Bustos Ortega</strong>).
            </p>
          </div>
        </div>
      )}

      {/* Mensajes de Notificación */}
      {mensajeAccion && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn ${
            mensajeAccion.tipo === "exito"
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-rose-100 text-rose-900 border border-rose-300"
          }`}
        >
          {mensajeAccion.tipo === "exito" ? (
            <CheckCircle size={20} weight="fill" className="text-emerald-700 shrink-0" />
          ) : (
            <XCircle size={20} weight="fill" className="text-rose-700 shrink-0" />
          )}
          <span>{mensajeAccion.texto}</span>
        </div>
      )}

      {/* Métricas del Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock size={26} weight="duotone" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{solicitudesPendientes.length}</div>
            <div className="text-xs font-semibold text-slate-500">Solicitudes Pendientes</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
            <UsersThree size={26} weight="duotone" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{usuarios.length}</div>
            <div className="text-xs font-semibold text-slate-500">Padrón de Usuarios</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <CheckCircle size={26} weight="duotone" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {usuarios.filter((u) => u.estado === "Aprobado").length}
            </div>
            <div className="text-xs font-semibold text-slate-500">Cuentas Activas Verificadas</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
            <ListDashes size={26} weight="duotone" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{historico.length}</div>
            <div className="text-xs font-semibold text-slate-500">Eventos en Histórico</div>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setTabActiva("observatorio")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            tabActiva === "observatorio" ? "bg-emerald-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <GlobeHemisphereWest size={16} weight="bold" />
          <span>Observatorio Macro Nacional</span>
        </button>

        <button
          onClick={() => setTabActiva("solicitudes")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            tabActiva === "solicitudes" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock size={16} weight="bold" />
          <span>Solicitudes de Asesores ({solicitudesPendientes.length})</span>
        </button>

        <button
          onClick={() => setTabActiva("docentes")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            tabActiva === "docentes" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UsersThree size={16} weight="bold" />
          <span>Padrón y Gestión de Cuentas</span>
        </button>

        <button
          onClick={() => setTabActiva("historico")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            tabActiva === "historico" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ListDashes size={16} weight="bold" />
          <span>Histórico Administrativo</span>
        </button>

        <button
          onClick={() => setTabActiva("recursos")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            tabActiva === "recursos" ? "bg-white text-blue-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileCode size={16} weight="bold" />
          <span>Recursos & Guías</span>
        </button>

        <button
          onClick={() => setTabActiva("nueva_solicitud")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            tabActiva === "nueva_solicitud" ? "bg-blue-700 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <PlusCircle size={16} weight="bold" />
          <span>Nueva Solicitud de Ingreso</span>
        </button>
      </div>

      {/* TAB 0: OBSERVATORIO MACRO NACIONAL */}
      {tabActiva === "observatorio" && (
        <ObservatorioMacroNacional usuariosDocentes={usuarios} />
      )}

      {/* TAB 1: SOLICITUDES DE ASESORÍAS */}
      {tabActiva === "solicitudes" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-mepCard p-6 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Cola de Solicitudes de Asesorías para Validación
              </h2>
              <p className="text-xs text-slate-500">
                Las solicitudes aprobadas otorgan permisos de asesoría y acceso al panel analítico DRE.
              </p>
            </div>

            <button
              onClick={cargarUsuarios}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold self-start sm:self-auto"
            >
              <ArrowsClockwise size={15} className={cargando ? "animate-spin" : ""} />
              <span>Actualizar Lista</span>
            </button>
          </div>

          {solicitudesPendientes.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <CheckCircle size={36} weight="duotone" className="text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-slate-800">No hay solicitudes pendientes en este momento</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Todas las solicitudes han sido revisadas y validadas por el Administrador General.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {solicitudesPendientes.map((sol) => (
                <div
                  key={sol.id}
                  className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                        {sol.rol}
                      </span>
                      <span className="text-xs font-mono text-slate-500">{sol.id}</span>
                    </div>
                    <div className="text-sm font-black text-slate-900">{sol.nombreCompleto}</div>
                    <div className="text-xs text-slate-600 font-mono">
                      {sol.correoInstitucional} • Cédula: {sol.cedula} • Tel: {sol.telefono}
                    </div>
                    <div className="text-xs text-slate-700">
                      <strong>DRE:</strong> {sol.dreNombre} ({sol.circuito}) • <strong>Institución:</strong> {sol.institucionNombre}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Solicitado el: {new Date(sol.fechaSolicitud).toLocaleString("es-CR")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end lg:self-auto shrink-0">
                    {esSuperAdmin ? (
                      <>
                        <button
                          onClick={() => ejecutarAccionAdmin(sol.id, "aprobar")}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          <CheckCircle size={16} weight="bold" />
                          <span>Aprobar Asesor</span>
                        </button>

                        <button
                          onClick={() => ejecutarAccionAdmin(sol.id, "rechazar")}
                          className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
                        >
                          <XCircle size={16} weight="bold" />
                          <span>Rechazar</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5">
                        <LockKey size={14} weight="bold" />
                        <span>Validación exclusiva del Administrador General</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PADRÓN Y GESTIÓN DE CUENTAS */}
      {tabActiva === "docentes" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-mepCard p-6 space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Padrón Nacional de Profesores y Gestión de Cuentas
              </h2>
              <p className="text-xs text-slate-500">
                Herramientas de control: modificar datos, suspender accesos o eliminar registros
              </p>
            </div>

            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors self-start md:self-auto"
            >
              <DownloadSimple size={16} weight="bold" />
              <span>Exportar Base de Datos (CSV)</span>
            </button>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Buscar por Nombre / Correo / Cédula:</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Escribe para filtrar..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Filtrar por Dirección Regional (DRE):</label>
              <select
                value={filtroDRE}
                onChange={(e) => setFiltroDRE(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
              >
                <option value="TODAS">Todas las Direcciones Regionales</option>
                {LISTA_DRE_MEP.map((d) => (
                  <option key={d.codigo} value={d.codigo}>
                    {d.codigo}: {d.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Funcionario</th>
                  <th className="py-3 px-3">DRE / Circuito</th>
                  <th className="py-3 px-3">Institución</th>
                  <th className="py-3 px-3">Rol</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3 text-right">Acciones de Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {docentesYAsesores.map((u) => {
                  const esSuper = u.correoInstitucional === "alberto.bustos.ortega@mep.go.cr";
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{u.nombreCompleto}</div>
                        <div className="font-mono text-[11px] text-blue-700">{u.correoInstitucional}</div>
                        <div className="text-[10px] text-slate-400">Cédula: {u.cedula}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{u.dreNombre}</div>
                        <div className="text-[11px] text-slate-500">{u.circuito}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{u.institucionNombre}</td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${esSuper ? "text-blue-900 font-black" : "text-slate-800"}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.estado === "Aprobado"
                              ? "bg-emerald-100 text-emerald-900"
                              : u.estado === "Pendiente"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          {u.estado}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {esSuper ? (
                          <span className="text-[10px] font-bold text-slate-400 italic">Administrador Principal</span>
                        ) : esSuperAdmin ? (
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Editar / Restablecer */}
                            <button
                              onClick={() => setUsuarioEditando(u)}
                              title="Restablecer Datos / Credenciales"
                              className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <NotePencil size={16} weight="bold" />
                            </button>

                            {/* Suspender o Reactivar */}
                            {u.estado === "Aprobado" ? (
                              <button
                                onClick={() => ejecutarAccionAdmin(u.id, "desactivar")}
                                title="Suspender / Desactivar Acceso"
                                className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                              >
                                <PauseCircle size={16} weight="bold" />
                              </button>
                            ) : (
                              <button
                                onClick={() => ejecutarAccionAdmin(u.id, "reactivar")}
                                title="Reactivar Acceso"
                                className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                <PlayCircle size={16} weight="bold" />
                              </button>
                            )}

                            {/* Eliminar */}
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de eliminar la cuenta de ${u.nombreCompleto}?`)) {
                                  ejecutarAccionAdmin(u.id, "eliminar");
                                }
                              }}
                              title="Eliminar del Sistema"
                              className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash size={16} weight="bold" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            Solo Consulta
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal / Formulario de Edición de Usuario */}
          {usuarioEditando && (
            <div className="p-5 bg-slate-50 border border-blue-200 rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                  <Key size={16} className="text-blue-700" />
                  <span>Restablecer y Modificar Datos: {usuarioEditando.nombreCompleto}</span>
                </h3>
                <button onClick={() => setUsuarioEditando(null)} className="text-xs font-bold text-slate-400 hover:text-slate-700">
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre Completo:</label>
                  <input
                    type="text"
                    value={usuarioEditando.nombreCompleto}
                    onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nombreCompleto: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Institución:</label>
                  <input
                    type="text"
                    value={usuarioEditando.institucionNombre}
                    onChange={(e) => setUsuarioEditando({ ...usuarioEditando, institucionNombre: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Rol Asignado:</label>
                  <select
                    value={usuarioEditando.rol}
                    onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Docente">Docente</option>
                    <option value="Asesor Regional">Asesor Regional</option>
                    <option value="Asesor Nacional">Asesor Nacional</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => ejecutarAccionAdmin(usuarioEditando.id, "restablecer", { usuarioData: usuarioEditando })}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Guardar Cambios & Restablecer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: HISTÓRICO ADMINISTRATIVO (BITÁCORA DE AUDITORÍA) */}
      {tabActiva === "historico" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-mepCard p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Histórico de Auditoría Administrativa
              </h2>
              <p className="text-xs text-slate-500">
                Registro cronológico inmutable de eventos, aprobaciones, suspensiones y cambios en el sistema
              </p>
            </div>

            <button
              onClick={cargarUsuarios}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
            >
              <ArrowsClockwise size={14} className={cargando ? "animate-spin" : ""} />
              <span>Actualizar Bitácora</span>
            </button>
          </div>

          <div className="space-y-3">
            {historico.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ev.tipoEvento === "APROBACION"
                          ? "bg-emerald-100 text-emerald-900"
                          : ev.tipoEvento === "ELIMINACION" || ev.tipoEvento === "SUSPENSION"
                          ? "bg-rose-100 text-rose-900"
                          : "bg-blue-100 text-blue-900"
                      }`}
                    >
                      {ev.tipoEvento}
                    </span>
                    <span className="font-bold text-slate-900">{ev.descripcion}</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Usuario afectado: <code className="text-blue-800 font-bold">{ev.usuarioAfectado}</code> • Ejecutado por: <strong>{ev.ejecutadoPor}</strong>
                  </div>
                </div>

                <div className="text-slate-400 font-mono text-[11px] shrink-0 self-start sm:self-auto">
                  {new Date(ev.fechaHora).toLocaleString("es-CR")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RECURSOS Y MANUALES DE ADMINISTRACIÓN */}
      {tabActiva === "recursos" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-mepCard p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Recursos Técnicos y Manuales para Asesores
            </h2>
            <p className="text-xs text-slate-500">
              Documentación y herramientas de integración listas para capacitar y distribuir a los docentes del país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recurso 1: Google Apps Script */}
            <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                  <FileCode size={22} weight="bold" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Manual Google Apps Script & Sheets</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Guía técnica para que los docentes integren el webhook de Google Sheets y reciban telemetría en tiempo real.
                </p>
              </div>
              <Link
                href="/manuales"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800 transition-colors"
              >
                <span>Ver Manual de Apps Script</span>
              </Link>
            </div>

            {/* Recurso 2: Instalación PWA */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <DeviceMobileCamera size={22} weight="bold" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Manual PWA Celulares (iOS & Android)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instrucciones ilustradas para agregar WebApps a pantalla de inicio en teléfonos de estudiantes sin tienda de apps.
                </p>
              </div>
              <Link
                href="/manuales"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl hover:bg-emerald-800 transition-colors"
              >
                <span>Ver Guía de Celulares</span>
              </Link>
            </div>

            {/* Recurso 3: Auditoría Diaria 5:00 AM */}
            <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                  <Cpu size={22} weight="bold" />
                </div>
                <h3 className="font-black text-sm text-slate-900">Protocolo de Auditoría IA</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verificación de salud de modelos Gemini, Groq, OpenRouter y generación de reportes ejecutivos.
                </p>
              </div>
              <Link
                href="/auditoria-ia"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-xl hover:bg-purple-800 transition-colors"
              >
                <span>Ver Auditoría en Vivo</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NUEVA SOLICITUD DE ASESOR */}
      {tabActiva === "nueva_solicitud" && (
        <form onSubmit={handleCrearSolicitud} className="bg-white rounded-2xl border border-slate-200 shadow-mepCard p-6 sm:p-8 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Registrar Nueva Solicitud de Asesor o Docente
            </h2>
            <p className="text-xs text-slate-500">
              La solicitud se agregará a la lista de pendientes para que el Administrador General (Prof. Alberto Bustos Ortega) la valide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo:</label>
              <input
                type="text"
                value={solNombre}
                onChange={(e) => setSolNombre(e.target.value)}
                placeholder="Ej: Lic. Juan Pérez Morales"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Correo Institucional MEP:</label>
              <input
                type="email"
                value={solCorreo}
                onChange={(e) => setSolCorreo(e.target.value)}
                placeholder="juan.perez.morales@mep.go.cr"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Número de Cédula:</label>
              <input
                type="text"
                value={solCedula}
                onChange={(e) => setSolCedula(e.target.value)}
                placeholder="1-0987-0654"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono:</label>
              <input
                type="text"
                value={solTelefono}
                onChange={(e) => setSolTelefono(e.target.value)}
                placeholder="+506 8888-7777"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Regional (DRE):</label>
              <select
                value={solDRE}
                onChange={(e) => setSolDRE(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              >
                {LISTA_DRE_MEP.map((d) => (
                  <option key={d.codigo} value={d.codigo}>
                    {d.codigo}: {d.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rol Solicitado:</label>
              <select
                value={solRol}
                onChange={(e) => setSolRol(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
              >
                <option value="Asesor Nacional">Asesor Nacional de Formación Tecnológica</option>
                <option value="Asesor de Enseñanza Secundaria">Asesor de Enseñanza Secundaria</option>
                <option value="Asesor Regional">Asesor Regional DRE</option>
                <option value="Docente">Docente Líder Institucional</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
            >
              <PlusCircle size={18} weight="bold" />
              <span>Enviar Solicitud a Validación</span>
            </button>
          </div>
        </form>
      )}
    </div>
  </AuthGuard>
  );
}
