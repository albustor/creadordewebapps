"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP, LISTA_DRE_REGIONALES } from "@/lib/dreCircuitos";
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
  Crown,
  Eye,
  EyeSlash,
  WhatsappLogo,
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

  // Autocompletar demo de Asesoría Nacional
  const usarDemo = () => {
    setLoginCredencial("alberto.bustos.ortega@mep.go.cr");
    setLoginPin("1726");
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
    const cedLimpia = valorCedula.replace(/[^0-9]/g, "");
    if (cedLimpia.length >= 4 && cedLimpia.endsWith(valorPin)) {
      return "⚠️ Evita usar los últimos 4 dígitos de tu número de cédula como PIN.";
    }
    return null;
  };

  const advertenciaPin = evaluarPIN(regPin, regCedula);

  // Manejador de Registro con PIN
  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setRegMensaje(null);

    // 1. Validar nombre completo (mínimo 2 palabras: Nombre y Apellidos)
    const partesNombre = regNombre.trim().split(/\s+/);
    if (partesNombre.length < 2) {
      setRegMensaje({ tipo: "error", texto: "Por favor ingrese su nombre completo (Nombre y Apellidos)." });
      return;
    }

    // 2. Validar cédula (mínimo 9 dígitos)
    const cedulaLimpia = regCedula.trim();
    if (cedulaLimpia.replace(/[^0-9]/g, "").length < 9 && cedulaLimpia.length < 9) {
      setRegMensaje({ tipo: "error", texto: "La cédula o identificación debe tener un formato válido (mínimo 9 dígitos)." });
      return;
    }

    // 3. Validar correo institucional oficial MEP estricto: nombre.apellido.apellido@mep.go.cr
    const correoLimpio = regCorreo.trim().toLowerCase();
    const regexMepStrict = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+@mep\.go\.cr$/i;
    if (!regexMepStrict.test(correoLimpio)) {
      setRegMensaje({
        tipo: "error",
        texto: "El correo debe ser institucional oficial del MEP con estructura nombre.apellido.apellido@mep.go.cr",
      });
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

    if (esAsesorNacional || correoLimpio === "alberto.bustos.ortega@mep.go.cr") {
      dreCodigoFinal = "DRE-NACIONAL";
      dreNombreFinal = "Asesoría de Formación Tecnológica";
      circuitoFinal = "Nivel Nacional / Ámbito General";
      institucionFinal = "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)";
      rolFinal = "Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)";
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

    const esSuperAdminAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr" || dreCodigoFinal === "DRE-NACIONAL";
    const randomId = esSuperAdminAlberto
      ? "ASESOR-FT-7729"
      : `DOC-${dreCodigoFinal.replace(/[^a-zA-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevoDocente = {
      idDocente: randomId,
      nombreCompleto: regNombre.trim().startsWith("Prof.") ? regNombre.trim() : `Prof. ${regNombre.trim()}`,
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
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative max-w-xl mx-auto space-y-6">
            
            {/* Título de la Plataforma */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/70 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-sm">
                <Lightning size={16} weight="fill" className="text-amber-400" />
                <span>Formación Tecnológica • Programa Nacional MEP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Diagnóstico & Dashboard
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-medium leading-relaxed">
                Ingreso rápido con <strong>Cédula / Correo MEP</strong> y <strong>PIN de 4 dígitos</strong> para aplicación de diagnósticos y telemetría analítica.
              </p>
            </div>

            {/* Tarjeta de Autenticación */}
            <div className="bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Selector de Pestañas */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
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
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
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
                          ? "bg-emerald-950/90 border border-emerald-500/60 text-emerald-200"
                          : "bg-rose-950/90 border border-rose-500/60 text-rose-200"
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
                      Cédula o Correo Electrónico MEP:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <IdentificationCard size={18} />
                      </div>
                      <input
                        type="text"
                        value={loginCredencial}
                        onChange={(e) => setLoginCredencial(e.target.value)}
                        placeholder="Ej: 1-1122-3344 o nombre.apellido.apellido@mep.go.cr"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        PIN de Acceso (4 Dígitos):
                      </label>
                      <Link
                        href="/registro"
                        className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
                      >
                        ¿Olvidaste tu PIN?
                      </Link>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <LockKey size={18} />
                      </div>
                      <input
                        type={mostrarLoginPin ? "text" : "password"}
                        maxLength={4}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-mono font-black tracking-widest text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarLoginPin(!mostrarLoginPin)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {mostrarLoginPin ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={usarDemo}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
                    >
                      <Crown size={15} weight="fill" />
                      <span>Demo Asesoría (Alberto Bustos / PIN 1726)</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                    >
                      <SignIn size={16} weight="bold" />
                      <span>Ingresar con PIN</span>
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
                /* Formulario Registro con PIN y Checkbox de Asesoría */
                <form onSubmit={handleRegistro} className="space-y-4">
                  {regMensaje && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                        regMensaje.tipo === "exito"
                          ? "bg-emerald-950/90 border border-emerald-500/60 text-emerald-200"
                          : "bg-rose-950/90 border border-rose-500/60 text-rose-200"
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

                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nombre completo (Nombre y Apellidos) <span className="text-rose-400">*</span>:
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
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Cédula y Teléfono Opcional */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Cédula / Identificación <span className="text-rose-400">*</span>:
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
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>WhatsApp (Opcional):</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                          <WhatsappLogo size={18} />
                        </div>
                        <input
                          type="tel"
                          value={regTelefono}
                          onChange={(e) => setRegTelefono(e.target.value)}
                          placeholder="8888-9999"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Correo Oficial MEP */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Correo Electrónico Institucional MEP (@mep.go.cr) <span className="text-rose-400">*</span>:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <EnvelopeSimple size={18} />
                      </div>
                      <input
                        type="email"
                        value={regCorreo}
                        onChange={(e) => setRegCorreo(e.target.value)}
                        placeholder="nombre.apellido.apellido@mep.go.cr"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <Info size={14} className="text-emerald-400 shrink-0" />
                      <span>La comunicación oficial del MEP y reportes se enviarán a esta cuenta.</span>
                    </p>
                  </div>

                  {/* CHECKBOX SEPARADOR: ¿Soy Asesor Nacional / Administrador MEP? */}
                  <div className="p-3.5 bg-slate-950/80 border border-amber-500/40 rounded-2xl space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={esAsesorNacional}
                        onChange={(e) => setEsAsesorNacional(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-700 bg-slate-900 cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                          <Crown size={16} weight="fill" className="text-amber-400" />
                          <span>Soy Asesor Nacional / Administrador MEP</span>
                        </span>
                        <p className="text-[11px] text-slate-400 font-medium">
                          Al marcar esta casilla, se asigna automáticamente el rol de Asesoría Nacional y se desactivan la Dirección Regional y el Centro Educativo.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* DRE y Centro Educativo (se desactivan si esAsesorNacional está marcado) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Dirección Regional (DRE):
                      </label>
                      {esAsesorNacional ? (
                        <div className="px-3 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-bold text-amber-300/80 flex items-center gap-2 cursor-not-allowed">
                          <Crown size={15} weight="fill" className="text-amber-400 shrink-0" />
                          <span>Asesoría de Formación Tecnológica</span>
                        </div>
                      ) : (
                        <select
                          value={regDRE}
                          onChange={(e) => setRegDRE(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
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
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Centro Educativo:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                              ? "bg-slate-900/60 border-slate-800 text-slate-400 cursor-not-allowed"
                              : "bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PIN de 4 Dígitos */}
                  <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-indigo-200 flex items-center gap-1.5">
                        <LockKey size={16} weight="bold" className="text-indigo-400" />
                        <span>PIN de Acceso Rápido (4 Dígitos Numéricos) <span className="text-rose-400">*</span></span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setMostrarRegPin(!mostrarRegPin)}
                        className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1"
                      >
                        {mostrarRegPin ? <EyeSlash size={14} /> : <Eye size={14} />}
                        <span>{mostrarRegPin ? "Ocultar" : "Ver PIN"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Crea tu PIN (4 números)
                        </label>
                        <input
                          type={mostrarRegPin ? "text" : "password"}
                          maxLength={4}
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="••••"
                          required
                          className="w-full px-3 py-2 bg-slate-950 border border-indigo-400/60 rounded-xl text-center font-mono text-base font-black text-white focus:outline-none focus:border-indigo-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Confirma tu PIN
                        </label>
                        <input
                          type={mostrarRegPin ? "text" : "password"}
                          maxLength={4}
                          value={regPinConfirmar}
                          onChange={(e) => setRegPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="••••"
                          required
                          className="w-full px-3 py-2 bg-slate-950 border border-indigo-400/60 rounded-xl text-center font-mono text-base font-black text-white focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                    </div>

                    {advertenciaPin && (
                      <div className="p-2 bg-amber-950/80 border border-amber-500/50 rounded-xl text-[11px] font-bold text-amber-200 flex items-center gap-2">
                        <WarningCircle size={15} className="text-amber-400 shrink-0" weight="fill" />
                        <span>{advertenciaPin}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                    >
                      <UserPlus size={16} weight="bold" />
                      <span>Registrarse e Ingresar con PIN</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-center">
                    <span className="text-xs text-slate-400">¿Ya tienes cuenta registrada? </span>
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
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${
                  docente.dreCodigo === "DRE-NACIONAL" || docente.correoInstitucional === "alberto.bustos.ortega@mep.go.cr"
                    ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                    : "bg-emerald-500/20 border-emerald-400/40 text-emerald-300"
                }`}>
                  {docente.dreCodigo === "DRE-NACIONAL" || docente.correoInstitucional === "alberto.bustos.ortega@mep.go.cr" ? (
                    <Crown size={26} weight="fill" />
                  ) : (
                    <UserCircle size={26} weight="fill" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {docente.nombreCompleto}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      {docente.dreCodigo === "DRE-NACIONAL" ? "Asesoría Nacional MEP" : "Docente Activo"}
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
