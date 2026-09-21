import { NextRequest, NextResponse } from "next/server";

// Almacén en memoria global para el servidor
const webAppsStore = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.titulo || !data.codigoHTML) {
      return NextResponse.json(
        { error: "Se requiere título y código HTML para publicar la WebApp" },
        { status: 400 }
      );
    }

    const id = data.id || "app-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
    const nuevaWebApp = {
      ...data,
      id,
      fechaCreacion: data.fechaCreacion || new Date().toISOString(),
      visitas: data.visitas || 0,
    };

    webAppsStore.set(id, nuevaWebApp);

    return NextResponse.json({
      success: true,
      mensaje: "WebApp publicada exitosamente",
      data: nuevaWebApp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al publicar la WebApp", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const webapp = webAppsStore.get(id);
    if (!webapp) {
      return NextResponse.json({ error: "WebApp no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: webapp });
  }

  const todas = Array.from(webAppsStore.values());
  return NextResponse.json({ success: true, data: todas });
}
