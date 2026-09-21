"use client";

import React, { useState } from "react";
import {
  GlobeHemisphereWest,
  HardDrive,
  Laptop,
  CheckCircle,
  Copy,
  Check,
  DownloadSimple,
  ArrowSquareOut,
  QrCode,
  Sparkle,
  Info,
  ShareNetwork,
  Cpu,
  ShieldCheck,
  Lightning,
  Question,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";

interface SelectorVersionesDiagnosticoProps {
  docenteNombre?: string;
  institucionNombre?: string;
}

export default function SelectorVersionesDiagnostico({
  docenteNombre = "Prof. Docente de Secundaria",
  institucionNombre = "Liceo / Colegio",
}: SelectorVersionesDiagnosticoProps) {
  const [copiadoOnline, setCopiadoOnline] = useState(false);
  const [modalQROnline, setModalQROnline] = useState(false);
  const [guiaAbierta, setGuiaAbierta] = useState(false);

  // URL de la versión en línea
  const urlOnline = typeof window !== "undefined"
    ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_en_linea.html`
    : "/webapps/diagnostico_9no_modulo01_en_linea.html";

  const copiarEnlaceOnline = () => {
    navigator.clipboard.writeText(urlOnline);
    setCopiadoOnline(true);
    setTimeout(() => setCopiadoOnline(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* AVISO OBLIGATORIO: EXCLUSIVO PARA COMPUTADORAS */}
      <div className="p-4 bg-linear-to-r from-blue-950 via-slate-900 to-indigo-950 border-2 border-sky-400/80 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0">
            <Laptop size={26} className="text-sky-300" weight="duotone" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                Requisito Oficial de Aplicación
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-400/20 text-sky-200 border border-sky-400/30">
                100% Computadoras
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium mt-0.5">
              Este instrumento de diagnóstico fue diseñado <strong>única y exclusivamente para computadoras</strong> (Laboratorios de Cómputo, Laptops y PCs de escritorio). Es compatible con <strong>cualquier navegador web moderno</strong> (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari, Opera).
            </p>
          </div>
        </div>

        <button
          onClick={() => setGuiaAbierta(!guiaAbierta)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 border border-sky-400/40 text-xs font-bold shrink-0 transition-all"
        >
          <Question size={16} weight="bold" />
          <span>{guiaAbierta ? "Ocultar Guía" : "¿Cómo y Cuándo Usar?"}</span>
          {guiaAbierta ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </button>
      </div>

      {/* GUÍA PEDAGÓGICA DESPLEGABLE: CÓMO Y CUÁNDO USAR CADA VERSIÓN */}
      {guiaAbierta && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-fadeIn">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkle size={18} className="text-amber-600" weight="fill" />
            <span>Criterios de Elección y Protocolo para el Docente</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
              <div className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                <GlobeHemisphereWest size={18} weight="bold" className="text-emerald-700" />
                <span>¿Cuándo elegir la Versión En Línea?</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium text-[11.5px] leading-relaxed">
                <li>El laboratorio cuenta con <strong>internet fluido y estable</strong>.</li>
                <li>Deseas ver el avance de los estudiantes en tiempo real en tu <strong>Dashboard Docente</strong> conforme van respondiendo.</li>
                <li><strong>Cómo pasar el enlace:</strong> Solo comparte el link web o proyecta el código QR inicial en la pizarra o pantalla del aula.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-100 border border-slate-300 rounded-xl space-y-2">
              <div className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                <HardDrive size={18} weight="bold" className="text-slate-700" />
                <span>¿Cuándo elegir la Versión Desconectada (Offline)?</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium text-[11.5px] leading-relaxed">
                <li>El laboratorio <strong>no tiene internet</strong> o la red es intermitente/bloqueada.</li>
                <li><strong>Cómo pasar el archivo:</strong> Descargas el archivo único <code>.html</code> en una llave USB y lo copias en las computadoras del laboratorio (o en una carpeta de red local).</li>
                <li>El estudiante hace doble clic en el archivo y lo completa en cualquier navegador. Al terminar, te muestra el <strong>Código QR final</strong> y lo escaneas en segundos con tu teléfono/laptop, o descargas el comprobante <code>.json</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* LAS DOS VERSIONES SEPARADAS EN TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ============================================================ */}
        {/* TARJETA 1: VERSIÓN EN LÍNEA (CONECTADA)                      */}
        {/* ============================================================ */}
        <div className="bg-linear-to-br from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Opción 1 • Con Internet</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-200">Sincronización en vivo</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <GlobeHemisphereWest size={24} className="text-emerald-400" weight="bold" />
                <span>Versión En Línea</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Ejecución directa desde el navegador con conexión. Almacena las respuestas y los 10 indicadores cognitivos directamente en la base de datos y en tu Dashboard.
              </p>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 text-xs">
              <div className="text-emerald-300 font-bold flex items-center gap-1">
                <CheckCircle size={15} weight="fill" />
                <span>Ventaja Principal:</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Cero manejo de llaves USB. Solo compartes el enlace y supervisas en tu pantalla.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/webapps/diagnostico_9no_modulo01_en_linea.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <span>Abrir Versión en Línea</span>
                <ArrowSquareOut size={16} weight="bold" />
              </a>

              <button
                onClick={copiarEnlaceOnline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                title="Copiar enlace web para enviar a los estudiantes"
              >
                {copiadoOnline ? <Check size={16} className="text-emerald-400" weight="bold" /> : <Copy size={16} weight="bold" />}
                <span>{copiadoOnline ? "¡Copiado!" : "Copiar Enlace"}</span>
              </button>

              <button
                onClick={() => setModalQROnline(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 font-bold text-xs rounded-xl border border-emerald-600/40 transition-colors"
                title="Proyectar código QR para que los estudiantes abran la página"
              >
                <QrCode size={16} weight="bold" />
                <span>QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TARJETA 2: VERSIÓN DESCONECTADA / OFFLINE (SIN INTERNET)     */}
        {/* ============================================================ */}
        <div className="bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 border-2 border-slate-400 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive size={14} weight="bold" />
                <span>Opción 2 • Sin Internet (USB)</span>
              </span>
              <span className="text-[11px] font-bold text-slate-300">100% Autónomo</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <HardDrive size={24} className="text-amber-400" weight="bold" />
                <span>Versión Desconectada (Offline)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Archivo <code>.html</code> empaquetado y autosuficiente. Se ejecuta en las computadoras del laboratorio sin depender de conexión a internet. Al finalizar genera el QR y archivo <code>.json</code>.
              </p>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 text-xs">
              <div className="text-amber-300 font-bold flex items-center gap-1">
                <ShieldCheck size={15} weight="fill" />
                <span>Ventaja Principal:</span>
              </div>
              <p className="text-slate-300 text-[11px]">
                Inmunidad total a caídas de internet. Los resultados se transfieren por escaneo QR o carga por lote.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/webapps/diagnostico_9no_modulo01_desconectado_offline.html"
                download="diagnostico_9no_modulo01_desconectado_offline.html"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Descargar para Llave USB (.html)</span>
              </a>

              <a
                href="/webapps/diagnostico_9no_modulo01_desconectado_offline.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                title="Probar en el navegador local"
              >
                <span>Probar</span>
                <ArrowSquareOut size={15} weight="bold" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL PARA PROYECTAR QR DE LA VERSIÓN EN LÍNEA */}
      {modalQROnline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Acceso al Diagnóstico en Línea
              </span>
              <button
                onClick={() => setModalQROnline(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <QRCodeSVG value={urlOnline} size={200} level="M" />
            </div>

            <div>
              <h4 className="font-black text-slate-900 text-sm">Escanea para abrir en la computadora</h4>
              <p className="text-xs text-slate-500 mt-1">
                Los estudiantes pueden abrir este enlace o digitar la URL en el navegador de su computadora.
              </p>
            </div>

            <button
              onClick={copiarEnlaceOnline}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {copiadoOnline ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
              <span>{copiadoOnline ? "¡Enlace Copiado al Portapapeles!" : "Copiar Enlace Directo"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
