"use client";

import React, { useState } from "react";
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
} from "@phosphor-icons/react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { docente, isInitialized, iniciarSesion, registrarDocente } = useDocente();

  const [tab, setTab] = useState<"login" | "registro">("login");

  // Login form state
  const [loginCredencial, setLoginCredencial] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Registro form state
  const [regNombre, setRegNombre] = useState("");
  const [regCorreo, setRegCorreo] = useState("");
  const [regCedula, setRegCedula] = useState("");
  const [regDRE, setRegDRE] = useState("DRE01");
  const [regInstitucion, setRegInstitucion] = useState("");
  const [regPassword, setRegPassword] = useState("");
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

    const res = iniciarSesion(loginCredencial, loginPassword);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // Handler for Demo Credentials fill
  const rellenarDemo = () => {
    setLoginCredencial("alberto.bustos.ortega@mep.go.cr");
    setLoginPassword("EdcRfvTgb1726**");
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
    if (!correoLimpio) {
      setRegMensaje({ tipo: "error", texto: "Ingrese su usuario o correo institucional." });
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Cabecera del Portal */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-xs">
            <Lightning size={16} weight="fill" className="text-amber-400" />
            <span>Formación Tecnológica • 9° Año</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Acceso al Entorno de Diagnóstico
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Ingrese con sus credenciales docentes para acceder al módulo de diagnóstico interactivo y al registro de evidencias.
          </p>
        </div>

        {/* Tarjeta de Autenticación */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
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
                  ? "bg-white text-emerald-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <SignIn size={18} weight="bold" />
              <span>Iniciar sesión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTab("registro");
                setRegMensaje(null);
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all ${
                tab === "registro"
                  ? "bg-white text-emerald-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <UserPlus size={18} weight="bold" />
              <span>Registrarse</span>
            </button>
          </div>

          {/* Cuerpo del Formulario */}
          <div className="p-6 sm:p-8">
            {tab === "login" ? (
              /* Formulario de Login */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginMensaje && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                      loginMensaje.tipo === "exito"
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                        : "bg-rose-50 border border-rose-300 text-rose-800"
                    }`}
                  >
                    {loginMensaje.tipo === "exito" ? (
                      <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                    ) : (
                      <WarningCircle size={18} weight="fill" className="text-rose-600 shrink-0" />
                    )}
                    <span>{loginMensaje.texto}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Usuario o Correo Institucional:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <EnvelopeSimple size={18} />
                    </div>
                    <input
                      type="text"
                      value={loginCredencial}
                      onChange={(e) => setLoginCredencial(e.target.value)}
                      placeholder="nombre.apellido.apellido@mep.go.cr o usuario"
                      required
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contraseña de Acceso:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LockKey size={18} />
                    </div>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={rellenarDemo}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
                  >
                    <Key size={14} />
                    <span>Usar credenciales de demostración</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                  >
                    <SignIn size={18} weight="bold" />
                    <span>Iniciar sesión</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500">¿No dispone de cuenta registrada? </span>
                  <button
                    type="button"
                    onClick={() => setTab("registro")}
                    className="text-xs font-extrabold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    Regístrese aquí
                  </button>
                </div>
              </form>
            ) : (
              /* Formulario de Registro */
              <form onSubmit={handleRegistroSubmit} className="space-y-4">
                {regMensaje && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
                      regMensaje.tipo === "exito"
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                        : "bg-rose-50 border border-rose-300 text-rose-800"
                    }`}
                  >
                    {regMensaje.tipo === "exito" ? (
                      <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                    ) : (
                      <WarningCircle size={18} weight="fill" className="text-rose-600 shrink-0" />
                    )}
                    <span>{regMensaje.texto}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nombre Completo (Nombre y Apellidos):
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <UserCircle size={18} />
                    </div>
                    <input
                      type="text"
                      value={regNombre}
                      onChange={(e) => setRegNombre(e.target.value)}
                      placeholder="Prof. Juan Pérez Gómez"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Usuario o Correo Institucional:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <EnvelopeSimple size={18} />
                      </div>
                      <input
                        type="text"
                        value={regCorreo}
                        onChange={(e) => setRegCorreo(e.target.value)}
                        placeholder="usuario@mep.go.cr"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Cédula / Identificación:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <IdentificationCard size={18} />
                      </div>
                      <input
                        type="text"
                        value={regCedula}
                        onChange={(e) => setRegCedula(e.target.value)}
                        placeholder="1-1122-3344"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Dirección Regional (DRE):
                    </label>
                    <select
                      value={regDRE}
                      onChange={(e) => setRegDRE(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium transition-all"
                    >
                      {LISTA_DRE_MEP.map((d) => (
                        <option key={d.codigo} value={d.codigo}>
                          {d.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Centro Educativo / Institución:
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Buildings size={18} />
                      </div>
                      <input
                        type="text"
                        value={regInstitucion}
                        onChange={(e) => setRegInstitucion(e.target.value)}
                        placeholder="Liceo / Colegio"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contraseña de Acceso (mínimo 6 caracteres):
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LockKey size={18} />
                    </div>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
                  >
                    <UserPlus size={18} weight="bold" />
                    <span>Registrarse e ingresar</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <span className="text-xs text-slate-500">¿Ya tiene una cuenta activa? </span>
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className="text-xs font-extrabold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    Inicie sesión aquí
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
