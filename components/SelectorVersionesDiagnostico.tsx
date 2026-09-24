"use client";

import React, { useState } from "react";
import {
  GlobeHemisphereWest,
  HardDrive,
  Laptop,
  CheckCircle,
  Copy,
  Check,
  DownloadSimple,
  ArrowSquareOut,
  QrCode,
  Sparkle,
  Question,
  CaretDown,
  CaretUp,
  ShieldCheck,
  Lightning,
  ChalkboardTeacher,
} from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { NivelEducativo, obtenerDiagnosticoPorNivel } from "@/lib/diagnosticos";

import { useDocente } from "@/context/DocenteContext";

interface SelectorVersionesDiagnosticoProps {
  nivel?: NivelEducativo;
  docenteNombre?: string;
  institucionNombre?: string;
}

export default function SelectorVersionesDiagnostico({
  nivel = "8°",
  docenteNombre,
  institucionNombre,
}: SelectorVersionesDiagnosticoProps) {
  const { docente } = useDocente();
  const [copiadoOnline, setCopiadoOnline] = useState(false);
  const [copiadoDocente, setCopiadoDocente] = useState(false);
  const [modalQROnline, setModalQROnline] = useState(false);
  const [modalQRDocente, setModalQRDocente] = useState(false);
  const [guiaAbierta, setGuiaAbierta] = useState(false);

  const diagConfig = obtenerDiagnosticoPorNivel(nivel);

  // Determinar centro educativo y secciones asignadas para este nivel
  const nivelNum = nivel.replace(/\D/g, ""); // "7", "8", "9"
  const centrosConNivel = (docente?.centrosEducativos || []).filter((c) =>
    (c.desgloseNiveles || []).some((dn) => dn.nivel.includes(nivelNum) && dn.activo === true)
  );

  const centroSeleccionado = centrosConNivel[0] || (docente?.centrosEducativos && docente.centrosEducativos[0]);
  const desgloseNivelActivo = centroSeleccionado?.desgloseNiveles?.find((dn) => dn.nivel.includes(nivelNum));
  const seccionesDocente = desgloseNivelActivo?.seccionesAtendidasDocente || [`${nivelNum}-1`];

  const docNomFinal = docenteNombre || docente?.nombreCompleto || "Alberto Bustos Ortega";
  const instNomFinal = institucionNombre || centroSeleccionado?.nombre || docente?.institucionNombre || "Centro Educativo MEP";
  const docIdFinal = docente?.idDocente || docente?.cedula || "5-0305-0179";
  const dreFinal = centroSeleccionado?.dreCodigo || centroSeleccionado?.dreNombre || docente?.dreCodigo || docente?.dreNombre || "DRE-01";
  const circuitoFinal = centroSeleccionado?.circuito || docente?.circuito || "Circuito 01";

  const queryParams = new URLSearchParams();
  queryParams.set("docente", docNomFinal);
  if (docente?.idDocente) {
    queryParams.set("docenteId", docente.idDocente);
  }
  queryParams.set("institucion", instNomFinal);
  queryParams.set("dre", dreFinal);
  queryParams.set("circuito", circuitoFinal);
  queryParams.set("nivel", nivel);
  if (seccionesDocente.length > 0) {
    queryParams.set("secciones", seccionesDocente.join(","));
  }

  const queryString = `?${queryParams.toString()}`;

  // Rutas dinámicas según el nivel
  let pathOnline = "/webapps/diagnostico_8vo_modulo01_en_linea.html";
  let pathOffline = "/webapps/diagnostico_8vo_modulo01_desconectado_offline.html";
  let pathDocente = "/webapps/diagnostico_8vo_modulo01_docente_evaluador.html";

  if (nivel === "7°") {
    pathOnline = "/webapps/diagnostico_7mo_modulo01_cyberquest.html";
    pathOffline = "/webapps/diagnostico_7mo_modulo01_cyberquest.html";
    pathDocente = "/webapps/diagnostico_7mo_modulo01_docente_evaluador.html";
  } else if (nivel === "9°") {
    pathOnline = "/webapps/diagnostico_9no_modulo01_en_linea.html";
    pathOffline = "/webapps/diagnostico_9no_modulo01_desconectado_offline.html";
    pathDocente = "/webapps/diagnostico_9no_modulo01_docente_evaluador.html";
  }

  const urlOnline =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathOnline}`
      : pathOnline;

  const urlOffline = pathOffline;

  const urlDocente =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathDocente}`
      : pathDocente;

  const copiarEnlaceOnline = () => {
    navigator.clipboard.writeText(urlOnline);
    setCopiadoOnline(true);
    setTimeout(() => setCopiadoOnline(false), 2500);
  };

  const copiarEnlaceDocente = () => {
    navigator.clipboard.writeText(urlDocente);
    setCopiadoDocente(true);
    setTimeout(() => setCopiadoDocente(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. AVISO OBLIGATORIO: EXCLUSIVO PARA COMPUTADORAS */}
      <div className="p-5 bg-sky-50/90 border border-sky-200/90 rounded-3xl text-slate-900 shadow-softPastel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center shrink-0">
            <Laptop size={28} weight="duotone" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-900">
                Requisito oficial de aplicación • {nivel} Año
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-900 border border-sky-300">
                100% computadoras
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              Este instrumento de diagnóstico para <strong>{nivel} Año ({diagConfig.totalReactivosCognitivos} reactivos oficiales)</strong> fue diseñado para laboratorios de cómputo, laptops y PCs de escritorio. Compatible con Google Chrome, Microsoft Edge, Mozilla Firefox y Brave.
            </p>
          </div>
        </div>

        <button
          onClick={() => setGuiaAbierta(!guiaAbierta)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
        >
          <Question size={16} weight="bold" />
          <span>{guiaAbierta ? "Ocultar guía" : "¿Cómo y cuándo usar?"}</span>
          {guiaAbierta ? <CaretUp size={14} /> : <CaretDown size={14} />}
        </button>
      </div>

      {/* 2. GUÍA PEDAGÓGICA DESPLEGABLE */}
      {/* 2. GUÍA PEDAGÓGICA DESPLEGABLE */}
      {guiaAbierta && (
        <div className="p-6 bg-stone-50 border border-stone-200 rounded-3xl space-y-4 animate-fadeIn shadow-xs">
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Sparkle size={18} className="text-amber-600" weight="fill" />
            <span>Protocolo de Aplicación y Telemetría en Tiempo Real ({nivel} Año)</span>
          </h4>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs">
            <div className="font-extrabold text-emerald-950 flex items-center gap-1.5 text-sm">
              <GlobeHemisphereWest size={18} weight="bold" className="text-emerald-700" />
              <span>¿Cómo aplicar la evaluación diagnóstica con tus estudiantes?</span>
            </div>
            <ul className="list-disc list-inside text-slate-700 space-y-1.5 font-medium text-[11.5px] leading-relaxed">
              <li><strong>Compartir el Enlace:</strong> Proyecta el código QR o copia y comparte el enlace de <em>Estudiantes en Línea</em> en el laboratorio.</li>
              <li><strong>Identificación Automática:</strong> El enlace ya lleva precargado tu nombre como docente y tu institución de forma inmutable.</li>
              <li><strong>Recepción en Vivo:</strong> Conforme los estudiantes contestan y completan la simulación, sus calificaciones e indicadores se reflejan en tu <strong>Dashboard Docente</strong> y en el <strong>Módulo Evaluador</strong> en tiempo real.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 3. TARJETAS DE ACCESO DIRECTO A LAS VERSIONES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TARJETA 1: VERSIÓN EN LÍNEA (ESTUDIANTE) */}
        <div className="bg-white border-2 border-emerald-200/90 rounded-3xl p-6 text-slate-900 shadow-softPastel flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Aplicación en Línea</span>
              </span>
              <span className="text-xs font-bold text-emerald-700">{nivel} Año</span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                ESTUDIANTES EN LÍNEA
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                Ejecución directa desde el navegador. Envía los resultados y los indicadores cognitivos en tiempo real a tu sistema.
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <a
              href={urlOnline}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black transition-all shadow-xs"
            >
              <ArrowSquareOut size={16} weight="bold" />
              <span>Abrir en Nueva Pestaña</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copiarEnlaceOnline}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200"
              >
                {copiadoOnline ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                <span>{copiadoOnline ? "¡Copiado!" : "Copiar Enlace"}</span>
              </button>

              <button
                onClick={() => setModalQROnline(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200"
              >
                <QrCode size={14} />
                <span>Proyectar QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* TARJETA 2: MÓDULO DOCENTE EVALUADOR */}
        <div className="bg-white border-2 border-indigo-200/90 rounded-3xl p-6 text-slate-900 shadow-softPastel flex flex-col justify-between hover:border-indigo-400 transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <ChalkboardTeacher size={14} className="text-indigo-700" />
                <span>Herramienta Docente</span>
              </span>
              <span className="text-xs font-bold text-indigo-700">Rúbricas + Telemetría</span>
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                MÓDULO EVALUADOR {nivel}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                Visualiza los resultados en tiempo real, evalúa las dimensiones socioafectiva y psicomotora, y exporta a Excel oficial MEP.
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <a
              href={urlDocente}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black transition-all shadow-xs"
            >
              <ArrowSquareOut size={16} weight="bold" />
              <span>Abrir Módulo Evaluador</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copiarEnlaceDocente}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[11px] font-bold border border-indigo-200"
              >
                {copiadoDocente ? <Check size={14} className="text-indigo-700" /> : <Copy size={14} />}
                <span>{copiadoDocente ? "¡Copiado!" : "Copiar Enlace"}</span>
              </button>

              <button
                onClick={() => setModalQRDocente(true)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-[11px] font-bold border border-indigo-200"
              >
                <QrCode size={14} />
                <span>Proyectar QR</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL PROYECCIÓN QR ESTUDIANTE */}
      {modalQROnline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              Acceso al Diagnóstico de {nivel} Año
            </h3>
            <p className="text-xs text-slate-600">
              Proyecta este código en la pizarra para que los estudiantes ingresen desde sus computadoras.
            </p>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex justify-center">
              <QRCodeSVG value={urlOnline} size={220} />
            </div>

            <div className="text-[11px] font-mono bg-stone-100 p-2 rounded-lg break-all text-slate-700">
              {urlOnline}
            </div>

            <button
              onClick={() => setModalQROnline(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold"
            >
              Cerrar Proyección
            </button>
          </div>
        </div>
      )}

      {/* MODAL PROYECCIÓN QR DOCENTE */}
      {modalQRDocente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900">
              Módulo Evaluador Docente ({nivel} Año)
            </h3>
            <p className="text-xs text-slate-600">
              Escanea este código con tu teléfono móvil o tableta para usarlo como escáner QR en el laboratorio.
            </p>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex justify-center">
              <QRCodeSVG value={urlDocente} size={220} />
            </div>

            <div className="text-[11px] font-mono bg-stone-100 p-2 rounded-lg break-all text-slate-700">
              {urlDocente}
            </div>

            <button
              onClick={() => setModalQRDocente(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
