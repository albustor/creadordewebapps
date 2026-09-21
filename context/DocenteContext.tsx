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
  isInitialized: boolean;
  guardarDocente: (data: DocenteData) => void;
  registrarDocente: (data: DocenteData) => { exito: boolean; mensaje: string };
  guardarWebApp: (webapp: WebAppInfo) => void;
  compartirEnComunidad: (webapp: WebAppInfo | WebAppComunidad) => void;
  iniciarSesion: (correoOUsuario: string, contrasena: string) => { exito: boolean; mensaje: string };
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
          if (!sec) return "Sección 9-1";
          const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
          return limpia.startsWith("9-") ? `Sección ${limpia}` : `Sección 9-${limpia}`;
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
      let listaUsuarios: DocenteData[] = [];
      if (usuariosGuardadosRaw) {
        try {
          listaUsuarios = JSON.parse(usuariosGuardadosRaw);
        } catch {}
      }

      const indexExistente = listaUsuarios.findIndex(
        (u) => u.correoInstitucional.toLowerCase() === data.correoInstitucional.toLowerCase()
      );
      if (indexExistente >= 0) {
        listaUsuarios[indexExistente] = data;
      } else {
        listaUsuarios.push(data);
      }
      SafeStorage.setItem("usuarios_registrados_locales", JSON.stringify(listaUsuarios));
      guardarDocente(data);

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

  const iniciarSesion = (correoOUsuario: string, contrasena: string): { exito: boolean; mensaje: string } => {
    const credencialLimpia = correoOUsuario.trim().toLowerCase();
    const passLimpia = contrasena.trim();

    if (!credencialLimpia || !passLimpia) {
      return { exito: false, mensaje: "Por favor complete el usuario y la contraseña." };
    }

    // 1. Acceso Administrador / Asesor Principal
    if (
      (credencialLimpia === "alberto.bustos.ortega@mep.go.cr" ||
        credencialLimpia === "alberto.bustos" ||
        credencialLimpia === "admin") &&
      passLimpia === "EdcRfvTgb1726**"
    ) {
      guardarDocente(DOCENTE_DEFAULT);
      return { exito: true, mensaje: "Sesión iniciada correctamente en el entorno de Formación Tecnológica." };
    }

    // 2. Búsqueda en usuarios registrados localmente
    const usuariosGuardadosRaw = SafeStorage.getItem("usuarios_registrados_locales");
    if (usuariosGuardadosRaw) {
      try {
        const listaUsuarios: DocenteData[] = JSON.parse(usuariosGuardadosRaw);
        const match = listaUsuarios.find(
          (u) =>
            u.correoInstitucional.toLowerCase() === credencialLimpia ||
            u.correoInstitucional.toLowerCase().split("@")[0] === credencialLimpia ||
            u.nombreCompleto.toLowerCase() === credencialLimpia
        );
        if (match) {
          if (match.contrasena && match.contrasena !== passLimpia) {
            return { exito: false, mensaje: "Contraseña incorrecta. Verifique sus credenciales." };
          }
          guardarDocente(match);
          return { exito: true, mensaje: `Bienvenido(a), ${match.nombreCompleto}.` };
        }
      } catch {}
    }

    // 3. Validación de formato de correo o usuario docente
    const esEmail = credencialLimpia.includes("@");
    const correoCompleto = esEmail
      ? credencialLimpia
      : `${credencialLimpia}@mep.go.cr`;

    if (passLimpia.length >= 6) {
      const nombreFormateado = correoCompleto
        .split("@")[0]
        .split(".")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");

      const randomId = `DOC-${Math.floor(1000 + Math.random() * 9000)}`;

      const docenteNuevo: DocenteData = {
        idDocente: randomId,
        nombreCompleto: `Prof. ${nombreFormateado}`,
        correoInstitucional: correoCompleto,
        contrasena: passLimpia,
        cedula: "",
        telefono: "",
        dreCodigo: "DRE01",
        dreNombre: "Dirección Regional San José Central",
        circuito: "Circuito 01",
        codigoPresupuestario: "",
        institucionNombre: "Liceo / Colegio de Secundaria",
        rol: "Docente de Formación Tecnológica",
        asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
        fechaRegistro: new Date().toISOString(),
      };
      registrarDocente(docenteNuevo);
      return { exito: true, mensaje: "Sesión iniciada correctamente." };
    }

    return {
      exito: false,
      mensaje: "Contraseña no válida. Debe contener un mínimo de 6 caracteres.",
    };
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
    if (!sec) return "Sección 9-1";
    const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
    return limpia.startsWith("9-") ? `Sección ${limpia}` : `Sección 9-${limpia}`;
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
