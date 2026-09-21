"use client";

import React, { useState } from "react";
import { useDocente } from "@/context/DocenteContext";
import {
  generarPromptParaIAExterna,
  generarCodigoHTMLAutonomo,
  OpcionesGeneracionWebApp,
} from "@/lib/generadorWebAppEngine";
import WebAppPreviewFrame from "@/components/WebAppPreviewFrame";
import QRModalProyeccion from "@/components/QRModalProyeccion";
import {
  FileText,
  UploadSimple,
  Play,
  DownloadSimple,
  Copy,
  Check,
  ArrowsClockwise,
  Sliders,
  Eye,
  CheckCircle,
  Lightbulb,
  Cpu,
  Sparkle,
  BookOpen,
  Wrench,
  Heart,
  ShieldCheck,
  ChalkboardTeacher,
} from "@phosphor-icons/react";

export default function DiagnosticoPage() {
  const { docente, guardarWebApp } = useDocente();

  // Entrada de documento
  const [textoDocumento, setTextoDocumento] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [analizando, setAnalizando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  // Resultados generados por la IA
  const [diagnostico, setDiagnostico] = useState<any | null>(null);
  const [codigoHTMLGenerado, setCodigoHTMLGenerado] = useState("");
  const [promptGenerado, setPromptGenerado] = useState("");
  const [copiadoPrompt, setCopiadoPrompt] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<"formulario" | "preview">("formulario");
  const [modalProyeccionAbierto, setModalProyeccionAbierto] = useState(false);
  const [webAppGuardadaId, setWebAppGuardadaId] = useState<string | null>(null);

  // Cargar ejemplo base oficial del MEP (Diagnóstico 9° - Aula Inteligente)
  const cargarEjemploOficialMEP = () => {
    setNombreArchivo("Diagnostico_Formacion_Tecnologica_9no_Modul0_01.docx");
    const textoEjemplo = `MINISTERIO DE EDUCACIÓN PÚBLICA
Programa Nacional de Formación Tecnológica - Guía de Evaluación Diagnóstica
FORMACIÓN TECNOLÓGICA – III CICLO (NOVENO AÑO – MÓDULO 1)
DIAGNÓSTICO INTEGRADO: Áreas cognoscitiva, socioafectiva y psicomotora

1. Situación-Problema: «Aula Inteligente»
El laboratorio de informática de tu colegio desea implementar un sistema automatizado que permita encender una luz automáticamente cuando exista poca iluminación ambiental. Para ello se dispone de un microcontrolador, un sensor de luz (LDR) y un actuador (iluminación LED).

2. Parte A – Conocimientos Previos (Área Cognoscitiva - 10 Ítems):
- Ítem 1 (Microcontrolador): Recibir información de sensores, procesarla y controlar dispositivos según su programación.
- Ítem 2 (Sensor y Actuador): El sensor obtiene información del entorno y el actuador ejecuta una acción de respuesta.
- Ítem 3 (Modelo E-P-S): Sensor de luz -> Microcontrolador -> LED.
- Ítem 4 (Algoritmo): 1. Iniciar sistema, 2. Leer sensor, 3. Comprobar condición de poca luz, 4. Encender LED.
- Ítem 5 (Condicional): Encender luz si la iluminación está por debajo de un umbral.
- Ítem 6 (Relación): Sensor = Captura, Actuador = Ejecuta, Microcontrolador = Procesa.
- Ítem 7 (Dato): Valor analógico de 250 Lux (nivel de luz).
- Ítem 8 (Lógica): Estructura Condicional Doble (If / Else).
- Ítem 9 (Depuración): Revisar polaridad, alimentación, conexiones de pines y código.
- Ítem 10 (Almacenamiento): Conservar datos para analizar patrones históricos de consumo y tomar decisiones informadas.

3. Parte B – Reto Práctico: «Conecta el prototipo» (Área Psicomotora / Simulación en Tiempo Real):
Representar mediante tarjetas y líneas de conexión un sistema automatizado con microcontrolador, sensor y actuador. Manipular pines, calibrar nivel de iluminación ambiental y corregir errores de cableado.

4. Listas de Observación Socioafectiva y Psicomotora (Docente):
- Gusto por la precisión y cuidado de detalles en el diseño del circuito.
- Aprende del error y lo utiliza como oportunidad de mejora.
- Tolerancia a la frustración, paciencia y persistencia.
- Colaboración respetuosa en parejas y manejo ético de materiales.
Escala Oficial MEP: A (Autónomo/Consistente), B (Apoyo ocasional), C (Requiere acompañamiento).`;

    setTextoDocumento(textoEjemplo);
  };

  // Procesar archivo subido (.txt, .doc, .docx, etc.)
  const procesarArchivo = (file: File) => {
    setNombreArchivo(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target?.result as string;
      setTextoDocumento(contenido);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      procesarArchivo(e.dataTransfer.files[0]);
    }
  };

  // Procesar el diagnóstico y generar todo lo necesario
  const procesarDiagnosticoYGenerarTodo = async () => {
    if (!textoDocumento.trim()) {
      alert("Por favor sube o pega el documento de diagnóstico para continuar.");
      return;
    }

    setAnalizando(true);
    try {
      const res = await fetch("/api/ia/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textoDocumento,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const diag = data.diagnostico;
        setDiagnostico(diag);

        // Si es el ejemplo oficial o similar, usar la WebApp interactiva especializada
        if (nombreArchivo.includes("9no") || textoDocumento.includes("Aula Inteligente") || textoDocumento.includes("Conecta el prototipo")) {
          // Cargar el HTML ultra-interactivo con simulador de circuitos
          const resHtml = await fetch("/webapps/diagnostico_9no_modulo01_aula_inteligente.html");
          if (resHtml.ok) {
            const htmlReal = await resHtml.text();
            setCodigoHTMLGenerado(htmlReal);
          } else {
            const htmlGen = generarCodigoHTMLAutonomo({
              titulo: diag.tituloSugerido || "Diagnóstico Integrado 9° - Aula Inteligente",
              docenteId: docente?.idDocente || "DOC-DRE01-7729",
              docenteNombre: docente?.nombreCompleto || "Docente Secundaria",
              asignatura: diag.areaConocimiento || "Formación Tecnológica",
              nivel: diag.nivelEducativo || "9° Año - Secundaria",
              saberTitulo: diag.saberConceptual || "Computación Física y Robótica",
              saberConceptual: diag.saberConceptual || "Microcontroladores y Sensores",
              explicacionPedagogica: diag.explicacionComprensible,
              indicadorCodigo: diag.indicadorCodigo || "9.ROB.01",
              indicadorNombre: diag.indicadorNombre || "Sistemas Automatizados y Lógica de Sensores",
              saberProcedimental: diag.saberProcedimental,
              saberActitudinal: diag.saberActitudinal,
              mecanica: diag.mecanicaSugerida || "Simulador interactivo",
              modo: diag.modo || "Individual",
              preguntasComprender: diag.preguntasComprender,
              instrumentoEvaluacion: diag.instrumentoEvaluacion,
            });
            setCodigoHTMLGenerado(htmlGen);
          }
        } else {
          // Generar para otros diagnósticos
          const htmlGen = generarCodigoHTMLAutonomo({
            titulo: diag.tituloSugerido || "Actividad Diagnóstica de Secundaria",
            docenteId: docente?.idDocente || "DOC-DRE01-7729",
            docenteNombre: docente?.nombreCompleto || "Docente Secundaria",
            asignatura: diag.areaConocimiento || "Formación Tecnológica",
            nivel: diag.nivelEducativo || "Secundaria (III Ciclo)",
            saberTitulo: diag.saberConceptual,
            saberConceptual: diag.saberConceptual,
            explicacionPedagogica: diag.explicacionComprensible,
            indicadorCodigo: diag.indicadorCodigo || "SEC.DIAG.01",
            indicadorNombre: diag.indicadorNombre || "Diagnóstico Curricular",
            saberProcedimental: diag.saberProcedimental,
            saberActitudinal: diag.saberActitudinal,
            mecanica: diag.mecanicaSugerida || "Simulador interactivo",
            modo: diag.modo || "Individual",
            preguntasComprender: diag.preguntasComprender,
            instrumentoEvaluacion: diag.instrumentoEvaluacion,
          });
          setCodigoHTMLGenerado(htmlGen);
        }

        const prompt = generarPromptParaIAExterna({
          titulo: diag.tituloSugerido || "Diagnóstico Integrado",
          docenteId: docente?.idDocente || "DOC-DRE01-7729",
          asignatura: diag.areaConocimiento || "Formación Tecnológica",
          nivel: diag.nivelEducativo || "Secundaria",
          saberTitulo: diag.saberConceptual || "Saber Diagnosticado",
          saberConceptual: diag.saberConceptual || "Conceptos Previos",
          indicadorCodigo: diag.indicadorCodigo || "SEC.DIAG.01",
          indicadorNombre: diag.indicadorNombre || "Diagnóstico Integrado",
          mecanica: diag.mecanicaSugerida || "Simulador interactivo",
          modo: "Individual",
          instrumentoEvaluacion: diag.instrumentoEvaluacion,
        });
        setPromptGenerado(prompt);
      } else {
        alert("Error al procesar el documento. Por favor verifica el contenido e intenta de nuevo.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al procesar el diagnóstico.");
    }
    setAnalizando(false);
  };

  const copiarPrompt = () => {
    navigator.clipboard.writeText(promptGenerado);
    setCopiadoPrompt(true);
    setTimeout(() => setCopiadoPrompt(false), 2500);
  };

  const descargarHTML = () => {
    const tituloDescarga = diagnostico?.tituloSugerido || "diagnostico_9no_modulo01_aula_inteligente";
    const blob = new Blob([codigoHTMLGenerado], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${tituloDescarga.toLowerCase().replace(/[^a-z0-9]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    guardarWebApp({
      id: "webapp-diag-" + Date.now(),
      titulo: tituloDescarga,
      docenteId: docente?.idDocente || "DOC-DRE01-7729",
      asignatura: diagnostico?.areaConocimiento || "Formación Tecnológica",
      nivel: diagnostico?.nivelEducativo || "9° Año - Secundaria",
      saberTitulo: diagnostico?.saberConceptual || "Computación Física y Robótica",
      indicadorCodigo: diagnostico?.indicadorCodigo || "9.ROB.01",
      indicadorNombre: diagnostico?.indicadorNombre || "Diagnóstico Integrado",
      mecanica: diagnostico?.mecanicaSugerida || "Simulador interactivo",
      modo: diagnostico?.modo || "Individual",
      codigoHTML: codigoHTMLGenerado,
      fechaCreacion: new Date().toISOString(),
      visitas: 1,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block">
            Módulo de Entrada Curricular
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Diagnóstico Integrado de Formación Tecnológica (III Ciclo)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Interpretación en las 3 Áreas: 🧠 Cognoscitiva, 🖐️ Psicomotora y ❤️ Socioafectiva con Simulación y Telemetría SHA-256
          </p>
        </div>

        {diagnostico && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setVistaActiva("formulario")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                vistaActiva === "formulario"
                  ? "bg-white text-blue-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders size={16} weight="bold" />
              <span>Propuesta & Instrumento</span>
            </button>
            <button
              onClick={() => setVistaActiva("preview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                vistaActiva === "preview"
                  ? "bg-blue-700 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye size={16} weight="bold" />
              <span>Probar WebApp con Simulador</span>
            </button>
          </div>
        )}
      </div>

      {vistaActiva === "formulario" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna Izquierda: Zona de Carga de Documento (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText size={20} className="text-blue-700" weight="duotone" />
                  <span>Documento del Diagnóstico</span>
                </h2>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  Subida Directa
                </span>
              </div>

              {/* Zona Drag & Drop */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setArrastrando(true);
                }}
                onDragLeave={() => setArrastrando(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  arrastrando
                    ? "border-blue-600 bg-blue-50/60"
                    : "border-slate-300 hover:border-blue-400 bg-slate-50/50"
                }`}
              >
                <UploadSimple size={32} className="mx-auto text-blue-700 mb-2" />
                <span className="text-xs font-bold text-slate-700 block">
                  {nombreArchivo ? `Archivo cargado: ${nombreArchivo}` : "Arrastra y suelta aquí tu archivo de diagnóstico"}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Formatos compatibles: .docx, .doc, .txt, .pdf o texto plano
                </span>

                <label className="inline-block mt-3 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs">
                  <span>Examinar Archivo</span>
                  <input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    className="hidden"
                    onChange={(e) => e.target.files && e.target.files[0] && procesarArchivo(e.target.files[0])}
                  />
                </label>
              </div>

              {/* Área de Texto Directo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contenido extraído del diagnóstico:
                </label>
                <textarea
                  value={textoDocumento}
                  onChange={(e) => setTextoDocumento(e.target.value)}
                  placeholder="Pega aquí el texto de tu instrumento diagnóstico o documento curricular..."
                  rows={9}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white font-sans leading-relaxed"
                />
              </div>

              {/* Botón de Procesamiento */}
              <button
                type="button"
                onClick={procesarDiagnosticoYGenerarTodo}
                disabled={analizando || !textoDocumento.trim()}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-slate-900 hover:from-blue-800 hover:to-slate-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {analizando ? (
                  <>
                    <ArrowsClockwise size={18} className="animate-spin" />
                    <span>Analizando las 3 Áreas y Estructurando WebApp...</span>
                  </>
                ) : (
                  <>
                    <Cpu size={18} weight="bold" />
                    <span>Interpretar Diagnóstico & Generar WebApp Interactiva</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Columna Derecha: Resultado Automático (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {diagnostico ? (
              <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-xl space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={22} weight="fill" className="text-emerald-600" />
                    <h3 className="text-sm font-black text-slate-900">Diagnóstico Integrado 360°</h3>
                  </div>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-900 font-bold text-[10px] rounded-full">
                    Currículo III Ciclo
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    {diagnostico.areaConocimiento} • {diagnostico.nivelEducativo}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                    {diagnostico.tituloSugerido}
                  </h4>
                </div>

                {/* Las 3 Áreas Oficiales del Diagnóstico */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                    <span className="font-extrabold text-blue-900 flex items-center gap-1">
                      <BookOpen size={16} className="text-blue-700" weight="fill" />
                      1. 🧠 Cognoscitiva:
                    </span>
                    <span className="text-slate-700 font-medium block">
                      {diagnostico.dimensionCognitiva?.saberConceptual || diagnostico.saberConceptual} (10 Ítems)
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                      <Wrench size={16} className="text-emerald-700" weight="fill" />
                      2. 🖐️ Psicomotora:
                    </span>
                    <span className="text-slate-700 font-medium block">
                      Reto «Conecta el Prototipo» (Simulación en Vivo)
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <span className="font-extrabold text-amber-900 flex items-center gap-1">
                      <Heart size={16} className="text-amber-700" weight="fill" />
                      3. ❤️ Socioafectiva:
                    </span>
                    <span className="text-slate-700 font-medium block">
                      Lista de Observación Docente (Escala A / B / C)
                    </span>
                  </div>
                </div>

                {/* Situación Problema */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">
                    🏢 Situación-Problema Auténtica Extraída:
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {diagnostico.resumenDiagnostico || "Aula Inteligente: Sistema automatizado de iluminación asistida con microcontrolador, sensor LDR y actuador LED."}
                  </p>
                </div>

                {/* Importancia en el Planeamiento */}
                <div className="p-4 bg-purple-950/5 border border-purple-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-black text-purple-950">
                    <FileText size={18} weight="fill" className="text-purple-700" />
                    <span>Insumo Obligatorio para las Estrategias de Mediación (DUA)</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {diagnostico.importanciaIntegracionPlaneamiento ||
                      "Los resultados y hallazgos del diagnóstico son el punto de partida técnico para la mediación pedagógica. Es indispensable trasladar las recomendaciones y ajustes detectados directamente a las Estrategias de Mediación del planeamiento didáctico oficial de aula."}
                  </p>
                </div>

                {/* Acciones */}
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setVistaActiva("preview")}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl transition-all shadow-md"
                    >
                      <Eye size={18} weight="bold" />
                      <span>Probar WebApp Interactiva</span>
                    </button>
                    <button
                      onClick={descargarHTML}
                      className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md"
                    >
                      <DownloadSimple size={18} weight="bold" />
                      <span>Guardar Archivo .html</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={copiarPrompt}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
                    >
                      {copiadoPrompt ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      <span>{copiadoPrompt ? "Prompt Copiado" : "Copiar Prompt para Gemini Canvas"}</span>
                    </button>
                    <button
                      onClick={() => setModalProyeccionAbierto(true)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                      title="Proyectar QR en Aula"
                    >
                      <ChalkboardTeacher size={16} weight="bold" />
                      <span>Proyectar</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                <FileText size={48} className="mx-auto text-slate-400" weight="duotone" />
                <h3 className="text-sm font-bold text-slate-700">Esperando Documento de Diagnóstico</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Sube tu archivo curricular o pega el texto en el área de la izquierda para interpretar las 3 áreas y generar la WebApp interactiva.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Vista Previa Sandbox */
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-800">
              Vista Previa de la WebApp de Diagnóstico
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalProyeccionAbierto(true)}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <ChalkboardTeacher size={16} weight="bold" />
                <span>Modo Proyector</span>
              </button>
              <button
                onClick={() => setVistaActiva("formulario")}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300"
              >
                Volver al Formulario
              </button>
            </div>
          </div>

          <WebAppPreviewFrame
            codigoHTML={codigoHTMLGenerado}
            titulo={diagnostico?.tituloSugerido || "Diagnóstico Integrado 9° - Aula Inteligente"}
            onDescargar={descargarHTML}
          />
        </div>
      )}

      {/* Modal de Proyección en Aula */}
      <QRModalProyeccion
        abierto={modalProyeccionAbierto}
        alCerrar={() => setModalProyeccionAbierto(false)}
        urlWebApp={typeof window !== "undefined" ? window.location.href : "https://creador-webapps.local"}
        titulo={diagnostico?.tituloSugerido || "Diagnóstico Integrado 9° - Aula Inteligente"}
        asignatura="Formación Tecnológica"
        nivel="9° Año - Secundaria"
        docenteNombre={docente?.nombreCompleto || "Prof. Alberto Bustos Ortega"}
      />
    </div>
  );
}

