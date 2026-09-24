const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDocumento9noPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm

  // Paleta de colores oficial MEP & 9.° año («Aula Inteligente»)
  const COLOR_PRIMARY = [0, 51, 102];     // Azul Institucional MEP #003366
  const COLOR_HEADER = [15, 23, 42];      // Slate 900 #0f172a
  const COLOR_PURPLE = [126, 34, 206];    // Purple 700 #7e22ce
  const COLOR_PURPLE_DARK = [88, 28, 135]; // Purple 900 #581c87
  const COLOR_EMERALD = [4, 120, 87];     // Emerald 700 #047857
  const COLOR_AMBER = [180, 83, 9];       // Amber 700 #b45309
  const COLOR_DARK = [15, 23, 42];        // Slate 900 (Texto principal)
  const COLOR_MUTED = [71, 85, 105];      // Slate 600 (Texto secundario de alto contraste)
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50 (Fondo tarjetas claras)
  const COLOR_BORDER = [203, 213, 225];   // Slate 300 (Bordes definidos)

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Barra superior
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 5, 'F');
    doc.setFillColor(...COLOR_PURPLE);
    doc.rect(0, 5, pageWidth, 1.5, 'F');

    // Texto de cabecera
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2027", margin, 11.5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Documento técnico oficial • Diagnóstico de 9.° año", pageWidth - margin, 11.5, { align: 'right' });

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
    doc.text("Evaluación diagnóstica de 9.° año: «Aula Inteligente», simulación 2D y sistemas embebidos (triada formativa)", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA Y FUNDAMENTACIÓN PEDAGÓGICA DE 9.° AÑO
  // =========================================================================
  
  // Banner de portada
  doc.setFillColor(...COLOR_HEADER);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_PURPLE);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Distintivo superior
  doc.setFillColor(126, 34, 206);
  doc.roundedRect(margin, 10, 120, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • MEP 2027", margin + 4, 14.5);

  // Título principal en formato gramatical hispanoamericano
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("Diagnóstico de 9.° año: Aula Inteligente", margin, 26);
  doc.setFontSize(13);
  doc.setTextColor(216, 180, 254); // Violeta claro
  doc.text("Guía pedagógica y documento técnico oficial", margin, 34);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluación integral de sistemas embebidos: simulador 2D de circuitos, 10 reactivos cognitivos y triada DUA.", margin, 42);
  doc.text("Arquitectura de doble código QR: estudiante autónomo y docente evaluador con sistematización en tiempo real.", margin, 48);

  // Tarjeta de Ficha Técnica
  let yPos = 67;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 32, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Ficha técnica del recurso diagnóstico (9.° año)", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Población meta: Estudiantes de 9.° año (noveno de secundaria / cierre del Tercer Ciclo de la EGB).", margin + 6, yPos + 12);
  doc.text("• Enfoque de la misión: «Aula Inteligente» — Domótica, sensores LDR, microcontroladores y lógica IoT.", margin + 6, yPos + 17);
  doc.text("• Componentes evaluativos: Parte A (10 reactivos cognitivos) + Parte B (simulador 2D) + observación docente.", margin + 6, yPos + 22);
  doc.text("• Acceso web en producción: https://diagnosticosecundaria.vercel.app/diagnostico (pestaña 9.° año).", margin + 6, yPos + 27);

  // 1. Fundamentación Pedagógica
  yPos = 105;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Fundamentación pedagógica y curricular de 9.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El diagnóstico de 9.° año representa la culminación del Tercer Ciclo en Formación Tecnológica. Integra los saberes de computación física, automatización y pensamiento computacional en un reto situado de «Aula Inteligente» que evalúa tres dimensiones de aprendizaje formativo:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 123;
  const colW = (contentWidth - 6) / 3;

  // Dimensión 1: Cognitiva
  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(margin, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PURPLE_DARK);
  doc.text("1. Dimensión cognitiva", margin + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Fuentes y conversión energética.", margin + 4, yPos + 14);
  doc.text("• Circuitos, conductores y aislantes.", margin + 4, yPos + 21);
  doc.text("• Ley de Ohm cualitativa y sensores LDR.", margin + 4, yPos + 28);
  doc.text("• Microcontrolador y lógica condicional.", margin + 4, yPos + 35);

  // Dimensión 2: Psicomotriz y Simulación 2D
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + colW + 3, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_EMERALD);
  doc.text("2. Simulación 2D y psicomotriz", margin + colW + 7, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Conexionado interactivo en protoboard.", margin + colW + 7, yPos + 14);
  doc.text("• Cableado VCC 5V, GND, Pin A0 y D9.", margin + colW + 7, yPos + 21);
  doc.text("• Prueba de iluminación y umbral lumínico.", margin + colW + 7, yPos + 28);
  doc.text("• Destreza en interfaz y manipulación.", margin + colW + 7, yPos + 35);

  // Dimensión 3: Socioafectiva y Ética
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin + (colW + 3) * 2, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_AMBER);
  doc.text("3. Dimensión socioafectiva", margin + (colW + 3) * 2 + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Eficiencia energética y sostenibilidad.", margin + (colW + 3) * 2 + 4, yPos + 14);
  doc.text("• Ciberseguridad y privacidad en IoT.", margin + (colW + 3) * 2 + 4, yPos + 21);
  doc.text("• Resiliencia ante errores de circuito.", margin + (colW + 3) * 2 + 4, yPos + 28);
  doc.text("• Colaboración y diálogo constructivo.", margin + (colW + 3) * 2 + 4, yPos + 35);

  // 2. Arquitectura de Doble Código QR
  yPos = 177;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. Arquitectura de doble código QR para resiliencia operativa (sin conexión)", margin, yPos);

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
      0: { cellWidth: 36, fontStyle: 'bold' },
      1: { cellWidth: 72 },
      2: { cellWidth: 74 }
    },
    head: [['Canal de acceso', 'Función y mecanismo en pantalla', 'Beneficio operativo en el aula']],
    body: [
      ['Canal QR 1: Estudiante (autónomo)', 'Abre la WebApp de Aula Inteligente con los 10 reactivos, simulador 2D y reflexión. Al finalizar genera su QR individual cifrado.', 'Permite que cada alumno trabaje a su propio ritmo sin requerir cuenta previa ni conexión a internet.'],
      ['Canal QR 2: Docente (evaluador)', 'Abre el aplicativo evaluador del profesor para configurar nómina, escanear códigos QR estudiantiles y registrar observación psicomotriz.', 'Consolida la sección en menos de 2 minutos y genera el acta oficial del MEP al instante.'],
      ['Firma de seguridad SHA-256', 'Firma criptográfica incluida en el QR individual que garantiza la autenticidad e inmutabilidad de los resultados obtenidos.', 'Elimina fraudes o alteraciones de datos en entornos desconectados.'],
      ['Modalidad dual (en línea / local)', 'Transición transparente entre base de datos remota (cuando hay red) y almacenamiento local con escaneo QR (sin red).', 'Garantiza cobertura del 100% de centros educativos del país.']
    ]
  });

  drawHeaderFooter(1, 5, "Fundamentación y arquitectura QR de 9.° año");

  // =========================================================================
  // PÁGINA 2: LOS 10 REACTIVOS COGNITIVOS Y SIMULADOR 2D (9.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Matriz de reactivos cognitivos y simulador 2D (9.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Estructura de la Parte A (conocimientos conceptuales) y Parte B (simulación práctica 2D) del diagnóstico de 9.° año:",
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
    head: [['Reactivo', 'Saber curricular', 'Descripción de la situación problema', 'Criterio de evaluación']],
    body: [
      ['Ítem 1', 'Energía y conversión', 'Transformación de energía solar a eléctrica y cinética en actuadores.', 'Logrado: Reconoce principio de conservación.'],
      ['Ítem 2', 'Circuito eléctrico simple', 'Función de fuente, interruptor, carga o actuador y trayectoria cerrada.', 'Logrado: Identifica los 3 componentes esenciales.'],
      ['Ítem 3', 'Conductores y aislantes', 'Materiales conductores (cobre, aluminio) frente a aislantes (goma, plástico).', 'Logrado: Selecciona materiales seguros.'],
      ['Ítem 4', 'Ley de Ohm cualitativa', 'Relación entre voltaje, corriente y resistencia ante variaciones de carga.', 'Logrado: Comprende la oposición al paso de corriente.'],
      ['Ítem 5', 'Polaridad de componentes', 'Orientación de ánodo y cátodo en diodos LED y conexionado de servomotores.', 'Logrado: Identifica terminales y polaridad.'],
      ['Ítem 6', 'Sensor de luz (LDR)', 'Comportamiento de la fotocélula: la resistencia disminuye con mayor luz ambiental.', 'Logrado: Deduce variación analógica de la LDR.'],
      ['Ítem 7', 'Microcontrolador (MCU)', 'El microcontrolador como unidad central de procesamiento embebida.', 'Logrado: Distingue MCU de sensores y actuadores.'],
      ['Ítem 8', 'Control algorítmico', 'Estructura condicional lógica: Si (luz < umbral) entonces encender actuador.', 'Logrado: Formula la regla de automatización.'],
      ['Ítem 9', 'Prevención cortocircuitos', 'Detección de conexión directa VCC-GND sin resistencia limitadora.', 'Logrado: Reconoce el peligro y corrige el cableado.'],
      ['Ítem 10', 'Seguridad y orden técnico', 'Protocolo de desenergización antes de modificar conexiones físicas.', 'Logrado: Cumple la norma de seguridad en el taller.'],
      ['Simulador 2D', 'Conexionado en protoboard', 'Cableado virtual en simulador: VCC 5V, GND, Pin A0 (LDR) y Pin D9 (LED).', 'Logrado: 4/4 conexiones correctas y prueba funcional.']
    ]
  });

  drawHeaderFooter(2, 5, "Reactivos y simulador 2D de 9.° año");

  // =========================================================================
  // PÁGINA 3: RÚBRICAS OFICIALES DOCENTES (9.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Rúbricas oficiales docentes: dimensión psicomotriz y socioafectiva (9.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Indicadores de observación directa evaluados por el docente durante la sesión de laboratorio de 9.° año:",
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
    head: [['Cód.', 'Criterio observado', 'Conducta observable en 9.° año', 'Escala formativa oficial del MEP']],
    body: [
      // Psicomotriz
      ['P1', 'Manipulación de protoboard', 'Inserta y retira componentes y cables en la placa de pruebas con motricidad fina y sin doblar pines.', 'Nivel A: Precisión y destreza ergonómica\nNivel B: Inserción adecuada con lentitud\nNivel C: Fuerza excesiva o deformación de pines'],
      ['P2', 'Conexionado de terminales', 'Identifica y vincula con exactitud los terminales VCC, GND y Pines Analógicos/Digitales del MCU.', 'Nivel A: Cableado exacto y ordenado\nNivel B: Corrige terminal con verificación\nNivel C: Confunde líneas de polaridad'],
      ['P3', 'Calibración de sensores', 'Ajusta el potenciómetro o umbral lumínico observando la respuesta en tiempo real del actuador.', 'Nivel A: Calibración precisa y sistemática\nNivel B: Calibra por ensayo y error\nNivel C: Dificultad para ajustar el umbral'],
      // Socioafectiva
      ['S1', 'Conciencia de eficiencia', 'Valora el impacto de la automatización en el ahorro energético de la institución y el medio ambiente.', 'Nivel A: Reflexión crítica y propositiva\nNivel B: Reconoce el ahorro básico\nNivel C: Desinterés por el impacto energético'],
      ['S2', 'Ética y privacidad en IoT', 'Reconoce la importancia de proteger datos y sensores en redes interconectadas frente a vulnerabilidades.', 'Nivel A: Alto criterio de ciberseguridad\nNivel B: Noción elemental de privacidad\nNivel C: Descuido en la seguridad de red'],
      ['S3', 'Resiliencia ante fallos', 'Depura con serenidad y método lógico los errores de cableado o umbrales sin mostrar frustración.', 'Nivel A: Análisis constructivo del error\nNivel B: Requiere orientación docente\nNivel C: Abandono de la actividad ante fallas'],
      ['S4', 'Colaboración en taller', 'Comparte herramientas de laboratorio, apoya solidariamente a sus compañeros y cuida el material.', 'Nivel A: Solidaridad y trabajo en equipo\nNivel B: Participación individualista\nNivel C: Conflictos en la mesa de trabajo']
    ]
  });

  // Metacognición Parte C
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("Parte C: Reflexión metacognitiva del estudiante (9.° año)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Al finalizar la prueba, el estudiante responde 3 preguntas abiertas de autoevaluación: 1) ¿Qué reto fue más complejo en el conexionado? • " +
    "2) ¿Cómo resolvió las dudas o fallos técnicos? • 3) ¿Cómo aplicaría un sistema de aula inteligente en su propio colegio? Estas reflexiones se integran al reporte docente.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(3, 5, "Rúbricas psicomotrices y socioafectivas de 9.° año");

  // =========================================================================
  // PÁGINA 4: EL INSTRUMENTO DOCENTE EVALUADOR Y SISTEMATIZACIÓN (9.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("5. El instrumento docente evaluador y sistematizador de 9.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente para 9.° año integra un potente sistematizador grupal que procesa nóminas completas con escaneo QR y telemetría centralizada:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 33;
  const cardW = (contentWidth - 4) / 2;

  // Card 1: Nómina Dinámica
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. Nómina dinámica por secciones", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Carga ágil de nómina de estudiantes (9-1 a 9-20).", margin + 4, yPos + 12);
  doc.text("• Asistente de primer ingreso y configuración rápida.", margin + 4, yPos + 17);
  doc.text("• Escáner de códigos QR con cámara web o móvil.", margin + 4, yPos + 22);
  doc.text("• Marcado directo de indicadores psicomotores.", margin + 4, yPos + 27);
  doc.text("• Almacenamiento local blindado sin fugas de datos.", margin + 4, yPos + 32);

  // Card 2: Sistematización Grupal
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. Sistematización grupal inmediata", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Cálculo instantáneo de porcentajes de logro (L / ED / RA).", margin + cardW + 8, yPos + 12);
  doc.text("• Consolidado tripartito de la triada formativa oficial.", margin + cardW + 8, yPos + 17);
  doc.text("• Exportación de actas completas en formatos CSV y Excel.", margin + cardW + 8, yPos + 22);
  doc.text("• Generación de PDF institucional con sello del MEP.", margin + cardW + 8, yPos + 27);
  doc.text("• Respaldo local y recuperación de registros previos.", margin + cardW + 8, yPos + 32);

  // Card 3: Monitoreo en Tiempo Real
  yPos = 73;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. Monitoreo en tiempo real (Telemetría)", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Recepción instantánea (0 ms) de entregas estudiantiles.", margin + 4, yPos + 12);
  doc.text("• Módulo de validación antifraude con token criptográfico.", margin + 4, yPos + 17);
  doc.text("• Identificación de reactivos con mayor índice de error.", margin + 4, yPos + 22);
  doc.text("• Análisis comparativo entre secciones de 9.° año.", margin + 4, yPos + 27);
  doc.text("• Sincronización transparente con base de datos en la nube.", margin + 4, yPos + 32);

  // Card 4: Decisiones Pedagógicas con IA y DUA
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. Decisiones pedagógicas y DUA con IA", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Análisis cualitativo de brechas en 3 a 6 segundos.", margin + cardW + 8, yPos + 12);
  doc.text("• Estrategias de mediación diferenciada según brechas.", margin + cardW + 8, yPos + 17);
  doc.text("• Red de resiliencia con múltiples servicios en cascada.", margin + cardW + 8, yPos + 22);
  doc.text("• Validación continua de descriptores curriculares MEP.", margin + cardW + 8, yPos + 27);
  doc.text("• Caché de respuesta en 0 ms para consultas repetidas.", margin + cardW + 8, yPos + 32);

  // 6. Comparativa Operativa
  yPos = 114;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("6. Comparativa operativa: en línea frente a sin conexión (QR)", margin, yPos);

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
    head: [['Dimensión operativa', 'Modalidad en línea (con internet)', 'Modalidad sin conexión (desconectada / QR)']],
    body: [
      ['Requisitos de red', 'Conexión a internet estable en el laboratorio.', 'Cero conexión a internet requerida (100% local).'],
      ['Ejecución estudiantil', 'Abre la WebApp en línea desde el navegador.', 'Abre el archivo autónomo .html desde red local o USB.'],
      ['Transmisión de datos', 'Envío automático por telemetría a la base de datos.', 'Generación de código QR cifrado en pantalla al finalizar.'],
      ['Consolidación docente', 'Los resultados aparecen al instante en el panel.', 'El docente escanea los códigos QR con su cámara.'],
      ['Seguridad de datos', 'Tokens seguros y aislamiento por cuenta docente.', 'Firma criptográfica SHA-256 en cada código QR.']
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

  drawHeaderFooter(4, 5, "Instrumento docente y sistematización de 9.° año");

  // =========================================================================
  // PÁGINA 5: PROTOCOLO DE APLICACIÓN EN AULA Y ENLACES OFICIALES
  // =========================================================================
  doc.addPage();
  
  yPos = 19;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("7. Protocolo de aplicación en el aula o laboratorio de 9.° año", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Guía paso a paso para la mediación diagnóstica durante las primeras semanas del ciclo escolar:",
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
    head: [['Fase de aplicación', 'Acciones del docente en el aula', 'Acciones de las personas estudiantes']],
    body: [
      [
        'Fase 1: Inducción\n(5 a 10 min)',
        '• Explicar el propósito formativo de «Aula Inteligente».\n• Proyectar el enlace web o distribuir el archivo autónomo.',
        '• Ingresar a la WebApp desde sus equipos de cómputo.\n• Ingresar nombre completo, cédula y sección (ej. 9-1).'
      ],
      [
        'Fase 2: Ejecución\n(25 a 35 min)',
        '• Observar la manipulación del simulador 2D y protoboard.\n• Calificar indicadores psicomotores en la rúbrica docente.',
        '• Responder 10 reactivos cognitivos (Parte A).\n• Realizar el cableado en el simulador 2D (Parte B).'
      ],
      [
        'Fase 3: Reflexión\n(10 min)',
        '• Guiar la reflexión sobre eficiencia energética y domótica.\n• Verificar recepción de telemetría o escanear códigos QR.',
        '• Responder las 3 preguntas metacognitivas (Parte C).\n• Presentar su código QR o comprobante digital final.'
      ],
      [
        'Fase 4: Toma de decisiones\n(Posterior a la clase)',
        '• Consultar la matriz de decisiones en el panel central.\n• Aplicar mediación pedagógica diferenciada según brechas.',
        '• Participar en las actividades de nivelación o retos avanzados programados por el docente.'
      ]
    ]
  });

  yPos = doc.lastAutoTable.finalY + 7;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("8. Enlaces oficiales y accesos en producción (9.° año)", margin, yPos);

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
    head: [['Recurso de 9.° año', 'URL oficial en producción', 'Modo de acceso']],
    body: [
      ['Portal multi-nivel MEP', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En línea (pestaña 9.°)'],
      ['WebApp estudiante 9.° (en línea)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_en_linea.html', 'En línea / Telemetría'],
      ['WebApp estudiante 9.° (offline)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_desconectado_offline.html', 'Desconectado / Local (QR)'],
      ['Evaluador docente 9.° año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_docente_evaluador.html', 'En línea / Escáner QR'],
      ['Panel central de telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo global'],
      ['Guía pedagógica oficial 9.° (PDF)', 'https://diagnosticosecundaria.vercel.app/docs/GUIA_PEDAGOGICA_DIAGNOSTICO_9NO_MEP.pdf', 'Descarga oficial']
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
  doc.text("Guía pedagógica y documento técnico oficial de 9.° año para asesorías y equipos docentes.", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_PURPLE);
  doc.text("Ecosistema de Formación Tecnológica • Ciclo Lectivo 2027", margin + 4, yPos + 17);

  drawHeaderFooter(5, 5, "Protocolo de aplicación y enlaces oficiales (9.° año)");

  return doc;
}

// 1. Guardar en public/docs/ y public/documentos/
const outputDirDocs = path.join(__dirname, '..', 'public', 'docs');
const outputDirDocumentos = path.join(__dirname, '..', 'public', 'documentos');

if (!fs.existsSync(outputDirDocs)) fs.mkdirSync(outputDirDocs, { recursive: true });
if (!fs.existsSync(outputDirDocumentos)) fs.mkdirSync(outputDirDocumentos, { recursive: true });

const outputPathGuia = path.join(outputDirDocs, 'GUIA_PEDAGOGICA_DIAGNOSTICO_9NO_MEP.pdf');
const outputPathDocTecnico = path.join(outputDirDocumentos, 'Documento_Tecnico_Pedagogico_MEP_9no_Domotica.pdf');

const doc = generarDocumento9noPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathGuia, pdfBuffer);
fs.writeFileSync(outputPathDocTecnico, pdfBuffer);
console.log(`✅ PDF de 9.° año generado con éxito en:\n - ${outputPathGuia}\n - ${outputPathDocTecnico}`);
