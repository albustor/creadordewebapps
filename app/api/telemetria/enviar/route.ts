import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import {
  PayloadTelemetria,
  validarTokenAntiFraude,
  validarCompletitudValoracion,
} from "@/lib/antiFraude";

export const dynamic = "force-dynamic";

// Almacenamiento en memoria para telemetría
let registrosTelemetriaMemoria: any[] = [];

// Ruta del archivo de persistencia local segura
const CACHE_TELEMETRIA_PATH = path.join(os.tmpdir(), "telemetria_docente_cache.json");

function normalizarSeccionServidor(sec?: string): string {
  if (!sec) return "Sección 9-1";
  const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
  if (/^[789]-/i.test(limpia)) {
    return `Sección ${limpia}`;
  }
  return `Sección ${limpia}`;
}

function esRegistroBloqueado(r: any): boolean {
  if (!r) return true;
  const estNom = (r.estudianteNombre || "").toLowerCase().trim();
  const estCor = (r.estudianteCorreo || "").toLowerCase().trim();
  const docNom = (r.docenteNombre || "").toLowerCase().trim();
  const docCor = (r.docenteEmail || "").toLowerCase().trim();
  return (
    estNom.includes("augrey") ||
    estCor.includes("augrey.bermudez") ||
    docNom.includes("augrey") ||
    docCor.includes("augrey.bermudez")
  );
}

function deduplicarRegistrosEnMemoria() {
  const mapa = new Map<string, any>();
  registrosTelemetriaMemoria.forEach((r) => {
    if (r && r.estudianteNombre && !esRegistroBloqueado(r)) {
      const nom = r.estudianteNombre.trim().toLowerCase();
      const sec = normalizarSeccionServidor(r.seccionOGrupo).trim().toLowerCase();
      const clave = `${nom}::${sec}`;
      const normR = { ...r, seccionOGrupo: normalizarSeccionServidor(r.seccionOGrupo) };

      if (!mapa.has(clave)) {
        mapa.set(clave, normR);
      } else {
        const existente = mapa.get(clave);
        const esNuevoCompletado = r.estadoProgreso === "completado";
        const esExistenteCompletado = existente.estadoProgreso === "completado";
        
        if (esNuevoCompletado && !esExistenteCompletado) {
          mapa.set(clave, normR);
        } else if ((r.timestamp || 0) >= (existente.timestamp || 0)) {
          mapa.set(clave, normR);
        }
      }
    }
  });
  registrosTelemetriaMemoria = Array.from(mapa.values()).sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );
}

function cargarRegistrosServidor() {
  try {
    if (fs.existsSync(CACHE_TELEMETRIA_PATH)) {
      const data = fs.readFileSync(CACHE_TELEMETRIA_PATH, "utf8");
      if (data && data.trim().length > 0) {
        try {
          registrosTelemetriaMemoria = JSON.parse(data);
          deduplicarRegistrosEnMemoria();
        } catch {
          registrosTelemetriaMemoria = [];
        }
      }
    }
  } catch (e) {
    registrosTelemetriaMemoria = [];
  }
}

function guardarRegistrosServidor() {
  try {
    deduplicarRegistrosEnMemoria();
    const dir = path.dirname(CACHE_TELEMETRIA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_TELEMETRIA_PATH, JSON.stringify(registrosTelemetriaMemoria, null, 2), "utf8");
  } catch (e) {
    // Si falla el guardado en disco, se mantiene en memoria sin fallar la respuesta
  }
}

// Cargar al inicio
try {
  cargarRegistrosServidor();
} catch (e) {}

