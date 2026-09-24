"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import {
  CheckCircle,
  NotePencil,
  DownloadSimple,
  Copy,
  Printer,
  Sparkle,
  ShieldCheck,
  Cpu,
  GraduationCap,
  CaretRight,
  CaretDown,
  FloppyDisk,
  ArrowSquareOut,
  Info,
  Code,
  Robot,
  Database,
  DeviceMobile,
  Question,
  BookOpen,
  Bookmarks,
  Lightbulb,
} from "@phosphor-icons/react";

interface PasoInfografia {
  numero: number;
  titulo: string;
  descripcion: string;
  consejo?: string;
}

interface InfografiaEtapa {
  titulo: string;
  resumen: string;
  pasos: PasoInfografia[];
}

interface TareaVerificacion {
  id: string;
  texto: string;
  detalle: string;
}

interface EtapaAprendizaje {
  id: number;
  titulo: string;
  subtitulo: string;
  enlaceAccion?: {
    texto: string;
    url: string;
  };
  infografia?: InfografiaEtapa;
  tareas: TareaVerificacion[];
}

const ETAPAS_DATOS: EtapaAprendizaje[] = [
  {
    id: 1,
    titulo: "Etapa 1: Marco curricular, supervisión y rol de asesoría",
    subtitulo: "Comprensión de directrices normativas y entorno de acompañamiento regional y nacional.",
    infografia: {
      titulo: "Infografía de Supervisión y Cobertura Curricular",
      resumen: "Organización en 27 DRE territoriales y ensayos controlados con secciones muestra.",
      pasos: [
        {
          numero: 1,
          titulo: "Estructura territorial",
          descripcion: "Verificar la organización de las 27 Direcciones Regionales de Educación (DRE) y sus circuitos para entender el alcance nacional.",
          consejo: "Permite al personal directivo y de asesoría monitorear el avance regional sin fricción.",
        },
        {
          numero: 2,
          titulo: "Secciones de muestra para simulación",
          descripcion: "Abrir las secciones de prueba para ensayar la navegación estudiantil y la dinámica de aula sin alterar las bases de datos oficiales.",
          consejo: "Ideal para realizar talleres de inducción antes del inicio de la prueba con estudiantes.",
        },
        {
          numero: 3,
          titulo: "Alineación con la Guía Docente 2026",
          descripcion: "Constatar que todas las preguntas y retos responden estrictamente a las 4 áreas curriculares oficiales del PNFT (7.°, 8.° y 9.° año).",
          consejo: "Garantiza congruencia pedagógica con el programa de Formación Tecnológica MEP.",
        },
      ],
    },
    tareas: [
      {
        id: "e1_t1",
        texto: "Paso 1: Identificar la cobertura territorial y los accesos asignados a nivel regional y nacional.",
        detalle: "Verificar cómo el sistema organiza las 27 Direcciones Regionales de Educación (DRE) y sus circuitos.",
      },
      {
        id: "e1_t2",
        texto: "Paso 2: Abrir y ensayar con las secciones de muestra para simulaciones de aula.",
        detalle: "Comprobar que las pruebas muestra permiten validar la herramienta sin alterar las bases de datos docentes.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Etapa 2: Identidad y configuración institucional (/registro)",
    subtitulo: "Gestión de perfil, asignación de 2 a 3 centros educativos y selección de secciones por nivel.",
    enlaceAccion: {
      texto: "Abrir Gestión de Acceso & Perfil",
      url: "/registro",
    },
    infografia: {
      titulo: "Infografía de Acceso y Configuración de Colegios",
      resumen: "Ruta de 4 pasos para autenticarse por PIN y personalizar las secciones atendidas.",
      pasos: [
        {
          numero: 1,
          titulo: "Ingreso ágil por PIN",
          descripcion: "En la pantalla /registro, hacer clic en la Pestaña 2 («Iniciar Sesión») y digitar la cédula o correo MEP junto al PIN de 4 dígitos.",
          consejo: "Para pruebas locales, puede utilizar la cédula 0-0000-0001 y el PIN 1111.",
        },
        {
          numero: 2,
          titulo: "Asignación de centros educativos",
          descripcion: "En la lista de colegios, marcar de 1 a 3 instituciones donde labora y activar las casillas de sus secciones reales (ej. 7-1, 8-2, 9-3).",
          consejo: "El sistema recordará su selección y la aplicará automáticamente en todos los módulos.",
        },
        {
          numero: 3,
          titulo: "Canal confidencial de asesoría",
          descripcion: "Comprobar el campo de teléfono móvil: es 100 % opcional y se utiliza únicamente para apoyo laboral y pedagógico sincrónico.",
          consejo: "Totalmente privado y confidencial; nunca se comparte ni se usa con fines comerciales.",
        },
        {
          numero: 4,
          titulo: "Mecanismo de recuperación OTP",
          descripcion: "Probar la Pestaña 3 («Recuperar PIN») para comprobar cómo se solicita y valida el código OTP de 4 dígitos por correo o SMS.",
          consejo: "Permite al docente recuperar el acceso en segundos en caso de olvido del PIN.",
        },
      ],
    },
    tareas: [
      {
        id: "e2_t1",
        texto: "Paso 1: Abrir /registro y seleccionar la Pestaña 2 de inicio de sesión con PIN de 4 dígitos.",
        detalle: "Probar el acceso ágil sin contraseñas alfanuméricas complejas desde el formulario oficial.",
      },
      {
        id: "e2_t2",
        texto: "Paso 2: Marcar los centros educativos asignados y activar las secciones atendidas en 7.°, 8.° y 9.° año.",
        detalle: "Revisar que la nómina de secciones se personaliza según la carga horaria real del docente.",
      },
      {
        id: "e2_t3",
        texto: "Paso 3: Validar la cláusula de confidencialidad y soporte sincrónico en el campo de teléfono móvil.",
        detalle: "Constatar que el teléfono es 100 % opcional, confidencial y aprobado exclusivamente para soporte con asesoría.",
      },
      {
        id: "e2_t4",
        texto: "Paso 4: Comprobar el flujo de recuperación de PIN mediante código OTP de 4 dígitos en la Pestaña 3.",
        detalle: "Verificar la solicitud y recepción del código de desbloqueo temporal por correo o mensajería.",
      },
    ],
  },
  {
    id: 3,
    titulo: "Etapa 3: Preparación técnica, equidad y enlaces protegidos",
    subtitulo: "Validación de condiciones del aula y generación de token criptográfico opaco (?token=...).",
    infografia: {
      titulo: "Infografía de Enlaces Protegidos y Equidad Técnica",
      resumen: "Generación de enlaces cifrados y códigos QR sin exponer datos del docente.",
      pasos: [
        {
          numero: 1,
          titulo: "Aseguramiento de equidad",
          descripcion: "Verificar previamente el funcionamiento de los equipos del laboratorio o planificar turnos rotativos para que el 100 % participe.",
          consejo: "Garantiza que ningún estudiante quede excluido por limitaciones de infraestructura física.",
        },
        {
          numero: 2,
          titulo: "Selección de colegio y grupo",
          descripcion: "En la barra superior, seleccionar el centro educativo, nivel (7.°, 8.° o 9.°) y la sección específica a evaluar.",
          consejo: "La herramienta contextualiza automáticamente los reactivos e indicadores según el nivel elegido.",
        },
        {
          numero: 3,
          titulo: "Generación de token opaco",
          descripcion: "Hacer clic en «Copiar Enlace Seguro». Verificar que la URL generada contenga únicamente un token cifrado (?token=...).",
          consejo: "Ningún dato personal (cédula, correo o teléfono) aparece en texto claro en la URL.",
        },
        {
          numero: 4,
          titulo: "Proyección o código QR institucional",
          descripcion: "Proyectar el código QR en la pantalla del laboratorio o compartir el enlace corto en la pizarra para acceso inmediato del grupo.",
          consejo: "Los estudiantes acceden de forma directa sin requerir registro previo ni cuentas personales.",
        },
      ],
    },
    tareas: [
      {
        id: "e3_t1",
        texto: "Paso 1: Validar previamente las condiciones técnicas y de equidad en el laboratorio de informática.",
        detalle: "Asegurar que el 100 % de los estudiantes cuente con los medios para realizar la prueba sin barreras.",
      },
      {
        id: "e3_t2",
        texto: "Paso 2: Generar el enlace institucional con token criptográfico opaco (Base64 / SHA-256).",
        detalle: "Comprobar que ningún dato personal del docente (cédula o teléfono) se expone en texto plano.",
      },
      {
        id: "e3_t3",
        texto: "Paso 3: Proyectar o imprimir el código QR institucional para el acceso inmediato del grupo.",
        detalle: "Verificar que el código QR conduce directamente a la sesión configurada de la sección.",
      },
    ],
  },
  {
    id: 4,
    titulo: "Etapa 4: Aplicación del diagnóstico estudiantil (con y sin conexión)",
    subtitulo: "Ejecución de actividades en las 4 áreas curriculares y uso del lector óptico offline.",
    infografia: {
      titulo: "Infografía de Aplicación Dual (Online vs. Offline)",
      resumen: "Flujo de resolución estudiantil con telemetría en la nube o sello QR sin internet.",
      pasos: [
        {
          numero: 1,
          titulo: "Resolución de retos curriculares",
          descripcion: "El estudiante responde retos interactivos en las 4 áreas: Apropiación, Programación, Robótica y Ciencia de Datos.",
          consejo: "La interfaz es intuitiva y adaptada a la Guía Docente 2026 para 7.°, 8.° y 9.° año.",
        },
        {
          numero: 2,
          titulo: "Modo con conexión (Telemetría directa)",
          descripcion: "Si el laboratorio tiene internet, las respuestas completadas viajan automáticamente en tiempo real a la nube central.",
          consejo: "El docente puede monitorear el avance del grupo desde su propio tablero.",
        },
        {
          numero: 3,
          titulo: "Modo sin conexión (Sello criptográfico)",
          descripcion: "Si no hay internet, la WebApp opera localmente y al finalizar genera un código QR de alta densidad y token SHA-256.",
          consejo: "Los datos quedan sellados e inviolables en la pantalla del estudiante sin requerir red.",
        },
        {
          numero: 4,
          titulo: "Importación docente por escáner",
          descripcion: "El docente abre el módulo de importación en su dispositivo, escanea el código QR del estudiante o pega el token alfanumérico.",
          consejo: "La nota y respuestas se incorporan de inmediato a la nómina oficial del grupo.",
        },
      ],
    },
    tareas: [
      {
        id: "e4_t1",
        texto: "Paso 1: Verificar la resolución de retos en las 4 áreas curriculares para 7.°, 8.° y 9.° año.",
        detalle: "Apropiación tecnológica, Programación y algoritmos, Computación física y robótica, y Ciencia de datos e IA.",
      },
      {
        id: "e4_t2",
        texto: "Paso 2: Probar la telemetría en tiempo real en modalidad con conectividad a internet.",
        detalle: "Constatar que las respuestas completadas viajan de inmediato al servicio central de telemetría.",
      },
      {
        id: "e4_t3",
        texto: "Paso 3: Probar la modalidad sin conectividad y la generación del token SHA-256 con código QR de alta densidad.",
        detalle: "Simular la conclusión de la prueba en un equipo sin internet para obtener el código de salida sellado.",
      },
      {
        id: "e4_t4",
        texto: "Paso 4: Utilizar el módulo de importación sin conexión (lector óptico por cámara o pegado de token).",
        detalle: "Escanear el código QR del estudiante o pegar su token alfanumérico para ingresar la nota a la nómina.",
      },
    ],
  },
  {
    id: 5,
    titulo: "Etapa 5: Evaluación directa docente (matriz de observación)",
    subtitulo: "Calificación práctica en laboratorio y dictamen combinado del nivel de logro.",
    infografia: {
      titulo: "Infografía de Evaluación Directa en Laboratorio",
      resumen: "Integración dual: prueba diagnóstica estudiantil + matriz de observación del docente.",
      pasos: [
        {
          numero: 1,
          titulo: "Apertura de la matriz docente",
          descripcion: "Abrir el instrumento de observación de laboratorio correspondiente al nivel escolar del grupo.",
          consejo: "Contiene los criterios cualitativos de observación directa para complementar la prueba digital.",
        },
        {
          numero: 2,
          titulo: "Valoración de saberes en el aula",
          descripcion: "Registrar el desempeño práctico del saber hacer (destreza técnica) y del saber ser (actitud ética y perseverancia).",
          consejo: "Permite una evaluación integral más allá del simple cuestionario conceptual.",
        },
        {
          numero: 3,
          titulo: "Unificación y cálculo del logro",
          descripcion: "El sistema combina la puntuación de la aplicación estudiantil con la matriz docente para emitir el dictamen final.",
          consejo: "Clasifica al estudiante en nivel Inicial, Intermedio o Avanzado con fundamento transparente.",
        },
      ],
    },
    tareas: [
      {
        id: "e5_t1",
        texto: "Paso 1: Abrir la matriz de observación del docente evaluador para el nivel correspondiente.",
        detalle: "Acceder al instrumento de evaluación práctica complementaria del laboratorio.",
      },
      {
        id: "e5_t2",
        texto: "Paso 2: Registrar las rúbricas cualitativas de desempeño en las cuatro áreas oficiales.",
        detalle: "Valorar el saber hacer y el saber ser del estudiantado durante el desarrollo de las actividades.",
      },
      {
        id: "e5_t3",
        texto: "Paso 3: Validar la emisión del dictamen combinado del nivel de logro (Inicial, Intermedio o Avanzado).",
        detalle: "Comprobar cómo se integran las evidencias de la aplicación estudiantil con la matriz docente.",
      },
    ],
  },
  {
    id: 6,
    titulo: "Etapa 6: Consolidación, analítica y recomendaciones DUA (/dashboard)",
    subtitulo: "Tablero de control con datos reales, semáforos comparativos y sugerencias pedagógicas.",
    enlaceAccion: {
      texto: "Abrir Dashboard Docente",
      url: "/dashboard",
    },
    infografia: {
      titulo: "Infografía de Analítica, Plan DUA y Exportación MEP",
      resumen: "Visualización de semáforos, formulación de apoyos pedagógicos y reportes oficiales.",
      pasos: [
        {
          numero: 1,
          titulo: "Filtrado institucional dinámico",
          descripcion: "En /dashboard, usar el menú selector para alternar entre sus centros educativos y visualizar las estadísticas de cada sección.",
          consejo: "Los datos y gráficas se refrescan al instante según la institución elegida.",
        },
        {
          numero: 2,
          titulo: "Inspección de semáforos por indicador",
          descripcion: "Analizar las gráficas de nivel de logro e identificar qué saberes o reactivos presentan mayor porcentaje de estudiantes en nivel Inicial.",
          consejo: "Permite priorizar las metas de mediación pedagógica para el primer periodo lectivo.",
        },
        {
          numero: 3,
          titulo: "Generación de plan DUA",
          descripcion: "Hacer clic en «Generar Recomendaciones DUA» para recibir estrategias diferenciadas por área (conceptual, procedimental y actitudinal).",
          consejo: "Orientaciones pedagógicas listas para incorporar en la plantilla de planeamiento didáctico.",
        },
        {
          numero: 4,
          titulo: "Exportación a Excel y PDF institucional",
          descripcion: "Descargar las actas y cuadros consolidados con formato oficial MEP para archivo y entrega a la administración.",
          consejo: "Genera documentos limpios y listos para imprimir o remitir por correo.",
        },
      ],
    },
    tareas: [
      {
        id: "e6_t1",
        texto: "Paso 1: Alternar centros educativos en el selector dinámico del tablero docente (/dashboard).",
        detalle: "Constatar que las secciones y gráficos estadísticos cambian al instante según el colegio elegido.",
      },
      {
        id: "e6_t2",
        texto: "Paso 2: Revisar los semáforos de nivel de logro y las gráficas comparativas por sección e indicador.",
        detalle: "Identificar la distribución porcentual y los reactivos con mayor necesidad de refuerzo.",
      },
      {
        id: "e6_t3",
        texto: "Paso 3: Generar recomendaciones DUA asistidas por inteligencia artificial multicapa.",
        detalle: "Verificar la formulación de estrategias pedagógicas diferenciadas (conceptuales, procedimentales y actitudinales).",
      },
      {
        id: "e6_t4",
        texto: "Paso 4: Exportar los informes consolidados de la sección a archivos oficiales de Excel y PDF.",
        detalle: "Validar la generación de reportes limpios con formato institucional MEP para el expediente formal.",
      },
    ],
  },
  {
    id: 7,
    titulo: "Etapa 7: Telemetría global, resiliencia de IA y autoauditoría diaria (5:00 a. m.)",
    subtitulo: "Respaldo en 6 capas, verificación de completitud 100 % e informes ejecutivos.",
    infografia: {
      titulo: "Infografía de Resiliencia, Integridad y Auditoría Matutina",
      resumen: "Arquitectura multicapa de respaldo continuo y verificación automática diaria.",
      pasos: [
        {
          numero: 1,
          titulo: "Arquitectura de resiliencia multicapa",
          descripcion: "Conocer el circuito de tolerancia a fallos: Caché SHA-256 (0 ms) ➔ Capa 1 ➔ Capa 2 ➔ Capa 3 ➔ Capa 4 ➔ Degradación local 503.",
          consejo: "Garantiza que la aplicación nunca se congele ante problemas de conectividad externa.",
        },
        {
          numero: 2,
          titulo: "Regla estricta de completitud 100 %",
          descripcion: "Verificar que el sistema únicamente procese evaluaciones con el 100 % de reactivos respondidos con firma criptográfica.",
          consejo: "Evita distorsiones estadísticas por reactivos omitidos o pruebas incompletas.",
        },
        {
          numero: 3,
          titulo: "Autoauditoría diaria a las 5:00 a. m.",
          descripcion: "El servicio cron ejecuta pings automáticos de salud a los modelos y despacha el reporte al correo oficial MEP y WhatsApp.",
          consejo: "Mantiene la plataforma autoconfigurada y supervisada antes del inicio de la jornada escolar.",
        },
      ],
    },
    tareas: [
      {
        id: "e7_t1",
        texto: "Paso 1: Comprender la arquitectura de respaldo multicapa ante caídas de servicios externos.",
        detalle: "Garantizar que la plataforma no se congela ante fallas o desconexiones de red externas.",
      },
      {
        id: "e7_t2",
        texto: "Paso 2: Comprobar la regla de integridad y completitud evaluativa del 100 % de reactivos respondidos.",
        detalle: "Verificar que únicamente los paquetes de respuestas completos se registran en el expediente del grupo.",
      },
      {
        id: "e7_t3",
        texto: "Paso 3: Inspeccionar el despacho del informe de autoauditoría diaria a las 5:00 a. m. a correo MEP y WhatsApp.",
        detalle: "Validar el envío automático del reporte de disponibilidad y salud de la plataforma.",
      },
    ],
  },
];

interface SubareaOficial {
  nombre: string;
  perfilSalida: string;
}

interface SaberIndicadorOficial {
  saber: string;
  indicador: string;
}

interface AreaCurricularOficial {
  id: number;
  nombre: string;
  nombreCorto: string;
  competenciaEspecifica: string;
  resultadoAprendizaje: string;
  subareas: SubareaOficial[];
  saberesIndicadores: SaberIndicadorOficial[];
}

const AREAS_OFICIALES_GUIA_2026: AreaCurricularOficial[] = [
  {
    id: 1,
    nombre: "Apropiación tecnológica y digital",
    nombreCorto: "1. Apropiación tecnológica y digital",
    competenciaEspecifica:
      "Crea productos con ayuda de herramientas digitales para aprovecharlos en su desarrollo personal, académico o profesional, de acuerdo con las normas de ciberseguridad y ética digital.",
    resultadoAprendizaje:
      "Combina herramientas digitales, tomando en cuenta fundamentos de tecnología, impacto de las TIC, seguridad y privacidad digital y, su experiencia de uso, en la realización de productos digitales.",
    subareas: [
      {
        nombre: "Fundamentos de tecnología",
        perfilSalida:
          "Implementa vocabulario técnico relacionado con la tecnología, tal como: software, hardware, IoT, protocolos de comunicación, software malicioso, riesgos en línea, IDE, hacker, huella digital, almacenamiento en la nube y base de datos.",
      },
      {
        nombre: "Experiencias de uso con la tecnología",
        perfilSalida:
          "Utiliza de manera competente herramientas de comunicación digital, como el correo electrónico y los chats en línea, aplicando normas de netiqueta y seguridad en la comunicación, siendo consciente del comportamiento inapropiado en línea. Integra programas y aplicaciones de programación o productividad de diseño gráfico y edición de video para el desarrollo de proyectos creativos y producción de contenido, mediante la creación y edición de imágenes, videos y audio, para expresar sus ideas de manera efectiva. Realiza búsquedas efectivas en línea y evalúa críticamente la información que encuentra, distinguiendo entre fuentes confiables y no confiables, evaluando la calidad y la relevancia de la información, citando sus fuentes adecuadamente. Utiliza aplicaciones de almacenamiento en la nube, que le permiten trabajar de manera colaborativa.",
      },
      {
        nombre: "Seguridad digital y gestión de riesgos",
        perfilSalida:
          "Aplica medidas de seguridad para proteger su privacidad y disminuir los riesgos en línea.",
      },
    ],
    saberesIndicadores: [
      {
        saber: "Software",
        indicador:
          "Analizar los tipos de software según su función, comparando las características y usos en diferentes contextos personales, académicos o sociales.",
      },
      {
        saber: "Redes de comunicación",
        indicador:
          "Reconocer las redes de comunicación a partir de su arquitectura, protocolos (como HTTP, HTTPS y TCP/IP) e interfaces, comprendiendo su funcionamiento durante el intercambio de datos y la gestión de archivos compartidos.",
      },
      {
        saber: "Conexión entre dispositivos",
        indicador:
          "Distinguir las formas de conexión entre dispositivos mediante comunicación física o inalámbrica, identificando sus aplicaciones en contextos cotidianos.",
      },
      {
        saber: "Sistema operativo",
        indicador:
          "Aplicar técnicas de optimización del sistema operativo, identificando cómo gestionar memoria, desfragmentar discos, limpiar caché y actualizar el sistema para el mejoramiento del desempeño de dispositivos.",
      },
      {
        saber: "Herramientas de productividad",
        indicador:
          "Aplicar el procesador de texto, editor de presentaciones, hoja de cálculo y gestores de bases de datos para organizar datos, establecer relaciones y crear productos comunicativos adecuados al propósito.",
      },
      {
        saber: "Herramientas de creación multimedia",
        indicador:
          "Utilizar herramientas de creación de contenido multimedia para edición de audio, video, gráficos y modelado 3D, aplicando funciones básicas de creación y edición en productos digitales.",
      },
      {
        saber: "Internet, navegador y buscador",
        indicador:
          "Utilizar el navegador y el buscador web para acceder y localizar información en línea, gestionando pestañas y aplicando estrategias básicas de búsqueda con principios de seguridad y fuentes confiables.",
      },
      {
        saber: "Netiqueta y colaboración sincrónica / asincrónica",
        indicador:
          "Utilizar herramientas de comunicación y colaboración (correo electrónico, chats, videollamadas), aplicando normas de netiqueta en la redacción, interacción y participación respetuosa en entornos digitales.",
      },
      {
        saber: "Almacenamiento en la nube",
        indicador:
          "Utilizar el almacenamiento en la nube para guardar, organizar y compartir archivos digitales, reconociendo sus ventajas en el acceso y colaboración desde diferentes dispositivos.",
      },
      {
        saber: "Referencias bibliográficas",
        indicador:
          "Aplicar formatos básicos de referencias bibliográficas en producciones digitales o escritas, integrando datos como autor, título, fuente y fecha, reconociendo la procedencia de la información.",
      },
      {
        saber: "Contraseñas seguras",
        indicador:
          "Crear contraseñas seguras con generadores aleatorios, comprendiendo sus características e importancia para la protección de la información personal en entornos digitales.",
      },
      {
        saber: "Huella digital",
        indicador:
          "Analizar la utilidad e implicaciones de la huella digital, valorando cómo las acciones en línea afectan la identidad, reputación y seguridad personal en entornos digitales.",
      },
      {
        saber: "Software malicioso y riesgos en línea",
        indicador:
          "Identificar y analizar riesgos en línea (suplantación de identidad, grooming, phishing, noticias falsas, ciberacoso, sexting y ciberadicción), valorando acciones básicas de prevención y autocuidado.",
      },
      {
        saber: "Derechos de autor y licenciamiento",
        indicador:
          "Reconocer la importancia de los derechos de autor y el licenciamiento, aplicando buenas prácticas de uso ético y legal de contenidos digitales.",
      },
      {
        saber: "Internet de las cosas (IoT)",
        indicador:
          "Analizar aplicaciones del Internet de las cosas en la automatización de tareas, valorando sus ventajas y desventajas en contextos cotidianos.",
      },
      {
        saber: "Criptomonedas",
        indicador:
          "Reconocer la utilidad e implicaciones del uso de criptomonedas en entornos digitales cotidianos como juegos, plataformas virtuales o pagos en línea.",
      },
    ],
  },
  {
    id: 2,
    nombre: "Programación y algoritmos",
    nombreCorto: "2. Programación y algoritmos",
    competenciaEspecifica:
      "Resuelve problemas mediante la programación de algoritmos para desarrollar el pensamiento lógico matemático, tomando en cuenta las prácticas y actitudes del pensador computacional.",
    resultadoAprendizaje:
      "Integra conceptos de programación como eventos, operadores, estructuras de datos, estructuras de control, procedimientos, funciones, colecciones de datos y algoritmos (diagrama de flujo y pseudocódigo), en la solución de problemas reales.",
    subareas: [
      {
        nombre: "Fundamentos de programación",
        perfilSalida:
          "Diseña interfaces físicas o digitales para resolver problemas complejos de su contexto y así implementar funcionalidades y familiarizarse con el ciclo de vida de un programa o aplicación. Aplica conceptos de programación como funciones, variables, estructuras de datos y control de flujo en la solución programada, según lo requiera. Resuelve problemas mediante la programación por bloques o la programación textual.",
      },
      {
        nombre: "Lenguajes de programación",
        perfilSalida:
          "Crea prototipos de artefactos físicos programados en entornos de programación textual.",
      },
    ],
    saberesIndicadores: [
      {
        saber: "Entorno de programación (IDE)",
        indicador:
          "Aplicar el entorno de programación textual o por bloques para programar soluciones y mecanismos robóticos, utilizando estructuras y eventos en la solución de actividades de automatización.",
      },
      {
        saber: "Lógica de programación",
        indicador:
          "Desarrollar la lógica computacional requerida para modelar secuencias, evaluar condiciones y estructurar soluciones deterministas a problemas del entorno.",
      },
      {
        saber: "Algoritmo",
        indicador:
          "Diseñar un algoritmo para resolver un problema, representándolo de forma estructurada mediante pseudocódigo o diagramas de flujo.",
      },
      {
        saber: "Dato y Variable",
        indicador:
          "Comprender y aplicar la declaración, asignación y manipulación de datos y variables en soluciones programadas.",
      },
      {
        saber: "Operadores aritméticos y relacionales",
        indicador:
          "Aplicar operaciones matemáticas básicas y comparaciones relacionales en la evaluación de condiciones dentro de la lógica del programa.",
      },
      {
        saber: "Operadores lógicos",
        indicador:
          "Aplicar operadores lógicos (Y, O, NO) en la resolución de desafíos de programación que impliquen decisiones complejas.",
      },
      {
        saber: "Estructuras condicionales",
        indicador:
          "Implementar bifurcaciones de control para dirigir el flujo del programa según el cumplimiento de condiciones evaluadas.",
      },
      {
        saber: "Estructuras repetitivas",
        indicador:
          "Utilizar bucles y repeticiones controladas para ejecutar secuencias de instrucciones de manera eficiente.",
      },
      {
        saber: "Procedimientos y/o funciones",
        indicador:
          "Aplicar procedimientos y/o funciones como estructura modular, a través de su declaración e invocación, haciendo uso de parámetros y argumentos durante la solución de desafíos programados.",
      },
      {
        saber: "Eventos",
        indicador:
          "Configurar disparadores interactivos que responden a acciones del usuario o señales del sistema durante la ejecución del programa.",
      },
    ],
  },
  {
    id: 3,
    nombre: "Computación física y robótica",
    nombreCorto: "3. Computación física y robótica",
    competenciaEspecifica:
      "Crea artefactos físicos o robots para proponer soluciones a problemas de su entorno a través de prototipos, de acuerdo con las normas y principios de electrónica, programación y robótica.",
    resultadoAprendizaje:
      "Aplica fundamentos de robótica, computación física, electrónica, mecánica y sistemas robóticos autónomos en la programación y construcción de prototipos que resuelven un problema.",
    subareas: [
      {
        nombre: "Principios de computación física y robótica",
        perfilSalida:
          "Aplica principios de diseño de robots incluyendo sus componentes y los desafíos éticos y legales.",
      },
      {
        nombre: "Mecánica y diseño de robots",
        perfilSalida:
          "Implementa los diferentes tipos de mecanismos para generar fuerza y velocidad.",
      },
      {
        nombre: "Electrónica y circuitos",
        perfilSalida:
          "Experimenta con componentes electrónicos básicos (resistencias y LEDs) y su conexión en distintos tipos de circuitos.",
      },
      {
        nombre: "Creación de prototipos",
        perfilSalida:
          "Crea prototipos de artefactos físicos o robots que permitan automatizar una tarea o resolver un problema de la realidad.",
      },
    ],
    saberesIndicadores: [
      {
        saber: "Robot y Robótica",
        indicador:
          "Reconocer qué es un robot, sus tipos y componentes (cuerpo, sistema sensorial y sistema de control), diferenciando la computación física de la robótica e identificando cómo se integran sensores, actuadores y sistemas de control.",
      },
      {
        saber: "Mecánica aplicada a la robótica",
        indicador:
          "Emplear principios de la mecánica aplicados a la robótica, como la estructura y la estabilidad, en el diseño de mecanismos robóticos.",
      },
      {
        saber: "Mecanismos y movimiento",
        indicador:
          "Reconocer los tipos de mecanismos, identificando su función principal en la transmisión y transformación del movimiento (entrada y salida) para generar fuerza y velocidad mediante simulación de prototipos.",
      },
      {
        saber: "Circuito eléctrico y fundamentos de electrónica",
        indicador:
          "Identificar los componentes de un circuito eléctrico y su funcionamiento (carga eléctrica, voltaje, corriente, resistencias e interruptores), reconociendo la función de pines de entrada y salida y la diferencia entre señales analógicas y digitales.",
      },
      {
        saber: "Microcontrolador",
        indicador:
          "Comprender y aplicar las funciones de un microcontrolador, utilizando pines digitales y analógicos, conexión a VCC y GND y estableciendo la comunicación con sensores y actuadores durante la simulación o construcción de prototipos.",
      },
      {
        saber: "Sensor (Entradas)",
        indicador:
          "Integrar un sensor en un prototipo, utilizando sus datos como entrada para generar respuestas automatizadas mediante un microcontrolador.",
      },
      {
        saber: "Actuador (Salidas)",
        indicador:
          "Integrar un actuador en un prototipo, programando su activación como respuesta a entradas digitales o condiciones del sistema mediante un microcontrolador.",
      },
      {
        saber: "Domótica",
        indicador:
          "Analizar los usos, aplicaciones y beneficios de la domótica, mediante la creación o simulación de un prototipo que responda a necesidades reales en un entorno cotidiano.",
      },
      {
        saber: "Prototipos",
        indicador:
          "Construir prototipos que integren sensores, actuadores y un microcontrolador, a partir de una necesidad identificada en su contexto.",
      },
    ],
  },
  {
    id: 4,
    nombre: "Ciencia de datos e inteligencia artificial",
    nombreCorto: "4. Ciencia de datos e inteligencia artificial",
    competenciaEspecifica:
      "Analiza datos apoyándose en la estadística, matemáticas, programación y el conocimiento de dominio, para procesar datos que le permitan tomar decisiones y mejorar procesos en diferentes campos, tomando en cuenta los principios de ciencia de datos, inteligencia artificial y ciberseguridad.",
    resultadoAprendizaje:
      "Analiza datos mediante herramientas digitales que permiten su visualización para la toma de decisiones en situaciones cotidianas y reconoce aspectos fundamentales de la inteligencia artificial, incluyendo sus aplicaciones actuales y desafíos asociados.",
    subareas: [
      {
        nombre: "Introducción a los datos",
        perfilSalida:
          "Conoce la importancia de los datos en situaciones cotidianas como control de redes sociales, historial de navegación y localización. Conoce cómo se almacenan, gestionan y protegen los datos a lo largo de su ciclo de vida, aplicando principios de responsabilidad y seguridad digital.",
      },
      {
        nombre: "Organización y representación de datos",
        perfilSalida:
          "Comprende la importancia de recolectar y organizar datos personales como gastos, notas, actividad física o salud.",
      },
      {
        nombre: "Introducción a la inteligencia artificial",
        perfilSalida:
          "Conoce los fundamentos de la inteligencia artificial y reflexiona críticamente sobre sus beneficios, riesgos y desafíos en la actualidad. Identifica el funcionamiento de los asistentes virtuales y las herramientas generativas, comprendiendo la importancia de usarlos de forma segura, ética y responsable.",
      },
    ],
    saberesIndicadores: [
      {
        saber: "Dato y tipos de dato",
        indicador:
          "Identificar tipos de dato (numéricos, de texto, de ubicación y de imágenes), analizando cómo influyen en decisiones y/o comportamientos en redes sociales, historiales de navegación o sistemas de localización, reconociendo la importancia de su organización y conservación.",
      },
      {
        saber: "Almacenamiento y ciclo de vida del dato",
        indicador:
          "Reconocer el ciclo de vida del dato en el almacenamiento de datos, identificando las etapas de creación, uso, conservación y eliminación responsable de la información en contextos educativos o personales.",
      },
      {
        saber: "Recolección y organización de datos",
        indicador:
          "Aplicar técnicas de recolección de datos mediante registros escolares y personales (gastos, notas, actividades deportivas o datos médicos simples), organizando y representando la información en tablas y hojas de cálculo para la toma de decisiones.",
      },
      {
        saber: "Fundamentos de la inteligencia artificial",
        indicador:
          "Reconocer los fundamentos de la inteligencia artificial, identificando el concepto, cómo funciona, cómo se diferencia de otros sistemas digitales y sus aplicaciones en el contexto personal y laboral.",
      },
      {
        saber: "Asistentes virtuales",
        indicador:
          "Identificar qué son los asistentes virtuales basados en inteligencia artificial, reconociendo su utilidad al interactuar con herramientas digitales, bajo criterios de seguridad y responsabilidad.",
      },
      {
        saber: "Herramientas generativas",
        indicador:
          "Utilizar y aplicar herramientas generativas basadas en inteligencia artificial en la producción o modificación de contenido digital (texto, imagen o audio), considerando criterios de seguridad, propiedad intelectual y responsabilidad digital.",
      },
      {
        saber: "Desafíos de la inteligencia artificial",
        indicador:
          "Reconocer los desafíos de la inteligencia artificial, identificando riesgos como sesgos, manipulación de información, dependencia tecnológica y privacidad de datos, reflexionando sobre su impacto en la vida laboral, personal y social.",
      },
    ],
  },
];

const EJES_TRANSVERSALES_OFICIALES = [
  {
    eje: "Pensamiento computacional",
    componentes: [
      {
        nombre: "Pensamiento algorítmico",
        detalle:
          "Construye algoritmos teniendo en cuenta la eficiencia y el rendimiento para la resolución de problemas.",
      },
      {
        nombre: "Abstracción",
        detalle:
          "Utiliza funciones o procedimientos para encapsular y abstraer bloques de código reutilizables, modulando y organizando el código para mayor eficiencia y legibilidad.",
      },
      {
        nombre: "Descomposición",
        detalle:
          "Descompone problemas complejos en subproblemas más pequeños y los aborda sistemáticamente mediante diagramas de flujo u otras representaciones visuales.",
      },
      {
        nombre: "Reconocimiento de patrones",
        detalle:
          "Analiza patrones en datos, algoritmos y problemas para obtener regularidades y estructuras repetitivas que ayuden a resolver problemas eficientemente.",
      },
    ],
  },
  {
    eje: "Ciudadanía y ética digital",
    componentes: [
      {
        nombre: "Ciudadanía digital",
        detalle:
          "Reflexiona sobre cómo la actividad en línea genera rastros permanentes (huella digital) que impactan en la reputación y oportunidades futuras, gestionando responsablemente la presencia en línea.",
      },
      {
        nombre: "Ética digital",
        detalle:
          "Aplica conceptos de ética y moralidad en el entorno digital, fomentando la empatía, el respeto, la consideración, evitando el ciberacoso y promoviendo relaciones digitales saludables.",
      },
    ],
  },
  {
    eje: "Emprendimiento e innovación",
    componentes: [
      {
        nombre: "Emprendimiento",
        detalle:
          "Desarrolla habilidades de liderazgo en equipo, asumiendo roles, tomando decisiones y delegando responsabilidades con comunicación efectiva.",
      },
      {
        nombre: "Innovación",
        detalle:
          "Integra el uso de diversas herramientas de productividad y programación para generar soluciones innovadoras a problemas reales.",
      },
    ],
  },
];

const PRACTICAS_PENSADOR_COMPUTACIONAL = [
  {
    practica: "Reconoce patrones",
    detalle:
      "Predice a partir de las regularidades, similitudes o características comunes de un conjunto de datos o situaciones, patrones que pueda aplicar en la solución a un problema o situación.",
  },
  {
    practica: "Abstrae",
    detalle:
      "Concluye cuáles son las características relevantes que debe considerar y cuáles debe omitir, al resolver un problema o situación.",
  },
  {
    practica: "Generaliza",
    detalle:
      "Generaliza las funcionalidades o estructuras generales de un elemento que pueda aprovechar en otros contextos al resolver un problema o situación.",
  },
  {
    practica: "Transfiere",
    detalle:
      "Transfiere conocimientos, habilidades y estrategias aprendidas previamente en un contexto específico, a situaciones diferentes y nuevas al resolver un problema o situación.",
  },
  {
    practica: "Modulariza",
    detalle:
      "Resuelve un problema por partes menos complejas, sin perder de vista el todo que las origina, al resolver un problema o situación.",
  },
  {
    practica: "Formula algoritmos",
    detalle:
      "Formula algoritmos por medio de una secuencia ordenada y detallada de pasos para resolver un problema o situación.",
  },
  {
    practica: "Remezcla",
    detalle:
      "Combina diferentes ideas, técnicas o soluciones existentes, con la autorización correspondiente, de manera innovadora y creativa para resolver un problema o situación.",
  },
  {
    practica: "Depura",
    detalle:
      "Valida el funcionamiento de los algoritmos en busca de errores para corregirlos al resolver un problema o situación.",
  },
  {
    practica: "Programa",
    detalle:
      "Programa mediante un entorno o IDE de programación para resolver un problema o situación.",
  },
  {
    practica: "Comunica",
    detalle:
      "Comunica ideas o soluciones a problemas o situaciones de manera creativa, coherente y comprensible, compartiendo conocimientos con otros al resolver un problema o situación.",
  },
  {
    practica: "Colabora",
    detalle:
      "Demuestra un trato constructivo y respetuoso para resolver un problema o situación específica, al trabajar con otros y así apoyar su aprendizaje y contribuir al de los demás.",
  },
  {
    practica: "Piensa de forma creativa",
    detalle:
      "Desarrolla soluciones ingeniosas, innovadoras, originales con enfoques no convencionales, al resolver un problema o situación.",
  },
];

const ACTITUDES_PENSADOR_COMPUTACIONAL = [
  {
    actitud: "Gusto por la precisión",
    detalle:
      "Demuestra ante los procesos de aprendizaje un comportamiento hacia la búsqueda de la exactitud, al ser minucioso con los detalles.",
  },
  {
    actitud: "Aprender del error",
    detalle:
      "Demuestra ante los errores un comportamiento que le permita ganar experiencia a partir de lecciones aprendidas producto de los errores, convirtiendo los desaciertos en oportunidades de aprendizaje.",
  },
  {
    actitud: "Flexibilidad para manejar problemas",
    detalle:
      "Demuestra un comportamiento hacia la adaptabilidad, flexibilidad y resiliencia ante los desafíos o situaciones imprevistas producto del entorno, la interacción con otros, o bien, con los recursos.",
  },
  {
    actitud: "Tolerancia a la frustración",
    detalle:
      "Demuestra ante los desafíos, un comportamiento hacia la búsqueda de la autoconfianza, motivación, autocontrol, paciencia y persistencia.",
  },
  {
    actitud: "Maneja las tecnologías de forma ética y segura",
    detalle:
      "Aplica de manera consciente fundamentos de ética y seguridad digital al utilizar herramientas y recursos tecnológicos al resolver un problema o situación.",
  },
];

export default function RecursoAprendizajeAutogestionado() {
  const { docente } = useDocente();

  // Clave de almacenamiento ligada al usuario activo
  const storageKeyTareas = `mep_aprendizaje_tareas_${docente?.idDocente || docente?.cedula || "anonimo"}`;
  const storageKeyApuntes = `mep_aprendizaje_apuntes_${docente?.idDocente || docente?.cedula || "anonimo"}`;

  const [tareasCompletadas, setTareasCompletadas] = useState<Record<string, boolean>>({});
  const [apuntesDocente, setApuntesDocente] = useState<string>("");
  const [etapaAbierta, setEtapaAbierta] = useState<number>(1);
  const [areaGlosarioAbierta, setAreaGlosarioAbierta] = useState<number>(1);
  const [casoContingenciaAbierto, setCasoContingenciaAbierto] = useState<number | null>(null);
  const [copiadoExitoso, setCopiadoExitoso] = useState<boolean>(false);
  const [guardadoAutomatico, setGuardadoAutomatico] = useState<boolean>(false);

  // Cargar estado guardado al iniciar
  useEffect(() => {
    try {
      const rawTareas = localStorage.getItem(storageKeyTareas);
      if (rawTareas) {
        setTareasCompletadas(JSON.parse(rawTareas));
      }
      const rawApuntes = localStorage.getItem(storageKeyApuntes);
      if (rawApuntes) {
        setApuntesDocente(rawApuntes);
      }
    } catch (e) {}
  }, [storageKeyTareas, storageKeyApuntes]);

  // Total de tareas
  const totalTareas = ETAPAS_DATOS.reduce((acc, e) => acc + e.tareas.length, 0);
  const tareasHechasCount = Object.values(tareasCompletadas).filter(Boolean).length;
  const porcentajeProgreso = Math.round((tareasHechasCount / totalTareas) * 100);

  // Alternar tarea
  const toggleTarea = (idTarea: string) => {
    const nuevoEstado = {
      ...tareasCompletadas,
      [idTarea]: !tareasCompletadas[idTarea],
    };
    setTareasCompletadas(nuevoEstado);
    try {
      localStorage.setItem(storageKeyTareas, JSON.stringify(nuevoEstado));
      notificarGuardado();
    } catch (e) {}
  };

  // Manejar cambio de apuntes con autoguardado
  const handleCambioApuntes = (texto: string) => {
    setApuntesDocente(texto);
    try {
      localStorage.setItem(storageKeyApuntes, texto);
      notificarGuardado();
    } catch (e) {}
  };

  const notificarGuardado = () => {
    setGuardadoAutomatico(true);
    setTimeout(() => setGuardadoAutomatico(false), 2000);
  };

  // Insertar plantillas guiadas en los apuntes
  const insertarPlantilla = (tipo: "dua" | "seguimiento") => {
    const fechaHora = new Date().toLocaleString("es-CR");
    let plantilla = "";

    if (tipo === "dua") {
      plantilla = `\n\n--- [PLAN DE APOYO PEDAGÓGICO DUA • ${fechaHora}] ---\n` +
        `• Fortalezas observadas en el grupo: \n` +
        `• Barreras identificadas (Saber / Saber Hacer / Saber Ser): \n` +
        `• Estrategias de representación y acción múltiple DUA: \n` +
        `• Ajustes para estudiantes en nivel Inicial: \n`;
    } else {
      plantilla = `\n\n--- [ACUERDOS DE AULA Y SEGUIMIENTO • ${fechaHora}] ---\n` +
        `• Centro Educativo / Sección: \n` +
        `• Acciones prioritarias en las 4 áreas curriculares: \n` +
        `• Coordinación con el Comité de Evaluación: \n` +
        `• Próxima fecha de revisión de avances: \n`;
    }

    const nuevoTexto = apuntesDocente ? apuntesDocente + plantilla : plantilla.trimStart();
    handleCambioApuntes(nuevoTexto);
  };

  // Copiar al portapapeles
  const copiarBitacora = () => {
    const textoCompleto = `RESUMEN DE APRENDIZAJE Y VALIDACIÓN DE LA HERRAMIENTA MEP\n` +
      `Docente: ${docente?.nombreCompleto || "Docente MEP"}\n` +
      `Progreso de Verificación: ${porcentajeProgreso}% (${tareasHechasCount} de ${totalTareas} pasos completados)\n\n` +
      `--- APUNTES Y REFLEXIONES DEL DOCENTE ---\n` +
      `${apuntesDocente || "(Sin notas registradas aún)"}\n\n` +
      `Fecha de Registro: ${new Date().toLocaleString("es-CR")}\n` +
      `Ministerio de Educación Pública • Formación Tecnológica`;

    navigator.clipboard.writeText(textoCompleto);
    setCopiadoExitoso(true);
    setTimeout(() => setCopiadoExitoso(false), 2500);
  };

  // Descargar archivo de texto
  const descargarBitacora = () => {
    const contenido = `# Bitácora de Aprendizaje y Validación de la Herramienta MEP\n\n` +
      `**Docente:** ${docente?.nombreCompleto || "Docente MEP"}\n` +
      `**Cédula:** ${docente?.cedula || "N/A"}\n` +
      `**Institución:** ${docente?.institucionNombre || "Centro Educativo MEP"}\n` +
      `**Progreso Global:** ${porcentajeProgreso}% (${tareasHechasCount}/${totalTareas} verificaciones cumplidas)\n` +
      `**Fecha:** ${new Date().toLocaleString("es-CR")}\n\n` +
      `---\n\n` +
      `## 1. Verificaciones por Etapa\n\n` +
      ETAPAS_DATOS.map((etapa) => {
        const tareasEtapa = etapa.tareas.map((t) => {
          const check = tareasCompletadas[t.id] ? "[X]" : "[ ]";
          return `${check} ${t.texto}\n    ${t.detalle}`;
        }).join("\n");
        return `### ${etapa.titulo}\n${tareasEtapa}\n`;
      }).join("\n") +
      `\n---\n\n` +
      `## 2. Apuntes Personales y Reflexiones Pedagógicas\n\n` +
      (apuntesDocente || "*No se registraron notas adicionales.*") +
      `\n\n---\n*Generado automáticamente desde la plataforma de Diagnóstico Secundaria • MEP*`;

    const blob = new Blob([contenido], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bitacora_Aprendizaje_MEP_${docente?.cedula || "Docente"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Imprimir bitácora
  const imprimirBitacora = () => {
    window.print();
  };

  return (
    <section className="bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-8 animate-fadeIn">
      {/* Cabecera del Recurso */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-black">
            <GraduationCap size={16} weight="bold" />
            <span>Recurso Oficial Autogestionado • PNFT MEP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            GUÍA INTERACTIVA AUTOGESTIONADA DE APRENDIZAJE Y VALIDACIÓN
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Ruta Sistemática de Validación & Bitácora Docente: Siga paso a paso las 7 etapas del ciclo de evaluación, consulte el glosario de las 4 áreas oficiales de la <strong>Guía Docente 2026</strong> y conserve sus apuntes pedagógicos con guardado automático en su cuenta.
          </p>
        </div>

        {/* Nivel de Madurez */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[170px] shrink-0 text-center shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Estado de Dominio</span>
          <span className={`text-base font-black mt-0.5 ${porcentajeProgreso === 100 ? "text-emerald-700" : porcentajeProgreso >= 50 ? "text-indigo-700" : "text-amber-700"}`}>
            {porcentajeProgreso === 100 ? "🎉 Dominio Completo" : porcentajeProgreso >= 50 ? "⚡ En Progreso" : "🌱 Iniciando"}
          </span>
          <span className="text-xs text-stone-600 font-mono font-bold mt-1">
            {tareasHechasCount} de {totalTareas} verificados
          </span>
        </div>
      </div>

      {/* Barra de Progreso Dinámica */}
      <div className="space-y-2 bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-900">
          <div className="flex items-center gap-2">
            <Sparkle size={18} className="text-emerald-700" weight="fill" />
            <span>Progreso General de Validación:</span>
          </div>
          <span className="text-emerald-800 text-base font-mono font-black">{porcentajeProgreso}%</span>
        </div>

        <div className="w-full bg-stone-200 rounded-full h-3.5 overflow-hidden shadow-inner">
          <div
            className="bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-600 h-3.5 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${porcentajeProgreso}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-medium">
          <span>{totalTareas - tareasHechasCount} pasos pendientes para completar el ciclo integral</span>
          {guardadoAutomatico && (
            <span className="text-emerald-800 font-bold flex items-center gap-1 animate-fadeIn">
              <FloppyDisk size={13} weight="bold" /> Guardado en tu cuenta
            </span>
          )}
        </div>
      </div>

      {/* Glosario Didáctico de las Cuatro Áreas Oficiales (Guía Docente 2026) */}
      <div className="bg-stone-50/90 border border-stone-300 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-700" weight="bold" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Glosario oficial de las cuatro áreas curriculares (Guía Docente 2026)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            Marco curricular oficial para 7.°, 8.° y 9.° año (III Ciclo)
          </span>
        </div>

        {/* Selector de Pestañas del Glosario */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {AREAS_OFICIALES_GUIA_2026.map((area) => {
            const iconos = [DeviceMobile, Code, Robot, Database];
            const IconoComp = iconos[area.id - 1] || DeviceMobile;
            const colores = [
              "text-emerald-700",
              "text-blue-700",
              "text-amber-700",
              "text-purple-700",
            ];
            const bgs = [
              "bg-emerald-700 text-white",
              "bg-blue-700 text-white",
              "bg-amber-700 text-white",
              "bg-purple-700 text-white",
            ];
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => setAreaGlosarioAbierta(area.id)}
                className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 ${
                  areaGlosarioAbierta === area.id
                    ? bgs[area.id - 1] + " shadow-xs ring-2 ring-stone-400/20"
                    : "bg-white border border-stone-200 text-slate-700 hover:bg-stone-100"
                }`}
              >
                <IconoComp
                  size={16}
                  weight="bold"
                  className={areaGlosarioAbierta === area.id ? "text-white" : colores[area.id - 1]}
                />
                <span className="truncate">{area.nombreCorto}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setAreaGlosarioAbierta(5)}
            className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 ${
              areaGlosarioAbierta === 5
                ? "bg-slate-800 text-white shadow-xs ring-2 ring-stone-400/20"
                : "bg-white border border-stone-200 text-slate-700 hover:bg-stone-100"
            }`}
          >
            <Lightbulb
              size={16}
              weight="bold"
              className={areaGlosarioAbierta === 5 ? "text-white" : "text-slate-700"}
            />
            <span className="truncate">5. Ejes transversales</span>
          </button>
        </div>

        {/* Contenido Oficial según Área Seleccionada */}
        {areaGlosarioAbierta >= 1 && areaGlosarioAbierta <= 4 && (() => {
          const areaActiva = AREAS_OFICIALES_GUIA_2026.find((a) => a.id === areaGlosarioAbierta)!;
          return (
            <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-4 animate-fadeIn">
              {/* Encabezado del Área */}
              <div className="border-b border-stone-100 pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
                  Área de Conocimiento Oficial • PNFT
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {areaActiva.nombre}
                </h4>
              </div>

              {/* Competencia Específica y Resultado de Aprendizaje */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-black uppercase text-emerald-950 block">
                    Competencia específica del PNFT por área:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    «{areaActiva.competenciaEspecifica}»
                  </p>
                </div>

                <div className="p-3.5 bg-sky-50/60 border border-sky-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-black uppercase text-sky-950 block">
                    Resultado de aprendizaje (RdA):
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    «{areaActiva.resultadoAprendizaje}»
                  </p>
                </div>
              </div>

              {/* Subáreas y Perfiles de Salida */}
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Subáreas oficiales y perfiles de salida de estudiantes:
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {areaActiva.subareas.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5"
                    >
                      <span className="text-xs font-bold text-slate-900 block border-b border-stone-200 pb-1">
                        Subárea: {sub.nombre}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {sub.perfilSalida}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Saberes Conceptuales e Indicadores de Logro */}
              <div className="space-y-2 pt-2">
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Saberes conceptuales e indicadores de logro del III Ciclo:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {areaActiva.saberesIndicadores.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-white border border-stone-200 rounded-lg hover:border-emerald-300 transition-colors space-y-1 shadow-2xs"
                    >
                      <strong className="text-xs text-slate-900 block font-bold">
                        {item.saber}:
                      </strong>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {item.indicador}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Pestaña 5: Ejes Transversales, Prácticas y Actitudes */}
        {areaGlosarioAbierta === 5 && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs space-y-5 animate-fadeIn">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                Componentes Integradores del PNFT
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Ejes transversales y pensador computacional
              </h4>
            </div>

            {/* Ejes Transversales */}
            <div className="space-y-2">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Ejes transversales oficiales:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {EJES_TRANSVERSALES_OFICIALES.map((eje, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2"
                  >
                    <span className="text-xs font-bold text-slate-900 block border-b border-stone-200 pb-1">
                      {eje.eje}
                    </span>
                    <div className="space-y-1.5 text-[11px]">
                      {eje.componentes.map((c, cIdx) => (
                        <div key={cIdx}>
                          <strong className="text-slate-800">{c.nombre}: </strong>
                          <span className="text-slate-600 leading-snug">{c.detalle}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prácticas Observables */}
            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Prácticas observables del pensador computacional (Saber hacer):
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {PRACTICAS_PENSADOR_COMPUTACIONAL.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-stone-50/70 border border-stone-200 rounded-lg space-y-1 text-xs"
                  >
                    <strong className="text-emerald-950 font-bold block">{p.practica}</strong>
                    <p className="text-[11px] text-slate-600 leading-snug">{p.detalle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actitudes Observables */}
            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Actitudes observables del pensador computacional (Saber ser):
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {ACTITUDES_PENSADOR_COMPUTACIONAL.map((a, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1 text-xs"
                  >
                    <strong className="text-amber-950 font-bold block">{a.actitud}</strong>
                    <p className="text-[11px] text-slate-600 leading-snug">{a.detalle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Protocolo de Aula y Situaciones Imprevistas (Guía Rápida "¿Qué hacer si...?") */}
      <div className="bg-stone-50/90 border border-stone-300 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <Question size={20} className="text-indigo-700" weight="bold" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Protocolo de Aula y Situaciones Imprevistas («¿Qué hacer si...?»)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 1,
              pregunta: "¿Qué hago si se cae o falla el internet a mitad de la prueba?",
              respuesta: "La WebApp opera de manera autónoma gracias al almacenamiento local en el navegador. Indique al estudiante que continúe; al finalizar, la pantalla generará el código QR y token SHA-256 para que usted lo escanee con el lector del panel docente.",
            },
            {
              id: 2,
              pregunta: "¿Qué sucede si un estudiante cierra la pestaña por error?",
              respuesta: "El avance se guarda en tiempo real en la memoria local del equipo. Al reabrir el enlace o QR en el mismo navegador, el estudiante reanuda la sesión sin perder las respuestas previas.",
            },
            {
              id: 3,
              pregunta: "¿Cómo garantizo la equidad si no hay computadoras suficientes?",
              respuesta: "El docente debe validar previamente las condiciones técnicas y organizar turnos por estaciones o grupos de trabajo rotativos, asegurando que el 100 % de los estudiantes tenga acceso al mismo instrumento sin exclusión.",
            },
            {
              id: 4,
              pregunta: "¿Cómo traslado los resultados finales al registro oficial?",
              respuesta: "Desde el tablero docente (/dashboard), una vez consolidadas las secciones, utilice los botones oficiales de exportación a Excel y PDF con formato institucional MEP.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5 shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setCasoContingenciaAbierto(casoContingenciaAbierto === item.id ? null : item.id)}
                className="w-full text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-2 cursor-pointer"
              >
                <span>{item.pregunta}</span>
                {casoContingenciaAbierto === item.id ? <CaretDown size={16} /> : <CaretRight size={16} />}
              </button>
              {casoContingenciaAbierto === item.id && (
                <p className="text-[11.5px] text-stone-600 leading-relaxed pt-1 border-t border-stone-100 animate-fadeIn">
                  {item.respuesta}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lista Desplegable de las 7 Etapas */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-2">
          <ShieldCheck size={20} className="text-emerald-700" weight="bold" />
          <span>Verificación y Aprendizaje por Etapas</span>
        </h3>

        <div className="space-y-3">
          {ETAPAS_DATOS.map((etapa) => {
            const tareasEtapaHechas = etapa.tareas.filter((t) => tareasCompletadas[t.id]).length;
            const estaCompleta = tareasEtapaHechas === etapa.tareas.length;
            const estaAbierta = etapaAbierta === etapa.id;

            return (
              <div
                key={etapa.id}
                className={`border-2 rounded-2xl transition-all overflow-hidden ${
                  estaCompleta
                    ? "border-emerald-300 bg-emerald-50/20"
                    : estaAbierta
                    ? "border-indigo-300 bg-white shadow-xs"
                    : "border-stone-200 bg-stone-50/50 hover:bg-stone-50"
                }`}
              >
                {/* Cabecera del Acordeón */}
                <button
                  type="button"
                  onClick={() => setEtapaAbierta(estaAbierta ? 0 : etapa.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 sm:mt-0 ${
                        estaCompleta
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {estaCompleta ? <CheckCircle size={18} weight="bold" /> : etapa.id}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        {etapa.titulo}
                      </div>
                      <div className="text-[11.5px] text-stone-500 font-medium line-clamp-1">
                        {etapa.subtitulo}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold ${
                        estaCompleta
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-stone-100 text-stone-600 border border-stone-300"
                      }`}
                    >
                      {tareasEtapaHechas}/{etapa.tareas.length}
                    </span>
                    {estaAbierta ? <CaretDown size={18} /> : <CaretRight size={18} />}
                  </div>
                </button>

                {/* Contenido Expandible: Infografía Guiada y Lista de Verificación */}
                {estaAbierta && (
                  <div className="px-5 pb-6 pt-3 border-t border-stone-200 space-y-5 bg-white">
                    {/* Infografía Guiada del Flujo Paso a Paso */}
                    {etapa.infografia && (
                      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-stone-200 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-emerald-100 text-emerald-800 rounded-lg">
                              <Sparkle size={16} weight="fill" />
                            </span>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                              {etapa.infografia.titulo}
                            </h4>
                          </div>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {etapa.infografia.resumen}
                          </span>
                        </div>

                        {/* Grid de Pasos Ilustrados de la Infografía */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                          {etapa.infografia.pasos.map((paso) => (
                            <div
                              key={paso.numero}
                              className="bg-white border border-stone-200/90 rounded-xl p-3.5 space-y-2 relative flex flex-col justify-between hover:shadow-xs transition-shadow"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-black">
                                    {paso.numero}
                                  </span>
                                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                                    Paso {paso.numero}
                                  </span>
                                </div>
                                <h5 className="text-xs font-black text-slate-900 leading-snug">
                                  {paso.titulo}
                                </h5>
                                <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal">
                                  {paso.descripcion}
                                </p>
                              </div>

                              {paso.consejo && (
                                <div className="pt-2 mt-1 border-t border-stone-100 flex items-start gap-1.5 text-[10.5px] text-emerald-900 bg-emerald-50/70 p-2 rounded-lg">
                                  <Lightbulb size={13} className="text-emerald-700 shrink-0 mt-0.5" weight="fill" />
                                  <span className="leading-snug">{paso.consejo}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lista de Verificación Procedimental */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1">
                        <span>Lista de comprobación y práctica (Marque cada paso completado):</span>
                        <span className="text-stone-400 text-[11px] font-mono">
                          {tareasEtapaHechas} de {etapa.tareas.length} listos
                        </span>
                      </div>

                      <div className="space-y-2">
                        {etapa.tareas.map((tarea) => {
                          const marcada = !!tareasCompletadas[tarea.id];
                          return (
                            <label
                              key={tarea.id}
                              className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                                marcada
                                  ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs"
                                  : "bg-stone-50/60 border-stone-200 text-slate-800 hover:bg-stone-100"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={marcada}
                                onChange={() => toggleTarea(tarea.id)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 mt-0.5 cursor-pointer shrink-0"
                              />
                              <div className="space-y-0.5">
                                <div className={`text-xs font-bold leading-snug ${marcada ? "line-through text-emerald-900/80" : "text-slate-900"}`}>
                                  {tarea.texto}
                                </div>
                                <div className="text-[11px] text-stone-500 font-medium">
                                  {tarea.detalle}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Botón de Acción Directo (Abre en Nueva Pestaña) */}
                    {etapa.enlaceAccion && (
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={etapa.enlaceAccion.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all transform active:scale-98"
                        >
                          <span>{etapa.enlaceAccion.texto}</span>
                          <ArrowSquareOut size={15} weight="bold" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bloque de Apuntes y Bitácora Personal */}
      <div className="bg-stone-50 border-2 border-stone-300/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <NotePencil size={22} className="text-indigo-700" weight="bold" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Bitácora de Apuntes & Observaciones Pedagógicas
              </h3>
              <p className="text-[11.5px] text-stone-500 font-medium">
                Espacio personal para tomar notas durante la exploración y guardarlas automáticamente en su perfil.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={copiarBitacora}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Copy size={15} />
              <span>{copiadoExitoso ? "¡Copiado!" : "Copiar"}</span>
            </button>

            <button
              type="button"
              onClick={descargarBitacora}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <DownloadSimple size={15} />
              <span>Descargar .md</span>
            </button>

            <button
              type="button"
              onClick={imprimirBitacora}
              className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer size={15} weight="bold" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Botones de Plantillas Guiadas Rápidas */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
            <Bookmarks size={14} className="text-indigo-600" />
            <span>Insertar plantilla guiada:</span>
          </span>

          <button
            type="button"
            onClick={() => insertarPlantilla("dua")}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Lightbulb size={13} className="text-amber-600" weight="fill" />
            <span>+ Plantilla DUA</span>
          </button>

          <button
            type="button"
            onClick={() => insertarPlantilla("seguimiento")}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
          >
            <ShieldCheck size={13} className="text-emerald-700" weight="bold" />
            <span>+ Acuerdos de Seguimiento</span>
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            rows={6}
            value={apuntesDocente}
            onChange={(e) => handleCambioApuntes(e.target.value)}
            placeholder="Escriba aquí sus anotaciones pedagógicas, reflexiones sobre las 4 áreas curriculares de la Guía Docente 2026, acuerdos de sección o adaptaciones DUA..."
            className="w-full p-4 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed shadow-inner"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>{apuntesDocente.length} caracteres escritos</span>
            <span>Vinculado a su usuario: <strong>{docente?.nombreCompleto || "Docente MEP"}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
