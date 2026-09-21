"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useDocente } from "@/context/DocenteContext";
import {
  CATALOGO_III_CICLO,
  NIVELES_III_CICLO,
  MECANICAS_INTERACTIVAS,
  EjeCurricularIIICiclo,
  IndicadorCurricular,
  obtenerGamificacionParaIndicador,
} from "@/lib/pnftCurriculo";
import {
  generarPromptParaIAExterna,
  generarCodigoHTMLAutonomo,
  OpcionesGeneracionWebApp,
  AjusteNEEWebApp,
} from "@/lib/generadorWebAppEngine";
import WebAppPreviewFrame from "@/components/WebAppPreviewFrame";
import QRModalProyeccion from "@/components/QRModalProyeccion";
import {
  CodeBlock,
  Sparkle,
  Copy,
  Check,
  Play,
  DownloadSimple,
  Sliders,
  Eye,
  Info,
  GraduationCap,
  Lightbulb,
  Books,
  ArrowsClockwise,
  ShareNetwork,
  CheckCircle,
  DeviceMobile,
  Desktop,
  ChalkboardTeacher,
  Heart,
  ShieldCheck,
  House,
  UsersThree,
  HandHeart,
  Tag,
  GameController,
  Cube,
  Sword,
  Lightning,
  Trophy,
  Bug,
  Target,
  CloudArrowUp,
  QrCode,
  WhatsappLogo,
  BookmarkSimple,
  FolderOpen,
} from "@phosphor-icons/react";

