"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useDocente } from "@/context/DocenteContext";
import {
  CheckCircle,
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
  Code,
  Robot,
  Database,
  DeviceMobile,
  Question,
  BookOpen,
  Bookmarks,
  Lightbulb,
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
  const [areaGlosarioAbierta, setAreaGlosarioAbierta] = useState<number>(1);
  const [casoContingenciaAbierto, setCasoContingenciaAbierto] = useState<number | null>(null);
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

  // Insertar plantillas guiadas en los apuntes
  const insertarPlantilla = (tipo: "dua" | "seguimiento") => {
    const fechaHora = new Date().toLocaleString("es-CR");
    let plantilla = "";

    if (tipo === "dua") {
      plantilla = `\n\n--- [PLAN DE APOYO PEDAGÓGICO DUA • ${fechaHora}] ---\n` +
        `• Fortalezas observadas en el grupo: \n` +
        `• Barreras identificadas (Saber / Saber Hacer / Saber Ser): \n` +
        `• Estrategias de representación y acción múltiple DUA: \n` +
        `• Ajustes para estudiantes en nivel Inicial: \n`;
    } else {
      plantilla = `\n\n--- [ACUERDOS DE AULA Y SEGUIMIENTO • ${fechaHora}] ---\n` +
        `• Centro Educativo / Sección: \n` +
        `• Acciones prioritarias en las 4 áreas curriculares: \n` +
        `• Coordinación con el Comité de Evaluación: \n` +
        `• Próxima fecha de revisión de avances: \n`;
    }

    const nuevoTexto = apuntesDocente ? apuntesDocente + plantilla : plantilla.trimStart();
    handleCambioApuntes(nuevoTexto);
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
            <span>Recurso Oficial Autogestionado • PNFT MEP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            GUÍA INTERACTIVA AUTOGESTIONADA DE APRENDIZAJE Y VALIDACIÓN
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
            Ruta Sistemática de Validación & Bitácora Docente: Siga paso a paso las 7 etapas del ciclo de evaluación, consulte el glosario de las 4 áreas oficiales de la <strong>Guía Docente 2026</strong> y conserve sus apuntes pedagógicos con guardado automático en su cuenta.
          </p>
        </div>

        {/* Nivel de Madurez */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[170px] shrink-0 text-center shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Estado de Dominio</span>
          <span className={`text-base font-black mt-0.5 ${porcentajeProgreso === 100 ? "text-emerald-700" : porcentajeProgreso >= 50 ? "text-indigo-700" : "text-amber-700"}`}>
            {porcentajeProgreso === 100 ? "🎉 Dominio Completo" : porcentajeProgreso >= 50 ? "⚡ En Progreso" : "🌱 Iniciando"}
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

      {/* Glosario Didáctico de las Cuatro Áreas Oficiales (Guía Docente 2026) */}
      <div className="bg-stone-50/90 border border-stone-300 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-700" weight="bold" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Glosario Didáctico de las Cuatro Áreas Curriculares (Guía Docente 2026)
            </h3>
          </div>
          <span className="text-[11px] font-bold text-stone-500">
            Fundamentos oficiales para 7.°, 8.° y 9.° Año
          </span>
        </div>

        {/* Selector de Áreas del Glosario */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { id: 1, nombre: "1. Apropiación Tecnológica", icono: DeviceMobile, color: "text-emerald-700", bgActive: "bg-emerald-700 text-white" },
            { id: 2, nombre: "2. Programación y Algoritmos", icono: Code, color: "text-blue-700", bgActive: "bg-blue-700 text-white" },
            { id: 3, nombre: "3. Computación Física y Robótica", icono: Robot, color: "text-amber-700", bgActive: "bg-amber-700 text-white" },
            { id: 4, nombre: "4. Ciencia de Datos e IA", icono: Database, color: "text-purple-700", bgActive: "bg-purple-700 text-white" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAreaGlosarioAbierta(item.id)}
              className={`p-2.5 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 ${
                areaGlosarioAbierta === item.id
                  ? item.bgActive + " shadow-xs ring-2 ring-stone-400/20"
                  : "bg-white border border-stone-200 text-slate-700 hover:bg-stone-100"
              }`}
            >
              <item.icono size={16} weight="bold" className={areaGlosarioAbierta === item.id ? "text-white" : item.color} />
              <span className="truncate">{item.nombre}</span>
            </button>
          ))}
        </div>

        {/* Fichas Conceptuales Detalladas */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs space-y-3">
          {areaGlosarioAbierta === 1 && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                <DeviceMobile size={18} className="text-emerald-700" />
                <span>Área 1: Apropiación Tecnológica y Digital</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Ciudadanía e Identidad Digital:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Ejercicio responsable de derechos y deberes en entornos virtuales, prevención del ciberacoso y convivencia digital pacífica.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Huella Digital y Ciberseguridad:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Rastro de datos dejado al interactuar en la red, contraseñas seguras, autenticación y medidas de resguardo de información personal.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Ergonomía y Bienestar Digital:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Postura física adecuada frente al computador, iluminación del laboratorio, pausas activas y balance saludable con la tecnología.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Licenciamiento y Propiedad Intelectual:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Reconocimiento de autoría, licencias Creative Commons, software libre y uso ético de fuentes bibliográficas y recursos en la web.
                  </p>
                </div>
              </div>
            </div>
          )}

          {areaGlosarioAbierta === 2 && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                <Code size={18} className="text-blue-700" />
                <span>Área 2: Programación y Algoritmos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Pensamiento Computacional:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Habilidad para descomponer problemas complejos, reconocer patrones recurrentes y abstraer elementos irrelevantes para crear modelos.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Secuenciación y Algoritmia:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Construcción de pasos ordenados, finitos y lógicos para ejecutar tareas precisas y resolver desafíos cotidianos de forma determinista.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Variables y Estructuras de Control:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Almacenamiento dinámico de datos, toma de decisiones condicionales (<em>si... entonces</em>) y repeticiones controladas (<em>bucles mientras / para</em>).
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Depuración y Resolución Metódica:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Rastreo sistemático y corrección de errores en secuencias de código, fomentando la perseverancia y el ensayo y ajuste reflexivo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {areaGlosarioAbierta === 3 && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                <Robot size={18} className="text-amber-700" />
                <span>Área 3: Computación Física y Robótica</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Sensores (Entrada):</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Componentes que captan variables del entorno físico (luz, sonido, proximidad, temperatura) y las convierten en señales digitales.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Actuadores (Salida):</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Dispositivos que transforman instrucciones del software en acciones físicas palpables (motores, luces LED, pantallas y zumbadores).
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Lazo de Control y Procesamiento:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Ciclo interactivo continuo entre la lectura de sensores, la evaluación de condiciones algorítmicas y la activación de actuadores.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Automatización y Solución de Problemas:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Diseño de prototipos interactivos programables para responder a necesidades reales del colegio o la comunidad.
                  </p>
                </div>
              </div>
            </div>
          )}

          {areaGlosarioAbierta === 4 && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="font-extrabold text-xs text-purple-950 flex items-center gap-1.5">
                <Database size={18} className="text-purple-700" />
                <span>Área 4: Ciencia de Datos e Inteligencia Artificial</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Datos versus Información:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Diferenciación entre registros sin procesar y datos estructurados organizados que permiten tomar decisiones pedagógicas e informadas.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Reconocimiento y Análisis de Patrones:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Clasificación, visualización mediante tablas o gráficos y detección de tendencias estadísticas en conjuntos de evidencias.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Modelos Predictivos y Aprendizaje:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Comprensión de cómo los algoritmos de inteligencia artificial analizan muestras históricas para reconocer imágenes, voz o generar texto.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                  <strong className="text-slate-900 block">Ética, Sesgos y Responsabilidad:</strong>
                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    Evaluación crítica del impacto social de la IA, prevención de sesgos algorítmicos y uso transparente y ético de la tecnología.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Protocolo de Aula y Situaciones Imprevistas (Guía Rápida "¿Qué hacer si...?") */}
      <div className="bg-stone-50/90 border border-stone-300 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          <Question size={20} className="text-indigo-700" weight="bold" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Protocolo de Aula y Situaciones Imprevistas («¿Qué hacer si...?»)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 1,
              pregunta: "¿Qué hago si se cae o falla el internet a mitad de la prueba?",
              respuesta: "La WebApp opera de manera autónoma gracias al almacenamiento local en el navegador. Indique al estudiante que continúe; al finalizar, la pantalla generará el código QR y token SHA-256 para que usted lo escanee con el lector del panel docente.",
            },
            {
              id: 2,
              pregunta: "¿Qué sucede si un estudiante cierra la pestaña por error?",
              respuesta: "El avance se guarda en tiempo real en la memoria local del equipo. Al reabrir el enlace o QR en el mismo navegador, el estudiante reanuda la sesión sin perder las respuestas previas.",
            },
            {
              id: 3,
              pregunta: "¿Cómo garantizo la equidad si no hay computadoras suficientes?",
              respuesta: "El docente debe validar previamente las condiciones técnicas y organizar turnos por estaciones o grupos de trabajo rotativos, asegurando que el 100 % de los estudiantes tenga acceso al mismo instrumento sin exclusión.",
            },
            {
              id: 4,
              pregunta: "¿Cómo traslado los resultados finales al registro oficial?",
              respuesta: "Desde el tablero docente (/dashboard), una vez consolidadas las secciones, utilice los botones oficiales de exportación a Excel y PDF con formato institucional MEP.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5 shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setCasoContingenciaAbierto(casoContingenciaAbierto === item.id ? null : item.id)}
                className="w-full text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-2 cursor-pointer"
              >
                <span>{item.pregunta}</span>
                {casoContingenciaAbierto === item.id ? <CaretDown size={16} /> : <CaretRight size={16} />}
              </button>
              {casoContingenciaAbierto === item.id && (
                <p className="text-[11.5px] text-stone-600 leading-relaxed pt-1 border-t border-stone-100 animate-fadeIn">
                  {item.respuesta}
                </p>
              )}
            </div>
          ))}
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

        {/* Botones de Plantillas Guiadas Rápidas */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
            <Bookmarks size={14} className="text-indigo-600" />
            <span>Insertar plantilla guiada:</span>
          </span>

          <button
            type="button"
            onClick={() => insertarPlantilla("dua")}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Lightbulb size={13} className="text-amber-600" weight="fill" />
            <span>+ Plantilla DUA</span>
          </button>

          <button
            type="button"
            onClick={() => insertarPlantilla("seguimiento")}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
          >
            <ShieldCheck size={13} className="text-emerald-700" weight="bold" />
            <span>+ Acuerdos de Seguimiento</span>
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            rows={6}
            value={apuntesDocente}
            onChange={(e) => handleCambioApuntes(e.target.value)}
            placeholder="Escriba aquí sus anotaciones pedagógicas, reflexiones sobre las 4 áreas curriculares de la Guía Docente 2026, acuerdos de sección o adaptaciones DUA..."
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
