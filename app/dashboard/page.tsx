"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import PanelDocenteSimplificado from "@/components/PanelDocenteSimplificado";

export default function DashboardAnaliticoPage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <PanelDocenteSimplificado />
      </div>
    </AuthGuard>
  );
}
