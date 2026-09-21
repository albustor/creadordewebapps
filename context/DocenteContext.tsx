"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SafeStorage } from "@/lib/firebase";
import { PayloadTelemetria } from "@/lib/antiFraude";
import {
  WebAppComunidad,
  PRODUCCIONES_COMUNIDAD_INICIALES,
  obtenerProduccionConHTML,
} from "@/lib/comunidadData";

export interface DocenteData {
  idDocente: string;
  nombreCompleto: string;
  correoInstitucional: string;
  cedula: string;
  telefono: string;
  dreCodigo: string;
  dreNombre: string;
  circuito: string;
  codigoPresupuestario: string;
  institucionNombre: string;
  rol: string;
  asignaturas: string[];
  fechaRegistro: string;
  contrasena?: string;
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
  guardarDocente: (data: DocenteData) => void;
  guardarWebApp: (webapp: WebAppInfo) => void;
  compartirEnComunidad: (webapp: WebAppInfo | WebAppComunidad) => void;
  iniciarSesion: (correo: string, contrasena: string) => { exito: boolean; mensaje: string };
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
  nombreCompleto: "Prof. Alberto Bustos Ortega",
  correoInstitucional: "alberto.bustos.ortega@mep.go.cr",
  contrasena: "EdcRfvTgb1726**",
  cedula: "1-1122-3344",
  telefono: "+506 8888-9999",
  dreCodigo: "DRE-NACIONAL",
  dreNombre: "Asesoría de Formación Tecnológica",
  circuito: "Nivel Nacional / Ámbito General",
  codigoPresupuestario: "FT-NACIONAL-2026",
  institucionNombre: "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)",
  rol: "Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)",
  asignaturas: [
    "Formación Tecnológica",
  ],
  fechaRegistro: new Date().toISOString(),
};

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
        if (parsed.correoInstitucional && parsed.correoInstitucional.includes("@educacion.cr")) {
          parsed.correoInstitucional = parsed.correoInstitucional.replace("@educacion.cr", "@mep.go.cr");
          SafeStorage.setItem("docente_activo", JSON.stringify(parsed));
        }
        setDocente(parsed);
      } catch {
        setDocente(DOCENTE_MEP_OFICIAL);
      }
    } else {
      // Docente oficial autenticado
      setDocente(DOCENTE_MEP_OFICIAL);
      SafeStorage.setItem("docente_activo", JSON.stringify(DOCENTE_MEP_OFICIAL));
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
      setTelemetria(SAMPLE_TELEMETRIA);
      SafeStorage.setItem("telemetria_registros", JSON.stringify(SAMPLE_TELEMETRIA));
    }

    // Sincronizar con el endpoint del servidor
    const sincronizarTelemetriaServidor = async () => {
      try {
        const res = await fetch("/api/telemetria/enviar");
        if (res.ok) {
          const json = await res.json();
          if (json.registros && Array.isArray(json.registros) && json.registros.length > 0) {
            setTelemetria((prev) => {
              const mapa = new Map<string, PayloadTelemetria>();
              // Agregar los previos
              prev.forEach((item) => {
                const key = item.idResultado || `${item.estudianteNombre}_${item.timestamp}`;
                mapa.set(key, item);
              });
              // Mezclar con los del servidor
              json.registros.forEach((item: PayloadTelemetria) => {
                const key = item.idResultado || `${item.estudianteNombre}_${item.timestamp}`;
                mapa.set(key, item);
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

  const iniciarSesion = (correo: string, contrasena: string): { exito: boolean; mensaje: string } => {
    const emailLimpio = correo.trim().toLowerCase();
    const passLimpia = contrasena.trim();

    if (
      emailLimpio === "alberto.bustos.ortega@mep.go.cr" &&
      passLimpia === "EdcRfvTgb1726**"
    ) {
      guardarDocente(DOCENTE_DEFAULT);
      return { exito: true, mensaje: "Sesión iniciada correctamente en el entorno de Formación Tecnológica." };
    }

    if (!emailLimpio.endsWith("@mep.go.cr")) {
      return {
        exito: false,
        mensaje: "Correo institucional no válido. Únicamente se admiten cuentas oficiales del MEP (@mep.go.cr, ej: nombre.apellido.apellido@mep.go.cr).",
      };
    }

    if (passLimpia.length >= 6) {
      const docenteNuevo: DocenteData = {
        ...DOCENTE_DEFAULT,
        correoInstitucional: emailLimpio,
        nombreCompleto: emailLimpio.split("@")[0].replace(/\./g, " ").toUpperCase(),
        contrasena: passLimpia,
      };
      guardarDocente(docenteNuevo);
      return { exito: true, mensaje: "Bienvenido docente. Perfil configurado con éxito." };
    }

    return { exito: false, mensaje: "Credenciales no válidas. Ingrese su correo institucional MEP (@mep.go.cr) y contraseña (mínimo 6 caracteres)." };
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

  const agregarResultadoTelemetria = (res: PayloadTelemetria) => {
    setTelemetria((prev) => {
      const updated = [res, ...prev];
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
      const updated = [...lote, ...prev];
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
  };

  const limpiarTelemetria = () => {
    setTelemetria([]);
    SafeStorage.setItem("telemetria_registros", JSON.stringify([]));
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
        guardarDocente,
        guardarWebApp,
        compartirEnComunidad,
        iniciarSesion,
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
