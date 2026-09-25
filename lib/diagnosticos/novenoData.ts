import { ConfiguracionDiagnosticoNivel } from "./tipos";

export const DIAGNOSTICO_9NO_DATA: ConfiguracionDiagnosticoNivel = {
  nivel: "9°",
  tituloOficial: "Evaluación Diagnóstica — 9° Año: Aula Inteligente (PNFT)",
  asignatura: "Formación Tecnológica (Informática Educativa)",
  modulo: "Módulo 1 — III Ciclo",
  descripcion: "Diagnóstico integrado de 9° año basado en la situación-problema «Aula Inteligente» (Sistemas Automatizados, Microcontroladores, Sensores LDR, Actuadores LED, Algoritmos y depuración).",
  totalReactivosCognitivos: 10,
  tiempoSugeridoMinutos: 80,
  seccionesSugeridas: [
    "9-1", "9-2", "9-3", "9-4", "9-5",
    "9-6", "9-7", "9-8", "9-9", "9-10",
    "9-11", "9-12", "9-13", "9-14", "9-15"
  ],
  subareas: [
    {
      id: "sub1_sistemas_auto",
      nombre: "Grupo de criterios asociados 1: Sistemas Automatizados y Arquitectura de Control",
      descripcion: "Explora microcontroladores, sensores, actuadores y el modelo Entrada-Proceso-Salida.",
      itemsIds: [1, 2, 3, 6],
      pesoTotal: 4
    },
    {
      id: "sub2_algoritmos_iot",
      nombre: "Grupo de criterios asociados 2: Pensamiento Computacional y Lógica Condicional",
      descripcion: "Evalúa algoritmos, condicionales simples y dobles, tipos de datos y operadores.",
      itemsIds: [4, 5, 7, 8],
      pesoTotal: 4
    },
    {
      id: "sub3_depuracion_datos",
      nombre: "Grupo de criterios asociados 3: Depuración, Conectividad y Almacenamiento",
      descripcion: "Analiza la depuración de circuitos, calibración de sensores y toma de decisiones con datos.",
      itemsIds: [9, 10],
      pesoTotal: 2
    }
  ],
  reactivos: [
    {
      id: 1,
      subarea: "sub1_sistemas_auto",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es la función principal de un microcontrolador en un sistema automatizado como el Aula Inteligente?",
      respuestaCorrecta: "b",
      indicadorId: 1,
      indicadorTexto: "Explicar la función de un microcontrolador en un sistema automatizado.",
      decisionPedagogicaEvidenciado: "Continuar con programación en C++/bloques avanzados.",
      decisionPedagogicaFortalecer: "Reforzar la arquitectura de microcontroladores y flujo de instrucciones.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Servir únicamente como fuente de energía." },
        { id: "b", texto: "b) Recibir datos de sensores, procesarlos y controlar actuadores según su código." },
        { id: "c", texto: "c) Emitir luz constante en el laboratorio." },
        { id: "d", texto: "d) Almacenar páginas web en la nube." }
      ]
    },
    {
      id: 2,
      subarea: "sub1_sistemas_auto",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es la diferencia fundamental entre un sensor y un actuador?",
      respuestaCorrecta: "a",
      indicadorId: 2,
      indicadorTexto: "Diferenciar las funciones entre sensores y actuadores.",
      decisionPedagogicaEvidenciado: "Avanzar a circuitos de sensado analógico y digital.",
      decisionPedagogicaFortalecer: "Realizar ejercicios prácticos de identificación sensor-actuador.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) El sensor captura datos del entorno y el actuador ejecuta una acción física." },
        { id: "b", texto: "b) El sensor gasta energía y el actuador la genera." },
        { id: "c", texto: "c) Son componentes exactamente idénticos." },
        { id: "d", texto: "d) El actuador solo funciona con internet." }
      ]
    },
    {
      id: 3,
      subarea: "sub1_sistemas_auto",
      tipo: "seleccion_unica",
      enunciado: "En el sistema de iluminación automática, ¿cuál es el orden correcto del modelo Entrada ➔ Proceso ➔ Salida?",
      respuestaCorrecta: "c",
      indicadorId: 3,
      indicadorTexto: "Aplicar el modelo Entrada-Proceso-Salida en sistemas de control.",
      decisionPedagogicaEvidenciado: "Articular con diagramas de bloques funcionales.",
      decisionPedagogicaFortalecer: "Repasar el flujo de señales desde la captura hasta la respuesta.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) LED ➔ Microcontrolador ➔ Sensor LDR" },
        { id: "b", texto: "b) Batería ➔ Cable ➔ Resistencia" },
        { id: "c", texto: "c) Sensor LDR (Entrada) ➔ Microcontrolador (Proceso) ➔ Iluminación LED (Salida)" },
        { id: "d", texto: "d) Pantalla ➔ Teclado ➔ Mouse" }
      ]
    },
    {
      id: 4,
      subarea: "sub2_algoritmos_iot",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es la secuencia lógica correcta para que el sistema encienda la luz solo si oscurece?",
      respuestaCorrecta: "a",
      indicadorId: 4,
      indicadorTexto: "Estructurar algoritmos de control con secuencias lógicas.",
      decisionPedagogicaEvidenciado: "Avanzar a programación estructurada en el microcontrolador.",
      decisionPedagogicaFortalecer: "Elaborar diagramas de flujo de decisiones paso a paso.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) 1. Iniciar ➔ 2. Leer sensor LDR ➔ 3. ¿Luz < Umbral? ➔ 4. Encender LED" },
        { id: "b", texto: "b) 1. Encender LED ➔ 2. Apagar todo ➔ 3. Iniciar" },
        { id: "c", texto: "c) 1. Leer sensor ➔ 2. Desconectar batería ➔ 3. Fin" },
        { id: "d", texto: "d) 1. Esperar 1 hora ➔ 2. Encender ventilador" }
      ]
    },
    {
      id: 5,
      subarea: "sub2_algoritmos_iot",
      tipo: "pseudocodigo",
      enunciado: "Si el umbral de iluminación es 300 Lux y el sensor marca 180 Lux, ¿qué ocurrirá con el LED?",
      pseudocodigo: "SI (lecturaLuz < 300) ENTONCES\n    ENCENDER(LED)\nSINO\n    APAGAR(LED)\nFIN SI",
      respuestaCorrecta: "b",
      indicadorId: 5,
      indicadorTexto: "Evaluar expresiones lógicas y condicionales en sistemas embebidos.",
      decisionPedagogicaEvidenciado: "Avanzar a histéresis y calibración de umbrales múltiples.",
      decisionPedagogicaFortalecer: "Reforzar la evaluación de operadores de comparación (<, >).",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) El LED se mantendrá apagado." },
        { id: "b", texto: "b) El LED se encenderá porque 180 es menor que 300." },
        { id: "c", texto: "c) El microcontrolador se reiniciará." },
        { id: "d", texto: "d) Se quemará el sensor de luz." }
      ]
    },
    {
      id: 6,
      subarea: "sub1_sistemas_auto",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de las siguientes relaciones de componentes es correcta?",
      respuestaCorrecta: "b",
      indicadorId: 6,
      indicadorTexto: "Relacionar componentes físicos de un sistema embebido con sus roles.",
      decisionPedagogicaEvidenciado: "Continuar con diseño de circuitos en protoboard.",
      decisionPedagogicaFortalecer: "Repasar la función de cada elemento de hardware en el laboratorio.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Sensor = Ejecuta acción | Actuador = Captura entorno" },
        { id: "b", texto: "b) Sensor = Captura entorno | Actuador = Ejecuta acción | Microcontrolador = Procesa y controla" },
        { id: "c", texto: "c) Cable = Procesa | Batería = Mide luz" },
        { id: "d", texto: "d) Monitor = Sensor analógico" }
      ]
    },
    {
      id: 7,
      subarea: "sub2_algoritmos_iot",
      tipo: "seleccion_unica",
      enunciado: "La lectura '180 Lux' o '1.05 V' entregada por el sensor LDR representa un:",
      respuestaCorrecta: "c",
      indicadorId: 7,
      indicadorTexto: "Identificar el concepto de dato analógico y numérico en sistemas de medición.",
      decisionPedagogicaEvidenciado: "Trabajar con conversión analógica-digital (ADC).",
      decisionPedagogicaFortalecer: "Diferenciar datos continuos (analógicos) y discretos (digitales).",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Virus informático" },
        { id: "b", texto: "b) Error de sintaxis" },
        { id: "c", texto: "c) Dato numérico o señal analógica de entrada" },
        { id: "d", texto: "d) Archivo de video comprimido" }
      ]
    },
    {
      id: 8,
      subarea: "sub2_algoritmos_iot",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál estructura algorítmica permite tomar dos caminos diferentes según si hay o no luz suficiente?",
      respuestaCorrecta: "b",
      indicadorId: 8,
      indicadorTexto: "Aplicar estructuras condicionales dobles en la resolución de problemas.",
      decisionPedagogicaEvidenciado: "Avanzar a estructuras condicionales anidadas y múltiples.",
      decisionPedagogicaFortalecer: "Ejercitar la estructura SI-SINO mediante casos reales.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Asignación simple" },
        { id: "b", texto: "b) Estructura Condicional Doble (Si - De lo contrario / If - Else)" },
        { id: "c", texto: "c) Bucle infinito sin condición" },
        { id: "d", texto: "d) Declaración de constante fija" }
      ]
    },
    {
      id: 9,
      subarea: "sub3_depuracion_datos",
      tipo: "seleccion_unica",
      enunciado: "Si el LED nunca enciende a pesar de que está completamente oscuro, ¿cuál es el primer paso de depuración?",
      respuestaCorrecta: "b",
      indicadorId: 9,
      indicadorTexto: "Aplicar estrategias sistemáticas de depuración en circuitos y código.",
      decisionPedagogicaEvidenciado: "Enfocar en técnicas avanzadas de troubleshooting.",
      decisionPedagogicaFortalecer: "Enseñar el protocolo de verificación: alimentación, polaridad, pines y código.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Reemplazar toda la computadora del laboratorio." },
        { id: "b", texto: "b) Revisar conexiones físicas (VCC, GND, pines de datos), polaridad del LED y umbral en el código." },
        { id: "c", texto: "c) Borrar todo el sistema operativo." },
        { id: "d", texto: "d) Ignorar el error y continuar." }
      ]
    },
    {
      id: 10,
      subarea: "sub3_depuracion_datos",
      tipo: "seleccion_unica",
      enunciado: "¿Por qué es importante registrar y almacenar los datos de luminosidad y consumo energético a lo largo del tiempo?",
      respuestaCorrecta: "c",
      indicadorId: 10,
      indicadorTexto: "Comprender la importancia del almacenamiento y ciclo de vida de los datos para la toma de decisiones.",
      decisionPedagogicaEvidenciado: "Articular con proyectos de analítica de datos e IoT sostenible.",
      decisionPedagogicaFortalecer: "Explicar cómo los registros históricos optimizan el consumo energético.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Para saturar la memoria del microcontrolador." },
        { id: "b", texto: "b) No tiene ninguna utilidad práctica." },
        { id: "c", texto: "c) Para analizar patrones históricos de consumo y tomar decisiones informadas de ahorro." },
        { id: "d", texto: "d) Para apagar el Internet del colegio." }
      ]
    }
  ],
  criteriosSocioafectivos: [
    {
      id: "soc_9no_precision",
      nombre: "Precisión y cuidado de detalles",
      descripcion: "Demuestra rigurosidad y cuidado en el conexionado y calibración de componentes."
    },
    {
      id: "soc_9no_error_mejora",
      nombre: "Aprender del error",
      descripcion: "Utiliza los fallos de depuración como oportunidades constructivas de aprendizaje."
    },
    {
      id: "soc_9no_tolerancia",
      nombre: "Tolerancia a la frustración",
      descripcion: "Mantiene la persistencia y paciencia ante problemas técnicos complejos."
    },
    {
      id: "soc_9no_etica",
      nombre: "Manejo ético y seguro",
      descripcion: "Aplica normas de seguridad eléctrica y respeto a los recursos del laboratorio."
    }
  ],
  criteriosPsicomotores: [
    {
      id: "psi_9no_cableado",
      nombre: "Destreza en conexionado físico",
      descripcion: "Inserta y conecta cables jumper, sensores y actuadores con precisión en protoboard/pines."
    },
    {
      id: "psi_9no_calibracion",
      nombre: "Manipulación de instrumentos y sensores",
      descripcion: "Calibra potenciómetros y orienta sensores con soltura viso-manual."
    }
  ]
};
