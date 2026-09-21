/**
 * Generador de Recomendaciones Pedagogicas y Ajustes Curriculares
 * Alineado a III Ciclo de Secundaria (7°, 8°, 9° Año), Saberes (Conceptual, Procedimental, Actitudinal)
 * e Indicadores de Logro de Trabajo Cotidiano y Diagnostico.
 */

export interface RecomendacionPedagogicaContext {
  nivel?: string; // 7° Año, 8° Año, 9° Año o Secundaria
  saberConceptual?: string;
  saberProcedimental?: string;
  saberActitudinal?: string;
  indicadorCodigo?: string;
  indicadorNombre?: string;
  porcentajePromedio?: number;
  tasaRezago?: number;
  esDiagnostico?: boolean;
  estudiantesRezago?: string[];
  mecanica?: string;
}

export interface RecomendacionesEstructuradas {
  ajustesSaberConceptual: {
    titulo: string;
    descripcion: string;
    accionesConcretas: string[];
  };
  ajustesSaberProcedimental: {
    titulo: string;
    descripcion: string;
    accionesConcretas: string[];
  };
  ajustesSaberActitudinal: {
    titulo: string;
    descripcion: string;
    accionesConcretas: string[];
  };
  ajustesIndicadorLogro: {
    indicador: string;
    criterioAjuste: string;
    estrategiasEvaluacionFormativa: string[];
  };
  orientacionPlaneamientoDidactico: {
    titulo: string;
    fundamentacion: string;
    pasosIntegracionPlaneamiento: string[];
    llamadoAccion: string;
  };
}

