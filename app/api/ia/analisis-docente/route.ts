import { NextRequest, NextResponse } from "next/server";
import { ejecutarCascadaIA } from "@/lib/aiResilience";

export const dynamic = "force-dynamic";

interface EstudianteData {
  id?: string;
  nombre: string;
  seccion: string;
  evaluado?: boolean;
  horaEntrega?: string;
  cog?: string[];
  psi?: string[];
  soc?: string[];
  obsPsiGeneral?: string;
  obsSocGeneral?: string;
  descripcionDesempeno?: string;
  retosPracticos?: any;
  reflexionParteC?: any;
}

function generarAnalisisDocenteContextual(params: {
  estudiantes: EstudianteData[];
  seccion: string;
  docente?: string;
}) {
  const { estudiantes, seccion } = params;
  const total = estudiantes.length;

  if (total === 0) {
    return {
      resumenEjecutivo: "No hay estudiantes registrados en la nómina actualmente.",
      sintesisCognitiva: "Sin datos cognitivos registrados.",
      sintesisPsicomotora: "Sin datos psicomotores registrados.",
      sintesisSocioafectiva: "Sin datos socioafectivos registrados.",
      orientacionDUA: "Incorpore estudiantes a la nómina para generar el análisis.",
      estudiantesAcompaniamiento: [],
    };
  }

  // Cálculos reales
  let totalCogL = 0, totalCogED = 0, totalCogRA = 0;
  let totalPsiA = 0, totalPsiB = 0, totalPsiC = 0;
  let totalSocA = 0, totalSocB = 0, totalSocC = 0;

  const rezagados: Array<{ nombre: string; seccion: string; motivo: string; accionSugerida: string }> = [];

  estudiantes.forEach((e) => {
    const cog = e.cog || Array(10).fill("ED");
    const psi = e.psi || Array(6).fill("A");
    const soc = e.soc || Array(7).fill("A");

    const cL = cog.filter((x) => x === "L").length;
    const cRA = cog.filter((x) => x === "RA").length;
    const pC = psi.filter((x) => x === "C").length;
    const sC = soc.filter((x) => x === "C").length;

    totalCogL += cL;
    totalCogED += cog.filter((x) => x === "ED").length;
    totalCogRA += cRA;

    totalPsiA += psi.filter((x) => x === "A").length;
    totalPsiB += psi.filter((x) => x === "B").length;
    totalPsiC += pC;

    totalSocA += soc.filter((x) => x === "A").length;
    totalSocB += soc.filter((x) => x === "B").length;
    totalSocC += sC;

    if (cRA >= 4 || pC >= 2 || sC >= 2) {
      let motivos: string[] = [];
      if (cRA >= 4) motivos.push(`${cRA}/10 indicadores cognitivos en RA`);
      if (pC >= 2) motivos.push(`${pC}/6 conductas psicomotoras en Nivel C`);
      if (sC >= 2) motivos.push(`${sC}/7 conductas socioafectivas en Nivel C (gestión del error/frustración)`);

      rezagados.push({
        nombre: e.nombre,
        seccion: e.seccion || seccion,
        motivo: motivos.join("; "),
        accionSugerida: sC >= 2
          ? "Andamiaje socioemocional ante el error, modelado guiado paso a paso y trabajo en parejas colaborativas."
          : "Tutoría entre pares en simulador 2D y guía de conexión visual de pines VCC/GND/A0.",
      });
    }
  });

  const totalItemsCog = total * 10;
  const porcCogL = Math.round((totalCogL / totalItemsCog) * 100);
  const porcCogRA = Math.round((totalCogRA / totalItemsCog) * 100);

  const totalItemsPsi = total * 6;
  const porcPsiA = Math.round((totalPsiA / totalItemsPsi) * 100);
  const porcPsiC = Math.round((totalPsiC / totalItemsPsi) * 100);

  const totalItemsSoc = total * 7;
  const porcSocA = Math.round((totalSocA / totalItemsSoc) * 100);
  const porcSocC = Math.round((totalSocC / totalItemsSoc) * 100);

  // Síntesis contextuales realistas
  const sintesisCognitiva = porcCogL >= 70
    ? `Fortaleza general en conceptos de automatización (${porcCogL}% Logrado). Acciones: Profundizar en lógica algorítmica y Ley de Ohm cualitativa con retos de ampliación.`
    : `Se requiere andamiaje en conceptos clave (${porcCogRA}% en Requiere Acompañamiento). Acciones: Taller guiado sobre microcontroladores (Ind 1), polaridad 5V/GND (Ind 4) y circuito cerrado (Ind 7).`;

  const sintesisPsicomotora = porcPsiA >= 70
    ? `Destreza adecuada en el conexionado y organización espacial (${porcPsiA}% Nivel A). Acciones: Estimular autonomía progresiva y montaje en protoboard real.`
    : `Identificación de dificultades en conexionado de pines y polaridad (${porcPsiC}% Nivel C). Acciones: Fichas nemotécnicas de pines y ensamble guiado paso a paso.`;

  const sintesisSocioafectiva = porcSocA >= 70
    ? `Excelente clima de trabajo, persistencia y actitud ante el reto (${porcSocA}% Nivel A). Acciones: Fomentar liderazgo constructivo y co-evaluación solidaria.`
    : `Alerta formativa en autorregulación y gestión del error (${porcSocC}% Nivel C / Acompañamiento). Acciones: Fortalecer la cultura 'el error como dato de aprendizaje' y dinámicas de perseverancia técnica.`;

  return {
    resumenEjecutivo: `Evaluación 360° para la sección ${seccion} (${total} estudiantes). Dimensión Cognitiva: ${porcCogL}% Logrado; Psicomotora: ${porcPsiA}% Nivel A; Socioafectiva: ${porcSocA}% Nivel A. Se detectan ${rezagados.length} estudiantes con requerimiento de acompañamiento prioritario.`,
    sintesisCognitiva,
    sintesisPsicomotora,
    sintesisSocioafectiva,
    orientacionDUA: `Articular en las Estrategias de Mediación del Planeamiento Didáctico Oficial: 1) Principio DUA de Múltiples formas de representación mediante esquemas visuales de pines; 2) Principio DUA de Múltiples formas de acción mediante simulador 2D con intentos ilimitados; 3) Clima socioemocional positivo desestigmatizando el error técnico.`,
    estudiantesAcompaniamiento: rezagados,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      estudiantes = [],
      seccion = "Todas las Secciones",
      docente = "Docente Evaluador",
      indicador = "Diagnóstico 9° Módulo 1 («Aula Inteligente»)",
    } = body;

    const fallbackData = generarAnalisisDocenteContextual({
      estudiantes,
      seccion,
      docente,
    });

    if (!estudiantes || estudiantes.length === 0) {
      return NextResponse.json({
        success: true,
        data: fallbackData,
        meta: { providerUsed: "fallback", modelUsed: "Motor Pedagógico MEP", latencyMs: 5 },
      });
    }

    // Resumen estadístico detallado para el prompt
    let totalEst = estudiantes.length;
    let cogSummary = { L: 0, ED: 0, RA: 0 };
    let psiSummary = { A: 0, B: 0, C: 0 };
    let socSummary = { A: 0, B: 0, C: 0 };

    estudiantes.forEach((e: EstudianteData) => {
      (e.cog || []).forEach((c) => { if (c === "L") cogSummary.L++; else if (c === "RA") cogSummary.RA++; else cogSummary.ED++; });
      (e.psi || []).forEach((p) => { if (p === "A") psiSummary.A++; else if (p === "C") psiSummary.C++; else psiSummary.B++; });
      (e.soc || []).forEach((s) => { if (s === "A") socSummary.A++; else if (s === "C") socSummary.C++; else socSummary.B++; });
    });

    const prompt = `Analiza los siguientes RESULTADOS REALES DE OBSERVACIÓN Y EVALUACIÓN FORMATIVA DOCENTE (360°) para 9° Año de Secundaria (${indicador}):

CONTEXTO:
- Sección/Grupo: ${seccion}
- Evaluador: ${docente}
- Total estudiantes evaluados: ${totalEst}

DESGLOSE REAL DE DATOS OBSERVADOS:
1. 🧠 ÁREA COGNITIVA (10 Indicadores de Logro):
   * Logrado (L): ${cogSummary.L} respuestas
   * En Desarrollo (ED): ${cogSummary.ED} respuestas
   * Requiere Acompañamiento (RA): ${cogSummary.RA} respuestas

2. 🖐️ ÁREA PSICOMOTORA (6 Conductas de Taller):
   * Nivel A (Autónomo): ${psiSummary.A}
   * Nivel B (Con Apoyo): ${psiSummary.B}
   * Nivel C (Requiere Acompañamiento): ${psiSummary.C}

3. ❤️ ÁREA SOCIOAFECTIVA (7 Conductas Actitudinales: Gestión del error, perseverancia, resiliencia, colaboración):
   * Nivel A (Consistente): ${socSummary.A}
   * Nivel B (Intermitente): ${socSummary.B}
   * Nivel C (Requiere Acompañamiento Prioritario): ${socSummary.C}

MUESTRA DE REGISTROS POR ESTUDIANTE:
${JSON.stringify(
  estudiantes.map((e: EstudianteData) => ({
    nombre: e.nombre,
    seccion: e.seccion,
    cog: e.cog,
    psi: e.psi,
    soc: e.soc,
    obsDocente: e.obsSocGeneral || e.obsPsiGeneral || e.descripcionDesempeno || "",
  })),
  null,
  2
)}

INSTRUCCIÓN ESPECIAL:
Si observas estudiantes con calificaciones bajas en el área socioafectiva (Nivel C en S1-S7) o cognitiva (RA en Ind 1-10), DEBES DESTACARLO EXPLÍCITAMENTE y proponer acciones pedagógicas y socioemocionales concretas para atender esa debilidad en la síntesis y en el plan individual.

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "resumenEjecutivo": "Síntesis formal del desempeño global del grupo en las 3 dimensiones (2-3 oraciones).",
  "sintesisCognitiva": "Diagnóstico específico de la dimensión cognitiva con porcentajes reales y acciones concretas de nivelación.",
  "sintesisPsicomotora": "Diagnóstico específico de la dimensión psicomotora con destrezas observadas y estrategias de taller.",
  "sintesisSocioafectiva": "Diagnóstico específico de la dimensión socioafectiva reflejando con exactitud si hubo niveles bajos (C) o altos (A) en gestión de frustración, resiliencia y actitud.",
  "orientacionDUA": "Orientación para el Planeamiento Didáctico Oficial MEP aplicando principios DUA según las brechas detectadas.",
  "estudiantesAcompaniamiento": [
    {
      "nombre": "Nombre del estudiante con rezago",
      "motivo": "Explicación de sus dificultades en las áreas evaluadas",
      "accionSugerida": "Acción individualizada de acompañamiento y mediación"
    }
  ],
  "descripcionesIndividuales": {
    "Nombre del Estudiante": "Texto personalizado de 1-2 oraciones para la casilla de descripción y acompañamiento individual."
  }
}`;

    const systemInstruction = `Eres un Asesor Pedagógico Especialista en Formación Tecnológica y Evaluación Formativa del MEP. Tu misión es analizar datos reales de evaluación en 3 dimensiones (cognitiva, psicomotora y socioafectiva) y emitir diagnósticos y planes de acompañamiento pedagógico de alta precisión, respetando los datos numéricos reales. Devuelve SIEMPRE JSON puro sin formato markdown.`;

    const aiRes = await ejecutarCascadaIA(prompt, systemInstruction);

    if (!aiRes.success || aiRes.providerUsed === "fallback") {
      return NextResponse.json({
        success: true,
        data: fallbackData,
        meta: {
          providerUsed: "fallback",
          modelUsed: "Motor Pedagógico MEP (Resiliencia en Cascada)",
          latencyMs: aiRes.latencyMs || 10,
          cached: false,
        },
      });
    }

    let parsedData = null;
    try {
      let rawText = aiRes.content.trim();
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) rawText = jsonMatch[0];
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = null;
    }

    const finalData = parsedData || fallbackData;

    return NextResponse.json({
      success: true,
      data: finalData,
      meta: {
        providerUsed: aiRes.providerUsed,
        modelUsed: aiRes.modelUsed,
        latencyMs: aiRes.latencyMs,
        cached: aiRes.cached,
        fechaGeneracion: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error al procesar análisis con IA",
      },
      { status: 500 }
    );
  }
}
