"use client";

import React, { useState, useEffect } from "react";
import { SafeStorage } from "@/lib/firebase";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  WarningCircle,
  DownloadSimple,
  ArrowsClockwise,
  Cpu,
  LockKey,
  HardDrives,
  WifiSlash,
  Eye,
  FileText,
  Sparkle,
  ShareNetwork,
  CheckSquareOffset,
  ListChecks,
} from "@phosphor-icons/react";

export interface ItemChecklist {
  id: string;
  titulo: string;
  descripcion: string;
  comandoSugerido?: string;
  completado: boolean;
}

export interface FaseAuditoria {
  id: number;
  nombre: string;
  icono: string;
  descripcion: string;
  items: ItemChecklist[];
}

const FASES_INICIALES: FaseAuditoria[] = [
  {
    id: 1,
    nombre: "Fase 1: Salud de Infraestructura & Puertos (Health Guard)",
    icono: "Cpu",
    descripcion: "Verificación de servidores locales, puertos limpios y compilación estática de código 0.",
    items: [
      {
        id: "f1-p1",
        titulo: "Inspección de Puertos Locales (3000 / 3001 / 3003 / 5000)",
        descripcion: "Confirmar que no existen procesos zombies colgados en los puertos de desarrollo.",
        comandoSugerido: "Get-NetTCPConnection -LocalPort 3000, 3001, 3003, 5000",
        completado: true,
      },
      {
        id: "f1-p2",
        titulo: "Carga de Variables de Entorno (.env.antigravity / .env.local)",
        descripcion: "Verificar presencia de GEMINI_API_KEY y endpoints de conexión.",
        comandoSugerido: "Test-Path .env.local; Test-Path .env.antigravity",
        completado: true,
      },
      {
        id: "f1-p3",
        titulo: "Compilación Estática Total (npm run build = Código 0)",
        descripcion: "Las 19+ rutas del portal deben compilar sin errores de sintaxis ni fallos de TypeScript.",
        comandoSugerido: "npm run build",
        completado: true,
      },
    ],
  },
  {
    id: 2,
    nombre: "Fase 2: Consola, Errores JS & Auto-Sanación (Heal-In-Place)",
    icono: "ShieldCheck",
    descripcion: "Asegurar un DOM limpio y cero excepciones no controladas en el cliente.",
    items: [
      {
        id: "f2-p1",
        titulo: "Inspección de Consola en Navegador (DevTools F12 > Console)",
        descripcion: "Cero mensajes en rojo. Ningún Uncaught TypeError, ChunkLoadError o error de hidratación.",
        completado: false,
      },
      {
        id: "f2-p2",
        titulo: "Arnés Automatizado de Auto-Sanación (antigravity-jim-runner)",
        descripcion: "Ejecución del runner automatizado para captura y parcheo en caliente de archivos fuente.",
        comandoSugerido: "npm run audit -- local",
        completado: true,
      },
      {
        id: "f2-p3",
        titulo: "Validación de Componentes React & Layouts Responsivos",
        descripcion: "Revisar que modales, tablas y selectores adapten fluidamente a pantallas de laptops y tabletas.",
        completado: false,
      },
    ],
  },
  {
    id: 3,
    nombre: "Fase 3: Red, CORS & Assets Externos (CDN / Multimedia)",
    icono: "ShareNetwork",
    descripcion: "Validar que los recursos multimedia y APIs respondan sin bloqueos de seguridad.",
    items: [
      {
        id: "f3-p1",
        titulo: "Inspección de Red sin Caché (DevTools > Disable Cache + Ctrl+F5)",
        descripcion: "Ninguna solicitud debe devolver 404, 500 ni bloqueos por políticas CORS.",
        completado: false,
      },
      {
        id: "f3-p2",
        titulo: "Configuración CORS para Video / WebAR (crossorigin='anonymous')",
        descripcion: "Assets servidos desde Bunny CDN o nubes externas deben incluir cabeceras de origen abierto.",
        completado: true,
      },
      {
        id: "f3-p3",
        titulo: "Tolerancia a Latencia y Tiempos de Respuesta (< 200ms)",
        descripcion: "Llamadas a APIs internas (/api/cron, /api/telemetria, /api/admin) deben resolver rápidamente.",
        completado: false,
      },
    ],
  },
  {
    id: "4" as any,
    idNum: 4,
    nombre: "Fase 4: Integridad Curricular & Anti-Fuga de Claves (Zero Leaks)",
    icono: "LockKey",
    descripcion: "Aislamiento estricto de solucionarios, rúbricas docentes y ponderaciones en el DOM.",
    items: [
      {
        id: "f4-p1",
        titulo: "Búsqueda Forense de Marcadores en Fuentes (Sources > Ctrl+Shift+F)",
        descripcion: "Buscar: 'correctAnswer', 'respuestaCorrecta', 'solucionario', 'isCorrect'. Cero coincidencias en texto plano.",
        completado: false,
      },
      {
        id: "f4-p2",
        titulo: "Aislamiento Estricto de Roles (Estudiante vs Docente vs Administrador)",
        descripcion: "Los datos administrativos o de otros docentes nunca deben filtrarse en sesiones de estudiante.",
        completado: true,
      },
      {
        id: "f4-p3",
        titulo: "Evaluación Atómica y Validación de Ponderaciones",
        descripcion: "El cálculo de porcentajes y niveles de logro (Inicial, Intermedio, Avanzado) debe ser exacto.",
        completado: true,
      },
    ],
  } as any,
  {
    id: 5,
    nombre: "Fase 5: Resiliencia Offline & Persistencia de Aula (SafeStorage)",
    icono: "WifiSlash",
    descripcion: "Tolerancia a microcortes de conectividad y gestión rigurosa de cuota de LocalStorage.",
    items: [
      {
        id: "f5-p1",
        titulo: "Simulación de Desconexión de Aula (Network > Throttling: Offline)",
        descripcion: "Responder preguntas sin conexión, recargar F5 y verificar que las respuestas sigan intactas.",
        completado: false,
      },
      {
        id: "f5-p2",
        titulo: "Estructura Limpia de Almacenamiento (Application > Local Storage)",
        descripcion: "Objetos JSON serializados correctamente sin claves corruptas ni temporales huérfanos.",
        completado: false,
      },
      {
        id: "f5-p3",
        titulo: "Auditoría de Cuota de Almacenamiento (< 500 KB)",
        descripcion: "Comprobar con: new Blob(Object.values(localStorage)).size que no se desborde la memoria móvil.",
        comandoSugerido: "console.log(new Blob(Object.values(localStorage)).size)",
        completado: true,
      },
    ],
  },
  {
    id: 6,
    nombre: "Fase 6: Gobernanza, Telemetría & Certificación de Producción",
    icono: "HardDrives",
    descripcion: "Validación de borrado sincronizado en BD, sincronización en Vercel y acta final.",
    items: [
      {
        id: "f6-p1",
        titulo: "Operaciones Transaccionales de Base de Datos (DELETE y Vaciar)",
        descripcion: "Comprobar que al eliminar o vaciar registros, se purguen simultáneamente en disco y servidor.",
        completado: true,
      },
      {
        id: "f6-p2",
        titulo: "Verificación de URLs Públicas en Vercel (HTTP 200)",
        descripcion: "Validar https://diagnosticosecundaria.vercel.app y https://recursodeapoyo.vercel.app.",
        comandoSugerido: "npm run audit -- prod",
        completado: true,
      },
      {
        id: "f6-p3",
        titulo: "Emisión de Certificado de Despliegue Oficial MEP",
        descripcion: "Generación del informe ejecutivo para la Asesoría Nacional de Formación Tecnológica.",
        completado: false,
      },
    ],
  },
];

