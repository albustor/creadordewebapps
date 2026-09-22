"use client";

import React from "react";
import { LISTA_DRE_REGIONALES, LISTA_DRE_MEP } from "@/lib/dreCircuitos";
import { CentroEducativoDocente, DesgloseNivelSecciones } from "@/context/DocenteContext";
import {
  Buildings,
  Plus,
  Trash,
  CheckCircle,
  Check,
  ChalkboardTeacher,
  Sparkle,
} from "@phosphor-icons/react";

export const CREAR_DESGLOSE_DEFAULT = (): DesgloseNivelSecciones[] => [
  { nivel: "7°", activo: false, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["7-1", "7-2", "7-3", "7-4"] },
  { nivel: "8°", activo: false, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["8-1", "8-2", "8-3", "8-4"] },
  { nivel: "9°", activo: true, totalSeccionesColegio: 5, seccionesAtendidasDocente: ["9-1", "9-2", "9-3", "9-4", "9-5"] },
  { nivel: "10°", activo: false, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["10-1", "10-2", "10-3", "10-4"] },
  { nivel: "11°", activo: false, totalSeccionesColegio: 4, seccionesAtendidasDocente: ["11-1", "11-2", "11-3", "11-4"] },
  { nivel: "12°", activo: false, totalSeccionesColegio: 3, seccionesAtendidasDocente: ["12-1", "12-2", "12-3"] },
];

export const CREAR_CENTRO_DEFAULT = (idNum: number, dreCodigoDefault = "DRE-01"): CentroEducativoDocente => {
  const dre = LISTA_DRE_MEP.find((d) => d.codigo === dreCodigoDefault) || LISTA_DRE_MEP[0];
  return {
    id: `centro-${idNum}-${Date.now()}`,
    nombre: "",
    dreCodigo: dre.codigo,
    dreNombre: dre.nombre,
    circuito: dre.circuitos?.[0] || "Circuito 01",
    codigoPresupuestario: "SABER-2026",
    desgloseNiveles: CREAR_DESGLOSE_DEFAULT(),
  };
};

interface SelectorCentrosYSeccionesProps {
  centros: CentroEducativoDocente[];
  onChangeCentros: (nuevosCentros: CentroEducativoDocente[]) => void;
  modoCompacto?: boolean;
}

