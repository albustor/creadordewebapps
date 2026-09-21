"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockSimple, Lightning, ChartBar, ArrowRight, ShieldCheck } from "@phosphor-icons/react";

interface Props {
  titulo?: string;
  descripcion?: string;
}

export default function SeccionBloqueada({
  titulo = "Sección Restringida",
  descripcion = "Esta sección se encuentra temporalmente oculta y bloqueada. La plataforma está configurada exclusivamente para el Diagnóstico IA y el Dashboard Analítico.",
}: Props) {
  const router = useRouter();
  const [segundos, setSegundos] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/diagnostico");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center backdrop-blur-xl animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-inner">
          <LockSimple size={32} weight="duotone" />
        </div>

        <h1 className="text-2xl font-black text-white mb-3 tracking-tight">
          {titulo}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          {descripcion}
        </p>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6 text-xs text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
          <span>
            Redirigiendo automáticamente a <strong>Diagnóstico IA</strong> en {segundos}s...
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/diagnostico"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg transition-all"
          >
            <Lightning size={18} weight="fill" className="text-amber-300" />
            <span>Ir a Diagnóstico IA</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all"
          >
            <ChartBar size={18} weight="duotone" className="text-cyan-400" />
            <span>Ir al Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
