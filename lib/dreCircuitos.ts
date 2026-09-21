// ============================================================================
// CATÁLOGO DE DIRECCIONES REGIONALES DE EDUCACIÓN (DRE) - COSTA RICA
// Recurso de apoyo pedagógico para Formación Tecnológica (Dimensión 1)
// ============================================================================

export interface DREInfo {
  codigo: string;
  nombre: string;
  provincia: string;
  circuitos: string[];
}

export const LISTA_DRE_MEP: DREInfo[] = [
  {
    codigo: "DRE-NACIONAL",
    nombre: "Asesoría de Formación Tecnológica",
    provincia: "Nivel Nacional",
    circuitos: ["Nivel Nacional / Ámbito General"],
  },
  {
    codigo: "DRE-01",
    nombre: "San José Central",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06"],
  },
  {
    codigo: "DRE-02",
    nombre: "San José Norte",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-03",
    nombre: "San José Oeste",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07"],
  },
  {
    codigo: "DRE-04",
    nombre: "Alajuela",
    provincia: "Alajuela",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07", "Circuito 08", "Circuito 09", "Circuito 10"],
  },
  {
    codigo: "DRE-05",
    nombre: "Cartago",
    provincia: "Cartago",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07"],
  },
  {
    codigo: "DRE-06",
    nombre: "Heredia",
    provincia: "Heredia",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07"],
  },
  {
    codigo: "DRE-07",
    nombre: "Liberia",
    provincia: "Guanacaste",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-08",
    nombre: "Nicoya",
    provincia: "Guanacaste",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06"],
  },
  {
    codigo: "DRE-09",
    nombre: "Santa Cruz",
    provincia: "Guanacaste",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04"],
  },
  {
    codigo: "DRE-10",
    nombre: "Cañas",
    provincia: "Guanacaste",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-11",
    nombre: "Puntarenas",
    provincia: "Puntarenas",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06"],
  },
  {
    codigo: "DRE-12",
    nombre: "Aguirre (Quepos)",
    provincia: "Puntarenas",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04"],
  },
  {
    codigo: "DRE-13",
    nombre: "Grande de Térraba",
    provincia: "Puntarenas",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06"],
  },
  {
    codigo: "DRE-14",
    nombre: "Coto",
    provincia: "Puntarenas",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-15",
    nombre: "Pérez Zeledón",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07", "Circuito 08", "Circuito 09"],
  },
  {
    codigo: "DRE-16",
    nombre: "Limón",
    provincia: "Limón",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-17",
    nombre: "Guápiles (Pococí)",
    provincia: "Limón",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07"],
  },
  {
    codigo: "DRE-18",
    nombre: "Sulá (Talamanca)",
    provincia: "Limón",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03"],
  },
  {
    codigo: "DRE-19",
    nombre: "San Carlos",
    provincia: "Alajuela",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07", "Circuito 08"],
  },
  {
    codigo: "DRE-20",
    nombre: "Zona Norte-Norte (Upala/Guatuso/Los Chiles)",
    provincia: "Alajuela",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-21",
    nombre: "Occidente (San Ramón)",
    provincia: "Alajuela",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07"],
  },
  {
    codigo: "DRE-22",
    nombre: "Desamparados",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05", "Circuito 06", "Circuito 07"],
  },
  {
    codigo: "DRE-23",
    nombre: "Puriscal",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-24",
    nombre: "Los Santos",
    provincia: "San José",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03"],
  },
  {
    codigo: "DRE-25",
    nombre: "Turrialba",
    provincia: "Cartago",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04", "Circuito 05"],
  },
  {
    codigo: "DRE-26",
    nombre: "Sarapiquí",
    provincia: "Heredia",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03", "Circuito 04"],
  },
  {
    codigo: "DRE-27",
    nombre: "Peninsular (Paquera/Lepanto/Cóbano)",
    provincia: "Puntarenas",
    circuitos: ["Circuito 01", "Circuito 02", "Circuito 03"],
  },
];
