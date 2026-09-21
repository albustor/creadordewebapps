"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  Copy,
  Check,
  ArrowsOut,
  ArrowsIn,
  ChalkboardTeacher,
  Desktop,
  ArrowSquareOut,
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
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-emerald-900 w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Cabecera Proyector */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
              <ChalkboardTeacher size={24} weight="bold" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 block">
                Modo proyección de aula • Laboratorio
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white line-clamp-1">{titulo}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={alternarPantallaCompleta}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white transition-colors"
              title="Pantalla completa"
            >
              {pantallaCompleta ? <ArrowsIn size={20} /> : <ArrowsOut size={20} />}
            </button>
            <button
              onClick={alCerrar}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-rose-600 text-white transition-colors"
              title="Cerrar"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal con QR */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center overflow-y-auto">
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold text-xs rounded-full uppercase tracking-wider">
              {asignatura}
            </span>
            <span className="px-3 py-1 bg-teal-100 text-teal-900 font-bold text-xs rounded-full uppercase tracking-wider">
              {nivel}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            Acceso al diagnóstico en computadoras de laboratorio
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-6">
            Abra el enlace directo en las computadoras del laboratorio o proyecte el acceso para los estudiantes.
          </p>

          {/* Contenedor QR */}
          <div className="p-4 sm:p-6 bg-white rounded-2xl border-4 border-slate-900 shadow-xl mb-6 inline-block">
            <QRCodeSVG
              value={urlWebApp}
              size={240}
              level="H"
              includeMargin={true}
              fgColor="#064e3b"
            />
          </div>

          {/* Enlace Directo */}
          <div className="w-full max-w-lg bg-slate-100 border border-slate-300 rounded-xl p-3 flex items-center justify-between gap-2 mb-4">
            <span className="font-mono text-xs sm:text-sm text-emerald-950 font-bold truncate select-all">
              {urlWebApp}
            </span>
            <button
              onClick={copiarEnlace}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                copiado
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-700 text-white hover:bg-emerald-800"
              }`}
            >
              {copiado ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
              {copiado ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>

          {/* Nota de optimización para computadoras de laboratorios */}
          <div className="w-full max-w-lg bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-1.5 mb-5">
            <div className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
              <Desktop size={16} className="text-emerald-700" />
              <span>Optimizado para computadoras de laboratorios, PCs y portátiles</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              El instrumento interactivo está diseñado para su ejecución en navegadores web en computadoras de escritorio y portátiles de laboratorios de informática.
            </p>
          </div>

          {/* Botón de apertura directa */}
          <div className="w-full max-w-lg">
            <a
              href={urlWebApp}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg"
            >
              <ArrowSquareOut size={18} weight="bold" />
              <span>Abrir diagnóstico en esta computadora</span>
            </a>
          </div>

          {docenteNombre && (
            <div className="mt-5 text-xs text-slate-500 font-medium">
              Sesión a cargo de: <span className="font-bold text-slate-700">{docenteNombre}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
