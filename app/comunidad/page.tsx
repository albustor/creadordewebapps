"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDocente } from "@/context/DocenteContext";
import { WebAppComunidad, obtenerProduccionConHTML } from "@/lib/comunidadData";
import {
  Sparkle,
  ArrowsClockwise,
  Play,
  DownloadSimple,
  MagnifyingGlass,
  Funnel,
  GraduationCap,
  UsersThree,
  CodeBlock,
  Tag,
  CheckCircle,
  Lightbulb,
  ShareNetwork,
  Eye,
  CaretRight,
  PlusCircle,
  ShieldCheck,
} from "@phosphor-icons/react";

export default function EspacioComunPage() {
  const router = useRouter();
  const { webAppsComunidad, guardarWebApp } = useDocente();

  // Estados de Filtros
  const [busqueda, setBusqueda] = useState("");
  const [nivelFiltro, setNivelFiltro] = useState<string>("todos");
  const [mecanicaFiltro, setMecanicaFiltro] = useState<string>("todas");
  const [areaFiltro, setAreaFiltro] = useState<string>("todas");

  // Modal de Detalles / Previsualización rápida
  const [produccionSeleccionada, setProduccionSeleccionada] = useState<WebAppComunidad | null>(null);
  const [descargandoId, setDescargandoId] = useState<string | null>(null);

  // Filtrado reactivo de producciones
  const produccionesFiltradas = useMemo(() => {
    return webAppsComunidad.filter((item) => {
      const matchTexto =
        item.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.saberConceptual.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.indicadorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.indicadorCodigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.autorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(busqueda.toLowerCase()));

      const matchNivel =
        nivelFiltro === "todos" ? true : item.nivel.startsWith(nivelFiltro);

      const matchMecanica =
        mecanicaFiltro === "todas" ? true : item.mecanica === mecanicaFiltro;

      const matchArea =
        areaFiltro === "todas" ? true : item.area.toLowerCase().includes(areaFiltro.toLowerCase());

      return matchTexto && matchNivel && matchMecanica && matchArea;
    });
  }, [webAppsComunidad, busqueda, nivelFiltro, mecanicaFiltro, areaFiltro]);

  // Manejar el Remix: Redirigir al Creador de WebApps con los parámetros cargados
  const handleRemix = (prod: WebAppComunidad) => {
    const prodCompleta = obtenerProduccionConHTML(prod);
    // Guardar temporalmente en el catálogo local para editarla inmediatamente
    guardarWebApp({
      id: `remix-${Date.now()}-${prod.id}`,
      titulo: `${prod.titulo} (Adaptación para mi Aula)`,
      docenteId: "DOC-DRE01-7729",
      asignatura: prod.area,
      nivel: prod.nivel,
      saberTitulo: prod.saberTitulo,
      indicadorCodigo: prod.indicadorCodigo,
      indicadorNombre: prod.indicadorNombre,
      mecanica: prod.mecanica,
      modo: prod.modo,
      codigoHTML: prodCompleta.codigoHTML || "",
      fechaCreacion: new Date().toISOString(),
      visitas: 0,
    });

    // Redirigir al Creador de WebApps pasando el ID de remix
    router.push(`/taller-webapps?remix=${prod.id}`);
  };

  // Descargar HTML directo de una producción comunitaria
  const handleDescargar = (prod: WebAppComunidad) => {
    setDescargandoId(prod.id);
    const prodCompleta = obtenerProduccionConHTML(prod);
    const blob = new Blob([prodCompleta.codigoHTML || ""], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${prod.titulo.toLowerCase().replace(/[^a-z0-9]/g, "_")}_remix.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => setDescargandoId(null), 1500);
  };

  // Métricas totales
  const totalRemixes = webAppsComunidad.reduce((acc, p) => acc + (p.remixesCount || 0), 0);
  const totalEstudiantes = webAppsComunidad.reduce((acc, p) => acc + (p.estudiantesEvaluados || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-blue-800/40">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <ShareNetwork size={320} weight="duotone" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-bold text-sky-300">
            <Sparkle size={14} weight="fill" className="text-amber-400" />
            <span>Espacio Común de Producciones Docentes (III Ciclo)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Galería Compartida & Opción de <span className="text-sky-400">Remix</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Aprovecha WebApps creadas por otros colegas de secundaria (7°, 8° y 9°), pruébalas en vivo
            y haz clic en <strong>&quot;Remix&quot;</strong> para clonarlas y personalizar la explicación,
            los retos y la rúbrica formativa al contexto específico de tu aula.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/taller-webapps"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
            >
              <PlusCircle size={18} weight="bold" />
              <span>Crear Nueva Producción</span>
            </Link>
            <Link
              href="/diagnostico"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
            >
              <Sparkle size={18} weight="fill" className="text-amber-400" />
              <span>Diagnóstico desde Documento</span>
            </Link>
          </div>
        </div>

        {/* Métricas en Barra */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-sky-300">{webAppsComunidad.length}</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Producciones Activas</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-amber-300">{totalRemixes}</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Remixes Adaptados</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">{totalEstudiantes}+</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Evaluaciones Formativas</div>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-purple-300">4 Fases</div>
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">Estructura Pedagógica</div>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
        {/* Buscador de Texto */}
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3.5 top-3.5 text-slate-400" weight="bold" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por tema (ej: Algoritmos, Circuitos, Domótica, Ciberseguridad, 7.PR.01, Prof. Alberto)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              className="absolute right-3.5 top-3 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-1 rounded-md"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros por Categoría */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Nivel Educativo */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Nivel (Secundaria):
            </label>
            <select
              value={nivelFiltro}
              onChange={(e) => setNivelFiltro(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
            >
              <option value="todos">Todos los Niveles (7°, 8°, 9°)</option>
              <option value="7">7° Año - Secundaria</option>
              <option value="8">8° Año - Secundaria</option>
              <option value="9">9° Año - Secundaria</option>
            </select>
          </div>

          {/* Mecánica Interactiva */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Mecánica Interactiva:
            </label>
            <select
              value={mecanicaFiltro}
              onChange={(e) => setMecanicaFiltro(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
            >
              <option value="todas">Todas las Mecánicas</option>
              <option value="Simulador interactivo">Simulador interactivo</option>
              <option value="Quiz gamificado">Quiz gamificado</option>
              <option value="Aventura gráfica">Aventura gráfica</option>
              <option value="Tablero de retos">Tablero de retos</option>
            </select>
          </div>

          {/* Área Curricular */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Área Curricular:
            </label>
            <select
              value={areaFiltro}
              onChange={(e) => setAreaFiltro(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
            >
              <option value="todas">Todas las Áreas</option>
              <option value="Programación">Programación y Algoritmos</option>
              <option value="Robótica">Computación Física y Robótica</option>
              <option value="Datos">Ciencia de Datos e Inteligencia Artificial</option>
              <option value="Apropiación">Apropiación Tecnológica y Digital</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Producciones Compartidas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-slate-900">
              Producciones Disponibles ({produccionesFiltradas.length})
            </span>
            <span className="text-xs text-slate-500">listas para Remix y Trabajo Cotidiano</span>
          </div>
        </div>

        {produccionesFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Funnel size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No se encontraron producciones</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Prueba modificando tus términos de búsqueda o restableciendo los filtros de nivel y mecánica.
            </p>
            <button
              onClick={() => {
                setBusqueda("");
                setNivelFiltro("todos");
                setMecanicaFiltro("todas");
                setAreaFiltro("todas");
              }}
              className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produccionesFiltradas.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-blue-900 text-white text-[11px] font-black rounded-lg">
                      {prod.nivel}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-extrabold rounded-lg">
                      {prod.mecanica}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {prod.titulo}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prod.area}</p>
                  </div>

                  {/* Articulación de Saberes y 4 Fases */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-700">Saber Conceptual:</span>
                      <span className="font-mono text-blue-700 font-bold">{prod.indicadorCodigo}</span>
                    </div>
                    <div className="font-semibold text-slate-800 text-xs">
                      {prod.saberConceptual}
                    </div>

                    {/* Las 4 Fases Didácticas */}
                    <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-slate-600">
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">1. Aprender</span>
                      <CaretRight size={10} className="text-slate-400" />
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded">2. Comprender</span>
                      <CaretRight size={10} className="text-slate-400" />
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">3. Simulación</span>
                      <CaretRight size={10} className="text-slate-400" />
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">4. Cotidiano</span>
                    </div>
                  </div>

                  {/* Autor y DRE */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={16} className="text-blue-700" />
                      <span className="font-medium">{prod.autorNombre.split(" ")[0]} {prod.autorNombre.split(" ")[1]}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{prod.autorDRE.replace("DRE ", "")}</span>
                  </div>

                  {/* Contador de Remixes */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-100">
                    <span className="flex items-center gap-1 text-blue-900 font-bold">
                      <ArrowsClockwise size={14} className="text-blue-600" weight="bold" />
                      <span>{prod.remixesCount} remixes</span>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {prod.estudiantesEvaluados} est. evaluados
                    </span>
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  {/* BOTÓN REMIX PRINCIPAL */}
                  <button
                    onClick={() => handleRemix(prod)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-xs hover:shadow transition-all"
                    title="Clonar esta WebApp en el Creador de WebApps para editar su contenido y adaptarla a tu grupo"
                  >
                    <ArrowsClockwise size={16} weight="bold" />
                    <span>Remix / Adaptar</span>
                  </button>

                  {/* BOTÓN PROBAR */}
                  <button
                    onClick={() => setProduccionSeleccionada(prod)}
                    className="p-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors"
                    title="Previsualizar detalles pedagógicos y fases"
                  >
                    <Eye size={16} weight="bold" />
                  </button>

                  {/* BOTÓN DESCARGAR */}
                  <button
                    onClick={() => handleDescargar(prod)}
                    className="p-2.5 bg-white border border-slate-300 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 rounded-xl transition-colors"
                    title="Descargar archivo .html autónomo listo para usar sin internet"
                  >
                    {descargandoId === prod.id ? (
                      <CheckCircle size={16} weight="bold" className="text-emerald-600" />
                    ) : (
                      <DownloadSimple size={16} weight="bold" />
                    )}
                  </button>

                  {/* BOTÓN REMIX */}
                  <button
                    onClick={() => handleRemix(prod)}
                    className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-all shadow-2xs group/btn"
                    title="Clonar esta WebApp para editar su contenido y adaptarla a tu grupo"
                  >
                    <ShareNetwork size={18} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle Pedagógico & Previsualización */}
      {produccionSeleccionada && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
            {/* Cabecera Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-blue-900 text-white text-[11px] font-black rounded-md">
                    {produccionSeleccionada.nivel}
                  </span>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-md">
                    {produccionSeleccionada.mecanica}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">{produccionSeleccionada.titulo}</h2>
                <p className="text-xs text-slate-500">
                  Creado por {produccionSeleccionada.autorNombre} ({produccionSeleccionada.autorDRE})
                </p>
              </div>

              <button
                onClick={() => setProduccionSeleccionada(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Articulación Pedagógica */}
            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
                <div className="font-bold text-blue-950 flex items-center gap-1.5 text-sm">
                  <Lightbulb size={18} className="text-amber-500" weight="fill" />
                  <span>Saber Conceptual y Explicación Comprensible:</span>
                </div>
                <div className="font-bold text-slate-800 text-xs">
                  {produccionSeleccionada.saberConceptual}
                </div>
                <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-blue-100 leading-relaxed">
                  &quot;{produccionSeleccionada.explicacionPedagogica}&quot;
                </p>
              </div>

              {/* Las 4 Fases Didácticas */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs">Estructura Didáctica de la WebApp:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-blue-900 block mb-0.5">1. Fase Aprender:</span>
                    <span className="text-slate-600">Fundamento conceptual conciso y claro para el estudiante.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-purple-900 block mb-0.5">2. Fase Comprender:</span>
                    <span className="text-slate-600">Chequeo rápido formativo para consolidar la idea central.</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">3. Fase Simulación:</span>
                    <span className="text-slate-600">{produccionSeleccionada.descripcionReto}</span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-amber-900 block mb-0.5">4. Fase Valoración:</span>
                    <span className="text-slate-600">Criterios de Trabajo Cotidiano y telemetría por QR anti-fraude.</span>
                  </div>
                </div>
              </div>

              {/* Indicador Curricular */}
              <div className="p-3 bg-slate-100 rounded-xl space-y-1">
                <span className="font-bold text-slate-800 block">Indicador Curricular Evaluado:</span>
                <span className="text-slate-600">
                  [{produccionSeleccionada.indicadorCodigo}] {produccionSeleccionada.indicadorNombre}
                </span>
              </div>
            </div>

            {/* Acciones del Modal */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setProduccionSeleccionada(null);
                  handleRemix(produccionSeleccionada);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all"
              >
                <ArrowsClockwise size={18} weight="bold" />
                <span>Hacer Remix & Adaptar a mi Aula</span>
              </button>

              <button
                onClick={() => handleDescargar(produccionSeleccionada)}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all"
              >
                <DownloadSimple size={18} weight="bold" />
                <span>Descargar HTML Directo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
