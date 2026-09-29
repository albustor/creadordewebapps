import { NextRequest, NextResponse } from "next/server";
import { ejecutarCascadaIA } from "@/lib/aiResilience";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nivel = "TODOS",
      totalEstudiantes = 0,
      totalInstituciones = 0,
      promedioNacional = 55,
      eval7mo = 0,
      eval9no = 0,
      cobertura = 0,
      filtroDRE = "TODAS",
      indicadores = [],
    } = body;

    const prompt = `
Actúa como Asesor Nacional de Formación Tecnológica del Ministerio de Educación Pública (MEP) de Costa Rica.
Genera un dictamen y análisis curricular macro ejecutivo para el Administrador General (Alberto Bustos Ortega).

Datos del Observatorio Macro Nacional de III Ciclo (7.° y 9.° Año):
- Nivel auditado: ${nivel === "TODOS" ? "Consolidado III Ciclo (7.° y 9.° Año)" : nivel === "7mo" ? "7.° Año" : "9.° Año"}
- Cobertura territorial: ${filtroDRE === "TODAS" ? "27 Direcciones Regionales de Educación (Nacional)" : `Dirección Regional ${filtroDRE}`}
- Centros Educativos Participantes: ${totalInstituciones}
- Total de Estudiantes Diagnosticados: ${totalEstudiantes} (7.° Año: ${eval7mo} | 9.° Año: ${eval9no})
- Promedio Global de Logro Nacional: ${promedioNacional}%
- Tasa de Cobertura Institucional: ${cobertura}%

Muestra de Indicadores y Estado Curricular:
${indicadores.map((ind: any) => `- [${ind.codigo}] ${ind.nombre}: ${ind.pctLogro || promedioNacional}% (${ind.estado || "En desarrollo"})`).slice(0, 10).join("\n")}

Por favor responde en formato JSON estrictamente válido con la siguiente estructura:
{
  "tituloDictamen": "Título formal del dictamen ejecutivo MEP",
  "diagnosticoGeneral": "Resumen ejecutivo del estado de entrada de los estudiantes en Formación Tecnológica...",
  "focosCriticos": [
    "Foco crítico 1 con justificación curricular...",
    "Foco crítico 2 con justificación curricular..."
  ],
  "orientacionesPedagogicas": [
    "Orientación 1 para las primeras 4 semanas de mediación didáctica en liceos...",
    "Orientación 2 sobre andamiaje en simuladores y microcontroladores...",
    "Orientación 3 sobre pensamiento computacional y DUA..."
  ],
  "circularSugeridaDocentes": "Texto breve listo para enviar como memorando/circular a los docentes de secundaria de las 27 DREs."
}
`;

    const systemInstruction = "Eres el motor de Inteligencia Artificial del Observatorio Curricular de Formación Tecnológica MEP de Costa Rica. Devuelve únicamente JSON válido.";

    const aiRes = await ejecutarCascadaIA(prompt, systemInstruction);

    if (aiRes.success) {
      try {
        const cleanContent = aiRes.content.replace(/```json\s*/gi, "").replace(/```\s*$/gi, "").trim();
        const parsed = JSON.parse(cleanContent);
        return NextResponse.json({
          success: true,
          analisis: parsed,
          providerUsed: aiRes.providerUsed,
          modelUsed: aiRes.modelUsed,
          latencyMs: aiRes.latencyMs,
        });
      } catch (jsonErr) {
        console.warn("Fallo al parsear JSON de IA, usando fallback estructurado:", jsonErr);
      }
    }

    // Fallback pedagógico contextual
    const fallbackAnalisis = {
      tituloDictamen: `Dictamen Curricular Nacional de Entrada • III Ciclo MEP (${nivel === "TODOS" ? "7.° y 9.° Año" : nivel})`,
      diagnosticoGeneral: `A nivel nacional (${filtroDRE === "TODAS" ? "27 DREs" : filtroDRE}), el diagnóstico de Formación Tecnológica refleja una línea base de ${promedioNacional}% en ${totalEstudiantes} estudiantes de secundaria evaluados. Se evidencia una apropiación conceptual sólida en herramientas digitales cotidianas, pero con necesidad de nivelación prioritaria en pensamiento algorítmico, lógica condicional y fundamentos de circuitos y microcontroladores.`,
      focosCriticos: [
        "Transición de conceptos cotidianos hacia la formulación estructurada de algoritmos y diagramas de flujo.",
        "Comprensión de magnitudes físicas y ley de Ohm en el conexionado de actuadores y sensores en 9.° Año.",
        "Gestión y jerarquía de archivos digitales junto a la comprensión del modelo Entrada-Proceso-Salida en 7.° Año."
      ],
      orientacionesPedagogicas: [
        "Priorizar las primeras 3 semanas del curso lectivo para el andamiaje desenchufado y modelado docente paso a paso.",
        "Implementar el trabajo en parejas de programación ('Driver/Navigator') para nivelar ritmos de aprendizaje.",
        "Integrar el Diseño Universal para el Aprendizaje (DUA) proveyendo tarjetas de apoyo nemotécnico y simulaciones sin penalización por error."
      ],
      circularSugeridaDocentes: `Estimados(as) Docentes de Formación Tecnológica de III Ciclo: Con base en los resultados del Diagnóstico de Entrada 2027 (${promedioNacional}% de logro nacional), se les insta a incorporar las estrategias de mediación focalizadas en algoritmos y arquitectura de control en sus planeamientos didácticos de las primeras unidades.`
    };

    return NextResponse.json({
      success: true,
      analisis: fallbackAnalisis,
      providerUsed: "fallback",
      modelUsed: "Protocolo Pedagógico DUA MEP",
      latencyMs: 15,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Error al procesar el dictamen macro." },
      { status: 500 }
    );
  }
}
