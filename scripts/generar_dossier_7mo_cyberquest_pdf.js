const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDocumento7moPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de colores oficial MEP & CyberQuest 7.° año
  const COLOR_PRIMARY = [0, 51, 102];     // Azul Institucional MEP #003366
  const COLOR_HEADER = [11, 15, 25];      // Slate 950 #0b0f19
  const COLOR_CYAN = [8, 145, 178];       // Cyan 600 #0891b2
  const COLOR_CYAN_DARK = [14, 116, 144]; // Cyan 700 #0e7490
  const COLOR_ROSE = [190, 18, 60];       // Rose 700 #be123c
  const COLOR_INDIGO = [67, 56, 202];     // Indigo 700 #4338ca
  const COLOR_PURPLE = [126, 34, 206];    // Purple 700 #7e22ce
  const COLOR_DARK = [15, 23, 42];        // Slate 900 (Texto principal)
  const COLOR_MUTED = [71, 85, 105];      // Slate 600 (Texto secundario)
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50 (Fondo tarjetas claras)
  const COLOR_BORDER = [203, 213, 225];   // Slate 300 (Bordes definidos)

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Barra superior
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFillColor(...COLOR_CYAN);
    doc.rect(0, 5, pageWidth, 1.5, 'F');

    // Texto de cabecera
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2027", margin, 11.5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Guía pedagógica oficial • 7.° año (CyberQuest)", pageWidth - margin, 11.5, { align: 'right' });

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
    doc.text("CyberQuest 7.° año: misión tecnológica de saberes integrados (motriz, procedimental y actitudinal)", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA Y FUNDAMENTACIÓN PEDAGÓGICA DE 7.° AÑO
  // =========================================================================
  
  // Banner de portada
  doc.setFillColor(...COLOR_HEADER);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_CYAN);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Distintivo superior con nivel explícito
  doc.setFillColor(8, 145, 178);
  doc.roundedRect(margin, 10, 145, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • 7.° AÑO", margin + 4, 14.5);

  // Títulos principales en formato gramatical hispanoamericano
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("CyberQuest 7.° año: misión tecnológica", margin, 26);
  doc.setFontSize(13);
  doc.setTextColor(103, 232, 249); // Cyan claro
  doc.text("Guía pedagógica y documento técnico oficial • 7.° año", margin, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluación formativa tripartita: desarrollo psicomotor, saberes procedimentales y actitudes computacionales.", margin, 42);
  doc.text("Diseñado para la transición a la educación secundaria • Formato individual o parejas colaborativas.", margin, 48);

  // Tarjeta de Ficha Técnica
  let yPos = 67;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 32, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Ficha técnica del recurso diagnóstico (7.° año)", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Población meta: Estudiantes de 7.° año (Tercer Ciclo de la Educación General Básica).", margin + 6, yPos + 12);
  doc.text("• Modalidad de aplicación: Parejas de ciber-agentes (líder de consola y co-piloto) o individual.", margin + 6, yPos + 17);
  doc.text("• Enfoque de evaluación: Formativo, diagnóstico y cualitativo (identificación de brechas sin nota punitiva).", margin + 6, yPos + 22);
  doc.text("• Acceso web en producción: https://diagnosticosecundaria.vercel.app/diagnostico (pestaña 7.° año).", margin + 6, yPos + 27);

  // 1. Fundamentación Pedagógica
  yPos = 105;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Fundamentación pedagógica y curricular de 7.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El ingreso a sétimo año representa un hito crítico en el desarrollo de los estudiantes. Por ello, CyberQuest 7° sustituye la prueba tradicional por una «Misión Tecnológica Gamificada» que evalúa los aprendizajes previos de primaria sin generar ansiedad evaluativa, estructurada en tres dimensiones oficiales:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 123;
  const colW = (contentWidth - 6) / 3;

  // Dimensión 1: Psicomotriz
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(margin, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_ROSE);
  doc.text("1. Dimensión psicomotriz", margin + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Lateralidad y orientación espacial en rejilla.", margin + 4, yPos + 14);
  doc.text("• Ritmo y control de impulsos (semáforo).", margin + 4, yPos + 21);
  doc.text("• Coordinación viso-manual y trazo fino.", margin + 4, yPos + 28);
  doc.text("• Escala: Nivel A, B y C de desarrollo motriz.", margin + 4, yPos + 35);

  // Dimensión 2: Procedimental y Cognitiva
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + colW + 3, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_INDIGO);
  doc.text("2. Dimensión procedimental", margin + colW + 7, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Identificación de componentes de hardware.", margin + colW + 7, yPos + 14);
  doc.text("• Clasificación de software y utilitarios.", margin + colW + 7, yPos + 21);
  doc.text("• Lógica algorítmica y secuencias paso a paso.", margin + colW + 7, yPos + 28);
  doc.text("• Ciberseguridad y prevención digital.", margin + colW + 7, yPos + 35);

  // Dimensión 3: Socioafectiva
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(margin + (colW + 3) * 2, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PURPLE);
  doc.text("3. Dimensión socioafectiva", margin + (colW + 3) * 2 + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Autopercepción de autoeficacia tecnológica.", margin + (colW + 3) * 2 + 4, yPos + 14);
  doc.text("• Resiliencia ante el error en retos complejos.", margin + (colW + 3) * 2 + 4, yPos + 21);
  doc.text("• Colaboración en parejas de trabajo.", margin + (colW + 3) * 2 + 4, yPos + 28);
  doc.text("• Escala Likert de motivación y agrado.", margin + (colW + 3) * 2 + 4, yPos + 35);

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
    head: [['Principio DUA', 'Mecanismo en CyberQuest 7.° año', 'Impacto inclusivo']],
    body: [
      ['Múltiples formas de representación', 'Contraste reforzado, iconos descriptivos, audio de apoyo y lectura facilitada.', 'Garantiza acceso pleno a estudiantes con baja visión o diversidad sensorial.'],
      ['Múltiples formas de acción y expresión', 'Interacción táctil, teclado, mouse y tiempos adaptativos sin límite punitivo.', 'Flexibilidad de interacción para estudiantes con diversas preferencias psicomotrices.'],
      ['Múltiples formas de implicación', 'Narrativa gamificada, misiones por niveles y retroalimentación inmediata sin nota roja.', 'Fomenta la motivación intrínseca y reduce la ansiedad ante la evaluación diagnóstica.'],
      ['Resiliencia sin conexión (Offline-first)', 'Archivo autónomo ejecutable sin internet y transmisión de datos vía código QR cifrado.', 'Equidad absoluta para colegios y liceos rurales sin acceso estable a la red.']
    ]
  });

  drawHeaderFooter(1, 5, "Fundamentación pedagógica y DUA de 7.° año");

  // =========================================================================
  // PÁGINA 2: REACTIVOS Y MATRIZ DE SABERES (7.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Matriz de saberes procedimentales y cognitivos (7.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Distribución de los retos y saberes evaluados en CyberQuest 7.° año según el programa de Formación Tecnológica del MEP:",
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
      0: { cellWidth: 16, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 64 }
    },
    head: [['Reto / Misión', 'Saber curricular', 'Descripción de la actividad en la WebApp', 'Criterio de desempeño']],
    body: [
      ['Misión 1', 'Periféricos y hardware', 'Clasificación de dispositivos de entrada, salida y almacenamiento.', 'Logrado: 5/5 componentes correctos.'],
      ['Misión 2', 'Clasificación de software', 'Diferenciación entre software de sistema y aplicaciones de usuario.', 'Logrado: Identifica los roles de software.'],
      ['Misión 3', 'Redes e internet', 'Conceptos de conectividad, navegadores y protocolos básicos de red.', 'Logrado: Reconoce conceptos de red.'],
      ['Misión 4', 'Sistemas operativos', 'Gestión de carpetas, almacenamiento de archivos y rutas de acceso.', 'Logrado: Comprende la estructura del SO.'],
      ['Misión 5', 'Algoritmos lineales', 'Ordenamiento secuencial de instrucciones para resolver un problema.', 'Logrado: Secuencia pasos sin ambigüedad.'],
      ['Misión 6', 'Condicionales básicos', 'Toma de decisiones lógicas basadas en condiciones (Si / Entonces).', 'Logrado: Aplica lógica condicional simple.'],
      ['Misión 7', 'Bucles simples', 'Identificación de patrones y repetición controlada de acciones.', 'Logrado: Optimiza repeticiones en bucles.'],
      ['Misión 8', 'Ciberseguridad y ética', 'Buenas prácticas de contraseñas, privacidad y respeto en línea.', 'Logrado: Reconoce medidas de protección digital.'],
      ['Misión 9', 'Resolución de problemas', 'Descomposición de un reto complejo en tareas pequeñas manejables.', 'Logrado: Aplica descomposición analítica.'],
      ['Misión 10', 'Pensamiento crítico', 'Evaluación de fuentes de información y veracidad de contenidos web.', 'Logrado: Discrimina información confiable.']
    ]
  });

  drawHeaderFooter(2, 5, "Saberes procedimentales de 7.° año");

  // =========================================================================
  // PÁGINA 3: RÚBRICAS PSICOMOTRICES Y SOCIOAFECTIVAS (7.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Rúbricas oficiales docentes: dimensión psicomotriz y socioafectiva (7.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Indicadores de observación directa y pruebas sensoriales interactivas en CyberQuest 7.° año:",
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
      2: { cellWidth: 68 },
      3: { cellWidth: 68 }
    },
    head: [['Cód.', 'Criterio observado', 'Conducta observable en 7.° año', 'Escala formativa oficial del MEP']],
    body: [
      // Psicomotriz
      ['P1', 'Lateralidad y orientación', 'Navega en la rejilla espacial reconociendo giros (izquierda / derecha / avanzar).', 'Nivel A: Orientación fluida y sin dudas\nNivel B: Requiere pausas de orientación\nNivel C: Confunde lateralidad frecuentemente'],
      ['P2', 'Inhibición motriz y ritmo', 'Controla el impulso motriz respondiendo en el momento exacto del semáforo visual.', 'Nivel A: Control motor y tiempos precisos\nNivel B: Pequeñas anticipaciones\nNivel C: Dificultad para frenar el impulso'],
      ['P3', 'Coordinación visomotora', 'Realiza trazos continuos y clics precisos sobre elementos pequeños en pantalla.', 'Nivel A: Coordinación motriz fina óptima\nNivel B: Desvíos leves en el trazo\nNivel C: Dificultad con el puntero o touch'],
      // Socioafectiva
      ['S1', 'Autoeficacia tecnológica', 'Muestra confianza y disposición positiva al interactuar con nuevas herramientas digitales.', 'Nivel A: Alta seguridad y autonomía\nNivel B: Requiere confirmación inicial\nNivel C: Muestra inseguridad o bloqueo'],
      ['S2', 'Tolerancia a la frustración', 'Persiste ante fallos en los retos sin desanimarse ni abandonar la actividad.', 'Nivel A: Resiliencia y perseverancia activa\nNivel B: Supera el fallo con apoyo\nNivel C: Desánimo o abandono inmediato'],
      ['S3', 'Trabajo cooperativo', 'Se comunica de forma asertiva con su compañero de equipo respetando turnos de consola.', 'Nivel A: Cooperación y diálogo asertivo\nNivel B: Participación intermitente\nNivel C: Dificultad para coordinar turnos']
    ]
  });

  // Articulación diagnóstica del PNFT
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Articulación diagnóstica del PNFT: saberes y dimensiones formativas (7.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El informe docente consolida la relación pedagógica del PNFT: 1) Saberes conceptuales (Saber: rendimiento cognitivo) • 2) Saberes procedimentales (Saber hacer: métricas psicomotrices P1, P2, P3) • " +
    "3) Saberes actitudinales (Saber ser / convivir: observación socioafectiva S1, S2, S3), facilitando el planeamiento formativo.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(3, 5, "Rúbricas psicomotrices y socioafectivas de 7.° año");

  // =========================================================================
  // PÁGINA 4: EL INSTRUMENTO DOCENTE EVALUADOR (7.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("5. El instrumento docente evaluador de 7.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Herramientas especializadas del aplicativo docente para la gestión formativa de secciones de 7.° año:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 33;
  const cardW = (contentWidth - 4) / 2;

  // Card 1: Registro Ágil
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Registro ágil por secciones", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Nómina para todas las secciones de 7.° (7-1 a 7-20).", margin + 4, yPos + 12);
  doc.text("• Registro rápido con nombre y dos apellidos.", margin + 4, yPos + 17);
  doc.text("• Asignación automática de roles en parejas.", margin + 4, yPos + 22);
  doc.text("• Estado de avance en tiempo real por estudiante.", margin + 4, yPos + 27);
  doc.text("• Sincronización transparente con el panel central.", margin + 4, yPos + 32);

  // Card 2: Sistematización y Reportes
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. Sistematización y reportes oficiales", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Consolidado automático de niveles de logro.", margin + cardW + 8, yPos + 12);
  doc.text("• Identificación de brechas de entrada de primaria.", margin + cardW + 8, yPos + 17);
  doc.text("• Exportación a formatos oficiales de Excel y PDF.", margin + cardW + 8, yPos + 22);
  doc.text("• Generación de actas diagnósticas institucionales.", margin + cardW + 8, yPos + 27);
  doc.text("• Respaldo local seguro sin riesgo de pérdida.", margin + cardW + 8, yPos + 32);

  // Card 3: Escaneo QR sin Conexión
  yPos = 73;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Escaneo QR en modo sin conexión", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• En laboratorios sin internet, cada alumno genera QR.", margin + 4, yPos + 12);
  doc.text("• El docente escanea con cámara web o teléfono.", margin + 4, yPos + 17);
  doc.text("• Carga instantánea de resultados sin digitar.", margin + 4, yPos + 22);
  doc.text("• Total cobertura para centros educativos rurales.", margin + 4, yPos + 27);
  doc.text("• Cifrado criptográfico que previene fraudes.", margin + 4, yPos + 32);

  // Card 4: Recomendaciones DUA y mediación con IA
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Recomendaciones DUA y mediación con IA", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Análisis formativo y triada diagnóstica en 3 a 6 s.", margin + cardW + 8, yPos + 12);
  doc.text("• Sugerencias didácticas y adaptaciones curriculares.", margin + cardW + 8, yPos + 17);
  doc.text("• Estrategias de nivelación para saberes iniciales.", margin + cardW + 8, yPos + 22);
  doc.text("• Red de resiliencia multicapa con múltiples servicios.", margin + cardW + 8, yPos + 27);
  doc.text("• Respuestas en 0 ms para consultas frecuentes en caché.", margin + cardW + 8, yPos + 32);

  // 6. Protocolo Operativo
  yPos = 114;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("6. Protocolo operativo: modalidad en línea frente a sin conexión (QR)", margin, yPos);

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
    head: [['Paso', 'Modalidad en línea (con internet)', 'Modalidad sin conexión (desconectada / QR)']],
    body: [
      ['1. Acceso', 'Docente proyecta enlace web de CyberQuest 7.°. ', 'Se distribuye archivo .html autónomo vía red local o USB.'],
      ['2. Registro', 'Estudiantes eligen trabajar individual o en pareja.', 'Estudiantes abren la WebApp localmente en sus equipos.'],
      ['3. Misión', 'Completan las 10 misiones y pruebas psicomotrices.', 'Completan las 10 misiones con validación interactiva.'],
      ['4. Cierre', 'Los datos se sincronizan al instante en la nube.', 'La WebApp genera un código QR cifrado en pantalla.'],
      ['5. Reporte', 'Aparece automáticamente en el panel docente.', 'Docente escanea el código QR y consolida la sección.']
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

  drawHeaderFooter(4, 5, "Instrumento docente y sistematización de 7.° año");

  // =========================================================================
  // PÁGINA 5: PROTOCOLO DE APLICACIÓN EN AULA Y ENLACES OFICIALES
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("7. Protocolo de aplicación en el aula o laboratorio de 7.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Guía paso a paso para la mediación diagnóstica durante el inicio del ciclo lectivo de 7.° año:",
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
        '• Abrir el módulo evaluador de 7.° año en su equipo.\n• Proyectar el enlace o distribuir el archivo offline.',
        '• Ingresar a la WebApp desde sus computadoras.\n• Ingresar nombre con dos apellidos y sección (ej. 7-1).'
      ],
      [
        'Fase 2: Ejecución\n(25 a 35 min)',
        '• Observar el trabajo en parejas y desenvolvimiento motriz.\n• Registrar conductas observables en la rúbrica docente.',
        '• Resolver los 10 retos y dinámicas de ciber-agentes.\n• Trabajar en colaboración y analizar cada opción.'
      ],
      [
        'Fase 3: Cierre y traspaso\n(10 min)',
        '• En modo online: verificar recepción de telemetría.\n• En modo offline: escanear el QR generado en cada PC.',
        '• Visualizar su retroalimentación y nivel alcanzado.\n• Presentar su código QR o comprobante digital final.'
      ],
      [
        'Fase 4: Sistematización\n(Posterior a la clase)',
        '• Revisar la pestaña de sistematización oficial de 7.° año.\n• Exportar las actas consolidadas en Excel y PDF.',
        '• Conservar copia de su comprobante digital según indicación docente.'
      ]
    ]
  });

  yPos = doc.lastAutoTable.finalY + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("8. Enlaces oficiales y accesos en producción (7.° año)", margin, yPos);

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
    head: [['Recurso de 7.° año', 'URL oficial en producción', 'Modo de acceso']],
    body: [
      ['Portal multi-nivel MEP', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En línea (pestaña 7.°)'],
      ['CyberQuest 7.° (en línea)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_en_linea.html', 'En línea / Telemetría'],
      ['CyberQuest 7.° (offline)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_desconectado_offline.html', 'Desconectado / Local (QR)'],
      ['Evaluador docente 7.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_docente_evaluador.html', 'En línea / Escáner QR'],
      ['Panel central de telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo global'],
      ['Guía pedagógica oficial 7.° (PDF)', 'https://diagnosticosecundaria.vercel.app/docs/GUIA_PEDAGOGICA_DIAGNOSTICO_7MO_MEP.pdf', 'Descarga oficial']
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
  doc.text("Guía pedagógica y documento técnico oficial de 7.° año para asesorías y equipos docentes.", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_CYAN_DARK);
  doc.text("Ecosistema de Formación Tecnológica • Ciclo Lectivo 2027", margin + 4, yPos + 17);

  drawHeaderFooter(5, 5, "Protocolo de aplicación y enlaces oficiales (7.° año)");

  return doc;
}

// 1. Guardar en public/docs/ y public/documentos/
const outputDirDocs = path.join(__dirname, '..', 'public', 'docs');
const outputDirDocumentos = path.join(__dirname, '..', 'public', 'documentos');

if (!fs.existsSync(outputDirDocs)) fs.mkdirSync(outputDirDocs, { recursive: true });
if (!fs.existsSync(outputDirDocumentos)) fs.mkdirSync(outputDirDocumentos, { recursive: true });

const outputPathGuia = path.join(outputDirDocs, 'GUIA_PEDAGOGICA_DIAGNOSTICO_7MO_MEP.pdf');
const outputPathDocTecnico = path.join(outputDirDocumentos, 'Documento_Tecnico_Pedagogico_MEP_7mo_CyberQuest.pdf');

const doc = generarDocumento7moPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathGuia, pdfBuffer);
fs.writeFileSync(outputPathDocTecnico, pdfBuffer);
console.log(`✅ PDF de 7.° año generado con éxito en:\n - ${outputPathGuia}\n - ${outputPathDocTecnico}`);
