const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDossierPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de Colores Oficial MEP & Ecosistema Tecnológico
  const COLOR_PRIMARY = [0, 51, 102];      // Azul Institucional MEP #003366
  const COLOR_SECONDARY = [2, 132, 199];   // Sky / Cyan #0284c7
  const COLOR_ACCENT = [16, 185, 129];     // Emerald #10b981
  const COLOR_DARK = [15, 23, 42];         // Slate 900 #0f172a
  const COLOR_MUTED = [100, 116, 139];     // Slate 500 #64748b
  const COLOR_LIGHT_BG = [248, 250, 252];  // Slate 50 #f8fafc
  const COLOR_BORDER = [226, 232, 240];    // Slate 200 #e2e8f0

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Top Bar
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 6, 'F');
    doc.setFillColor(...COLOR_SECONDARY);
    doc.rect(0, 6, pageWidth, 1.5, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2027", margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Dossier Técnico y Curricular • Evaluación Diagnóstica Integrada", pageWidth - margin, 12, { align: 'right' });

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
    doc.text("Ecosistema de WebApps Autónomas con Telemetría en Tiempo Real y Rúbricas Oficiales MEP", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA EJECUTIVA E INSTITUCIONAL
  // =========================================================================
  
  // Background Header Wave / Block
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_SECONDARY);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Badge Superior
  doc.setFillColor(255, 255, 255, 0.15);
  doc.roundedRect(margin, 10, 100, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("DOCUMENTO TÉCNICO Y PEDAGÓGICO OFICIAL", margin + 4, 15);

  // Título Principal Portada
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("ECOSISTEMA DE EVALUACIÓN DIAGNÓSTICA", margin, 27);
  doc.setFontSize(15);
  doc.setTextColor(186, 230, 253); // Light Cyan
  doc.text("INTEGRADA Y FORMATIVA (7.°, 8.° Y 9.° AÑO)", margin, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(241, 245, 249);
  doc.text("Programa Nacional de Formación Tecnológica (PNFT) • Guía Curricular Oficial MEP 2027", margin, 43);
  doc.text("Simuladores 2D Interactivos • Matriz Tripartita de Saberes • Telemetría Centralizada e IA", margin, 49);

  // Tarjeta de Metadatos Ejecutivos
  let yPos = 68;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("METADATOS DEL ECOSISTEMA TECNOLÓGICO", margin + 6, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Autoría y Desarrollo: Asesoría Nacional de Formación Tecnológica MEP & Ecosistema Curiol", margin + 6, yPos + 13);
  doc.text("• Nivel y Cobertura: Educación Secundaria (Tercer Ciclo: 7.°, 8.° y 9.° Año de la Educación General Básica)", margin + 6, yPos + 18);
  doc.text("• Enfoque de Evaluación: 100% Cualitativo, Formativo, Diagnóstico e Inclusivo (Sin calificación sumativa)", margin + 6, yPos + 23);
  doc.text("• Despliegue en Producción: https://diagnosticosecundaria.vercel.app/diagnostico", margin + 6, yPos + 28);

  // Sección: 3 Pilares del Ecosistema
  yPos = 108;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. PILARES ESTRUCTURALES DEL DESARROLLO", margin, yPos);

  const colW = (contentWidth - 8) / 3;
  
  // Pilar 1: Estudiante
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, yPos + 4, colW, 44, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(3, 105, 161);
  doc.text("📱 WebApp Estudiante", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• 10 Ítems Conceptuales interactivos.", margin + 4, yPos + 17);
  doc.text("• Simulador 2D de hardware y circuitos.", margin + 4, yPos + 22);
  doc.text("• Reto de diagnóstico de fallas físicas.", margin + 4, yPos + 27);
  doc.text("• Reflexión metacognitiva final.", margin + 4, yPos + 32);
  doc.text("• Comprobante digital con token seguro.", margin + 4, yPos + 37);
  doc.text("• Modo Online y Modo Local Autónomo.", margin + 4, yPos + 42);

  // Pilar 2: Docente Evaluador
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + colW + 4, yPos + 4, colW, 44, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(21, 128, 61);
  doc.text("📋 Evaluador Docente", margin + colW + 8, yPos + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Matriz de observación en vivo tipo Excel.", margin + colW + 8, yPos + 17);
  doc.text("• Gestión de secciones (ej. 9-1 a 9-20).", margin + colW + 8, yPos + 22);
  doc.text("• Rúbrica de 3 áreas (A/B/C y L/ED/RA).", margin + colW + 8, yPos + 27);
  doc.text("• Sistematización Oficial (Pág. 15).", margin + colW + 8, yPos + 32);
  doc.text("• Exportación CSV / Excel oficial.", margin + colW + 8, yPos + 37);
  doc.text("• Generación de actas para planeamiento.", margin + colW + 8, yPos + 42);

  // Pilar 3: Telemetría e IA
  doc.setFillColor(250, 245, 255);
  doc.setDrawColor(233, 213, 255);
  doc.roundedRect(margin + (colW + 4) * 2, yPos + 4, colW, 44, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(126, 34, 206);
  doc.text("🧠 Telemetría e IA", margin + (colW + 4) * 2 + 4, yPos + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Sincronización en tiempo real (0 ms).", margin + (colW + 4) * 2 + 4, yPos + 17);
  doc.text("• Telemetría protegida antifraude.", margin + (colW + 4) * 2 + 4, yPos + 22);
  doc.text("• Motor de IA Multi-Proveedor en cascada.", margin + (colW + 4) * 2 + 4, yPos + 27);
  doc.text("• Análisis 360° formativo de sección.", margin + (colW + 4) * 2 + 4, yPos + 32);
  doc.text("• Sugerencias de mediación inmediata.", margin + (colW + 4) * 2 + 4, yPos + 37);
  doc.text("• Dashboard administrativo integrado.", margin + (colW + 4) * 2 + 4, yPos + 42);

  // Sección: Resumen de Niveles y Módulos
  yPos = 162;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. MATRIZ GENERAL DE NIVELES EDUCATIVOS INTEGRADOS", margin, yPos);

  autoTable(doc, {
    startY: yPos + 4,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLOR_DARK,
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 18, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 38, fontStyle: 'bold' },
      2: { cellWidth: 54 },
      3: { cellWidth: 38 },
      4: { cellWidth: 32, halign: 'center' }
    },
    head: [['Nivel', 'Nombre de la Misión', 'Saberes y Retos Principales', 'Simulador Integrado', 'Estado Plataforma']],
    body: [
      ['7.° Año', 'CyberQuest 7° (Misión Tecnológica)', 'Módulo Psicomotor (Lateralidad, Ritmo, Trazo), HW vs SW, Archivos y Bloques de Código.', 'Rejilla Espacial + Semáforo Ritmo + Scratch 2D', 'Integrado (Versión 4.0)'],
      ['8.° Año', 'Robótica & Automatización 8°', 'Sistemas de Control, Sensores Avanzados, Estructuras de Flujo y Procesamiento de Datos.', 'Simulador de Control y Lógica Modular', 'Estructurado para Módulo 1'],
      ['9.° Año', 'Aula Inteligente (Domótica)', 'Microcontroladores 328P, Iluminación LDR + LED, Climatización NTC + Fan DC, Depuración A3➔D9.', 'Circuito Electrónico 2D con Falla Inyectada', 'Completado y Desplegado']
    ]
  });

  drawHeaderFooter(1, 6, "Resumen Ejecutivo y Visión General");

  // =========================================================================
  // PÁGINA 2: FUNDAMENTACIÓN CURRICULAR Y ENFOQUE TRIPARTITO (MEP 2027)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. ALINEACIÓN CURRICULAR Y MODELO FORMATIVO TRIPARTITO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El ecosistema diagnostica el aprendizaje de manera integral, respetando la estructura curricular oficial del PNFT MEP 2027 (Páginas 48 a 55). No se limita a pruebas de selección única, sino que evalúa tres dimensiones complementarias:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 38;

  // Dimensión 1: Cognitiva
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin, yPos, contentWidth, 38, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(3, 105, 161);
  doc.text("🧠 ÁREA 1: SABERES CONCEPTUALES (ÁREA COGNITIVA)", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Definición: Conocimientos declarativos sobre sistemas computacionales, algoritmos, circuitos y ciencia de datos.", margin + 4, yPos + 12);
  doc.text("• Instrumento: 10 Reactivos Teóricos Situacionales y contextualizados en la WebApp.", margin + 4, yPos + 17);
  doc.text("• Escala Oficial MEP:", margin + 4, yPos + 22);
  doc.setFont('helvetica', 'bold');
  doc.text("   🟢 Logrado (L): Demuestra dominio conceptual consolidado (≥80% de acierto).", margin + 4, yPos + 27);
  doc.text("   🟡 En Desarrollo (ED): Comprensión intermedia en proceso de consolidación (60% - 79%).", margin + 4, yPos + 31);
  doc.text("   🔴 Requiere Acompañamiento (RA): Nivel inicial, demanda mediación pedagógica puntual (≤59%).", margin + 4, yPos + 35);

  yPos = 80;

  // Dimensión 2: Psicomotora / Procedimental
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin, yPos, contentWidth, 42, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(21, 128, 61);
  doc.text("🖐️ ÁREA 2: SABERES PROCEDIMENTALES (PRÁCTICAS DEL PENSADOR COMPUTACIONAL)", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Definición: Habilidades motrices y procedimentales aplicadas directamente en el simulador interactivo.", margin + 4, yPos + 12);
  doc.text("• Prácticas Evaluadas: Modulariza, Reconoce Patrones, Formula Algoritmos, Programa, Depura y Transfiere.", margin + 4, yPos + 17);
  doc.text("• Escala Formativa de Observación:", margin + 4, yPos + 22);
  doc.setFont('helvetica', 'bold');
  doc.text("   🟢 Nivel A (Alto / Autónomo / Consistente): Ejecuta el conexionado y la depuración sin apoyo.", margin + 4, yPos + 27);
  doc.text("   🟡 Nivel B (Medio / Con Apoyo Ocasional): Requiere pistas o recordatorios puntuales del docente.", margin + 4, yPos + 32);
  doc.text("   🔴 Nivel C (Inicial / Acompañamiento): Demanda modelado paso a paso para resolver la conexión.", margin + 4, yPos + 37);

  yPos = 126;

  // Dimensión 3: Socioafectiva / Actitudinal
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin, yPos, contentWidth, 42, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(180, 83, 9);
  doc.text("❤️ ÁREA 3: SABERES ACTITUDINALES (ACTITUDES DEL PENSADOR COMPUTACIONAL)", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Definición: Disposiciones emocionales, éticas y conductuales ante los desafíos tecnológicos y el trabajo.", margin + 4, yPos + 12);
  doc.text("• Actitudes Oficiales: Gusto por la Precisión, Aprender del Error, Flexibilidad ante Problemas y Tolerancia a Frustración.", margin + 4, yPos + 17);
  doc.text("• Fuentes de Información: Observación docente en vivo + Respuestas de autopercepción en la Parte C.", margin + 4, yPos + 22);
  doc.setFont('helvetica', 'bold');
  doc.text("   🟢 Nivel A (Alto): Actitud perseverante, reflexiva ante fallas, rigurosa y colaborativa.", margin + 4, yPos + 27);
  doc.text("   🟡 Nivel B (Medio): Adaptabilidad moderada, requiere motivación periódica ante dificultades.", margin + 4, yPos + 32);
  doc.text("   🔴 Nivel C (Inicial): Manifiesta frustración inmediata o abandono ante el error del circuito.", margin + 4, yPos + 37);

  // Tabla: Comparativa Enfoque Tradicional vs Ecosistema Integrado
  yPos = 174;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("4. COMPARATIVA: EVALUACIÓN TRADICIONAL VS ECOSISTEMA INTEGRADO", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLOR_DARK
    },
    head: [['Aspecto', 'Evaluación Tradicional en Papel / Cuestionario', 'Ecosistema Diagnóstico Integrado MEP']],
    body: [
      ['Naturaleza de la Prueba', 'Exclusivamente teórica y memorística.', 'Práctica, interactiva y de resolución de problemas reales.'],
      ['Evidencia de Desempeño', 'Respuestas marcadas con equis en papel.', 'Conexionado de circuitos en 2D y depuración guiada en vivo.'],
      ['Registro de Datos', 'Revisión manual que toma horas al docente.', 'Sincronización instantánea (0 ms) en matriz tipo Excel.'],
      ['Tratamiento del Error', 'Penalización con resta de puntos.', 'Oportunidad de aprendizaje para evaluar resiliencia.'],
      ['Sistematización Oficial', 'Llenado manual complejo de la pág. 15.', 'Generación automática con asistencia de Inteligencia Artificial.']
    ]
  });

  drawHeaderFooter(2, 6, "Fundamentación Curricular y Enfoque Tripartito");

  // =========================================================================
  // PÁGINA 3: NIVEL 9.° AÑO — SIMULACIÓN «AULA INTELIGENTE»
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("5. ESPECIFICACIÓN DETALLADA DE 9.° AÑO: «AULA INTELIGENTE»", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El diagnóstico de noveno año contextualiza la automatización domótica en dos retos prácticos de hardware con microcontrolador ATmega328P, sensores analógicos y actuadores digitales:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 35;

  // Reto 1 y Reto 2
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, (contentWidth - 4) / 2, 36, 2, 2, 'FD');
  doc.roundedRect(margin + (contentWidth - 4) / 2 + 4, yPos, (contentWidth - 4) / 2, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(3, 105, 161);
  doc.text("💡 RETO 1: ILUMINACIÓN INTELIGENTE", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Módulos: Sensor LDR + MCU 328P + Lámpara LED.", margin + 4, yPos + 12);
  doc.text("• Conexiones: VCC (5V), GND, A0 (Sensor), D9 (LED).", margin + 4, yPos + 17);
  doc.text("• Condición Lógica: SI (Luz < 300 Lux) ➔ LED ON.", margin + 4, yPos + 22);
  doc.text("• Instrumentos: Luxómetro interactivo y multímetro.", margin + 4, yPos + 27);
  doc.text("• Telemetría: Registro del umbral exacto de activación.", margin + 4, yPos + 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text("❄️ RETO 2: CLIMATIZACIÓN CON FALLA", margin + (contentWidth - 4) / 2 + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Módulos: Termistor NTC + MCU 328P + Ventilador DC.", margin + (contentWidth - 4) / 2 + 8, yPos + 12);
  doc.text("• Falla Inyectada: Señal del ventilador conectada a A3.", margin + (contentWidth - 4) / 2 + 8, yPos + 17);
  doc.text("• Paso 1: Diagnóstico técnico del pin erróneo en A3.", margin + (contentWidth - 4) / 2 + 8, yPos + 22);
  doc.text("• Paso 2: Corrección física desconectando y pasando a D9.", margin + (contentWidth - 4) / 2 + 8, yPos + 27);
  doc.text("• Paso 3: Justificación conceptual (Analógico vs Digital).", margin + (contentWidth - 4) / 2 + 8, yPos + 32);

  yPos = 76;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("RÚBRICA DE SABERES PROCEDIMENTALES Y ACTITUDINALES (9.° AÑO)", margin, yPos);

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
      1: { cellWidth: 30, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 70 }
    },
    head: [['Cód.', 'Saber / Práctica', 'Criterio Observable en Simulación', 'Escala Formativa Oficial MEP']],
    body: [
      ['P1', 'Modulariza', 'Resuelve la conexión por partes independientes: identifica y organiza espacialmente las 3 tarjetas de hardware (LDR, MCU, LED).', 'A: Autónomo / Consistente\nB: Con apoyo ocasional\nC: Requiere modelado paso a paso'],
      ['P2', 'Reconoce Patrones', 'Identifica regularidades de polaridad y correspondencia de terminales (VCC 5V, GND, Pin A0, Pin D9).', 'A: Sin errores de polaridad\nB: Corrige polaridad con guía\nC: Confunde alimentación con señal'],
      ['P3', 'Formula Algoritmos', 'Establece el flujo lógico secuencial del sistema (Entrada ➔ Proceso ➔ Salida) cerrando el circuito ordenadamente.', 'A: Secuencia lógica inmediata\nB: Ensayo y error guiado\nC: Desorden en el conexionado'],
      ['P4', 'Programa', 'Valida estructura condicional y asignación de pines: comprueba que al bajar luz (<300 Lux) se active la salida digital D9.', 'A: Verifica umbral y estados DMM\nB: Comprende tras aclaración\nC: No asocia umbral a la salida'],
      ['P5', 'Depura (Reto 2)', 'Detecta la falla inyectada (señal conectada a 5V/A3) y ejecuta la reconexión física del cable en el banco interactivo.', 'A: Detecta y reconecta con autonomía\nB: Reconecta con pista docente\nC: No logra corregir el cable'],
      ['P6', 'Transfiere (Reto 2)', 'Transfiere el concepto a justificación escrita: explica por qué A0 lee voltajes variables mientras 5V es fijo.', 'A: Justificación técnica precisa\nB: Justificación empírica parcial\nC: No fundamenta la corrección'],
      ['S1', 'Gusto por la Precisión', 'Demuestra esmero y minuciosidad al verificar cables, valores del multímetro (1.05V, 45W) y monitor serial.', 'A: Alto rigor y minuciosidad\nB: Precisión moderada\nC: Precipitación / descuido'],
      ['S2', 'Aprender del Error', 'Convierte desaciertos en oportunidades: analiza con calma por qué la lámpara no encendía en lugar de probar al azar.', 'A: Análisis reflexivo ante el fallo\nB: Corrige tras orientación\nC: Frustración ante el error'],
      ['S3', 'Flexibilidad', 'Demuestra adaptabilidad para replantear hipótesis cuando la propuesta con falla no responde como esperaba.', 'A: Adaptable y proactivo/a\nB: Flexible con acompañamiento\nC: Rigidez ante el problema'],
      ['S4', 'Tolerancia / Confort', 'Autocontrol, paciencia y persistencia. Vinculado al selector emocional de autopercepción en Parte C.', 'A: Alta perseverancia y confort\nB: Persistencia media\nC: Requiere soporte emocional']
    ]
  });

  drawHeaderFooter(3, 6, "Especificación Curricular de 9.° Año");

  // =========================================================================
  // PÁGINA 4: NIVEL 7.° AÑO — «CYBERQUEST 7°»
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("6. ESPECIFICACIÓN DETALLADA DE 7.° AÑO: «CYBERQUEST 7°»", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Diseñado para la transición a secundaria, CyberQuest 7° combina el desarrollo psicomotor y perceptivo-motriz con el pensamiento computacional inicial, mediante retos gamificados en parejas o individual:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 35;

  autoTable(doc, {
    startY: yPos,
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
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 70 },
      2: { cellWidth: 46 },
      3: { cellWidth: 32 }
    },
    head: [['Módulo del Reto', 'Descripción de la Actividad Interactiva', 'Saber / Habilidad Evaluada', 'Métrica de Telemetría']],
    body: [
      ['Módulo 0:\nPsicomotor y Perceptivo-Motriz', '• Rejilla Espacial 4x4: Guiar bot con comandos.\n• Semáforo de Ritmo: Pulsar en verde / Frenar en rojo.\n• Canal de Trazo Fino: Dibujar sin tocar paredes.', '• Lateralidad y Esquema Espacial.\n• Ritmo y Control de Inhibición.\n• Coordinación Viso-Manual Fina.', 'Puntaje de precisión (%) y aciertos rítmicos (0-5).'],
      ['Módulo 1:\nSistemas y Abstracción', '• Clasificación interactiva en cajas de Hardware vs Software.\n• Preguntas sobre función del SO y ventajas de redes.', '• Abstracción de Sistemas.\n• Diferenciación Físico vs Lógico.\n• Redes de Comunicación.', 'Aciertos en clasificación (8 ítems) + 2 preguntas SO.'],
      ['Módulo 2:\nArchivos y Multimedia', '• Clasificación de extensiones (.png, .mp3, .pdf, .jpg).\n• Selección de editor gráfico (Paint vs otros).\n• Lienzo de dibujo libre para diseño gráfico.', '• Organización del Sistema de Archivos.\n• Multimedia y Diseño Digital.\n• Motricidad Viso-Motriz.', 'Ubicación en carpetas + selección de software gráfico.'],
      ['Módulo 3:\nAlgoritmos y Depuración', '• Simulador paso a paso de código en bloques.\n• Seguimiento de variable "puntos" y bucle (3 ciclos).\n• Evaluación de condición SI (puntos > 10).', '• Formulación de Algoritmos.\n• Ciclos y Variables.\n• Estructuras Condicionales.', 'Respuestas de análisis algorítmico y ejecución.'],
      ['Módulo 4:\nLógica y Operadores', '• Selección de operadores aritméticos (+, -, *, /).\n• Selección de operadores relacionales (=, >, <).\n• Depuración de expresiones lógicas en el código.', '• Gusto por la Precisión.\n• Pensamiento Lógico Formal.\n• Depuración de Expresiones.', 'Aciertos en los 4 desafíos de operadores.'],
      ['Módulo 5:\nReflexión Metacognitiva', '• Autoevaluación escrita sobre aprender del error.\n• Distribución de roles en pareja.\n• Identificación del reto de mayor exigencia.', '• Tolerancia a la Frustración.\n• Colaboración y Comunicación.\n• Metacognición del Aprendizaje.', 'Texto cualitativo de autopercepción formativa.']
    ]
  });

  yPos = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("MAPEO AL INSTRUMENTO EVALUADOR DOCENTE (7.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Al igual que en 9.° año, las interacciones de CyberQuest 7° se traducen automáticamente en la matriz docente:\n" +
    "• Dimensión Psicomotora: P1. Lateralidad Espacial | P2. Ritmo e Inhibición | P3. Coordinación Viso-Manual | P4. Trazo Gráfico.\n" +
    "• Dimensión Cognitiva: Ind 1 a Ind 10 (Hardware, Software, Redes, SO, Archivos, Gráficos, Bloques, Bucles, Condicionales, Operadores).\n" +
    "• Dimensión Socioafectiva: S1. Precisión | S2. Aprender del Error | S3. Colaboración | S4. Tolerancia a la Frustración.",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  drawHeaderFooter(4, 6, "Especificación Curricular de 7.° Año (CyberQuest)");

  // =========================================================================
  // PÁGINA 5: EL INSTRUMENTO EVALUADOR DOCENTE Y SISTEMATIZACIÓN
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("7. EL INSTRUMENTO DOCENTE EVALUADOR Y SISTEMATIZACIÓN OFICIAL", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente evaluador (diagnostico_9no_modulo01_docente_evaluador.html y homólogo de 7.°) sustituye las hojas de cálculo tradicionales por una plataforma web reactiva con sincronización en tiempo real:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 36;

  // 4 Vistas del Evaluador Docente
  const vW = (contentWidth - 4) / 2;
  const vH = 34;

  // Vista 1
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("VISTA 1: NÓMINA Y REGISTRO", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Carga de nómina vía Excel, CSV o texto pegado.", margin + 4, yPos + 12);
  doc.text("• Registro automático en vivo cuando el alumno inicia.", margin + 4, yPos + 17);
  doc.text("• Filtro dinámico por secciones (ej. 9-1 a 9-20).", margin + 4, yPos + 22);
  doc.text("• Estado de entrega: Evaluado vs Pendiente.", margin + 4, yPos + 27);

  // Vista 2
  doc.roundedRect(margin + vW + 4, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("VISTA 2: MATRIZ DE OBSERVACIÓN", margin + vW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Matriz horizontal interactiva tipo hoja de cálculo.", margin + vW + 8, yPos + 12);
  doc.text("• Pestañas por área: Psicomotora, Socioafectiva, Cognitiva.", margin + vW + 8, yPos + 17);
  doc.text("• Marcación en 1 clic de niveles formativos (A/B/C).", margin + vW + 8, yPos + 22);
  doc.text("• Asistente de IA para análisis global de sección.", margin + vW + 8, yPos + 27);

  // Vista 3
  yPos = 74;
  doc.roundedRect(margin, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("VISTA 3: SISTEMATIZACIÓN (PÁG. 15)", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Formato oficial idéntico al documento base MEP.", margin + 4, yPos + 12);
  doc.text("• Consolidado automático de los 10 saberes conceptuales.", margin + 4, yPos + 17);
  doc.text("• Cuadro de descripción de desempeño individual.", margin + 4, yPos + 22);
  doc.text("• Generación de acompañamiento pedagógico con IA.", margin + 4, yPos + 27);

  // Vista 4
  doc.roundedRect(margin + vW + 4, yPos, vW, vH, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("VISTA 4: DECISIONES PEDAGÓGICAS", margin + vW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Alertas automáticas de áreas débiles del grupo.", margin + vW + 8, yPos + 12);
  doc.text("• Detección de necesidades en circuitos o algoritmos.", margin + vW + 8, yPos + 17);
  doc.text("• Estrategias de mediación sugeridas para el planeamiento.", margin + vW + 8, yPos + 22);
  doc.text("• Exportación a Excel/CSV e impresión de actas.", margin + vW + 8, yPos + 27);

  yPos = 114;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("8. FUNCIONES AVANZADAS DE AUTOMATIZACIÓN PARA EL DOCENTE", margin, yPos);

  autoTable(doc, {
    startY: yPos + 3,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: COLOR_DARK
    },
    head: [['Función Técnica', 'Impacto en la Labor Docente', 'Cumplimiento Normativo MEP']],
    body: [
      ['Sincronización Bidireccional', 'Los resultados de los estudiantes aparecen en la pantalla del docente en tiempo real sin requerir recargar la página.', 'Registro oportuno y transparente de evidencias de aula.'],
      ['Lector QR Offline Integrado', 'En colegios sin internet, el docente escanea con la cámara del celular el código QR de la pantalla del alumno para transferir datos en 0 segundos.', 'Garantiza equidad e inclusión para zonas rurales o con baja conectividad.'],
      ['Asistente IA Pedagógico', 'Redacta síntesis diagnósticas de sección y recomendaciones pedagógicas personalizadas por estudiante.', 'Facilita la elaboración del Planeamiento Didáctico Trimestral.'],
      ['Exportación de Expediente', 'Genera archivos CSV compatibles con Excel oficial MEP e informes imprimibles en PDF con membrete institucional.', 'Respaldo administrativo conforme a directrices de supervisión.']
    ]
  });

  drawHeaderFooter(5, 6, "Instrumento Docente y Sistematización");

  // =========================================================================
  // PÁGINA 6: ARQUITECTURA TECNOLÓGICA, RESILIENCIA Y DESPLIEGUE
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("9. ARQUITECTURA TECNOLÓGICA Y PROTOCOLO DE RESILIENCIA", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "La infraestructura está construida con tecnologías web de última generación (Next.js 15, TypeScript, Tailwind CSS, Web Audio API y APIs de Inteligencia Artificial con arquitectura de resiliencia en 4 capas):",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 36;

  // Diagrama de Cascada de IA
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, yPos, contentWidth, 38, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(21, 128, 61);
  doc.text("🛡️ ARQUITECTURA DE IA MULTI-PROVEEDOR CON RESILIENCIA EN CASCADA (FAILOVER)", margin + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("1. Caché SHA-256 en Memoria: Respuestas en 0ms y ahorro total de tokens ante consultas idénticas.", margin + 4, yPos + 12);
  doc.text("2. Nivel 1 (Principal): Google Gemini (gemini-2.5-flash) para análisis pedagógico rápido y estructurado.", margin + 4, yPos + 17);
  doc.text("3. Nivel 2 (Ultra-Baja Latencia): Groq LPU (llama-3.3-70b-versatile, llama-3.1-8b-instant).", margin + 4, yPos + 22);
  doc.text("4. Nivel 3 (Multi-Proveedor): OpenRouter con Qwen 2.5 (qwen/qwen-2.5-72b-instruct) y DeepSeek Chat.", margin + 4, yPos + 27);
  doc.text("5. Auditoría Diaria (5:00 AM): Endpoint cron (/api/cron/verificador-modelos-ia) con reporte al correo oficial MEP.", margin + 4, yPos + 32);

  yPos = 80;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("10. GUÍA DE ACCESO Y ENLACES OFICIALES EN PRODUCCIÓN", margin, yPos);

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
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold' },
      1: { cellWidth: 85 },
      2: { cellWidth: 50, halign: 'center' }
    },
    head: [['Recurso o Vista', 'Enlace Web Oficial en Producción', 'Modo de Operación']],
    body: [
      ['Portal Diagnóstico Multi-Nivel', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En Línea (Acceso Universal)'],
      ['WebApp Estudiante 9.° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_en_linea.html', 'En Línea / Local Autónomo'],
      ['Evaluador Docente 9.° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_9no_modulo01_docente_evaluador.html', 'En Línea / Escáner QR'],
      ['WebApp Estudiante 7.° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_cyberquest.html', 'En Línea (CyberQuest 7°)'],
      ['Evaluador Docente 7.° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_docente_evaluador.html', 'En Línea / Escáner QR'],
      ['Dashboard de Telemetría Central', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo Institucional'],
      ['API de Telemetría Central', 'https://diagnosticosecundaria.vercel.app/api/telemetria/enviar', 'Endpoint RESTful JSON']
    ]
  });

  yPos = doc.lastAutoTable.finalY + 8;

  // Recuadro de Cierre / Firma Asesoría
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_PRIMARY);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("DIRECCIÓN DE RECURSOS TECNOLÓGICOS EN EDUCACIÓN (DRTE) • MEP COSTA RICA", margin + 4, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("Este documento técnico y pedagógico certifica la integración y alineación curricular del ecosistema diagnóstico", margin + 4, yPos + 11);
  doc.text("para la Formación Tecnológica en Tercer Ciclo. Diseñado para optimizar la toma de decisiones pedagógicas docentes.", margin + 4, yPos + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLOR_SECONDARY);
  doc.text("Asesoría Nacional de Formación Tecnológica • Ciclo Lectivo 2027", margin + 4, yPos + 22);

  drawHeaderFooter(6, 6, "Arquitectura Tecnológica y Despliegue");

  return doc;
}

// 1. Guardar en public/documentos/
const outputDirWeb = path.join(__dirname, '..', 'public', 'documentos');
if (!fs.existsSync(outputDirWeb)) {
  fs.mkdirSync(outputDirWeb, { recursive: true });
}
const outputPathWeb = path.join(outputDirWeb, 'Dossier_Evaluacion_Diagnostica_MEP_7mo_8vo_9no.pdf');

// 2. Guardar en artifacts directory
const artifactsDir = 'C:\\Users\\curio\\.gemini\\antigravity\\brain\\d99aa2c3-313b-4597-b0ff-83b2bf23c7e4';
const outputPathArtifact = path.join(artifactsDir, 'Dossier_Evaluacion_Diagnostica_MEP_7mo_8vo_9no.pdf');

const doc = generarDossierPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathWeb, pdfBuffer);
console.log(`✅ PDF guardado con éxito en Web: ${outputPathWeb}`);

try {
  fs.writeFileSync(outputPathArtifact, pdfBuffer);
  console.log(`✅ PDF guardado con éxito en Artifacts: ${outputPathArtifact}`);
} catch (e) {
  console.log(`⚠️ No se pudo escribir en artifacts dir: ${e.message}`);
}
