"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import {
  generarPromptParaIAExterna,
  generarCodigoHTMLAutonomo,
  OpcionesGeneracionWebApp,
} from "@/lib/generadorWebAppEngine";
import WebAppPreviewFrame from "@/components/WebAppPreviewFrame";
import QRModalProyeccion from "@/components/QRModalProyeccion";
import SelectorVersionesDiagnostico from "@/components/SelectorVersionesDiagnostico";
import AuthGuard from "@/components/AuthGuard";
import { QRCodeSVG } from "qrcode.react";
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
  ArrowSquareOut,
  Table,
  Scales,
  UserCheck,
  QrCode,
  DeviceMobile,
  Laptop,
  ShareNetwork,
  X,
} from "@phosphor-icons/react";

export default function DiagnosticoPage() {
  const { docente, guardarWebApp } = useDocente();

  // Entrada de documento
  const [textoDocumento, setTextoDocumento] = useState("");
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [analizando, setAnalizando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  // Modales de Proyección QR y PWA
  const [modalQREstudiante, setModalQREstudiante] = useState(false);
  const [modalQRDocente, setModalQRDocente] = useState(false);
  const [modalPWAGuia, setModalPWAGuia] = useState(false);
  const [tabPWAGuia, setTabPWAGuia] = useState<"android" | "ios" | "pc">("android");
  const [modoQREstudiante, setModoQREstudiante] = useState<"online" | "local">("online");
  const [modoQRDocente, setModoQRDocente] = useState<"online" | "local">("online");

  // Resultados generados por la IA
  const [diagnostico, setDiagnostico] = useState<any | null>(null);
  const [codigoHTMLGenerado, setCodigoHTMLGenerado] = useState("");
  const [promptGenerado, setPromptGenerado] = useState("");
  const [copiadoPrompt, setCopiadoPrompt] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<"formulario" | "preview" | "comparativa">("formulario");
  const [modalProyeccionAbierto, setModalProyeccionAbierto] = useState(false);
  const [modalComparativaAbierto, setModalComparativaAbierto] = useState(false);
  const [webAppGuardadaId, setWebAppGuardadaId] = useState<string | null>(null);

  // Cargar ejemplo base oficial del MEP (Diagnóstico 9° - Aula Inteligente)
  const cargarEjemploOficialMEP = () => {
    setNombreArchivo("Diagnostico_Formacion_Tecnologica_9no_Modulo_01.docx");
    const textoEjemplo = `MINISTERIO DE EDUCACIÓN PÚBLICA
Programa Nacional de Formación Tecnológica - Guía de Evaluación Diagnóstica
FORMACIÓN TECNOLÓGICA – III CICLO (NOVENO AÑO – MÓDULO 1)
DIAGNÓSTICO INTEGRADO: Áreas cognoscitiva, socioafectiva y psicomotora

1. Situación-Problema: «Aula Inteligente»
El laboratorio de informática de tu colegio desea implementar un sistema automatizado que permita encender una luz automáticamente cuando exista poca iluminación ambiental. Para ello se dispone de un microcontrolador, un sensor de luz (LDR) y un actuador (iluminación LED).

2. Parte A – Conocimientos Previos (Área Cognoscitiva - 10 Ítems Oficiales MEP):
- Ítem 1 (Microcontrolador): Recibir información de sensores, procesarla y controlar dispositivos según su programación.
- Ítem 2 (Sensor y Actuador): El sensor obtiene información del entorno y el actuador ejecuta una acción de respuesta.
- Ítem 3 (Modelo E-P-S): Sensor de luz (Entrada) -> Microcontrolador (Proceso) -> LED (Salida).
- Ítem 4 (Algoritmo): 1. Iniciar sistema, 2. Leer sensor, 3. Comprobar condición de poca luz, 4. Encender LED.
- Ítem 5 (Condicional): Encender luz si la iluminación está por debajo de un umbral (< 300 Lux).
- Ítem 6 (Relación de elementos): Sensor = Captura entorno, Actuador = Ejecuta acción, Microcontrolador = Procesa y controla.
- Ítem 7 (Concepto de Dato): Valor numérico o analógico obtenido por el sensor (ej. 180 Lux / 1.05 V).
- Ítem 8 (Lógica condicional): Estructura Condicional Doble (Si - De lo contrario).
- Ítem 9 (Problema y depuración): Revisar conexiones físicas (VCC, GND, pines A0/D9), alimentación y condiciones del programa.
- Ítem 10 (Almacenamiento y ciclo de vida): Conservar datos para analizar patrones históricos de consumo y tomar decisiones informadas.

3. Parte B – Reto Práctico: «Conecta el prototipo» (Área Psicomotora / Simulación en Tiempo Real):
Representar mediante tarjetas y líneas de conexión un sistema automatizado con microcontrolador, sensor y actuador. Manipular pines, calibrar nivel de iluminación ambiental y corregir errores de cableado.

4. Parte C – Reflexión Individual (Área Socioafectiva):
1. Mayor facilidad en la actividad.
2. Mayor dificultad encontrada.
3. Reacción y actitud ante el error.
4. Necesidad de refuerzo identificada.
5. Escala de autopercepción y comodidad (Muy cómodo/a, Cómodo/a, Con alguna dificultad, Necesité bastante apoyo).

5. Guía Docente y Listas de Observación (Escala A / B / C):
- Gusto por la precisión y cuidado de detalles en el conexionado.
- Aprende del error y lo utiliza como oportunidad de mejora.
- Tolerancia a la frustración, paciencia y persistencia.
- Manejo ético y seguro de componentes.`;

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
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
              Módulo de diagnóstico • Formación tecnológica (9° año)
            </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Diagnóstico integrado 9°: «Aula inteligente»
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluación formativa oficial en las 3 dimensiones: 🧠 cognoscitiva, 🖐️ psicomotora y ❤️ socioafectiva (Módulo 1)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setModalComparativaAbierto(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Scales size={16} weight="bold" className="text-purple-700" />
            <span>Ver cuadro comparativo MEP</span>
          </button>
        </div>
      </div>

      {/* SELECTOR OFICIAL DE VERSIONES SEPARADAS PARA EL ESTUDIANTE (EN LÍNEA VS OFFLINE) */}
      <section className="space-y-4">
        <SelectorVersionesDiagnostico
          docenteNombre={docente?.nombreCompleto}
          institucionNombre={docente?.institucionNombre}
        />
      </section>

      {/* APLICATIVO PARA EL DOCENTE EVALUADOR */}
      <section>
        <div className="bg-indigo-50/80 border-2 border-indigo-200/90 rounded-3xl p-6 sm:p-8 text-slate-900 shadow-softPastel flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
          <div className="space-y-3 relative z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 text-[10px] font-black uppercase tracking-wider">
                Instrumento para la persona docente
              </span>
              <span className="text-xs font-bold text-indigo-800">Guía oficial de evaluación</span>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <UserCheck size={24} className="text-emerald-700" weight="fill" />
              <span>Evaluador docente y sistematización de desempeños</span>
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Permite registrar en vivo la matriz de <strong>sistematización de desempeños y logros (pág. 15)</strong>, escanear con la cámara del celular o laptop los <strong>códigos QR de los estudiantes</strong>, evaluar las 3 áreas (cognoscitiva, psicomotora y socioafectiva) y exportar actas a Excel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
            <a
              href="/webapps/diagnostico_9no_modulo01_docente_evaluador.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-xs transition-all"
            >
              <span>Abrir aplicación docente</span>
              <ArrowSquareOut size={16} weight="bold" />
            </a>
            
            <button
              onClick={() => setModalQRDocente(true)}
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs rounded-xl border border-indigo-300 transition-all shadow-xs"
            >
              <QrCode size={16} weight="bold" />
              <span>QR para celular docente</span>
            </button>
            
            <a
              href="/webapps/diagnostico_9no_modulo01_docente_evaluador.html"
              download="diagnostico_9no_modulo01_docente_evaluador.html"
              className="inline-flex items-center gap-1.5 px-3.5 py-3 bg-stone-100 hover:bg-stone-200 text-slate-800 text-xs font-bold rounded-xl border border-stone-300 transition-colors shadow-xs"
            >
              <DownloadSimple size={15} weight="bold" />
              <span>Descargar .html</span>
            </a>
          </div>
        </div>
      </section>

      {/* MODAL CUADRO COMPARATIVO Y DICTAMEN DE VALIDACIÓN CURRICULAR OFICIAL */}
      {modalComparativaAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-purple-600 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <Scales size={24} weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Dictamen de validación y cuadro comparativo oficial MEP
                  </h3>
                  <p className="text-xs text-slate-500">
                    Contraste directo entre la Guía de evaluación diagnóstica 9° (Módulo 1) y los aplicativos web
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalComparativaAbierto(false)}
                className="text-slate-400 hover:text-slate-700 font-black text-sm px-3 py-1 bg-slate-100 rounded-lg"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Cuadro Comparativo */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3 border border-slate-700">Elemento / dimensión</th>
                    <th className="p-3 border border-slate-700">Documento base oficial (PDF MEP)</th>
                    <th className="p-3 border border-slate-700">Implementación en WebApps</th>
                    <th className="p-3 border border-slate-700 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 border border-slate-200">1. Identificación y portada</td>
                    <td className="p-3 text-slate-600 border border-slate-200">Centro educativo, docente, sección, fecha, estudiante, tiempo de 70 min.</td>
                    <td className="p-3 text-slate-700 border border-slate-200">Campos completos en ambas WebApps, con ingreso de estudiante y gestión de nóminas en la aplicación docente.</td>
                    <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% alineado</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 border border-slate-200">2. Situación-problema</td>
                    <td className="p-3 text-slate-600 border border-slate-200">«Aula inteligente»: automatización de luminaria ante baja luz ambiental con MCU, sensor LDR y actuador.</td>
                    <td className="p-3 text-slate-700 border border-slate-200">Idéntico: Contexto situado del laboratorio de informática con umbral dinámico de 300 Lux.</td>
                    <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% alineado</span></td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 border border-slate-200">3. Parte A: conocimientos previos</td>
                    <td className="p-3 text-slate-600 border border-slate-200">10 reactivos diagnósticos (microcontrolador, sensor/actuador, EPS, algoritmo, condición, dato, depuración, ciclo del dato).</td>
                    <td className="p-3 text-slate-700 border border-slate-200">10 reactivos interactivos con explicaciones conceptuales, retroalimentación formativa y telemetría por reactivo.</td>
                    <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% alineado</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 border border-slate-200">4. Parte B: reto práctico</td>
                    <td className="p-3 text-slate-600 border border-slate-200">«Conecta el prototipo»: tarjetas impresas en papel, líneas de cables, polaridad (5V, GND, pines), depuración de falla y cambio de actuador.</td>
                    <td className="p-3 text-slate-700 border border-slate-200">Laboratorio interactivo Canvas/SVG 2D con cables dinámicos, osciloscopio 60 FPS, multímetro, inyector de fallas y alternancia LED/servo/buzzer.</td>
                    <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% potenciado</span></td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-900 border border-slate-200">5. Parte C: reflexión individual</td>
                    <td className="p-3 text-slate-600 border border-slate-200">5 preguntas de autopercepción (mayor facilidad, más difícil, reacción al error, qué reforzar y escala de comodidad de 4 niveles).</td>
                    <td className="p-3 text-slate-700 border border-slate-200">Opciones guiadas con selectores visuales + campo de redacción libre + matriz de 4 sentimientos + codificación en el QR de respaldo.</td>
                    <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% mejorado</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 border border-slate-200">6. Guía docente y rúbricas</td>
                    <td className="p-3 text-slate-600 border border-slate-200">Listas de cotejo y observación (10 cognoscitivas, 6 psicomotoras, 7 socioafectivas con escala A/B/C) y toma de decisiones (pág. 10).</td>
                    <td className="p-3 text-slate-700 border border-slate-200">Aplicación docente independiente con carga de nóminas por archivo, evaluación por estudiante, escáner QR y consolidado en Excel/PDF.</td>
                    <td className="p-3 text-center border border-slate-200"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[10px]">🟢 100% cumplido</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Dictamen Pedagógico Final */}
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-black text-purple-950">
                <CheckCircle size={18} weight="fill" className="text-purple-700" />
                <span>Dictamen final: validez curricular y tecnológica total (100%)</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Los dos aplicativos (estudiante y docente) preservan con absoluta fidelidad los criterios, indicadores de logro y estructura metodológica de la Guía de evaluación diagnóstica de noveno año (Módulo 1 - Formación Tecnológica 2026). Las mejoras digitales aplicadas en la Parte C y en la simulación 2D optimizan el registro de evidencias formativas y permiten el seguimiento tanto en línea como desconectado.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalComparativaAbierto(false)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Entendido y cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL QR PROYECCIÓN: ESTUDIANTE */}
      {modalQREstudiante && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-blue-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative text-white">
            <button
              onClick={() => setModalQREstudiante(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold mb-3">
              <Lightbulb size={16} weight="fill" className="text-amber-400" />
              <span>Diagnóstico 9°: «Aula inteligente»</span>
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              Proyectar a los estudiantes
            </h3>
            <p className="text-xs text-slate-300 mb-5">
              Los estudiantes pueden escanear este código con su celular o tableta para abrir y resolver la prueba en el aula.
            </p>

            {/* Selector Modo: En Línea vs Local */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-5">
              <button
                onClick={() => setModoQREstudiante("online")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  modoQREstudiante === "online"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🌐 En línea (URL web)
              </button>
              <button
                onClick={() => setModoQREstudiante("local")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  modoQREstudiante === "local"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                💾 En local / archivo
              </button>
            </div>

            {/* Renderizado de Código QR */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-slate-800 mb-4">
              <QRCodeSVG
                value={
                  modoQREstudiante === "online"
                    ? (typeof window !== "undefined" ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_aula_inteligente.html` : "https://creador-webapps.local/webapps/diagnostico_9no_modulo01_aula_inteligente.html")
                    : "file:///webapps/diagnostico_9no_modulo01_aula_inteligente.html"
                }
                size={210}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-5">
              {modoQREstudiante === "online"
                ? (typeof window !== "undefined" ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_aula_inteligente.html` : "/webapps/diagnostico_9no_modulo01_aula_inteligente.html")
                : "Apertura en Local: diagnostico_9no_modulo01_aula_inteligente.html"}
            </div>
          </div>
        </div>
      )}

      {/* MODAL QR PROYECCIÓN: DOCENTE */}
      {modalQRDocente && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-purple-500 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center relative text-white">
            <button
              onClick={() => setModalQRDocente(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              <X size={20} weight="bold" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-3">
              <UserCheck size={16} weight="fill" className="text-emerald-400" />
              <span>Aplicativo y evaluador docente</span>
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              Instrumento docente evaluador
            </h3>
            <p className="text-xs text-slate-300 mb-5">
              Accede al instrumento de evaluación y registro de observación diagnóstica optimizado para computadoras de laboratorios, PCs y portátiles.
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl border-4 border-slate-800 mb-4">
              <QRCodeSVG
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_docente_evaluador.html`
                    : "https://creador-webapps.local/webapps/diagnostico_9no_modulo01_docente_evaluador.html"
                }
                size={210}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="text-[11px] text-slate-400 font-mono break-all bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 mb-5">
              {typeof window !== "undefined"
                ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_docente_evaluador.html`
                : "/webapps/diagnostico_9no_modulo01_docente_evaluador.html"}
            </div>
          </div>
        </div>
      )}

      {/* MODAL GUÍA PWA: CÓMO INSTALAR COMO APP */}
      {modalPWAGuia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-sky-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <DeviceMobile size={22} className="text-sky-400" />
                <span>Instalar como aplicación (PWA)</span>
              </h3>
              <button
                onClick={() => setModalPWAGuia(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Pestañas de Sistema Operativo */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-4">
              <button
                onClick={() => setTabPWAGuia("android")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  tabPWAGuia === "android"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🤖 Android
              </button>
              <button
                onClick={() => setTabPWAGuia("ios")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  tabPWAGuia === "ios"
                    ? "bg-sky-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🍎 iOS (iPhone)
              </button>
              <button
                onClick={() => setTabPWAGuia("pc")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  tabPWAGuia === "pc"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                💻 PC (Win/Mac)
              </button>
            </div>

            {/* Contenido Android */}
            {tabPWAGuia === "android" && (
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-emerald-400 text-sm">En celulares y tabletas Android (Google Chrome):</h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Abre la WebApp en <strong>Google Chrome</strong>.</li>
                  <li>Toca el menú de los <strong>tres puntos (⋮)</strong> en la esquina superior derecha.</li>
                  <li>Selecciona <strong>«Agregar a la pantalla principal»</strong> o <strong>«Instalar aplicación»</strong>.</li>
                  <li>Presiona <strong>«Instalar»</strong>. Se creará un acceso directo en tu pantalla de inicio para usarla a pantalla completa sin conexión.</li>
                </ol>
              </div>
            )}

            {/* Contenido iOS */}
            {tabPWAGuia === "ios" && (
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-sky-400 text-sm">En iPhone y iPad (Apple Safari):</h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Abre el enlace o archivo en el navegador <strong>Safari</strong>.</li>
                  <li>Toca el botón de <strong>Compartir (icono ⎋ con flecha hacia arriba)</strong> en la barra inferior.</li>
                  <li>Desliza hacia abajo y presiona <strong>«Agregar al inicio» (⊞)</strong>.</li>
                  <li>Toca <strong>«Agregar»</strong> en la esquina superior derecha.</li>
                </ol>
              </div>
            )}

            {/* Contenido PC */}
            {tabPWAGuia === "pc" && (
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <h4 className="font-bold text-amber-400 text-sm">En computadoras (Windows / Mac con Chrome o Edge):</h4>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Abre el archivo en <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>.</li>
                  <li>En la barra de direcciones (a la derecha), haz clic en el icono de <strong>Instalar (⊕ o monitor)</strong>.</li>
                  <li>Confirma en <strong>«Instalar»</strong> para tener el aplicativo en tu escritorio y barra de tareas.</li>
                </ol>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setModalPWAGuia(false)}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Proyección en Aula */}
      <QRModalProyeccion
        abierto={modalProyeccionAbierto}
        alCerrar={() => setModalProyeccionAbierto(false)}
        urlWebApp={
          typeof window !== "undefined"
            ? `${window.location.origin}/webapps/diagnostico_9no_modulo01_aula_inteligente.html${
                docente?.nombreCompleto
                  ? `?docente=${encodeURIComponent(docente.nombreCompleto)}&institucion=${encodeURIComponent(docente.institucionNombre || "")}`
                  : ""
              }`
            : "http://localhost:3000/webapps/diagnostico_9no_modulo01_aula_inteligente.html"
        }
        titulo={diagnostico?.tituloSugerido || "Diagnóstico Integrado 9° - Aula Inteligente"}
        asignatura="Formación Tecnológica"
        nivel="9° Año - Secundaria"
        docenteNombre={docente?.nombreCompleto || ""}
      />
    </div>
  </AuthGuard>
  );
}