function CreadorWebAppsContenido() {
  const searchParams = useSearchParams();
  const remixId = searchParams.get("remix");

  const { docente, guardarWebApp, webAppsComunidad, compartirEnComunidad } = useDocente();

  // 1. Parámetros Curriculares: Nivel y Módulo
  const [nivelEducativo, setNivelEducativo] = useState<string>(NIVELES_III_CICLO[0]);
  const nivelTextoCorto = nivelEducativo.split(" ")[0]; // "7°", "8°", "9°"

  const [moduloSeleccionado, setModuloSeleccionado] = useState<"Módulo 1 (I Periodo)" | "Módulo 2 (II Periodo)">(
    "Módulo 1 (I Periodo)"
  );

  // Filtrar catálogo por Nivel y Módulo
  const ejesFiltrados = CATALOGO_III_CICLO.filter(
    (e) => e.nivelAnual.startsWith(nivelTextoCorto) && e.moduloPeriodo === moduloSeleccionado
  );

  const fallbackEjes = CATALOGO_III_CICLO.filter((e) => e.nivelAnual.startsWith(nivelTextoCorto));
  const listaEjesActivos = ejesFiltrados.length > 0 ? ejesFiltrados : fallbackEjes;

  const [ejeSeleccionado, setEjeSeleccionado] = useState<EjeCurricularIIICiclo>(
    listaEjesActivos[0] || CATALOGO_III_CICLO[0]
  );
  const [indicadorSeleccionado, setIndicadorSeleccionado] = useState<IndicadorCurricular>(
    ejeSeleccionado?.indicadores?.[0] || CATALOGO_III_CICLO[0].indicadores[0]
  );

  // Campos pedagógicos vinculados al indicador oficial
  const [saberConceptual, setSaberConceptual] = useState(indicadorSeleccionado?.saberConceptual || "Algoritmo");
  const [saberProcedimental, setSaberProcedimental] = useState(
    indicadorSeleccionado?.saberProcedimental || "Formula algoritmos"
  );
  const [saberActitudinal, setSaberActitudinal] = useState(
    indicadorSeleccionado?.saberActitudinal || "Gusto por la precisión"
  );

  const [titulo, setTitulo] = useState("");
  const gamificacionAuto = obtenerGamificacionParaIndicador(indicadorSeleccionado);
  const [modo, setModo] = useState<"Individual" | "Parejas">("Individual");
  const [seccionesTexto, setSeccionesTexto] = useState("7-1, 7-2, 7-3");

  // 2. Elementos de Contexto Estudiantil & Ejes Transversales de Valores
  const [contextoHogar, setContextoHogar] = useState(
    "Vínculo con la vida cotidiana en el hogar, proyectos comunitarios y uso responsable de la tecnología en la familia."
  );

  const [ejesTransversalesSeleccionados, setEjesTransversalesSeleccionados] = useState<string[]>([
    "Prevención del Ciberacoso y Bullying",
    "Ética Digital y Uso Responsable de Redes",
    "Trabajo Colaborativo y Empatía",
  ]);

  const [valoresSeleccionados, setValoresSeleccionados] = useState<string[]>([
    "Respeto a la Diversidad",
    "Solidaridad",
    "Honestidad Académica",
  ]);

  // 3. Recursos Tecnológicos del Aula
  const [recursoTecnologico, setRecursoTecnologico] = useState<string>(
    "Celulares en Parejas o Individuales (Touch-First)"
  );

  // 4. Inclusión y Apoyo NEE (DUA Permanente)
  const [activarAjusteNEE, setActivarAjusteNEE] = useState(false);
  const [tipoAjusteNEE, setTipoAjusteNEE] = useState<"ACCESO" | "NO_SIGNIFICATIVA" | "SIGNIFICATIVA" | "PERSONALIZADA">("NO_SIGNIFICATIVA");
  const [indicacionNEE, setIndicacionNEE] = useState(
    "Segmentar el reto en micro-pasos guiados con apoyos visuales de lectura fácil y pistas paso a paso."
  );

  // Estados de Salidas, Subida de Canvas y Proyección
  const [produccionRemixOriginal, setProduccionRemixOriginal] = useState<string | null>(null);
  const [compartidoExitoso, setCompartidoExitoso] = useState(false);
  const [promptGenerado, setPromptGenerado] = useState("");
  const [codigoHTMLGenerado, setCodigoHTMLGenerado] = useState("");
  const [copiadoPrompt, setCopiadoPrompt] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<"formulario" | "preview">("formulario");

  // Subida de código Canvas / HTML y Almacenamiento en la Nube
  const [codigoCanvasPegado, setCodigoCanvasPegado] = useState("");
  const [webAppAlmacenada, setWebAppAlmacenada] = useState<any | null>(null);
  const [subiendoNube, setSubiendoNube] = useState(false);
  const [copiadoEnlace, setCopiadoEnlace] = useState(false);
  const [modalProyeccionAbierto, setModalProyeccionAbierto] = useState(false);

  // Procesar Remix si viene en URL
  useEffect(() => {
    if (remixId && webAppsComunidad.length > 0) {
      const encontrada = webAppsComunidad.find((w) => w.id === remixId);
      if (encontrada) {
        setProduccionRemixOriginal(encontrada.titulo);
        setTitulo(`${encontrada.titulo} (Remix Adaptado)`);
        setModo(encontrada.modo);
        setSaberConceptual(encontrada.saberConceptual || encontrada.titulo);
        setSaberProcedimental(encontrada.saberProcedimental || "Aplica y analiza");
        setSaberActitudinal(encontrada.saberActitudinal || "Gusto por la precisión");
      }
    }
  }, [remixId, webAppsComunidad]);

  // Sincronizar catálogo al cambiar nivel o módulo
  useEffect(() => {
    const nuevosEjes = CATALOGO_III_CICLO.filter(
      (e) => e.nivelAnual.startsWith(nivelTextoCorto) && e.moduloPeriodo === moduloSeleccionado
    );
    const listaValida = nuevosEjes.length > 0 ? nuevosEjes : CATALOGO_III_CICLO.filter((e) => e.nivelAnual.startsWith(nivelTextoCorto));

    if (listaValida.length > 0 && !remixId) {
      const nuevoEje = listaValida[0];
      const nuevoInd = nuevoEje.indicadores[0];
      setEjeSeleccionado(nuevoEje);
      setIndicadorSeleccionado(nuevoInd);
      setSaberConceptual(nuevoInd.saberConceptual);
      setSaberProcedimental(nuevoInd.saberProcedimental || "Aplica y formula");
      setSaberActitudinal(nuevoInd.saberActitudinal || "Gusto por la precisión");
      setSeccionesTexto(`${nivelTextoCorto}-1, ${nivelTextoCorto}-2, ${nivelTextoCorto}-3`);
    }
  }, [nivelEducativo, moduloSeleccionado, nivelTextoCorto, remixId]);

  const toggleEjeTransversal = (eje: string) => {
    if (ejesTransversalesSeleccionados.includes(eje)) {
      setEjesTransversalesSeleccionados(ejesTransversalesSeleccionados.filter((e) => e !== eje));
    } else {
      setEjesTransversalesSeleccionados([...ejesTransversalesSeleccionados, eje]);
    }
  };

  const toggleValor = (val: string) => {
    if (valoresSeleccionados.includes(val)) {
      setValoresSeleccionados(valoresSeleccionados.filter((v) => v !== val));
    } else {
      setValoresSeleccionados([...valoresSeleccionados, val]);
    }
  };

  const getNombresAjusteNEE = () => {
    switch (tipoAjusteNEE) {
      case "ACCESO":
        return "Adecuación de Acceso (Lectura Fácil, Tipografía Adaptada, Alto Contraste)";
      case "NO_SIGNIFICATIVA":
        return "Adecuación No Significativa (Micro-Pasos Guiados, Pistas Visuales, Tiempos Flexibles)";
      case "SIGNIFICATIVA":
        return "Adecuación Significativa (Procedimental Simplificado y Refuerzo Directo)";
      case "PERSONALIZADA":
        return "Ajuste Individualizado Personalizado";
    }
  };

  const getOpciones = (): OpcionesGeneracionWebApp => {
    const ajusteNEEObj: AjusteNEEWebApp | undefined = activarAjusteNEE
      ? {
          tipo: tipoAjusteNEE,
          nombreAjuste: getNombresAjusteNEE(),
          descripcionAjuste: indicacionNEE,
          esRecursoIndividualizado: true,
        }
      : undefined;

    const seccionesArray = seccionesTexto
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return {
      titulo: titulo.trim() || `Actividad de ${saberConceptual}`,
      docenteId: docente?.idDocente || "DOC-DRE01-7729",
      docenteNombre: docente?.nombreCompleto || "Prof. Alberto Bustos Ortega",
      asignatura: ejeSeleccionado.area || "Formación Tecnológica",
      nivel: nivelEducativo,
      saberTitulo: `${moduloSeleccionado} • ${ejeSeleccionado.titulo || "Saber Tecnológico"}`,
      saberConceptual,
      explicacionPedagogica: indicadorSeleccionado.explicacionPedagogica,
      indicadorCodigo: indicadorSeleccionado.codigo,
      indicadorNombre: indicadorSeleccionado.nombre,
      saberProcedimental,
      saberActitudinal,
      mecanica: gamificacionAuto.nombre,
      modo,
      elementosContextoEstudiantil: contextoHogar,
      valoresTransversalesMEP: [...ejesTransversalesSeleccionados, ...valoresSeleccionados],
      recursoTecnologicoAula: recursoTecnologico,
      ajusteNEE: ajusteNEEObj,
      seccionesDisponibles: seccionesArray.length > 0 ? seccionesArray : ["7-1", "7-2"],
      rubricaCotidiano: {
        inicial: indicadorSeleccionado.criterioInicial,
        intermedio: indicadorSeleccionado.criterioIntermedio,
        avanzado: indicadorSeleccionado.criterioAvanzado,
      },
      instrumentoEvaluacion: {
        criterioCognitivo: `Identifica y explica los fundamentos de ${saberConceptual} según el indicador [${indicadorSeleccionado.codigo}].`,
        criterioProcedimental: `Aplica ${saberProcedimental} en la resolución del reto interactivo.`,
        criterioSocioafectivo: `Demuestra ${saberActitudinal} durante el desarrollo de la actividad.`,
        escalas: {
          consolidado: indicadorSeleccionado.criterioAvanzado,
          desarrollo: indicadorSeleccionado.criterioIntermedio,
          acompanamiento: indicadorSeleccionado.criterioInicial,
        },
      },
    };
  };

  // Generar Prompt y HTML reactivamente
  useEffect(() => {
    const opts = getOpciones();
    const prompt = generarPromptParaIAExterna(opts);
    const html = generarCodigoHTMLAutonomo(opts);
    setPromptGenerado(prompt);
    setCodigoHTMLGenerado(html);
  }, [
    titulo,
    moduloSeleccionado,
    ejeSeleccionado,
    indicadorSeleccionado,
    saberConceptual,
    saberProcedimental,
    saberActitudinal,
    nivelEducativo,
    gamificacionAuto,
    modo,
    seccionesTexto,
    contextoHogar,
    ejesTransversalesSeleccionados,
    valoresSeleccionados,
    recursoTecnologico,
    activarAjusteNEE,
    tipoAjusteNEE,
    indicacionNEE,
    docente,
  ]);

  const copiarPrompt = () => {
    navigator.clipboard.writeText(promptGenerado);
    setCopiadoPrompt(true);
    setTimeout(() => setCopiadoPrompt(false), 2500);
  };

  const guardarLocalmente = (codigoPersonalizado?: string) => {
    const idGenerado = "webapp-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
    const webappNueva = {
      id: idGenerado,
      titulo: titulo.trim() || `Actividad de ${saberConceptual}`,
      docenteId: docente?.idDocente || "DOC-DRE01-7729",
      asignatura: ejeSeleccionado.area || "Formación Tecnológica",
      nivel: nivelEducativo,
      saberTitulo: `${moduloSeleccionado} • ${ejeSeleccionado.titulo}`,
      indicadorCodigo: indicadorSeleccionado.codigo,
      indicadorNombre: indicadorSeleccionado.nombre,
      saberConceptual,
      saberProcedimental,
      saberActitudinal,
      mecanica: gamificacionAuto.nombre,
      modo,
      codigoHTML: codigoPersonalizado || codigoCanvasPegado.trim() || codigoHTMLGenerado,
      fechaCreacion: new Date().toISOString(),
      visitas: 1,
    };
    guardarWebApp(webappNueva as any);
    return webappNueva;
  };

  const descargarHTML = () => {
    const codigoADescargar = codigoCanvasPegado.trim() || codigoHTMLGenerado;
    const blob = new Blob([codigoADescargar], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${titulo.toLowerCase().replace(/[^a-z0-9]/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    guardarLocalmente(codigoADescargar);
  };

  const handleCompartirComunidad = () => {
    const wa = guardarLocalmente();
    compartirEnComunidad(wa as any);
    setCompartidoExitoso(true);
    setTimeout(() => setCompartidoExitoso(false), 3500);
  };

  // Subir y almacenar en la nube (para compartir enlace PWA y proyectar)
  const handleSubirYAlmacenarNube = async () => {
    const codigoFinal = codigoCanvasPegado.trim() || codigoHTMLGenerado;
    if (!codigoFinal) {
      alert("Por favor genera o pega el código HTML antes de subir.");
      return;
    }

    setSubiendoNube(true);
    try {
      const waLocal = guardarLocalmente(codigoFinal);

      // Guardar también en endpoint del servidor
      const res = await fetch("/api/webapps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(waLocal),
      });

      if (res.ok) {
        const json = await res.json();
        setWebAppAlmacenada(json.data || waLocal);
      } else {
        setWebAppAlmacenada(waLocal);
      }
    } catch (e) {
      const waLocal = guardarLocalmente(codigoFinal);
      setWebAppAlmacenada(waLocal);
    }
    setSubiendoNube(false);
  };

  // Carga de archivo .html
  const handleCargarArchivoHTML = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      alert("Por favor selecciona un archivo con extensión .html o .htm");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const contenido = event.target?.result as string;
      setCodigoCanvasPegado(contenido);
    };
    reader.readAsText(file);
  };

  const urlBase = typeof window !== "undefined" ? window.location.origin : "https://creador-webapps.local";
  const urlPublicada = webAppAlmacenada ? `${urlBase}/play/${webAppAlmacenada.id}` : "";

  const copiarEnlacePublicado = () => {
    navigator.clipboard.writeText(urlPublicada);
    setCopiadoEnlace(true);
    setTimeout(() => setCopiadoEnlace(false), 2500);
  };

  const compartirPorWhatsApp = () => {
    const texto = `👋 Hola estudiantes, aquí tienen el enlace oficial para ingresar a la actividad interactiva: *"${titulo}"* (${ejeSeleccionado.area} • ${nivelEducativo})\n\n🔗 ${urlPublicada}\n\n📲 *En iPhone:* Abre en Safari y toca Compartir 📤 -> "Agregar a inicio" ➕.\n🤖 *En Android:* Toca "Instalar aplicación" en Chrome.\n\n¡Mucho éxito en el reto! 🚀`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              III Ciclo de Secundaria (7°, 8° y 9°)
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-full border border-emerald-300">
              Dimensión 1 & Dimensión 2
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Recurso para Creación de WebApps Educativas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Diseño instruccional en 4 Fases: <em>Aprender ➔ Comprender ➔ Simulación & Gamificación ➔ Valoración</em> con contexto estudiantil, DUA y PWA móvil
          </p>
        </div>

        {/* Pestañas de Vista */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto gap-1">
          <button
            onClick={() => setVistaActiva("formulario")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              vistaActiva === "formulario"
                ? "bg-white text-emerald-950 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders size={16} weight="bold" />
            <span>Diseño & Prompt</span>
          </button>
          <button
            onClick={() => setVistaActiva("preview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              vistaActiva === "preview"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye size={16} weight="bold" />
            <span>Vista Previa Interactiva</span>
          </button>
        </div>
      </div>

      {/* Aviso Pedagógico */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl p-4.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-start gap-3">
          <Info size={22} weight="duotone" className="text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-extrabold text-emerald-950 uppercase tracking-wide text-[11px]">
              Recurso de Apoyo para la Creación de WebApps (Dimensión 1 & Dimensión 2)
            </div>
            <div className="text-slate-600 leading-relaxed">
              Basado en los saberes e indicadores del <em>Programa Nacional de Informática Educativa del Departamento de Recursos Tecnológicos en Educación (DRTE - MEP)</em> únicamente como referencia curricular. <strong>No es un recurso oficial</strong>; la adopción es voluntaria y la decisión didáctica corresponde siempre al docente.
            </div>
          </div>
        </div>
        <span className="self-start sm:self-center shrink-0 px-3 py-1 bg-white border border-emerald-200 rounded-xl font-bold text-[11px] text-emerald-800 shadow-2xs">
          Decisión Docente
        </span>
      </div>

      {/* Alerta de Remix si aplica */}
      {produccionRemixOriginal && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2.5">
            <ShareNetwork size={20} weight="bold" className="text-indigo-600 shrink-0" />
            <span>
              <strong>Modo Remix Activo:</strong> Estás personalizando y adaptando la WebApp: <em>&quot;{produccionRemixOriginal}&quot;</em> para tu contexto educativo.
            </span>
          </div>
          <span className="px-2.5 py-0.5 bg-indigo-200 text-indigo-950 font-bold rounded-full text-[10px]">
            Remix
          </span>
        </div>
      )}

      {/* Vista de Formulario / Configuración */}
      {vistaActiva === "formulario" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: CONFIGURACIÓN PEDAGÓGICA Y CURRICULAR (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* TARJETA 1: Parámetros Curriculares, Nivel, Módulo e Indicador de Logro Oficial */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={20} weight="duotone" className="text-emerald-700" />
                  <span>1. Nivel, Módulo & Indicador de Logro Curricular</span>
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Curricular Oficial
                </span>
              </div>

              {/* Selector de Nivel (7°, 8°, 9°) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Nivel Educativo (Secundaria):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NIVELES_III_CICLO.map((lvl) => {
                    const activo = nivelEducativo === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNivelEducativo(lvl)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                          activo
                            ? "bg-emerald-800 text-white border-emerald-900 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {lvl.split(" ")[0]} Año
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Módulo (I Periodo vs II Periodo) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Módulo de Formación Tecnológica:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "Módulo 1 (I Periodo)", label: "Módulo 1 • I Periodo (Apropiación y Algoritmia)" },
                    { id: "Módulo 2 (II Periodo)", label: "Módulo 2 • II Periodo (Programación y Circuitos)" },
                  ].map((mod) => {
                    const activo = moduloSeleccionado === mod.id;
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        onClick={() => setModuloSeleccionado(mod.id as any)}
                        className={`p-3 rounded-xl text-left text-xs font-bold transition-all border flex items-center gap-2 ${
                          activo
                            ? "bg-emerald-50 border-emerald-600 text-emerald-950 shadow-xs ring-1 ring-emerald-500"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <BookmarkSimple size={18} weight={activo ? "fill" : "regular"} className={activo ? "text-emerald-700" : "text-slate-400"} />
                        <span>{mod.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Título de la Actividad */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título de la WebApp / Actividad:
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Anota el nombre de la WebApp y su saber a desarrollar (ej: Simulador de Reglas y Cuidado de la Computadora)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold placeholder:text-slate-400 placeholder:italic focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              {/* Selector de área conceptual y saber conceptual */}
              <div className="space-y-3 pt-1">
                {/* 1. Área conceptual a abordar */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Área conceptual a abordar:</span>
                    <span className="text-[10px] text-slate-500 font-normal">
                      {listaEjesActivos.length} {listaEjesActivos.length === 1 ? "área disponible" : "áreas disponibles"}
                    </span>
                  </label>
                  <select
                    value={ejeSeleccionado?.id}
                    onChange={(e) => {
                      const found = listaEjesActivos.find((item) => item.id === e.target.value);
                      if (found) {
                        setEjeSeleccionado(found);
                        const primerInd = found.indicadores[0];
                        setIndicadorSeleccionado(primerInd);
                        setSaberConceptual(primerInd.saberConceptual);
                        setSaberProcedimental(primerInd.saberProcedimental || "Aplica y formula");
                        setSaberActitudinal(primerInd.saberActitudinal || "Gusto por la precisión");
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    {listaEjesActivos.map((eje) => (
                      <option key={eje.id} value={eje.id}>
                        {eje.area}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Saber conceptual */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Saber conceptual:</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Saber curricular
                    </span>
                  </label>
                  <select
                    value={indicadorSeleccionado?.codigo}
                    onChange={(e) => {
                      const found = ejeSeleccionado.indicadores.find((i) => i.codigo === e.target.value);
                      if (found) {
                        setIndicadorSeleccionado(found);
                        setSaberConceptual(found.saberConceptual);
                        setSaberProcedimental(found.saberProcedimental || "Aplica y formula");
                        setSaberActitudinal(found.saberActitudinal || "Gusto por la precisión");
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
                  >
                    {ejeSeleccionado?.indicadores.map((ind) => (
                      <option key={ind.codigo} value={ind.codigo}>
                        {ind.saberConceptual} • [{ind.codigo}] {ind.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Indicador de logro curricular */}
                <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2 text-xs shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-emerald-950 flex items-center gap-1.5">
                      <Target size={16} weight="bold" className="text-emerald-700" />
                      Indicador de logro curricular:
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-800 text-white font-mono font-bold text-[10px] rounded shadow-2xs">
                      {indicadorSeleccionado.codigo}
                    </span>
                  </div>
                  <div className="text-emerald-950 font-extrabold text-xs">
                    {indicadorSeleccionado.nombre}
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11.5px]">
                    <strong>Enunciado del indicador:</strong> {indicadorSeleccionado.descripcion}
                  </p>
                </div>

                {/* 4. Rúbrica de desempeño: [Código] */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800">
                      Rúbrica de desempeño: [{indicadorSeleccionado.codigo}]
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {indicadorSeleccionado.saberConceptual}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">Nivel inicial:</span>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{indicadorSeleccionado.criterioInicial}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-blue-700 block uppercase">Nivel intermedio:</span>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{indicadorSeleccionado.criterioIntermedio}</p>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Nivel avanzado:</span>
                      <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{indicadorSeleccionado.criterioAvanzado}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Articulación de los 3 saberes curriculares (predeterminados y fijos) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                  <span>Alineación pedagógica de saberes:</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                    ✓ Predeterminado y alineado
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-blue-900 uppercase">Saber (conceptual)</span>
                      <span className="text-[9px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">Fijo</span>
                    </div>
                    <div className="w-full bg-white px-2.5 py-1.5 border border-blue-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs">
                      {indicadorSeleccionado.saberConceptual}
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-emerald-900 uppercase">Hacer (procedimental)</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">Fijo</span>
                    </div>
                    <div className="w-full bg-white px-2.5 py-1.5 border border-emerald-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs">
                      {indicadorSeleccionado.saberProcedimental || "Aplica y formula"}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-amber-900 uppercase">Ser (actitudinal)</span>
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">Fijo</span>
                    </div>
                    <div className="w-full bg-white px-2.5 py-1.5 border border-amber-200 rounded-lg text-xs font-bold text-slate-800 shadow-2xs">
                      {indicadorSeleccionado.saberActitudinal || "Gusto por la precisión"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TARJETA 2: Gamificación y vínculo emocional (sincronizado por IA) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GameController size={20} weight="duotone" className="text-indigo-600" />
                  <span>2. Gamificación y vínculo emocional (sincronizado por IA)</span>
                </h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Sparkle size={12} weight="fill" className="text-emerald-600" />
                  Sincronización automática
                </span>
              </div>

              {/* Tarjeta de Gamificación Óptima Sincronizada */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
                      <GameController size={20} weight="duotone" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Mecánica interactiva adaptada:
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {gamificacionAuto.nombre}
                      </span>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-full shadow-2xs">
                    {gamificacionAuto.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-rose-700 uppercase flex items-center gap-1">
                      <Heart size={13} weight="fill" className="text-rose-500" />
                      Vínculo emocional:
                    </span>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {gamificacionAuto.vinculoEmocional}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1">
                      <Target size={13} weight="bold" className="text-indigo-600" />
                      Propósito pedagógico:
                    </span>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {gamificacionAuto.propositoPedagogico}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modalidad de interacción y componente de evaluación */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Modalidad de trabajo en el aula:
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Evaluación formativa individualizada para trabajo cotidiano
                    </span>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                    <button
                      type="button"
                      onClick={() => setModo("Individual")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        modo === "Individual"
                          ? "bg-white text-emerald-950 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Individual (oficial)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModo("Parejas")}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        modo === "Parejas"
                          ? "bg-white text-emerald-950 shadow-xs border border-slate-200"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      En parejas (colaborativo)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TARJETA 3: Contexto estudiantil y valores transversales */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <House size={18} weight="duotone" className="text-emerald-700" />
                  <span>3. Elementos de contexto estudiantil y valores transversales</span>
                </h2>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Formación integral
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vínculo con el hogar y entorno comunitario:
                </label>
                <textarea
                  rows={2}
                  value={contextoHogar}
                  onChange={(e) => setContextoHogar(e.target.value)}
                  placeholder="Describe cómo se relaciona este aprendizaje con la vida diaria en el hogar o la comunidad..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Ejes transversales de convivencia */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Ejes transversales de convivencia y prevención escolar:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Prevención del ciberacoso y bullying",
                    "Prevención del consumo de drogas",
                    "Ética digital y uso responsable de redes",
                    "Trabajo colaborativo y empatía",
                    "Cuidado del medio ambiente y sostenibilidad",
                  ].map((eje) => {
                    const sel = ejesTransversalesSeleccionados.includes(eje);
                    return (
                      <button
                        type="button"
                        key={eje}
                        onClick={() => toggleEjeTransversal(eje)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          sel
                            ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {sel ? "✓ " : "+ "}
                        {eje}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Valores transversales */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Valores transversales a fortalecer:
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Respeto a la diversidad", "Solidaridad", "Honestidad académica", "Responsabilidad", "Pensamiento crítico"].map(
                    (val) => {
                      const sel = valoresSeleccionados.includes(val);
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => toggleValor(val)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            sel
                              ? "bg-amber-50 border-amber-500 text-amber-900 shadow-2xs"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {sel ? "✓ " : "+ "}
                          {val}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* TARJETA 4: Recursos tecnológicos del aula y secciones */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Desktop size={18} weight="duotone" className="text-purple-700" />
                  <span>4. Recursos tecnológicos del aula y secciones</span>
                </h2>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Infraestructura
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: "Celulares en Parejas o Individuales (Touch-First)", label: "Celulares (móvil)", icon: <DeviceMobile size={20} /> },
                  { id: "Laboratorio con Computadoras Fijas (Teclado/Mouse)", label: "Laboratorio PC", icon: <Desktop size={20} /> },
                  { id: "Tabletas Desconectadas (Offline SafeStorage)", label: "Tabletas offline", icon: <DeviceMobile size={20} /> },
                  { id: "Proyector en Pizarra de Aula (Botones Grandes)", label: "Proyector pizarra", icon: <ChalkboardTeacher size={20} /> },
                ].map((rec) => {
                  const sel = recursoTecnologico === rec.id;
                  return (
                    <button
                      type="button"
                      key={rec.id}
                      onClick={() => setRecursoTecnologico(rec.id)}
                      className={`p-3 rounded-xl text-center flex flex-col items-center gap-1.5 border transition-all ${
                        sel
                          ? "bg-purple-50 border-purple-600 text-purple-900 shadow-2xs font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className={sel ? "text-purple-700" : "text-slate-500"}>{rec.icon}</span>
                      <span className="text-[11px] leading-tight">{rec.label}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secciones habilitadas para esta webapp:
                </label>
                <input
                  type="text"
                  value={seccionesTexto}
                  onChange={(e) => setSeccionesTexto(e.target.value)}
                  placeholder="Ej: 7-1, 7-2, 7-3, 7-4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold"
                />
              </div>
            </div>

            {/* TARJETA 5: DUA universal y ajustes NEE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <HandHeart size={20} weight="duotone" className="text-rose-600" />
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    5. DUA universal y apoyos educativos
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black">
                  DUA permanente activo
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                <span>
                  <strong>Diseño universal para el aprendizaje (DUA):</strong> Integrado permanentemente en el 100% de las webapps (apoyos visuales, auditivos Web Audio API y navegación accesible).
                </span>
              </div>

              {/* Interruptor para recurso individualizado NEE */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={activarAjusteNEE}
                    onChange={(e) => setActivarAjusteNEE(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-extrabold text-slate-900">
                    ¿Generar versión individualizada para estudiante con apoyo educativo específico?
                  </span>
                </label>
              </div>

              {activarAjusteNEE && (
                <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900">
                    <Tag size={16} weight="bold" />
                    <span>Configuración del recurso individualizado:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { id: "ACCESO", label: "Adecuación de acceso (lectura fácil, tipografía)" },
                      { id: "NO_SIGNIFICATIVA", label: "Adecuación no significativa (micro-pasos, pistas)" },
                      { id: "SIGNIFICATIVA", label: "Adecuación significativa (procedimental simplificado)" },
                      { id: "PERSONALIZADA", label: "Instrucción específica personalizada" },
                    ].map((tipo) => (
                      <button
                        type="button"
                        key={tipo.id}
                        onClick={() => setTipoAjusteNEE(tipo.id as any)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                          tipoAjusteNEE === tipo.id
                            ? "bg-white border-amber-600 font-bold text-amber-950 shadow-2xs"
                            : "bg-amber-100/50 border-amber-200 text-amber-900 hover:bg-white"
                        }`}
                      >
                        {tipo.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Pautas y ajustes específicos para este estudiante:
                    </label>
                    <textarea
                      rows={2}
                      value={indicacionNEE}
                      onChange={(e) => setIndicacionNEE(e.target.value)}
                      placeholder="Indica apoyos requeridos: ritmo guiado, refuerzos visuales..."
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* COLUMNA DERECHA: PROMPT MAESTRO + SUBIDA DE CANVAS + COMPARTIR PWA Y PROYECCIÓN (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* TARJETA DE PROMPT MAESTRO BLINDADO */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkle size={20} weight="fill" className="text-amber-400" />
                    <h3 className="text-base font-black text-white">Prompt Maestro Blindado</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                    Universal
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Copia y lleva este prompt a <strong>Gemini Canvas</strong>, <strong>Claude</strong> o <strong>ChatGPT</strong> para generar la WebApp con simulaciones ricas e interactivas adaptadas al indicador oficial.
                </p>
              </div>

              {/* Botón Principal: Copiar Prompt */}
              <button
                onClick={copiarPrompt}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
              >
                {copiadoPrompt ? <Check size={18} weight="bold" className="text-emerald-300" /> : <Copy size={18} weight="bold" />}
                <span>{copiadoPrompt ? "¡Prompt Copiado al Portapapeles!" : "📋 Copiar y llevar a Gemini Canvas / IA"}</span>
              </button>

              {/* Vista Previa del Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Estructura de 4 Fases + Telemetría</span>
                  <span>{promptGenerado.length} caracteres</span>
                </div>
                <pre className="p-3.5 bg-slate-950 rounded-2xl text-[11px] font-mono text-emerald-200 overflow-x-auto max-h-48 border border-slate-800 leading-relaxed">
                  {promptGenerado}
                </pre>
              </div>

              {/* Botón Descargar HTML compilado */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={descargarHTML}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
                >
                  <DownloadSimple size={16} weight="bold" />
                  <span>⚡ Descargar Archivo .html Base (0ms)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setVistaActiva("preview")}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
                  >
                    <Play size={15} weight="bold" />
                    <span>Vista Previa</span>
                  </button>

                  <button
                    onClick={handleCompartirComunidad}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-indigo-900/80 hover:bg-indigo-800 text-sky-200 border border-indigo-700/60 font-bold text-xs rounded-xl transition-colors"
                  >
                    <ShareNetwork size={15} weight="bold" />
                    <span>{compartidoExitoso ? "¡Compartido!" : "Espacio Común"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* TARJETA DE SUBIDA DE CÓDIGO CANVAS / HTML & PUBLICACIÓN PWA CON PROYECCIÓN */}
            <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-emerald-500/30 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
                    <CloudArrowUp size={22} weight="bold" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white leading-tight">
                      Subir WebApp (Canvas / HTML)
                    </h3>
                    <span className="text-[10px] text-emerald-400 font-bold">
                      Almacenar en la Nube ➔ Compartir PWA & Proyectar
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Pega el código HTML generado en <strong>Gemini Canvas</strong> o carga tu archivo <strong>.html</strong> para guardarlo en la nube, generar enlace para estudiantes (PWA) y proyectarlo en pantalla completa.
              </p>

              {/* Área de texto para pegar el código HTML de Canvas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-200">
                    Código HTML generado en Gemini Canvas / IA:
                  </label>
                  <label className="cursor-pointer text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1">
                    <FolderOpen size={14} />
                    <span>Cargar archivo .html</span>
                    <input
                      type="file"
                      accept=".html,.htm"
                      onChange={handleCargarArchivoHTML}
                      className="hidden"
                    />
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={codigoCanvasPegado}
                  onChange={(e) => setCodigoCanvasPegado(e.target.value)}
                  placeholder="<!DOCTYPE html> ... Pega aquí todo el código HTML de Gemini Canvas o pulsa Cargar archivo .html"
                  className="w-full p-3 bg-slate-950/90 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-400 leading-relaxed"
                />
              </div>

              {/* Botón Subir y Almacenar */}
              <button
                onClick={handleSubirYAlmacenarNube}
                disabled={subiendoNube}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all"
              >
                <CloudArrowUp size={20} weight="bold" />
                <span>{subiendoNube ? "Subiendo y Almacenando..." : "☁️ Subir y Guardar en la Nube"}</span>
              </button>

              {/* Resultado de Almacenamiento: Enlace PWA, Guía iPhone/Android y Botón Proyectar */}
              {webAppAlmacenada && (
                <div className="p-4 bg-slate-950/90 border border-emerald-400/40 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle size={16} weight="fill" className="text-emerald-400" />
                      <span>¡WebApp Guardada y Lista para Compartir!</span>
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">ID: {webAppAlmacenada.id}</span>
                  </div>

                  {/* Enlace Directo para Estudiantes */}
                  <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-emerald-200 truncate select-all">
                      {urlPublicada}
                    </span>
                    <button
                      onClick={copiarEnlacePublicado}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
                    >
                      {copiadoEnlace ? <Check size={14} weight="bold" /> : <Copy size={14} weight="bold" />}
                      <span>{copiadoEnlace ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>

                  {/* Botones de Proyección y WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setModalProyeccionAbierto(true)}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                    >
                      <ChalkboardTeacher size={18} weight="bold" />
                      <span>📽️ Proyectar en Aula</span>
                    </button>

                    <button
                      onClick={compartirPorWhatsApp}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                    >
                      <WhatsappLogo size={18} weight="fill" />
                      <span>Enviar a WhatsApp</span>
                    </button>
                  </div>

                  {/* Guía Rápida para iPhone / iPad & Android */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-left space-y-2 text-xs">
                    <div className="font-extrabold text-sky-300 flex items-center gap-1.5">
                      <span>📲</span>
                      <span>Instalación en la pantalla del celular (PWA):</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-300 leading-snug">
                      <p>
                        • <strong>🍎 En iPhone / iPad (Safari):</strong> Abre el enlace en Safari ➔ Toca el botón <strong>Compartir</strong> 📤 ➔ Selecciona <strong>«Agregar a pantalla de inicio»</strong> ➕.
                      </p>
                      <p>
                        • <strong>🤖 En Android (Chrome):</strong> Abre el enlace en Chrome ➔ Toca el mensaje <strong>«Instalar aplicación»</strong> o menú (⋮) ➔ <strong>«Agregar a pantalla principal»</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        /* Vista Previa Interactiva de la WebApp */
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-slate-100 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                Simulación y Ejecución en Vivo de la WebApp
              </span>
            </div>
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
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs"
              >
                Volver al Diseñador
              </button>
            </div>
          </div>

          <WebAppPreviewFrame
            codigoHTML={codigoCanvasPegado.trim() || codigoHTMLGenerado}
            titulo={titulo}
            docenteId={docente?.idDocente || "DOC-DRE01-7729"}
            onDescargar={descargarHTML}
          />
        </div>
      )}

      {/* Modal de Proyección en Pantalla Completa con QR Gigante */}
      <QRModalProyeccion
        abierto={modalProyeccionAbierto}
        alCerrar={() => setModalProyeccionAbierto(false)}
        urlWebApp={urlPublicada || `${urlBase}/play/${webAppAlmacenada?.id || "demo"}`}
        titulo={titulo}
        asignatura={ejeSeleccionado.area || "Formación Tecnológica"}
        nivel={nivelEducativo}
        docenteNombre={docente?.nombreCompleto || "Prof. Alberto Bustos Ortega"}
      />
    </div>
  );
}

export default function CreadorWebAppsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 text-xs font-bold">
          Cargando Creador de WebApps...
        </div>
      }
    >
      <CreadorWebAppsContenido />
    </Suspense>
  );
}

