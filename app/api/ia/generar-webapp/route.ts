import { NextRequest, NextResponse } from "next/server";
import { ejecutarCascadaIA } from "@/lib/aiResilience";
import {
  generarPromptParaIAExterna,
  generarCodigoHTMLAutonomo,
  OpcionesGeneracionWebApp,
} from "@/lib/generadorWebAppEngine";

export async function POST(req: NextRequest) {
  try {
    const opts: OpcionesGeneracionWebApp = await req.json();

    if (!opts || !opts.indicadorCodigo) {
      return NextResponse.json(
        { error: "Opciones curriculares incompletas" },
        { status: 400 }
      );
    }

    // 1. Construir prompt pedagógico estructurado para la IA
    const promptPedagogico = generarPromptParaIAExterna(opts);
    const systemInstruction = `Eres un desarrollador web experto y diseñador instruccional de vanguardia.
Tu tarea es analizar minuciosamente el indicador de logro curricular de secundaria [${opts.indicadorCodigo}] ${opts.indicadorNombre} y generar un archivo HTML ÚNICO (.html) completo, autónomo, responsivo y sin dependencias CDN externas.

REGLAS PEDAGÓGICAS Y TÉCNICAS OBLIGATORIAS:
1. Fase 1 (Aprender): Explicación clara y profunda de ${opts.saberConceptual}, apoyos visuales y tarjetas para saber procedimental (${opts.saberProcedimental || 'Aplica y analiza'}) y saber actitudinal (${opts.saberActitudinal || 'Gusto por la precisión'}).
2. Fase 2 (Comprender): Debe contener exactamente al menos 4 casos y reactivos situados en la vida real/hogar/comunidad del estudiante, evaluando progresivamente lo deseable en el indicador. Incluye retroalimentación pedagógica y sonido procedural Web Audio API.
3. Fase 3 (Simulación interactiva): Diseña un simulador interactivo ORIGINAL y 100% funcional en Canvas 60 FPS o DOM interactivo, propuesto directamente desde el análisis de la intención de logro de este indicador (sin recetas prefabricadas ni plantillas fijas), donde el estudiante manipule los parámetros y resuelva el reto.
4. Fase 4 (Valoración): Rúbrica formativa según niveles de logro y envío de telemetría a Google Apps Script (${opts.urlGoogleScript || 'CONFIG.urlGoogleScript'}) y REST con modo no-cors.

Devuelve EXCLUSIVAMENTE el código HTML dentro de un solo bloque \`\`\`html ... \`\`\`.`;

    // 2. Ejecutar la cascada de resiliencia multi-proveedor
    const aiResult = await ejecutarCascadaIA(promptPedagogico, systemInstruction);

    let htmlFinal = "";

    // 3. Extraer HTML del contenido de IA si tuvo éxito
    if (aiResult.success && aiResult.content && aiResult.providerUsed !== "fallback") {
      const matchHtml = aiResult.content.match(/```html([\s\S]*?)```/i);
      if (matchHtml && matchHtml[1]) {
        htmlFinal = matchHtml[1].trim();
      } else if (aiResult.content.includes("<!DOCTYPE html>") || aiResult.content.includes("<html")) {
        const start = aiResult.content.indexOf("<!DOCTYPE html>") !== -1 
          ? aiResult.content.indexOf("<!DOCTYPE html>") 
          : aiResult.content.indexOf("<html");
        const end = aiResult.content.lastIndexOf("</html>");
        if (start !== -1 && end !== -1) {
          htmlFinal = aiResult.content.slice(start, end + 7).trim();
        }
      }
    }

    // 4. Si la IA no devolvió un HTML completo o se activó fallback, usar el motor autónomo ultra-optimizado
    if (!htmlFinal || htmlFinal.length < 500) {
      htmlFinal = generarCodigoHTMLAutonomo(opts);
    }

    return NextResponse.json({
      success: true,
      html: htmlFinal,
      providerUsed: aiResult.providerUsed,
      modelUsed: aiResult.modelUsed,
      latencyMs: aiResult.latencyMs,
      cached: aiResult.cached,
    });
  } catch (error: any) {
    console.error("Error en generar-webapp:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error en la generación de WebApp",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
