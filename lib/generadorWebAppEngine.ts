// ============================================================================
// MOTOR GENERADOR DE WEBAPPS AUTÓNOMAS - III CICLO SECUNDARIA
// Estructura Pedagógica de 4 Fases: Aprender ➔ Comprender ➔ Simulación ➔ Valoración
// Adaptación 100% Personalizada a los Documentos del Docente
// Componente de Evaluación: Trabajo Cotidiano
// ============================================================================

export interface PreguntaComprender {
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export interface InstrumentoEvaluacionWebApp {
  criterioCognitivo?: string;
  criterioProcedimental?: string;
  criterioSocioafectivo?: string;
  escalas?: {
    acompanamiento?: string;
    desarrollo?: string;
    consolidado?: string;
  };
}

export interface AjusteNEEWebApp {
  tipo: "DUA_UNIVERSAL" | "ACCESO" | "NO_SIGNIFICATIVA" | "SIGNIFICATIVA" | "PERSONALIZADA";
  nombreAjuste: string;
  descripcionAjuste?: string;
  esRecursoIndividualizado: boolean;
}

export interface OpcionesGeneracionWebApp {
  titulo: string;
  docenteId: string;
  docenteNombre?: string;
  asignatura: string;
  nivel: string;
  saberTitulo: string;
  saberConceptual: string;
  explicacionPedagogica?: string;
  indicadorCodigo: string;
  indicadorNombre: string;
  saberProcedimental?: string;
  saberActitudinal?: string;
  mecanica: string;
  modo: "Individual" | "Parejas";
  descripcionReto?: string;
  urlTelemetriaBase?: string;
  
  // Contexto Estudiantil y Valores Transversales
  elementosContextoEstudiantil?: string;
  valoresTransversalesMEP?: string[];
  recursoTecnologicoAula?: string;
  
  // DUA Universal y Ajustes para NEE
  ajusteNEE?: AjusteNEEWebApp;
  seccionesDisponibles?: string[];

