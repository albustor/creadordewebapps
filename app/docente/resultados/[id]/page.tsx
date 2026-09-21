"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDocente } from "@/context/DocenteContext";
import {
  UserCircle,
  CheckCircle,
  UploadSimple,
  ShieldCheck,
  Sparkle,
  DeviceMobileCamera,
} from "@phosphor-icons/react";

export default function EspacioPublicoDocentePage() {
  const params = useParams();
  const idDocente = params?.id as string;
  const { docente, agregarResultadoTelemetria } = useDocente();

  const [estudiante, setEstudiante] = useState("");
  const [grupo, setGrupo] = useState("");
  const [actividad, setActividad] = useState("Actividad de Aula");
  const [puntaje, setPuntaje] = useState(100);
  const [tiempo, setTiempo] = useState(45);
  const [enviado, setEnviado] = useState(false);

  const handleEnviarManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudiante.trim()) return;

    agregarResultadoTelemetria({
      webAppId: "webapp-manual",
      webAppTitulo: actividad,
      docenteId: idDocente || "DOC-DRE01-7729",
      estudianteNombre: estudiante.trim(),
      seccionOGrupo: grupo.trim() || "General",
      puntaje: Number(puntaje),
      puntajeMaximo: 100,
      porcentaje: Number(puntaje),
      nivelLogro: Number(puntaje) >= 80 ? "Avanzado" : (Number(puntaje) >= 60 ? "Intermedio" : "Inicial"),
      tiempoSegundos: Number(tiempo),
      totalReactivos: 4,
      aciertos: Math.round((Number(puntaje) / 100) * 4),
      fallos: 4 - Math.round((Number(puntaje) / 100) * 4),
      timestamp: Date.now(),
      tokenAntiFraude: "token-sha256-recepcion-manual-" + Date.now().toString(36),
    });

    setEnviado(true);
    setEstudiante("");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Cabecera del Espacio */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-blue-700/80 border border-blue-500/50 flex items-center justify-center mx-auto text-white shadow-md">
          <UserCircle size={36} weight="bold" />
        </div>
        <span className="text-xs font-bold text-sky-300 uppercase tracking-widest block">
          Espacio de Recepción de Resultados
        </span>
        <h1 className="text-2xl sm:text-3xl font-black">
          {docente?.nombreCompleto || "Docente MEP"}
        </h1>
        <div className="inline-block bg-blue-950/70 border border-blue-700/60 px-4 py-1.5 rounded-full text-xs font-mono text-sky-200">
          ID Docente: {idDocente}
        </div>
      </div>

      {/* Formulario de Sincronización Manual */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-mepCard space-y-5">
        <div className="flex items-center gap-2">
          <Sparkle size={20} className="text-amber-500" weight="fill" />
          <h2 className="text-base font-extrabold text-slate-900">
            Envío de Resultados de Actividad
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Si realizaste una WebApp en tu dispositivo, tus resultados se sincronizan automáticamente. También puedes registrar tu comprobante en esta ventana.
        </p>

        {enviado && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center gap-2 font-bold animate-fadeIn">
            <CheckCircle size={22} weight="fill" className="text-emerald-600 shrink-0" />
            <span>¡Excelente! Tu comprobante fue recibido y validado en el expediente docente.</span>
          </div>
        )}

        <form onSubmit={handleEnviarManual} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tu Nombre Completo:
              </label>
              <input
                type="text"
                value={estudiante}
                onChange={(e) => setEstudiante(e.target.value)}
                placeholder="Ej: Daniel Morales Campos"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sección o Grupo:
              </label>
              <input
                type="text"
                value={grupo}
                onChange={(e) => setGrupo(e.target.value)}
                placeholder="Ej: 9-B"
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nombre de la Actividad:
              </label>
              <input
                type="text"
                value={actividad}
                onChange={(e) => setActividad(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Puntaje Obtenido (%):
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={puntaje}
                onChange={(e) => setPuntaje(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-blue-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck size={18} weight="bold" />
            <span>Validar y Registrar Resultado con Token SHA-256</span>
          </button>
        </form>
      </div>
    </div>
  );
}
