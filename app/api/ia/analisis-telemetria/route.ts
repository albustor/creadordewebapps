import { NextRequest, NextResponse } from "next/server";
import { ejecutarCascadaIA } from "@/lib/aiResilience";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      registros = [],
      seccion = "Todas",
      promedio = 0,
      totalEstudiantes = 0,
      porcentajeAvanzado = 0,
      porcentajeIntermedio = 0,
      porcentajeInicial = 0,
      estudiantesAcompaniamiento = [],
      indicador = "Diagnóstico Integrado 9°: «Aula Inteligente»",
      asignatura = "Formación Tecnológica",
      nivel = "9° Año - Secundaria",
    } = body;

    const prompt = `Analiza los siguientes DATOS REALES DE TELEMETRÍA Y EVALUACIÓN DIAGNÓSTICA recopilados en el aula para ${nivel} (${asignatura}):

CONTEXTO DEL GRUPO:
- Sección/Grupo: ${seccion}
- Indicador de Diagnóstico: ${indicador}
- Total de estudiantes evaluados: ${totalEstudiantes}
- Promedio general obtenido: ${promedio}%
- Distribución de Logro:
  * Nivel Avanzado / Consolidado (>=80%): ${porcentajeAvanzado}%
  * Nivel Intermedio / En Desarrollo (60-79%): ${porcentajeIntermedio}%
  * Nivel Inicial / Requiere Acompañamiento (<=59%): ${porcentajeInicial}%

ESTUDIANTES QUE REQUIEREN ACOMPAÑAMIENTO PRIORITARIO (${estudiantesAcompaniamiento.length} estudiantes):
${
  estudiantesAcompaniamiento.length > 0
    ? estudiantesAcompaniamiento
        .map(
          (e: { nombre: string; puntaje: number; seccion?: string }) =>
            `- ${e.nombre}: ${e.puntaje}% (${e.seccion || seccion})`
        )
        .join("\n")
    : "Ningún estudiante se encuentra actualmente en nivel inicial."
}

MUESTRA DE TELEMETRÍA DETALLADA:
${JSON.stringify(registros.slice(0, 15), null, 2)}

INSTRUCCIONES OBLIGATORIAS:
Como Asesor Pedagógico Especialista en Formación Tecnológica y Evaluación Diagnóstica para 9° Año de Secundaria, debes generar un ANÁLISIS PEDAGÓGICO PROFUNDO Y NO PREDETERMINADO, basado ESTRICTAMENTE en los números y desempeños reportados arriba.

Debes responder ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
{
  "resumenEjecutivo": "Síntesis clara de 2-3 oraciones que interprete lo que los datos del grupo revelan pedagógicamente.",
  "nivelGlobal": "${promedio >= 80 ? "Consolidado" : promedio >= 60 ? "En Desarrollo" : "Requiere Acompañamiento Prioritario"}",
  "ajustesSaberConceptual": {
    "titulo": "Ajustes al Saber Conceptual (Fundamentos de Sensores, Circuitos y Lógica Digital)",
    "descripcion": "Diagnóstico de brechas conceptuales detectadas según los datos de ${seccion}:",
    "accionesConcretas": [
      "Acción concreta 1 adaptada al ${promedio}% obtenido",
      "Acción concreta 2",
      "Acción concreta 3"
    ]
  },
  "ajustesSaberProcedimental": {
    "titulo": "Ajustes al Saber Procedimental (Formulación de Algoritmos y Simulación 2D)",
    "descripcion": "Estrategias de mediación en laboratorio y andamiaje práctico:",
    "accionesConcretas": [
      "Acción práctica 1 para nivelar a los ${estudiantesAcompaniamiento.length} estudiantes en rezago",
      "Acción práctica 2",
      "Acción práctica 3",
      "Acción práctica 4"
    ]
  },
  "ajustesSaberActitudinal": {
    "titulo": "Ajustes al Saber Actitudinal (Pensamiento Crítico, Perseverancia y Aprendizaje del Error)",
    "descripcion": "Promoción de cultura de aprendizaje y gestión positiva del error:",
    "accionesConcretas": [
      "Estrategia socioemocional 1",
      "Estrategia socioemocional 2",
      "Estrategia socioemocional 3"
    ]
  },
  "orientacionPlaneamientoDidactico": {
    "fundamentacion": "Fundamentación pedagógica contundente sobre cómo articular estos resultados del diagnóstico en el planeamiento de aula.",
    "pasosIntegracionPlaneamiento": [
      "1. Columna de Estrategias de Mediación: ...",
      "2. Diferenciación Pedagógica (DUA): ...",
      "3. Ajuste de Tiempos y Ritmos de Laboratorio: ...",
      "4. Vinculación con Indicadores de Logro: ..."
    ],
    "llamadoAccion": "⚠️ OBLIGATORIEDAD PEDAGÓGICA: Integra estas recomendaciones en tu próximo planeamiento didáctico para garantizar que la mediación responda con equidad al diagnóstico realizado."
  },
  "estudiantesPrioritarios": [
    {
      "nombre": "Nombre del estudiante",
      "puntaje": 45,
      "accionFocalizada": "Estrategia individual y andamiaje específico"
    }
  ]
}`;

    const systemInstruction = `Eres un Asesor Pedagógico Senior en Educación Secundaria (9° año) y Formación Tecnológica. Generas diagnósticos pedagógicos basados estrictamente en datos reales de telemetría de aula. Devuelves siempre JSON válido sin delimitadores de markdown.`;

    const aiRes = await ejecutarCascadaIA(prompt, systemInstruction);

    if (!aiRes.success) {
      return NextResponse.json(
        { error: "No se pudo generar el análisis pedagógico con IA.", detalles: aiRes.errorDetails },
        { status: 503 }
      );
    }

    let parsedData;
    try {
      const cleanContent = aiRes.content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      parsedData = JSON.parse(cleanContent);
    } catch {
      return NextResponse.json(
        {
          error: "Error al interpretar la respuesta estructurada de la IA.",
          rawContent: aiRes.content,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      meta: {
        providerUsed: aiRes.providerUsed,
        modelUsed: aiRes.modelUsed,
        latencyMs: aiRes.latencyMs,
        cached: aiRes.cached,
        fechaGeneracion: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
