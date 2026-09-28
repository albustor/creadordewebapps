"use client";

import React from "react";
import AuthGuard from "@/components/AuthGuard";
import ChecklistAuditoriaForense from "@/components/ChecklistAuditoriaForense";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "@phosphor-icons/react";

export default function AuditoriaForensePage() {
  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Volver al Panel de Gobernanza</span>
          </Link>

          <span className="text-[11px] font-mono font-bold text-slate-400">
            Protocolo de Inspección Humana • Jim 360°
          </span>
        </div>

        <ChecklistAuditoriaForense />
      </div>
    </AuthGuard>
  );
}