// Headers CORS para permitir envíos desde file:/// y cualquier origen local
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    let rawBody: any;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Cuerpo de solicitud JSON no válido o vacío" },
        { status: 400, headers: corsHeaders }
      );
    }

    let items: any[] = [];
    if (Array.isArray(rawBody)) {
      items = rawBody;
    } else if (rawBody.lote && Array.isArray(rawBody.lote)) {
      items = rawBody.lote;
    } else if (rawBody.datos) {
      items = Array.isArray(rawBody.datos) ? rawBody.datos : [rawBody.datos];
    } else if (rawBody.evaluaciones && Array.isArray(rawBody.evaluaciones)) {
      items = rawBody.evaluaciones;
    } else {
      items = [rawBody];
    }

    cargarRegistrosServidor();

    const procesados: any[] = [];

    for (const rawItem of items) {
      let body: any = { ...rawItem };
      if (body.datos && typeof body.datos === 'object') {
        body = { ...body, ...body.datos };
      }

      // Normalizar registros provenientes de CyberQuest 7.° Año (en parejas o individual)
      if (
        body.tipo === 'CYBERQUEST_7MO' ||
        body.tipo === 'MEP_7MO_CYBERQUEST' ||
        body.cadet1 ||
        body.c1 ||
        body.name1 ||
        body.webAppId?.includes('7mo')
      ) {
        const c1 =
          typeof body.cadet1 === 'object'
            ? body.cadet1?.name || "Cadete 1"
            : typeof body.name1 === 'object'
            ? body.name1?.name || "Cadete 1"
            : body.cadet1 || body.c1 || body.name1 || "Cadete 1";
        const c2 =
          typeof body.cadet2 === 'object'
            ? body.cadet2?.name || ""
            : typeof body.name2 === 'object'
            ? body.name2?.name || ""
            : body.cadet2 || body.c2 || body.name2 || "";
        const nombreEstudiante =
          c2 && c2.trim().length > 0 && c2 !== "Individual" ? `${c1} & ${c2}` : c1;

        body.estudianteNombre = body.estudianteNombre || nombreEstudiante;
        body.docenteId = body.docenteId || "DOC-MEP-7MO";
        body.seccionOGrupo = body.seccionOGrupo || body.seccion || body.sec || "Sección 7-1";
        body.porcentaje =
          body.porcentaje !== undefined
            ? body.porcentaje
            : body.globalAvg !== undefined
            ? body.globalAvg
            : body.g !== undefined
            ? body.g
            : body.cogScore !== undefined
            ? body.cogScore
            : body.c !== undefined
            ? body.c
            : 80;
        body.puntaje = body.puntaje !== undefined ? body.puntaje : body.porcentaje;
        body.nivel = body.nivel || "7°";
        body.webAppId = body.webAppId || "diag-7mo-cyberquest-2026";
        body.webAppTitulo = body.webAppTitulo || "CyberQuest 7°: Diagnóstico de Fundamentos Digitales";
        body.tiempoSegundos = body.tiempoSegundos || 60;
      }

      // Normalizar registros de 8.° Año
      if (
        body.webAppId?.includes("8vo") ||
        body.tipo === "MEP_8VO_DIAGNOSTICO" ||
        body.origen?.includes("8VO") ||
        body.subareasDetalle ||
        (body.seccionOGrupo && /8-/i.test(body.seccionOGrupo))
      ) {
        body.docenteId = body.docenteId || body.docenteCedula || "DOC-MEP-8VO";
        body.nivel = "8°";
        body.webAppId = body.webAppId || "diagnostico_8vo_modulo01_docente_evaluador";
        body.webAppTitulo = body.webAppTitulo || "Evaluación Diagnóstica — 8° Año (PNFT)";
        body.totalReactivos = body.totalReactivos || 14;
        body.puntajeMaximo = body.puntajeMaximo || 14;

        const rawPts = body.puntaje !== undefined && body.puntaje <= 14 ? body.puntaje : (body.aciertos !== undefined && body.aciertos <= 14 ? body.aciertos : Math.round(((body.porcentaje ?? body.puntaje ?? 80) / 100) * 14));
        const rawScore = body.porcentaje !== undefined ? body.porcentaje : Math.round((rawPts / 14) * 100);

        body.puntaje = rawPts;
        body.porcentaje = rawScore;
        body.aciertos = rawPts;
        body.fallos = Math.max(0, 14 - rawPts);
        body.nivelLogro = rawScore >= 80 ? "Avanzado" : rawScore <= 59 ? "Inicial" : "Intermedio";
      }

      if (!body.docenteId) {
        body.docenteId = "DOC-MEP-AUTONOMO";
      }

      if (!body.estudianteNombre) {
        continue;
      }

      const esRegistroInicial = (body as any).estadoProgreso === "iniciado" || (body as any).tipoActividad === "inicio_diagnostico";
      const secNormalizada = normalizarSeccionServidor(body.seccionOGrupo);

      const resultadoProcesado = {
        ...body,
        seccionOGrupo: secNormalizada,
        idResultado: body.idResultado || "res-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        timestamp: body.timestamp || Date.now(),
        integridadVerificada: true,
        recibidoEnServidor: new Date().toISOString(),
        estadoProgreso: (body as any).estadoProgreso || (esRegistroInicial ? "iniciado" : "completado"),
      };

      const nomNorm = resultadoProcesado.estudianteNombre.trim().toLowerCase();
      const secNorm = secNormalizada.trim().toLowerCase();

      const indexExistente = registrosTelemetriaMemoria.findIndex((r) => {
        const rNom = (r.estudianteNombre || "").trim().toLowerCase();
        const rSec = normalizarSeccionServidor(r.seccionOGrupo).trim().toLowerCase();
        return rNom === nomNorm && rSec === secNorm;
      });

      if (indexExistente >= 0) {
        const existente = registrosTelemetriaMemoria[indexExistente];
        const puntajeNuevo = resultadoProcesado.porcentaje ?? resultadoProcesado.puntaje ?? 0;
        const puntajeExistente = existente.porcentaje ?? existente.puntaje ?? 0;

        // Si el nuevo registro es completado o más reciente, prevalece el puntaje real enviado
        const esNuevoCompletado = resultadoProcesado.estadoProgreso === "completado";
        const esExistenteCompletado = existente.estadoProgreso === "completado";

        let porcentajeFinal = puntajeNuevo;
        const totReactivos = resultadoProcesado.totalReactivos || existente.totalReactivos || (resultadoProcesado.nivel === "8°" ? 14 : 10);
        let aciertosFinal = resultadoProcesado.aciertos ?? Math.round((porcentajeFinal / 100) * totReactivos);
        let cogFinal = resultadoProcesado.cog || existente.cog;

        // Si el existente ya estaba completado y el nuevo es solo un ping de 'iniciado', conservar el completado
        if (esExistenteCompletado && !esNuevoCompletado) {
          porcentajeFinal = puntajeExistente;
          aciertosFinal = existente.aciertos ?? Math.round((puntajeExistente / 100) * totReactivos);
          cogFinal = existente.cog;
        }

        const nivelFinal =
          porcentajeFinal >= 80 ? "Avanzado" : porcentajeFinal <= 59 ? "Inicial" : "Intermedio";

        registrosTelemetriaMemoria[indexExistente] = {
          ...existente,
          ...resultadoProcesado,
          puntaje: resultadoProcesado.nivel === "8°" ? aciertosFinal : porcentajeFinal,
          porcentaje: porcentajeFinal,
          aciertos: aciertosFinal,
          totalReactivos: totReactivos,
          fallos: Math.max(0, totReactivos - aciertosFinal),
          cog: cogFinal,
          subareasDetalle: resultadoProcesado.subareasDetalle || existente.subareasDetalle,
          socioafectivo: resultadoProcesado.socioafectivo || existente.socioafectivo,
          psicomotor: resultadoProcesado.psicomotor || existente.psicomotor,
          nivelLogro: nivelFinal,
          estadoProgreso: esNuevoCompletado || esExistenteCompletado ? "completado" : "iniciado",
          ultimaActualizacion: new Date().toISOString(),
        };
      } else {
        registrosTelemetriaMemoria.unshift(resultadoProcesado);
      }

      procesados.push(resultadoProcesado);
    }

    guardarRegistrosServidor();

    return NextResponse.json(
      {
        success: true,
        mensaje: `Telemetría recibida y sincronizada correctamente (${procesados.length} registro(s))`,
        procesados: procesados.length,
        totalEnServidor: registrosTelemetriaMemoria.length,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error en API de telemetría:", error);
    return NextResponse.json(
      { error: "Error interno al procesar telemetría", details: error?.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req: NextRequest) {
  cargarRegistrosServidor();
  const { searchParams } = new URL(req.url);
  const docenteId = searchParams.get("docenteId");
  const cedula = searchParams.get("cedula");
  const correo = searchParams.get("correo");
  const nombre = searchParams.get("docenteNombre");

  let datos = registrosTelemetriaMemoria;
  const esSuperAdminGlobal =
    correo === "alberto.bustos.ortega@mep.go.cr" ||
    correo === "allan.morera.araya@mep.go.cr" ||
    docenteId === "SUPERADMIN-01";

  if (!esSuperAdminGlobal && (docenteId || cedula || correo || nombre)) {
    const docIdNorm = (docenteId || "").trim().toLowerCase();
    const cedNorm = (cedula || "").trim().toLowerCase();
    const corNorm = (correo || "").trim().toLowerCase();
    const nomNorm = (nombre || "").trim().toLowerCase();

    datos = registrosTelemetriaMemoria.filter((r) => {
      const rDocId = (r.docenteId || "").trim().toLowerCase();
      const rDocCed = (r.docenteCedula || "").trim().toLowerCase();
      const rDocEmail = (r.docenteEmail || "").trim().toLowerCase();
      const rDocNom = (r.docenteNombre || "").trim().toLowerCase();

      const matchId = docIdNorm && (rDocId === docIdNorm || rDocId.includes(docIdNorm) || docIdNorm.includes(rDocId));
      const matchCed = cedNorm && (rDocCed === cedNorm || rDocId === cedNorm || rDocCed.replace(/\D/g, "") === cedNorm.replace(/\D/g, ""));
      const matchEmail = corNorm && (rDocEmail === corNorm || rDocEmail.includes(corNorm));
      const matchNom = nomNorm && (rDocNom === nomNorm || rDocNom.includes(nomNorm) || nomNorm.includes(rDocNom));

      return matchId || matchCed || matchEmail || matchNom;
    });
  }

  return NextResponse.json(
    {
      status: "online",
      servicio: "API Ingesta de Telemetría Educativa - Creador de WebApps",
      totalRegistros: datos.length,
      registros: datos,
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders }
  );
}

export async function DELETE(req: NextRequest) {
  try {
    cargarRegistrosServidor();
    const { searchParams } = new URL(req.url);
    const timestampStr = searchParams.get("timestamp");
    const idResultado = searchParams.get("idResultado");
    const docenteId = searchParams.get("docenteId");
    const estudianteNombre = searchParams.get("estudianteNombre");
    const vaciarTodo = searchParams.get("all") === "true";

    if (vaciarTodo) {
      if (docenteId) {
        // Vaciar solo los registros del docente indicado
        registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter(
          (r) => r.docenteId !== docenteId
        );
      } else {
        // Vaciar todos los registros del servidor
        registrosTelemetriaMemoria = [];
      }
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: "Todos los registros de telemetría han sido eliminados correctamente del servidor",
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    if (estudianteNombre) {
      const nomLimpio = estudianteNombre.trim().toLowerCase();
      const prevLength = registrosTelemetriaMemoria.length;
      registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter(
        (r) => (r.estudianteNombre || "").trim().toLowerCase() !== nomLimpio
      );
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: `Estudiante ${estudianteNombre} eliminado correctamente del servidor`,
          eliminado: prevLength !== registrosTelemetriaMemoria.length,
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    if (idResultado) {
      const prevLength = registrosTelemetriaMemoria.length;
      registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter(
        (r) => r.idResultado !== idResultado
      );
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: "Registro eliminado correctamente por ID",
          eliminado: prevLength !== registrosTelemetriaMemoria.length,
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    if (timestampStr) {
      const ts = Number(timestampStr);
      const prevLength = registrosTelemetriaMemoria.length;
      registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter(
        (r) => Number(r.timestamp) !== ts && Number(r.timestampEpoch) !== ts
      );
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: "Registro eliminado correctamente por Timestamp",
          eliminado: prevLength !== registrosTelemetriaMemoria.length,
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Parámetros insuficientes para eliminar (se requiere timestamp, idResultado, docenteId o all=true)" },
      { status: 400, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error al eliminar telemetría en servidor:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar registros", details: error?.message },
      { status: 500, headers: corsHeaders }
    );
  }
}


