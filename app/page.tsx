"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente, CentroEducativoDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP, LISTA_DRE_REGIONALES } from "@/lib/dreCircuitos";
import { formatearCedulaCR } from "@/lib/cedulaUtils";
import SelectorCentrosYSecciones, { CREAR_CENTRO_DEFAULT } from "@/components/SelectorCentrosYSecciones";
import PanelDocenteSimplificado from "@/components/PanelDocenteSimplificado";
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
  ArrowSquareOut,
  BookOpen,
  CaretDown,
  CaretUp,
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
  const [mostrarGuiaInline, setMostrarGuiaInline] = useState(false);

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
    if (!pinLimpio || !/^\d{4,6}$/.test(pinLimpio)) {
      setLoginMensaje({ tipo: "error", texto: "El PIN debe contener entre 4 y 6 dígitos numéricos." });
      return;
    }

    const res = iniciarSesionConPIN(credLimpia, pinLimpio);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // Lista de usuarios de prueba para acceso y validación temporal
  const USUARIOS_PRUEBA_DEMO = [
    {
      nombre: "Docente Prueba San José",
      tag: "Docente San José",
      correo: "prueba.docente1.docente.1@mep.go.cr",
      cedula: "0-0000-0001",
      pin: "110011",
      colorTag: "bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100",
    },
    {
      nombre: "Docente Prueba Alajuela",
      tag: "Docente Alajuela",
      correo: "prueba.docente2.docente.2@mep.go.cr",
      cedula: "0-0000-0002",
      pin: "221111",
      colorTag: "bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100",
    },
    {
      nombre: "Docente Prueba Cartago",
      tag: "Docente Cartago",
      correo: "prueba.docente3.docente.3@mep.go.cr",
      cedula: "0-0000-0003",
      pin: "332211",
      colorTag: "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100",
    },
    {
      nombre: "Docente Prueba Heredia",
      tag: "Docente Heredia",
      correo: "prueba.docente4.docente.4@mep.go.cr",
      cedula: "0-0000-0004",
      pin: "443311",
      colorTag: "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100",
    },
    {
      nombre: "Docente Prueba Guanacaste",
      tag: "Docente Guanacaste",
      correo: "prueba.docente5.docente.5@mep.go.cr",
      cedula: "0-0000-0005",
      pin: "554411",
      colorTag: "bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100",
    },
    {
      nombre: "Docente Prueba Puntarenas",
      tag: "Docente Puntarenas",
      correo: "prueba.docente6.docente.6@mep.go.cr",
      cedula: "0-0000-0006",
      pin: "665511",
      colorTag: "bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100",
    },
    {
      nombre: "Docente Prueba Limón",
      tag: "Docente Limón",
      correo: "prueba.docente7.docente.7@mep.go.cr",
      cedula: "0-0000-0007",
      pin: "776611",
      colorTag: "bg-lime-50 text-lime-900 border-lime-300 hover:bg-lime-100",
    },
    {
      nombre: "Docente Prueba Pérez Zeledón",
      tag: "Docente Pérez Zeledón",
      correo: "prueba.docente8.docente.8@mep.go.cr",
      cedula: "0-0000-0008",
      pin: "887711",
      colorTag: "bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100",
    },
    {
      nombre: "Docente Prueba San Carlos",
      tag: "Docente San Carlos",
      correo: "prueba.docente9.docente.9@mep.go.cr",
      cedula: "0-0000-0009",
      pin: "998811",
      colorTag: "bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100",
    },
    {
      nombre: "Docente Prueba Occidente",
      tag: "Docente Occidente",
      correo: "prueba.docente10.docente.10@mep.go.cr",
      cedula: "0-0000-0010",
      pin: "100911",
      colorTag: "bg-cyan-50 text-cyan-900 border-cyan-300 hover:bg-cyan-100",
    },
  ];

  const seleccionarUsuarioPrueba = (correo: string, pin: string) => {
    try {
      localStorage.removeItem(`auth_lock_${correo.toLowerCase()}`);
      localStorage.removeItem(`auth_attempts_${correo.toLowerCase()}`);
    } catch (e) {}
    setTabAuth("login");
    setLoginCredencial(correo);
    setLoginPin(pin);
    setLoginMensaje(null);
  };

  // Autocompletar demo de pruebas
  const usarDemo = () => {
    seleccionarUsuarioPrueba("alberto.bustos.ortega@mep.go.cr", "2617");
  };

  // Reglas de evaluación del PIN en tiempo real
  const evaluarPIN = (valorPin: string, valorCedula: string) => {
    if (!valorPin) return null;
    if (!/^\d{4,6}$/.test(valorPin)) {
      return "El PIN debe contener entre 4 y 6 dígitos numéricos (0-9).";
    }
    if (/^(\d)\1{3,}$/.test(valorPin)) {
      return "⚠️ PIN muy predecible: Evita usar todos los dígitos iguales (ej. 0000 o 1111).";
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

    // 4. Validar PIN de 4 a 6 dígitos
    const pinLimpio = regPin.trim();
    if (!/^\d{4,6}$/.test(pinLimpio)) {
      setRegMensaje({ tipo: "error", texto: "El PIN de acceso rápido debe contener entre 4 y 6 dígitos numéricos." });
      return;
    }

    if (pinLimpio !== regPinConfirmar.trim()) {
      setRegMensaje({ tipo: "error", texto: "La confirmación del PIN no coincide. Ingrese los mismos dígitos." });
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
                <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
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
                        id="loginCredencial"
                        name="docente_identificacion_pnft"
                        type="text"
                        autoComplete="off"
                        value={loginCredencial}
                        onChange={(e) => setLoginCredencial(e.target.value)}
                        placeholder="0-0000-0000 (o correo@mep.go.cr)"
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
                        id="loginPin"
                        name="docente_pin_pnft"
                        type={mostrarLoginPin ? "text" : "password"}
                        autoComplete="new-password"
                        maxLength={6}
                        value={loginPin}
                        onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-semibold tracking-widest text-center font-mono"
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
                          placeholder="0-0000-0000"
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
                          placeholder="0000-0000"
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
                          Crea tu PIN (4 a 6 números)
                        </label>
                        <input
                          type={mostrarRegPin ? "text" : "password"}
                          maxLength={6}
                          value={regPin}
                          onChange={(e) => setRegPin(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="••••••"
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
                          maxLength={6}
                          value={regPinConfirmar}
                          onChange={(e) => setRegPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="••••••"
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

            {/* Cuentas de Prueba de Acceso Rápido (Formato Resumido y Horizontal) */}
            <div className="bg-stone-50/90 border border-stone-200/90 rounded-2xl p-3 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-stone-600">
                <Key size={13} className="text-amber-600" weight="fill" />
                <span>Cuentas de prueba (clic para autocompletar e ingresar):</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {USUARIOS_PRUEBA_DEMO.map((u) => (
                  <button
                    key={u.correo}
                    type="button"
                    onClick={() => seleccionarUsuarioPrueba(u.correo, u.pin)}
                    title={`Autocompletar ${u.nombre} (${u.correo})`}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 ${u.colorTag}`}
                  >
                    <span className="font-extrabold">{u.tag}</span>
                    <span className="text-[10px] opacity-75 font-mono">({u.cedula})</span>
                    <span className="bg-white/90 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md font-mono border border-stone-200">
                      PIN: {u.pin}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Si el docente YA ha iniciado sesión, mostrar directamente el Centro de Control Multifuncional */
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          <PanelDocenteSimplificado />
        </section>
      )}
    </div>
  );
}
