"use client";

import React, { useState } from "react";
import {
  X,
  Compass,
  Sparkle,
  Cpu,
  HandPalm,
  Brain,
  MagnifyingGlass,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  WarningCircle,
  BookOpen,
} from "@phosphor-icons/react";

interface ModalArticulacionCurricularProps {
  abierto: boolean;
  onCerrar: () => void;
  nivelInicial?: "7mo" | "9no";
}

interface ItemArticulacion {
  subarea: string;
  indicadorCognitivo: string;
  reactivosRelacionados: string;
  saberTeorico: string;
  practicaPsicomotriz: string;
  saberHacer: string;
  evidenciaEsperada: string;
  decisionPedagogica: string;
}

const MATRIZ_ARTICULACION: Record<"7mo" | "9no", { titulo: string; situacionProblema: string; items: ItemArticulacion[] }> = {
  "9no": {
    titulo: "9.° Año — III Ciclo",
    situacionProblema: "«El Aula Inteligente y Sistemas Automatizados» (PNFT - Formación Tecnológica)",
    items: [
      {
        subarea: "Grupo de criterios asociados 1: Sistemas Automatizados y Arquitectura de Control",
        indicadorCognitivo: "Ind 1 & Ind 2. Microcontrolador, Sensores y Actuadores",
        reactivosRelacionados: "Criterios 1 y 2",
        saberTeorico: "Reconoce la función del microcontrolador (MCU 328P) como cerebro procesador y diferencia entradas (LDR) de salidas (LED).",
        practicaPsicomotriz: "P1. Modularización y Hardware",
        saberHacer: "Identifica, selecciona y organiza espacialmente las 3 tarjetas de hardware independientes en el banco interactivo.",
        evidenciaEsperada: "Logrado (L): Reconoce y coloca las tarjetas con autonomía sin confundir módulos.",
        decisionPedagogica: "Si domina la teoría pero falla el conexionado, programar práctica de reconocimiento físico de módulos.",
      },
      {
        subarea: "Grupo de criterios asociados 1: Sistemas Automatizados y Arquitectura de Control",
        indicadorCognitivo: "Ind 4. Fuentes de Alimentación y Polaridad",
        reactivosRelacionados: "Criterio 4",
        saberTeorico: "Identifica voltajes continuos (5V), tierra de referencia (GND) y el riesgo de inversión de polaridad.",
        practicaPsicomotriz: "P2. Patrones y Polaridad Eléctrica",
        saberHacer: "Conecta los terminales respetando el código de colores y polaridades (5V 🔴, GND ⚫, Pin A0 🟡, Pin D9 🔵).",
        evidenciaEsperada: "Logrado (L): Cierra alimentación y señal sin provocar cortocircuitos.",
        decisionPedagogica: "Reforzar con código de colores antes de permitir energizar circuitos físicos reales.",
      },
      {
        subarea: "Grupo de criterios asociados 1: Sistemas Automatizados y Arquitectura de Control",
        indicadorCognitivo: "Ind 3. Modelo Entrada-Proceso-Salida (E-P-S)",
        reactivosRelacionados: "Criterio 3",
        saberTeorico: "Comprende el flujo de datos: Captura de Luz (Entrada) ➔ Procesamiento Lógico (MCU) ➔ Activación LED (Salida).",
        practicaPsicomotriz: "P3. Formulación del Flujo Algorítmico",
        saberHacer: "Establece el lazo funcional completo conectando ordenadamente en sentido Entrada a Salida.",
        evidenciaEsperada: "Logrado (L): Conexión fluida e inmediata siguiendo el orden lógico secuencial.",
        decisionPedagogica: "Elaborar diagrama de bloques previo al conexionado en mesa de trabajo.",
      },
      {
        subarea: "Grupo de criterios asociados 2: Pensamiento Computacional y Lógica Condicional",
        indicadorCognitivo: "Ind 5, 6, 7 & 8. Lógica Condicional y Umbrales",
        reactivosRelacionados: "Criterios 5, 6, 7 y 8",
        saberTeorico: "Evalúa expresiones condicionales SI (luz < 300 Lux) ENTONCES Activar Pin D9 SINO Apagar.",
        practicaPsicomotriz: "P4. Programación, Umbrales y Control",
        saberHacer: "Valida la respuesta del actuador en la simulación ajustando el deslizador de luxes y observando la activación de D9.",
        evidenciaEsperada: "Logrado (L): Verifica estados lógicos y relaciona el umbral con el estado del pin.",
        decisionPedagogica: "Realizar ejercicios de traza de pseudocódigo con tablas de verdad y valores frontera.",
      },
      {
        subarea: "Grupo de criterios asociados 3: Depuración, Conectividad y Datos",
        indicadorCognitivo: "Ind 9. Detección y Depuración de Fallas",
        reactivosRelacionados: "Criterio 9",
        saberTeorico: "Analiza un circuito defectuoso e infiere por qué el pin de señal conectado a 5V impide lecturas analógicas variables.",
        practicaPsicomotriz: "P5. Depuración en Simulación (Reto 2)",
        saberHacer: "Localiza la falla técnica en el simulador, desconecta el cable erróneo y lo reconecta en el pin analógico A0.",
        evidenciaEsperada: "Logrado (L): Diagnostica y corrige la falla con autonomía e inmediatez.",
        decisionPedagogica: "Diseñar mini-retos de 'caza de errores' (debugging) en parejas.",
      },
      {
        subarea: "Grupo de criterios asociados 3: Depuración, Conectividad y Datos",
        indicadorCognitivo: "Ind 10. Toma de Decisiones y Argumentación",
        reactivosRelacionados: "Criterio 10",
        saberTeorico: "Argumenta la toma de decisiones técnicas con datos numéricos de los sensores y justificación de ingeniería.",
        practicaPsicomotriz: "P6. Transferencia y Justificación Argumentada",
        saberHacer: "Redacta o explica verbalmente por qué el pin analógico A0 permite medir niveles graduales de luz.",
        evidenciaEsperada: "Logrado (L): Justificación técnica rigurosa diferenciando analógico vs digital.",
        decisionPedagogica: "Fomentar la sustentación oral y bitácora técnica de laboratorio.",
      },
    ],
  },
  "7mo": {
    titulo: "7.° Año — III Ciclo",
    situacionProblema: "«CyberQuest: Fundamentos de Computación, Hardware y Pensamiento Algorítmico»",
    items: [
      {
        subarea: "Grupo de criterios asociados 1: Lógica Proposicional, Algoritmia y Control",
        indicadorCognitivo: "Ind 5 & Ind 6. Secuencias Lógicas y Control Condicional",
        reactivosRelacionados: "Criterios 5 y 6",
        saberTeorico: "Ordena secuencias lógicas paso a paso y aplica decisiones condicionales (SI ... ENTONCES).",
        practicaPsicomotriz: "P1. Orientación Espacial en Cuadrícula",
        saberHacer: "Desplazamiento del avatar en cuadrícula aplicando lateralidad y orden secuencial.",
        evidenciaEsperada: "Logrado (L): Ejecución continua sin confusiones de giro (izquierda/derecha).",
        decisionPedagogica: "Juegos desconectados en piso con cuadrículas reales para reforzar lateralidad.",
      },
      {
        subarea: "Grupo de criterios asociados 2: Periféricos, Software y Gestión de Archivos",
        indicadorCognitivo: "Ind 3 & Ind 4. Clasificación de Periféricos y Almacenamiento",
        reactivosRelacionados: "Criterios 3 y 4",
        saberTeorico: "Diferencia dispositivos de entrada/salida y reconoce medios de almacenamiento digital.",
        practicaPsicomotriz: "P3. Pulso y Precisión Visomotora",
        saberHacer: "Interacción fluida con periféricos de puntero en trayectorias y manipulación de archivos.",
        evidenciaEsperada: "Logrado (L): Precisión en clic, arrastre y selección sin pérdida de pulso.",
        decisionPedagogica: "Ejercicios de gestión de archivos y clasificación de periféricos.",
      },
      {
        subarea: "Grupo de criterios asociados 3: Fundamentos de Computación, Cuidado del Equipo y Hardware",
        indicadorCognitivo: "Ind 1 & Ind 2. Reglas de Cuidado y Procesamiento Central (CPU)",
        reactivosRelacionados: "Criterios 1 y 2",
        saberTeorico: "Aplica normas de cuidado del equipo y reconoce la función del procesador (CPU) como núcleo de cómputo.",
        practicaPsicomotriz: "P4. Motricidad Fina y Cuidado del Periférico",
        saberHacer: "Manejo ergonómico del teclado, puntero y apagado secuencial seguro del equipo.",
        evidenciaEsperada: "Logrado (L): Uso autónomo, cuidadoso y estructurado del hardware.",
        decisionPedagogica: "Reforzar prácticas de mantenimiento preventivo y ergonomía en el aula.",
      },
    ],
  },
};

