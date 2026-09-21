"use client";

import React from "react";
import ManualInstalacion from "@/components/ManualInstalacion";
import { DeviceMobileCamera, Sparkle, ShieldCheck } from "@phosphor-icons/react";

export default function ManualesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
          Guías y Despliegue Multiplataforma
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Manuales de Instalación y Uso en Aula
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Instrucciones visuales paso a paso para ejecutar las WebApps en teléfonos celulares, tabletas y computadoras
        </p>
      </div>

      {/* Componente Central de Manuales */}
      <ManualInstalacion />

      {/* Buenas Prácticas para el Docente */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-extrabold text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkle size={18} weight="fill" className="text-amber-400" />
          <span>Consejos para el Laboratorio de Informática y Aula Desconectada</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-white">1. Distribución en Memoria USB</h4>
            <p className="text-slate-400 leading-relaxed">
              Guarda el archivo <code>.html</code> en una memoria USB y cópialo en el escritorio de las computadoras del laboratorio antes de iniciar la clase.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <h4 className="font-bold text-white">2. Proyección de Aula</h4>
            <p className="text-slate-400 leading-relaxed">
              Usa el botón <strong>&quot;Modo Proyección de Aula&quot;</strong> en el proyector para que los estudiantes con celulares escaneen el QR al mismo tiempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
