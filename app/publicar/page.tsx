"use client";

import React, { useState } from "react";
import { useDocente } from "@/context/DocenteContext";
import { QRCodeSVG } from "qrcode.react";
import QRModalProyeccion from "@/components/QRModalProyeccion";
import {
  UploadSimple,
  CodeBlock,
  QrCode,
  ChalkboardTeacher,
  Copy,
  Check,
  WhatsappLogo,
  Trash,
  Play,
  ShareNetwork,
  Sparkle,
} from "@phosphor-icons/react";

export default function PublicarPage() {
  const { docente, webApps, guardarWebApp } = useDocente();

  const [titulo, setTitulo] = useState("");
  const [asignatura, setAsignatura] = useState("Formación Tecnológica");
  const [nivel, setNivel] = useState("Secundaria - III Ciclo (7°, 8°, 9°)");
  const [codigoHTML, setCodigoHTML] = useState("");
  const [arrastrando, setArrastrando] = useState(false);
  const [webAppPublicada, setWebAppPublicada] = useState<any | null>(null);
  const [modalProyeccionAbierto, setModalProyeccionAbierto] = useState(false);
  const [copiadoEnlace, setCopiadoEnlace] = useState(false);

  // Carga de archivo mediante Input File o Drag & Drop
  const procesarArchivo = (file: File) => {
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      alert("Por favor sube un archivo con extensión .html o .htm");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const contenido = e.target?.result as string;
      setCodigoHTML(contenido);
      if (!titulo) {
        setTitulo(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
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

  const handlePublicar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoHTML.trim()) {
      alert("Por favor sube un archivo .html o pega el código en el área correspondiente.");
      return;
    }

    const id = "app-" + Date.now().toString(36);
    const nuevaApp = {
      id,
      titulo: titulo.trim() || "WebApp Interactiva",
      docenteId: docente?.idDocente || "DOC-DRE01-7729",
      asignatura,
      nivel,
      saberTitulo: "Apropiación e Integración Curricular",
      indicadorCodigo: "D1.GEN.01",
      indicadorNombre: "Actividad Interactiva Publicada",
      mecanica: "Laboratorio Autónomo",
      modo: "Individual" as const,
      codigoHTML,
      fechaCreacion: new Date().toISOString(),
      visitas: 1,
    };

    guardarWebApp(nuevaApp);
    setWebAppPublicada(nuevaApp);
  };

  const urlBase = typeof window !== "undefined" ? window.location.origin : "https://creador-webapps.local";
  const urlFinal = webAppPublicada ? `${urlBase}/play/${webAppPublicada.id}` : "";

  const copiarEnlace = () => {
    navigator.clipboard.writeText(urlFinal);
    setCopiadoEnlace(true);
    setTimeout(() => setCopiadoEnlace(false), 2500);
  };

  const compartirWhatsApp = () => {
    const texto = `👋 Hola estudiantes, aquí está el enlace para ingresar a la actividad interactiva: *"${webAppPublicada?.titulo}"* (${webAppPublicada?.asignatura} - ${webAppPublicada?.nivel})\n\n🔗 ${urlFinal}\n\n¡Mucho éxito en el reto! 🚀`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
            Módulo de Distribución
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Publicador & Sala de Proyección
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Aloja tus WebApps creadas, genera códigos QR instantáneos y proyecta en la pizarra del aula
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Subida & Drag and Drop (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePublicar} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-mepCard space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <UploadSimple size={20} className="text-blue-700" weight="duotone" />
              <span>1. Cargar Archivo .html o Pegar Código</span>
            </h2>

            {/* Zona Drag & Drop */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setArrastrando(true);
              }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                arrastrando
                  ? "border-blue-600 bg-blue-50/60 scale-[1.01]"
                  : "border-slate-300 hover:border-blue-400 bg-slate-50/50"
              }`}
            >
              <UploadSimple size={40} className="mx-auto text-blue-700 mb-3" weight="duotone" />
              <h3 className="text-sm font-bold text-slate-800">
                Arrastra y suelta aquí tu archivo .html
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                O selecciona un archivo desde tu computadora o memoria USB
              </p>

              <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs">
                <span>Examinar Archivo</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  onChange={(e) => e.target.files && procesarArchivo(e.target.files[0])}
                />
              </label>
            </div>

            {/* Metadatos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título de la WebApp:
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Simulador de Algoritmos y Condicionales (7°)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Materia / Asignatura:
                </label>
                <input
                  type="text"
                  value={asignatura}
                  onChange={(e) => setAsignatura(e.target.value)}
                  placeholder="Formación Tecnológica"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nivel Educativo:
                </label>
                <input
                  type="text"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  placeholder="Secundaria - III Ciclo (7°, 8°, 9°)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
                />
              </div>
            </div>

            {/* Editor / Pegado Manual */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contenido HTML (Código Single-File):
              </label>
              <textarea
                value={codigoHTML}
                onChange={(e) => setCodigoHTML(e.target.value)}
                placeholder="<!DOCTYPE html><html>... Código generado por la IA ...</html>"
                rows={6}
                className="w-full px-3.5 py-2.5 bg-slate-900 text-sky-200 font-mono text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg"
            >
              <UploadSimple size={18} weight="bold" />
              <span>Publicar & Generar QR Oficial</span>
            </button>
          </form>
        </div>

        {/* Columna Derecha: Tarjeta de Distribución & QR (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {webAppPublicada ? (
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-xl space-y-5 animate-fadeIn text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                <Check size={14} weight="bold" />
                <span>¡WebApp Publicada Exitosamente!</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">{webAppPublicada.titulo}</h3>
                <p className="text-xs text-slate-500">
                  {webAppPublicada.asignatura} • {webAppPublicada.nivel}
                </p>
              </div>

              {/* QR en Alta Resolución */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block shadow-inner">
                <QRCodeSVG
                  value={urlFinal}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#001F3F"
                />
              </div>

              {/* Enlace Directo */}
              <div className="bg-slate-100 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-blue-900 font-bold truncate select-all">
                  {urlFinal}
                </span>
                <button
                  onClick={copiarEnlace}
                  className="px-2.5 py-1 bg-blue-700 text-white rounded-lg text-xs font-bold hover:bg-blue-800 shrink-0"
                >
                  {copiadoEnlace ? "¡Copiado!" : "Copiar"}
                </button>
              </div>

              {/* Botón Proyección de Aula */}
              <button
                onClick={() => setModalProyeccionAbierto(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 to-slate-900 hover:from-blue-800 hover:to-slate-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-md"
              >
                <ChalkboardTeacher size={18} weight="bold" />
                <span>📺 Modo Proyección de Aula (Pantalla Completa)</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={compartirWhatsApp}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors"
                >
                  <WhatsappLogo size={16} weight="fill" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`/play/${webAppPublicada.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors"
                >
                  <Play size={16} weight="fill" />
                  <span>Probar Play</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
              <QrCode size={48} className="mx-auto text-slate-400" weight="duotone" />
              <h3 className="text-sm font-bold text-slate-700">QR de Distribución</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                Sube tu archivo .html o pega el código para generar el enlace seguro, el código QR y activar el proyector de aula.
              </p>
            </div>
          )}

          {/* Catálogo de WebApps Recientes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-mepCard space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              WebApps en tu Catálogo ({webApps.length})
            </h4>
            {webApps.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay WebApps guardadas aún.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {webApps.map((app) => (
                  <div
                    key={app.id}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="truncate mr-2">
                      <div className="font-bold text-slate-800 truncate">{app.titulo}</div>
                      <div className="text-[10px] text-slate-500">{app.asignatura}</div>
                    </div>
                    <a
                      href={`/play/${app.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 shrink-0"
                      title="Abrir"
                    >
                      <Play size={14} weight="fill" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Proyección de Aula */}
      {webAppPublicada && (
        <QRModalProyeccion
          abierto={modalProyeccionAbierto}
          alCerrar={() => setModalProyeccionAbierto(false)}
          urlWebApp={urlFinal}
          titulo={webAppPublicada.titulo}
          asignatura={webAppPublicada.asignatura}
          nivel={webAppPublicada.nivel}
          docenteNombre={docente?.nombreCompleto}
        />
      )}
    </div>
  );
}
