"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  DeviceMobile,
  DeviceTablet,
  Desktop,
  ArrowsClockwise,
  ArrowSquareOut,
  QrCode,
  ArrowsOut,
  X,
} from "@phosphor-icons/react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url") || "/dashboard";
  const deviceParam = searchParams.get("device") || "mobile";

  const [urlObjetivo, setUrlObjetivo] = useState(urlParam);
  const [dispositivo, setDispositivo] = useState<"mobile" | "tablet" | "desktop">(
    deviceParam === "tablet" ? "tablet" : deviceParam === "desktop" ? "desktop" : "mobile"
  );
  const [recargaKey, setRecargaKey] = useState(0);
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [urlCompleta, setUrlCompleta] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setUrlCompleta(`${origin}${urlObjetivo}`);
    }
  }, [urlObjetivo]);

  const rutasPredefinidas = [
    { label: "Panel Docente", path: "/dashboard" },
    { label: "Escáner Universal V3.2", path: "/diagnostico_escaner_datos_v3_2.html" },
    { label: "7° Año Desconectado V3.2", path: "/webapps/diagnostico_7mo_modulo01_desconectado_offline_v3_2.html" },
    { label: "9° Año Desconectado V3.2", path: "/webapps/diagnostico_9no_modulo01_desconectado_offline_v3_2.html" },
    { label: "Inicio / Portal", path: "/" },
  ];

  const getDimensiones = () => {
    switch (dispositivo) {
      case "mobile":
        return {
          nombre: "Celular Móvil",
          resolucion: "390 x 844 px",
          contenedorClase: "w-[390px] h-[844px] rounded-[44px] border-[10px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-slate-700/80",
          notch: true,
        };
      case "tablet":
        return {
          nombre: "Tableta",
          resolucion: "820 x 1180 px",
          contenedorClase: "w-[780px] h-[960px] rounded-[36px] border-[12px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.85)] ring-1 ring-slate-700/80",
          notch: false,
        };
      default:
        return {
          nombre: "Escritorio / Pantalla Completa",
          resolucion: "100 % Fluido",
          contenedorClase: "w-full max-w-6xl h-[840px] rounded-2xl border-2 border-slate-700 shadow-2xl",
          notch: false,
        };
    }
  };

  const dim = getDimensiones();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* Fondo con Cuadrícula Blueprint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#1e293b 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
      />

      {/* Barra Superior de Navegación del Simulador */}
      <header className="relative z-20 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1B5E59]/30 border border-teal-500/30 text-teal-300 text-xs font-black">
            <span>🛠️</span>
            <span>DEV SIMULATOR</span>
          </div>

          {/* Selector Rápido de Rutas */}
          <select
            value={urlObjetivo}
            onChange={(e) => setUrlObjetivo(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            {rutasPredefinidas.map((r) => (
              <option key={r.path} value={r.path}>
                {r.label} ({r.path})
              </option>
            ))}
          </select>
        </div>

        {/* Input de URL Personalizada */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
          <span className="text-slate-500">URL:</span>
          <input
            type="text"
            value={urlObjetivo}
            onChange={(e) => setUrlObjetivo(e.target.value)}
            placeholder="/dashboard"
            className="bg-transparent border-none outline-none text-teal-300 flex-1 font-mono"
          />
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          <a
            href={urlObjetivo}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            Volver a la App
          </a>
        </div>
      </header>

      {/* Lienzo Central de Simulación */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto">
        
        {/* Badge Superior del Dispositivo */}
        <div className="mb-4 flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{dim.nombre}</span>
            <span className="text-slate-500 font-mono text-[11px]">({dim.resolucion})</span>
          </span>

          <div className="h-3 w-[1px] bg-slate-700" />

          <button
            onClick={() => setRecargaKey((k) => k + 1)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Recargar frame"
          >
            <ArrowsClockwise size={14} />
          </button>
        </div>

        {/* Frame del Dispositivo */}
        <div className={`relative bg-black overflow-hidden flex flex-col transition-all duration-300 ${dim.contenedorClase}`}>
          
          {/* Dynamic Island / Notch para Móvil */}
          {dim.notch && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-30 border border-slate-800 flex items-center justify-center shadow-inner">
              <span className="w-2 h-2 rounded-full bg-slate-800 inline-block mr-2" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-950 inline-block border border-slate-800" />
            </div>
          )}

          {/* Iframe que renderiza la aplicación */}
          <iframe
            key={`${urlObjetivo}-${recargaKey}`}
            src={urlObjetivo}
            title="Simulador de Dispositivo MEP"
            className="w-full h-full border-none bg-white"
          />

          {/* Barra de Inicio Inferior para Celular */}
          {dim.notch && (
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600/70 rounded-full z-30 pointer-events-none" />
          )}
        </div>
      </main>

      {/* Barra Inferior Flotante de Selección */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-slate-900 p-1.5 px-3 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-slate-200 backdrop-blur-lg flex items-center gap-2">
        <button
          onClick={() => setDispositivo("mobile")}
          className={`p-2.5 rounded-full transition-all cursor-pointer ${
            dispositivo === "mobile"
              ? "bg-slate-950 text-white shadow-md scale-105"
              : "hover:bg-slate-100 text-slate-600"
          }`}
          title="Vista Móvil (390 x 844 px)"
        >
          <DeviceMobile size={20} weight="bold" />
        </button>

        <button
          onClick={() => setDispositivo("tablet")}
          className={`p-2.5 rounded-full transition-all cursor-pointer ${
            dispositivo === "tablet"
              ? "bg-slate-950 text-white shadow-md scale-105"
              : "hover:bg-slate-100 text-slate-600"
          }`}
          title="Vista Tableta (820 x 1180 px)"
        >
          <DeviceTablet size={20} weight="bold" />
        </button>

        <button
          onClick={() => setDispositivo("desktop")}
          className={`p-2.5 rounded-full transition-all cursor-pointer ${
            dispositivo === "desktop"
              ? "bg-slate-950 text-white shadow-md scale-105"
              : "hover:bg-slate-100 text-slate-600"
          }`}
          title="Vista Escritorio / Pantalla Completa"
        >
          <Desktop size={20} weight="bold" />
        </button>

        <div className="h-5 w-[1px] bg-slate-300 mx-1" />

        <a
          href={urlObjetivo}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-all"
          title="Abrir en pestaña nueva"
        >
          <ArrowSquareOut size={18} weight="bold" />
        </a>

        <button
          onClick={() => setRecargaKey((k) => k + 1)}
          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
          title="Recargar"
        >
          <ArrowsClockwise size={18} weight="bold" />
        </button>

        <button
          onClick={() => setMostrarModalQR(true)}
          className="p-2.5 rounded-full hover:bg-slate-100 text-amber-600 transition-all cursor-pointer"
          title="Ver código QR para celular físico en LAN"
        >
          <QrCode size={20} weight="bold" />
        </button>
      </footer>

      {/* Modal de Código QR para Celular Real en LAN */}
      {mostrarModalQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} weight="bold" className="text-amber-400" />
                <h4 className="font-extrabold text-sm">Prueba en Celular Físico</h4>
              </div>
              <button
                onClick={() => setMostrarModalQR(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Escanea este código con la cámara de tu smartphone conectado al mismo Wi-Fi:
            </p>

            <div className="bg-white p-3.5 rounded-xl flex items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlCompleta)}`}
                alt="Código QR local"
                className="w-44 h-44 rounded-lg"
              />
            </div>

            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
              {urlCompleta}
            </div>

            <button
              onClick={() => setMostrarModalQR(false)}
              className="w-full py-2 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white bg-slate-950 min-h-screen">Cargando simulador multidispositivo...</div>}>
      <PreviewContent />
    </Suspense>
  );
}