export default function ChecklistAuditoriaForense() {
  const [fases, setFases] = useState<FaseAuditoria[]>(FASES_INICIALES);
  const [notasFase, setNotasFase] = useState<{ [faseId: string]: string }>({});
  const [faseExpandida, setFaseExpandida] = useState<number | null>(1);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Cargar persistencia del checklist
  useEffect(() => {
    const savedChecklist = SafeStorage.getItem("checklist_auditoria_jim_360");
    if (savedChecklist) {
      try {
        setFases(JSON.parse(savedChecklist));
      } catch {}
    }
    const savedNotas = SafeStorage.getItem("notas_auditoria_jim_360");
    if (savedNotas) {
      try {
        setNotasFase(JSON.parse(savedNotas));
      } catch {}
    }
  }, []);

  const guardarEstado = (nuevasFases: FaseAuditoria[], nuevasNotas?: { [key: string]: string }) => {
    setFases(nuevasFases);
    SafeStorage.setItem("checklist_auditoria_jim_360", JSON.stringify(nuevasFases));
    if (nuevasNotas) {
      setNotasFase(nuevasNotas);
      SafeStorage.setItem("notas_auditoria_jim_360", JSON.stringify(nuevasNotas));
    }
  };

  const toggleItem = (faseId: number, itemId: string) => {
    const actualizadas = fases.map((f) => {
      const fNum = (f as any).idNum || f.id;
      if (fNum === faseId) {
        return {
          ...f,
          items: f.items.map((it) => (it.id === itemId ? { ...it, completado: !it.completado } : it)),
        };
      }
      return f;
    });
    guardarEstado(actualizadas);
  };

  const marcarTodaFase = (faseId: number, valor: boolean) => {
    const actualizadas = fases.map((f) => {
      const fNum = (f as any).idNum || f.id;
      if (fNum === faseId) {
        return {
          ...f,
          items: f.items.map((it) => ({ ...it, completado: valor })),
        };
      }
      return f;
    });
    guardarEstado(actualizadas);
  };

  const handleNotaChange = (faseId: number, texto: string) => {
    const nuevasNotas = { ...notasFase, [String(faseId)]: texto };
    setNotasFase(nuevasNotas);
    SafeStorage.setItem("notas_auditoria_jim_360", JSON.stringify(nuevasNotas));
  };

  // Métricas globales
  const totalItems = fases.reduce((acc, f) => acc + f.items.length, 0);
  const itemsCompletados = fases.reduce(
    (acc, f) => acc + f.items.filter((it) => it.completado).length,
    0
  );
  const porcentajeProgreso = Math.round((itemsCompletados / totalItems) * 100);

  const exportarInformeForense = () => {
    const fecha = new Date().toLocaleString("es-CR", { timeZone: "America/Costa_Rica" });
    let contenido = `================================================================================\n`;
    contenido += `  INFORME EJECUTIVO DE AUDITORÍA FORENSE 360° - PROTOCOLO JIM\n`;
    contenido += `  Ministerio de Educación Pública • Formación Tecnológica\n`;
    contenido += `  Auditor Principal: Alberto Bustos Ortega (Super Administrador)\n`;
    contenido += `  Fecha de Certificación: ${fecha}\n`;
    contenido += `  Progreso Global: ${porcentajeProgreso}% (${itemsCompletados} de ${totalItems} pasos certificados)\n`;
    contenido += `================================================================================\n\n`;

    fases.forEach((f) => {
      const fNum = (f as any).idNum || f.id;
      const comp = f.items.filter((i) => i.completado).length;
      contenido += `--------------------------------------------------------------------------------\n`;
      contenido += `[FASE ${fNum}] ${f.nombre.toUpperCase()}\n`;
      contenido += `Estado: ${comp}/${f.items.length} verificados (${Math.round((comp / f.items.length) * 100)}%)\n`;
      contenido += `Descripción: ${f.descripcion}\n`;
      contenido += `--------------------------------------------------------------------------------\n`;
      f.items.forEach((it) => {
        contenido += `  [${it.completado ? "✔ CERTIFICADO" : "⏳ PENDIENTE"}] ${it.titulo}\n`;
        contenido += `      Detalle: ${it.descripcion}\n`;
        if (it.comandoSugerido) {
          contenido += `      Comando: ${it.comandoSugerido}\n`;
        }
      });
      if (notasFase[String(fNum)]) {
        contenido += `  📝 Notas de Hallazgos:\n      ${notasFase[String(fNum)]}\n`;
      }
      contenido += `\n`;
    });

    contenido += `================================================================================\n`;
    contenido += `  CERTIFICACIÓN OFICIAL: ${porcentajeProgreso === 100 ? "SISTEMA 100% CERTIFICADO PARA PRODUCCIÓN EN AULA" : "AUDITORÍA EN PROCESO DE VALIDACIÓN"}\n`;
    contenido += `  Referencia Documental: docs/PROTOCOLO_AUDITORIA_JIM_UNIVERSAL.md\n`;
    contenido += `================================================================================\n`;

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Certificado_Auditoria_Jim360_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();

    setMensaje("¡Informe ejecutivo forense generado y descargado con éxito!");
    setTimeout(() => setMensaje(null), 3500);
  };

  const restablecerChecklist = () => {
    if (confirm("¿Deseas restablecer el checklist a su configuración inicial por defecto?")) {
      guardarEstado(FASES_INICIALES, {});
      setMensaje("Checklist restablecido correctamente.");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner de Cabecera del Protocolo Forense */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-500/40 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 text-[10px] font-black uppercase tracking-wider">
                Auditoría Jim 360° • Validación Humana
              </span>
              <span className="text-xs font-mono text-indigo-300">
                📄 docs/PROTOCOLO_AUDITORIA_JIM_UNIVERSAL.md
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <ListChecks size={32} className="text-cyan-400" weight="duotone" />
              <span>Protocolo Forense & Checklist Secuencial</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Herramienta interactiva de certificación paso a paso para el Super Administrador. Revisa, ejecuta y certifica cada una de las 6 fases técnicas antes de validar despliegues en centros educativos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={exportarInformeForense}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
              title="Descargar Certificado y Reporte Forense"
            >
              <DownloadSimple size={16} weight="bold" />
              <span>Exportar Informe</span>
            </button>
            <button
              onClick={restablecerChecklist}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
              title="Restablecer valores"
            >
              <ArrowsClockwise size={16} weight="bold" />
            </button>
          </div>
        </div>

        {/* Barra de Progreso General */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-2">
              <span>Progreso de Certificación Forense:</span>
              <span className="text-white font-mono font-black">{itemsCompletados} de {totalItems} verificaciones</span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono ${
                porcentajeProgreso === 100
                  ? "bg-emerald-500 text-white"
                  : porcentajeProgreso >= 60
                  ? "bg-amber-500 text-slate-950"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {porcentajeProgreso}% {porcentajeProgreso === 100 ? "🟢 CERTIFICADO" : "🟡 EN PROGRESO"}
            </span>
          </div>
          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                porcentajeProgreso === 100
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500"
              }`}
              style={{ width: `${porcentajeProgreso}%` }}
            />
          </div>
        </div>
      </div>

      {mensaje && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={20} weight="fill" className="text-emerald-700 shrink-0" />
          <span>{mensaje}</span>
        </div>
      )}

      {/* Listado de Fases Organizadas Secuencialmente */}
      <div className="space-y-4">
        {fases.map((fase) => {
          const faseId = (fase as any).idNum || fase.id;
          const totalFase = fase.items.length;
          const compFase = fase.items.filter((i) => i.completado).length;
          const faseCompleta = compFase === totalFase;
          const estaExpandida = faseExpandida === faseId;

          return (
            <div
              key={faseId}
              className={`bg-white rounded-2xl border transition-all shadow-sm ${
                faseCompleta
                  ? "border-emerald-300 bg-emerald-50/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Encabezado de la Fase */}
              <div
                onClick={() => setFaseExpandida(estaExpandida ? null : faseId)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-3"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${
                      faseCompleta
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-indigo-100 text-indigo-900"
                    }`}
                  >
                    {faseCompleta ? <CheckCircle size={22} weight="fill" /> : faseId}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                        {fase.nombre}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                          faseCompleta
                            ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {compFase}/{totalFase} pasos
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                      {fase.descripcion}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      marcarTodaFase(faseId, !faseCompleta);
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {faseCompleta ? "Desmarcar todo" : "Marcar todo"}
                  </button>
                  <span className="text-slate-400 font-bold text-sm">
                    {estaExpandida ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Contenido Expandible de la Fase */}
              {estaExpandida && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-fadeIn">
                  <div className="space-y-2.5">
                    {fase.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(faseId, item.id)}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          item.completado
                            ? "bg-emerald-50/70 border-emerald-300 text-slate-900"
                            : "bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 text-slate-700"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {item.completado ? (
                            <CheckCircle size={22} weight="fill" className="text-emerald-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold leading-tight ${
                                item.completado ? "line-through text-slate-500 font-medium" : "text-slate-900"
                              }`}
                            >
                              {item.titulo}
                            </span>
                            <span
                              className={`text-[9.5px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${
                                item.completado
                                  ? "bg-emerald-200/70 text-emerald-900"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              {item.completado ? "CERTIFICADO" : "PENDIENTE"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {item.descripcion}
                          </p>
                          {item.comandoSugerido && (
                            <div className="pt-1">
                              <code className="text-[10.5px] font-mono bg-slate-900 text-sky-300 px-2.5 py-1 rounded-lg inline-block border border-slate-800 select-all">
                                {item.comandoSugerido}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notas y Hallazgos de la Fase */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      📝 Bitácora de Observaciones & Hallazgos para {fase.nombre.split(":")[0]}:
                    </label>
                    <textarea
                      rows={2}
                      value={notasFase[String(faseId)] || ""}
                      onChange={(e) => handleNotaChange(faseId, e.target.value)}
                      placeholder="Registra cualquier anomalía, archivo editado o confirmación de prueba técnica..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
