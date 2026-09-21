import { NextRequest, NextResponse } from "next/server";
import { ejecutarCascadaIA } from "@/lib/aiResilience";

export async function POST(req: NextRequest) {
  try {
    const { prompt, systemInstruction } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "El campo 'prompt' es requerido" },
        { status: 400 }
      );
    }

    const resultado = await ejecutarCascadaIA(prompt, systemInstruction);

    return NextResponse.json(resultado);
  } catch (error: any) {
    console.error("Error en API de IA:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Fallo en cascada de IA",
        details: error?.message,
      },
      { status: 500 }
    );
  }
}
