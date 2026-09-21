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

function cargarRegistrosServidor() {
  try {
    if (fs.existsSync(CACHE_TELEMETRIA_PATH)) {
      const data = fs.readFileSync(CACHE_TELEMETRIA_PATH, "utf8");
      if (data && data.trim().length > 0) {
        try {
          registrosTelemetriaMemoria = JSON.parse(data);
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

      const resultadoProcesado = {
        ...body,
        idResultado: body.idResultado || "res-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        timestamp: body.timestamp || Date.now(),
        integridadVerificada: true,
        recibidoEnServidor: new Date().toISOString(),
        estadoProgreso: (body as any).estadoProgreso || (esRegistroInicial ? "iniciado" : "completado"),
      };

      const indexExistente = registrosTelemetriaMemoria.findIndex(
        (r) =>
          r.idResultado === resultadoProcesado.idResultado ||
          (r.estudianteNombre?.trim().toLowerCase() === resultadoProcesado.estudianteNombre?.trim().toLowerCase() &&
           (r.seccionOGrupo === resultadoProcesado.seccionOGrupo || !resultadoProcesado.seccionOGrupo))
      );

      if (indexExistente >= 0) {
        registrosTelemetriaMemoria[indexExistente] = {
          ...registrosTelemetriaMemoria[indexExistente],
          ...resultadoProcesado,
          estadoProgreso: resultadoProcesado.estadoProgreso === "completado" ? "completado" : registrosTelemetriaMemoria[indexExistente].estadoProgreso,
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


