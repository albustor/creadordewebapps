"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, CheckCircle, WarningCircle, QrCode } from "@phosphor-icons/react";
import { PayloadTelemetria, calcularNivelLogro } from "@/lib/antiFraude";

interface QRScannerResultadosProps {
  abierto: boolean;
  alCerrar: () => void;
  alDetectarResultado: (resultado: PayloadTelemetria) => void;
}

export default function QRScannerResultados({
  abierto,
  alCerrar,
  alDetectarResultado,
}: QRScannerResultadosProps) {
  const [escaneando, setEscaneando] = useState(false);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [ultimoDetectado, setUltimoDetectado] = useState<string | null>(null);
  const qrRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "reader-camera-stream";

  useEffect(() => {
    if (!abierto) {
      detenerEscaneo();
      return;
    }

    let isMounted = true;

    const iniciarScanner = async () => {
      try {
        setErrorCamara(null);
        setUltimoDetectado(null);
        const html5QrCode = new Html5Qrcode(scannerContainerId);
        qrRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (!isMounted) return;
            procesarQR(decodedText);
          },
          (errorMessage) => {
            // Error de frame individual normal al escanear
          }
        );
        if (isMounted) setEscaneando(true);
      } catch (err: any) {
        if (isMounted) {
          setErrorCamara(
            err?.message || "No se pudo acceder a la cámara. Revisa los permisos del navegador."
          );
          setEscaneando(false);
        }
      }
    };

    // Dar tiempo al DOM para renderizar el div
    const timer = setTimeout(() => {
      iniciarScanner();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      detenerEscaneo();
    };
  }, [abierto]);

  const detenerEscaneo = async () => {
    if (qrRef.current) {
      try {
        if (qrRef.current.isScanning) {
          await qrRef.current.stop();
        }
        await qrRef.current.clear();
      } catch (e) {
        // Ignorar
      }
      qrRef.current = null;
    }
    setEscaneando(false);
  };

  const procesarQR = (texto: string) => {
    try {
      // Intenta parsear JSON estructurado
      let datos: any;
      if (texto.startsWith("{")) {
        datos = JSON.parse(texto);
      } else {
        // Formato string directo
        datos = { estudianteNombre: "Estudiante Escaneado", puntaje: 80 };
      }

      const es8vo = datos.n === "8°" || datos.t === "MEP8" || (datos.s && typeof datos.s === "string" && datos.s.startsWith("8-")) || (datos.sec && typeof datos.sec === "string" && datos.sec.startsWith("8-"));
      const es7mo = datos.n === "7°" || datos.t === "MEP7" || datos.tipo === "CYBERQUEST_7MO" || (datos.s && typeof datos.s === "string" && datos.s.startsWith("7-")) || (datos.sec && typeof datos.sec === "string" && datos.sec.startsWith("7-")) || Boolean(datos.c1);

      let estNombre = datos.est || datos.estudianteNombre || datos.e || datos.nom || datos.nombre;
      if (!estNombre && es7mo && datos.c1) {
        estNombre = datos.c2 && datos.c2 !== "Individual" ? `${datos.c1} & ${datos.c2}` : datos.c1;
      }
      if (!estNombre) {
        estNombre = "Estudiante Escaneado";
      }

      let seccion = datos.grp || datos.seccionOGrupo || datos.s || datos.sec || datos.seccion || (es8vo ? "Sección 8-1" : es7mo ? "Sección 7-1" : "General");
      if (!seccion.startsWith("Sección ") && /^[789]-/i.test(seccion)) {
        seccion = `Sección ${seccion}`;
      }

      let puntaje = 80;
      let porcentaje = 80;
      let totalReactivos = es8vo ? 14 : 10;
      let aciertos = es8vo ? 11 : 8;

      if (es8vo) {
        const pRaw = typeof datos.p === "number" ? datos.p : (typeof datos.puntaje === "number" ? datos.puntaje : 11);
        const porcRaw = typeof datos.porc === "number" ? datos.porc : (typeof datos.porcentaje === "number" ? datos.porcentaje : Math.round((pRaw / 14) * 100));
        puntaje = pRaw <= 14 ? pRaw : Math.round((porcRaw / 100) * 14);
        porcentaje = porcRaw;
        totalReactivos = 14;
        aciertos = puntaje;
      } else if (es7mo && (datos.g !== undefined || datos.c !== undefined || datos.globalAvg !== undefined)) {
        const gRaw = typeof datos.g === "number" ? datos.g : (typeof datos.globalAvg === "number" ? datos.globalAvg : (typeof datos.puntaje === "number" ? datos.puntaje : 80));
        puntaje = gRaw;
        porcentaje = gRaw;
        totalReactivos = 10;
        const cogScore = typeof datos.c === "number" ? datos.c : (typeof datos.cogScore === "number" ? datos.cogScore : 80);
        aciertos = Math.round((cogScore / 100) * 10);
      } else {
        const pRaw = typeof datos.pts === "number" ? datos.pts : (typeof datos.puntaje === "number" ? datos.puntaje : (typeof datos.porcentaje === "number" ? datos.porcentaje : 80));
        porcentaje = pRaw;
        puntaje = pRaw;
        totalReactivos = datos.tot || 10;
        aciertos = datos.ac || Math.round((pRaw / 100) * totalReactivos);
      }

      const subareasDetalle = es8vo ? {
        sub1_apropiacion: typeof datos.s1 === "number" ? datos.s1 : 4,
        sub2_algoritmos: typeof datos.s2 === "number" ? datos.s2 : 6,
        sub3_robotica: typeof datos.s3 === "number" ? datos.s3 : 2
      } : undefined;

      const payload: PayloadTelemetria = {
        webAppId: datos.wId || datos.webAppId || (es8vo ? "diagnostico_8vo_modulo01_docente_evaluador" : es7mo ? "diagnostico_7mo_modulo01_cyberquest" : "webapp-offline"),
        webAppTitulo: datos.wTitulo || datos.webAppTitulo || (es8vo ? "Evaluación Diagnóstica — 8° Año (PNFT)" : es7mo ? "CyberQuest 7°: Diagnóstico de Fundamentos Digitales" : "Reto Offline Escaneado"),
        docenteId: datos.dId || datos.docenteId || "DOC-OFFLINE",
        estudianteNombre: estNombre,
        seccionOGrupo: seccion,
        nivel: es8vo ? "8°" : (es7mo ? "7°" : (datos.nivel || "8°")),
        puntaje: puntaje,
        puntajeMaximo: es8vo ? 14 : 100,
        porcentaje: porcentaje,
        nivelLogro: calcularNivelLogro(porcentaje),
        tiempoSegundos: datos.seg || datos.t || datos.tiempoSegundos || 45,
        totalReactivos: totalReactivos,
        aciertos: aciertos,
        fallos: Math.max(0, totalReactivos - aciertos),
        subareasDetalle: subareasDetalle,
        timestamp: datos.ts || Date.now(),
        tokenAntiFraude: datos.tok || `TOKEN-${Date.now()}`,
      };

      setUltimoDetectado(payload.estudianteNombre + " - " + payload.porcentaje + "%");
      alDetectarResultado(payload);

      // Reproducir sonido beep local
      if (typeof window !== "undefined" && window.AudioContext) {
        try {
          const ctx = new window.AudioContext();
          const osc = ctx.createOscillator();
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } catch {}
      }
    } catch (e) {
      console.warn("QR no reconocido como resultado válido:", texto);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera size={22} weight="bold" />
            <h3 className="font-extrabold text-base">Escáner de Resultados Offline</h3>
          </div>
          <button
            onClick={() => {
              detenerEscaneo();
              alCerrar();
            }}
            className="p-1 rounded-lg hover:bg-blue-800 text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Visor de Cámara */}
        <div className="p-5 flex flex-col items-center">
          <p className="text-xs text-slate-600 text-center mb-4">
            Apunta la cámara al código QR de la pantalla del estudiante para cargar su puntaje sin necesidad de internet.
          </p>

          <div
            id={scannerContainerId}
            className="w-full max-w-[280px] h-[280px] bg-slate-900 rounded-xl overflow-hidden relative border-2 border-blue-600 flex items-center justify-center text-white"
          >
            {!escaneando && !errorCamara && (
              <span className="text-xs text-slate-400">Iniciando cámara...</span>
            )}
          </div>

          {errorCamara && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-start gap-2">
              <WarningCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong>Error de Cámara:</strong> {errorCamara}
              </div>
            </div>
          )}

          {ultimoDetectado && (
            <div className="mt-4 w-full p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-bold animate-pulse">
              <CheckCircle size={20} weight="fill" className="text-emerald-600" />
              <span>¡Resultado guardado: {ultimoDetectado}!</span>
            </div>
          )}

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-500 block">
              💡 Puedes escanear varios estudiantes consecutivamente sin cerrar esta ventana.
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              detenerEscaneo();
              alCerrar();
            }}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900"
          >
            Finalizar Escaneo
          </button>
        </div>
      </div>
    </div>
  );
}
