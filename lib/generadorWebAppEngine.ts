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
 * Genera el Prompt blindado estructurado para copiar y llevar a IAs externas (Gemini Canvas, Claude, ChatGPT, DeepSeek, Qwen)
 */
export function generarPromptParaIAExterna(opts: OpcionesGeneracionWebApp): string {
  const preguntasTxt = opts.preguntasComprender && opts.preguntasComprender.length > 0
    ? opts.preguntasComprender.map((p, idx) => `   Pregunta ${idx + 1}: ${p.pregunta}\n   Opciones: ${p.opciones.join(" | ")}\n   Explicación: ${p.explicacion}`).join("\n\n")
    : "   Diseña 2 o 3 preguntas conceptuales y reflexivas situadas que validen la comprensión esencial de este indicador.";

  const valoresTxt = opts.valoresTransversalesMEP && opts.valoresTransversalesMEP.length > 0
    ? opts.valoresTransversalesMEP.join(", ")
    : "Empatía, ética digital, pensamiento crítico, trabajo colaborativo y respeto";

  const neeInfo = opts.ajusteNEE?.esRecursoIndividualizado
    ? `\n⚠️ [RECURSO INDIVIDUALIZADO PARA ATENCIÓN A NEE]:
• Tipo de Ajuste: ${opts.ajusteNEE.nombreAjuste}
• Pautas de Adaptación: ${opts.ajusteNEE.descripcionAjuste || "Adaptar ritmo, micro-pasos guiados, apoyos visuales y lectura fácil."}
• La WebApp debe estar optimizada especialmente para este estudiante garantizando su autonomía y éxito formativo.`
    : `\n🌿 [BASE TRANSVERSAL DUA ACTIVA]: Diseño Universal para el Aprendizaje 100% integrado (múltiples formas de representación, expresión y motivación).`;

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
   - Explicación clara, amigable y visual de los conceptos fundamentales que sustentan este indicador.
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
   - Rúbrica formativa según el nivel de logro alcanzado (Inicial, Intermedio, Avanzado).
   - Generación de comprobante con código único y token de integridad SHA-256.
   - Envío de telemetría automática mediante Webhook a Google Sheets (mode: 'no-cors') y botón de Código QR offline de respaldo.

============================================================
🛡️ REQUISITOS TÉCNICOS BLINDADOS
============================================================
- Un solo archivo .html independiente (CERO dependencias CDN externas bloqueables).
- Compatible con navegadores modernos y antiguos (Chrome 50+ / sin optional chaining en runtime).
- Persistencia SafeStorage con fallback a RAM.
- Totalmente responsive y touch-first (computadoras, teléfonos y tabletas).
- Entrega el código HTML COMPLETO dentro de un solo bloque \`\`\`html listo para guardar y ejecutar.`;
}

/**
 * Genera el código HTML completo y funcional de la WebApp Autónoma adaptada al documento
 */
