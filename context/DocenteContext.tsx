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
  eliminarResultado: (identificador: number | string) => void;
  limpiarTelemetria: () => void;
  restablecerDatosDemostracion: () => void;
  limpiarSesion: () => void;
  estaAutenticado: boolean;
}

const DocenteContext = createContext<DocenteContextType | undefined>(undefined);

export const DOCENTE_DEFAULT: DocenteData = {
  idDocente: "5-0305-0179",
  nombreCompleto: "Prof. Alberto Bustos Ortega",
  correoInstitucional: "alberto.bustos.ortega@mep.go.cr",
  pin: "2617",
  contrasena: "2617",
  cedula: "5-0305-0179",
  telefono: "+506 8888-9999",
  tipoRol: "Docente",
  dreCodigo: "DRE-01",
  dreNombre: "DRE-01 - San José Central",
  circuito: "Circuito 01",
  codigoPresupuestario: "MEP-LCR-2027",
  institucionNombre: "Liceo de Costa Rica",
  rol: "Docente Evaluador de Formación Tecnológica",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  fechaRegistro: new Date().toISOString(),
  centrosEducativos: [
    {
      id: "CENTRO-01",
      nombre: "Liceo de Costa Rica",
      dreCodigo: "DRE-01",
      dreNombre: "DRE-01 - San José Central",
      circuito: "Circuito 01",
      codigoPresupuestario: "MEP-LCR-2027",
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
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["9-1", "9-2", "9-3"],
        },
      ],
    },
  ],
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
  codigoPresupuestario: "SABER-LIBERIA-2027",
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
      codigoPresupuestario: "SABER-LIBERIA-2027",
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
  cedula: "2-0481-0073",
  telefono: "+506 8888-7777",
  pin: "7319",
  contrasena: "7319",
  tipoRol: "Asesor Nacional",
  dreCodigo: "DRE-NACIONAL",
  dreNombre: "Asesoría de Formación Tecnológica",
  circuito: "Nivel Nacional / Ámbito General",
  codigoPresupuestario: "FT-NACIONAL-2027",
  institucionNombre: "Asesoría Nacional de Formación Tecnológica (III Ciclo)",
  rol: "Asesor de Formación Tecnológica (III Ciclo)",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  fechaRegistro: new Date().toISOString(),
};

export const DOCENTE_PRUEBA_1: DocenteData = {
  idDocente: "DOC-PRUEBA-001",
  nombreCompleto: "PruebaDocente1",
  correoInstitucional: "pruebadocente1@mep.go.cr",
  pin: "1111",
  contrasena: "1111",
  cedula: "0-0000-0001",
  telefono: "+506 8888-0001",
  tipoRol: "Docente",
  dreCodigo: "DRE-01",
  dreNombre: "San José Central",
  circuito: "Circuito 01",
  codigoPresupuestario: "MEP-P1-2027",
  institucionNombre: "Liceo de Costa Rica / Colegio Superior de Señoritas / Liceo Rodrigo Facio Brenes",
  rol: "Docente de Formación Tecnológica",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  fechaRegistro: new Date().toISOString(),
  centrosEducativos: [
    {
      id: "CENTRO-P1-01",
      nombre: "Liceo de Costa Rica",
      dreCodigo: "DRE-01",
      dreNombre: "San José Central",
      circuito: "Circuito 01",
      codigoPresupuestario: "MEP-LCR-2027",
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
          seccionesAtendidasDocente: ["8-1", "8-2"],
        },
        {
          nivel: "9°",
          activo: true,
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4"],
        },
      ],
    },
    {
      id: "CENTRO-P1-02",
      nombre: "Colegio Superior de Señoritas",
      dreCodigo: "DRE-01",
      dreNombre: "San José Central",
      circuito: "Circuito 02",
      codigoPresupuestario: "MEP-CSS-2027",
      desgloseNiveles: [
        {
          nivel: "7°",
          activo: true,
          totalSeccionesColegio: 5,
          seccionesAtendidasDocente: ["7-1", "7-2"],
        },
        {
          nivel: "8°",
          activo: true,
          totalSeccionesColegio: 5,
          seccionesAtendidasDocente: ["8-1", "8-2", "8-3"],
        },
        {
          nivel: "9°",
          activo: true,
          totalSeccionesColegio: 5,
          seccionesAtendidasDocente: ["9-1", "9-2"],
        },
      ],
    },
    {
      id: "CENTRO-P1-03",
      nombre: "Liceo Rodrigo Facio Brenes",
      dreCodigo: "DRE-01",
      dreNombre: "San José Central",
      circuito: "Circuito 03",
      codigoPresupuestario: "MEP-LRF-2027",
      desgloseNiveles: [
        {
          nivel: "7°",
          activo: true,
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["7-4", "7-5", "7-6"],
        },
        {
          nivel: "8°",
          activo: true,
          totalSeccionesColegio: 4,
          seccionesAtendidasDocente: ["8-3", "8-4"],
        },
        {
          nivel: "9°",
          activo: true,
          totalSeccionesColegio: 5,
          seccionesAtendidasDocente: ["9-4", "9-5"],
        },
      ],
    },
  ],
};

