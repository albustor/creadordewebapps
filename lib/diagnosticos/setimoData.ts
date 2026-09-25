import { ConfiguracionDiagnosticoNivel } from "./tipos";

export const DIAGNOSTICO_7MO_DATA: ConfiguracionDiagnosticoNivel = {
  nivel: "7°",
  tituloOficial: "CyberQuest 7° — Misión Tecnológica MEP (Evaluación Diagnóstica)",
  asignatura: "Formación Tecnológica (Informática Educativa)",
  modulo: "Módulo 1 — III Ciclo",
  descripcion: "Aventura interactiva gamificada para 7.° año que explora saberes previos en fundamentos de computación, hardware, software, gestión de archivos y pensamiento computacional algorítmico.",
  totalReactivosCognitivos: 10,
  tiempoSugeridoMinutos: 80,
  seccionesSugeridas: [
    "7-1", "7-2", "7-3", "7-4", "7-5",
    "7-6", "7-7", "7-8", "7-9", "7-10",
    "7-11", "7-12", "7-13", "7-14", "7-15"
  ],
  subareas: [
    {
      id: "sub3_programacion_algoritmos",
      areaCurricular: "Programación y algoritmos",
      nombre: "Grupo de criterios asociados 1: Pensamiento Computacional, Algoritmia y Control Lógico",
      descripcion: "Aplica eventos, traza de variables en ciclos, toma de decisiones condicionales y evaluación de proposiciones lógicas compuestas.",
      itemsIds: [7, 8, 9, 10],
      pesoTotal: 4
    },
    {
      id: "sub2_conectividad_archivos",
      areaCurricular: "Apropiación tecnológica y digital",
      nombre: "Grupo de criterios asociados 2: Conectividad, Redes y Formatos de Archivos Digitales",
      descripcion: "Reconoce el rol de las redes locales (LAN), clasificación de extensiones de archivos digitales y herramientas de edición de medios.",
      itemsIds: [4, 5, 6],
      pesoTotal: 3
    },
    {
      id: "sub1_hardware_sistemas",
      areaCurricular: "Apropiación tecnológica y digital",
      nombre: "Grupo de criterios asociados 3: Hardware, Periféricos y Sistemas Operativos",
      descripcion: "Identifica componentes de entrada, salida, procesamiento, reglas de cuidado y administración de recursos del sistema operativo.",
      itemsIds: [1, 2, 3],
      pesoTotal: 3
    }
  ],
  reactivos: [
    {
      id: 1,
      subarea: "sub1_hardware_sistemas",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es la función principal de los dispositivos periféricos de entrada (como el teclado y el mouse) en un sistema de cómputo?",
      respuestaCorrecta: "b",
      indicadorId: 1,
      indicadorTexto: "Identificar la función de dispositivos de entrada, salida y almacenamiento.",
      decisionPedagogicaEvidenciado: "Continuar con arquitectura avanzada de computadoras.",
      decisionPedagogicaFortalecer: "Reforzar la clasificación funcional de periféricos de entrada, salida y almacenamiento.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Mostrar los resultados visuales en pantalla." },
        { id: "b", texto: "b) Ingresar datos, comandos e instrucciones a la computadora." },
        { id: "c", texto: "c) Emitir sonidos y alertas auditivas del sistema." },
        { id: "d", texto: "d) Enfriar los circuitos internos del procesador." }
      ]
    },
    {
      id: 2,
      subarea: "sub1_hardware_sistemas",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de los siguientes programas se clasifica como software utilitario orientado al mantenimiento y seguridad del equipo?",
      respuestaCorrecta: "a",
      indicadorId: 2,
      indicadorTexto: "Diferenciar aplicaciones de usuario de programas utilitarios y de seguridad.",
      decisionPedagogicaEvidenciado: "Articular con seguridad operativa y respaldo de información.",
      decisionPedagogicaFortalecer: "Realizar mediación visual sobre la tipología de software (sistema, aplicación y utilitarios).",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Antivirus y programas de diagnóstico y limpieza de disco." },
        { id: "b", texto: "b) Videojuegos recreativos en 3D." },
        { id: "c", texto: "c) Calculadora básica del sistema." },
        { id: "d", texto: "d) Navegador web para consultas de internet." }
      ]
    },
    {
      id: 3,
      subarea: "sub1_hardware_sistemas",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es la función primordial del Sistema Operativo en una computadora?",
      respuestaCorrecta: "c",
      indicadorId: 3,
      indicadorTexto: "Reconocer las funciones cardinales del sistema operativo en la administración de recursos.",
      decisionPedagogicaEvidenciado: "Avanzar a gestión de procesos y almacenamiento.",
      decisionPedagogicaFortalecer: "Explicar el rol del sistema operativo como administrador de hardware y software.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Conectar físicamente los cables eléctricos al tomacorriente." },
        { id: "b", texto: "b) Diseñar dibujos y logotipos vectoriales." },
        { id: "c", texto: "c) Servir de puente entre el usuario, aplicaciones y administrar los recursos del hardware." },
        { id: "d", texto: "d) Fabricar las tarjetas electrónicas de la computadora." }
      ]
    },
    {
      id: 4,
      subarea: "sub2_conectividad_archivos",
      tipo: "seleccion_unica",
      enunciado: "En el laboratorio escolar, ¿cuál es la principal ventaja de conectar las computadoras a una Red de Área Local (LAN)?",
      respuestaCorrecta: "b",
      indicadorId: 4,
      indicadorTexto: "Identificar el rol de las redes de área local para compartir recursos informáticos.",
      decisionPedagogicaEvidenciado: "Continuar con conceptos de topologías y recursos compartidos.",
      decisionPedagogicaFortalecer: "Reforzar el concepto de red local y compartición de recursos.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Cambiar el color de los monitores automáticamente." },
        { id: "b", texto: "b) Compartir archivos, carpetas, impresoras y acceso a Internet de forma ágil." },
        { id: "c", texto: "c) Evitar el uso de electricidad en las computadoras." },
        { id: "d", texto: "d) Borrar todos los archivos al apagar el equipo." }
      ]
    },
    {
      id: 5,
      subarea: "sub2_conectividad_archivos",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de las siguientes extensiones corresponde a un formato estándar de archivo de audio digital?",
      respuestaCorrecta: "a",
      indicadorId: 5,
      indicadorTexto: "Relacionar extensiones de archivo con el tipo de información digital almacenada.",
      decisionPedagogicaEvidenciado: "Avanzar a producción multimedia y gestión de archivos.",
      decisionPedagogicaFortalecer: "Repasar las extensiones más comunes (.mp3, .docx, .png, .pdf).",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) .mp3 / .wav" },
        { id: "b", texto: "b) .docx / .txt" },
        { id: "c", texto: "c) .jpg / .png" },
        { id: "d", texto: "d) .exe / .bat" }
      ]
    },
    {
      id: 6,
      subarea: "sub2_conectividad_archivos",
      tipo: "seleccion_unica",
      enunciado: "Al editar una fotografía digital para un trabajo escolar, ¿qué acción se utiliza para eliminar elementos sobrantes del borde?",
      respuestaCorrecta: "c",
      indicadorId: 6,
      indicadorTexto: "Aplicar operaciones de transformación y corrección visual sobre imágenes digitales.",
      decisionPedagogicaEvidenciado: "Continuar con diseño y producción gráfica.",
      decisionPedagogicaFortalecer: "Realizar taller guiado de recorte y transformación de imágenes.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Guardar como texto plano." },
        { id: "b", texto: "b) Subir el volumen del archivo." },
        { id: "c", texto: "c) Recortar (Crop) y ajustar el encuadre de la imagen." },
        { id: "d", texto: "d) Duplicar la memoria RAM del equipo." }
      ]
    },
    {
      id: 7,
      subarea: "sub3_programacion_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "En un entorno de programación por bloques, ¿cuál bloque actúa como disparador de acción o evento?",
      respuestaCorrecta: "a",
      indicadorId: 7,
      indicadorTexto: "Identificar disparadores de acción (eventos) en entornos de programación por bloques.",
      decisionPedagogicaEvidenciado: "Avanzar a programación dirigida por eventos.",
      decisionPedagogicaFortalecer: "Reforzar el concepto de evento detonante en programación.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) 'Al presionar tecla espacio' o 'Al hacer clic en este objeto'" },
        { id: "b", texto: "b) 'Sumar 10 puntos'" },
        { id: "c", texto: "c) 'Esperar 1 segundo'" },
        { id: "d", texto: "d) 'Fijar tamaño al 100%'" }
      ]
    },
    {
      id: 8,
      subarea: "sub3_programacion_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "Si una variable llamada 'puntos' inicia en 0 y se ejecuta el ciclo: 'Repetir 3 veces { puntos = puntos + 5 }', ¿cuál es el valor final de la variable?",
      respuestaCorrecta: "c",
      indicadorId: 8,
      indicadorTexto: "Realizar traza secuencial de variables en estructuras repetitivas (bucles).",
      decisionPedagogicaEvidenciado: "Continuar con bucles anidados y acumuladores.",
      decisionPedagogicaFortalecer: "Utilizar tablas de traza de variables paso a paso.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) 5" },
        { id: "b", texto: "b) 10" },
        { id: "c", texto: "c) 15" },
        { id: "d", texto: "d) 3" }
      ]
    },
    {
      id: 9,
      subarea: "sub3_programacion_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "En el algoritmo: 'SI bateria < 20% ENTONCES Activar Modo Ahorro, SINO Mantener Normal'. Si la batería marca 15%, ¿qué acción realiza el sistema?",
      respuestaCorrecta: "b",
      indicadorId: 9,
      indicadorTexto: "Evaluar estructuras condicionales simples (Si / Si no) basadas en umbrales.",
      decisionPedagogicaEvidenciado: "Articular con condicionales dobles y anidados.",
      decisionPedagogicaFortalecer: "Practicar la evaluación de condiciones lógicas con umbrales numéricos.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) El dispositivo se apaga automáticamente." },
        { id: "b", texto: "b) Se activa el Modo Ahorro porque 15% es menor que 20%." },
        { id: "c", texto: "c) Se mantiene en Modo Normal." },
        { id: "d", texto: "d) La batería sube inmediatamente a 100%." }
      ]
    },
    {
      id: 10,
      subarea: "sub3_programacion_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es el resultado de verdad de la condición compuesta: '(10 > 5) Y (4 + 2 == 6)'?",
      respuestaCorrecta: "a",
      indicadorId: 10,
      indicadorTexto: "Determinar el valor de verdad en condiciones compuestas con el operador lógico Y.",
      decisionPedagogicaEvidenciado: "Continuar con operadores lógicos O (OR) y NO (NOT) en algoritmos complejos.",
      decisionPedagogicaFortalecer: "Reforzar tablas de verdad del operador Y (AND).",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Verdadero (porque ambas condiciones se cumplen)." },
        { id: "b", texto: "b) Falso (porque ninguna condición se cumple)." },
        { id: "c", texto: "c) Falso (porque solo la primera condición se cumple)." },
        { id: "d", texto: "d) No se puede calcular." }
      ]
    }
  ],
  criteriosSocioafectivos: [
    {
      id: "s1_precision",
      nombre: "S1. Gusto por la Precisión y Calidad",
      descripcion: "Pregunta de reflexión: «Cuando respondió los retos, ¿revisó los detalles con cuidado?» | Inicial: Respondí rápido, sin revisar. | Intermedio: Revisé solo algunas respuestas. | Avanzado: Revisé con cuidado cada respuesta antes de enviarla."
    },
    {
      id: "s2_error",
      nombre: "S2. Aprender del Error (Resiliencia y Metacognición)",
      descripcion: "Pregunta de reflexión: «Cuando se equivocó en un reto, ¿qué hizo?» | Inicial: Lo dejé así y continué. | Intermedio: Lo intenté de nuevo con ayuda. | Avanzado: Busqué mi error, lo corregí y aprendí algo."
    },
    {
      id: "s3_flexibilidad",
      nombre: "S3. Flexibilidad para Manejar Problemas y Trabajo Colaborativo",
      descripcion: "Pregunta de reflexión: «Cuando algo no salió como esperaba (pregunta difícil, problema de equipo/compañero), ¿qué hizo?» | Inicial: Seguí con la misma idea aunque no funcionaba. | Intermedio: Probé otra forma cuando alguien me dio una idea. | Avanzado: (Parejas: Escuché ideas y juntos probamos otra forma / Individual: Busqué por mi cuenta otra forma)."
    },
    {
      id: "s4_tolerancia",
      nombre: "S4. Tolerancia a la Frustración y Perseverancia",
      descripcion: "Pregunta de reflexión: «Cuando un reto se puso difícil, ¿cómo reaccioné?» | Inicial: Me enojé o quise dejarlo. | Intermedio: Me costó, pero seguí cuando me animaron. | Avanzado: Mantuve la calma y seguí intentando hasta terminar."
    }
  ],
  criteriosPsicomotores: [
    {
      id: "p1_orientacion",
      nombre: "P1. Orientación Espacial y Desplazamiento",
      descripcion: "Coordinación espacial, lateralidad y desplazamiento secuencial en cuadrícula lógica."
    },
    {
      id: "p2_ritmo",
      nombre: "P2. Ritmo e Inhibición Sensorio-Motora",
      descripcion: "Control inhibitorio motor y respuesta sincronizada ante estímulos visuales."
    },
    {
      id: "p3_pulso",
      nombre: "P3. Pulso y Precisión Digital",
      descripcion: "Estabilidad de pulso y control del puntero en trayectorias estrechas."
    },
    {
      id: "p4_motricidad",
      nombre: "P4. Motricidad Fina con Periféricos",
      descripcion: "Coordinación óculo-manual en dibujo, captura de trazo y destreza de periféricos."
    }
  ]
};
