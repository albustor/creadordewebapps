"use client";

import React from "react";
import SeccionBloqueada from "@/components/SeccionBloqueada";

export default function PublicarPage() {
  return (
    <SeccionBloqueada
      titulo="Módulo de Publicación Bloqueado"
      descripcion="La publicación directa de archivos HTML externos se encuentra deshabilitada. Utilice la sección de Diagnóstico IA o el Dashboard Analítico."
    />
  );
}
