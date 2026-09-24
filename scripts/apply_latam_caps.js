const fs = require('fs');

function applyLatinAmericanCapitalization(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  const replacements = [
    // Header & HUD
    ['⚡ CyberQuest 7° &bull; Misión en Parejas', '⚡ CyberQuest 7.° &bull; Misión en parejas'],
    ['⚡ CyberQuest 7° &bull; Misión en parejas', '⚡ CyberQuest 7.° &bull; Misión en parejas'],
    ['⚡ CyberQuest 7° &bull; Misión Individual', '⚡ CyberQuest 7.° &bull; Misión individual'],
    ['⚡ CyberQuest 7° &bull; Misión individual', '⚡ CyberQuest 7.° &bull; Misión individual'],
    ['⚡ CyberQuest 7.° &bull; Misión en Parejas', '⚡ CyberQuest 7.° &bull; Misión en parejas'],
    ['title="Activar/Silenciar Audio"', 'title="Activar/silenciar audio"'],
    ['title="Pantalla Completa"', 'title="Pantalla completa"'],
    ['title="Reiniciar Sesión"', 'title="Reiniciar sesión"'],
    ['<div class="step-item" id="step4">4. Misión Cumplida</div>', '<div class="step-item" id="step4">4. Misión cumplida</div>'],
    
    // Progress HUD titles
    ["isIndiv ? 'Fase 0: Datos del estudiante' : 'Fase 0: Datos de los estudiantes (Pareja)'", "isIndiv ? 'Fase 0: Datos del estudiante' : 'Fase 0: Datos de los estudiantes (pareja)'"],
    ["isIndiv ? 'Fase 1: Entrenamiento Psicomotriz Individual' : 'Fase 1: Entrenamiento Psicomotriz en Pareja'", "isIndiv ? 'Fase 1: Entrenamiento psicomotriz individual' : 'Fase 1: Entrenamiento psicomotriz en pareja'"],
    ["'Fase 2: Desafíos Cognitivos y Pensamiento Computacional'", "'Fase 2: Desafíos cognitivos y pensamiento computacional'"],
    ["isIndiv ? 'Fase 3: Dimensión 3 • Valoración Socioafectiva' : 'Fase 3: Dimensión 3 • Valoración Socioafectiva'", "'Fase 3: Dimensión 3 • Valoración socioafectiva'"],
    ["'Fase 4: Misión Cumplida y Telemetría Oficial'", "'Fase 4: Misión cumplida y telemetría oficial'"],

    // Footer
    ['Módulo Diagnóstico Formativo 7.° Año (III Ciclo) &bull; Modalidad en Parejas (Líder y Co-piloto) &bull; Evaluación Diagnóstica Pura Sin Realimentación', 'Módulo diagnóstico formativo de 7.° año (III Ciclo) &bull; Modalidad en parejas (líder y copiloto) &bull; Evaluación diagnóstica pura sin realimentación'],

    // Phase 0
    ['FASE INICIAL &bull; DATOS DEL ESTUDIANTE${isSolo ? \' (INDIVIDUAL)\' : \' (MISIÓN EN PAREJAS)\'}', 'Fase inicial &bull; Datos del estudiante ${isSolo ? \'(individual)\' : \'(misión en parejas)\'}'],
    ['FASE INICIAL &bull; DATOS DEL ESTUDIANTE (MISIÓN EN PAREJAS)', 'Fase inicial &bull; Datos del estudiante (misión en parejas)'],
    ['FASE INICIAL &bull; DATOS DEL ESTUDIANTE (INDIVIDUAL)', 'Fase inicial &bull; Datos del estudiante (individual)'],
    ['<h1 class="card-title">Bienvenido a CyberQuest 7.° Año</h1>', '<h1 class="card-title">Bienvenido a CyberQuest 7.° año</h1>'],
    ['Evaluación Diagnóstica Oficial MEP 2027 - III Ciclo. Registra la información del estudiante para iniciar la aventura diagnóstica.', 'Evaluación diagnóstica oficial MEP 2027 - III Ciclo. Registre la información del estudiante para iniciar la aventura diagnóstica.'],
    ['🔗 Vinculado al Docente Evaluador', '🔗 Vinculado al docente evaluador'],
    ['<label class="form-label">Modalidad de Diagnóstico:</label>', '<label class="form-label">Modalidad de diagnóstico:</label>'],
    ['👥 En Parejas (Recomendado MEP)', '👥 En parejas (recomendado MEP)'],
    ['<label class="form-label">Sección Institucional:</label>', '<label class="form-label">Sección institucional:</label>'],
    ['${AppState.section === sClean && AppState.sectionLocked ? \'✓ (Asignada)\' : \'\'}', '${AppState.section === sClean && AppState.sectionLocked ? \'✓ (asignada)\' : \'\'}'],
    ['${isSolo ? \'🚀 Estudiante &bull; Datos del Estudiante\' : \'🚀 Estudiante 1 &bull; Líder de Misión\'}', '${isSolo ? \'🚀 Estudiante &bull; Datos del estudiante\' : \'🚀 Estudiante 1 &bull; Líder de misión\'}'],
    ['<label class="form-label">Nombre Completo (con ambos apellidos):</label>', '<label class="form-label">Nombre completo (con ambos apellidos):</label>'],
    ['<label class="form-label">Selecciona tu Avatar:</label>', '<label class="form-label">Seleccione su avatar:</label>'],
    ['🧭 Estudiante 2 &bull; Co-piloto de Datos', '🧭 Estudiante 2 &bull; Copiloto de datos'],
    ['Iniciar Misión Diagnóstica ⚡', 'Iniciar misión diagnóstica ⚡'],
    ['Debe ingresar el nombre completo con sus DOS apellidos', 'Debe ingresar el nombre completo con sus dos apellidos'],

    // Phase 1
    ['DIMENSIÓN 1 &bull; PSICOMOTRIZ Y PERCEPTIVO-MOTRIZ ${isSolo ? \'INDIVIDUAL\' : \'EN PAREJA\'}', 'Dimensión 1 &bull; Psicomotriz y perceptivo-motriz ${isSolo ? \'(individual)\' : \'(en pareja)\'}'],
    ['>P1. Lateralidad (4x4)</button>', '>P1. Lateralidad (4x4)</button>'],
    ['>P2. Ritmo e Inhibición</button>', '>P2. Ritmo e inhibición</button>'],
    ['>P3. Pulso Viso-Manual</button>', '>P3. Pulso visomanual</button>'],
    ['>P4. Trazo y Diseño</button>', '>P4. Trazo y diseño</button>'],

    ['<h2 class="card-title">P1. Lateralidad y Orientación Espacial (Mando en Tiempo Real)</h2>', '<h2 class="card-title">P1. Lateralidad y orientación espacial (mando en tiempo real)</h2>'],
    ['<div>Colisiones / Errores:', '<div>Colisiones / errores:'],
    ['<div>Posición / Rumbo:', '<div>Posición / rumbo:'],
    ['Siguiente Desafío (P2) ➔', 'Siguiente desafío (P2) ➔'],

    ['<h2 class="card-title">P2. Ritmo, Tempo e Inhibición Motriz</h2>', '<h2 class="card-title">P2. Ritmo, tempo e inhibición motriz</h2>'],
    ['<strong>Instrucción del Sensor:</strong>', '<strong>Instrucción del sensor:</strong>'],
    ['<strong>ÚNICAMENTE</strong>', '<strong>únicamente</strong>'],
    ['<strong>NO DEBE TOCAR EL BOTÓN</strong>', '<strong>no debe tocar el botón</strong>'],
    ['PREPARADOS...', 'Preparados...'],
    ['¡PULSA YA!', '¡Pulsa ya!'],
    ['¡ALTO! NO TOCAR', '¡Alto! No tocar'],
    ['EN ESPERA', 'En espera'],
    ['COMPLETADO', 'Completado'],
    ['▶ Iniciar Sensor de Reflejos', '▶ Iniciar sensor de reflejos'],
    ['⚡ CAPTURAR PULSO (CLIC AQUÍ) ⚡', '⚡ Capturar pulso (clic aquí) ⚡'],
    ['Siguiente Desafío (P3) ➔', 'Siguiente desafío (P3) ➔'],

    ['<h2 class="card-title">P3. Coordinación Viso-Manual y Pulso Digital</h2>', '<h2 class="card-title">P3. Coordinación visomanual y pulso digital</h2>'],
    ['Siguiente Desafío (P4) ➔', 'Siguiente desafío (P4) ➔'],

    ['<h2 class="card-title">P4. Motricidad Fina y Ergonomía: Dibujo de Computadora</h2>', '<h2 class="card-title">P4. Motricidad fina y ergonomía: dibujo de computadora</h2>'],
    ['title="Cian (Pantalla)"', 'title="Cian (pantalla)"'],
    ['title="Violeta (CPU/Torre)"', 'title="Violeta (CPU/torre)"'],
    ['title="Verde (Teclado)"', 'title="Verde (teclado)"'],
    ['title="Ámbar (Mouse)"', 'title="Ámbar (mouse)"'],
    ['title="Blanco (Detalles)"', 'title="Blanco (detalles)"'],
    ['🗑️ Limpiar', '🗑️ Limpiar lienzo'],
    ['💾 Guardar Dibujo', '💾 Guardar dibujo'],
    ['Continuar a Desafíos Cognitivos ➔', 'Continuar a desafíos cognitivos ➔'],

    // Cognitive Questions titles & text
    ['title: \'Indicador 1: Hardware y Dispositivos\'', 'title: \'Indicador 1: Hardware y dispositivos\''],
    ['title: \'Indicador 2: Software y Programas\'', 'title: \'Indicador 2: Software y programas\''],
    ['title: \'Indicador 3: Sistemas Operativos\'', 'title: \'Indicador 3: Sistemas operativos\''],
    ['title: \'Indicador 4: Redes y Conectividad\'', 'title: \'Indicador 4: Redes y conectividad\''],
    ['title: \'Indicador 5: Formatos y Extensiones de Archivo\'', 'title: \'Indicador 5: Formatos y extensiones de archivo\''],
    ['title: \'Indicador 6: Edición Gráfica y Medios\'', 'title: \'Indicador 6: Edición gráfica y medios\''],
    ['title: \'Indicador 7: Algoritmos y Eventos\'', 'title: \'Indicador 7: Algoritmos y eventos\''],
    ['title: \'Indicador 8: Variables y Bucles\'', 'title: \'Indicador 8: Variables y bucles\''],
    ['title: \'Indicador 9: Condicionales Lógicos\'', 'title: \'Indicador 9: Condicionales lógicos\''],
    ['title: \'Indicador 10: Operadores Lógicos y Aritméticos\'', 'title: \'Indicador 10: Operadores lógicos y aritméticos\''],

    ['desc: \'Funciones cardinales del Sistema Operativo y administración de recursos.\'', 'desc: \'Funciones cardinales del sistema operativo y administración de recursos.\''],
    ['¿Cuál de los siguientes grupos contiene EXCLUSIVAMENTE dispositivos de ENTRADA (Input)?', '¿Cuál de los siguientes grupos contiene exclusivamente dispositivos de entrada (input)?'],
    ['\'Monitor, Parlantes e Impresora\'', '\'Monitor, parlantes e impresora\''],
    ['\'Teclado, Ratón (Mouse) y Micrófono\'', '\'Teclado, ratón (mouse) y micrófono\''],
    ['\'Disco Duro SSD, Memoria RAM y Pendrive USB\'', '\'Disco duro SSD, memoria RAM y memoria USB (pendrive)\''],
    ['\'Pantalla Táctil, Proyector y Tarjeta Madre\'', '\'Pantalla táctil, proyector y tarjeta madre\''],

    ['\'Software de Aplicación de Usuario (ej. Navegador Web o Paint)\'', '\'Software de aplicación de usuario (por ejemplo, navegador web o Paint)\''],
    ['\'Software Utilitario y de Mantenimiento / Seguridad\'', '\'Software utilitario, de mantenimiento y seguridad\''],
    ['\'Software de Videojuegos\'', '\'Software de videojuegos\''],
    ['\'Controlador de Impresora\'', '\'Controlador de impresora\''],

    ['¿Cuál es la función PRINCIPAL del Sistema Operativo (como Windows, Linux o macOS)?', '¿Cuál es la función principal del sistema operativo (como Windows, Linux o macOS)?'],

    ['\'WAN (Red de Área Mundial)\'', '\'WAN (red de área amplia / mundial)\''],
    ['\'LAN / Intranet (Red de Área Local)\'', '\'LAN / intranet (red de área local)\''],
    ['\'Bluetooth Personal PAN\'', '\'PAN (red de área personal Bluetooth)\''],
    ['\'Satélite Espacial\'', '\'Satélite espacial\''],

    ['Relaciona la extensión con su tipo: Si guardas una pista de audio para un podcast escolar, ¿cuál extensión es la adecuada?', 'Al guardar una pista de audio para un pódcast escolar, ¿cuál extensión es la adecuada?'],

    ['\'Edición y Retoque Gráfico Digital\'', '\'Edición y retoque gráfico digital\''],
    ['\'Compilación de Código Fuente\'', '\'Compilación de código fuente\''],
    ['\'Formateo del Disco Duro\'', '\'Formateo del disco duro\''],
    ['\'Desfragmentación de Memoria\'', '\'Desfragmentación de memoria\''],

    ['En un programa de bloques (tipo Scratch), ¿qué bloque se utiliza para que un personaje hable JUSTO cuando el usuario hace clic sobre él?', 'En un programa de bloques (como Scratch), ¿qué bloque se utiliza para que un personaje hable en el momento en que el usuario hace clic sobre él?'],
    ['\'Al presionar Bandera Verde\'', '\'Al presionar la bandera verde\''],
    ['\'Al hacer clic en este objeto (Sprite)\'', '\'Al hacer clic en este objeto (sprite)\''],
    ['\'Por siempre / Repetir\'', '\'Por siempre / repetir\''],

    ['\'"Activar Modo Ahorro"\'', '\'"Activar modo ahorro"\''],
    ['\'"Modo Alto Rendimiento"\'', '\'"Modo alto rendimiento"\''],
    ['\'"Batería Llena"\'', '\'"Batería llena"\''],
    ['\'"Error de Sintaxis"\'', '\'"Error de sintaxis"\''],

    ['\'VERDADERO (True)\'', '\'Verdadero (True)\''],
    ['\'FALSO (False)\'', '\'Falso (False)\''],
    ['\'NULO (Null)\'', '\'Nulo (Null)\''],

    // Cognitive HUD
    ['DIMENSIÓN 2 &bull; PENSAMIENTO COMPUTACIONAL (Reto ${qIndex + 1} de 10)', 'Dimensión 2 &bull; Pensamiento computacional (Reto ${qIndex + 1} de 10)'],
    ['${qIndex < 9 ? \'Registrar y Siguiente ➔\' : \'Completar Fase Cognitiva ➔\'}', '${qIndex < 9 ? \'Registrar y siguiente ➔\' : \'Completar fase cognitiva ➔\'}'],

    // Dimension 3
    ['DIMENSIÓN 3 &bull; VALORACIÓN SOCIOAFECTIVA ${isSolo ? \'(INDIVIDUAL)\' : \'(PAREJAS)\'}', 'Dimensión 3 &bull; Valoración socioafectiva ${isSolo ? \'(individual)\' : \'(en parejas)\'}'],
    ['${isSolo ? \'Reflexión y Autoevaluación Individual\' : \'Reflexión y Coevaluación de la Pareja\'}', '${isSolo ? \'Reflexión y autoevaluación individual\' : \'Reflexión y coevaluación de la pareja\'}'],
    ['S1. Gusto por la Precisión y Calidad en las Respuestas:', 'S1. Gusto por la precisión y calidad en las respuestas:'],
    ['1. En Progreso (C)', '1. En progreso (C)'],
    ['2. Con Apoyo (B)', '2. Con apoyo (B)'],
    ['3. Autónomo (A)', '3. Autónomo (A)'],
    ['S4. Perseverancia y Tolerancia a la Frustración:', 'S4. Perseverancia y tolerancia a la frustración:'],
    ['${isSolo ? \'Finalizar y Generar Telemetría Oficial ⚡\' : \'Finalizar y Generar Telemetría de la Pareja ⚡\'}', '${isSolo ? \'Finalizar y generar telemetría oficial ⚡\' : \'Finalizar y generar telemetría de la pareja ⚡\'}'],

    // Phase 4
    ['MISIÓN CUMPLIDA &bull; EXPEDIENTE DIAGNÓSTICO ${isSolo ? \'INDIVIDUAL\' : \'EN PAREJA\'}', 'Misión cumplida &bull; Expediente diagnóstico ${isSolo ? \'(individual)\' : \'(en pareja)\'}'],
    ['Has completado con éxito la aventura tecnológica de 7.° Año para la <strong>Sección ${AppState.section}</strong> (MEP 2027).', 'Ha completado con éxito la aventura tecnológica de 7.° año para la <strong>Sección ${AppState.section}</strong> (MEP 2027).'],
    ['<span class="stat-card-title">🖐️ Dimensión Psicomotriz</span>', '<span class="stat-card-title">🖐️ Dimensión psicomotriz</span>'],
    ['<span class="stat-card-badge badge-level-a">Lateralidad y Pulso</span>', '<span class="stat-card-badge badge-level-a">Lateralidad y pulso</span>'],
    ['<span class="stat-card-title">🧠 Pensamiento Computacional</span>', '<span class="stat-card-title">🧠 Pensamiento computacional</span>'],
    ['<span class="stat-card-value" style="font-size: 1.4rem;">⭐ 10 Retos</span>', '<span class="stat-card-value" style="font-size: 1.4rem;">⭐ 10 retos</span>'],
    ['<span class="stat-card-badge badge-level-a">Lógica y Algoritmos</span>', '<span class="stat-card-badge badge-level-a">Lógica y algoritmos</span>'],
    ['<span class="stat-card-title">${isSolo ? \'🌟 Autonomía Digital\' : \'❤️ Trabajo en Equipo\'}</span>', '<span class="stat-card-title">${isSolo ? \'🌟 Autonomía digital\' : \'❤️ Trabajo en equipo\'}</span>'],
    ['<span class="stat-card-value" style="font-size: 1.4rem;">${isSolo ? \'🎯 Misión Individual\' : \'🤝 Sinergia\'}</span>', '<span class="stat-card-value" style="font-size: 1.4rem;">${isSolo ? \'🎯 Misión individual\' : \'🤝 Sinergia\'}</span>'],
    ['<span class="stat-card-badge badge-level-a">${isSolo ? \'Cadete Titular\' : \'Líder & Co-piloto\'}</span>', '<span class="stat-card-badge badge-level-a">${isSolo ? \'Cadete titular\' : \'Líder y copiloto\'}</span>'],
    ['<span class="stat-card-title">⚡ XP de Misión</span>', '<span class="stat-card-title">⚡ XP de misión</span>'],
    ['<span class="stat-card-badge badge-level-a">Nivel Cadete Pro</span>', '<span class="stat-card-badge badge-level-a">Nivel cadete pro</span>'],

    // Online panel
    ['DIAGNÓSTICO REGISTRADO Y SINCRONIZADO EN LÍNEA', 'Diagnóstico registrado y sincronizado en línea'],
    ['¡Información Transferida con Éxito!', '¡Información transferida con éxito!'],
    ['Tus respuestas y resultados diagnósticos han sido <strong>transferidos y sincronizados de manera automática</strong> con la <strong>Herramienta de Evaluación del Docente</strong> y con el <strong>Dashboard Institucional Central MEP</strong>.', 'Sus respuestas y resultados diagnósticos han sido <strong>transferidos y sincronizados de manera automática</strong> con la <strong>herramienta de evaluación del docente</strong> y con el <strong>panel institucional central MEP</strong>.'],
    ['Estado de Evaluación:', 'Estado de evaluación:'],
    ['🟢 Completado (100%)', '🟢 Completado (100%)'],
    ['Sección / Grupo:', 'Sección / grupo:'],
    ['Docente Asignado:', 'Docente asignado:'],
    ['Institución:', 'Institución:'],
    ['Código Único de Verificación:', 'Código único de verificación:'],
    ['💾 Descargar Ficha (.json)', '💾 Descargar ficha (.json)'],
    ['📊 Descargar Ficha (.csv)', '📊 Descargar ficha (.csv)'],
    ['🖨️ Imprimir Comprobante', '🖨️ Imprimir comprobante'],
    ['🖥️ Plano de Computadora Diseñado ${isSolo ? \'por el Estudiante\' : \'por la Pareja\'}:', '🖥️ Plano de computadora diseñado ${isSolo ? \'por el estudiante\' : \'por la pareja\'}:'],

    // Offline panel
    ['Modo Desconectado (Offline) Activo', 'Modo desconectado (offline) activo'],
    ['TELEMETRÍA OFICIAL PARA REGISTRO', 'Telemetría oficial para registro'],
    ['📱 Código QR ${isSolo ? \'del Cadete\' : \'de la Pareja de Cadetes\'}', '📱 Código QR ${isSolo ? \'del estudiante\' : \'de la pareja de estudiantes\'}'],
    ['Muestra este código QR a tu docente para escanear con la cámara y registrar la misión en la sábana institucional.', 'Muestre este código QR a su docente para escanear con la cámara y registrar la misión en la sábana institucional.'],
    ['Hash de Seguridad:', 'Código de seguridad:'],
    ['📦 Opciones Oficiales de Entrega de Resultados:', '📦 Opciones oficiales de entrega de resultados:'],
    ['<li><strong>📱 Código QR para Escanear:</strong> El docente escanea este código directamente con su cámara.</li>', '<li><strong>📱 Código QR para escanear:</strong> El docente escanea este código directamente con su cámara.</li>'],
    ['<li><strong>💾 Descargar Ficha (.json):</strong> Guarda el archivo para entregarlo en llave maya USB.</li>', '<li><strong>💾 Descargar ficha (.json):</strong> Guarde el archivo para entregarlo en llave maya USB.</li>'],
    ['<li><strong>📋 Copiar Código QR / Resumen:</strong> Copia los datos para enviarlos por Teams, WhatsApp o correo.</li>', '<li><strong>📋 Copiar código QR / resumen:</strong> Copie los datos para enviarlos por Teams, WhatsApp o correo.</li>'],
    ['<li><strong>🖨️ Imprimir Hoja Diagnóstica:</strong> Imprime el reporte físico oficial.</li>', '<li><strong>🖨️ Imprimir hoja diagnóstica:</strong> Imprima el reporte físico oficial.</li>'],
    ['📋 Copiar Código QR (JSON)', '📋 Copiar código QR (JSON)'],
    ['📝 Copiar Resumen de Texto', '📝 Copiar resumen de texto'],
    ['🖨️ Imprimir Hoja Diagnóstica', '🖨️ Imprimir hoja diagnóstica']
  ];

  let changeCount = 0;
  replacements.forEach(([target, rep]) => {
    if (content.includes(target)) {
      content = content.split(target).join(rep);
      changeCount++;
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath} with ${changeCount} grammatical rules applied.`);
}

applyLatinAmericanCapitalization('public/webapps/diagnostico_7mo_modulo01_cyberquest.html');
applyLatinAmericanCapitalization('public/webapps/diagnostico_7mo_modulo01_desconectado_offline.html');
