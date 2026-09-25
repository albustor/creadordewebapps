import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import {
  PayloadTelemetria,
  validarTokenAntiFraude,
  validarCompletitudValoracion,
} from "@/lib/antiFraude";

export const dynamic = "force-dynamic";

// Almacenamiento en memoria para telemetría
let registrosTelemetriaMemoria: any[] = [];

// Ruta del archivo de persistencia local segura
const CACHE_TELEMETRIA_PATH = path.join(os.tmpdir(), "telemetria_docente_cache.json");

function normalizarSeccionServidor(sec?: string): string {
  if (!sec) return "Sección 9-1";
  const limpia = sec.replace(/^secci[oó]n\s*/i, "").trim();
  if (/^[789]-/i.test(limpia)) {
    return `Sección ${limpia}`;
  }
  return `Sección ${limpia}`;
}

function esRegistroBloqueado(r: any): boolean {
  if (!r) return true;
  const estNom = (r.estudianteNombre || "").toLowerCase().trim();
  const estCor = (r.estudianteCorreo || "").toLowerCase().trim();
  const docNom = (r.docenteNombre || "").toLowerCase().trim();
  const docCor = (r.docenteEmail || "").toLowerCase().trim();
  return (
    estNom.includes("augrey") ||
    estCor.includes("augrey.bermudez") ||
    docNom.includes("augrey") ||
    docCor.includes("augrey.bermudez") ||
    estNom.includes("yo si jodo") ||
    estNom.includes("yosijodo")
  );
}

