import { ConfiguracionDiagnosticoNivel } from "./tipos";

export const DIAGNOSTICO_8VO_DATA: ConfiguracionDiagnosticoNivel = {
  nivel: "8°",
  tituloOficial: "Evaluación Diagnóstica — 8° Año (PNFT)",
  asignatura: "Formación Tecnológica (Informática Educativa)",
  modulo: "Módulo 1 — III Ciclo",
  descripcion: "Evaluación diagnóstica integral de 8° año que articula saberes previos de Hardware, Software, Redes, Pensamiento Computacional, Algoritmos, Estructuras de Control, Robótica y dimensiones Socioafectiva y Psicomotora.",
  totalReactivosCognitivos: 14,
  tiempoSugeridoMinutos: 80,
  seccionesSugeridas: [
    "8-1", "8-2", "8-3", "8-4", "8-5",
    "8-6", "8-7", "8-8", "8-9", "8-10",
    "8-11", "8-12", "8-13", "8-14", "8-15"
  ],
  subareas: [
    {
      id: "sub1_apropiacion",
      areaCurricular: "Apropiación Tecnológica, Robótica y Mecanismos",
      nombre: "Grupo de criterios asociados 1: Apropiación Tecnológica y Hardware / Software",
      descripcion: "Explora la identificación de componentes de hardware, periféricos, tipos de software, redes de comunicación y gestión del almacenamiento.",
      itemsIds: [1, 2, 3, 4, 5],
      pesoTotal: 5
    },
    {
      id: "sub2_algoritmos",
      areaCurricular: "Programación y algoritmos",
      nombre: "Grupo de criterios asociados 2: Pensamiento Computacional y Algoritmos",
      descripcion: "Evalúa la estructura de algoritmos (E-P-S), tipos de datos, variables, condicionales, bucles y operadores aritméticos y relacionales.",
      itemsIds: [6, 7, 8, 9, 10, 11, 12],
      pesoTotal: 7
    },
    {
      id: "sub3_robotica",
      areaCurricular: "Computación física, robótica y automatización",
      nombre: "Grupo de criterios asociados 3: Robótica y Computación Física",
      descripcion: "Analiza el concepto de eventos y la identificación de sistemas robóticos autónomos diferenciándolos de artefactos comunes.",
      itemsIds: [13, 14],
      pesoTotal: 2
    }
  ],
  reactivos: [
    {
      id: 1,
      subarea: "sub1_apropiacion",
      tipo: "asociacion",
      enunciado: "Asocie cada componente de Hardware (Columna A) con su función correspondiente (Columna B).",
      respuestaCorrecta: "C-A-F-B-D-E",
      indicadorId: 1,
      indicadorTexto: "Clasificar tipos de computadoras y sus componentes principales de hardware, identificando funciones de periféricos comunes al interactuar con dispositivos digitales.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Incorporar una actividad breve de activación o fortalecimiento sobre periféricos y hardware durante la mediación.",
      puntos: 1,
      parejasAsociacion: [
        {
          id: "1_1",
          elementoColumnaA: "⌨️ Teclado",
          opcionCorrectaColumnaB: "C",
          opcionesDisponibles: [
            { id: "A", texto: "A. Visualizar información" },
            { id: "B", texto: "B. Almacenar/transportar archivos" },
            { id: "C", texto: "C. Ingresar texto, números y comandos" },
            { id: "D", texto: "D. Escuchar sonidos" },
            { id: "E", texto: "E. Capturar imágenes o video" },
            { id: "F", texto: "F. Señalar, seleccionar y desplazarse" }
          ]
        },
        {
          id: "1_2",
          elementoColumnaA: "🖥️ Monitor",
          opcionCorrectaColumnaB: "A",
          opcionesDisponibles: [
            { id: "A", texto: "A. Visualizar información" },
            { id: "B", texto: "B. Almacenar/transportar archivos" },
            { id: "C", texto: "C. Ingresar texto, números y comandos" },
            { id: "D", texto: "D. Escuchar sonidos" },
            { id: "E", texto: "E. Capturar imágenes o video" },
            { id: "F", texto: "F. Señalar, seleccionar y desplazarse" }
          ]
        },
        {
          id: "1_3",
          elementoColumnaA: "🖱️ Mouse",
          opcionCorrectaColumnaB: "F",
          opcionesDisponibles: [
            { id: "A", texto: "A. Visualizar información" },
            { id: "B", texto: "B. Almacenar/transportar archivos" },
            { id: "C", texto: "C. Ingresar texto, números y comandos" },
            { id: "D", texto: "D. Escuchar sonidos" },
            { id: "E", texto: "E. Capturar imágenes o video" },
            { id: "F", texto: "F. Señalar, seleccionar y desplazarse" }
          ]
        },
        {
          id: "1_4",
          elementoColumnaA: "💾 Memoria USB",
          opcionCorrectaColumnaB: "B",
          opcionesDisponibles: [
            { id: "A", texto: "A. Visualizar información" },
            { id: "B", texto: "B. Almacenar/transportar archivos" },
            { id: "C", texto: "C. Ingresar texto, números y comandos" },
            { id: "D", texto: "D. Escuchar sonidos" },
            { id: "E", texto: "E. Capturar imágenes o video" },
            { id: "F", texto: "F. Señalar, seleccionar y desplazarse" }
          ]
        },
        {
          id: "1_5",
          elementoColumnaA: "🔊 Parlantes",
          opcionCorrectaColumnaB: "D",
          opcionesDisponibles: [
            { id: "A", texto: "A. Visualizar información" },
            { id: "B", texto: "B. Almacenar/transportar archivos" },
            { id: "C", texto: "C. Ingresar texto, números y comandos" },
            { id: "D", texto: "D. Escuchar sonidos" },
            { id: "E", texto: "E. Capturar imágenes o video" },
            { id: "F", texto: "F. Señalar, seleccionar y desplazarse" }
          ]
        },
        {
          id: "1_6",
          elementoColumnaA: "📷 Cámara web",
          opcionCorrectaColumnaB: "E",
          opcionesDisponibles: [
            { id: "A", texto: "A. Visualizar información" },
            { id: "B", texto: "B. Almacenar/transportar archivos" },
            { id: "C", texto: "C. Ingresar texto, números y comandos" },
            { id: "D", texto: "D. Escuchar sonidos" },
            { id: "E", texto: "E. Capturar imágenes o video" },
            { id: "F", texto: "F. Señalar, seleccionar y desplazarse" }
          ]
        }
      ]
    },
    {
      id: 2,
      subarea: "sub1_apropiacion",
      tipo: "seleccion_unica",
      enunciado: "El conjunto de programas como el sistema operativo, que gestionan los recursos del sistema y permiten que las aplicaciones funcionen, corresponde al software de:",
      respuestaCorrecta: "b",
      indicadorId: 2,
      indicadorTexto: "Distinguir los tipos de software relacionándolos con sus funciones y usos en tareas cotidianas.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Incorporar una actividad breve de activación o fortalecimiento sobre tipos de software durante la mediación.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Aplicación" },
        { id: "b", texto: "b) Sistema" },
        { id: "c", texto: "c) Programación" },
        { id: "d", texto: "d) Diseño gráfico" }
      ]
    },
    {
      id: 3,
      subarea: "sub1_apropiacion",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es el dispositivo de red encargado de recibir la señal del proveedor de Internet y traducirla para distribuirla mediante redes locales (físicas o inalámbricas)?",
      respuestaCorrecta: "a",
      indicadorId: 3,
      indicadorTexto: "Identificar tipos de redes de comunicación y sus dispositivos principales (módem, router y puntos de acceso), explicando su funcionamiento y principios de comunicación durante la conexión a Internet en contextos cotidianos.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Incorporar una actividad breve de activación o fortalecimiento sobre redes y conectividad.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Módem / Router" },
        { id: "b", texto: "b) Impresora en red" },
        { id: "c", texto: "c) Tarjeta gráfica" },
        { id: "d", texto: "d) Disco duro externo" }
      ]
    },
    {
      id: 4,
      subarea: "sub1_apropiacion",
      tipo: "seleccion_unica",
      enunciado: "Si eliminas accidentalmente un documento en un sistema operativo de escritorio y necesitas recuperarlo inmediatamente, ¿a cuál herramienta debes acudir?",
      respuestaCorrecta: "b",
      indicadorId: 4,
      indicadorTexto: "Identificar las categorías de los sistemas operativos (escritorio y dispositivos móviles), describiendo su función básica y el uso de la papelera como herramienta que elimina y/o recupera archivos.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Incorporar una actividad breve sobre el explorador de archivos y papelera de reciclaje.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Explorador de carpetas" },
        { id: "b", texto: "b) Papelera de reciclaje" },
        { id: "c", texto: "c) Panel de control" },
        { id: "d", texto: "d) Navegador web" }
      ]
    },
    {
      id: 5,
      subarea: "sub1_apropiacion",
      tipo: "seleccion_unica",
      enunciado: "Observe los siguientes archivos: Documento (2 MB), Imagen (5 MB), Video (80 MB). ¿Cuál archivo ocupa más espacio?",
      respuestaCorrecta: "b",
      indicadorId: 5,
      indicadorTexto: "Aplicar las propiedades (tamaño, tipo y extensión) en la gestión de archivos para compartir información en diferentes entornos digitales.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Incorporar una actividad breve de repaso sobre unidades de almacenamiento y optimización de archivos.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Documento — 2 MB" },
        { id: "b", texto: "b) Video — 80 MB" },
        { id: "c", texto: "c) Imagen — 5 MB" }
      ]
    },
    {
      id: 6,
      subarea: "sub2_algoritmos",
      tipo: "asociacion",
      enunciado: "Asocie las etapas de la estructura de un algoritmo con el ejemplo de la preparación de un jugo de frutas:",
      respuestaCorrecta: "B-A-C",
      indicadorId: 6,
      indicadorTexto: "Reconocer el algoritmo identificando su estructura (entrada, proceso, salida) y aplicando sus características (preciso, finito, definido) como una representación clara y ordenada.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Incorporar dinámicas desconectadas para afianzar el modelo Entrada-Proceso-Salida.",
      puntos: 1,
      parejasAsociacion: [
        {
          id: "6_1",
          elementoColumnaA: "1. Entrada (Recursos iniciales)",
          opcionCorrectaColumnaB: "B",
          opcionesDisponibles: [
            { id: "A", texto: "A. Licuar las frutas con el agua y azúcar durante 1 min." },
            { id: "B", texto: "B. Disponer de las frutas, agua, azúcar y licuadora." },
            { id: "C", texto: "C. Obtener el vaso de jugo listo para servir." }
          ]
        },
        {
          id: "6_2",
          elementoColumnaA: "2. Proceso (Pasos para transformar)",
          opcionCorrectaColumnaB: "A",
          opcionesDisponibles: [
            { id: "A", texto: "A. Licuar las frutas con el agua y azúcar durante 1 min." },
            { id: "B", texto: "B. Disponer de las frutas, agua, azúcar y licuadora." },
            { id: "C", texto: "C. Obtener el vaso de jugo listo para servir." }
          ]
        },
        {
          id: "6_3",
          elementoColumnaA: "3. Salida (Resultado final)",
          opcionCorrectaColumnaB: "C",
          opcionesDisponibles: [
            { id: "A", texto: "A. Licuar las frutas con el agua y azúcar durante 1 min." },
            { id: "B", texto: "B. Disponer de las frutas, agua, azúcar y licuadora." },
            { id: "C", texto: "C. Obtener el vaso de jugo listo para servir." }
          ]
        }
      ]
    },
    {
      id: 7,
      subarea: "sub2_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "En un programa que registra el estado del tiempo, el dato que almacena si '¿Está lloviendo?' con valores de Verdadero o Falso es un tipo de dato:",
      respuestaCorrecta: "c",
      indicadorId: 7,
      indicadorTexto: "Identificar tipos de dato y formas de almacenamiento, aplicándolos en la creación de algoritmos para resolver desafíos programados.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Reforzar la diferencia entre datos de texto, numéricos y booleanos mediante ejercicios prácticos.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Texto / Cadena" },
        { id: "b", texto: "b) Numérico entero" },
        { id: "c", texto: "c) Booleano / Lógico" },
        { id: "d", texto: "d) Decimal" }
      ]
    },
    {
      id: 8,
      subarea: "sub2_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "¿Qué acción ocurre cuando a una variable llamada 'puntos' con valor inicial de 0 se le aplica la instrucción: puntos = puntos + 10?",
      respuestaCorrecta: "c",
      indicadorId: 8,
      indicadorTexto: "Identificar tipos de variable, aplicando su gestión mediante declaraciones y asignaciones en un entorno de programación.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Utilizar analogías de cajas y acumuladores para afianzar la asignación y actualización de variables.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Se borra la variable." },
        { id: "b", texto: "b) Se declara un nuevo tipo de dato." },
        { id: "c", texto: "c) Se le asigna un nuevo valor actualizado de 10." },
        { id: "d", texto: "d) La variable se convierte en una constante fija." }
      ]
    },
    {
      id: 9,
      subarea: "sub2_algoritmos",
      tipo: "pseudocodigo",
      enunciado: "Analice el siguiente pseudocódigo. Si el sensor marca 25 °C, ¿qué acción se ejecuta?",
      pseudocodigo: "INICIO\n    LEER temperatura\n    SI temperatura > 30 ENTONCES\n        ENCENDER ventilador\n    SI NO\n        MANTENER ventilador apagado\n    FIN SI\nFIN",
      respuestaCorrecta: "b",
      indicadorId: 9,
      indicadorTexto: "Aplicar estructuras condicionales en un entorno de programación para la resolución de desafíos que requieran la toma de decisiones lógicas.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Realizar trazas manuales de condicionales con diagramas de flujo y pseudocódigo.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) El ventilador se enciende." },
        { id: "b", texto: "b) El ventilador se mantiene apagado." },
        { id: "c", texto: "c) El sensor se destruye." },
        { id: "d", texto: "d) Se repite el conteo indefinidamente." }
      ]
    },
    {
      id: 10,
      subarea: "sub2_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "Un personaje debe avanzar en línea recta hasta llegar a una pared. ¿Cuál estructura de control es la más adecuada para evitar repetir el comando 'Avanzar 1 paso' 50 veces seguidas?",
      respuestaCorrecta: "b",
      indicadorId: 10,
      indicadorTexto: "Aplicar estructuras repetitivas en un entorno de programación para resolver desafíos que requieren la ejecución cíclica de instrucciones.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Ejercitar bucles con retos de laberintos y bloques de repetición.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Evento de clic" },
        { id: "b", texto: "b) Estructura repetitiva (Ciclo/Bucle)" },
        { id: "c", texto: "c) Asignación de variable" },
        { id: "d", texto: "d) Operador relacional" }
      ]
    },
    {
      id: 11,
      subarea: "sub2_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál es el resultado final de la variable 'total' tras ejecutar: precio = 500, descuento = 100, total = precio - descuento?",
      respuestaCorrecta: "c",
      indicadorId: 11,
      indicadorTexto: "Aplicar operadores aritméticos (suma, resta, multiplicación y división) para resolver cálculos dentro de ejercicios de programación.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Practicar operaciones matemáticas simples dentro de variables y bloques de código.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) 600" },
        { id: "b", texto: "b) 50000" },
        { id: "c", texto: "c) 400" },
        { id: "d", texto: "d) 50" }
      ]
    },
    {
      id: 12,
      subarea: "sub2_algoritmos",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál operador relacional debe colocarse en el espacio para que la comparación sea VERDADERA? Cantidad_Estudiantes (28) _____ Límite_Aula (30)",
      respuestaCorrecta: "b",
      indicadorId: 12,
      indicadorTexto: "Aplicar operadores relacionales para realizar comparaciones dentro de ejercicios de programación.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Reforzar el uso de operadores relacionales (<, >, ==, >=, <=) con tablas de verdad sencillas.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) > (Mayor que)" },
        { id: "b", texto: "b) < (Menor que)" },
        { id: "c", texto: "c) == (Igual a)" },
        { id: "d", texto: "d) >= (Mayor o igual que)" }
      ]
    },
    {
      id: 13,
      subarea: "sub3_robotica",
      tipo: "seleccion_unica",
      enunciado: "Al presionar la barra espaciadora en el teclado y lograr que un personaje en pantalla salte, la acción de presionar la tecla funciona como un:",
      respuestaCorrecta: "b",
      indicadorId: 13,
      indicadorTexto: "Aplicar un evento como acción que se detona mediante una causa y un efecto al resolver desafíos programados.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Diferenciar entre disparadores de eventos (teclas, clics, colisiones) y las acciones resultantes.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Algoritmo de salida" },
        { id: "b", texto: "b) Evento (Causa)" },
        { id: "c", texto: "c) Variable de sistema" },
        { id: "d", texto: "d) Periférico de salida" }
      ]
    },
    {
      id: 14,
      subarea: "sub3_robotica",
      tipo: "seleccion_unica",
      enunciado: "¿Cuál de los siguientes dispositivos se clasifica como un robot, al contar con sistema sensorial, sistema de control y capacidad de actuar de forma autónoma?",
      respuestaCorrecta: "b",
      indicadorId: 14,
      indicadorTexto: "Reconocer qué es un robot, sus tipos y componentes (cuerpo, sistema sensorial y sistema de control), diferenciándolo de otros dispositivos no robóticos.",
      decisionPedagogicaEvidenciado: "Continuar y articular este aprendizaje con los saberes de octavo.",
      decisionPedagogicaFortalecer: "Analizar la tríada 'Sensores - Control - Actuadores' para distinguir robots de electrodomésticos convencionales.",
      puntos: 1,
      opciones: [
        { id: "a", texto: "a) Licuadora manual de cocina" },
        { id: "b", texto: "b) Aspirador autónomo que esquiva obstáculos mediante sensores" },
        { id: "c", texto: "c) Ventilador de pedestal encendido manualmente" },
        { id: "d", texto: "d) Televisor LED convencional" }
      ]
    }
  ],
  criteriosSocioafectivos: [
    {
      id: "soc_1_colaboracion",
      nombre: "Trabajo colaborativo",
      descripcion: "Muestra disposición y trabajo colaborativo con sus pares."
    },
    {
      id: "soc_2_tolerancia",
      nombre: "Tolerancia a la frustración",
      descripcion: "Demuestra paciencia y tolerancia a la frustración ante retos lógicos."
    },
    {
      id: "soc_3_comunicacion",
      nombre: "Comunicación asertiva",
      descripcion: "Expresa sus ideas de forma respetuosa durante la plenaria o trabajo en grupo."
    },
    {
      id: "soc_4_respeto_equipo",
      nombre: "Respeto al recurso tecnológico",
      descripcion: "Practica normas de autocuidado y respeto por los recursos tecnológicos comunitarios."
    }
  ],
  criteriosPsicomotores: [
    {
      id: "psi_1_coordinacion",
      nombre: "Coordinación viso-manual fina",
      descripcion: "Manipula eficientemente el ratón (clic, doble clic, arrastrar) o la pantalla táctil."
    },
    {
      id: "psi_2_ergonomia",
      nombre: "Postura y ergonomía",
      descripcion: "Mantiene una postura corporal adecuada frente a la estación de trabajo/computadora."
    },
    {
      id: "psi_3_mecanografia",
      nombre: "Mecanografía básica",
      descripcion: "Ubica y utiliza con agilidad zonas del teclado (alfanumérico, dirección, comandos)."
    },
    {
      id: "psi_4_material_concreto",
      nombre: "Uso de material concreto/desconectado",
      descripcion: "Manipula, recorta o ensambla piezas/tarjetas para estructurar secuencias lógicas."
    }
  ]
};
