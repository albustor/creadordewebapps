"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP, LISTA_DRE_REGIONALES } from "@/lib/dreCircuitos";
import { formatearCedulaCR } from "@/lib/cedulaUtils";
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
  Eye,
  EyeSlash,
  Phone,
  Info,
} from "@phosphor-icons/react";

export default function HomePage() {
  const { docente, isInitialized, iniciarSesionConPIN, registrarDocente, cerrarSesion, telemetria } = useDocente();

  // Estado del formulario de autenticación
  const [tabAuth, setTabAuth] = useState<"login" | "registro">("login");

  // Formulario Login con PIN
  const [loginCredencial, setLoginCredencial] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [mostrarLoginPin, setMostrarLoginPin] = useState(false);
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Formulario Registro con PIN y Checkbox de Asesoría
  const [regNombre, setRegNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regCedula, setRegCedula] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [esAsesorNacional, setEsAsesorNacional] = useState(false);
  const [regDRE, setRegDRE] = useState("DRE-01");
  const [regInstitucion, setRegInstitucion] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regPinConfirmar, setRegPinConfirmar] = useState("");
  const [mostrarRegPin, setMostrarRegPin] = useState(false);
  const [regMensaje, setRegMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Manejador de Login con PIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMensaje(null);

    const credLimpia = loginCredencial.trim();
    const pinLimpio = loginPin.trim();

    if (!credLimpia) {
      setLoginMensaje({ tipo: "error", texto: "Por favor ingrese su Cédula o Correo Institucional MEP." });
      return;
    }
    if (!pinLimpio || !/^\d{4}$/.test(pinLimpio)) {
      setLoginMensaje({ tipo: "error", texto: "El PIN debe tener exactamente 4 dígitos numéricos." });
      return;
    }

    const res = iniciarSesionConPIN(credLimpia, pinLimpio);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // Autocompletar demo de pruebas
  const usarDemo = () => {
    try {
      localStorage.removeItem("auth_lock_alberto.bustos.ortega@mep.go.cr");
      localStorage.removeItem("auth_attempts_alberto.bustos.ortega@mep.go.cr");
    } catch (e) {}
    setLoginCredencial("alberto.bustos.ortega@mep.go.cr");
    setLoginPin("2617");
    setLoginMensaje(null);
  };

  // Reglas de evaluación del PIN en tiempo real
  const evaluarPIN = (valorPin: string, valorCedula: string) => {
    if (!valorPin) return null;
    if (!/^\d{4}$/.test(valorPin)) {
      return "El PIN debe contener exactamente 4 dígitos numéricos (0-9).";
    }
    if (/^(\d)\1{3}$/.test(valorPin)) {
      return "⚠️ PIN muy predecible: Evita usar 4 dígitos iguales (ej. 0000 o 1111).";
    }
    const consecutivos = ["0123", "1234", "2345", "3456", "4567", "5678", "6789", "9876", "8765", "7654", "6543", "5432", "4321", "3210"];
    if (consecutivos.includes(valorPin)) {
      return "⚠️ PIN inseguro: Evita números consecutivos (ej. 1234 o 4321).";
    }
    if (valorCedula) {
      const soloNumeros = valorCedula.replace(/\D/g, "");
      if (soloNumeros.length >= 4) {
        const ultimos4 = soloNumeros.slice(-4);
        const primeros4 = soloNumeros.slice(0, 4);
        if (valorPin === ultimos4 || valorPin === primeros4) {
          return "⚠️ Sugerencia: Evita usar los mismos dígitos iniciales o finales de tu cédula.";
        }
      }
    }
    return null;
  };

  const advertenciaPin = evaluarPIN(regPin, regCedula);

  // Manejador de Registro con PIN
  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setRegMensaje(null);

    // 1. Validar nombre
    if (!regNombre.trim()) {
      setRegMensaje({ tipo: "error", texto: "Por favor ingrese su nombre y apellidos completos." });
      return;
    }

    // 2. Validar correo institucional MEP
    const correoLimpio = regCorreo.trim().toLowerCase();
    if (!correoLimpio.endsWith("@mep.go.cr")) {
      setRegMensaje({ tipo: "error", texto: "El correo debe ser estrictamente institucional del MEP (@mep.go.cr)." });
      return;
    }

    // 3. Validar y normalizar cédula en formato oficial de 9 dígitos (con ceros)
    const cedulaLimpia = formatearCedulaCR(regCedula.trim());
    if (!cedulaLimpia) {
      setRegMensaje({ tipo: "error", texto: "Por favor ingrese su número de cédula o identificación." });
      return;
    }

    // 4. Validar PIN de 4 dígitos
    const pinLimpio = regPin.trim();
    if (!/^\d{4}$/.test(pinLimpio)) {
      setRegMensaje({ tipo: "error", texto: "El PIN de acceso rápido debe contener exactamente 4 dígitos numéricos." });
      return;
    }

    if (pinLimpio !== regPinConfirmar.trim()) {
      setRegMensaje({ tipo: "error", texto: "La confirmación del PIN no coincide. Ingrese los mismos 4 dígitos." });
      return;
    }

    // 5. Configurar asignación territorial o Asesoría Nacional
    let dreCodigoFinal = regDRE;
    let dreNombreFinal = "";
    let circuitoFinal = "Circuito 01";
    let institucionFinal = regInstitucion.trim() || "Liceo / Colegio de Secundaria";
    let rolFinal = "Docente de Formación Tecnológica";
    let codigoPresupuestarioFinal = "SABER-2026";

    const esSuperAdminAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr";

    if (esAsesorNacional || esSuperAdminAlberto) {
      dreCodigoFinal = "DRE-NACIONAL";
      dreNombreFinal = "Asesoría de Formación Tecnológica";
      circuitoFinal = "Nivel Nacional / Ámbito General";
      institucionFinal = "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)";
      rolFinal = esSuperAdminAlberto
        ? "Super Administrador & Asesor Nacional"
        : "Asesor de Formación Tecnológica";
      codigoPresupuestarioFinal = "FT-NACIONAL-2026";
    } else {
      const dreEncontrada = LISTA_DRE_REGIONALES.find((d) => d.codigo === regDRE) || LISTA_DRE_REGIONALES[0];
      dreNombreFinal = dreEncontrada.nombre;
      circuitoFinal = dreEncontrada.circuitos[0] || "Circuito 01";
      if (!institucionFinal) {
        setRegMensaje({ tipo: "error", texto: "Por favor indique el nombre de su Centro Educativo o Liceo." });
        return;
      }
    }

    const randomId = esSuperAdminAlberto
      ? "ASESOR-FT-7729"
      : (esAsesorNacional
          ? `ASESOR-FT-${Math.floor(1000 + Math.random() * 9000)}`
          : `DOC-${dreCodigoFinal.replace(/[^a-zA-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`);

    const nuevoDocente = {
      idDocente: randomId,
      nombreCompleto: regNombre.trim(),
      correoInstitucional: correoLimpio,
      pin: pinLimpio,
      contrasena: pinLimpio,
      cedula: cedulaLimpia,
      telefono: regTelefono.trim(),
      dreCodigo: dreCodigoFinal,
      dreNombre: dreNombreFinal,
      circuito: circuitoFinal,
      codigoPresupuestario: codigoPresupuestarioFinal,
      institucionNombre: institucionFinal,
      rol: rolFinal,
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
      {/* Si el docente NO ha iniciado sesión, mostrar pasarela de login / registro con PIN */}
      {!docente ? (
        <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl mx-auto space-y-6">
            
            {/* Título de la Plataforma */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-extrabold shadow-xs">
                <Lightning size={16} weight="fill" className="text-amber-600" />
                <span>Formación Tecnológica • Programa Nacional MEP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Diagnóstico & Dashboard
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
                Ingreso con <strong>Cédula / Correo MEP</strong> y <strong>PIN de 4 dígitos</strong> para aplicación de diagnósticos y telemetría analítica.
              </p>
            </div>

            {/* Tarjeta de Autenticación en Blanco Cálido y Pastel */}
            <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-6">
              
              {/* Selector de Pestañas */}
              <div className="grid grid-cols-2 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setTabAuth("login");
                    setLoginMensaje(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    tabAuth === "login"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Key size={16} weight="bold" />
                  <span>Iniciar con PIN</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTabAuth("registro");
                    setRegMensaje(null);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    tabAuth === "registro"
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserPlus size={16} weight="bold" />
                  <span>Registrarse</span>
                </button>
              </div>

              {tabAuth === "login" ? (
                /* Formulario Login con PIN */
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginMensaje && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                        loginMensaje.tipo === "exito"
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                          : "bg-rose-50 border border-rose-300 text-rose-900"
                      }`}
                    >
                      {loginMensaje.tipo === "exito" ? (
                        <CheckCircle size={18} weight="fill" className="text-emerald-700 shrink-0" />
                      ) : (
                        <WarningCircle size={18} weight="fill" className="text-rose-700 shrink-0" />
                      )}
                      <span>{loginMensaje.texto}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Cédula o Correo Electrónico MEP:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <IdentificationCard size={18} />
                      </div>
                      <input
                        type="text"
                        value={loginCredencial}
                        onChange={(e) => setLoginCredencial(e.target.value)}
                        placeholder="Ej: 5-0305-0179 o nombre.apellido.apellido@mep.go.cr"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        PIN de Acceso (4 Dígitos):
                      </label>
                      <Link
                        href="/registro"
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
                      >
                        ¿Olvidaste tu PIN?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <LockKey size={18} />
                      </div>
                      <input
                        type={mostrarLoginPin ? "text" : "password"}
                        maxLength={4}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarLoginPin(!mostrarLoginPin)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                      >
                        {mostrarLoginPin ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
                    >
                      <SignIn size={16} weight="bold" />
                      <span>Ingresar con PIN</span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-stone-100 text-center">
                    <span className="text-xs text-stone-500">¿No tienes cuenta registrada? </span>
                    <button
                      type="button"
                      onClick={() => setTabAuth("registro")}
                      className="text-xs font-extrabold text-emerald-800 hover:text-emerald-900 hover:underline"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </form>
              ) : (
                /* Formulario Registro con PIN y Checkbox de Asesoría */
                <form onSubmit={handleRegistro} className="space-y-4">
                  {regMensaje && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                        regMensaje.tipo === "exito"
                          ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
                          : "bg-rose-50 border border-rose-300 text-rose-900"
                      }`}
                    >
                      {regMensaje.tipo === "exito" ? (
                        <CheckCircle size={18} weight="fill" className="text-emerald-700 shrink-0" />
                      ) : (
                        <WarningCircle size={18} weight="fill" className="text-rose-700 shrink-0" />
                      )}
                      <span>{regMensaje.texto}</span>
                    </div>
                  )}

                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre completo (Nombre y Apellidos) <span className="text-rose-600">*</span>:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <UserCircle size={18} />
                      </div>
                      <input
                        type="text"
                        value={regNombre}
                        onChange={(e) => setRegNombre(e.target.value)}
                        placeholder="Nombre y Apellidos (ej. Juan Pérez Gómez)"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                      />
                    </div>
                  </div>

                  {/* Cédula y Teléfono Opcional */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cédula / Identificación <span className="text-rose-600">*</span>:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <IdentificationCard size={18} />
                        </div>
                        <input
                          type="text"
                          value={regCedula}
                          onChange={(e) => setRegCedula(e.target.value)}
                          placeholder="5-0305-0179"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Teléfono de Contacto (Opcional):</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <Phone size={18} />
                        </div>
                        <input
                          type="tel"
                          value={regTelefono}
                          onChange={(e) => setRegTelefono(e.target.value)}
                          placeholder="8888-9999"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 font-medium">
                    📌 <strong>Contacto Opcional:</strong> Canal complementario para avisos de gestión o asistencia técnica. Toda la comunicación oficial se mantendrá siempre por Correo Institucional MEP (@mep.go.cr).
                  </p>

                  {/* Correo Oficial MEP */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico Institucional MEP (@mep.go.cr) <span className="text-rose-600">*</span>:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <EnvelopeSimple size={18} />
                      </div>
                      <input
                        type="email"
                        value={regCorreo}
                        onChange={(e) => setRegCorreo(e.target.value)}
                        placeholder="nombre.apellido.apellido@mep.go.cr"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold"
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
                      <Info size={14} className="text-emerald-700 shrink-0" />
                      <span>La comunicación oficial del MEP y reportes se enviarán a esta cuenta.</span>
                    </p>
                  </div>

                  {/* Checkbox: Asignación a Asesoría de Formación Tecnológica */}
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={esAsesorNacional}
                        onChange={(e) => setEsAsesorNacional(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-stone-300 bg-white cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-800">
                          Asignación a Asesoría de Formación Tecnológica
                        </span>
                        <p className="text-[11px] text-stone-500 font-medium">
                          Desactiva la selección de DRE y Centro Educativo al ser de ámbito nacional.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* DRE y Centro Educativo (se desactivan si esAsesorNacional está marcado) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dirección Regional (DRE):
                      </label>
                      {esAsesorNacional ? (
                        <div className="px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-500 flex items-center gap-2 cursor-not-allowed">
                          <span>Asesoría de Formación Tecnológica</span>
                        </div>
                      ) : (
                        <select
                          value={regDRE}
                          onChange={(e) => setRegDRE(e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600 font-semibold"
                        >
                          {LISTA_DRE_REGIONALES.map((d) => (
                            <option key={d.codigo} value={d.codigo}>
                              {d.codigo} - {d.nombre} ({d.provincia})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Centro Educativo:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <Buildings size={18} />
                        </div>
                        <input
                          type="text"
                          value={esAsesorNacional ? "Asesoría Nacional (Dimensión 1 y 2)" : regInstitucion}
                          onChange={(e) => setRegInstitucion(e.target.value)}
                          disabled={esAsesorNacional}
                          placeholder={esAsesorNacional ? "Asignado automáticamente" : "Ej: Liceo de Costa Rica"}
                          required={!esAsesorNacional}
                          className={`w-full pl-10 pr-3.5 py-2.5 border rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                            esAsesorNacional
                              ? "bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed"
                              : "bg-[#FCFBF9] border-stone-300 text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PIN de 4 Dígitos */}
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                        <LockKey size={16} weight="bold" className="text-indigo-700" />
                        <span>PIN de Acceso Rápido (4 Dígitos Numéricos) <span className="text-rose-600">*</span></span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setMostrarRegPin(!mostrarRegPin)}
                        className="text-[11px] font-bold text-indigo-800 hover:text-indigo-950 flex items-center gap-1"
                      >
                        {mostrarRegPin ? <EyeSlash size={14} /> : <Eye size={14} />}
                        <span>{mostrarRegPin ? "Ocultar" : "Ver PIN"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Crea tu PIN (4 números)
                        </label>
                        <input
                          type={mostrarRegPin ? "text" : "password"}
                          maxLength={4}
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="••••"
                          required
                          className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-center font-mono text-base font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Confirma tu PIN
                        </label>
                        <input
                          type={mostrarRegPin ? "text" : "password"}
                          maxLength={4}
                          value={regPinConfirmar}
                          onChange={(e) => setRegPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="••••"
                          required
                          className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-center font-mono text-base font-black text-slate-900 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    {advertenciaPin && (
                      <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 flex items-center gap-2">
                        <WarningCircle size={15} className="text-amber-700 shrink-0" weight="fill" />
                        <span>{advertenciaPin}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
                    >
                      <UserPlus size={16} weight="bold" />
                      <span>Registrarse e Ingresar con PIN</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-100 text-center">
                    <span className="text-xs text-stone-500">¿Ya tienes cuenta registrada? </span>
                    <button
                      type="button"
                      onClick={() => setTabAuth("login")}
                      className="text-xs font-extrabold text-emerald-800 hover:text-emerald-900 hover:underline"
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
        <section className="relative overflow-hidden pt-8 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-5xl mx-auto space-y-8">
            
            {/* Barra de Estado de Docente Autenticado en Blanco Cálido */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200/90 p-4 rounded-2xl shadow-softPastel">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 border border-emerald-300/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <UserCircle size={26} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {docente.nombreCompleto}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-bold">
                      {docente.dreCodigo === "DRE-NACIONAL" ? "Asesoría Nacional" : "Docente Activo"}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {docente.correoInstitucional} • {docente.dreNombre} ({docente.idDocente})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Link
                  href="/registro"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200/80 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition-colors"
                >
                  <IdentificationCard size={16} weight="bold" />
                  <span>Mi perfil</span>
                </Link>
                <button
                  onClick={() => cerrarSesion()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                >
                  <SignOut size={16} weight="bold" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-extrabold shadow-xs">
                <Lightning size={16} weight="fill" className="text-amber-600" />
                <span>Formación tecnológica • 9° año</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Diagnóstico & Dashboard
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Seleccione el módulo que desea utilizar para la evaluación diagnóstica de los estudiantes o la revisión analítica de los resultados.
              </p>
            </div>

            {/* Módulos Principales: Diagnóstico y Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              {/* Tarjeta 1: Diagnóstico */}
              <div className="bg-white text-slate-900 rounded-3xl border-2 border-emerald-300/80 p-6 sm:p-8 shadow-softPastel flex flex-col justify-between hover:border-emerald-500 transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-800 border border-emerald-300/70 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <Lightning size={28} weight="fill" className="text-amber-600" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-extrabold rounded-full">
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
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
                  >
                    <span>Ingresar a Diagnóstico</span>
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>

              {/* Tarjeta 2: Dashboard */}
              <div className="bg-white text-slate-900 rounded-3xl border-2 border-teal-300/80 p-6 sm:p-8 shadow-softPastel flex flex-col justify-between hover:border-teal-500 transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100/90 text-teal-800 border border-teal-300/70 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                    <ChartBar size={28} weight="duotone" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-teal-50 text-teal-900 border border-teal-200 text-xs font-extrabold rounded-full">
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
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
                  >
                    <span>Ingresar a Dashboard</span>
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Métricas Resumidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white border border-stone-200/90 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                <div className="text-2xl font-black text-slate-900">10 Reactivos</div>
                <div className="text-xs text-stone-500 font-semibold">Diagnóstico integrado de 9°</div>
              </div>

              <div className="bg-white border border-stone-200/90 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                <div className="text-2xl font-black text-emerald-700">{telemetria.length}</div>
                <div className="text-xs text-stone-500 font-semibold">Evaluaciones registradas</div>
              </div>

              <div className="bg-white border border-stone-200/90 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                <div className="text-2xl font-black text-amber-700">100% Offline</div>
                <div className="text-xs text-stone-500 font-semibold">Sincronización QR docente</div>
              </div>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}