export default function ModalArticulacionCurricular({
  abierto,
  onCerrar,
  nivelInicial = "9no",
}: ModalArticulacionCurricularProps) {
  const [nivelActivo, setNivelActivo] = useState<"7mo" | "9no">(nivelInicial === "7mo" ? "7mo" : "9no");
  const [busqueda, setBusqueda] = useState("");
  const [tabPedagogica, setTabPedagogica] = useState<"matriz" | "decisiones">("matriz");

  if (!abierto) return null;

  const dataNivel = MATRIZ_ARTICULACION[nivelActivo];
  const itemsFiltrados = dataNivel.items.filter((item) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      item.subarea.toLowerCase().includes(q) ||
      item.indicadorCognitivo.toLowerCase().includes(q) ||
      item.practicaPsicomotriz.toLowerCase().includes(q) ||
      item.saberTeorico.toLowerCase().includes(q) ||
      item.saberHacer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Cabecera Principal */}
        <div className="bg-gradient-to-r from-teal-900 via-[#1B5E59] to-slate-900 text-white p-5 sm:p-6 flex flex-wrap items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-300 shrink-0 text-2xl shadow-inner">
              <Compass size={28} weight="fill" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 text-[10px] font-black uppercase tracking-wider border border-teal-300/30">
                  Curriculo Oficial MEP • III Ciclo
                </span>
                <span className="text-white/60 text-xs font-mono">• Saber ⟷ Saber Hacer</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Matriz de Articulación Curricular (Cognitivo ⟷ Psicomotriz)
              </h2>
              <p className="text-xs text-teal-100/80 font-medium">
                {dataNivel.situacionProblema}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCerrar}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X size={22} weight="bold" />
            </button>
          </div>
        </div>

        {/* Barra de Controles: Selector de Nivel, Búsqueda y Pestañas */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Selector de Nivel (7mo y 9no) */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 pl-2 pr-1">Nivel:</span>
            {(["7mo", "9no"] as const).map((niv) => (
              <button
                key={niv}
                type="button"
                onClick={() => setNivelActivo(niv)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  nivelActivo === niv
                    ? "bg-[#1B5E59] text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {niv === "7mo" ? "7.° Año" : "9.° Año"}
              </button>
            ))}
          </div>

          {/* Selector de Vista (Matriz vs Decisiones DUA) */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setTabPedagogica("matriz")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tabPedagogica === "matriz"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              📋 Matriz Comparativa
            </button>
            <button
              type="button"
              onClick={() => setTabPedagogica("decisiones")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tabPedagogica === "decisiones"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              💡 Guía de Decisiones Pedagógicas
            </button>
          </div>

          {/* Buscador Rápido */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <MagnifyingGlass size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar indicador o criterio..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B5E59]/30 focus:border-[#1B5E59]"
            />
          </div>
        </div>

        {/* Contenido con Scroll */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 flex-1">
          
          {tabPedagogica === "matriz" ? (
            <>
              {/* Resumen explicativo */}
              <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-start gap-3 text-xs text-teal-950">
                <Lightbulb size={20} weight="fill" className="text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">¿Cómo leer esta articulación?</strong>
                  <p className="text-teal-900/90 mt-0.5">
                    Cada reactivo cognitivo de la WebApp mide el <strong>concepto abstracto</strong>, mientras que la práctica psicomotriz evalúa la <strong>ejecución en el simulador interactivo o banco de hardware</strong>. La correlación permite diagnosticar vacíos de taller vs. vacíos conceptuales.
                  </p>
                </div>
              </div>

              {/* Tarjetas de Articulación */}
              <div className="space-y-4">
                {itemsFiltrados.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden hover:border-teal-300 transition-all"
                  >
                    {/* Encabezado de la Subárea */}
                    <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <BookOpen size={15} className="text-teal-700" />
                        <span>{item.subarea}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.reactivosRelacionados}
                      </span>
                    </div>

                    {/* Columnas Comparativas: Cognitivo vs Psicomotriz */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Columna Cognitiva (Saber) */}
                      <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200/80 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-black">🧠 SABER (COGNITIVO)</span>
                        </div>
                        <h4 className="text-xs font-black text-sky-950">
                          {item.indicadorCognitivo}
                        </h4>
                        <p className="text-xs text-sky-900 leading-relaxed">
                          {item.saberTeorico}
                        </p>
                      </div>

                      {/* Columna Psicomotriz (Saber Hacer) */}
                      <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-black">🖐️ SABER HACER (PSICOMOTRIZ)</span>
                        </div>
                        <h4 className="text-xs font-black text-emerald-950">
                          {item.practicaPsicomotriz}
                        </h4>
                        <p className="text-xs text-emerald-900 leading-relaxed">
                          {item.saberHacer}
                        </p>
                      </div>
                    </div>

                    {/* Fila de Evidencia y Decisión Pedagógica */}
                    <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <strong className="text-slate-900 font-bold block text-[11px]">Evidencia de Desempeño:</strong>
                        <span className="text-slate-600 text-[11px]">{item.evidenciaEsperada}</span>
                      </div>
                      <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200">
                        <strong className="text-amber-950 font-bold block text-[11px]">Orientación Pedagógica Docente:</strong>
                        <span className="text-amber-900 text-[11px]">{item.decisionPedagogica}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Vista de Guía de Decisiones Pedagógicas Cruzadas */
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sparkle size={18} weight="fill" className="text-teal-700" />
                  <span>Matriz de Diagnóstico Cruzado (Cognitivo vs. Psicomotor)</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Utilice esta guía para interpretar los resultados de telemetría y observación directa en el aula:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Cuadrante 1: Alto Cognitivo + Alto Psicomotor */}
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-900 text-xs">🟢 Dominio Integral (Autónomo)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 text-[10px] font-bold">100% Teórico • Nivel A</span>
                  </div>
                  <p className="text-emerald-950 text-[11px] leading-relaxed">
                    El estudiante domina los principios conceptuales y ejecuta el conexionado y la depuración con total fluidez.
                  </p>
                  <div className="pt-1 text-[11px] font-bold text-emerald-900">
                    🎯 <strong>Acción Sugerida:</strong> Asignar rol de tutor par en dinámicas colaborativas o retos avanzados de robótica abierta.
                  </div>
                </div>

                {/* Cuadrante 2: Alto Cognitivo + Bajo Psicomotor */}
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-900 text-xs">🟡 Brecha de Taller / Destreza Física</span>
                    <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">Teoría Clara • Nivel C</span>
                  </div>
                  <p className="text-amber-950 text-[11px] leading-relaxed">
                    Comprende los conceptos lógicos en papel/pantalla pero presenta vacilación o errores de polaridad al manipular cables y módulos.
                  </p>
                  <div className="pt-1 text-[11px] font-bold text-amber-900">
                    🎯 <strong>Acción Sugerida:</strong> Prácticas de conexionado guiado con código de colores y modelado paso a paso.
                  </div>
                </div>

                {/* Cuadrante 3: Bajo Cognitivo + Alto Psicomotor */}
                <div className="p-4 bg-sky-50 border border-sky-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sky-900 text-xs">🔵 Destreza Empírica / Ensayo y Error</span>
                    <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-950 text-[10px] font-bold">Práctica Lograda • Fallos Teóricos</span>
                  </div>
                  <p className="text-sky-950 text-[11px] leading-relaxed">
                    Resuelve el circuito intuitivamente por ensayo y error en el simulador, pero no fundamenta los principios de microcontrolador o lógica condicional.
                  </p>
                  <div className="pt-1 text-[11px] font-bold text-sky-900">
                    🎯 <strong>Acción Sugerida:</strong> Reforzar el vocabulario técnico, bitácora de justificación y diagramas de bloques.
                  </div>
                </div>

                {/* Cuadrante 4: Bajo Cognitivo + Bajo Psicomotor */}
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-rose-900 text-xs">🔴 Acompañamiento Prioritario (DUA)</span>
                    <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-950 text-[10px] font-bold">Rezagos Múltiples</span>
                  </div>
                  <p className="text-rose-950 text-[11px] leading-relaxed">
                    Dificultad simultánea para comprender la lógica del sistema y ejecutar las conexiones de hardware.
                  </p>
                  <div className="pt-1 text-[11px] font-bold text-rose-900">
                    🎯 <strong>Acción Sugerida:</strong> Mediación DUA con material concreto desconectado, apoyo de tutor par y tiempos flexibles.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Pie de Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Ministerio de Educación Pública (MEP) • Dirección de Recursos Tecnológicos en Educación
          </span>
          <button
            type="button"
            onClick={onCerrar}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Entendido / Cerrar Consulta
          </button>
        </div>

      </div>
    </div>
  );
}
