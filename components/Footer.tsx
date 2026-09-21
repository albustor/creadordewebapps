"use client";

import React from "react";
import Link from "next/link";
import { CodeBlock, ShieldCheck, Lightning, Heart } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <CodeBlock size={18} weight="bold" />
              </div>
              <span className="font-extrabold text-lg">Creador de WebApps</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma modular para la generación de recursos educativos interactivos autónomos (Single-File),
              distribución multiplataforma y telemetría pedagógica en tiempo real.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Módulos Activos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/diagnostico" className="hover:text-blue-400 transition-colors font-semibold text-sky-400">
                  Diagnóstico IA & Módulo 1 (9°)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Dashboard Analítico & Telemetría
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tecnología</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Compatibilidad Universal Chrome 50+</span>
              </li>
              <li className="flex items-center gap-2">
                <Lightning size={14} className="text-amber-400" />
                <span>Persistencia Defensiva SafeStorage</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Token Antifraude SHA-256</span>
              </li>
              <li className="flex items-center gap-2">
                <Lightning size={14} className="text-amber-400" />
                <span>Soporte Offline QR sin Internet</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Sistema de IA</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Arquitectura de resiliencia en cascada multicapa con Google Gemini, Groq LPU, OpenRouter Qwen y
              degradación pedagógica estructurada.
            </p>
            <Link
              href="/auditoria-ia"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold hover:underline"
            >
              Ver monitor de auditoría ➔
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © 2026 Creador de WebApps. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-1">
            Diseñado para laboratorios de informática, aulas desconectadas y dispositivos móviles.
          </div>
        </div>
      </div>
    </footer>
  );
}
