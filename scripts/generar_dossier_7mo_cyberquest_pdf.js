const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const autoTableMod = require('jspdf-autotable');
const autoTable = autoTableMod.default || autoTableMod;

function generarDossier7moPDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de Colores Oficial MEP & CyberQuest
  const COLOR_PRIMARY = [11, 15, 25];     // Slate 950 #0b0f19
  const COLOR_CYAN = [6, 182, 212];       // Cyan #06b6d4
  const COLOR_INDIGO = [99, 102, 241];    // Indigo #6366f1
  const COLOR_EMERALD = [16, 185, 129];   // Emerald #10b981
  const COLOR_AMBER = [245, 158, 11];     // Amber #f59e0b
  const COLOR_ROSE = [244, 63, 94];       // Rose #f43f5e
  const COLOR_PURPLE = [168, 85, 247];    // Purple #a855f7
  const COLOR_DARK = [15, 23, 42];        // Slate 900 #0f172a
  const COLOR_MUTED = [100, 116, 139];    // Slate 500 #64748b
  const COLOR_LIGHT_BG = [248, 250, 252]; // Slate 50 #f8fafc
  const COLOR_BORDER = [226, 232, 240];   // Slate 200 #e2e8f0

  function drawHeaderFooter(pageNum, totalPages, titleSection) {
    // Top Bar
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, pageWidth, 6, 'F');
    doc.setFillColor(...COLOR_CYAN);
    doc.rect(0, 6, pageWidth, 1.5, 'F');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 51, 102); // MEP Blue
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA • DRTE • PNFT 2026", margin, 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(titleSection || "Dossier Técnico • CyberQuest 7° Año", pageWidth - margin, 12, { align: 'right' });

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
    doc.text("CyberQuest 7.° Año: Misión Tecnológica de Saberes Integrados (Motriz, Procedimental, Actitudinal)", margin, pageHeight - 8);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // =========================================================================
  // PÁGINA 1: PORTADA Y FUNDAMENTACIÓN PEDAGÓGICA DE 7.° AÑO
  // =========================================================================
  
  // Header Banner
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 58, 'F');
  doc.setFillColor(...COLOR_CYAN);
  doc.rect(0, 58, pageWidth, 3, 'F');

  // Badge Superior
  doc.setFillColor(6, 182, 212, 0.2);
  doc.roundedRect(margin, 10, 115, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(6, 182, 212);
  doc.text("PROGRAMA NACIONAL DE FORMACIÓN TECNOLÓGICA • MEP 2026", margin + 4, 15);

  // Título Principal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("CYBERQUEST 7.° AÑO: MISIÓN TECNOLÓGICA", margin, 27);
  doc.setFontSize(14);
  doc.setTextColor(103, 232, 249); // Cyan light
  doc.text("DOSSIER TÉCNICO Y CURRICULAR DE DIAGNÓSTICO INTEGRADO", margin, 35);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(241, 245, 249);
  doc.text("Evaluación Formativa Tripartita: Desarrollo Psicomotor, Saberes Procedimentales y Actitudes Computacionales", margin, 43);
  doc.text("Diseñado para la transición a la Educación Secundaria • Formato Individual o Parejas Colaborativas", margin, 49);

  // Tarjeta de Metadatos
  let yPos = 68;
  doc.setFillColor(...COLOR_LIGHT_BG);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, contentWidth, 32, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("FICHA TÉCNICA DEL RECURSO DIAGNÓSTICO", margin + 6, yPos + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Población Meta: Estudiantes de 7.° Año (Sétimo de Secundaria / Tercer Ciclo EGB).", margin + 6, yPos + 12);
  doc.text("• Modalidad de Aplicación: Parejas de Ciber-Agentes (Líder de Consola y Co-piloto) o Individual.", margin + 6, yPos + 17);
  doc.text("• Enfoque de Evaluación: 100% Formativo, Diagnóstico y Cualitativo (Sin calificación sumativa punitiva).", margin + 6, yPos + 22);
  doc.text("• Acceso Web en Línea: https://diagnosticosecundaria.vercel.app/diagnostico (Pestaña 7.° Año).", margin + 6, yPos + 27);

  // Fundamentación Pedagógica
  yPos = 106;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(0, 51, 102);
  doc.text("1. FUNDAMENTACIÓN PEDAGÓGICA Y ENFOQUE EN 7.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El ingreso a sétimo año representa un hito crítico en el desarrollo de los estudiantes. Por ello, CyberQuest 7° sustituye la prueba tradicional por una «Misión Tecnológica Gamificada» que evalúa los aprendizajes previos de primaria sin generar ansiedad evaluativa, estructurada en tres dimensiones oficiales:",
    margin, yPos + 5, { maxWidth: contentWidth }
  );

  yPos = 124;
  const colW = (contentWidth - 6) / 3;

  // Dimensión 1: Psicomotriz
  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(margin, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(190, 18, 60);
  doc.text("🖐️ 1. Dimensión Psicomotriz", margin + 4, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Lateralidad y Orientación Espacial en rejilla interactiva.", margin + 4, yPos + 13);
  doc.text("• Ritmo y Control de Pulsiones (Semáforo de inhibición motriz).", margin + 4, yPos + 20);
  doc.text("• Coordinación Viso-Manual y trazo fino en canvas digital.", margin + 4, yPos + 27);
  doc.text("• Escala: Nivel A, B y C.", margin + 4, yPos + 34);

  // Dimensión 2: Procedimental
  doc.setFillColor(240, 249, 255);
  doc.setDrawColor(186, 230, 253);
  doc.roundedRect(margin + colW + 3, yPos, colW, 46, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(3, 105, 161);
  doc.text("🧠 2. Dimensión Procedimental", margin + colW + 7, yPos + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Clasificación de Hardware vs Software y Redes.", margin + colW + 7, yPos + 13);
  doc.text("• Manejo de Archivos por extensiones y editor gráfico.", margin + colW + 7, yPos + 20);
  doc.text("• Simulación paso a paso de código en bloques (Scratch).", margin + colW + 7, yPos + 27);
  doc.text("• Escala: L / ED / RA.", margin + colW + 7, yPos + 34);

  // Dimensión 3: Socioafectiva
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
  doc.text("• Aprender del Error ante fallas de lógica sin frustración.", margin + (colW + 3) * 2 + 4, yPos + 13);
  doc.text("• Colaboración activa y diálogo entre la pareja de agentes.", margin + (colW + 3) * 2 + 4, yPos + 20);
  doc.text("• Gusto por la Precisión en operadores y autopercepción.", margin + (colW + 3) * 2 + 4, yPos + 27);
  doc.text("• Escala: Nivel A, B y C.", margin + (colW + 3) * 2 + 4, yPos + 34);

  // Gamificación y Elementos Inmersivos
  yPos = 178;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("2. ELEMENTOS DE GAMIFICACIÓN E INTERACCIÓN DE CYBERQUEST", margin, yPos);

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
      0: { cellWidth: 30, fontStyle: 'bold' },
      1: { cellWidth: 78 },
      2: { cellWidth: 70 }
    },
    head: [['Elemento Lúdico', 'Mecanismo en la WebApp', 'Objetivo Pedagógico / Curricular']],
    body: [
      ['Avatares de Equipo', 'Selección de CyberBot 🤖, CodeCat 🐱‍💻, LogicNinja 🥷 o TechnoOwl 🦉.', 'Identidad de equipo, motivación y sentido de pertenencia.'],
      ['HUD de Jugador', 'Barra superior con puntaje acumulado y medidor de "Resiliencia Emocional".', 'Visibilidad del progreso en tiempo real y refuerzo del aprender del error.'],
      ['Efectos con Tone.js', 'Paisaje sonoro sintetizado para aciertos, niveles completados y errores.', 'Retroalimentación multisensorial que guía la atención del estudiante.'],
      ['Minijuego de Reflejos', 'Retos de reacción rápida y cálculo mental aritmético en la Arena Arcade.', 'Activación cognitiva y concentración viso-manual previa a los retos.']
    ]
  });

  drawHeaderFooter(1, 5, "Fundamentación y Gamificación de 7.° Año");

  // =========================================================================
  // PÁGINA 2: LOS 6 RETOS INTERACTIVOS DE CYBERQUEST 7°
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("3. ESTRUCTURA DETALLADA DE LOS 6 RETOS DE CYBERQUEST 7°", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Cada reto pone al estudiante en una situación interactiva que combina acciones motrices en pantalla con el análisis lógico y algorítmico:",
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
      cellPadding: 2.2
    },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: 'bold' },
      1: { cellWidth: 60 },
      2: { cellWidth: 50 },
      3: { cellWidth: 38 }
    },
    head: [['Reto / Módulo', 'Dinámica Interactiva en Pantalla', 'Saber Evaluado', 'Criterio de Desempeño']],
    body: [
      [
        'Módulo 0:\nLaboratorio Psicomotor',
        '1. Rejilla 4x4: Guiar bot con comandos.\n2. Semáforo: Pulsar en verde / frenar en rojo.\n3. Canal Canvas: Trazar sin tocar bordes.',
        '• Lateralidad y Espacio.\n• Ritmo e Inhibición.\n• Coordinación Viso-Manual.',
        'A: Precisión ≥80% y ritmo exacto.\nB: Requiere 2-3 intentos.\nC: Desviación o dificultad motriz.'
      ],
      [
        'Módulo 1:\nSistemas y Abstracción',
        'Clasificación interactiva en cajas de:\n• Hardware (Monitor, CPU, Impresora, Parlantes)\n• Software (SO, Canvas, Excel, Paint)\n+ 2 preguntas sobre SO y Redes.',
        '• Abstracción de Sistemas.\n• Componente Físico vs Lógico.\n• Función del SO y Redes.',
        'A: Clasificación 8/8 sin errores.\nB: Corrige 1-2 confusiones.\nC: Confunde físico con lógico.'
      ],
      [
        'Módulo 2:\nGestión de Archivos y Multimedia',
        '• Clasificar archivos en carpetas de Imágenes (.png, .jpg), Audio (.mp3) y Docs (.pdf).\n• Seleccionar archivos para editor gráfico.\n• Dibujo libre en lienzo digital.',
        '• Sistema de Archivos.\n• Extensiones Digitales.\n• Edición Gráfica y Trazo.',
        'A: Reconoce extensiones y software.\nB: Duda en extensiones de audio.\nC: No asocia extensiones al SO.'
      ],
      [
        'Módulo 3:\nAlgoritmos y Depuración',
        'Simulador en bloques tipo Scratch:\n• Evento "Al clic en Bandera Verde".\n• Variable "puntos" = 0.\n• Ciclo Repetir 3 veces (+5 puntos).\n• Condicional SI (puntos > 10).',
        '• Formulación de Algoritmos.\n• Ciclos y Bucles.\n• Variables y Condiciones.\n• Aprender del Error.',
        'A: Deduce puntos=15 y mensaje OK.\nB: Calcula con apoyo docente.\nC: No comprende el bucle repetitivo.'
      ],
      [
        'Módulo 4:\nLógica y Operadores',
        'Selección precisa de operadores:\n• Aritméticos: (+, -, *, /)\n• Relacionales: (=, >, <)\npara depurar expresiones lógicas en el código.',
        '• Gusto por la Precisión.\n• Lógica Relacional.\n• Depuración de Expresiones.',
        'A: 4/4 operadores correctos.\nB: 2-3 operadores correctos.\nC: Dificultad en operadores > y <.'
      ],
      [
        'Módulo 5:\nReflexión Metacognitiva',
        'Autoevaluación cualitativa sobre:\n1. Reacción ante el error.\n2. Trabajo en equipo y comunicación.\n3. Concentración motriz y reto más difícil.',
        '• Tolerancia a la Frustración.\n• Trabajo Colaborativo.\n• Autopercepción Formativa.',
        'A: Reflexión crítica y honesta.\nB: Respuestas breves guiadas.\nC: Falta de autoevaluación.'
      ]
    ]
  });

  drawHeaderFooter(2, 5, "Estructura de los 6 Retos de CyberQuest 7°");

  // =========================================================================
  // PÁGINA 3: MATRIZ DE CRITERIOS Y RÚBRICAS OFICIALES MEP (7.° AÑO)
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("4. MATRIZ DE CRITERIOS FORMATIVOS OFICIALES MEP (7.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Esta matriz traduce las interacciones de CyberQuest 7° al formato oficial del MEP para el registro cualitativo docente:",
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
    head: [['Cód.', 'Saber / Criterio', 'Conducta Observable en CyberQuest 7°', 'Escala Formativa Oficial MEP']],
    body: [
      // Psicomotora
      ['P1', 'Lateralidad y Espacio', 'Guía al robot en la rejilla 4x4 reconociendo comandos de orientación espacial (Izquierda, Derecha, Avanzar).', 'Nivel A: Orientación espacial inmediata\nNivel B: Corrige dirección tras 1 ensayo\nNivel C: Confunde lateralidad izquierda/derecha'],
      ['P2', 'Ritmo e Inhibición', 'Sincroniza el pulso rítmico en verde y frena de inmediato cuando el indicador cambia a luz roja.', 'Nivel A: Control motriz de inhibición total\nNivel B: 1-2 pulsos en luz roja\nNivel C: Dificultad para frenar el pulso'],
      ['P3', 'Coordinación Viso-Manual', 'Traza la línea continua en el canal de prueba sin tocar los límites laterales con el cursor/dedo.', 'Nivel A: Precisión de trazo ≥80%\nNivel B: Precisión de trazo 50%-79%\nNivel C: Precisión <50% o salida del canal'],
      ['P4', 'Diseño y Trazado Libre', 'Utiliza las herramientas de pincel y color en el lienzo digital para personalizar gráficos del juego.', 'Nivel A: Destreza motriz fina y creativa\nNivel B: Trazo básico con orientación\nNivel C: Dificultad para manipular el lienzo'],
      // Socioafectiva
      ['S1', 'Gusto por la Precisión', 'Selecciona meticulosamente los operadores (+, -, *, /, =, >, <) verificando la sintaxis del algoritmo.', 'Nivel A: Alto rigor en la elección lógica\nNivel B: Precisión moderada con guía\nNivel C: Elección al azar de operadores'],
      ['S2', 'Aprender del Error', 'Analiza reflexivamente las fallas en el simulador de bloques sin manifestar desánimo ni frustración.', 'Nivel A: Convierte el fallo en aprendizaje\nNivel B: Corrige tras pista del docente\nNivel C: Muestra frustración o abandono'],
      ['S3', 'Colaboración en Pareja', 'Demuestra trato constructivo, comunicación asertiva y división equitativa de roles en la consola.', 'Nivel A: Trabajo en equipo fluido y empático\nNivel B: Diálogo intermitente con apoyo\nNivel C: Falta de coordinación entre pares'],
      ['S4', 'Tolerancia a Frustración', 'Manifiesta paciencia, persistencia y autoconfianza al resolver los desafíos más exigentes de la misión.', 'Nivel A: Alta perseverancia y confort\nNivel B: Persistencia media con motivación\nNivel C: Requiere apoyo emocional constante']
    ]
  });

  // Saberes Conceptuales
  yPos = doc.lastAutoTable.finalY + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 51, 102);
  doc.text("SABERES CONCEPTUALES EVALUADOS (10 INDICADORES DE LOGRO MEP - 7.° AÑO)", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "1. Hardware (Dispositivos Físicos) • 2. Software (Programas y Aplicaciones) • 3. Sistema Operativo • 4. Redes de Comunicación • " +
    "5. Archivos y Extensiones • 6. Edición Gráfica • 7. Algoritmos y Eventos • 8. Variables y Bucles • 9. Condicionales Lógicas • 10. Operadores Aritméticos y Relacionales.",
    margin, yPos + 4, { maxWidth: contentWidth }
  );

  drawHeaderFooter(3, 5, "Matriz de Rúbricas Oficiales de 7.° Año");

  // =========================================================================
  // PÁGINA 4: EL INSTRUMENTO EVALUADOR DOCENTE DE 7.° AÑO
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("5. EL INSTRUMENTO DOCENTE EVALUADOR DE 7.° AÑO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "El aplicativo del docente para 7.° año permite consolidar la información de todas las secciones (7-1 a 7-20) en una matriz reactiva con telemetría automática y asistencia de IA:",
    margin, yPos + 6, { maxWidth: contentWidth }
  );

  yPos = 36;

  // 4 Funcionalidades Clave
  const cardW = (contentWidth - 4) / 2;

  // Card 1
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(...COLOR_BORDER);
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📊 MATRIZ DE OBSERVACIÓN EN VIVO", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Visualización de nómina por secciones (7-1 a 7-20).", margin + 4, yPos + 12);
  doc.text("• Registro de parejas (Líder y Co-piloto).", margin + 4, yPos + 17);
  doc.text("• Marcado ágil de niveles formativos (A / B / C).", margin + 4, yPos + 22);
  doc.text("• Filtros y buscador instantáneo de estudiantes.", margin + 4, yPos + 27);
  doc.text("• Sincronización en 0 ms con la base de datos.", margin + 4, yPos + 32);

  // Card 2
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📑 SISTEMATIZACIÓN OFICIAL (PÁG. 15)", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Consolidado tripartito: Motriz, Procedimental, Actitudinal.", margin + cardW + 8, yPos + 12);
  doc.text("• Conteo reactivo de estudiantes en L / ED / RA.", margin + cardW + 8, yPos + 17);
  doc.text("• Cuadro individual de desempeño de cada estudiante.", margin + cardW + 8, yPos + 22);
  doc.text("• Generación automática de recomendaciones con IA.", margin + cardW + 8, yPos + 27);
  doc.text("• Exportación a Excel/CSV compatible con MEP.", margin + cardW + 8, yPos + 32);

  // Card 3
  yPos = 76;
  doc.roundedRect(margin, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("📱 ESCÁNER QR OFFLINE (SIN INTERNET)", margin + 4, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• En laboratorios sin conexión, el alumno genera su QR.", margin + 4, yPos + 12);
  doc.text("• El docente escanea el código con su celular o tableta.", margin + 4, yPos + 17);
  doc.text("• Carga instantánea de puntajes y reflexiones en la matriz.", margin + 4, yPos + 22);
  doc.text("• Cero pérdida de datos y total equidad en zonas rurales.", margin + 4, yPos + 27);
  doc.text("• Token criptográfico antifraude incorporado.", margin + 4, yPos + 32);

  // Card 4
  doc.roundedRect(margin + cardW + 4, yPos, cardW, 36, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 51, 102);
  doc.text("✨ ASISTENTE PEDAGÓGICO DE IA", margin + cardW + 8, yPos + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text("• Analiza los patrones de error de toda la sección de 7°.", margin + cardW + 8, yPos + 12);
  doc.text("• Detecta alertas en coordinación motriz o lógica.", margin + cardW + 8, yPos + 17);
  doc.text("• Redacta la síntesis diagnóstica para el planeamiento.", margin + cardW + 8, yPos + 22);
  doc.text("• Propone estrategias de nivelación para el trimestre.", margin + cardW + 8, yPos + 27);
  doc.text("• Motor multi-proveedor con resiliencia en cascada.", margin + cardW + 8, yPos + 32);

  // Flujo de Datos
  yPos = 118;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("6. FLUJO DE TELEMETRÍA Y SINCRONIZACIÓN EN TIEMPO REAL", margin, yPos);

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
    head: [['Paso', 'Acción en la WebApp Estudiante 7°', 'Efecto en el Evaluador Docente y Dashboard']],
    body: [
      ['1. Registro', 'Estudiante(s) ingresan nombre, cédula y sección (ej. 7-1).', 'Aparece automáticamente en la nómina docente en estado "En curso".'],
      ['2. Retos 0 a 4', 'Resuelven la rejilla, semáforo, trazo, HW/SW, archivos y bloques.', 'Se transmiten métricas de aciertos y tiempo por reto a la base de datos.'],
      ['3. Reflexión', 'Redactan su autopercepción sobre error y trabajo en equipo.', 'El texto de reflexión se adjunta al expediente del estudiante.'],
      ['4. Cierre', 'Se genera el comprobante digital con insignia de logro.', 'La fila del alumno se marca como "Evaluado" y se consolidan los saberes.']
    ]
  });

  drawHeaderFooter(4, 5, "Instrumento Docente y Telemetría de 7.° Año");

  // =========================================================================
  // PÁGINA 5: PROTOCOLO DE APLICACIÓN EN AULA Y GUÍA DE ACCESO
  // =========================================================================
  doc.addPage();
  
  yPos = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text("7. PROTOCOLO DE APLICACIÓN EN EL AULA / LABORATORIO", margin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    "Guía paso a paso para docentes y asesores para la aplicación exitosa de CyberQuest 7° durante las primeras semanas del curso lectivo:",
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
        '• Proyectar el enlace oficial de 7.° año en la pizarra o enviar por Teams/WhatsApp.\n• Abrir su aplicativo docente en su computadora.',
        '• Ingresar al enlace en sus computadoras o tabletas.\n• Seleccionar avatar de equipo e ingresar datos de la pareja.'
      ],
      [
        'Fase 2: Ejecución\n(25 a 35 min)',
        '• Monitorear la matriz de observación en vivo.\n• Registrar conductas socioafectivas (diálogo, tolerancia) y motrices durante el juego.',
        '• Resolver los 5 retos de la misión con autonomía.\n• Compartir ideas entre la pareja de agentes para tomar decisiones precisas.'
      ],
      [
        'Fase 3: Reflexión\n(10 min)',
        '• Fomentar la autoevaluación honesta y constructiva sobre los errores cometidos.',
        '• Responder las 3 preguntas de reflexión en la Parte C y generar su Insignia de Logro.'
      ],
      [
        'Fase 4: Sistematización\n(Posterior a la clase)',
        '• Revisar la matriz consolidada (Pág. 15).\n• Presionar "Analizar Sección con IA" para obtener recomendaciones para el planeamiento.',
        '• Descargar o imprimir su comprobante digital si desean guardarlo en su portafolio.'
      ]
    ]
  });

  yPos = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 51, 102);
  doc.text("8. ENLACES OFICIALES Y ACCESOS EN PRODUCCIÓN (7.° AÑO)", margin, yPos);

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
    head: [['Recurso de 7.° Año', 'URL Oficial en Producción', 'Modo de Acceso']],
    body: [
      ['Portal Multi-Nivel MEP', 'https://diagnosticosecundaria.vercel.app/diagnostico', 'En Línea (Pestaña 7°)'],
      ['WebApp CyberQuest 7°', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_cyberquest.html', 'En Línea / Local'],
      ['Evaluador Docente 7° Año', 'https://diagnosticosecundaria.vercel.app/webapps/diagnostico_7mo_modulo01_docente_evaluador.html', 'En Línea / Escáner QR'],
      ['Dashboard de Telemetría', 'https://diagnosticosecundaria.vercel.app/dashboard', 'Monitoreo Global'],
      ['Dossier PDF Oficial 7°', 'https://diagnosticosecundaria.vercel.app/documentos/Dossier_Diagnostico_MEP_7mo_CyberQuest.pdf', 'Descarga Oficial']
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
  doc.text("Dossier técnico y pedagógico de CyberQuest 7.° Año para la Asesoría Nacional y Equipos Docentes.", margin + 4, yPos + 11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text("Ecosistema de Formación Tecnológica • Ciclo Lectivo 2026", margin + 4, yPos + 18);

  drawHeaderFooter(5, 5, "Protocolo de Aplicación y Enlaces Oficiales");

  return doc;
}

// 1. Guardar en public/documentos/
const outputDirWeb = path.join(__dirname, '..', 'public', 'documentos');
if (!fs.existsSync(outputDirWeb)) {
  fs.mkdirSync(outputDirWeb, { recursive: true });
}
const outputPathWeb = path.join(outputDirWeb, 'Dossier_Diagnostico_MEP_7mo_CyberQuest.pdf');

// 2. Guardar en artifacts directory
const artifactsDir = 'C:\\Users\\curio\\.gemini\\antigravity\\brain\\d99aa2c3-313b-4597-b0ff-83b2bf23c7e4';
const outputPathArtifact = path.join(artifactsDir, 'Dossier_Diagnostico_MEP_7mo_CyberQuest.pdf');

const doc = generarDossier7moPDF();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

fs.writeFileSync(outputPathWeb, pdfBuffer);
console.log(`✅ PDF de 7mo guardado con éxito en Web: ${outputPathWeb}`);

try {
  fs.writeFileSync(outputPathArtifact, pdfBuffer);
  console.log(`✅ PDF de 7mo guardado con éxito en Artifacts: ${outputPathArtifact}`);
} catch (e) {
  console.log(`⚠️ No se pudo escribir en artifacts dir: ${e.message}`);
}
