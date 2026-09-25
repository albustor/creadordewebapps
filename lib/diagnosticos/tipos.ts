// ============================================================================
// TIPOS Y MODELOS DE DATOS PARA DIAGNÓSTICOS MULTINIVEL (III CICLO MEP)
// Aislamiento estricto por nivel: 7° Año, 8° Año y 9° Año
// ============================================================================

export type NivelEducativo = "7°" | "8°" | "9°";

export type EscalaSocioafectiva = "Siempre" | "A veces" | "En proceso";
export type EscalaPsicomotora = "Logrado" | "En desarrollo" | "Requiere apoyo";
export type EstadoEvidencia = "Evidenciado" | "Requiere fortalecimiento";

export interface OpcionReactivo {
  id: string; // 'a', 'b', 'c', 'd'
  texto: string;
  svgIcono?: string; // SVG en Base64 o markup directo
}

export interface ParejaAsociacion {
  id: string;
  elementoColumnaA: string;
  opcionCorrectaColumnaB: string;
  opcionesDisponibles: Array<{ id: string; texto: string }>;
}

export interface ReactivoDiagnostico {
  id: number;
  subarea: string;
  tipo: "asociacion" | "seleccion_unica" | "pseudocodigo" | "desafio_logico";
  enunciado: string;
  pseudocodigo?: string;
  parejasAsociacion?: ParejaAsociacion[];
  opciones?: OpcionReactivo[];
  respuestaCorrecta: string; // 'a', 'b', 'c', 'd' o código de verificación
  indicadorId: number;
  indicadorTexto: string;
  decisionPedagogicaEvidenciado: string;
  decisionPedagogicaFortalecer: string;
  puntos: number;
}

export interface CriterioSocioafectivoDocente {
  id: string;
  nombreCriterio: string;
  descripcion: string;
  escala: EscalaSocioafectiva;
}

export interface CriterioPsicomotorDocente {
  id: string;
  nombreCriterio: string;
  descripcion: string;
  escala: EscalaPsicomotora;
}

export interface SubareaDiagnostica {
  id: string;
  areaCurricular?: string;
  nombre: string;
  descripcion: string;
  itemsIds: number[];
  pesoTotal: number;
}

export interface ConfiguracionDiagnosticoNivel {
  nivel: NivelEducativo;
  tituloOficial: string;
  asignatura: string;
  modulo: string;
  descripcion: string;
  totalReactivosCognitivos: number;
  subareas: SubareaDiagnostica[];
  reactivos: ReactivoDiagnostico[];
  criteriosSocioafectivos: Array<{
    id: string;
    nombre: string;
    descripcion: string;
  }>;
  criteriosPsicomotores: Array<{
    id: string;
    nombre: string;
    descripcion: string;
  }>;
  seccionesSugeridas: string[];
  tiempoSugeridoMinutos: number;
}
