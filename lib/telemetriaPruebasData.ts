import { PayloadTelemetria } from "./antiFraude";

const secciones7mo = ["Sección 7-1", "Sección 7-2", "Sección 7-3", "Sección 7-4"];
const secciones9no = ["Sección 9-1", "Sección 9-2", "Sección 9-3", "Sección 9-4"];

export function crearPruebasAutomatizadas7mo(): PayloadTelemetria[] {
  const lista: PayloadTelemetria[] = [];
  const baseTimestamp = 1771000000000; // Febrero 2027

  for (let i = 1; i <= 20; i++) {
    const numStr = String(i).padStart(2, "0");
    const esPareja = i % 2 === 0;
    const cadete1 = `PRUEBASAUTOMAT${numStr} Cadete A`;
    const cadete2 = esPareja ? `PRUEBASAUTOMAT${numStr} Cadete B` : "Individual";
    const nombreEstudiante = esPareja ? `${cadete1} & ${cadete2}` : cadete1;

    const score = i === 1 ? 100 : i === 2 ? 0 : Math.min(100, Math.max(30, (i * 13) % 100));
    const aciertos = Math.round((score / 100) * 10);
    const nivelLogro: "Inicial" | "Intermedio" | "Avanzado" =
      score >= 80 ? "Avanzado" : score <= 59 ? "Inicial" : "Intermedio";
    const seccion = secciones7mo[i % secciones7mo.length];

    lista.push({
      idResultado: `res-7mo-auto-${numStr}`,
      webAppId: "diagnostico_7mo_modulo01_desconectado_offline_v3_2",
      webAppTitulo: "Diagnóstico 7°: Misión Diagnóstica (V3.2)",
      docenteId: "DOC-PRUEBA-001",
      docenteNombre: "Docente Prueba",
      docenteEmail: "prueba.docente1.docente.1@mep.go.cr",
      institucionNombre: "Liceo de Costa Rica",
      estudianteNombre: nombreEstudiante,
      seccionOGrupo: seccion,
      nivel: "7°",
      puntaje: score,
      puntajeMaximo: 100,
      porcentaje: score,
      nivelLogro: nivelLogro,
      tiempoSegundos: 120 + i * 15,
      totalReactivos: 10,
      aciertos: aciertos,
      fallos: 10 - aciertos,
      timestamp: baseTimestamp + i * 60000,
      fechaEntrega: "15/02/2027",
      horaEntrega: `08:${String(10 + i).padStart(2, "0")}:00`,
      fechaHoraRegistro: `15/02/2027, 08:${String(10 + i).padStart(2, "0")}`,
      estadoProgreso: "completado",
      telemetria: {
        intentosTotales: 1,
        tiempoPromedioRespuesta: 350 + i * 20,
        latenciaMs: 350 + i * 20,
        anomalias: i === 7 ? ["ALERTA_LATENCIA_ALTA"] : [],
      },
      psicomotor: {
        p1: score >= 70 ? "A" : "B",
        p2: score >= 80 ? "A" : score >= 60 ? "B" : "C",
        p3: score >= 60 ? "A" : "B",
        p4: "A",
        p1_orientacion: score >= 70 ? "A" : "B",
        p2_ritmo: score >= 80 ? "A" : score >= 60 ? "B" : "C",
        p3_pulso: score >= 60 ? "A" : "B",
        p4_motricidad: "A",
      },
      socioafectivo: {
        s1: score >= 80 ? "A" : "B",
        s2: score >= 60 ? "A" : "B",
        s3: esPareja ? (score >= 70 ? "A" : "B") : "A",
        s4: "A",
        s1_precision: score >= 80 ? "A" : "B",
        s2_error: score >= 60 ? "A" : "B",
        s3_colaborativo: esPareja ? (score >= 70 ? "A" : "B") : "A",
        s4_frustracion: "A",
      },
    });
  }
  return lista;
}