export function generarRecomendacionesPedagogicas(
  ctx: RecomendacionPedagogicaContext
): RecomendacionesEstructuradas {
  const nivelLimpio = ctx.nivel || "III Ciclo (Secundaria)";
  const saberConcept = ctx.saberConceptual || "Fundamentos y Conceptos Clave";
  const saberProc = ctx.saberProcedimental || "Aplicación, formulación y resolución práctica";
  const saberAct = ctx.saberActitudinal || "Perseverancia, rigor y aprendizaje del error";
  const indCod = ctx.indicadorCodigo || "SEC.COT.01";
  const indNom = ctx.indicadorNombre || "Demostración de desempeño en el trabajo cotidiano";
  const esDiag = !!ctx.esDiagnostico;
  const promedio = ctx.porcentajePromedio ?? 70;

  // Ajustes Conceptuales según nivel y contenido
  let conceptualAcciones: string[] = [];
  if (nivelLimpio.includes("7")) {
    conceptualAcciones = [
      `Vincular "${saberConcept}" con metáforas cotidianas y experiencias del entorno inmediato de jóvenes de 12-13 años.`,
      "Implementar organizadores gráficos y tarjetas de conceptos antes de interactuar con la simulación interactiva.",
      "Promover la formulación de preguntas guiadas ('¿Qué pasaría si...?') para verificar la comprensión de los términos antes de la práctica.",
    ];
  } else if (nivelLimpio.includes("8")) {
    conceptualAcciones = [
      `Profundizar en la relación de causa-efecto del concepto "${saberConcept}" mediante diagramas de flujo y modelos visuales.`,
      "Contrastar conceptos erróneos frecuentes detectados en la fase de 'Comprender' con ejemplos y contraejemplos guiados.",
      "Facilitar sesiones cortas de diálogo socrático donde los estudiantes expliquen el concepto con sus propias palabras.",
    ];
  } else {
    // 9° Año o General
    conceptualAcciones = [
      `Fomentar el análisis crítico y la abstracción del concepto "${saberConcept}" en sistemas y problemas de mayor complejidad.`,
      "Conectar el concepto con implicaciones éticas, sociales o tecnológicas del mundo contemporáneo.",
      "Desafiar a los estudiantes a sintetizar el concepto en esquemas modulares reutilizables.",
    ];
  }

  // Ajustes Procedimentales
  const procedimentalAcciones = [
    `Descomponer la tarea procedimental ("${saberProc}") en 3 micro-pasos guiados para estudiantes que obtuvieron <60%.`,
    "Implementar la técnica de 'Pensamiento en Voz Alta' en parejas, donde un estudiante explica el procedimiento mientras el otro valida.",
    "Proporcionar una lista de cotejo de auto-verificación previa a la entrega final de la simulación o reto.",
    "Permitir múltiples intentos en el simulador sin penalización punitiva, enfatizando el andamiaje progresivo.",
  ];

  // Ajustes Actitudinales
  const actitudinalAcciones = [
    `Fortalecer "${saberAct}" reconociendo explícitamente el intento reflexivo y la capacidad de corregir a partir de los fallos.`,
    "Establecer una cultura de aula donde el error en la simulación sea tratado como dato valioso de aprendizaje y no como fracaso.",
    "Promover la co-evaluación respetuosa y la retroalimentación constructiva entre pares.",
  ];

  // Ajustes al Indicador de Logro
  const estrategiasIndicador = [
    `Monitorear el avance hacia el indicador "${indCod}: ${indNom}" mediante evidencias formativas breves durante el proceso.`,
    "Diseñar una rúbrica visible con descriptores de logro claros (Inicial, Intermedio, Avanzado) compartida con el grupo desde el inicio.",
    "Registrar las observaciones formativas en el portafolio docente para retroalimentar de forma personalizada.",
  ];

  // Orientación para Planeamiento Didáctico (Crucial para Diagnóstico)
  const fundamentacionDiag =
    "La evaluación diagnóstica carece de sentido pedagógico si sus resultados quedan archivados como meros números. Los datos obtenidos revelan la zona de desarrollo próximo del grupo y constituyen la base indispensable para el diseño y ajuste del planeamiento didáctico de aula.";

  const pasosPlaneamiento = esDiag
    ? [
        `1. Columna de Estrategias de Mediación: Incorporar actividades previas de nivelación y andamiaje para el saber conceptual "${saberConcept}".`,
        `2. Diferenciación Pedagógica (DUA): Establecer estaciones de trabajo o rutas diversificadas para los estudiantes que requirieron acompañamiento (${ctx.estudiantesRezago?.length || "los identificados"}).`,
        `3. Ajuste de Tiempos y Ritmos: Reasignar momentos de mediación para ejercitar el saber procedimental ("${saberProc}") antes de evaluaciones sumativas.`,
        `4. Vinculación con Indicadores: Ajustar las actividades formativas del planeamiento para que tributen directamente a la progresión del indicador "${indCod}".`,
      ]
    : [
        "1. Ajustar las actividades de mediación de la siguiente sesión según los patrones de error más frecuentes detectados en la telemetría.",
        "2. Proponer actividades de enriquecimiento o tutoría entre pares para estudiantes en nivel Avanzado mientras se brinda apoyo focalizado a nivel Inicial.",
        "3. Incorporar retroalimentación formativa oportuna en la siguiente clase antes de cerrar la unidad temática.",
      ];

  const llamadoAccion = esDiag
    ? "⚠️ OBLIGATORIEDAD PEDAGÓGICA: Integra estas recomendaciones en tu próximo planeamiento didáctico institucional para garantizar que la mediación responda con equidad y pertinencia al diagnóstico realizado."
    : "💡 RECOMENDACIÓN FORMATIVA: Aprovecha la telemetría en tiempo real para calibrar el ritmo de tus clases y personalizar las actividades de aula.";

  return {
    ajustesSaberConceptual: {
      titulo: `Ajustes al Saber Conceptual (${saberConcept})`,
      descripcion: `Orientaciones pedagógicas para afianzar el dominio conceptual en ${nivelLimpio}:`,
      accionesConcretas: conceptualAcciones,
    },
    ajustesSaberProcedimental: {
      titulo: `Ajustes al Saber Procedimental (${saberProc})`,
      descripcion: "Estrategias de mediación práctica, modelado y andamiaje:",
      accionesConcretas: procedimentalAcciones,
    },
    ajustesSaberActitudinal: {
      titulo: `Ajustes al Saber Actitudinal (${saberAct})`,
      descripcion: "Promoción de habilidades socioemocionales y cultura de aprendizaje:",
      accionesConcretas: actitudinalAcciones,
    },
    ajustesIndicadorLogro: {
      indicador: `${indCod} - ${indNom}`,
      criterioAjuste:
        promedio < 60
          ? "El grupo requiere refuerzo prioritario antes de avanzar a saberes derivados."
          : promedio < 80
          ? "El grupo muestra comprensión básica pero requiere consolidar la autonomía procedimental."
          : "El grupo ha consolidado el indicador y está listo para retos de transferencia y profundización.",
      estrategiasEvaluacionFormativa: estrategiasIndicador,
    },
    orientacionPlaneamientoDidactico: {
      titulo: esDiag
        ? "🎯 Integración en el Planeamiento Didáctico (Diagnóstico)"
        : "📋 Ajustes Formativos para el Planeamiento de Aula",
      fundamentacion: esDiag ? fundamentacionDiag : "Recomendaciones para la mediación didáctica formativa continua.",
      pasosIntegracionPlaneamiento: pasosPlaneamiento,
      llamadoAccion,
    },
  };
}
