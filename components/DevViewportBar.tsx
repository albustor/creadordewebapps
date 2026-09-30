"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  DeviceMobile,
  DeviceTablet,
  Desktop,
  ArrowsClockwise,
  ArrowSquareOut,
  QrCode,
  X,
  Eye,
} from "@phosphor-icons/react";

export default function DevViewportBar() {
  const pathname = usePathname();
  const [esLocalhost, setEsLocalhost] = useState(false);
  const [enIframe, setEnIframe] = useState(false);
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [ipLocal, setIpLocal] = useState("localhost");
  const [puerto, setPuerto] = useState("3001");
  const [minimizado, setMinimizado] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port || "3000";
      const isLocal = host === "localhost" || host === "127.0.0.1" || host.startsWith("192.168.") || host.startsWith("10.");
      const insideIframe = window.self !== window.top;

      setEsLocalhost(isLocal);
      setEnIframe(insideIframe);
      setPuerto(port);
      setIpLocal(host);
    }
  }, []);

  // No renderizar en producción ni dentro del simulador iframe
  if (!esLocalhost || enIframe) return null;

  const urlActual = typeof window !== "undefined" ? window.location.href : "";
  const rutaRelativa = pathname || "/dashboard";
  const urlPreview = `/preview?url=${encodeURIComponent(rutaRelativa)}`;

  return (
    <>
      {/* Barra Flotante DevViewportBar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] select-none animate-fadeIn font-sans">
        {minimizado ? (
          <button
            onClick={() => setMinimizado(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 hover:bg-black text-amber-300 text-xs font-black shadow-2xl border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer"
            title="Mostrar barra de inspección multidispositivo"
          >
            <Eye size={15} weight="bold" />
            <span>DevViewport</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-950/95 text-white p-1.5 px-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-slate-700/80 backdrop-blur-xl">
            {/* Etiqueta Dev */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800 text-[11px] font-extrabold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">LOCAL</span>
            </div>

            {/* Acceso a Vista Móvil (Simulador) */}
            <a
              href={`${urlPreview}&device=mobile`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-colors"
              title="Simular en teléfono móvil (390 x 844 px)"
            >
              <DeviceMobile size={17} weight="bold" className="text-teal-400" />
              <span className="hidden md:inline">Móvil</span>
            </a>

            {/* Acceso a Vista Tableta */}
            <a
              href={`${urlPreview}&device=tablet`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-colors"
              title="Simular en tableta (820 x 1180 px)"
            >
              <DeviceTablet size={17} weight="bold" className="text-sky-400" />
              <span className="hidden md:inline">Tableta</span>
            </a>

            {/* Simulador Multi-pantalla Completo */}
            <a
              href={urlPreview}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-black shadow-xs transition-all border border-teal-500/40"
              title="Abrir simulador multidispositivo (/preview)"
            >
              <Desktop size={17} weight="bold" className="text-amber-300" />
              <span>Simulador</span>
            </a>

            {/* Recargar Página */}
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Recargar página"
            >
              <ArrowsClockwise size={16} weight="bold" />
            </button>

            {/* Abrir en Pestaña Nueva */}
            <a
              href={urlActual}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Abrir en pestaña independiente"
            >
              <ArrowSquareOut size={16} weight="bold" />
            </a>

            {/* Código QR para Celular Real en LAN */}
            <button
              onClick={() => setMostrarModalQR(true)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
              title="Probar en teléfono físico en la red local (QR)"
            >
              <QrCode size={17} weight="bold" />
            </button>

            {/* Minimizar */}
            <button
              onClick={() => setMinimizado(true)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors ml-1 cursor-pointer"
              title="Minimizar barra"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal QR para Pruebas en Hardware Real */}
      {mostrarModalQR && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} weight="bold" className="text-amber-400" />
                <h4 className="font-extrabold text-sm text-slate-100">Prueba en Celular Físico</h4>
              </div>
              <button
                onClick={() => setMostrarModalQR(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Conecta tu teléfono a la misma red Wi-Fi y escanea este código QR para probar la interfaz táctil directamente en hardware real:
            </p>

            <div className="bg-white p-3.5 rounded-xl flex items-center justify-center shadow-inner">
              {/* Render de QR Dinámico usando API nativa SVG rápida */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlActual)}`}
                alt="Código QR de prueba local"
                className="w-44 h-44 rounded-lg"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
              {urlActual}
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
    </>
  );
}
