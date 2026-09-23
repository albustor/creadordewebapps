import { NextRequest, NextResponse } from "next/server";

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
    fechaSolicitud: "2026-01-15T08:00:00.000Z",
    fechaAprobacion: "2026-01-15T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 18,
    pin: "2617",
  },
  {
    id: "ASESOR-FT-8841",
    nombreCompleto: "Allan Morera Araya",
    correoInstitucional: "allan.morera.araya@mep.go.cr",
    cedula: "2-0481-0073",
    telefono: "+506 8888-7777",
    dreCodigo: "DRE-NACIONAL",
    dreNombre: "Asesoría de Formación Tecnológica",
    circuito: "Nivel Nacional / Ámbito General",
    institucionNombre: "Asesoría Nacional de Formación Tecnológica (III Ciclo)",
    rol: "Asesor Nacional",
    estado: "Aprobado",
    fechaSolicitud: "2026-01-15T08:00:00.000Z",
    fechaAprobacion: "2026-01-15T08:00:00.000Z",
    aprobadoPor: "ADMINISTRADOR PRINCIPAL",
    webAppsCreadas: 12,
    pin: "7319",
  },
  {
    id: "ASE-DRE03-102",
    nombreCompleto: "MSc. Carlos Quesada Murillo",
    correoInstitucional: "carlos.quesada.murillo@mep.go.cr",
    cedula: "2-0456-0789",
    telefono: "+506 8765-4321",
    dreCodigo: "DRE-03",
    dreNombre: "Cartago",
    circuito: "Circuito 02",
    institucionNombre: "Asesoría Regional de Tecnología Educativa",
    rol: "Asesor Regional",
    estado: "Pendiente",
    fechaSolicitud: "2026-09-18T14:30:00.000Z",
    webAppsCreadas: 4,
  },
  {
    id: "ASE-DRE07-551",
    nombreCompleto: "Licda. Marielos Valverde Soto",
    correoInstitucional: "marielos.valverde.soto@mep.go.cr",
    cedula: "1-1155-0888",
    telefono: "+506 8333-2211",
    dreCodigo: "DRE-07",
    dreNombre: "Alajuela",
    circuito: "Circuito 04",
    institucionNombre: "Asesoría Nacional de Formación Tecnológica",
    rol: "Asesor Nacional",
    estado: "Pendiente",
    fechaSolicitud: "2026-09-19T08:15:00.000Z",
    webAppsCreadas: 6,
  },
  {
    id: "DOC-DRE01-304",
    nombreCompleto: "Prof. Laura González Vargas",
    correoInstitucional: "laura.gonzalez.vargas@mep.go.cr",
    cedula: "1-1345-0987",
    telefono: "+506 8901-2345",
    dreCodigo: "DRE-01",
    dreNombre: "San José Central",
    circuito: "Circuito 01",
    institucionNombre: "Liceo de Costa Rica",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2026-02-10T09:00:00.000Z",
    fechaAprobacion: "2026-02-10T10:00:00.000Z",
    aprobadoPor: "alberto.bustos.ortega@mep.go.cr",
    webAppsCreadas: 5,
  },
  {
    id: "DOC-DRE04-892",
    nombreCompleto: "Prof. Esteban Rojas Méndez",
    correoInstitucional: "esteban.rojas.mendez@mep.go.cr",
    cedula: "4-0198-0765",
    telefono: "+506 8456-7890",
    dreCodigo: "DRE-04",
    dreNombre: "Heredia",
    circuito: "Circuito 03",
    institucionNombre: "Colegio Técnico Profesional de Heredia",
    rol: "Docente",
    estado: "Aprobado",
    fechaSolicitud: "2026-03-01T11:20:00.000Z",
    fechaAprobacion: "2026-03-01T11:45:00.000Z",
    aprobadoPor: "alberto.bustos.ortega@mep.go.cr",
    webAppsCreadas: 8,
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
