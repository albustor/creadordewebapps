"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  Copy,
  Check,
  WhatsappLogo,
  DownloadSimple,
  ArrowsOut,
  ArrowsIn,
  ChalkboardTeacher,
} from "@phosphor-icons/react";

interface QRModalProyeccionProps {
  abierto: boolean;
  alCerrar: () => void;
  urlWebApp: string;
  titulo: string;
  asignatura: string;
  nivel: string;
  docenteNombre?: string;
}

export default function QRModalProyeccion({
  abierto,
  alCerrar,
  urlWebApp,
  titulo,
  asignatura,
  nivel,
  docenteNombre,
}: QRModalProyeccionProps) {
  const [copiado, setCopiado] = useState(false);
  const [pantallaCompleta, setPantallaCompleta] = useState(false);

  if (!abierto) return null;

  const copiarEnlace = () => {
    navigator.clipboard.writeText(urlWebApp);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const compartirWhatsApp = () => {
    const texto = `👋 Hola estudiantes, aquí está el enlace para ingresar a la actividad interactiva: *"${titulo}"* (${asignatura} - ${nivel})\n\n🔗 ${urlWebApp}\n\n¡Mucho éxito en el reto! 🚀`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
  };

  const alternarPantallaCompleta = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setPantallaCompleta(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setPantallaCompleta(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-900 w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Cabecera Proyector */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white">
              <ChalkboardTeacher size={24} weight="bold" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300 block">
                Modo Proyección de Aula
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">{titulo}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={alternarPantallaCompleta}
              className="p-2 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white transition-colors"
              title="Pantalla Completa"
            >
              {pantallaCompleta ? <ArrowsIn size={20} /> : <ArrowsOut size={20} />}
            </button>
            <button
              onClick={alCerrar}
              className="p-2 rounded-xl bg-blue-800/80 hover:bg-rose-600 text-white transition-colors"
              title="Cerrar"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal con QR Gigante */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-900 font-bold text-xs rounded-full uppercase tracking-wider">
              {asignatura}
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full uppercase tracking-wider">
              {nivel}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            ¡Escanea el código para ingresar al reto!
          </h3>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            Apunta la cámara de tu celular o tableta hacia el código QR o haz clic en el enlace inferior.
          </p>

          {/* Contenedor QR de Alta Resolución */}
          <div className="p-4 sm:p-6 bg-white rounded-2xl border-4 border-slate-900 shadow-xl mb-6 inline-block">
            <QRCodeSVG
              value={urlWebApp}
              size={260}
              level="H"
              includeMargin={true}
              fgColor="#001F3F"
              imageSettings={{
                src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230055A5'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>",
                x: undefined,
                y: undefined,
                height: 38,
                width: 38,
                excavate: true,
              }}
            />
          </div>

          {/* Enlace Directo */}
          <div className="w-full max-w-lg bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
            <span className="font-mono text-xs sm:text-sm text-blue-950 font-bold truncate select-all">
              {urlWebApp}
            </span>
            <button
              onClick={copiarEnlace}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copiado
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-700 text-white hover:bg-blue-800"
              }`}
            >
              {copiado ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
              {copiado ? "¡Copiado!" : "Copiar"}
            </button>
          </div>

          {/* Guía Rápida de Instalación como App en Teléfonos (Especial iPhone / iOS y Android) */}
          <div className="w-full max-w-lg bg-sky-50 border border-sky-200 rounded-2xl p-4 text-left space-y-2 mb-5">
            <div className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
              <span>📲</span>
              <span>¿Cómo instalarla en la pantalla de inicio del celular (PWA)?</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 leading-snug">
              <div className="p-2.5 bg-white rounded-xl border border-sky-100 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-0.5">🍎 En iPhone / iPad (Safari):</span>
                1. Abre el enlace en <strong>Safari</strong>.<br />
                2. Toca el botón <strong>Compartir</strong> 📤 (cuadrado con flecha hacia arriba).<br />
                3. Selecciona <strong>«Agregar a inicio»</strong> ➕.
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-sky-100 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-0.5">🤖 En Android (Chrome):</span>
                1. Abre el enlace en <strong>Google Chrome</strong>.<br />
                2. Toca el aviso <strong>«Instalar aplicación»</strong> o el menú (⋮).<br />
                3. Elige <strong>«Agregar a la pantalla principal»</strong>.
              </div>
            </div>
          </div>

          {/* Botones de Difusión */}
          <div className="flex flex-wrap gap-3 justify-center w-full max-w-lg">
            <button
              onClick={compartirWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
            >
              <WhatsappLogo size={20} weight="fill" />
              Enviar a WhatsApp
            </button>
            <a
              href={urlWebApp}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
            >
              Abrir WebApp Directa ➔
            </a>
          </div>

          {docenteNombre && (
            <div className="mt-5 text-xs text-slate-500 font-medium">
              Sesión guiada por: <span className="font-bold text-slate-700">{docenteNombre}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
