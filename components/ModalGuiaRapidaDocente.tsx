"use client";

import React from "react";
import {
  X,
  CheckCircle,
  Lightbulb,
  NumberCircleOne,
  NumberCircleTwo,
  NumberCircleThree,
  DeviceMobileCamera,
  LinkSimple,
  FileXls,
  Sparkle,
} from "@phosphor-icons/react";

interface ModalGuiaRapidaDocenteProps {
  abierto: boolean;
  onCerrar: () => void;
}

export default function ModalGuiaRapidaDocente({ abierto, onCerrar }: ModalGuiaRapidaDocenteProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <Lightbulb size={28} weight="fill" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                Guía Visual • 1 Minuto
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                ¿Cómo aplicar el Diagnóstico en mi aula?
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar guía rápida"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Contenido de los 3 Pasos */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800">
          
          {/* Paso 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-black text-lg">
              1
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Seleccione su Nivel y Sección
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                En el <strong>Paso 1</strong> de la pantalla, elija el año (7.°, 8.° o 9.°) y toque el botón de su sección real (ejemplo: <strong>7-1</strong>). El sistema preparará automáticamente los reactivos correspondientes.
              </p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-black text-lg">
              2
            </div>
            <div className="space-y-2 flex-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Elija cómo aplicará la prueba a sus alumnos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-1">
                  <div className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                    <LinkSimple size={15} weight="bold" className="text-emerald-700" />
                    <span>Con Internet (En línea):</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Toque <strong>«Copiar Enlace para Alumnos»</strong> y compártalo o proyéctelo en la pizarra. Las notas llegan solas al panel.
                  </p>
                </div>

                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <DeviceMobileCamera size={15} weight="bold" className="text-amber-700" />
                    <span>Sin Internet (Offline):</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Los alumnos resuelven en computadoras y tocan <strong>Finalizar</strong>. Usted toca <strong>«Escanear con Celular»</strong> y lee el QR en pantalla.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 font-black text-lg">
              3
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-sm font-extrabold text-slate-900">
                Descargue su Acta Oficial en 1 Clic
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Vea cómo se llena su lista de estudiantes en tiempo real. Al finalizar la clase, toque <strong>«Descargar Acta en Excel»</strong> o <strong>«Descargar PDF»</strong> con el formato oficial del MEP.
              </p>
            </div>
          </div>

        </div>

        {/* Pie del Modal */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-4 flex items-center justify-between gap-4">
          <span className="text-[11px] text-stone-500 font-medium">
            💡 Todo se guarda automáticamente en su cuenta.
          </span>
          <button
            type="button"
            onClick={onCerrar}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <CheckCircle size={16} weight="bold" />
            <span>¡Entendido, empezar ahora!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