export const DOCENTE_PRUEBA_2: DocenteData = {
  idDocente: "DOC-PRUEBA-002",
  nombreCompleto: "PruebaDocente2",
  correoInstitucional: "pruebadocente2@mep.go.cr",
  pin: "2222",
  contrasena: "2222",
  cedula: "0-0000-0002",
  telefono: "+506 8888-0002",
  tipoRol: "Docente",
  dreCodigo: "DRE-04",
  dreNombre: "Alajuela",
  circuito: "Circuito 02",
  codigoPresupuestario: "MEP-P2-2027",
  institucionNombre: "Liceo Experimental Bilingüe de Alajuela / CTP de Heredia",
  rol: "Docente de Formación Tecnológica",
  asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
  fechaRegistro: new Date().toISOString(),
  centrosEducativos: [
    {
      id: "CENTRO-P2-01",
      nombre: "Liceo Experimental Bilingüe de Alajuela",
      dreCodigo: "DRE-04",
      dreNombre: "Alajuela",
      circuito: "Circuito 02",
      codigoPresupuestario: "MEP-LEBA-2027",
      desgloseNiveles: [
        {
          nivel: "7°",
          activo: true,
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["7-1", "7-2", "7-3", "7-4"],
        },
        {
          nivel: "8°",
          activo: true,
          totalSeccionesColegio: 5,
          seccionesAtendidasDocente: ["8-1", "8-2"],
        },
        {
          nivel: "9°",
          activo: true,
          totalSeccionesColegio: 6,
          seccionesAtendidasDocente: ["9-1", "9-2", "9-3"],
        },
      ],
    },
    {
      id: "CENTRO-P2-02",
      nombre: "Colegio Técnico Profesional de Heredia",
      dreCodigo: "DRE-05",
      dreNombre: "Heredia",
      circuito: "Circuito 01",
      codigoPresupuestario: "MEP-CTPH-2027",
      desgloseNiveles: [
        {
          nivel: "7°",
          activo: true,
          totalSeccionesColegio: 8,
          seccionesAtendidasDocente: ["7-1", "7-2", "7-3"],
        },
        {
          nivel: "8°",
          activo: true,
          totalSeccionesColegio: 8,
          seccionesAtendidasDocente: ["8-1", "8-2", "8-3", "8-4"],
        },
        {
          nivel: "9°",
          activo: true,
          totalSeccionesColegio: 10,
          seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4", "9-5"],
        },
      ],
    },
  ],
};

