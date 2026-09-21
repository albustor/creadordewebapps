"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CodeBlock,
  Sparkle,
  UploadSimple,
  ChartBar,
  DeviceMobileCamera,
  ShieldCheck,
  Lightning,
  QrCode,
  UsersThree,
  ChalkboardTeacher,
  Cpu,
  ArrowRight,
  CheckCircle,
  UserCircle,
  SignIn,
  SignOut,
  Key,
  IdentificationCard,
  EnvelopeSimple,
  LockKey,
} from "@phosphor-icons/react";
import { useDocente, DOCENTE_DEFAULT } from "@/context/DocenteContext";

export default function HomePage() {
  const { docente, webApps, telemetria, iniciarSesion, cerrarSesion } = useDocente();

  const [mostrarLoginModal, setMostrarLoginModal] = useState(false);
  const [loginCorreo, setLoginCorreo] = useState(docente?.correoInstitucional || "alberto.bustos.ortega@mep.go.cr");
  const [loginPassword, setLoginPassword] = useState("EdcRfvTgb1726**");
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = iniciarSesion(loginCorreo, loginPassword);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
      setTimeout(() => {
        setLoginMensaje(null);
        setMostrarLoginModal(false);
      }, 1500);
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  const loginRapidoOficial = () => {
    setLoginCorreo("alberto.bustos.ortega@mep.go.cr");
    setLoginPassword("EdcRfvTgb1726**");
    const res = iniciarSesion("alberto.bustos.ortega@mep.go.cr", "EdcRfvTgb1726**");
    setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    setTimeout(() => {
      setLoginMensaje(null);
      setMostrarLoginModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Principal */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative max-w-5xl mx-auto space-y-8">
          
          {/* Barra Superior de Estado de Usuario / Acceso */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-900/60 border border-blue-700/60 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md">
            {docente ? (
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                  <UserCircle size={24} weight="fill" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-extrabold text-white">
                      {docente.nombreCompleto}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                      Activo
                    </span>
                  </div>
                  <div className="text-[11px] text-sky-200 font-mono">
                    {docente.correoInstitucional} • {docente.dreNombre} ({docente.idDocente})
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} weight="duotone" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Acceso Docente
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Inicia sesión para gestionar tus WebApps, telemetría y diagnósticos de aula
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {docente ? (
                <>
                  <Link
                    href="/registro"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-bold rounded-xl border border-blue-500/40 transition-colors"
                  >
                    <IdentificationCard size={15} weight="bold" />
                    <span>Mi Perfil & ID</span>
                  </Link>
                  <button
                    onClick={() => {
                      cerrarSesion();
                      setMostrarLoginModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors"
                  >
                    <SignOut size={15} weight="bold" />
                    <span>Cambiar Cuenta</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setMostrarLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  <SignIn size={16} weight="bold" />
                  <span>Ingreso Docente</span>
                </button>
              )}
            </div>
          </div>

          {/* Formulario / Modal Integrado de Login si no hay usuario o si se solicita */}
          {mostrarLoginModal && (
            <div className="bg-slate-900/95 border-2 border-blue-500/80 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-xl animate-fade-in space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <ShieldCheck size={22} weight="bold" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Ingreso de Cuenta Docente</h2>
                    <p className="text-xs text-slate-400">Autenticación para vincular WebApps, telemetría y diagnósticos</p>
                  </div>
                </div>
                <button
                  onClick={() => setMostrarLoginModal(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-3 py-1 bg-slate-800 rounded-lg"
                >
                  Cerrar
                </button>
              </div>

              {loginMensaje && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    loginMensaje.tipo === "exito"
                      ? "bg-emerald-900/60 border border-emerald-500/50 text-emerald-200"
                      : "bg-rose-900/60 border border-rose-500/50 text-rose-200"
                  }`}
                >
                  {loginMensaje.tipo === "exito" ? (
                    <CheckCircle size={18} weight="fill" className="text-emerald-400 shrink-0" />
                  ) : (
                    <ShieldCheck size={18} weight="fill" className="text-rose-400 shrink-0" />
                  )}
                  <span>{loginMensaje.texto}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Correo Electrónico Docente:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <EnvelopeSimple size={18} />
                    </div>
                    <input
                      type="email"
                      value={loginCorreo}
                      onChange={(e) => setLoginCorreo(e.target.value)}
                      placeholder="nombre.apellido.apellido@mep.go.cr"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={loginRapidoOficial}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-900/60 hover:bg-blue-800 text-sky-200 border border-blue-600/50 text-xs font-bold rounded-xl transition-all"
                  >
                    <Lightning size={16} weight="fill" className="text-amber-400" />
                    <span>Autocompletar Acceso Docente Demo (Prof. Alberto Bustos)</span>
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    <SignIn size={16} weight="bold" />
                    <span>Iniciar Sesión Ahora</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Título y Descripción Principal */}
          <div className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/60 border border-blue-600/40 text-sky-300 text-xs font-bold tracking-wide">
              <Sparkle size={16} weight="fill" className="text-amber-400" />
              <span>Recurso de Apoyo Pedagógico para Dimensión 1 (Formación Tecnológica)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Creador de WebApps
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Herramienta de apoyo para docentes de <strong>Formación Tecnológica (Dimensión 1 y Dimensión 2)</strong> en <strong>III Ciclo de Secundaria (7°, 8° y 9°)</strong>, fundamentada en la articulación de saberes e indicadores del <em>Programa Nacional de Informática Educativa del Departamento de Recursos Tecnológicos en Educación (DRTE - MEP)</em> únicamente como referencia curricular para la creación de recursos interactivos autónomos.
            </p>

            {/* Aviso de Autonomía y Carácter No Oficial */}
            <div className="max-w-2xl mx-auto bg-blue-950/80 border border-blue-700/50 rounded-2xl p-4 text-xs text-sky-200 text-left space-y-1">
              <div className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>⚠️ Recurso de Apoyo Complementario • No Oficial</span>
              </div>
              <div>
                Este desarrollo es una iniciativa de apoyo pedagógico para enriquecer la mediación interactiva. <strong>No constituye un recurso oficial</strong>; su adopción es 100% opcional y la decisión pedagógica final la toma siempre el docente a cargo.
              </div>
            </div>
          </div>

          {/* Botones de Acción Rápida */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/taller-webapps"
              className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <CodeBlock size={20} weight="bold" />
              <span>Creador de WebApps</span>
            </Link>

            <Link
              href="/comunidad"
              className="flex items-center gap-2 px-6 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <UsersThree size={20} weight="bold" />
              <span>Zona Común (Galería)</span>
            </Link>

            <Link
              href="/diagnostico"
              className="flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-sm rounded-xl backdrop-blur-sm transition-all"
            >
              <Sparkle size={20} weight="bold" className="text-amber-400" />
              <span>Diagnóstico IA</span>
            </Link>

            <Link
              href="/publicar"
              className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <ChalkboardTeacher size={20} weight="bold" />
              <span>Proyección en Aula</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              <ChartBar size={20} weight="bold" />
              <span>Dashboard Analítico</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-extrabold text-sm rounded-xl transition-all"
            >
              <ShieldCheck size={20} weight="fill" className="text-blue-400" />
              <span>Administración</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Métricas Rápidas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <CodeBlock size={26} weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{webApps.length + 1}</div>
              <div className="text-xs font-semibold text-slate-500">WebApps en Catálogo</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <UsersThree size={26} weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{telemetria.length}</div>
              <div className="text-xs font-semibold text-slate-500">Resultados Recibidos</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <QrCode size={26} weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">100% Offline</div>
              <div className="text-xs font-semibold text-slate-500">Soporte QR Sin Internet</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-mepCard flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <Cpu size={26} weight="duotone" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">Cascada 4 Niveles</div>
              <div className="text-xs font-semibold text-slate-500">Resiliencia de IA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Módulos de la Plataforma */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
            Ecosistema Integrado
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Módulos Principales para el Aula Digital
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Herramientas diseñadas para facilitar la creación de contenido, la proyección en clase y el seguimiento formativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Módulo 1: Creador de WebApps */}
          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-mepCard flex flex-col justify-between hover:border-blue-400 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CodeBlock size={28} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Creador de WebApps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Configura los saberes de III Ciclo (7°, 8°, 9°) y las 4 mecánicas interactivas. Compila la WebApp autónoma al instante.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/taller-webapps"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 group-hover:text-blue-900"
              >
                <span>Crear WebApps</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Módulo 2: Zona Común / Galería */}
          <div className="bg-white rounded-2xl border border-sky-200 p-6 shadow-mepCard flex flex-col justify-between hover:border-sky-400 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UsersThree size={28} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Zona Común & Remix</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visualiza, prueba y clona producciones de otros docentes para adaptar explicaciones, retos y rúbricas a tu aula.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/comunidad"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 group-hover:text-sky-900"
              >
                <span>Explorar Zona Común</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Módulo 3: Diagnóstico IA */}
          <div className="bg-white rounded-2xl border border-purple-200 p-6 shadow-mepCard flex flex-col justify-between hover:border-purple-400 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkle size={28} weight="fill" className="text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Diagnóstico IA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sube tu planeamiento o guía didáctica. La IA diagnostica saberes conceptuales, procedimentales y actitudinales.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 group-hover:text-purple-900"
              >
                <span>Diagnóstico Docente</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Módulo 4: Proyección de Aula */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-mepCard flex flex-col justify-between hover:border-emerald-400 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ChalkboardTeacher size={28} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Proyección en Aula</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Proyecta WebApps en pantalla gigante con código QR de alta resolución, comparte enlaces por WhatsApp y descarga archivos.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/publicar"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-900"
              >
                <span>Abrir Proyección</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>

          {/* Módulo 5: Dashboard Analítico */}
          <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-mepCard flex flex-col justify-between hover:border-indigo-400 transition-all group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ChartBar size={28} weight="duotone" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dashboard & Telemetría</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seguimiento bimodal de Trabajo Cotidiano y Diagnósticos, escáner de QR offline con cámara y exportación en Excel y PDF.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 group-hover:text-indigo-900"
              >
                <span>Ver Dashboard</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares Tecnológicos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                Ingeniería Educativa Blindada
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Diseñado para la Realidad de las Aulas
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Cada WebApp generada cumple con los más altos estándares de resiliencia, permitiendo el aprendizaje sin barreras técnicas.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Compatibilidad Universal Chrome 50+</h4>
                    <p className="text-xs text-slate-400">Sin operadores modernos que rompan WebViews antiguas o tabletas escolares.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Persistencia SafeStorage</h4>
                    <p className="text-xs text-slate-400">Fallback automático a memoria RAM ante restricciones de Family Link o apertura local (file:///).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" weight="fill" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Web Audio API Procedural</h4>
                    <p className="text-xs text-slate-400">Efectos de sonido sintetizados nativamente sin requerir la descarga de archivos de audio externos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <DeviceMobileCamera size={20} className="text-sky-400" />
                <span>Instalación Inmediata como App (PWA)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tanto en iOS (Safari) como en Android (Chrome), cualquier estudiante o docente puede agregar la actividad a la pantalla de inicio para usarla a pantalla completa sin distracciones.
              </p>
              <Link
                href="/manuales"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <span>Ver Manuales Ilustrados</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
