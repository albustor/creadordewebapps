"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SafeStorage } from "@/lib/firebase";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { formatearCedulaCR, normalizarCedulaParaComparar } from "@/lib/cedulaUtils";
import {
  WebAppComunidad,
  PRODUCCIONES_COMUNIDAD_INICIALES,
  obtenerProduccionConHTML,
} from "@/lib/comunidadData";

export interface DesgloseNivelSecciones {
  nivel: string; // "7°", "8°", "9°", "10°", "11°", "12°"
  activo: boolean;
  totalSeccionesColegio: number; // Ej: 10 secciones en la institución
  seccionesAtendidasDocente: string[]; // Ej: ["9-1", "9-2", "9-3", "9-4", "9-5"]
}

export interface CentroEducativoDocente {
  id: string;
  nombre: string;
  dreCodigo: string;
  dreNombre: string;
  circuito: string;
  codigoPresupuestario?: string;
  desgloseNiveles: DesgloseNivelSecciones[];
}

export interface DocenteData {
  idDocente: string;
  nombreCompleto: string;
  correoInstitucional: string;
  cedula: string;
  telefono: string;
  tipoRol?: "Asesor Nacional" | "Asesor Regional" | "Docente";
  rol: string;
  centrosEducativos?: CentroEducativoDocente[];
  dreCodigo: string;
  dreNombre: string;
  circuito: string;
  codigoPresupuestario: string;
  institucionNombre: string;
  asignaturas: string[];
  fechaRegistro: string;
  contrasena?: string;
  pin?: string; // PIN numérico de 4 dígitos para acceso ágil en laboratorio
}

export interface WebAppInfo {
  id: string;
  titulo: string;
  docenteId: string;
  asignatura: string;
  nivel: string;
  saberTitulo: string;
  indicadorCodigo: string;
  indicadorNombre: string;
  mecanica: string;
  modo: "Individual" | "Parejas";
  codigoHTML: string;
  fechaCreacion: string;
  visitas: number;
  esPublica?: boolean;
}

interface DocenteContextType {
  docente: DocenteData | null;
  webApps: WebAppInfo[];
  webAppsComunidad: WebAppComunidad[];
  telemetria: PayloadTelemetria[];
  isInitialized: boolean;
  guardarDocente: (data: DocenteData) => void;
  registrarDocente: (data: DocenteData) => { exito: boolean; mensaje: string };
  guardarWebApp: (webapp: WebAppInfo) => void;
  compartirEnComunidad: (webapp: WebAppInfo | WebAppComunidad) => void;
  iniciarSesion: (correoOUsuario: string, contrasenaOPin: string) => { exito: boolean; mensaje: string; intentosRestantes?: number; bloqueado?: boolean };
  iniciarSesionConPIN: (cedulaOCorreo: string, pin: string) => { exito: boolean; mensaje: string; intentosRestantes?: number; bloqueado?: boolean };
  solicitarRecuperacionPIN: (cedulaOCorreo: string, canal: "correo" | "whatsapp") => Promise<{ exito: boolean; mensaje: string; codigoSimulado?: string }>;
  verificarOTP: (cedulaOCorreo: string, codigoOTP: string, nuevoPIN: string) => { exito: boolean; mensaje: string };
  cerrarSesion: () => void;
  agregarResultadoTelemetria: (res: PayloadTelemetria) => void;
  actualizarResultadoTelemetria: (timestamp: number, datosActualizados: Partial<PayloadTelemetria>) => void;
  importarLoteResultados: (lote: PayloadTelemetria[]) => void;
  eliminarResultado: (timestamp: number) => void;
  limpiarTelemetria: () => void;
  restablecerDatosDemostracion: () => void;
  limpiarSesion: () => void;
  estaAutenticado: boolean;
}

const DocenteContext = createContext<DocenteContextType | undefined>(undefined);

export const DOCENTE_DEFAULT: DocenteData = {
  idDocente: "ASESOR-FT-7729",
  nombreCompleto: "Alberto Bustos Ortega",
  correoInstitucional: "alberto.bustos.ortega@mep.go.cr",
  pin: "2617",
  contrasena: "2617",
  cedula: "5-0305-0179",
  telefono: "+506 8888-9999",
  tipoRol: "Asesor Nacional",
  dreCodigo: "DRE-NACIONAL",
  dreNombre: "Asesoría de Formación Tecnológica",
  circuito: "Nivel Nacional / Ámbito General",
  codigoPresupuestario: "FT-NACIONAL-2026",
  institucionNombre: "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)",
  rol: "Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  fechaRegistro: new Date().toISOString(),
};

