"use client";

import React, { useState, useEffect } from "react";
import { useDocente, DOCENTE_DEFAULT } from "@/context/DocenteContext";
import { LISTA_DRE_MEP, LISTA_DRE_REGIONALES } from "@/lib/dreCircuitos";
import { formatearCedulaCR, normalizarCedulaParaComparar } from "@/lib/cedulaUtils";
import {
  UserCircle,
  IdentificationCard,
  EnvelopeSimple,
  Buildings,
  FloppyDisk,
  Check,
  Copy,
  Sparkle,
  LockKey,
  ShieldCheck,
  SignIn,
  SignOut,
  Key,
  WarningCircle,
  Info,
  Phone,
  Eye,
  EyeSlash,
  ArrowClockwise,
  Flask,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import Link from "next/link";

// Normalizador seguro de códigos DRE
function normalizarDRECodigo(cod?: string): string {
  if (!cod) return "DRE-01";
  const upper = cod.toUpperCase().trim();
  if (upper === "DRE-NACIONAL" || upper === "DRENACIONAL" || upper === "ASESORIA") {
    return "DRE-NACIONAL";
  }
  const digits = cod.replace(/[^0-9]/g, "");
  if (digits) {
    return `DRE-${digits.padStart(2, "0")}`;
  }
  return "DRE-01";
}

export default function RegistroDocentePage() {
  const {
    docente,
    registrarDocente,
    iniciarSesionConPIN,
    solicitarRecuperacionPIN,
    verificarOTP,
    cerrarSesion,
  } = useDocente();

  const [pestanaActiva, setPestanaActiva] = useState<"registro" | "login" | "recuperar">("registro");

  // ==========================================
  // CAMPOS DE REGISTRO / PERFIL DOCENTE
  // ==========================================
  const [nombre, setNombre] = useState(docente?.nombreCompleto || "");
  const [correo, setCorreo] = useState(docente?.correoInstitucional || "");
  const [cedula, setCedula] = useState(docente?.cedula || "");
  const [telefono, setTelefono] = useState(docente?.telefono || "");
  const [pin, setPin] = useState(docente?.pin || "2617");
  const [pinConfirmar, setPinConfirmar] = useState(docente?.pin || "2617");
  const [mostrarPin, setMostrarPin] = useState(false);

  // DRE y Ubicación
  const [dreCodigo, setDreCodigo] = useState(normalizarDRECodigo(docente?.dreCodigo));
  const [circuito, setCircuito] = useState(docente?.circuito || "Circuito 01");
  const [codigoPresupuestario, setCodigoPresupuestario] = useState(docente?.codigoPresupuestario || "SABER-2026");
  const [institucion, setInstitucion] = useState(docente?.institucionNombre || "");
  const [rol, setRol] = useState(docente?.rol || "Docente de Formación Tecnológica");
  const ASIGNATURA_UNICA = "Formación Tecnológica (Dimensión 1 y 2)";

  // Estados de validación
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [copiadoID, setCopiadoID] = useState(false);

  // ==========================================
  // CAMPOS DE INICIO DE SESIÓN CON PIN
  // ==========================================
  const [loginCredencial, setLoginCredencial] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [mostrarLoginPin, setMostrarLoginPin] = useState(false);
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // ==========================================
  // CAMPOS DE RECUPERACIÓN DE PIN (OTP)
  // ==========================================
  const [recuperarCredencial, setRecuperarCredencial] = useState("");
  const [recuperarCanal, setRecuperarCanal] = useState<"correo" | "whatsapp">("correo");
  const [otpEnviado, setOtpEnviado] = useState(false);
  const [otpCodigo, setOtpCodigo] = useState("");
  const [otpNuevoPin, setOtpNuevoPin] = useState("");
  const [otpNuevoPinConfirmar, setOtpNuevoPinConfirmar] = useState("");
  const [recuperarMensaje, setRecuperarMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
  const [cargandoRecuperacion, setCargandoRecuperacion] = useState(false);

  // Sincronizar datos si ya hay sesión activa
  useEffect(() => {
    if (docente) {
      setNombre(docente.nombreCompleto || "");
      setCorreo(docente.correoInstitucional || "");
      setCedula(docente.cedula || "");
      setTelefono(docente.telefono || "");
      setPin(docente.pin || "2617");
      setPinConfirmar(docente.pin || "2617");
      const dreNorm = normalizarDRECodigo(docente.dreCodigo);
      setDreCodigo(dreNorm);
      setCircuito(docente.circuito || "Circuito 01");
      setCodigoPresupuestario(docente.codigoPresupuestario || "SABER-2026");
      setInstitucion(docente.institucionNombre || "");
      setRol(docente.rol || "Docente de Formación Tecnológica");
    }
  }, [docente]);

  // Manejo de cambio de DRE seguro
  const dreNormActual = normalizarDRECodigo(dreCodigo);
  const dreSeleccionada =
    LISTA_DRE_MEP.find((d) => d.codigo === dreNormActual) ||
    LISTA_DRE_MEP.find((d) => d.codigo.replace("-", "") === dreNormActual.replace("-", "")) ||
    LISTA_DRE_MEP[0];

  const listaCircuitos = dreSeleccionada?.circuitos && Array.isArray(dreSeleccionada.circuitos)
    ? dreSeleccionada.circuitos
    : ["Circuito 01"];

  const handleCambioDRE = (nuevoCodigo: string) => {
    const codNorm = normalizarDRECodigo(nuevoCodigo);
    setDreCodigo(codNorm);

    if (codNorm === "DRE-NACIONAL") {
      setCircuito("Nivel Nacional / Ámbito General");
      setCodigoPresupuestario("FT-NACIONAL-2026");
      setInstitucion("Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)");
      setRol("Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)");
    } else {
      const found = LISTA_DRE_MEP.find((d) => d.codigo === codNorm);
      const primerCircuito = found?.circuitos?.[0] || "Circuito 01";
      setCircuito(primerCircuito);
      setCodigoPresupuestario("SABER-2026");
      if (!institucion || institucion.includes("Asesoría Nacional")) {
        setInstitucion("Liceo / Colegio de Secundaria");
      }
      setRol("Docente de Formación Tecnológica - Dimensión 1 y 2");
    }
  };

  // ==========================================
  // PERFILES RÁPIDOS PARA PRUEBAS Y ASESORÍA
  // ==========================================
  const cargarPerfilAsesorPrincipal = () => {
    setNombre("Alberto Bustos Ortega");
    setCorreo("alberto.bustos.ortega@mep.go.cr");
    setCedula("5-0305-0179");
    setTelefono("+506 8888-9999");
    setPin("2617");
    setPinConfirmar("2617");
    setDreCodigo("DRE-NACIONAL");
    setCircuito("Nivel Nacional / Ámbito General");
    setCodigoPresupuestario("FT-NACIONAL-2026");
    setInstitucion("Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)");
    setRol("Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)");
    setErrorValidacion(null);
  };

  const cargarPerfilDocentePrueba = (region: "liberia" | "sanjose" | "alajuela") => {
    if (region === "liberia") {
      setNombre("Prof. Esteban Gómez Chinchilla");
      setCorreo("esteban.gomez.chinchilla@mep.go.cr");
      setCedula("5-0345-0891");
      setTelefono("+506 8765-4321");
      setPin("5821");
      setPinConfirmar("5821");
      setDreCodigo("DRE-07");
      setCircuito("Circuito 01");
      setCodigoPresupuestario("SABER-LIBERIA-2026");
      setInstitucion("Liceo Laboratorio de Liberia");
      setRol("Docente de Formación Tecnológica");
    } else if (region === "sanjose") {
      setNombre("Prof. Lucía Navarro Solano");
      setCorreo("lucia.navarro.solano@mep.go.cr");
      setCedula("1-1456-0789");
      setTelefono("+506 8999-1234");
      setPin("3914");
      setPinConfirmar("3914");
      setDreCodigo("DRE-01");
      setCircuito("Circuito 02");
      setCodigoPresupuestario("SABER-SJ-2026");
      setInstitucion("Liceo de Costa Rica");
      setRol("Docente de Formación Tecnológica");
    } else {
      setNombre("Prof. Mario Ramírez Varela");
      setCorreo("mario.ramirez.varela@mep.go.cr");
      setCedula("2-0890-0123");
      setTelefono("+506 8456-7890");
      setPin("7263");
      setPinConfirmar("7263");
      setDreCodigo("DRE-04");
      setCircuito("Circuito 01");
      setCodigoPresupuestario("SABER-ALAJUELA-2026");
      setInstitucion("Instituto de Alajuela");
      setRol("Docente de Formación Tecnológica");
    }
    setErrorValidacion(null);
  };

  // ==========================================
  // REGLAS DE VALIDACIÓN EN TIEMPO REAL DEL PIN
  // ==========================================
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

  const advertenciaPin = evaluarPIN(pin, cedula);

  // ==========================================
  // ENVÍO DE REGISTRO / ACTUALIZACIÓN
  // ==========================================
  const handleGuardarDocente = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    const partesNombre = nombre.trim().split(/\s+/);
    if (partesNombre.length < 2) {
      setErrorValidacion("Por favor ingrese su nombre completo (Nombre y Apellidos).");
      return;
    }

    const cedulaLimpia = cedula.trim();
    if (cedulaLimpia.length < 9) {
      setErrorValidacion("El número de cédula o identificación debe tener un formato válido (mínimo 9 dígitos).");
      return;
    }

    const correoLimpio = correo.trim().toLowerCase();
    const regexMepStrict = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+@mep\.go\.cr$/i;
    if (!regexMepStrict.test(correoLimpio)) {
      setErrorValidacion(
        "El correo institucional es obligatorio y debe tener la estructura oficial del MEP: nombre.apellido.apellido@mep.go.cr (terminado en @mep.go.cr)."
      );
      return;
    }

    const telefonoLimpio = telefono.trim();
    const pinLimpio = pin.trim();
    if (!/^\d{4}$/.test(pinLimpio)) {
      setErrorValidacion("El PIN de acceso rápido es obligatorio y debe ser exactamente de 4 dígitos numéricos.");
      return;
    }
    if (pinLimpio !== pinConfirmar.trim()) {
      setErrorValidacion("La confirmación del PIN no coincide. Verifique los 4 dígitos ingresados.");
      return;
    }

    const esSuperAdminAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr" || dreCodigo === "DRE-NACIONAL";
    const idDocenteUnico = esSuperAdminAlberto
      ? "ASESOR-FT-7729"
      : docente?.idDocente && !docente.idDocente.includes("DOC-DRE01-7729") && docente.idDocente !== "ASESOR-FT-7729"
      ? docente.idDocente
      : `DOC-${dreCodigo.replace(/[^a-zA-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    const datosDocente = {
      idDocente: idDocenteUnico,
      nombreCompleto: nombre.trim(),
      correoInstitucional: correoLimpio,
      cedula: cedulaLimpia,
      telefono: telefonoLimpio,
      pin: pinLimpio,
      contrasena: pinLimpio,
      dreCodigo,
      dreNombre: dreCodigo === "DRE-NACIONAL" ? "Asesoría de Formación Tecnológica" : dreSeleccionada.nombre,
      circuito: dreCodigo === "DRE-NACIONAL" ? "Nivel Nacional / Ámbito General" : circuito,
      codigoPresupuestario: dreCodigo === "DRE-NACIONAL" ? "FT-NACIONAL-2026" : codigoPresupuestario,
      institucionNombre: institucion || "Liceo / Colegio de Secundaria",
      rol,
      asignaturas: [ASIGNATURA_UNICA],
      fechaRegistro: docente?.fechaRegistro || new Date().toISOString(),
    };

    const res = registrarDocente(datosDocente);
    if (res.exito) {
      setGuardadoExitoso(true);
      setTimeout(() => setGuardadoExitoso(false), 4000);
    } else {
      setErrorValidacion(res.mensaje);
    }
  };

  // ==========================================
  // INICIO DE SESIÓN CON PIN O CÉDULA
  // ==========================================
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMensaje(null);

    const credLimpia = loginCredencial.trim();
    const pinLimpio = loginPin.trim();

    if (!credLimpia) {
      setLoginMensaje({ tipo: "error", texto: "Por favor ingrese su Cédula o Correo Institucional MEP." });
      return;
    }
    if (!pinLimpio) {
      setLoginMensaje({ tipo: "error", texto: "Por favor ingrese su PIN de 4 dígitos." });
      return;
    }

    const res = iniciarSesionConPIN(credLimpia, pinLimpio);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  // ==========================================
  // RECUPERACIÓN DE PIN (OTP)
  // ==========================================
  const handleSolicitarOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecuperarMensaje(null);

    if (!recuperarCredencial.trim()) {
      setRecuperarMensaje({ tipo: "error", texto: "Ingrese su cédula o correo MEP para recibir el código." });
      return;
    }

    setCargandoRecuperacion(true);
    try {
      const res = await solicitarRecuperacionPIN(recuperarCredencial, recuperarCanal);
      if (res.exito) {
        setOtpEnviado(true);
        setRecuperarMensaje({ tipo: "exito", texto: res.mensaje });
      } else {
        setRecuperarMensaje({ tipo: "error", texto: res.mensaje });
      }
    } catch {
      setRecuperarMensaje({ tipo: "error", texto: "Error al solicitar el código de recuperación." });
    }
    setCargandoRecuperacion(false);
  };

  const handleVerificarYRestablecerPIN = (e: React.FormEvent) => {
    e.preventDefault();
    setRecuperarMensaje(null);

    if (!otpCodigo.trim() || otpCodigo.trim().length !== 4) {
      setRecuperarMensaje({ tipo: "error", texto: "Ingrese el código de 4 dígitos recibido." });
      return;
    }

    if (!/^\d{4}$/.test(otpNuevoPin.trim())) {
      setRecuperarMensaje({ tipo: "error", texto: "El nuevo PIN debe contener exactamente 4 dígitos numéricos." });
      return;
    }

    if (otpNuevoPin.trim() !== otpNuevoPinConfirmar.trim()) {
      setRecuperarMensaje({ tipo: "error", texto: "Los nuevos PINs ingresados no coinciden." });
      return;
    }

    const res = verificarOTP(recuperarCredencial, otpCodigo, otpNuevoPin.trim());
    if (res.exito) {
      setRecuperarMensaje({ tipo: "exito", texto: res.mensaje });
      setTimeout(() => {
        setPestanaActiva("registro");
      }, 2000);
    } else {
      setRecuperarMensaje({ tipo: "error", texto: res.mensaje });
    }
  };

  const copiarID = () => {
    if (docente?.idDocente) {
      navigator.clipboard.writeText(docente.idDocente);
      setCopiadoID(true);
      setTimeout(() => setCopiadoID(false), 2000);
    }
  };

  const esAsesorNacional = docente?.dreCodigo === "DRE-NACIONAL" || docente?.correoInstitucional === "alberto.bustos.ortega@mep.go.cr";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">
            Formación Tecnológica • Programa Nacional MEP
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Gestión de Acceso & Perfil Docente
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Autenticación segura por <strong>PIN de 4 dígitos</strong>, validación MEP y panel de pruebas para Asesoría
          </p>
        </div>

        {/* Tarjeta de Estado / ID Docente */}
        {docente ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-xs bg-emerald-700">
              <ShieldCheck size={24} weight="bold" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <span>Sesión Activa</span>
                {esAsesorNacional && (
                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-800 font-bold rounded text-[9px]">
                    Asesoría Nacional
                  </span>
                )}
              </div>
              <div className="font-mono text-sm font-black text-emerald-950">{docente.idDocente}</div>
              <div className="text-[11px] text-slate-700 font-medium truncate max-w-[200px]">
                {docente.nombreCompleto}
              </div>
            </div>
            <button
              onClick={copiarID}
              className="ml-2 p-2 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 transition-colors"
              title="Copiar ID Docente"
            >
              {copiadoID ? <Check size={16} weight="bold" className="text-emerald-700" /> : <Copy size={16} weight="bold" />}
            </button>
          </div>
        ) : (
          <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-300 text-slate-700 flex items-center justify-center font-bold">
              <UserCircle size={24} weight="bold" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-600 uppercase">Estado de Acceso</div>
              <div className="text-xs font-black text-slate-900">Sin sesión iniciada</div>
            </div>
          </div>
        )}
      </div>

      {/* BARRA DE ACCESOS RÁPIDOS PARA PRUEBAS Y ASESORÍA */}
      <div className="p-5 bg-stone-50/90 rounded-3xl text-slate-900 shadow-xs border border-stone-300/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flask size={18} className="text-emerald-700" weight="bold" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Perfiles Rápidos para Pruebas de Uso
            </span>
          </div>
          <span className="text-[10.5px] text-stone-500 font-medium">
            Habilita perfiles para validar diagnósticos y telemetría
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Botón Asesoría Nacional */}
          <button
            type="button"
            onClick={cargarPerfilAsesorPrincipal}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            title="Cargar credenciales de Alberto Bustos Ortega"
          >
            <Flask size={15} />
            <span>Perfil Asesoría Nacional (Alberto Bustos)</span>
          </button>

          {/* Botones de prueba en regiones */}
          <button
            type="button"
            onClick={() => cargarPerfilDocentePrueba("liberia")}
            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Flask size={15} className="text-emerald-700" />
            <span>Prueba DRE Liberia (07)</span>
          </button>

          <button
            type="button"
            onClick={() => cargarPerfilDocentePrueba("sanjose")}
            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Flask size={15} className="text-sky-700" />
            <span>Prueba DRE San José (01)</span>
          </button>

          <button
            type="button"
            onClick={() => cargarPerfilDocentePrueba("alajuela")}
            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Flask size={15} className="text-purple-700" />
            <span>Prueba DRE Alajuela (04)</span>
          </button>

          <Link
            href="/admin"
            className="ml-auto px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Panel de Administración</span>
            <ArrowSquareOut size={15} weight="bold" />
          </Link>
        </div>
      </div>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setPestanaActiva("registro")}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            pestanaActiva === "registro"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          <IdentificationCard size={18} weight="bold" />
          <span>{docente ? "Mi Perfil & Datos" : "1. Registro de Docente"}</span>
        </button>

        <button
          onClick={() => setPestanaActiva("login")}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            pestanaActiva === "login"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          <Key size={18} weight="bold" />
          <span>2. Iniciar Sesión con PIN</span>
        </button>

        <button
          onClick={() => setPestanaActiva("recuperar")}
          className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            pestanaActiva === "recuperar"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
          }`}
        >
          <ShieldCheck size={18} weight="bold" />
          <span>3. Recuperar PIN</span>
        </button>

        {docente && (
          <button
            onClick={cerrarSesion}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 transition-colors"
          >
            <SignOut size={16} weight="bold" />
            <span>Cerrar Sesión</span>
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* VISTA 1: REGISTRO Y CONFIGURACIÓN DE PERFIL DOCENTE          */}
      {/* ============================================================ */}
      {pestanaActiva === "registro" && (
        <form onSubmit={handleGuardarDocente} className="space-y-6">
          {errorValidacion && (
            <div className="p-4 bg-rose-50 border-2 border-rose-300 text-rose-950 rounded-2xl text-xs font-bold flex items-start gap-3 shadow-xs">
              <WarningCircle size={20} className="text-rose-700 shrink-0 mt-0.5" weight="fill" />
              <div className="leading-relaxed">{errorValidacion}</div>
            </div>
          )}

          {guardadoExitoso && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-xs">
              <Check size={20} className="text-emerald-700 shrink-0" weight="bold" />
              <div>¡Cuenta registrada y perfil guardado con éxito! Ya puedes utilizar tu PIN de 4 dígitos.</div>
            </div>
          )}

          {/* Tarjeta 1: Datos Personales e Institucionales */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <UserCircle size={22} className="text-emerald-700" weight="bold" />
              <span>Identificación Oficial del Docente</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre Completo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Nombre Completo (Nombre y Apellidos) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Prof. María Castro Solís"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
              </div>

              {/* Cédula */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Cédula o Identificación <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ej: 1-1234-0567"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                />
              </div>

              {/* Correo Oficial MEP */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Correo Electrónico Institucional MEP (@mep.go.cr) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="nombre.apellido.apellido@mep.go.cr"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  />
                  <EnvelopeSimple size={18} className="absolute right-4 top-3.5 text-slate-400" />
                </div>
                {correo && !/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+@mep\.go\.cr$/i.test(correo) && (
                  <p className="text-[11px] font-bold text-rose-700 mt-1 flex items-center gap-1">
                    <WarningCircle size={14} weight="fill" />
                    <span>Debe tener formato oficial con puntos: <code>nombre.apellido.apellido@mep.go.cr</code></span>
                  </p>
                )}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11.5px] text-blue-950 font-medium flex items-start gap-2 mt-2">
                  <Info size={16} className="text-blue-700 shrink-0 mt-0.5" weight="fill" />
                  <span>
                    <strong>Validez Oficial:</strong> Toda la comunicación oficial y formal del MEP se remitirá siempre a esta cuenta de correo institucional.
                  </span>
                </div>
              </div>

              {/* Teléfono de Contacto */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Teléfono de Contacto (Opcional)</span>
                  <span className="text-[11px] font-bold text-slate-500 lowercase">para avisos o asistencia complementaria</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: 8888-9999"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  />
                  <Phone size={18} className="absolute right-4 top-3.5 text-slate-400" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11.5px] text-slate-700 font-medium flex items-start gap-2 mt-2">
                  <Info size={16} className="text-slate-500 shrink-0 mt-0.5" weight="bold" />
                  <span>
                    <strong>Canal Opcional:</strong> Se utilizará como medio complementario para avisos de gestión, soporte técnico o asistencia pedagógica. Toda la comunicación formal y oficial se mantendrá siempre por Correo Institucional MEP (@mep.go.cr).
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Seguridad y PIN de 4 Dígitos */}
          <div className="bg-white border-2 border-indigo-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <LockKey size={22} className="text-indigo-700" weight="bold" />
                <span>PIN de Acceso Rápido (4 Dígitos)</span>
              </h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-900 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                Acceso Ágil en Laboratorio
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Define un PIN de 4 números que no olvides para ingresar rápidamente desde las computadoras del laboratorio sin necesidad de escribir contraseñas largas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* PIN */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Crea tu PIN de 4 dígitos <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarPin ? "text" : "password"}
                    required
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPin(!mostrarPin)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {mostrarPin ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar PIN */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Confirma tu PIN de 4 dígitos <span className="text-rose-600">*</span>
                </label>
                <input
                  type={mostrarPin ? "text" : "password"}
                  required
                  maxLength={4}
                  value={pinConfirmar}
                  onChange={(e) => setPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-mono font-black tracking-widest text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all"
                />
              </div>
            </div>

            {advertenciaPin && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-bold text-amber-950 flex items-center gap-2">
                <WarningCircle size={18} className="text-amber-700 shrink-0" weight="fill" />
                <span>{advertenciaPin}</span>
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-700" weight="bold" />
                <span>Recomendaciones de Seguridad del PIN:</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 text-[11.5px] space-y-1 font-medium">
                <li>Elige 4 números fáciles de recordar para ti pero difíciles de adivinar para los estudiantes.</li>
                <li>No utilices tu año de nacimiento ni secuencias obvias (ej. 1234, 0000).</li>
                <li>Si cometes 3 intentos fallidos consecutivos, el sistema bloqueará temporalmente el acceso por 15 minutos para proteger tus actas y telemetría.</li>
              </ul>
            </div>
          </div>

          {/* Tarjeta 3: Asignación Territorial DRE y Colegio */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Buildings size={22} className="text-emerald-700" weight="bold" />
              <span>Dirección Regional e Institución Educativa</span>
            </h3>

            {/* Checkbox: Asignación a Asesoría de Formación Tecnológica */}
            <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-2xl">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dreNormActual === "DRE-NACIONAL"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleCambioDRE("DRE-NACIONAL");
                    } else {
                      handleCambioDRE("DRE-01");
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 bg-white cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">
                    Asignación a Asesoría de Formación Tecnológica
                  </span>
                  <p className="text-[11.5px] text-slate-500 font-medium">
                    Desactiva la selección de DRE y Centro Educativo al ser de ámbito nacional.
                  </p>
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DRE */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Dirección Regional de Educación (DRE) <span className="text-rose-600">*</span>
                </label>
                {dreNormActual === "DRE-NACIONAL" ? (
                  <div className="px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-500 flex items-center gap-2 cursor-not-allowed">
                    <span>Asesoría de Formación Tecnológica</span>
                  </div>
                ) : (
                  <select
                    value={dreNormActual}
                    onChange={(e) => handleCambioDRE(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  >
                    {LISTA_DRE_REGIONALES.map((dre) => (
                      <option key={dre.codigo} value={dre.codigo}>
                        {dre.codigo} - {dre.nombre} ({dre.provincia})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Circuito */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Circuito Escolar
                </label>
                {dreNormActual === "DRE-NACIONAL" ? (
                  <div className="px-4 py-3 bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed">
                    Nivel Nacional / Ámbito General
                  </div>
                ) : (
                  <select
                    value={circuito}
                    onChange={(e) => setCircuito(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                  >
                    {listaCircuitos.map((circ) => (
                      <option key={circ} value={circ}>
                        {circ}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Institución */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Nombre del Liceo o Colegio de Secundaria
                </label>
                <input
                  type="text"
                  value={dreNormActual === "DRE-NACIONAL" ? "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)" : institucion}
                  onChange={(e) => setInstitucion(e.target.value)}
                  disabled={dreNormActual === "DRE-NACIONAL"}
                  placeholder={dreNormActual === "DRE-NACIONAL" ? "Asignado automáticamente para Asesoría Nacional" : "Ej: Liceo de Santa Cruz / CTP de Puriscal"}
                  className={`w-full px-4 py-3 border rounded-xl text-xs font-bold transition-all ${
                    dreNormActual === "DRE-NACIONAL"
                      ? "bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Botón de Guardar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FloppyDisk size={18} weight="bold" />
              <span>Guardar Perfil & Habilitar PIN</span>
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* VISTA 2: INICIAR SESIÓN CON PIN                              */}
      {/* ============================================================ */}
      {pestanaActiva === "login" && (
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Key size={30} weight="bold" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Ingreso Rápido con PIN</h3>
            <p className="text-xs text-slate-500 font-medium">
              Ingresa tu Cédula o Correo MEP junto con tu PIN de 4 dígitos
            </p>
          </div>

          {loginMensaje && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                loginMensaje.tipo === "exito"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-950"
                  : "bg-rose-50 border border-rose-300 text-rose-950"
              }`}
            >
              {loginMensaje.tipo === "exito" ? (
                <Check size={18} className="text-emerald-700 shrink-0" weight="bold" />
              ) : (
                <WarningCircle size={18} className="text-rose-700 shrink-0" weight="fill" />
              )}
              <div className="leading-relaxed">{loginMensaje.texto}</div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Cédula o Correo Institucional MEP
              </label>
              <input
                type="text"
                required
                value={loginCredencial}
                onChange={(e) => setLoginCredencial(e.target.value)}
                placeholder="Ej: 1-1234-0567 o nombre.apellido@mep.go.cr"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-hidden transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  PIN de 4 Dígitos
                </label>
                <button
                  type="button"
                  onClick={() => setPestanaActiva("recuperar")}
                  className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  ¿Olvidaste tu PIN?
                </button>
              </div>
              <div className="relative">
                <input
                  type={mostrarLoginPin ? "text" : "password"}
                  required
                  maxLength={4}
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl font-mono font-black tracking-widest text-slate-900 focus:bg-white focus:border-indigo-600 outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarLoginPin(!mostrarLoginPin)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {mostrarLoginPin ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <SignIn size={18} weight="bold" />
              <span>Ingresar al Sistema</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setLoginCredencial("alberto.bustos.ortega@mep.go.cr");
                setLoginPin("2617");
              }}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline"
            >
              (Modo Asesor Principal: Cargar credencial maestra)
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VISTA 3: RECUPERACIÓN DE PIN (OTP CORREO / WHATSAPP)         */}
      {/* ============================================================ */}
      {pestanaActiva === "recuperar" && (
        <div className="max-w-lg mx-auto bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck size={30} weight="bold" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Recuperación de PIN</h3>
            <p className="text-xs text-slate-500 font-medium">
              Recibe un código temporal de 4 dígitos para restablecer tu PIN
            </p>
          </div>

          {recuperarMensaje && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                recuperarMensaje.tipo === "exito"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-950"
                  : "bg-rose-50 border border-rose-300 text-rose-950"
              }`}
            >
              {recuperarMensaje.tipo === "exito" ? (
                <Check size={18} className="text-emerald-700 shrink-0" weight="bold" />
              ) : (
                <WarningCircle size={18} className="text-rose-700 shrink-0" weight="fill" />
              )}
              <div className="leading-relaxed">{recuperarMensaje.texto}</div>
            </div>
          )}

          {!otpEnviado ? (
            <form onSubmit={handleSolicitarOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Cédula o Correo MEP Registrado
                </label>
                <input
                  type="text"
                  required
                  value={recuperarCredencial}
                  onChange={(e) => setRecuperarCredencial(e.target.value)}
                  placeholder="Ej: 1-1234-0567 o nombre.apellido@mep.go.cr"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  ¿Por cuál canal deseas recibir el código?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecuperarCanal("correo")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      recuperarCanal === "correo"
                        ? "bg-blue-50 border-blue-500 text-blue-950 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <EnvelopeSimple size={18} className="text-blue-600" weight="bold" />
                    <span>Correo MEP (@mep.go.cr)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecuperarCanal("whatsapp")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      recuperarCanal === "whatsapp"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Phone size={18} className="text-emerald-600" />
                    <span>Mensajería Móvil</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={cargandoRecuperacion}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {cargandoRecuperacion ? (
                  <>
                    <ArrowClockwise size={18} className="animate-spin" />
                    <span>Despachando código...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} weight="bold" />
                    <span>Enviar Código de 4 Dígitos</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerificarYRestablecerPIN} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Ingresa el Código de 4 Dígitos Recibido
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otpCodigo}
                  onChange={(e) => setOtpCodigo(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="1234"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl font-mono font-black tracking-widest text-slate-900 focus:bg-white focus:border-emerald-600 outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-800 uppercase">
                    Nuevo PIN (4 dígitos)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={otpNuevoPin}
                    onChange={(e) => setOtpNuevoPin(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="••••"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-base font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-800 uppercase">
                    Confirmar PIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={otpNuevoPinConfirmar}
                    onChange={(e) => setOtpNuevoPinConfirmar(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="••••"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-base font-mono font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check size={18} weight="bold" />
                <span>Restablecer PIN e Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => setOtpEnviado(false)}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Volver a solicitar código
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
