"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente, CentroEducativoDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP, LISTA_DRE_REGIONALES } from "@/lib/dreCircuitos";
import { formatearCedulaCR } from "@/lib/cedulaUtils";
import SelectorCentrosYSecciones, { CREAR_CENTRO_DEFAULT } from "@/components/SelectorCentrosYSecciones";
import {
  ShieldCheck,
  UserCircle,
  LockKey,
  EnvelopeSimple,
  IdentificationCard,
  SignIn,
  UserPlus,
  Buildings,
  CheckCircle,
  WarningCircle,
  Sparkle,
  Lightning,
  Key,
  Eye,
  EyeSlash,
  Phone,
  Info,
} from "@phosphor-icons/react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { docente, isInitialized, iniciarSesionConPIN, registrarDocente } = useDocente();

  const [tab, setTab] = useState<"login" | "registro">("login");

  // Login form state (Cédula/Correo + PIN)
  const [loginCredencial, setLoginCredencial] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [mostrarPin, setMostrarPin] = useState(false);
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Registro form state
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

  // Loading during hydration
  if (!isInitialized) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-sm font-bold text-slate-600">Verificando sesión activa...</div>
      </div>
    );
  }

  // If already authenticated, render protected children
  if (docente) {
    return <>{children}</>;
  }

  // Handler for Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMensaje(null);

    const credLimpia = loginCredencial.trim();
    const pinLimpio = loginPin.trim();

    if (!credLimpia) {
      setLoginMensaje({ tipo: "error", texto: "Por favor ingrese su Cédula o Correo Institucional MEP." });
      return;
    }
    if (!pinLimpio || !/^\d{4,6}$/.test(pinLimpio)) {
      setLoginMensaje({ tipo: "error", texto: "El PIN debe tener entre 4 y 6 dígitos numéricos." });
      return;
    }

    const res = iniciarSesionConPIN(credLimpia, pinLimpio);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // Lista de usuarios y docentes predefinidos para pruebas oficiales
  const USUARIOS_PRUEBA_DEMO = [
    {
      nombre: "Prof. Alberto Bustos Ortega",
      tag: "Asesor / Super Admin",
      correo: "alberto.bustos.ortega@mep.go.cr",
      cedula: "5-0305-0179",
      pin: "2617",
      colorTag: "bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200",
    },
    {
      nombre: "Docente Prueba San José",
      tag: "San José Central",
      correo: "prueba.docente1.docente.1@mep.go.cr",
      cedula: "0-0000-0001",
      pin: "110011",
      colorTag: "bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100",
    },
    {
      nombre: "Docente Prueba Alajuela",
      tag: "Alajuela",
      correo: "prueba.docente2.docente.2@mep.go.cr",
      cedula: "0-0000-0002",
      pin: "221111",
      colorTag: "bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100",
    },
    {
      nombre: "Docente Prueba Cartago",
      tag: "Cartago",
      correo: "prueba.docente3.docente.3@mep.go.cr",
      cedula: "0-0000-0003",
      pin: "332211",
      colorTag: "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100",
    },
    {
      nombre: "Docente Prueba Heredia",
      tag: "Heredia",
      correo: "prueba.docente4.docente.4@mep.go.cr",
      cedula: "0-0000-0004",
      pin: "443311",
      colorTag: "bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100",
    },
    {
      nombre: "Docente Prueba Guanacaste",
      tag: "Liberia",
      correo: "prueba.docente5.docente.5@mep.go.cr",
      cedula: "0-0000-0005",
      pin: "554411",
      colorTag: "bg-sky-50 text-sky-900 border-sky-300 hover:bg-sky-100",
    },
    {
      nombre: "Docente Prueba Puntarenas",
      tag: "Puntarenas",
      correo: "prueba.docente6.docente.6@mep.go.cr",
      cedula: "0-0000-0006",
      pin: "665511",
      colorTag: "bg-orange-50 text-orange-900 border-orange-300 hover:bg-orange-100",
    },
    {
      nombre: "Docente Prueba Limón",
      tag: "Limón",
      correo: "prueba.docente7.docente.7@mep.go.cr",
      cedula: "0-0000-0007",
      pin: "776611",
      colorTag: "bg-lime-50 text-lime-900 border-lime-300 hover:bg-lime-100",
    },
    {
      nombre: "Docente Prueba Pérez Zeledón",
      tag: "Pérez Zeledón",
      correo: "prueba.docente8.docente.8@mep.go.cr",
      cedula: "0-0000-0008",
      pin: "887711",
      colorTag: "bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100",
    },
    {
      nombre: "Docente Prueba San Carlos",
      tag: "San Carlos",
      correo: "prueba.docente9.docente.9@mep.go.cr",
      cedula: "0-0000-0009",
      pin: "998811",
      colorTag: "bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100",
    },
    {
      nombre: "Docente Prueba Occidente",
      tag: "Occidente",
      correo: "prueba.docente10.docente.10@mep.go.cr",
      cedula: "0-0000-0010",
      pin: "100911",
      colorTag: "bg-cyan-50 text-cyan-900 border-cyan-300 hover:bg-cyan-100",
    },
  ];

  const seleccionarUsuarioPrueba = (correo: string, pin: string, autoIngresar = true) => {
    try {
      localStorage.removeItem(`auth_lock_${correo.toLowerCase()}`);
      localStorage.removeItem(`auth_attempts_${correo.toLowerCase()}`);
    } catch (e) {}
    setTab("login");
    setLoginCredencial(correo);
    setLoginPin(pin);
    setLoginMensaje(null);
    if (autoIngresar) {
      setTimeout(() => {
        iniciarSesionConPIN(correo, pin);
      }, 50);
    }
  };

  // Handler for Demo Credentials fill
  const rellenarDemo = () => {
    seleccionarUsuarioPrueba("alberto.bustos.ortega@mep.go.cr", "2617", true);
  };

  // Handler for Registro
  const handleRegistroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegMensaje(null);

    if (!regNombre.trim() || regNombre.trim().split(/\s+/).length < 2) {
      setRegMensaje({ tipo: "error", texto: "Ingrese su nombre completo (Nombre y Apellidos)." });
      return;
    }

    const correoLimpio = regCorreo.trim().toLowerCase();
    const regexMepStrict = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+@mep\.go\.cr$/i;
    if (!regexMepStrict.test(correoLimpio)) {
      setRegMensaje({
        tipo: "error",
        texto: "El correo debe ser institucional oficial del MEP con formato nombre.apellido.apellido@mep.go.cr",
      });
      return;
    }

    const cedulaLimpia = formatearCedulaCR(regCedula.trim());
    if (!cedulaLimpia || cedulaLimpia.replace(/[^0-9]/g, "").length < 9) {
      setRegMensaje({ tipo: "error", texto: "La cédula debe tener un formato válido oficial (9 dígitos con ceros ej: 5-0305-0179)." });
      return;
    }

    const pinLimpio = regPin.trim();
    if (!/^\d{4,6}$/.test(pinLimpio)) {
      setRegMensaje({ tipo: "error", texto: "El PIN debe tener entre 4 y 6 dígitos numéricos." });
      return;
    }

    if (pinLimpio !== regPinConfirmar.trim()) {
      setRegMensaje({ tipo: "error", texto: "La confirmación del PIN no coincide." });
      return;
    }

    let dreCodigoFinal = regDRE;
    let dreNombreFinal = "";
    let circuitoFinal = "Circuito 01";
    let institucionFinal = regInstitucion.trim() || "Liceo / Colegio de Secundaria";
    let rolFinal = "Docente de Formación Tecnológica";
    let codigoPresupuestarioFinal = "SABER-2027";
    let centrosFinales = regCentros;

    if (tipoRol === "Asesor Nacional" || correoLimpio === "alberto.bustos.ortega@mep.go.cr") {
      dreCodigoFinal = "DRE-NACIONAL";
      dreNombreFinal = "Asesoría de Formación Tecnológica";
      circuitoFinal = "Nivel Nacional / Ámbito General";
      institucionFinal = "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)";
      rolFinal = "Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)";
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
        setRegMensaje({ tipo: "error", texto: "Por favor ingrese el nombre de al menos un Centro Educativo." });
        return;
      }
      dreCodigoFinal = centrosConNombre[0].dreCodigo;
      dreNombreFinal = centrosConNombre[0].dreNombre;
      circuitoFinal = centrosConNombre[0].circuito;
      institucionFinal = centrosConNombre.map((c) => c.nombre.trim()).join(" / ");
      centrosFinales = centrosConNombre;
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Cabecera del Portal */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-xs font-bold shadow-xs">
            <Lightning size={16} weight="fill" className="text-amber-400" />
            <span>Formación Tecnológica • Programa Nacional MEP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Acceso al Entorno de Diagnóstico
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
            Ingreso ágil con <strong>Cédula / Correo MEP</strong> y <strong>PIN de 4 dígitos</strong>
          </p>
        </div>

        {/* Tarjeta de Autenticación */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden">
          {/* Selector de Pestañas */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
            <button
              type="button"
              onClick={() => {
                setTab("login");
                setLoginMensaje(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                tab === "login"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Key size={18} weight="bold" />
              <span>Iniciar con PIN</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("registro");
                setRegMensaje(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                tab === "registro"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserPlus size={18} weight="bold" />
              <span>Registrarse</span>
            </button>
          </div>

          {/* Cuerpo del Formulario */}
          <div className="p-6 sm:p-8">
            {tab === "login" ? (
              /* Formulario de Login con PIN */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginMensaje && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                      loginMensaje.tipo === "exito"
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-950"
                        : "bg-rose-50 border border-rose-300 text-rose-950"
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
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                    Cédula o Correo Institucional MEP:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <IdentificationCard size={18} />
                    </div>
                      <input
                        type="text"
                        value={loginCredencial}
                        onChange={(e) => setLoginCredencial(e.target.value)}
                        placeholder="Ej: X-XXXX-XXXX o nombre.apellido.apellido@mep.go.cr"
                        required
                        className="w-full pl-10 pr-3.5 py-3 bg-[#FCFBF9] border border-stone-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                      />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                      PIN de Acceso (4 Dígitos):
                    </label>
                    <Link
                      href="/registro"
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                    >
                      ¿Olvidaste tu PIN?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LockKey size={18} />
                    </div>
                    <input
                      type={mostrarPin ? "text" : "password"}
                      maxLength={6}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-[#FCFBF9] border border-stone-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPin(!mostrarPin)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {mostrarPin ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <SignIn size={18} weight="bold" />
                    <span>Ingresar con PIN</span>
                  </button>
                </div>

                {/* SECCIÓN: CUENTAS Y USUARIOS PREDEFINIDOS PARA PRUEBAS (1 CLIC) */}
                <div className="mt-5 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Sparkle size={15} weight="fill" className="text-amber-500" />
                      <span>Cuentas Predefinidas para Pruebas (1 Clic)</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Auto-ingreso
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
                    {USUARIOS_PRUEBA_DEMO.map((u, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => seleccionarUsuarioPrueba(u.correo, u.pin, true)}
                        className={`text-left p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${u.colorTag}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-[11px] truncate">{u.nombre}</span>
                          <span className="text-[9px] font-mono font-black bg-white/80 px-1 rounded">
                            PIN: {u.pin}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-80 mt-0.5">
                          <span className="truncate">{u.tag}</span>
                          <span className="font-bold text-[9px] text-emerald-800">⚡ Ingresar</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium">¿No tienes cuenta registrada? </span>
                  <button
                    type="button"
                    onClick={() => setTab("registro")}
                    className="text-xs font-black text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                  >
                    Regístrate aquí
                  </button>
                </div>
              </form>
            ) : (
              /* Formulario Rápido de Registro con PIN */
              <form onSubmit={handleRegistroSubmit} className="space-y-4">
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

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    Nombre Completo (Nombre y Apellidos) <span className="text-rose-600">*</span>:
                  </label>
                  <input
                    type="text"
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    placeholder="Nombre y Apellidos (ej. Juan Pérez Gómez)"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      Cédula / Identificación <span className="text-rose-600">*</span>:
                    </label>
                    <input
                      type="text"
                      value={regCedula}
                      onChange={(e) => setRegCedula(e.target.value)}
                      placeholder="X-XXXX-XXXX"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      Teléfono de Contacto (Opcional):
                    </label>
                    <input
                      type="tel"
                      value={regTelefono}
                      onChange={(e) => setRegTelefono(e.target.value)}
                      placeholder="8888-9999"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                    Correo Institucional MEP (@mep.go.cr) <span className="text-rose-600">*</span>:
                  </label>
                  <input
                    type="email"
                    value={regCorreo}
                    onChange={(e) => setRegCorreo(e.target.value)}
                    placeholder="nombre.apellido.apellido@mep.go.cr"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    📌 La comunicación oficial del MEP se enviará siempre a esta cuenta.
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
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <UserCircle size={20} weight={tipoRol === "Docente" ? "fill" : "regular"} className={tipoRol === "Docente" ? "text-emerald-700" : "text-slate-500"} />
                      <span className="text-[11px] font-black leading-tight">Profesor / Docente</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipoRol("Asesor Regional")}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                        tipoRol === "Asesor Regional"
                          ? "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Buildings size={20} weight={tipoRol === "Asesor Regional" ? "fill" : "regular"} className={tipoRol === "Asesor Regional" ? "text-indigo-700" : "text-slate-500"} />
                      <span className="text-[11px] font-black leading-tight">Asesor Regional</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTipoRol("Asesor Nacional")}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                        tipoRol === "Asesor Nacional"
                          ? "bg-purple-50 border-purple-600 text-purple-950 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Sparkle size={20} weight={tipoRol === "Asesor Nacional" ? "fill" : "regular"} className={tipoRol === "Asesor Nacional" ? "text-purple-700" : "text-slate-500"} />
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none"
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

                <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-black text-indigo-950 uppercase">
                        PIN (4 a 6 dígitos)
                      </label>
                      <button
                        type="button"
                        onClick={() => setMostrarRegPin(!mostrarRegPin)}
                        className="text-[10px] text-indigo-700 font-bold hover:underline"
                      >
                        {mostrarRegPin ? "Ocultar" : "Ver"}
                      </button>
                    </div>
                    <input
                      type={mostrarRegPin ? "text" : "password"}
                      maxLength={6}
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••••"
                      required
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-center font-mono text-base font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-indigo-950 uppercase mb-1">
                      Confirmar PIN
                    </label>
                    <input
                      type={mostrarRegPin ? "text" : "password"}
                      maxLength={6}
                      value={regPinConfirmar}
                      onChange={(e) => setRegPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••••"
                      required
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-center font-mono text-base font-black text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} weight="bold" />
                    <span>Crear Cuenta & Habilitar PIN</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
