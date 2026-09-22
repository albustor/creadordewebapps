/**
 * Utilidades para normalización y formateo de Cédulas Costarricenses (Formato Oficial MEP / TSE de 9 dígitos con ceros).
 * Estructura estándar: P-TTTT-AAAA (1 dígito de provincia, 4 de tomo con ceros, 4 de asiento con ceros).
 * Ejemplo: "503050179" -> "5-0305-0179"
 */

export function formatearCedulaCR(valor: string): string {
  if (!valor) return "";
  const soloDigitos = valor.replace(/\D/g, "");

  // Si tiene 9 dígitos exactos (formato estándar costarricense)
  if (soloDigitos.length === 9) {
    const p = soloDigitos.slice(0, 1);
    const t = soloDigitos.slice(1, 5);
    const a = soloDigitos.slice(5, 9);
    return `${p}-${t}-${a}`;
  }

  // Si viene con guiones o menos dígitos pero separados: ej. "5-305-179"
  if (valor.includes("-")) {
    const partes = valor.split("-").map((p) => p.replace(/\D/g, "")).filter(Boolean);
    if (partes.length === 3) {
      const p = partes[0];
      const t = partes[1].padStart(4, "0").slice(0, 4);
      const a = partes[2].padStart(4, "0").slice(0, 4);
      return `${p}-${t}-${a}`;
    }
  }

  // Si tiene entre 7 y 8 dígitos, intentar autocompletar con ceros en tomo y asiento
  if (soloDigitos.length === 8) {
    // Ej: 5-305-0179 -> 503050179
    const p = soloDigitos.slice(0, 1);
    const t = soloDigitos.slice(1, 4).padStart(4, "0");
    const a = soloDigitos.slice(4, 8);
    return `${p}-${t}-${a}`;
  }

  if (soloDigitos.length === 7) {
    const p = soloDigitos.slice(0, 1);
    const t = soloDigitos.slice(1, 4).padStart(4, "0");
    const a = soloDigitos.slice(4, 7).padStart(4, "0");
    return `${p}-${t}-${a}`;
  }

  return valor.trim();
}

/**
 * Normaliza una cédula extrayendo solo dígitos para comparaciones estrictas en base de datos.
 */
export function normalizarCedulaParaComparar(valor: string): string {
  if (!valor) return "";
  const soloDigitos = valor.replace(/\D/g, "");
  
  // Si viene con guiones incompletos ej "5-305-179", expandir con ceros
  if (valor.includes("-")) {
    const partes = valor.split("-").map((p) => p.replace(/\D/g, "")).filter(Boolean);
    if (partes.length === 3) {
      return `${partes[0]}${partes[1].padStart(4, "0")}${partes[2].padStart(4, "0")}`;
    }
  }

  return soloDigitos;
}

/**
 * Valida si una cédula cumple con el estándar de 9 dígitos de Costa Rica.
 */
export function validarCedulaCR(valor: string): boolean {
  const norm = normalizarCedulaParaComparar(valor);
  return norm.length === 9 && /^[1-9]\d{8}$/.test(norm);
}
