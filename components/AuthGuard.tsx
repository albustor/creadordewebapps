"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { LISTA_DRE_MEP } from "@/lib/dreCircuitos";
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
  WhatsappLogo,
} from "@phosphor-icons/react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { docente, isInitialized, iniciarSesion, registrarDocente } = useDocente();

  const [tab, setTab] = useState<"login" | "registro">("login");

  // Login form state (Cédula/Correo + PIN)
  const [loginCredencial, setLoginCredencial] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [mostrarPin, setMostrarPin] = useState(false);
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Registro form state
  const [regNombre, setRegNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regCedula, setRegCedula] = useState("");
  const [regTelefono, setRegTelefono] = useState("");
  const [regDRE, setRegDRE] = useState("DRE-01");
  const [regInstitucion, setRegInstitucion] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regPinConfirmar, setRegPinConfirmar] = useState("");
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

    const res = iniciarSesion(loginCredencial, loginPin);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // Handler for Demo Credentials fill
  const rellenarDemo = () => {
    setLoginCredencial("alberto.bustos.ortega@mep.go.cr");
    setLoginPin("1726");
    setLoginMensaje(null);
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

    if (regCedula.trim().length < 9) {
      setRegMensaje({ tipo: "error", texto: "La cédula debe tener un formato válido (mínimo 9 dígitos)." });
      return;
    }

    if (!/^\d{4}$/.test(regPin.trim())) {
      setRegMensaje({ tipo: "error", texto: "El PIN debe tener exactamente 4 dígitos numéricos." });
      return;
    }

    if (regPin.trim() !== regPinConfirmar.trim()) {
      setRegMensaje({ tipo: "error", texto: "La confirmación del PIN no coincide." });
      return;
    }

    const dreSeleccionada = LISTA_DRE_MEP.find((d) => d.codigo === regDRE) || LISTA_DRE_MEP[1];
    const randomId = `DOC-${regDRE.replace(/[^a-zA-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const nuevoDocente = {
      idDocente: randomId,
      nombreCompleto: regNombre.trim().startsWith("Prof.") ? regNombre.trim() : `Prof. ${regNombre.trim()}`,
      correoInstitucional: correoLimpio,
      pin: regPin.trim(),
      contrasena: regPin.trim(),
      cedula: regCedula.trim(),
      telefono: regTelefono.trim(),
      dreCodigo: regDRE,
      dreNombre: dreSeleccionada.nombre,
      circuito: dreSeleccionada.circuitos[0] || "Circuito 01",
      codigoPresupuestario: "SABER-2026",
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
                      placeholder="Ej: 1-1234-0567 o nombre.apellido@mep.go.cr"
                      required
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
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
                      maxLength={4}
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
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

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={rellenarDemo}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
                  >
                    <Key size={14} />
                    <span>(Demo Asesor: alberto.bustos / PIN 1726)</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                  >
                    <SignIn size={18} weight="bold" />
                    <span>Ingresar</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-600">¿Deseas gestionar tu cuenta completa? </span>
                  <Link
                    href="/registro"
                    className="text-xs font-black text-emerald-800 hover:text-emerald-950 hover:underline"
                  >
                    Ir al panel de registro completo
                  </Link>
                </div>
              </form>
            ) : (
              /* Formulario Rápido de Registro */
              <form onSubmit={handleRegistroSubmit} className="space-y-4">
                {regMensaje && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                      regMensaje.tipo === "exito"
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-950"
                        : "bg-rose-50 border border-rose-300 text-rose-950"
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
                    Nombre Completo (Nombre y Apellidos):
                  </label>
                  <input
                    type="text"
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    placeholder="Prof. Juan Pérez Gómez"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      Cédula / Identificación:
                    </label>
                    <input
                      type="text"
                      value={regCedula}
                      onChange={(e) => setRegCedula(e.target.value)}
                      placeholder="1-1122-3344"
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      WhatsApp (Opcional):
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
                    Correo Oficial MEP (@mep.go.cr):
                  </label>
                  <input
                    type="email"
                    value={regCorreo}
                    onChange={(e) => setRegCorreo(e.target.value)}
                    placeholder="nombre.apellido.apellido@mep.go.cr"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    📌 La comunicación oficial se enviará siempre a esta cuenta @mep.go.cr
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      Dirección Regional (DRE):
                    </label>
                    <select
                      value={regDRE}
                      onChange={(e) => setRegDRE(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                    >
                      {LISTA_DRE_MEP.map((dre) => (
                        <option key={dre.codigo} value={dre.codigo}>
                          {dre.codigo} - {dre.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1">
                      Institución Educativa:
                    </label>
                    <input
                      type="text"
                      value={regInstitucion}
                      onChange={(e) => setRegInstitucion(e.target.value)}
                      placeholder="Liceo / Colegio"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl">
                  <div>
                    <label className="block text-[11px] font-black text-indigo-950 uppercase mb-1">
                      PIN de 4 dígitos
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={regPin}
                      onChange={(e) => setRegPin(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••"
                      required
                      className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-xl text-center font-mono text-base font-black text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-indigo-950 uppercase mb-1">
                      Confirmar PIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={regPinConfirmar}
                      onChange={(e) => setRegPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="••••"
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
