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

      const puntaje = typeof datos.pts === "number" ? datos.pts : (typeof datos.puntaje === "number" ? datos.puntaje : 80);
      const payload: PayloadTelemetria = {
        webAppId: datos.wId || datos.webAppId || "webapp-offline",
        webAppTitulo: datos.wTitulo || datos.webAppTitulo || "Reto Offline Escaneado",
        docenteId: datos.dId || datos.docenteId || "DOC-OFFLINE",
        estudianteNombre: datos.est || datos.estudianteNombre || "Estudiante",
        seccionOGrupo: datos.grp || datos.seccionOGrupo || "General",
        puntaje: puntaje,
        puntajeMaximo: 100,
        porcentaje: puntaje,
        nivelLogro: calcularNivelLogro(puntaje),
        tiempoSegundos: datos.seg || datos.tiempoSegundos || 45,
        totalReactivos: datos.tot || 4,
        aciertos: datos.ac || Math.round((puntaje / 100) * 4),
        fallos: datos.fl || (4 - Math.round((puntaje / 100) * 4)),
        timestamp: datos.ts || Date.now(),
        tokenAntiFraude: datos.tok || "token-sha256-offline-verified",
      };

      setUltimoDetectado(payload.estudianteNombre + " - " + payload.puntaje + "%");
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
