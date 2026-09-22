"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lightning } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-[#FCFBF9] text-slate-600 border-t border-stone-200/90 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                <Lightning size={18} weight="fill" className="text-amber-600" />
              </div>
              <span className="font-extrabold text-base sm:text-lg">Diagnóstico & Dashboard</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed font-medium">
              Entorno pedagógico para la aplicación del diagnóstico integrado de 9° año y la consolidación analítica de evidencias en tiempo real.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Navegación</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-800 transition-colors">
                  Inicio y acceso docente
                </Link>
              </li>
              <li>
                <Link href="/diagnostico" className="hover:text-emerald-800 transition-colors font-semibold text-emerald-800">
                  Diagnóstico (9° año)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-800 transition-colors">
                  Dashboard analítico y telemetría
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Seguridad & Resiliencia</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Persistencia en memoria y almacenamiento local</span>
              </li>
              <li className="flex items-center gap-2">
                <Lightning size={14} className="text-amber-600" />
                <span>Sincronización QR sin conexión a internet</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Verificación de tokens e integridad de datos</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-500">
          <div>
            © 2026 Diagnóstico & Dashboard • Formación tecnológica (9° año).
          </div>
          <div>
            Optimizado para computadoras de laboratorios, PCs y portátiles.
          </div>
        </div>
      </div>
    </footer>
  );
}