export default function SelectorCentrosYSecciones({
  centros,
  onChangeCentros,
  modoCompacto = false,
}: SelectorCentrosYSeccionesProps) {
  // Asegurar al menos 1 centro
  const centrosSeguros = centros && centros.length > 0 ? centros : [CREAR_CENTRO_DEFAULT(1)];

  const handleActualizarCentro = (index: number, campo: keyof CentroEducativoDocente, valor: any) => {
    const nuevos = [...centrosSeguros];
    if (campo === "dreCodigo") {
      const dreFound = LISTA_DRE_MEP.find((d) => d.codigo === valor) || LISTA_DRE_MEP[0];
      nuevos[index] = {
        ...nuevos[index],
        dreCodigo: valor,
        dreNombre: dreFound.nombre,
        circuito: dreFound.circuitos?.[0] || "Circuito 01",
      };
    } else {
      nuevos[index] = { ...nuevos[index], [campo]: valor };
    }
    onChangeCentros(nuevos);
  };

  const handleToggleNivel = (centroIdx: number, nivelNom: string) => {
    const nuevos = [...centrosSeguros];
    nuevos[centroIdx].desgloseNiveles = nuevos[centroIdx].desgloseNiveles.map((dn) => {
      if (dn.nivel === nivelNom) {
        const nuevoActivo = !dn.activo;
        const numNivel = dn.nivel.replace(/[^0-9]/g, "");
        const secs = nuevoActivo && dn.seccionesAtendidasDocente.length === 0
          ? Array.from({ length: dn.totalSeccionesColegio }, (_, i) => `${numNivel}-${i + 1}`)
          : dn.seccionesAtendidasDocente;
        return { ...dn, activo: nuevoActivo, seccionesAtendidasDocente: secs };
      }
      return dn;
    });
    onChangeCentros(nuevos);
  };

  const handleCambiarTotalSecciones = (centroIdx: number, nivelNom: string, nuevoTotal: number) => {
    const totalValido = Math.max(1, Math.min(20, nuevoTotal));
    const nuevos = [...centrosSeguros];
    nuevos[centroIdx].desgloseNiveles = nuevos[centroIdx].desgloseNiveles.map((dn) => {
      if (dn.nivel === nivelNom) {
        const numNivel = dn.nivel.replace(/[^0-9]/g, "");
        // Mantener las existentes que estén dentro del rango
        const filtradas = dn.seccionesAtendidasDocente.filter((sec) => {
          const numSec = parseInt(sec.split("-")[1] || "0", 10);
          return numSec <= totalValido;
        });
        return {
          ...dn,
          totalSeccionesColegio: totalValido,
          seccionesAtendidasDocente: filtradas.length > 0 ? filtradas : [`${numNivel}-1`],
        };
      }
      return dn;
    });
    onChangeCentros(nuevos);
  };

  const handleToggleSeccion = (centroIdx: number, nivelNom: string, secCodigo: string) => {
    const nuevos = [...centrosSeguros];
    nuevos[centroIdx].desgloseNiveles = nuevos[centroIdx].desgloseNiveles.map((dn) => {
      if (dn.nivel === nivelNom) {
        const existe = dn.seccionesAtendidasDocente.includes(secCodigo);
        const actualizadas = existe
          ? dn.seccionesAtendidasDocente.filter((s) => s !== secCodigo)
          : [...dn.seccionesAtendidasDocente, secCodigo].sort();
        return { ...dn, seccionesAtendidasDocente: actualizadas };
      }
      return dn;
    });
    onChangeCentros(nuevos);
  };

  const handleSeleccionarTodasSecciones = (centroIdx: number, nivelNom: string) => {
    const nuevos = [...centrosSeguros];
    nuevos[centroIdx].desgloseNiveles = nuevos[centroIdx].desgloseNiveles.map((dn) => {
      if (dn.nivel === nivelNom) {
        const numNivel = dn.nivel.replace(/[^0-9]/g, "");
        const todas = Array.from({ length: dn.totalSeccionesColegio }, (_, i) => `${numNivel}-${i + 1}`);
        return { ...dn, seccionesAtendidasDocente: todas };
      }
      return dn;
    });
    onChangeCentros(nuevos);
  };

  const handleAgregarCentro = () => {
    const nuevo = CREAR_CENTRO_DEFAULT(centrosSeguros.length + 1);
    onChangeCentros([...centrosSeguros, nuevo]);
  };

  const handleEliminarCentro = (idx: number) => {
    if (centrosSeguros.length <= 1) return;
    const filtrados = centrosSeguros.filter((_, i) => i !== idx);
    onChangeCentros(filtrados);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado con selector de cantidad rápida */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Buildings size={16} className="text-emerald-700" weight="bold" />
          <span>Centros Educativos y Secciones Asignadas</span>
        </label>
        <span className="text-[11px] font-bold text-slate-500">
          {centrosSeguros.length === 1 ? "1 Centro Educativo" : `${centrosSeguros.length} Centros Educativos`}
        </span>
      </div>

      {/* Lista de Centros Educativos */}
      <div className="space-y-3.5">
        {centrosSeguros.map((centro, centroIdx) => {
          return (
            <div
              key={centro.id || `c-${centroIdx}`}
              className="bg-white border-2 border-emerald-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 transition-all"
            >
              {/* Encabezado del Centro */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {centroIdx + 1}
                  </span>
                  <span className="font-extrabold text-xs text-slate-900">
                    {centro.nombre ? centro.nombre : `Centro Educativo #${centroIdx + 1}`}
                  </span>
                  {centrosSeguros.length > 1 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {centro.dreCodigo}
                    </span>
                  )}
                </div>

                {centrosSeguros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleEliminarCentro(centroIdx)}
                    className="text-rose-600 hover:text-rose-800 font-bold text-xs flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Eliminar este centro educativo"
                  >
                    <Trash size={14} />
                    <span>Quitar</span>
                  </button>
                )}
              </div>

              {/* DRE y Nombre del Centro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Dirección Regional (DRE) <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={centro.dreCodigo}
                    onChange={(e) => handleActualizarCentro(centroIdx, "dreCodigo", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all"
                  >
                    {LISTA_DRE_REGIONALES.map((dre) => (
                      <option key={dre.codigo} value={dre.codigo}>
                        {dre.codigo} - {dre.nombre} ({dre.provincia})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Nombre del Colegio / Liceo <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={centro.nombre}
                    onChange={(e) => handleActualizarCentro(centroIdx, "nombre", e.target.value)}
                    placeholder="Ej: Liceo de Costa Rica / CTP San Pedro"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Niveles y Secciones que Imparte el Docente */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ChalkboardTeacher size={16} className="text-emerald-700" weight="bold" />
                    <span>Niveles y Secciones que atiendes:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Toca para activar o desactivar</span>
                </div>

                {/* Botones de Nivel (7°, 8°, 9°...) */}
                <div className="flex flex-wrap gap-1.5">
                  {centro.desgloseNiveles.map((dn) => (
                    <button
                      key={dn.nivel}
                      type="button"
                      onClick={() => handleToggleNivel(centroIdx, dn.nivel)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                        dn.activo
                          ? "bg-emerald-700 text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {dn.activo && <Check size={12} weight="bold" />}
                      <span>{dn.nivel} Año</span>
                    </button>
                  ))}
                </div>

                {/* Desglose de secciones para cada nivel activo */}
                <div className="space-y-2.5 pt-1">
                  {centro.desgloseNiveles
                    .filter((dn) => dn.activo)
                    .map((dn) => {
                      const numNivel = dn.nivel.replace(/[^0-9]/g, "");
                      return (
                        <div
                          key={dn.nivel}
                          className="p-3 bg-emerald-50/60 border border-emerald-200/90 rounded-xl space-y-2"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-emerald-950">
                                {dn.nivel} Año:
                              </span>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-bold">
                                <span>Total secciones colegio:</span>
                                <select
                                  value={dn.totalSeccionesColegio}
                                  onChange={(e) =>
                                    handleCambiarTotalSecciones(
                                      centroIdx,
                                      dn.nivel,
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  className="px-2 py-0.5 bg-white border border-emerald-300 rounded-lg text-xs font-black text-emerald-950 focus:outline-none"
                                >
                                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                                    <option key={n} value={n}>
                                      {n} {n === 1 ? "sección" : "secciones"}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSeleccionarTodasSecciones(centroIdx, dn.nivel)}
                                className="text-[10px] font-bold text-emerald-800 hover:underline"
                              >
                                Todas
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nuevos = [...centrosSeguros];
                                  nuevos[centroIdx].desgloseNiveles = nuevos[centroIdx].desgloseNiveles.map((item) =>
                                    item.nivel === dn.nivel ? { ...item, seccionesAtendidasDocente: [] } : item
                                  );
                                  onChangeCentros(nuevos);
                                }}
                                className="text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:underline"
                              >
                                Limpiar
                              </button>
                            </div>
                          </div>

                          {/* Chips de Secciones */}
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-bold text-emerald-900 mr-1">Tus secciones:</span>
                            {Array.from({ length: dn.totalSeccionesColegio }, (_, i) => {
                              const secCodigo = `${numNivel}-${i + 1}`;
                              const asignada = dn.seccionesAtendidasDocente.includes(secCodigo);
                              return (
                                <button
                                  key={secCodigo}
                                  type="button"
                                  onClick={() => handleToggleSeccion(centroIdx, dn.nivel, secCodigo)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                                    asignada
                                      ? "bg-emerald-600 text-white shadow-xs scale-102"
                                      : "bg-white text-slate-500 border border-slate-300 hover:border-emerald-500 hover:text-emerald-700"
                                  }`}
                                >
                                  {secCodigo}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón para agregar otro centro educativo */}
      <button
        type="button"
        onClick={handleAgregarCentro}
        className="w-full py-2.5 border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-900 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs"
      >
        <Plus size={16} weight="bold" />
        <span>➕ Agregar otro Centro Educativo (Otra DRE o Institución)</span>
      </button>
    </div>
  );
}
