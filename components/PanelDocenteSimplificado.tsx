"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import { PayloadTelemetria, calcularNivelLogro } from "@/lib/antiFraude";
import { exportarAExcel, exportarAPDF } from "@/lib/exportUtils";
import SemaforoLogro from "@/components/SemaforoLogro";
import GraficasSecciones from "@/components/GraficasSecciones";
import RecomendacionesDUA from "@/components/RecomendacionesDUA";
import QRModalProyeccion from "@/components/QRModalProyeccion";
import QRScannerResultados from "@/components/QRScannerResultados";
import ModalGuiaRapidaDocente from "@/components/ModalGuiaRapidaDocente";
import ModalInstalacionPWA from "@/components/ModalInstalacionPWA";
import ModalArticulacionCurricular from "@/components/ModalArticulacionCurricular";
import ModalDocumentacionOficial from "@/components/ModalDocumentacionOficial";
import { CONFIGURACION_DEFAULT } from "@/components/ConfiguradorInstrumentoDashboard";
import {
  obtenerDiagnosticoPorNivel,
  NivelEducativo,
} from "@/lib/diagnosticos";
import {
  Link as LinkIcon,
  BookOpen,
  Heart,
  Pulse,
  Users,
  ChartBar,
  QrCode,
  Camera,
  Copy,
  DownloadSimple,
  CheckCircle,
  WarningCircle,
  MagnifyingGlass,
  ArrowSquareOut,
  Sparkle,
  Trash,
  NotePencil,
  FileXls,
  FilePdf,
  Info,
  ShieldCheck,
  Lightning,
  Funnel,
  PlusCircle,
  Broadcast,
  TrendUp,
  Cpu,
  ArrowsClockwise,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  ArrowsOut,
  Check,
  X,
  List,
  Compass,
  CaretDown,
  CaretUp,
  CaretLeft,
  CaretRight,
  Globe,
  WifiHigh,
  WifiSlash,
  ArrowsLeftRight,
  Printer,
  FileText,
} from "@phosphor-icons/react";

export type SeccionPanel =
  | "enlaces"
  | "cognitivo"
  | "socioafectivo"
  | "psicomotriz"
  | "sistematizacion"
  | "analitica";

export interface CriterioSocioafectivoOficial {
  id: "s1" | "s2" | "s3" | "s4";
  codigo: string;
  titulo: string;
  preguntaReflexion: string;
  escalaA: string; // Avanzado
  escalaB: string; // Intermedio
  escalaC: string; // Inicial
  modalidadNota?: string;
  modalidadEvaluacion?: "telemetria" | "docente" | "hibrido";
  etiquetaModalidad?: string;
}

