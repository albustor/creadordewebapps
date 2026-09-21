"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP } from "@/lib/dreCircuitos";
import {
  Lightning,
  ChartBar,
  UserCircle,
  SignIn,
  UserPlus,
  SignOut,
  IdentificationCard,
  EnvelopeSimple,
  LockKey,
  CheckCircle,
  WarningCircle,
  Key,
  ArrowRight,
  ShieldCheck,
  Buildings,
  GraduationCap,
  Sparkle,
} from "@phosphor-icons/react";

export default function HomePage() {
  const { docente, isInitialized, iniciarSesion, registrarDocente, cerrarSesion, telemetria } = useDocente();

  // Estado del formulario de autenticación
  const [tabAuth, setTabAuth] = useState<"login" | "registro">("login");

  // Formulario Login
  const [loginCorreo, setLoginCorreo] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Formulario Registro
  const [regNombre, setRegNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regCedula, setRegCedula] = useState("");
  const [regDRE, setRegDRE] = useState("DRE01");
  const [regInstitucion, setRegInstitucion] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regMensaje, setRegMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Carga inicial
  if (!isInitialized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-bold text-slate-600">Cargando entorno...</div>
      </div>
    );
  }

  // Manejador de Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMensaje(null);

    const correoLimpio = loginCorreo.trim().toLowerCase();
    if (!correoLimpio) {
      setLoginMensaje({ tipo: "error", texto: "Por favor ingrese su correo electrónico." });
      return;
    }

    const res = iniciarSesion(correoLimpio, loginPassword);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // Autocompletar demo
  const usarDemo = () => {
    setLoginCorreo("alberto.bustos.ortega@mep.go.cr");
    setLoginPassword("EdcRfvTgb1726**");
    setLoginMensaje(null);
  };

  // Manejador de Registro
  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setRegMensaje(null);

    if (!regNombre.trim() || regNombre.trim().split(/\s+/).length < 2) {
      setRegMensaje({ tipo: "error", texto: "Por favor ingrese su nombre completo (Nombre y Apellidos)." });
      return;
    }

    const correoLimpio = regCorreo.trim().toLowerCase();
    if (!correoLimpio) {
      setRegMensaje({ tipo: "error", texto: "Por favor ingrese su correo electrónico." });
      return;
    }

    if (regPassword.trim().length < 6) {
      setRegMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    const dreSeleccionada = LISTA_DRE_MEP.find((d) => d.codigo === regDRE) || LISTA_DRE_MEP[0];
    const correoFormateado = correoLimpio.includes("@") ? correoLimpio : `${correoLimpio}@mep.go.cr`;
    const randomId = `DOC-${regDRE.replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevoDocente = {
      idDocente: randomId,
      nombreCompleto: regNombre.trim().startsWith("Prof.") ? regNombre.trim() : `Prof. ${regNombre.trim()}`,
      correoInstitucional: correoFormateado,
      contrasena: regPassword.trim(),
      cedula: regCedula.trim() || "N/A",
      telefono: "",
      dreCodigo: regDRE,
      dreNombre: dreSeleccionada.nombre,
      circuito: dreSeleccionada.circuitos[0] || "Circuito 01",
      codigoPresupuestario: "FT-2026",
      institucionNombre: regInstitucion.trim() || "Liceo / Colegio de Secundaria",
      rol: "Docente de Formación Tecnológica",
      asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
      fechaRegistro: new Date().toISOString(),
    };

    const res = registrarDocente(nuevoDocente);
    if (res.exito) {
      setRegMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setRegMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Si el docente NO ha iniciado sesión, mostrar pasarela de login / registro */}
      {!docente ? (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative max-w-xl mx-auto space-y-6">
            
            {/* Título de la Plataforma */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <Lightning size={16} weight="fill" className="text-amber-400" />
                <span>Formación tecnológica • 9° año</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Diagnóstico & Dashboard
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Acceso para la aplicación del diagnóstico de 9° año y la consolidación de resultados en el dashboard.
              </p>
            </div>

            {/* Tarjeta de Autenticación */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Selector de Pestañas */}
              <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setTabAuth("login");
                    setLoginMensaje(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    tabAuth === "login"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <SignIn size={16} weight="bold" />
                  <span>Iniciar sesión</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTabAuth("registro");
                    setRegMensaje(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    tabAuth === "registro"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserPlus size={16} weight="bold" />
                  <span>Registrarse</span>
                </button>
              </div>

              {tabAuth === "login" ? (
                /* Formulario Login */
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginMensaje && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                        loginMensaje.tipo === "exito"
                          ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-200"
                          : "bg-rose-950/80 border border-rose-500/60 text-rose-200"
                      }`}
                    >
                      {loginMensaje.tipo === "exito" ? (
                        <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
                      ) : (
                        <WarningCircle size={18} weight="fill" className="text-rose-400 shrink-0" />
                      )}
                      <span>{loginMensaje.texto}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Correo electrónico:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <EnvelopeSimple size={18} />
                      </div>
                      <input
                        type="text"
                        value={loginCorreo}
                        onChange={(e) => setLoginCorreo(e.target.value)}
                        placeholder="nombre.apellido.apellido@mep.go.cr o usuario"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Contraseña:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <LockKey size={18} />
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={usarDemo}
                      className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                    >
                      <Key size={14} />
                      <span>Cargar credenciales de demostración</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                    >
                      <SignIn size={16} weight="bold" />
                      <span>Iniciar sesión</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-center">
                    <span className="text-xs text-slate-400">¿No tienes cuenta registrada? </span>
                    <button
                      type="button"
                      onClick={() => setTabAuth("registro")}
                      className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </form>
              ) : (
                /* Formulario Registro */
                <form onSubmit={handleRegistro} className="space-y-3.5">
                  {regMensaje && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                        regMensaje.tipo === "exito"
                          ? "bg-emerald-950/80 border border-emerald-500/60 text-emerald-200"
                          : "bg-rose-950/80 border border-rose-500/60 text-rose-200"
                      }`}
                    >
                      {regMensaje.tipo === "exito" ? (
                        <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
                      ) : (
                        <WarningCircle size={18} weight="fill" className="text-rose-400 shrink-0" />
                      )}
                      <span>{regMensaje.texto}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nombre completo (Nombre y Apellidos):
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <UserCircle size={18} />
                      </div>
                      <input
                        type="text"
                        value={regNombre}
                        onChange={(e) => setRegNombre(e.target.value)}
                        placeholder="Prof. Juan Pérez Gómez"
                        required
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Correo electrónico:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <EnvelopeSimple size={18} />
                        </div>
                        <input
                          type="text"
                          value={regCorreo}
                          onChange={(e) => setRegCorreo(e.target.value)}
                          placeholder="usuario@mep.go.cr"
                          required
                          className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Cédula / Identificación:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <IdentificationCard size={18} />
                        </div>
                        <input
                          type="text"
                          value={regCedula}
                          onChange={(e) => setRegCedula(e.target.value)}
                          placeholder="1-1122-3344"
                          className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Dirección Regional:
                      </label>
                      <select
                        value={regDRE}
                        onChange={(e) => setRegDRE(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
                      >
                        {LISTA_DRE_MEP.map((d) => (
                          <option key={d.codigo} value={d.codigo}>
                            {d.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Centro Educativo:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Buildings size={18} />
                        </div>
                        <input
                          type="text"
                          value={regInstitucion}
                          onChange={(e) => setRegInstitucion(e.target.value)}
                          placeholder="Liceo / Colegio"
                          className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Contraseña (mínimo 6 caracteres):
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <LockKey size={18} />
                      </div>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                    >
                      <UserPlus size={16} weight="bold" />
                      <span>Registrarse e ingresar</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <span className="text-xs text-slate-400">¿Ya tienes cuenta? </span>
                    <button
                      type="button"
                      onClick={() => setTabAuth("login")}
                      className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 hover:underline"
                    >
                      Inicia sesión aquí
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* Si el docente YA ha iniciado sesión, mostrar la vista principal con Diagnóstico y Dashboard */
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative max-w-5xl mx-auto space-y-8">
            
            {/* Barra de Estado de Docente Autenticado */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/60 border border-emerald-600/50 p-4 rounded-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                  <UserCircle size={26} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {docente.nombreCompleto}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      Activo
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200/80 font-mono mt-0.5">
                    {docente.correoInstitucional} • {docente.dreNombre} ({docente.idDocente})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Link
                  href="/registro"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border border-emerald-500/40 transition-colors"
                >
                  <IdentificationCard size={16} weight="bold" />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={() => cerrarSesion()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
                >
                  <SignOut size={16} weight="bold" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <Lightning size={16} weight="fill" className="text-amber-400" />
                <span>Formación tecnológica • 9° año</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Diagnóstico & Dashboard
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Seleccione el módulo que desea utilizar para la evaluación diagnóstica de los estudiantes o la revisión analítica de los resultados.
              </p>
            </div>

            {/* Módulos Principales: Diagnóstico y Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Tarjeta 1: Diagnóstico */}
              <div className="bg-white text-slate-900 rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-emerald-600 transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <Lightning size={28} weight="fill" className="text-amber-500" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-extrabold rounded-full">
                      Módulo de Evaluación
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      Diagnóstico
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Instrumento interactivo de diagnóstico para 9° año («Aula Inteligente»), con simulador de circuitos 2D, ítems formativos, reflexión individual y panel evaluador docente con nóminas.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href="/diagnostico"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <span>Ingresar a Diagnóstico</span>
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              {/* Tarjeta 2: Dashboard */}
              <div className="bg-white text-slate-900 rounded-3xl border-2 border-teal-500/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-teal-600 transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                    <ChartBar size={28} weight="duotone" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs font-extrabold rounded-full">
                      Telemetría & Analítica
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      Dashboard
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Visualización del rendimiento grupal e individual en tiempo real, lector de códigos QR con la cámara, analítica de reactivos y exportación de reportes a Excel y PDF.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <span>Ingresar a Dashboard</span>
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Métricas Resumidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                <div className="text-2xl font-black text-white">10 Reactivos</div>
                <div className="text-xs text-slate-400 font-semibold">Diagnóstico integrado de 9°</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                <div className="text-2xl font-black text-emerald-400">{telemetria.length}</div>
                <div className="text-xs text-slate-400 font-semibold">Evaluaciones registradas</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                <div className="text-2xl font-black text-amber-400">100% Offline</div>
                <div className="text-xs text-slate-400 font-semibold">Sincronización QR docente</div>
              </div>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}