  preguntasComprender?: PreguntaComprender[];
  parametrosSimulacion?: {
    nombreVariable?: string;
    rangoOptimo?: string;
    instruccion?: string;
  };
  rubricaCotidiano?: {
    inicial?: string;
    intermedio?: string;
    avanzado?: string;
  };
  instrumentoEvaluacion?: InstrumentoEvaluacionWebApp;
  dimensionSocioafectiva?: {
    saberActitudinal?: string;
    criteriosObservables?: string[];
  };
  dimensionCognitiva?: {
    saberConceptual?: string;
    explicacionComprensible?: string;
    prerrequisitosDetectados?: string[];
  };
  dimensionProcedimental?: {
    saberProcedimental?: string;
    retoPractico?: string;
    mecanicaSugerida?: string;
  };
}

/**
 * Genera el Prompt estructurado para copiar y llevar a IAs externas (Gemini Canvas, Claude, ChatGPT, DeepSeek, Qwen)
 */
export function generarPromptParaIAExterna(opts: OpcionesGeneracionWebApp): string {
  const preguntasTxt = opts.preguntasComprender && opts.preguntasComprender.length > 0
    ? opts.preguntasComprender.map((p, idx) => `   Pregunta ${idx + 1}: ${p.pregunta}\n   Opciones: ${p.opciones.join(" | ")}\n   Explicación: ${p.explicacion}`).join("\n\n")
    : `   Diseña 3 preguntas conceptuales y reflexivas situadas que validen la comprensión esencial de [${opts.indicadorCodigo}] ${opts.indicadorNombre} enfocado en ${opts.saberConceptual}.`;

  const valoresTxt = opts.valoresTransversalesMEP && opts.valoresTransversalesMEP.length > 0
    ? opts.valoresTransversalesMEP.join(", ")
    : "Empatía, ética digital, pensamiento crítico, trabajo colaborativo y respeto";

  const neeInfo = opts.ajusteNEE?.esRecursoIndividualizado
    ? `\n⚠️ [RECURSO INDIVIDUALIZADO PARA ATENCIÓN A NEE]:
• Tipo de ajuste: ${opts.ajusteNEE.nombreAjuste}
• Pautas de adaptación: ${opts.ajusteNEE.descripcionAjuste || "Adaptar ritmo, micro-pasos guiados, apoyos visuales y lectura fácil."}
• La WebApp debe estar optimizada especialmente para este estudiante garantizando su autonomía y éxito formativo.`
    : `\n🌿 [BASE TRANSVERSAL DUA ACTIVA]: Diseño universal para el aprendizaje 100% integrado (múltiples formas de representación, expresión y motivación).`;

  return `Actúa como un desarrollador web senior y diseñador instruccional especialista en formación tecnológica para educación secundaria (III Ciclo: 7°, 8° y 9° año - Dimensión 1 y Dimensión 2).

Crea un archivo HTML ÚNICO (.html) completamente autónomo (Single-File: HTML + CSS en <style> + JS en <script>) que se adapte 100% al indicador curricular, al contexto específico del docente y a la dinámica de gamificación seleccionada:

============================================================
📋 ESPECIFICACIONES CURRICULARES Y CONTEXTUALES
============================================================
• Título de la actividad: "${opts.titulo}"
• Área de conocimiento: ${opts.asignatura}
• Nivel educativo: ${opts.nivel} (Secundaria)
• Componente de evaluación: Trabajo cotidiano (formativo)
• Marco curricular de referencia: Programa de Formación Tecnológica (III Ciclo de Secundaria)
• Indicador de logro a desarrollar: [${opts.indicadorCodigo}] ${opts.indicadorNombre}
• Saber conceptual (saber): ${opts.saberConceptual} - ${opts.saberTitulo}
• Saber procedimental (saber hacer): ${opts.saberProcedimental || "Aplica, diseña y resuelve problemas"}
• Saber actitudinal (saber ser): ${opts.saberActitudinal || "Gusto por la precisión y perseverancia ante el error"}

============================================================
🎮 DINÁMICA DE GAMIFICACIÓN Y VÍNCULO EMOCIONAL
============================================================
• Arquetipo de gamificación: "${opts.mecanica}"
• Vínculo emocional: Integra mecánicas familiares y atractivas para estudiantes de 12 a 16 años (estilo Minecraft/crafteo, Roblox/checkpoints, Among Us/detección de fallos o Cyber-RPG según aplique), con micro-animaciones CSS dinámicas, sonidos procedurales Web Audio API, efectos visuales tipo partículas/canvas y sensación de logro constante sin perder el rigor pedagógico del indicador.

============================================================
🏠 ELEMENTOS DE CONTEXTO ESTUDIANTIL Y VALORES TRANSVERSALES
============================================================
• Contexto del hogar y vida cotidiana: ${opts.elementosContextoEstudiantil || "Vínculo con situaciones de la vida real, comunidad escolar y entorno familiar."}
• Ejes transversales y valores formativos: ${valoresTxt}
• Infraestructura y recursos tecnológicos del aula: ${opts.recursoTecnologicoAula || "Dispositivos móviles / Laboratorio de informática con o sin internet"}
${neeInfo}

============================================================
🎯 ESTRUCTURA PEDAGÓGICA (4 FASES INTEGRADAS)
============================================================
1. IDENTIFICACIÓN INICIAL (FASE 0):
   - Formulario de entrada donde el estudiante escribe su nombre completo y selecciona su sección (${opts.seccionesDisponibles ? opts.seccionesDisponibles.join(", ") : "7-1, 7-2, 8-1, 9-1"}).

2. FASE 1 (APRENDER - Saber):
   - Explicación clara, amigable y visual de los conceptos fundamentales que sustentan este indicador: ${opts.saberConceptual}.
   - Apoyo visual interactivo (diagramas SVG, tarjetas conceptuales o glosario ilustrado).

3. FASE 2 (COMPRENDER - Saber hacer inicial):
   - Validación inmediata del aprendizaje mediante reactivos interactivos situados en el contexto estudiantil.
${preguntasTxt}

4. FASE 3 (SIMULACIÓN INTERACTIVA & GAMIFICACIÓN - Aplicación práctica):
   - Motor interactivo totalmente adaptado al arquetipo "${opts.mecanica}" y a la naturaleza técnica de este indicador:
     * Si es estilo Sandbox/Minecraft: recolección de piezas/bloques y crafteo de la solución lógica/circuito.
     * Si es estilo Obby/Roblox: progreso por salas o checkpoints con puertas lógicas que se abren al acertar.
     * Si es estilo Among Us/Anomalías: detector de fallos/bugs ocultos en la red, base de datos o algoritmo.
     * Si es estilo Cyber-RPG: turnos de acción donde el conocimiento técnico desbloquea poderes y defensas.
     * Si es simulador de laboratorio: sliders, multímetro/osciloscopio y mediciones en tiempo real.
     * Si es quiz arcade: multiplicador de racha, efectos de confeti y retroalimentación inmediata.
   - Retroalimentación sonora procedural inmediata (Web Audio API nativa sin archivos externos).

5. FASE 4 (VALORACIÓN FORMATIVA - Evaluación y telemetría):
   - Rúbrica formativa según el nivel de logro alcanzado (Inicial: ${opts.rubricaCotidiano?.inicial || "En acompañamiento"}, Intermedio: ${opts.rubricaCotidiano?.intermedio || "En desarrollo"}, Avanzado: ${opts.rubricaCotidiano?.avanzado || "Consolidado"}).
   - Generación de comprobante con código único y token de integridad SHA-256.
   - Envío de telemetría automática mediante Webhook a Google Sheets (mode: 'no-cors') y botón de Código QR offline de respaldo.

============================================================
🛡️ REQUISITOS TÉCNICOS BLINDADOS
============================================================
- Un solo archivo .html independiente (CERO dependencias CDN externas bloqueables).
- Compatible con navegadores modernos y antiguos.
- Persistencia SafeStorage con fallback a RAM.
- Totalmente responsive y touch-first (computadoras, teléfonos y tabletas).
- Entrega el código HTML COMPLETO dentro de un solo bloque \`\`\`html listo para guardar y ejecutar.`;
}

/**
 * Genera preguntas conceptuales dinámicas y adaptadas al saber e indicador seleccionado
 */
function obtenerPreguntasContextuales(opts: OpcionesGeneracionWebApp): PreguntaComprender[] {
  if (opts.preguntasComprender && opts.preguntasComprender.length >= 2) {
    return opts.preguntasComprender;
  }

  const sc = (opts.saberConceptual || "").toLowerCase();
  const ind = (opts.indicadorNombre || "").toLowerCase();

  if (sc.includes("algoritmo") || sc.includes("secuencia") || sc.includes("pasos") || ind.includes("algoritmo")) {
    return [
      {
        pregunta: `¿Cuál es la característica principal de un algoritmo en ${opts.saberConceptual}?`,
        opciones: [
          "Es una secuencia ordenada, finita y precisa de instrucciones para resolver un problema.",
          "Es un conjunto de datos desordenados que se procesan al azar sin un objetivo claro.",
          "Es un dispositivo físico que se conecta únicamente a una toma de corriente.",
        ],
        correcta: 0,
        explicacion: "Un algoritmo requiere orden lógico, pasos precisos y un inicio y fin definidos para garantizar el resultado esperado.",
      },
      {
        pregunta: `Al aplicar la práctica "${opts.saberProcedimental || 'Modulariza y depura'}", ¿qué acción es fundamental?`,
        opciones: [
          "Ignorar los errores y reiniciar todo el proyecto desde cero sin revisar.",
          "Probar el algoritmo paso a paso, identificar fallos lógicos y corregirlos sistemáticamente.",
          "Copiar instrucciones sin comprender el propósito de cada bloque.",
        ],
        correcta: 1,
        explicacion: "La depuración y modularización permiten identificar con exactitud en qué punto de la secuencia ocurre un comportamiento no deseado.",
      },
      {
        pregunta: `En una situación cotidiana vinculada con ${opts.saberConceptual}, ¿por qué es importante el orden de las instrucciones?`,
        opciones: [
          "Porque cambiar el orden altera el resultado final o puede impedir que el proceso funcione.",
          "Porque el orden no tiene ninguna influencia en los sistemas digitales ni en la lógica.",
          "Porque las computadoras ejecutan siempre las instrucciones de atrás hacia adelante.",
        ],
        correcta: 0,
        explicacion: "El orden secuencial determina la lógica de ejecución; una instrucción ejecutada fuera de tiempo produce resultados incorrectos.",
      },
    ];
  }

  if (sc.includes("variable") || sc.includes("dato") || sc.includes("tipo") || ind.includes("variable")) {
    return [
      {
        pregunta: `¿Qué función cumple una variable en el contexto de ${opts.saberConceptual}?`,
        opciones: [
          "Almacena y permite modificar un valor o dato durante la ejecución de un programa.",
          "Bloquea permanentemente la memoria para que ningún dato pueda actualizarse.",
          "Es un cable físico que conecta la pantalla con el teclado.",
        ],
        correcta: 0,
        explicacion: "Las variables son espacios con nombre asignado donde se guardan datos que pueden transformarse durante el flujo.",
      },
      {
        pregunta: `Si necesitas guardar el puntaje de un estudiante en un videojuego educativo, ¿qué tipo de dato es el más adecuado?`,
        opciones: [
          "Texto o cadena de caracteres aleatoria sin valor cuantitativo.",
          "Numérico (entero o decimal) para poder sumar, restar y comparar valores.",
          "Booleano que solo guarde si el juego está apagado.",
        ],
        correcta: 1,
        explicacion: "Los puntajes requieren operaciones aritméticas y comparaciones, por lo que el tipo numérico es el idóneo.",
      },
      {
        pregunta: `¿Qué sucede cuando se actualiza el valor de una variable existente?`,
        opciones: [
          "El valor anterior es reemplazado por el nuevo valor en la posición de memoria.",
          "El sistema se bloquea y requiere reiniciar el computador.",
          "Se crean automáticamente diez archivos de texto en el disco duro.",
        ],
        correcta: 0,
        explicacion: "La asignación actualiza el contenido de la variable manteniendo su identificador.",
      },
    ];
  }

  if (sc.includes("condicional") || sc.includes("decision") || sc.includes("si") || ind.includes("condicional")) {
    return [
      {
        pregunta: `¿Cómo opera una estructura condicional (Si / Si No) en ${opts.saberConceptual}?`,
        opciones: [
          "Evalúa una condición lógica: si es verdadera ejecuta una acción, si es falsa ejecuta otra.",
          "Ejecuta todas las acciones al mismo tiempo sin importar si la condición se cumple.",
          "Detiene permanentemente el procesador sin dar respuesta.",
        ],
        correcta: 0,
        explicacion: "Las estructuras condicionales permiten que el sistema tome decisiones basadas en comparaciones lógicas.",
      },
      {
        pregunta: `Si un sensor de temperatura detecta más de 30°C y activa un ventilador, ¿cuál es la condición evaluada?`,
        opciones: [
          "El color del ventilador instalado.",
          "La comparación lógica: ¿Temperatura > 30°C?",
          "El tiempo transcurrido desde que se encendió la computadora.",
        ],
        correcta: 1,
        explicacion: "La condición es una expresión booleana que compara la lectura del sensor contra el umbral establecido.",
      },
      {
        pregunta: `¿Qué valor lógico devuelve una condición evaluada en un sistema digital?`,
        opciones: [
          "Verdadero (True) o Falso (False).",
          "Una lista de números aleatorios sin sentido.",
          "Un archivo de video en alta definición.",
        ],
        correcta: 0,
        explicacion: "Las condiciones booleanas se evalúan estrictamente como Verdadero o Falso.",
      },
    ];
  }

  if (sc.includes("seguridad") || sc.includes("ciber") || sc.includes("privacidad") || sc.includes("ética") || ind.includes("seguridad")) {
    return [
      {
        pregunta: `¿Cuál es una práctica responsable y segura relacionada con ${opts.saberConceptual}?`,
        opciones: [
          "Utilizar contraseñas robustas, únicas y nunca compartir credenciales con personas desconocidas.",
          "Hacer clic en cualquier enlace sospechoso que prometa premios inmediatos.",
          "Descargar programas de fuentes desconocidas e ignorar las advertencias del navegador.",
        ],
        correcta: 0,
        explicacion: "La protección de credenciales y la cautela ante enlaces sospechosos previenen accesos no autorizados y filtraciones.",
      },
      {
        pregunta: `Al detectar un mensaje sospechoso que solicita contraseñas o datos personales urgentes, ¿qué técnica se está intentando?`,
        opciones: [
          "Ingeniería social o suplantación de identidad (Phishing).",
          "Actualización automática y segura del sistema operativo.",
          "Optimización de la velocidad de la memoria RAM.",
        ],
        correcta: 0,
        explicacion: "El phishing busca engañar a las personas haciéndose pasar por entidades de confianza para obtener datos confidenciales.",
      },
      {
        pregunta: `¿Cómo contribuye el respeto y la ética digital al entorno escolar y comunitario?`,
        opciones: [
          "Crea espacios digitales seguros, previene el ciberacoso y fomenta la convivencia armónica.",
          "Hace que los dispositivos funcionen más rápido sin necesidad de internet.",
          "Permite copiar tareas de otros compañeros sin su consentimiento.",
        ],
        correcta: 0,
        explicacion: "La ética digital y la empatía garantizan una convivencia pacífica, solidaria y constructiva en entornos virtuales.",
      },
    ];
  }

  if (sc.includes("hardware") || sc.includes("computadora") || sc.includes("periférico") || sc.includes("componente") || ind.includes("hardware")) {
    return [
      {
        pregunta: `¿Qué diferencia al hardware del software en el estudio de ${opts.saberConceptual}?`,
        opciones: [
          "El hardware es la parte física y tangible del equipo; el software son los programas e instrucciones lógicas.",
          "El hardware son los programas de internet y el software son los cables y tornillos.",
          "No existe ninguna diferencia, ambos términos significan exactamente lo mismo.",
        ],
        correcta: 0,
        explicacion: "El hardware comprende los componentes físicos (CPU, memoria, periféricos), mientras que el software es el conjunto lógico de instrucciones.",
      },
      {
        pregunta: `¿Cuál de los siguientes es un periférico de entrada fundamental para interactuar con la computadora?`,
        opciones: [
          "El teclado o el ratón (mouse).",
          "La impresora láser de papel.",
          "Los altavoces o parlantes de sonido.",
        ],
        correcta: 0,
        explicacion: "Los periféricos de entrada capturan datos del usuario y los envían a la unidad central para su procesamiento.",
      },
      {
        pregunta: `¿Qué cuidado preventivo es indispensable para prolongar la vida útil del hardware?`,
        opciones: [
          "Mantener el equipo en un lugar ventilado, libre de polvo y realizar apagados seguros.",
          "Consumir bebidas y alimentos directamente sobre el teclado y la torre.",
          "Desconectar el cable de corriente bruscamente mientras el sistema está guardando archivos.",
        ],
        correcta: 0,
        explicacion: "La ventilación adecuada y el apagado correcto evitan daños térmicos y fallos en el almacenamiento del sistema.",
      },
    ];
  }

  if (sc.includes("red") || sc.includes("internet") || sc.includes("comunicación") || sc.includes("ip") || ind.includes("red")) {
    return [
      {
        pregunta: `¿Cuál es el rol de una red informática en el contexto de ${opts.saberConceptual}?`,
        opciones: [
          "Interconectar dispositivos para compartir recursos, transferir datos y comunicarse eficientemente.",
          "Impedir que las computadoras se comuniquen entre sí para aislar los datos.",
          "Convertir documentos impresos en papel en energía solar.",
        ],
        correcta: 0,
        explicacion: "Las redes posibilitan la transmisión ágil de paquetes de datos y el acceso compartido a servicios y recursos digitales.",
      },
      {
        pregunta: `¿Qué elemento identifica de manera única a un dispositivo dentro de una red digital?`,
        opciones: [
          "La dirección IP o dirección lógica de red.",
          "El color de la carcasa externa del computador.",
          "El fondo de pantalla seleccionado por el usuario.",
        ],
        correcta: 0,
        explicacion: "La dirección IP actúa como un identificador único que permite enrutar y entregar paquetes de información al destino exacto.",
      },
      {
        pregunta: `¿Por qué viaja la información fragmentada en 'paquetes de datos' a través de internet?`,
        opciones: [
          "Para optimizar el ancho de banda, permitir rutas alternativas y reconstruir la información con integridad en el destino.",
          "Porque los cables solo permiten enviar una letra por hora.",
          "Para borrar los archivos automáticamente si hay congestión.",
        ],
        correcta: 0,
        explicacion: "La conmutación de paquetes permite aprovechar la red de manera dinámica y resistente a fallos puntuales de ruta.",
      },
    ];
  }

  // Fallback adaptado con el nombre exacto del saber
  return [
    {
      pregunta: `¿Cuál es el propósito esencial al aplicar el saber conceptual "${opts.saberConceptual}" en el indicador [${opts.indicadorCodigo}]?`,
      opciones: [
        `Comprender los principios de ${opts.saberConceptual} para aplicarlos con orden, precisión y sentido crítico en retos tecnológicos.`,
        "Realizar acciones aleatorias sin reflexionar sobre el procedimiento ni el resultado.",
        "Memorizar definiciones sin entender su utilidad práctica en la vida cotidiana.",
      ],
      correcta: 0,
      explicacion: `La asimilación de ${opts.saberConceptual} permite resolver situaciones problema aplicando ${opts.saberProcedimental || 'métodos estructurados'}.`,
    },
    {
      pregunta: `Al desarrollar el indicador "${opts.indicadorNombre}", ¿qué actitud formativa fortalece el aprendizaje?`,
      opciones: [
        `Demostrar ${opts.saberActitudinal || 'gusto por la precisión y aprender del error'}, perseverando hasta alcanzar la solución óptima.`,
        "Abandonar el reto al primer fallo sin analizar la causa del error.",
        "Competir destructivamente ignorando las normas de convivencia del aula.",
      ],
      correcta: 0,
      explicacion: "El análisis reflexivo de los errores y la constancia transforman los desaciertos en oportunidades de consolidación pedagógica.",
    },
    {
      pregunta: `¿Cómo se vincula el saber conceptual "${opts.saberConceptual}" con el entorno cotidiano y comunitario?`,
      opciones: [
        "Permite tomar decisiones informadas, seguras y eficientes frente a las herramientas tecnológicas del entorno.",
        "No tiene ninguna relación con las actividades humanas ni con la sociedad.",
        "Solo es útil dentro de laboratorios cerrados y sin conexión con el mundo real.",
      ],
      correcta: 0,
      explicacion: "El conocimiento tecnológico adquiere valor formativo cuando transforma positivamente la interacción del estudiante con su entorno.",
    },
  ];
}

/**
 * Determina el tipo de simulador interactivo según el saber y la mecánica
 */
function inferirTipoSimulador(opts: OpcionesGeneracionWebApp): "ALGORITMO_MAZE" | "LOGIC_GATES" | "SECURITY_SCANNER" | "NETWORK_ROUTER" | "VARIABLES_MEMORY" | "LAB_SLIDERS" {
  const sc = (opts.saberConceptual || "").toLowerCase();
  const mec = (opts.mecanica || "").toLowerCase();
  const ind = (opts.indicadorNombre || "").toLowerCase();

  if (sc.includes("seguridad") || sc.includes("privacidad") || sc.includes("ética") || sc.includes("ciber") || mec.includes("among") || mec.includes("impostor") || mec.includes("anomalía")) {
    return "SECURITY_SCANNER";
  }
  if (sc.includes("red") || sc.includes("internet") || sc.includes("ip") || sc.includes("protocolo") || sc.includes("comunicación")) {
    return "NETWORK_ROUTER";
  }
  if (sc.includes("hardware") || sc.includes("circuito") || sc.includes("lógica") || sc.includes("puerta") || sc.includes("componente") || sc.includes("periférico")) {
    return "LOGIC_GATES";
  }
  if (sc.includes("variable") || sc.includes("dato") || sc.includes("memoria") || sc.includes("tipo")) {
    return "VARIABLES_MEMORY";
  }
  if (sc.includes("algoritmo") || sc.includes("secuencia") || sc.includes("condicional") || sc.includes("bucle") || sc.includes("ciclo") || sc.includes("programación") || mec.includes("minecraft") || mec.includes("crafteo") || mec.includes("roblox") || mec.includes("obby")) {
    return "ALGORITMO_MAZE";
  }
  return "ALGORITMO_MAZE";
}

/**
 * Genera el código HTML completo, interactivo y autónomo adaptado al indicador del docente
 */
export function generarCodigoHTMLAutonomo(opts: OpcionesGeneracionWebApp): string {
  const urlApi = opts.urlTelemetriaBase || "https://creador-webapps.local/api/telemetria/enviar";
  const timestampGen = Date.now();
  const explicacion = opts.explicacionPedagogica || `El saber conceptual "${opts.saberConceptual}" es fundamental en ${opts.asignatura}. Permite comprender los fundamentos técnicos y lógicos para formular soluciones precisas, modularizadas y seguras en beneficio de la comunidad.`;

  const preguntas = obtenerPreguntasContextuales(opts);
  const tipoSim = inferirTipoSimulador(opts);

  const rubricaInicial = opts.rubricaCotidiano?.inicial || "Identifica nociones básicas del saber conceptual pero requiere andamiaje continuo.";
  const rubricaIntermedia = opts.rubricaCotidiano?.intermedio || "Aplica los conceptos y procedimientos de forma guiada logrando resolver retos.";
  const rubricaAvanzada = opts.rubricaCotidiano?.avanzado || "Demuestra dominio autónomo, precisión procedimental y autorregulación reflexiva.";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="${escapeHTML(opts.titulo)}">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0055a5">
  <title>${escapeHTML(opts.titulo)}</title>
  <style>
    :root {
      --bg-primary: #f8fafc;
      --card-bg: #ffffff;
      --text-main: #0f172a;
      --text-muted: #475569;
      --brand: #0055a5;
      --brand-dark: #003366;
      --accent: #059669;
      --accent-light: #dcfce7;
      --danger: #e11d48;
      --warning: #d97706;
      --border: #e2e8f0;
      --radius: 14px;
    }
    .modo-ligero {
      --bg-primary: #ffffff !important;
      --card-bg: #f8fafc !important;
      --border: #cbd5e1 !important;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    body {
      background-color: var(--bg-primary);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: linear-gradient(135deg, var(--brand-dark), var(--brand));
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(255,255,255,0.2);
    }
    .top-controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    button, .btn {
      background: var(--brand);
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    button:hover, .btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
    button:active, .btn:active {
      transform: translateY(1px);
    }
    .btn-secondary { background: rgba(255,255,255,0.2); }
    .btn-accent { background: var(--accent); }
    .btn-danger { background: var(--danger); }
    .btn-outline { background: white; color: var(--text-main); border: 2px solid var(--border); }
    
    .fases-nav {
      max-width: 850px;
      margin: 16px auto 0;
      padding: 0 16px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      width: 100%;
    }
    .fase-tab {
      padding: 10px 8px;
      text-align: center;
      background: white;
      border: 2px solid var(--border);
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
    }
    .fase-tab.activa {
      background: #eff6ff;
      border-color: var(--brand);
      color: var(--brand);
      box-shadow: 0 2px 8px rgba(0, 85, 165, 0.15);
    }
    .fase-tab.completada {
      border-color: var(--accent);
      color: var(--accent);
      background: #f0fdf4;
    }

    .main-container {
      max-width: 850px;
      margin: 16px auto 30px;
      padding: 0 16px;
      flex: 1;
      width: 100%;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.04);
      margin-bottom: 20px;
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .opcion-btn {
      display: block;
      width: 100%;
      text-align: left;
      background: white;
      color: var(--text-main);
      border: 2px solid var(--border);
      padding: 12px 14px;
      border-radius: 10px;
      margin-bottom: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      line-height: 1.4;
    }
    .opcion-btn:hover:not(:disabled) { border-color: var(--brand); background: #f0f7ff; }
    .opcion-btn.correcta { background: #dcfce7 !important; border-color: var(--accent) !important; color: #166534 !important; font-weight: 700; }
    .opcion-btn.incorrecta { background: #fee2e2 !important; border-color: var(--danger) !important; color: #991b1b !important; }
    
    .interactive-board {
      background: #0f172a;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 15px 0;
      color: white;
    }
    .traffic-light {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 15px 0;
    }
    .light-badge {
      padding: 8px 18px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 13px;
    }
    .light-inicial { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .light-intermedio { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
    .light-avanzado { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.75);
      justify-content: center;
      align-items: center;
      padding: 20px;
      z-index: 999;
      backdrop-filter: blur(4px);
    }
    .modal-content {
      background: white;
      border-radius: var(--radius);
      padding: 24px;
      max-width: 540px;
      width: 100%;
      text-align: center;
      color: #0f172a;
      max-height: 90vh;
      overflow-y: auto;
    }

    /* Estilos específicos para la cuadrícula del juego / simulación */
    .sim-canvas {
      background: #020617;
      border: 2px solid #334155;
      border-radius: 10px;
      margin: 12px auto;
      display: block;
      max-width: 100%;
      touch-action: none;
    }
    .controls-grid {
      display: flex;
      gap: 8px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 12px;
    }
    .cmd-btn {
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #334155;
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .cmd-btn:hover { background: #334155; color: white; }

    @media (max-width: 600px) {
      .fases-nav { font-size: 10px; gap: 4px; }
      .fase-tab { padding: 8px 4px; font-size: 11px; }
      .card { padding: 16px; }
    }
  </style>
</head>
<body>

  <header>
    <div>
      <span class="badge" style="background:#059669;">${escapeHTML(opts.nivel)}</span>
      <span class="badge" style="background:#f59e0b; color:#78350f;">Trabajo Cotidiano</span>
      <h2 style="font-size: 1.05rem; margin-top: 4px;">${escapeHTML(opts.titulo)}</h2>
    </div>
    <div class="top-controls">
      <button class="btn btn-secondary" onclick="mostrarModalInstrumento()">📋 Rúbrica</button>
      <button class="btn btn-secondary" onclick="toggleModoVisual()" id="btnModo">🌱 Modo Ligero</button>
      <button class="btn btn-accent" onclick="descargarHTMLAuto()">⬇️ Guardar</button>
    </div>
  </header>

  <!-- BARRA DE NAVEGACIÓN EN 4 FASES -->
  <div class="fases-nav">
    <div id="tabFase1" class="fase-tab activa" onclick="irAFase(1)">1. 🌱 Aprender</div>
    <div id="tabFase2" class="fase-tab" onclick="irAFase(2)">2. 💡 Comprender</div>
    <div id="tabFase3" class="fase-tab" onclick="irAFase(3)">3. 🕹️ Simulación</div>
    <div id="tabFase4" class="fase-tab" onclick="irAFase(4)">4. 📊 Valoración</div>
  </div>

  <main class="main-container">

    <!-- FASE 1: APRENDER (SABER CONCEPTUAL DEL DOCUMENTO) -->
    <div id="seccionFase1" class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 12px;">
          Saber conceptual: ${escapeHTML(opts.saberConceptual)}
        </span>
        <span class="badge" style="background: #ede9fe; color: #5b21b6; font-size: 12px;">
          Indicador: [${escapeHTML(opts.indicadorCodigo)}]
        </span>
      </div>

      <h3 style="color: var(--brand-dark); font-size: 1.25rem; margin-bottom: 6px;">
        ${escapeHTML(opts.saberTitulo)}
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px; font-weight: 600;">
        ${escapeHTML(opts.indicadorNombre)}
      </p>

      <div style="background: #f1f5f9; border-left: 4px solid var(--brand); padding: 16px; border-radius: 0 10px 10px 0; margin-bottom: 18px;">
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-main);">
          ${escapeHTML(explicacion)}
        </p>
      </div>

      <!-- TARJETAS PEDAGÓGICAS Y VÍNCULO EMOCIONAL -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 20px;">
        <div style="background: white; border: 1px solid var(--border); border-radius: 10px; padding: 14px;">
          <h4 style="font-size: 12px; font-weight: 800; color: #0369a1; margin-bottom: 4px;">
            ⚙️ Saber hacer (Procedimental):
          </h4>
          <p style="font-size: 13px; color: var(--text-main); margin: 0;">
            ${escapeHTML(opts.saberProcedimental || "Aplica métodos lógicos estructurados y depura errores.")}
          </p>
        </div>
        <div style="background: white; border: 1px solid var(--border); border-radius: 10px; padding: 14px;">
          <h4 style="font-size: 12px; font-weight: 800; color: #059669; margin-bottom: 4px;">
            ❤️ Saber ser (Actitudinal):
          </h4>
          <p style="font-size: 13px; color: var(--text-main); margin: 0;">
            ${escapeHTML(opts.saberActitudinal || "Gusto por la precisión y aprender del error con perseverancia.")}
          </p>
        </div>
      </div>

      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
        <h4 style="font-size: 12px; font-weight: 800; color: #1e40af; margin-bottom: 4px;">
          🎮 Dinámica de gamificación activa:
        </h4>
        <p style="font-size: 13px; color: #1e3a8a; margin: 0;">
          <strong>${escapeHTML(opts.mecanica)}</strong>: Prepárate para aplicar ${escapeHTML(opts.saberConceptual)} en el simulador interactivo de la Fase 3.
        </p>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-accent" style="padding: 10px 22px; font-size: 14px;" onclick="irAFase(2)">
          Continuar a Comprender ➔
        </button>
      </div>
    </div>

    <!-- FASE 2: COMPRENDER (CHEQUEO CONCEPTUAL ADAPTADO CON 3 REACTIVOS) -->
    <div id="seccionFase2" class="card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 12px;">
          Comprobación rápida
        </span>
        <span style="font-size: 12px; color: var(--text-muted); font-weight: 700;" id="labelProgresoPreguntas">
          Pregunta 1 de ${preguntas.length}
        </span>
      </div>

      <h3 style="color: var(--brand-dark); font-size: 1.15rem; margin-bottom: 15px;">
        Valida tu comprensión de ${escapeHTML(opts.saberConceptual)}
      </h3>

      <div id="contenedorPregunta">
        <p style="font-size: 15px; font-weight: 700; margin-bottom: 14px; color: var(--text-main);" id="textoPregunta">
          <!-- Dinámico -->
        </p>
        <div id="opcionesPregunta">
          <!-- Dinámico -->
        </div>
      </div>

      <div id="retroPregunta" style="display: none; padding: 12px; border-radius: 8px; margin-top: 14px; font-size: 13px; font-weight: 600;"></div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-outline" onclick="irAFase(1)">⬅️ Repasar saber</button>
        <button id="btnSiguientePregunta" class="btn btn-accent" style="display: none;" onclick="avanzarPregunta()">
          Siguiente reto ➔
        </button>
      </div>
    </div>

    <!-- FASE 3: SIMULACIÓN INTERACTIVA (60 FPS CANVAS & LAB ADAPTADO) -->
    <div id="seccionFase3" class="card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <span class="badge" style="background: #dcfce7; color: #166534; font-size: 12px;">
          Simulador: ${escapeHTML(opts.mecanica)}
        </span>
        <span style="font-size: 12px; color: var(--text-muted); font-weight: 700;">
          Meta: Aplicar ${escapeHTML(opts.saberConceptual)}
        </span>
      </div>

      <h3 style="color: var(--brand-dark); font-size: 1.2rem; margin-bottom: 6px;">
        Laboratorio de Experimentación Práctica
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;" id="instruccionSimulador">
        Ejecuta las acciones lógicas para resolver el desafío y validar el comportamiento del sistema.
      </p>

      <!-- TABLERO INTERACTIVO CON CANVAS Y CONTROLES -->
      <div class="interactive-board">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px;">
          <span style="color: #38bdf8; font-weight: 700;" id="simStatusTitulo">🎯 Estado del sistema: En espera</span>
          <span style="color: #f59e0b; font-weight: 700;" id="simPuntajeEnVivo">Progreso: 0%</span>
        </div>

        <canvas id="canvasSimulador" width="480" height="260" class="sim-canvas"></canvas>

        <div class="controls-grid" id="simControles">
          <!-- Se inyectan según el tipo de simulación -->
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-outline" onclick="irAFase(2)">⬅️ Volver a preguntas</button>
        <button id="btnFinalizarSim" class="btn btn-accent" onclick="irAFase(4)">
          Finalizar y evaluar ➔
        </button>
      </div>
    </div>

    <!-- FASE 4: VALORACIÓN (TRABAJO COTIDIANO & TELEMETRÍA) -->
    <div id="seccionFase4" class="card" style="display: none; text-align: center;">
      <div style="font-size: 44px; margin-bottom: 6px;">🎉</div>
      <h2 style="color: var(--brand-dark); font-size: 1.3rem;">Valoración de Trabajo Cotidiano</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">
        Indicador de logro: <strong>${escapeHTML(opts.indicadorCodigo)}</strong> - ${escapeHTML(opts.indicadorNombre)}
      </p>

      <div class="traffic-light">
        <span id="badgeNivel" class="light-badge light-avanzado">Consolidado (≥ 80%)</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;">
        <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Puntaje formativo</div>
          <div id="resPuntaje" style="font-size: 22px; font-weight: 900; color: var(--brand);">100%</div>
        </div>
        <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Aciertos en retos</div>
          <div id="resAciertos" style="font-size: 22px; font-weight: 900; color: var(--accent);">3 / 3</div>
        </div>
        <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Tiempo empleado</div>
          <div id="resTiempo" style="font-size: 22px; font-weight: 900; color: var(--warning);">45s</div>
        </div>
      </div>

      <!-- DESGLOSE DE RÚBRICA FORMATIVA SEGÚN EL LOGRO -->
      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 16px; text-align: left; margin-bottom: 18px;">
        <h4 style="font-size: 12px; font-weight: 800; color: var(--brand-dark); margin-bottom: 6px;">
          📌 Criterio de logro alcanzado:
        </h4>
        <p style="font-size: 13px; color: var(--text-main); margin: 0; line-height: 1.5;" id="criterioLogroTexto">
          ${escapeHTML(rubricaAvanzada)}
        </p>
      </div>

      <div id="estadoEnvio" style="padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; font-weight: 600;">
        📡 Sincronizando con el dashboard del docente...
      </div>

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-accent" onclick="mostrarModalQR()">📱 Mostrar QR offline</button>
        <button class="btn btn-outline" onclick="mostrarModalInstrumento()">📋 Ver rúbrica completa</button>
        <button class="btn btn-outline" onclick="reiniciarTodo()">🔄 Repetir actividad</button>
      </div>
    </div>

  </main>

  <!-- MODAL INSTRUMENTO DE EVALUACIÓN TRANSPARENTE -->
  <div id="modalInstrumento" class="modal">
    <div class="modal-content" style="text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 14px;">
        <h3 style="color: var(--brand-dark); font-size: 1.15rem; margin: 0;">📋 Instrumento de Evaluación Formativa</h3>
        <button class="btn btn-outline" style="padding: 4px 8px;" onclick="cerrarModalInstrumento()">✕</button>
      </div>
      
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
        Criterios que valoran el desempeño individual en esta actividad de trabajo cotidiano:
      </p>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
        <strong style="color: #0369a1; font-size: 12px; display: block; margin-bottom: 4px;">🧠 1. Dimensión cognitiva / conceptual:</strong>
        <p style="font-size: 12px; margin: 0; color: var(--text-main);">${escapeHTML(opts.instrumentoEvaluacion?.criterioCognitivo || `Identifica y explica los fundamentos de ${opts.saberConceptual} según el indicador [${opts.indicadorCodigo}].`)}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
        <strong style="color: #166534; font-size: 12px; display: block; margin-bottom: 4px;">⚙️ 2. Dimensión procedimental:</strong>
        <p style="font-size: 12px; margin: 0; color: var(--text-main);">${escapeHTML(opts.instrumentoEvaluacion?.criterioProcedimental || `Aplica ${opts.saberProcedimental || 'métodos estructurados'} en el laboratorio interactivo.`)}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
        <strong style="color: #92400e; font-size: 12px; display: block; margin-bottom: 4px;">❤️ 3. Dimensión socioafectiva y actitudinal:</strong>
        <p style="font-size: 12px; margin: 0; color: var(--text-main);">${escapeHTML(opts.instrumentoEvaluacion?.criterioSocioafectivo || opts.saberActitudinal || "Demuestra gusto por la precisión y perseverancia ante el error.")}</p>
      </div>

      <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px;">
        <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 6px;">ESCALA OFICIAL DE LOGRO:</div>
        <div style="font-size: 11px; line-height: 1.5; color: var(--text-main);">
          • <strong>Consolidado (≥80%):</strong> ${escapeHTML(rubricaAvanzada)}<br>
          • <strong>En desarrollo (60-79%):</strong> ${escapeHTML(rubricaIntermedia)}<br>
          • <strong>En acompañamiento (&lt;60%):</strong> ${escapeHTML(rubricaInicial)}
        </div>
      </div>

      <div style="margin-top: 16px; text-align: right;">
        <button class="btn btn-accent" style="padding: 8px 18px;" onclick="cerrarModalInstrumento()">Entendido</button>
      </div>
    </div>
  </div>

  <!-- MODAL QR OFFLINE -->
  <div id="modalQR" class="modal">
    <div class="modal-content">
      <h3 style="color: var(--brand-dark); margin-bottom: 6px;">Comprobante QR de Trabajo Cotidiano</h3>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
        Muestra este código a la cámara del docente para registrar tu evidencia sin requerir conexión a internet.
      </p>
      <div style="display: flex; justify-content: center; margin: 15px 0;">
        <canvas id="qrCanvas" width="220" height="220" style="border: 4px solid #003366; border-radius: 8px;"></canvas>
      </div>
      <div id="tokenHashLabel" style="font-family: monospace; font-size: 10px; color: #64748b; word-break: break-all; margin-bottom: 15px;"></div>
      <button class="btn" style="width: 100%;" onclick="cerrarModalQR()">Cerrar comprobante</button>
    </div>
  </div>

  <script>
    // ==========================================
    // CONFIGURACIÓN Y ESTADO DE LA ACTIVIDAD
    // ==========================================
    var CONFIG = {
      webAppId: "webapp-" + ${timestampGen},
      webAppTitulo: "${escapeJS(opts.titulo)}",
      docenteId: "${escapeJS(opts.docenteId)}",
      saberConceptual: "${escapeJS(opts.saberConceptual)}",
      indicadorCodigo: "${escapeJS(opts.indicadorCodigo)}",
      indicadorNombre: "${escapeJS(opts.indicadorNombre)}",
      tipoSimulador: "${tipoSim}",
      rubricaInicial: "${escapeJS(rubricaInicial)}",
      rubricaIntermedia: "${escapeJS(rubricaIntermedia)}",
      rubricaAvanzada: "${escapeJS(rubricaAvanzada)}",
      urlTelemetria: "${urlApi}"
    };

    var PREGUNTAS = ${JSON.stringify(preguntas)};

    var estado = {
      faseActual: 1,
      indicePregunta: 0,
      aciertosPreguntas: 0,
      simulacionCompletada: false,
      puntajeSimulacion: 0,
      inicioTiempo: Date.now(),
      tiempoSegundos: 0,
      modoLigero: false,
      audioCtx: null
    };

    // ==========================================
    // SÍNTESIS DE AUDIO PROCEDURAL WEB AUDIO API
    // ==========================================
    function reproducirSonido(tipo) {
      try {
        if (!estado.audioCtx) {
          estado.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        var ctx = estado.audioCtx;
        if (ctx.state === "suspended") ctx.resume();

        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        var now = ctx.currentTime;
        if (tipo === "correcto") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
          osc.start(now);
          osc.stop(now + 0.4);
        } else if (tipo === "error") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(160, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else if (tipo === "victoria") {
          osc.type = "square";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.setValueAtTime(554.37, now + 0.12);
          osc.frequency.setValueAtTime(659.25, now + 0.24);
          osc.frequency.setValueAtTime(880, now + 0.36);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.start(now);
          osc.stop(now + 0.6);
        } else {
          // click suave
          osc.type = "sine";
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        }
      } catch(e) {}
    }

    // ==========================================
    // NAVEGACIÓN DE FASES
    // ==========================================
    function irAFase(num) {
      estado.faseActual = num;
      reproducirSonido("click");

      for (var i = 1; i <= 4; i++) {
        var sec = document.getElementById("seccionFase" + i);
        var tab = document.getElementById("tabFase" + i);
        if (sec) sec.style.display = (i === num ? "block" : "none");
        if (tab) {
          if (i === num) tab.className = "fase-tab activa";
          else if (i < num) tab.className = "fase-tab completada";
          else tab.className = "fase-tab";
        }
      }

      if (num === 2) {
        renderizarPreguntaActual();
      } else if (num === 3) {
        iniciarSimulador();
      } else if (num === 4) {
        finalizarValoracion();
      }
    }

    // ==========================================
    // FASE 2: PREGUNTAS Y CHEQUEO CONCEPTUAL
    // ==========================================
    function renderizarPreguntaActual() {
      var p = PREGUNTAS[estado.indicePregunta];
      if (!p) return;

      document.getElementById("labelProgresoPreguntas").innerText = "Pregunta " + (estado.indicePregunta + 1) + " de " + PREGUNTAS.length;
      document.getElementById("textoPregunta").innerText = p.pregunta;

      var cont = document.getElementById("opcionesPregunta");
      cont.innerHTML = "";

      for (var i = 0; i < p.opciones.length; i++) {
        var btn = document.createElement("button");
        btn.className = "opcion-btn";
        btn.innerHTML = "<strong>" + String.fromCharCode(65 + i) + ".</strong> " + escapeHTMLJS(p.opciones[i]);
        btn.setAttribute("onclick", "responderPregunta(" + i + ")");
        cont.appendChild(btn);
      }

      var retro = document.getElementById("retroPregunta");
      retro.style.display = "none";
      document.getElementById("btnSiguientePregunta").style.display = "none";
    }

    function responderPregunta(opcIndex) {
      var p = PREGUNTAS[estado.indicePregunta];
      var esCorrecta = (opcIndex === p.correcta);
      var btns = document.getElementById("opcionesPregunta").children;

      for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = true;
        if (i === p.correcta) btns[i].className += " correcta";
        else if (i === opcIndex) btns[i].className += " incorrecta";
      }

      var retro = document.getElementById("retroPregunta");
      retro.style.display = "block";

      if (esCorrecta) {
        reproducirSonido("correcto");
        estado.aciertosPreguntas++;
        retro.style.background = "#dcfce7";
        retro.style.color = "#166534";
        retro.innerText = "✨ ¡Excelente comprensión! " + p.explicacion;
      } else {
        reproducirSonido("error");
        retro.style.background = "#fee2e2";
        retro.style.color = "#991b1b";
        retro.innerText = "💡 Análisis formativo: " + p.explicacion;
      }

      var btnSig = document.getElementById("btnSiguientePregunta");
      btnSig.style.display = "inline-flex";
      if (estado.indicePregunta === PREGUNTAS.length - 1) {
        btnSig.innerText = "Continuar al simulador ➔";
      } else {
        btnSig.innerText = "Siguiente pregunta ➔";
      }
    }

    function avanzarPregunta() {
      if (estado.indicePregunta < PREGUNTAS.length - 1) {
        estado.indicePregunta++;
        renderizarPreguntaActual();
      } else {
        irAFase(3);
      }
    }

    // ==========================================
    // FASE 3: MOTORES DE SIMULACIÓN INTERACTIVA
    // ==========================================
    var simEngine = {
      tipo: CONFIG.tipoSimulador,
      canvas: null,
      ctx: null,
      animId: null,
      robot: { x: 1, y: 1, dir: 0 }, // 0: derecha, 1: abajo, 2: izquierda, 3: arriba
      objetivo: { x: 4, y: 3 },
      obstaculos: [{ x: 2, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }],
      pasosEjecutados: 0,
      switches: [false, false],
      seguridadItems: [
        { texto: "Correo: '¡Ganaste un premio, ingresa tu clave aquí!'", esAmenaza: true, detectado: false },
        { texto: "Sitio web HTTPS del centro educativo", esAmenaza: false, detectado: false },
        { texto: "Descarga de archivo 'juego_gratis.exe' de sitio desconocido", esAmenaza: true, detectado: false }
      ]
    };

    function iniciarSimulador() {
      simEngine.canvas = document.getElementById("canvasSimulador");
      if (simEngine.canvas) simEngine.ctx = simEngine.canvas.getContext("2d");

      var controlesDiv = document.getElementById("simControles");
      controlesDiv.innerHTML = "";

      if (CONFIG.tipoSimulador === "SECURITY_SCANNER") {
        document.getElementById("instruccionSimulador").innerText = "Inspecciona cada elemento del sistema y clasifica si es una amenaza o un sitio seguro.";
        renderizarSimuladorSeguridad();
      } else if (CONFIG.tipoSimulador === "LOGIC_GATES") {
        document.getElementById("instruccionSimulador").innerText = "Activa los interruptores para alimentar la compuerta lógica y encender el indicador LED.";
        renderizarSimuladorCompuertas();
      } else {
        // ALGORITMO MAZE (Default 60 FPS)
        document.getElementById("instruccionSimulador").innerText = "Programa la secuencia lógica de comandos para guiar el robot hacia el objetivo esquivando obstáculos.";
        renderizarSimuladorAlgoritmo();
      }
    }

    // SIMULADOR 1: ALGORITMOS Y ROBOT RUNNER
    function renderizarSimuladorAlgoritmo() {
      var c = document.getElementById("simControles");
      c.innerHTML = 
        '<button class="cmd-btn" onclick="simComandoRobot(\\'avanzar\\')">⬆️ Avanzar</button>' +
        '<button class="cmd-btn" onclick="simComandoRobot(\\'girarDer\\')">↪️ Girar derecha</button>' +
        '<button class="cmd-btn" onclick="simComandoRobot(\\'girarIzq\\')">↩️ Girar izquierda</button>' +
        '<button class="btn btn-danger" onclick="reiniciarLabRobot()">🔄 Reiniciar posición</button>';

      dibujarLabRobot();
    }

    function dibujarLabRobot() {
      var ctx = simEngine.ctx;
      if (!ctx) return;
      var w = simEngine.canvas.width;
      var h = simEngine.canvas.height;
      ctx.clearRect(0, 0, w, h);

      var cols = 6;
      var rows = 4;
      var cellW = w / cols;
      var cellH = h / rows;

      // Cuadrícula
      for (var r = 0; r < rows; r++) {
        for (var col = 0; col < cols; col++) {
          ctx.strokeStyle = "#1e293b";
          ctx.strokeRect(col * cellW, r * cellH, cellW, cellH);
        }
      }

      // Obstáculos
      ctx.fillStyle = "#e11d48";
      for (var i = 0; i < simEngine.obstaculos.length; i++) {
        var obs = simEngine.obstaculos[i];
        ctx.fillRect(obs.x * cellW + 4, obs.y * cellH + 4, cellW - 8, cellH - 8);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px sans-serif";
        ctx.fillText("⚠️ Bug", obs.x * cellW + 12, obs.y * cellH + 34);
        ctx.fillStyle = "#e11d48";
      }

      // Objetivo
      var obj = simEngine.objetivo;
      ctx.fillStyle = "#059669";
      ctx.fillRect(obj.x * cellW + 4, obj.y * cellH + 4, cellW - 8, cellH - 8);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("🎯 Meta", obj.x * cellW + 12, obj.y * cellH + 34);

      // Robot
      var rob = simEngine.robot;
      var rx = rob.x * cellW + cellW / 2;
      var ry = rob.y * cellH + cellH / 2;

      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(rx, ry, 18, 0, Math.PI * 2);
      ctx.fill();

      // Ojos / Dirección
      ctx.fillStyle = "#0f172a";
      var angulo = (rob.dir * 90) * Math.PI / 180;
      var eyeX = rx + Math.cos(angulo) * 10;
      var eyeY = ry + Math.sin(angulo) * 10;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function simComandoRobot(cmd) {
      reproducirSonido("click");
      var rob = simEngine.robot;

      if (cmd === "girarDer") {
        rob.dir = (rob.dir + 1) % 4;
      } else if (cmd === "girarIzq") {
        rob.dir = (rob.dir + 3) % 4;
      } else if (cmd === "avanzar") {
        var nextX = rob.x;
        var nextY = rob.y;
        if (rob.dir === 0) nextX++;
        else if (rob.dir === 1) nextY++;
        else if (rob.dir === 2) nextX--;
        else if (rob.dir === 3) nextY--;

        // Validar límites
        if (nextX >= 0 && nextX < 6 && nextY >= 0 && nextY < 4) {
          // Validar obstáculos
          var choca = simEngine.obstaculos.some(function(o) { return o.x === nextX && o.y === nextY; });
          if (choca) {
            reproducirSonido("error");
            document.getElementById("simStatusTitulo").innerText = "⚠️ ¡Colisión con bug! Corrige la secuencia lógica.";
            return;
          }
          rob.x = nextX;
          rob.y = nextY;
          simEngine.pasosEjecutados++;
        }
      }

      dibujarLabRobot();

      // Validar victoria
      if (rob.x === simEngine.objetivo.x && rob.y === simEngine.objetivo.y) {
        reproducirSonido("victoria");
        estado.simulacionCompletada = true;
        estado.puntajeSimulacion = 100;
        document.getElementById("simStatusTitulo").innerText = "🎉 ¡Misión completada! Algoritmo optimizado con éxito.";
        document.getElementById("simPuntajeEnVivo").innerText = "Progreso: 100%";
        document.getElementById("simPuntajeEnVivo").style.color = "#4ade80";
      }
    }

    function reiniciarLabRobot() {
      simEngine.robot = { x: 1, y: 1, dir: 0 };
      document.getElementById("simStatusTitulo").innerText = "🎯 Estado: En espera de comandos";
      dibujarLabRobot();
    }

    // SIMULADOR 2: COMPUERTAS Y HARDWARE
    function renderizarSimuladorCompuertas() {
      var c = document.getElementById("simControles");
      c.innerHTML = 
        '<button class="cmd-btn" id="btnSwitchA" onclick="toggleSwitch(0)">Interruptor A: OFF</button>' +
        '<button class="cmd-btn" id="btnSwitchB" onclick="toggleSwitch(1)">Interruptor B: OFF</button>' +
        '<button class="cmd-btn" style="background:#059669; color:white;" onclick="validarCompuertas()">💡 Probar circuito</button>';

      dibujarCompuertas();
    }

    function toggleSwitch(idx) {
      simEngine.switches[idx] = !simEngine.switches[idx];
      reproducirSonido("click");
      document.getElementById("btnSwitch" + (idx === 0 ? "A" : "B")).innerText = "Interruptor " + (idx === 0 ? "A: " : "B: ") + (simEngine.switches[idx] ? "ON 🟢" : "OFF 🔴");
      dibujarCompuertas();
    }

    function dibujarCompuertas() {
      var ctx = simEngine.ctx;
      if (!ctx) return;
      var w = simEngine.canvas.width;
      var h = simEngine.canvas.height;
      ctx.clearRect(0, 0, w, h);

      var a = simEngine.switches[0];
      var b = simEngine.switches[1];
      var output = a && b; // Compuerta AND

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Circuito Lógico: Compuerta AND (Y)", 20, 30);

      // Líneas
      ctx.strokeStyle = a ? "#4ade80" : "#64748b";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(60, 80); ctx.lineTo(180, 80); ctx.stroke();

      ctx.strokeStyle = b ? "#4ade80" : "#64748b";
      ctx.beginPath();
      ctx.moveTo(60, 160); ctx.lineTo(180, 160); ctx.stroke();

      // Caja Compuerta
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#38bdf8";
      ctx.fillRect(180, 50, 120, 140);
      ctx.strokeRect(180, 50, 120, 140);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("AND", 220, 125);

      // Salida
      ctx.strokeStyle = output ? "#4ade80" : "#64748b";
      ctx.beginPath();
      ctx.moveTo(300, 120); ctx.lineTo(400, 120); ctx.stroke();

      // LED
      ctx.fillStyle = output ? "#22c55e" : "#334155";
      ctx.beginPath();
      ctx.arc(420, 120, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "12px sans-serif";
      ctx.fillText(output ? "💡 LED ON" : "LED OFF", 395, 170);
    }

    function validarCompuertas() {
      var output = simEngine.switches[0] && simEngine.switches[1];
      if (output) {
        reproducirSonido("victoria");
        estado.simulacionCompletada = true;
        estado.puntajeSimulacion = 100;
        document.getElementById("simStatusTitulo").innerText = "🎉 ¡Excelente! Circuito en nivel alto validado.";
        document.getElementById("simPuntajeEnVivo").innerText = "Progreso: 100%";
      } else {
        reproducirSonido("error");
        document.getElementById("simStatusTitulo").innerText = "⚠️ Una compuerta AND requiere que ambas entradas estén en ON.";
      }
    }

    // SIMULADOR 3: CIBERSEGURIDAD
    function renderizarSimuladorSeguridad() {
      var c = document.getElementById("simControles");
      c.innerHTML = 
        '<button class="cmd-btn" style="background:#e11d48; color:white;" onclick="clasificarSeguridad(true)">🛡️ Marcar amenaza</button>' +
        '<button class="cmd-btn" style="background:#059669; color:white;" onclick="clasificarSeguridad(false)">✅ Marcar seguro</button>';

      dibujarSeguridad();
    }

    var segIdx = 0;
    function dibujarSeguridad() {
      var ctx = simEngine.ctx;
      if (!ctx) return;
      var w = simEngine.canvas.width;
      var h = simEngine.canvas.height;
      ctx.clearRect(0, 0, w, h);

      var item = simEngine.seguridadItems[segIdx];
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("Auditoría de Seguridad - Caso " + (segIdx + 1) + " de 3", 20, 30);

      ctx.fillStyle = "#1e293b";
      ctx.fillRect(20, 60, w - 40, 120);
      ctx.strokeStyle = "#38bdf8";
      ctx.strokeRect(20, 60, w - 40, 120);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "13px sans-serif";
      wrapText(ctx, item ? item.texto : "¡Auditoría completada!", 36, 100, w - 72, 22);
    }

    function clasificarSeguridad(esAmenaza) {
      var item = simEngine.seguridadItems[segIdx];
      if (!item) return;

      if (item.esAmenaza === esAmenaza) {
        reproducirSonido("correcto");
        segIdx++;
        if (segIdx >= simEngine.seguridadItems.length) {
          reproducirSonido("victoria");
          estado.simulacionCompletada = true;
          estado.puntajeSimulacion = 100;
          document.getElementById("simStatusTitulo").innerText = "🎉 ¡Sistema blindado con éxito!";
          document.getElementById("simPuntajeEnVivo").innerText = "Progreso: 100%";
        } else {
          document.getElementById("simStatusTitulo").innerText = "✨ ¡Detección correcta! Siguiente caso.";
        }
      } else {
        reproducirSonido("error");
        document.getElementById("simStatusTitulo").innerText = "⚠️ Clasificación errónea. Analiza con cuidado.";
      }
      dibujarSeguridad();
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      var words = text.split(" ");
      var line = "";
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }

    // ==========================================
    // FASE 4: VALORACIÓN FORMATIVA & TELEMETRÍA
    // ==========================================
    function finalizarValoracion() {
      estado.tiempoSegundos = Math.round((Date.now() - estado.inicioTiempo) / 1000);
      
      var totalPregs = PREGUNTAS.length;
      var ratioPreguntas = estado.aciertosPreguntas / totalPregs;
      var ratioSim = estado.simulacionCompletada ? 1 : 0.6;
      
      var porcentaje = Math.round((ratioPreguntas * 60) + (ratioSim * 40));
      var nivel = "Consolidado";
      var criterioTexto = CONFIG.rubricaAvanzada;

      if (porcentaje >= 80) {
        nivel = "Consolidado";
        criterioTexto = CONFIG.rubricaAvanzada;
      } else if (porcentaje >= 60) {
        nivel = "En desarrollo";
        criterioTexto = CONFIG.rubricaIntermedia;
      } else {
        nivel = "En acompañamiento";
        criterioTexto = CONFIG.rubricaInicial;
      }

      document.getElementById("resPuntaje").innerText = porcentaje + "%";
      document.getElementById("resAciertos").innerText = estado.aciertosPreguntas + " / " + totalPregs;
      document.getElementById("resTiempo").innerText = estado.tiempoSegundos + "s";
      document.getElementById("criterioLogroTexto").innerText = criterioTexto;

      var badge = document.getElementById("badgeNivel");
      badge.innerText = "Nivel de logro: " + nivel;
      badge.className = "light-badge " + (nivel === "Consolidado" ? "light-avanzado" : (nivel === "En desarrollo" ? "light-intermedio" : "light-inicial"));

      enviarTelemetriaOnline(nivel, porcentaje);
    }

    function enviarTelemetriaOnline(nivel, porcentaje) {
      var estadoDiv = document.getElementById("estadoEnvio");
      estadoDiv.innerHTML = "📡 Enviando trabajo cotidiano al dashboard...";
      estadoDiv.style.background = "#e0f2fe";
      estadoDiv.style.color = "#0369a1";

      var payload = {
        webAppId: CONFIG.webAppId,
        webAppTitulo: CONFIG.webAppTitulo,
        docenteId: CONFIG.docenteId,
        estudianteNombre: "Estudiante III Ciclo",
        seccionOGrupo: "Secundaria",
        puntaje: porcentaje,
        puntajeMaximo: 100,
        porcentaje: porcentaje,
        nivelLogro: nivel,
        tiempoSegundos: estado.tiempoSegundos,
        totalReactivos: PREGUNTAS.length,
        aciertos: estado.aciertosPreguntas,
        fallos: PREGUNTAS.length - estado.aciertosPreguntas,
        timestamp: Date.now(),
        tokenAntiFraude: "token-cotidiano-" + Date.now().toString(36)
      };

      try {
        if (window.localStorage) {
          localStorage.setItem("ultimoResultadoCotidiano", JSON.stringify(payload));
          var rawPrev = localStorage.getItem("telemetria_registros");
          var listaPrev = rawPrev ? JSON.parse(rawPrev) : [];
          var unificados = [payload].concat(listaPrev.filter(function(r) {
            return !(r.estudianteNombre === payload.estudianteNombre && Math.abs(r.timestamp - payload.timestamp) < 3000);
          }));
          localStorage.setItem("telemetria_registros", JSON.stringify(unificados));
        }
      } catch(e) {}

      var endpoints = [];
      if (window.location.protocol === "http:" || window.location.protocol === "https:") {
        endpoints.push(window.location.origin + "/api/telemetria/enviar");
      }
      endpoints.push("http://localhost:3001/api/telemetria/enviar");
      endpoints.push("http://localhost:3000/api/telemetria/enviar");

      function intentarEndpoint(index) {
        if (index >= endpoints.length) {
          estadoDiv.innerHTML = "✅ ¡Registrado localmente! También puedes mostrar el código QR al docente.";
          estadoDiv.style.background = "#dcfce7";
          estadoDiv.style.color = "#166534";
          return;
        }

        var url = endpoints[index];
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          mode: "cors"
        })
        .then(function(res) {
          if (res.ok) {
            estadoDiv.innerHTML = "✅ ¡Trabajo registrado con éxito en el dashboard del docente!";
            estadoDiv.style.background = "#dcfce7";
            estadoDiv.style.color = "#166534";
          } else {
            intentarEndpoint(index + 1);
          }
        })
        .catch(function() {
          intentarEndpoint(index + 1);
        });
      }

      intentarEndpoint(0);
    }

    // ==========================================
    // QR OFFLINE Y MODALES
    // ==========================================
    function dibujarQROriginal(canvas, texto) {
      var ctx = canvas.getContext("2d");
      var size = canvas.width;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      var modulos = 25;
      var tamModulo = size / modulos;
      ctx.fillStyle = "#003366";

      function dibujarMarcador(x, y) {
        ctx.fillRect(x * tamModulo, y * tamModulo, 7 * tamModulo, 7 * tamModulo);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect((x + 1) * tamModulo, (y + 1) * tamModulo, 5 * tamModulo, 5 * tamModulo);
        ctx.fillStyle = "#003366";
        ctx.fillRect((x + 2) * tamModulo, (y + 2) * tamModulo, 3 * tamModulo, 3 * tamModulo);
      }

      dibujarMarcador(1, 1);
      dibujarMarcador(modulos - 8, 1);
      dibujarMarcador(1, modulos - 8);

      var seed = 0;
      for (var i = 0; i < texto.length; i++) seed += texto.charCodeAt(i);

      for (var r = 0; r < modulos; r++) {
        for (var c = 0; c < modulos; c++) {
          if ((r < 9 && c < 9) || (r < 9 && c > modulos - 10) || (r > modulos - 10 && c < 9)) continue;
          seed = (seed * 9301 + 49297) % 233280;
          if (seed / 233280 > 0.5) {
            ctx.fillRect(c * tamModulo, r * tamModulo, tamModulo - 0.5, tamModulo - 0.5);
          }
        }
      }
    }

    function mostrarModalQR() {
      var canvas = document.getElementById("qrCanvas");
      var textoQR = JSON.stringify({
        t: "COTIDIANO_SECUNDARIA",
        wId: CONFIG.webAppId,
        ind: CONFIG.indicadorCodigo,
        saber: CONFIG.saberConceptual,
        seg: estado.tiempoSegundos,
        ts: Date.now()
      });

      dibujarQROriginal(canvas, textoQR);
      document.getElementById("tokenHashLabel").innerText = "Evidencia: " + textoQR;
      document.getElementById("modalQR").style.display = "flex";
    }

    function cerrarModalQR() {
      document.getElementById("modalQR").style.display = "none";
    }

    function mostrarModalInstrumento() {
      document.getElementById("modalInstrumento").style.display = "flex";
    }

    function cerrarModalInstrumento() {
      document.getElementById("modalInstrumento").style.display = "none";
    }

    function toggleModoVisual() {
      estado.modoLigero = !estado.modoLigero;
      var btn = document.getElementById("btnModo");
      if (estado.modoLigero) {
        document.body.className = "modo-ligero";
        btn.innerText = "✨ Modo Completo";
      } else {
        document.body.className = "";
        btn.innerText = "🌱 Modo Ligero";
      }
    }

    function descargarHTMLAuto() {
      var blob = new Blob([document.documentElement.outerHTML], { type: "text/html;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "${escapeJS(opts.titulo).toLowerCase().replace(/[^a-z0-9]/g, "_")}.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function reiniciarTodo() {
      estado.inicioTiempo = Date.now();
      estado.indicePregunta = 0;
      estado.aciertosPreguntas = 0;
      estado.simulacionCompletada = false;
      segIdx = 0;
      irAFase(1);
    }

    function escapeHTMLJS(str) {
      if (!str) return "";
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Inicializar
    irAFase(1);
  </script>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJS(str: string): string {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r");
}
