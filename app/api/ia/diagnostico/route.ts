import { NextRequest, NextResponse } from "next/server";
import { ejecutarCascadaIA } from "@/lib/aiResilience";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { textoDocumento, nivelPreferido, observacionesDocente } = await req.json();

    if (!textoDocumento || typeof textoDocumento !== "string" || !textoDocumento.trim()) {
      return NextResponse.json(
        { error: "Se requiere el contenido de texto del documento para realizar el diagnóstico." },
        { status: 400 }
      );
    }

    const systemInstruction = `Eres un Asesor Pedagógico Senior y Diseñador Instruccional Especialista en Formación Tecnológica y Evaluación Diagnóstica Integral para Educación Secundaria (III Ciclo: 7°, 8° y 9° año).
Tu tarea es analizar el documento, instrumento de evaluación o planeamiento curricular proporcionado por el docente y generar una PROPUESTA DE DIAGNÓSTICO INTEGRAL 360° basada ESTRICTAMENTE en los elementos y contenidos presentes en el documento.

Debes interpretar y extraer con máxima fidelidad las 3 DIMENSIONES CURRICULARES FUNDAMENTALES:
1. 🧠 DIMENSIÓN COGNITIVA / CONCEPTUAL: Saberes conceptuales, conceptos previos, preguntas de comprobación estructuradas con distractores verosímiles y retroalimentación formativa inmediata.
2. ⚙️ DIMENSIÓN PROCEDIMENTAL: Habilidades prácticas de pensamiento computacional (modularización, formulación de secuencias/algoritmos, depuración de errores, simulación interactiva).
3. ❤️ DIMENSIÓN SOCIOAFECTIVA Y SOCIOACTITUDINAL: Criterios observables de actitud ante el desafío, resiliencia/gestión constructiva del error, perseverancia, colaboración y empatía entre pares, autonomía y autorregulación del tiempo de trabajo, y autocuidado/responsabilidad digital.

Adicionalmente, debes:
- Proponer "Mejoras Pedagógicas Previas" para que el docente las revise y valide antes de compilar la WebApp.
- Estructurar el "Instrumento de Evaluación Diagnóstica" con dos visiones complementarias:
  a) Rúbrica Transparente para el Estudiante (visible en la pestaña de la WebApp).
  b) Escala de Observación Diagnóstica para el Docente (para registrar en el Dashboard los aspectos socioafectivos).
- Expresar con contundencia la importancia de articular estos hallazgos en las Estrategias de Mediación del Planeamiento Didáctico Oficial (incorporando principios DUA).

Debes responder SIEMPRE en formato JSON VÁLIDO con la siguiente estructura exacta:
{
  "tituloSugerido": "Título atractivo, claro y pedagógico para la WebApp Diagnóstica",
  "nivelEducativo": "7° Año - Secundaria" (o "8° Año - Secundaria" o "9° Año - Secundaria"),
  "areaConocimiento": "Una de: 'Apropiación Tecnológica y Digital', 'Programación y Algoritmos', 'Computación Física y Robótica', 'Ciencia de Datos e Inteligencia Artificial'",
  
  "dimensionCognitiva": {
    "saberConceptual": "Concepto o saber clave extraído del documento",
    "explicacionComprensible": "Explicación clara para estudiantes de 12 a 15 años con una analogía del mundo real",
    "prerrequisitosDetectados": ["Prerrequisito 1", "Prerrequisito 2"]
  },

  "dimensionProcedimental": {
    "saberProcedimental": "Habilidad o destreza práctica observable (ej: Formula algoritmos paso a paso, depura secuencias)",
    "mecanicaSugerida": "Una de: 'Simulador interactivo', 'Quiz gamificado', 'Aventura gráfica', 'Tablero de retos'",
    "modo": "Individual" o "Parejas",
    "retoPractico": "Descripción del reto procedimental que el estudiante resolverá en la simulación"
  },

  "dimensionSocioafectiva": {
    "saberActitudinal": "Actitud fundamental (ej: Perseverancia, gusto por la precisión y aprender del error)",
    "criteriosObservables": [
      "Gestiona el error en la simulación como oportunidad de aprendizaje sin desmotivación.",
      "Muestra autonomía en la resolución de problemas y solicita apoyo oportuno.",
      "Manifiesta disposición a compartir estrategias y colaborar respetuosamente con sus pares.",
      "Demuestra responsabilidad y autorregulación en el uso del tiempo y herramientas digitales."
    ]
  },

  "indicadorLogro": {
    "codigo": "Código del indicador (ej: 7.PR.01, 8.ROB.02, 9.IA.01)",
    "nombre": "Nombre del indicador curricular de Trabajo Cotidiano y Diagnóstico"
  },

  "resumenDiagnostico": "Explicación concisa (2-3 oraciones) de cómo se articuló el contenido del documento en esta propuesta diagnóstica",

  "mejorasPedagogicasPrevias": [
    {
      "area": "Cognitiva" | "Procedimental" | "Socioafectiva" | "DUA",
      "sugerencia": "Recomendación de ajuste o mejora antes de publicar la WebApp",
      "impactoEsperado": "Beneficio formativo en el estudiante"
    }
  ],

  "ideasAjustesPedagogicos": {
    "saberConceptual": ["Ajuste conceptual 1", "Ajuste conceptual 2"],
    "saberProcedimental": ["Ajuste procedimental 1", "Ajuste procedimental 2"],
    "saberActitudinal": ["Ajuste actitudinal 1", "Ajuste actitudinal 2"],
    "indicadorLogro": ["Ajuste de evidencia 1", "Ajuste de evidencia 2"]
  },

  "importanciaIntegracionPlaneamiento": "Texto formal contundente que fundamente por qué los resultados de esta doble valoración (conceptual de la WebApp + socioafectiva del docente) deben incorporarse en las Estrategias de Mediación del Planeamiento Didáctico Oficial (DUA) para nivelar y contextualizar el aprendizaje.",

  "preguntasComprender": [
    {
      "pregunta": "¿Pregunta conceptual de comprobación extraída del documento?",
      "opciones": ["Opción correcta", "Distractor plausible 1", "Distractor plausible 2"],
      "correcta": 0,
      "explicacion": "Justificación formativa de por qué es la respuesta correcta"
    },
    {
      "pregunta": "¿Segunda pregunta de aplicación conceptual?",
      "opciones": ["Opción correcta", "Distractor plausible 1", "Distractor plausible 2"],
      "correcta": 0,
      "explicacion": "Justificación formativa"
    }
  ],

  "parametrosSimulacion": {
    "nombreVariable": "Nombre del parámetro o elemento a manipular en la simulación",
    "rangoOptimo": "40 a 80 (o valores válidos)",
    "instruccion": "Instrucción clara de lo que debe realizar el estudiante en la fase de simulación"
  },

  "instrumentoEvaluacion": {
    "criterioCognitivo": "Criterio de desempeño conceptual para el estudiante",
    "criterioProcedimental": "Criterio de desempeño procedimental en la simulación",
    "criterioSocioafectivo": "Criterio de actitud, perseverancia y colaboración en el aula",
    "escalas": {
      "acompanamiento": "Requiere andamiaje constante y reexplicación de conceptos básicos (<60%)",
      "desarrollo": "Aplica conceptos y resuelve retos con apoyo ocasional (60-79%)",
      "consolidado": "Demuestra autonomía, precisión y autorregulación óptima (≥80%)"
    }
  }
}`;

    const promptUsuario = `Analiza detalladamente el siguiente documento, planeamiento curricular o instrumento de evaluación presentado por el docente para III Ciclo de Secundaria:

--- INICIO DEL DOCUMENTO ---
${textoDocumento.slice(0, 8000)}
--- FIN DEL DOCUMENTO ---

${nivelPreferido ? `Preferencia de Nivel del Docente: ${nivelPreferido}` : ""}
${observacionesDocente ? `Observaciones o Énfasis adicionales del Docente: ${observacionesDocente}` : ""}

Genera la Propuesta de Diagnóstico Integral 360°, las 3 Dimensiones Curriculares, las Mejoras Pedagógicas Previas y el Instrumento de Evaluación Oficial en formato JSON válido.`;

    const respuestaIA = await ejecutarCascadaIA(promptUsuario, systemInstruction);

    let diagnosticoJSON: any = null;
    try {
      const cleaned = respuestaIA.content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      diagnosticoJSON = JSON.parse(cleaned);
    } catch (parseError) {
      diagnosticoJSON = {
        tituloSugerido: "Laboratorio Diagnóstico Integral de Secundaria",
        nivelEducativo: nivelPreferido || "7° Año - Secundaria",
        areaConocimiento: "Programación y Algoritmos",
        dimensionCognitiva: {
          saberConceptual: "Algoritmos, Estructuras y Lógica Secuencial",
          explicacionComprensible: "Un algoritmo es como una receta detallada: una serie finita, ordenada y precisa de pasos para resolver una tarea o problema.",
          prerrequisitosDetectados: ["Comprensión lectora de instrucciones", "Nociones básicas de secuencia temporal"]
        },
        dimensionProcedimental: {
          saberProcedimental: "Formula algoritmos, modulariza problemas y depura errores en simulaciones interactivas",
          mecanicaSugerida: "Simulador interactivo",
          modo: "Individual",
          retoPractico: "Ajustar las variables de ejecución para guiar el flujo algorítmico sin colisiones ni bucles infinitos."
        },
        dimensionSocioafectiva: {
          saberActitudinal: "Gusto por la precisión, perseverancia y aprendizaje reflexivo a partir del error",
          criteriosObservables: [
            "Muestra tolerancia a la frustración y persevera al depurar fallos en la simulación.",
            "Trabaja con autonomía y solicita orientaciones específicas cuando lo requiere.",
            "Respeta las ideas y ritmos de aprendizaje de sus compañeros durante la puesta en común.",
            "Demuestra hábitos de autorregulación y cuidado en el uso del equipo tecnológico."
          ]
        },
        indicadorLogro: {
          codigo: "7.PR.01",
          nombre: "Estructura y características esenciales del algoritmo en la resolución de problemas"
        },
        resumenDiagnostico: "Propuesta diagnóstica integral estructurada a partir del documento del docente, articulando la comprensión conceptual con la práctica algorítmica y la observación socioafectiva.",
        mejorasPedagogicasPrevias: [
          {
            area: "DUA",
            sugerencia: "Incorporar pistas visuales y conmutador de contraste para estudiantes que requieren apoyo en la lectura de instrucciones.",
            impactoEsperado: "Mayor accesibilidad y equidad en la ejecución autónoma."
          },
          {
            area: "Socioafectiva",
            sugerencia: "Fomentar un momento de cierre reflexivo donde el estudiante explique cómo superó una dificultad durante la simulación.",
            impactoEsperado: "Desarrollo de la metacognición y resiliencia ante el error."
          }
        ],
        ideasAjustesPedagogicos: {
          saberConceptual: [
            "Vincular el concepto de algoritmo con ejemplos cotidianos (recetas, rutas, instrucciones estructuradas).",
            "Utilizar organizadores visuales y analogías concretas para afianzar el pensamiento computacional."
          ],
          saberProcedimental: [
            "Descomponer la formulación de algoritmos en pasos guiados paso a paso con andamiaje en parejas.",
            "Permitir múltiples intentos en el simulador para aprender de los errores lógicos sin penalización punitiva."
          ],
          saberActitudinal: [
            "Fomentar la perseverancia y la tolerancia a la frustración ante errores de ejecución.",
            "Promover la co-evaluación constructiva entre estudiantes."
          ],
          indicadorLogro: [
            "Verificar que cada estudiante logre explicar la secuencia lógica antes de pasar a retos complejos.",
            "Registrar evidencias formativas continuas del proceso de resolución."
          ]
        },
        importanciaIntegracionPlaneamiento: "IMPORTANCIA CRÍTICA: Los resultados de esta doble valoración (la telemetría conceptual de la WebApp sumada a la observación docente socioafectiva) deben trasladarse directamente a las Estrategias de Mediación del planeamiento didáctico oficial. Esto permite al docente diseñar andamiajes diversificados (DUA) y nivelar saberes previos antes de abordar los contenidos de mayor complejidad.",
        preguntasComprender: [
          {
            pregunta: "¿Qué característica fundamental debe tener un algoritmo para ser funcional?",
            opciones: ["Debe ser finito, ordenado y con pasos precisos", "Debe ser aleatorio e impredecible", "No requiere datos de entrada ni salida"],
            correcta: 0,
            explicacion: "Un algoritmo requiere siempre un número finito de pasos ordenados para garantizar un resultado consistente."
          },
          {
            pregunta: "Cuando un programa presenta un fallo lógico, ¿cuál es la acción adecuada?",
            opciones: ["Depurar analizando la secuencia paso a paso", "Borrar todo el código sin analizar", "Ignorar el error si la pantalla no se apaga"],
            correcta: 0,
            explicacion: "La depuración consiste en rastrear el flujo de ejecución para identificar y corregir el origen del error."
          }
        ],
        parametrosSimulacion: {
          nombreVariable: "Flujo de Secuencia",
          rangoOptimo: "40 a 80",
          instruccion: "Ajusta la secuencia de pasos lógicos en el simulador para completar la tarea con precisión."
        },
        instrumentoEvaluacion: {
          criterioCognitivo: "Identifica y explica los conceptos fundamentales y la estructura lógica de los algoritmos.",
          criterioProcedimental: "Aplica secuencias lógicas y depura errores en el simulador interactivo.",
          criterioSocioafectivo: "Demuestra perseverancia ante el error, autonomía y disposición para colaborar en el aula.",
          escalas: {
            acompanamiento: "Requiere andamiaje constante y reexplicación de conceptos básicos (<60%).",
            desarrollo: "Aplica conceptos y resuelve retos con apoyo ocasional (60-79%).",
            consolidado: "Demuestra autonomía, precisión y autorregulación óptima (≥80%)."
          }
        }
      };
    }

    // Normalizar compatibilidad hacia atrás
    if (diagnosticoJSON.dimensionCognitiva && !diagnosticoJSON.saberConceptual) {
      diagnosticoJSON.saberConceptual = diagnosticoJSON.dimensionCognitiva.saberConceptual;
      diagnosticoJSON.explicacionComprensible = diagnosticoJSON.dimensionCognitiva.explicacionComprensible;
    }
    if (diagnosticoJSON.dimensionProcedimental && !diagnosticoJSON.saberProcedimental) {
      diagnosticoJSON.saberProcedimental = diagnosticoJSON.dimensionProcedimental.saberProcedimental;
      diagnosticoJSON.mecanicaSugerida = diagnosticoJSON.dimensionProcedimental.mecanicaSugerida;
      diagnosticoJSON.modo = diagnosticoJSON.dimensionProcedimental.modo;
    }
    if (diagnosticoJSON.dimensionSocioafectiva && !diagnosticoJSON.saberActitudinal) {
      diagnosticoJSON.saberActitudinal = diagnosticoJSON.dimensionSocioafectiva.saberActitudinal;
    }
    if (diagnosticoJSON.indicadorLogro && !diagnosticoJSON.indicadorCodigo) {
      diagnosticoJSON.indicadorCodigo = diagnosticoJSON.indicadorLogro.codigo;
      diagnosticoJSON.indicadorNombre = diagnosticoJSON.indicadorLogro.nombre;
    }
    if (diagnosticoJSON.instrumentoEvaluacion && !diagnosticoJSON.rubricaCotidiano) {
      diagnosticoJSON.rubricaCotidiano = {
        inicial: diagnosticoJSON.instrumentoEvaluacion.escalas?.acompanamiento || "En Acompañamiento",
        intermedio: diagnosticoJSON.instrumentoEvaluacion.escalas?.desarrollo || "En Desarrollo",
        avanzado: diagnosticoJSON.instrumentoEvaluacion.escalas?.consolidado || "Consolidado"
      };
    }

    return NextResponse.json({
      success: true,
      providerUsed: respuestaIA.providerUsed,
      modelUsed: respuestaIA.modelUsed,
      latencyMs: respuestaIA.latencyMs,
      diagnostico: diagnosticoJSON,
    });
  } catch (error: any) {
    console.error("Error en API de diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al procesar el diagnóstico del documento", details: error?.message },
      { status: 500 }
    );
  }
}

