"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDocente } from "@/context/DocenteContext";
import { generarCodigoHTMLAutonomo } from "@/lib/generadorWebAppEngine";
import { obtenerProduccionConHTML } from "@/lib/comunidadData";
import QRModalProyeccion from "@/components/QRModalProyeccion";
import {
  DownloadSimple,
  ChalkboardTeacher,
  ArrowLeft,
  ShareNetwork,
  DeviceMobile,
  Desktop,
  WarningCircle,
  ArrowsClockwise,
} from "@phosphor-icons/react";

export default function PlayWebAppPage() {
  const params = useParams();
  const router = useRouter();
  const { webApps, webAppsComunidad, docente } = useDocente();
  const id = params?.id as string;

  const [codigoHTML, setCodigoHTML] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("WebApp Educativa");
  const [asignatura, setAsignatura] = useState<string>("General");
  const [nivel, setNivel] = useState<string>("7° Año - Secundaria");
  const [modalQR, setModalQR] = useState(false);

  useEffect(() => {
    // 1. Verificar si es una WebApp especializada de diagnóstico
    if (id === "com-9-diag-aula-inteligente" || id === "diag-9no-mod01-aula-inteligente") {
      fetch("/webapps/diagnostico_9no_modulo01_aula_inteligente.html")
        .then((r) => (r.ok ? r.text() : ""))
        .then((html) => {
          if (html) {
            setCodigoHTML(html);
            setTitulo("Diagnóstico Integrado 9°: «Aula Inteligente»");
            setAsignatura("Computación Física y Robótica");
            setNivel("9° Año - Secundaria");
          }
        })
        .catch(() => {});
      return;
    }

    if (id === "com-9-diag-docente-evaluador") {
      fetch("/webapps/diagnostico_9no_modulo01_docente_evaluador.html")
        .then((r) => (r.ok ? r.text() : ""))
        .then((html) => {
          if (html) {
            setCodigoHTML(html);
            setTitulo("Evaluador Diagnóstico Docente 9° (Nómina y Rúbrica MEP)");
            setAsignatura("Computación Física y Robótica");
            setNivel("9° Año - Secundaria");
          }
        })
        .catch(() => {});
      return;
    }

    // 2. Buscar en catálogo personal guardado
    const encontrada = webApps.find((w) => w.id === id);
    if (encontrada) {
      setCodigoHTML(encontrada.codigoHTML);
      setTitulo(encontrada.titulo);
      setAsignatura(encontrada.asignatura);
      setNivel(encontrada.nivel);
      return;
    }

    // 3. Buscar en catálogo del espacio común / comunidad
    const encontradaCom = webAppsComunidad.find((w) => w.id === id);
    if (encontradaCom) {
      const conHTML = obtenerProduccionConHTML(encontradaCom);
      setCodigoHTML(conHTML.codigoHTML || "");
      setTitulo(conHTML.titulo);
      setAsignatura(conHTML.area);
      setNivel(conHTML.nivel);
      return;
    }

    // 3. Buscar en API de servidor /api/webapps?id=
    const buscarEnServidor = async () => {
      try {
        const res = await fetch(`/api/webapps?id=${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setCodigoHTML(json.data.codigoHTML);
            setTitulo(json.data.titulo);
            setAsignatura(json.data.asignatura || "Formación Tecnológica");
            setNivel(json.data.nivel || "7° Año - Secundaria");
            return;
          }
        }
      } catch (err) {}

      // 4. Demostración autónoma por defecto si no se encuentra
      const htmlDemo = generarCodigoHTMLAutonomo({
        titulo: "Laboratorio Autónomo de Algoritmos y Lógica",
        docenteId: docente?.idDocente || "DOC-DRE01-7729",
        asignatura: "Programación y Algoritmos",
        nivel: "7° Año - Secundaria",
        saberTitulo: "Lógica Proposicional, Algoritmia y Estructuras de Control",
        saberConceptual: "Algoritmo",
        explicacionPedagogica: "Un algoritmo es una secuencia clara y ordenada de pasos para resolver un problema de manera lógica.",
        indicadorCodigo: "7.PR.01",
        indicadorNombre: "Estructura y características esenciales del algoritmo",
        saberProcedimental: "Formula algoritmos",
        saberActitudinal: "Gusto por la precisión",
        mecanica: "Simulador interactivo",
        modo: "Individual",
      });
      setCodigoHTML(htmlDemo);
      setTitulo("Laboratorio Autónomo de Algoritmos y Lógica");
      setAsignatura("Programación y Algoritmos");
      setNivel("7° Año - Secundaria");
    };

    buscarEnServidor();
  }, [id, webApps, webAppsComunidad, docente]);

  const descargarHTML = () => {
    const blob = new Blob([codigoHTML], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${titulo.toLowerCase().replace(/[^a-z0-9]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRemix = () => {
    router.push(`/taller-webapps?remix=${id}`);
  };

  const urlActual = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950">
      {/* Barra Superior del Visor Autónomo */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span>Volver</span>
          </button>
          <div className="h-4 w-px bg-slate-700" />
          <div>
            <span className="font-extrabold text-white text-sm line-clamp-1">{titulo}</span>
            <span className="text-[10px] text-sky-400">{asignatura} • {nivel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón Remix */}
          <button
            onClick={handleRemix}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors shadow-xs"
            title="Personalizar y adaptar esta WebApp a tu aula"
          >
            <ArrowsClockwise size={16} weight="bold" />
            <span className="hidden sm:inline">Remix / Adaptar</span>
          </button>

          <button
            onClick={() => setModalQR(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
          >
            <ChalkboardTeacher size={16} weight="bold" />
            <span className="hidden sm:inline">Proyectar QR</span>
          </button>

          <button
            onClick={descargarHTML}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors"
          >
            <DownloadSimple size={16} weight="bold" />
            <span className="hidden sm:inline">Descargar .html</span>
          </button>
        </div>
      </div>

      {/* Visor Iframe Fullscreen Seguro */}
      <div className="flex-1 w-full h-full bg-white relative">
        <iframe
          srcDoc={codigoHTML}
          title={titulo}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-modals allow-same-origin allow-downloads"
        />
      </div>

      {/* Modal QR de Proyección */}
      <QRModalProyeccion
        abierto={modalQR}
        alCerrar={() => setModalQR(false)}
        urlWebApp={urlActual}
        titulo={titulo}
        asignatura={asignatura}
        nivel={nivel}
        docenteNombre={docente?.nombreCompleto}
      />
    </div>
  );
}