export const LISTA_DOCENTES_INICIALES: DocenteData[] = [
  DOCENTE_DEFAULT,
  DOCENTE_ASESOR_ALLAN,
  DOCENTE_PRUEBA_REGIONAL,
  DOCENTE_PRUEBA_1,
  DOCENTE_PRUEBA_2,
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

  const esUsuarioBloqueado = (nom?: string, cor?: string) => {
    const n = (nom || "").toLowerCase().trim();
    const c = (cor || "").toLowerCase().trim();
    return (
      n.includes("augrey") ||
      c.includes("augrey.bermudez") ||
      c.includes("augrey") ||
      n.includes("yo si jodo") ||
      n.includes("yosijodo")
    );
  };

  useEffect(() => {
    // Cargar datos persistidos
    const savedDocente = SafeStorage.getItem("docente_activo");
    const savedWebapps = SafeStorage.getItem("webapps_catalogo");
    const savedComunidad = SafeStorage.getItem("webapps_comunidad");
    const savedTelemetria = SafeStorage.getItem("telemetria_registros");

    // Limpieza defensiva de cuentas purgadas
    const guardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
    if (guardadosRaw) {
      try {
        const parsed = JSON.parse(guardadosRaw);
        if (Array.isArray(parsed)) {
          const limpios = parsed.filter(
            (u: any) => !esUsuarioBloqueado(u.nombreCompleto || u.nombre, u.correoInstitucional || u.correo)
          );
          SafeStorage.setItem("usuarios_registrados_locales", JSON.stringify(limpios));
        }
      } catch {}
    }

    if (savedDocente) {
      try {
        const parsed = JSON.parse(savedDocente);
        if (parsed && parsed.correoInstitucional) {
          if (esUsuarioBloqueado(parsed.nombreCompleto, parsed.correoInstitucional)) {
            SafeStorage.removeItem("docente_activo");
            if (typeof window !== "undefined") {
              localStorage.removeItem("docente_activo");
              localStorage.removeItem("MEP_DOCENTE_PERFIL_GLOBAL");
            }
            setDocente(null);
          } else {
            if (parsed.correoInstitucional.includes("@educacion.cr")) {
              parsed.correoInstitucional = parsed.correoInstitucional.replace("@educacion.cr", "@mep.go.cr");
              SafeStorage.setItem("docente_activo", JSON.stringify(parsed));
            }
            setDocente(parsed);
          }
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
        const parsedTele = JSON.parse(savedTelemetria);
        if (Array.isArray(parsedTele)) {
          const limpiosTele = parsedTele.filter(
            (t: any) =>
              !esUsuarioBloqueado(t.estudianteNombre, t.estudianteCorreo) &&
              !esUsuarioBloqueado(t.docenteNombre, t.docenteEmail)
          );
          // Deduplicación estricta al cargar: 1 único registro por estudiante y sección
          const mapa = new Map<string, PayloadTelemetria>();
          limpiosTele.forEach((item: any) => {
            const nom = (item.estudianteNombre || "").toLowerCase().trim();
            const sec = (item.seccionOGrupo || "").toLowerCase().trim();
            const clave = `${nom}::${sec}`;
            if (!mapa.has(clave)) {
              mapa.set(clave, item);
            } else {
              const exist = mapa.get(clave)!;
              if (item.estadoProgreso === "completado" && exist.estadoProgreso !== "completado") {
                mapa.set(clave, item);
              } else if ((item.timestamp || 0) >= (exist.timestamp || 0)) {
                mapa.set(clave, item);
              }
            }
          });
          const deduplicados = Array.from(mapa.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setTelemetria(deduplicados);
          SafeStorage.setItem("telemetria_registros", JSON.stringify(deduplicados));
        } else {
          setTelemetria([]);
        }
      } catch {
        setTelemetria([]);
      }
    } else {
      setTelemetria([]);
      SafeStorage.setItem("telemetria_registros", JSON.stringify([]));
    }

    // Sincronizar con el endpoint del servidor y llaves locales con deduplicación por estudiante y sección
    const sincronizarTelemetriaServidor = async () => {
      try {
        const docenteGuardadoRaw = SafeStorage.getItem("docente_activo");
        const docenteActivoObj = docenteGuardadoRaw ? JSON.parse(docenteGuardadoRaw) : null;
        const docenteId = docenteActivoObj?.idDocente || docenteActivoObj?.cedula;
        const cedulaDoc = docenteActivoObj?.cedula || "";
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

        // 1. Cargar evaluaciones locales de 7mo si existen y pertenecen al docente
        const evaluacionesLocales7mo: PayloadTelemetria[] = [];
        try {
          const cedClean = cedulaDoc.replace(/[^a-zA-Z0-9]/g, "");
          const raw7mo =
            (cedClean ? SafeStorage.getItem(`MEP_DOCENTE_7MO_EVALUATIONS_${cedClean}`) : null) ||
            SafeStorage.getItem("MEP_DOCENTE_7MO_EVALUATIONS");
          if (raw7mo) {
            const list7mo = JSON.parse(raw7mo);
            if (Array.isArray(list7mo)) {
              list7mo.forEach((ev: any) => {
                // Verificar pertenencia al docente
                const evDocId = (ev.docenteId || ev.raw?.docenteId || "").trim().toLowerCase();
                const evDocCed = (ev.docenteCedula || ev.raw?.docenteCedula || "").trim().toLowerCase();
                const evDocNom = (ev.docenteNombre || ev.raw?.docenteNombre || "").trim().toLowerCase();
                
                const pertenece =
                  !docenteId ||
                  evDocId === docenteId.toLowerCase() ||
                  (cedClean && evDocCed.replace(/\D/g, "") === cedClean) ||
                  (nombreDoc && evDocNom === nombreDoc) ||
                  Boolean(cedClean && SafeStorage.getItem(`MEP_DOCENTE_7MO_EVALUATIONS_${cedClean}`));

                if (!pertenece) return;

                const n1 = typeof ev.name1 === "object" ? ev.name1?.name || "Estudiante 1" : ev.name1 || "Estudiante 1";
                const n2 = typeof ev.name2 === "object" ? ev.name2?.name || "" : ev.name2 || "";
                const isIndiv = !n2 || n2 === "Individual" || n2 === "N/A" || n2 === "Sin Pareja";
                const estNombre = isIndiv ? n1 : `${n1} & ${n2}`;
                const sec = normalizarSeccion(ev.section);
                const score = ev.globalAvg ?? ev.porcentaje ?? ev.puntaje ?? 80;
                const rec: PayloadTelemetria = {
                  idResultado: ev.id || `eval-7mo-${Date.now()}`,
                  webAppId: "diagnostico_7mo_modulo01_cyberquest",
                  webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales",
                  docenteId: ev.docenteId || docenteId || "5-0305-0179",
                  docenteNombre: ev.docenteNombre || docenteActivoObj?.nombreCompleto || "Docente Evaluador",
                  institucionNombre: ev.raw?.institucionNombre || docenteActivoObj?.institucionNombre || "Centro Educativo MEP",
                  dreCodigo: ev.raw?.dreCodigo || docenteActivoObj?.dreCodigo || "DRE-01",
                  estudianteNombre: estNombre,
                  seccionOGrupo: sec,
                  nivel: "7°",
                  puntaje: score,
                  puntajeMaximo: 100,
                  porcentaje: score,
                  totalReactivos: 10,
                  aciertos: Math.round((score / 100) * 10),
                  fallos: Math.max(0, 10 - Math.round((score / 100) * 10)),
                  nivelLogro: ev.globalLevel === "A" || score >= 80 ? "Avanzado" : (ev.globalLevel === "C" || score <= 59 ? "Inicial" : "Intermedio"),
                  tiempoSegundos: 120,
                  estadoProgreso: "completado",
                  timestamp: ev.raw?.timestamp || Date.now(),
                  tokenAntiFraude: `TOKEN-7MO-${Date.now()}`,
                };
                evaluacionesLocales7mo.push(rec);
              });
            }
          }
        } catch (e) {}

        // 2. Cargar evaluaciones locales de 8vo si existen y pertenecen al docente
        const evaluacionesLocales8vo: PayloadTelemetria[] = [];
        try {
          const cedClean = cedulaDoc.replace(/[^a-zA-Z0-9]/g, "");
          const raw8vo =
            (cedClean ? SafeStorage.getItem(`MEP_DOCENTE_8VO_EVALUATIONS_${cedClean}`) : null) ||
            SafeStorage.getItem("MEP_DOCENTE_8VO_EVALUATIONS") ||
            SafeStorage.getItem("evaluacion_docente_8vo");
          if (raw8vo) {
            const list8vo = JSON.parse(raw8vo);
            if (Array.isArray(list8vo)) {
              list8vo.forEach((ev: any) => {
                const evDocId = (ev.docenteId || "").trim().toLowerCase();
                const evDocCed = (ev.docenteCedula || "").trim().toLowerCase();
                const evDocNom = (ev.docenteNombre || "").trim().toLowerCase();

                const pertenece =
                  !docenteId ||
                  evDocId === docenteId.toLowerCase() ||
                  (cedClean && evDocCed.replace(/\D/g, "") === cedClean) ||
                  (nombreDoc && evDocNom === nombreDoc) ||
                  Boolean(cedClean && SafeStorage.getItem(`MEP_DOCENTE_8VO_EVALUATIONS_${cedClean}`));

                if (!pertenece) return;

                const estNombre = ev.nombre || ev.estudianteNombre || "Estudiante 8°";
                const sec = normalizarSeccion(ev.seccion || ev.seccionOGrupo || "8-1");
                const puntos = ev.puntaje !== undefined && ev.puntaje <= 14 ? ev.puntaje : (ev.totalPuntos !== undefined && ev.totalPuntos <= 14 ? ev.totalPuntos : Math.round(((ev.porcentaje || 80) / 100) * 14));
                const score = ev.porcentaje ?? Math.round((puntos / 14) * 100);

                const sub1Val = ev.sub1 !== undefined ? ev.sub1 : (ev.subareasDetalle?.sub1_apropiacion ?? Math.min(5, Math.round((puntos / 14) * 5)));
                const sub2Val = ev.sub2 !== undefined ? ev.sub2 : (ev.subareasDetalle?.sub2_algoritmos ?? Math.min(7, Math.round((puntos / 14) * 7)));
                const sub3Val = ev.sub3 !== undefined ? ev.sub3 : (ev.subareasDetalle?.sub3_robotica ?? Math.min(2, Math.max(0, puntos - sub1Val - sub2Val)));

                const rec: PayloadTelemetria = {
                  idResultado: ev.id || `eval-8vo-${Date.now()}`,
                  webAppId: "diagnostico_8vo_modulo01_docente_evaluador",
                  webAppTitulo: "Evaluación Diagnóstica — 8° Año (PNFT)",
                  docenteId: ev.docenteId || docenteId || "5-0305-0179",
                  docenteNombre: ev.docenteNombre || docenteActivoObj?.nombreCompleto || "Docente Evaluador",
                  docenteCedula: ev.docenteCedula || cedulaDoc || docenteId || "5-0305-0179",
                  docenteEmail: ev.docenteEmail || correoDoc || "",
                  institucionNombre: ev.institucionNombre || docenteActivoObj?.institucionNombre || "Centro Educativo MEP",
                  dreCodigo: ev.dreCodigo || docenteActivoObj?.dreCodigo || "DRE-01",
                  estudianteNombre: estNombre,
                  estudianteCedula: ev.cedula || "—",
                  seccionOGrupo: sec,
                  nivel: "8°",
                  puntaje: puntos,
                  puntajeMaximo: 14,
                  porcentaje: score,
                  totalReactivos: 14,
                  aciertos: puntos,
                  fallos: Math.max(0, 14 - puntos),
                  nivelLogro: score >= 80 ? "Avanzado" : score <= 59 ? "Inicial" : "Intermedio",
                  subareasDetalle: {
                    sub1_apropiacion: sub1Val,
                    sub2_algoritmos: sub2Val,
                    sub3_robotica: sub3Val,
                  },
                  socioafectivo: ev.socioafectivo || { soc1: "Demostrado", soc2: "Demostrado", soc3: "Demostrado", soc4: "Demostrado" },
                  psicomotor: ev.psicomotor || { psi1: "Demostrado", psi2: "Demostrado", psi3: "Demostrado", psi4: "Demostrado" },
                  tiempoSegundos: 120,
                  estadoProgreso: "completado",
                  timestamp: ev.timestamp || Date.now(),
                  tokenAntiFraude: `TOKEN-8VO-${Date.now()}`,
                };
                evaluacionesLocales8vo.push(rec);
              });
            }
          }
        } catch (e) {}

        const queryParams = new URLSearchParams();
        if (docenteId) queryParams.set("docenteId", docenteId);
        if (cedulaDoc) queryParams.set("cedula", cedulaDoc);
        if (correoDoc) queryParams.set("correo", correoDoc);
        if (nombreDoc) queryParams.set("docenteNombre", nombreDoc);

        const url = `/api/telemetria/enviar?${queryParams.toString()}`;
        const res = await fetch(url);
        let remotos: PayloadTelemetria[] = [];
        if (res.ok) {
          const json = await res.json();
          if (json.registros && Array.isArray(json.registros)) {
            remotos = json.registros;
          }
        }

        setTelemetria((prev) => {
          const mapa = new Map<string, PayloadTelemetria>();
          // Agregar previos ÚNICAMENTE si pertenecen al docente autenticado
          const correoDocLimpio = (correoDoc || "").toLowerCase().trim();
          const esSuperAdmin = correoDocLimpio === "alberto.bustos.ortega@mep.go.cr";
          const esAsesorNacional = correoDocLimpio === "allan.morera.araya@mep.go.cr" || docenteActivoObj?.tipoRol === "Asesor Nacional";

          prev.forEach((item) => {
            const estNom = item.estudianteNombre?.toLowerCase()?.trim() || "";
            const estCor = item.estudianteCorreo?.toLowerCase()?.trim() || "";
            const esDocente = (nombreDoc && estNom === nombreDoc) || (correoDoc && estCor === correoDoc);

            if (!esDocente && estNom) {
              if (esSuperAdmin || esAsesorNacional) {
                const key = normalizarClave(item);
                mapa.set(key, { ...item, seccionOGrupo: normalizarSeccion(item.seccionOGrupo) });
              } else {
                const rDocId = (item.docenteId || "").trim().toLowerCase();
                const rDocCed = ((item as any).docenteCedula || "").trim().toLowerCase();
                const rDocEmail = ((item as any).docenteEmail || "").trim().toLowerCase();
                const rDocNom = ((item as any).docenteNombre || "").trim().toLowerCase();

                const cedDocClean = (cedulaDoc || "").replace(/\D/g, "");
                const rDocIdClean = rDocId.replace(/\D/g, "");
                const rDocCedClean = rDocCed.replace(/\D/g, "");

                const matchId = docenteId && (rDocId === (docenteId || "").toLowerCase() || rDocId.includes((docenteId || "").toLowerCase()));
                const matchCed = cedDocClean && (rDocIdClean === cedDocClean || rDocCedClean === cedDocClean);
                const matchEmail = correoDoc && (rDocEmail === correoDoc || rDocEmail.includes(correoDoc));
                const matchNom = nombreDoc && rDocNom && (rDocNom === nombreDoc || rDocNom.includes(nombreDoc));

                if (matchId || matchCed || matchEmail || matchNom) {
                  const key = normalizarClave(item);
                  mapa.set(key, { ...item, seccionOGrupo: normalizarSeccion(item.seccionOGrupo) });
                }
              }
            }
          });

          // Agregar locales de 7mo
          evaluacionesLocales7mo.forEach((item) => {
            const key = normalizarClave(item);
            if (!mapa.has(key)) {
              mapa.set(key, item);
            }
          });

          // Agregar locales de 8vo
          evaluacionesLocales8vo.forEach((item) => {
            const key = normalizarClave(item);
            if (!mapa.has(key)) {
              mapa.set(key, item);
            }
          });

          // Mezclar con los del servidor
          remotos.forEach((item: PayloadTelemetria) => {
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
          if (cedulaDoc) {
            const cleanKey = `telemetria_registros_${cedulaDoc.replace(/\D/g, "")}`;
            SafeStorage.setItem(cleanKey, JSON.stringify(unificados));
          }
          return unificados;
        });
      } catch (err) {
        // Modo offline
      }
    };

    // Sincronizar usuarios registrados desde el servidor para acceso multi-navegador
    const sincronizarUsuariosServidor = async () => {
      try {
        const res = await fetch("/api/admin/usuarios");
        if (res.ok) {
          const json = await res.json();
          if (json.usuarios && Array.isArray(json.usuarios)) {
            const guardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
            let locales: DocenteData[] = guardadosRaw ? JSON.parse(guardadosRaw) : [...LISTA_DOCENTES_INICIALES];

            json.usuarios.forEach((usr: any) => {
              const correo = (usr.correoInstitucional || "").toLowerCase().trim();
              if (!correo || esUsuarioBloqueado(usr.nombreCompleto, usr.correoInstitucional)) return;
              const idx = locales.findIndex((l) => (l.correoInstitucional || "").toLowerCase().trim() === correo);
              const dataSrv: DocenteData = {
                idDocente: usr.id || `DOC-${Date.now()}`,
                nombreCompleto: usr.nombreCompleto || "",
                correoInstitucional: usr.correoInstitucional,
                cedula: usr.cedula || "",
                telefono: usr.telefono || "",
                tipoRol: usr.rol === "Super Administrador" ? "Asesor Nacional" : usr.rol || "Docente",
                rol: usr.rol || "Docente",
                dreCodigo: usr.dreCodigo || "DRE-NACIONAL",
                dreNombre: usr.dreNombre || "Asesoría de Formación Tecnológica",
                circuito: usr.circuito || "Circuito 01",
                codigoPresupuestario: "FT-2027",
                institucionNombre: usr.institucionNombre || "",
                asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
                fechaRegistro: usr.fechaSolicitud || new Date().toISOString(),
                pin: usr.pin,
                contrasena: usr.pin,
              };
              if (idx !== -1) {
                locales[idx] = {
                  ...dataSrv,
                  ...locales[idx],
                  pin: locales[idx].pin || dataSrv.pin,
                  contrasena: locales[idx].contrasena || dataSrv.contrasena,
                };
              } else {
                locales.push(dataSrv);
              }
            });
            SafeStorage.setItem("usuarios_registrados_locales", JSON.stringify(locales));
          }
        }
      } catch {}
    };

    sincronizarUsuariosServidor();
    sincronizarTelemetriaServidor();
    const interval = setInterval(() => {
      sincronizarTelemetriaServidor();
      sincronizarUsuariosServidor();
    }, 4000);

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
      if (
        e.key === "telemetria_registros" ||
        e.key === "evaluacion_docente_8vo" ||
        e.key === "MEP_DOCENTE_8VO_EVALUATIONS" ||
        e.key === "MEP_DOCENTE_7MO_EVALUATIONS" ||
        (e.key && e.key.startsWith("MEP_DOCENTE_8VO_EVALUATIONS_"))
      ) {
        try {
          const raw = SafeStorage.getItem("telemetria_registros");
          if (raw) {
            setTelemetria(JSON.parse(raw));
          }
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
    try {
      if (typeof window !== "undefined") {
        const adaptado = {
          autenticado: true,
          nombre: data.nombreCompleto || "Alberto Bustos Ortega",
          cedula: data.cedula || data.idDocente || "5-0305-0179",
          correo: data.correoInstitucional || "alberto.bustos.ortega@mep.go.cr",
          telefono: data.telefono || "+506 8888-9999",
          pin: data.pin || "2617",
          colegio: data.institucionNombre || "Liceo / CTP MEP",
          dreCodigo: data.dreCodigo || "DRE-01",
          dreNombre: data.dreNombre || "San José Central",
          circuito: data.circuito || "Circuito 01",
          centrosEducativos: (data.centrosEducativos && data.centrosEducativos.length > 0)
            ? data.centrosEducativos.map((c) => ({
                colegio: c.nombre,
                dreCodigo: c.dreCodigo,
                dreNombre: c.dreNombre,
                circuito: c.circuito,
                niveles: {
                  '7': (c.desgloseNiveles || []).some((dn) => dn.nivel.includes("7") && dn.activo && (dn.seccionesAtendidasDocente || []).length > 0),
                  '8': (c.desgloseNiveles || []).some((dn) => dn.nivel.includes("8") && dn.activo && (dn.seccionesAtendidasDocente || []).length > 0),
                  '9': (c.desgloseNiveles || []).some((dn) => dn.nivel.includes("9") && dn.activo && (dn.seccionesAtendidasDocente || []).length > 0),
                },
                secciones: {
                  '7': {
                    total: (c.desgloseNiveles?.find((dn) => dn.nivel.includes("7"))?.totalSeccionesColegio) || 6,
                    selected: (c.desgloseNiveles?.find((dn) => dn.nivel.includes("7") && dn.activo)?.seccionesAtendidasDocente) || [],
                  },
                  '8': {
                    total: (c.desgloseNiveles?.find((dn) => dn.nivel.includes("8"))?.totalSeccionesColegio) || 6,
                    selected: (c.desgloseNiveles?.find((dn) => dn.nivel.includes("8") && dn.activo)?.seccionesAtendidasDocente) || [],
                  },
                  '9': {
                    total: (c.desgloseNiveles?.find((dn) => dn.nivel.includes("9"))?.totalSeccionesColegio) || 8,
                    selected: (c.desgloseNiveles?.find((dn) => dn.nivel.includes("9") && dn.activo)?.seccionesAtendidasDocente) || [],
                  },
                },
              }))
            : [{
                colegio: data.institucionNombre || "Liceo / CTP MEP",
                dreCodigo: data.dreCodigo || "DRE-01",
                dreNombre: data.dreNombre || "San José Central",
                niveles: { '7': true, '8': true, '9': true },
                secciones: {
                  '7': { total: 6, selected: ["7-1", "7-2"] },
                  '8': { total: 6, selected: ["8-1", "8-2"] },
                  '9': { total: 6, selected: ["9-1", "9-2"] },
                },
              }],
        };
        localStorage.setItem("MEP_DOCENTE_PERFIL_GLOBAL", JSON.stringify(adaptado));
      }
    } catch {}
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

      // Solo un usuario ya autenticado puede actualizar su propio perfil
      const esActualizacionDePerfilPropio =
        docente &&
        (docente.idDocente === data.idDocente ||
          docente.correoInstitucional.toLowerCase().trim() === correoLimpio ||
          (cedLimpia && normalizarCedulaParaComparar(docente.cedula || "") === cedLimpia));

      if (indiceDuplicado !== -1 && !esActualizacionDePerfilPropio) {
        const usuarioDuplicado = listaUsuarios[indiceDuplicado];
        return {
          exito: false,
          mensaje: `⚠️ Ya existe una cuenta registrada con este correo institucional o cédula (${usuarioDuplicado.nombreCompleto}). Por seguridad contra suplantación y fraude, no se permite duplicar ni sobreescribir registros. Inicie sesión con su PIN o utilice la opción de recuperar PIN.`,
        };
      }

      const docenteConCedulaFormateada = {
        ...data,
        cedula: cedFormateada,
      };

      if (indiceDuplicado !== -1 && esActualizacionDePerfilPropio) {
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
            esActualizacionPropia: Boolean(esActualizacionDePerfilPropio),
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
              pin: data.pin || data.contrasena,
              contrasena: data.contrasena || data.pin,
              centrosEducativos: data.centrosEducativos || undefined,
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

    // 2. Verificación Inmediata: Asesor Nacional (Allan Morera Araya)
    const esAsesorAllan =
      credencialLimpia === "allan.morera.araya@mep.go.cr" ||
      credencialLimpia === "allan.morera" ||
      credencialLimpia === "2-0481-0073" ||
      credencialLimpia === "204810073" ||
      credencialLimpia === "1-0987-0654" ||
      credencialLimpia === "109870654";

    const esPinValidoAllan = pinOPassLimpia === "7319" || pinOPassLimpia === "2617" || pinOPassLimpia === "1726";

    if (esAsesorAllan && esPinValidoAllan) {
      limpiarFallos();
      guardarDocente(DOCENTE_ASESOR_ALLAN);
      return { exito: true, mensaje: "Sesión iniciada correctamente como Asesor Nacional de Formación Tecnológica." };
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

    // 4. Verificación Inmediata: PruebaDocente1 (Cédula 0-0000-0001 / PIN 1111)
    const esDocenteP1 =
      credencialLimpia === "pruebadocente1@mep.go.cr" ||
      credencialLimpia === "pruebadocente1" ||
      credencialLimpia === "0-0000-0001" ||
      credencialLimpia === "000000001";

    const esPinValidoP1 = pinOPassLimpia === "1111" || pinOPassLimpia === "1001";

    if (esDocenteP1 && esPinValidoP1) {
      limpiarFallos();
      guardarDocente(DOCENTE_PRUEBA_1);
      return { exito: true, mensaje: `Bienvenido(a), ${DOCENTE_PRUEBA_1.nombreCompleto}.` };
    }

    // 5. Verificación Inmediata: PruebaDocente2 (Cédula 0-0000-0002 / PIN 2222)
    const esDocenteP2 =
      credencialLimpia === "pruebadocente2@mep.go.cr" ||
      credencialLimpia === "pruebadocente2" ||
      credencialLimpia === "0-0000-0002" ||
      credencialLimpia === "000000002";

    const esPinValidoP2 = pinOPassLimpia === "2222" || pinOPassLimpia === "2002";

    if (esDocenteP2 && esPinValidoP2) {
      limpiarFallos();
      guardarDocente(DOCENTE_PRUEBA_2);
      return { exito: true, mensaje: `Bienvenido(a), ${DOCENTE_PRUEBA_2.nombreCompleto}.` };
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
        };
      } else {
        const data = await res.json().catch(() => ({}));
        return {
          exito: false,
          mensaje: data.mensaje || "No fue posible despachar el código por el canal seleccionado. Por favor intente con el Correo MEP.",
        };
      }
    } catch {
      return {
        exito: false,
        mensaje: "Error de conexión al intentar despachar el código de seguridad. Por favor intente de nuevo.",
      };
    }
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
    setTelemetria([]);
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

  const eliminarResultado = (identificador: number | string) => {
    let estudianteNombreAEliminar = "";
    if (typeof identificador === "string") {
      estudianteNombreAEliminar = identificador;
    }
    setTelemetria((prev) => {
      const match = prev.find((r) => r.timestamp === identificador || r.estudianteNombre === identificador || r.idResultado === identificador);
      if (match?.estudianteNombre) {
        estudianteNombreAEliminar = match.estudianteNombre;
      }
      const updated = prev.filter((r) => {
        if (typeof identificador === "number") {
          if (r.timestamp === identificador) return false;
        }
        if (estudianteNombreAEliminar && r.estudianteNombre?.trim().toLowerCase() === estudianteNombreAEliminar.trim().toLowerCase()) {
          return false;
        }
        if (typeof identificador === "string" && (r.estudianteNombre === identificador || r.idResultado === identificador)) {
          return false;
        }
        return true;
      });
      SafeStorage.setItem("telemetria_registros", JSON.stringify(updated));
      return updated;
    });

    // Limpiar en TODOS los almacenes locales y específicos de nivel
    try {
      if (typeof window !== "undefined") {
        const nomLow = (estudianteNombreAEliminar || String(identificador)).toLowerCase().trim();
        const cedClean = (docente?.cedula || "").replace(/[^a-zA-Z0-9]/g, "");

        // Claves conocidas
        const claves = [
          "diagnosticos_mep_9no",
          "nomina_docente_9no_mep",
          "evaluacion_docente_8vo",
          "telemetria_8vo_local",
          "MEP_DOCENTE_8VO_EVALUATIONS",
          "MEP_DOCENTE_7MO_EVALUATIONS",
          "telemetria_registros",
        ];
        if (cedClean) {
          claves.push(`MEP_DOCENTE_7MO_EVALUATIONS_${cedClean}`);
          claves.push(`MEP_DOCENTE_8VO_EVALUATIONS_${cedClean}`);
          claves.push(`telemetria_registros_${cedClean}`);
        }

        claves.forEach((key) => {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const arr = JSON.parse(raw);
              if (Array.isArray(arr)) {
                const filtrados = arr.filter((item: any) => {
                  const itemNom = (item.estudianteNombre || item.nombre || item.name1 || "").toLowerCase().trim();
                  const itemNom2 = (item.name2 || "").toLowerCase().trim();
                  const match1 = itemNom && (itemNom === nomLow || nomLow.includes(itemNom) || itemNom.includes(nomLow));
                  const match2 = itemNom2 && (itemNom2 === nomLow || nomLow.includes(itemNom2) || itemNom2.includes(nomLow));
                  const matchTs = typeof identificador === "number" && item.timestamp === identificador;
                  return !(match1 || match2 || matchTs);
                });
                localStorage.setItem(key, JSON.stringify(filtrados));
              }
            } catch {}
          }
        });
      }
    } catch {}

    // Notificar al servidor para eliminar definitivamente
    try {
      const params = new URLSearchParams();
      if (estudianteNombreAEliminar) params.set("estudianteNombre", estudianteNombreAEliminar);
      if (typeof identificador === "number") params.set("timestamp", String(identificador));
      if (docente?.idDocente) params.set("docenteId", docente.idDocente);
      if (docente?.cedula) params.set("cedula", docente.cedula);

      fetch(`/api/telemetria/enviar?${params.toString()}`, { method: "DELETE" }).catch(() => {});
    } catch(e) {}
  };

  const limpiarTelemetria = () => {
    setTelemetria([]);
    SafeStorage.setItem("telemetria_registros", JSON.stringify([]));

    try {
      if (typeof window !== "undefined") {
        const cedClean = (docente?.cedula || "").replace(/[^a-zA-Z0-9]/g, "");
        const claves = [
          "diagnosticos_mep_9no",
          "nomina_docente_9no_mep",
          "evaluacion_docente_8vo",
          "telemetria_8vo_local",
          "MEP_DOCENTE_8VO_EVALUATIONS",
          "MEP_DOCENTE_7MO_EVALUATIONS",
          "telemetria_registros",
        ];
        if (cedClean) {
          claves.push(`MEP_DOCENTE_7MO_EVALUATIONS_${cedClean}`);
          claves.push(`MEP_DOCENTE_8VO_EVALUATIONS_${cedClean}`);
          claves.push(`telemetria_registros_${cedClean}`);
        }
        claves.forEach((k) => {
          try {
            localStorage.removeItem(k);
            localStorage.setItem(k, JSON.stringify([]));
          } catch {}
        });
      }
    } catch(e) {}

    // Notificar al servidor para vaciar los registros del docente
    try {
      const params = new URLSearchParams();
      params.set("all", "true");
      if (docente?.idDocente) params.set("docenteId", docente.idDocente);
      if (docente?.cedula) params.set("cedula", docente.cedula);
      if (docente?.correoInstitucional) params.set("correo", docente.correoInstitucional);
      if (docente?.nombreCompleto) params.set("docenteNombre", docente.nombreCompleto);

      fetch(`/api/telemetria/enviar?${params.toString()}`, { method: "DELETE" }).catch(() => {});
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
