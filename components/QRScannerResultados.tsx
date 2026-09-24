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
      const textoLimpio = texto.trim();
      if (!textoLimpio) return;

      let datos: any = {};

      if (textoLimpio.startsWith("{")) {
        try {
          datos = JSON.parse(textoLimpio);
        } catch {
          datos = {};
        }
      } else {
        // Parsear formato texto: "ID: Nombre | Sec: 8-11 | Nota: 6/14 (43%)"
        // o "Nombre | Sec: 8-1 | 80%"
        const matchTxt = textoLimpio.match(/(?:ID|Estudiante|Nombre):\s*([^|\n]+)(?:\|\s*(?:Sec|Secci[oó]n|Grupo):\s*([^|\n]+))?(?:\|\s*(?:Nota|Puntaje|Aciertos):\s*(\d+)(?:\/(\d+))?)?(?:.*\(?(\d+)%\)?)?/i);
        if (matchTxt) {
          const nom = (matchTxt[1] || "").trim();
          const sec = (matchTxt[2] || "").trim();
          const aciertos = matchTxt[3] ? parseInt(matchTxt[3], 10) : undefined;
          const total = matchTxt[4] ? parseInt(matchTxt[4], 10) : undefined;
          const porc = matchTxt[5] ? parseInt(matchTxt[5], 10) : (aciertos !== undefined && total ? Math.round((aciertos / total) * 100) : undefined);
          
          datos = {
            e: nom,
            s: sec,
            p: aciertos,
            porc: porc,
            tot: total,
            n: sec.startsWith("8-") ? "8°" : sec.startsWith("7-") ? "7°" : sec.startsWith("9-") ? "9°" : "8°"
          };
        } else {
          // Fallback básico separado por tuberías '|' o comas
          const partes = textoLimpio.split(/[|,\n]/).map(p => p.trim()).filter(Boolean);
          if (partes.length >= 2) {
            datos = {
              e: partes[0].replace(/^(ID|Estudiante|Nombre):\s*/i, ''),
              s: partes[1].replace(/^(Sec|Sección|Grupo):\s*/i, ''),
              p: partes[2] ? parseInt(partes[2].replace(/[^0-9]/g, ''), 10) : 80
            };
          } else {
            datos = { estudianteNombre: textoLimpio.slice(0, 40), puntaje: 80 };
          }
        }
      }

      const es8vo = datos.n === "8°" || datos.t === "MEP8" || (datos.s && typeof datos.s === "string" && datos.s.startsWith("8-")) || (datos.sec && typeof datos.sec === "string" && datos.sec.startsWith("8-"));
      const es7mo = datos.n === "7°" || datos.t === "MEP7" || datos.tipo === "CYBERQUEST_7MO" || (datos.s && typeof datos.s === "string" && datos.s.startsWith("7-")) || (datos.sec && typeof datos.sec === "string" && datos.sec.startsWith("7-")) || Boolean(datos.c1);
      const es9no = datos.n === "9°" || datos.t === "MEP9" || (datos.s && typeof datos.s === "string" && datos.s.startsWith("9-")) || (datos.sec && typeof datos.sec === "string" && datos.sec.startsWith("9-"));

      let estNombre = datos.est || datos.estudianteNombre || datos.e || datos.nom || datos.nombre;
      if (!estNombre && es7mo && datos.c1) {
        estNombre = datos.c2 && datos.c2 !== "Individual" ? `${datos.c1} & ${datos.c2}` : datos.c1;
      }
      if (!estNombre) {
        estNombre = "Estudiante Escaneado";
      }

      let seccion = datos.grp || datos.seccionOGrupo || datos.s || datos.sec || datos.seccion || (es8vo ? "Sección 8-1" : es7mo ? "Sección 7-1" : es9no ? "Sección 9-1" : "General");
      if (!seccion.startsWith("Sección ") && /^[789]-/i.test(seccion)) {
        seccion = `Sección ${seccion}`;
      }

      let puntaje = 80;
      let porcentaje = 80;
      let totalReactivos = es8vo ? 14 : es9no ? 15 : 10;
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
        const pRaw = typeof datos.pts === "number" ? datos.pts : (typeof datos.p === "number" ? datos.p : (typeof datos.puntaje === "number" ? datos.puntaje : (typeof datos.porcentaje === "number" ? datos.porcentaje : 80)));
        porcentaje = typeof datos.porc === "number" ? datos.porc : pRaw;
        puntaje = pRaw;
        totalReactivos = datos.tot || (es9no ? 15 : 10);
        aciertos = datos.ac !== undefined ? datos.ac : (pRaw <= totalReactivos ? pRaw : Math.round((porcentaje / 100) * totalReactivos));
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
        nivel: es8vo ? "8°" : (es7mo ? "7°" : (es9no ? "9°" : (datos.nivel || "8°"))),
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

      setUltimoDetectado(payload.estudianteNombre + " (" + payload.seccionOGrupo + ") - " + payload.porcentaje + "%");
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
      return true;
    } catch (e) {
      console.warn("QR no reconocido como resultado válido:", texto);
      return false;
    }
  };

  const [tabActual, setTabActual] = useState<"camara" | "manual" | "archivo">("camara");
  const [textoManual, setTextoManual] = useState("");
  const [mensajeManual, setMensajeManual] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);
  const [mensajeArchivo, setMensajeArchivo] = useState<{ tipo: "ok" | "err"; texto: string } | null>(null);

  const procesarManual = () => {
    setMensajeManual(null);
    if (!textoManual.trim()) {
      setMensajeManual({ tipo: "err", texto: "Pega el texto o código del estudiante primero." });
      return;
    }
    const res = procesarQR(textoManual);
    if (res) {
      setMensajeManual({ tipo: "ok", texto: "¡Resultado cargado e integrado al Dashboard con éxito!" });
      setTextoManual("");
    } else {
      setMensajeManual({ tipo: "err", texto: "No se pudo interpretar el formato. Asegúrate de copiar el texto completo generado al final de la prueba." });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setMensajeArchivo(null);
    let exitosos = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          if (!content) return;

          if (file.name.toLowerCase().endsWith(".csv") || (!content.trim().startsWith("{") && content.includes(","))) {
            const clean = content.replace(/^\uFEFF/, "").trim();
            const lines = clean.split(/\r?\n/).filter((l) => l.trim().length > 0);
            if (lines.length >= 2) {
              const parseLine = (line: string) => {
                const res: string[] = [];
                let cur = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                  const c = line[i];
                  if (c === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                      cur += '"';
                      i++;
                    } else {
                      inQuotes = !inQuotes;
                    }
                  } else if ((c === "," || c === ";") && !inQuotes) {
                    res.push(cur.trim());
                    cur = "";
                  } else {
                    cur += c;
                  }
                }
                res.push(cur.trim());
                return res;
              };

              const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
              for (let i = 1; i < lines.length; i++) {
                const vals = parseLine(lines[i]);
                if (vals.length === 0 || (vals.length === 1 && !vals[0])) continue;
                const r: any = {};
                headers.forEach((h, idx) => {
                  r[h] = vals[idx] !== undefined ? vals[idx] : "";
                });
                const nom = r.estudiante || r.estudiante1 || r.nombre || r.nom || "Estudiante CSV";
                const sec = r.seccion || r.sec || r.grupo || "8-1";
                const puntajeRaw = r.puntaje14 || r.puntaje || r.dimcognitiva || r.p || r.aciertos || 6;
                const pVal = parseInt(String(puntajeRaw).replace(/[^0-9]/g, ""), 10) || 6;
                const porcRaw = r.porcentaje || r.promedioglobal || r.porc || 60;
                const porcVal = parseInt(String(porcRaw).replace(/[^0-9]/g, ""), 10) || 60;

                const payload = {
                  n: r.nivel || (sec.startsWith("7-") ? "7°" : sec.startsWith("9-") ? "9°" : "8°"),
                  e: nom,
                  s: sec,
                  p: pVal,
                  porc: porcVal,
                  ts: Date.now(),
                };
                procesarQR(JSON.stringify(payload));
                exitosos++;
              }
            }
          } else {
            const parsed = JSON.parse(content);
            procesarQR(JSON.stringify(parsed));
            exitosos++;
          }

          setMensajeArchivo({
            tipo: "ok",
            texto: `¡${exitosos} registro(s) procesado(s) e integrado(s) al Dashboard con éxito!`,
          });
        } catch (err) {
          console.warn("Error al procesar archivo:", file.name, err);
          setMensajeArchivo({
            tipo: "err",
            texto: `Error al leer ${file.name}. Asegúrate de que sea un JSON o CSV válido.`,
          });
        }
      };
      reader.readAsText(file);
    });
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Cabecera */}
        <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera size={22} weight="bold" />
            <h3 className="font-extrabold text-base">Cargar Resultados Diagnósticos (Offline / QR)</h3>
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

        {/* Pestañas: Cámara vs Pegar Texto vs Archivo USB */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-2">
          <button
            onClick={() => {
              setTabActual("camara");
              setMensajeManual(null);
              setMensajeArchivo(null);
            }}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tabActual === "camara"
                ? "bg-white text-blue-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera size={16} weight="bold" />
            Cámara
          </button>
          <button
            onClick={() => {
              detenerEscaneo();
              setTabActual("manual");
              setMensajeManual(null);
              setMensajeArchivo(null);
            }}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tabActual === "manual"
                ? "bg-white text-blue-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <QrCode size={16} weight="bold" />
            Pegar Texto
          </button>
          <button
            onClick={() => {
              detenerEscaneo();
              setTabActual("archivo");
              setMensajeManual(null);
              setMensajeArchivo(null);
            }}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              tabActual === "archivo"
                ? "bg-white text-blue-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="text-sm">💾</span>
            Ficha .JSON / .CSV
          </button>
        </div>

        {/* Contenido según pestaña */}
        {tabActual === "camara" ? (
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
                  <div className="mt-1">
                    <button
                      onClick={() => setTabActual("manual")}
                      className="underline font-bold text-rose-900"
                    >
                      Usa la pestaña &quot;Pegar Código / Texto&quot; aquí
                    </button>
                  </div>
                </div>
              </div>
            )}

            {ultimoDetectado && (
              <div className="mt-4 w-full p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-bold animate-pulse">
                <CheckCircle size={20} weight="fill" className="text-emerald-600 shrink-0" />
                <span>¡Resultado guardado: {ultimoDetectado}!</span>
              </div>
            )}

            <div className="mt-4 text-center">
              <span className="text-[11px] text-slate-500 block">
                💡 Puedes escanear varios estudiantes consecutivamente sin cerrar esta ventana.
              </span>
            </div>
          </div>
        ) : tabActual === "manual" ? (
          <div className="p-5 flex flex-col gap-3">
            <p className="text-xs text-slate-600">
              Pega aquí el <strong>código JSON</strong> o el <strong>texto de resumen</strong> generado en la pantalla del estudiante al finalizar la prueba offline (ej. <em>&quot;ID: Luis Rodrigues vasquez | Sec: 8-11 | Nota: 6/14 (43%)&quot;</em>):
            </p>

            <textarea
              rows={4}
              value={textoManual}
              onChange={(e) => setTextoManual(e.target.value)}
              placeholder="Pega aquí el texto copiado (ej. ID: Luis Rodrigues vasquez | Sec: 8-11 | Nota: 6/14 (43%) o el JSON)..."
              className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setTextoManual('ID: Luis Rodrigues vasquez | Sec: 8-11 | Nota: 6/14 (43%)')}
                className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300"
              >
                🧪 Pegar Ejemplo
              </button>
              <button
                type="button"
                onClick={procesarManual}
                className="px-4 py-1.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                📥 Procesar e Integrar al Dashboard
              </button>
            </div>

            {mensajeManual && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  mensajeManual.tipo === "ok"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {mensajeManual.tipo === "ok" ? (
                  <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                ) : (
                  <WarningCircle size={18} className="text-rose-600 shrink-0" />
                )}
                <span>{mensajeManual.texto}</span>
              </div>
            )}

            {ultimoDetectado && !mensajeManual && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-bold animate-pulse">
                <CheckCircle size={20} weight="fill" className="text-emerald-600 shrink-0" />
                <span>¡Resultado guardado: {ultimoDetectado}!</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-3">
            <p className="text-xs text-slate-600">
              Carga uno o varios archivos <strong>.JSON</strong> o <strong>.CSV</strong> descargados por tus estudiantes en llaves maya USB:
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50 flex flex-col items-center gap-3">
              <span className="text-3xl">💾</span>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Seleccionar archivos .JSON o .CSV
                </p>
                <p className="text-[11px] text-slate-500">
                  Compatible con descargas individuales de 7.°, 8.° y 9.° Año
                </p>
              </div>

              <input
                type="file"
                id="fileUploadInput"
                accept=".json,.csv,text/csv,application/json"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              <button
                type="button"
                onClick={() => document.getElementById("fileUploadInput")?.click()}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold rounded-xl shadow-sm"
              >
                📁 Explorar Llave Maya USB (.json / .csv)
              </button>
            </div>

            {mensajeArchivo && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  mensajeArchivo.tipo === "ok"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {mensajeArchivo.tipo === "ok" ? (
                  <CheckCircle size={18} weight="fill" className="text-emerald-600 shrink-0" />
                ) : (
                  <WarningCircle size={18} className="text-rose-600 shrink-0" />
                )}
                <span>{mensajeArchivo.texto}</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              detenerEscaneo();
              alCerrar();
            }}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
}
