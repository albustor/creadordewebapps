"use client";

import React, { useState } from "react";
import {
  ArrowsOut,
  ArrowsIn,
  ArrowsClockwise,
  DeviceMobile,
  DeviceTablet,
  Desktop,
  DownloadSimple,
  AppleLogo,
  AndroidLogo,
  DeviceMobileCamera,
  ShareNetwork,
} from "@phosphor-icons/react";
import { estabilizarHtmlConAntigravityShield } from "@/lib/antigravityShield";

interface WebAppPreviewFrameProps {
  codigoHTML: string;
  titulo: string;
  docenteId?: string;
  docenteNombre?: string;
  onDescargar?: () => void;
}

export default function WebAppPreviewFrame({
  codigoHTML,
  titulo,
  docenteId,
  docenteNombre,
  onDescargar,
}: WebAppPreviewFrameProps) {
  const [modoDispositivo, setModoDispositivo] = useState<"desktop" | "tablet" | "iphone" | "android">("iphone");
  const [orientacion, setOrientacion] = useState<"portrait" | "landscape">("portrait");
  const [recargarKey, setRecargarKey] = useState(0);

  const htmlEstabilizado = estabilizarHtmlConAntigravityShield(codigoHTML, {
    titulo: titulo || "WebApp Educativa",
    docenteNombre: docenteNombre || "Docente MEP",
    docenteId: docenteId || "DOC-DRE01-7729",
  });

  const getContainerStyles = () => {
    switch (modoDispositivo) {
      case "iphone":
        return orientacion === "portrait"
          ? "w-[380px] h-[740px] rounded-[48px] border-[12px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-slate-700"
          : "w-[740px] h-[380px] rounded-[48px] border-[12px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] ring-1 ring-slate-700";
      case "android":
        return orientacion === "portrait"
          ? "w-[380px] h-[720px] rounded-[36px] border-[8px] border-slate-800 shadow-2xl ring-1 ring-slate-700"
          : "w-[720px] h-[380px] rounded-[36px] border-[8px] border-slate-800 shadow-2xl ring-1 ring-slate-700";
      case "tablet":
        return orientacion === "portrait"
          ? "w-[680px] h-[780px] rounded-[32px] border-[10px] border-slate-800 shadow-2xl"
          : "w-[880px] h-[600px] rounded-[32px] border-[10px] border-slate-800 shadow-2xl";
      default:
        return "w-full h-[680px] rounded-2xl border border-slate-700 shadow-xl";
    }
  };

  const recargarIframe = () => {
    setRecargarKey((prev) => prev + 1);
  };

  const toggleOrientacion = () => {
    setOrientacion((prev) => (prev === "portrait" ? "landscape" : "portrait"));
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col">
      {/* Barra Superior de Controles */}
      <div className="bg-slate-950 px-5 py-3.5 flex flex-wrap items-center justify-between border-b border-slate-800 text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="font-bold text-slate-200 ml-2 truncate max-w-xs">{titulo || "Simulador en Vivo"}</span>
        </div>

        {/* Selector de Dispositivos Realistas */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setModoDispositivo("iphone")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
              modoDispositivo === "iphone"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vista iPhone (Safari)"
          >
            <AppleLogo size={15} weight="fill" />
            <span>iPhone</span>
          </button>
          <button
            onClick={() => setModoDispositivo("android")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
              modoDispositivo === "android"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vista Android (Chrome)"
          >
            <AndroidLogo size={15} weight="fill" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setModoDispositivo("tablet")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
              modoDispositivo === "tablet"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vista iPad / Tableta"
          >
            <DeviceTablet size={15} weight="bold" />
            <span>Tableta</span>
          </button>
          <button
            onClick={() => setModoDispositivo("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
              modoDispositivo === "desktop"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vista Computadora / Laboratorio"
          >
            <Desktop size={15} weight="bold" />
            <span>Monitor</span>
          </button>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center gap-2">
          {modoDispositivo !== "desktop" && (
            <button
              onClick={toggleOrientacion}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              title="Girar dispositivo"
            >
              <DeviceMobileCamera size={14} weight="bold" />
              <span>{orientacion === "portrait" ? "Vertical" : "Horizontal"}</span>
            </button>
          )}

          <button
            onClick={recargarIframe}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reiniciar Simulación"
          >
            <ArrowsClockwise size={16} weight="bold" />
          </button>

          {onDescargar && (
            <button
              onClick={onDescargar}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-colors shadow-xs"
            >
              <DownloadSimple size={14} weight="bold" />
              <span>Guardar .html</span>
            </button>
          )}
        </div>
      </div>

      {/* Escenario de Simulación */}
      <div className="p-6 bg-slate-950 flex justify-center items-center overflow-auto min-h-[560px]">
        <div className={`${getContainerStyles()} transition-all duration-300 overflow-hidden bg-white relative flex flex-col`}>
          {/* Dynamic Island / Notch si es iPhone */}
          {modoDispositivo === "iphone" && orientacion === "portrait" && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 pointer-events-none flex items-center justify-end px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 inline-block" />
            </div>
          )}

          <iframe
            key={recargarKey}
            srcDoc={htmlEstabilizado}
            title={titulo || "WebApp"}
            className="w-full h-full border-none bg-white flex-1"
            sandbox="allow-scripts allow-modals allow-same-origin allow-downloads allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