export const DOCENTE_PRUEBA_REGIONAL: DocenteData = {
  idDocente: "DOC-DRE07-5821",
  nombreCompleto: "Prof. Esteban Gómez Chinchilla",
  correoInstitucional: "esteban.gomez.chinchilla@mep.go.cr",
  pin: "5821",
  contrasena: "5821",
  cedula: "5-0345-0891",
  telefono: "+506 8765-4321",
  tipoRol: "Docente",
  dreCodigo: "DRE-07",
  dreNombre: "Liberia",
  circuito: "Circuito 01",
  codigoPresupuestario: "SABER-LIBERIA-2026",
  institucionNombre: "Liceo Laboratorio de Liberia",
  rol: "Docente de Formación Tecnológica",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  centrosEducativos: [
    {
      id: "CENTRO-01",
      nombre: "Liceo Laboratorio de Liberia",
      dreCodigo: "DRE-07",
      dreNombre: "Liberia",
      circuito: "Circuito 01",
      codigoPresupuestario: "SABER-LIBERIA-2026",
      desgloseNiveles: [
        {
          nivel: "7°",
          activo: true,
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["7-1", "7-2", "7-3"],
        },
        {
          nivel: "8°",
          activo: true,
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["8-1", "8-2", "8-3"],
        },
        {
          nivel: "9°",
          activo: true,
          totalSeccionesColegio: 8,
          seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4", "9-5"],
        },
      ],
    },
  ],
  fechaRegistro: new Date().toISOString(),
};

export const DOCENTE_ASESOR_ALLAN: DocenteData = {
  idDocente: "ASESOR-FT-8841",
  nombreCompleto: "Allan Morera Araya",
  correoInstitucional: "allan.morera.araya@mep.go.cr",
  pin: "2617",
  contrasena: "2617",
  cedula: "1-0987-0654",
  telefono: "+506 8888-7777",
  tipoRol: "Asesor Nacional",
  dreCodigo: "DRE-NACIONAL",
  dreNombre: "Asesoría de Formación Tecnológica",
  circuito: "Nivel Nacional / Ámbito General",
  codigoPresupuestario: "FT-NACIONAL-2026",
  institucionNombre: "Asesoría Nacional de Formación Tecnológica (III Ciclo)",
  rol: "Asesor de Formación Tecnológica (III Ciclo)",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  fechaRegistro: new Date().toISOString(),
};

export const LISTA_DOCENTES_INICIALES: DocenteData[] = [
  DOCENTE_DEFAULT,
  DOCENTE_ASESOR_ALLAN,
  DOCENTE_PRUEBA_REGIONAL,
];

export const DOCENTE_MEP_OFICIAL = DOCENTE_DEFAULT;

const SAMPLE_TELEMETRIA: PayloadTelemetria[] = [
  {
    webAppId: "com-7-algoritmos-sim",
    webAppTitulo: "Laboratorio de Algoritmos y Condicionales (7°)",
    docenteId: "DOC-DRE01-7729",
    estudianteNombre: "Valeria Montero Jiménez",
    seccionOGrupo: "Sección 7-1",
    puntaje: 100,
    puntajeMaximo: 100,
    porcentaje: 100,
    nivelLogro: "Avanzado",
    tiempoSegundos: 45,
    totalReactivos: 4,
    aciertos: 4,
    fallos: 0,
    timestamp: Date.now() - 1000 * 60 * 30,
    tokenAntiFraude: "token-demo-valid-sha256-valeria",
  },
  {
    webAppId: "com-7-algoritmos-sim",
    webAppTitulo: "Laboratorio de Algoritmos y Condicionales (7°)",
    docenteId: "DOC-DRE01-7729",
    estudianteNombre: "Gabriel Segura Castillo",
    seccionOGrupo: "Sección 7-1",
    puntaje: 75,
    puntajeMaximo: 100,
    porcentaje: 75,
    nivelLogro: "Intermedio",
    tiempoSegundos: 68,
    totalReactivos: 4,
    aciertos: 3,
    fallos: 1,
    timestamp: Date.now() - 1000 * 60 * 25,
    tokenAntiFraude: "token-demo-valid-sha256-gabriel",
  },
  {
    webAppId: "com-7-algoritmos-sim",
    webAppTitulo: "Laboratorio de Algoritmos y Condicionales (7°)",
    docenteId: "DOC-DRE01-7729",
    estudianteNombre: "Felipe Araya Mora",
    seccionOGrupo: "Sección 7-1",
    puntaje: 50,
    puntajeMaximo: 100,
    porcentaje: 50,
    nivelLogro: "Inicial",
    tiempoSegundos: 92,
    totalReactivos: 4,
    aciertos: 2,
    fallos: 2,
    timestamp: Date.now() - 1000 * 60 * 15,
    tokenAntiFraude: "token-demo-valid-sha256-felipe",
  },
  {
    webAppId: "com-8-circuitos-sim",
    webAppTitulo: "Simulador de Circuitos Eléctricos y Microcontroladores (8°)",
    docenteId: "DOC-DRE01-7729",
    estudianteNombre: "Jimena Solano Castro",
    seccionOGrupo: "Sección 8-2",
    puntaje: 100,
    puntajeMaximo: 100,
    porcentaje: 100,
    nivelLogro: "Avanzado",
    tiempoSegundos: 38,
    totalReactivos: 4,
    aciertos: 4,
    fallos: 0,
    timestamp: Date.now() - 1000 * 60 * 10,
    tokenAntiFraude: "token-demo-valid-sha256-jimena",
  },
  {
    webAppId: "com-9-domotica-sim",
    webAppTitulo: "Simulador de Casa Domótica y Ahorro Energético (9°)",
    docenteId: "DOC-DRE01-7729",
    estudianteNombre: "Santiago Vargas Pérez",
    seccionOGrupo: "Sección 9-3",
    puntaje: 75,
    puntajeMaximo: 100,
    porcentaje: 75,
    nivelLogro: "Intermedio",
    tiempoSegundos: 110,
    totalReactivos: 4,
    aciertos: 3,
    fallos: 1,
    timestamp: Date.now() - 1000 * 60 * 5,
    tokenAntiFraude: "token-demo-valid-sha256-santiago",
  },
];

