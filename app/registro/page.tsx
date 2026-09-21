"use client";

import React, { useState, useEffect } from "react";
import { useDocente, DOCENTE_DEFAULT } from "@/context/DocenteContext";
import { LISTA_DRE_MEP } from "@/lib/dreCircuitos";
import {
  UserCircle,
  IdentificationCard,
  EnvelopeSimple,
  Phone,
  Buildings,
  GraduationCap,
  FloppyDisk,
  Check,
  Copy,
  Link as LinkIcon,
  Sparkle,
  LockKey,
  ShieldCheck,
  SignIn,
  SignOut,
  Key,
  WarningCircle,
  ChatCircleDots,
  ShieldStar,
  Info,
} from "@phosphor-icons/react";
import AuthGuard from "@/components/AuthGuard";

export default function RegistroDocentePage() {
  const { docente, guardarDocente, iniciarSesion, cerrarSesion } = useDocente();

  const [pestanaActiva, setPestanaActiva] = useState<"perfil" | "seguridad">("perfil");

  // Formulario Perfil
  const [nombre, setNombre] = useState(docente?.nombreCompleto || "");
  const [correo, setCorreo] = useState(docente?.correoInstitucional || "");
  const [cedula, setCedula] = useState(docente?.cedula || "");
  const [telefono, setTelefono] = useState(docente?.telefono || "");
  
  // DRE y Ubicación
  const [dreCodigo, setDreCodigo] = useState(docente?.dreCodigo || "DRE01");
  const [circuito, setCircuito] = useState(docente?.circuito || "Circuito 01");
  const [codigoPresupuestario, setCodigoPresupuestario] = useState(
    docente?.codigoPresupuestario || ""
  );
  const [institucion, setInstitucion] = useState(
    docente?.institucionNombre || ""
  );
  
  const [rol, setRol] = useState(
    docente?.rol || "Docente de Formación Tecnológica"
  );
  
  // Asignatura ÚNICA y EXCLUSIVA para este desarrollo
  const ASIGNATURA_UNICA = "Formación Tecnológica (Dimensión 1 y 2)";
  const [asignaturas, setAsignaturas] = useState<string[]>([ASIGNATURA_UNICA]);

  // Estados de validación y alertas
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [copiadoID, setCopiadoID] = useState(false);
  const [copiadoEnlace, setCopiadoEnlace] = useState(false);

  // Formulario de Inicio de Sesión / Seguridad
  const [loginCorreo, setLoginCorreo] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMensaje, setLoginMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Sincronizar estados solo en carga inicial o cambio de cuenta (no mientras se escribe)
  const [inicializado, setInicializado] = useState(false);
  useEffect(() => {
    if (docente && !inicializado) {
      setNombre(docente.nombreCompleto || "");
      setCorreo(docente.correoInstitucional || "");
      setCedula(docente.cedula || "");
      setTelefono(docente.telefono || "");
      setDreCodigo(docente.dreCodigo || "DRE01");
      setCircuito(docente.circuito || "Circuito 01");
      setCodigoPresupuestario(docente.codigoPresupuestario || "");
      setInstitucion(docente.institucionNombre || "");
      setRol(docente.rol || "Docente de Formación Tecnológica");
      setAsignaturas([ASIGNATURA_UNICA]);
      setInicializado(true);
    }
  }, [docente, inicializado]);

  // Es Asesoría Nacional
  const esAsesoriaNacional = dreCodigo === "DRE-NACIONAL";

  // Lista de circuitos según la DRE seleccionada
  const dreSeleccionada = LISTA_DRE_MEP.find((d) => d.codigo === dreCodigo) || LISTA_DRE_MEP[0];

  const handleCambioDRE = (nuevoCodigo: string) => {
    setDreCodigo(nuevoCodigo);
    if (nuevoCodigo === "DRE-NACIONAL") {
      setCircuito("Nivel Nacional / Ámbito General");
      setCodigoPresupuestario("FT-NACIONAL-2026");
      setInstitucion("Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)");
      setRol("Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)");
    } else {
      const found = LISTA_DRE_MEP.find((d) => d.codigo === nuevoCodigo);
      if (found) {
        setCircuito(found.circuitos[0] || "Circuito 01");
        setCodigoPresupuestario("SABER-2026");
        setInstitucion("Liceo / Colegio de Secundaria");
        setRol("Docente de Formación Tecnológica - Dimensión 1 y 2");
      }
    }
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorValidacion(null);

    // 1. Validación de Nombre Completo (Nombre y Apellidos)
    const partesNombre = nombre.trim().split(/\s+/);
    if (partesNombre.length < 2) {
      setErrorValidacion("Por favor ingrese su nombre completo (Nombre y Apellidos).");
      return;
    }

    // 2. Validación de Correo Oficial MEP (debe ser @mep.go.cr)
    const correoLimpio = correo.trim().toLowerCase();
    if (!correoLimpio.endsWith("@mep.go.cr")) {
      setErrorValidacion("El correo debe ser una cuenta institucional oficial del MEP (@mep.go.cr, ej: nombre.apellido.apellido@mep.go.cr).");
      return;
    }

    // 3. Validación de Cédula
    const cedulaLimpia = cedula.trim();
    if (cedulaLimpia.length < 9) {
      setErrorValidacion("El número de cédula o identificación debe tener un formato válido (mínimo 9 dígitos).");
      return;
    }

    // 4. Validación de Teléfono (Opcional, pero validado si se ingresa)
    const telefonoLimpio = telefono ? telefono.trim() : "";
    if (telefonoLimpio && telefonoLimpio.length < 8) {
      setErrorValidacion("Si ingresa un número de teléfono de contacto, debe contener un formato válido de al menos 8 dígitos.");
      return;
    }

    const esSuperAdminAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr";
    const idDocenteUnico =
      docente?.idDocente && !docente.idDocente.includes("DOC-DRE01-7729") && (esSuperAdminAlberto || docente.idDocente !== "ASESOR-FT-7729")
        ? docente.idDocente
        : (esSuperAdminAlberto
          ? "ASESOR-FT-7729"
          : `DOC-${dreCodigo.replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`);

    const datosDocente = {
      idDocente: idDocenteUnico,
      nombreCompleto: nombre.trim(),
      correoInstitucional: correoLimpio,
      contrasena: docente?.contrasena || "EdcRfvTgb1726**",
      cedula: cedulaLimpia,
      telefono: telefonoLimpio,
      dreCodigo,
      dreNombre: esAsesoriaNacional ? "Asesoría de Formación Tecnológica" : dreSeleccionada.nombre,
      circuito: esAsesoriaNacional ? "Nivel Nacional / Ámbito General" : circuito,
      codigoPresupuestario: esAsesoriaNacional ? "FT-NACIONAL-2026" : codigoPresupuestario,
      institucionNombre: esAsesoriaNacional ? "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)" : (institucion || "Liceo / Colegio de Secundaria"),
      rol,
      asignaturas,
      fechaRegistro: docente?.fechaRegistro || new Date().toISOString(),
    };

    guardarDocente(datosDocente);

    // Sincronización automática con la base de datos central del servidor
    try {
      fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "solicitar_registro",
          usuarioData: {
            nombreCompleto: datosDocente.nombreCompleto,
            correoInstitucional: datosDocente.correoInstitucional,
            cedula: datosDocente.cedula,
            telefono: datosDocente.telefono,
            dreCodigo: datosDocente.dreCodigo,
            dreNombre: datosDocente.dreNombre,
            circuito: datosDocente.circuito,
            institucionNombre: datosDocente.institucionNombre,
            rol: datosDocente.rol.includes("Asesor Nacional")
              ? "Asesor Nacional"
              : datosDocente.rol.includes("Asesor de Enseñanza Secundaria")
              ? "Asesor de Enseñanza Secundaria"
              : datosDocente.rol.includes("Super Administrador") || datosDocente.rol.includes("Administrador General")
              ? "Super Administrador"
              : "Docente",
          },
        }),
      }).catch(() => {
        // En escenarios offline, SafeStorage mantiene la persistencia local
      });
    } catch {}

    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailLimpio = loginCorreo.trim().toLowerCase();
    if (!emailLimpio.endsWith("@mep.go.cr")) {
      setLoginMensaje({
        tipo: "error",
        texto: "Por favor ingrese un correo institucional oficial del MEP (@mep.go.cr).",
      });
      return;
    }

    const res = iniciarSesion(emailLimpio, loginPassword);
    if (res.exito) {
      setLoginMensaje({ tipo: "exito", texto: res.mensaje });
    } else {
      setLoginMensaje({ tipo: "error", texto: res.mensaje });
    }
    setTimeout(() => setLoginMensaje(null), 4000);
  };

  const idActual = docente?.idDocente || "";
  const [urlEspacioPublico, setUrlEspacioPublico] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && idActual) {
      setUrlEspacioPublico(`${window.location.origin}/docente/resultados/${idActual}`);
    } else {
      setUrlEspacioPublico("");
    }
  }, [idActual]);

  const copiarID = () => {
    if (idActual) {
      navigator.clipboard.writeText(idActual);
      setCopiadoID(true);
      setTimeout(() => setCopiadoID(false), 2000);
    }
  };

  const copiarEnlace = () => {
    if (urlEspacioPublico) {
      navigator.clipboard.writeText(urlEspacioPublico);
      setCopiadoEnlace(true);
      setTimeout(() => setCopiadoEnlace(false), 2000);
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              Formación tecnológica • 9° año
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Perfil docente & configuración de acceso
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Gestión de perfil y credenciales para el entorno de diagnóstico
            </p>
          </div>

        {/* Tarjeta de ID Docente / Asesor */}
        {docente && idActual ? (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-2xs">
              <IdentificationCard size={22} weight="bold" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-900 uppercase">
                {esAsesoriaNacional ? "ID Asesoría Técnica" : "ID Docente Único"}
              </div>
              <div className="font-mono text-sm font-extrabold text-blue-950">{idActual}</div>
            </div>
            <button
              onClick={copiarID}
              className="ml-2 p-2 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 transition-colors"
              title="Copiar ID"
            >
              {copiadoID ? <Check size={16} weight="bold" className="text-emerald-600" /> : <Copy size={16} weight="bold" />}
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
              <UserCircle size={22} weight="bold" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                Estado de la Cuenta
              </div>
              <div className="text-xs font-bold text-slate-700">Sin sesión iniciada</div>
            </div>
          </div>
        )}
      </div>

      {/* Tarjeta Informativa de Carácter No Oficial & Autonomía Docente */}
      <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wide">
          <Info size={20} weight="duotone" className="text-amber-700 shrink-0" />
          <span>Recurso de Apoyo Pedagógico para Dimensión 1 & Dimensión 2 • Naturaleza No Oficial</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Esta plataforma constituye un <strong>recurso de apoyo pedagógico independiente</strong> diseñado especialmente para docentes de <strong>Formación Tecnológica (Dimensión 1 y Dimensión 2)</strong> en III Ciclo de Secundaria (7°, 8° y 9° año), fundamentado en los saberes e indicadores de logro del <em>Programa Nacional de Informática Educativa del Departamento de Recursos Tecnológicos en Educación (DRTE - MEP)</em> únicamente como referencia curricular para la creación de experiencias interactivas en el aula.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Aviso de Autonomía Docente:</strong> Este entorno <strong>no es un recurso oficial</strong> ni de carácter obligatorio. Se ofrece como una herramienta de apoyo didáctico complementaria donde <strong>la decisión de implementarlo, adaptarlo o proyectarlo en las lecciones la toma siempre el docente</strong> de manera libre y autónoma.
        </p>
      </div>

      {/* Pestañas de Navegación */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
        <button
          onClick={() => setPestanaActiva("perfil")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            pestanaActiva === "perfil"
              ? "bg-white text-blue-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCircle size={18} weight="bold" />
          <span>Perfil e Institución</span>
        </button>

        <button
          onClick={() => setPestanaActiva("seguridad")}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            pestanaActiva === "seguridad"
              ? "bg-blue-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ShieldCheck size={18} weight="bold" />
          <span>Credenciales & Acceso</span>
        </button>
      </div>

      {/* Espacio Público de Recepción - SOLO SI HAY SESIÓN ACTIVA */}
      {docente && urlEspacioPublico && (
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <Sparkle size={16} weight="fill" className="text-amber-400" />
              <span>Tu Enlace Público de Recepción de Resultados</span>
            </div>
            <div className="font-mono text-xs text-slate-300 select-all break-all">
              {urlEspacioPublico}
            </div>
          </div>
          <button
            onClick={copiarEnlace}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shrink-0"
          >
            {copiadoEnlace ? <Check size={16} weight="bold" /> : <LinkIcon size={16} weight="bold" />}
            <span>{copiadoEnlace ? "¡Enlace Copiado!" : "Copiar Enlace Público"}</span>
          </button>
        </div>
      )}

      {pestanaActiva === "perfil" ? (
        /* Formulario de Perfil */
        <form onSubmit={handleGuardar} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-mepCard space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <UserCircle size={22} className="text-blue-700" weight="duotone" />
              <span>Datos Personales y de Contacto Docente</span>
            </h2>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Formación Tecnológica • Dimensión 1 & Dimensión 2
            </span>
          </div>

          {errorValidacion && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2 animate-fadeIn">
              <WarningCircle size={18} weight="bold" className="shrink-0 text-rose-600" />
              <span>{errorValidacion}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre Completo (Nombre y Apellidos): <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Nombre y Apellidos completos"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Debe incluir nombres y apellidos.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Correo Electrónico Docente: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="nombre.apellido.apellido@mep.go.cr"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-slate-900"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Correo para gestión y recepción de notificaciones de aula.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Número de Cédula o Identificación: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej: 1-1122-3344"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Formato de identificación del docente.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Número de Contacto / Teléfono Móvil:
                </label>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Opcional
                </span>
              </div>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej: +506 8888-9999 (Opcional)"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>
              <span className="text-[10px] text-blue-700 font-semibold mt-1 block">
                Recomendado para comunicación sincrónica y soporte técnico.
              </span>
            </div>
          </div>

          {/* Nota Pedagógica sobre el Teléfono */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-start gap-3">
            <ChatCircleDots size={22} weight="duotone" className="text-sky-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-sky-950 uppercase tracking-wide">
                Importancia del Registro para Comunicación Mayormente Efectiva
              </h4>
              <p className="text-xs text-sky-900 leading-relaxed">
                Desde el <strong>registro de información es sumamente importante contar con estos datos</strong> para garantizar una <strong>comunicación mayormente efectiva, directa y oportuna</strong> (soporte técnico, alertas y avisos pedagógicos). No obstante, su ingreso es <strong>opcional</strong>, se maneja bajo confidencialidad y es de <strong>uso exclusivo a lo interno</strong>, sin exponerse de manera pública.
              </p>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Ubicación Regional / Asesoría */}
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Buildings size={22} className="text-blue-700" weight="duotone" />
            <span>Nivel Organizacional y Ubicación Educativa</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={esAsesoriaNacional ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirección Regional de Educación (DRE) / Asesoría:
              </label>
              <select
                value={dreCodigo}
                onChange={(e) => handleCambioDRE(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-slate-900"
              >
                {LISTA_DRE_MEP.map((d) => (
                  <option key={d.codigo} value={d.codigo}>
                    {d.codigo === "DRE-NACIONAL" ? `⭐ ${d.nombre}` : `${d.codigo}: ${d.nombre} (${d.provincia})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Si es Asesoría Nacional, se muestra un banner descriptivo y se desactivan los demás campos */}
            {esAsesoriaNacional ? (
              <div className="sm:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3.5 text-blue-950">
                <ShieldStar size={28} weight="duotone" className="text-blue-700 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <div className="font-extrabold uppercase tracking-wide text-blue-900">
                    Modalidad Asesoría de Formación Tecnológica Activa
                  </div>
                  <div className="text-slate-600">
                    Al pertenecer a la <strong>Asesoría de Formación Tecnológica</strong>, los campos de circuito regional, código presupuestario institucional y nombre de centro educativo específico se inhabilitan automáticamente al tener alcance en todo el territorio nacional.
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Circuito Escolar:
                  </label>
                  <select
                    value={circuito}
                    onChange={(e) => setCircuito(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
                  >
                    {dreSeleccionada.circuitos.map((circ) => (
                      <option key={circ} value={circ}>
                        {circ}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Código Presupuestario / Código Saber:
                  </label>
                  <input
                    type="text"
                    value={codigoPresupuestario}
                    onChange={(e) => setCodigoPresupuestario(e.target.value)}
                    placeholder="Ej: SABER-4091 / Pres. 2026"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre del Colegio / Liceo / CTP:
                  </label>
                  <input
                    type="text"
                    value={institucion}
                    onChange={(e) => setInstitucion(e.target.value)}
                    placeholder="Ej: Liceo de Costa Rica"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium text-slate-900"
                  />
                </div>
              </>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Rol y Asignatura Única */}
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap size={22} className="text-blue-700" weight="duotone" />
            <span>Rol y Asignatura de Secundaria (Dimensión 1 y 2)</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rol Educativo en Formación Tecnológica:
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold text-slate-900"
              >
                <option value="Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)">
                  ⭐ Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)
                </option>
                <option value="Asesor Nacional de Formación Tecnológica">
                  Asesor Nacional de Formación Tecnológica
                </option>
                <option value="Asesor de Enseñanza Secundaria de Formación Tecnológica">
                  Asesor de Enseñanza Secundaria de Formación Tecnológica
                </option>
                <option value="Docente de Formación Tecnológica (Dimensión 1 y 2)">
                  Docente de Formación Tecnológica (Dimensión 1 y 2)
                </option>
                <option value="Coordinador de Formación Tecnológica">
                  Coordinador de Formación Tecnológica
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Asignatura Curricular Vinculada:
              </label>
              <div className="bg-blue-50 border border-blue-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shrink-0">
                    <GraduationCap size={22} weight="fill" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-blue-950">
                      Formación Tecnológica (Dimensión 1 y Dimensión 2)
                    </div>
                    <div className="text-xs text-blue-700 font-medium">
                      III Ciclo de Secundaria (7°, 8° y 9° Año) • Enfoque Integral
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white text-xs font-extrabold rounded-xl shrink-0">
                  <Check size={16} weight="bold" />
                  <span>Dimensión 1 & 2</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1.5 block">
                Este entorno está articulado para la asignatura de <strong>Formación Tecnológica (Dimensión 1 y 2)</strong> en educación secundaria.
              </span>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div>
              {guardadoExitoso && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-fadeIn bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Check size={18} weight="bold" />
                  <span>¡Perfil docente actualizado y guardado con éxito!</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <FloppyDisk size={20} weight="bold" />
              <span>Guardar Perfil Docente</span>
            </button>
          </div>
        </form>
      ) : (
        /* Formulario de Seguridad y Credenciales */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-mepCard space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={22} className="text-blue-700" weight="duotone" />
              <span>Credenciales Docentes</span>
            </h2>

            {docente ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-extrabold rounded-full flex items-center gap-1">
                <Check size={14} weight="bold" />
                <span>Cuenta Activa & Verificada</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                Sin Sesión Iniciada
              </span>
            )}
          </div>

          {/* Tarjeta de Cuenta Actual */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase">
              {docente ? "Cuenta Conectada" : "Estado de la Sesión"}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-base font-black text-slate-900">
                  {docente ? docente.nombreCompleto : "Sin sesión activa"}
                </div>
                <div className="text-xs font-mono text-blue-700 font-semibold">
                  {docente ? docente.correoInstitucional : "Ingresa con tu correo institucional MEP (@mep.go.cr) para identificarte"}
                </div>
                {docente && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {docente.institucionNombre ? `${docente.institucionNombre} • ` : ""}{docente.rol}
                  </div>
                )}
              </div>

              {docente && idActual && (
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-700 text-white text-xs font-mono font-bold rounded-lg">
                    {idActual}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de Inicio de Sesión / Re-autenticación */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Key size={18} className="text-blue-700" />
              <span>Autenticación o Cambio de Usuario</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Institucional MEP:
                </label>
                <div className="relative">
                  <EnvelopeSimple size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    value={loginCorreo}
                    onChange={(e) => setLoginCorreo(e.target.value)}
                    required
                    placeholder="nombre.apellido.apellido@mep.go.cr"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Correo registrado para el acceso a la plataforma.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contraseña:
                </label>
                <div className="relative">
                  <LockKey size={18} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {loginMensaje && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  loginMensaje.tipo === "exito"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    : "bg-rose-100 text-rose-900 border border-rose-300"
                }`}
              >
                {loginMensaje.tipo === "exito" ? <Check size={16} weight="bold" /> : <LockKey size={16} weight="bold" />}
                <span>{loginMensaje.texto}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <SignIn size={16} weight="bold" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  cerrarSesion();
                  setLoginMensaje({ tipo: "exito", texto: "Sesión cerrada correctamente." });
                  setTimeout(() => setLoginMensaje(null), 3000);
                }}
                className="flex items-center gap-2 px-4 py-2 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors"
              >
                <SignOut size={16} weight="bold" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  </AuthGuard>
  );
}
