const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDocumentoAsesoresPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de colores oficial MEP & Ecosistema Tecnológico
  const COLOR_PRIMARY = [0, 51, 102];      // Azul Institucional MEP #003366
  const COLOR_HEADER = [15, 23, 42];       // Slate 900 #0f172a
  const COLOR_SECONDARY = [2, 132, 199];   // Sky / Cyan #0284c7
  const COLOR_EMERALD = [4, 120, 87];      // Emerald 700 #047857
  const COLOR_PURPLE = [126, 34, 206];     // Purple 700 #7e22ce
  const COLOR_AMBER = [180, 83, 9];        // Amber 700 #b45309
  const COLOR_DARK = [15, 23, 42];         // Slate 900 (Texto principal)
  const COLOR_MUTED = [71, 85, 105];       // Slate 600 (Texto secundario)
  const COLOR_LIGHT_BG = [248, 250, 252];  // Slate 50 (Fondo tarjetas claras)
  const COLOR_BORDER = [203, 213, 225];    // Slate 300 (Bordes definidos)

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Barra superior
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFillColor(...COLOR_SECONDARY);
    doc.rect(0, 5, pageWidth, 1.5, 'F');

    // Texto de cabecera oficial
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT • GUÍA DOCENTE 2026", margin, 11.5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Documento técnico oficial • Evaluación diagnóstica integrada", pageWidth - margin, 11.5, { align: 'right' });

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
    doc.text("Ecosistema de WebApps autónomas, escáner móvil PWA y rúbricas oficiales • PNFT Guía Docente 2026", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA EJECUTIVA E INSTITUCIONAL
  // =========================================================================
  
  // Banner de portada
  doc.setFillColor(...COLOR_HEADER);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Distintivo superior
  doc.setFillColor(2, 132, 199);
  doc.roundedRect(margin, 10, 160, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • III CICLO • GUÍA DOCENTE 2026", margin + 4, 14.5);

  // Título principal en formato gramatical hispanoamericano
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Ecosistema de evaluación diagnóstica", margin, 26);
  doc.setFontSize(13);
  doc.setTextColor(186, 230, 253); // Sky claro
  doc.text("Integrada y formativa (7.°, 8.° y 9.° año de secundaria)", margin, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(241, 245, 249);
  doc.text("Programa Nacional de Formación Tecnológica (PNFT) • Guía curricular oficial MEP 2026.", margin, 42);
  doc.text("Simuladores 2D interactivos • Matriz tripartita de saberes • Escáner móvil PWA • Telemetría e IA.", margin, 48);

  // Tarjeta de Metadatos Ejecutivos
  let yPos = 67;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 34, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Metadatos del ecosistema tecnológico", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Autoría y desarrollo: Asesoría Nacional de Formación Tecnológica MEP & Ecosistema Curiol.", margin + 6, yPos + 12);
  doc.text("• Nivel y cobertura: Educación secundaria (Tercer Ciclo: 7.°, 8.° y 9.° año de la Educación General Básica).", margin + 6, yPos + 17);
  doc.text("• Enfoque de evaluación: Formativo, diagnóstico, cualitativo e inclusivo (sin nota sumativa punitiva).", margin + 6, yPos + 22);
  doc.text("• Registro cronológico: Marca temporal con fecha y hora de Costa Rica (UTC-6) y base inicial limpia de pruebas.", margin + 6, yPos + 27);
  doc.text("• Despliegue en producción: https://diagnosticosecundaria.vercel.app/diagnostico", margin + 6, yPos + 32);

  // 1. Pilares Estructurales
  yPos = 107;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Pilares estructurales del desarrollo", margin, yPos);

  const colW = (contentWidth - 8) / 3;
  
  // Pilar 1: Estudiante
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, yPos + 4, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(3, 105, 161);
  doc.text("1. WebApps estudiantiles", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Reactivos de 4 áreas curriculares.", margin + 4, yPos + 17);
  doc.text("• Simuladores 2D y retos prácticos.", margin + 4, yPos + 22);
  doc.text("• Diagnóstico de fallas y cableado.", margin + 4, yPos + 27);
  doc.text("• Reflexión metacognitiva final.", margin + 4, yPos + 32);
  doc.text("• Token criptográfico SHA-256.", margin + 4, yPos + 37);
  doc.text("• Modo en línea y autónomo local.", margin + 4, yPos + 42);

  // Pilar 2: Docente Evaluador y Móvil
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + colW + 4, yPos + 4, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text("2. Evaluador y escáner móvil", margin + colW + 8, yPos + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Matriz de observación en vivo.", margin + colW + 8, yPos + 17);
  doc.text("• Escáner QR PWA para celulares.", margin + colW + 8, yPos + 22);
  doc.text("• Gestión de secciones (ej. 7-1 a 9-20).", margin + colW + 8, yPos + 27);
  doc.text("• Rúbrica oficial (A/B/C y L/ED/RA).", margin + colW + 8, yPos + 32);
  doc.text("• Exportación a CSV, Excel y PDF.", margin + colW + 8, yPos + 37);
  doc.text("• Generación de actas diagnósticas.", margin + colW + 8, yPos + 42);

  // Pilar 3: Telemetría e IA
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(margin + (colW + 4) * 2, yPos + 4, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PURPLE);
  doc.text("3. Telemetría e IA", margin + (colW + 4) * 2 + 4, yPos + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Sincronización en tiempo real (0 ms).", margin + (colW + 4) * 2 + 4, yPos + 17);
  doc.text("• Telemetría protegida antifraude.", margin + (colW + 4) * 2 + 4, yPos + 22);
  doc.text("• Red de resiliencia multicapa.", margin + (colW + 4) * 2 + 4, yPos + 27);
  doc.text("• Análisis formativo y plan DUA.", margin + (colW + 4) * 2 + 4, yPos + 32);
  doc.text("• Autoauditoría diaria a las 5:00 AM.", margin + (colW + 4) * 2 + 4, yPos + 37);
  doc.text("• Panel administrativo centralizado.", margin + (colW + 4) * 2 + 4, yPos + 42);

  // 2. Matriz General de Niveles
  yPos = 163;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. Matriz general de niveles educativos integrados (Guía Docente 2026)", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: COLOR_DARK,
      cellPadding: 2.2
    },
    columnStyles: {
      0: { cellWidth: 16, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 36, fontStyle: 'bold' },
      2: { cellWidth: 52 },
      3: { cellWidth: 40 },
      4: { cellWidth: 34, halign: 'center' }
    },
    head: [['Nivel', 'Nombre de la misión', 'Saberes y retos principales', 'Simulador / Práctica', 'Estado en plataforma']],
    body: [
      ['7.° año', 'CyberQuest 7° (Misión Tecnológica)', 'Módulo psicomotor (lateralidad, ritmo, trazo), HW/SW, archivos y lógica lineal.', 'Rejilla espacial + Semáforo + Canvas 2D', 'Integrado (Guía 2026)'],
      ['8.° año', 'Robótica y algoritmos 8°', '14 Indicadores, sistemas de control, sensores, flujo condicional y bucles.', 'Simulador de control y lógica modular', 'Completado y validado'],
      ['9.° año', 'Aula Inteligente (Domótica)', 'Microcontrolador 328P, sensores LDR, actuador LED, depuración de pines.', 'Circuito electrónico 2D en protoboard', 'Completado y desplegado']
    ]
  });

  drawHeaderFooter(1, 6, "Resumen ejecutivo y visión general");

  // =========================================================================
  // PÁGINA 2: LAS 4 ÁREAS CURRICULARES OFICIALES (GUÍA DOCENTE 2026)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Las cuatro áreas curriculares oficiales de la Guía Docente 2026", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El ecosistema diagnostica el aprendizaje respetando estrictamente el marco curricular oficial del PNFT (Guía Docente 2026):",
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
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 68 },
      2: { cellWidth: 78 }
    },
    head: [['Área de Conocimiento', 'Competencia específica del PNFT', 'Resultado de aprendizaje (RdA)']],
    body: [
      [
        '1. Apropiación tecnológica y digital',
        'Crea productos con ayuda de herramientas digitales para aprovecharlos en su desarrollo personal, académico o profesional, de acuerdo con las normas de ciberseguridad y ética digital.',
        'Combina herramientas digitales, tomando en cuenta fundamentos de tecnología, impacto de las TIC, seguridad y privacidad digital y su experiencia de uso en productos digitales.'
      ],
      [
        '2. Programación y algoritmos',
        'Resuelve problemas mediante la programación de algoritmos para desarrollar el pensamiento lógico matemático, tomando en cuenta las prácticas y actitudes del pensador computacional.',
        'Integra conceptos de programación como eventos, operadores, estructuras de datos y de control, procedimientos, funciones y algoritmos en la solución de problemas reales.'
      ],
      [
        '3. Computación física y robótica',
        'Crea artefactos físicos o robots para proponer soluciones a problemas de su entorno a través de prototipos, de acuerdo con las normas de electrónica, programación y robótica.',
        'Aplica fundamentos de robótica, computación física, electrónica, mecánica y sistemas robóticos autónomos en la programación y construcción de prototipos que resuelven un problema.'
      ],
      [
        '4. Ciencia de datos e inteligencia artificial',
        'Analiza datos apoyándose en estadística, matemáticas, programación y conocimiento de dominio, tomando en cuenta principios de ciencia de datos, inteligencia artificial y ciberseguridad.',
        'Analiza datos mediante herramientas digitales para la toma de decisiones cotidianas y reconoce aspectos fundamentales de la inteligencia artificial, aplicaciones y desafíos.'
      ]
    ]
  });

  // Ejes Transversales
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Ejes transversales, prácticas y actitudes del pensador computacional", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "• Ejes transversales: 1) Pensamiento computacional (algorítmico, abstracción, descomposición, patrones) • 2) Ciudadanía y ética digital • 3) Emprendimiento e innovación.\n" +
    "• Prácticas del pensador: Reconoce patrones, Abstrae, Generaliza, Transfiere, Modulariza, Formula algoritmos, Remezcla, Depura, Programa, Comunica y Colabora.\n" +
    "• Actitudes evaluadas: Gusto por la precisión, Aprender del error, Flexibilidad ante problemas, Tolerancia a la frustración y Manejo ético/seguro de la tecnología.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(2, 6, "Marco curricular oficial (Guía Docente 2026)");

  // =========================================================================
  // PÁGINA 3: ESPECIFICACIÓN DETALLADA DE 9.° AÑO
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Especificación detallada de 9.° año: «Aula Inteligente»", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El diagnóstico de noveno año contextualiza la automatización domótica en dos retos prácticos de hardware con microcontrolador ATmega328P, sensores analógicos y actuadores digitales:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 31;
  const colWRetos = (contentWidth - 4) / 2;

  // Reto 1
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, colWRetos, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(3, 105, 161);
  doc.text("Reto 1: Iluminación inteligente", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Módulos: Sensor LDR + MCU 328P + Lámpara LED.", margin + 4, yPos + 12);
  doc.text("• Conexiones: VCC (5V), GND, A0 (Sensor), D9 (LED).", margin + 4, yPos + 17);
  doc.text("• Condición lógica: Si (luz < 300 Lux) entonces LED ON.", margin + 4, yPos + 22);
  doc.text("• Instrumentos: Luxómetro interactivo y multímetro.", margin + 4, yPos + 27);
  doc.text("• Telemetría: Registro del umbral exacto de activación.", margin + 4, yPos + 32);

  // Reto 2
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + colWRetos + 4, yPos, colWRetos, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_AMBER);
  doc.text("Reto 2: Climatización con falla", margin + colWRetos + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Módulos: Termistor NTC + MCU 328P + Ventilador DC.", margin + colWRetos + 8, yPos + 12);
  doc.text("• Falla inyectada: Señal del ventilador conectada a A3.", margin + colWRetos + 8, yPos + 17);
  doc.text("• Paso 1: Diagnóstico técnico del pin erróneo en A3.", margin + colWRetos + 8, yPos + 22);
  doc.text("• Paso 2: Corrección física pasando el cable a D9.", margin + colWRetos + 8, yPos + 27);
  doc.text("• Paso 3: Justificación conceptual (analógico frente a digital).", margin + colWRetos + 8, yPos + 32);

  yPos = 71;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Rúbrica de saberes procedimentales y actitudinales (9.° año)", margin, yPos);

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
      0: { cellWidth: 10, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 68 }
    },
    head: [['Cód.', 'Saber / Práctica', 'Criterio observable en simulación', 'Escala formativa oficial del MEP']],
    body: [
      ['P1', 'Modulariza', 'Resuelve la conexión por partes: identifica y organiza las 3 tarjetas de hardware (LDR, MCU, LED).', 'A: Autónomo y consistente\nB: Con apoyo ocasional\nC: Requiere modelado paso a paso'],
      ['P2', 'Reconoce patrones', 'Identifica regularidades de polaridad y correspondencia de terminales (VCC 5V, GND, Pin A0, Pin D9).', 'A: Sin errores de polaridad\nB: Corrige polaridad con guía\nC: Confunde alimentación con señal'],
      ['P3', 'Formula algoritmos', 'Establece el flujo lógico secuencial del sistema (Entrada -> Proceso -> Salida) cerrando el circuito.', 'A: Secuencia lógica inmediata\nB: Ensayo y error guiado\nC: Desorden en el conexionado'],
      ['P4', 'Programa y valida', 'Valida condición y asignación: comprueba que al bajar la luz (< 300 Lux) se active la salida digital D9.', 'A: Verifica umbral y estados\nB: Comprende tras aclaración\nC: No asocia umbral a la salida'],
      ['P5', 'Depura (Reto 2)', 'Detecta la falla inyectada (señal a pin incorrecto) y ejecuta la reconexión física del cable.', 'A: Detecta y reconecta con autonomía\nB: Reconecta con pista docente\nC: No logra corregir el cable'],
      ['S1', 'Gusto por la precisión', 'Demuestra esmero al verificar cables, valores de multímetro y monitor serial.', 'A: Alto rigor y minuciosidad\nB: Precisión moderada\nC: Precipitación o descuido'],
      ['S2', 'Aprender del error', 'Convierte desaciertos en oportunidades: analiza con calma por qué la carga no respondía.', 'A: Análisis reflexivo ante el fallo\nB: Corrige tras orientación\nC: Frustración ante el error']
    ]
  });

  drawHeaderFooter(3, 6, "Especificación curricular de 9.° año");

  // =========================================================================
  // PÁGINA 4: ESPECIFICACIÓN DETALLADA DE 7.° Y 8.° AÑO
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("5. Especificación de 7.° y 8.° año: CyberQuest y Robótica", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Resumen de la arquitectura evaluativa para los niveles iniciales e intermedios del Tercer Ciclo:",
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
      1: { cellWidth: 68 },
      2: { cellWidth: 46 },
      3: { cellWidth: 34 }
    },
    head: [['Nivel / Módulo', 'Descripción de la actividad interactiva', 'Saber o habilidad evaluada', 'Métrica en telemetría']],
    body: [
      ['7.°: Módulo psicomotor', '• Rejilla espacial 4x4 con comandos.\n• Semáforo de ritmo y freno motriz.\n• Canal de trazo fino sin colisiones.', '• Lateralidad y esquema espacial.\n• Ritmo y control de impulsos.\n• Coordinación viso-manual.', 'Porcentaje de precisión y aciertos rítmicos.'],
      ['7.°: Misiones 1 a 10', '• Clasificación interactiva de HW vs SW.\n• Algoritmos lineales y secuencias.\n• Ciberseguridad y prevención digital.', '• Fundamentos tecnológicos.\n• Lógica secuencial básica.\n• Ética y ciudadanía digital.', 'Puntaje de aciertos (0 a 100%) y tiempo.'],
      ['8.°: Apropiación HW/SW', '• Periféricos, software, redes y SO.\n• Unidades de almacenamiento (KB a TB).', '• Conceptos de hardware y redes.\n• Gestión del sistema operativo.', 'Puntaje en ítems 1 al 5.'],
      ['8.°: Algoritmos y lógica', '• Estructura E-P-S, variables y tipos.\n• Condicionales dobles y bucles.', '• Formulación algorítmica.\n• Control de flujo y ciclos.', 'Puntaje en ítems 6 al 12.'],
      ['8.°: Robótica y DUA', '• Sensores, actuadores y microcontrolador.\n• Protocolos de seguridad en taller.', '• Computación física elemental.\n• Normas técnicas de seguridad.', 'Puntaje en ítems 13 y 14.']
    ]
  });

  drawHeaderFooter(4, 6, "Especificación de 7.° y 8.° año");

  // =========================================================================
  // PÁGINA 5: EL INSTRUMENTO EVALUADOR DOCENTE, ESCÁNER MÓVIL Y 7 ETAPAS
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("6. Instrumento docente evaluador, módulo móvil y ruta de 7 etapas", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente y el escáner móvil PWA integran la gestión completa en 7 etapas metodológicas:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 31;
  const vW = (contentWidth - 4) / 2;
  const vH = 34;

  // Vista 1
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Vista 1: Nómina y registro institucional", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Carga de nómina vía Excel o CSV oficial.", margin + 4, yPos + 12);
  doc.text("• Registro automático en vivo con marca temporal (CR).", margin + 4, yPos + 17);
  doc.text("• Base inicial limpia (0 registros) para nuevos docentes.", margin + 4, yPos + 22);
  doc.text("• Filtro dinámico por secciones (ej. 7-1 a 9-20).", margin + 4, yPos + 27);

  // Vista 2
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + vW + 4, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Vista 2: Escáner QR móvil PWA", margin + vW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Aplicativo instalable en celulares (iOS / Android).", margin + vW + 8, yPos + 12);
  doc.text("• Escaneo por cámara de pantallas en laboratorios offline.", margin + vW + 8, yPos + 17);
  doc.text("• Cero consumo de datos móviles en el dispositivo.", margin + vW + 8, yPos + 22);
  doc.text("• Sincronización instantánea de actas al panel docente.", margin + vW + 8, yPos + 27);

  // Vista 3
  yPos = 69;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Vista 3: Sistematización oficial", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Formato oficial idéntico a las directrices del MEP.", margin + 4, yPos + 12);
  doc.text("• Consolidado automático de niveles (L / ED / RA).", margin + 4, yPos + 17);
  doc.text("• Cuadro de descripción de desempeño individual.", margin + 4, yPos + 22);
  doc.text("• Respaldo local y exportación a Excel y PDF.", margin + 4, yPos + 27);

  // Vista 4
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + vW + 4, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Vista 4: Plan DUA y mediación pedagógica", margin + vW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Matriz de decisiones pedagógicas y adaptaciones.", margin + vW + 8, yPos + 12);
  doc.text("• Recomendaciones cualitativas asistidas por IA.", margin + vW + 8, yPos + 17);
  doc.text("• Inferencia reflexiva en 3 a 6 s sin congelamiento.", margin + vW + 8, yPos + 22);
  doc.text("• Autoauditoría diaria a las 5:00 AM (hora Costa Rica).", margin + vW + 8, yPos + 27);

  yPos = 108;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("7. Las 7 etapas metodológicas de autogestión y validación", margin, yPos);

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
      fontSize: 6.8,
      textColor: COLOR_DARK,
      cellPadding: 1.8
    },
    head: [['Etapa', 'Propósito pedagógico', 'Acción clave del usuario']],
    body: [
      ['Etapa 1', 'Marco curricular, supervisión y rol de asesoría', 'Verificar 27 DRE, alineación a Guía Docente 2026 y secciones muestra.'],
      ['Etapa 2', 'Identidad y configuración institucional (/registro)', 'Ingreso por PIN, asignación de centros educativos y selección de secciones.'],
      ['Etapa 3', 'Preparación técnica, equidad y enlaces protegidos', 'Generar enlaces seguros con token opaco y proyectar código QR de grupo.'],
      ['Etapa 4', 'Aplicación del diagnóstico estudiantil (dual)', 'Resolución en 4 áreas curriculares (telemetría en línea o sello QR offline).'],
      ['Etapa 5', 'Evaluación directa docente (matriz de observación)', 'Registrar desempeño práctico de laboratorio y emitir dictamen de logro.'],
      ['Etapa 6', 'Consolidación, analítica y plan DUA (/dashboard)', 'Monitorear semáforos, generar recomendaciones DUA y exportar actas.'],
      ['Etapa 7', 'Telemetría global, resiliencia y autoauditoría diaria', 'Supervisar resiliencia multicapa y reporte matutino a las 5:00 AM.']
    ]
  });

  drawHeaderFooter(5, 6, "Instrumento docente, escáner móvil y 7 etapas");

  // =========================================================================
  // PÁGINA 6: ARQUITECTURA TECNOLÓGICA Y ENLACES OFICIALES
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("8. Arquitectura pedagógica y sistema de resiliencia con IA", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "La infraestructura integra tecnologías web avanzadas con un sistema de resiliencia multicapa respaldado por múltiples servicios de Inteligencia Artificial a disposición, enfocado en el análisis formativo:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 31;

  // Diagrama de Cascada de IA
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, yPos, contentWidth, 38, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text("Sistema de resiliencia multicapa y procesamiento pedagógico formativo", margin + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.3);
  doc.setTextColor(...COLOR_DARK);
  doc.text("1. Caché inteligente en memoria (SHA-256): Respuestas en 0 ms ante consultas previas para inmediatez docente.", margin + 4, yPos + 12);
  doc.text("2. Procesamiento reflexivo (3 a 6 segundos): Genera inferencia cualitativa profunda cruzando telemetría con DUA.", margin + 4, yPos + 17);
  doc.text("3. Red de alta disponibilidad en cascada: Múltiples servicios de IA enrutados automáticamente ante contingencias.", margin + 4, yPos + 22);
  doc.text("4. Validación pedagógica continua: Descriptores alineados a los programas de estudio oficiales de III Ciclo del MEP.", margin + 4, yPos + 27);
  doc.text("5. Auditoría formativa diaria (5:00 AM): Verificación continua de disponibilidad y reporte institucional automatizado.", margin + 4, yPos + 32);

  yPos = 74;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("9. Guía de acceso y enlaces oficiales en producción", margin, yPos);

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
      0: { cellWidth: 46, fontStyle: 'bold' },
      1: { cellWidth: 84 },
      2: { cellWidth: 48, halign: 'center' }
    },
    head: [['Recurso o vista', 'Enlace web oficial en producción', 'Modo de operación']],
    body: [
      ['Portal diagnóstico multi-nivel', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En línea (Acceso universal)'],
      ['WebApp estudiante 9.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_en_linea.html', 'En línea / Local autónomo'],
      ['Evaluador docente 9.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_docente_evaluador.html', 'En línea / Escáner QR'],
      ['WebApp estudiante 8.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_en_linea.html', 'En línea / Local autónomo'],
      ['Evaluador docente 8.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_docente_evaluador.html', 'En línea / Escáner QR'],
      ['WebApp estudiante 7.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_en_linea.html', 'En línea / Local autónomo'],
      ['Evaluador docente 7.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_docente_evaluador.html', 'En línea / Escáner QR'],
      ['Panel central de telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo institucional']
    ]
  });

  yPos = doc.lastAutoTable.finalY + 7;

  // Recuadro de Cierre
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("DIRECCIÓN DE RECURSOS TECNOLÓGICOS EN EDUCACIÓN (DRTE) • MEP COSTA RICA", margin + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("Este documento técnico y pedagógico certifica la integración y alineación curricular del ecosistema diagnóstico", margin + 4, yPos + 11);
  doc.text("para la Formación Tecnológica en Tercer Ciclo. Diseñado para optimizar la toma de decisiones pedagógicas docentes.", margin + 4, yPos + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text("Asesoría Nacional de Formación Tecnológica • Guía Docente 2026", margin + 4, yPos + 22);

  drawHeaderFooter(6, 6, "Arquitectura tecnológica y despliegue");

  return doc;
}

// 1. Guardar en public/documentos/ y public/docs/
const outputDirWeb = path.join(__dirname, '..', 'public', 'documentos');
const outputDirDocs = path.join(__dirname, '..', 'public', 'docs');

if (!fs.existsSync(outputDirWeb)) fs.mkdirSync(outputDirWeb, { recursive: true });
if (!fs.existsSync(outputDirDocs)) fs.mkdirSync(outputDirDocs, { recursive: true });

const outputPathWeb = path.join(outputDirWeb, 'Documento_Tecnico_Evaluacion_Diagnostica_MEP_7mo_8vo_9no.pdf');
const outputPathDocs = path.join(outputDirDocs, 'DOCUMENTO_TECNICO_DIAGNOSTICO_MEP_III_CICLO.pdf');
const outputPathDossier = path.join(outputDirWeb, 'Dossier_Evaluacion_Diagnostica_MEP_7mo_8vo_9no.pdf');
const outputPathEval = path.join(outputDirWeb, 'Evaluacion_Diagnostica_MEP_7mo_8vo_9no.pdf');

const doc = generarDocumentoAsesoresPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathWeb, pdfBuffer);
fs.writeFileSync(outputPathDocs, pdfBuffer);
fs.writeFileSync(outputPathDossier, pdfBuffer);
fs.writeFileSync(outputPathEval, pdfBuffer);
console.log(`✅ PDF general guardado con éxito en:\n - ${outputPathWeb}\n - ${outputPathDocs}\n - ${outputPathDossier}`);
