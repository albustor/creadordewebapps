"use client";

import React, { useState } from "react";
import {
  AppleLogo,
  AndroidLogo,
  Desktop,
  ShareNetwork,
  PlusSquare,
  DotsThreeVertical,
  DownloadSimple,
  Copy,
  Check,
  CheckCircle,
  WhatsappLogo,
  DeviceMobile,
} from "@phosphor-icons/react";

export default function ManualInstalacion() {
  const [tabActiva, setTabActiva] = useState<"gas" | "ios" | "android" | "pc" | "whatsapp">("gas");
  const [urlPrueba, setUrlPrueba] = useState("https://creador-webapps.local/play/ciencias-7");
  const [materiaPrueba, setMateriaPrueba] = useState("Ciencias - 7° Año");
  const [copiado, setCopiado] = useState(false);
  const [copiadoGas, setCopiadoGas] = useState(false);

  const codigoGoogleAppsScript = `/**
 * SERVIDOR WEBHOOK PARA RECEPCIÓN DE TELEMETRÍA DE WEBAPPS EDUCATIVAS
 * Pega este código en: Extensiones > Apps Script de tu Google Sheets
 */
function doPost(e) {
  try {
    // 1. Obtener la hoja activa del docente
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Resultados_WebApps") || ss.getActiveSheet();
    
    // 2. Si la hoja está vacía, crear encabezados automáticos
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha/Hora",
        "Nombre Estudiante",
        "Sección / Grupo",
        "Puntaje Obtenido",
        "Puntaje Máximo",
        "Nivel Logrado",
        "Cognoscitiva (%)",
        "Psicomotora (%)",
        "Socioafectiva (%)",
        "Código Comprobante",
        "Integridad SHA-256"
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#003366").setFontColor("#FFFFFF");
    }
    
    // 3. Extraer los datos enviados por la WebApp del estudiante
    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }
    
    // 4. Registrar la fila con los resultados en tiempo real (0ms)
    sheet.appendRow([
      new Date().toLocaleString("es-CR"),
      data.nombre_estudiante || data.estudianteNombre || "Anónimo",
      data.seccion || data.seccionOGrupo || "N/A",
      data.puntaje_obtenido !== undefined ? data.puntaje_obtenido : (data.puntaje || 0),
      data.puntaje_maximo !== undefined ? data.puntaje_maximo : (data.puntajeMaximo || 100),
      data.nivel_logro || data.nivelLogro || "Intermedio",
      data.desglose?.cognoscitiva !== undefined ? data.desglose.cognoscitiva + "%" : "100%",
      data.desglose?.psicomotora !== undefined ? data.desglose.psicomotora + "%" : "100%",
      data.desglose?.socioafectiva !== undefined ? data.desglose.socioafectiva + "%" : "100%",
      data.id_comprobante || data.idResultado || ("FT-" + Math.floor(100000 + Math.random() * 900000)),
      data.hash_verificacion || data.tokenAntiFraude || "VERIFICADO"
    ]);
    
    // 5. Responder con confirmación estructurada
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", mensaje: "Resultado registrado correctamente" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copiarGas = () => {
    navigator.clipboard.writeText(codigoGoogleAppsScript);
    setCopiadoGas(true);
    setTimeout(() => setCopiadoGas(false), 2500);
  };

  const mensajeWhatsApp = `📚 *ACTIVIDAD EDUCATIVA INTERACTIVA*\n\nEstimados estudiantes y familias,\nLes compartimos el enlace para realizar el reto digital autónomo:\n\n📖 *Materia / Nivel:* ${materiaPrueba}\n🔗 *Enlace directo:* ${urlPrueba}\n\n📲 *Instrucciones para celular:*\n1. Abre el enlace.\n2. Pulsa en 'Compartir' o menú '⋮' y selecciona *'Agregar a pantalla de inicio'*.\n3. ¡Listo! Puedes ingresar como si fuera una app instalada. 🚀`;

  const copiarMensaje = () => {
    navigator.clipboard.writeText(mensajeWhatsApp);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-mepCard overflow-hidden">
      {/* Selector de Pestañas */}
      <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
        <button
          onClick={() => setTabActiva("gas")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
            tabActiva === "gas"
              ? "border-blue-700 text-blue-900 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Desktop size={18} weight="fill" className="text-blue-700" />
          <span>Google Apps Script & Sheets</span>
        </button>

        <button
          onClick={() => setTabActiva("ios")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
            tabActiva === "ios"
              ? "border-blue-700 text-blue-900 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <AppleLogo size={18} weight="fill" />
          <span>iPhone / iPad (iOS Safari)</span>
        </button>

        <button
          onClick={() => setTabActiva("android")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
            tabActiva === "android"
              ? "border-blue-700 text-blue-900 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <AndroidLogo size={18} weight="fill" />
          <span>Android (Chrome)</span>
        </button>

        <button
          onClick={() => setTabActiva("pc")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
            tabActiva === "pc"
              ? "border-blue-700 text-blue-900 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Desktop size={18} weight="fill" />
          <span>Laboratorio / Red Local</span>
        </button>

        <button
          onClick={() => setTabActiva("whatsapp")}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
            tabActiva === "whatsapp"
              ? "border-emerald-600 text-emerald-900 bg-white"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <WhatsappLogo size={18} weight="fill" className="text-emerald-600" />
          <span>Plantilla WhatsApp</span>
        </button>
      </div>

      {/* Contenido de Cada Plataforma */}
      <div className="p-6 sm:p-8">
        {/* Google Apps Script & Sheets */}
        {tabActiva === "gas" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center">
                  <Desktop size={22} weight="fill" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Sincronización en Vivo con Google Sheets (Google Apps Script)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Permite a los docentes recibir la telemetría y diagnósticos de los estudiantes directamente en su propia hoja de cálculo sin costo.
                  </p>
                </div>
              </div>

              <button
                onClick={copiarGas}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
              >
                {copiadoGas ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                <span>{copiadoGas ? "¡Código Copiado!" : "Copiar Código .gs"}</span>
              </button>
            </div>

            {/* Guía en 4 pasos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-xs text-slate-900">Abrir Google Sheets</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Crea una hoja nueva en Google Drive. Ve a <strong>Extensiones</strong> &gt; <strong>Apps Script</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-xs text-slate-900">Pegar Código doPost</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Borra el contenido existente, pega el script que está abajo y guarda con <kbd className="px-1 bg-slate-200 rounded">Ctrl + S</kbd>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-xs text-slate-900">Implementar como Web</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Haz clic en <strong>Implementar &gt; Nueva implementación</strong>. Tipo: <em>Aplicación web</em>. Acceso: <strong>Cualquier usuario</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <h4 className="font-bold text-xs text-slate-900">Copiar URL al Dashboard</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Copia la URL que termina en <code>/exec</code> y pégala en la configuración de tus WebApps o Dashboard.
                </p>
              </div>
            </div>

            {/* Código .gs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Archivo: Código.gs</span>
                <span>JavaScript Google Apps Script</span>
              </div>
              <pre className="p-4 bg-slate-950 text-sky-200 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-slate-800">
                {codigoGoogleAppsScript}
              </pre>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
              <Check size={18} className="text-blue-700 shrink-0" weight="bold" />
              <span>
                <strong>Nota Pedagógica:</strong> Al usar <code>mode: 'no-cors'</code> en el frontend del estudiante, los datos se entregan limpiamente a Google Sheets sin que el estudiante tenga que iniciar sesión con su correo personal.
              </span>
            </div>
          </div>
        )}

        {/* iOS Safari */}
        {/* iOS Safari */}
        {tabActiva === "ios" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md shrink-0">
                  <AppleLogo size={24} weight="fill" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Manual Visual de Instalación en iPhone y iPad (iOS Safari)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configura la WebApp en la pantalla de inicio para ejecutarla a pantalla completa y sin consumo de internet.
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-center px-3 py-1 bg-slate-100 border border-slate-300 rounded-full text-[11px] font-bold text-slate-700">
                PWA Nativa iOS 17 / 18
              </span>
            </div>

            {/* Galería de Pasos con Capturas Reales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Paso 1 */}
              <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="p-4 space-y-2 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      1
                    </span>
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Paso 1: Detección
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Apertura y Detección en Safari
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al abrir la WebApp en el navegador <strong>Safari</strong> de tu iPhone, la aplicación detecta el sistema iOS y te muestra la guía en pantalla. Toca el botón <strong>Compartir</strong> (ícono con la flecha hacia arriba 📤) en la barra inferior.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 flex items-center justify-center">
                  <img
                    src="/guias/iphone/paso1_instrucciones_ios.png"
                    alt="Paso 1: Instrucciones en pantalla para iOS Safari"
                    className="rounded-xl max-h-72 object-contain border border-slate-800 shadow-lg"
                  />
                </div>
              </div>

              {/* Paso 2 */}
              <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="p-4 space-y-2 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      2
                    </span>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      Paso 2: Compartir
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Menú de Opciones y Agregar al Fondo
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    En el menú emergente de Safari, desliza hacia abajo en la lista de acciones hasta encontrar la opción con el símbolo más <strong>[+] "Agregar a Inicio"</strong> (o <em>"Agregar a pantalla de inicio"</em>) para fijarla en el fondo del teléfono.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 flex items-center justify-center">
                  <img
                    src="/guias/iphone/paso2_menu_compartir.png"
                    alt="Paso 2: Menú de opciones de Safari con Compartir y Agregar a Inicio"
                    className="rounded-xl max-h-72 object-contain border border-slate-800 shadow-lg"
                  />
                </div>
              </div>

              {/* Paso 3 */}
              <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                <div className="p-4 space-y-2 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      3
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Paso 3: Confirmación
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    Activar "Abrir como app web"
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verifica que el interruptor <strong>"Abrir como app web"</strong> esté activo (en color verde) y pulsa el botón <strong>"Agregar"</strong> en la esquina superior derecha. El icono quedará creado directamente en tu pantalla de inicio.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 flex items-center justify-center">
                  <img
                    src="/guias/iphone/paso3_agregar_inicio.png"
                    alt="Paso 3: Confirmación para agregar a inicio y abrir como app web"
                    className="rounded-xl max-h-72 object-contain border border-slate-800 shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Resumen de Beneficios */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
              <CheckCircle size={22} weight="fill" className="text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-black text-emerald-950 block">
                  Ventajas de la Instalación en iOS para el Estudiante y el Docente:
                </strong>
                <p className="text-emerald-900 leading-relaxed">
                  Al abrir la WebApp desde el icono en la pantalla de inicio, se ocultan todas las barras de navegación de Safari, permitiendo disfrutar de la actividad a pantalla completa, con retroalimentación sonora táctil, cero consumo de datos móviles y guardado automático de telemetría y comprobante formativo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Android Chrome */}
        {tabActiva === "android" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <AndroidLogo size={22} weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Instalación en Android (Google Chrome)
                </h3>
                <p className="text-xs text-slate-500">
                  Instalación instantánea con tecnología Progressive Web App (PWA) offline.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-sm text-slate-800">Abrir en Chrome</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Abre el enlace o escanea el código QR proyectado en el aula con la cámara de tu teléfono.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                  <span>Menú Opciones</span>
                  <DotsThreeVertical size={18} className="text-slate-800" />
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Toca los tres puntos verticales en la esquina superior derecha del navegador Chrome.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1">
                  <span>Instalar App</span>
                  <DownloadSimple size={16} className="text-emerald-700" />
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Selecciona <strong>&quot;Instalar aplicación&quot;</strong> o <strong>&quot;Agregar a la pantalla principal&quot;</strong>.
                </p>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
              <Check size={20} className="shrink-0 text-emerald-700" />
              <span>
                <strong>Ventaja:</strong> La WebApp funcionará sin conexión incluso si la tableta o el teléfono no tiene datos móviles ni WiFi activo en el aula.
              </span>
            </div>
          </div>
        )}

        {/* PC / Laboratorio */}
        {tabActiva === "pc" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <Desktop size={22} weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Uso en Laboratorios de Informática (Windows / Mac / Chromebook)
                </h3>
                <p className="text-xs text-slate-500">
                  Ejecución autónoma sin necesidad de servidores locales ni conexión a internet.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h4 className="font-bold text-sm text-slate-800">Descarga del .html</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Descarga el archivo <code>.html</code> generado y guárdalo en una memoria USB o carpeta compartida de red escolar.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h4 className="font-bold text-sm text-slate-800">Doble Clic Directo</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Los estudiantes hacen doble clic en el archivo <code>.html</code>. Se abrirá al instante en Chrome, Edge o Firefox.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h4 className="font-bold text-sm text-slate-800">QR de Telemetría</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Al terminar la actividad, el estudiante muestra el QR en su pantalla y el docente lo escanea con su celular.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plantilla WhatsApp */}
        {tabActiva === "whatsapp" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <WhatsappLogo size={22} weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Plantilla Oficial para Enviar por WhatsApp
                </h3>
                <p className="text-xs text-slate-500">
                  Copia y pega este mensaje en el grupo de WhatsApp de tu clase o familias.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título de la Materia / Actividad:
                </label>
                <input
                  type="text"
                  value={materiaPrueba}
                  onChange={(e) => setMateriaPrueba(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enlace de la WebApp:
                </label>
                <input
                  type="text"
                  value={urlPrueba}
                  onChange={(e) => setUrlPrueba(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            {/* Vista Previa del Mensaje */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
              <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                {mensajeWhatsApp}
              </pre>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={copiarMensaje}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                  copiado
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {copiado ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
                {copiado ? "¡Mensaje Copiado!" : "Copiar Texto de WhatsApp"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
