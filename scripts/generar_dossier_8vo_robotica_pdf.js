const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDocumento8voPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de colores oficial MEP & 8.° año
  const COLOR_PRIMARY = [0, 51, 102];     // Azul Institucional MEP #003366
  const COLOR_HEADER = [15, 23, 42];      // Slate 900 #0f172a
  const COLOR_TEAL = [13, 148, 136];      // Teal 600 #0d9488
  const COLOR_TEAL_DARK = [15, 118, 110]; // Teal 700 #0f766e
  const COLOR_INDIGO = [67, 56, 202];     // Indigo 700 #4338ca
  const COLOR_AMBER = [180, 83, 9];       // Amber 700 #b45309
  const COLOR_DARK = [15, 23, 42];        // Slate 900 (Texto principal)
  const COLOR_MUTED = [71, 85, 105];      // Slate 600 (Texto secundario de alto contraste)
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50 (Fondo tarjetas claras)
  const COLOR_BORDER = [203, 213, 225];   // Slate 300 (Bordes definidos)

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Barra superior
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFillColor(...COLOR_TEAL);
    doc.rect(0, 5, pageWidth, 1.5, 'F');

    // Texto de cabecera
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2027", margin, 11.5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Documento técnico oficial • Diagnóstico de 8.° año", pageWidth - margin, 11.5, { align: 'right' });

    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, 13.5, pageWidth - margin, 13.5);

    // Barra inferior
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text("Evaluación diagnóstica de 8.° año: robótica, algoritmos y apropiación tecnológica (triada formativa)", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA Y FUNDAMENTACIÓN PEDAGÓGICA DE 8.° AÑO
  // =========================================================================
  
  // Banner de portada
  doc.setFillColor(...COLOR_HEADER);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_TEAL);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Distintivo superior
  doc.setFillColor(13, 148, 136);
  doc.roundedRect(margin, 10, 120, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • MEP 2027", margin + 4, 14.5);

  // Títulos principales en formato gramatical hispanoamericano
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Diagnóstico de 8.° año: robótica y algoritmos", margin, 26);
  doc.setFontSize(13);
  doc.setTextColor(94, 234, 212); // Teal claro
  doc.text("Guía pedagógica y documento técnico oficial", margin, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluación formativa articulada: 14 indicadores de logro, 3 subáreas curriculares y observación docente.", margin, 42);
  doc.text("Operatividad dual: en línea con telemetría reactiva o 100% desconectado con códigos QR cifrados.", margin, 48);

  // Tarjeta de Ficha Técnica
  let yPos = 67;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 32, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Ficha técnica del recurso diagnóstico (8.° año)", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Población meta: Estudiantes de 8.° año (octavo de secundaria / Tercer Ciclo de la EGB).", margin + 6, yPos + 12);
  doc.text("• Estructura curricular: 3 subáreas (HW/SW, algoritmos, robótica) más dimensiones socioafectiva y psicomotora.", margin + 6, yPos + 17);
  doc.text("• Enfoque de evaluación: Formativo, diagnóstico y cualitativo (identificación de brechas de entrada sin nota punitiva).", margin + 6, yPos + 22);
  doc.text("• Acceso web en producción: https://diagnosticosecundaria.vercel.app/diagnostico (pestaña 8.° año).", margin + 6, yPos + 27);

  // 1. Fundamentación Pedagógica
  yPos = 105;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Fundamentación pedagógica y curricular de 8.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El nivel de 8.° año consolida el pensamiento algorítmico y avanza hacia la computación física y robótica educativa. La prueba diagnóstica articula los aprendizajes del año previo para diagnosticar tres subáreas curriculares clave mediante situaciones contextualizadas y retos prácticos:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 123;
  const colW = (contentWidth - 6) / 3;

  // Subárea 1: Apropiación y HW/SW
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_TEAL_DARK);
  doc.text("Subárea 1: Apropiación de HW y SW", margin + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Periféricos de entrada y salida (ítem 1).", margin + 4, yPos + 14);
  doc.text("• Clasificación de software (ítem 2).", margin + 4, yPos + 21);
  doc.text("• Redes, módem y enrutador (ítem 3).", margin + 4, yPos + 28);
  doc.text("• Almacenamiento y sistema operativo (4 y 5).", margin + 4, yPos + 35);

  // Subárea 2: Algoritmos y Lógica
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + colW + 3, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_INDIGO);
  doc.text("Subárea 2: Algoritmos y lógica", margin + colW + 7, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Estructura E-P-S aplicada (ítem 6).", margin + colW + 7, yPos + 14);
  doc.text("• Variables y tipos booleanos (ítems 7 y 8).", margin + colW + 7, yPos + 21);
  doc.text("• Condicionales y bucles (ítems 9 y 10).", margin + colW + 7, yPos + 28);
  doc.text("• Operadores y sintaxis (ítems 11 y 12).", margin + colW + 7, yPos + 35);

  // Subárea 3: Robótica y Socioafectiva
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin + (colW + 3) * 2, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_AMBER);
  doc.text("Subárea 3: Robótica y DUA", margin + (colW + 3) * 2 + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Sensores, actuadores y MCU (ítem 13).", margin + (colW + 3) * 2 + 4, yPos + 14);
  doc.text("• Seguridad y prevención técnica (ítem 14).", margin + (colW + 3) * 2 + 4, yPos + 21);
  doc.text("• Mini-reto socioafectivo y metacognición.", margin + (colW + 3) * 2 + 4, yPos + 28);
  doc.text("• Lista de cotejo psicomotora docente.", margin + (colW + 3) * 2 + 4, yPos + 35);

  // 2. Principios DUA y Accesibilidad
  yPos = 177;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. Principios de accesibilidad y Diseño Universal para el Aprendizaje (DUA)", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLOR_DARK,
      cellPadding: 2.2
    },
    columnStyles: {
      0: { cellWidth: 34, fontStyle: 'bold' },
      1: { cellWidth: 74 },
      2: { cellWidth: 74 }
    },
    head: [['Principio DUA', 'Mecanismo en el instrumento de 8.° año', 'Impacto inclusivo']],
    body: [
      ['Múltiples formas de representación', 'Barra de accesibilidad con alto contraste, ajuste de tamaño de fuente (A+ / A-) y lectura facilitada.', 'Garantiza acceso pleno a estudiantes con baja visión o diversidad sensorial.'],
      ['Múltiples formas de acción y expresión', 'Navegación intuitiva por teclado y mouse, confirmación de respuestas y simulador interactivo.', 'Flexibilidad de interacción para estudiantes con diversas preferencias psicomotrices.'],
      ['Múltiples formas de implicación', 'Retroalimentación formativa inmediata, barras de progreso y comprobante digital final.', 'Fomenta la motivación intrínseca y reduce la ansiedad ante la evaluación diagnóstica.'],
      ['Resiliencia sin conexión (Offline-first)', 'Archivo autónomo ejecutable sin conexión a internet y transmisión de datos vía código QR cifrado.', 'Equidad absoluta para colegios y liceos rurales sin acceso estable a la red.']
    ]
  });

  drawHeaderFooter(1, 5, "Fundamentación curricular y DUA de 8.° año");

  // =========================================================================
  // PÁGINA 2: LOS 14 INDICADORES COGNITIVOS DE 8.° AÑO
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Matriz de los 14 indicadores de logro cognitivos (8.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Distribución detallada de los reactivos y saberes evaluados en la prueba diagnóstica de 8.° año según el programa oficial del MEP:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 31;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 6.8,
      textColor: COLOR_DARK,
      cellPadding: 1.8
    },
    columnStyles: {
      0: { cellWidth: 14, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 62 },
      4: { cellWidth: 38 }
    },
    head: [['Ítem', 'Subárea', 'Saber evaluado', 'Descripción del reactivo contextualizado', 'Criterio de desempeño']],
    body: [
      ['Ítem 1', 'HW / SW', 'Periféricos de entrada y salida', 'Asociación funcional de teclado, mouse, monitor, parlantes, cámara web y memoria USB.', 'Logrado: 6/6 correctos.\nEn proceso: 4-5 correctos.'],
      ['Ítem 2', 'HW / SW', 'Clasificación de software', 'Distinción entre software de sistema, aplicación, programación y diseño gráfico.', 'Logrado: Identifica las 4 categorías.'],
      ['Ítem 3', 'HW / SW', 'Redes y conectividad', 'Función de módem frente a enrutador (router) en la transmisión y direccionamiento de paquetes.', 'Logrado: Diferencia modulación de enrutamiento.'],
      ['Ítem 4', 'HW / SW', 'Gestión del sistema operativo', 'Recuperación de archivos eliminados desde la papelera y comprensión de rutas de carpetas.', 'Logrado: Conoce proceso de restauración.'],
      ['Ítem 5', 'HW / SW', 'Unidades de almacenamiento', 'Jerarquía de unidades: Byte, KB, MB, GB, TB y cálculo elemental de capacidad de almacenamiento.', 'Logrado: Ordena y calcula unidades.'],
      ['Ítem 6', 'Algoritmos', 'Estructura E-P-S', 'Identificación de Entrada, Proceso y Salida en situaciones del entorno cotidiano.', 'Logrado: Desglosa fases del algoritmo.'],
      ['Ítem 7', 'Algoritmos', 'Tipos de datos', 'Uso de datos primitivos: entero, texto, decimal y booleano (verdadero/falso).', 'Logrado: Discrimina tipos de variables.'],
      ['Ítem 8', 'Algoritmos', 'Actualización de variables', 'Evaluación de acumuladores y contadores en secuencias de ejecución (ej. puntos = puntos + 10).', 'Logrado: Rastrea el valor de memoria.'],
      ['Ítem 9', 'Algoritmos', 'Condicionales Si / Sino', 'Toma de decisiones lógicas basadas en lecturas de sensores (ej. Temperatura > 30).', 'Logrado: Evalúa ramas condicionales.'],
      ['Ítem 10', 'Algoritmos', 'Bucles y ciclos repetitivos', 'Estructuras repetitivas (Para / Mientras) para evitar redundancia de instrucciones.', 'Logrado: Optimiza algoritmos con ciclos.'],
      ['Ítem 11', 'Algoritmos', 'Operadores aritméticos', 'Cálculo algorítmico de precios con porcentaje de descuento aplicado y precedencia de operadores.', 'Logrado: Aplica precedencia matemática.'],
      ['Ítem 12', 'Algoritmos', 'Operadores relacionales', 'Comparaciones lógicas utilizando operadores de relación (=, <>, <, >, <=, >=).', 'Logrado: Resuelve tablas de verdad.'],
      ['Ítem 13', 'Robótica', 'Sensores y actuadores', 'Componentes de un sistema robótico: sensores (entrada), MCU (control) y actuadores (salida).', 'Logrado: Clasifica flujo de señales.'],
      ['Ítem 14', 'Robótica', 'Seguridad y prevención', 'Prevención de cortocircuitos, verificación de polaridades y orden técnico en el taller.', 'Logrado: Aplica normas de seguridad.']
    ]
  });

  drawHeaderFooter(2, 5, "14 Indicadores cognitivos de 8.° año");

  // =========================================================================
  // PÁGINA 3: RÚBRICAS PSICOMOTRICES Y SOCIOAFECTIVAS (8.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Rúbricas oficiales docentes: dimensión psicomotriz y socioafectiva", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El docente evalúa mediante observación directa en el aula o laboratorio las siguientes conductas de la triada formativa:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 31;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLOR_DARK,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 10, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 34, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 68 }
    },
    head: [['Cód.', 'Criterio observado', 'Conducta observable en 8.° año', 'Escala formativa oficial del MEP']],
    body: [
      // Psicomotriz
      ['P1', 'Manipulación de periféricos', 'Demuestra destreza, fluidez y precisión ergonómica al utilizar el teclado, mouse y puertos.', 'Nivel A: Destreza motriz fluida y precisa\nNivel B: Manejo básico con pausas\nNivel C: Dificultad en coordinación viso-motriz'],
      ['P2', 'Conexionado de dispositivos', 'Ensambla o identifica correctamente las terminales y cables de conexión sin forzar los conectores.', 'Nivel A: Precisión total y respeto a polaridades\nNivel B: Requiere verificación previa\nNivel C: Inserción incorrecta o riesgo de daño'],
      ['P3', 'Secuenciación de tareas', 'Sigue el orden procedimental de encendido, ejecución de software y guardado seguro de proyectos.', 'Nivel A: Autonomía procedimental completa\nNivel B: Requiere recordatorios ocasionales\nNivel C: Omite pasos críticos del procedimiento'],
      // Socioafectiva
      ['S1', 'Gusto por la precisión', 'Revisa minuciosamente la sintaxis de sus algoritmos y variables antes de dar por concluida la tarea.', 'Nivel A: Rigor y autoexigencia positiva\nNivel B: Precisión aceptable tras guía\nNivel C: Descuido en la verificación lógica'],
      ['S2', 'Aprender del error', 'Asume los errores de compilación o lógica como oportunidades de indagación y aprendizaje sin desánimo.', 'Nivel A: Resiliencia y actitud investigativa\nNivel B: Corrige con apoyo emocional docente\nNivel C: Muestra frustración o abandono'],
      ['S3', 'Trabajo colaborativo', 'Comparte ideas, escucha con empatía a sus pares y colabora activamente en la resolución de problemas.', 'Nivel A: Liderazgo positivo y cooperación\nNivel B: Participación pasiva con acompañamiento\nNivel C: Aislamiento o conflicto en el grupo'],
      ['S4', 'Uso ético y responsable', 'Demuestra respeto por las normas del laboratorio, el cuidado del equipo tecnológico y la autoría de recursos.', 'Nivel A: Conducta ciudadana digital ejemplar\nNivel B: Cumplimiento básico de normas\nNivel C: Incumplimiento de pautas del taller']
    ]
  });

  // Triada Evaluativa
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Consolidación de la triada formativa en el aplicativo docente (8.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "La herramienta docente integra automáticamente: 1) Puntaje de los 14 reactivos cognitivos (0 a 100%) • 2) Observación psicomotriz (escala A-B-C) • " +
    "3) Observación socioafectiva (escala A-B-C). Generando una síntesis individual y grupal con sugerencias pedagógicas para el planeamiento didáctico.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(3, 5, "Rúbricas psicomotrices y socioafectivas de 8.° año");

  // =========================================================================
  // PÁGINA 4: EL INSTRUMENTO DOCENTE EVALUADOR Y TELEMETRÍA (8.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("5. El instrumento docente evaluador de 8.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente para 8.° año gestiona de forma centralizada todas las secciones (8-1 a 8-20) con sincronización automática y herramientas analíticas:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 33;
  const cardW = (contentWidth - 4) / 2;

  // Card 1: Matriz Reactiva
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Matriz reactiva por secciones", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Gestión de nóminas para todas las secciones de 8.° año.", margin + 4, yPos + 12);
  doc.text("• Registro de estudiantes por nombre y cédula.", margin + 4, yPos + 17);
  doc.text("• Visualización de progreso y semáforos de logro.", margin + 4, yPos + 22);
  doc.text("• Asignación rápida de niveles formativos (A / B / C).", margin + 4, yPos + 27);
  doc.text("• Sincronización instantánea con el panel central.", margin + 4, yPos + 32);

  // Card 2: Sistematización y Actas
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. Sistematización y actas oficiales", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Consolidado tripartito: cognitivo, motriz y actitudinal.", margin + cardW + 8, yPos + 12);
  doc.text("• Desglose por subárea (HW/SW, algoritmos, robótica).", margin + cardW + 8, yPos + 17);
  doc.text("• Conteo porcentual de estudiantes en L / ED / RA.", margin + cardW + 8, yPos + 22);
  doc.text("• Exportación a Excel y PDF con formato institucional MEP.", margin + cardW + 8, yPos + 27);
  doc.text("• Respaldo local seguro y descarga de informes.", margin + cardW + 8, yPos + 32);

  // Card 3: Escáner QR y Modo Offline
  yPos = 73;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Escáner QR y modo sin conexión", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• En laboratorios sin internet, el alumno genera su código QR.", margin + 4, yPos + 12);
  doc.text("• El docente escanea el código con su teléfono o tableta.", margin + 4, yPos + 17);
  doc.text("• Carga instantánea de puntajes sin digitar manualmente.", margin + 4, yPos + 22);
  doc.text("• Cero pérdida de datos y total equidad territorial.", margin + 4, yPos + 27);
  doc.text("• Token criptográfico SHA-256 antifraude.", margin + 4, yPos + 32);

  // Card 4: Asistencia Pedagógica y Telemetría
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Asistencia pedagógica con IA", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Análisis cualitativo de brechas en 3 a 6 segundos.", margin + cardW + 8, yPos + 12);
  doc.text("• Generación de estrategias DUA y planeamiento.", margin + cardW + 8, yPos + 17);
  doc.text("• Red de resiliencia con múltiples servicios en cascada.", margin + cardW + 8, yPos + 22);
  doc.text("• Validación continua de descriptores curriculares MEP.", margin + cardW + 8, yPos + 27);
  doc.text("• Caché de respuesta en 0 ms para consultas repetidas.", margin + cardW + 8, yPos + 32);

  // 6. Protocolo Operativo
  yPos = 114;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("6. Protocolo operativo: en línea frente a desconectado (QR)", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLOR_DARK,
      cellPadding: 2
    },
    head: [['Paso', 'Modalidad en línea (con internet)', 'Modalidad desconectada (sin internet / QR)']],
    body: [
      ['1. Acceso', 'Docente proyecta QR o enlace a la WebApp en línea.', 'Se distribuye el archivo autónomo .html vía red local o USB.'],
      ['2. Registro', 'Estudiante ingresa sus datos y selecciona sección.', 'Estudiante trabaja de forma 100% local en su PC del laboratorio.'],
      ['3. Ejecución', 'Responde 14 ítems y reflexiona sobre el proceso.', 'Responde los 14 ítems con validación inmediata en su pantalla.'],
      ['4. Traspaso', 'Resultados viajan en tiempo real a la base de datos.', 'La WebApp genera un código QR cifrado en pantalla con sus resultados.'],
      ['5. Consolidación', 'Aparece automáticamente en el panel docente central.', 'Docente escanea el QR con su cámara y se actualiza la nómina al instante.']
    ]
  });

  // Recuadro Pedagógico sobre la IA y tiempo de respuesta
  yPos = doc.lastAutoTable.finalY + 5;
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, yPos, contentWidth, 21, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(3, 105, 161);
  doc.text("Procesamiento pedagógico de la Inteligencia Artificial y tiempo de respuesta formativo:", margin + 4, yPos + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "La generación del análisis con IA toma entre 3 y 6 segundos debido a que realiza una inferencia reflexiva completa y no un cálculo genérico prefabricado. Durante este tiempo, procesa la telemetría grupal, cruza los resultados de las tres dimensiones con los criterios DUA y formula recomendaciones didácticas individualizadas y validadas para el planeamiento. La plataforma cuenta con una arquitectura de resiliencia multicapa respaldada por múltiples servicios de IA de alta disponibilidad, garantizando continuidad operativa constante.",
    margin + 4, yPos + 9.5, { maxWidth: contentWidth - 8 }
  );

  drawHeaderFooter(4, 5, "Instrumento docente y telemetría de 8.° año");

  // =========================================================================
  // PÁGINA 5: PROTOCOLO DE APLICACIÓN EN AULA Y ENLACES OFICIALES
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("7. Protocolo de aplicación en el aula o taller de 8.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Ruta pedagógica sugerida para la aplicación formativa durante las primeras semanas del curso lectivo:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 31;

  autoTable(doc, {
    startY: yPos,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLOR_DARK,
      cellPadding: 2.2
    },
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 74 },
      2: { cellWidth: 78 }
    },
    head: [['Fase de aplicación', 'Acciones del docente en el laboratorio', 'Acciones de las personas estudiantes']],
    body: [
      [
        'Fase 1: Preparación\n(5 a 10 min)',
        '• Abrir el módulo evaluador docente de 8.° año en su equipo.\n• Proyectar el enlace o distribuir el archivo offline a los alumnos.',
        '• Ingresar a la WebApp desde sus computadoras.\n• Verificar nombre completo, cédula y sección correspondiente (ej. 8-1).'
      ],
      [
        'Fase 2: Ejecución\n(25 a 35 min)',
        '• Observar el desenvolvimiento psicomotor y socioafectivo en el taller.\n• Registrar conductas observables (coordinación, perseverancia).',
        '• Responder los 14 ítems cognitivos de las 3 subáreas.\n• Analizar con detenimiento las opciones y comprobar la lógica.'
      ],
      [
        'Fase 3: Cierre y traspaso\n(10 min)',
        '• En modo en línea: verificar la recepción de la telemetría.\n• En modo sin conexión: escanear el código QR generado en cada PC.',
        '• Visualizar su puntaje de desempeño y retroalimentación formativa.\n• Generar y presentar su código QR o comprobante digital.'
      ],
      [
        'Fase 4: Sistematización\n(Posterior a la clase)',
        '• Revisar la pestaña de sistematización oficial de 8.° año.\n• Exportar las actas consolidadas en Excel y PDF para el expediente.',
        '• Conservar copia de su comprobante o portafolio estudiantil según indicación docente.'
      ]
    ]
  });

  yPos = doc.lastAutoTable.finalY + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("8. Enlaces oficiales y accesos en producción (8.° año)", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLOR_DARK,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 52, fontStyle: 'bold' },
      1: { cellWidth: 90 },
      2: { cellWidth: 40, halign: 'center' }
    },
    head: [['Recurso de 8.° año', 'URL oficial en producción', 'Modo de acceso']],
    body: [
      ['Portal multi-nivel MEP', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En línea (pestaña 8.°)'],
      ['WebApp estudiante 8.° (en línea)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_en_linea.html', 'En línea / Telemetría'],
      ['WebApp estudiante 8.° (offline)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_desconectado_offline.html', 'Desconectado / Local (QR)'],
      ['Evaluador docente 8.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_docente_evaluador.html', 'En línea / Escáner QR'],
      ['Panel central de telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo global'],
      ['Guía pedagógica oficial 8.° (PDF)', 'https://diagnosticosecundaria.vercel.app/docs/GUIA_PEDAGOGICA_DIAGNOSTICO_8VO_MEP.pdf', 'Descarga oficial']
    ]
  });

  yPos = doc.lastAutoTable.finalY + 7;

  // Cierre institucional
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT", margin + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("Guía pedagógica y documento técnico oficial de 8.° año para asesorías y equipos docentes.", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_TEAL_DARK);
  doc.text("Ecosistema de Formación Tecnológica • Ciclo Lectivo 2027", margin + 4, yPos + 17);

  drawHeaderFooter(5, 5, "Protocolo de aplicación y enlaces oficiales (8.° año)");

  return doc;
}

// 1. Guardar en public/docs/ y public/documentos/
const outputDirDocs = path.join(__dirname, '..', 'public', 'docs');
const outputDirDocumentos = path.join(__dirname, '..', 'public', 'documentos');

if (!fs.existsSync(outputDirDocs)) fs.mkdirSync(outputDirDocs, { recursive: true });
if (!fs.existsSync(outputDirDocumentos)) fs.mkdirSync(outputDirDocumentos, { recursive: true });

const outputPathGuia = path.join(outputDirDocs, 'GUIA_PEDAGOGICA_DIAGNOSTICO_8VO_MEP.pdf');
const outputPathDocTecnico = path.join(outputDirDocumentos, 'Documento_Tecnico_Pedagogico_MEP_8vo_Robotica.pdf');

const doc = generarDocumento8voPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathGuia, pdfBuffer);
fs.writeFileSync(outputPathDocTecnico, pdfBuffer);
console.log(`✅ PDF de 8.° año generado con éxito en:\n - ${outputPathGuia}\n - ${outputPathDocTecnico}`);
