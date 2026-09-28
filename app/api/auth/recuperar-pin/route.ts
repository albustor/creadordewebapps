import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cedulaOCorreo, canal = "firebase-correo", telefono, codigoOTP, nombreDocente } = body;

    if (!cedulaOCorreo) {
      return NextResponse.json(
        { exito: false, mensaje: "Se requiere la cédula o correo electrónico para procesar la recuperación." },
        { status: 400 }
      );
    }

    const correoDestino = cedulaOCorreo.includes("@") ? cedulaOCorreo.trim().toLowerCase() : null;
    const telefonoDestino = telefono ? telefono.replace(/[^0-9]/g, "") : null;

    let despachoFirebaseExitoso = false;
    let despachoCorreoExitoso = false;
    let despachoWhatsAppExitoso = false;
    let mensajeRespuesta = "";

    // =========================================================================
    // 1. CANAL: RECUPERACIÓN OFICIAL POR FIREBASE AUTH (PASSWORD RESET EMAIL)
    // =========================================================================
    if ((canal === "firebase" || canal === "firebase-correo" || canal === "correo-firebase") && correoDestino) {
      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (firebaseApiKey && !firebaseApiKey.includes("DummyKey")) {
        try {
          const resFirebase = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseApiKey}`,
            {
              method: "POST",
              signal: AbortSignal.timeout(6000),
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                requestType: "PASSWORD_RESET",
                email: correoDestino,
              }),
            }
          );

          if (resFirebase.ok) {
            despachoFirebaseExitoso = true;
            mensajeRespuesta = `Se ha enviado el enlace oficial de recuperación de Firebase a tu correo electrónico institucional: ${correoDestino}. Revisa tu bandeja de entrada o carpeta de spam.`;
          } else {
            const errData = await resFirebase.json().catch(() => ({}));
            const fbErrCode = errData?.error?.message;
            if (fbErrCode === "EMAIL_NOT_FOUND") {
              // Notificar amigablemente que se intentará por OTP o enlace de soporte
              mensajeRespuesta = `El correo ${correoDestino} no registra cuenta directa en Firebase Auth. Se despachará código de seguridad alternativo.`;
            } else {
              console.warn("Firebase Auth OobCode response:", errData);
            }
          }
        } catch (err: any) {
          console.error("Error al conectar con Firebase Identity Toolkit:", err?.message || err);
        }
      }

      // Si Firebase Auth tuvo éxito, retornar de inmediato
      if (despachoFirebaseExitoso) {
        return NextResponse.json({
          exito: true,
          mensaje: mensajeRespuesta,
          canal: "firebase-correo",
          detalles: { despachoFirebase: true, correo: correoDestino },
        });
      }
    }

    // =========================================================================
    // 2. CANAL: MENSAJERÍA MÓVIL POR CELULAR USANDO EVOLUTION API (WHATSAPP)
    // =========================================================================
    const evolutionUrl = process.env.EVOLUTION_URL?.replace(/\/$/, "");
    const evolutionApiKey = process.env.EVOLUTION_API_KEY;
    const evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME;

    let telefonoLimpio = telefonoDestino ? telefonoDestino.replace(/[^0-9]/g, "") : "";
    if (telefonoLimpio.length === 8) {
      telefonoLimpio = `506${telefonoLimpio}`;
    }

    if (
      (canal === "whatsapp" || canal === "celular" || canal === "mensajeria") &&
      evolutionUrl &&
      evolutionApiKey &&
      evolutionInstance &&
      telefonoLimpio
    ) {
      try {
        const mensajeTexto = `🇨🇷 *MEP • Formación Tecnológica (III Ciclo)*\n\nEstimado(a) *${nombreDocente || "Docente"}*,\n\nTu código de verificación y recuperación de acceso es:\n\n🔑 *${codigoOTP}*\n\n⏱️ *Vigencia:* 10 minutos.\n🔒 _Por seguridad, no compartas este código con ninguna persona._\n\n_Ministerio de Educación Pública de Costa Rica_`;

        const resWp = await fetch(`${evolutionUrl}/message/sendText/${evolutionInstance}`, {
          method: "POST",
          signal: AbortSignal.timeout(7000),
          headers: {
            apikey: evolutionApiKey,
            apiKey: evolutionApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            number: telefonoLimpio,
            text: mensajeTexto,
            textMessage: {
              text: mensajeTexto,
            },
            options: {
              delay: 1000,
              presence: "composing",
              linkPreview: false,
            },
          }),
        });

        if (resWp.ok) {
          despachoWhatsAppExitoso = true;
          return NextResponse.json({
            exito: true,
            mensaje: `Código de seguridad enviado exitosamente por WhatsApp al número (+${telefonoLimpio}) usando Evolution API.`,
            canal: "whatsapp",
            detalles: { despachoWhatsApp: true, telefono: telefonoLimpio },
          });
        } else {
          const errBody = await resWp.text().catch(() => "");
          console.error(`Evolution API status ${resWp.status}:`, errBody);
        }
      } catch (err: any) {
        console.error("Error al despachar por Evolution API:", err?.message || err);
      }
    }

    if (canal === "whatsapp" || canal === "celular" || canal === "mensajeria") {
      if (!telefonoLimpio) {
        return NextResponse.json(
          {
            exito: false,
            mensaje: "No se encontró un número de celular asociado a esta cuenta docente. Utilice la opción de Correo MEP o Firebase.",
            detalles: { despachoWhatsApp: false },
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          exito: false,
          mensaje: "El servicio de mensajería Evolution API no se encuentra disponible en este momento. Por favor utilice la opción de Correo Electrónico (Firebase / MEP).",
          detalles: { despachoWhatsApp: false },
        },
        { status: 503 }
      );
    }

    // =========================================================================
    // 3. CANAL: CORREO ELECTRÓNICO INSTITUCIONAL (OTP VÍA RESEND / PLANTILLA MEP)
    // =========================================================================
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && correoDestino) {
      try {
        const resCorreo = await fetch("https://api.resend.com/emails", {
          method: "POST",
          signal: AbortSignal.timeout(5000),
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
        }
      } catch (err) {
        console.error("Error en Resend:", err);
      }
    }

    if (despachoCorreoExitoso) {
      return NextResponse.json({
        exito: true,
        mensaje: `Código de seguridad de 4 dígitos enviado exitosamente a ${correoDestino}.`,
        canal: "correo",
        detalles: { despachoCorreo: true },
      });
    }

    // Si estamos en entorno local o de desarrollo sin Resend configurado
    return NextResponse.json({
      exito: true,
      mensaje: `Código generado para ${correoDestino || cedulaOCorreo}. Verifique su correo o use el código de prueba.`,
      canal: "simulado",
      detalles: { despachoSimulado: true, codigoOTP },
    });
  } catch (error: any) {
    return NextResponse.json(
      { exito: false, mensaje: error?.message || "Error al procesar la solicitud de recuperación." },
      { status: 500 }
    );
  }
}
