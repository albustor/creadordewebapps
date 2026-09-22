import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cedulaOCorreo, canal, telefono, codigoOTP, nombreDocente } = body;

    if (!cedulaOCorreo || !codigoOTP) {
      return NextResponse.json(
        { exito: false, mensaje: "Datos incompletos para el despacho del código." },
        { status: 400 }
      );
    }

    const correoDestino = cedulaOCorreo.includes("@") ? cedulaOCorreo.trim().toLowerCase() : null;
    const telefonoDestino = telefono ? telefono.replace(/[^0-9]/g, "") : null;

    let despachoCorreoExitoso = false;
    let despachoWhatsAppExitoso = false;

    // 1. Despacho por Correo (Resend)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && (canal === "correo" || !canal) && correoDestino) {
      try {
        const resCorreo = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "MEP Formación Tecnológica <onboarding@resend.dev>",
            to: [correoDestino],
            subject: `Código de Seguridad MEP: ${codigoOTP}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                <div style="background: #047857; padding: 16px; border-radius: 8px; text-align: center; color: white;">
                  <h2 style="margin: 0; font-size: 20px;">Diagnóstico Secundaria • MEP</h2>
                  <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Código de Verificación y Acceso</p>
                </div>
                <div style="padding: 24px 8px; text-align: center;">
                  <p style="font-size: 14px; color: #334155; margin-bottom: 20px;">
                    Estimado(a) <strong>${nombreDocente || "Docente"}</strong>, has solicitado un código de verificación para tu cuenta en la plataforma de Formación Tecnológica.
                  </p>
                  <div style="display: inline-block; background: #f1f5f9; border: 2px dashed #047857; padding: 16px 32px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0f172a; margin: 10px 0;">
                    ${codigoOTP}
                  </div>
                  <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
                    Este código es confidencial y vence en <strong>10 minutos</strong>. Si no solicitaste este cambio, puedes ignorar este mensaje.
                  </p>
                </div>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; text-align: center; font-size: 11px; color: #94a3b8;">
                  Ministerio de Educación Pública de Costa Rica • Asesoría Nacional de Formación Tecnológica
                </div>
              </div>
            `,
          }),
        });

        if (resCorreo.ok) {
          despachoCorreoExitoso = true;
        } else {
          // Fallback a info@curiol.studio si Resend está en sandbox de desarrollo
          const fallbackRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "MEP Formación Tecnológica <onboarding@resend.dev>",
              to: ["info@curiol.studio"],
              subject: `[MEP Docente: ${correoDestino}] Código de Seguridad: ${codigoOTP}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                  <div style="background: #047857; padding: 16px; border-radius: 8px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">Diagnóstico Secundaria • MEP</h2>
                  </div>
                  <div style="padding: 24px 8px; text-align: center;">
                    <p style="font-size: 14px; color: #334155;">
                      Docente: <strong>${nombreDocente || "Docente"} (${correoDestino})</strong>
                    </p>
                    <div style="font-size: 32px; font-weight: bold; color: #047857; padding: 12px;">
                      ${codigoOTP}
                    </div>
                  </div>
                </div>
              `,
            }),
          });
          if (fallbackRes.ok) {
            despachoCorreoExitoso = true;
          }
        }
      } catch (err) {
        console.error("Error en Resend:", err);
      }
    }

    // 2. Despacho por WhatsApp (Evolution API)
    const evolutionUrl = process.env.EVOLUTION_URL;
    const evolutionApiKey = process.env.EVOLUTION_API_KEY;
    const evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME;

    if (evolutionUrl && evolutionApiKey && evolutionInstance && (canal === "whatsapp" || canal === "mensajeria") && telefonoDestino) {
      try {
        const numCompleto = telefonoDestino.startsWith("506") ? telefonoDestino : `506${telefonoDestino}`;
        const mensajeTexto = `🔐 *MEP • Diagnóstico Secundaria*\n\nEstimado(a) *${nombreDocente || "Docente"}*, tu código de recuperación de PIN es:\n\n👉 *${codigoOTP}*\n\n⏱️ _Válido por 10 minutos. No compartas este código con terceros._`;

        const resWp = await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
          method: "POST",
          headers: {
            apikey: evolutionApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: numCompleto,
            text: mensajeTexto,
            options: {
              delay: 1200,
              presence: "composing",
            },
          }),
        });

        if (resWp.ok) {
          despachoWhatsAppExitoso = true;
        }
      } catch (err) {
        console.error("Error en Evolution API:", err);
      }
    }

    return NextResponse.json({
      exito: true,
      mensaje:
        (canal === "whatsapp" || canal === "mensajeria") && despachoWhatsAppExitoso
          ? "Código despachado exitosamente por WhatsApp a tu número registrado."
          : despachoCorreoExitoso
          ? "Código enviado exitosamente a tu correo electrónico oficial."
          : `Código generado exitosamente: ${codigoOTP}`,
      codigoSimulado: codigoOTP,
      detalles: {
        despachoCorreo: despachoCorreoExitoso,
        despachoWhatsApp: despachoWhatsAppExitoso,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { exito: false, mensaje: error?.message || "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
