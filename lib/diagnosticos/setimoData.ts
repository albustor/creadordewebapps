import { ConfiguracionDiagnosticoNivel } from "./tipos";

export const DIAGNOSTICO_7MO_DATA: ConfiguracionDiagnosticoNivel = {
  nivel: "7°",
  tituloOficial: "CyberQuest 7° — Misión Tecnológica MEP (Evaluación Diagnóstica)",
  asignatura: "Formación Tecnológica (Informática Educativa)",
  modulo: "Módulo 1 — III Ciclo",
  descripcion: "Aventura interactiva gamificada para 7.° año que explora saberes previos en fundamentos de computación, hardware, gestión de archivos y pensamiento lógico-algorítmico.",
  totalReactivosCognitivos: 6,
  tiempoSugeridoMinutos: 80,
  seccionesSugeridas: [
    "7-1", "7-2", "7-3", "7-4", "7-5",
    "7-6", "7-7", "7-8", "7-9", "7-10",
    "7-11", "7-12", "7-13", "7-14", "7-15"
  ],
  subareas: [
    {
      id: "sub1_fundamentos_hardware",
      areaCurricular: "Apropiación tecnológica y digital",
      nombre: "Grupo de criterios asociados 1: Fundamentos de Computación, Cuidado del Equipo y Hardware",
      descripcion: "Identifica componentes de procesamiento, reglas de cuidado del equipo y arquitectura básica.",
      itemsIds: [1, 2],
      pesoTotal: 2
    },
    {
      id: "sub2_software_archivos",
      areaCurricular: "Apropiación tecnológica y digital",
      nombre: "Grupo de criterios asociados 2: Periféricos, Software y Gestión de Archivos",
      descripcion: "Clasifica periféricos de entrada/salida y reconoce unidades de almacenamiento y archivos.",
      itemsIds: [3, 4],
      pesoTotal: 2
    },
    {
      id: "sub3_programacion_algoritmos",
      areaCurricular: "Programación y algoritmos",
      nombre: "Grupo de criterios asociados 3: Lógica Proposicional, Algoritmia y Control",
      descripcion: "Reconoce secuencias ordenadas, algoritmos de la vida cotidiana y toma de decisiones condicional.",
      itemsIds: [5, 6],
      pesoTotal: 2
    }
  ],
  reactivos: [
    {
      id: 1,
      subarea: "sub1_fundamentos_hardware",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es una regla fundamental para el cuidado y uso seguro de una computadora en el laboratorio de informática?",
      respuestaCorrecta: "b",
      indicadorId: 1,
      indicadorTexto: "Aplicar reglas básicas de cuidado, seguridad física y uso responsable de la computadora.",
      decisionPedagogicaEvidenciado: "Continuar con temas de mantenimiento preventivo y ergonomía.",
      decisionPedagogicaFortalecer: "Reforzar el protocolo de apagado seguro y cuidado del equipamiento digital.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Consumir alimentos y bebidas sobre el teclado." },
        { id: "b", texto: "b) Apagar el equipo correctamente por el sistema y mantener limpia el área de trabajo." },
        { id: "c", texto: "c) Desconectar los cables bruscamente mientras la computadora está encendida." },
        { id: "d", texto: "d) Mover la CPU bruscamente durante el procesamiento de datos." }
      ]
    },
    {
      id: 2,
      subarea: "sub1_fundamentos_hardware",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál componente interno es considerado el cerebro de la computadora que procesa los datos y ejecuta las instrucciones?",
      respuestaCorrecta: "a",
      indicadorId: 2,
      indicadorTexto: "Identificar los componentes principales de procesamiento y arquitectura básica de computadoras.",
      decisionPedagogicaEvidenciado: "Articular con interacción de procesador y memorias.",
      decisionPedagogicaFortalecer: "Realizar mediación visual sobre el rol de la CPU y memoria RAM.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) El Procesador o CPU" },
        { id: "b", texto: "b) El teclado" },
        { id: "c", texto: "c) El parlante" },
        { id: "d", texto: "d) El cable de red" }
      ]
    },
    {
      id: 3,
      subarea: "sub2_software_archivos",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de los siguientes es un dispositivo de entrada de datos?",
      respuestaCorrecta: "a",
      indicadorId: 3,
      indicadorTexto: "Clasificar dispositivos periféricos de entrada, salida y almacenamiento.",
      decisionPedagogicaEvidenciado: "Continuar con arquitectura de dispositivos.",
      decisionPedagogicaFortalecer: "Reforzar clasificación funcional de periféricos de entrada y salida.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Teclado" },
        { id: "b", texto: "b) Monitor" },
        { id: "c", texto: "c) Impresora" },
        { id: "d", texto: "d) Parlantes" }
      ]
    },
    {
      id: 4,
      subarea: "sub2_software_archivos",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál dispositivo se utiliza para guardar archivos digitales y llevarlos a otra computadora de forma segura?",
      respuestaCorrecta: "b",
      indicadorId: 4,
      indicadorTexto: "Identificar medios y unidades de almacenamiento digital y gestión de archivos.",
      decisionPedagogicaEvidenciado: "Articular con organización de carpetas y directorios.",
      decisionPedagogicaFortalecer: "Explicar gestión de archivos y almacenamiento seguro.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Micrófono" },
        { id: "b", texto: "b) Llave de memoria USB" },
        { id: "c", texto: "c) Teclado" },
        { id: "d", texto: "d) Pantalla" }
      ]
    },
    {
      id: 5,
      subarea: "sub3_programacion_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "Para lavarse las manos de forma correcta antes de ingresar al laboratorio, ¿cuál es el orden lógico adecuado?",
      respuestaCorrecta: "a",
      indicadorId: 5,
      indicadorTexto: "Reconocer secuencias lógicas y algoritmos en la vida cotidiana.",
      decisionPedagogicaEvidenciado: "Avanzar a retos de programación por bloques y pseudocódigo.",
      decisionPedagogicaFortalecer: "Utilizar actividades desconectadas de secuenciación de instrucciones.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Mojar manos ➔ Aplicar jabón ➔ Frotar ➔ Enjuagar ➔ Secar" },
        { id: "b", texto: "b) Secar ➔ Aplicar jabón ➔ Mojar manos" },
        { id: "c", texto: "c) Frotar ➔ Secar ➔ Aplicar jabón" },
        { id: "d", texto: "d) Enjuagar ➔ Secar ➔ Mojar manos" }
      ]
    },
    {
      id: 6,
      subarea: "sub3_programacion_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "Si un robot debe evitar un charco u obstáculo en su camino, ¿cuál instrucción condicional es la correcta?",
      respuestaCorrecta: "c",
      indicadorId: 6,
      indicadorTexto: "Aplicar lógica condicional básica en situaciones problema.",
      decisionPedagogicaEvidenciado: "Articular con programación de sensores y estructuras de control.",
      decisionPedagogicaFortalecer: "Reforzar la regla Causa-Efecto (SI ... ENTONCES ... SINO).",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Caminar siempre recto sin importar qué hay al frente." },
        { id: "b", texto: "b) Apagar el robot inmediatamente." },
        { id: "c", texto: "c) SI detecta charco ENTONCES girar a la derecha, SINO avanzar." },
        { id: "d", texto: "d) Repetir salto indefinidamente." }
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
