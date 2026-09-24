const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDossier9noPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm

  // Paleta de Colores Oficial MEP & 9no Aula Inteligente
  const COLOR_PRIMARY = [15, 23, 42];     // Slate 900 #0f172a
  const COLOR_PURPLE = [126, 34, 206];    // Purple 700 #7e22ce
  const COLOR_PURPLE_LIGHT = [168, 85, 247]; // Purple 500 #a855f7
  const COLOR_AMBER = [217, 119, 6];      // Amber 600 #d97706
  const COLOR_EMERALD = [16, 185, 129];   // Emerald 500 #10b981
  const COLOR_CYAN = [6, 182, 212];       // Cyan 500 #06b6d4
  const COLOR_DARK = [15, 23, 42];        // Slate 900 #0f172a
  const COLOR_MUTED = [100, 116, 139];    // Slate 500 #64748b
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50 #f8fafc
  const COLOR_BORDER = [226, 232, 240];   // Slate 200 #e2e8f0

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Top Bar
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 6, 'F');
    doc.setFillColor(...COLOR_PURPLE);
    doc.rect(0, 6, pageWidth, 1.5, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 51, 102); // MEP Blue
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2027", margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Guía Pedagógica y Dossier Técnico • 9° Año Aula Inteligente", pageWidth - margin, 12, { align: 'right' });

    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Footer Bar
    doc.setDrawColor(...COLOR_BORDER);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text("Evaluación Diagnóstica 9.° Año: Aula Inteligente y Sistemas Embebidos (Simulador 2D, LDR, MCU, DUA)", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA Y FUNDAMENTACIÓN PEDAGÓGICA DE 9.° AÑO
  // =========================================================================
  
  // Header Banner
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_PURPLE);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Badge Superior
  doc.setFillColor(126, 34, 206, 0.25);
  doc.roundedRect(margin, 10, 115, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(192, 132, 252); // Purple 400
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • MEP 2027", margin + 4, 15);

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("DIAGNÓSTICO 9.° AÑO: AULA INTELIGENTE", margin, 27);
  doc.setFontSize(14);
  doc.setTextColor(216, 180, 254); // Purple light
  doc.text("GUÍA PEDAGÓGICA Y DOSSIER TÉCNICO OFICIAL", margin, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluación Integral de Sistemas Embebidos: Simulador 2D de Circuitos, 10 Reactivos Cognitivos y Triada DUA", margin, 43);
  doc.text("Arquitectura de Doble Código QR: Estudiante Autónomo + Docente Evaluador y Sistematizador Inmediato", margin, 49);

  // Tarjeta de Metadatos
  let yPos = 68;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("FICHA TÉCNICA DEL RECURSO DIAGNÓSTICO (9.° AÑO)", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Población Meta: Estudiantes de 9.° Año (Noveno de Secundaria / Cierre del Tercer Ciclo EGB).", margin + 6, yPos + 12);
  doc.text("• Enfoque de la Misión: «Aula Inteligente» — Domótica, Sensores LDR, Microcontroladores y Redes IoT.", margin + 6, yPos + 17);
  doc.text("• Componentes Evaluativos: Parte A (10 Ítems Cognitivos) + Parte B (Simulador 2D Circuitos) + Observación Docente.", margin + 6, yPos + 22);
  doc.text("• Acceso Web en Producción: https://diagnosticosecundaria.vercel.app/diagnostico (Pestaña 9.° Año).", margin + 6, yPos + 27);

  // Fundamentación Pedagógica
  yPos = 106;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 51, 102);
  doc.text("1. FUNDAMENTACIÓN PEDAGÓGICA Y CURRICULAR DE 9.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El diagnóstico de 9.° Año representa la culminación del Tercer Ciclo en Formación Tecnológica. Integra los saberes de computación física, automatización y pensamiento computacional en un reto situado de «Aula Inteligente» que evalúa tres dimensiones de aprendizaje formativo:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 124;
  const colW = (contentWidth - 6) / 3;

  // Dimensión 1: Cognitiva
  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(margin, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(107, 33, 168);
  doc.text("💡 1. Dimensión Cognitiva", margin + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Fuentes y conversión energética.", margin + 4, yPos + 13);
  doc.text("• Circuitos, conductores y aislantes.", margin + 4, yPos + 20);
  doc.text("• Ley de Ohm cualitativa y sensores LDR.", margin + 4, yPos + 27);
  doc.text("• Microcontrolador y lógica si/entonces.", margin + 4, yPos + 34);

  // Dimensión 2: Psicomotriz y Simulación 2D
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + colW + 3, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(4, 120, 87);
  doc.text("🔌 2. Simulación 2D y Psicomotriz", margin + colW + 7, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Conexionado interactivo en Protoboard.", margin + colW + 7, yPos + 13);
  doc.text("• Cableado VCC 5V, GND, Pin A0 y D9.", margin + colW + 7, yPos + 20);
  doc.text("• Prueba de iluminación y umbral lumínico.", margin + colW + 7, yPos + 27);
  doc.text("• Destreza en interfaz y manipulación.", margin + colW + 7, yPos + 34);

  // Dimensión 3: Socioafectiva y Ética
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin + (colW + 3) * 2, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text("❤️ 3. Dimensión Socioafectiva", margin + (colW + 3) * 2 + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Eficiencia energética y sostenibilidad.", margin + (colW + 3) * 2 + 4, yPos + 13);
  doc.text("• Ciberseguridad y privacidad en IoT.", margin + (colW + 3) * 2 + 4, yPos + 20);
  doc.text("• Resiliencia ante errores de circuito.", margin + (colW + 3) * 2 + 4, yPos + 27);
  doc.text("• Colaboración y diálogo constructivo.", margin + (colW + 3) * 2 + 4, yPos + 34);

  // Arquitectura de Doble Código QR
  yPos = 178;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("2. ARQUITECTURA DE DOBLE CÓDIGO QR PARA RESILIENCIA OPERATIVA (OFFLINE-FIRST)", margin, yPos);

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
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 74 },
      2: { cellWidth: 74 }
    },
    head: [['Canal de Acceso', 'Función y Mecanismo en Pantalla', 'Beneficio Operativo en el Aula']],
    body: [
      ['📱 QR 1: Estudiante (Autónomo)', 'Abre la WebApp de Aula Inteligente con los 10 reactivos, simulador 2D y reflexión. Al finalizar genera su QR individual cifrado.', 'Permite que cada alumno trabaje a su propio ritmo sin requerir cuenta previa ni conexión a internet.'],
      ['💻 QR 2: Docente (Evaluador)', 'Abre el aplicativo evaluador del profesor para configurar nómina, escanear QRs estudiantiles y registrar observación psicomotriz.', 'Consolida la sección en menos de 2 minutos y genera el acta oficial MEP al instante.'],
      ['🔐 Cifrado SHA-256', 'Firma criptográfica incluida en el QR individual que garantiza la autenticidad e inmutabilidad de las respuestas.', 'Elimina fraudes o alteraciones de datos en entornos desconectados.'],
      ['⚡ Modo Dual En Línea / Local', 'Transición transparente entre base de datos remota (cuando hay red) y almacenamiento local con escaneo QR (sin red).', 'Garantiza cobertura del 100% de centros educativos del país.']
    ]
  });

  drawHeaderFooter(1, 5, "Fundamentación y Arquitectura QR de 9.° Año");

  // =========================================================================
  // PÁGINA 2: LOS 10 REACTIVOS COGNITIVOS Y SIMULADOR 2D (9.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("3. MATRIZ DE REACTIVOS COGNITIVOS Y SIMULADOR 2D (9.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Estructura de la Parte A (Conocimientos Previos) y Parte B (Simulación Práctica 2D) del Diagnóstico de 9.° Año:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 34;

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
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 64 }
    },
    head: [['Reactivo', 'Saber Curricular', 'Descripción de la Situación Problema', 'Criterio de Evaluación']],
    body: [
      ['Ítem 1', 'Energía y Conversión', 'Transformación de energía solar a eléctrica y cinética en actuadores.', 'Logrado: Reconoce principio de conservación.'],
      ['Ítem 2', 'Circuito Eléctrico Simple', 'Función de fuente, interruptor, carga/actuador y trayectoria cerrada.', 'Logrado: Identifica los 3 componentes esenciales.'],
      ['Ítem 3', 'Conductores y Aislantes', 'Materiales conductores (cobre, aluminio) vs aislantes (goma, plástico).', 'Logrado: Selecciona materiales seguros.'],
      ['Ítem 4', 'Ley de Ohm Cualitativa', 'Relación entre voltaje, corriente y resistencia ante cambios de carga.', 'Logrado: Comprende la oposición al paso de corriente.'],
      ['Ítem 5', 'Polaridad de Componentes', 'Orientación de ánodo/cátodo en diodos LED y conexionado de servos.', 'Logrado: Identifica patilla larga/corta y polaridad.'],
      ['Ítem 6', 'Sensor de Luz (LDR)', 'Comportamiento de la fotocélula: resistencia disminuye con luz ambiental.', 'Logrado: Deduce variación analógica de la LDR.'],
      ['Ítem 7', 'Microcontrolador / MCU', 'El microcontrolador como unidad central de procesamiento embebida.', 'Logrado: Distingue MCU de sensores y actuadores.'],
      ['Ítem 8', 'Control Algorítmico', 'Estructura condicional `SI (luz < umbral) ENTONCES encender_luz`.', 'Logrado: Formula la regla de automatización.'],
      ['Ítem 9', 'Prevención Cortocircuitos', 'Detección de conexión directa VCC-GND sin resistencia limitadora.', 'Logrado: Reconoce el peligro y corrige cableado.'],
      ['Ítem 10', 'Seguridad y Orden', 'Protocolo de desenergización antes de modificar conexiones físicas.', 'Logrado: Cumple la norma de seguridad en taller.'],
      ['Simulador 2D', 'Conexionado Protoboard', 'Cableado virtual en Canvas: VCC 5V, GND, Pin A0 (LDR) y Pin D9 (LED).', 'Logrado: 4/4 conexiones correctas + test funcional.']
    ]
  });

  drawHeaderFooter(2, 5, "Reactivos y Simulador 2D de 9.° Año");

  // =========================================================================
  // PÁGINA 3: RÚBRICAS OFICIALES DOCENTES (9.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("4. RÚBRICAS OFICIALES DOCENTES: DIMENSIÓN PSICOMOTRIZ Y SOCIOAFECTIVA (9.°)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Indicadores de observación directa evaluados por el docente durante la sesión de laboratorio de 9.° Año:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 34;

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
    head: [['Cód.', 'Criterio Observado', 'Conducta Observable en 9.° Año', 'Escala Formativa Oficial MEP']],
    body: [
      // Psicomotora
      ['P1', 'Manipulación de Protoboard', 'Inserta y retira componentes y jumpers en la placa de pruebas con motricidad fina y sin doblar pines.', 'Nivel A: Precisión y destreza ergonómica\nNivel B: Inserción adecuada con lentitud\nNivel C: Fuerza excesiva o deformación de pines'],
      ['P2', 'Conexionado de Terminales', 'Identifica y vincula con exactitud los terminales VCC, GND y Pines Analógicos/Digitales del MCU.', 'Nivel A: Cableado exacto y ordenado\nNivel B: Corrige terminal con verificación\nNivel C: Confunde líneas de polaridad'],
      ['P3', 'Calibración de Sensores', 'Ajusta el potenciómetro o umbral lumínico observando la respuesta en tiempo real del actuador.', 'Nivel A: Calibración precisa y sistemática\nNivel B: Calibra por ensayo y error\nNivel C: Dificultad para ajustar el umbral'],
      // Socioafectiva
      ['S1', 'Conciencia de Eficiencia', 'Valora el impacto de la automatización en el ahorro energético de la institución y el medio ambiente.', 'Nivel A: Reflexión crítica y propositiva\nNivel B: Reconoce el ahorro básico\nNivel C: Desinterés por el impacto energético'],
      ['S2', 'Ética y Privacidad en IoT', 'Reconoce la importancia de proteger datos y sensores en redes interconectadas frente a vulnerabilidades.', 'Nivel A: Alto criterio de ciberseguridad\nNivel B: Noción elemental de privacidad\nNivel C: Descuido en la seguridad de red'],
      ['S3', 'Resiliencia ante Fallos', 'Depura con serenidad y método lógico los errores de cableado o umbrales sin mostrar frustración.', 'Nivel A: Análisis constructivo del error\nNivel B: Requiere orientación docente\nNivel C: Abandono de la actividad ante fallas'],
      ['S4', 'Colaboración en Taller', 'Comparte herramientas de laboratorio, apoya solidariamente a sus compañeros y cuida el material.', 'Nivel A: Solidaridad y trabajo en equipo\nNivel B: Participación individualista\nNivel C: Conflictos en la mesa de trabajo']
    ]
  });

  // Metacognición Parte C
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 51, 102);
  doc.text("PARTE C: REFLEXIÓN METACOGNITIVA DEL ESTUDIANTE (9.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Al finalizar la prueba, el estudiante responde 3 preguntas abiertas de autoevaluación: 1) ¿Qué reto fue más complejo en el conexionado? • " +
    "2) ¿Cómo resolvió las dudas o fallos? • 3) ¿Cómo aplicaría un sistema de aula inteligente en su propio colegio? Estas reflexiones se incorporan al reporte docente.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(3, 5, "Rúbricas Psicomotrices y Socioafectivas de 9.° Año");

  // =========================================================================
  // PÁGINA 4: EL INSTRUMENTO DOCENTE EVALUADOR Y SISTEMATIZACIÓN (9.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("5. EL INSTRUMENTO DOCENTE EVALUADOR Y SISTEMATIZADOR DE 9.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente para 9.° Año integra un potente sistematizador grupal que procesa nóminas completas con escaneo QR y telemetría en la nube:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 36;
  const cardW = (contentWidth - 4) / 2;

  // Card 1
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📊 NÓMINA DINÁMICA POR SECCIONES", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Carga ágil de nómina de estudiantes (9-1 a 9-20).", margin + 4, yPos + 12);
  doc.text("• Asistente de primer ingreso y configuración rápida.", margin + 4, yPos + 17);
  doc.text("• Escáner de códigos QR con cámara web o móvil.", margin + 4, yPos + 22);
  doc.text("• Marcado directo de indicadores psicomotores.", margin + 4, yPos + 27);
  doc.text("• Almacenamiento local blindado sin fugas de datos.", margin + 4, yPos + 32);

  // Card 2
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📑 SISTEMATIZACIÓN GRUPAL INMEDIATA", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Semáforos de logro grupal por cada uno de los 10 reactivos.", margin + cardW + 8, yPos + 12);
  doc.text("• Consolidado tripartito: Cognitivo, Circuito y Actitudinal.", margin + cardW + 8, yPos + 17);
  doc.text("• Generación de código QR con el reporte grupal.", margin + cardW + 8, yPos + 22);
  doc.text("• Exportación a Excel (.xlsx) oficial compatible con MEP.", margin + cardW + 8, yPos + 27);
  doc.text("• Generación de informe PDF para supervisión curricular.", margin + cardW + 8, yPos + 32);

  // Card 3
  yPos = 76;
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📱 APLICACIÓN PWA INSTALABLE", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Puede instalarse como App de escritorio o móvil.", margin + 4, yPos + 12);
  doc.text("• Guía interactiva paso a paso por Sistema Operativo.", margin + 4, yPos + 17);
  doc.text("• Funciona al 100% sin conexión a internet.", margin + 4, yPos + 22);
  doc.text("• Icono directo en el escritorio del docente.", margin + 4, yPos + 27);
  doc.text("• Cero consumo de datos móviles en el taller.", margin + 4, yPos + 32);

  // Card 4
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("✨ TELEMETRÍA Y SEGURIDAD MULTI-TENANT", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Aislamiento estricto por cuenta y cédula docente.", margin + cardW + 8, yPos + 12);
  doc.text("• Sincronización transparente con el Dashboard central.", margin + cardW + 8, yPos + 17);
  doc.text("• Verificación criptográfica SHA-256 en cada envío.", margin + cardW + 8, yPos + 22);
  doc.text("• Registro histórico en base de datos para auditoría.", margin + cardW + 8, yPos + 27);
  doc.text("• Asistente pedagógico con resiliencia en cascada.", margin + cardW + 8, yPos + 32);

  // Flujo Operativo
  yPos = 118;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("6. FLUJO OPERATIVO DEL DIAGNÓSTICO DE 9.° AÑO", margin, yPos);

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
      textColor: COLOR_DARK
    },
    head: [['Fase', 'Acción Estudiante (WebApp 9°)', 'Acción Docente (Evaluador 9°)']],
    body: [
      ['1. Ingreso', 'Abre el QR 1 o archivo local en su PC.', 'Abre el QR 2 o Evaluador en su computadora/móvil.'],
      ['2. Resolución', 'Responde 10 reactivos y conecta el simulador 2D.', 'Observa destreza psicomotriz y registro actitudinal.'],
      ['3. QR Individual', 'Genera comprobante con QR cifrado localmente.', 'Activa el escáner QR de su aplicativo evaluador.'],
      ['4. Escaneo', 'Muestra el QR en su pantalla o celular.', 'Escanea los QRs de cada estudiante de la sección.'],
      ['5. Acta Final', 'Guarda comprobante o portafolio personal.', 'Genera la Sistematización Grupal y exporta a Excel/PDF.']
    ]
  });

  drawHeaderFooter(4, 5, "Instrumento Docente y Sistematización de 9.° Año");

  // =========================================================================
  // PÁGINA 5: PROTOCOLO DE APLICACIÓN EN AULA Y ENLACES OFICIALES
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("7. PROTOCOLO DE APLICACIÓN EN EL AULA / TALLER DE 9.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Orientaciones prácticas para docentes y asesores para la aplicación de Aula Inteligente 9°:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 34;

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
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 72 },
      2: { cellWidth: 80 }
    },
    head: [['Fase de Aplicación', 'Acciones del Docente en el Laboratorio', 'Acciones de las Personas Estudiantes']],
    body: [
      [
        'Fase 1: Ambientación\n(5 a 10 min)',
        '• Plantear el reto de «Aula Inteligente» y ahorro energético.\n• Proyectar el QR 1 o facilitar el enlace web / archivo local.',
        '• Acceder al instrumento desde su equipo.\n• Ingresar nombre, cédula y seleccionar sección (ej. 9-1).'
      ],
      [
        'Fase 2: Reto Cognitivo y Circuito\n(25 a 35 min)',
        '• Circular por el taller observando el conexionado en pantalla.\n• Evaluar el manejo ergonómico y el cumplimiento de normas.',
        '• Resolver los 10 reactivos interactivos.\n• Realizar el cableado virtual en el simulador 2D de Protoboard.'
      ],
      [
        'Fase 3: Reflexión y Escaneo\n(10 min)',
        '• Escanear los QRs de los estudiantes con la cámara del dispositivo.\n• Verificar que todas las filas de la nómina queden registradas.',
        '• Responder las 3 preguntas metacognitivas de la Parte C.\n• Proyectar su código QR individual para el registro docente.'
      ],
      [
        'Fase 4: Sistematización\n(Posterior a la clase)',
        '• Analizar los semáforos de logro de la sección de 9°.\n• Descargar el acta oficial en Excel y el informe pedagógico.',
        '• Conservar copia de su comprobante digital o imprimir insignia.'
      ]
    ]
  });

  yPos = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("8. ENLACES OFICIALES Y ACCESOS EN PRODUCCIÓN (9.° AÑO)", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLOR_DARK,
      cellPadding: 2.2
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'bold' },
      1: { cellWidth: 90 },
      2: { cellWidth: 40, halign: 'center' }
    },
    head: [['Recurso de 9.° Año', 'URL Oficial en Producción', 'Modo de Acceso']],
    body: [
      ['Portal Multi-Nivel MEP', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En Línea (Pestaña 9°)'],
      ['WebApp Aula Inteligente 9° (En Línea)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_en_linea.html', 'En Línea / Telemetría'],
      ['WebApp Aula Inteligente 9° (Offline)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_desconectado_offline.html', 'Desconectado / Local (QR)'],
      ['Evaluador Docente 9° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_docente_evaluador.html', 'En Línea / Escáner QR'],
      ['Dashboard de Telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo Global'],
      ['Guía Pedagógica Oficial 9° (PDF)', 'https://diagnosticosecundaria.vercel.app/docs/GUIA_PEDAGOGICA_DIAGNOSTICO_9NO_MEP.pdf', 'Descarga Oficial']
    ]
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // Cierre Institucional
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT", margin + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("Guía Pedagógica y Dossier Técnico Oficial de 9.° Año para Asesorías y Equipos Docentes.", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(126, 34, 206);
  doc.text("Ecosistema de Formación Tecnológica • Ciclo Lectivo 2027", margin + 4, yPos + 18);

  drawHeaderFooter(5, 5, "Protocolo de Aplicación y Enlaces Oficiales (9°)");

  return doc;
}

