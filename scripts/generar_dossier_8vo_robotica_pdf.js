const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDossier8voPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de Colores Oficial MEP & 8vo Robótica
  const COLOR_PRIMARY = [15, 23, 42];     // Slate 900 #0f172a
  const COLOR_TEAL = [13, 148, 136];      // Teal 600 #0d9488
  const COLOR_TEAL_DARK = [15, 118, 110]; // Teal 700 #0f766e
  const COLOR_CYAN = [6, 182, 212];       // Cyan #06b6d4
  const COLOR_INDIGO = [99, 102, 241];    // Indigo #6366f1
  const COLOR_EMERALD = [16, 185, 129];   // Emerald #10b981
  const COLOR_AMBER = [245, 158, 11];     // Amber #f59e0b
  const COLOR_ROSE = [244, 63, 94];       // Rose #f43f5e
  const COLOR_DARK = [15, 23, 42];        // Slate 900 #0f172a
  const COLOR_MUTED = [100, 116, 139];    // Slate 500 #64748b
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50 #f8fafc
  const COLOR_BORDER = [226, 232, 240];   // Slate 200 #e2e8f0

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Top Bar
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 6, 'F');
    doc.setFillColor(...COLOR_TEAL);
    doc.rect(0, 6, pageWidth, 1.5, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 51, 102); // MEP Blue
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2027", margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Guía Pedagógica y Dossier Técnico • 8° Año Robótica", pageWidth - margin, 12, { align: 'right' });

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
    doc.text("Evaluación Diagnóstica 8.° Año: Hardware, Algoritmos y Robótica (Triada Psicomotriz, Cognitiva, Socioafectiva)", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA Y FUNDAMENTACIÓN PEDAGÓGICA DE 8.° AÑO
  // =========================================================================
  
  // Header Banner
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_TEAL);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Badge Superior
  doc.setFillColor(13, 148, 136, 0.25);
  doc.roundedRect(margin, 10, 115, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(45, 212, 191); // Teal 400
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • MEP 2027", margin + 4, 15);

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("DIAGNÓSTICO 8.° AÑO: ROBÓTICA Y ALGORITMOS", margin, 27);
  doc.setFontSize(14);
  doc.setTextColor(94, 234, 212); // Teal light
  doc.text("GUÍA PEDAGÓGICA Y DOSSIER TÉCNICO OFICIAL", margin, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluación Formativa Articulada: 14 Indicadores de Logro, 3 Subáreas Curriculares y Observación Docente", margin, 43);
  doc.text("Operatividad Dual: En Línea con Telemetría Reactiva o 100% Desconectado con Códigos QR Cifrados", margin, 49);

  // Tarjeta de Metadatos
  let yPos = 68;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("FICHA TÉCNICA DEL RECURSO DIAGNÓSTICO (8.° AÑO)", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Población Meta: Estudiantes de 8.° Año (Octavo de Secundaria / Tercer Ciclo EGB).", margin + 6, yPos + 12);
  doc.text("• Estructura Curricular: 3 Subáreas (HW/SW, Algoritmos, Robótica) + Dimensión Socioafectiva y Psicomotora.", margin + 6, yPos + 17);
  doc.text("• Enfoque de Evaluación: Formativo, Diagnóstico y Cualitativo (Identificación de brechas de entrada sin nota punitiva).", margin + 6, yPos + 22);
  doc.text("• Acceso Web en Producción: https://diagnosticosecundaria.vercel.app/diagnostico (Pestaña 8.° Año).", margin + 6, yPos + 27);

  // Fundamentación Pedagógica
  yPos = 106;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 51, 102);
  doc.text("1. FUNDAMENTACIÓN PEDAGÓGICA Y CURRICULAR DE 8.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El nivel de 8.° Año consolida el pensamiento algorítmico y avanza hacia la computación física y robótica educativa. La prueba diagnóstica articula los aprendizajes del año previo para diagnosticar tres subáreas curriculares clave mediante situaciones contextualizadas y retos prácticos:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 124;
  const colW = (contentWidth - 6) / 3;

  // Subárea 1: Apropiación y HW/SW
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(margin, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 118, 110);
  doc.text("🖥️ Subárea 1: Apropiación HW/SW", margin + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Periféricos de entrada/salida (Ítem 1).", margin + 4, yPos + 13);
  doc.text("• Clasificación de software (Ítem 2).", margin + 4, yPos + 20);
  doc.text("• Redes, Módem y Router (Ítem 3).", margin + 4, yPos + 27);
  doc.text("• Almacenamiento y SO (Ítems 4 y 5).", margin + 4, yPos + 34);

  // Subárea 2: Algoritmos
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + colW + 3, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202);
  doc.text("🧠 Subárea 2: Algoritmos y Lógica", margin + colW + 7, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Estructura E-P-S aplicada (Ítem 6).", margin + colW + 7, yPos + 13);
  doc.text("• Variables y Booleano (Ítems 7 y 8).", margin + colW + 7, yPos + 20);
  doc.text("• Condicionales y Bucles (Ítems 9 y 10).", margin + colW + 7, yPos + 27);
  doc.text("• Operadores y Sintaxis (Ítems 11 y 12).", margin + colW + 7, yPos + 34);

  // Subárea 3: Robótica y Socioafectiva
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin + (colW + 3) * 2, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text("🤖 Subárea 3: Robótica y DUA", margin + (colW + 3) * 2 + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Sensores, Actuadores y MCU (Ítem 13).", margin + (colW + 3) * 2 + 4, yPos + 13);
  doc.text("• Seguridad y prevención (Ítem 14).", margin + (colW + 3) * 2 + 4, yPos + 20);
  doc.text("• Mini-reto socioafectivo y metacognición.", margin + (colW + 3) * 2 + 4, yPos + 27);
  doc.text("• Lista de cotejo psicomotora docente.", margin + (colW + 3) * 2 + 4, yPos + 34);

  // Principios DUA y Accesibilidad
  yPos = 178;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("2. PRINCIPIOS DE ACCESIBILIDAD Y DISEÑO UNIVERSAL PARA EL APRENDIZAJE (DUA)", margin, yPos);

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
      1: { cellWidth: 76 },
      2: { cellWidth: 70 }
    },
    head: [['Principio DUA', 'Mecanismo en el Instrumento de 8°', 'Impacto Inclusivo']],
    body: [
      ['Múltiples Formas de Representación', 'Barra de accesibilidad con Alto Contraste, aumento de fuente (A+ / A-) y lectura facilitada.', 'Garantiza acceso pleno a estudiantes con baja visión o diversidad sensorial.'],
      ['Múltiples Formas de Acción y Expresión', 'Navegación intuitiva por teclado/mouse, confirmación de respuestas y simulador interactivo.', 'Flexibilidad de interacción para estudiantes con diversas preferencias psicomotrices.'],
      ['Múltiples Formas de Implicación', 'Retroalimentación formativa inmediata, barras de progreso y comprobante digital final.', 'Fomenta la motivación intrínseca y reduce la ansiedad ante la evaluación diagnóstica.'],
      ['Resiliencia Offline-First', 'Archivo autónomo ejecutable sin conexión a internet y transmisión de datos vía QR cifrado.', 'Equidad absoluta para colegios y liceos rurales sin acceso estable a la red.']
    ]
  });

  drawHeaderFooter(1, 5, "Fundamentación Curricular y DUA de 8.° Año");

  // =========================================================================
  // PÁGINA 2: LOS 14 INDICADORES COGNITIVOS DE 8.° AÑO
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("3. MATRIZ DE LOS 14 INDICADORES DE LOGRO COGNITIVOS (8.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Distribución detallada de los reactivos y saberes evaluados en la prueba diagnóstica de 8.° Año según el programa oficial MEP:",
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
      0: { cellWidth: 12, fontStyle: 'bold', halign: 'center' },
      1: { cellWidth: 26, fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 62 },
      4: { cellWidth: 36 }
    },
    head: [['Ítem', 'Subárea', 'Saber Evaluado', 'Descripción del Reactivo Contextualizado', 'Criterio de Desempeño']],
    body: [
      ['Ítem 1', 'HW / SW', 'Periféricos E/S', 'Asociación de teclado, mouse, monitor, parlantes, cámara web y memoria USB.', 'Logrado: 6/6 correctos.\nEn Proceso: 4-5 correctos.'],
      ['Ítem 2', 'HW / SW', 'Clasificación Software', 'Distinción entre Software de Sistema, Aplicación, Programación y Diseño.', 'Logrado: Identifica las 4 categorías.'],
      ['Ítem 3', 'HW / SW', 'Redes y Conectividad', 'Función de Módem vs Router en la transmisión y direccionamiento de paquetes.', 'Logrado: Diferencia modulación de enrutamiento.'],
      ['Ítem 4', 'HW / SW', 'Gestión del S.O.', 'Recuperación de archivos eliminados desde la Papelera y rutas de carpetas.', 'Logrado: Conoce proceso de restauración.'],
      ['Ítem 5', 'HW / SW', 'Almacenamiento', 'Jerarquía de unidades: Byte, KB, MB, GB, TB y cálculo de capacidad.', 'Logrado: Ordena y calcula unidades.'],
      ['Ítem 6', 'Algoritmos', 'Estructura E-P-S', 'Identificación de Entrada, Proceso y Salida en situaciones del entorno real.', 'Logrado: Desglosa fases del algoritmo.'],
      ['Ítem 7', 'Algoritmos', 'Tipos de Datos', 'Uso de datos Primitivos: Entero, Texto, Decimal y Booleano (Verdadero/Falso).', 'Logrado: Discrimina tipos de variables.'],
      ['Ítem 8', 'Algoritmos', 'Actualización Variables', 'Evaluación de acumuladores y contadores (ej. puntos = puntos + 10).', 'Logrado: Rastrea el valor de memoria.'],
      ['Ítem 9', 'Algoritmos', 'Condicionales Si/Sino', 'Toma de decisiones lógicas basadas en lecturas de sensores (Temperatura > 30).', 'Logrado: Evalúa ramas condicionales.'],
      ['Ítem 10', 'Algoritmos', 'Bucles y Ciclos', 'Estructuras repetitivas (Para / Mientras) para evitar redundancia de código.', 'Logrado: Optimiza algoritmos con ciclos.'],
      ['Ítem 11', 'Algoritmos', 'Operadores Aritméticos', 'Cálculo algorítmico de precios con porcentaje de descuento aplicado.', 'Logrado: Aplica precedencia matemática.'],
      ['Ítem 12', 'Algoritmos', 'Operadores Relacionales', 'Comparaciones lógicas utilizando operadores =, <>, <, >, <=, >=.', 'Logrado: Resuelve tablas de verdad.'],
      ['Ítem 13', 'Robótica', 'Sensores y Actuadores', 'Componentes de un sistema robótico: Sensores (Entrada), MCU y Actuadores (Salida).', 'Logrado: Clasifica flujo de señales.'],
      ['Ítem 14', 'Robótica', 'Seguridad y Protocolos', 'Prevención de cortocircuitos, polaridad de conexiones y orden en el taller.', 'Logrado: Aplica normas de seguridad.']
    ]
  });

  drawHeaderFooter(2, 5, "14 Indicadores Cognitivos de 8.° Año");

  // =========================================================================
  // PÁGINA 3: RÚBRICAS PSICOMOTRICES Y SOCIOAFECTIVAS (8.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("4. RÚBRICAS OFICIALES DOCENTES: DIMENSIÓN PSICOMOTRIZ Y SOCIOAFECTIVA", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El docente evalúa mediante observación directa en el aula/laboratorio las siguientes conductas de la triada formativa:",
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
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 70 },
      3: { cellWidth: 68 }
    },
    head: [['Cód.', 'Criterio Observado', 'Conducta Observable en 8.° Año', 'Escala Formativa Oficial MEP']],
    body: [
      // Psicomotora
      ['P1', 'Manipulación de Periféricos', 'Demuestra destreza, fluidez y precisión ergonómica al utilizar el teclado, mouse y puertos USB.', 'Nivel A: Destreza motriz fluida y precisa\nNivel B: Manejo básico con pausas\nNivel C: Dificultad en coordinación viso-motriz'],
      ['P2', 'Conexionado de Dispositivos', 'Ensambla o identifica correctamente las terminales y cables de conexión sin forzar los conectores.', 'Nivel A: Precisión total y respeto a polaridades\nNivel B: Requiere verificación previa\nNivel C: Inserción incorrecta o riesgo de daño'],
      ['P3', 'Secuenciación de Tareas', 'Sigue el orden procedimental de encendido, ejecución de software y guardado seguro de proyectos.', 'Nivel A: Autonomía procedimental completa\nNivel B: Requiere recordatorios ocasionales\nNivel C: Omite pasos críticos del procedimiento'],
      // Socioafectiva
      ['S1', 'Gusto por la Precisión', 'Revisa minuciosamente la sintaxis de sus algoritmos y variables antes de dar por concluida la tarea.', 'Nivel A: Rigor y autoexigencia positiva\nNivel B: Precisión aceptable tras guía\nNivel C: Descuido en la verificación lógica'],
      ['S2', 'Aprender del Error', 'Asume los errores de compilación o lógica como oportunidades de indagación y aprendizaje sin desánimo.', 'Nivel A: Resiliencia y actitud investigativa\nNivel B: Corrige con apoyo emocional docente\nNivel C: Muestra frustración o abandono'],
      ['S3', 'Trabajo Colaborativo', 'Comparte ideas, escucha con empatía a sus pares y colabora activamente en la resolución de problemas.', 'Nivel A: Liderazgo positivo y cooperación\nNivel B: Participación pasiva con acompañamiento\nNivel C: Aislamiento o conflicto en el grupo'],
      ['S4', 'Uso Ético y Responsable', 'Demuestra respeto por las normas del laboratorio, el cuidado del equipo tecnológico y la autoría de recursos.', 'Nivel A: Conducta ciudadana digital ejemplar\nNivel B: Cumplimiento básico de normas\nNivel C: Incumplimiento de pautas del taller']
    ]
  });

  // Triada Evaluativa
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 51, 102);
  doc.text("CONSOLIDACIÓN DE LA TRIADA FORMATIVA EN EL APLICATIVO DOCENTE (8.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "La herramienta docente integra automáticamente: 1) Puntaje de los 14 reactivos cognitivos (0 a 100%) • 2) Observación Psicomotriz (Escala A-B-C) • " +
    "3) Observación Socioafectiva (Escala A-B-C). Generando una síntesis individual y grupal con sugerencias pedagógicas para el planeamiento didáctico.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(3, 5, "Rúbricas Psicomotrices y Socioafectivas de 8.° Año");

  // =========================================================================
  // PÁGINA 4: EL INSTRUMENTO DOCENTE EVALUADOR Y TELEMETRÍA (8.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("5. EL INSTRUMENTO DOCENTE EVALUADOR DE 8.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente para 8.° Año gestiona de forma centralizada todas las secciones (8-1 a 8-20) con sincronización automática y herramientas analíticas:",
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
  doc.text("📊 MATRIZ REACTIVA POR SECCIONES", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Gestión de nóminas para todas las secciones de 8°.", margin + 4, yPos + 12);
  doc.text("• Registro de estudiantes por nombre y cédula.", margin + 4, yPos + 17);
  doc.text("• Visualización de progreso y semáforos de logro.", margin + 4, yPos + 22);
  doc.text("• Asignación rápida de niveles formativos (A / B / C).", margin + 4, yPos + 27);
  doc.text("• Sincronización instantánea con el Dashboard central.", margin + 4, yPos + 32);

  // Card 2
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📑 SISTEMATIZACIÓN Y ACTAS OFICIALES", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Consolidado tripartito: Cognitivo, Motriz y Actitudinal.", margin + cardW + 8, yPos + 12);
  doc.text("• Desglose por subárea (HW/SW, Algoritmos, Robótica).", margin + cardW + 8, yPos + 17);
  doc.text("• Conteo porcentual de estudiantes en L / ED / RA.", margin + cardW + 8, yPos + 22);
  doc.text("• Exportación a Excel y PDF con formato institucional MEP.", margin + cardW + 8, yPos + 27);
  doc.text("• Respaldo local seguro y descarga de informes.", margin + cardW + 8, yPos + 32);

  // Card 3
  yPos = 76;
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📱 ESCÁNER QR Y MODO OFFLINE", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• En laboratorios sin internet, el alumno genera su QR.", margin + 4, yPos + 12);
  doc.text("• El docente escanea el código con su teléfono o tablet.", margin + 4, yPos + 17);
  doc.text("• Carga instantánea de puntajes sin digitar manualmente.", margin + 4, yPos + 22);
  doc.text("• Cero pérdida de datos y total equidad territorial.", margin + 4, yPos + 27);
  doc.text("• Token criptográfico SHA-256 antifraude.", margin + 4, yPos + 32);

  // Card 4
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("✨ ASISTENCIA PEDAGÓGICA Y TELEMETRÍA", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Identificación de reactivos con mayor índice de error.", margin + cardW + 8, yPos + 12);
  doc.text("• Recomendaciones metodológicas para el trimestre.", margin + cardW + 8, yPos + 17);
  doc.text("• Telemetría protegida por aislamiento de cuenta docente.", margin + cardW + 8, yPos + 22);
  doc.text("• Integración con el ecosistema de IA multi-proveedor.", margin + cardW + 8, yPos + 27);
  doc.text("• Auditoría continua de salud de los servicios.", margin + cardW + 8, yPos + 32);

  // Flujo Operativo
  yPos = 118;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("6. PROTOCOLO OPERATIVO: EN LÍNEA VS. DESCONECTADO (QR)", margin, yPos);

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
    head: [['Paso', 'Modalidad En Línea (Con Internet)', 'Modalidad Desconectada (Sin Internet / QR)']],
    body: [
      ['1. Acceso', 'Docente proyecta QR/enlace a WebApp En Línea.', 'Se distribuye el archivo autónomo .html vía red local / USB.'],
      ['2. Registro', 'Estudiante ingresa sus datos y selecciona sección.', 'Estudiante trabaja de forma 100% local en su PC del laboratorio.'],
      ['3. Ejecución', 'Responde 14 ítems y reflexiona sobre el proceso.', 'Responde los 14 ítems con validación inmediata en su pantalla.'],
      ['4. Traspaso', 'Resultados viajan en tiempo real a la base de datos.', 'La WebApp genera un QR Cifrado en pantalla con sus resultados.'],
      ['5. Consolidación', 'Aparece automáticamente en el Dashboard Docente.', 'Docente escanea el QR con su cámara y se llena la nómina al instante.']
    ]
  });

  drawHeaderFooter(4, 5, "Instrumento Docente y Telemetría de 8.° Año");

  // =========================================================================
  // PÁGINA 5: PROTOCOLO DE APLICACIÓN EN AULA Y ENLACES OFICIALES
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("7. PROTOCOLO DE APLICACIÓN EN EL AULA / TALLER DE 8.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Ruta pedagógica sugerida para la aplicación formativa durante las primeras semanas del curso lectivo:",
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
        'Fase 1: Preparación\n(5 a 10 min)',
        '• Abrir el Módulo Evaluador Docente de 8° Año en su equipo.\n• Proyectar el enlace o distribuir el archivo offline a los alumnos.',
        '• Ingresar a la WebApp desde sus computadoras.\n• Verificar nombre completo, cédula y sección correspondiente (ej. 8-1).'
      ],
      [
        'Fase 2: Ejecución\n(25 a 35 min)',
        '• Observar el desenvolvimiento psicomotor y socioafectivo en el taller.\n• Registrar conductas observables (coordinación, perseverancia).',
        '• Responder los 14 ítems cognitivos de las 3 subáreas.\n• Analizar con detenimiento las opciones y comprobar la lógica.'
      ],
      [
        'Fase 3: Cierre y Traspaso\n(10 min)',
        '• En modo online: verificar la llegada de telemetría.\n• En modo offline: escanear el QR generado en cada PC.',
        '• Visualizar su puntaje de desempeño y retroalimentación.\n• Generar y presentar su código QR o comprobante digital.'
      ],
      [
        'Fase 4: Sistematización\n(Posterior a la clase)',
        '• Revisar la pestaña de Sistematización Oficial de 8° Año.\n• Exportar las actas consolidadas en Excel y PDF para el expediente.',
        '• Conservar copia de su comprobante o portafolio estudiantil según indicación docente.'
      ]
    ]
  });

  yPos = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("8. ENLACES OFICIALES Y ACCESOS EN PRODUCCIÓN (8.° AÑO)", margin, yPos);

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
    head: [['Recurso de 8.° Año', 'URL Oficial en Producción', 'Modo de Acceso']],
    body: [
      ['Portal Multi-Nivel MEP', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En Línea (Pestaña 8°)'],
      ['WebApp Estudiante 8° (En Línea)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_en_linea.html', 'En Línea / Telemetría'],
      ['WebApp Estudiante 8° (Offline)', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_desconectado_offline.html', 'Desconectado / Local (QR)'],
      ['Evaluador Docente 8° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_8vo_modulo01_docente_evaluador.html', 'En Línea / Escáner QR'],
      ['Dashboard de Telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo Global'],
      ['Guía Pedagógica Oficial 8° (PDF)', 'https://diagnosticosecundaria.vercel.app/docs/GUIA_PEDAGOGICA_DIAGNOSTICO_8VO_MEP.pdf', 'Descarga Oficial']
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
  doc.text("Guía Pedagógica y Dossier Técnico Oficial de 8.° Año para Asesorías y Equipos Docentes.", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 148, 136);
  doc.text("Ecosistema de Formación Tecnológica • Ciclo Lectivo 2027", margin + 4, yPos + 18);

  drawHeaderFooter(5, 5, "Protocolo de Aplicación y Enlaces Oficiales (8°)");

  return doc;
}

// 1. Guardar en public/docs/ y public/documentos/
const outputDirDocs = path.join(__dirname, '..', 'public', 'docs');
const outputDirDocumentos = path.join(__dirname, '..', 'public', 'documentos');

if (!fs.existsSync(outputDirDocs)) fs.mkdirSync(outputDirDocs, { recursive: true });
if (!fs.existsSync(outputDirDocumentos)) fs.mkdirSync(outputDirDocumentos, { recursive: true });

const outputPathGuia = path.join(outputDirDocs, 'GUIA_PEDAGOGICA_DIAGNOSTICO_8VO_MEP.pdf');
const outputPathDossier = path.join(outputDirDocumentos, 'Dossier_Diagnostico_MEP_8vo_Robotica.pdf');

const doc = generarDossier8voPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathGuia, pdfBuffer);
fs.writeFileSync(outputPathDossier, pdfBuffer);
console.log(`✅ PDF de 8vo guardado con éxito en: \n - ${outputPathGuia}\n - ${outputPathDossier}`);

// 2. Guardar en artifacts dir si aplica
const artifactsDir = 'C:\\Users\\curio\\.gemini\\antigravity\\brain\\8ebb4f86-4fbc-4c47-a30f-5353796bacf0';
try {
  if (fs.existsSync(artifactsDir)) {
    fs.writeFileSync(path.join(artifactsDir, 'GUIA_PEDAGOGICA_DIAGNOSTICO_8VO_MEP.pdf'), pdfBuffer);
    fs.writeFileSync(path.join(artifactsDir, 'Dossier_Diagnostico_MEP_8vo_Robotica.pdf'), pdfBuffer);
    console.log(`✅ PDF de 8vo guardado con éxito en Artifacts: ${artifactsDir}`);
  }
} catch (e) {
  console.log(`⚠️ No se pudo escribir en artifacts dir: ${e.message}`);
}
