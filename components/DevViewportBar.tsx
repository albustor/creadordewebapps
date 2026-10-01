"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  DeviceMobile,
  DeviceTablet,
  Desktop,
  ArrowsClockwise,
  ArrowSquareOut,
  QrCode,
  X,
  Eye,
  TerminalWindow,
  Copy,
  Check,
  Brain,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";

export default function DevViewportBar() {
  const pathname = usePathname();
  const [esLocalhost, setEsLocalhost] = useState(false);
  const [enIframe, setEnIframe] = useState(false);
  const [mostrarModalQR, setMostrarModalQR] = useState(false);
  const [mostrarModalComandos, setMostrarModalComandos] = useState(false);
  const [ipLocal, setIpLocal] = useState("localhost");
  const [puerto, setPuerto] = useState("3001");
  const [minimizado, setMinimizado] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const port = window.location.port || "3000";
      const isLocal =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.startsWith("192.168.") ||
        host.startsWith("10.");
      const insideIframe = window.self !== window.top;

      setEsLocalhost(isLocal);
      setEnIframe(insideIframe);
      setPuerto(port);
      setIpLocal(host);
    }
  }, []);

  // Manejo de tecla Escape para cerrar modales
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMostrarModalQR(false);
        setMostrarModalComandos(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // No renderizar en producción ni dentro del simulador iframe
  if (!esLocalhost || enIframe) return null;

  const urlActual = typeof window !== "undefined" ? window.location.href : "";
  const rutaRelativa = pathname || "/dashboard";
  const urlPreview = `/preview?url=${encodeURIComponent(rutaRelativa)}`;

  const comandosRapidos = [
    {
      id: "auditar_publicar",
      comando: "AUDITAR Y PUBLICAR",
      descripcion: "Ejecuta auditoría completa (0 errores) y despliega automáticamente a Vercel con reporte en vivo.",
      categoria: "Despliegue",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "auditar",
      comando: "AUDITAR",
      descripcion: "Revisión implacable de TypeScript, DOM vs JS, offline y compilación limpia sin modificar código.",
      categoria: "Auditoría",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "publicar",
      comando: "PUBLICAR",
      descripcion: "Compilación de producción, commit semántico, push a GitHub y verificación en Vercel.",
      categoria: "Despliegue",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
    {
      id: "sincronizar",
      comando: "SINCRONIZAR MEMORIA",
      descripcion: "Audita versiones, commits y estado del proyecto para regenerar MEMORIA.md y AGENT.md.",
      categoria: "Memoria",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    },
    {
      id: "memoria_item",
      comando: "MEMORIA: [Dato técnico, versión o decisión curricular]",
      descripcion: "Guarda inmediatamente un registro histórico o técnico en MEMORIA.md.",
      categoria: "Memoria",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "regla_item",
      comando: "REGLA: [Directriz inmutable de desarrollo o diseño]",
      descripcion: "Añade una regla obligatoria e inmutable a las salvaguardas de AGENT.md.",
      categoria: "Reglas",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      id: "aprendizaje_item",
      comando: "APRENDIZAJE: [Falla detectada] -> [Solución aplicada]",
      descripcion: "Documenta el error y la solución en la bitácora y en la matriz de prevención de fallos.",
      categoria: "Aprendizaje",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
  ];

  const copiarAlPortapapeles = (texto: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(texto);
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 2000);
    }
  };

  return (
    <>
      {/* Barra Flotante DevViewportBar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] select-none animate-fadeIn font-sans">
        {minimizado ? (
          <button
            onClick={() => setMinimizado(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 hover:bg-black text-amber-300 text-xs font-black shadow-2xl border border-amber-400/40 backdrop-blur-md transition-all cursor-pointer"
            title="Mostrar barra de inspección multidispositivo"
          >
            <Eye size={15} weight="bold" />
            <span>DevViewport</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-950/95 text-white p-1.5 px-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-slate-700/80 backdrop-blur-xl">
            {/* Etiqueta Dev */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800 text-[11px] font-extrabold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">LOCAL</span>
            </div>

            {/* Acceso a Vista Móvil (Simulador) */}
            <a
              href={`${urlPreview}&device=mobile`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-colors"
              title="Simular en teléfono móvil (390 x 844 px)"
            >
              <DeviceMobile size={17} weight="bold" className="text-teal-400" />
              <span className="hidden md:inline">Móvil</span>
            </a>

            {/* Acceso a Vista Tableta */}
            <a
              href={`${urlPreview}&device=tablet`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-colors"
              title="Simular en tableta (820 x 1180 px)"
            >
              <DeviceTablet size={17} weight="bold" className="text-sky-400" />
              <span className="hidden md:inline">Tableta</span>
            </a>

            {/* Simulador Multi-pantalla Completo */}
            <a
              href={urlPreview}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-black shadow-xs transition-all border border-teal-500/40"
              title="Abrir simulador multidispositivo (/preview)"
            >
              <Desktop size={17} weight="bold" className="text-amber-300" />
              <span>Simulador</span>
            </a>

            {/* Botón de Palabras Clave y Comandos del Agente */}
            <button
              onClick={() => setMostrarModalComandos(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 hover:text-white text-xs font-black transition-all border border-purple-500/40 cursor-pointer shadow-xs"
              title="Ver guía y palabras clave del Agente IA (AUDITAR, PUBLICAR, MEMORIA, REGLAS)"
            >
              <TerminalWindow size={16} weight="bold" className="text-purple-400" />
              <span className="hidden lg:inline">Comandos IA</span>
            </button>

            {/* Recargar Página */}
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Recargar página"
            >
              <ArrowsClockwise size={16} weight="bold" />
            </button>

            {/* Abrir en Pestaña Nueva */}
            <a
              href={urlActual}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Abrir en pestaña independiente"
            >
              <ArrowSquareOut size={16} weight="bold" />
            </a>

            {/* Código QR para Celular Real en LAN */}
            <button
              onClick={() => setMostrarModalQR(true)}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
              title="Probar en teléfono físico en la red local (QR)"
            >
              <QrCode size={17} weight="bold" />
            </button>

            {/* Minimizar */}
            <button
              onClick={() => setMinimizado(true)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors ml-1 cursor-pointer"
              title="Minimizar barra"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Comandos y Palabras Clave del Agente */}
      {mostrarModalComandos && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
            {/* Encabezado del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <TerminalWindow size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                    <span>Palabras Clave y Comandos del Agente IA</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      AGENT.md • MEMORIA.md
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Escribe estas palabras en el chat para disparar acciones inmediatas y sincronizadas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMostrarModalComandos(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Lista de Comandos */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {comandosRapidos.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-sm text-amber-300 bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-500/30 select-all">
                        {c.comando}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${c.badgeColor}`}
                      >
                        {c.categoria}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {c.descripcion}
                    </p>
                  </div>

                  <button
                    onClick={() => copiarAlPortapapeles(c.comando, c.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 shrink-0 text-xs font-bold"
                    title="Copiar comando"
                  >
                    {copiadoId === c.id ? (
                      <>
                        <Check size={16} weight="bold" className="text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span className="hidden sm:inline text-[11px]">Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Pie del Modal con Instrucción y Cierre */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Brain size={16} className="text-purple-400" />
                <span>Las directrices quedan guardadas de forma permanente en el proyecto.</span>
              </div>
              <button
                onClick={() => setMostrarModalComandos(false)}
                className="px-4 py-2 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR para Pruebas en Hardware Real */}
      {mostrarModalQR && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn font-sans">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={20} weight="bold" className="text-amber-400" />
                <h4 className="font-extrabold text-sm text-slate-100">Prueba en Celular Físico</h4>
              </div>
              <button
                onClick={() => setMostrarModalQR(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cerrar (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Conecta tu teléfono a la misma red Wi-Fi y escanea este código QR para probar la interfaz táctil directamente en hardware real:
            </p>

            <div className="bg-white p-3.5 rounded-xl flex items-center justify-center shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlActual)}`}
                alt="Código QR de prueba local"
                className="w-44 h-44 rounded-lg"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
              {urlActual}
            </div>

            <button
              onClick={() => setMostrarModalQR(false)}
              className="w-full py-2 bg-[#1B5E59] hover:bg-[#144642] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
