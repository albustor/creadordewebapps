import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  PayloadTelemetria,
  validarTokenAntiFraude,
  validarCompletitudValoracion,
} from "@/lib/antiFraude";

// Almacenamiento en memoria para telemetría
let registrosTelemetriaMemoria: any[] = [];

// Ruta del archivo de persistencia local
const CACHE_TELEMETRIA_PATH = path.join(process.cwd(), ".next", "telemetria_docente_cache.json");

function normalizarSeccionServidor(sec?: string): string {
  if (!sec) return "Sección 9-1";
  const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
  return limpia.startsWith("9-") ? `Sección ${limpia}` : `Sección 9-${limpia}`;
}

function deduplicarRegistrosEnMemoria() {
  const mapa = new Map<string, any>();
  registrosTelemetriaMemoria.forEach((r) => {
    if (r && r.estudianteNombre) {
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

    const items: PayloadTelemetria[] = Array.isArray(rawBody)
      ? rawBody
      : rawBody.lote && Array.isArray(rawBody.lote)
      ? rawBody.lote
      : [rawBody];

    cargarRegistrosServidor();

    const procesados: any[] = [];

    for (const body of items) {
      if (!body.docenteId || !body.estudianteNombre) {
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

        let puntajeFinal = puntajeNuevo;
        let aciertosFinal = resultadoProcesado.aciertos ?? Math.round((puntajeNuevo / 100) * 10);
        let cogFinal = resultadoProcesado.cog || existente.cog;

        // Si el existente ya estaba completado y el nuevo es solo un ping de 'iniciado', conservar el completado
        if (esExistenteCompletado && !esNuevoCompletado) {
          puntajeFinal = puntajeExistente;
          aciertosFinal = existente.aciertos ?? Math.round((puntajeExistente / 100) * 10);
          cogFinal = existente.cog;
        }

        const nivelFinal =
          puntajeFinal >= 80 ? "Avanzado" : puntajeFinal <= 59 ? "Inicial" : "Intermedio";

        registrosTelemetriaMemoria[indexExistente] = {
          ...existente,
          ...resultadoProcesado,
          puntaje: puntajeFinal,
          porcentaje: puntajeFinal,
          aciertos: aciertosFinal,
          fallos: Math.max(0, 10 - aciertosFinal),
          cog: cogFinal,
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

  const datos = docenteId
    ? registrosTelemetriaMemoria.filter((r) => r.docenteId === docenteId)
    : registrosTelemetriaMemoria;

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


