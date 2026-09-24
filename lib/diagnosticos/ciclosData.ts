// ============================================================================
// MATRICES OFICIALES DE FORMACIÓN TECNOLÓGICA MEP POR CICLOS EDUCATIVOS
// I Ciclo (1°-3°), II Ciclo (4°-6°), III Ciclo (7°-9°) y Educación Diversificada (10°-12°)
// ============================================================================

export interface IndicadorCiclo {
  id: number;
  codigo: string;
  nombre: string;
  subarea: string;
  saberes: string;
  peso: number;
}

export interface CicloEducativoData {
  cicloId: string;
  nombreOficial: string;
  gradosTexto: string;
  enfoquePedagogico: string;
  indicadores: IndicadorCiclo[];
}

export const MATRIZ_I_CICLO_DATA: CicloEducativoData = {
  cicloId: "I_CICLO",
  nombreOficial: "I Ciclo de Educación General Básica (1.°, 2.° y 3.° Año)",
  gradosTexto: "1.°, 2.° y 3.° de Primaria",
  enfoquePedagogico: "Alfabetización digital temprana, pensamiento computacional desenchufado/lúdico, reconocimiento de patrones y convivencia digital segura.",
  indicadores: [
    {
      id: 1,
      codigo: "IND-1C.1",
      nombre: "Reconocimiento y cuidado de dispositivos digitales",
      subarea: "Cultura Digital y Hardware Básico",
      saberes: "Identifica partes esenciales (pantalla, teclado, ratón, batería) y aplica normas de cuidado y postura corporal ergonómica.",
      peso: 1,
    },
    {
      id: 2,
      codigo: "IND-1C.2",
      nombre: "Secuencias y algoritmos cotidianos",
      subarea: "Pensamiento Computacional Lúdico",
      saberes: "Ordena pasos lógicos cronológicos para guiar personajes o resolver retos en laberintos desenchufados.",
      peso: 1,
    },
    {
      id: 3,
      codigo: "IND-1C.3",
      nombre: "Reconocimiento de patrones y regularidades",
      subarea: "Lógica y Abstracción Inicial",
      saberes: "Descubre secuencias numéricas, geométricas o de colores para predecir el siguiente elemento en un conjunto.",
      peso: 1,
    },
    {
      id: 4,
      codigo: "IND-1C.4",
      nombre: "Expresión creativa con herramientas digitales",
      subarea: "Producción Multimedia Temprana",
      saberes: "Utiliza aplicaciones de dibujo, audio o narración visual para comunicar ideas y emociones.",
      peso: 1,
    },
    {
      id: 5,
      codigo: "IND-1C.5",
      nombre: "Convivencia y seguridad en entornos virtuales",
      subarea: "Ciudadanía Digital y Bienestar",
      saberes: "Reconoce la importancia de pedir ayuda a adultos de confianza y proteger información personal en internet.",
      peso: 1,
    },
  ],
};

export const MATRIZ_II_CICLO_DATA: CicloEducativoData = {
  cicloId: "II_CICLO",
  nombreOficial: "II Ciclo de Educación General Básica (4.°, 5.° y 6.° Año)",
  gradosTexto: "4.°, 5.° y 6.° de Primaria",
  enfoquePedagogico: "Programación visual por bloques, algoritmia estructurada, redes y comunicación digital, resolución de problemas y ciudadanía digital crítica.",
  indicadores: [
    {
      id: 1,
      codigo: "IND-2C.1",
      nombre: "Programación orientada a eventos en bloques",
      subarea: "Desarrollo de Software Visual",
      saberes: "Construye scripts interactivos utilizando disparadores de eventos (al presionar tecla, clic en objeto, mensajes).",
      peso: 1,
    },
    {
      id: 2,
      codigo: "IND-2C.2",
      nombre: "Estructuras condicionales y bucles iterativos",
      subarea: "Lógica Algorítmica y Control",
      saberes: "Aplica decisiones condicionales (si - entonces) y repeticiones para controlar flujos lógicos en videojuegos educativos.",
      peso: 1,
    },
    {
      id: 3,
      codigo: "IND-2C.3",
      nombre: "Funcionamiento de redes y servicios web",
      subarea: "Infraestructura Digital e Internet",
      saberes: "Distingue entre dispositivos locales, servidores en la nube y rutas de transferencia de datos en internet.",
      peso: 1,
    },
    {
      id: 4,
      codigo: "IND-2C.4",
      nombre: "Búsqueda crítica y derechos de autor",
      subarea: "Gestión de la Información y Ética",
      saberes: "Evalúa la veracidad de fuentes digitales, cita autores y comprende licencias libres y Creative Commons.",
      peso: 1,
    },
    {
      id: 5,
      codigo: "IND-2C.5",
      nombre: "Ciberseguridad y prevención del acoso digital",
      subarea: "Ciudadanía y Ciberseguridad",
      saberes: "Aplica contraseñas robustas, identifica correos o mensajes sospechosos y promueve entornos libres de ciberbullying.",
      peso: 1,
    },
    {
      id: 6,
      codigo: "IND-2C.6",
      nombre: "Introducción a la robótica y sensores físicos",
      subarea: "Automatización y Robótica Escolar",
      saberes: "Reconoce cómo los sensores (luz, proximidad) capturan datos del entorno para activar actuadores (motores, luces).",
      peso: 1,
    },
  ],
};

export const MATRIZ_DIVERSIFICADA_DATA: CicloEducativoData = {
  cicloId: "DIVERSIFICADA",
  nombreOficial: "Educación Diversificada (10.°, 11.° y 12.° Año CTP)",
  gradosTexto: "10.°, 11.° y 12.° de Secundaria Académica y Técnica",
  enfoquePedagogico: "Inteligencia Artificial aplicada, desarrollo de software profesional, ciberseguridad avanzada, IoT y gestión de proyectos de innovación tecnológica.",
  indicadores: [
    {
      id: 1,
      codigo: "IND-DIV.1",
      nombre: "Fundamentos y ética de la Inteligencia Artificial",
      subarea: "Inteligencia Artificial y Aprendizaje Automático",
      saberes: "Comprende el entrenamiento de modelos de ML, redes neuronales, visión por computadora y sesgos algorítmicos.",
      peso: 1,
    },
    {
      id: 2,
      codigo: "IND-DIV.2",
      nombre: "Desarrollo de aplicaciones web y software modular",
      subarea: "Ingeniería de Software y Programación",
      saberes: "Diseña arquitecturas cliente-servidor, APIs RESTful, bases de datos relacionales/NoSQL y lógica modular.",
      peso: 1,
    },
    {
      id: 3,
      codigo: "IND-DIV.3",
      nombre: "Ciberseguridad defensiva y criptografía",
      subarea: "Seguridad de la Información",
      saberes: "Implementa autenticación segura, cifrado de extremo a extremo, prevención de vulnerabilidades web (OWASP).",
      peso: 1,
    },
    {
      id: 4,
      codigo: "IND-DIV.4",
      nombre: "Internet de las Cosas (IoT) y sistemas embebidos",
      subarea: "Electrónica, IoT y Nube",
      saberes: "Programa microcontroladores con conectividad Wi-Fi/Bluetooth, telemetría MQTT y cuadros de mando en la nube.",
      peso: 1,
    },
    {
      id: 5,
      codigo: "IND-DIV.5",
      nombre: "Innovación tecnológica y gestión ágil de proyectos",
      subarea: "Emprendimiento Tecnológico y Metodologías Ágiles",
      saberes: "Aplica Design Thinking, Scrum y prototipado rápido para resolver desafíos socioproductivos en las comunidades.",
      peso: 1,
    },
  ],
};
