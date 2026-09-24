"use client";

import React, { useState } from "react";
import {
  X,
  DeviceMobileCamera,
  AppleLogo,
  AndroidLogo,
  QrCode,
  CheckCircle,
  Sparkle,
  ArrowRight,
  Globe,
  WifiSlash,
} from "@phosphor-icons/react";

interface ModalGuiaPWAProps {
  isOpen: boolean;
  onClose: () => void;
  nivel?: string;
}

export default function ModalGuiaPWA({ isOpen, onClose, nivel = "9.° Año" }: ModalGuiaPWAProps) {
  const [tabActiva, setTabActiva] = useState<"iphone" | "android" | "huawei" | "flujo">("iphone");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative my-8">
        
        {/* Encabezado del Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0">
              <DeviceMobileCamera size={26} weight="duotone" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-black uppercase tracking-wider">
                  Manual de Instalación y Uso PWA
                </span>
                <span className="text-xs text-slate-400 font-bold">{nivel}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Guía del Escáner QR Móvil para Celulares
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Pestañas de Sistemas Operativos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTabActiva("iphone")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              tabActiva === "iphone"
                ? "bg-slate-800 text-white shadow-md border border-slate-600 font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AppleLogo size={16} weight="fill" />
            <span>iPhone (iOS)</span>
          </button>

          <button
            type="button"
            onClick={() => setTabActiva("android")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              tabActiva === "android"
                ? "bg-emerald-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <AndroidLogo size={16} weight="fill" />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setTabActiva("huawei")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              tabActiva === "huawei"
                ? "bg-rose-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe size={16} weight="bold" />
            <span>Huawei</span>
          </button>

          <button
            type="button"
            onClick={() => setTabActiva("flujo")}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              tabActiva === "flujo"
                ? "bg-amber-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <QrCode size={16} weight="bold" />
            <span>Flujo QR</span>
          </button>
        </div>

        {/* Contenido de la Pestaña Seleccionada */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 text-sm space-y-4">
          
          {tabActiva === "iphone" && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-indigo-300 font-black text-sm">
                <AppleLogo size={18} weight="fill" />
                <span>Instalación en iPhone (Safari / iOS)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apple requiere que las Web Apps se abran exclusivamente desde <strong>Safari</strong> para habilitar los permisos de cámara y funcionamiento sin conexión:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-200">
                <li className="leading-relaxed">
                  Abre el enlace del escáner en el navegador <strong>Safari</strong>.
                </li>
                <li className="leading-relaxed">
                  Toca el botón <strong>Compartir</strong> (icono de cuadrado con una flecha hacia arriba <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-[11px]">↑</span> en la barra inferior).
                </li>
                <li className="leading-relaxed">
                  Desplázate hacia abajo en el menú y selecciona <strong>"Agregar a inicio"</strong> (<em>Add to Home Screen</em>).
                </li>
                <li className="leading-relaxed">
                  Toca <strong>"Agregar"</strong> en la esquina superior derecha.
                </li>
                <li className="leading-relaxed">
                  ¡Listo! Abre el icono creado en tu pantalla de inicio y concede el permiso de cámara cuando te lo solicite.
                </li>
              </ol>
            </div>
          )}

          {tabActiva === "android" && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                <AndroidLogo size={18} weight="fill" />
                <span>Instalación en Android (Google Chrome)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                En Android puedes usar la Web App directamente desde Chrome o instalarla como aplicación nativa:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-200">
                <li className="leading-relaxed">
                  Abre el enlace del escáner en <strong>Google Chrome</strong>.
                </li>
                <li className="leading-relaxed">
                  Toca los <strong>tres puntos verticales (⋮)</strong> en la esquina superior derecha.
                </li>
                <li className="leading-relaxed">
                  Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                </li>
                <li className="leading-relaxed">
                  Confirma tocando <strong>"Instalar"</strong>.
                </li>
                <li className="leading-relaxed">
                  La aplicación quedará instalada y funcionará 100% sin internet.
                </li>
              </ol>
            </div>
          )}

          {tabActiva === "huawei" && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-rose-400 font-black text-sm">
                <Globe size={18} weight="bold" />
                <span>Instalación en Huawei (Huawei Browser)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para dispositivos Huawei con Huawei Mobile Services (HMS):
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-200">
                <li className="leading-relaxed">
                  Abre el enlace en el <strong>Navegador de Huawei</strong>.
                </li>
                <li className="leading-relaxed">
                  Toca el menú de opciones (icono de cuatro puntos o tres líneas en la barra de herramientas).
                </li>
                <li className="leading-relaxed">
                  Selecciona la opción <strong>"Agregar a la pantalla principal"</strong>.
                </li>
                <li className="leading-relaxed">
                  Confirma el acceso para tener el escáner accesible en un toque.
                </li>
              </ol>
            </div>
          )}

          {tabActiva === "flujo" && (
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
                <WifiSlash size={18} weight="bold" />
                <span>Flujo de Trabajo Desconectado (Paso a Paso)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cómo evaluar a un grupo completo en un laboratorio sin conexión a internet:
              </p>
              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                  <span><strong>En la computadora del estudiante:</strong> Ejecutan el archivo local <code className="text-amber-300">.html</code>. No requiere instalación ni conexión.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                  <span><strong>Generación del QR:</strong> Al finalizar la prueba, la pantalla del estudiante muestra su código QR con sus resultados encriptados y compactados.</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                  <span><strong>Captura docente:</strong> Abres tu Escáner QR en el celular y vas pasando por cada pantalla escaneando los códigos (toma 2 segundos por estudiante).</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[11px] flex items-center justify-center shrink-0">4</span>
                  <span><strong>Exportación consolidada:</strong> Al completar la sección, descargas el archivo en <strong>Excel (.csv)</strong> o <strong>JSON</strong> para cargarlo en el Dashboard.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Botón de Cierre */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all shadow-lg cursor-pointer"
          >
            Entendido, cerrar manual
          </button>
        </div>

      </div>
    </div>
  );
}