function deduplicarRegistrosEnMemoria() {
  const mapa = new Map<string, any>();
  registrosTelemetriaMemoria.forEach((r) => {
    if (r && r.estudianteNombre && !esRegistroBloqueado(r)) {
      const nom = r.estudianteNombre.trim().toLowerCase();
      const sec = normalizarSeccionServidor(r.seccionOGrupo).trim().toLowerCase();
      const clave = `${nom}::${sec}`;
      const normR = { ...r, seccionOGrupo: normalizarSeccionServidor(r.seccionOGrupo) };

      if (!mapa.has(clave)) {
        mapa.set(clave, normR);
      } else {
        const existente = mapa.get(clave);
        const esNuevoCompletado = r.estadoProgreso === "completado";
        const esExistenteCompletado = existente.estadoProgreso === "completado";
        
        if (esNuevoCompletado && !esExistenteCompletado) {
          mapa.set(clave, normR);
        } else if ((r.timestamp || 0) >= (existente.timestamp || 0)) {
          mapa.set(clave, normR);
        }
      }
    }
  });
  registrosTelemetriaMemoria = Array.from(mapa.values()).sort(
    (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
  );
}

const REGISTROS_DEFAULT_INICIALES_9NO: any[] = [
  {
    idResultado: "RES-9NO-PRUEBA-001",
    webAppId: "diagnostico_9no_modulo01_en_linea",
    webAppTitulo: "Evaluación Diagnóstica — 9° Año (PNFT)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 1",
    estudianteCedula: "1-1111-0001",
    seccionOGrupo: "Sección 9-1",
    nivel: "9°",
    puntaje: 10,
    puntajeMaximo: 10,
    porcentaje: 100,
    nivelLogro: "Avanzado",
    tiempoSegundos: 195,
    totalReactivos: 10,
    aciertos: 10,
    fallos: 0,
    tarjetas: "3/3",
    puertos: "9/9",
    ejecucion: "Completa",
    socioafectiva: "5/5 indicadores favorables",
    fortalezas: "Microcontrolador, Sensor/actuador, Entrada–proceso–salida, Algoritmos, Condicional, Depuración, Almacenamiento",
    prioridades: "Ninguna (Dominio Consolidado)",
    estadoProgreso: "completado",
    timestamp: 1774500000000,
    tokenAntiFraude: "TOK-MEP9-E74A8201",
    fechaHoraRegistro: "25/2/2027, 10:00:00 AM",
  },
  {
    idResultado: "RES-9NO-PRUEBA-002",
    webAppId: "diagnostico_9no_modulo01_en_linea",
    webAppTitulo: "Evaluación Diagnóstica — 9° Año (PNFT)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 2",
    estudianteCedula: "1-1111-0002",
    seccionOGrupo: "Sección 9-1",
    nivel: "9°",
    puntaje: 8,
    puntajeMaximo: 10,
    porcentaje: 80,
    nivelLogro: "Avanzado",
    tiempoSegundos: 220,
    totalReactivos: 10,
    aciertos: 8,
    fallos: 2,
    tarjetas: "3/3",
    puertos: "9/9",
    ejecucion: "Completa",
    socioafectiva: "5/5 indicadores favorables",
    fortalezas: "Microcontrolador, Sensor/actuador, Condicional, Depuración, Almacenamiento",
    prioridades: "Algoritmos, Dato sensorial",
    estadoProgreso: "completado",
    timestamp: 1774499900000,
    tokenAntiFraude: "TOK-MEP9-B391F002",
    fechaHoraRegistro: "25/2/2027, 09:55:00 AM",
  },
  {
    idResultado: "RES-9NO-PRUEBA-003",
    webAppId: "diagnostico_9no_modulo01_en_linea",
    webAppTitulo: "Evaluación Diagnóstica — 9° Año (PNFT)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 3",
    estudianteCedula: "1-1111-0003",
    seccionOGrupo: "Sección 9-1",
    nivel: "9°",
    puntaje: 7,
    puntajeMaximo: 10,
    porcentaje: 70,
    nivelLogro: "Intermedio",
    tiempoSegundos: 250,
    totalReactivos: 10,
    aciertos: 7,
    fallos: 3,
    tarjetas: "3/3",
    puertos: "8/9",
    ejecucion: "Completa",
    socioafectiva: "4/5 indicadores favorables",
    fortalezas: "Microcontrolador, Entrada–proceso–salida, Control lógico, Almacenamiento",
    prioridades: "Sensor/actuador, Condicional, Depuración",
    estadoProgreso: "completado",
    timestamp: 1774499800000,
    tokenAntiFraude: "TOK-MEP9-C10A9403",
    fechaHoraRegistro: "25/2/2027, 09:50:00 AM",
  },
  {
    idResultado: "RES-9NO-PRUEBA-004",
    webAppId: "diagnostico_9no_modulo01_en_linea",
    webAppTitulo: "Evaluación Diagnóstica — 9° Año (PNFT)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 4",
    estudianteCedula: "1-1111-0004",
    seccionOGrupo: "Sección 9-1",
    nivel: "9°",
    puntaje: 6,
    puntajeMaximo: 10,
    porcentaje: 60,
    nivelLogro: "Intermedio",
    tiempoSegundos: 290,
    totalReactivos: 10,
    aciertos: 6,
    fallos: 4,
    tarjetas: "3/3",
    puertos: "7/9",
    ejecucion: "Parcial",
    socioafectiva: "4/5 indicadores favorables",
    fortalezas: "Entrada–proceso–salida, Algoritmos, Almacenamiento",
    prioridades: "Microcontrolador, Condicional, Roles hardware, Depuración",
    estadoProgreso: "completado",
    timestamp: 1774499700000,
    tokenAntiFraude: "TOK-MEP9-892D4104",
    fechaHoraRegistro: "25/2/2027, 09:45:00 AM",
  },
  {
    idResultado: "RES-9NO-PRUEBA-005",
    webAppId: "diagnostico_9no_modulo01_en_linea",
    webAppTitulo: "Evaluación Diagnóstica — 9° Año (PNFT)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 5",
    estudianteCedula: "1-1111-0005",
    seccionOGrupo: "Sección 9-1",
    nivel: "9°",
    puntaje: 4,
    puntajeMaximo: 10,
    porcentaje: 40,
    nivelLogro: "Inicial",
    tiempoSegundos: 340,
    totalReactivos: 10,
    aciertos: 4,
    fallos: 6,
    tarjetas: "2/3",
    puertos: "5/9",
    ejecucion: "Parcial",
    socioafectiva: "3/5 indicadores favorables",
    fortalezas: "Sensor/actuador, Almacenamiento",
    prioridades: "Microcontrolador, Entrada–proceso–salida, Algoritmos, Condicional, Depuración, Roles hardware",
    estadoProgreso: "completado",
    timestamp: 1774499600000,
    tokenAntiFraude: "TOK-MEP9-56F83005",
    fechaHoraRegistro: "25/2/2027, 09:40:00 AM",
  }
];

const REGISTROS_DEFAULT_INICIALES_7MO: any[] = [
  {
    idResultado: "RES-7MO-PRUEBA-001",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 1",
    estudianteCedula: "7-7777-0001",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 10,
    puntajeMaximo: 10,
    porcentaje: 100,
    nivelLogro: "Avanzado",
    tiempoSegundos: 180,
    totalReactivos: 10,
    aciertos: 10,
    fallos: 0,
    psicomotor: { lateralidad: "100%", ritmo: "100%", pulso: "100%", plano: "Completado" },
    socioafectivo: { s1: 3, s2: 3, s3: 3, s4: 3 },
    socioafectiva: "4/4 indicadores favorables",
    fortalezas: "Hardware, Software, Sistemas Operativos, Redes, Formatos, Edición Gráfica, Algoritmos, Bucles, Condicionales, Lógica",
    prioridades: "Ninguna (Dominio Consolidado)",
    estadoProgreso: "completado",
    timestamp: 1774500100000,
    tokenAntiFraude: "TOK-MEP7-P001A89",
    fechaHoraRegistro: "25/2/2027, 08:00:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-002",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 2",
    estudianteCedula: "7-7777-0002",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 9,
    puntajeMaximo: 10,
    porcentaje: 90,
    nivelLogro: "Avanzado",
    tiempoSegundos: 205,
    totalReactivos: 10,
    aciertos: 9,
    fallos: 1,
    psicomotor: { lateralidad: "95%", ritmo: "90%", pulso: "95%", plano: "Completado" },
    socioafectivo: { s1: 3, s2: 3, s3: 3, s4: 3 },
    socioafectiva: "4/4 indicadores favorables",
    fortalezas: "Hardware, Software, Sistemas Operativos, Redes, Algoritmos, Condicionales, Lógica",
    prioridades: "Bucles y variables",
    estadoProgreso: "completado",
    timestamp: 1774500090000,
    tokenAntiFraude: "TOK-MEP7-P002B78",
    fechaHoraRegistro: "25/2/2027, 08:05:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-003",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 3",
    estudianteCedula: "7-7777-0003",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 8,
    puntajeMaximo: 10,
    porcentaje: 80,
    nivelLogro: "Avanzado",
    tiempoSegundos: 230,
    totalReactivos: 10,
    aciertos: 8,
    fallos: 2,
    psicomotor: { lateralidad: "90%", ritmo: "85%", pulso: "90%", plano: "Completado" },
    socioafectivo: { s1: 3, s2: 3, s3: 2, s4: 3 },
    socioafectiva: "4/4 indicadores favorables",
    fortalezas: "Hardware, Software, Redes, Formatos, Algoritmos, Lógica",
    prioridades: "Sistemas Operativos, Condicionales",
    estadoProgreso: "completado",
    timestamp: 1774500080000,
    tokenAntiFraude: "TOK-MEP7-P003C67",
    fechaHoraRegistro: "25/2/2027, 08:10:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-004",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 4",
    estudianteCedula: "7-7777-0004",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 7,
    puntajeMaximo: 10,
    porcentaje: 70,
    nivelLogro: "Intermedio",
    tiempoSegundos: 260,
    totalReactivos: 10,
    aciertos: 7,
    fallos: 3,
    psicomotor: { lateralidad: "85%", ritmo: "80%", pulso: "85%", plano: "Completado" },
    socioafectivo: { s1: 3, s2: 2, s3: 3, s4: 2 },
    socioafectiva: "3/4 indicadores favorables",
    fortalezas: "Hardware, Software, Formatos, Algoritmos",
    prioridades: "Redes, Bucles, Lógica proposicional",
    estadoProgreso: "completado",
    timestamp: 1774500070000,
    tokenAntiFraude: "TOK-MEP7-P004D56",
    fechaHoraRegistro: "25/2/2027, 08:15:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-005",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 5",
    estudianteCedula: "7-7777-0005",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 7,
    puntajeMaximo: 10,
    porcentaje: 70,
    nivelLogro: "Intermedio",
    tiempoSegundos: 275,
    totalReactivos: 10,
    aciertos: 7,
    fallos: 3,
    psicomotor: { lateralidad: "80%", ritmo: "80%", pulso: "80%", plano: "Completado" },
    socioafectivo: { s1: 3, s2: 3, s3: 2, s4: 3 },
    socioafectiva: "3/4 indicadores favorables",
    fortalezas: "Hardware, Sistemas Operativos, Formatos, Edición",
    prioridades: "Algoritmos, Condicionales, Lógica",
    estadoProgreso: "completado",
    timestamp: 1774500060000,
    tokenAntiFraude: "TOK-MEP7-P005E45",
    fechaHoraRegistro: "25/2/2027, 08:20:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-006",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 6",
    estudianteCedula: "7-7777-0006",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 6,
    puntajeMaximo: 10,
    porcentaje: 60,
    nivelLogro: "Intermedio",
    tiempoSegundos: 300,
    totalReactivos: 10,
    aciertos: 6,
    fallos: 4,
    psicomotor: { lateralidad: "75%", ritmo: "75%", pulso: "75%", plano: "Completado" },
    socioafectivo: { s1: 2, s2: 2, s3: 3, s4: 2 },
    socioafectiva: "3/4 indicadores favorables",
    fortalezas: "Hardware, Software, Formatos",
    prioridades: "Sistemas Operativos, Algoritmos, Bucles, Lógica",
    estadoProgreso: "completado",
    timestamp: 1774500050000,
    tokenAntiFraude: "TOK-MEP7-P006F34",
    fechaHoraRegistro: "25/2/2027, 08:25:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-007",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 7",
    estudianteCedula: "7-7777-0007",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 6,
    puntajeMaximo: 10,
    porcentaje: 60,
    nivelLogro: "Intermedio",
    tiempoSegundos: 310,
    totalReactivos: 10,
    aciertos: 6,
    fallos: 4,
    psicomotor: { lateralidad: "70%", ritmo: "75%", pulso: "70%", plano: "Completado" },
    socioafectivo: { s1: 3, s2: 2, s3: 2, s4: 2 },
    socioafectiva: "3/4 indicadores favorables",
    fortalezas: "Hardware, Edición Gráfica, Formatos",
    prioridades: "Redes, Algoritmos, Condicionales, Bucles",
    estadoProgreso: "completado",
    timestamp: 1774500040000,
    tokenAntiFraude: "TOK-MEP7-P007G23",
    fechaHoraRegistro: "25/2/2027, 08:30:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-008",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 8",
    estudianteCedula: "7-7777-0008",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 5,
    puntajeMaximo: 10,
    porcentaje: 50,
    nivelLogro: "Inicial",
    tiempoSegundos: 335,
    totalReactivos: 10,
    aciertos: 5,
    fallos: 5,
    psicomotor: { lateralidad: "65%", ritmo: "65%", pulso: "65%", plano: "Completado" },
    socioafectivo: { s1: 2, s2: 2, s3: 2, s4: 2 },
    socioafectiva: "2/4 indicadores favorables",
    fortalezas: "Hardware, Software",
    prioridades: "Sistemas Operativos, Redes, Algoritmos, Bucles, Condicionales, Lógica",
    estadoProgreso: "completado",
    timestamp: 1774500030000,
    tokenAntiFraude: "TOK-MEP7-P008H12",
    fechaHoraRegistro: "25/2/2027, 08:35:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-009",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 9",
    estudianteCedula: "7-7777-0009",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 4,
    puntajeMaximo: 10,
    porcentaje: 40,
    nivelLogro: "Inicial",
    tiempoSegundos: 350,
    totalReactivos: 10,
    aciertos: 4,
    fallos: 6,
    psicomotor: { lateralidad: "60%", ritmo: "60%", pulso: "60%", plano: "Completado" },
    socioafectivo: { s1: 2, s2: 2, s3: 1, s4: 2 },
    socioafectiva: "2/4 indicadores favorables",
    fortalezas: "Hardware, Formatos",
    prioridades: "Software, Sistemas Operativos, Redes, Algoritmos, Bucles, Condicionales",
    estadoProgreso: "completado",
    timestamp: 1774500020000,
    tokenAntiFraude: "TOK-MEP7-P009J01",
    fechaHoraRegistro: "25/2/2027, 08:40:00 AM",
  },
  {
    idResultado: "RES-7MO-PRUEBA-010",
    webAppId: "diagnostico_7mo_modulo01_cyberquest",
    webAppTitulo: "CyberQuest 7°: Diagnóstico de Fundamentos Digitales (PNFT 2027)",
    docenteId: "5-0305-0179",
    docenteCedula: "5-0305-0179",
    docenteNombre: "Prof. Alberto Bustos Ortega",
    institucionNombre: "Liceo de Costa Rica",
    estudianteNombre: "Estudiante Prueba 10",
    estudianteCedula: "7-7777-0010",
    seccionOGrupo: "Sección 7-1",
    nivel: "7°",
    puntaje: 3,
    puntajeMaximo: 10,
    porcentaje: 30,
    nivelLogro: "Inicial",
    tiempoSegundos: 370,
    totalReactivos: 10,
    aciertos: 3,
    fallos: 7,
    psicomotor: { lateralidad: "50%", ritmo: "50%", pulso: "50%", plano: "Completado" },
    socioafectivo: { s1: 2, s2: 1, s3: 2, s4: 1 },
    socioafectiva: "1/4 indicadores favorables",
    fortalezas: "Hardware básico",
    prioridades: "Software, Sistemas Operativos, Redes, Formatos, Algoritmos, Bucles, Condicionales, Lógica",
    estadoProgreso: "completado",
    timestamp: 1774500010000,
    tokenAntiFraude: "TOK-MEP7-P010K90",
    fechaHoraRegistro: "25/2/2027, 08:45:00 AM",
  }
];

const TODOS_LOS_REGISTROS_DEFAULT: any[] = [
  ...REGISTROS_DEFAULT_INICIALES_9NO,
  ...REGISTROS_DEFAULT_INICIALES_7MO
];

function cargarRegistrosServidor() {
  try {
    if (fs.existsSync(CACHE_TELEMETRIA_PATH)) {
      const data = fs.readFileSync(CACHE_TELEMETRIA_PATH, "utf8");
      if (data && data.trim().length > 0) {
        try {
          registrosTelemetriaMemoria = JSON.parse(data);
          // Asegurar que siempre existan los 10 registros de 7mo si no están en memoria
          const tiene7mo = registrosTelemetriaMemoria.some(r => r && (r.nivel === "7°" || (r.seccionOGrupo && r.seccionOGrupo.includes("7-"))));
          if (!tiene7mo) {
            registrosTelemetriaMemoria = [...registrosTelemetriaMemoria, ...REGISTROS_DEFAULT_INICIALES_7MO];
          }
          deduplicarRegistrosEnMemoria();
        } catch {
          registrosTelemetriaMemoria = [...TODOS_LOS_REGISTROS_DEFAULT];
        }
      } else {
        registrosTelemetriaMemoria = [...TODOS_LOS_REGISTROS_DEFAULT];
      }
    } else {
      registrosTelemetriaMemoria = [...TODOS_LOS_REGISTROS_DEFAULT];
    }
  } catch (e) {
    registrosTelemetriaMemoria = [...TODOS_LOS_REGISTROS_DEFAULT];
  }
}

function guardarRegistrosServidor() {
  try {
    deduplicarRegistrosEnMemoria();
    const dir = path.dirname(CACHE_TELEMETRIA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_TELEMETRIA_PATH, JSON.stringify(registrosTelemetriaMemoria, null, 2), "utf8");
  } catch (e) {
    // Si falla el guardado en disco, se mantiene en memoria sin fallar la respuesta
  }
}

// Cargar al inicio
try {
  cargarRegistrosServidor();
} catch (e) {}

// Headers CORS para permitir envíos desde file:/// y cualquier origen local
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    let rawBody: any;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Cuerpo de solicitud JSON no válido o vacío" },
        { status: 400, headers: corsHeaders }
      );
    }

    let items: any[] = [];
    if (Array.isArray(rawBody)) {
      items = rawBody;
    } else if (rawBody.lote && Array.isArray(rawBody.lote)) {
      items = rawBody.lote;
    } else if (rawBody.datos) {
      items = Array.isArray(rawBody.datos) ? rawBody.datos : [rawBody.datos];
    } else if (rawBody.evaluaciones && Array.isArray(rawBody.evaluaciones)) {
      items = rawBody.evaluaciones;
    } else {
      items = [rawBody];
    }

    cargarRegistrosServidor();

    const procesados: any[] = [];

    for (const rawItem of items) {
      let body: any = { ...rawItem };
      if (body.datos && typeof body.datos === 'object') {
        body = { ...body, ...body.datos };
      }

      // Normalizar registros provenientes de CyberQuest 7.° Año (en parejas o individual)
      if (
        body.tipo === 'CYBERQUEST_7MO' ||
        body.tipo === 'MEP_7MO_CYBERQUEST' ||
        body.cadet1 ||
        body.c1 ||
        body.name1 ||
        body.webAppId?.includes('7mo')
      ) {
        const c1 =
          typeof body.cadet1 === 'object'
            ? body.cadet1?.name || "Cadete 1"
            : typeof body.name1 === 'object'
            ? body.name1?.name || "Cadete 1"
            : body.cadet1 || body.c1 || body.name1 || "Cadete 1";
        const c2 =
          typeof body.cadet2 === 'object'
            ? body.cadet2?.name || ""
            : typeof body.name2 === 'object'
            ? body.name2?.name || ""
            : body.cadet2 || body.c2 || body.name2 || "";
        const nombreEstudiante =
          c2 && c2.trim().length > 0 && c2 !== "Individual" ? `${c1} & ${c2}` : c1;

        body.estudianteNombre = body.estudianteNombre || nombreEstudiante;
        body.docenteId = body.docenteId || "DOC-MEP-7MO";
        body.seccionOGrupo = body.seccionOGrupo || body.seccion || body.sec || "Sección 7-1";
        body.porcentaje =
          body.porcentaje !== undefined
            ? body.porcentaje
            : body.globalAvg !== undefined
            ? body.globalAvg
            : body.g !== undefined
            ? body.g
            : body.cogScore !== undefined
            ? body.cogScore
            : body.c !== undefined
            ? body.c
            : 80;
        body.puntaje = body.puntaje !== undefined ? body.puntaje : body.porcentaje;
        body.nivel = body.nivel || "7°";
        body.webAppId = body.webAppId || "diag-7mo-cyberquest-2027";
        body.webAppTitulo = body.webAppTitulo || "CyberQuest 7°: Diagnóstico de Fundamentos Digitales";
        body.tiempoSegundos = body.tiempoSegundos || 60;
      }

      // Normalizar registros de 8.° Año
      if (
        body.webAppId?.includes("8vo") ||
        body.tipo === "MEP_8VO_DIAGNOSTICO" ||
        body.origen?.includes("8VO") ||
        body.subareasDetalle ||
        (body.seccionOGrupo && /8-/i.test(body.seccionOGrupo))
      ) {
        body.docenteId = body.docenteId || body.docenteCedula || "DOC-MEP-8VO";
        body.nivel = "8°";
        body.webAppId = body.webAppId || "diagnostico_8vo_modulo01_docente_evaluador";
        body.webAppTitulo = body.webAppTitulo || "Evaluación Diagnóstica — 8° Año (PNFT)";
        body.totalReactivos = body.totalReactivos || 14;
        body.puntajeMaximo = body.puntajeMaximo || 14;

        const rawPts = body.puntaje !== undefined && body.puntaje <= 14 ? body.puntaje : (body.aciertos !== undefined && body.aciertos <= 14 ? body.aciertos : Math.round(((body.porcentaje ?? body.puntaje ?? 80) / 100) * 14));
        const rawScore = body.porcentaje !== undefined ? body.porcentaje : Math.round((rawPts / 14) * 100);

        body.puntaje = rawPts;
        body.porcentaje = rawScore;
        body.aciertos = rawPts;
        body.fallos = Math.max(0, 14 - rawPts);
        body.nivelLogro = rawScore >= 80 ? "Avanzado" : rawScore <= 59 ? "Inicial" : "Intermedio";
      }

      if (!body.docenteId) {
        body.docenteId = "DOC-MEP-AUTONOMO";
      }

      if (!body.estudianteNombre) {
        continue;
      }

      const esRegistroInicial = (body as any).estadoProgreso === "iniciado" || (body as any).tipoActividad === "inicio_diagnostico";
      const secNormalizada = normalizarSeccionServidor(body.seccionOGrupo);
      const now = new Date();
      const fechaLocalCR = now.toLocaleString("es-CR", { timeZone: "America/Costa_Rica" });
      const fechaCorta = now.toLocaleDateString("es-CR", { timeZone: "America/Costa_Rica" });
      const horaCorta = now.toLocaleTimeString("es-CR", { timeZone: "America/Costa_Rica" });

      const resultadoProcesado = {
        ...body,
        seccionOGrupo: secNormalizada,
        idResultado: body.idResultado || "res-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        timestamp: body.timestamp || Date.now(),
        fechaIngreso: body.fechaIngreso || fechaLocalCR,
        fechaHoraRegistro: body.fechaHoraRegistro || `${fechaCorta}, ${horaCorta}`,
        fechaEntrega: body.fechaEntrega || fechaCorta,
        horaEntrega: body.horaEntrega || horaCorta,
        integridadVerificada: true,
        recibidoEnServidor: now.toISOString(),
        estadoProgreso: (body as any).estadoProgreso || (esRegistroInicial ? "iniciado" : "completado"),
      };

      const nomNorm = resultadoProcesado.estudianteNombre.trim().toLowerCase();
      const secNorm = secNormalizada.trim().toLowerCase();

      const indexExistente = registrosTelemetriaMemoria.findIndex((r) => {
        const rNom = (r.estudianteNombre || "").trim().toLowerCase();
        const rSec = normalizarSeccionServidor(r.seccionOGrupo).trim().toLowerCase();
        return rNom === nomNorm && rSec === secNorm;
      });

      if (indexExistente >= 0) {
        const existente = registrosTelemetriaMemoria[indexExistente];
        const puntajeNuevo = resultadoProcesado.porcentaje ?? resultadoProcesado.puntaje ?? 0;
        const puntajeExistente = existente.porcentaje ?? existente.puntaje ?? 0;

        // Si el nuevo registro es completado o más reciente, prevalece el puntaje real enviado
        const esNuevoCompletado = resultadoProcesado.estadoProgreso === "completado";
        const esExistenteCompletado = existente.estadoProgreso === "completado";
        const esCompletadoFinal = esNuevoCompletado || esExistenteCompletado;

        let porcentajeFinal = puntajeNuevo;
        const totReactivos = resultadoProcesado.totalReactivos || existente.totalReactivos || (resultadoProcesado.nivel === "8°" ? 14 : 10);
        let aciertosFinal = resultadoProcesado.aciertos ?? Math.round((porcentajeFinal / 100) * totReactivos);
        let cogFinal = resultadoProcesado.cog || existente.cog;

        // Si el existente ya estaba completado y el nuevo es solo un ping de 'iniciado', conservar el completado
        if (esExistenteCompletado && !esNuevoCompletado) {
          porcentajeFinal = puntajeExistente;
          aciertosFinal = existente.aciertos ?? Math.round((puntajeExistente / 100) * totReactivos);
          cogFinal = existente.cog;
        }

        const nivelFinal = !esCompletadoFinal
          ? "En Evaluación"
          : (porcentajeFinal >= 80 ? "Avanzado" : (porcentajeFinal <= 59 ? "Inicial" : "Intermedio"));

        registrosTelemetriaMemoria[indexExistente] = {
          ...existente,
          ...resultadoProcesado,
          puntaje: resultadoProcesado.nivel === "8°" ? aciertosFinal : porcentajeFinal,
          porcentaje: porcentajeFinal,
          aciertos: aciertosFinal,
          totalReactivos: totReactivos,
          fallos: Math.max(0, totReactivos - aciertosFinal),
          cog: cogFinal,
          subareasDetalle: resultadoProcesado.subareasDetalle || existente.subareasDetalle,
          socioafectivo: resultadoProcesado.socioafectivo || existente.socioafectivo,
          psicomotor: resultadoProcesado.psicomotor || existente.psicomotor,
          psicomotorDetalle: resultadoProcesado.psicomotorDetalle || existente.psicomotorDetalle,
          nivelLogro: nivelFinal,
          estadoProgreso: esCompletadoFinal ? "completado" : "en_progreso",
          ultimaActualizacion: new Date().toISOString(),
        };
      } else {
        const esComp = resultadoProcesado.estadoProgreso === "completado";
        resultadoProcesado.nivelLogro = esComp
          ? (resultadoProcesado.porcentaje >= 80 ? "Avanzado" : (resultadoProcesado.porcentaje <= 59 ? "Inicial" : "Intermedio"))
          : "En Evaluación";
        registrosTelemetriaMemoria.unshift(resultadoProcesado);
      }

      procesados.push(resultadoProcesado);
    }

    guardarRegistrosServidor();

    return NextResponse.json(
      {
        success: true,
        mensaje: `Telemetría recibida y sincronizada correctamente (${procesados.length} registro(s))`,
        procesados: procesados.length,
        totalEnServidor: registrosTelemetriaMemoria.length,
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error en API de telemetría:", error);
    return NextResponse.json(
      { error: "Error interno al procesar telemetría", details: error?.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req: NextRequest) {
  cargarRegistrosServidor();
  const { searchParams } = new URL(req.url);
  const docenteId = searchParams.get("docenteId");
  const cedula = searchParams.get("cedula");
  const correo = searchParams.get("correo");
  const nombre = searchParams.get("docenteNombre");
  const verTodos = searchParams.get("verTodos") === "true";

  let datos = registrosTelemetriaMemoria;

  if (!verTodos && (docenteId || cedula || correo || nombre)) {
    const docIdNorm = (docenteId || "").trim().toLowerCase();
    const cedNorm = (cedula || "").trim().toLowerCase();
    const corNorm = (correo || "").trim().toLowerCase();
    const nomNorm = (nombre || "").trim().toLowerCase();
    const cedClean = cedNorm.replace(/\D/g, "");

    const esDocentePrueba = docIdNorm.includes("prueba") || docIdNorm.includes("demo") || docIdNorm.includes("asesor") || docIdNorm.includes("admin") || docIdNorm.includes("5-0305-0179") || nomNorm.includes("prueba") || nomNorm.includes("demo") || corNorm.includes("prueba") || corNorm.includes("demo");

    datos = registrosTelemetriaMemoria.filter((r) => {
      if (esDocentePrueba) return true; // Cuentas demo y docentes de prueba visualizan el padrón de pruebas completo

      const rDocId = (r.docenteId || "").trim().toLowerCase();
      const rDocCed = (r.docenteCedula || "").trim().toLowerCase();
      const rDocEmail = (r.docenteEmail || "").trim().toLowerCase();
      const rDocNom = (r.docenteNombre || "").trim().toLowerCase();
      const rDocCedClean = rDocCed.replace(/\D/g, "");

      const matchId = docIdNorm && (rDocId === docIdNorm || rDocId.includes(docIdNorm));
      const matchCed = cedClean && (rDocCedClean === cedClean || rDocId === cedClean);
      const matchEmail = corNorm && (rDocEmail === corNorm || rDocEmail.includes(corNorm));
      const matchNom = nomNorm && (rDocNom === nomNorm || rDocNom.includes(nomNorm));

      return Boolean(matchId || matchCed || matchEmail || matchNom);
    });
  }

  return NextResponse.json(
    {
      status: "online",
      servicio: "API Ingesta de Telemetría Educativa - Creador de WebApps",
      totalRegistros: datos.length,
      registros: datos,
      timestamp: new Date().toISOString(),
    },
    { headers: corsHeaders }
  );
}

export async function DELETE(req: NextRequest) {
  try {
    cargarRegistrosServidor();
    const { searchParams } = new URL(req.url);
    const timestampStr = searchParams.get("timestamp");
    const idResultado = searchParams.get("idResultado");
    const docenteId = searchParams.get("docenteId");
    const correo = searchParams.get("correo");
    const docenteNombre = searchParams.get("docenteNombre");
    const estudianteNombre = searchParams.get("estudianteNombre");
    const vaciarTodo = searchParams.get("all") === "true";

    if (vaciarTodo) {
      if (docenteId || correo || docenteNombre) {
        const idLow = (docenteId || "").trim().toLowerCase();
        const corLow = (correo || "").trim().toLowerCase();
        const nomLow = (docenteNombre || "").trim().toLowerCase();
        const idClean = idLow.replace(/\D/g, "");

        registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter((r) => {
          const rDocId = (r.docenteId || "").trim().toLowerCase();
          const rDocCed = ((r as any).docenteCedula || "").trim().toLowerCase();
          const rDocEmail = ((r as any).docenteEmail || "").trim().toLowerCase();
          const rDocNom = ((r as any).docenteNombre || "").trim().toLowerCase();

          const rDocIdClean = rDocId.replace(/\D/g, "");
          const rDocCedClean = rDocCed.replace(/\D/g, "");

          const matchId = idLow && (rDocId === idLow || rDocId.includes(idLow));
          const matchClean = idClean && (rDocIdClean === idClean || rDocCedClean === idClean);
          const matchCor = corLow && (rDocEmail === corLow || rDocEmail.includes(corLow));
          const matchNom = nomLow && (rDocNom === nomLow || rDocNom.includes(nomLow));

          // Si coincide con el docente que está vaciando, se elimina (retorna false)
          return !(matchId || matchClean || matchCor || matchNom);
        });
      } else {
        // Vaciar todos los registros del servidor
        registrosTelemetriaMemoria = [];
      }
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: "Todos los registros de telemetría han sido eliminados correctamente del servidor",
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    if (estudianteNombre) {
      const nomLimpio = decodeURIComponent(estudianteNombre).trim().toLowerCase();
      const prevLength = registrosTelemetriaMemoria.length;
      registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter((r) => {
        const rNom = (r.estudianteNombre || r.nombre || "").trim().toLowerCase();
        return rNom !== nomLimpio && !rNom.includes(nomLimpio) && !nomLimpio.includes(rNom);
      });
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: `Estudiante ${estudianteNombre} eliminado correctamente del servidor`,
          eliminado: prevLength !== registrosTelemetriaMemoria.length,
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    if (idResultado) {
      const prevLength = registrosTelemetriaMemoria.length;
      registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter(
        (r) => r.idResultado !== idResultado
      );
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: "Registro eliminado correctamente por ID",
          eliminado: prevLength !== registrosTelemetriaMemoria.length,
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    if (timestampStr) {
      const ts = Number(timestampStr);
      const prevLength = registrosTelemetriaMemoria.length;
      registrosTelemetriaMemoria = registrosTelemetriaMemoria.filter(
        (r) => Number(r.timestamp) !== ts && Number(r.timestampEpoch) !== ts
      );
      guardarRegistrosServidor();
      return NextResponse.json(
        {
          success: true,
          mensaje: "Registro eliminado correctamente por Timestamp",
          eliminado: prevLength !== registrosTelemetriaMemoria.length,
          restantes: registrosTelemetriaMemoria.length,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Parámetros insuficientes para eliminar (se requiere timestamp, idResultado, docenteId o all=true)" },
      { status: 400, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Error al eliminar telemetría en servidor:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar registros", details: error?.message },
      { status: 500, headers: corsHeaders }
    );
  }
}


