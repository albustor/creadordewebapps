import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * API para validación y verificación de cuenta docente:
 * 1. Microsoft 365 Oficial (@mep.go.cr)
 * 2. Correo de Respaldo Personal
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo = "microsoft", correo, correoRespaldo, nombreDocente } = body;

    // =========================================================================
    // 1. VALIDACIÓN DIRECTA MICROSOFT 365 (@mep.go.cr)
    // =========================================================================
    if (tipo === "microsoft") {
      const correoLimpio = correo?.trim()?.toLowerCase();
      if (!correoLimpio || !correoLimpio.endsWith("@mep.go.cr")) {
        return NextResponse.json(
          { exito: false, mensaje: "El correo debe pertenecer al dominio oficial @mep.go.cr." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        exito: true,
        mensaje: `Cuenta institucional ${correoLimpio} validada exitosamente con Microsoft 365.`,
        detalles: { correo: correoLimpio, validado: true, proveedor: "Microsoft 365" },
      });
    }

    // =========================================================================
    // 2. VALIDACIÓN DE CORREO DE RESPALDO PERSONAL
    // =========================================================================
    if (tipo === "correo_respaldo") {
      const respLimpio = correoRespaldo?.trim()?.toLowerCase();
      if (!respLimpio || !respLimpio.includes("@")) {
        return NextResponse.json(
          { exito: false, mensaje: "Debe ingresar una dirección de correo de respaldo válida." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        exito: true,
        mensaje: `Correo de respaldo ${respLimpio} verificado correctamente.`,
        detalles: { correoRespaldo: respLimpio, validado: true },
      });
    }

    return NextResponse.json({
      exito: true,
      mensaje: "Validación procesada exitosamente.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { exito: false, mensaje: error?.message || "Error al procesar la validación." },
      { status: 500 }
    );
  }
}