export const CRITERIOS_SOCIOAFECTIVOS_MAP: Record<"7mo" | "9no", CriterioSocioafectivoOficial[]> = {
  "7mo": [
    {
      id: "s1",
      codigo: "S1. Gusto por la precisión",
      titulo: "Gusto por la precisión",
      preguntaReflexion: "«Cuando respondió los retos, ¿revisó los detalles con cuidado?»",
      escalaA: "Avanzado (A): Revisé con cuidado cada respuesta antes de enviarla.",
      escalaB: "Intermedio (B): Revisé solo algunas respuestas.",
      escalaC: "Inicial (C): Respondí rápido, sin revisar.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "🤖 Telemetría",
    },
    {
      id: "s2",
      codigo: "S2. Aprender del error",
      titulo: "Aprender del error",
      preguntaReflexion: "«Cuando se equivocó en un reto, ¿qué hizo?»",
      escalaA: "Avanzado (A): Busqué mi error, lo corregí y aprendí algo.",
      escalaB: "Intermedio (B): Lo intenté de nuevo con ayuda.",
      escalaC: "Inicial (C): Lo dejé así y continué.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "🤖 Telemetría",
    },
    {
      id: "s3",
      codigo: "S3. Flexibilidad para manejar problemas",
      titulo: "Flexibilidad para manejar problemas",
      preguntaReflexion: "«Cuando algo no salió como esperaba (una pregunta difícil, un problema con la computadora o con el compañero/a), ¿qué hizo?»",
      escalaA: "Avanzado (A): Parejas: «Escuché las ideas de mi compañero(a) y juntos probamos otra forma.» | Individual: «Busqué por mi cuenta otra forma de resolverlo.»",
      escalaB: "Intermedio (B): Probé otra forma cuando alguien me dio una idea.",
      escalaC: "Inicial (C): Seguí con la misma idea aunque no funcionaba.",
      modalidadNota: "Diferenciado por modalidad: En parejas o individual.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
    {
      id: "s4",
      codigo: "S4. Tolerancia a la frustración",
      titulo: "Tolerancia a la frustración",
      preguntaReflexion: "«Cuando un reto se puso difícil, ¿cómo reaccioné?»",
      escalaA: "Avanzado (A): Mantuve la calma y seguí intentando hasta terminar.",
      escalaB: "Intermedio (B): Me costó, pero seguí cuando me animaron.",
      escalaC: "Inicial (C): Me enojé o quise dejarlo.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
  ],
  "9no": [
    {
      id: "s1",
      codigo: "S1. Gusto por la precisión",
      titulo: "Gusto por la precisión",
      preguntaReflexion: "«Al armar el circuito y programar el sistema, ¿verificó conexiones y umbrales con minuciosidad?»",
      escalaA: "Avanzado (A): Verifica con autonomía cada conexión eléctrica, polaridad y condición lógica antes de energizar.",
      escalaB: "Intermedio (B): Revisa conexiones principales; omite verificar detalles secundarios de calibración.",
      escalaC: "Inicial (C): Conecta rápidamente sin verificar polaridades ni valores lógicos de umbral.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "🤖 Telemetría",
    },
    {
      id: "s2",
      codigo: "S2. Aprender del error",
      titulo: "Aprender del error",
      preguntaReflexion: "«Ante una falla inyectada o circuito no funcional, ¿cuál fue su actitud y método de resolución?»",
      escalaA: "Avanzado (A): Analiza metódicamente la falla, formula hipótesis y depura el circuito aprendiendo del error.",
      escalaB: "Intermedio (B): Intenta corregir por ensayo y error guiado hasta recuperar la funcionalidad.",
      escalaC: "Inicial (C): Muestra desinterés ante el error o abandona el circuito sin intentar depurarlo.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "🤖 Telemetría",
    },
    {
      id: "s3",
      codigo: "S3. Flexibilidad para manejar problemas",
      titulo: "Flexibilidad para manejar problemas",
      preguntaReflexion: "«Cuando un sensor o actuador no respondía como esperaba, ¿cómo coordinó la solución?»",
      escalaA: "Avanzado (A): En parejas: Escucha aportes y reconfigura en equipo | Individual: Explora autónomamente rutas alternas.",
      escalaB: "Intermedio (B): Acepta modificar la configuración si recibe una sugerencia directa del docente.",
      escalaC: "Inicial (C): Mantiene la conexión errada insistiendo en el mismo enfoque no funcional.",
      modalidadNota: "Diferenciado por modalidad: En parejas o individual.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
    {
      id: "s4",
      codigo: "S4. Tolerancia a la frustración",
      titulo: "Tolerancia a la frustración",
      preguntaReflexion: "«Ante la complejidad de integrar hardware físico y código condicional, ¿cómo gestionó la perseverancia?»",
      escalaA: "Avanzado (A): Mantiene el enfoque y persevera con calma sistemática hasta verificar el funcionamiento completo.",
      escalaB: "Intermedio (B): Experimenta desánimo leve, retomando el reto tras acompañamiento docente.",
      escalaC: "Inicial (C): Se frustra tempranamente y suspende la actividad ante el primer obstáculo.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
  ],
};

export interface SaberCognitivoOficial {
  id: number;
  nombre: string;
  saber: string;
  pregunta: string;
  areaCurricular?: string;
  descripcion?: string;
}

export const SABERES_COGNITIVOS_MAP: Record<"7mo" | "9no", SaberCognitivoOficial[]> = {
  "9no": [
    { id: 1, nombre: "Microcontrolador (Pregunta 1 - 6)", saber: "Microcontrolador", pregunta: "Pregunta 1 - 6", areaCurricular: "Computación física y robótica" },
    { id: 2, nombre: "Sensor y actuador (Pregunta 2 - 9 - 6)", saber: "Sensor y actuador", pregunta: "Pregunta 2 - 9 - 6", areaCurricular: "Computación física y robótica" },
    { id: 3, nombre: "Algoritmo (Pregunta 3 - 4 - 5)", saber: "Algoritmo", pregunta: "Pregunta 3 - 4 - 5", areaCurricular: "Programación y algoritmos" },
    { id: 4, nombre: "Dato (Pregunta 7)", saber: "Dato", pregunta: "Pregunta 7", areaCurricular: "Ciencia de datos e IA" },
    { id: 5, nombre: "Algoritmo (Pregunta 8)", saber: "Algoritmo", pregunta: "Pregunta 8", areaCurricular: "Programación y algoritmos" },
    { id: 6, nombre: "Almacenamiento de datos (Pregunta 10)", saber: "Almacenamiento de datos", pregunta: "Pregunta 10", areaCurricular: "Ciencia de datos e IA" },
  ],
  "7mo": [
    { id: 1, nombre: "Hardware (Pregunta 1)", saber: "Hardware", pregunta: "Pregunta 1", areaCurricular: "Apropiación tecnológica" },
    { id: 2, nombre: "Software (Pregunta 2)", saber: "Software", pregunta: "Pregunta 2", areaCurricular: "Apropiación tecnológica" },
    { id: 3, nombre: "Sistema Operativo (Pregunta 3)", saber: "Sistema Operativo", pregunta: "Pregunta 3", areaCurricular: "Apropiación tecnológica" },
    { id: 4, nombre: "Redes de comunicación (Pregunta 4)", saber: "Redes de comunicación", pregunta: "Pregunta 4", areaCurricular: "Conectividad" },
    { id: 5, nombre: "Gestión de archivos (Pregunta 5)", saber: "Gestión de archivos", pregunta: "Pregunta 5", areaCurricular: "Apropiación tecnológica" },
    { id: 6, nombre: "Herramientas de creación de contenido multimedia (editor de gráficos) (Pregunta 6)", saber: "Herramientas multimedia (Editor de gráficos)", pregunta: "Pregunta 6", areaCurricular: "Apropiación tecnológica" },
    { id: 7, nombre: "Evento (Pregunta 7)", saber: "Evento", pregunta: "Pregunta 7", areaCurricular: "Programación y algoritmos" },
    { id: 8, nombre: "Variable y estructuras repetitivas (Pregunta 8)", saber: "Variable y estructuras repetitivas", pregunta: "Pregunta 8", areaCurricular: "Programación y algoritmos" },
    { id: 9, nombre: "Estructuras condicionales (Pregunta 9)", saber: "Estructuras condicionales", pregunta: "Pregunta 9", areaCurricular: "Programación y algoritmos" },
    { id: 10, nombre: "Operadores relacionales y operadores aritméticos (Pregunta 10)", saber: "Operadores relacionales y aritméticos", pregunta: "Pregunta 10", areaCurricular: "Programación y algoritmos" },
  ],
};

export interface CriterioPsicomotorOficial {
  id: string;
  codigo: string;
  titulo: string;
  desc: string;
  areaCurricular?: string;
  preguntaGuia?: string;
  escalaA: string;
  escalaB: string;
  escalaC: string;
  modalidadEvaluacion?: "telemetria" | "docente" | "hibrido";
  etiquetaModalidad?: string;
}

export const CRITERIOS_PSICOMOTRICES_MAP: Record<"7mo" | "9no", CriterioPsicomotorOficial[]> = {
  "9no": [
    {
      id: "p1",
      codigo: "P1. Modulariza",
      titulo: "Modulariza",
      areaCurricular: "Computación física y robótica",
      preguntaGuia: "«¿Identifica y organiza con autonomía espacial las 3 tarjetas de hardware (Sensor LDR, MCU y Lámpara LED)?»",
      desc: "Resuelve la conexión por partes independientes: identifica y organiza espacialmente las 3 tarjetas de hardware (Sensor LDR, Microcontrolador MCU y Lámpara LED).",
      escalaA: "Logrado (L): Reconoce y organiza con autonomía las 3 tarjetas de hardware sin requerir modelado.",
      escalaB: "En Desarrollo (ED): Noción parcial de la distribución; organiza los módulos con pistas pedagógicas.",
      escalaC: "Requiere Acompañamiento (RA): Requiere modelado paso a paso para identificar las tarjetas de hardware.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "Telemetría (Autovalidado)",
    },
    {
      id: "p2",
      codigo: "P2. Reconoce Patrones",
      titulo: "Reconoce Patrones",
      areaCurricular: "Computación física y robótica",
      preguntaGuia: "«¿Conecta terminales respetando polaridades (VCC 5V 🔴, GND ⚫, Pin A0 🟡, Pin D9 🔵) sin error?»",
      desc: "Identifica las regularidades de polaridad y correspondencia de terminales (VCC 5V 🔴, GND ⚫, Pin A0 🟡, Pin D9 🔵).",
      escalaA: "Logrado (L): Conecta terminales respetando polaridades sin cometer errores de alimentación o señal.",
      escalaB: "En Desarrollo (ED): Corrige polaridades tras advertencia visual o reintento asistido.",
      escalaC: "Requiere Acompañamiento (RA): Confunde alimentación (5V/GND) con terminales de señal constantemente.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "Telemetría (Autovalidado)",
    },
    {
      id: "p3",
      codigo: "P3. Formula Algoritmo",
      titulo: "Formula Algoritmo",
      areaCurricular: "Programación y algoritmos",
      preguntaGuia: "«¿Establece el flujo lógico secuencial (Entrada → Proceso → Salida) cerrando el circuito ordenadamente?»",
      desc: "Establece el flujo lógico secuencial del sistema (Entrada → Proceso → Salida) cerrando el circuito eléctrico ordenadamente.",
      escalaA: "Logrado (L): Ejecuta la secuencia lógica ordenada de conexión de Entrada a Salida inmediatamente.",
      escalaB: "En Desarrollo (ED): Ensayo y error guiado hasta completar la secuencia lógica del circuito.",
      escalaC: "Requiere Acompañamiento (RA): Desorden en el conexionado y dificultad para cerrar el lazo del circuito.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "Telemetría (Autovalidado)",
    },
    {
      id: "p4",
      codigo: "P4. Programa",
      titulo: "Programa",
      areaCurricular: "Programación y algoritmos",
      preguntaGuia: "«Debe aplicar el slider a < 300 Lux y energizar el actuador D9. De lo contrario, queda «No Ejecutado».»",
      desc: "Debe aplicar el slider a < 300 Lux y energizar el actuador D9. De lo contrario, queda «No Ejecutado».",
      escalaA: "Logrado (L): Aplica el slider a < 300 Lux y energiza el pin digital D9 en el simulador.",
      escalaB: "En Desarrollo (ED): Interactúa con el slider pero no completa la condición umbral.",
      escalaC: "Requiere Acompañamiento (RA): No asocia el valor del umbral del sensor a la activación del actuador.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
    {
      id: "p5",
      codigo: "P5. Depura",
      titulo: "Depura",
      areaCurricular: "Computación física y robótica",
      preguntaGuia: "«¿Detecta la falla técnica inyectada y reconecta físicamente el cable en el puerto A0 de forma autónoma?»",
      desc: "Detecta la falla técnica inyectada en el simulador (señal conectada a 5V en vez de A0) y ejecuta la reconexión física del cable en el banco interactivo.",
      escalaA: "Logrado (L): Diagnostica la falla y reconecta el cable en A0 de forma autónoma e inmediata.",
      escalaB: "En Desarrollo (ED): Reconecta el cable correctamente tras recibir una pista orientadora del docente.",
      escalaC: "Requiere Acompañamiento (RA): No logra localizar la falla ni ejecutar la reconexión en el banco interactivo.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
    {
      id: "p6",
      codigo: "P6. Transferencia",
      titulo: "Transferencia",
      areaCurricular: "Computación física y robótica",
      preguntaGuia: "«¿Fundamenta técnicamente la diferencia entre señal analógica variable (A0) y alimentación fija (5V)?»",
      desc: "Transfiere el concepto a la justificación técnica: explica por qué la entrada analógica A0 lee voltajes variables según la luz mientras que 5V es fija.",
      escalaA: "Logrado (L): Justificación técnica precisa articulando voltaje analógico vs alimentación fija.",
      escalaB: "En Desarrollo (ED): Justificación empírica parcial sobre la necesidad de leer cambios de luz.",
      escalaC: "Requiere Acompañamiento (RA): No fundamenta conceptualmente la corrección realizada.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
  ],
  "7mo": [
    {
      id: "p1",
      codigo: "P1. Orientación Espacial",
      titulo: "Orientación Espacial y Desplazamiento en Cuadrícula",
      preguntaGuia: "«¿Cómo se desplaza en la cuadrícula lógica y resuelve la orientación espacial aplicando lateralidad sin obstáculos?»",
      desc: "Coordinación espacial, lateralidad y desplazamiento secuencial en laberinto / cuadrícula lógica 4x4.",
      escalaA: "Logrado (L): Navegación precisa y fluida aplicando lateralidad sin desorientación espacial.",
      escalaB: "En Desarrollo (ED): Requiere rectificación ocasional de lateralidad ante giros complejos.",
      escalaC: "Requiere Acompañamiento (RA): Confusión direccional constante en la cuadrícula.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "Telemetría Digital",
    },
    {
      id: "p2",
      codigo: "P2. Ritmo, tiempo y pausa",
      titulo: "Ritmo, tiempo y pausa (sensor de reflejos y semáforo)",
      preguntaGuia: "«¿Cómo reacciona ante los cambios de estímulo del semáforo con control de ritmo, tiempo y pausa sin impulsividad?»",
      desc: "Control de ritmo, tiempo y pausa motriz ante estímulos cromáticos y temporales.",
      escalaA: "Logrado (L): Reacción sincronizada sin falsos impulsos o clics erráticos.",
      escalaB: "En Desarrollo (ED): Anticipación o retardo leve al reaccionar ante el cambio de estímulo.",
      escalaC: "Requiere Acompañamiento (RA): Dificultad para sincronizar o detener oportunamente la acción motora.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "Telemetría Digital",
    },
    {
      id: "p3",
      codigo: "P3. Pulso y Precisión",
      titulo: "Pulso y Precisión Digital en Canal Estrecho",
      preguntaGuia: "«¿Cómo mantiene el pulso continuo y el control del puntero sin salirse del canal de precisión?»",
      desc: "Estabilidad de pulso, precisión manual y control del puntero en trayectorias estrechas.",
      escalaA: "Logrado (L): Trazo limpio y controlado sin colisiones en las paredes del canal.",
      escalaB: "En Desarrollo (ED): Colisiones leves con recuperación inmediata del control del cursor.",
      escalaC: "Requiere Acompañamiento (RA): Desviaciones constantes y pérdida del control del puntero.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "Telemetría Digital",
    },
    {
      id: "p4",
      codigo: "P4. Motricidad Fina",
      titulo: "Motricidad Fina y Destreza con Periféricos",
      preguntaGuia: "«¿Con qué soltura, coordinación óculo-manual y postura ergonómica opera los periféricos de entrada al trazar?»",
      desc: "Coordinación óculo-manual en dibujo, captura de trazo y soltura en el manejo de periféricos.",
      escalaA: "Logrado (L): Trazo continuo, definido y manipulación ágil de dispositivos de entrada.",
      escalaB: "En Desarrollo (ED): Trazo segmentado o manipulación con lentitud exploratoria.",
      escalaC: "Requiere Acompañamiento (RA): Dificultad motriz para operar periféricos digitales.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "Telemetría Digital + Validación Docente",
    },
  ],
};

interface BadgeModalidadExplicativaProps {
  modalidad: "telemetria" | "hibrido" | "docente";
  labelPersonalizado?: string;
  posicionPopover?: "bottom" | "top";
  alineacionHorizontal?: "center" | "left" | "right";
  className?: string;
}

export function BadgeModalidadExplicativa({
  modalidad,
  labelPersonalizado,
  className = "",
}: BadgeModalidadExplicativaProps) {
  const info = useMemo(() => {
    switch (modalidad) {
      case "telemetria":
        return {
          etiqueta: labelPersonalizado || "🤖 Telemetría",
          badgeCls: "bg-sky-50 text-sky-800 border-sky-200",
          titulo: "🤖 Telemetría Digital Automatizada",
          descripcion:
            "El sistema captura de manera objetiva y continua la interacción del estudiante durante la prueba.",
        };
      case "hibrido":
        return {
          etiqueta: labelPersonalizado || "⚡ Híbrido + Docente",
          badgeCls: "bg-teal-50 text-teal-800 border-teal-200",
          titulo: "⚡ Modalidad Híbrida (Telemetría + Docente)",
          descripcion:
            "Combina la medición objetiva del software con la mirada pedagógica presencial del docente.",
        };
      case "docente":
      default:
        return {
          etiqueta: labelPersonalizado || "👨‍🏫 Foco Docente",
          badgeCls: "bg-amber-50 text-amber-900 border-amber-200",
          titulo: "👨‍🏫 Foco Docente (Observación Directa)",
          descripcion:
            "Observación presencial en el aula de aspectos cualitativos y formativos no medibles por software.",
        };
    }
  }, [modalidad, labelPersonalizado]);

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-md border text-[10px] px-2 py-0.5 whitespace-nowrap select-none shadow-2xs ${info.badgeCls} ${className}`}
      title={`${info.titulo}: ${info.descripcion}`}
    >
      <span>{info.etiqueta}</span>
    </span>
  );
}

export default function PanelDocenteSimplificado() {
  const {
    docente,
    telemetria,
    actualizarResultadoTelemetria,
    agregarResultadoTelemetria,
    importarLoteResultados,
    eliminarResultado,
    limpiarTelemetria,
  } = useDocente();

  // Pestaña o Sección del Menú Docente
  const [seccionActivaMenu, setSeccionActivaMenu] = useState<SeccionPanel>("enlaces");

  // Filtros de Nivel y Sección
  const [nivelActivo, setNivelActivo] = useState<"7mo" | "9no">("7mo");
  const [seccionActiva, setSeccionActiva] = useState<string>("7-1");
  const [centroIdx, setCentroIdx] = useState<number>(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "apoyo" | "proceso" | "logrado">("todos");

  // Estados visuales y modales
  const [copiado, setCopiado] = useState(false);
  const [modalProyeccion, setModalProyeccion] = useState(false);
  const [modalEscaner, setModalEscaner] = useState(false);
  const [modalAyuda, setModalAyuda] = useState(false);
  const [modalInstalacionMovil, setModalInstalacionMovil] = useState(false);
  const [modalArticulacion, setModalArticulacion] = useState(false);
  const [modalDocumentacion, setModalDocumentacion] = useState(false);
  const [vistaSocioafectiva, setVistaSocioafectiva] = useState<"matriz" | "tarjetas">("matriz");

  // Estados para acordeón y pestañas de Enlaces Estudiante (móvil y escritorio)
  const [acordeonOnlineExpandido, setAcordeonOnlineExpandido] = useState(true);
  const [acordeonOfflineExpandido, setAcordeonOfflineExpandido] = useState(true);
  const [acordeonImpresoExpandido, setAcordeonImpresoExpandido] = useState(true);
  const [filtroModoEnlaces, setFiltroModoEnlaces] = useState<"todos" | "online" | "offline" | "impreso">("todos");

  // Estado del Simulador Multidispositivo (Celular, Tableta, Computadora)
  const [modalSimuladorDispositivo, setModalSimuladorDispositivo] = useState(false);
  const [modoVistaDispositivo, setModoVistaDispositivo] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [recargarSimuladorKey, setRecargarSimuladorKey] = useState(0);

  // Estados de la Guía y Detalle Psicomotriz y Socioafectivo
  const [guiaSimbologiaAbierta, setGuiaSimbologiaAbierta] = useState(false);
  const [criterioModalDetalle, setCriterioModalDetalle] = useState<CriterioPsicomotorOficial | null>(null);
  const [criterioSocioModalDetalle, setCriterioSocioModalDetalle] = useState<CriterioSocioafectivoOficial | null>(null);
  const [acordeonDimensionesSocio, setAcordeonDimensionesSocio] = useState(false);
  const [acordeonTablaSocio, setAcordeonTablaSocio] = useState(true);
  const [acordeonDimensionesCognitivo, setAcordeonDimensionesCognitivo] = useState(false);
  const [acordeonTablaCognitivo, setAcordeonTablaCognitivo] = useState(true);
  const [acordeonDimensionesPsico, setAcordeonDimensionesPsico] = useState(false);
  const [acordeonTablaPsico, setAcordeonTablaPsico] = useState(true);
  const [acordeonTablaResultados, setAcordeonTablaResultados] = useState(true);
  const [acordeonMetricasCohorte, setAcordeonMetricasCohorte] = useState(false);
  const [guardadosFeedback, setGuardadosFeedback] = useState<Record<string, boolean>>({});
  const [cambiosPendientes, setCambiosPendientes] = useState<Record<string, boolean>>({});
  const [mensajeGuardadoGlobal, setMensajeGuardadoGlobal] = useState<string | null>(null);
  const [modalAnalisisPsicoIA, setModalAnalisisPsicoIA] = useState(false);

  // Estado de edición de observaciones pedagógicas locales / notas
  const [notasLocales, setNotasLocales] = useState<Record<string, string>>({});

  // Cargar notas locales guardadas
  useEffect(() => {
    try {
      const saved = localStorage.getItem("MEP_NOTAS_DOCENTE_MAP");
      if (saved) {
        setNotasLocales(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const guardarNotaDocente = (idEstudiante: string, texto: string) => {
    const nuevoMap = { ...notasLocales, [idEstudiante]: texto };
    setNotasLocales(nuevoMap);
    try {
      localStorage.setItem("MEP_NOTAS_DOCENTE_MAP", JSON.stringify(nuevoMap));
    } catch {}
  };

  // Referencias y función de desplazamiento horizontal para tablas amplias
  const tablaCognitivoRef = useRef<HTMLDivElement>(null);
  const tablaSocioafectivoRef = useRef<HTMLDivElement>(null);
  const tablaPsicomotrizRef = useRef<HTMLDivElement>(null);
  const tablaSistematizacionRef = useRef<HTMLDivElement>(null);

  const scrollTabla = (ref: React.RefObject<HTMLDivElement | null>, posicion: 'inicio' | 'medio1' | 'medio2' | 'final' | 'izq' | 'der') => {
    if (!ref.current) return;
    const el = ref.current;
    if (posicion === 'inicio') {
      el.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (posicion === 'final') {
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    } else if (posicion === 'medio1') {
      el.scrollTo({ left: el.scrollWidth * 0.35, behavior: 'smooth' });
    } else if (posicion === 'medio2') {
      el.scrollTo({ left: el.scrollWidth * 0.65, behavior: 'smooth' });
    } else if (posicion === 'izq') {
      el.scrollBy({ left: -360, behavior: 'smooth' });
    } else if (posicion === 'der') {
      el.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  // Centros Educativos del Docente
  const centrosDocente = useMemo(() => {
    const nivelKey = nivelActivo === "7mo" ? "7" : "9";
    if (
      docente?.centrosEducativos &&
      Array.isArray(docente.centrosEducativos) &&
      docente.centrosEducativos.length > 0
    ) {
      return docente.centrosEducativos.map((c, idx) => {
        const dn = c.desgloseNiveles?.find(
          (d) => d && typeof d.nivel === "string" && d.nivel.includes(nivelKey)
        );
        let secciones: string[] = [];
        if (dn?.seccionesAtendidasDocente && dn.seccionesAtendidasDocente.length > 0) {
          secciones = dn.seccionesAtendidasDocente.filter(Boolean);
        } else if (
          Array.isArray((c as any).seccionesAtendidas) &&
          (c as any).seccionesAtendidas.length > 0
        ) {
          secciones = (c as any).seccionesAtendidas.filter((s: string) => s.includes(nivelKey));
        }
        if (secciones.length === 0) {
          secciones = [`${nivelKey}-1`, `${nivelKey}-2`, `${nivelKey}-3`];
        }
        return {
          id: c.id || `c-${idx}`,
          nombre: c.nombre || "Centro Educativo MEP",
          dreCodigo: c.dreCodigo || "DRE-01",
          dreNombre: c.dreNombre || "San José Central",
          circuito: c.circuito || "Circuito 01",
          secciones,
        };
      });
    }
    return [
      {
        id: "c-def",
        nombre: docente?.institucionNombre || "Liceo de Costa Rica",
        dreCodigo: docente?.dreCodigo || "DRE-01",
        dreNombre: docente?.dreNombre || "San José Central",
        circuito: docente?.circuito || "Circuito 01",
        secciones:
          nivelActivo === "7mo"
            ? ["7-1", "7-2", "7-3"]
            : ["9-1", "9-2", "9-3"],
      },
    ];
  }, [docente, nivelActivo]);

  const centroActivo = centrosDocente[centroIdx] || centrosDocente[0];

  // Secciones disponibles
  const seccionesDisponibles = useMemo(() => {
    const nivelNum = nivelActivo === "7mo" ? "7" : "9";
    if (centroActivo?.secciones && centroActivo.secciones.length > 0) {
      const filtradas = centroActivo.secciones.filter((s) => s.startsWith(nivelNum));
      if (filtradas.length > 0) return filtradas;
    }
    return [`${nivelNum}-1`, `${nivelNum}-2`, `${nivelNum}-3`, `${nivelNum}-4`];
  }, [centroActivo, nivelActivo]);

  // Al cambiar de nivel
  const handleCambiarNivel = (nuevoNivel: "7mo" | "9no") => {
    setNivelActivo(nuevoNivel);
    const nivelNum = nuevoNivel === "7mo" ? "7" : "9";
    setSeccionActiva(`${nivelNum}-1`);
  };

  // Enlace Estudiante Generado (Con Token)
  const urlEstudiante = useMemo(() => {
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://diagnosticosecundaria.vercel.app";
    const appArchivo =
      nivelActivo === "7mo"
        ? "diagnostico_7mo_modulo01_en_linea.html"
        : "diagnostico_9no_modulo01_en_linea.html";

    const payloadRaw = {
      docId: docente?.idDocente || "DOC-7729",
      doc: docente?.nombreCompleto || "Docente MEP",
      docNom: docente?.nombreCompleto || "Docente MEP",
      docente: docente?.nombreCompleto || "Docente MEP",
      dre: centroActivo.dreNombre || "San José Central",
      dreCod: centroActivo.dreCodigo || "DRE-01",
      dreNom: centroActivo.dreNombre || "San José Central",
      circ: centroActivo.circuito || "Circuito 01",
      circuito: centroActivo.circuito || "Circuito 01",
      inst: centroActivo.nombre || "Centro Educativo MEP",
      institucion: centroActivo.nombre || "Centro Educativo MEP",
      sec: seccionActiva,
      seccion: seccionActiva,
      secciones: centroActivo.secciones || [seccionActiva],
      nivel: nivelActivo === "7mo" ? "7°" : "9°",
    };

    let token = "";
    try {
      token = btoa(unescape(encodeURIComponent(JSON.stringify(payloadRaw))));
    } catch {
      token = "token-seguro";
    }

    return `${baseUrl}/webapps/${appArchivo}?token=${token}`;
  }, [nivelActivo, seccionActiva, centroActivo, docente]);

  // Archivo HTML Desconectado Offline
  const archivoOfflineDescarga = useMemo(() => {
    return nivelActivo === "7mo"
      ? "/webapps/diagnostico_7mo_modulo01_desconectado_offline.html"
      : "/webapps/diagnostico_9no_modulo01_desconectado_offline.html";
  }, [nivelActivo]);

  // Archivo Escáner de Datos PWA según Nivel
  const archivoEscanerPWA = useMemo(() => {
    return nivelActivo === "7mo"
      ? "/diagnostico_escaner_7mo.html"
      : "/diagnostico_escaner_9no.html";
  }, [nivelActivo]);

  // Archivo PDF Imprimible (Modalidad en Papel / Físico)
  const archivoPDFImprimibleDescarga = useMemo(() => {
    return nivelActivo === "7mo"
      ? "/docs/diagnostico_7mo_imprimible.pdf"
      : "/docs/evaluacion_diagnostica_9no_imprimible.pdf";
  }, [nivelActivo]);

  // Copiar Enlace
  const handleCopiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(urlEstudiante);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      const input = document.createElement("input");
      input.value = urlEstudiante;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  // Configuración y reactivos oficiales del nivel
  const configNivel = useMemo(() => {
    const nivelLetra: NivelEducativo = nivelActivo === "7mo" ? "7°" : "9°";
    return obtenerDiagnosticoPorNivel(nivelLetra);
  }, [nivelActivo]);

  // Telemetría filtrada para la sección activa
  const registrosSeccion = useMemo(() => {
    const nivelNum = nivelActivo === "7mo" ? "7" : "9";
    return (telemetria || []).filter((r) => {
      if (!r) return false;
      const nom = (r.estudianteNombre || (r as any).nombreEstudiante || "").toLowerCase();
      const ced = (r.estudianteCedula || (r as any).cedula || "").toLowerCase();
      const sec = (r.seccionOGrupo || (r as any).seccion || "").trim().toLowerCase();
      const niv = (r.nivel || "").toString().toLowerCase();
      const tit = (r.webAppTitulo || "").toLowerCase();

      if (
        nom.includes("yo si jodo") ||
        nom.includes("yosijodo") ||
        nom.includes("augrey")
      ) {
        return false;
      }

      if (docente?.nombreCompleto && nom === docente.nombreCompleto.toLowerCase().trim()) {
        return false;
      }

      // Aislamiento Multi-Inquilino Estricto por Docente
      const esAsesorNacional = docente?.tipoRol === "Asesor Nacional" || docente?.correoInstitucional?.toLowerCase().includes("alberto.bustos");
      if (!esAsesorNacional && docente) {
        const docId = (docente.idDocente || "").toLowerCase().trim();
        const docCed = (docente.cedula || "").replace(/\D/g, "");
        const docCor = (docente.correoInstitucional || "").toLowerCase().trim();
        const docNom = (docente.nombreCompleto || "").toLowerCase().trim();

        const rDocId = (r.docenteId || "").toLowerCase().trim();
        const rDocCed = ((r as any).docenteCedula || "").replace(/\D/g, "");
        const rDocCor = ((r as any).docenteCorreo || (r as any).docenteEmail || "").toLowerCase().trim();
        const rDocNom = ((r as any).docenteNombre || "").toLowerCase().trim();

        const pertenece =
          (docId && rDocId && (rDocId === docId || rDocId.includes(docId))) ||
          (docCed && rDocCed && (rDocCed === docCed || rDocId === docCed)) ||
          (docCor && rDocCor && rDocCor === docCor) ||
          (docNom && rDocNom && (rDocNom === docNom || docNom.includes(rDocNom) || rDocNom.includes(docNom)));

        if (!pertenece) return false;
      }

      const coincideNivel =
        !niv || niv.includes(nivelNum) || tit.includes(nivelNum) || sec.includes(`${nivelNum}-`);

      const secLimpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
      const activaLimpia = seccionActiva.replace(/^secci[oó]n\s*/i, "").trim();
      const coincideSeccion =
        !seccionActiva || secLimpia === activaLimpia || sec === seccionActiva.toLowerCase();

      const busqLimpia = busqueda.trim().toLowerCase();
      const coincideBusqueda =
        !busqLimpia || nom.includes(busqLimpia) || ced.includes(busqLimpia);

      let coincideEstado = true;
      if (filtroEstado === "apoyo") {
        coincideEstado = r.nivelLogro === "Inicial" || (r.porcentaje !== undefined && r.porcentaje < 60);
      } else if (filtroEstado === "proceso") {
        coincideEstado = r.nivelLogro === "Intermedio" || (r.porcentaje !== undefined && r.porcentaje >= 60 && r.porcentaje < 80);
      } else if (filtroEstado === "logrado") {
        coincideEstado = r.nivelLogro === "Avanzado" || (r.porcentaje !== undefined && r.porcentaje >= 80);
      }

      return coincideNivel && coincideSeccion && coincideBusqueda && coincideEstado;
    });
  }, [telemetria, nivelActivo, seccionActiva, busqueda, filtroEstado, docente]);

  // Métricas de Cohorte en Tiempo Real
  const metricasCohorte = useMemo(() => {
    const total = registrosSeccion.length;
    if (total === 0) {
      return {
        climaPositivo: 0,
        estadoPredominante: "Sin registros aún",
        alertasTempranas: 0,
        ultimoRegistroTexto: "Sin registros aún en esta sección",
      };
    }

    let totalCriteriosEvaluados = 0;
    let puntosSocioafectivos = 0;
    let alertasSocioafectivas = 0;

    registrosSeccion.forEach((r) => {
      const socio = r.socioafectivo || {};
      const valores = [socio.s1, socio.s2, socio.s3, socio.s4].filter(Boolean);
      valores.forEach((v) => {
        totalCriteriosEvaluados++;
        if (v === "A") puntosSocioafectivos += 100;
        else if (v === "B") puntosSocioafectivos += 70;
        else if (v === "C") {
          puntosSocioafectivos += 40;
          alertasSocioafectivas++;
        }
      });
    });

    const masReciente = [...registrosSeccion].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))[0];
    let ultimoTexto = "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (masReciente?.timestamp) {
      ultimoTexto = new Date(masReciente.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const climaPositivo = totalCriteriosEvaluados > 0 ? Math.round(puntosSocioafectivos / totalCriteriosEvaluados) : 100;
    const estadoPredominante =
      climaPositivo >= 80
        ? "Entusiasta & Focalizado"
        : climaPositivo >= 60
        ? "En Desarrollo Formativo"
        : "Requiere Acompañamiento";

    return {
      climaPositivo,
      estadoPredominante,
      alertasTempranas: alertasSocioafectivas,
      ultimoRegistroTexto: `${ultimoTexto} (${total} evaluados)`,
    };
  }, [registrosSeccion]);

  // Actualizar valoración socioafectiva
  const handleActualizarSocioafectivo = (
    timestamp: number,
    criterio: "s1" | "s2" | "s3" | "s4",
    valor: "A" | "B" | "C"
  ) => {
    const item = registrosSeccion.find((r) => r.timestamp === timestamp);
    if (!item) return;

    const socioActual = item.socioafectivo || {};
    const nuevoSocio = { ...socioActual, [criterio]: valor };

    actualizarResultadoTelemetria(timestamp, {
      socioafectivo: nuevoSocio,
    });
  };

  // Actualizar valoración psicomotriz (dinámico p1..p6)
  const handleActualizarPsicomotriz = (
    timestamp: number,
    criterio: string,
    valor: "A" | "B" | "C"
  ) => {
    const item = (telemetria || []).find((r) => r.timestamp === timestamp);
    if (!item) return;

    const psicoActual = item.psicomotor || {};
    const nuevoPsico = { ...psicoActual, [criterio]: valor };

    actualizarResultadoTelemetria(timestamp, {
      psicomotor: nuevoPsico,
    });
  };

  // Obtener logro específico para cada Saber Cognitivo desde la telemetría (cog, detallesReactivos, puntaje)
  const obtenerLogroSaberEstudiante = (
    r: PayloadTelemetria,
    saber: SaberCognitivoOficial,
    index: number
  ): "L" | "ED" | "RA" => {
    const customCogMap = (r as any).saberesCognitivosPersonalizados || {};
    if (customCogMap[saber.id]) {
      return customCogMap[saber.id];
    }

    const matches = saber.pregunta.match(/\d+/g);
    const preguntasIndices =
      matches && matches.length > 0
        ? matches.map((n) => parseInt(n, 10))
        : [index + 1];

    if (Array.isArray(r.cog) && r.cog.length > 0) {
      const valores = preguntasIndices
        .map((pNum) => r.cog![pNum - 1])
        .filter(Boolean);

      if (valores.length > 0) {
        const totalL = valores.filter((v) => v === "L" || v === "A" || v === "Logrado").length;
        const totalRA = valores.filter((v) => v === "RA" || v === "C" || v === "Requiere Acompañamiento").length;
        if (totalL === valores.length) return "L";
        if (totalRA === valores.length) return "RA";
        return "ED";
      }
    }

    if (Array.isArray(r.detallesReactivos) && r.detallesReactivos.length > 0) {
      const valoresReactivos = preguntasIndices
        .map((pNum) => {
          const item = r.detallesReactivos!.find(
            (d) =>
              d.reactivoId === `r_${pNum}` ||
              d.reactivoId === `${pNum}` ||
              d.pregunta?.includes(`Pregunta ${pNum}`) ||
              d.pregunta?.includes(`Ítem ${pNum}`)
          );
          return item ? (item.esCorrecto ? "L" : "RA") : null;
        })
        .filter(Boolean);

      if (valoresReactivos.length > 0) {
        const totalL = valoresReactivos.filter((v) => v === "L").length;
        const totalRA = valoresReactivos.filter((v) => v === "RA").length;
        if (totalL === valoresReactivos.length) return "L";
        if (totalRA === valoresReactivos.length) return "RA";
        return "ED";
      }
    }

    const pct =
      r.porcentaje !== undefined
        ? r.porcentaje
        : r.aciertos && r.totalReactivos
        ? (r.aciertos / r.totalReactivos) * 100
        : 70;
    if (pct >= 80) return "L";
    if (pct >= 60) return "ED";
    return "RA";
  };

  // Actualizar valoración individual de Saber Cognitivo
  const handleActualizarCognitivoSaber = (
    timestamp: number,
    saberId: number,
    valor: "L" | "ED" | "RA"
  ) => {
    const item = (telemetria || []).find((r) => r.timestamp === timestamp);
    if (!item) return;

    const actual = (item as any).saberesCognitivosPersonalizados || {};
    const nuevo = { ...actual, [saberId]: valor };

    actualizarResultadoTelemetria(timestamp, {
      ...item,
      saberesCognitivosPersonalizados: nuevo,
    } as any);
  };

  // Marcar toda la sección en Nivel A (Autónomo / Logrado)
  const handleMarcarTodaSeccionPsicomotrizNivelA = () => {
    if (registrosSeccion.length === 0) return;
    const criterios = CRITERIOS_PSICOMOTRICES_MAP[nivelActivo] || CRITERIOS_PSICOMOTRICES_MAP["9no"];
    const todoA: Record<string, string> = {};
    criterios.forEach((c) => {
      todoA[c.id] = "A";
    });

    registrosSeccion.forEach((r) => {
      actualizarResultadoTelemetria(r.timestamp, {
        psicomotor: { ...(r.psicomotor || {}), ...todoA },
      });
    });
  };

  // Guardar fila psicomotriz con feedback visual y auto-persistencia
  const handleGuardarFilaPsicomotriz = (idKey: string, timestamp: number, observacion: string) => {
    guardarNotaDocente(idKey, observacion);
    setCambiosPendientes((prev) => {
      const nuevo = { ...prev };
      delete nuevo[idKey];
      return nuevo;
    });
    setGuardadosFeedback((prev) => ({ ...prev, [idKey]: true }));
    setTimeout(() => {
      setGuardadosFeedback((prev) => ({ ...prev, [idKey]: false }));
    }, 2500);
  };

  // Guardar todas las observaciones de la sección
  const handleGuardarTodoPsicomotriz = () => {
    registrosSeccion.forEach((r, i) => {
      const idKey = r.idResultado || r.estudianteCedula || r.estudianteNombre || `est-${i}`;
      const inputEl = document.getElementById(`obs-input-${idKey}`) as HTMLInputElement;
      if (inputEl) {
        guardarNotaDocente(idKey, inputEl.value);
      }
    });
    setCambiosPendientes({});
    setMensajeGuardadoGlobal("✓ Todos los cambios y observaciones de la sección han sido guardados con éxito.");
    setTimeout(() => {
      setMensajeGuardadoGlobal(null);
    }, 4000);
  };

  // Exportar a Excel y PDF
  const handleDescargarExcel = () => {
    exportarAExcel(registrosSeccion, {
      nivel: nivelActivo === "7mo" ? "7.° Año" : "9.° Año",
      seccion: `Sección ${seccionActiva}`,
      institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
      docente: docente?.nombreCompleto || "Docente MEP",
      dre: centroActivo?.dreNombre || docente?.dreNombre || "DRE",
    });
  };

  const handleDescargarPDF = () => {
    exportarAPDF(registrosSeccion, {
      nivel: nivelActivo === "7mo" ? "7.° Año" : "9.° Año",
      seccion: `Sección ${seccionActiva}`,
      institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
      docente: docente?.nombreCompleto || "Docente MEP",
      dre: centroActivo?.dreNombre || docente?.dreNombre || "DRE",
    });
  };

  // Importar archivos JSON recopilados en llave USB o CSV
  const handleImportarArchivosLote = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const nuevosRegistros: PayloadTelemetria[] = [];
    let procesados = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => {
              if (item.estudianteNombre || item.nom || item.estudiante) {
                nuevosRegistros.push({
                  ...item,
                  estudianteNombre: item.estudianteNombre || item.nom || item.estudiante || "Estudiante",
                  nivel: item.nivel || (nivelActivo === "7mo" ? "7°" : "9°"),
                  seccionOGrupo: item.seccionOGrupo || item.seccion || seccionActiva,
                });
              }
            });
          } else if (parsed.estudianteNombre || parsed.nom || parsed.c1 || parsed.estudiante) {
            nuevosRegistros.push({
              ...parsed,
              estudianteNombre: parsed.estudianteNombre || parsed.nom || parsed.estudiante || "Estudiante",
              nivel: parsed.nivel || (nivelActivo === "7mo" ? "7°" : "9°"),
              seccionOGrupo: parsed.seccionOGrupo || parsed.seccion || seccionActiva,
            });
          }
          procesados++;
        } else if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
          // Parse CSV robusto con delimitadores dinámicos (; o , o \t)
          const lineas = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          if (lineas.length > 1) {
            const delimitador = lineas[0].includes(";") ? ";" : lineas[0].includes("\t") ? "\t" : ",";
            const cabeceras = lineas[0].split(delimitador).map(c => c.replace(/^["']|["']$/g, '').trim().toLowerCase());
            
            // Detectar índices de columnas
            const idxNombre = cabeceras.findIndex(h => h.includes("nombre") || h.includes("estudiante") || h.includes("alumno"));
            const idxSeccion = cabeceras.findIndex(h => h.includes("secci") || h.includes("grupo"));
            const idxNivel = cabeceras.findIndex(h => h.includes("nivel") || h.includes("año") || h.includes("grado"));
            const idxPuntaje = cabeceras.findIndex(h => h.includes("puntaje") || h.includes("puntos") || h.includes("aciertos") || h.includes("acierto"));
            const idxPorcentaje = cabeceras.findIndex(h => h.includes("porcentaje") || h.includes("calificaci") || h.includes("nota") || h.includes("cognitivo") || h.includes("%"));
            const idxLogro = cabeceras.findIndex(h => h.includes("logro") || h.includes("desempeño") || h.includes("nivel logro"));

            for (let j = 1; j < lineas.length; j++) {
              const cols = lineas[j].split(delimitador).map(c => c.replace(/^["']|["']$/g, '').trim());
              if (cols.length >= 2) {
                const nombreEst = (idxNombre >= 0 && cols[idxNombre]) ? cols[idxNombre] : (cols[3] || cols[0]);
                if (!nombreEst || nombreEst.toLowerCase().includes("promedio") || nombreEst.toLowerCase().includes("total")) continue;

                const secRaw = (idxSeccion >= 0 && cols[idxSeccion]) ? cols[idxSeccion] : (cols[2] || seccionActiva);
                const sec = secRaw.startsWith("Sección ") ? secRaw : `Sección ${secRaw}`;
                
                const nivelDetectado = (idxNivel >= 0 && cols[idxNivel]) 
                  ? (cols[idxNivel].includes("9") ? "9°" : "7°") 
                  : (nivelActivo === "7mo" ? "7°" : "9°");

                let porc = 80;
                if (idxPorcentaje >= 0 && cols[idxPorcentaje]) {
                  porc = parseInt(cols[idxPorcentaje].replace(/[^0-9]/g, '')) || 80;
                } else if (idxPuntaje >= 0 && cols[idxPuntaje]) {
                  const pts = parseFloat(cols[idxPuntaje].replace(/[^0-9.]/g, '')) || 8;
                  porc = Math.round((pts / 10) * 100);
                } else if (cols[6]) {
                  porc = parseInt(cols[6].replace(/[^0-9]/g, '')) || 80;
                }

                if (porc > 100) porc = 100;
                if (porc < 0) porc = 0;

                const nivelLogroCalculado = (idxLogro >= 0 && cols[idxLogro] && (cols[idxLogro] === "Avanzado" || cols[idxLogro] === "Intermedio" || cols[idxLogro] === "Inicial"))
                  ? (cols[idxLogro] as "Inicial" | "Intermedio" | "Avanzado")
                  : calcularNivelLogro(porc);

                nuevosRegistros.push({
                  webAppId: `diagnostico_${nivelDetectado === "7°" ? "7mo" : "9no"}_modulo01`,
                  webAppTitulo: `Diagnóstico ${nivelDetectado === "7°" ? "Séptimo" : "Noveno"} Año — MEP`,
                  docenteId: docente?.idDocente || "DOC-IMPORT",
                  docenteNombre: docente?.nombreCompleto || "Docente MEP",
                  estudianteNombre: nombreEst,
                  seccionOGrupo: sec,
                  nivel: nivelDetectado as "7°" | "9°",
                  puntaje: Math.round((porc / 100) * 10),
                  puntajeMaximo: 10,
                  porcentaje: porc,
                  nivelLogro: nivelLogroCalculado,
                  tiempoSegundos: 60,
                  totalReactivos: 10,
                  aciertos: Math.round((porc / 100) * 10),
                  fallos: Math.max(0, 10 - Math.round((porc / 100) * 10)),
                  timestamp: Date.now() - (j * 1000),
                  tokenAntiFraude: `CSV-${Date.now()}-${j}`
                });
              }
            }
            procesados++;
          }
        }
      } catch (err) {
        console.error("Error al procesar archivo:", file.name, err);
      }
    }

    if (nuevosRegistros.length > 0) {
      importarLoteResultados(nuevosRegistros);
      alert(`✅ ¡Importación completada con éxito!\n\nSe procesaron ${procesados} archivo(s) CSV/JSON y se incorporaron ${nuevosRegistros.length} registro(s) estudiantiles al panel docente.`);
    } else {
      alert("⚠️ No se encontraron registros válidos en los archivos seleccionados.");
    }
    // Reset file input
    e.target.value = "";
  };

  const handleEliminarEstudiante = (r: PayloadTelemetria) => {
    const nombre = r.estudianteNombre || "este estudiante";
    if (window.confirm(`¿Estás seguro de que deseas eliminar el registro de "${nombre}"?\n\nEsta acción eliminará permanentemente la evaluación y sus datos asociados del panel docente.`)) {
      if (r.timestamp) {
        eliminarResultado(r.timestamp);
      } else if (r.idResultado) {
        eliminarResultado(r.idResultado);
      } else if (r.estudianteNombre) {
        eliminarResultado(r.estudianteNombre);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-cardLg border border-[#D9DFE8] flex flex-col min-h-[750px]">
      
      {/* 1. TOP BAR — Barra de Navegación del Sistema FIJA (Sticky) */}
      <header className="sticky top-16 sm:top-20 z-40 bg-[#EEF3FA]/95 backdrop-blur-md border-b border-[#D9DFE8] rounded-t-2xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3 select-none shadow-xs">
        {/* Lado Izquierdo: Selector de Nivel Principal en Mayor Tamaño */}
        <div className="flex items-center gap-3">
          {/* Selector Rápido de Nivel Superior (7.° y 9.° Año) */}
          <div className="flex items-center gap-1 p-1 sm:p-1.5 bg-white rounded-2xl border border-[#D9DFE8] shadow-xs">
            <button
              type="button"
              onClick={() => handleCambiarNivel("7mo")}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                nivelActivo === "7mo"
                  ? "bg-[#1F3F78] text-white shadow-xs scale-100"
                  : "text-[#20283B] hover:text-[#1F3F78] hover:bg-[#F5F7FA]"
              }`}
              title="Evaluar 7.° Año (Sétimo)"
            >
              7.° AÑO
            </button>
            <button
              type="button"
              onClick={() => handleCambiarNivel("9no")}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                nivelActivo === "9no"
                  ? "bg-[#1F3F78] text-white shadow-xs scale-100"
                  : "text-[#20283B] hover:text-[#1F3F78] hover:bg-[#F5F7FA]"
              }`}
              title="Evaluar 9.° Año (Noveno)"
            >
              9.° AÑO
            </button>
          </div>

          <span className="hidden lg:inline-block text-xs font-extrabold text-[#667085] uppercase tracking-wider pl-2 border-l border-[#D9DFE8]">
            Panel de Evaluación
          </span>
        </div>

        {/* Acciones Rápidas en Cabecera (Lado Derecho) - Solo visibles en modo Desconectado/Offline */}
        {filtroModoEnlaces === "offline" && (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 animate-fadeIn">
            <a
              href={archivoEscanerPWA}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black shadow-xs transition-all border ${
                nivelActivo === "7mo"
                  ? "bg-blue-50/90 text-[#002b49] border-blue-200 hover:bg-blue-100"
                  : "bg-emerald-50/90 text-[#1B5E59] border-emerald-200 hover:bg-emerald-100"
              }`}
              title={`Abrir Escáner de Datos ${nivelActivo === "7mo" ? "7.° Año" : "9.° Año"} en una pestaña nueva`}
            >
              <QrCode size={16} weight="bold" />
              <span>Escáner {nivelActivo === "7mo" ? "7.° Año" : "9.° Año"}</span>
            </a>
            {/* Botón de Importación de Lote USB / Archivos JSON o CSV */}
            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#1F3F78] hover:bg-[#2E3552] text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
              <DownloadSimple size={16} weight="bold" />
              <span className="hidden sm:inline">Importar JSON/CSV (USB)</span>
              <input
                type="file"
                accept=".json,.csv,.txt"
                multiple
                className="hidden"
                onChange={handleImportarArchivosLote}
              />
            </label>
          </div>
        )}
      </header>

      {/* 2. APP SHELL — Sidebar + Main Content Canvas */}
      <div className="flex flex-col md:flex-row flex-1 bg-white">
        
        {/* ========================================================= */}
        {/* SIDEBAR DE NAVEGACIÓN DOCENTE (Institucional MEP)         */}
        {/* ========================================================= */}
        <aside className="hidden md:flex w-full md:w-64 lg:w-72 bg-white border-r border-[#D9DFE8] shrink-0 p-4 lg:p-5 flex-col justify-between select-none">
          <div className="space-y-5">
            
            {/* Header Perfil Docente */}
            <div className="flex items-center gap-3 pb-3 border-b border-[#D9DFE8]">
              <div className="w-10 h-10 rounded-xl bg-[#1F3F78] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#EEF3FA]">
                {(() => {
                  const n = docente?.nombreCompleto || "MD";
                  return n.substring(0, 2).toUpperCase();
                })()}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-sm text-[#20283B] truncate leading-tight">
                  {docente?.nombreCompleto || "Docente MEP"}
                </h2>
                <p className="text-[11px] text-[#667085] font-mono truncate">
                  {docente?.idDocente || "DOC-7729"}
                </p>
              </div>
            </div>

            {/* Menú de Navegación Modular */}
            <nav className="space-y-1" aria-label="Menú Docente Multifuncional">
              {/* 1. Enlaces Estudiante */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("enlaces")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "enlaces"
                    ? "bg-[#EEF3FA] text-[#1F3F78] font-black shadow-2xs border border-[#D9DFE8]"
                    : "text-[#667085] hover:bg-[#F5F7FA] hover:text-[#20283B]"
                }`}
              >
                <LinkIcon size={18} weight={seccionActivaMenu === "enlaces" ? "bold" : "regular"} className={seccionActivaMenu === "enlaces" ? "text-[#1F3F78]" : "text-[#667085]"} />
                <span>Enlaces Estudiante</span>
              </button>

              {/* 2. Área Cognitiva */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("cognitivo")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "cognitivo"
                    ? "bg-[#EEF3FA] text-[#1F3F78] font-black shadow-2xs border border-[#D9DFE8]"
                    : "text-[#667085] hover:bg-[#F5F7FA] hover:text-[#20283B]"
                }`}
              >
                <BookOpen size={18} weight={seccionActivaMenu === "cognitivo" ? "bold" : "regular"} className={seccionActivaMenu === "cognitivo" ? "text-[#1F3F78]" : "text-[#667085]"} />
                <span>Área Cognitiva</span>
              </button>

              {/* 3. Área Socioafectiva */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("socioafectivo")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "socioafectivo"
                    ? "bg-[#EEF3FA] text-[#1F3F78] font-black shadow-2xs border border-[#D9DFE8]"
                    : "text-[#667085] hover:bg-[#F5F7FA] hover:text-[#20283B]"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Heart size={18} weight={seccionActivaMenu === "socioafectivo" ? "fill" : "regular"} className={seccionActivaMenu === "socioafectivo" ? "text-[#1F3F78]" : "text-[#667085]"} />
                  <span className="truncate">Área Socioafectiva</span>
                </div>
                {metricasCohorte.alertasTempranas > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#A97C2A] animate-ping shrink-0" />
                )}
              </button>

              {/* 4. Área Psicomotora */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("psicomotriz")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "psicomotriz"
                    ? "bg-[#EEF3FA] text-[#1F3F78] font-black shadow-2xs border border-[#D9DFE8]"
                    : "text-[#667085] hover:bg-[#F5F7FA] hover:text-[#20283B]"
                }`}
              >
                <Pulse size={18} weight={seccionActivaMenu === "psicomotriz" ? "bold" : "regular"} className={seccionActivaMenu === "psicomotriz" ? "text-[#1F3F78]" : "text-[#667085]"} />
                <span>Área Psicomotora</span>
              </button>

              {/* 5. Resultados por Sección (Sistematización MEP) */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("sistematizacion")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "sistematizacion"
                    ? "bg-[#EEF3FA] text-[#1F3F78] font-black shadow-2xs border border-[#D9DFE8]"
                    : "text-[#667085] hover:bg-[#F5F7FA] hover:text-[#20283B]"
                }`}
              >
                <Users size={18} weight={seccionActivaMenu === "sistematizacion" ? "bold" : "regular"} className={seccionActivaMenu === "sistematizacion" ? "text-[#1F3F78]" : "text-[#667085]"} />
                <span>Resultados por Sección</span>
              </button>

              {/* 6. Análisis General & Telemetría */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("analitica")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "analitica"
                    ? "bg-[#EEF3FA] text-[#1F3F78] font-black shadow-2xs border border-[#D9DFE8]"
                    : "text-[#667085] hover:bg-[#F5F7FA] hover:text-[#20283B]"
                }`}
              >
                <ChartBar size={18} weight={seccionActivaMenu === "analitica" ? "bold" : "regular"} className={seccionActivaMenu === "analitica" ? "text-[#1F3F78]" : "text-[#667085]"} />
                <span>Análisis General & IA</span>
              </button>
            </nav>
          </div>

          {/* Footer Sidebar */}
          <div className="pt-4 border-t border-slate-100 space-y-2 mt-6">
            <button
              type="button"
              onClick={() => setModalDocumentacion(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 transition-colors cursor-pointer"
            >
              <FilePdf size={16} weight="bold" className="text-rose-600" />
              <span>Documentación Técnica (PDFs)</span>
            </button>
            <button
              type="button"
              onClick={() => setModalAyuda(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Info size={16} />
              <span>Guía Rápida Docente</span>
            </button>
            <button
              type="button"
              onClick={() => setModalInstalacionMovil(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-colors cursor-pointer"
            >
              <DeviceMobile size={16} weight="bold" className="text-emerald-700" />
              <span>Instalar WebApp en Celular</span>
            </button>
            <button
              type="button"
              onClick={() => setModalArticulacion(true)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 transition-colors cursor-pointer"
            >
              <Compass size={16} weight="fill" className="text-teal-700" />
              <span>Articulación Curricular MEP</span>
            </button>
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 rounded-lg text-[11px] text-slate-500 border border-slate-200/60">
              <span className="font-semibold text-slate-700">{seccionActiva} • {centroActivo.nombre.slice(0, 16)}...</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                En Vivo
              </span>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN CANVAS — ÁREA DE TRABAJO PRINCIPAL                   */}
        {/* ========================================================= */}
        <main className="flex-1 bg-[#FBFDFE] p-4 sm:p-6 lg:p-8 flex flex-col justify-between pb-24 md:pb-8">
          <div className="space-y-6">
            
            {/* Header del Canvas */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {seccionActivaMenu === "enlaces" && "ENLACES ESTUDIANTE"}
                  {seccionActivaMenu === "cognitivo" && "ÁREA COGNITIVA — EVALUACIÓN DEL SABER"}
                  {seccionActivaMenu === "socioafectivo" && "ÁREA SOCIOAFECTIVA — EL SER & CONVIVIR"}
                  {seccionActivaMenu === "psicomotriz" && "ÁREA PSICOMOTORA — EL SABER HACER & HARDWARE"}
                  {seccionActivaMenu === "sistematizacion" && "SISTEMATIZACIÓN DE DESEMPEÑOS Y LOGROS (MEP)"}
                  {seccionActivaMenu === "analitica" && "ANÁLISIS GENERAL & TELEMETRÍA EN TIEMPO REAL"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                  {seccionActivaMenu === "enlaces" && "Genere enlaces y códigos QR en línea o descargue el archivo para PCs sin conexión."}
                  {seccionActivaMenu === "cognitivo" && "Registro y monitoreo de respuestas, nivel de logro y criterios oficiales del programa MEP."}
                  {seccionActivaMenu === "socioafectivo" && "Registro y seguimiento de los 4 criterios socioafectivos oficiales (S1: Precisión, S2: Error, S3: Flexibilidad, S4: Confort)."}
                  {seccionActivaMenu === "psicomotriz" && "Registro y evaluación de destrezas operativas, conexionado circuital (MCU, LDR, Actuador) y motricidad fina."}
                  {seccionActivaMenu === "sistematizacion" && "Matriz oficial de sistematización curricular con exportación inmediata a Excel y PDF."}
                  {seccionActivaMenu === "analitica" && "Monitoreo en vivo de telemetría, semáforo de logro y recomendaciones pedagógicas DUA con IA."}
                </p>
              </div>

              {/* Indicador de Sección Activa En Vivo */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D1EBE7] text-[#1B5E59] border border-[#9FD1C9] text-xs font-black shadow-2xs self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{seccionActiva} en vivo</span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* BARRA DE FILTROS GLOBALES (Nivel, Institución, Sección)    */}
            {/* ========================================================= */}
            <section
              aria-label="Filtros de nivel y sección"
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-end gap-3.5"
            >
              {/* Selector de Institución si tiene varias */}
              {centrosDocente.length > 1 && (
                <div className="w-full sm:w-56">
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                    CENTRO EDUCATIVO
                  </label>
                  <select
                    value={centroIdx}
                    onChange={(e) => setCentroIdx(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1B5E59]/30 focus:border-[#1B5E59]"
                  >
                    {centrosDocente.map((c, idx) => (
                      <option key={c.id} value={idx}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selector de Sección */}
              <div className="w-36 sm:w-44">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  SECCIÓN
                </label>
                <select
                  value={seccionActiva}
                  onChange={(e) => setSeccionActiva(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1B5E59]/30 focus:border-[#1B5E59] cursor-pointer"
                >
                  {seccionesDisponibles.map((sec) => (
                    <option key={sec} value={sec}>
                      Sección {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Búsqueda por Nombre / Carné */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  BÚSQUEDA RÁPIDA
                </label>
                <div className="relative">
                  <MagnifyingGlass
                    size={16}
                    className="absolute left-3 top-2.5 text-slate-400"
                  />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar estudiante o cédula..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1B5E59]/30 focus:border-[#1B5E59]"
                  />
                </div>
              </div>

              {/* Filtro Rápido por Estado de Logro */}
              <div className="w-40">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  ESTADO
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1B5E59]/30 focus:border-[#1B5E59] cursor-pointer"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="logrado">Logrado / Avanzado</option>
                  <option value="proceso">En Proceso</option>
                  <option value="apoyo">Requiere Apoyo</option>
                </select>
              </div>

              {/* Badge Contextual */}
              <div className="flex items-center gap-2 pb-1 text-xs text-slate-500 font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                  {registrosSeccion.length} estudiantes
                </span>
              </div>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 1: ENLACES ESTUDIANTE (Opción A y Opción B)       */}
            {/* ========================================================= */}
            {seccionActivaMenu === "enlaces" && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* BARRA DE PESTAÑAS / CONTROL DE VISTA RÁPIDA (MÓVIL Y ESCRITORIO) */}
                <div className="bg-white rounded-2xl p-2 sm:p-3 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFiltroModoEnlaces("todos")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filtroModoEnlaces === "todos"
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Compass size={14} weight={filtroModoEnlaces === "todos" ? "bold" : "regular"} />
                      <span>Todas las opciones</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFiltroModoEnlaces("online");
                        setAcordeonOnlineExpandido(true);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filtroModoEnlaces === "online"
                          ? "bg-[#1B5E59] text-white shadow-xs"
                          : "bg-[#D7EFEA]/60 text-[#004641] hover:bg-[#D7EFEA]"
                      }`}
                    >
                      <Globe size={14} weight={filtroModoEnlaces === "online" ? "bold" : "regular"} />
                      <span>🌐 Con Internet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFiltroModoEnlaces("offline");
                        setAcordeonOfflineExpandido(true);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filtroModoEnlaces === "offline"
                          ? "bg-[#E07A2C] text-white shadow-xs"
                          : "bg-[#FFF3EB] text-[#974800] hover:bg-[#FFE3D0]"
                      }`}
                    >
                      <Lightning size={14} weight={filtroModoEnlaces === "offline" ? "bold" : "regular"} />
                      <span>⚡ Desconectado QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFiltroModoEnlaces("impreso");
                        setAcordeonImpresoExpandido(true);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filtroModoEnlaces === "impreso"
                          ? "bg-[#6366F1] text-white shadow-xs"
                          : "bg-[#EEF2FF] text-[#4338CA] hover:bg-[#E0E7FF]"
                      }`}
                    >
                      <FilePdf size={14} weight={filtroModoEnlaces === "impreso" ? "fill" : "regular"} />
                      <span>📄 En Papel / PDF</span>
                    </button>
                  </div>

                  {/* Acciones Rápidas y Plegado / Desplegado Global */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const nuevoEstado = !(acordeonOnlineExpandido && acordeonOfflineExpandido && acordeonImpresoExpandido);
                        setAcordeonOnlineExpandido(nuevoEstado);
                        setAcordeonOfflineExpandido(nuevoEstado);
                        setAcordeonImpresoExpandido(nuevoEstado);
                      }}
                      className="text-[11px] font-semibold text-[#667085] hover:text-[#20283B] bg-[#F5F7FA] hover:bg-[#EEF3FA] px-2.5 py-1.5 rounded-lg border border-[#D9DFE8] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>{acordeonOnlineExpandido && acordeonOfflineExpandido && acordeonImpresoExpandido ? "Contraer todo" : "Expandir todo"}</span>
                    </button>
                  </div>
                </div>

                {/* CONTENEDOR DE TARJETAS (ACORDEONES) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
                  
                  {/* TARJETA 1: OPCIÓN A (CON INTERNET / EN LÍNEA - COLOR INSTITUCIONAL) */}
                  {(filtroModoEnlaces === "todos" || filtroModoEnlaces === "online") && (
                    <div className="bg-[#EEF3FA]/70 rounded-2xl border-2 border-[#D9DFE8] shadow-xs overflow-hidden transition-all">
                      {/* Cabecera Plegable Opción A */}
                      <button
                        type="button"
                        onClick={() => setAcordeonOnlineExpandido(!acordeonOnlineExpandido)}
                        className="w-full p-3.5 flex flex-col gap-2 text-left hover:bg-[#e4ecf7] transition-colors cursor-pointer select-none"
                        aria-expanded={acordeonOnlineExpandido}
                      >
                        {/* Fila superior: Badges e indicador de colapso */}
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-[#1F3F78] text-white text-[10px] font-black tracking-wide uppercase shadow-2xs">
                              OPCIÓN A
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-[#D9DFE8] text-[10px] font-black text-[#1F3F78]">
                              ⚡ Telemetría en vivo (0ms)
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1F3F78] shadow-2xs transition-transform duration-200 shrink-0 ${acordeonOnlineExpandido ? "rotate-180" : ""}`}>
                            <CaretDown size={14} weight="bold" />
                          </div>
                        </div>

                        {/* Fila inferior: Ícono, Título completo y Subtítulo */}
                        <div className="flex items-start gap-2.5 pt-0.5">
                          <div className="w-8 h-8 rounded-xl bg-[#1F3F78] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs mt-0.5">
                            <Globe size={18} weight="bold" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-black text-[#1F3F78] leading-tight">
                              Con Internet (En Línea)
                            </h3>
                            <p className="text-[11.5px] text-[#2E3552] font-semibold mt-0.5 leading-snug">
                              Diagnóstico PNFT {nivelActivo} • Sección {seccionActiva}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Contenido Plegable Opción A */}
                      {acordeonOnlineExpandido ? (
                        <div className="p-3 sm:p-3.5 pt-0">
                          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-2xs border border-[#D9DFE8] space-y-2.5">
                            <p className="text-xs text-[#667085] font-medium leading-relaxed">
                              Los alumnos abren el enlace en sus computadoras o dispositivos. Las respuestas y telemetría se transmiten en vivo a este panel.
                            </p>

                            {/* Botones de Acción Opción A */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={handleCopiarEnlace}
                                className="inline-flex items-center justify-center gap-1.5 bg-[#1F3F78] hover:bg-[#2E3552] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
                              >
                                {copiado ? (
                                  <>
                                    <CheckCircle size={15} weight="fill" className="text-emerald-300" />
                                    <span>¡Enlace Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={15} className="text-blue-200" />
                                    <span>Copiar Enlace</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => setModalProyeccion(true)}
                                className="inline-flex items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-2.5 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer"
                              >
                                <QrCode size={15} className="text-slate-500" />
                                <span>Proyectar QR</span>
                              </button>

                              <a
                                href={urlEstudiante}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold px-2.5 py-2 rounded-lg transition-colors"
                              >
                                <span>Abrir</span>
                                <ArrowSquareOut size={13} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 pb-2.5 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[#004641] font-bold text-[11px]">
                            Enlace listo para {seccionActiva}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopiarEnlace}
                            className="bg-[#1B5E59] text-white text-[11px] font-black px-2.5 py-1 rounded-md hover:bg-[#144642] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Copy size={12} />
                            <span>Copiar enlace</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TARJETA 2: OPCIÓN B (SIN INTERNET / DESCONECTADO QR) */}
                  {(filtroModoEnlaces === "todos" || filtroModoEnlaces === "offline") && (
                    <div className="bg-[#FFF3EB] rounded-2xl border-2 border-[#FBD0B6] shadow-xs overflow-hidden transition-all">
                      {/* Cabecera Plegable Opción B */}
                      <button
                        type="button"
                        onClick={() => setAcordeonOfflineExpandido(!acordeonOfflineExpandido)}
                        className="w-full p-3.5 flex flex-col gap-2 text-left hover:bg-[#fae7da] transition-colors cursor-pointer select-none"
                        aria-expanded={acordeonOfflineExpandido}
                      >
                        {/* Fila superior: Badges e indicador de colapso */}
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-[#E07A2C] text-white text-[10px] font-black tracking-wide uppercase shadow-2xs">
                              OPCIÓN B
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-[#FBD0B6] text-[10px] font-black text-[#E07A2C]">
                              📦 100% Offline / USB
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#974800] shadow-2xs transition-transform duration-200 shrink-0 ${acordeonOfflineExpandido ? "rotate-180" : ""}`}>
                            <CaretDown size={14} weight="bold" />
                          </div>
                        </div>

                        {/* Fila inferior: Ícono, Título completo y Subtítulo */}
                        <div className="flex items-start gap-2.5 pt-0.5">
                          <div className="w-8 h-8 rounded-xl bg-[#E07A2C] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs mt-0.5">
                            <Lightning size={18} weight="fill" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-black text-[#974800] leading-tight">
                              Sin Internet (Desconectado QR)
                            </h3>
                            <p className="text-[11.5px] text-[#E07A2C] font-semibold mt-0.5 leading-snug">
                              Escáner con cámara celular o USB
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Contenido Plegable Opción B */}
                      {acordeonOfflineExpandido ? (
                        <div className="p-3 sm:p-3.5 pt-0">
                          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-2xs border border-orange-100 space-y-2.5">
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              Los alumnos ejecutan el archivo sin internet. Al finalizar, genera un <strong>Código QR Seguro</strong> que el docente escanea con su celular o exportan el archivo para importar vía USB.
                            </p>

                            {/* Botones de Acción Opción B */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <a
                                href={archivoOfflineDescarga}
                                download={`diagnostico_${nivelActivo}_offline.html`}
                                className="inline-flex items-center justify-center gap-1.5 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-2xs"
                              >
                                <DownloadSimple size={15} className="text-white" />
                                <span>Descargar offline</span>
                              </a>

                              <a
                                href={archivoEscanerPWA}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-lg transition-all shadow-2xs ${
                                  nivelActivo === "7mo"
                                    ? "bg-[#002b49] hover:bg-[#113a60] text-white border border-[#1F3F78]"
                                    : "bg-[#1B5E59] hover:bg-[#144642] text-white border border-[#047857]"
                                }`}
                                title={`Abrir Escáner de Datos ${nivelActivo === "7mo" ? "7.° Año" : "9.° Año"} en una pestaña nueva`}
                              >
                                <Camera size={15} weight="bold" className={nivelActivo === "7mo" ? "text-amber-300" : "text-emerald-300"} />
                                <span>Escáner {nivelActivo === "7mo" ? "7.° Año" : "9.° Año"}</span>
                              </a>

                              <label className="inline-flex items-center justify-center gap-1.5 bg-[#D4AF5A] hover:bg-[#B9923F] text-[#20283B] text-xs font-black px-3 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer">
                                <DownloadSimple size={15} weight="bold" />
                                <span>Importar JSON/CSV (USB)</span>
                                <input
                                  type="file"
                                  accept=".json,.csv,.txt"
                                  multiple
                                  className="hidden"
                                  onChange={handleImportarArchivosLote}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 pb-2.5 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[#974800] font-bold text-[11px]">
                            Modo fuera de línea listo
                          </span>
                          <a
                            href={archivoEscanerPWA}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-white text-[11px] font-black px-2.5 py-1 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs ${
                              nivelActivo === "7mo"
                                ? "bg-[#002b49] hover:bg-[#113a60]"
                                : "bg-[#1B5E59] hover:bg-[#144642]"
                            }`}
                          >
                            <Camera size={12} weight="bold" />
                            <span>Escáner {nivelActivo === "7mo" ? "7.° Año" : "9.° Año"}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TARJETA 3: OPCIÓN C (EN PAPEL / PDF IMPRIMIBLE - 100% FÍSICO) */}
                  {(filtroModoEnlaces === "todos" || filtroModoEnlaces === "impreso") && (
                    <div className="bg-[#F5F3FF] rounded-2xl border-2 border-[#DDD6FE] shadow-xs overflow-hidden transition-all">
                      {/* Cabecera Plegable Opción C */}
                      <button
                        type="button"
                        onClick={() => setAcordeonImpresoExpandido(!acordeonImpresoExpandido)}
                        className="w-full p-3.5 flex flex-col gap-2 text-left hover:bg-[#ede9fe] transition-colors cursor-pointer select-none"
                        aria-expanded={acordeonImpresoExpandido}
                      >
                        {/* Fila superior: Badges e indicador de colapso */}
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-[#6366F1] text-white text-[10px] font-black tracking-wide uppercase shadow-2xs">
                              OPCIÓN C
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-[#DDD6FE] text-[10px] font-black text-[#6366F1]">
                              📄 PDF Fotocopiable
                            </span>
                          </div>
                          <div className={`w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#4338CA] shadow-2xs transition-transform duration-200 shrink-0 ${acordeonImpresoExpandido ? "rotate-180" : ""}`}>
                            <CaretDown size={14} weight="bold" />
                          </div>
                        </div>

                        {/* Fila inferior: Ícono, Título completo y Subtítulo */}
                        <div className="flex items-start gap-2.5 pt-0.5">
                          <div className="w-8 h-8 rounded-xl bg-[#6366F1] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs mt-0.5">
                            <FilePdf size={18} weight="fill" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-black text-[#4338CA] leading-tight">
                              En Papel (PDF Imprimible)
                            </h3>
                            <p className="text-[11.5px] text-[#6366F1] font-semibold mt-0.5 leading-snug">
                              100% Físico • Sin conexión ni equipos
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Contenido Plegable Opción C */}
                      {acordeonImpresoExpandido ? (
                        <div className="p-3 sm:p-3.5 pt-0">
                          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-2xs border border-purple-100 space-y-2.5">
                            <p className="text-xs text-slate-600 font-medium leading-relaxed">
                              Guía pedagógica completa con preguntas escritas, actividades prácticas recortables, situaciones de análisis e instrumentos de cotejo para el aula.
                            </p>

                            {/* Botones de Acción Opción C */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <a
                                href={archivoPDFImprimibleDescarga}
                                download={`evaluacion_diagnostica_${nivelActivo}_imprimible_MEP.pdf`}
                                className="inline-flex items-center justify-center gap-1.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
                                title="Descargar inmediatamente el documento PDF oficial"
                              >
                                <DownloadSimple size={15} weight="bold" className="text-white" />
                                <span>Descargar PDF</span>
                              </a>

                              <a
                                href={archivoPDFImprimibleDescarga}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-2.5 py-2 rounded-lg transition-colors shadow-2xs"
                                title="Abrir el documento PDF en una pestaña nueva para imprimir"
                              >
                                <Printer size={15} className="text-slate-500" />
                                <span>Abrir / Imprimir ↗</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 pb-2.5 flex items-center justify-between gap-2 text-xs">
                          <span className="text-[#4338CA] font-bold text-[11px]">
                            Guía PDF en papel lista
                          </span>
                          <a
                            href={archivoPDFImprimibleDescarga}
                            download={`evaluacion_diagnostica_${nivelActivo}_imprimible_MEP.pdf`}
                            className="bg-[#6366F1] text-white text-[11px] font-black px-2.5 py-1 rounded-md hover:bg-[#4F46E5] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          >
                            <DownloadSimple size={12} weight="bold" />
                            <span>Descargar PDF</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* SECCIÓN 2: REGISTRO COGNITIVO (Datos del Saber en Vivo)   */}
            {/* ========================================================= */}
            {seccionActivaMenu === "cognitivo" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Acordeón Plegable: Áreas Curriculares y Criterios Asociados (Módulo 1) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setAcordeonDimensionesCognitivo(!acordeonDimensionesCognitivo)}
                    className="w-full p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-teal-50/70 via-slate-50 to-white hover:bg-teal-50/80 transition-colors text-left cursor-pointer select-none"
                    aria-expanded={acordeonDimensionesCognitivo}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D1EBE7] text-[#1B5E59] flex items-center justify-center font-bold text-sm shrink-0">
                        <BookOpen size={18} weight="fill" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                            Criterios Módulo 1
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-300">
                            {nivelActivo === "7mo"
                              ? "Programación y algoritmos • Apropiación tecnológica y digital"
                              : "Computación física, robótica y automatización • Programación y algoritmos"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Haga clic para {acordeonDimensionesCognitivo ? "contraer" : "expandir"} los saberes diagnosticados del Módulo 1.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold shrink-0">
                      <span>{acordeonDimensionesCognitivo ? "Ocultar" : "Ver saberes"}</span>
                      <CaretDown
                        size={18}
                        weight="bold"
                        className={`transition-transform duration-200 ${acordeonDimensionesCognitivo ? "rotate-180 text-[#1B5E59]" : ""}`}
                      />
                    </div>
                  </button>

                  {acordeonDimensionesCognitivo && (
                    <div className="p-4 sm:p-5 bg-slate-50/60 border-t border-slate-200/80 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {(SABERES_COGNITIVOS_MAP[nivelActivo] || SABERES_COGNITIVOS_MAP["9no"]).map((saber) => (
                          <div
                            key={saber.id}
                            className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 border-l-4 border-l-[#1B5E59] hover:shadow-md transition-all flex flex-col justify-center"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                              <span className="w-5 h-5 rounded-full bg-teal-100 text-[#1B5E59] font-black text-[10px] flex items-center justify-center shrink-0">
                                {saber.id}
                              </span>
                              {saber.areaCurricular && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100 truncate max-w-[130px]" title={saber.areaCurricular}>
                                  {saber.areaCurricular}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {saber.nombre}
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabla de Resultados Cognitivos (Acoplable/Desacoplable) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
                  <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#D1EBE7] text-[#1B5E59] flex items-center justify-center font-bold text-xs shrink-0">
                        <BookOpen size={16} weight="bold" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                          <span>Resultados de Criterios Cognitivos — Sección {seccionActiva}</span>
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium block truncate">
                          {registrosSeccion.length} estudiantes registrados
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setAcordeonTablaCognitivo(!acordeonTablaCognitivo)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{acordeonTablaCognitivo ? "Acoplar tabla" : "Desacoplar tabla"}</span>
                        <CaretDown
                          size={14}
                          weight="bold"
                          className={`transition-transform duration-200 ${acordeonTablaCognitivo ? "rotate-180 text-[#1B5E59]" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {acordeonTablaCognitivo && (
                    <div className="animate-fadeIn">
                      {registrosSeccion.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                          <BookOpen size={36} className="mx-auto text-slate-300" />
                          <p className="text-sm font-bold text-slate-700">No hay registros cognitivos para esta sección aún</p>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Comparta el enlace o escanee los códigos QR de los estudiantes para ver el desglose en vivo.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 sm:p-4 pt-2 space-y-3">
                          {/* Barra de Navegación Rápida y Desplazamiento Horizontal */}
                          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-100/90 rounded-xl border border-slate-200">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                              <ArrowsLeftRight size={16} className="text-[#1B5E59]" weight="bold" />
                              <span>Navegación rápida de la tabla:</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => scrollTabla(tablaCognitivoRef, "inicio")}
                                className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-2xs cursor-pointer inline-flex items-center gap-1 transition-all hover:border-[#1B5E59]"
                              >
                                <span>⏮️ Estudiantes</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => scrollTabla(tablaCognitivoRef, "izq")}
                                className="px-2 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-2xs cursor-pointer inline-flex items-center gap-0.5 transition-all hover:border-[#1B5E59]"
                                title="Desplazar a la izquierda"
                              >
                                <CaretLeft size={14} weight="bold" />
                                <span>Desplazar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => scrollTabla(tablaCognitivoRef, "medio1")}
                                className="px-2.5 py-1 text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg border border-teal-200 shadow-2xs cursor-pointer inline-flex items-center gap-1 transition-all"
                              >
                                <span>Criterios 1-5</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => scrollTabla(tablaCognitivoRef, "medio2")}
                                className="px-2.5 py-1 text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg border border-teal-200 shadow-2xs cursor-pointer inline-flex items-center gap-1 transition-all"
                              >
                                <span>Criterios 6-10</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => scrollTabla(tablaCognitivoRef, "der")}
                                className="px-2 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-2xs cursor-pointer inline-flex items-center gap-0.5 transition-all hover:border-[#1B5E59]"
                                title="Desplazar a la derecha"
                              >
                                <span>Desplazar</span>
                                <CaretRight size={14} weight="bold" />
                              </button>
                              <button
                                type="button"
                                onClick={() => scrollTabla(tablaCognitivoRef, "final")}
                                className="px-3 py-1 text-xs font-black bg-[#1B5E59] hover:bg-[#154945] text-white rounded-lg border border-[#1B5E59] shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all"
                              >
                                <span>🎯 Calificación Final ⏭️</span>
                              </button>
                            </div>
                          </div>

                          <div ref={tablaCognitivoRef} className="overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 shadow-2xs">
                            <table className="w-full text-left border-collapse text-xs min-w-[1650px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                                  <th className="py-3 px-4 w-56 min-w-[200px] sticky left-0 bg-slate-100 z-20 shadow-xs border-r-2 border-slate-300">
                                    Persona Estudiante
                                  </th>
                                  {(SABERES_COGNITIVOS_MAP[nivelActivo] || SABERES_COGNITIVOS_MAP["9no"]).map((saber) => (
                                    <th key={saber.id} className="py-3 px-2 text-center min-w-[105px]">
                                      <div className="flex flex-col items-center justify-center gap-1">
                                        <span className="font-bold text-slate-800 text-[11px] leading-tight text-center truncate max-w-[115px]" title={`${saber.nombre} (${saber.areaCurricular || "Cognitivo"})`}>
                                          {saber.id}. {saber.saber}
                                        </span>
                                        <span className="text-[9.5px] font-bold text-[#1B5E59] bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 whitespace-nowrap">
                                          {saber.pregunta.replace("Pregunta ", "P. ")}
                                        </span>
                                        <span className="text-[9px] text-slate-400 font-normal normal-case">Escala L / ED / RA</span>
                                      </div>
                                    </th>
                                  ))}
                                  <th className="py-3 px-3 text-center min-w-[85px] bg-teal-50/50 border-l border-slate-200 font-black text-slate-900">
                                    Puntaje %
                                  </th>
                                  <th className="py-3 px-4 text-center min-w-[130px] bg-teal-50/50 font-black text-slate-900">
                                    Nivel de Logro
                                  </th>
                                  <th className="py-3 px-3 text-right min-w-[85px]">Hora</th>
                                  <th className="py-3 px-3 text-center w-20">Acción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {registrosSeccion.map((r, i) => (
                                  <tr key={r.idResultado || r.timestamp || i} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="py-3 px-4 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r-2 border-slate-200">
                                      <span className="block truncate">{r.estudianteNombre}</span>
                                      {r.estudianteCedula && (
                                        <span className="block text-[10px] text-slate-400 font-mono font-normal">
                                          {r.estudianteCedula}
                                        </span>
                                      )}
                                    </td>
                                    {(SABERES_COGNITIVOS_MAP[nivelActivo] || SABERES_COGNITIVOS_MAP["9no"]).map((saber, idx) => {
                                      const valSaber = obtenerLogroSaberEstudiante(r, saber, idx);
                                      return (
                                        <td key={saber.id} className="py-3 px-2 text-center">
                                          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
                                            {(["L", "ED", "RA"] as const).map((escala) => {
                                              const seleccionado = valSaber === escala;
                                              return (
                                                <button
                                                  key={escala}
                                                  type="button"
                                                  onClick={() => handleActualizarCognitivoSaber(r.timestamp, saber.id, escala)}
                                                  title={`Saber ${saber.id}: ${saber.nombre} → Nivel ${escala === "L" ? "Logrado (L)" : escala === "ED" ? "En Desarrollo (ED)" : "Requiere Acompañamiento (RA)"}`}
                                                  className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                                                    seleccionado
                                                      ? escala === "L"
                                                        ? "bg-emerald-600 text-white shadow-xs"
                                                        : escala === "ED"
                                                        ? "bg-amber-500 text-white shadow-xs"
                                                        : "bg-rose-500 text-white shadow-xs"
                                                      : "text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                                                  }`}
                                                >
                                                  {escala}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </td>
                                      );
                                    })}
                                    <td className="py-3 px-3 text-center font-black text-slate-900 bg-teal-50/30 border-l border-slate-200">
                                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-300">
                                        {r.porcentaje || 0}%
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-center bg-teal-50/30">
                                      <span
                                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs ${
                                          (r.nivelLogro as string) === "Avanzado" || (r.nivelLogro as string) === "Logrado"
                                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                            : (r.nivelLogro as string) === "Intermedio" || (r.nivelLogro as string) === "En Proceso"
                                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                                            : "bg-rose-100 text-rose-900 border border-rose-300"
                                        }`}
                                      >
                                        {r.nivelLogro || "Inicial"}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                                      {r.timestamp ? new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleEliminarEstudiante(r)}
                                        title={`Eliminar registro de ${r.estudianteNombre}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                                      >
                                        <Trash size={13} weight="bold" />
                                        <span>Borrar</span>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* SECCIÓN 3: REGISTRO SOCIOAFECTIVO (MEP Oficial)           */}
            {/* ========================================================= */}
            {seccionActivaMenu === "socioafectivo" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Acordeón Plegable: Criterios Asociados Socioafectivos */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setAcordeonDimensionesSocio(!acordeonDimensionesSocio)}
                    className="w-full p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-teal-50/70 via-slate-50 to-white hover:bg-teal-50 transition-colors text-left cursor-pointer select-none"
                    aria-expanded={acordeonDimensionesSocio}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D1EBE7] text-[#1B5E59] flex items-center justify-center font-bold text-sm shrink-0">
                        <Heart size={18} weight="fill" />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                          Criterios Módulo 1
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-[#1B5E59] font-bold text-[10px] border border-teal-300">
                          {nivelActivo === "7mo" ? "Socioafectivo • Saberes Actitudinales" : "Socioafectivo"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block text-xs font-bold text-[#1B5E59]">
                        {acordeonDimensionesSocio ? "Contraer criterios" : "Ver 4 criterios"}
                      </span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-600 transition-transform duration-200 ${acordeonDimensionesSocio ? "rotate-180" : ""}`}>
                        <CaretDown size={16} weight="bold" />
                      </div>
                    </div>
                  </button>

                  {acordeonDimensionesSocio && (
                    <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(CRITERIOS_SOCIOAFECTIVOS_MAP[nivelActivo] || CRITERIOS_SOCIOAFECTIVOS_MAP["7mo"]).map((crit) => (
                          <div
                            key={crit.id}
                            onClick={() => setCriterioSocioModalDetalle(crit)}
                            className="bg-white p-4 rounded-xl border-l-4 border-l-[#1B5E59] border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                            title="Haga clic para ver la rúbrica oficial y niveles de logro"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                                <span className="text-xs font-black text-[#1B5E59] group-hover:text-teal-700 transition-colors">
                                  {crit.codigo}
                                </span>
                                <BadgeModalidadExplicativa
                                  modalidad={crit.modalidadEvaluacion || "telemetria"}
                                  labelPersonalizado={crit.etiquetaModalidad || (crit.modalidadEvaluacion === "telemetria" ? "🤖 Telemetría" : "👨‍🏫 Foco Docente")}
                                />
                              </div>
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                  Pregunta de reflexión:
                                </span>
                                <p className="text-xs font-semibold text-slate-800 italic leading-snug">
                                  {crit.preguntaReflexion}
                                </p>
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-medium">3 Niveles: C ➔ B ➔ A</span>
                              <span className="text-[#1B5E59] font-bold underline group-hover:no-underline">
                                Ver detalle rúbrica
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Matriz Interactiva de Observación Socioafectiva (Acoplable/Desacoplable) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
                  <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#D1EBE7] text-[#1B5E59] flex items-center justify-center font-bold text-xs shrink-0">
                        <Heart size={16} weight="fill" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          Matriz Socioafectiva (Escala MEP: A=Logrado, B=En Proceso, C=Inicial)
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium block truncate">
                          Sección {seccionActiva} • {registrosSeccion.length} estudiantes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setVistaSocioafectiva("matriz")}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            vistaSocioafectiva === "matriz"
                              ? "bg-[#1B5E59] text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Matriz
                        </button>
                        <button
                          type="button"
                          onClick={() => setVistaSocioafectiva("tarjetas")}
                          className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                            vistaSocioafectiva === "tarjetas"
                              ? "bg-[#1B5E59] text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          Tarjetas
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAcordeonTablaSocio(!acordeonTablaSocio)}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{acordeonTablaSocio ? "Acoplar" : "Desacoplar"}</span>
                        <CaretDown
                          size={14}
                          weight="bold"
                          className={`transition-transform duration-200 ${acordeonTablaSocio ? "rotate-180 text-[#1B5E59]" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {acordeonTablaSocio && (
                    <div className="animate-fadeIn">
                      {registrosSeccion.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                          <Heart size={36} className="mx-auto text-slate-300" />
                          <p className="text-sm font-bold text-slate-700">Sin datos socioafectivos para esta sección</p>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Inicie una observación o cargue las respuestas de los estudiantes para habilitar la matriz de bienestar.
                          </p>
                        </div>
                      ) : vistaSocioafectiva === "matriz" ? (
                        <div className="p-3 sm:p-4 pt-2 space-y-2">
                          <div ref={tablaSocioafectivoRef} className="overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 shadow-2xs">
                            <table className="w-full text-left border-collapse text-xs min-w-[1100px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                                  <th className="py-3 px-4 w-60 sticky left-0 bg-slate-100 z-20 shadow-xs border-r-2 border-slate-300">
                                    Persona Estudiante
                                  </th>
                                  <th className="py-3 px-3 text-center w-36">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-bold text-slate-700">S1. Gusto por la precisión</span>
                                      <BadgeModalidadExplicativa modalidad="telemetria" labelPersonalizado="🤖 Telemetría" alineacionHorizontal="left" />
                                    </div>
                                  </th>
                                  <th className="py-3 px-3 text-center w-36">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-bold text-slate-700">S2. Aprender del error</span>
                                      <BadgeModalidadExplicativa modalidad="telemetria" labelPersonalizado="🤖 Telemetría" alineacionHorizontal="center" />
                                    </div>
                                  </th>
                                  <th className="py-3 px-3 text-center w-44">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-bold text-slate-700">S3. Flexibilidad para manejar problemas</span>
                                      <BadgeModalidadExplicativa modalidad="hibrido" labelPersonalizado="⚡ Híbrido + Docente" alineacionHorizontal="center" />
                                    </div>
                                  </th>
                                  <th className="py-3 px-3 text-center w-40">
                                    <div className="flex flex-col items-center gap-1">
                                      <span className="font-bold text-slate-700">S4. Tolerancia a la frustración</span>
                                      <BadgeModalidadExplicativa modalidad="hibrido" labelPersonalizado="⚡ Híbrido + Docente" alineacionHorizontal="right" />
                                    </div>
                                  </th>
                                  <th className="py-3 px-4 min-w-[240px]">Nota Pedagógica del Docente</th>
                                  <th className="py-3 px-3 text-center w-24">Acción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium">
                                {registrosSeccion.map((r, i) => {
                                  const socio = r.socioafectivo || {};
                                  const s1Val = socio.s1;
                                  const s2Val = socio.s2;
                                  const s3Val = socio.s3;
                                  const s4Val = socio.s4;
                                  const idKey = r.idResultado || r.estudianteCedula || r.estudianteNombre;
                                  const tieneAlerta = (r.telemetria && r.telemetria.anomalias && r.telemetria.anomalias.length > 0) || (r.telemetria && r.telemetria.intentosTotales && r.telemetria.intentosTotales > 10) || (r.intentos && r.intentos > 10);

                                  return (
                                    <tr key={r.idResultado || r.timestamp || i} className="hover:bg-slate-50/80 transition-colors group">
                                      <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r-2 border-slate-200">
                                        <div className="flex items-center gap-2">
                                          <span className="font-bold text-slate-900 block truncate">{r.estudianteNombre}</span>
                                          {tieneAlerta && (
                                            <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200" title="Telemetría detectó reintentos o fluctuación frecuente. Recomendada contención socioafectiva.">
                                              ⚠️ Foco
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-mono">{r.estudianteCedula || "Estudiante"}</span>
                                      </td>

                                {/* S1 Selector */}
                                <td className="py-3 px-2 text-center">
                                  <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
                                    {(["A", "B", "C"] as const).map((v) => (
                                      <button
                                        key={v}
                                        type="button"
                                        onClick={() => handleActualizarSocioafectivo(r.timestamp, "s1", v)}
                                        className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                          s1Val === v
                                            ? v === "A"
                                              ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                                              : v === "B"
                                              ? "bg-amber-500 text-white shadow-2xs"
                                              : "bg-rose-500 text-white shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        {v}
                                      </button>
                                    ))}
                                  </div>
                                </td>

                                {/* S2 Selector */}
                                <td className="py-3 px-2 text-center">
                                  <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
                                    {(["A", "B", "C"] as const).map((v) => (
                                      <button
                                        key={v}
                                        type="button"
                                        onClick={() => handleActualizarSocioafectivo(r.timestamp, "s2", v)}
                                        className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                          s2Val === v
                                            ? v === "A"
                                              ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                                              : v === "B"
                                              ? "bg-amber-500 text-white shadow-2xs"
                                              : "bg-rose-500 text-white shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        {v}
                                      </button>
                                    ))}
                                  </div>
                                </td>

                                {/* S3 Selector */}
                                <td className="py-3 px-2 text-center">
                                  <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
                                    {(["A", "B", "C"] as const).map((v) => (
                                      <button
                                        key={v}
                                        type="button"
                                        onClick={() => handleActualizarSocioafectivo(r.timestamp, "s3", v)}
                                        className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                          s3Val === v
                                            ? v === "A"
                                              ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                                              : v === "B"
                                              ? "bg-amber-500 text-white shadow-2xs"
                                              : "bg-rose-500 text-white shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        {v}
                                      </button>
                                    ))}
                                  </div>
                                </td>

                                {/* S4 Selector */}
                                <td className="py-3 px-2 text-center">
                                  <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
                                    {(["A", "B", "C"] as const).map((v) => (
                                      <button
                                        key={v}
                                        type="button"
                                        onClick={() => handleActualizarSocioafectivo(r.timestamp, "s4", v)}
                                        className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                          s4Val === v
                                            ? v === "A"
                                              ? "bg-emerald-600 text-white font-extrabold shadow-xs"
                                              : v === "B"
                                              ? "bg-amber-500 text-white shadow-2xs"
                                              : "bg-rose-500 text-white shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                        }`}
                                      >
                                        {v}
                                      </button>
                                    ))}
                                  </div>
                                </td>

                                {/* Nota del Docente */}
                                <td className="py-3 px-4">
                                  <input
                                    type="text"
                                    defaultValue={notasLocales[idKey] || r.observacionDocente || ""}
                                    onBlur={(e) => guardarNotaDocente(idKey, e.target.value)}
                                    placeholder="Añadir observación..."
                                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#1B5E59]"
                                  />
                                </td>

                                {/* Botón Borrar */}
                                <td className="py-3 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleEliminarEstudiante(r)}
                                    title={`Eliminar registro de ${r.estudianteNombre}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                                  >
                                    <Trash size={13} weight="bold" />
                                    <span>Borrar</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  ) : (
                    /* Vista Tarjetas con Sparklines */
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {registrosSeccion.map((r, idx) => {
                        const socio = r.socioafectivo || {};
                        return (
                        <div
                          key={r.idResultado || r.timestamp || idx}
                          className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{r.estudianteNombre}</h4>
                              <p className="text-[10px] text-slate-400 font-mono">{r.seccionOGrupo || seccionActiva}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D1EBE7] text-[#1B5E59]">
                                {r.porcentaje || 0}% Cognitivo
                              </span>
                              <button
                                type="button"
                                onClick={() => handleEliminarEstudiante(r)}
                                title={`Eliminar registro de ${r.estudianteNombre}`}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-all cursor-pointer"
                              >
                                <Trash size={13} weight="bold" />
                              </button>
                            </div>
                          </div>

                          {/* Sparkline Decorativo */}
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                              <span>Tendencia de Bienestar</span>
                              <span className="font-bold text-emerald-700">Observación formativa</span>
                            </div>
                            <div className="w-full h-8">
                              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 30">
                                <path
                                  d="M0,22 C30,18 60,25 90,12 C120,8 150,15 180,6 L200,8"
                                  fill="none"
                                  stroke="#1B5E59"
                                  strokeWidth="2"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Micro-indicadores */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-1.5 bg-slate-50 rounded border border-slate-100 flex justify-between">
                              <span className="text-slate-500">S1. Gusto por la precisión:</span>
                              <strong className={`font-bold ${socio.s1 ? (socio.s1 === "A" ? "text-emerald-700" : socio.s1 === "B" ? "text-amber-700" : "text-rose-700") : "text-slate-400"}`}>
                                {socio.s1 || "—"}
                              </strong>
                            </div>
                            <div className="p-1.5 bg-slate-50 rounded border border-slate-100 flex justify-between">
                              <span className="text-slate-500">S2. Aprender del error:</span>
                              <strong className={`font-bold ${socio.s2 ? (socio.s2 === "A" ? "text-emerald-700" : socio.s2 === "B" ? "text-amber-700" : "text-rose-700") : "text-slate-400"}`}>
                                {socio.s2 || "—"}
                              </strong>
                            </div>
                            <div className="p-1.5 bg-slate-50 rounded border border-slate-100 flex justify-between">
                              <span className="text-slate-500">S3. Flexibilidad:</span>
                              <strong className={`font-bold ${socio.s3 ? (socio.s3 === "A" ? "text-emerald-700" : socio.s3 === "B" ? "text-amber-700" : "text-rose-700") : "text-slate-400"}`}>
                                {socio.s3 || "—"}
                              </strong>
                            </div>
                            <div className="p-1.5 bg-slate-50 rounded border border-slate-100 flex justify-between">
                              <span className="text-slate-500">S4. Tolerancia frustración:</span>
                              <strong className={`font-bold ${socio.s4 ? (socio.s4 === "A" ? "text-emerald-700" : socio.s4 === "B" ? "text-amber-700" : "text-rose-700") : "text-slate-400"}`}>
                                {socio.s4 || "—"}
                              </strong>
                            </div>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

                {/* Modal Oficial MEP de Detalle Socioafectivo / Rúbrica de Reflexión */}
                {criterioSocioModalDetalle && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 space-y-4">
                      {/* Encabezado Superior con Badge y Cerrar */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                            <span>❤️</span>
                            <span>3. ÁREA SOCIOAFECTIVA (MEP OFICIAL)</span>
                          </div>
                          <BadgeModalidadExplicativa
                            modalidad={criterioSocioModalDetalle.modalidadEvaluacion || "telemetria"}
                            labelPersonalizado={criterioSocioModalDetalle.etiquetaModalidad || (criterioSocioModalDetalle.modalidadEvaluacion === "telemetria" ? "🤖 Telemetría" : "👨‍🏫 Foco Docente")}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setCriterioSocioModalDetalle(null)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <X size={18} weight="bold" />
                        </button>
                      </div>

                      {/* Título Principal */}
                      <div>
                        <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                          Criterio Socioafectivo
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-[#0f2d4a] tracking-tight leading-snug">
                          {criterioSocioModalDetalle.codigo}
                        </h3>
                      </div>

                      {/* Tarjeta de Pregunta de Reflexión */}
                      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-4.5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase tracking-wide">
                          <span>❓</span>
                          <span>PREGUNTA DE REFLEXIÓN PARA EL ESTUDIANTE:</span>
                        </div>
                        <p className="text-xs sm:text-[14px] text-amber-950 font-bold italic leading-relaxed">
                          {criterioSocioModalDetalle.preguntaReflexion}
                        </p>
                        {criterioSocioModalDetalle.modalidadNota && (
                          <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded mt-1">
                            ℹ️ {criterioSocioModalDetalle.modalidadNota}
                          </span>
                        )}
                      </div>

                      {/* Tarjeta de Niveles de Logro MEP */}
                      <div className="border border-slate-200 rounded-2xl p-4 sm:p-4.5 space-y-2.5 bg-white">
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                          <span>📊</span>
                          <span>Niveles de Logro Formativo MEP:</span>
                        </div>

                        {/* Nivel A (Avanzado) */}
                        <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl text-xs sm:text-[13px] leading-snug">
                          <strong className="text-emerald-950 font-black">(A) Avanzado: </strong>
                          <span className="text-emerald-900 font-medium">{criterioSocioModalDetalle.escalaA}</span>
                        </div>

                        {/* Nivel B (Intermedio) */}
                        <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-xs sm:text-[13px] leading-snug">
                          <strong className="text-amber-950 font-black">(B) Intermedio: </strong>
                          <span className="text-amber-900 font-medium">{criterioSocioModalDetalle.escalaB}</span>
                        </div>

                        {/* Nivel C (Inicial) */}
                        <div className="p-3 bg-rose-50/90 border border-rose-300 rounded-xl text-xs sm:text-[13px] leading-snug">
                          <strong className="text-rose-950 font-black">(C) Inicial: </strong>
                          <span className="text-rose-900 font-medium">{criterioSocioModalDetalle.escalaC}</span>
                        </div>
                      </div>

                      {/* Botón Acción */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setCriterioSocioModalDetalle(null)}
                          className="w-full py-3 px-4 bg-[#1B5E59] hover:bg-[#144642] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                        >
                          <Check size={16} weight="bold" />
                          <span>Entendido / Continuar Registro</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ========================================================= */}
            {/* SECCIÓN 4: REGISTRO PSICOMOTRIZ OFICIAL MEP               */}
            {/* ========================================================= */}
            {seccionActivaMenu === "psicomotriz" && (() => {
              const criteriosActuales = CRITERIOS_PSICOMOTRICES_MAP[nivelActivo] || CRITERIOS_PSICOMOTRICES_MAP["9no"];
              const totalEstudiantes = registrosSeccion.length;
              const evaluadosCount = totalEstudiantes;

              return (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Barra de Acciones y Filtros */}
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
                      {/* Búsqueda rápida */}
                      <div className="relative flex-1 min-w-[180px] max-w-sm">
                        <MagnifyingGlass size={15} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          placeholder="Buscar estudiante por nombre o apellido..."
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E59]/30 focus:border-[#1B5E59]"
                        />
                      </div>

                      {/* Notificación o Estado de Guardado */}
                      {mensajeGuardadoGlobal && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold animate-fadeIn">
                          <CheckCircle size={15} weight="fill" className="text-emerald-600" />
                          <span>{mensajeGuardadoGlobal}</span>
                        </div>
                      )}
                      {!mensajeGuardadoGlobal && Object.values(cambiosPendientes).some(Boolean) && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-[11px] font-bold animate-pulse">
                          <span>⚠️ Cambios pendientes de guardar</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Botón Acoplar / Desacoplar Tabla Psicomotriz */}
                      <button
                        type="button"
                        onClick={() => setAcordeonTablaPsico(!acordeonTablaPsico)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="Acoplar o desacoplar la tabla de cotejo psicomotriz"
                      >
                        <ArrowsLeftRight size={14} weight="bold" />
                        <span>{acordeonTablaPsico ? "Acoplar tabla" : "Desacoplar tabla"}</span>
                      </button>

                      {/* Botón Guardar Cambios de Sección (Global) */}
                      <button
                        type="button"
                        onClick={handleGuardarTodoPsicomotriz}
                        title="Guarda todas las observaciones pedagógicas y valoraciones de la sección activa"
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95 ${
                          Object.values(cambiosPendientes).some(Boolean)
                            ? "bg-[#1B5E59] hover:bg-[#144642] text-white ring-2 ring-emerald-400/50"
                            : "bg-slate-900 hover:bg-black text-white"
                        }`}
                      >
                        <Check size={15} weight="bold" />
                        <span>Guardar Cambios de la Sección</span>
                      </button>

                      {/* Botón Marcar Todo en Nivel A */}
                      <button
                        type="button"
                        onClick={handleMarcarTodaSeccionPsicomotrizNivelA}
                        title="Marca todos los criterios de los estudiantes visibles en Nivel A (Logrado)"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FFF3EB] hover:bg-[#FDE2D0] text-[#E07A2C] border border-[#FBD0B6] rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        <Lightning size={15} weight="fill" />
                        <span>Marcar Todo en Nivel A</span>
                      </button>

                      <div className="text-xs text-slate-500 font-bold pl-2 border-l border-slate-200">
                        Total: <strong className="text-slate-800">{totalEstudiantes}</strong> • Evaluados: <strong className="text-emerald-700">{evaluadosCount}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Acordeón Plegable: Criterios Módulo 1 (Psicomotor) */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setGuiaSimbologiaAbierta(!guiaSimbologiaAbierta)}
                      className="w-full p-4 bg-gradient-to-r from-teal-50/70 via-slate-50 to-white hover:bg-teal-50/80 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer select-none"
                      aria-expanded={guiaSimbologiaAbierta}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#D1EBE7] text-[#1B5E59] flex items-center justify-center font-bold text-sm shrink-0">
                          <Pulse size={18} weight="bold" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                              Criterios Módulo 1
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider border border-teal-300">
                              {nivelActivo === "7mo" ? "Psicomotor" : "Psicomotor / Procedimental"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Haga clic para {guiaSimbologiaAbierta ? "contraer" : "expandir"} los {criteriosActuales.length} criterios, indicadores de logro y rúbricas del Módulo 1.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold shrink-0">
                        <span>{guiaSimbologiaAbierta ? "Ocultar" : "Ver criterios y rúbricas"}</span>
                        <CaretDown
                          size={18}
                          weight="bold"
                          className={`transition-transform duration-200 ${guiaSimbologiaAbierta ? "rotate-180 text-[#1B5E59]" : ""}`}
                        />
                      </div>
                    </button>

                    {guiaSimbologiaAbierta && (
                      <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 animate-fadeIn">
                        <div className={`grid grid-cols-1 sm:grid-cols-2 ${criteriosActuales.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4`}>
                          {criteriosActuales.map((crit) => (
                            <div
                              key={crit.id}
                              onClick={() => setCriterioModalDetalle(crit)}
                              className="bg-white p-4 rounded-xl border-l-4 border-l-[#1B5E59] border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                              title="Haga clic para ver la rúbrica oficial y niveles de logro"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                                  <span className="text-xs font-black text-[#1B5E59] group-hover:text-teal-700 transition-colors">
                                    {crit.codigo}
                                  </span>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {crit.areaCurricular && (
                                      <span className="text-[10px] bg-teal-50 text-[#1B5E59] font-bold px-2 py-0.5 rounded border border-teal-200">
                                        {crit.areaCurricular}
                                      </span>
                                    )}
                                    <BadgeModalidadExplicativa
                                      modalidad={
                                        crit.modalidadEvaluacion === "telemetria"
                                          ? "telemetria"
                                          : crit.modalidadEvaluacion === "hibrido"
                                          ? "hibrido"
                                          : "docente"
                                      }
                                      labelPersonalizado={
                                        crit.modalidadEvaluacion === "telemetria"
                                          ? "🤖 Telemetría"
                                          : crit.modalidadEvaluacion === "hibrido"
                                          ? "⚡ Híbrido"
                                          : "👨‍🏫 Foco Docente"
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-2">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                    Pregunta guía / Acción observable:
                                  </span>
                                  <p className="text-xs font-semibold text-slate-800 italic leading-snug">
                                    {crit.preguntaGuia || crit.desc}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 font-medium">3 Niveles: RA ➔ ED ➔ L</span>
                                <span className="text-[#1B5E59] font-bold underline group-hover:no-underline">
                                  Ver detalle rúbrica
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Banner Desplazamiento Horizontal Móvil */}
                  {acordeonTablaPsico && registrosSeccion.length > 0 && (
                    <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-emerald-50/80 border border-emerald-200 text-emerald-900 rounded-xl text-[11px] font-semibold sm:hidden">
                      <div className="flex items-center gap-1.5">
                        <ArrowsLeftRight size={14} weight="bold" className="text-emerald-700 animate-pulse" />
                        <span>Desliza horizontalmente para calificar los criterios</span>
                      </div>
                      <span className="text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">Scroll horizontal</span>
                    </div>
                  )}

                  {/* Tabla Principal Dinámica de Registro Psicomotriz */}
                  {acordeonTablaPsico && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden p-3 sm:p-4 space-y-3">
                    {registrosSeccion.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <Pulse size={40} className="mx-auto text-slate-300" />
                        <h4 className="text-sm font-bold text-slate-700">
                          No se encontraron estudiantes para la sección seleccionada.
                        </h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Los estudiantes que completen el diagnóstico en línea o mediante el escáner de datos se listarán automáticamente en esta nómina.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Barra de Navegación Rápida Psicomotriz */}
                        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-100/90 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <ArrowsLeftRight size={16} className="text-[#1B5E59]" weight="bold" />
                            <span>Navegación horizontal de rúbricas:</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => scrollTabla(tablaPsicomotrizRef, "inicio")}
                              className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-2xs cursor-pointer inline-flex items-center gap-1 transition-all hover:border-[#1B5E59]"
                            >
                              <span>⏮️ Estudiantes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollTabla(tablaPsicomotrizRef, "izq")}
                              className="px-2 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-2xs cursor-pointer inline-flex items-center gap-0.5 transition-all hover:border-[#1B5E59]"
                              title="Desplazar a la izquierda"
                            >
                              <CaretLeft size={14} weight="bold" />
                              <span>Desplazar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollTabla(tablaPsicomotrizRef, "medio1")}
                              className="px-2.5 py-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 shadow-2xs cursor-pointer inline-flex items-center gap-1 transition-all"
                            >
                              <span>Criterios P1-P4</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollTabla(tablaPsicomotrizRef, "der")}
                              className="px-2 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 shadow-2xs cursor-pointer inline-flex items-center gap-0.5 transition-all hover:border-[#1B5E59]"
                              title="Desplazar a la derecha"
                            >
                              <span>Desplazar</span>
                              <CaretRight size={14} weight="bold" />
                            </button>
                            <button
                              type="button"
                              onClick={() => scrollTabla(tablaPsicomotrizRef, "final")}
                              className="px-3 py-1 text-xs font-black bg-[#1B5E59] hover:bg-[#154945] text-white rounded-lg border border-[#1B5E59] shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all"
                            >
                              <span>🎯 Nivel Psicomotor ⏭️</span>
                            </button>
                          </div>
                        </div>

                        <div ref={tablaPsicomotrizRef} className="overflow-x-auto scrollbar-thin rounded-xl border border-slate-200 shadow-2xs">
                          <table className="w-full text-left border-collapse text-xs min-w-[1350px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                                <th className="py-3 px-4 w-56 min-w-[200px] sticky left-0 bg-slate-100 z-20 shadow-xs border-r-2 border-slate-300">
                                  Persona Estudiante (Nómina)
                                </th>
                              {criteriosActuales.map((crit, idx) => {
                                const modalidad: "telemetria" | "hibrido" | "docente" =
                                  crit.modalidadEvaluacion === "telemetria"
                                    ? "telemetria"
                                    : crit.modalidadEvaluacion === "hibrido"
                                    ? "hibrido"
                                    : "docente";
                                const alineacion: "left" | "center" | "right" =
                                  idx === 0 ? "left" : idx >= criteriosActuales.length - 2 ? "right" : "center";

                                return (
                                  <th key={crit.id} className="py-3 px-2 text-center w-24 min-w-[95px]">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => setCriterioModalDetalle(crit)}
                                        className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-black cursor-pointer group"
                                        title={`${crit.desc}\n\n(Haz clic para ver rúbrica oficial)`}
                                      >
                                        <span>{crit.codigo}</span>
                                        <span className="text-[10px] bg-emerald-100 group-hover:bg-emerald-200 text-emerald-800 px-1 py-0.2 rounded border border-emerald-300">ℹ️</span>
                                      </button>
                                      <BadgeModalidadExplicativa
                                        modalidad={modalidad}
                                        labelPersonalizado={
                                          modalidad === "telemetria"
                                            ? "🤖 Telemetría"
                                            : modalidad === "hibrido"
                                            ? "⚡ Híbrido"
                                            : "👨‍🏫 Foco Docente"
                                        }
                                        alineacionHorizontal={alineacion}
                                      />
                                      <span className="text-[10px] text-slate-400 font-normal normal-case">Escala A/B/C</span>
                                    </div>
                                  </th>
                                );
                              })}
                              <th className="py-3 px-3 text-center w-32 min-w-[120px]">Nivel Psicomotor</th>
                              <th className="py-3 px-4 flex-1 min-w-[260px]">Observación Pedagógica del Docente</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {registrosSeccion.map((r, i) => {
                              const psico = r.psicomotor || {};
                              const idKey = r.idResultado || r.estudianteCedula || r.estudianteNombre || `est-${i}`;
                              const tieneAlerta = (r.telemetria && r.telemetria.anomalias && r.telemetria.anomalias.length > 0) || (r.telemetria && r.telemetria.intentosTotales && r.telemetria.intentosTotales > 10) || (r.intentos && r.intentos > 10);
                              
                              // Calcular Nivel Psicomotor Formativo a partir de las observaciones del docente
                              let conteoA = 0;
                              let conteoB = 0;
                              let conteoC = 0;
                              let totalEvaluados = 0;
                              criteriosActuales.forEach((crit) => {
                                const v = psico[crit.id];
                                if (v === "A") { conteoA++; totalEvaluados++; }
                                else if (v === "B") { conteoB++; totalEvaluados++; }
                                else if (v === "C") { conteoC++; totalEvaluados++; }
                              });

                              let badgeNivel = {
                                label: "Sin Evaluar",
                                desc: "No ejecutado",
                                cls: "bg-slate-100 text-slate-600 border-slate-300"
                              };
                              if (totalEvaluados > 0) {
                                if (conteoC >= Math.ceil(totalEvaluados * 0.5)) {
                                  badgeNivel = {
                                    label: "Nivel C",
                                    desc: "Inicial",
                                    cls: "bg-rose-100 text-rose-800 border-rose-300"
                                  };
                                } else if (conteoB > conteoA || conteoA < Math.ceil(totalEvaluados * 0.5)) {
                                  badgeNivel = {
                                    label: "Nivel B",
                                    desc: "En Proceso",
                                    cls: "bg-amber-100 text-amber-800 border-amber-300"
                                  };
                                } else {
                                  badgeNivel = {
                                    label: "Nivel A",
                                    desc: "Logrado",
                                    cls: "bg-emerald-100 text-emerald-800 border-emerald-300"
                                  };
                                }
                              }

                              const observacionGuardada = notasLocales[idKey] || r.observacionDocente || "";

                              return (
                                <tr key={idKey} className="hover:bg-slate-50/80 transition-colors group">
                                  {/* Nombre y Cédula */}
                                  <td className="py-3 px-4 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r-2 border-slate-200">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900 block text-xs sm:text-sm truncate">
                                        {r.estudianteNombre}
                                      </span>
                                      {tieneAlerta && (
                                        <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200" title="Telemetría detectó reintentos o fluctuación frecuente. Recomendado acercamiento docente con contención pedagógica.">
                                          ⚠️ Foco
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                      {r.estudianteCedula || "ID: " + idKey.slice(0, 10)} • Sec. {r.seccionOGrupo || seccionActiva}
                                    </span>
                                  </td>

                                  {/* Criterios Dinámicos P1..Pn */}
                                  {criteriosActuales.map((crit) => {
                                    const val = psico[crit.id];
                                    return (
                                      <td key={crit.id} className="py-3 px-2 text-center">
                                        <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50 shadow-2xs">
                                          {(["A", "B", "C"] as const).map((escala) => (
                                            <button
                                              key={escala}
                                              type="button"
                                              onClick={() => {
                                                handleActualizarPsicomotriz(r.timestamp, crit.id, escala);
                                                setCambiosPendientes((prev) => ({ ...prev, [idKey]: true }));
                                              }}
                                              title={`${crit.codigo} - ${escala === "A" ? crit.escalaA : escala === "B" ? crit.escalaB : crit.escalaC}`}
                                              className={`px-2 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                                                val === escala
                                                  ? escala === "A"
                                                    ? "bg-emerald-600 text-white shadow-2xs"
                                                    : escala === "B"
                                                    ? "bg-amber-500 text-white shadow-2xs"
                                                    : "bg-rose-500 text-white shadow-2xs"
                                                  : "text-slate-600 hover:text-slate-900"
                                              }`}
                                            >
                                              {escala}
                                            </button>
                                          ))}
                                        </div>
                                      </td>
                                    );
                                  })}

                                  {/* Nivel Psicomotor Consolidado */}
                                  <td className="py-3 px-3 text-center bg-teal-50/20">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border shadow-2xs ${badgeNivel.cls}`}>
                                      <span>{badgeNivel.label}</span>
                                      <span className="font-medium text-[10px]">({badgeNivel.desc})</span>
                                    </span>
                                  </td>

                                  {/* Observación Pedagógica Editable */}
                                  <td className="py-3 px-4">
                                    <input
                                      type="text"
                                      defaultValue={observacionGuardada}
                                      id={`obs-input-${idKey}`}
                                      onChange={() => {
                                        setCambiosPendientes((prev) => ({ ...prev, [idKey]: true }));
                                      }}
                                      onBlur={(e) => {
                                        guardarNotaDocente(idKey, e.target.value);
                                        handleGuardarFilaPsicomotriz(idKey, r.timestamp, e.target.value);
                                      }}
                                      placeholder="Añadir observación cualitativa..."
                                      className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:border-[#1B5E59] focus:ring-1 focus:ring-[#1B5E59]"
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                    )}
                  </div>
                  )}

                  {/* Modal Oficial MEP de Detalle de Criterio / Rúbrica Formativa */}
                  {criterioModalDetalle && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 space-y-4">
                        {/* Encabezado Superior con Badge de Área y Botón Cerrar */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                              <span>🖐️</span>
                              <span>2. ÁREA PSICOMOTORA / PROCEDIMENTAL</span>
                            </div>
                            <BadgeModalidadExplicativa
                              modalidad={
                                criterioModalDetalle.modalidadEvaluacion === "telemetria"
                                  ? "telemetria"
                                  : criterioModalDetalle.modalidadEvaluacion === "hibrido"
                                  ? "hibrido"
                                  : "docente"
                              }
                              labelPersonalizado={
                                criterioModalDetalle.modalidadEvaluacion === "telemetria"
                                  ? "🤖 Telemetría"
                                  : criterioModalDetalle.modalidadEvaluacion === "hibrido"
                                  ? "⚡ Híbrido"
                                  : "👨‍🏫 Foco Docente"
                              }
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setCriterioModalDetalle(null)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <X size={18} weight="bold" />
                          </button>
                        </div>

                        {/* Título Principal del Indicador */}
                        <h3 className="text-xl sm:text-2xl font-black text-[#0f4c75] tracking-tight leading-snug">
                          {criterioModalDetalle.codigo}: {criterioModalDetalle.titulo}
                        </h3>

                        {/* Tarjeta 1: Conducta / Indicador Observado */}
                        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-4.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-wide">
                            <span>📌</span>
                            <span>CONDUCTA / INDICADOR OBSERVADO (GUÍA OFICIAL MEP):</span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">
                            {criterioModalDetalle.desc}
                          </p>
                        </div>

                        {/* Tarjeta 2: Niveles de Desempeño Oficial MEP */}
                        <div className="border border-slate-200 rounded-2xl p-4 sm:p-4.5 space-y-2.5 bg-white">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                            <span>📊</span>
                            <span>Niveles de Desempeño Oficial MEP:</span>
                          </div>

                          {/* Nivel L (Logrado) */}
                          <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl text-xs sm:text-[13px] leading-snug">
                            <strong className="text-emerald-950 font-black">L (Logrado): </strong>
                            <span className="text-emerald-900 font-medium">{criterioModalDetalle.escalaA}</span>
                          </div>

                          {/* Nivel ED (En Desarrollo) */}
                          <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-xs sm:text-[13px] leading-snug">
                            <strong className="text-amber-950 font-black">ED (En Desarrollo): </strong>
                            <span className="text-amber-900 font-medium">{criterioModalDetalle.escalaB}</span>
                          </div>

                          {/* Nivel RA (Requiere Acompañamiento) */}
                          <div className="p-3 bg-rose-50/90 border border-rose-300 rounded-xl text-xs sm:text-[13px] leading-snug">
                            <strong className="text-rose-950 font-black">RA (Requiere Acompañamiento): </strong>
                            <span className="text-rose-900 font-medium">{criterioModalDetalle.escalaC}</span>
                          </div>
                        </div>

                        {/* Botón Acción Principal */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setCriterioModalDetalle(null)}
                            className="w-full py-3 px-4 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                          >
                            <Check size={16} weight="bold" />
                            <span>Entendido / Continuar Evaluando</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal de Análisis con IA para la Sección Psicomotora */}
                  {modalAnalisisPsicoIA && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
                      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                              <Sparkle size={18} weight="fill" />
                            </div>
                            <div>
                              <h3 className="text-sm font-black text-slate-900">
                                Análisis Pedagógico Psicomotor con IA
                              </h3>
                              <p className="text-[11px] text-slate-500">
                                Sección {seccionActiva} • {nivelActivo === "7mo" ? "7.° Año" : "9.° Año"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setModalAnalisisPsicoIA(false)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-950 space-y-2.5 leading-relaxed">
                          <h4 className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                            <span>🤖 Diagnóstico de Desempeño Sensorio-Motor:</span>
                          </h4>
                          <p>
                            En la <strong>Sección {seccionActiva}</strong>, el estudiantado evidencia un desempeño promedio favorable en las prácticas iniciales de modularización y conexionado básico.
                          </p>
                          <div className="space-y-1 bg-white p-3 rounded-lg border border-indigo-100 text-slate-700">
                            <div><strong>• Fortalezas detectadas:</strong> Alta precisión en reconocimiento de terminales de alimentación (VCC/GND) y formulación secuencial del circuito.</div>
                            <div><strong>• Áreas de acompañamiento:</strong> Reforzar el proceso de depuración (debugging de señales analógicas vs. fijas) previo al ensamblaje físico con microcontroladores.</div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setModalAnalisisPsicoIA(false)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Cerrar informe
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* SECCIÓN 5: SISTEMATIZACIÓN OFICIAL MEP (Resultados)       */}
            {/* ========================================================= */}
            {seccionActivaMenu === "sistematizacion" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Cabecera con Botones de Exportación */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Instrumento de Sistematización de Desempeños y Logros
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Registro oficial consolidado: Aprendizajes 1 a 9, Nivel de logro y Descripción de desempeño.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Botón Acoplar / Desacoplar Sistematización */}
                    <button
                      type="button"
                      onClick={() => setAcordeonTablaResultados(!acordeonTablaResultados)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="Acoplar o desacoplar la matriz de sistematización"
                    >
                      <ArrowsLeftRight size={14} weight="bold" />
                      <span>{acordeonTablaResultados ? "Acoplar matriz" : "Desacoplar matriz"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDescargarExcel}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <FileXls size={18} weight="bold" />
                      <span>Exportar Excel (.xlsx)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDescargarPDF}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B5E59] hover:bg-[#144642] text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <FilePdf size={18} weight="bold" />
                      <span>Exportar PDF Oficial</span>
                    </button>
                  </div>
                </div>

                {/* Banner Desplazamiento Horizontal Móvil */}
                {acordeonTablaResultados && registrosSeccion.length > 0 && (
                  <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-teal-50/80 border border-teal-200 text-teal-950 rounded-xl text-[11px] font-semibold sm:hidden">
                    <div className="flex items-center gap-1.5">
                      <ArrowsLeftRight size={14} weight="bold" className="text-teal-700 animate-pulse" />
                      <span>Desliza horizontalmente para ver todos los aprendizajes</span>
                    </div>
                    <span className="text-[10px] bg-teal-200/60 px-1.5 py-0.5 rounded font-bold">Scroll horizontal</span>
                  </div>
                )}

                {/* Tabla de Sistematización Exacta MEP */}
                {acordeonTablaResultados && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  {registrosSeccion.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <Users size={36} className="mx-auto text-slate-300" />
                      <p className="text-sm font-bold text-slate-700">Sin datos de sistematización en esta sección</p>
                    </div>
                  ) : (
                    <div ref={tablaSistematizacionRef} className="overflow-x-auto scrollbar-thin">
                      <table className="w-full text-left border-collapse text-xs min-w-[1100px]">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-[11px]">
                            <th className="py-3 px-4 sticky left-0 bg-slate-100 z-20 shadow-xs border-r-2 border-slate-300 w-52 min-w-[190px]">
                              Estudiantes
                            </th>
                            {Array.from({ length: 9 }).map((_, idx) => (
                              <th key={idx} className="py-3 px-2 text-center border-r border-slate-300 w-16">
                                Apr. {idx + 1}
                              </th>
                            ))}
                            <th className="py-3 px-4 min-w-[280px]">Descripción del desempeño individual o grupal</th>
                            <th className="py-3 px-3 text-center w-24">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {registrosSeccion.map((r, i) => {
                            const desc =
                              r.nivelLogro === "Avanzado"
                                ? "Demuestra dominio autónomo y solvente en los fundamentos algorítmicos y conceptuales."
                                : r.nivelLogro === "Intermedio"
                                ? "Evidencia comprensión de conceptos con requerimiento de mediación en algoritmia compleja."
                                : "Requiere acompañamiento personalizado y refuerzo en secuencias lógicas iniciales.";

                            return (
                              <tr key={r.idResultado || r.timestamp || i} className="hover:bg-slate-50 transition-colors group">
                                <td className="py-3 px-4 font-bold text-slate-900 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r-2 border-slate-200 truncate">
                                  {r.estudianteNombre}
                                </td>
                                {Array.from({ length: 9 }).map((_, idx) => {
                                  const acierto = (r.aciertos || 0) > idx;
                                  return (
                                    <td key={idx} className="py-3 px-2 text-center border-r border-slate-200 font-bold">
                                      <span
                                        className={`inline-block w-6 h-6 rounded-full text-[10px] leading-6 font-bold ${
                                          acierto
                                            ? "bg-emerald-100 text-emerald-900"
                                            : "bg-amber-100 text-amber-900"
                                        }`}
                                      >
                                        {acierto ? "Log" : "Proc"}
                                      </span>
                                    </td>
                                  );
                                })}
                                <td className="py-3 px-4 text-slate-700 font-medium">
                                  {desc}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleEliminarEstudiante(r)}
                                    title={`Eliminar registro de ${r.estudianteNombre}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                                  >
                                    <Trash size={13} weight="bold" />
                                    <span>Borrar</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                )}

              </div>
            )}

            {/* ========================================================= */}
            {/* SECCIÓN 6: ANÁLISIS GENERAL & TELEMETRÍA EN TIEMPO REAL   */}
            {/* ========================================================= */}
            {seccionActivaMenu === "analitica" && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Semáforo de Logro Oficial PNFT */}
                <SemaforoLogro
                  registros={registrosSeccion}
                  nivel={nivelActivo}
                />

                {/* Gráficas por Sección */}
                <GraficasSecciones
                  registros={registrosSeccion}
                  configuracion={CONFIGURACION_DEFAULT}
                  nivel={nivelActivo}
                  seccionSeleccionada={seccionActiva}
                />

                {/* Recomendaciones Pedagógicas DUA Asistidas por IA */}
                <RecomendacionesDUA
                  registros={registrosSeccion}
                  nivel={nivelActivo}
                  seccionSeleccionada={seccionActiva}
                />

              </div>
            )}

          </div>

          {/* Footer Informativo Simplificado */}
          <footer className="mt-8 pt-3 pb-20 md:pb-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-slate-500 gap-1 text-center sm:text-left">
            <span>Ministerio de Educación Pública (MEP) • PNFT 2027</span>
            <span className="font-semibold text-slate-600">Suite Diagnóstica 7.° y 9.° Año</span>
          </footer>
        </main>

      </div>

      {/* ========================================================= */}
      {/* BOTÓN FLOTANTE (FAB) PARA ESCÁNER QR EN MÓVIL             */}
      {/* ========================================================= */}
      <button
        type="button"
        onClick={() => setModalEscaner(true)}
        aria-label={`Abrir escáner de datos ${nivelActivo === "7mo" ? "7.° Año (Séptimo)" : "9.° Año (Noveno)"}`}
        title={`Abrir escáner de datos ${nivelActivo === "7mo" ? "7.° Año (Séptimo)" : "9.° Año (Noveno)"} (cámara, CSV y métricas)`}
        className={`md:hidden fixed bottom-20 right-4 z-40 p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 transition-all relative ${
          nivelActivo === "7mo"
            ? "bg-gradient-to-br from-[#002b49] via-[#0f3458] to-[#1F3F78] text-white ring-4 ring-[#D4AF5A] shadow-[0_8px_25px_rgba(0,43,73,0.5)]"
            : "bg-gradient-to-br from-[#004641] via-[#1B5E59] to-[#047857] text-white ring-4 ring-emerald-300 shadow-[0_8px_25px_rgba(4,120,87,0.5)]"
        }`}
      >
        <Camera size={25} weight="bold" className={nivelActivo === "7mo" ? "text-amber-300" : "text-emerald-200"} />
        <span
          className={`absolute -top-2 -right-1.5 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-md border-2 border-white ${
            nivelActivo === "7mo"
              ? "bg-[#D4AF5A] text-[#002b49] ring-1 ring-[#002b49]/40"
              : "bg-cyan-600 text-white ring-1 ring-emerald-900/40"
          }`}
        >
          {nivelActivo === "7mo" ? "7.°" : "9.°"}
        </span>
      </button>

      {/* ========================================================= */}
      {/* BARRA DE NAVEGACIÓN INFERIOR FIJA EN MÓVIL (BOTTOM NAV)   */}
      {/* ========================================================= */}
      <nav
        aria-label="Navegación Móvil Principal"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-t-2 border-[#1B5E59] px-2 py-2 pb-3.5 flex items-center justify-around shadow-[0_-8px_30px_rgba(0,0,0,0.16)] select-none"
      >
        <button
          type="button"
          onClick={() => setSeccionActivaMenu("enlaces")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            seccionActivaMenu === "enlaces"
              ? "bg-[#004641] text-emerald-300 font-black scale-105 shadow-md ring-2 ring-emerald-600/30"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold"
          }`}
        >
          <LinkIcon size={20} weight={seccionActivaMenu === "enlaces" ? "bold" : "regular"} />
          <span className="text-[10.5px] tracking-tight mt-0.5">Enlaces</span>
        </button>

        <button
          type="button"
          onClick={() => setSeccionActivaMenu("cognitivo")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            seccionActivaMenu === "cognitivo"
              ? "bg-[#004641] text-emerald-300 font-black scale-105 shadow-md ring-2 ring-emerald-600/30"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold"
          }`}
        >
          <BookOpen size={20} weight={seccionActivaMenu === "cognitivo" ? "fill" : "regular"} />
          <span className="text-[10.5px] tracking-tight mt-0.5">Cognitivo</span>
        </button>

        <button
          type="button"
          onClick={() => setSeccionActivaMenu("socioafectivo")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer relative ${
            seccionActivaMenu === "socioafectivo"
              ? "bg-[#004641] text-emerald-300 font-black scale-105 shadow-md ring-2 ring-emerald-600/30"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold"
          }`}
        >
          <Heart size={20} weight={seccionActivaMenu === "socioafectivo" ? "fill" : "regular"} />
          <span className="text-[10.5px] tracking-tight mt-0.5">Socioafectivo</span>
          {metricasCohorte.alertasTempranas > 0 && (
            <span className="absolute top-1 right-2 w-2.5 h-2.5 rounded-full bg-[#E07A2C] animate-ping" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setSeccionActivaMenu("psicomotriz")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            seccionActivaMenu === "psicomotriz"
              ? "bg-[#004641] text-emerald-300 font-black scale-105 shadow-md ring-2 ring-emerald-600/30"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold"
          }`}
        >
          <Pulse size={20} weight={seccionActivaMenu === "psicomotriz" ? "bold" : "regular"} />
          <span className="text-[10.5px] tracking-tight mt-0.5">Psicomotor</span>
        </button>

        <button
          type="button"
          onClick={() => setSeccionActivaMenu("sistematizacion")}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
            seccionActivaMenu === "sistematizacion"
              ? "bg-[#004641] text-emerald-300 font-black scale-105 shadow-md ring-2 ring-emerald-600/30"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-bold"
          }`}
        >
          <Users size={20} weight={seccionActivaMenu === "sistematizacion" ? "fill" : "regular"} />
          <span className="text-[10.5px] tracking-tight mt-0.5">Resultados</span>
        </button>
      </nav>

      {/* ========================================================= */}
      {/* MODALES DEL SISTEMA (Proyección QR, Escáner Móvil, Ayuda) */}
      {/* ========================================================= */}
      {modalProyeccion && (
        <QRModalProyeccion
          abierto={modalProyeccion}
          alCerrar={() => setModalProyeccion(false)}
          urlWebApp={urlEstudiante}
          titulo={`Diagnóstico ${nivelActivo === "7mo" ? "7.° Año" : "9.° Año"} — Sección ${seccionActiva}`}
          asignatura="Formación Tecnológica"
          nivel={nivelActivo === "7mo" ? "7.° Año" : "9.° Año"}
          docenteNombre={docente?.nombreCompleto}
        />
      )}

      {modalEscaner && (
        <QRScannerResultados
          abierto={modalEscaner}
          alCerrar={() => setModalEscaner(false)}
          registrosExistentes={registrosSeccion}
          nivelActivo={nivelActivo}
          alDetectarResultado={(res) => {
            agregarResultadoTelemetria(res);
          }}
        />
      )}

      {modalAyuda && (
        <ModalGuiaRapidaDocente
          abierto={modalAyuda}
          onCerrar={() => setModalAyuda(false)}
        />
      )}

      {modalInstalacionMovil && (
        <ModalInstalacionPWA
          abierto={modalInstalacionMovil}
          alCerrar={() => setModalInstalacionMovil(false)}
          urlApp={urlEstudiante}
          nombreApp={`Diagnóstico ${nivelActivo === "7mo" ? "7.° Año" : "9.° Año"}`}
        />
      )}

      {modalArticulacion && (
        <ModalArticulacionCurricular
          abierto={modalArticulacion}
          onCerrar={() => setModalArticulacion(false)}
          nivelInicial={nivelActivo}
        />
      )}

      {modalDocumentacion && (
        <ModalDocumentacionOficial
          abierto={modalDocumentacion}
          alCerrar={() => setModalDocumentacion(false)}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL SIMULADOR MULTIDISPOSITIVO (CELULAR, TABLETA, PC)  */}
      {/* ========================================================= */}
      {modalSimuladorDispositivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fadeIn">
          <div className="bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden">
            
            {/* Cabecera del Simulador */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-white tracking-wide flex items-center gap-2">
                    <span>Simulador Multidispositivo MEP</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-900/80 text-teal-200 border border-teal-700">
                      Diagnóstico {nivelActivo} ({seccionActiva})
                    </span>
                  </h3>
                </div>
              </div>

              {/* Selector de Dispositivos (Celular / Tableta / Computadora) */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setModoVistaDispositivo("mobile")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    modoVistaDispositivo === "mobile"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Simular en teléfono móvil (380px)"
                >
                  <DeviceMobile size={16} weight={modoVistaDispositivo === "mobile" ? "bold" : "regular"} />
                  <span className="hidden sm:inline">📱 Celular</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModoVistaDispositivo("tablet")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    modoVistaDispositivo === "tablet"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Simular en tableta (768px)"
                >
                  <DeviceTablet size={16} weight={modoVistaDispositivo === "tablet" ? "bold" : "regular"} />
                  <span className="hidden sm:inline">💻 Tableta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModoVistaDispositivo("desktop")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    modoVistaDispositivo === "desktop"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Simular en computadora de escritorio / laboratorio"
                >
                  <Desktop size={16} weight={modoVistaDispositivo === "desktop" ? "bold" : "regular"} />
                  <span className="hidden sm:inline">🖥️ Computadora</span>
                </button>
              </div>

              {/* Acciones Rápidas del Simulador */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRecargarSimuladorKey((prev) => prev + 1)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                  title="Recargar vista previa"
                >
                  <ArrowsClockwise size={16} />
                </button>

                <a
                  href={urlEstudiante}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                  title="Abrir en pestaña completa"
                >
                  <ArrowSquareOut size={16} />
                </a>

                <button
                  type="button"
                  onClick={() => setModalSimuladorDispositivo(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white transition-colors cursor-pointer ml-1"
                  title="Cerrar simulador"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>

            {/* Contenedor del Simulador con Marcos Reales */}
            <div className="flex-1 bg-slate-950/60 p-4 flex items-center justify-center overflow-auto">
              <div
                className={`transition-all duration-300 bg-white shadow-2xl overflow-hidden flex flex-col ${
                  modoVistaDispositivo === "mobile"
                    ? "w-[380px] h-[700px] rounded-[36px] border-[10px] border-slate-800 ring-2 ring-slate-700"
                    : modoVistaDispositivo === "tablet"
                    ? "w-[768px] h-[720px] rounded-[24px] border-[10px] border-slate-800 ring-2 ring-slate-700"
                    : "w-full h-full rounded-xl border border-slate-700"
                }`}
              >
                {/* Notch / Barra de estado decorativa para móvil */}
                {modoVistaDispositivo === "mobile" && (
                  <div className="bg-slate-900 h-6 flex items-center justify-center shrink-0">
                    <div className="w-20 h-3.5 bg-slate-800 rounded-b-xl" />
                  </div>
                )}

                <iframe
                  key={recargarSimuladorKey}
                  src={urlEstudiante}
                  title={`Simulador Diagnóstico ${nivelActivo}`}
                  className="w-full flex-1 border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>

            {/* Barra Inferior del Simulador */}
            <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Modo actual: <strong className="text-emerald-400 capitalize">{modoVistaDispositivo === "mobile" ? "Celular (380px)" : modoVistaDispositivo === "tablet" ? "Tableta (768px)" : "Computadora (100%)"}</strong></span>
              <span className="font-mono text-slate-500 text-[10px]">URL: {urlEstudiante}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
