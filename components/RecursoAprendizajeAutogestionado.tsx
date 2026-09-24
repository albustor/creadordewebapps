"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import {
  CheckCircle,
  Circle,
  NotePencil,
  DownloadSimple,
  Copy,
  Printer,
  Sparkle,
  ShieldCheck,
  Cpu,
  GraduationCap,
  CaretRight,
  CaretDown,
  FloppyDisk,
  ArrowSquareOut,
  Info,
  QrCode,
  ChartBar,
  Code,
  Robot,
  Database,
  DeviceMobile,
} from "@phosphor-icons/react";

interface TareaVerificacion {
  id: string;
  texto: string;
  detalle: string;
}

interface EtapaAprendizaje {
  id: number;
  titulo: string;
  subtitulo: string;
  enlaceAccion?: {
    texto: string;
    url: string;
  };
  tareas: TareaVerificacion[];
}

const ETAPAS_DATOS: EtapaAprendizaje[] = [
  {
    id: 1,
    titulo: "Etapa 1: Marco curricular, supervisión y rol de asesoría",
    subtitulo: "Comprensión de directrices normativas y entorno de acompañamiento regional y nacional.",
    enlaceAccion: {
      texto: "Ir a Auditoría de IA",
      url: "/auditoria-ia",
    },
    tareas: [
      {
        id: "e1_t1",
        texto: "Identificar la cobertura territorial y los accesos asignados a nivel regional y nacional.",
        detalle: "Verificar cómo el sistema organiza las 27 Direcciones Regionales de Educación (DRE) y sus circuitos.",
      },
      {
        id: "e1_t2",
        texto: "Explorar las secciones de muestra para simulaciones de aula.",
        detalle: "Comprobar que las pruebas muestra permiten validar la herramienta sin alterar las bases de datos docentes.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Etapa 2: Identidad y configuración institucional (/registro)",
    subtitulo: "Gestión de perfil, asignación de 2 a 3 centros educativos y selección de secciones por nivel.",
    enlaceAccion: {
      texto: "Abrir Gestión de Acceso & Perfil",
      url: "/registro",
    },
    tareas: [
      {
        id: "e2_t1",
        texto: "Iniciar sesión con PIN de 4 dígitos y cédula o correo oficial MEP.",
        detalle: "Probar el acceso ágil sin contraseñas complejas desde la pestaña 2 de inicio de sesión.",
      },
      {
        id: "e2_t2",
        texto: "Configurar los centros educativos y marcar las secciones atendidas en 7.°, 8.° y 9.° año.",
        detalle: "Revisar que la nómina de secciones se personaliza según la carga horaria real del docente.",
      },
      {
        id: "e2_t3",
        texto: "Validar la cláusula de privacidad y apoyo sincrónico en el campo de teléfono móvil.",
        detalle: "Constatar que el teléfono es 100 % opcional, confidencial y aprobado para soporte con asesoría.",
      },
      {
        id: "e2_t4",
        texto: "Comprobar el flujo de recuperación de PIN por correo MEP o mensajería móvil.",
        detalle: "Verificar la solicitud del código OTP de 4 dígitos en la pestaña 3 de recuperación.",
      },
    ],
  },
  {
    id: 3,
    titulo: "Etapa 3: Preparación técnica, equidad y enlaces protegidos",
    subtitulo: "Validación de condiciones del aula y generación de token criptográfico opaco (?token=...).",
    tareas: [
      {
        id: "e3_t1",
        texto: "Validar previamente las condiciones técnicas y de equidad en el laboratorio.",
        detalle: "Asegurar que el 100 % de los estudiantes cuente con los medios para realizar la prueba sin barreras.",
      },
      {
        id: "e3_t2",
        texto: "Generar el enlace institucional con token criptográfico opaco (Base64 / SHA-256).",
        detalle: "Comprobar que ningún dato personal del docente (cédula o teléfono) se expone en texto plano.",
      },
      {
        id: "e3_t3",
        texto: "Proyectar o imprimir el código QR institucional para el acceso inmediato del grupo.",
        detalle: "Verificar que el código QR conduce directamente a la sesión configurada de la sección.",
      },
    ],
  },
  {
    id: 4,
    titulo: "Etapa 4: Aplicación del diagnóstico estudiantil (con y sin conexión)",
    subtitulo: "Ejecución de actividades en las 4 áreas curriculares y uso del lector óptico offline.",
    tareas: [
      {
        id: "e4_t1",
        texto: "Verificar la resolución de retos en las 4 áreas curriculares para 7.°, 8.° y 9.° año.",
        detalle: "Apropiación tecnológica, Programación y algoritmos, Computación física y robótica, y Ciencia de datos e IA.",
      },
      {
        id: "e4_t2",
        texto: "Probar la telemetría en tiempo real en modalidad con conectividad.",
        detalle: "Constatar que las respuestas completadas viajan de inmediato al servicio central de telemetría.",
      },
      {
        id: "e4_t3",
        texto: "Probar la modalidad sin conectividad y la generación del token SHA-256 con código QR de alta densidad.",
        detalle: "Simular la conclusión de la prueba en un equipo sin internet para obtener el código de salida sellado.",
      },
      {
        id: "e4_t4",
        texto: "Utilizar el módulo de importación sin conexión (lector óptico por cámara o pegado de token).",
        detalle: "Escanear el código QR del estudiante o pegar su token alfanumérico para ingresar la nota a la nómina.",
      },
    ],
  },
  {
    id: 5,
    titulo: "Etapa 5: Evaluación directa docente (matriz de observación)",
    subtitulo: "Calificación práctica en laboratorio y dictamen combinado del nivel de logro.",
    tareas: [
      {
        id: "e5_t1",
        texto: "Abrir la matriz de observación del docente evaluador para el nivel correspondiente.",
        detalle: "Acceder al instrumento de evaluación práctica complementaria del laboratorio.",
      },
      {
        id: "e5_t2",
        texto: "Registrar las rúbricas cualitativas de desempeño en las cuatro áreas oficiales.",
        detalle: "Valorar el saber hacer y el saber ser del estudiantado durante el desarrollo de las actividades.",
      },
      {
        id: "e5_t3",
        texto: "Validar la emisión del dictamen combinado del nivel de logro (Inicial, Intermedio o Avanzado).",
        detalle: "Comprobar cómo se integran las evidencias de la aplicación estudiantil con la matriz docente.",
      },
    ],
  },
  {
    id: 6,
    titulo: "Etapa 6: Consolidación, analítica y recomendaciones DUA (/dashboard)",
    subtitulo: "Tablero de control con datos reales, semáforos comparativos y sugerencias pedagógicas.",
    enlaceAccion: {
      texto: "Abrir Dashboard Docente",
      url: "/dashboard",
    },
    tareas: [
      {
        id: "e6_t1",
        texto: "Alternar centros educativos en el selector dinámico del tablero docente.",
        detalle: "Constatar que las secciones y gráficos estadísticos cambian al instante según el colegio elegido.",
      },
      {
        id: "e6_t2",
        texto: "Revisar los semáforos de nivel de logro y las gráficas comparativas por sección e indicador.",
        detalle: "Identificar la distribución porcentual y los reactivos con mayor necesidad de refuerzo.",
      },
      {
        id: "e6_t3",
        texto: "Generar recomendaciones DUA asistidas por inteligencia artificial multicapa.",
        detalle: "Verificar la formulación de estrategias pedagógicas diferenciadas (conceptuales, procedimentales y actitudinales).",
      },
    ],
  },
  {
    id: 7,
    titulo: "Etapa 7: Telemetría global, resiliencia de IA y autoauditoría diaria (5:00 a. m.)",
    subtitulo: "Respaldo en 6 capas, verificación de completitud 100 % e informes ejecutivos.",
    enlaceAccion: {
      texto: "Ver Tablero de Auditoría de IA",
      url: "/auditoria-ia",
    },
    tareas: [
      {
        id: "e7_t1",
        texto: "Revisar la arquitectura de respaldo multicapa (Caché SHA-256 ➔ Capa 1 ➔ Capa 2 ➔ Capa 3 ➔ Capa 4 ➔ 503 local).",
        detalle: "Garantizar que la plataforma no se congela ante fallas o desconexiones de red externas.",
      },
      {
        id: "e7_t2",
        texto: "Comprobar la regla de integridad y completitud evaluativa del 100 % de reactivos respondidos.",
        detalle: "Verificar que únicamente los paquetes de respuestas completos se registran en el expediente del grupo.",
      },
      {
        id: "e7_t3",
        texto: "Inspeccionar el despacho del informe de autoauditoría diaria a las 5:00 a. m. a correo MEP y WhatsApp.",
        detalle: "Validar el envío automático del reporte de disponibilidad y salud de la plataforma.",
      },
    ],
  },
];

export default function RecursoAprendizajeAutogestionado() {
  const { docente } = useDocente();

  // Clave de almacenamiento ligada al usuario activo
  const storageKeyTareas = `mep_aprendizaje_tareas_${docente?.idDocente || docente?.cedula || "anonimo"}`;
  const storageKeyApuntes = `mep_aprendizaje_apuntes_${docente?.idDocente || docente?.cedula || "anonimo"}`;

  const [tareasCompletadas, setTareasCompletadas] = useState<Record<string, boolean>>({});
  const [apuntesDocente, setApuntesDocente] = useState<string>("");
  const [etapaAbierta, setEtapaAbierta] = useState<number>(1);
  const [copiadoExitoso, setCopiadoExitoso] = useState<boolean>(false);
  const [guardadoAutomatico, setGuardadoAutomatico] = useState<boolean>(false);

  // Cargar estado guardado al iniciar
  useEffect(() => {
    try {
      const rawTareas = localStorage.getItem(storageKeyTareas);
      if (rawTareas) {
        setTareasCompletadas(JSON.parse(rawTareas));
      }
      const rawApuntes = localStorage.getItem(storageKeyApuntes);
      if (rawApuntes) {
        setApuntesDocente(rawApuntes);
      }
    } catch (e) {}
  }, [storageKeyTareas, storageKeyApuntes]);

  // Total de tareas
  const totalTareas = ETAPAS_DATOS.reduce((acc, e) => acc + e.tareas.length, 0);
  const tareasHechasCount = Object.values(tareasCompletadas).filter(Boolean).length;
  const porcentajeProgreso = Math.round((tareasHechasCount / totalTareas) * 100);

  // Alternar tarea
  const toggleTarea = (idTarea: string) => {
    const nuevoEstado = {
      ...tareasCompletadas,
      [idTarea]: !tareasCompletadas[idTarea],
    };
    setTareasCompletadas(nuevoEstado);
    try {
      localStorage.setItem(storageKeyTareas, JSON.stringify(nuevoEstado));
      notificarGuardado();
    } catch (e) {}
  };

  // Manejar cambio de apuntes con autoguardado
  const handleCambioApuntes = (texto: string) => {
    setApuntesDocente(texto);
    try {
      localStorage.setItem(storageKeyApuntes, texto);
      notificarGuardado();
    } catch (e) {}
  };

  const notificarGuardado = () => {
    setGuardadoAutomatico(true);
    setTimeout(() => setGuardadoAutomatico(false), 2000);
  };

  // Copiar al portapapeles
  const copiarBitacora = () => {
    const textoCompleto = `RESUMEN DE APRENDIZAJE Y VALIDACIÓN DE LA HERRAMIENTA MEP\n` +
      `Docente: ${docente?.nombreCompleto || "Docente MEP"}\n` +
      `Progreso de Verificación: ${porcentajeProgreso}% (${tareasHechasCount} de ${totalTareas} pasos completados)\n\n` +
      `--- APUNTES Y REFLEXIONES DEL DOCENTE ---\n` +
      `${apuntesDocente || "(Sin notas registradas aún)"}\n\n` +
      `Fecha de Registro: ${new Date().toLocaleString("es-CR")}\n` +
      `Ministerio de Educación Pública • Formación Tecnológica`;

    navigator.clipboard.writeText(textoCompleto);
    setCopiadoExitoso(true);
    setTimeout(() => setCopiadoExitoso(false), 2500);
  };

  // Descargar archivo de texto
  const descargarBitacora = () => {
    const contenido = `# Bitácora de Aprendizaje y Validación de la Herramienta MEP\n\n` +
      `**Docente:** ${docente?.nombreCompleto || "Docente MEP"}\n` +
      `**Cédula:** ${docente?.cedula || "N/A"}\n` +
      `**Institución:** ${docente?.institucionNombre || "Centro Educativo MEP"}\n` +
      `**Progreso Global:** ${porcentajeProgreso}% (${tareasHechasCount}/${totalTareas} verificaciones cumplidas)\n` +
      `**Fecha:** ${new Date().toLocaleString("es-CR")}\n\n` +
      `---\n\n` +
      `## 1. Verificaciones por Etapa\n\n` +
      ETAPAS_DATOS.map((etapa) => {
        const tareasEtapa = etapa.tareas.map((t) => {
          const check = tareasCompletadas[t.id] ? "[X]" : "[ ]";
          return `${check} ${t.texto}\n    ${t.detalle}`;
        }).join("\n");
        return `### ${etapa.titulo}\n${tareasEtapa}\n`;
      }).join("\n") +
      `\n---\n\n` +
      `## 2. Apuntes Personales y Reflexiones Pedagógicas\n\n` +
      (apuntesDocente || "*No se registraron notas adicionales.*") +
      `\n\n---\n*Generado automáticamente desde la plataforma de Diagnóstico Secundaria • MEP*`;

    const blob = new Blob([contenido], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bitacora_Aprendizaje_MEP_${docente?.cedula || "Docente"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Imprimir bitácora
  const imprimirBitacora = () => {
    window.print();
  };

  return (
    <section className="bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-softPastel space-y-8 animate-fadeIn">
      {/* Cabecera del Recurso */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-black">
            <GraduationCap size={16} weight="bold" />
            <span>Guía Interactiva Autogestionada de Aprendizaje</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Ruta Sistemática de Validación & Bitácora Docente
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Siga paso a paso las 7 etapas del ciclo de evaluación, registre sus avances con casillas interactivas y conserve sus apuntes pedagógicos con guardado automático en su cuenta.
          </p>
        </div>

        {/* Nivel de Madurez */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[170px] shrink-0 text-center shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Estado de Dominio</span>
          <span className={`text-base font-black mt-0.5 ${porcentajeProgreso === 100 ? "text-emerald-700" : porcentajeProgreso >= 50 ? "text-indigo-700" : "text-amber-700"}`}>
            {porcentajeProgreso === 100 ? "🎉 Listo para Aula" : porcentajeProgreso >= 50 ? "⚡ En Progreso" : "🌱 Iniciando"}
          </span>
          <span className="text-xs text-stone-600 font-mono font-bold mt-1">
            {tareasHechasCount} de {totalTareas} verificados
          </span>
        </div>
      </div>

      {/* Barra de Progreso Dinámica */}
      <div className="space-y-2 bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-900">
          <div className="flex items-center gap-2">
            <Sparkle size={18} className="text-emerald-700" weight="fill" />
            <span>Progreso General de Validación:</span>
          </div>
          <span className="text-emerald-800 text-base font-mono font-black">{porcentajeProgreso}%</span>
        </div>

        <div className="w-full bg-stone-200 rounded-full h-3.5 overflow-hidden shadow-inner">
          <div
            className="bg-linear-to-r from-emerald-600 via-teal-600 to-indigo-600 h-3.5 rounded-full transition-all duration-500 shadow-xs"
            style={{ width: `${porcentajeProgreso}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 font-medium">
          <span>{totalTareas - tareasHechasCount} pasos pendientes para completar el ciclo integral</span>
          {guardadoAutomatico && (
            <span className="text-emerald-800 font-bold flex items-center gap-1 animate-fadeIn">
              <FloppyDisk size={13} weight="bold" /> Guardado en tu cuenta
            </span>
          )}
        </div>
      </div>

      {/* Marco Curricular de las Cuatro Áreas Oficiales */}
      <div className="bg-stone-50/80 border border-stone-300/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Cpu size={20} className="text-emerald-700" weight="duotone" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Cuatro Áreas Oficiales de Evaluación Curricular (7.°, 8.° y 9.° Año)
          </h3>
        </div>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Tanto la aplicación del diagnóstico estudiantil como la matriz de observación directa docente se articulan en torno a estas cuatro áreas normativas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
              <DeviceMobile size={16} weight="bold" />
              <span>1. Apropiación Tecnológica y Digital</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Ciberseguridad, uso seguro, ciudadanía digital y colaboración tecnológica.
            </p>
          </div>

          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-800">
              <Code size={16} weight="bold" />
              <span>2. Programación y Algoritmos</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Pensamiento computacional, variables, bucles y lógica algorítmica.
            </p>
          </div>

          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
              <Robot size={16} weight="bold" />
              <span>3. Computación Física y Robótica</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Sensores, actuadores, automatización y control de hardware.
            </p>
          </div>

          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-black text-purple-800">
              <Database size={16} weight="bold" />
              <span>4. Ciencia de Datos e Inteligencia Artificial</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Patrones de datos, modelos predictivos y ética de la inteligencia artificial.
            </p>
          </div>
        </div>
      </div>

      {/* Lista Desplegable de las 7 Etapas */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-stone-200 pb-2">
          <ShieldCheck size={20} className="text-emerald-700" weight="bold" />
          <span>Verificación y Aprendizaje por Etapas</span>
        </h3>

        <div className="space-y-3">
          {ETAPAS_DATOS.map((etapa) => {
            const tareasEtapaHechas = etapa.tareas.filter((t) => tareasCompletadas[t.id]).length;
            const estaCompleta = tareasEtapaHechas === etapa.tareas.length;
            const estaAbierta = etapaAbierta === etapa.id;

            return (
              <div
                key={etapa.id}
                className={`border-2 rounded-2xl transition-all overflow-hidden ${
                  estaCompleta
                    ? "border-emerald-300 bg-emerald-50/20"
                    : estaAbierta
                    ? "border-indigo-300 bg-white shadow-xs"
                    : "border-stone-200 bg-stone-50/50 hover:bg-stone-50"
                }`}
              >
                {/* Cabecera del Acordeón */}
                <button
                  type="button"
                  onClick={() => setEtapaAbierta(estaAbierta ? 0 : etapa.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5 sm:mt-0 ${
                        estaCompleta
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {estaCompleta ? <CheckCircle size={18} weight="bold" /> : etapa.id}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900">
                        {etapa.titulo}
                      </div>
                      <div className="text-[11.5px] text-stone-500 font-medium line-clamp-1">
                        {etapa.subtitulo}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10.5px] font-mono font-bold ${
                        estaCompleta
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-stone-100 text-stone-600 border border-stone-300"
                      }`}
                    >
                      {tareasEtapaHechas}/{etapa.tareas.length}
                    </span>
                    {estaAbierta ? <CaretDown size={18} /> : <CaretRight size={18} />}
                  </div>
                </button>

                {/* Contenido Expandible de Tareas */}
                {estaAbierta && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-200/80 space-y-4 bg-white">
                    <div className="space-y-2.5 pt-1">
                      {etapa.tareas.map((tarea) => {
                        const marcada = !!tareasCompletadas[tarea.id];
                        return (
                          <label
                            key={tarea.id}
                            className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                              marcada
                                ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                                : "bg-stone-50/60 border-stone-200 text-slate-800 hover:bg-stone-100"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={marcada}
                              onChange={() => toggleTarea(tarea.id)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 mt-0.5 cursor-pointer shrink-0"
                            />
                            <div className="space-y-0.5">
                              <div className={`text-xs font-bold leading-snug ${marcada ? "line-through text-emerald-900/80" : "text-slate-900"}`}>
                                {tarea.texto}
                              </div>
                              <div className="text-[11px] text-stone-500 font-medium">
                                {tarea.detalle}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {etapa.enlaceAccion && (
                      <div className="pt-2 flex justify-end">
                        <Link
                          href={etapa.enlaceAccion.url}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition-colors"
                        >
                          <span>{etapa.enlaceAccion.texto}</span>
                          <ArrowSquareOut size={14} weight="bold" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bloque de Apuntes y Bitácora Personal */}
      <div className="bg-stone-50 border-2 border-stone-300/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <NotePencil size={22} className="text-indigo-700" weight="bold" />
            <div>
              <h3 className="text-base font-black text-slate-900">
                Bitácora de Apuntes & Observaciones Pedagógicas
              </h3>
              <p className="text-[11.5px] text-stone-500 font-medium">
                Espacio personal para tomar notas durante la exploración y guardarlas automáticamente en su perfil.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={copiarBitacora}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Copy size={15} />
              <span>{copiadoExitoso ? "¡Copiado!" : "Copiar"}</span>
            </button>

            <button
              type="button"
              onClick={descargarBitacora}
              className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <DownloadSimple size={15} />
              <span>Descargar .md</span>
            </button>

            <button
              type="button"
              onClick={imprimirBitacora}
              className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Printer size={15} weight="bold" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            rows={5}
            value={apuntesDocente}
            onChange={(e) => handleCambioApuntes(e.target.value)}
            placeholder="Escriba aquí sus anotaciones, dudas técnicas, acuerdos de sección o reflexiones sobre las 4 áreas curriculares..."
            className="w-full p-4 bg-white border border-stone-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder-stone-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed shadow-inner"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>{apuntesDocente.length} caracteres escritos</span>
            <span>Vinculado a su usuario: <strong>{docente?.nombreCompleto || "Docente MEP"}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
