"use client";

import React from "react";
import { PayloadTelemetria } from "@/lib/antiFraude";
import { WarningCircle, ChartPie, CheckSquare, TrendUp } from "@phosphor-icons/react";

interface AnaliticaReactivosProps {
  registros: PayloadTelemetria[];
}

export default function AnaliticaReactivos({ registros }: AnaliticaReactivosProps) {
  // Consolidar reactivos de todos los envíos
  const conteoReactivos: Record<
    string,
    { pregunta: string; totalRespuestas: number; fallos: number; aciertos: number }
  > = {};

  registros.forEach((r) => {
    if (r.detallesReactivos && r.detallesReactivos.length > 0) {
      r.detallesReactivos.forEach((d) => {
        if (!conteoReactivos[d.pregunta]) {
          conteoReactivos[d.pregunta] = {
            pregunta: d.pregunta,
            totalRespuestas: 0,
            fallos: 0,
            aciertos: 0,
          };
        }
        conteoReactivos[d.pregunta].totalRespuestas++;
        if (d.esCorrecto) {
          conteoReactivos[d.pregunta].aciertos++;
        } else {
          conteoReactivos[d.pregunta].fallos++;
        }
      });
    }
  });

  const listaReactivos = Object.values(conteoReactivos).sort((a, b) => {
    const tasaFalloB = b.totalRespuestas > 0 ? b.fallos / b.totalRespuestas : 0;
    const tasaFalloA = a.totalRespuestas > 0 ? a.fallos / a.totalRespuestas : 0;
    return tasaFalloB - tasaFalloA;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <ChartPie size={20} className="text-blue-700" weight="duotone" />
            <span>Analítica de Reactivos y Preguntas Desafiantes</span>
          </h3>
          <p className="text-xs text-slate-500">
            Identificación instantánea de conceptos donde el grupo presentó mayor dificultad
          </p>
        </div>
      </div>

      {listaReactivos.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <CheckSquare size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-xs text-slate-500">
            Aún no hay reactivos individuales detallados registrados en las sesiones seleccionadas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {listaReactivos.map((item, idx) => {
            const tasaFallo =
              item.totalRespuestas > 0
                ? Math.round((item.fallos / item.totalRespuestas) * 100)
                : 0;
            const esCritico = tasaFallo >= 40;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  esCritico
                    ? "bg-rose-50/70 border-rose-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${
                        esCritico
                          ? "bg-rose-600 text-white"
                          : "bg-blue-800 text-white"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.pregunta}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                      esCritico
                        ? "bg-rose-200 text-rose-900"
                        : "bg-emerald-100 text-emerald-900"
                    }`}
                  >
                    {tasaFallo}% error
                  </span>
                </div>

                {/* Barra de Progresión de Aciertos / Fallos */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${100 - tasaFallo}%`,
                      }}
                      className="bg-emerald-500 h-full"
                    />
                    <div style={{ width: `${tasaFallo}%` }} className="bg-rose-500 h-full" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span className="text-emerald-700 font-bold">
                      {item.aciertos} aciertos ({100 - tasaFallo}%)
                    </span>
                    <span className="text-rose-700 font-bold">
                      {item.fallos} fallos ({tasaFallo}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