export function generarCodigoHTMLAutonomo(opts: OpcionesGeneracionWebApp): string {
  const urlApi = opts.urlTelemetriaBase || "https://creador-webapps.local/api/telemetria/enviar";
  const timestampGen = Date.now();
  const explicacion = opts.explicacionPedagogica || "El saber conceptual permite comprender el funcionamiento lógico de los sistemas digitales y aplicarlo en la resolución de problemas cotidianos.";

  // Preguntas adaptadas
  const pComprender1 = opts.preguntasComprender && opts.preguntasComprender[0]
    ? opts.preguntasComprender[0]
    : {
        pregunta: `¿Cuál es el propósito fundamental al aplicar ${opts.saberConceptual} en un desafío tecnológico?`,
        opciones: [
          "Estructurar una solución lógica, clara y precisa antes de ejecutarla.",
          "Realizar cambios al azar sin analizar el problema.",
          "Memorizar código sin entender su funcionamiento.",
        ],
        correcta: 0,
        explicacion: "La comprensión lógica del concepto permite diseñar soluciones ordenadas y eficientes.",
      };

  const nombreParametro = opts.parametrosSimulacion?.nombreVariable || "Parámetro de Entrada / Variable";
  const instruccionSim = opts.parametrosSimulacion?.instruccion || "Ajusta los parámetros para resolver el reto interactivo y validar el comportamiento del sistema.";

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
    }
    button:hover, .btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .btn-secondary { background: rgba(255,255,255,0.2); }
    .btn-accent { background: var(--accent); }
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
    }
    .opcion-btn:hover { border-color: var(--brand); background: #f0f7ff; }
    .opcion-btn.correcta { background: #dcfce7 !important; border-color: var(--accent) !important; color: #166534 !important; }
    .opcion-btn.incorrecta { background: #fee2e2 !important; border-color: var(--danger) !important; color: #991b1b !important; }
    
    .interactive-board {
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 15px 0;
    }
    .slider-control {
      width: 100%;
      margin: 10px 0;
    }
    .traffic-light {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 15px 0;
    }
    .light-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 12px;
    }
    .light-inicial { background: #fee2e2; color: #991b1b; }
    .light-intermedio { background: #fef3c7; color: #92400e; }
    .light-avanzado { background: #dcfce7; color: #166534; }
    
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.75);
      justify-content: center;
      align-items: center;
      padding: 20px;
      z-index: 999;
    }
    .modal-content {
      background: white;
      border-radius: var(--radius);
      padding: 24px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      color: #0f172a;
    }
  </style>
</head>
<body>

  <header>
    <div>
      <span class="badge" style="background:#059669;">${escapeHTML(opts.nivel)}</span>
      <span class="badge" style="background:#f59e0b; color:#78350f;">Trabajo Cotidiano</span>
      <h2 style="font-size: 1.1rem; margin-top: 4px;">${escapeHTML(opts.titulo)}</h2>
    </div>
    <div class="top-controls">
      <button class="btn btn-secondary" onclick="mostrarModalInstrumento()">📋 Instrumento de Evaluación</button>
      <button class="btn btn-secondary" onclick="toggleModoVisual()" id="btnModo">🌱 Modo Ligero</button>
      <button class="btn btn-accent" onclick="descargarHTMLAuto()">⬇️ Descargar .html</button>
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="badge" style="background: #e0f2fe; color: #0369a1; font-size: 12px;">
          Saber Conceptual: ${escapeHTML(opts.saberConceptual)}
        </span>
        <button class="btn btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="mostrarModalInstrumento()">
          📋 Ver Criterios de Evaluación
        </button>
      </div>

      <h3 style="color: var(--brand-dark); font-size: 1.25rem; margin-bottom: 12px;">
        ${escapeHTML(opts.saberTitulo)}
      </h3>

      <div style="background: #f1f5f9; border-left: 4px solid var(--brand); padding: 16px; border-radius: 0 10px 10px 0; margin-bottom: 18px;">
        <p style="font-size: 14px; line-height: 1.6; color: var(--text-main);">
          ${escapeHTML(explicacion)}
        </p>
      </div>

      <div style="background: white; border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 20px;">
        <h4 style="font-size: 13px; font-weight: 800; color: var(--brand-dark); margin-bottom: 8px;">
          📌 Elementos Pedagógicos Integrados:
        </h4>
        <ul style="font-size: 13px; color: var(--text-muted); padding-left: 20px; line-height: 1.6;">
          <li><strong>Procedimental (Hacer):</strong> ${escapeHTML(opts.saberProcedimental || "Modulariza y depura soluciones algorítmicas")}.</li>
          <li><strong>Actitudinal (Ser):</strong> ${escapeHTML(opts.saberActitudinal || "Gusto por la precisión y aprender del error")}.</li>
          <li><strong>Indicador:</strong> [${escapeHTML(opts.indicadorCodigo)}] ${escapeHTML(opts.indicadorNombre)}.</li>
        </ul>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-accent" style="padding: 10px 20px; font-size: 14px;" onclick="irAFase(2)">
          Continuar a Comprender ➔
        </button>
      </div>
    </div>

    <!-- FASE 2: COMPRENDER (CHEQUEO CONCEPTUAL ADAPTADO) -->
    <div id="seccionFase2" class="card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="badge" style="background: #fef3c7; color: #92400e; font-size: 12px;">
          Comprobación Rápida
        </span>
        <span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Fase 2 de 4</span>
      </div>

      <h3 style="color: var(--brand-dark); font-size: 1.15rem; margin-bottom: 15px;">
        ¿Comprendiste el Saber Conceptual?
      </h3>

      <div id="preguntaConceptualContenedor">
        <p style="font-size: 14px; font-weight: 700; margin-bottom: 12px;" id="textoPreguntaConcepto">
          ${escapeHTML(pComprender1.pregunta)}
        </p>
        <div id="opcionesConcepto">
          ${pComprender1.opciones
            .map(
              (opc, idx) => `
            <button class="opcion-btn" onclick="responderConcepto(${idx}, ${idx === pComprender1.correcta})">
              ${String.fromCharCode(65 + idx)}. ${escapeHTML(opc)}
            </button>
          `
            )
            .join("")}
        </div>
      </div>

      <div id="retroConcepto" style="display: none; padding: 12px; border-radius: 8px; margin-top: 14px; font-size: 13px; font-weight: 600;"></div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-outline" onclick="irAFase(1)">⬅️ Repasar Saber</button>
        <button id="btnIrSimulacion" class="btn btn-accent" style="display: none;" onclick="irAFase(3)">
          Ir a la Simulación Práctica ➔
        </button>
      </div>
    </div>

    <!-- FASE 3: SIMULACIÓN (MECÁNICA Y RETO ADAPTADO) -->
    <div id="seccionFase3" class="card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span class="badge" style="background: #dcfce7; color: #166534; font-size: 12px;">
          Mecánica: ${escapeHTML(opts.mecanica)}
        </span>
        <span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Fase 3 de 4</span>
      </div>

      <h3 style="color: var(--brand-dark); font-size: 1.15rem; margin-bottom: 8px;">
        Laboratorio de Experimentación Práctica
      </h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">
        ${escapeHTML(instruccionSim)}
      </p>

      <!-- Tablero interactivo con controles superiores -->
      <div class="interactive-board">
        <!-- BARRA SUPERIOR DE PRUEBAS Y CONTROLES -->
        <div style="background: #0f172a; border-radius: 10px; padding: 12px 16px; color: white; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; font-weight: 700;">
            <span style="color: #38bdf8;">🎛️ ${escapeHTML(nombreParametro)}</span>
            <span style="color: #f59e0b;" id="labelValorParam">Calibración: 50</span>
          </div>
          <input type="range" id="sliderParametro" min="10" max="100" value="50" class="slider-control" style="width: 100%; cursor: pointer;" oninput="actualizarSimulacion(this.value)">
        </div>

        <!-- RESPUESTA VISUAL Y MONITOREO -->
        <div id="visualizadorEstado" style="background: white; border: 2px solid var(--border); padding: 16px; border-radius: 10px; margin-bottom: 15px;">
          <div style="font-size: 30px; margin-bottom: 5px;" id="iconoSimulacion">⚡</div>
          <div style="font-size: 13px; font-weight: 700; color: var(--brand-dark);" id="mensajeSimulacion">Estado: En espera de calibración</div>
        </div>

        <button class="btn btn-accent" style="padding: 10px 24px; font-weight: 700;" onclick="ejecutarPasoSimulacion()">
          ▶️ Comprobar y Validar Respuesta en Tiempo Real
        </button>
      </div>

      <div style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="btn btn-outline" onclick="irAFase(2)">⬅️ Volver</button>
        <button class="btn btn-accent" onclick="irAFase(4)">Finalizar y Evaluar ➔</button>
      </div>
    </div>

    <!-- FASE 4: VALORACIÓN (TRABAJO COTIDIANO & TELEMETRÍA) -->
    <div id="seccionFase4" class="card" style="display: none; text-align: center;">
      <div style="font-size: 44px; margin-bottom: 6px;">🎉</div>
      <h2 style="color: var(--brand-dark); font-size: 1.3rem;">Valoración de Trabajo Cotidiano</h2>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">
        Indicador: <strong>${escapeHTML(opts.indicadorCodigo)}</strong> - ${escapeHTML(opts.indicadorNombre)}
      </p>

      <div class="traffic-light">
        <span id="badgeNivel" class="light-badge light-avanzado">Avanzado (≥ 80%)</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0;">
        <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Puntaje Cotidiano</div>
          <div id="resPuntaje" style="font-size: 20px; font-weight: 900; color: var(--brand);">100%</div>
        </div>
        <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Precisión y Aciertos</div>
          <div id="resAciertos" style="font-size: 20px; font-weight: 900; color: var(--accent);">4 / 4</div>
        </div>
        <div style="background: #f8fafc; padding: 14px; border-radius: 10px; border: 1px solid var(--border);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Tiempo Empleado</div>
          <div id="resTiempo" style="font-size: 20px; font-weight: 900; color: var(--warning);">45s</div>
        </div>
      </div>

      <div id="estadoEnvio" style="padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px; font-weight: 600;">
        📡 Sincronizando con el Dashboard del Docente...
      </div>

      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-accent" onclick="mostrarModalQR()">📱 Mostrar QR Offline (Sin Internet)</button>
        <button class="btn btn-outline" onclick="mostrarModalInstrumento()">📋 Rúbrica de Evaluación</button>
        <button class="btn btn-outline" onclick="reiniciarTodo()">🔄 Repetir Actividad</button>
      </div>
    </div>

  </main>

  <!-- MODAL INSTRUMENTO DE EVALUACIÓN TRANSPARENTE -->
  <div id="modalInstrumento" class="modal">
    <div class="modal-content" style="max-width: 580px; text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 14px;">
        <h3 style="color: var(--brand-dark); font-size: 1.15rem; margin: 0;">📋 Instrumento de Evaluación</h3>
        <button class="btn btn-outline" style="padding: 4px 8px;" onclick="cerrarModalInstrumento()">✕</button>
      </div>
      
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
        Criterios e indicadores que se valoran tanto en la WebApp interactiva como en la observación del docente:
      </p>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
        <strong style="color: #0369a1; font-size: 12px; display: block; margin-bottom: 4px;">🧠 1. Dimensión Cognitiva / Conceptual:</strong>
        <p style="font-size: 12px; margin: 0; color: var(--text-main);">${escapeHTML(opts.instrumentoEvaluacion?.criterioCognitivo || "Identifica y aplica los conceptos fundamentales en las preguntas formativas.")}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 10px;">
        <strong style="color: #166534; font-size: 12px; display: block; margin-bottom: 4px;">⚙️ 2. Dimensión Procedimental:</strong>
        <p style="font-size: 12px; margin: 0; color: var(--text-main);">${escapeHTML(opts.instrumentoEvaluacion?.criterioProcedimental || "Formula secuencias lógicas y depura errores en el laboratorio interactivo.")}</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 14px;">
        <strong style="color: #92400e; font-size: 12px; display: block; margin-bottom: 4px;">❤️ 3. Dimensión Socioafectiva y Actitudinal:</strong>
        <p style="font-size: 12px; margin: 0; color: var(--text-main);">${escapeHTML(opts.instrumentoEvaluacion?.criterioSocioafectivo || opts.saberActitudinal || "Muestra perseverancia ante el error, autonomía en la resolución y actitud colaborativa.")}</p>
      </div>

      <div style="border-top: 1px solid var(--border); padding-top: 10px; margin-top: 10px;">
        <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 6px;">ESCALA DE LOGRO:</div>
        <div style="font-size: 11px; line-height: 1.5; color: var(--text-main);">
          • <strong>Consolidado (≥80%):</strong> ${escapeHTML(opts.instrumentoEvaluacion?.escalas?.consolidado || "Demuestra autonomía, precisión y autorregulación.")}<br>
          • <strong>En Desarrollo (60-79%):</strong> ${escapeHTML(opts.instrumentoEvaluacion?.escalas?.desarrollo || "Aplica conceptos y resuelve retos con apoyo ocasional.")}<br>
          • <strong>En Acompañamiento (&lt;60%):</strong> ${escapeHTML(opts.instrumentoEvaluacion?.escalas?.acompanamiento || "Requiere andamiaje constante y reexplicación de conceptos.")}
        </div>
      </div>

      <div style="margin-top: 16px; text-align: right;">
        <button class="btn btn-accent" style="padding: 8px 18px;" onclick="cerrarModalInstrumento()">Entendido</button>
      </div>
    </div>
  </div>


  </main>

  <!-- MODAL QR OFFLINE -->
  <div id="modalQR" class="modal">
    <div class="modal-content">
      <h3 style="color: var(--brand-dark); margin-bottom: 6px;">Comprobante QR de Trabajo Cotidiano</h3>
      <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">
        Muestra este código a la cámara de tu docente para registrar tus evidencias de clase sin gastar internet.
      </p>
      <div style="display: flex; justify-content: center; margin: 15px 0;">
        <canvas id="qrCanvas" width="220" height="220" style="border: 4px solid #003366; border-radius: 8px;"></canvas>
      </div>
      <div id="tokenHashLabel" style="font-family: monospace; font-size: 10px; color: #64748b; word-break: break-all; margin-bottom: 15px;"></div>
      <button class="btn" style="width: 100%;" onclick="cerrarModalQR()">Cerrar Comprobante</button>
    </div>
  </div>

  <script>
    var CONFIG = {
      webAppId: "webapp-" + ${timestampGen},
      webAppTitulo: "${escapeJS(opts.titulo)}",
      docenteId: "${escapeJS(opts.docenteId)}",
      saberConceptual: "${escapeJS(opts.saberConceptual)}",
      indicadorCodigo: "${escapeJS(opts.indicadorCodigo)}",
      urlTelemetria: "${urlApi}"
    };

    var estado = {
      faseActual: 1,
      conceptoCorrecto: false,
      simulacionCompletada: false,
      puntaje: 100,
      inicioTiempo: Date.now(),
      tiempoSegundos: 0,
      modoLigero: false
    };

    function irAFase(num) {
      estado.faseActual = num;
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
      if (num === 4) {
        finalizarValoracion();
      }
    }

    function responderConcepto(opc, esCorrecta) {
      var btns = document.getElementById("opcionesConcepto").children;
      for (var i = 0; i < btns.length; i++) {
        btns[i].disabled = true;
        if (i === ${pComprender1.correcta}) btns[i].className += " correcta";
        else if (i === opc) btns[i].className += " incorrecta";
      }

      var retro = document.getElementById("retroConcepto");
      retro.style.display = "block";
      if (esCorrecta) {
        retro.style.background = "#dcfce7";
        retro.style.color = "#166534";
        retro.innerText = "✨ ¡Excelente comprensión! ${escapeJS(pComprender1.explicacion)}";
        estado.conceptoCorrecto = true;
      } else {
        retro.style.background = "#fee2e2";
        retro.style.color = "#991b1b";
        retro.innerText = "💡 ${escapeJS(pComprender1.explicacion)}";
        estado.puntaje = 85;
      }
      document.getElementById("btnIrSimulacion").style.display = "inline-block";
    }

    function actualizarSimulacion(val) {
      document.getElementById("labelValorParam").innerText = "Valor: " + val;
    }

    function ejecutarPasoSimulacion() {
      var val = parseInt(document.getElementById("sliderParametro").value);
      var icono = document.getElementById("iconoSimulacion");
      var msg = document.getElementById("mensajeSimulacion");

      if (val >= 40 && val <= 80) {
        icono.innerText = "🎯";
        msg.innerText = "¡Algoritmo y Parámetro Óptimo! El sistema responde con precisión según el procedimiento.";
        msg.style.color = "#166534";
        estado.simulacionCompletada = true;
      } else {
        icono.innerText = "⚠️";
        msg.innerText = "Condición límite. Ajusta el rango entre 40 y 80 para calibrar con exactitud.";
        msg.style.color = "#92400e";
      }
    }

    function finalizarValoracion() {
      estado.tiempoSegundos = Math.round((Date.now() - estado.inicioTiempo) / 1000);
      var porcentaje = estado.conceptoCorrecto ? (estado.simulacionCompletada ? 100 : 85) : 70;
      var nivel = porcentaje >= 80 ? "Avanzado" : (porcentaje >= 60 ? "Intermedio" : "Inicial");

      document.getElementById("resPuntaje").innerText = porcentaje + "%";
      document.getElementById("resTiempo").innerText = estado.tiempoSegundos + "s";
      document.getElementById("badgeNivel").innerText = "Nivel de Logro: " + nivel + " (Cotidiano)";
      document.getElementById("badgeNivel").className = "light-badge " + (nivel === "Avanzado" ? "light-avanzado" : (nivel === "Intermedio" ? "light-intermedio" : "light-inicial"));

      enviarTelemetriaOnline(nivel, porcentaje);
    }

    function enviarTelemetriaOnline(nivel, porcentaje) {
      var estadoDiv = document.getElementById("estadoEnvio");
      estadoDiv.innerHTML = "📡 Enviando Trabajo Cotidiano al Dashboard...";
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
        totalReactivos: 4,
        aciertos: porcentaje >= 80 ? 4 : 3,
        fallos: porcentaje >= 80 ? 0 : 1,
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
      endpoints.push("http://127.0.0.1:3001/api/telemetria/enviar");
      endpoints.push("http://127.0.0.1:3000/api/telemetria/enviar");

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
            estadoDiv.innerHTML = "✅ ¡Trabajo registrado con éxito en el Dashboard Docente!";
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
        dId: CONFIG.docenteId,
        pts: 100,
        seg: estado.tiempoSegundos,
        ts: Date.now()
      });

      dibujarQROriginal(canvas, textoQR);
      document.getElementById("tokenHashLabel").innerText = "Payload: " + textoQR;
      document.getElementById("modalQR").style.display = "flex";
    }

    function cerrarModalQR() {
      document.getElementById("modalQR").style.display = "none";
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
      estado.conceptoCorrecto = false;
      estado.simulacionCompletada = false;
      irAFase(1);
    }
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
