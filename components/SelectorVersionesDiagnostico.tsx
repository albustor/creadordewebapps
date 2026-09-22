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
  docenteNombre = "Alberto Bustos Ortega",
  institucionNombre = "Asesoría de Formación Tecnológica",
}: SelectorVersionesDiagnosticoProps) {
  const [copiadoOnline, setCopiadoOnline] = useState(false);
  const [modalQROnline, setModalQROnline] = useState(false);
  const [guiaAbierta, setGuiaAbierta] = useState(false);

  const queryParams = new URLSearchParams();
  if (docenteNombre) queryParams.set("docente", docenteNombre);
  if (institucionNombre) queryParams.set("institucion", institucionNombre);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const urlOnline =
    typeof window !== "undefined"
      ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_en_linea.html${queryString}`
      : `/webapps/diagnostico_9no_modulo01_en_linea.html${queryString}`;

  const urlOffline = `/webapps/diagnostico_9no_modulo01_desconectado_offline.html${queryString}`;

  const copiarEnlaceOnline = () => {
    navigator.clipboard.writeText(urlOnline);
    setCopiadoOnline(true);
    setTimeout(() => setCopiadoOnline(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. AVISO OBLIGATORIO: EXCLUSIVO PARA COMPUTADORAS */}
      <div className="p-5 bg-sky-50/90 border border-sky-200/90 rounded-3xl text-slate-900 shadow-softPastel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center shrink-0">
            <Laptop size={28} weight="duotone" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                Requisito oficial de aplicación
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-900 border border-sky-300">
                100% computadoras
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              Este instrumento de diagnóstico fue diseñado <strong>única y exclusivamente para computadoras</strong> (laboratorios de cómputo, laptops y PCs de escritorio). Es compatible con <strong>cualquier navegador web moderno</strong> (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari, Opera).
            </p>
          </div>
        </div>

        <button
          onClick={() => setGuiaAbierta(!guiaAbierta)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
        >
          <Question size={16} weight="bold" />
          <span>{guiaAbierta ? "Ocultar guía" : "¿Cómo y cuándo usar?"}</span>
          {guiaAbierta ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </button>
      </div>

      {/* 2. GUÍA PEDAGÓGICA DESPLEGABLE */}
      {guiaAbierta && (
        <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4 animate-fadeIn shadow-xs">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkle size={18} className="text-amber-600" weight="fill" />
            <span>Criterios de elección y protocolo para el docente</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-sm">
                <GlobeHemisphereWest size={18} weight="bold" className="text-emerald-700" />
                <span>¿Cuándo elegir la versión en línea?</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium text-[11.5px] leading-relaxed">
                <li>El laboratorio cuenta con <strong>internet fluido y estable</strong>.</li>
                <li>Deseas ver el avance de los estudiantes en tiempo real en tu <strong>dashboard docente</strong> conforme van respondiendo.</li>
                <li><strong>Cómo compartir el enlace:</strong> Comparte el enlace web o proyecta el código QR inicial en la pizarra.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="font-extrabold text-amber-950 flex items-center gap-1.5 text-sm">
                <HardDrive size={18} weight="bold" className="text-amber-700" />
                <span>¿Cuándo elegir la versión desconectada (offline)?</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium text-[11.5px] leading-relaxed">
                <li>El laboratorio tiene <strong>conexión lenta, inestable o sin internet</strong>.</li>
                <li><strong>Cómo aplicarlo:</strong> Descargas el archivo único <code>.html</code> y lo copias a las computadoras mediante una llave USB o carpeta compartida en red local.</li>
                <li><strong>Cómo capturar las notas:</strong> Al terminar la prueba, cada estudiante genera un código QR final en su pantalla. Tú lo escaneas con tu celular o laptop en 1 segundo.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. TARJETAS DE ACCESO DIRECTO A LAS VERSIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TARJETA 1: VERSIÓN EN LÍNEA (CONECTADA) */}
        <div className="bg-white border-2 border-emerald-200/90 rounded-3xl p-6 sm:p-7 text-slate-900 shadow-softPastel flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Opción 1 • Con internet</span>
              </span>
              <span className="text-xs font-bold text-emerald-700">Sincronización en vivo</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <GlobeHemisphereWest size={24} className="text-emerald-700" weight="bold" />
                <span>Versión en línea</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Ejecución directa desde el navegador con conexión a internet. Almacena las respuestas y los 10 indicadores cognitivos directamente en la base de datos y en tu dashboard.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs">
              <div className="text-emerald-900 font-extrabold flex items-center gap-1.5">
                <CheckCircle size={16} weight="fill" className="text-emerald-700" />
                <span>Ventaja principal:</span>
              </div>
              <p className="text-emerald-950 text-[11.5px] font-medium leading-relaxed">
                Cero manejo de llaves USB. Solo compartes el enlace y supervisas en tu pantalla.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={urlOnline}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
              >
                <span>Abrir versión en línea</span>
                <ArrowSquareOut size={16} weight="bold" />
              </a>

              <button
                onClick={copiarEnlaceOnline}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors"
                title="Copiar enlace web para enviar a los estudiantes"
              >
                {copiadoOnline ? <Check size={16} className="text-emerald-700" weight="bold" /> : <Copy size={16} weight="bold" />}
                <span>{copiadoOnline ? "¡Copiado!" : "Copiar enlace"}</span>
              </button>

              <button
                onClick={() => setModalQROnline(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
                title="Proyectar código QR para que los estudiantes abran la página"
              >
                <QrCode size={16} weight="bold" />
                <span>QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* TARJETA 2: VERSIÓN DESCONECTADA / OFFLINE (SIN INTERNET) */}
        <div className="bg-white border-2 border-amber-200/90 rounded-3xl p-6 sm:p-7 text-slate-900 shadow-softPastel flex flex-col justify-between relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive size={14} weight="bold" className="text-amber-700" />
                <span>Opción 2 • Sin internet (USB)</span>
              </span>
              <span className="text-xs font-bold text-amber-800">100% autónomo</span>
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <HardDrive size={24} className="text-amber-700" weight="bold" />
                <span>Versión desconectada (offline)</span>
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                Archivo <code>.html</code> empaquetado y autosuficiente. Se ejecuta en las computadoras del laboratorio sin depender de conexión a internet. Al finalizar genera el código QR y archivo <code>.json</code>.
              </p>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1 text-xs">
              <div className="text-amber-900 font-extrabold flex items-center gap-1.5">
                <ShieldCheck size={16} weight="fill" className="text-amber-700" />
                <span>Ventaja principal:</span>
              </div>
              <p className="text-amber-950 text-[11.5px] font-medium leading-relaxed">
                Inmunidad total a caídas de internet. Los resultados se transfieren por escaneo QR o carga por lote.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={urlOffline}
                download="diagnostico_9no_modulo01_desconectado_offline.html"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Descargar para llave USB (.html)</span>
              </a>

              <a
                href={urlOffline}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold text-xs rounded-xl border border-stone-300 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Proyección en laboratorio
                </span>
                <h4 className="text-base font-black text-slate-900">QR diagnóstico 9°</h4>
              </div>
              <button
                onClick={() => setModalQROnline(false)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Proyecta este código en la pizarra o televisor del laboratorio para que los estudiantes abran la prueba en línea.
            </p>

            <div className="p-4 bg-white border border-stone-200 rounded-2xl inline-block shadow-xs">
              <QRCodeSVG value={urlOnline} size={200} level="M" />
            </div>

            <div className="text-[11px] font-mono text-stone-500 bg-stone-50 p-2 rounded-lg break-all border border-stone-200">
              {urlOnline}
            </div>

            <button
              onClick={() => setModalQROnline(false)}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
