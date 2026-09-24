import { ConfiguracionDiagnosticoNivel } from "./tipos";

export const DIAGNOSTICO_7MO_DATA: ConfiguracionDiagnosticoNivel = {
  nivel: "7°",
  tituloOficial: "CyberQuest 7° — Misión Tecnológica MEP (Evaluación Diagnóstica)",
  asignatura: "Formación Tecnológica (Informática Educativa)",
  modulo: "Módulo 1 — III Ciclo",
  descripcion: "Aventura interactiva gamificada para 7° año que explora saberes previos en ciudadanía digital, hardware básico, internet seguro y pensamiento lógico.",
  totalReactivosCognitivos: 6,
  tiempoSugeridoMinutos: 80,
  seccionesSugeridas: [
    "7-1", "7-2", "7-3", "7-4", "7-5",
    "7-6", "7-7", "7-8", "7-9", "7-10",
    "7-11", "7-12", "7-13", "7-14", "7-15"
  ],
  subareas: [
    {
      id: "sub1_ciudadania_digital",
      nombre: "Misión 1-2: Ciudadanía Digital e Internet Seguro",
      descripcion: "Explora la identidad digital, contraseñas seguras y uso responsable de entornos virtuales.",
      itemsIds: [1, 2],
      pesoTotal: 2
    },
    {
      id: "sub2_hardware_basico",
      nombre: "Misión 3-4: Componentes Básicos y Periféricos",
      descripcion: "Identifica componentes de entrada, salida y almacenamiento en dispositivos digitales.",
      itemsIds: [3, 4],
      pesoTotal: 2
    },
    {
      id: "sub3_pensamiento_logico",
      nombre: "Misión 5-6: Secuencias Lógicas y Algoritmos Básicos",
      descripcion: "Reconoce pasos ordenados y resolución de laberintos de lógica.",
      itemsIds: [5, 6],
      pesoTotal: 2
    }
  ],
  reactivos: [
    {
      id: 1,
      subarea: "sub1_ciudadania_digital",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de las siguientes contraseñas es la más segura para proteger tus cuentas estudiantiles?",
      respuestaCorrecta: "c",
      indicadorId: 1,
      indicadorTexto: "Reconocer prácticas de seguridad digital y protección de la identidad en línea.",
      decisionPedagogicaEvidenciado: "Continuar con temas avanzados de ciberseguridad.",
      decisionPedagogicaFortalecer: "Reforzar la creación de contraseñas robustas y autenticación en la primera unidad.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) 123456" },
        { id: "b", texto: "b) MiNombre2027" },
        { id: "c", texto: "c) F0rt@l3za.T3c#26" },
        { id: "d", texto: "d) password" }
      ]
    },
    {
      id: 2,
      subarea: "sub1_ciudadania_digital",
      tipo: "seleccion_unica",
      enunciado: "Si recibes un mensaje sospechoso pidiendo tu contraseña a cambio de un premio, ¿qué debes hacer?",
      respuestaCorrecta: "b",
      indicadorId: 2,
      indicadorTexto: "Identificar riesgos digitales comunes como el phishing e ingeniería social.",
      decisionPedagogicaEvidenciado: "Articular con mediación de prevención de riesgos.",
      decisionPedagogicaFortalecer: "Realizar taller breve de detección de mensajes falsos.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Dar la contraseña de inmediato." },
        { id: "b", texto: "b) No responder, no dar clic en enlaces y reportar al docente." },
        { id: "c", texto: "c) Compartir el enlace con todos los compañeros." },
        { id: "d", texto: "d) Ingresar datos falsos para probar." }
      ]
    },
    {
      id: 3,
      subarea: "sub2_hardware_basico",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de los siguientes es un dispositivo de entrada de datos?",
      respuestaCorrecta: "a",
      indicadorId: 3,
      indicadorTexto: "Clasificar dispositivos periféricos de entrada, salida y almacenamiento.",
      decisionPedagogicaEvidenciado: "Continuar con arquitectura básica de computadoras.",
      decisionPedagogicaFortalecer: "Reforzar clasificación funcional de periféricos.",
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
      subarea: "sub2_hardware_basico",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál dispositivo se utiliza para guardar archivos y llevarlos a otra computadora?",
      respuestaCorrecta: "b",
      indicadorId: 4,
      indicadorTexto: "Identificar medios y unidades de almacenamiento digital.",
      decisionPedagogicaEvidenciado: "Articular con organización de carpetas y archivos.",
      decisionPedagogicaFortalecer: "Explicar gestión de archivos y almacenamiento seguro.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Micrófono" },
        { id: "b", texto: "b) Llave USB" },
        { id: "c", texto: "c) Teclado" },
        { id: "d", texto: "d) Pantalla" }
      ]
    },
    {
      id: 5,
      subarea: "sub3_pensamiento_logico",
      tipo: "seleccion_unica",
      enunciado: "Para lavarse las manos de forma correcta, ¿cuál es el orden lógico adecuado?",
      respuestaCorrecta: "a",
      indicadorId: 5,
      indicadorTexto: "Reconocer secuencias lógicas y algoritmos en la vida cotidiana.",
      decisionPedagogicaEvidenciado: "Avanzar a retos de programación por bloques.",
      decisionPedagogicaFortalecer: "Utilizar actividades desconectadas de secuenciación.",
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
      subarea: "sub3_pensamiento_logico",
      tipo: "seleccion_unica",
      enunciado: "Si un robot debe evitar un charco de agua, ¿cuál instrucción condicional es la correcta?",
      respuestaCorrecta: "c",
      indicadorId: 6,
      indicadorTexto: "Aplicar lógica condicional básica en situaciones problema.",
      decisionPedagogicaEvidenciado: "Articular con programación de sensores.",
      decisionPedagogicaFortalecer: "Reforzar la regla Causa-Efecto y toma de decisiones.",
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
      id: "soc_7mo_colab",
      nombre: "Trabajo colaborativo",
      descripcion: "Participa activamente en dinámicas de equipo y respeta turnos."
    },
    {
      id: "soc_7mo_cuidado",
      nombre: "Cuidado de recursos",
      descripcion: "Cuida los dispositivos digitales asignados en el aula o laboratorio."
    }
  ],
  criteriosPsicomotores: [
    {
      id: "psi_7mo_mouse",
      nombre: "Manejo del ratón y teclado",
      descripcion: "Utiliza el mouse y teclado con soltura básica para navegar en el entorno."
    }
  ]
};
