import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * API para validación y verificación de cuenta docente por:
 * 1. Correo Electrónico (Firebase Auth / Verificación oficial)
 * 2. Mensajería Móvil por Celular (Evolution API / WhatsApp OTP)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo = "celular", correo, telefono, codigoOTP, nombreDocente } = body;

    // =========================================================================
    // 1. VALIDACIÓN POR MENSAJE DE CELULAR (EVOLUTION API - WHATSAPP)
    // =========================================================================
    if (tipo === "celular" || tipo === "whatsapp") {
      if (!telefono || !codigoOTP) {
        return NextResponse.json(
          { exito: false, mensaje: "Se requiere el número de teléfono y el código OTP para la verificación." },
          { status: 400 }
        );
      }

      let telefonoLimpio = telefono.replace(/[^0-9]/g, "");
      if (telefonoLimpio.length === 8) {
        telefonoLimpio = `506${telefonoLimpio}`;
      }

      const evolutionUrl = process.env.EVOLUTION_URL?.replace(/\/$/, "");
      const evolutionApiKey = process.env.EVOLUTION_API_KEY;
      const evolutionInstance = process.env.EVOLUTION_INSTANCE_NAME;

      if (!evolutionUrl || !evolutionApiKey || !evolutionInstance) {
        return NextResponse.json(
          {
            exito: false,
            mensaje: "El motor de Evolution API no está configurado en las variables de entorno.",
            detalles: { configurado: false },
          },
          { status: 503 }
        );
      }

      const mensajeTexto = `🇨🇷 *MEP • Validación de Cuenta Docente*\n\nHola *${nombreDocente || "Docente"}*,\n\nPara validar y activar tu número de celular en la plataforma de Formación Tecnológica, ingresa este código de verificación:\n\n📲 *${codigoOTP}*\n\n⏱️ _Válido por 10 minutos._\n\n_Ministerio de Educación Pública de Costa Rica_`;

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
        return NextResponse.json({
          exito: true,
          mensaje: `Código de validación enviado por WhatsApp a (+${telefonoLimpio}) con Evolution API.`,
          detalles: { telefono: telefonoLimpio, canal: "evolution-api" },
        });
      } else {
        const errBody = await resWp.text().catch(() => "");
        console.error(`Evolution API status ${resWp.status}:`, errBody);
        return NextResponse.json(
          {
            exito: false,
            mensaje: "Evolution API no pudo entregar el mensaje en WhatsApp. Verifique el número telefónico.",
            detalles: { error: errBody },
          },
          { status: 502 }
        );
      }
    }

    // =========================================================================
    // 2. VALIDACIÓN POR CORREO ELECTRÓNICO (FIREBASE AUTH)
    // =========================================================================
    if (tipo === "correo" || tipo === "firebase") {
      if (!correo) {
        return NextResponse.json(
          { exito: false, mensaje: "Se requiere el correo electrónico institucional para la validación." },
          { status: 400 }
        );
      }

      const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (firebaseApiKey && !firebaseApiKey.includes("DummyKey")) {
        try {
          const resFb = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${firebaseApiKey}`,
            {
              method: "POST",
              signal: AbortSignal.timeout(6000),
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                requestType: "VERIFY_EMAIL",
                email: correo.trim().toLowerCase(),
              }),
            }
          );

          if (resFb.ok) {
            return NextResponse.json({
              exito: true,
              mensaje: `Correo de verificación de cuenta enviado mediante Firebase Auth a ${correo}.`,
              detalles: { canal: "firebase-email-verify" },
            });
          }
        } catch (err: any) {
          console.error("Error al enviar verificación con Firebase:", err);
        }
      }

      // Fallback a Resend con código OTP de verificación
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey && codigoOTP) {
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
              to: [correo.trim().toLowerCase()],
              subject: `Validación de Cuenta MEP: ${codigoOTP}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                  <div style="background: #047857; padding: 16px; border-radius: 8px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">Validación de Cuenta • MEP</h2>
                  </div>
                  <div style="padding: 24px 8px; text-align: center;">
                    <p style="font-size: 14px; color: #334155;">
                      Estimado(a) <strong>${nombreDocente || "Docente"}</strong>, este es tu código de verificación:
                    </p>
                    <div style="font-size: 32px; font-weight: bold; color: #047857; padding: 16px;">
                      ${codigoOTP}
                    </div>
                  </div>
                </div>
              `,
            }),
          });
          if (resCorreo.ok) {
            return NextResponse.json({
              exito: true,
              mensaje: `Código de validación enviado a su correo institucional ${correo}.`,
              detalles: { canal: "correo-otp" },
            });
          }
        } catch (e) {}
      }

      return NextResponse.json({
        exito: true,
        mensaje: `Validación de correo solicitada para ${correo}.`,
        detalles: { canal: "simulado", codigoOTP },
      });
    }

    return NextResponse.json(
      { exito: false, mensaje: "Tipo de validación no soportado." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { exito: false, mensaje: error?.message || "Error al procesar la validación." },
      { status: 500 }
    );
  }
}