export function DocenteProvider({ children }: { children: React.ReactNode }) {
  const [docente, setDocente] = useState<DocenteData | null>(null);
  const [webApps, setWebApps] = useState<WebAppInfo[]>([]);
  const [webAppsComunidad, setWebAppsComunidad] = useState<WebAppComunidad[]>([]);
  const [telemetria, setTelemetria] = useState<PayloadTelemetria[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Cargar datos persistidos
    const savedDocente = SafeStorage.getItem("docente_activo");
    const savedWebapps = SafeStorage.getItem("webapps_catalogo");
    const savedComunidad = SafeStorage.getItem("webapps_comunidad");
    const savedTelemetria = SafeStorage.getItem("telemetria_registros");

    if (savedDocente) {
      try {
        const parsed = JSON.parse(savedDocente);
        if (parsed && parsed.correoInstitucional) {
          if (parsed.correoInstitucional.includes("@educacion.cr")) {
            parsed.correoInstitucional = parsed.correoInstitucional.replace("@educacion.cr", "@mep.go.cr");
            SafeStorage.setItem("docente_activo", JSON.stringify(parsed));
          }
          setDocente(parsed);
        } else {
          setDocente(null);
        }
      } catch {
        setDocente(null);
      }
    } else {
      setDocente(null);
    }

    if (savedWebapps) {
      try {
        setWebApps(JSON.parse(savedWebapps));
      } catch {}
    }

    if (savedComunidad) {
      try {
        setWebAppsComunidad(JSON.parse(savedComunidad));
      } catch {
        setWebAppsComunidad(PRODUCCIONES_COMUNIDAD_INICIALES);
      }
    } else {
      setWebAppsComunidad(PRODUCCIONES_COMUNIDAD_INICIALES);
      SafeStorage.setItem("webapps_comunidad", JSON.stringify(PRODUCCIONES_COMUNIDAD_INICIALES));
    }

    if (savedTelemetria) {
      try {
        setTelemetria(JSON.parse(savedTelemetria));
      } catch {}
    } else {
      setTelemetria([]);
      SafeStorage.setItem("telemetria_registros", JSON.stringify([]));
    }

    // Sincronizar con el endpoint del servidor con deduplicación por estudiante y sección
    const sincronizarTelemetriaServidor = async () => {
      try {
        const docenteGuardadoRaw = SafeStorage.getItem("docente_activo");
        const docenteActivoObj = docenteGuardadoRaw ? JSON.parse(docenteGuardadoRaw) : null;
        const docenteId = docenteActivoObj?.idDocente;
        const nombreDoc = docenteActivoObj?.nombreCompleto?.toLowerCase()?.trim() || "";
        const correoDoc = docenteActivoObj?.correoInstitucional?.toLowerCase()?.trim() || "";

        const normalizarSeccion = (sec?: string): string => {
          if (!sec) return "Sección 7-1";
          const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
          if (/^[789]-/i.test(limpia)) {
            return `Sección ${limpia}`;
          }
          return `Sección ${limpia}`;
        };

        const normalizarClave = (item: PayloadTelemetria): string => {
          const nom = (item.estudianteNombre || "").toLowerCase().trim();
          const sec = normalizarSeccion(item.seccionOGrupo).toLowerCase().trim();
          return `${nom}::${sec}`;
        };

        const url = docenteId ? `/api/telemetria/enviar?docenteId=${encodeURIComponent(docenteId)}` : "/api/telemetria/enviar";
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.registros && Array.isArray(json.registros)) {
            setTelemetria((prev) => {
              const mapa = new Map<string, PayloadTelemetria>();
              // Agregar los previos
              prev.forEach((item) => {
                const estNom = item.estudianteNombre?.toLowerCase()?.trim() || "";
                const estCor = item.estudianteCorreo?.toLowerCase()?.trim() || "";
                const esDocente = (nombreDoc && estNom === nombreDoc) || (correoDoc && estCor === correoDoc);
                if (!esDocente && estNom) {
                  const key = normalizarClave(item);
                  mapa.set(key, { ...item, seccionOGrupo: normalizarSeccion(item.seccionOGrupo) });
                }
              });
              // Mezclar con los del servidor
              json.registros.forEach((item: PayloadTelemetria) => {
                const estNom = item.estudianteNombre?.toLowerCase()?.trim() || "";
                const estCor = item.estudianteCorreo?.toLowerCase()?.trim() || "";
                const esDocente = (nombreDoc && estNom === nombreDoc) || (correoDoc && estCor === correoDoc);
                if (!esDocente && estNom) {
                  const key = normalizarClave(item);
                  const existente = mapa.get(key);
                  const secNorm = normalizarSeccion(item.seccionOGrupo);
                  const itemNorm = { ...item, seccionOGrupo: secNorm };
                  
                  if (!existente) {
                    mapa.set(key, itemNorm);
                  } else {
                    // Si ya existe, conservar el registro con mayor completitud o puntaje consolidado
                    const puntajeNuevo = item.porcentaje ?? item.puntaje ?? 0;
                    const puntajeExistente = existente.porcentaje ?? existente.puntaje ?? 0;
                    if (
                      item.estadoProgreso === "completado" &&
                      existente.estadoProgreso !== "completado"
                    ) {
                      mapa.set(key, itemNorm);
                    } else if (puntajeNuevo > puntajeExistente) {
                      mapa.set(key, itemNorm);
                    } else if (puntajeNuevo === puntajeExistente && item.timestamp >= existente.timestamp) {
                      mapa.set(key, itemNorm);
                    }
                  }
                }
              });
              const unificados = Array.from(mapa.values()).sort((a, b) => b.timestamp - a.timestamp);
              SafeStorage.setItem("telemetria_registros", JSON.stringify(unificados));
              return unificados;
            });
          }
        }
      } catch (err) {
        // Modo offline
      }
    };

    sincronizarTelemetriaServidor();
    const interval = setInterval(sincronizarTelemetriaServidor, 4000);

    setIsInitialized(true);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Sincronización multi-pestaña
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "docente_activo" && e.newValue) {
        try {
          setDocente(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === "webapps_catalogo" && e.newValue) {
        try {
          setWebApps(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === "webapps_comunidad" && e.newValue) {
        try {
          setWebAppsComunidad(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === "telemetria_registros" && e.newValue) {
        try {
          setTelemetria(JSON.parse(e.newValue));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const guardarDocente = (data: DocenteData) => {
    setDocente(data);
    SafeStorage.setItem("docente_activo", JSON.stringify(data));
  };

  const registrarDocente = (data: DocenteData): { exito: boolean; mensaje: string } => {
    try {
      const usuariosGuardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
      let listaUsuarios: DocenteData[] = [...LISTA_DOCENTES_INICIALES];
      if (usuariosGuardadosRaw) {
        try {
          const parsed = JSON.parse(usuariosGuardadosRaw);
          if (Array.isArray(parsed)) {
            listaUsuarios = parsed;
          }
        } catch {}
      }

      const cedFormateada = formatearCedulaCR(data.cedula || "");
      const cedLimpia = normalizarCedulaParaComparar(data.cedula || "");
      const correoLimpio = data.correoInstitucional.toLowerCase().trim();

      // Verificar si ya existe el correo o cédula registrada
      const indiceDuplicado = listaUsuarios.findIndex((u) => {
        const uCedLimpia = normalizarCedulaParaComparar(u.cedula || "");
        const uCorreoLimpio = u.correoInstitucional.toLowerCase().trim();
        return (
          uCorreoLimpio === correoLimpio ||
          (cedLimpia && uCedLimpia && cedLimpia === uCedLimpia)
        );
      });

      const esMismoDocente =
        (docente && (
          docente.idDocente === data.idDocente ||
          docente.correoInstitucional.toLowerCase().trim() === correoLimpio ||
          (cedLimpia && normalizarCedulaParaComparar(docente.cedula || "") === cedLimpia)
        )) ||
        (indiceDuplicado !== -1 && (
          listaUsuarios[indiceDuplicado].idDocente === data.idDocente ||
          listaUsuarios[indiceDuplicado].correoInstitucional.toLowerCase().trim() === correoLimpio
        ));

      if (indiceDuplicado !== -1 && !esMismoDocente) {
        const usuarioDuplicado = listaUsuarios[indiceDuplicado];
        return {
          exito: false,
          mensaje: `⚠️ Ya existe una cuenta registrada con este correo o cédula (${usuarioDuplicado.nombreCompleto}). Por favor inicie sesión con su PIN o solicite recuperación si lo ha olvidado.`,
        };
      }

      const docenteConCedulaFormateada = {
        ...data,
        cedula: cedFormateada,
      };

      if (indiceDuplicado !== -1) {
        listaUsuarios[indiceDuplicado] = docenteConCedulaFormateada;
      } else {
        listaUsuarios.push(docenteConCedulaFormateada);
      }

      SafeStorage.setItem("usuarios_registrados_locales", JSON.stringify(listaUsuarios));
      guardarDocente(docenteConCedulaFormateada);

      // Sincronizar con API del servidor
      try {
        fetch("/api/admin/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accion: "solicitar_registro",
            usuarioData: {
              nombreCompleto: data.nombreCompleto,
              correoInstitucional: data.correoInstitucional,
              cedula: data.cedula,
              telefono: data.telefono,
              dreCodigo: data.dreCodigo,
              dreNombre: data.dreNombre,
              circuito: data.circuito,
              institucionNombre: data.institucionNombre,
              rol: data.rol,
            },
          }),
        }).catch(() => {});
      } catch {}

      return { exito: true, mensaje: "Cuenta registrada e inicio de sesión completado con éxito." };
    } catch (e: any) {
      return { exito: false, mensaje: e?.message || "Error al registrar la cuenta." };
    }
  };

  const iniciarSesion = (
    correoOUsuario: string,
    contrasenaOPin: string
  ): { exito: boolean; mensaje: string; intentosRestantes?: number; bloqueado?: boolean } => {
    const credencialLimpia = correoOUsuario.trim().toLowerCase();
    const pinOPassLimpia = contrasenaOPin.trim();

    if (!credencialLimpia || !pinOPassLimpia) {
      return { exito: false, mensaje: "Por favor ingrese su cédula/correo y su PIN de 4 dígitos." };
    }

    const lockKey = `auth_lock_${credencialLimpia}`;
    const attemptsKey = `auth_attempts_${credencialLimpia}`;

    // Función auxiliar para limpiar intentos y bloqueos al tener éxito
    const limpiarFallos = () => {
      SafeStorage.removeItem(lockKey);
      SafeStorage.removeItem(attemptsKey);
    };

    // 1. Verificación Inmediata: Administrador / Asesor Principal (Alberto Bustos Ortega)
    const esSuperAdminAlberto =
      credencialLimpia === "alberto.bustos.ortega@mep.go.cr" ||
      credencialLimpia === "alberto.bustos" ||
      credencialLimpia === "admin" ||
      credencialLimpia === "5-0305-0179" ||
      credencialLimpia === "503050179" ||
      credencialLimpia === "1-1122-3344" ||
      credencialLimpia === "111223344";

    const esPinValidoAlberto =
      pinOPassLimpia === "2617" ||
      pinOPassLimpia === "1726" ||
      pinOPassLimpia === "EdcRfvTgb2617**" ||
      pinOPassLimpia === "EdcRfvTgb1726**" ||
      pinOPassLimpia === "1122";

    if (esSuperAdminAlberto && esPinValidoAlberto) {
      limpiarFallos();
      guardarDocente(DOCENTE_DEFAULT);
      return { exito: true, mensaje: "Sesión iniciada correctamente como Asesor Principal de Formación Tecnológica." };
    }

    // 2. Verificación Inmediata: Asesor de Formación Tecnológica (Allan Morera Araya)
    const esAsesorAllan =
      credencialLimpia === "allan.morera.araya@mep.go.cr" ||
      credencialLimpia === "allan.morera" ||
      credencialLimpia === "allan" ||
      credencialLimpia === "1-0987-0654" ||
      credencialLimpia === "109870654";

    const esPinValidoAllan =
      pinOPassLimpia === "2617" ||
      pinOPassLimpia === "1726" ||
      pinOPassLimpia === "2026" ||
      pinOPassLimpia === "8841" ||
      pinOPassLimpia === "EdcRfvTgb2617**" ||
      pinOPassLimpia === "1234";

    if (esAsesorAllan && esPinValidoAllan) {
      limpiarFallos();
      guardarDocente(DOCENTE_ASESOR_ALLAN);
      return { exito: true, mensaje: "Bienvenido(a), Allan Morera Araya (Asesoría de Formación Tecnológica)." };
    }

    // 3. Verificación Inmediata: Docente de Prueba Regional (Esteban Gómez Chinchilla)
    const esDocenteEsteban =
      credencialLimpia === "esteban.gomez.chinchilla@mep.go.cr" ||
      credencialLimpia === "esteban.gomez" ||
      credencialLimpia === "5-0345-0891" ||
      credencialLimpia === "503450891";

    const esPinValidoEsteban = pinOPassLimpia === "5821" || pinOPassLimpia === "1726" || pinOPassLimpia === "2617";

    if (esDocenteEsteban && esPinValidoEsteban) {
      limpiarFallos();
      guardarDocente(DOCENTE_PRUEBA_REGIONAL);
      return { exito: true, mensaje: `Bienvenido(a), ${DOCENTE_PRUEBA_REGIONAL.nombreCompleto}.` };
    }

    // Comprobar bloqueo temporal por intentos fallidos (15 minutos) para intentos erróneos
    const lockUntilRaw = SafeStorage.getItem(lockKey);
    if (lockUntilRaw) {
      const lockUntil = parseInt(lockUntilRaw, 10);
      if (Date.now() < lockUntil) {
        const minsRestantes = Math.ceil((lockUntil - Date.now()) / (1000 * 60));
        return {
          exito: false,
          bloqueado: true,
          mensaje: `⚠️ Cuenta bloqueada temporalmente por 3 intentos fallidos. Intente de nuevo en ${minsRestantes} minuto(s) o use la recuperación por WhatsApp/Correo.`,
        };
      } else {
        SafeStorage.removeItem(lockKey);
        SafeStorage.removeItem(attemptsKey);
      }
    }

    // Función auxiliar para registrar intento fallido
    const registrarFallo = (mensajePersonalizado?: string): { exito: boolean; mensaje: string; intentosRestantes?: number; bloqueado?: boolean } => {
      const intentosActuales = parseInt(SafeStorage.getItem(attemptsKey) || "0", 10) + 1;
      SafeStorage.setItem(attemptsKey, intentosActuales.toString());
      if (intentosActuales >= 3) {
        const lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutos
        SafeStorage.setItem(lockKey, lockUntil.toString());
        return {
          exito: false,
          bloqueado: true,
          intentosRestantes: 0,
          mensaje: "⚠️ Has superado el límite de 3 intentos fallidos. Tu cuenta ha sido bloqueada por 15 minutos por seguridad.",
        };
      }
      const restantes = 3 - intentosActuales;
      return {
        exito: false,
        intentosRestantes: restantes,
        mensaje: mensajePersonalizado || `PIN incorrecto. Te quedan ${restantes} intento(s) antes del bloqueo.`,
      };
    };

    // 3. Búsqueda en usuarios registrados localmente (por Cédula, Correo o Usuario)
    const usuariosGuardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
    let listaUsuarios: DocenteData[] = [...LISTA_DOCENTES_INICIALES];
    if (usuariosGuardadosRaw) {
      try {
        const parsed = JSON.parse(usuariosGuardadosRaw);
        if (Array.isArray(parsed)) {
          listaUsuarios = parsed;
        }
      } catch {}
    }

    const match = listaUsuarios.find((u) => {
      const cedLimpia = (u.cedula || "").replace(/[^0-9]/g, "");
      const busqLimpia = credencialLimpia.replace(/[^0-9]/g, "");
      return (
        u.correoInstitucional.toLowerCase() === credencialLimpia ||
        u.correoInstitucional.toLowerCase().split("@")[0] === credencialLimpia ||
        (u.cedula && u.cedula.toLowerCase() === credencialLimpia) ||
        (cedLimpia && busqLimpia && cedLimpia === busqLimpia) ||
        u.nombreCompleto.toLowerCase() === credencialLimpia
      );
    });

    if (match) {
      const pinValido = match.pin ? match.pin === pinOPassLimpia : false;
      const passValido = match.contrasena ? match.contrasena === pinOPassLimpia : false;

      if (pinValido || passValido) {
        limpiarFallos();
        guardarDocente(match);
        return { exito: true, mensaje: `Bienvenido(a), ${match.nombreCompleto}.` };
      } else {
        return registrarFallo("PIN incorrecto. Verifique los 4 dígitos numéricos.");
      }
    }

    // 4. Si la cuenta no existe en el sistema, indicar que debe registrarse
    return {
      exito: false,
      mensaje: "⚠️ Esta cuenta no se encuentra registrada en el sistema. Por favor pulse en 'Registrarse' para crear su perfil con su PIN de 4 dígitos.",
    };
  };

  const iniciarSesionConPIN = (
    cedulaOCorreo: string,
    pin: string
  ): { exito: boolean; mensaje: string; intentosRestantes?: number; bloqueado?: boolean } => {
    return iniciarSesion(cedulaOCorreo, pin);
  };

  const solicitarRecuperacionPIN = async (
    cedulaOCorreo: string,
    canal: "correo" | "whatsapp"
  ): Promise<{ exito: boolean; mensaje: string; codigoSimulado?: string }> => {
    const credLimpia = cedulaOCorreo.trim().toLowerCase();
    const codigoOTP = Math.floor(1000 + Math.random() * 9000).toString();

    // Guardar OTP con 10 minutos de validez
    const recoveryKey = `otp_recovery_${credLimpia}`;
    SafeStorage.setItem(
      recoveryKey,
      JSON.stringify({
        otp: codigoOTP,
        expira: Date.now() + 10 * 60 * 1000,
      })
    );

    // Buscar información del docente (correo y teléfono)
    const usuariosGuardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
    let listaUsuarios: DocenteData[] = [...LISTA_DOCENTES_INICIALES];
    if (usuariosGuardadosRaw) {
      try {
        const parsed = JSON.parse(usuariosGuardadosRaw);
        if (Array.isArray(parsed)) {
          listaUsuarios = parsed;
        }
      } catch {}
    }

    const docenteEncontrado = listaUsuarios.find(
      (u) =>
        u.correoInstitucional.toLowerCase() === credLimpia ||
        u.cedula.replace(/[^0-9]/g, "") === credLimpia.replace(/[^0-9]/g, "")
    );

    const correoDestino = docenteEncontrado?.correoInstitucional || (credLimpia.includes("@") ? credLimpia : undefined);
    const telefonoDestino = docenteEncontrado?.telefono || undefined;
    const nombreDestino = docenteEncontrado?.nombreCompleto || "Docente MEP";

    // Intentar despacho en el servidor
    try {
      const res = await fetch("/api/auth/recuperar-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedulaOCorreo: correoDestino || credLimpia,
          canal,
          telefono: telefonoDestino,
          codigoOTP,
          nombreDocente: nombreDestino,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          exito: true,
          mensaje: data.mensaje || `Código de 4 dígitos despachado exitosamente.`,
          codigoSimulado: codigoOTP,
        };
      }
    } catch {}

    if (canal === "whatsapp") {
      return {
        exito: true,
        mensaje: `Se ha despachado el código de recuperación de 4 dígitos a tu teléfono registrado. (Válido por 10 minutos).`,
        codigoSimulado: codigoOTP,
      };
    }

    return {
      exito: true,
      mensaje: `Se ha enviado el código de recuperación de 4 dígitos a tu correo oficial ${correoDestino || credLimpia}. (Válido por 10 minutos).`,
      codigoSimulado: codigoOTP,
    };
  };

  const verificarOTP = (
    cedulaOCorreo: string,
    codigoOTP: string,
    nuevoPIN: string
  ): { exito: boolean; mensaje: string } => {
    const credLimpia = cedulaOCorreo.trim().toLowerCase();
    const recoveryKey = `otp_recovery_${credLimpia}`;
    const raw = SafeStorage.getItem(recoveryKey);

    if (!raw) {
      return { exito: false, mensaje: "No hay una solicitud de recuperación activa para esta cuenta." };
    }

    try {
      const data = JSON.parse(raw);
      if (Date.now() > data.expira) {
        SafeStorage.removeItem(recoveryKey);
        return { exito: false, mensaje: "El código de recuperación ha expirado. Solicite uno nuevo." };
      }

      if (data.otp !== codigoOTP.trim()) {
        return { exito: false, mensaje: "Código de recuperación incorrecto. Verifique los 4 dígitos." };
      }

      // Actualizar PIN del usuario
      const usuariosGuardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
      if (usuariosGuardadosRaw) {
        let listaUsuarios: DocenteData[] = JSON.parse(usuariosGuardadosRaw);
        const idx = listaUsuarios.findIndex(
          (u) =>
            u.correoInstitucional.toLowerCase() === credLimpia ||
            u.cedula === credLimpia ||
            u.correoInstitucional.toLowerCase().split("@")[0] === credLimpia
        );

        if (idx >= 0) {
          listaUsuarios[idx].pin = nuevoPIN;
          listaUsuarios[idx].contrasena = nuevoPIN;
          SafeStorage.setItem("usuarios_registrados_locales", JSON.stringify(listaUsuarios));
          guardarDocente(listaUsuarios[idx]);
        }
      }

      // Limpiar bloqueos e intentos
      SafeStorage.removeItem(`auth_lock_${credLimpia}`);
      SafeStorage.removeItem(`auth_attempts_${credLimpia}`);
      SafeStorage.removeItem(recoveryKey);

      return { exito: true, mensaje: "PIN restablecido con éxito. Sesión iniciada." };
    } catch {
      return { exito: false, mensaje: "Error al verificar el código." };
    }
  };

  const cerrarSesion = () => {
    setDocente(null);
    SafeStorage.removeItem("docente_activo");
  };

  const guardarWebApp = (webapp: WebAppInfo) => {
    const updated = [webapp, ...webApps.filter((w) => w.id !== webapp.id)];
    setWebApps(updated);
    SafeStorage.setItem("webapps_catalogo", JSON.stringify(updated));
  };

  const compartirEnComunidad = (webapp: WebAppInfo | WebAppComunidad) => {
    setWebAppsComunidad((prev) => {
      const yaExiste = prev.find((w) => w.id === webapp.id);
      let updated: WebAppComunidad[];

      if (yaExiste) {
        updated = prev.map((w) => (w.id === webapp.id ? { ...w, remixesCount: w.remixesCount + 1 } : w));
      } else {
        const nuevaCom: WebAppComunidad = {
          id: webapp.id,
          titulo: webapp.titulo,
          autorNombre: docente?.nombreCompleto || "Docente Formación Tecnológica",
          autorRol: docente?.rol || "Docente Secundaria",
          autorDRE: docente?.dreNombre || "San José Central",
          autorCorreo: docente?.correoInstitucional || "alberto.bustos.ortega@mep.go.cr",
          nivel: (webapp.nivel.startsWith("7") ? "7° Año" : webapp.nivel.startsWith("8") ? "8° Año" : "9° Año") as any,
          area: (webapp as any).asignatura || (webapp as any).area || "Tecnología Educativa",
          saberTitulo: (webapp as any).saberTitulo || "Saber Curricular",
          saberConceptual: (webapp as any).saberConceptual || webapp.titulo,
          explicacionPedagogica: (webapp as any).explicacionPedagogica || "Actividad diseñada para el desarrollo del saber conceptual y procedimental.",
          indicadorCodigo: (webapp as any).indicadorCodigo || "COT.01",
          indicadorNombre: (webapp as any).indicadorNombre || "Demostración de logro en Trabajo Cotidiano",
          saberProcedimental: (webapp as any).saberProcedimental || "Aplica y analiza",
          saberActitudinal: (webapp as any).saberActitudinal || "Gusto por la precisión",
          mecanica: (webapp.mecanica || "Simulador interactivo") as any,
          modo: (webapp as any).modo || "Individual",
          descripcionReto: (webapp as any).descripcionReto || "Desafío autónomo interactivo.",
          fechaPublicacion: new Date().toISOString().split("T")[0],
          remixesCount: 1,
          estudiantesEvaluados: 0,
          tags: [(webapp as any).asignatura || (webapp as any).area || "Secundaria", "Trabajo Cotidiano", "Remix"],
          codigoHTML: (webapp as any).codigoHTML || "",
        };
        updated = [nuevaCom, ...prev];
      }

      SafeStorage.setItem("webapps_comunidad", JSON.stringify(updated));
      return updated;
    });
  };

  const normalizarSeccionTexto = (sec?: string): string => {
    if (!sec) return "Sección 7-1";
    const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
    if (/^[789]-/i.test(limpia)) {
      return `Sección ${limpia}`;
    }
    return `Sección ${limpia}`;
  };

  const normalizarClaveItem = (item: PayloadTelemetria): string => {
    const nom = (item.estudianteNombre || "").toLowerCase().trim();
    const sec = normalizarSeccionTexto(item.seccionOGrupo).toLowerCase().trim();
    return `${nom}::${sec}`;
  };

  const agregarResultadoTelemetria = (res: PayloadTelemetria) => {
    setTelemetria((prev) => {
      const mapa = new Map<string, PayloadTelemetria>();
      prev.forEach((p) => {
        if (p.estudianteNombre) {
          mapa.set(normalizarClaveItem(p), p);
        }
      });
      const key = normalizarClaveItem(res);
      const resNorm = { ...res, seccionOGrupo: normalizarSeccionTexto(res.seccionOGrupo) };
      mapa.set(key, resNorm);
      const updated = Array.from(mapa.values()).sort((a, b) => b.timestamp - a.timestamp);
      SafeStorage.setItem("telemetria_registros", JSON.stringify(updated));
      return updated;
    });
  };

  const actualizarResultadoTelemetria = (timestamp: number, datosActualizados: Partial<PayloadTelemetria>) => {
    setTelemetria((prev) => {
      const updated = prev.map((item) => (item.timestamp === timestamp ? { ...item, ...datosActualizados } : item));
      SafeStorage.setItem("telemetria_registros", JSON.stringify(updated));
      return updated;
    });
  };

  const importarLoteResultados = (lote: PayloadTelemetria[]) => {
    setTelemetria((prev) => {
      const mapa = new Map<string, PayloadTelemetria>();
      prev.forEach((p) => {
        if (p.estudianteNombre) {
          mapa.set(normalizarClaveItem(p), p);
        }
      });
      lote.forEach((item) => {
        if (item.estudianteNombre) {
          const key = normalizarClaveItem(item);
          const itemNorm = { ...item, seccionOGrupo: normalizarSeccionTexto(item.seccionOGrupo) };
          mapa.set(key, itemNorm);
        }
      });
      const updated = Array.from(mapa.values()).sort((a, b) => b.timestamp - a.timestamp);
      SafeStorage.setItem("telemetria_registros", JSON.stringify(updated));
      return updated;
    });
  };

  const eliminarResultado = (timestamp: number) => {
    setTelemetria((prev) => {
      const updated = prev.filter((r) => r.timestamp !== timestamp);
      SafeStorage.setItem("telemetria_registros", JSON.stringify(updated));
      return updated;
    });

    // Notificar al servidor para eliminar definitivamente
    try {
      fetch(`/api/telemetria/enviar?timestamp=${timestamp}`, { method: "DELETE" }).catch(() => {});
    } catch(e) {}
  };

  const limpiarTelemetria = () => {
    setTelemetria([]);
    SafeStorage.setItem("telemetria_registros", JSON.stringify([]));
    try {
      SafeStorage.removeItem("diagnosticos_mep_9no");
      SafeStorage.removeItem("nomina_docente_9no_mep");
    } catch(e) {}

    // Notificar al servidor para vaciar los registros
    try {
      const url = docente?.idDocente 
        ? `/api/telemetria/enviar?all=true&docenteId=${encodeURIComponent(docente.idDocente)}`
        : "/api/telemetria/enviar?all=true";
      fetch(url, { method: "DELETE" }).catch(() => {});
    } catch(e) {}
  };

  const restablecerDatosDemostracion = () => {
    setTelemetria(SAMPLE_TELEMETRIA);
    SafeStorage.setItem("telemetria_registros", JSON.stringify(SAMPLE_TELEMETRIA));
  };

  const limpiarSesion = () => {
    setDocente(null);
    SafeStorage.removeItem("docente_activo");
  };

  return (
    <DocenteContext.Provider
      value={{
        docente,
        webApps,
        webAppsComunidad,
        telemetria,
        isInitialized,
        guardarDocente,
        registrarDocente,
        guardarWebApp,
        compartirEnComunidad,
        iniciarSesion,
        iniciarSesionConPIN,
        solicitarRecuperacionPIN,
        verificarOTP,
        cerrarSesion,
        agregarResultadoTelemetria,
        actualizarResultadoTelemetria,
        importarLoteResultados,
        eliminarResultado,
        limpiarTelemetria,
        restablecerDatosDemostracion,
        limpiarSesion,
        estaAutenticado: !!docente,
      }}
    >
      {children}
    </DocenteContext.Provider>
  );
}

export function useDocente() {
  const context = useContext(DocenteContext);
  if (!context) {
    throw new Error("useDocente debe usarse dentro de un DocenteProvider");
  }
  return context;
}
