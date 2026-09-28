// ============================================================================
// CATÁLOGO CENTRALIZADO DE DIAGNÓSTICOS MULTINIVEL (III CICLO MEP)
// Provee acceso fuertemente tipado a los diagnósticos de 7°, 8° y 9° Año
// ============================================================================

import { NivelEducativo, ConfiguracionDiagnosticoNivel } from "./tipos";
import { DIAGNOSTICO_7MO_DATA } from "./setimoData";
import { DIAGNOSTICO_8VO_DATA } from "./octavoData";
import { DIAGNOSTICO_9NO_DATA } from "./novenoData";

export * from "./tipos";
export { DIAGNOSTICO_7MO_DATA } from "./setimoData";
export { DIAGNOSTICO_8VO_DATA } from "./octavoData";
export { DIAGNOSTICO_9NO_DATA } from "./novenoData";

export const DIAGNOSTICOS_CATALOGO: Record<NivelEducativo, ConfiguracionDiagnosticoNivel> = {
  "7°": DIAGNOSTICO_7MO_DATA,
  "8°": DIAGNOSTICO_8VO_DATA,
  "9°": DIAGNOSTICO_9NO_DATA
};

export const LISTA_NIVELES_III_CICLO: NivelEducativo[] = ["7°", "8°", "9°"];

/**
 * Obtiene la configuración completa de un nivel
 */
export function obtenerDiagnosticoPorNivel(nivel: NivelEducativo): ConfiguracionDiagnosticoNivel {
  return DIAGNOSTICOS_CATALOGO[nivel] || DIAGNOSTICO_8VO_DATA;
}

/**
 * Obtiene las secciones sugeridas según el nivel
 */
export function obtenerSeccionesPorNivel(nivel: NivelEducativo): string[] {
  const prefijo = nivel === "7°" ? "7" : nivel === "8°" ? "8" : "9";
  return Array.from({ length: 15 }, (_, i) => `${prefijo}-${i + 1}`);
}
