"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  WhatsappLogo,
  ArrowsClockwise,
  ShieldCheck,
  Lightning,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react";

export default function AuditoriaIAPage() {
  const [cargando, setCargando] = useState(false);
  const [datosAuditoria, setDatosAuditoria] = useState<any | null>(null);
  const [copiadoWA, setCopiadoWA] = useState(false);

  const ejecutarAuditoria = async () => {
    setCargando(true);
    try {
      const res = await fetch("/api/cron/verificador-modelos-ia");
      if (res.ok) {
        const data = await res.json();
        setDatosAuditoria(data);
      }
    } catch (e) {
      console.error(e);
    }
    setCargando(false);
  };

  useEffect(() => {
    ejecutarAuditoria();
  }, []);

  const copiarWhatsApp = () => {
    if (datosAuditoria?.payloadWhatsApp) {
      navigator.clipboard.writeText(datosAuditoria.payloadWhatsApp);
      setCopiadoWA(true);
      setTimeout(() => setCopiadoWA(false), 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
              Protocolo Diario 5:00 AM (11:00 UTC)
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-full">
              Activo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Auditoría y resiliencia de servicios de IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Verificación automática de disponibilidad y latencia por niveles de servicio en arquitectura multicapa
          </p>
        </div>

        <button
          onClick={ejecutarAuditoria}
          disabled={cargando}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          <ArrowsClockwise size={16} weight="bold" className={cargando ? "animate-spin" : ""} />
          <span>{cargando ? "Verificando..." : "Ejecutar Ping en Vivo"}</span>
        </button>
      </div>

      {/* Arquitectura de Cascada */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Lightning size={18} className="text-amber-500" weight="fill" />
          <span>Arquitectura de resiliencia en cascada (multicapa)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
            <span className="font-extrabold text-blue-900 block">0. Caché en memoria SHA-256 (0 ms)</span>
            <p className="text-slate-600 leading-snug">Clave criptográfica para respuestas idénticas inmediatas y cero consumo de recursos.</p>
          </div>

          <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
            <span className="font-extrabold text-sky-950 block">1. Capa 1: Inferencia primaria</span>
            <p className="text-slate-600 leading-snug">Modelos de alta precisión con soporte de instrucciones pedagógicas y formativas.</p>
          </div>

          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
            <span className="font-extrabold text-indigo-950 block">2. Capa 2: Ultra-baja latencia</span>
            <p className="text-slate-600 leading-snug">Motor acelerado de respuesta instantánea para alta concurrencia institucional.</p>
          </div>

          <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
            <span className="font-extrabold text-purple-950 block">3. Capa 3: Redundancia distribuida</span>
            <p className="text-slate-600 leading-snug">Ruteo multi-región para respaldo continuo y tolerancia a fallos.</p>
          </div>

          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-extrabold text-emerald-950 block">4. Capa 4: Contingencia especializada</span>
            <p className="text-slate-600 leading-snug">Nodo de respaldo alternativo para escenarios de alta demanda.</p>
          </div>

          <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-xl space-y-1">
            <span className="font-extrabold text-slate-800 block">5. Capa 5: Degradación elegante</span>
            <p className="text-slate-600 leading-snug">Respuesta 503 pedagógica estructurada sin interrumpir la experiencia de usuario.</p>
          </div>
        </div>
      </div>

      {/* Tabla de Modelos y Estado en Vivo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Cpu size={20} className="text-blue-700" weight="duotone" />
          <span>Resultados de la última verificación de salud</span>
        </h3>

        {datosAuditoria?.auditoria?.detalles ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Capa de Servicio</th>
                  <th className="py-3 px-4">Configuración Evaluada</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Latencia de Respuesta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {datosAuditoria.auditoria.detalles.map((d: any, i: number) => {
                  const capaNombre =
                    d.proveedor.includes("Gemini") || d.proveedor.includes("Google")
                      ? "Capa 1 (Primaria)"
                      : d.proveedor.includes("Groq")
                      ? "Capa 2 (Baja Latencia)"
                      : d.proveedor.includes("OpenRouter")
                      ? "Capa 3 (Redundancia)"
                      : "Capa 4 (Contingencia)";
                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{capaNombre}</td>
                      <td className="py-3 px-4 font-mono text-blue-900">{d.modelo}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          <CheckCircle size={14} weight="fill" className="text-emerald-600" />
                          {d.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{d.latencia}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 text-xs">Ejecutando pings de salud...</div>
        )}
      </div>

      {/* Destinatarios y Difusión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Oficial */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase">
            <EnvelopeSimple size={18} weight="bold" />
            <span>Notificación Oficial por Correo</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            alberto.bustos.ortega@mep.go.cr
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reporte ejecutivo con formato HTML estructurado que se remite diariamente a las 5:00 AM con el inventario de modelos.
          </p>
        </div>

        {/* WhatsApp Payload */}
        <div className="bg-emerald-950 text-emerald-100 rounded-2xl p-6 border border-emerald-900 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase">
              <WhatsappLogo size={18} weight="fill" />
              <span>Payload Listo para WhatsApp</span>
            </div>
            <button
              onClick={copiarWhatsApp}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors"
            >
              {copiadoWA ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
          <pre className="bg-slate-950/70 p-3 rounded-xl text-[11px] font-mono text-emerald-200 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {datosAuditoria?.payloadWhatsApp || "Cargando mensaje..."}
          </pre>
        </div>
      </div>
    </div>
  );
}