// 1. Guardar en public/docs/ y public/documentos/
const outputDirDocs = path.join(__dirname, '..', 'public', 'docs');
const outputDirDocumentos = path.join(__dirname, '..', 'public', 'documentos');

if (!fs.existsSync(outputDirDocs)) fs.mkdirSync(outputDirDocs, { recursive: true });
if (!fs.existsSync(outputDirDocumentos)) fs.mkdirSync(outputDirDocumentos, { recursive: true });

const outputPathGuia = path.join(outputDirDocs, 'GUIA_PEDAGOGICA_DIAGNOSTICO_9NO_MEP.pdf');
const outputPathDossier = path.join(outputDirDocumentos, 'Dossier_Diagnostico_MEP_9no_Aula_Inteligente.pdf');

const doc = generarDossier9noPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathGuia, pdfBuffer);
fs.writeFileSync(outputPathDossier, pdfBuffer);
console.log(`✅ PDF de 9no guardado con éxito en: \n - ${outputPathGuia}\n - ${outputPathDossier}`);

// 2. Guardar en artifacts dir si aplica
const artifactsDir = 'C:\\Users\\curio\\.gemini\\antigravity\\brain\\8ebb4f86-4fbc-4c47-a30f-5353796bacf0';
try {
  if (fs.existsSync(artifactsDir)) {
    fs.writeFileSync(path.join(artifactsDir, 'GUIA_PEDAGOGICA_DIAGNOSTICO_9NO_MEP.pdf'), pdfBuffer);
    fs.writeFileSync(path.join(artifactsDir, 'Dossier_Diagnostico_MEP_9no_Aula_Inteligente.pdf'), pdfBuffer);
    console.log(`✅ PDF de 9no guardado con éxito en Artifacts: ${artifactsDir}`);
  }
} catch (e) {
  console.log(`⚠️ No se pudo escribir en artifacts dir: ${e.message}`);
}
