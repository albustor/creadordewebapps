import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface UsuarioDocente {
  id: string;
  nombreCompleto: string;
  correoInstitucional: string;
  cedula: string;
  telefono: string;
  dreCodigo: string;
  dreNombre: string;
  circuito: string;
  institucionNombre: string;
  rol: "Super Administrador" | "Asesor Nacional" | "Asesor de Enseñanza Secundaria" | "Asesor Regional" | "Docente" | "Coordinador";
  estado: "Aprobado" | "Pendiente" | "Rechazado";
  fechaSolicitud: string;
  fechaAprobacion?: string;
  aprobadoPor?: string;
  webAppsCreadas: number;
  pin?: string;
  centrosEducativos?: any[];
}

// Base de datos en memoria para persistencia durante la sesión del servidor
let USUARIOS_DB: UsuarioDocente[] = [
  {
    id: "SUPERADMIN-01",
    nombreCompleto: "Alberto Bustos Ortega",
    correoInstitucional: "alberto.bustos.ortega@mep.go.cr",
    cedula: "5-0305-0179",
    telefono: "+506 8888-9999",
    dreCodigo: "DRE-NACIONAL",
    dreNombre: "Asesoría de Formación Tecnológica",
    circuito: "Nivel Nacional / Ámbito General",
    institucionNombre: "Asesoría de Formación Tecnológica (Dimensión 1)",
    rol: "Super Administrador",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-15T08:00:00.000Z",
    fechaAprobacion: "2027-01-15T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 18,
    pin: "2617",
  },
  {
    id: "DOC-PRUEBA-001",
    nombreCompleto: "Docente Prueba San José",
    correoInstitucional: "pruebadocente1@mep.go.cr",
    cedula: "0-0000-0001",
    telefono: "+506 0000-0001",
    dreCodigo: "DRE-01",
    dreNombre: "San José Central",
    circuito: "Circuito 01",
    institucionNombre: "Liceo de Costa Rica / Colegio Superior de Señoritas / Liceo Rodrigo Facio Brenes",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-20T08:00:00.000Z",
    fechaAprobacion: "2027-01-20T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 3,
    pin: "1111",
    centrosEducativos: [
      {
        id: "CENTRO-P1-01",
        nombre: "Liceo de Costa Rica",
        dreCodigo: "DRE-01",
        dreNombre: "San José Central",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-LCR-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4"] },
        ],
      },
      {
        id: "CENTRO-P1-02",
        nombre: "Colegio Superior de Señoritas",
        dreCodigo: "DRE-01",
        dreNombre: "San José Central",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CSS-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2", "8-3"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
      {
        id: "CENTRO-P1-03",
        nombre: "Liceo Rodrigo Facio Brenes",
        dreCodigo: "DRE-01",
        dreNombre: "San José Central",
        circuito: "Circuito 03",
        codigoPresupuestario: "MEP-LRF-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-4", "7-5", "7-6"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["8-3", "8-4"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-4", "9-5"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-002",
    nombreCompleto: "Docente Prueba Alajuela",
    correoInstitucional: "pruebadocente2@mep.go.cr",
    cedula: "0-0000-0002",
    telefono: "+506 0000-0002",
    dreCodigo: "DRE-04",
    dreNombre: "Alajuela",
    circuito: "Circuito 02",
    institucionNombre: "Liceo Experimental Bilingüe de Alajuela / CTP de Heredia",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-20T08:00:00.000Z",
    fechaAprobacion: "2027-01-20T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 2,
    pin: "2222",
    centrosEducativos: [
      {
        id: "CENTRO-P2-01",
        nombre: "Liceo Experimental Bilingüe de Alajuela",
        dreCodigo: "DRE-04",
        dreNombre: "Alajuela",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-LEBA-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2", "7-3", "7-4"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
      {
        id: "CENTRO-P2-02",
        nombre: "Colegio Técnico Profesional de Heredia",
        dreCodigo: "DRE-05",
        dreNombre: "Heredia",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-CTPH-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 8, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 8, seccionesAtendidasDocente: ["8-1", "8-2", "8-3", "8-4"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 10, seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4", "9-5"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-003",
    nombreCompleto: "Docente Prueba Cartago",
    correoInstitucional: "pruebadocente3@mep.go.cr",
    cedula: "0-0000-0003",
    telefono: "+506 0000-0003",
    dreCodigo: "DRE-03",
    dreNombre: "Cartago",
    circuito: "Circuito 01",
    institucionNombre: "Colegio San Luis Gonzaga / Colegio Vicente Lachner Sandoval",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-22T08:00:00.000Z",
    fechaAprobacion: "2027-01-22T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 4,
    pin: "3333",
    centrosEducativos: [
      {
        id: "CENTRO-P3-01",
        nombre: "Colegio San Luis Gonzaga",
        dreCodigo: "DRE-03",
        dreNombre: "Cartago",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-CSLG-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 8, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["8-1", "8-2", "8-3"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4"] },
        ],
      },
      {
        id: "CENTRO-P3-02",
        nombre: "Colegio Vicente Lachner Sandoval",
        dreCodigo: "DRE-03",
        dreNombre: "Cartago",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CVLS-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-004",
    nombreCompleto: "Docente Prueba Heredia",
    correoInstitucional: "pruebadocente4@mep.go.cr",
    cedula: "0-0000-0004",
    telefono: "+506 0000-0004",
    dreCodigo: "DRE-05",
    dreNombre: "Heredia",
    circuito: "Circuito 01",
    institucionNombre: "Liceo de Heredia / CTP Mercedes Norte",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-22T08:00:00.000Z",
    fechaAprobacion: "2027-01-22T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 2,
    pin: "4444",
    centrosEducativos: [
      {
        id: "CENTRO-P4-01",
        nombre: "Liceo de Heredia",
        dreCodigo: "DRE-05",
        dreNombre: "Heredia",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-LH-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
      {
        id: "CENTRO-P4-02",
        nombre: "CTP Mercedes Norte",
        dreCodigo: "DRE-05",
        dreNombre: "Heredia",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CTPMN-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-005",
    nombreCompleto: "Docente Prueba Guanacaste",
    correoInstitucional: "pruebadocente5@mep.go.cr",
    cedula: "0-0000-0005",
    telefono: "+506 0000-0005",
    dreCodigo: "DRE-07",
    dreNombre: "Liberia",
    circuito: "Circuito 01",
    institucionNombre: "Instituto de Guanacaste / Liceo Laboratorio de Liberia",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-23T08:00:00.000Z",
    fechaAprobacion: "2027-01-23T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 1,
    pin: "5555",
    centrosEducativos: [
      {
        id: "CENTRO-P5-01",
        nombre: "Instituto de Guanacaste",
        dreCodigo: "DRE-07",
        dreNombre: "Liberia",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-IG-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2", "8-3"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
      {
        id: "CENTRO-P5-02",
        nombre: "Liceo Laboratorio de Liberia",
        dreCodigo: "DRE-07",
        dreNombre: "Liberia",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-LLL-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-006",
    nombreCompleto: "Docente Prueba Puntarenas",
    correoInstitucional: "pruebadocente6@mep.go.cr",
    cedula: "0-0000-0006",
    telefono: "+506 0000-0006",
    dreCodigo: "DRE-09",
    dreNombre: "Puntarenas",
    circuito: "Circuito 01",
    institucionNombre: "Liceo José Martí / CTP de Puntarenas",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-23T08:00:00.000Z",
    fechaAprobacion: "2027-01-23T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 3,
    pin: "6666",
    centrosEducativos: [
      {
        id: "CENTRO-P6-01",
        nombre: "Liceo José Martí",
        dreCodigo: "DRE-09",
        dreNombre: "Puntarenas",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-LJM-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
      {
        id: "CENTRO-P6-02",
        nombre: "Colegio Técnico Profesional de Puntarenas",
        dreCodigo: "DRE-09",
        dreNombre: "Puntarenas",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CTPP-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-007",
    nombreCompleto: "Docente Prueba Limón",
    correoInstitucional: "pruebadocente7@mep.go.cr",
    cedula: "0-0000-0007",
    telefono: "+506 0000-0007",
    dreCodigo: "DRE-11",
    dreNombre: "Limón",
    circuito: "Circuito 01",
    institucionNombre: "Liceo Nuevo de Limón / CTP de Limón",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-24T08:00:00.000Z",
    fechaAprobacion: "2027-01-24T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 2,
    pin: "7777",
    centrosEducativos: [
      {
        id: "CENTRO-P7-01",
        nombre: "Liceo Nuevo de Limón",
        dreCodigo: "DRE-11",
        dreNombre: "Limón",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-LNL-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2", "8-3"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
      {
        id: "CENTRO-P7-02",
        nombre: "Colegio Técnico Profesional de Limón",
        dreCodigo: "DRE-11",
        dreNombre: "Limón",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CTPL-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-008",
    nombreCompleto: "Docente Prueba Pérez Zeledón",
    correoInstitucional: "pruebadocente8@mep.go.cr",
    cedula: "0-0000-0008",
    telefono: "+506 0000-0008",
    dreCodigo: "DRE-02",
    dreNombre: "Pérez Zeledón",
    circuito: "Circuito 01",
    institucionNombre: "Liceo UNESCO / CTP General Viejo",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-24T08:00:00.000Z",
    fechaAprobacion: "2027-01-24T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 2,
    pin: "8888",
    centrosEducativos: [
      {
        id: "CENTRO-P8-01",
        nombre: "Liceo UNESCO",
        dreCodigo: "DRE-02",
        dreNombre: "Pérez Zeledón",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-LUN-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
      {
        id: "CENTRO-P8-02",
        nombre: "CTP General Viejo",
        dreCodigo: "DRE-02",
        dreNombre: "Pérez Zeledón",
        circuito: "Circuito 03",
        codigoPresupuestario: "MEP-CTPGV-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-009",
    nombreCompleto: "Docente Prueba San Carlos",
    correoInstitucional: "pruebadocente9@mep.go.cr",
    cedula: "0-0000-0009",
    telefono: "+506 0000-0009",
    dreCodigo: "DRE-14",
    dreNombre: "San Carlos",
    circuito: "Circuito 01",
    institucionNombre: "Liceo San Carlos / CTP de San Carlos",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-25T08:00:00.000Z",
    fechaAprobacion: "2027-01-25T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 1,
    pin: "9999",
    centrosEducativos: [
      {
        id: "CENTRO-P9-01",
        nombre: "Liceo San Carlos",
        dreCodigo: "DRE-14",
        dreNombre: "San Carlos",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-LSC-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 6, seccionesAtendidasDocente: ["9-1", "9-2", "9-3"] },
        ],
      },
      {
        id: "CENTRO-P9-02",
        nombre: "CTP de San Carlos",
        dreCodigo: "DRE-14",
        dreNombre: "San Carlos",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CTPSC-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
    ],
  },
  {
    id: "DOC-PRUEBA-010",
    nombreCompleto: "Docente Prueba Occidente",
    correoInstitucional: "pruebadocente10@mep.go.cr",
    cedula: "0-0000-0010",
    telefono: "+506 0000-0010",
    dreCodigo: "DRE-06",
    dreNombre: "Occidente",
    circuito: "Circuito 01",
    institucionNombre: "Instituto Julio Acosta García / CTP de San Ramón",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2027-01-25T08:00:00.000Z",
    fechaAprobacion: "2027-01-25T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 3,
    pin: "1010",
    centrosEducativos: [
      {
        id: "CENTRO-P10-01",
        nombre: "Instituto Julio Acosta García",
        dreCodigo: "DRE-06",
        dreNombre: "Occidente",
        circuito: "Circuito 01",
        codigoPresupuestario: "MEP-IJAG-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 8, seccionesAtendidasDocente: ["7-1", "7-2", "7-3"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["8-1", "8-2", "8-3"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 7, seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4"] },
        ],
      },
      {
        id: "CENTRO-P10-02",
        nombre: "CTP de San Ramón",
        dreCodigo: "DRE-06",
        dreNombre: "Occidente",
        circuito: "Circuito 02",
        codigoPresupuestario: "MEP-CTPSR-2027",
        desgloseNiveles: [
          { nivel: "7°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["7-1", "7-2"] },
          { nivel: "8°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["8-1", "8-2"] },
          { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2"] },
        ],
      },
    ],
  },
];

export interface EventoHistorico {
  id: string;
  fechaHora: string;
  tipoEvento: "APROBACION" | "RECHAZO" | "ELIMINACION" | "SUSPENSION" | "REACTIVACION" | "RESTABLECIMIENTO" | "REGISTRO";
  descripcion: string;
  usuarioAfectado: string;
  ejecutadoPor: string;
}

let HISTORICO_DB: EventoHistorico[] = [
  {
    id: "LOG-01",
    fechaHora: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    tipoEvento: "REGISTRO",
    descripcion: "Inicio de operaciones del sistema central de gobernanza y control de WebApps.",
    usuarioAfectado: "alberto.bustos.ortega@mep.go.cr",
    ejecutadoPor: "SISTEMA CENTRAL MEP",
  },
  {
    id: "LOG-02",
    fechaHora: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    tipoEvento: "APROBACION",
    descripcion: "Validación de credenciales para Docente en DRE San José Central.",
    usuarioAfectado: "laura.gonzalez.vargas@mep.go.cr",
    ejecutadoPor: "alberto.bustos.ortega@mep.go.cr",
  },
];

import fs from "fs";
import path from "path";
import os from "os";

const CACHE_USUARIOS_PATH = path.join(os.tmpdir(), "usuarios_docentes_cache.json");

function esUsuarioEliminado(correo?: string, nombre?: string): boolean {
  const c = (correo || "").toLowerCase().trim();
  const n = (nombre || "").toLowerCase().trim();
  return c.includes("augrey.bermudez") || c.includes("augrey") || n.includes("augrey");
}

function cargarUsuariosServidor() {
  try {
    if (fs.existsSync(CACHE_USUARIOS_PATH)) {
      const data = fs.readFileSync(CACHE_USUARIOS_PATH, "utf8");
      if (data && data.trim().length > 0) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          USUARIOS_DB = parsed.filter(
            (u) => !esUsuarioEliminado(u.correoInstitucional, u.nombreCompleto)
          );
        }
      }
    }
  } catch (e) {}
  USUARIOS_DB = USUARIOS_DB.filter(
    (u) => !esUsuarioEliminado(u.correoInstitucional, u.nombreCompleto)
  );
}

function guardarUsuariosServidor() {
  try {
    USUARIOS_DB = USUARIOS_DB.filter(
      (u) => !esUsuarioEliminado(u.correoInstitucional, u.nombreCompleto)
    );
    const dir = path.dirname(CACHE_USUARIOS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_USUARIOS_PATH, JSON.stringify(USUARIOS_DB, null, 2), "utf8");
  } catch (e) {}
}

// Cargar al inicializar el módulo
try {
  cargarUsuariosServidor();
} catch (e) {}

export async function GET(req: NextRequest) {
  cargarUsuariosServidor();
  return NextResponse.json({
    success: true,
    superAdmin: "alberto.bustos.ortega@mep.go.cr",
    totalUsuarios: USUARIOS_DB.length,
    pendientes: USUARIOS_DB.filter((u) => u.estado === "Pendiente").length,
    aprobados: USUARIOS_DB.filter((u) => u.estado === "Aprobado").length,
    usuarios: USUARIOS_DB,
    historico: HISTORICO_DB,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accion, idUsuario, usuarioData, validadorCorreo, motivo } = body;

    // 1. Solicitud de registro
    if (accion === "solicitar_registro") {
      const correoLimpio = (usuarioData.correoInstitucional || "").toLowerCase().trim();
      const yaExiste = USUARIOS_DB.find((u) => u.correoInstitucional.toLowerCase().trim() === correoLimpio);

      if (yaExiste && !body.esActualizacionPropia) {
        return NextResponse.json({
          success: false,
          mensaje: `⚠️ El correo institucional ${correoLimpio} ya cuenta con un registro activo a nombre de ${yaExiste.nombreCompleto}. No se permite duplicar ni sobreescribir el usuario.`,
        }, { status: 400 });
      }

      // Bloqueo estricto: Nadie puede registrarse como Super Administrador
      const esAlberto = correoLimpio === "alberto.bustos.ortega@mep.go.cr";
      const esAllan = correoLimpio === "allan.morera.araya@mep.go.cr";
      const rolAsignado = esAlberto
        ? "Super Administrador"
        : esAllan
        ? "Asesor Nacional"
        : usuarioData.rol === "Super Administrador"
        ? "Asesor Nacional"
        : usuarioData.rol || "Docente";

      const nuevo: UsuarioDocente = {
        id: yaExiste?.id || (esAllan ? "ASESOR-FT-8841" : esAlberto ? "SUPERADMIN-01" : `USR-${Math.floor(1000 + Math.random() * 9000)}`),
        nombreCompleto: usuarioData.nombreCompleto || "Docente de Formación Tecnológica",
        correoInstitucional: correoLimpio,
        cedula: usuarioData.cedula || (esAllan ? "2-0481-0073" : "N/A"),
        telefono: usuarioData.telefono || (esAllan ? "+506 8888-7777" : "N/A"),
        dreCodigo: usuarioData.dreCodigo || "DRE-NACIONAL",
        dreNombre: usuarioData.dreNombre || "Asesoría de Formación Tecnológica",
        circuito: usuarioData.circuito || "Nivel Nacional / Ámbito General",
        institucionNombre: usuarioData.institucionNombre || "Asesoría Nacional de Formación Tecnológica",
        rol: rolAsignado,
        estado: (rolAsignado === "Docente" || esAlberto || esAllan) ? "Aprobado" : "Pendiente",
        fechaSolicitud: yaExiste?.fechaSolicitud || new Date().toISOString(),
        webAppsCreadas: yaExiste?.webAppsCreadas || 0,
        pin: usuarioData.pin || usuarioData.contrasena || (esAlberto ? "2617" : esAllan ? "7319" : undefined),
        centrosEducativos: usuarioData.centrosEducativos || yaExiste?.centrosEducativos || undefined,
      };

      USUARIOS_DB = [nuevo, ...USUARIOS_DB.filter((u) => u.correoInstitucional.toLowerCase().trim() !== correoLimpio)];

      HISTORICO_DB = [
        {
          id: `LOG-${Date.now()}`,
          fechaHora: new Date().toISOString(),
          tipoEvento: "REGISTRO",
          descripcion: `Nueva solicitud registrada con rol [${rolAsignado}]. Estado inicial: ${nuevo.estado}`,
          usuarioAfectado: nuevo.correoInstitucional,
          ejecutadoPor: "AUTORREGISTRO",
        },
        ...HISTORICO_DB,
      ];

      guardarUsuariosServidor();

      return NextResponse.json({
        success: true,
        mensaje: nuevo.estado === "Aprobado" 
          ? "Docente registrado con éxito." 
          : "Solicitud de asesoría enviada para validación del Administrador General.",
        usuario: nuevo,
      });
    }

    // Validación de seguridad estricta para acciones del Super Administrador
    const esValidadorAutorizado = validadorCorreo === "alberto.bustos.ortega@mep.go.cr";

    if (!esValidadorAutorizado) {
      return NextResponse.json(
        {
          success: false,
          error: "Acceso denegado: Solo el Administrador General (alberto.bustos.ortega@mep.go.cr) tiene autorización para ejecutar esta acción.",
        },
        { status: 403 }
      );
    }

    // 2. Aprobación / Rechazo
    if (accion === "aprobar" || accion === "rechazar") {
      let usuarioAfectado = "";
      USUARIOS_DB = USUARIOS_DB.map((u) => {
        if (u.id === idUsuario) {
          usuarioAfectado = u.correoInstitucional;
          return {
            ...u,
            estado: accion === "aprobar" ? "Aprobado" : "Rechazado",
            fechaAprobacion: new Date().toISOString(),
            aprobadoPor: validadorCorreo,
          };
        }
        return u;
      });

      HISTORICO_DB = [
        {
          id: `LOG-${Date.now()}`,
          fechaHora: new Date().toISOString(),
          tipoEvento: accion === "aprobar" ? "APROBACION" : "RECHAZO",
          descripcion: `Solicitud de asesoría ${accion === "aprobar" ? "APROBADA" : "RECHAZADA"}.`,
          usuarioAfectado: usuarioAfectado || idUsuario,
          ejecutadoPor: validadorCorreo,
        },
        ...HISTORICO_DB,
      ];

      guardarUsuariosServidor();

      return NextResponse.json({
        success: true,
        mensaje: `Solicitud ${accion === "aprobar" ? "aprobada" : "rechazada"} con éxito.`,
        usuarios: USUARIOS_DB,
        historico: HISTORICO_DB,
      });
    }

    // 3. Eliminar usuario
    if (accion === "eliminar") {
      const usuarioAEliminar = USUARIOS_DB.find((u) => u.id === idUsuario);
      if (usuarioAEliminar?.correoInstitucional === "alberto.bustos.ortega@mep.go.cr") {
        return NextResponse.json(
          { success: false, error: "No es posible eliminar la cuenta del Super Administrador Principal." },
          { status: 400 }
        );
      }

      USUARIOS_DB = USUARIOS_DB.filter((u) => u.id !== idUsuario);

      HISTORICO_DB = [
        {
          id: `LOG-${Date.now()}`,
          fechaHora: new Date().toISOString(),
          tipoEvento: "ELIMINACION",
          descripcion: `Cuenta eliminada del padrón activo. Motivo: ${motivo || "Decisión administrativa"}`,
          usuarioAfectado: usuarioAEliminar?.correoInstitucional || idUsuario,
          ejecutadoPor: validadorCorreo,
        },
        ...HISTORICO_DB,
      ];

      guardarUsuariosServidor();

      return NextResponse.json({
        success: true,
        mensaje: "Usuario eliminado del sistema correctamente.",
        usuarios: USUARIOS_DB,
        historico: HISTORICO_DB,
      });
    }

    // 4. Desactivar / Suspender
    if (accion === "desactivar" || accion === "reactivar") {
      let usuarioAfectado = "";
      USUARIOS_DB = USUARIOS_DB.map((u) => {
        if (u.id === idUsuario) {
          usuarioAfectado = u.correoInstitucional;
          return {
            ...u,
            estado: accion === "desactivar" ? "Rechazado" : "Aprobado",
          };
        }
        return u;
      });

      HISTORICO_DB = [
        {
          id: `LOG-${Date.now()}`,
          fechaHora: new Date().toISOString(),
          tipoEvento: accion === "desactivar" ? "SUSPENSION" : "REACTIVACION",
          descripcion: `Acceso ${accion === "desactivar" ? "SUSPENDIDO / DESACTIVADO" : "REACTIVADO"} por el Administrador General.`,
          usuarioAfectado: usuarioAfectado || idUsuario,
          ejecutadoPor: validadorCorreo,
        },
        ...HISTORICO_DB,
      ];

      guardarUsuariosServidor();

      return NextResponse.json({
        success: true,
        mensaje: `Usuario ${accion === "desactivar" ? "desactivado" : "reactivado"} con éxito.`,
        usuarios: USUARIOS_DB,
        historico: HISTORICO_DB,
      });
    }

    // 5. Restablecer credenciales / Rellenar datos
    if (accion === "restablecer") {
      let usuarioAfectado = "";
      USUARIOS_DB = USUARIOS_DB.map((u) => {
        if (u.id === idUsuario) {
          usuarioAfectado = u.correoInstitucional;
          return {
            ...u,
            ...usuarioData,
          };
        }
        return u;
      });

      HISTORICO_DB = [
        {
          id: `LOG-${Date.now()}`,
          fechaHora: new Date().toISOString(),
          tipoEvento: "RESTABLECIMIENTO",
          descripcion: "Datos de usuario y credenciales actualizadas por el Administrador General.",
          usuarioAfectado: usuarioAfectado || idUsuario,
          ejecutadoPor: validadorCorreo,
        },
        ...HISTORICO_DB,
      ];

      guardarUsuariosServidor();

      return NextResponse.json({
        success: true,
        mensaje: "Datos y credenciales del usuario actualizados con éxito.",
        usuarios: USUARIOS_DB,
        historico: HISTORICO_DB,
      });
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