export function crearPruebasAutomatizadas9no(): PayloadTelemetria[] {
  const lista: PayloadTelemetria[] = [];
  const baseTimestamp = 1771000000000; // Febrero 2027

  for (let i = 1; i <= 20; i++) {
    const numStr = String(i).padStart(2, "0");
    const estudianteNombre = `PRUEBASAUTOMAT${numStr} Estudiante 9no`;
    const score = i === 1 ? 100 : i === 2 ? 0 : Math.min(100, Math.max(25, (i * 17) % 100));
    const aciertos = Math.round((score / 100) * 10);
    const nivelLogro: "Inicial" | "Intermedio" | "Avanzado" =
      score >= 80 ? "Avanzado" : score <= 59 ? "Inicial" : "Intermedio";
    const seccion = secciones9no[i % secciones9no.length];
    const conexiones = Math.min(5, Math.max(1, Math.round((score / 100) * 5)));

    lista.push({
      idResultado: `res-9no-auto-${numStr}`,
      webAppId: "diagnostico_9no_modulo01_desconectado_offline_v3_2",
      webAppTitulo: "Diagnóstico 9°: Sistemas Embebidos (V3.2)",
      docenteId: "DOC-PRUEBA-001",
      docenteNombre: "Docente Prueba",
      docenteEmail: "prueba.docente1.docente.1@mep.go.cr",
      institucionNombre: "Liceo de Costa Rica",
      estudianteNombre: estudianteNombre,
      seccionOGrupo: seccion,
      nivel: "9°",
      puntaje: score,
      puntajeMaximo: 100,
      porcentaje: score,
      nivelLogro: nivelLogro,
      tiempoSegundos: 180 + i * 20,
      totalReactivos: 10,
      aciertos: aciertos,
      fallos: 10 - aciertos,
      timestamp: baseTimestamp + (20 + i) * 60000,
      fechaEntrega: "15/02/2027",
      horaEntrega: `09:${String(10 + i).padStart(2, "0")}:00`,
      fechaHoraRegistro: `15/02/2027, 09:${String(10 + i).padStart(2, "0")}`,
      estadoProgreso: "completado",
      tarjetas: "3 org.",
      puertos: `${conexiones}/5 OK`,
      telemetria: {
        intentosTotales: 1,
        tiempoPromedioRespuesta: 400 + i * 15,
        latenciaMs: 400 + i * 15,
        anomalias: i === 12 ? ["ALERTA_CORTOCIRCUITO_REITERADO"] : [],
      },
      psicomotor: {
        p1: score >= 70 ? "A" : "B",
        p2: score >= 80 ? "A" : "B",
        p3: conexiones >= 4 ? "A" : "B",
        p4: score >= 60 ? "A" : "B",
        p5: "A",
        p6: score >= 75 ? "A" : "B",
        p1_herramientas: score >= 70 ? "Logrado" : "En Proceso",
        p2_conexion_segura: score >= 80 ? "Logrado" : "En Proceso",
        p3_protoboard: conexiones >= 4 ? "Logrado" : "En Proceso",
        p4_diagramas: score >= 60 ? "Logrado" : "En Proceso",
        p5_orden: "Logrado",
        p6_autonomia: score >= 75 ? "Logrado" : "En Proceso",
      },
      socioafectivo: {
        s1: score >= 80 ? "A" : "B",
        s2: score >= 60 ? "A" : "B",
        s3: score >= 70 ? "A" : "B",
        s4: "A",
        s1_colaborativo: "Logrado",
        s2_seguridad: "Logrado",
        s3_cuidado_equipo: "Logrado",
        s4_perseverancia: score >= 50 ? "Logrado" : "En Proceso",
        s5_etica: "Logrado",
        s6_comunicacion: "Logrado",
        s7_puntualidad: "Logrado",
      },
    });
  }
  return lista;
}

export const PRUEBAS_AUTOMATIZADAS_7MO = crearPruebasAutomatizadas7mo();
export const PRUEBAS_AUTOMATIZADAS_9NO = crearPruebasAutomatizadas9no();
export const TODAS_LAS_PRUEBAS_AUTOMATIZADAS = [
  ...PRUEBAS_AUTOMATIZADAS_7MO,
  ...PRUEBAS_AUTOMATIZADAS_9NO,
];
