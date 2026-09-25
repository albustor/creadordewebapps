"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Check,
  X,
  Compass,
  CaretDown,
  CaretUp,
  CaretRight,
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

export const CRITERIOS_SOCIOAFECTIVOS_MAP: Record<"7mo" | "8vo" | "9no", CriterioSocioafectivoOficial[]> = {
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
  "8vo": [
    {
      id: "s1",
      codigo: "S1. Gusto por la precisión",
      titulo: "Gusto por la precisión",
      preguntaReflexion: "«¿Revisó minuciosamente cada parámetro?»",
      escalaA: "Avanzado (A): Verificación completa.",
      escalaB: "Intermedio (B): Verificación parcial.",
      escalaC: "Inicial (C): Sin verificación.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "🤖 Telemetría",
    },
    {
      id: "s2",
      codigo: "S2. Aprender del error",
      titulo: "Aprender del error",
      preguntaReflexion: "«¿Qué hizo ante el error?»",
      escalaA: "Avanzado (A): Depuración autónoma.",
      escalaB: "Intermedio (B): Corrección con apoyo.",
      escalaC: "Inicial (C): Desinterés.",
      modalidadEvaluacion: "telemetria",
      etiquetaModalidad: "🤖 Telemetría",
    },
    {
      id: "s3",
      codigo: "S3. Flexibilidad para manejar problemas",
      titulo: "Flexibilidad para manejar problemas",
      preguntaReflexion: "«¿Cómo abordó los problemas?»",
      escalaA: "Avanzado (A): Adaptación y escucha activa.",
      escalaB: "Intermedio (B): Prueba alternativa guiada.",
      escalaC: "Inicial (C): Resistencia al cambio.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
    {
      id: "s4",
      codigo: "S4. Tolerancia a la frustración",
      titulo: "Tolerancia a la frustración",
      preguntaReflexion: "«¿Cómo reaccionó ante la dificultad?»",
      escalaA: "Avanzado (A): Serenidad y perseverancia.",
      escalaB: "Intermedio (B): Continuación asistida.",
      escalaC: "Inicial (C): Frustración y abandono.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "⚡ Híbrido + Docente",
    },
  ],
};

export interface InfoNivelMEP {
  id: "7mo" | "8vo" | "9no";
  codigo: string;
  nombreCorto: string;
  nombreCompleto: string;
  subtitulo: string;
  proyecto: string;
  icono: string;
  colorPrimario: string;
  bgBannerClass: string;
  borderBannerClass: string;
  badgeClass: string;
  buttonActiveClass: string;
  buttonInactiveClass: string;
  iconBoxClass: string;
  proyectoColorClass: string;
  mepAreaPrincipal: string;
}

export const CONFIG_NIVELES_MEP: Record<"7mo" | "8vo" | "9no", InfoNivelMEP> = {
  "7mo": {
    id: "7mo",
    codigo: "7mo",
    nombreCorto: "7.° AÑO",
    nombreCompleto: "7.° AÑO (SÉTIMO)",
    subtitulo: "Educación Secundaria - Primer Ciclo Diversificado",
    proyecto: "CyberQuest • Fundamentos, Programación y Algoritmos",
    icono: "💻",
    colorPrimario: "#1B5E59",
    bgBannerClass: "bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border-l-4 border-l-[#1B5E59] border-emerald-200",
    borderBannerClass: "border-emerald-200",
    badgeClass: "bg-[#1B5E59] text-white border border-emerald-700",
    buttonActiveClass: "bg-[#1B5E59] text-white shadow-md ring-2 ring-emerald-500/40",
    buttonInactiveClass: "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70",
    iconBoxClass: "bg-[#D1EBE7] text-[#1B5E59] border border-emerald-200",
    proyectoColorClass: "text-[#1B5E59] font-bold",
    mepAreaPrincipal: "Apropiación Tecnológica y Programación",
  },
  "8vo": {
    id: "8vo",
    codigo: "8vo",
    nombreCorto: "8.° AÑO",
    nombreCompleto: "8.° AÑO (OCTAVO)",
    subtitulo: "Educación Secundaria - Segundo Ciclo Diversificado",
    proyecto: "Robótica Educativa • Sensores, Motores y Mecanismos",
    icono: "⚙️",
    colorPrimario: "#D97706",
    bgBannerClass: "bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border-l-4 border-l-[#D97706] border-amber-200",
    borderBannerClass: "border-amber-200",
    badgeClass: "bg-[#D97706] text-white border border-amber-700",
    buttonActiveClass: "bg-[#D97706] text-white shadow-md ring-2 ring-amber-500/40",
    buttonInactiveClass: "text-slate-600 hover:text-amber-800 hover:bg-amber-50/70",
    iconBoxClass: "bg-[#FEF3C7] text-[#D97706] border border-amber-200",
    proyectoColorClass: "text-[#D97706] font-bold",
    mepAreaPrincipal: "Robótica y Computación Física",
  },
  "9no": {
    id: "9no",
    codigo: "9no",
    nombreCorto: "9.° AÑO",
    nombreCompleto: "9.° AÑO (NOVENO)",
    subtitulo: "Educación Secundaria - Tercer Ciclo Diversificado",
    proyecto: "Aula Inteligente & Domótica • Sistemas Embebidos y Automatización",
    icono: "🤖",
    colorPrimario: "#002B49",
    bgBannerClass: "bg-gradient-to-r from-sky-50 via-blue-50/60 to-white border-l-4 border-l-[#002B49] border-sky-200",
    borderBannerClass: "border-sky-200",
    badgeClass: "bg-[#002B49] text-white border border-sky-900",
    buttonActiveClass: "bg-[#002B49] text-white shadow-md ring-2 ring-sky-600/40",
    buttonInactiveClass: "text-slate-600 hover:text-blue-900 hover:bg-sky-50/70",
    iconBoxClass: "bg-[#E0F2FE] text-[#002B49] border border-sky-200",
    proyectoColorClass: "text-[#002B49] font-bold",
    mepAreaPrincipal: "Computación Física, Robótica y Automatización",
  },
};

export interface SaberCognitivoOficial {
  id: number;
  nombre: string;
  saber: string;
  pregunta: string;
  areaCurricular?: string;
  descripcion?: string;
}

export const SABERES_COGNITIVOS_MAP: Record<"7mo" | "8vo" | "9no", SaberCognitivoOficial[]> = {
  "9no": [
    { id: 1, nombre: "Microcontrolador (Pregunta 1 - 6)", saber: "Microcontrolador", pregunta: "Pregunta 1 - 6", areaCurricular: "Computación física y robótica" },
    { id: 2, nombre: "Sensor y actuador (Pregunta 2 - 9 - 6)", saber: "Sensor y actuador", pregunta: "Pregunta 2 - 9 - 6", areaCurricular: "Computación física y robótica" },
    { id: 3, nombre: "Algoritmo (Pregunta 3 - 4 - 5)", saber: "Algoritmo", pregunta: "Pregunta 3 - 4 - 5", areaCurricular: "Programación y algoritmos" },
    { id: 4, nombre: "Dato (Pregunta 7)", saber: "Dato", pregunta: "Pregunta 7", areaCurricular: "Ciencia de datos e IA" },
    { id: 5, nombre: "Algoritmo (Pregunta 8)", saber: "Algoritmo", pregunta: "Pregunta 8", areaCurricular: "Programación y algoritmos" },
    { id: 6, nombre: "Almacenamiento de datos (Pregunta 10)", saber: "Almacenamiento de datos", pregunta: "Pregunta 10", areaCurricular: "Ciencia de datos e IA" },
  ],
  "7mo": [
    { id: 1, nombre: "Hardware y periféricos (Pregunta 1)", saber: "Hardware", pregunta: "Pregunta 1", areaCurricular: "Apropiación tecnológica" },
    { id: 2, nombre: "Software y utilitarios (Pregunta 2)", saber: "Software", pregunta: "Pregunta 2", areaCurricular: "Apropiación tecnológica" },
    { id: 3, nombre: "Sistema Operativo (Pregunta 3)", saber: "Sistema operativo", pregunta: "Pregunta 3", areaCurricular: "Apropiación tecnológica" },
    { id: 4, nombre: "Redes locales LAN (Pregunta 4)", saber: "Redes de comunicación", pregunta: "Pregunta 4", areaCurricular: "Conectividad" },
    { id: 5, nombre: "Formatos de archivos (Pregunta 5)", saber: "Gestión de archivos", pregunta: "Pregunta 5", areaCurricular: "Apropiación tecnológica" },
    { id: 6, nombre: "Edición multimedia (Pregunta 6)", saber: "Multimedia", pregunta: "Pregunta 6", areaCurricular: "Apropiación tecnológica" },
    { id: 7, nombre: "Eventos en programación (Pregunta 7)", saber: "Evento", pregunta: "Pregunta 7", areaCurricular: "Programación y algoritmos" },
    { id: 8, nombre: "Traza de variables (Pregunta 8)", saber: "Algoritmo", pregunta: "Pregunta 8", areaCurricular: "Programación y algoritmos" },
    { id: 9, nombre: "Estructuras condicionales (Pregunta 9)", saber: "Condición", pregunta: "Pregunta 9", areaCurricular: "Programación y algoritmos" },
    { id: 10, nombre: "Operadores lógicos (Pregunta 10)", saber: "Lógica", pregunta: "Pregunta 10", areaCurricular: "Programación y algoritmos" },
  ],
  "8vo": [
    { id: 1, nombre: "Hardware y periféricos (Pregunta 1)", saber: "Hardware", pregunta: "Pregunta 1", areaCurricular: "Apropiación tecnológica" },
    { id: 2, nombre: "Tipos de software (Pregunta 2)", saber: "Software", pregunta: "Pregunta 2", areaCurricular: "Apropiación tecnológica" },
    { id: 3, nombre: "Redes y almacenamiento (Pregunta 3)", saber: "Redes", pregunta: "Pregunta 3", areaCurricular: "Apropiación tecnológica" },
    { id: 4, nombre: "Conexión entre dispositivos (Pregunta 4)", saber: "Conexión", pregunta: "Pregunta 4", areaCurricular: "Apropiación tecnológica" },
    { id: 5, nombre: "Sistema Operativo (Pregunta 5)", saber: "Sistema Operativo", pregunta: "Pregunta 5", areaCurricular: "Apropiación tecnológica" },
    { id: 6, nombre: "Gestión de archivos (Pregunta 6)", saber: "Archivos", pregunta: "Pregunta 6", areaCurricular: "Apropiación tecnológica" },
    { id: 7, nombre: "Edición multimedia (Pregunta 7)", saber: "Multimedia", pregunta: "Pregunta 7", areaCurricular: "Apropiación tecnológica" },
    { id: 8, nombre: "Internet de las cosas (Pregunta 8)", saber: "IoT", pregunta: "Pregunta 8", areaCurricular: "Apropiación tecnológica" },
    { id: 9, nombre: "Programación robótica (Pregunta 9)", saber: "Programación", pregunta: "Pregunta 9", areaCurricular: "Programación y algoritmos" },
    { id: 10, nombre: "Robot y componentes (Pregunta 10)", saber: "Robótica", pregunta: "Pregunta 10", areaCurricular: "Computación física" },
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

export const CRITERIOS_PSICOMOTRICES_MAP: Record<"7mo" | "8vo" | "9no", CriterioPsicomotorOficial[]> = {
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
      preguntaGuia: "«¿Comprueba que al bajar la luz (<300 Lux) el microcontrolador activa la salida digital D9?»",
      desc: "Valida la estructura condicional y asignación de pines: comprueba que al bajar la luz (<300 Lux) el microcontrolador activa la salida digital D9.",
      escalaA: "Logrado (L): Verifica estados lógicos y umbrales con exactitud técnica en el simulador.",
      escalaB: "En Desarrollo (ED): Comprende la relación condicional umbral-actuador tras aclaración del docente.",
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
      areaCurricular: "Apropiación tecnológica y digital",
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
      areaCurricular: "Apropiación tecnológica y digital",
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
      areaCurricular: "Apropiación tecnológica y digital",
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
      areaCurricular: "Apropiación tecnológica y digital",
      preguntaGuia: "«¿Con qué soltura, coordinación óculo-manual y postura ergonómica opera los periféricos de entrada al trazar?»",
      desc: "Coordinación óculo-manual en dibujo, captura de trazo y soltura en el manejo de periféricos.",
      escalaA: "Logrado (L): Trazo continuo, definido y manipulación ágil de dispositivos de entrada.",
      escalaB: "En Desarrollo (ED): Trazo segmentado o manipulación con lentitud exploratoria.",
      escalaC: "Requiere Acompañamiento (RA): Dificultad motriz para operar periféricos digitales.",
      modalidadEvaluacion: "hibrido",
      etiquetaModalidad: "Telemetría Digital + Validación Docente",
    },
  ],
  "8vo": [
    {
      id: "p1",
      codigo: "P1. Viso-Manual",
      titulo: "Coordinación Viso-Manual con Periféricos y Hardware",
      areaCurricular: "Apropiación Tecnológica",
      preguntaGuia: "«¿Demuestra destreza viso-manual en la interacción ergonómica con periféricos y hardware?»",
      desc: "Destreza al interactuar con periféricos (teclado, ratón) y ensamblaje de componentes digitales.",
      escalaA: "Logrado (L): Alta soltura, precisión operativa y control ergonómico.",
      escalaB: "En Desarrollo (ED): Manejo moderado con pausas de verificación.",
      escalaC: "Requiere Acompañamiento (RA): Dificultades notorias de coordinación motriz viso-manual.",
    },
    {
      id: "p2",
      codigo: "P2. Postura y Ergonomía",
      titulo: "Hábitos de Postura y Cuidado Ergonómico",
      areaCurricular: "Apropiación Tecnológica",
      preguntaGuia: "«¿Mantiene hábitos de postura ergonómica y cuidado preventivo del equipo informático?»",
      desc: "Mantiene postura ergonómica de trabajo y demuestra cuidado preventivo del equipamiento informático.",
      escalaA: "Logrado (L): Postura ergonómica y cuidado preventivo óptimos en el espacio de trabajo.",
      escalaB: "En Desarrollo (ED): Ajusta la postura tras recordatorio docente.",
      escalaC: "Requiere Acompañamiento (RA): Postura inadecuada persistente o descuido del equipo.",
    },
    {
      id: "p3",
      codigo: "P3. Mecanografía",
      titulo: "Mecanografía y Destreza de Entrada de Comandos",
      areaCurricular: "Programación y algoritmos",
      preguntaGuia: "«¿Ingresa comandos y estructuras algorítmicas con fluidez, ritmo y precisión mecanográfica?»",
      desc: "Velocidad, ritmo y precisión táctil en el ingreso de comandos y bloques algorítmicos.",
      escalaA: "Logrado (L): Ingreso rápido, fluido y sin errores de tipeo.",
      escalaB: "En Desarrollo (ED): Velocidad intermedia con necesidad de autocorrección ocasional.",
      escalaC: "Requiere Acompañamiento (RA): Búsqueda visual lenta tecla a tecla.",
    },
    {
      id: "p4",
      codigo: "P4. Material y Circuitos",
      titulo: "Manipulación de Material Concreto y Circuitos Físicos",
      areaCurricular: "Apropiación Tecnológica",
      preguntaGuia: "«¿Realiza el conexionado y ensamble seguro de componentes respetando polaridades?»",
      desc: "Conexionado físico y ensamble seguro de componentes, sensores y actuadores.",
      escalaA: "Logrado (L): Ensamblado seguro, firme y sin errores de polaridad.",
      escalaB: "En Desarrollo (ED): Corrige conexiones guiado por la retroalimentación docente.",
      escalaC: "Requiere Acompañamiento (RA): Confusión recurrente en la interconexión de terminales y pines.",
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
  const [nivelActivo, setNivelActivo] = useState<"7mo" | "8vo" | "9no">("7mo");
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

  // Estados de la Guía y Detalle Psicomotriz y Socioafectivo
  const [guiaSimbologiaAbierta, setGuiaSimbologiaAbierta] = useState(false);
  const [criterioModalDetalle, setCriterioModalDetalle] = useState<CriterioPsicomotorOficial | null>(null);
  const [criterioSocioModalDetalle, setCriterioSocioModalDetalle] = useState<CriterioSocioafectivoOficial | null>(null);
  const [acordeonDimensionesSocio, setAcordeonDimensionesSocio] = useState(false);
  const [acordeonDimensionesCognitivo, setAcordeonDimensionesCognitivo] = useState(false);
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

  // Centros Educativos del Docente
  const centrosDocente = useMemo(() => {
    const nivelKey = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
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
            : nivelActivo === "8vo"
            ? ["8-1", "8-2", "8-3"]
            : ["9-1", "9-2", "9-3"],
      },
    ];
  }, [docente, nivelActivo]);

  const centroActivo = centrosDocente[centroIdx] || centrosDocente[0];

  // Secciones disponibles
  const seccionesDisponibles = useMemo(() => {
    const nivelNum = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
    if (centroActivo?.secciones && centroActivo.secciones.length > 0) {
      const filtradas = centroActivo.secciones.filter((s) => s.startsWith(nivelNum));
      if (filtradas.length > 0) return filtradas;
    }
    return [`${nivelNum}-1`, `${nivelNum}-2`, `${nivelNum}-3`, `${nivelNum}-4`];
  }, [centroActivo, nivelActivo]);

  // Configuración del Tema Oficial MEP del Nivel Activo
  const temaNivel = CONFIG_NIVELES_MEP[nivelActivo] || CONFIG_NIVELES_MEP["9no"];

  // Al cambiar de nivel
  const handleCambiarNivel = (nuevoNivel: "7mo" | "8vo" | "9no") => {
    setNivelActivo(nuevoNivel);
    const nivelNum = nuevoNivel === "7mo" ? "7" : nuevoNivel === "8vo" ? "8" : "9";
    setSeccionActiva(`${nivelNum}-1`);
  };

  // Al cambiar de sección (con sincronización automática de nivel si corresponde)
  const handleCambiarSeccion = (nuevaSeccion: string) => {
    setSeccionActiva(nuevaSeccion);
    if (nuevaSeccion.startsWith("7") && nivelActivo !== "7mo") {
      setNivelActivo("7mo");
    } else if (nuevaSeccion.startsWith("8") && nivelActivo !== "8vo") {
      setNivelActivo("8vo");
    } else if (nuevaSeccion.startsWith("9") && nivelActivo !== "9no") {
      setNivelActivo("9no");
    }
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
        : nivelActivo === "8vo"
        ? "diagnostico_8vo_modulo01_en_linea.html"
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
      nivel: nivelActivo === "7mo" ? "7°" : nivelActivo === "8vo" ? "8°" : "9°",
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
      : nivelActivo === "8vo"
      ? "/webapps/diagnostico_8vo_modulo01_desconectado_offline.html"
      : "/webapps/diagnostico_9no_modulo01_desconectado_offline.html";
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
    const nivelLetra: NivelEducativo =
      nivelActivo === "7mo" ? "7°" : nivelActivo === "8vo" ? "8°" : "9°";
    return obtenerDiagnosticoPorNivel(nivelLetra);
  }, [nivelActivo]);

  // Telemetría filtrada para la sección activa
  const registrosSeccion = useMemo(() => {
    const nivelNum = nivelActivo === "7mo" ? "7" : nivelActivo === "8vo" ? "8" : "9";
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
      const valores = [socio.s1 || "A", socio.s2 || "A", socio.s3 || "A", socio.s4 || "A"];
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
      nivel: nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año",
      seccion: `Sección ${seccionActiva}`,
      institucion: centroActivo?.nombre || docente?.institucionNombre || "Centro Educativo MEP",
      docente: docente?.nombreCompleto || "Docente MEP",
      dre: centroActivo?.dreNombre || docente?.dreNombre || "DRE",
    });
  };

  const handleDescargarPDF = () => {
    exportarAPDF(registrosSeccion, {
      nivel: nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año",
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
                nuevosRegistros.push(item);
              }
            });
          } else if (parsed.estudianteNombre || parsed.nom || parsed.c1 || parsed.estudiante) {
            nuevosRegistros.push(parsed);
          }
          procesados++;
        } else if (file.name.endsWith(".csv") || file.name.endsWith(".txt")) {
          // Parse CSV
          const lineas = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          if (lineas.length > 1) {
            for (let j = 1; j < lineas.length; j++) {
              const cols = lineas[j].split(/[;,]/).map(c => c.replace(/^["']|["']$/g, '').trim());
              if (cols.length >= 4) {
                const nombreEst = cols[3] || cols[0];
                const sec = cols[2] || cols[1] || seccionActiva;
                const cogStr = cols[6] || cols[3] || "80";
                const porc = parseInt(cogStr.replace(/[^0-9]/g, '')) || 80;
                nuevosRegistros.push({
                  webAppId: `diagnostico_${nivelActivo}_importado`,
                  webAppTitulo: `Diagnóstico ${nivelActivo === '7mo' ? 'Séptimo' : 'Noveno'}`,
                  docenteId: docente?.idDocente || "DOC-IMPORT",
                  estudianteNombre: nombreEst,
                  seccionOGrupo: sec.startsWith("Sección ") ? sec : `Sección ${sec}`,
                  nivel: nivelActivo === "7mo" ? "7°" : (nivelActivo === "8vo" ? "8°" : "9°"),
                  puntaje: Math.round((porc / 100) * 10),
                  puntajeMaximo: 10,
                  porcentaje: porc,
                  nivelLogro: calcularNivelLogro(porc),
                  tiempoSegundos: 60,
                  totalReactivos: 10,
                  aciertos: Math.round((porc / 100) * 10),
                  fallos: Math.max(0, 10 - Math.round((porc / 100) * 10)),
                  timestamp: Date.now() - (j * 1000),
                  tokenAntiFraude: `IMPORT-${Date.now()}-${j}`
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
      alert(`✅ ¡Importación completada con éxito!\n\nSe procesaron ${procesados} archivo(s) y se incorporaron ${nuevosRegistros.length} registro(s) estudiantiles al panel docente.`);
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
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-cardLg border border-[#CBD5E1]/80 overflow-hidden flex flex-col min-h-[750px]">
      
      {/* 1. TOP BAR — Barra de Navegación del Sistema */}
      <header className="bg-[#F0F3F6] border-b border-[#CBD5E1]/80 px-4 py-3 flex items-center justify-between gap-3 select-none">
        {/* Controles de ventana decorativos */}
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] inline-block" />
        </div>

        {/* Acciones Rápidas en Cabecera */}
        <div className="flex items-center gap-2">
          {/* Botón de Importación de Lote USB / Archivos JSON o CSV */}
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
            <DownloadSimple size={16} weight="bold" />
            <span className="hidden md:inline">Importar JSON/CSV (USB)</span>
            <input
              type="file"
              accept=".json,.csv,.txt"
              multiple
              className="hidden"
              onChange={handleImportarArchivosLote}
            />
          </label>

          <button
            type="button"
            onClick={() => setModalEscaner(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E07A2C] hover:bg-[#C8661D] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Abrir escáner de datos (cámara, CSV y métricas)"
          >
            <Camera size={16} weight="bold" />
            <span className="hidden md:inline">Escáner de datos</span>
          </button>

          <button
            type="button"
            onClick={() => setModalProyeccion(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Proyectar QR en pantalla completa para los estudiantes"
          >
            <QrCode size={16} weight="bold" />
            <span className="hidden md:inline">Proyectar QR</span>
          </button>
        </div>
      </header>

      {/* 2. APP SHELL — Sidebar + Main Content Canvas */}
      <div className="flex flex-col md:flex-row flex-1 bg-white">
        
        {/* ========================================================= */}
        {/* SIDEBAR DE NAVEGACIÓN DOCENTE (Aula Clara / Stitch Tokens) */}
        {/* ========================================================= */}
        <aside className="w-full md:w-64 lg:w-72 bg-white border-r border-[#E2E8F0] shrink-0 p-4 lg:p-5 flex flex-col justify-between select-none">
          <div className="space-y-5">
            
            {/* Header Perfil Docente */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#1B5E59] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#D1EBE7]">
                {(() => {
                  const n = docente?.nombreCompleto || "MD";
                  return n.substring(0, 2).toUpperCase();
                })()}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-bold text-sm text-[#0D1C2E] truncate leading-tight">
                  {docente?.nombreCompleto || "Docente MEP"}
                </h2>
                <p className="text-[11px] text-slate-500 font-mono truncate">
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
                    ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-2xs border border-[#9FD1C9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <LinkIcon size={18} weight={seccionActivaMenu === "enlaces" ? "bold" : "regular"} className={seccionActivaMenu === "enlaces" ? "text-[#1B5E59]" : "text-slate-500"} />
                <span>Enlaces Estudiante</span>
              </button>

              {/* 2. Área Cognitiva */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("cognitivo")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "cognitivo"
                    ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-2xs border border-[#9FD1C9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <BookOpen size={18} weight={seccionActivaMenu === "cognitivo" ? "bold" : "regular"} className={seccionActivaMenu === "cognitivo" ? "text-[#1B5E59]" : "text-slate-500"} />
                <span>Área Cognitiva</span>
              </button>

              {/* 3. Área Socioafectiva */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("socioafectivo")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "socioafectivo"
                    ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-2xs border border-[#9FD1C9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Heart size={18} weight={seccionActivaMenu === "socioafectivo" ? "fill" : "regular"} className={seccionActivaMenu === "socioafectivo" ? "text-[#1B5E59]" : "text-slate-500"} />
                  <span className="truncate">Área Socioafectiva</span>
                </div>
                {metricasCohorte.alertasTempranas > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#E07A2C] animate-ping shrink-0" />
                )}
              </button>

              {/* 4. Área Psicomotora */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("psicomotriz")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "psicomotriz"
                    ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-2xs border border-[#9FD1C9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Pulse size={18} weight={seccionActivaMenu === "psicomotriz" ? "bold" : "regular"} className={seccionActivaMenu === "psicomotriz" ? "text-[#1B5E59]" : "text-slate-500"} />
                <span>Área Psicomotora</span>
              </button>

              {/* 5. Resultados por Sección (Sistematización MEP) */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("sistematizacion")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "sistematizacion"
                    ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-2xs border border-[#9FD1C9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Users size={18} weight={seccionActivaMenu === "sistematizacion" ? "bold" : "regular"} className={seccionActivaMenu === "sistematizacion" ? "text-[#1B5E59]" : "text-slate-500"} />
                <span>Resultados por Sección</span>
              </button>

              {/* 6. Análisis General & Telemetría */}
              <button
                type="button"
                onClick={() => setSeccionActivaMenu("analitica")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                  seccionActivaMenu === "analitica"
                    ? "bg-[#D1EBE7] text-[#1B5E59] font-bold shadow-2xs border border-[#9FD1C9]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <ChartBar size={18} weight={seccionActivaMenu === "analitica" ? "bold" : "regular"} className={seccionActivaMenu === "analitica" ? "text-[#1B5E59]" : "text-slate-500"} />
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
        <main className="flex-1 bg-[#FBFDFE] p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
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

              {/* Selector Rápido de Nivel con Estilo Institucional MEP (7.°, 8.° y 9.° Año) */}
              <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-center shadow-2xs">
                <button
                  type="button"
                  onClick={() => handleCambiarNivel("7mo")}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    nivelActivo === "7mo"
                      ? "bg-[#1B5E59] text-white shadow-md ring-2 ring-emerald-500/40"
                      : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70"
                  }`}
                  title="Evaluar 7.° Año (Sétimo) - CyberQuest"
                >
                  <span>💻</span>
                  <span>7.° AÑO</span>
                  {nivelActivo === "7mo" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCambiarNivel("8vo")}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    nivelActivo === "8vo"
                      ? "bg-[#D97706] text-white shadow-md ring-2 ring-amber-500/40"
                      : "text-slate-600 hover:text-amber-800 hover:bg-amber-50/70"
                  }`}
                  title="Evaluar 8.° Año (Octavo) - Robótica"
                >
                  <span>⚙️</span>
                  <span>8.° AÑO</span>
                  {nivelActivo === "8vo" && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleCambiarNivel("9no")}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    nivelActivo === "9no"
                      ? "bg-[#002B49] text-white shadow-md ring-2 ring-sky-500/40"
                      : "text-slate-600 hover:text-blue-900 hover:bg-sky-50/70"
                  }`}
                  title="Evaluar 9.° Año (Noveno) - Aula Inteligente"
                >
                  <span>🤖</span>
                  <span>9.° AÑO</span>
                  {nivelActivo === "9no" && <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />}
                </button>
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

              {/* Selector de Sección con sincronización de nivel */}
              <div className="w-36 sm:w-44">
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
                  SECCIÓN
                </label>
                <select
                  value={seccionActiva}
                  onChange={(e) => handleCambiarSeccion(e.target.value)}
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

            {/* ========================================================================= */}
            {/* BANNER CONTEXTUAL DESTACADO (OPCIÓN 3 + 4 - PREVENCIÓN DE CONFUSIÓN MEP) */}
            {/* ========================================================================= */}
            <div className={`p-3.5 sm:p-4 rounded-2xl border shadow-xs transition-all duration-200 ${temaNivel.bgBannerClass}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-xs shrink-0 ${temaNivel.iconBoxClass}`}>
                    {temaNivel.icono}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                        NIVEL Y GRUPO EN EVALUACIÓN:
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide shadow-2xs ${temaNivel.badgeClass}`}>
                        {temaNivel.nombreCompleto}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-300 text-slate-800 text-xs font-black shadow-2xs">
                        Sección {seccionActiva}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 text-[10px] font-bold border border-slate-200">
                        {registrosSeccion.length} estudiantes registrados
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-800 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500 font-normal">Proyecto Curricular:</span>
                      <span className={temaNivel.proyectoColorClass}>{temaNivel.proyecto}</span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-slate-600 font-medium text-xs truncate max-w-xs sm:max-w-md">
                        🏫 {centroActivo.nombre} ({centroActivo.dreNombre})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Conmutador Rápido Integrado en el Banner */}
                <div className="flex items-center gap-2 self-start lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200/60 w-full lg:w-auto justify-between lg:justify-end">
                  <span className="text-[11px] font-bold text-slate-500">Cambiar de nivel:</span>
                  <div className="inline-flex rounded-xl p-1 bg-white/90 border border-slate-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleCambiarNivel("7mo")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        nivelActivo === "7mo"
                          ? "bg-[#1B5E59] text-white shadow-xs"
                          : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50"
                      }`}
                    >
                      💻 7.° Sétimo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCambiarNivel("8vo")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        nivelActivo === "8vo"
                          ? "bg-[#D97706] text-white shadow-xs"
                          : "text-slate-600 hover:text-amber-800 hover:bg-amber-50"
                      }`}
                    >
                      ⚙️ 8.° Octavo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCambiarNivel("9no")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        nivelActivo === "9no"
                          ? "bg-[#002B49] text-white shadow-xs"
                          : "text-slate-600 hover:text-blue-900 hover:bg-sky-50"
                      }`}
                    >
                      🤖 9.° Noveno
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SECCIÓN 1: ENLACES ESTUDIANTE (Opción A y Opción B)       */}
            {/* ========================================================= */}
            {seccionActivaMenu === "enlaces" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-fadeIn">
                
                {/* TARJETA 1: OPCIÓN A (CON INTERNET / EN LÍNEA) */}
                <div className="bg-[#D7EFEA] rounded-2xl p-4 sm:p-5 border border-[#9FD1C9] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-[#004641] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        <span>OPCIÓN A: CON INTERNET</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#9FD1C9] text-[10px] font-bold text-[#1B5E59]">
                        Telemetría en 0ms
                      </span>
                    </div>

                    {/* Subtarjeta interior blanca */}
                    <div className="bg-white rounded-xl p-5 shadow-2xs border border-white flex flex-col min-h-[170px] justify-between space-y-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug flex items-center gap-2">
                          <span>En Línea (Diagnóstico {nivelActivo})</span>
                          <span className="text-xs font-normal text-slate-500">Sección {seccionActiva}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                          Los alumnos abren el enlace en sus computadoras o dispositivos móviles con conexión. Las respuestas, tiempos y desempeño se transmiten instantáneamente a este panel.
                        </p>
                      </div>

                      {/* Botones de Acción Opción A */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={handleCopiarEnlace}
                          className="inline-flex items-center justify-center gap-2 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
                        >
                          {copiado ? (
                            <>
                              <CheckCircle size={16} weight="fill" className="text-emerald-300" />
                              <span>¡Enlace Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={16} className="text-teal-200" />
                              <span>Copiar Enlace Alumnos</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setModalProyeccion(true)}
                          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer"
                        >
                          <QrCode size={16} className="text-slate-500" />
                          <span>Proyectar QR</span>
                        </button>

                        <a
                          href={urlEstudiante}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                          <span>Abrir WebApp</span>
                          <ArrowSquareOut size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TARJETA 2: OPCIÓN B (SIN INTERNET / DESCONECTADO QR) */}
                <div className="bg-[#FFF3EB] rounded-2xl p-4 sm:p-5 border border-[#FBD0B6] flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <h3 className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-[#974800] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#E07A2C]" />
                        <span>OPCIÓN B: SIN INTERNET</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-white/80 border border-[#FBD0B6] text-[10px] font-bold text-[#E07A2C]">
                        Modo Offline / USB
                      </span>
                    </div>

                    {/* Subtarjeta interior blanca */}
                    <div className="bg-white rounded-xl p-5 shadow-2xs border border-white flex flex-col min-h-[170px] justify-between space-y-3">
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug flex items-center gap-2">
                          <span>Desconectado con QR (100% Offline)</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                          Los alumnos ejecutan el archivo descargado sin internet. Al finalizar, la aplicación genera un <strong>Código QR Seguro</strong> en sus pantallas que el docente escanea en segundos con su celular.
                        </p>
                      </div>

                      {/* Botones de Acción Opción B */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setModalEscaner(true)}
                          title="Escáner de datos (cámara, CSV y métricas)"
                          className="inline-flex items-center justify-center gap-2 bg-[#E07A2C] hover:bg-[#C8661D] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Camera size={16} className="text-orange-100" />
                          <span>Escáner de datos</span>
                        </button>

                        <a
                          href={archivoOfflineDescarga}
                          download={`diagnostico_${nivelActivo}_offline.html`}
                          className="inline-flex items-center justify-center gap-1.5 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                        >
                          <DownloadSimple size={16} className="text-white" />
                          <span>Descargar archivo para computadoras (100% desconectado)</span>
                        </a>

                        <a
                          href="/diagnostico_escaner_datos_locales.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-2xs"
                        >
                          <ArrowSquareOut size={16} className="text-slate-500" />
                          <span>Abrir escáner de datos en otra pestaña</span>
                        </a>
                      </div>
                    </div>
                  </div>
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
                    className="w-full p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:bg-slate-100/70 transition-colors text-left cursor-pointer select-none"
                    aria-expanded={acordeonDimensionesCognitivo}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${temaNivel.iconBoxClass}`}>
                        <BookOpen size={18} weight="fill" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                            Criterios Módulo 1
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            nivelActivo === "7mo"
                              ? "bg-teal-100 text-teal-800 border border-teal-300"
                              : nivelActivo === "8vo"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-sky-100 text-[#002B49] border border-sky-300"
                          }`}>
                            {nivelActivo === "7mo"
                              ? "Programación y algoritmos • Apropiación tecnológica y digital"
                              : nivelActivo === "8vo"
                              ? "Apropiación Tecnológica • Programación y algoritmos"
                              : "Computación física, robótica y automatización • Programación y algoritmos"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Saberes diagnosticados para <strong className="text-slate-800">{temaNivel.nombreCompleto}</strong>. Haga clic para {acordeonDimensionesCognitivo ? "contraer" : "expandir"}.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold shrink-0">
                      <span>{acordeonDimensionesCognitivo ? "Ocultar" : "Ver saberes"}</span>
                      <CaretDown
                        size={18}
                        weight="bold"
                        className={`transition-transform duration-200 ${acordeonDimensionesCognitivo ? "rotate-180 text-slate-800" : ""}`}
                      />
                    </div>
                  </button>

                  {acordeonDimensionesCognitivo && (
                    <div className="p-4 sm:p-5 bg-slate-50/60 border-t border-slate-200/80 animate-fadeIn">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {(SABERES_COGNITIVOS_MAP[nivelActivo] || SABERES_COGNITIVOS_MAP["9no"]).map((saber) => (
                          <div
                            key={saber.id}
                            className={`bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5 border-l-4 hover:shadow-md transition-all flex flex-col justify-center ${
                              nivelActivo === "7mo"
                                ? "border-l-[#1B5E59]"
                                : nivelActivo === "8vo"
                                ? "border-l-[#D97706]"
                                : "border-l-[#002B49]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1.5 flex-wrap">
                              <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${
                                nivelActivo === "7mo"
                                  ? "bg-teal-100 text-[#1B5E59]"
                                  : nivelActivo === "8vo"
                                  ? "bg-amber-100 text-[#D97706]"
                                  : "bg-sky-100 text-[#002B49]"
                              }`}>
                                {saber.id}
                              </span>
                              {saber.areaCurricular && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate max-w-[150px] ${
                                  nivelActivo === "7mo"
                                    ? "bg-teal-50 text-teal-800 border border-teal-100"
                                    : nivelActivo === "8vo"
                                    ? "bg-amber-50 text-amber-800 border border-amber-100"
                                    : "bg-sky-50 text-sky-900 border border-sky-100"
                                }`} title={saber.areaCurricular}>
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

                {/* Tabla de Resultados Cognitivos */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BookOpen size={18} className="text-[#1B5E59]" />
                      <span>Resultados de Criterios Cognitivos — Sección {seccionActiva}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {registrosSeccion.length} estudiantes registrados
                    </span>
                  </div>

                  {registrosSeccion.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <BookOpen size={36} className="mx-auto text-slate-300" />
                      <p className="text-sm font-bold text-slate-700">No hay registros cognitivos para esta sección aún</p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Comparta el enlace o escanee los códigos QR de los estudiantes para ver el desglose en vivo.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4">Estudiante</th>
                            <th className="py-3 px-3 text-center">Aciertos</th>
                            <th className="py-3 px-3 text-center">Fallos</th>
                            <th className="py-3 px-3 text-center">Tiempo</th>
                            <th className="py-3 px-3 text-center">Puntaje</th>
                            <th className="py-3 px-4 text-center">Nivel de Logro</th>
                            <th className="py-3 px-3 text-right">Hora Registro</th>
                            <th className="py-3 px-3 text-center w-24">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {registrosSeccion.map((r, i) => (
                            <tr key={r.idResultado || r.timestamp || i} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {r.estudianteNombre}
                                {r.estudianteCedula && (
                                  <span className="block text-[10px] text-slate-400 font-mono font-normal">
                                    {r.estudianteCedula}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-emerald-700">
                                {r.aciertos || 0}
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-rose-600">
                                {r.fallos || 0}
                              </td>
                              <td className="py-3 px-3 text-center text-slate-500 font-mono">
                                {Math.floor((r.tiempoSegundos || 0) / 60)}m {(r.tiempoSegundos || 0) % 60}s
                              </td>
                              <td className="py-3 px-3 text-center font-black text-slate-900">
                                {r.porcentaje || 0}%
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                    r.nivelLogro === "Avanzado"
                                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                      : r.nivelLogro === "Intermedio"
                                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                                      : "bg-rose-100 text-rose-900 border border-rose-300"
                                  }`}
                                >
                                  {r.nivelLogro}
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
                    className="w-full p-4 flex items-center justify-between gap-3 bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:bg-slate-100/70 transition-colors text-left cursor-pointer select-none"
                    aria-expanded={acordeonDimensionesSocio}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${temaNivel.iconBoxClass}`}>
                        <Heart size={18} weight="fill" />
                      </div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                          Criterios Módulo 1
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                          nivelActivo === "7mo"
                            ? "bg-teal-100 text-[#1B5E59] border-teal-300"
                            : nivelActivo === "8vo"
                            ? "bg-amber-100 text-[#D97706] border-amber-300"
                            : "bg-sky-100 text-[#002B49] border-sky-300"
                        }`}>
                          Socioafectivo • {temaNivel.nombreCorto}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block text-xs font-bold text-slate-700">
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
                            className={`bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border-l-4 ${
                              nivelActivo === "7mo"
                                ? "border-l-[#1B5E59]"
                                : nivelActivo === "8vo"
                                ? "border-l-[#D97706]"
                                : "border-l-[#002B49]"
                            }`}
                            title="Haga clic para ver la rúbrica oficial y niveles de logro"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                                <span className={`text-xs font-black group-hover:opacity-80 transition-opacity ${
                                  nivelActivo === "7mo"
                                    ? "text-[#1B5E59]"
                                    : nivelActivo === "8vo"
                                    ? "text-[#D97706]"
                                    : "text-[#002B49]"
                                }`}>
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
                              <span className={`font-bold underline group-hover:no-underline ${
                                nivelActivo === "7mo"
                                  ? "text-[#1B5E59]"
                                  : nivelActivo === "8vo"
                                  ? "text-[#D97706]"
                                  : "text-[#002B49]"
                              }`}>
                                Ver detalle rúbrica
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Matriz Interactiva de Observación Socioafectiva */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Heart size={18} className="text-[#1B5E59]" weight="fill" />
                      <span>Matriz de Observación Socioafectiva (Escala MEP: A=Logrado, B=En Proceso, C=Inicial)</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setVistaSocioafectiva("matriz")}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          vistaSocioafectiva === "matriz"
                            ? "bg-[#1B5E59] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Matriz
                      </button>
                      <button
                        type="button"
                        onClick={() => setVistaSocioafectiva("tarjetas")}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          vistaSocioafectiva === "tarjetas"
                            ? "bg-[#1B5E59] text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Tarjetas
                      </button>
                    </div>
                  </div>

                  {registrosSeccion.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <Heart size={36} className="mx-auto text-slate-300" />
                      <p className="text-sm font-bold text-slate-700">Sin datos socioafectivos para esta sección</p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Inicie una observación o cargue las respuestas de los estudiantes para habilitar la matriz de bienestar.
                      </p>
                    </div>
                  ) : vistaSocioafectiva === "matriz" ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[850px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                            <th className="py-3 px-4 w-60">Persona Estudiante</th>
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
                            <th className="py-3 px-4">Nota Pedagógica del Docente</th>
                            <th className="py-3 px-3 text-center w-24">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {registrosSeccion.map((r, i) => {
                            const socio = r.socioafectivo || {};
                            const s1Val = socio.s1 || "A";
                            const s2Val = socio.s2 || "A";
                            const s3Val = socio.s3 || "A";
                            const s4Val = socio.s4 || "A";
                            const idKey = r.idResultado || r.estudianteCedula || r.estudianteNombre;
                            const tieneAlerta = (r.telemetria && r.telemetria.anomalias && r.telemetria.anomalias.length > 0) || (r.telemetria && r.telemetria.intentosTotales && r.telemetria.intentosTotales > 10) || (r.intentos && r.intentos > 10);

                            return (
                              <tr key={r.idResultado || r.timestamp || i} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 block">{r.estudianteNombre}</span>
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
                      className="w-full p-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-left transition-colors cursor-pointer select-none"
                      aria-expanded={guiaSimbologiaAbierta}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${temaNivel.iconBoxClass}`}>
                          <Pulse size={18} weight="bold" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                              Criterios Módulo 1
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              nivelActivo === "7mo"
                                ? "bg-teal-100 text-teal-800 border-teal-300"
                                : nivelActivo === "8vo"
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : "bg-sky-100 text-[#002B49] border-sky-300"
                            }`}>
                              Psicomotor • {temaNivel.nombreCorto}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Haga clic para {guiaSimbologiaAbierta ? "contraer" : "expandir"} los {criteriosActuales.length} criterios y rúbricas del Módulo 1.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold shrink-0">
                        <span>{guiaSimbologiaAbierta ? "Ocultar" : "Ver criterios y rúbricas"}</span>
                        <CaretDown
                          size={18}
                          weight="bold"
                          className={`transition-transform duration-200 ${guiaSimbologiaAbierta ? "rotate-180 text-slate-800" : ""}`}
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
                              className={`bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between border-l-4 ${
                                nivelActivo === "7mo"
                                  ? "border-l-[#1B5E59]"
                                  : nivelActivo === "8vo"
                                  ? "border-l-[#D97706]"
                                  : "border-l-[#002B49]"
                              }`}
                              title="Haga clic para ver la rúbrica oficial y niveles de logro"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                                  <span className={`text-xs font-black group-hover:opacity-80 transition-opacity ${
                                    nivelActivo === "7mo"
                                      ? "text-[#1B5E59]"
                                      : nivelActivo === "8vo"
                                      ? "text-[#D97706]"
                                      : "text-[#002B49]"
                                  }`}>
                                    {crit.codigo}
                                  </span>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {crit.areaCurricular && (
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                        nivelActivo === "7mo"
                                          ? "bg-teal-50 text-[#1B5E59] border-teal-200"
                                          : nivelActivo === "8vo"
                                          ? "bg-amber-50 text-[#D97706] border-amber-200"
                                          : "bg-sky-50 text-[#002B49] border-sky-200"
                                      }`}>
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

                  {/* Tabla Principal Dinámica de Registro Psicomotriz */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
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
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                              <th className="py-3 px-4 w-56 min-w-[200px]">Persona Estudiante (Nómina)</th>
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
                              criteriosActuales.forEach((crit) => {
                                const v = psico[crit.id] || "A";
                                if (v === "A") conteoA++;
                                else if (v === "B") conteoB++;
                                else conteoC++;
                              });

                              let badgeNivel = {
                                label: "Nivel A",
                                desc: "Logrado",
                                cls: "bg-emerald-100 text-emerald-800 border-emerald-300"
                              };
                              if (conteoC >= Math.ceil(criteriosActuales.length * 0.5)) {
                                badgeNivel = {
                                  label: "Nivel C",
                                  desc: "Inicial",
                                  cls: "bg-rose-100 text-rose-800 border-rose-300"
                                };
                              } else if (conteoB > conteoA || conteoA < Math.ceil(criteriosActuales.length * 0.5)) {
                                badgeNivel = {
                                  label: "Nivel B",
                                  desc: "En Proceso",
                                  cls: "bg-amber-100 text-amber-800 border-amber-300"
                                };
                              }

                              const observacionGuardada = notasLocales[idKey] || r.observacionDocente || "";

                              return (
                                <tr key={idKey} className="hover:bg-slate-50/80 transition-colors">
                                  {/* Nombre y Cédula */}
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900 block text-xs sm:text-sm">
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
                                    const val = psico[crit.id] || "A";
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
                                  <td className="py-3 px-3 text-center">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border ${badgeNivel.cls}`}>
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
                    )}
                  </div>

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
                                Sección {seccionActiva} • {nivelActivo === "7mo" ? "7.° Año" : nivelActivo === "8vo" ? "8.° Año" : "9.° Año"}
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

                  <div className="flex items-center gap-2 shrink-0">
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

                {/* Tabla de Sistematización Exacta MEP */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                  {registrosSeccion.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                      <Users size={36} className="mx-auto text-slate-300" />
                      <p className="text-sm font-bold text-slate-700">Sin datos de sistematización en esta sección</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs min-w-[950px]">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold text-[11px]">
                            <th className="py-3 px-4 border-r border-slate-300 w-48">Estudiantes</th>
                            {Array.from({ length: 9 }).map((_, idx) => (
                              <th key={idx} className="py-3 px-2 text-center border-r border-slate-300 w-16">
                                Apr. {idx + 1}
                              </th>
                            ))}
                            <th className="py-3 px-4">Descripción del desempeño individual o grupal</th>
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
                              <tr key={r.idResultado || r.timestamp || i} className="hover:bg-slate-50 transition-colors">
                                <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-200">
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

          {/* Footer Informativo */}
          <footer className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Ministerio de Educación Pública (MEP) • Suite Diagnóstica Secundaria (7.° y 9.° Año)</span>
            <span className="font-semibold text-slate-700">Febrero 2027.</span>
          </footer>
        </main>

      </div>

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
          nivelInicial={nivelActivo === "8vo" ? "9no" : nivelActivo}
        />
      )}

      {modalDocumentacion && (
        <ModalDocumentacionOficial
          abierto={modalDocumentacion}
          alCerrar={() => setModalDocumentacion(false)}
        />
      )}

    </div>
  );
}
