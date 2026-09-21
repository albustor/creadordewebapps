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
  Question,
  CaretDown,
  CaretUp,
  ShieldCheck,
  Lightning,
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

  const urlOnline =
    typeof window !== "undefined"
      ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_en_linea.html`
      : "/webapps/diagnostico_9no_modulo01_en_linea.html";

  const copiarEnlaceOnline = () => {
    navigator.clipboard.writeText(urlOnline);
    setCopiadoOnline(true);
    setTimeout(() => setCopiadoOnline(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. AVISO OBLIGATORIO: EXCLUSIVO PARA COMPUTADORAS */}
      <div className="p-5 bg-slate-900 border-2 border-sky-500 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0">
            <Laptop size={28} className="text-sky-300" weight="duotone" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                Requisito Oficial de Aplicación
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-400/20 text-sky-200 border border-sky-400/30">
                100% Computadoras
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium mt-1 leading-relaxed">
              Este instrumento de diagnóstico fue diseñado <strong>única y exclusivamente para computadoras</strong> (Laboratorios de Cómputo, Laptops y PCs de escritorio). Es compatible con <strong>cualquier navegador web moderno</strong> (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari, Opera).
            </p>
          </div>
        </div>

        <button
          onClick={() => setGuiaAbierta(!guiaAbierta)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shrink-0 transition-all shadow-md"
        >
          <Question size={16} weight="bold" />
          <span>{guiaAbierta ? "Ocultar Guía" : "¿Cómo y Cuándo Usar?"}</span>
          {guiaAbierta ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </button>
      </div>

      {/* 2. GUÍA PEDAGÓGICA DESPLEGABLE */}
      {guiaAbierta && (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4 animate-fadeIn shadow-sm">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkle size={18} className="text-amber-600" weight="fill" />
            <span>Criterios de Elección y Protocolo para el Docente</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
              <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-sm">
                <GlobeHemisphereWest size={18} weight="bold" className="text-emerald-700" />
                <span>¿Cuándo elegir la Versión En Línea?</span>
              </div>
              <ul className="list-disc list-inside text-slate-800 space-y-1 font-medium text-[11.5px] leading-relaxed">
                <li>El laboratorio cuenta con <strong>internet fluido y estable</strong>.</li>
                <li>Deseas ver el avance de los estudiantes en tiempo real en tu <strong>Dashboard Docente</strong> conforme van respondiendo.</li>
                <li><strong>Cómo pasar el enlace:</strong> Comparte el link web o proyecta el código QR inicial en la pizarra.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2">
              <div className="font-extrabold text-amber-950 flex items-center gap-1.5 text-sm">
                <HardDrive size={18} weight="bold" className="text-amber-700" />
                <span>¿Cuándo elegir la Versión Desconectada (Offline)?</span>
              </div>
              <ul className="list-disc list-inside text-slate-800 space-y-1 font-medium text-[11.5px] leading-relaxed">
                <li>El laboratorio <strong>no tiene internet</strong> o la red es intermitente/bloqueada.</li>
                <li><strong>Cómo pasar el archivo:</strong> Descargas el archivo único <code>.html</code> en una llave USB y lo copias en las computadoras del laboratorio (o en una carpeta de red local).</li>
                <li>El estudiante hace doble clic en el archivo y lo completa en cualquier navegador. Al terminar, te muestra el <strong>Código QR final</strong> y lo escaneas con tu teléfono/laptop, o descargas el comprobante <code>.json</code>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. LAS DOS VERSIONES SEPARADAS (CLARAS, NÍTIDAS Y CON ALTO CONTRASTE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ============================================================ */}
        {/* TARJETA 1: VERSIÓN EN LÍNEA (CONECTADA)                      */}
        {/* ============================================================ */}
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-7 text-slate-900 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-600 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Opción 1 • Con Internet</span>
              </span>
              <span className="text-xs font-bold text-emerald-700">Sincronización en vivo</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <GlobeHemisphereWest size={24} className="text-emerald-600" weight="bold" />
                <span>Versión En Línea</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Ejecución directa desde el navegador con conexión a internet. Almacena las respuestas y los 10 indicadores cognitivos directamente en la base de datos y en tu Dashboard.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
              <div className="text-emerald-900 font-extrabold flex items-center gap-1.5">
                <CheckCircle size={16} weight="fill" className="text-emerald-600" />
                <span>Ventaja Principal:</span>
              </div>
              <p className="text-emerald-950 text-[11.5px] font-medium leading-relaxed">
                Cero manejo de llaves USB. Solo compartes el enlace y supervisas en tu pantalla.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/webapps/diagnostico_9no_modulo01_en_linea.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                <span>Abrir Versión en Línea</span>
                <ArrowSquareOut size={16} weight="bold" />
              </a>

              <button
                onClick={copiarEnlaceOnline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
                title="Copiar enlace web para enviar a los estudiantes"
              >
                {copiadoOnline ? <Check size={16} className="text-emerald-700" weight="bold" /> : <Copy size={16} weight="bold" />}
                <span>{copiadoOnline ? "¡Copiado!" : "Copiar Enlace"}</span>
              </button>

              <button
                onClick={() => setModalQROnline(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 transition-colors"
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
        <div className="bg-white border-2 border-amber-500 rounded-3xl p-6 sm:p-7 text-slate-900 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-amber-600 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive size={14} weight="bold" className="text-amber-700" />
                <span>Opción 2 • Sin Internet (USB)</span>
              </span>
              <span className="text-xs font-bold text-amber-700">100% Autónomo</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <HardDrive size={24} className="text-amber-600" weight="bold" />
                <span>Versión Desconectada (Offline)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Archivo <code>.html</code> empaquetado y autosuficiente. Se ejecuta en las computadoras del laboratorio sin depender de conexión a internet. Al finalizar genera el código QR y archivo <code>.json</code>.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs">
              <div className="text-amber-900 font-extrabold flex items-center gap-1.5">
                <ShieldCheck size={16} weight="fill" className="text-amber-600" />
                <span>Ventaja Principal:</span>
              </div>
              <p className="text-amber-950 text-[11.5px] font-medium leading-relaxed">
                Inmunidad total a caídas de internet. Los resultados se transfieren por escaneo QR o carga por lote.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="/webapps/diagnostico_9no_modulo01_desconectado_offline.html"
                download="diagnostico_9no_modulo01_desconectado_offline.html"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Descargar para Llave USB (.html)</span>
              </a>

              <a
                href="/webapps/diagnostico_9no_modulo01_desconectado_offline.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
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
