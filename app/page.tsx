"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente, CentroEducativoDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP, LISTA_DRE_REGIONALES } from "@/lib/dreCircuitos";
import { formatearCedulaCR } from "@/lib/cedulaUtils";
import SelectorCentrosYSecciones, { CREAR_CENTRO_DEFAULT } from "@/components/SelectorCentrosYSecciones";
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

  // Formulario Registro con PIN y Selector de Rol
  const [tipoRol, setTipoRol] = useState<"Docente" | "Asesor Regional" | "Asesor Nacional">("Docente");
  const [regNombre, setRegNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regCedula, setRegCedula] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regDRE, setRegDRE] = useState("DRE-01");
  const [regInstitucion, setRegInstitucion] = useState("");
  const [regCentros, setRegCentros] = useState<CentroEducativoDocente[]>([CREAR_CENTRO_DEFAULT(1)]);
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
          return "⚠️ PIN vulnerable: Evita usar los primeros o últimos dígitos de tu cédula.";
        }
      }
    }
    return null;
  };

  const advertenciaPin = evaluarPIN(regPin, regCedula);

  // Manejador de Registro Completo con PIN y Rol
  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    setRegMensaje(null);

    // 1. Validar nombre completo
    if (!regNombre.trim() || regNombre.trim().split(/\s+/).length < 2) {
      setRegMensaje({ tipo: "error", texto: "Por favor ingrese su nombre y apellidos completos." });
      return;
    }

    // 2. Validar correo institucional oficial
    const correoLimpio = regCorreo.trim().toLowerCase();
    const regexMepStrict = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+@mep\.go\.cr$/i;
    if (!regexMepStrict.test(correoLimpio)) {
      setRegMensaje({
        tipo: "error",
        texto: "Debe ingresar una cuenta de correo oficial del MEP (ejemplo: nombre.apellido.apellido@mep.go.cr).",
      });
      return;
    }

    // 3. Validar cédula costarricense
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

    let dreCodigoFinal = regDRE;
    let dreNombreFinal = "";
    let circuitoFinal = "Circuito 01";
    let institucionFinal = regInstitucion.trim() || "Liceo / Colegio de Secundaria";
    let rolFinal = "Docente de Formación Tecnológica";
    let codigoPresupuestarioFinal = "SABER-2027";
    let centrosFinales = regCentros;

    const esSuperAdminAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr";

    if (tipoRol === "Asesor Nacional" || esSuperAdminAlberto) {
      dreCodigoFinal = "DRE-NACIONAL";
      dreNombreFinal = "Asesoría de Formación Tecnológica";
      circuitoFinal = "Nivel Nacional / Ámbito General";
      institucionFinal = "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)";
      rolFinal = esSuperAdminAlberto
        ? "Super Administrador & Asesor Nacional"
        : "Asesor de Formación Tecnológica";
      codigoPresupuestarioFinal = "FT-NACIONAL-2027";
    } else if (tipoRol === "Asesor Regional") {
      const dreEncontrada = LISTA_DRE_REGIONALES.find((d) => d.codigo === regDRE) || LISTA_DRE_REGIONALES[0];
      dreCodigoFinal = dreEncontrada.codigo;
      dreNombreFinal = dreEncontrada.nombre;
      circuitoFinal = dreEncontrada.circuitos[0] || "Circuito 01";
      institucionFinal = `Asesoría Regional de Educación - ${dreEncontrada.nombre}`;
      rolFinal = "Asesor Regional de Educación";
      codigoPresupuestarioFinal = `REG-${dreEncontrada.codigo}-2027`;
    } else {
      const centrosConNombre = regCentros.filter((c) => c.nombre && c.nombre.trim().length > 0);
      if (centrosConNombre.length === 0) {
        setRegMensaje({ tipo: "error", texto: "Por favor indique el nombre de al menos un Centro Educativo o Liceo." });
        return;
      }
      dreCodigoFinal = centrosConNombre[0].dreCodigo;
      dreNombreFinal = centrosConNombre[0].dreNombre;
      circuitoFinal = centrosConNombre[0].circuito;
      institucionFinal = centrosConNombre.map((c) => c.nombre.trim()).join(" / ");
      centrosFinales = centrosConNombre;
    }

    const randomId = esSuperAdminAlberto
      ? "ASESOR-FT-7729"
      : (tipoRol === "Asesor Nacional"
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
      tipoRol: tipoRol,
      centrosEducativos: tipoRol === "Docente" ? centrosFinales : undefined,
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
                <span>Formación Tecnológica • Ministerio de Educación Pública</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Diagnóstico Secundaria PNFT
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
                Recurso oficial para el desarrollo del diagnóstico formativo en <strong>7.°, 8.° y 9.° Año</strong> con base en el Programa Nacional de Formación Tecnológica (PNFT).
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
                        placeholder="Ej: X-XXXX-XXXX o nombre.apellido.apellido@mep.go.cr"
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
                        className="w-full pl-10 pr-10 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold tracking-widest text-center"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarLoginPin(!mostrarLoginPin)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                        title={mostrarLoginPin ? "Ocultar PIN" : "Mostrar PIN"}
                      >
                        {mostrarLoginPin ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <SignIn size={18} weight="bold" />
                    <span>Ingresar con PIN</span>
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTabAuth("registro");
                        setRegMensaje(null);
                      }}
                      className="text-xs font-semibold text-stone-500 hover:text-emerald-900"
                    >
                      ¿No tienes cuenta registrada? <strong className="text-emerald-800 underline">Regístrate aquí</strong>
                    </button>
                  </div>
                </form>
              ) : (
                /* Formulario Registro con PIN */
                <form onSubmit={handleRegistro} className="space-y-4">
                  {regMensaje && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 font-bold ${
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
                          placeholder="X-XXXX-XXXX"
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

                  {/* Selector de Rol Profesional MEP */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      Rol Profesional en el MEP <span className="text-rose-600">*</span>:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setTipoRol("Docente")}
                        className={`p-2.5 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                          tipoRol === "Docente"
                            ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <UserCircle size={20} weight={tipoRol === "Docente" ? "fill" : "regular"} className={tipoRol === "Docente" ? "text-emerald-700" : "text-stone-500"} />
                        <span className="text-[11px] font-black leading-tight">Profesor / Docente</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTipoRol("Asesor Regional")}
                        className={`p-2.5 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                          tipoRol === "Asesor Regional"
                            ? "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <Buildings size={20} weight={tipoRol === "Asesor Regional" ? "fill" : "regular"} className={tipoRol === "Asesor Regional" ? "text-indigo-700" : "text-stone-500"} />
                        <span className="text-[11px] font-black leading-tight">Asesor Regional</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setTipoRol("Asesor Nacional")}
                        className={`p-2.5 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                          tipoRol === "Asesor Nacional"
                            ? "bg-purple-50 border-purple-600 text-purple-950 shadow-xs"
                            : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                        }`}
                      >
                        <Sparkle size={20} weight={tipoRol === "Asesor Nacional" ? "fill" : "regular"} className={tipoRol === "Asesor Nacional" ? "text-purple-700" : "text-stone-500"} />
                        <span className="text-[11px] font-black leading-tight">Asesor Nacional</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos dependientes del rol */}
                  {tipoRol === "Asesor Nacional" ? (
                    <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 space-y-1">
                      <div className="font-extrabold flex items-center gap-1.5 text-purple-900">
                        <CheckCircle size={16} weight="fill" className="text-purple-700" />
                        <span>Ámbito General y Cobertura Nacional</span>
                      </div>
                      <p className="text-[11px] text-purple-900 leading-relaxed">
                        Acceso global a las 27 Direcciones Regionales de Educación (DRE) y observatorio macro del país.
                      </p>
                    </div>
                  ) : tipoRol === "Asesor Regional" ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                        Dirección Regional (DRE) a Cargo <span className="text-rose-600">*</span>:
                      </label>
                      <select
                        value={regDRE}
                        onChange={(e) => setRegDRE(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
                      >
                        {LISTA_DRE_REGIONALES.map((dre) => (
                          <option key={dre.codigo} value={dre.codigo}>
                            {dre.codigo} - {dre.nombre} ({dre.provincia})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <SelectorCentrosYSecciones
                      centros={regCentros}
                      onChangeCentros={setRegCentros}
                    />
                  )}

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
              </div>
            </div>

            {/* Título Principal */}
            <div className="text-center space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-extrabold shadow-xs">
                <Lightning size={16} weight="fill" className="text-amber-600" />
                <span>Evaluación Diagnóstica MEP • 7.°, 8.° y 9.° Año</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Diagnóstico Secundaria
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Panel integral para la generación de enlaces de grupo, recepción de telemetría y consolidación analítica por nivel.
              </p>
            </div>

            {/* Módulos Principales: Dashboard Docente (y Asesoría solo para Asesores/Admins) */}
            {(() => {
              const correoLimpio = docente?.correoInstitucional?.toLowerCase().trim() || "";
              const esSuperAdmin = correoLimpio === "alberto.bustos.ortega@mep.go.cr";
              const esAsesor =
                esSuperAdmin ||
                correoLimpio === "allan.morera.araya@mep.go.cr" ||
                (docente?.tipoRol === "Asesor Nacional" || docente?.tipoRol === "Asesor Regional");

              return (
                <div className={`grid grid-cols-1 ${esAsesor ? "md:grid-cols-2" : "max-w-2xl mx-auto"} gap-6 pt-4`}>
                  {/* Tarjeta 1: Dashboard Docente */}
                  <div className="bg-white text-slate-900 rounded-3xl border-2 border-emerald-400 p-6 sm:p-8 shadow-softPastel flex flex-col justify-between hover:border-emerald-600 transition-all group">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-800 border border-emerald-300/70 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        <ChartBar size={28} weight="duotone" />
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-extrabold rounded-full">
                          Herramienta del Docente
                        </span>
                        <h3 className="text-xl font-black text-slate-900 mt-2">
                          Dashboard Docente (7°, 8° y 9°)
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Generación de enlaces seguros por nivel (sin QR), recepción de telemetría en tiempo real, rúbrica de saberes procedimentales y socioafectivos, y exportación oficial a Excel/PDF.
                      </p>
                    </div>
                    <div className="pt-6">
                      <Link
                        href="/dashboard"
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
                      >
                        <span>Ingresar al Dashboard Docente</span>
                        <ArrowRight size={16} weight="bold" />
                      </Link>
                    </div>
                  </div>

                  {/* Tarjeta 2: Asesoría & Recursos (SOLO VISIBLE PARA ASESORES Y ADMINISTRADORES) */}
                  {esAsesor && (
                    <div className="bg-white text-slate-900 rounded-3xl border-2 border-indigo-300/80 p-6 sm:p-8 shadow-softPastel flex flex-col justify-between hover:border-indigo-500 transition-all group">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100/90 text-indigo-800 border border-indigo-300/70 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                          <Lightning size={28} weight="fill" className="text-indigo-600" />
                        </div>
                        <div>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-extrabold rounded-full">
                            Módulo para Asesores & Recursos
                          </span>
                          <h3 className="text-xl font-black text-slate-900 mt-2">
                            Asesoría & Diagnóstico
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          Exploración curricular seccionada por niveles (7.°, 8.°, 9.°), descarga de documentos técnicos y guías pedagógicas en PDF, banco de instrumentos y dictamen de validación ministerial.
                        </p>
                      </div>
                      <div className="pt-6">
                        <Link
                          href="/diagnostico"
                          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
                        >
                          <span>Explorar módulos y guías pedagógicas</span>
                          <ArrowRight size={16} weight="bold" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Métricas Resumidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white border border-stone-200/90 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                <div className="text-2xl font-black text-slate-900">3 Niveles</div>
                <div className="text-xs text-stone-500 font-semibold">7.°, 8.° y 9.° Año Integrados</div>
              </div>

              <div className="bg-white border border-stone-200/90 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                <div className="text-2xl font-black text-emerald-700">{telemetria.length}</div>
                <div className="text-xs text-stone-500 font-semibold">Evaluaciones Registradas</div>
              </div>

              <div className="bg-white border border-stone-200/90 p-4 rounded-2xl text-center space-y-1 shadow-xs">
                <div className="text-2xl font-black text-indigo-700">100% Blindado</div>
                <div className="text-xs text-stone-500 font-semibold">Enlaces con Token Seguro</div>
              </div>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}
