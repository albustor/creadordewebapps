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
Tu tarea es analizar minuciosamente el indicador de logro curricular de secundaria y generar un archivo HTML ÚNICO (.html) completo, autónomo, responsivo y sin dependencias CDN externas.
El código debe incluir CSS embebido en <style> y JavaScript embebido en <script>, estructurado en 4 fases: 1. Aprender (saber conceptual), 2. Comprender (con reactivos interactivos situados en el indicador), 3. Simulación práctica en Canvas 60 FPS o interactivo acorde a la mecánica, y 4. Valoración con envío de telemetría a Google Apps Script y REST.
Devuelve EXCLUSIVAMENTE el código HTML dentro de un bloque \`\`\`html ... \`\`\`.`;

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
