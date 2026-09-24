"use client";

import React, { useState, useEffect } from "react";
import {
  useDocente,
  DOCENTE_DEFAULT,
  CentroEducativoDocente,
  DesgloseNivelSecciones,
} from "@/context/DocenteContext";
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
  Plus,
  Trash,
  GraduationCap,
  ChalkboardTeacher,
  CheckCircle,
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

  // Rol Seleccionado (Docente | Asesor Regional | Asesor Nacional)
  const [tipoRol, setTipoRol] = useState<"Docente" | "Asesor Regional" | "Asesor Nacional">(
    (docente?.tipoRol as any) ||
      (docente?.dreCodigo === "DRE-NACIONAL" || docente?.correoInstitucional === "alberto.bustos.ortega@mep.go.cr"
        ? "Asesor Nacional"
        : docente?.rol?.includes("Asesor Regional")
        ? "Asesor Regional"
        : "Docente")
  );

  // DRE y Ubicación (Legacy / Principal)
  const [dreCodigo, setDreCodigo] = useState(normalizarDRECodigo(docente?.dreCodigo));
  const [circuito, setCircuito] = useState(docente?.circuito || "Circuito 01");
  const [codigoPresupuestario, setCodigoPresupuestario] = useState(docente?.codigoPresupuestario || "SABER-2027");
  const [institucion, setInstitucion] = useState(docente?.institucionNombre || "");
  const [rol, setRol] = useState(docente?.rol || "Docente de Formación Tecnológica");
  const ASIGNATURA_UNICA = "Formación Tecnológica (Dimensión 1 y 2)";

  // ==========================================
  // GESTIÓN DE CENTROS EDUCATIVOS Y NIVELES
  // ==========================================
  const CREAR_DESGLOSE_NIVELES_DEFAULT = (): DesgloseNivelSecciones[] => [
    { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
    { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2", "8-3"] },
    { nivel: "9°", activo: true, totalSeccionesColegio: 8, seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4", "9-5"] },
  ];

  const CREAR_CENTRO_DEFAULT = (idNum: number, dreDef = "DRE-01", nomDef = ""): CentroEducativoDocente => {
    const dreObj = LISTA_DRE_MEP.find((d) => d.codigo === dreDef) || LISTA_DRE_MEP[0];
    return {
      id: `CENTRO-${Date.now()}-${idNum}`,
      nombre: nomDef,
      dreCodigo: dreDef,
      dreNombre: dreObj.nombre,
      circuito: dreObj.circuitos[0] || "Circuito 01",
      codigoPresupuestario: "SABER-2027",
      desgloseNiveles: CREAR_DESGLOSE_NIVELES_DEFAULT(),
    };
  };

  const [centros, setCentros] = useState<CentroEducativoDocente[]>(() => {
    if (docente?.centrosEducativos && docente.centrosEducativos.length > 0) {
      return docente.centrosEducativos;
    }
    return [
      CREAR_CENTRO_DEFAULT(
        1,
        normalizarDRECodigo(docente?.dreCodigo),
        docente?.institucionNombre && !docente.institucionNombre.includes("Asesoría Nacional")
          ? docente.institucionNombre
          : ""
      ),
    ];
  });

  // Estados de validación
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [guardando, setGuardando] = useState(false);
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
      setCodigoPresupuestario(docente.codigoPresupuestario || "SABER-2027");
      setInstitucion(docente.institucionNombre || "");
      setRol(docente.rol || "Docente de Formación Tecnológica");
      if (docente.tipoRol) {
        setTipoRol(docente.tipoRol);
      } else if (docente.dreCodigo === "DRE-NACIONAL" || docente.correoInstitucional === "alberto.bustos.ortega@mep.go.cr") {
        setTipoRol("Asesor Nacional");
      }
      if (docente.centrosEducativos && docente.centrosEducativos.length > 0) {
        setCentros(docente.centrosEducativos);
      }
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
      setCodigoPresupuestario("FT-NACIONAL-2027");
      setInstitucion("Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)");
      setRol("Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)");
    } else {
      const found = LISTA_DRE_MEP.find((d) => d.codigo === codNorm);
      const primerCircuito = found?.circuitos?.[0] || "Circuito 01";
      setCircuito(primerCircuito);
      setCodigoPresupuestario("SABER-2027");
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
    setCodigoPresupuestario("FT-NACIONAL-2027");
    setInstitucion("Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)");
    setRol("Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)");
    setErrorValidacion(null);
  };

  const cargarPerfilDocentePrueba = (region: "liberia" | "sanjose" | "alajuela") => {
    if (region === "liberia") {
      setNombre("Docente Prueba Liberia");
      setCorreo("pruebadocente3@mep.go.cr");
      setCedula("0-0000-0003");
      setTelefono("0000-0003");
      setPin("5821");
      setPinConfirmar("5821");
      setDreCodigo("DRE-07");
      setCircuito("Circuito 01");
      setCodigoPresupuestario("SABER-LIBERIA-2027");
      setInstitucion("Liceo Laboratorio de Liberia");
      setRol("Docente de Formación Tecnológica");
    } else if (region === "sanjose") {
      setNombre("Docente Prueba San José");
      setCorreo("pruebadocente1@mep.go.cr");
      setCedula("0-0000-0001");
      setTelefono("0000-0001");
      setPin("1111");
      setPinConfirmar("1111");
      setDreCodigo("DRE-01");
      setCircuito("Circuito 01");
      setCodigoPresupuestario("SABER-SJ-2027");
      setInstitucion("Liceo de Costa Rica");
      setRol("Docente de Formación Tecnológica");
    } else {
      setNombre("Docente Prueba Alajuela");
      setCorreo("pruebadocente2@mep.go.cr");
      setCedula("0-0000-0002");
      setTelefono("0000-0002");
      setPin("2222");
      setPinConfirmar("2222");
      setDreCodigo("DRE-04");
      setCircuito("Circuito 02");
      setCodigoPresupuestario("SABER-ALAJUELA-2027");
      setInstitucion("Liceo Experimental Bilingüe de Alajuela");
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
  // HANDLERS PARA CENTROS EDUCATIVOS Y NIVELES
  // ==========================================
  const handleActualizarCentro = (index: number, campo: keyof CentroEducativoDocente, valor: any) => {
    const nuevos = [...centros];
    if (campo === "dreCodigo") {
      const dreFound = LISTA_DRE_MEP.find((d) => d.codigo === valor) || LISTA_DRE_MEP[0];
      nuevos[index] = {
        ...nuevos[index],
        dreCodigo: valor,
        dreNombre: dreFound.nombre,
        circuito: dreFound.circuitos[0] || "Circuito 01",
      };
    } else {
      nuevos[index] = { ...nuevos[index], [campo]: valor };
    }
    setCentros(nuevos);
  };

  const handleAgregarCentro = () => {
    setCentros([...centros, CREAR_CENTRO_DEFAULT(centros.length + 1)]);
  };

  const handleEliminarCentro = (index: number) => {
    if (centros.length <= 1) return;
    setCentros(centros.filter((_, i) => i !== index));
  };

  const handleToggleNivelActivo = (centroIndex: number, nivelIndex: number) => {
    const nuevos = [...centros];
    const nivelObj = nuevos[centroIndex].desgloseNiveles[nivelIndex];
    nivelObj.activo = !nivelObj.activo;
    if (!nivelObj.activo) {
      nivelObj.seccionesAtendidasDocente = [];
    } else if (nivelObj.seccionesAtendidasDocente.length === 0) {
      const numNivel = nivelObj.nivel.replace(/[^0-9]/g, "") || "9";
      const total = nivelObj.totalSeccionesColegio || 6;
      const mitad = Math.max(1, Math.ceil(total / 2));
      const sugeridas: string[] = [];
      for (let i = 1; i <= mitad; i++) {
        sugeridas.push(`${numNivel}-${i}`);
      }
      nivelObj.seccionesAtendidasDocente = sugeridas;
    }
    setCentros(nuevos);
  };

  const handleCambiarTotalSecciones = (centroIndex: number, nivelIndex: number, nuevoTotal: number) => {
    const totalValido = Math.max(1, Math.min(25, isNaN(nuevoTotal) ? 1 : nuevoTotal));
    const nuevos = [...centros];
    const nivelObj = nuevos[centroIndex].desgloseNiveles[nivelIndex];
    nivelObj.totalSeccionesColegio = totalValido;
    const numNivel = nivelObj.nivel.replace(/[^0-9]/g, "") || "9";
    nivelObj.seccionesAtendidasDocente = nivelObj.seccionesAtendidasDocente.filter((sec) => {
      const secNum = parseInt(sec.split("-")[1] || "99", 10);
      return secNum <= totalValido;
    });
    setCentros(nuevos);
  };

  const handleToggleSeccion = (centroIndex: number, nivelIndex: number, seccionCodigo: string) => {
    const nuevos = [...centros];
    const nivelObj = nuevos[centroIndex].desgloseNiveles[nivelIndex];
    const existe = nivelObj.seccionesAtendidasDocente.includes(seccionCodigo);
    if (existe) {
      nivelObj.seccionesAtendidasDocente = nivelObj.seccionesAtendidasDocente.filter((s) => s !== seccionCodigo);
    } else {
      nivelObj.seccionesAtendidasDocente = [...nivelObj.seccionesAtendidasDocente, seccionCodigo].sort((a, b) => {
        const numA = parseInt(a.split("-")[1] || "0", 10);
        const numB = parseInt(b.split("-")[1] || "0", 10);
        return numA - numB;
      });
    }
    setCentros(nuevos);
  };

  const handleSeleccionarTodasSecciones = (centroIndex: number, nivelIndex: number) => {
    const nuevos = [...centros];
    const nivelObj = nuevos[centroIndex].desgloseNiveles[nivelIndex];
    const numNivel = nivelObj.nivel.replace(/[^0-9]/g, "") || "9";
    const todas: string[] = [];
    for (let i = 1; i <= nivelObj.totalSeccionesColegio; i++) {
      todas.push(`${numNivel}-${i}`);
    }
    nivelObj.seccionesAtendidasDocente = todas;
    setCentros(nuevos);
  };

  const handleLimpiarSecciones = (centroIndex: number, nivelIndex: number) => {
    const nuevos = [...centros];
    nuevos[centroIndex].desgloseNiveles[nivelIndex].seccionesAtendidasDocente = [];
    setCentros(nuevos);
  };

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

    // Validar centros educativos si es Docente
    if (tipoRol === "Docente") {
      if (!centros || centros.length === 0) {
        setErrorValidacion("Debe registrar al menos un Centro Educativo donde labora.");
        return;
      }
      for (let i = 0; i < centros.length; i++) {
        const c = centros[i];
        if (!c.nombre || !c.nombre.trim()) {
          setErrorValidacion(`Por favor ingrese el nombre del Centro Educativo #${i + 1}.`);
          return;
        }
      }
    }

    const esSuperAdminAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr" || tipoRol === "Asesor Nacional";
    const idDocenteUnico = esSuperAdminAlberto
      ? "ASESOR-FT-7729"
      : docente?.idDocente && !docente.idDocente.includes("DOC-DRE01-7729") && docente.idDocente !== "ASESOR-FT-7729"
      ? docente.idDocente
      : `DOC-${(centros[0]?.dreCodigo || dreCodigo).replace(/[^a-zA-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    let dreCodigoFinal = dreCodigo;
    let dreNombreFinal = dreSeleccionada.nombre;
    let circuitoFinal = circuito;
    let institucionFinal = institucion || "Liceo / Colegio de Secundaria";
    let rolFinal = "Docente de Formación Tecnológica";

    if (tipoRol === "Asesor Nacional") {
      dreCodigoFinal = "DRE-NACIONAL";
      dreNombreFinal = "Asesoría de Formación Tecnológica";
      circuitoFinal = "Nivel Nacional / Ámbito General";
      institucionFinal = "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)";
      rolFinal = esSuperAdminAlberto
        ? "Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)"
        : "Asesor Nacional de Formación Tecnológica";
    } else if (tipoRol === "Asesor Regional") {
      dreCodigoFinal = dreCodigo;
      dreNombreFinal = dreSeleccionada.nombre;
      circuitoFinal = circuito;
      institucionFinal = `Asesoría Regional de Formación Tecnológica (${dreSeleccionada.nombre})`;
      rolFinal = `Asesor Regional de Formación Tecnológica (${dreSeleccionada.nombre})`;
    } else {
      // Docente
      dreCodigoFinal = centros[0]?.dreCodigo || dreCodigo;
      dreNombreFinal = centros[0]?.dreNombre || dreSeleccionada.nombre;
      circuitoFinal = centros[0]?.circuito || circuito;
      institucionFinal = centros[0]?.nombre || institucion || "Liceo / Colegio de Secundaria";
      rolFinal = "Docente de Formación Tecnológica";
    }

    const datosDocente = {
      idDocente: idDocenteUnico,
      nombreCompleto: nombre.trim(),
      correoInstitucional: correoLimpio,
      cedula: cedulaLimpia,
      telefono: telefonoLimpio,
      pin: pinLimpio,
      contrasena: pinLimpio,
      tipoRol,
      centrosEducativos: tipoRol === "Docente" ? centros : undefined,
      dreCodigo: dreCodigoFinal,
      dreNombre: dreNombreFinal,
      circuito: circuitoFinal,
      codigoPresupuestario: dreCodigoFinal === "DRE-NACIONAL" ? "FT-NACIONAL-2027" : codigoPresupuestario,
      institucionNombre: institucionFinal,
      rol: rolFinal,
      asignaturas: [ASIGNATURA_UNICA],
      fechaRegistro: docente?.fechaRegistro || new Date().toISOString(),
    };

    setGuardando(true);
    const res = registrarDocente(datosDocente);

    // Sincronizar automáticamente con perfil global de webapps estáticas
    try {
      const perfilGlobal = {
        nombre: nombre.trim(),
        cedula: cedulaLimpia,
        telefono: telefonoLimpio,
        correo: correoLimpio,
        tipoRol,
        dreCodigo: dreCodigoFinal,
        dreNombre: dreNombreFinal,
        colegio: institucionFinal,
        centrosEducativos: centros,
        niveles: ['7° Año', '8° Año', '9° Año'],
        pin: pinLimpio,
        autenticado: true,
        registradoEl: new Date().toISOString()
      };
      localStorage.setItem('MEP_DOCENTE_PERFIL_GLOBAL', JSON.stringify(perfilGlobal));
    } catch (e) {}

    setTimeout(() => {
      setGuardando(false);
      if (res.exito) {
        setGuardadoExitoso(true);
        setTimeout(() => setGuardadoExitoso(false), 5000);
      } else {
        setErrorValidacion(res.mensaje);
      }
    }, 450);
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

  const correoDocenteLimpio = docente?.correoInstitucional?.toLowerCase().trim() || "";
  const esSuperAdmin = correoDocenteLimpio === "alberto.bustos.ortega@mep.go.cr";
  const esAsesorNacional = esSuperAdmin || correoDocenteLimpio === "allan.morera.araya@mep.go.cr" || docente?.tipoRol === "Asesor Nacional";

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
          {/* Botones de prueba en regiones */}
          <button
            type="button"
            onClick={() => cargarPerfilDocentePrueba("sanjose")}
            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Flask size={15} className="text-sky-700" />
            <span>Docente Prueba San José (01)</span>
          </button>

          <button
            type="button"
            onClick={() => cargarPerfilDocentePrueba("alajuela")}
            className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Flask size={15} className="text-purple-700" />
            <span>Docente Prueba Alajuela (04)</span>
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
              <div>
                {docente
                  ? "¡Perfil y datos de contacto actualizados con éxito!"
                  : "¡Cuenta registrada y perfil guardado con éxito! Ya puedes utilizar tu PIN de 4 dígitos."}
              </div>
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
                  placeholder="Ej: X-XXXX-XXXX"
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
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Teléfono Móvil de Contacto (Opcional)</span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Opcional • Apoyo Docente
                  </span>
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
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11.5px] text-slate-700 font-medium space-y-2 mt-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck size={16} className="text-emerald-700 shrink-0" weight="bold" />
                    <span>Compromiso de Privacidad y Apoyo Pedagógico Sincrónico</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    El canal de mensajería móvil es <strong>opcional</strong> y de uso estrictamente profesional para facilitar el restablecimiento ágil de credenciales docentes, así como una <strong>forma de comunicación adicional desde la Asesoría con el docente para brindar apoyo pedagógico sincrónico</strong> y acompañamiento en su labor educativa.
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Los datos son tratados bajo rigurosa confidencialidad institucional para fines de apoyo educativo y laboral, <strong>sin ninguna exposición comercial ni de otra índole</strong>. Al suministrar su número, el docente otorga su visto bueno para su utilización exclusiva en este marco de soporte profesional.
                  </p>
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

          {/* Tarjeta 3: Rol del Usuario - Bloqueado a Docente para profesores */}
          {docente && (docente.tipoRol === "Docente" || (!esSuperAdmin && !esAsesorNacional && docente.tipoRol !== "Asesor Regional")) ? (
            <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
                    <ChalkboardTeacher size={24} weight="bold" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                      Perfil Profesional Asignado
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Profesor / Docente de Formación Tecnológica
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-black rounded-full uppercase self-start sm:self-auto">
                  Docente Activo
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1 border-t border-slate-100">
                Como docente de aula, a continuación puedes editar y actualizar tus <strong>centros educativos</strong>, tus <strong>secciones atendidas por nivel (7.°, 8.° y 9.°)</strong> y tus datos de contacto.
              </p>
            </div>
          ) : (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap size={22} className="text-emerald-700" weight="bold" />
                <span>Rol y Tipo de Usuario en el Sistema MEP</span>
              </h3>

              <p className="text-xs text-slate-600 font-medium">
                Selecciona tu función en el programa de Formación Tecnológica para adaptar tu entorno de diagnóstico y analítica:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Opción 1: Docente */}
                <button
                  type="button"
                  onClick={() => setTipoRol("Docente")}
                  className={`p-4.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                    tipoRol === "Docente"
                      ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${tipoRol === "Docente" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      <ChalkboardTeacher size={22} weight="bold" />
                    </div>
                    {tipoRol === "Docente" && (
                      <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">Profesor / Docente de Aula</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      Aplica diagnósticos a sus secciones y gestiona resultados de estudiantes.
                    </div>
                  </div>
                </button>

                {/* Opción 2: Asesor Regional */}
                <button
                  type="button"
                  onClick={() => setTipoRol("Asesor Regional")}
                  className={`p-4.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                    tipoRol === "Asesor Regional"
                      ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${tipoRol === "Asesor Regional" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      <Buildings size={22} weight="bold" />
                    </div>
                    {tipoRol === "Asesor Regional" && (
                      <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">Asesor(a) Regional</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      Supervisa y analiza el desempeño en los centros educativos de su DRE.
                    </div>
                  </div>
                </button>

                {/* Opción 3: Asesor Nacional */}
                <button
                  type="button"
                  onClick={() => setTipoRol("Asesor Nacional")}
                  className={`p-4.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                    tipoRol === "Asesor Nacional"
                      ? "border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${tipoRol === "Asesor Nacional" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      <GraduationCap size={22} weight="bold" />
                    </div>
                    {tipoRol === "Asesor Nacional" && (
                      <span className="px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase">
                        Seleccionado
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900">Asesoría Nacional</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                      Acceso macro nacional a todas las DRE y consolidación del país.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tarjeta 4A: Configuración para Asesor Nacional */}
          {tipoRol === "Asesor Nacional" && (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Buildings size={22} className="text-emerald-700" weight="bold" />
                <span>Asignación Nacional (DRE-NACIONAL)</span>
              </h3>
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl text-xs text-emerald-950 font-medium space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle size={18} weight="fill" className="text-emerald-700" />
                  <span>Ámbito General y Cobertura Nacional</span>
                </div>
                <p>
                  Tu usuario tendrá habilitada la visualización comparativa de todas las 27 Direcciones Regionales de Educación (DRE) y observatorio macro de diagnósticos del país.
                </p>
              </div>
            </div>
          )}

          {/* Tarjeta 4B: Configuración para Asesor Regional */}
          {tipoRol === "Asesor Regional" && (
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Buildings size={22} className="text-emerald-700" weight="bold" />
                <span>Dirección Regional de Educación (DRE) a Cargo</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Dirección Regional (DRE) <span className="text-rose-600">*</span>
                  </label>
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
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Circuito Escolar
                  </label>
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
                </div>
              </div>
            </div>
          )}

          {/* Tarjeta 4C: Configuración Multicentro y Secciones por Nivel (Para Docentes) */}
          {tipoRol === "Docente" && (
            <div className="space-y-6">
              {/* Barra de Gestión de Cantidad de Centros Educativos */}
              <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Buildings size={22} className="text-emerald-700" weight="bold" />
                      <span>¿En cuántos centros educativos laboras actualmente?</span>
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
                      Puedes configurar tu carga institucional y seleccionar qué secciones atiendes en cada colegio.
                    </p>
                  </div>

                  {/* Selector rápido de cantidad */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Centros:</span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            if (num > centros.length) {
                              const extras: CentroEducativoDocente[] = [];
                              for (let i = centros.length + 1; i <= num; i++) {
                                extras.push(CREAR_CENTRO_DEFAULT(i));
                              }
                              setCentros([...centros, ...extras]);
                            } else if (num < centros.length) {
                              setCentros(centros.slice(0, num));
                            }
                          }}
                          className={`w-9 h-9 rounded-xl font-black text-xs transition-all flex items-center justify-center ${
                            centros.length === num
                              ? "bg-emerald-700 text-white shadow-sm"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleAgregarCentro}
                        className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={15} weight="bold" />
                        <span>Agregar Otro</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Render de cada Centro Educativo y su Matriz de Secciones */}
              {centros.map((centro, centroIdx) => {
                const dreObj = LISTA_DRE_MEP.find((d) => d.codigo === centro.dreCodigo) || LISTA_DRE_MEP[0];
                const circuitosDelCentro = dreObj?.circuitos && Array.isArray(dreObj.circuitos)
                  ? dreObj.circuitos
                  : ["Circuito 01"];

                return (
                  <div
                    key={centro.id || centroIdx}
                    className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden"
                  >
                    {/* Encabezado del Centro Educativo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 bg-emerald-700 text-white font-black text-sm rounded-xl flex items-center justify-center shadow-xs">
                          #{centroIdx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            {centro.nombre.trim() ? centro.nombre : `Centro Educativo #${centroIdx + 1}`}
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium">
                            {centro.dreNombre} • {centro.circuito}
                          </p>
                        </div>
                      </div>

                      {centros.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleEliminarCentro(centroIdx)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-end sm:self-auto"
                        >
                          <Trash size={15} weight="bold" />
                          <span>Eliminar Centro</span>
                        </button>
                      )}
                    </div>

                    {/* Datos Básicos de la Institución */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-1.5 md:col-span-1">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Dirección Regional (DRE) <span className="text-rose-600">*</span>
                        </label>
                        <select
                          value={centro.dreCodigo}
                          onChange={(e) => handleActualizarCentro(centroIdx, "dreCodigo", e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                        >
                          {LISTA_DRE_REGIONALES.map((dre) => (
                            <option key={dre.codigo} value={dre.codigo}>
                              {dre.codigo} - {dre.nombre} ({dre.provincia})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 md:col-span-1">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Circuito Escolar
                        </label>
                        <select
                          value={centro.circuito}
                          onChange={(e) => handleActualizarCentro(centroIdx, "circuito", e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                        >
                          {circuitosDelCentro.map((circ) => (
                            <option key={circ} value={circ}>
                              {circ}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 md:col-span-1">
                        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                          Nombre del Liceo o CTP <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={centro.nombre}
                          onChange={(e) => handleActualizarCentro(centroIdx, "nombre", e.target.value)}
                          placeholder="Ej: Liceo Laboratorio / CTP..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Matriz de Secciones por Nivel */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap size={18} className="text-emerald-700" weight="bold" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Distribución de Secciones por Nivel en este Centro
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Indica el total del colegio y marca las secciones que tú atiendes
                        </span>
                      </div>

                      <div className="space-y-4">
                        {centro.desgloseNiveles.map((nivelItem, nivelIdx) => {
                          const numNivel = nivelItem.nivel.replace(/[^0-9]/g, "") || "9";
                          const totalCol = nivelItem.totalSeccionesColegio || 1;
                          const asignadas = nivelItem.seccionesAtendidasDocente || [];

                          // Generar lista de códigos de secciones del colegio
                          const listaCodigosColegio: string[] = [];
                          for (let s = 1; s <= totalCol; s++) {
                            listaCodigosColegio.push(`${numNivel}-${s}`);
                          }

                          return (
                            <div
                              key={nivelItem.nivel}
                              className={`p-4.5 rounded-2xl border-2 transition-all space-y-3.5 ${
                                nivelItem.activo
                                  ? "border-emerald-300 bg-emerald-50/30 shadow-xs"
                                  : "border-slate-200 bg-slate-50/50 opacity-70"
                              }`}
                            >
                              {/* Barra del Nivel: Toggle de Nivel + Total Secciones */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={nivelItem.activo}
                                    onChange={() => handleToggleNivelActivo(centroIdx, nivelIdx)}
                                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 bg-white cursor-pointer"
                                  />
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-black rounded-lg">
                                      {nivelItem.nivel} Año
                                    </span>
                                    <span className="text-xs font-bold text-slate-800">
                                      {nivelItem.activo ? "Imparto este nivel" : "No imparto este nivel"}
                                    </span>
                                  </div>
                                </label>

                                {nivelItem.activo && (
                                  <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <div className="flex items-center gap-2">
                                      <label className="text-[11px] font-bold text-slate-600">
                                        Total secciones en el colegio:
                                      </label>
                                      <input
                                        type="number"
                                        min={1}
                                        max={25}
                                        value={nivelItem.totalSeccionesColegio}
                                        onChange={(e) =>
                                          handleCambiarTotalSecciones(
                                            centroIdx,
                                            nivelIdx,
                                            parseInt(e.target.value, 10)
                                          )
                                        }
                                        className="w-16 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-center text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                                      />
                                    </div>

                                    <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
                                      <button
                                        type="button"
                                        onClick={() => handleSeleccionarTodasSecciones(centroIdx, nivelIdx)}
                                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-[10.5px] font-bold text-slate-700 rounded-lg transition-colors"
                                      >
                                        Todas
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleLimpiarSecciones(centroIdx, nivelIdx)}
                                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-[10.5px] font-bold text-slate-500 rounded-lg transition-colors"
                                      >
                                        Limpiar
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Chips de Selección de Secciones Asignadas al Docente */}
                              {nivelItem.activo && (
                                <div className="space-y-2 pt-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-700">
                                      Marca las secciones que tú atiendes:
                                    </span>
                                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                                      Atiendes {asignadas.length} de {totalCol} secciones
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {listaCodigosColegio.map((secCodigo) => {
                                      const estaSeleccionada = asignadas.includes(secCodigo);
                                      const mensajeTooltip = estaSeleccionada
                                        ? `Sección ${secCodigo} seleccionada. Active la sección si usted la atiende.`
                                        : `Active la sección ${secCodigo} si usted la atiende`;
                                      return (
                                        <div key={secCodigo} className="relative group inline-block">
                                          <button
                                            type="button"
                                            onClick={() => handleToggleSeccion(centroIdx, nivelIdx, secCodigo)}
                                            title={mensajeTooltip}
                                            aria-label={mensajeTooltip}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                                              estaSeleccionada
                                                ? "bg-emerald-700 text-white ring-2 ring-emerald-600/30 scale-102 hover:bg-emerald-800"
                                                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 hover:border-emerald-500 hover:text-emerald-700"
                                            }`}
                                          >
                                            {estaSeleccionada && <Check size={14} weight="bold" />}
                                            <span>Sección {secCodigo}</span>
                                          </button>
                                          {/* Tooltip flotante */}
                                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex group-focus-within:flex flex-col items-center pointer-events-none z-30 whitespace-nowrap">
                                            <div className="bg-slate-900/95 text-white text-[10.5px] font-bold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700/80 flex items-center gap-1.5 animate-fadeIn">
                                              <span className={estaSeleccionada ? "text-emerald-400 font-extrabold" : "text-amber-300 font-extrabold"}>
                                                {estaSeleccionada ? "✓" : "👉"}
                                              </span>
                                              <span>Active la sección {secCodigo} si usted la atiende</span>
                                            </div>
                                            <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Botón de Guardar con Feedback Interactivo */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200">
            {guardadoExitoso && (
              <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-4 py-2.5 rounded-xl flex items-center gap-2 animate-bounce">
                <Check size={16} weight="bold" className="text-emerald-700" />
                <span>¡Cambios y perfil sincronizados con éxito!</span>
              </span>
            )}
            <button
              type="submit"
              disabled={guardando}
              className={`px-8 py-3.5 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                guardadoExitoso
                  ? "bg-emerald-600 hover:bg-emerald-700 ring-4 ring-emerald-400/40"
                  : guardando
                  ? "bg-slate-600 cursor-wait opacity-80"
                  : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              {guardando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando y Sincronizando...</span>
                </>
              ) : guardadoExitoso ? (
                <>
                  <Check size={18} weight="bold" className="text-white" />
                  <span>¡Perfil Actualizado con Éxito!</span>
                </>
              ) : (
                <>
                  <FloppyDisk size={18} weight="bold" />
                  <span>{docente ? "Actualizar Perfil & Guardar Cambios" : "Guardar Perfil & Habilitar PIN"}</span>
                </>
              )}
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
                placeholder="Ej: X-XXXX-XXXX o nombre.apellido@mep.go.cr"
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
                  placeholder="Ej: X-XXXX-XXXX o nombre.apellido@mep.go.cr"
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
                    <span>Mensajería Móvil (WhatsApp)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  * El canal de mensajería móvil es opcional y de uso estrictamente profesional para facilitar el restablecimiento ágil de credenciales docentes y como forma de comunicación adicional desde la Asesoría para apoyo pedagógico sincrónico (el docente da el visto bueno para su uso educativo).
                </p>
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

      {/* TOAST FLOTANTE DE CONFIRMACIÓN GLOBAL */}
      {guardadoExitoso && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-400 flex items-center gap-3.5 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
            <Check size={22} weight="bold" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">¡Información Guardada!</h4>
            <p className="text-[11.5px] text-slate-200 mt-0.5 font-medium">
              Tu perfil, centros educativos y secciones han sido guardados y sincronizados.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shrink-0 transition-colors shadow-xs flex items-center gap-1"
          >
            <span>Dashboard</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
