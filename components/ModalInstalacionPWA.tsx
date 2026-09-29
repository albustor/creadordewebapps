"use client";

import React, { useState } from "react";
import {
  X,
  DeviceMobile,
  CheckCircle,
  ShareNetwork,
  DotsThreeVertical,
  PlusSquare,
  Globe,
  WifiSlash,
  ArrowSquareOut,
  Copy,
  Check,
  Sparkle
} from "@phosphor-icons/react";

interface ModalInstalacionPWAProps {
  abierto: boolean;
  alCerrar: () => void;
  urlApp?: string;
  nombreApp?: string;
}

export default function ModalInstalacionPWA({
  abierto,
  alCerrar,
  urlApp,
  nombreApp = "Web App Diagnóstica MEP",
}: ModalInstalacionPWAProps) {
  const [plataforma, setPlataforma] = useState<"android" | "ios" | "huawei">("android");
  const [copiado, setCopiado] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [instalado, setInstalado] = useState(false);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setInstalado(true);
      setDeferredPrompt(null);
    });
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (!abierto) return null;

  const handleInstalarDirecto = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalado(true);
      }
      setDeferredPrompt(null);
    }
  };

  const urlFinal =
    urlApp ||
    (typeof window !== "undefined"
      ? window.location.origin + "/diagnostico_escaner_datos_v3.html"
      : "https://diagnosticosecundaria.vercel.app/diagnostico_escaner_datos_v3.html");

  const handleCopiarEnlace = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(urlFinal).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Encabezado del Modal */}
        <div className="bg-gradient-to-r from-[#002b49] via-[#1B5E59] to-[#004641] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <DeviceMobile size={22} weight="bold" className="text-teal-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                Instalación y Activación en Celulares
              </h3>
              <p className="text-xs text-teal-100 font-medium">
                Guía paso a paso para Android, iPhone (iOS) y Huawei
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selector de Plataformas */}
        <div className="flex border-b border-slate-200 bg-slate-100/90 p-1.5 gap-1.5 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setPlataforma("android")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              plataforma === "android"
                ? "bg-white text-[#1B5E59] shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="text-base">🤖</span>
            <span>Android (Chrome / Edge)</span>
          </button>

          <button
            type="button"
            onClick={() => setPlataforma("ios")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              plataforma === "ios"
                ? "bg-white text-[#1B5E59] shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="text-base">🍎</span>
            <span>iPhone / iPad (Safari)</span>
          </button>

          <button
            type="button"
            onClick={() => setPlataforma("huawei")}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              plataforma === "huawei"
                ? "bg-white text-[#1B5E59] shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="text-base">🌸</span>
            <span>Huawei (Navegador Petal)</span>
          </button>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800">
          
          {/* Botón de Instalación Automática 1-Toque si el navegador lo soporta */}
          {deferredPrompt && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkle size={20} weight="fill" className="text-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight">Instalación Directa Detectada</h4>
                  <p className="text-xs text-emerald-100">Su dispositivo está listo para instalar la Web App con 1 toque.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstalarDirecto}
                className="w-full sm:w-auto px-4 py-2 bg-white text-emerald-900 font-extrabold text-xs rounded-lg shadow-sm hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
              >
                📲 Instalar App en Android
              </button>
            </div>
          )}

          {/* Tarjeta Explicativa de Funcionamiento Offline */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3.5 sm:p-4 flex items-start gap-3 text-xs leading-relaxed">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <WifiSlash size={18} weight="bold" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-950 text-xs sm:text-sm">
                ¿Por qué abrirlo en línea por primera vez?
              </h4>
              <p className="text-slate-700 mt-1">
                Al cargar el enlace con internet por primera vez, el navegador guarda en la memoria caché interna todos los recursos (escáner QR, rúbricas, estilos y lógica). Una vez añadido a la pantalla de inicio, <strong>funciona al 100% sin conexión en cualquier aula o zona rural</strong>.
              </p>
            </div>
          </div>

          {/* GUÍA ANDROID */}
          {plataforma === "android" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
                  Google Chrome • Samsung Internet • Microsoft Edge
                </span>
              </div>

              {/* Aclaración visual sobre el menú inferior de Android */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <span>💡</span>
                  <span>Opciones en el menú de Chrome:</span>
                </div>
                <p className="text-amber-900/90 leading-relaxed">
                  En el diálogo <strong>«Instalar y crear acceso directo»</strong> de Chrome:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li><strong>«Instalar»</strong>: Instala la app PWA autónoma en pantalla completa.</li>
                  <li><strong>«Crear acceso directo»</strong>: Crea el icono de acceso directo en tu pantalla de inicio con soporte 100% offline.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-[#1B5E59] text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Abrir el enlace en Chrome</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Abra el enlace del diagnóstico o del escáner en su navegador Google Chrome.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-[#1B5E59] text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Tocar el menú de opciones (⋮)</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Presione los <strong>tres puntos verticales</strong> en la esquina superior derecha del navegador.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-[#1B5E59] text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Instalar o Crear acceso directo</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Seleccione <strong>«Instalar aplicación»</strong> o <strong>«Agregar a la pantalla principal»</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-[#1B5E59] text-white flex items-center justify-center text-[10px]">4</span>
                    <span>Confirmar y listo</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Presione <strong>«Instalar»</strong> o <strong>«Crear acceso directo»</strong>. La Web App se ejecutará con su icono oficial en su celular.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GUÍA IPHONE / IOS */}
          {plataforma === "ios" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold border border-sky-300">
                  Safari Oficial de Apple (iOS / iPadOS)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Abrir exclusivamente en Safari</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Apple requiere abrir el enlace en <strong>Safari</strong> para poder guardarlo como Web App local.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Tocar el botón Compartir</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Toque el icono de <strong>Compartir</strong> (cuadrado con flecha hacia arriba <span className="font-bold">⎋</span>) en la barra inferior.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Seleccionar «Agregar al inicio»</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Deslice hacia abajo en el menú de opciones y toque <strong>«Agregar al inicio» (Add to Home Screen ➕)</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-sky-700 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>Presionar «Agregar»</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Toque <strong>«Agregar»</strong> en la esquina superior derecha. El icono oficial aparecerá en el menú de apps de su iPhone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* GUÍA HUAWEI */}
          {plataforma === "huawei" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold border border-rose-300">
                  Navegador Huawei • Petal Search • AppGallery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>Abrir en Navegador Huawei</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Abra el enlace en el navegador nativo de Huawei o en Petal Browser.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>Tocar el menú de herramientas</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Presione el botón de menú (cuatro puntos <span className="font-bold">:::</span> o engranaje en la barra de herramientas).
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Añadir a pantalla de inicio</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    Seleccione la opción <strong>«Añadir a pantalla de inicio»</strong> o <strong>«Crear acceso directo»</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-rose-700 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>Acceso 100% Offline</span>
                  </div>
                  <p className="text-slate-600 pl-7">
                    No requiere los servicios de Google Play. Se ejecutará directamente desde el chip local del dispositivo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enlace y Acciones Rápidas */}
          <div className="bg-slate-100 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              Enlace de la Web App para enviar o abrir en el teléfono:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={urlFinal}
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopiarEnlace}
                className="inline-flex items-center gap-1.5 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                {copiado ? <Check size={15} weight="bold" /> : <Copy size={15} />}
                <span>{copiado ? "Copiado" : "Copiar"}</span>
              </button>
              <a
                href={urlFinal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
              >
                <ArrowSquareOut size={15} />
                <span>Abrir</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Formación Tecnológica • MEP Costa Rica
          </span>
          <button
            type="button"
            onClick={alCerrar}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            Entendido, cerrar guía
          </button>
        </div>

      </div>
    </div>
  );
}
