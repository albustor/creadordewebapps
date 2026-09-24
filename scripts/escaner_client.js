var STORAGE_KEY = "mep_diagnostico_escaner_universal_v2";

var sesionActiva = {
  centro: "Colegio de Secundaria MEP",
  nivel: "9.° año",
  seccion: "9-1",
  estudianteInicial: ""
};

var html5QrCodeInstance = null;
var resultadoPendiente = null;
var procesandoLectura = false;

// Audio Beep Feedback (Web Audio API)
function emitirBeepExito() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}

  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate(150); } catch (e) {}
  }
}

document.addEventListener("DOMContentLoaded", function() {
  actualizarContador();
});

// Control del acordeón de guía
function alternarGuiaInstalacion() {
  var body = document.getElementById("guideContentBody");
  var arrow = document.getElementById("guideArrow");
  if (!body || !arrow) return;

  if (body.style.display === "block") {
    body.style.display = "none";
    arrow.textContent = "▼ Ver Instrucciones";
  } else {
    body.style.display = "block";
    arrow.textContent = "▲ Ocultar Instrucciones";
  }
}

// Control de pestañas del acordeón
function cambiarPestanaGuia(tab) {
  var panes = ["paneIos", "paneAndroid", "paneHuawei", "paneModos"];
  var btns = ["tabBtnIos", "tabBtnAndroid", "tabBtnHuawei", "tabBtnModos"];

  panes.forEach(function(p) {
    var el = document.getElementById(p);
    if (el) el.classList.add("hidden");
  });

  btns.forEach(function(b) {
    var el = document.getElementById(b);
    if (el) el.classList.remove("active");
  });

  if (tab === "ios") {
    var p = document.getElementById("paneIos");
    var b = document.getElementById("tabBtnIos");
    if (p) p.classList.remove("hidden");
    if (b) b.classList.add("active");
  } else if (tab === "android") {
    var p = document.getElementById("paneAndroid");
    var b = document.getElementById("tabBtnAndroid");
    if (p) p.classList.remove("hidden");
    if (b) b.classList.add("active");
  } else if (tab === "huawei") {
    var p = document.getElementById("paneHuawei");
    var b = document.getElementById("tabBtnHuawei");
    if (p) p.classList.remove("hidden");
    if (b) b.classList.add("active");
  } else if (tab === "modos") {
    var p = document.getElementById("paneModos");
    var b = document.getElementById("tabBtnModos");
    if (p) p.classList.remove("hidden");
    if (b) b.classList.add("active");
  }
}

function iniciarSesionDocente() {
  var centro = (document.getElementById("inputCentro").value || "").trim() || "Colegio de Secundaria MEP";
  var nivel = document.getElementById("inputNivel").value || "9.° año";
  var seccion = (document.getElementById("inputSeccion").value || "").trim() || "9-1";
  var estudianteInicial = (document.getElementById("inputEstudianteInicial") ? document.getElementById("inputEstudianteInicial").value : "").trim();

  sesionActiva.centro = centro;
  sesionActiva.nivel = nivel;
  sesionActiva.seccion = seccion;
  sesionActiva.estudianteInicial = estudianteInicial;

  document.getElementById("sessionInfo").innerHTML =
    "<strong>🏫 Centro:</strong> " + escaparHTML(sesionActiva.centro) + "<br>" +
    "<strong>📚 Nivel:</strong> " + escaparHTML(sesionActiva.nivel) + " &nbsp;|&nbsp; <strong>👥 Sección:</strong> " + escaparHTML(sesionActiva.seccion);

  document.getElementById("vistaConfig").classList.add("hidden");
  document.getElementById("vistaSesion").classList.remove("hidden");
  actualizarContador();
}

async function iniciarCamaraUniversal() {
  if (html5QrCodeInstance) return;
  procesandoLectura = false;

  var readerEl = document.getElementById("reader");
  readerEl.classList.remove("hidden");
  document.getElementById("btnActivarCamara").classList.add("hidden");
  document.getElementById("btnDetenerCamara").classList.remove("hidden");

  document.getElementById("mensajeCamara").innerHTML =
    '<div class="alert alert-info">📸 Apunte la cámara hacia el código QR en la pantalla de la computadora del estudiante.</div>';

  try {
    if (typeof Html5Qrcode === "undefined") {
      throw new Error("Librería QR no disponible en este entorno.");
    }

    html5QrCodeInstance = new Html5Qrcode("reader");

    var qrConfig = {
      fps: 15,
      qrbox: function(viewWidth, viewHeight) {
        var edge = Math.min(viewWidth, viewHeight);
        return { width: Math.floor(edge * 0.8), height: Math.floor(edge * 0.8) };
      },
      aspectRatio: 1.0,
      experimentalFeatures: {
        useBarCodeDetectorIfSupported: true
      }
    };

    // Cascada de permisos: 1) facingMode environment -> 2) enumerar cámaras
    try {
      await html5QrCodeInstance.start(
        { facingMode: "environment" },
        qrConfig,
        onQRDetectado,
        function() {}
      );
    } catch (errFacing) {
      console.warn("Fallo con facingMode environment, intentando con lista de cámaras...", errFacing);
      var cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length > 0) {
        var backCam = cameras[cameras.length - 1];
        await html5QrCodeInstance.start(backCam.id, qrConfig, onQRDetectado, function() {});
      } else {
        throw new Error("No se detectaron cámaras en este dispositivo móvil.");
      }
    }
  } catch (error) {
    console.error("Error al activar cámara:", error);
    await detenerCamara();
    document.getElementById("mensajeCamara").innerHTML =
      '<div class="alert alert-error">' +
      '<strong>⚠️ No fue posible activar la cámara continua.</strong><br>' +
      '• Si el navegador bloquea permisos en archivos locales, use el botón <strong>"📸 Tomar foto / Cargar QR"</strong> para usar la cámara nativa del celular.<br>' +
      '• Si tiene internet, abra el enlace HTTPS oficial para acceso automático a la cámara.' +
      '</div>';
  }
}

async function detenerCamara() {
  if (html5QrCodeInstance) {
    try {
      await html5QrCodeInstance.stop();
    } catch (e) {}
    try {
      await html5QrCodeInstance.clear();
    } catch (e) {}
    html5QrCodeInstance = null;
  }
  document.getElementById("reader").classList.add("hidden");
  document.getElementById("btnActivarCamara").classList.remove("hidden");
  document.getElementById("btnDetenerCamara").classList.add("hidden");
}

async function onQRDetectado(textoQR) {
  if (procesandoLectura) return;
  procesandoLectura = true;

  emitirBeepExito();
  await detenerCamara();

  try {
    var datos = interpretarPayloadQR(textoQR);
    resultadoPendiente = datos;
    renderizarResultado(datos);
  } catch (e) {
    procesandoLectura = false;
    document.getElementById("mensajeCamara").innerHTML =
      '<div class="alert alert-error"><strong>⚠️ Código QR leído pero no reconocido:</strong> ' + escaparHTML(e.message) + '</div>';
  }
}

// Fallback 1: Escaneo de foto cargada desde galería o app de cámara nativa
async function procesarArchivoImagen(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;

  document.getElementById("mensajeCamara").innerHTML =
    '<div class="alert alert-info">⌛ Procesando imagen del código QR...</div>';

  try {
    var html5QrCode = new Html5Qrcode("reader");
    var decodedText = await html5QrCode.scanFile(file, true);
    await html5QrCode.clear();
    onQRDetectado(decodedText);
  } catch (err) {
    document.getElementById("mensajeCamara").innerHTML =
      '<div class="alert alert-error"><strong>⚠️ No se detectó un código QR legible en la imagen.</strong> Intente tomar una foto más nítida y centrada.</div>';
  }
}

// Fallback 2: Importación de fichas JSON recopiladas por llave maya USB
async function importarArchivosJSON(e) {
  var files = e.target.files;
  if (!files || files.length === 0) return;

  var importados = 0;
  var registrosActuales = obtenerRegistros();

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    try {
      var text = await file.text();
      var datos = interpretarPayloadQR(text);
      
      var registroNuevo = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        centro: sesionActiva.centro || datos.inst || "Centro Educativo MEP",
        nivel: sesionActiva.nivel || "9.° año",
        seccion: sesionActiva.seccion || datos.seccionQR || "9-1",
        estudiante: datos.estudiante,
        cedula: datos.cedula || "",
        fecha: datos.fecha,
        cognoscitiva: datos.cognoscitiva,
        nivelCognoscitivo: datos.nivelCognoscitivo,
        tarjetas: datos.tarjetas,
        puertos: datos.puertos,
        ejecucion: datos.ejecucion,
        socioafectiva: datos.socioafectiva,
        fortalezas: datos.fortalezas,
        prioridades: datos.prioridades,
        qrOriginal: text,
        timestamp: new Date().toISOString()
      };

      registrosActuales.push(registroNuevo);
      importados++;
    } catch (err) {
      console.warn("Archivo no válido:", file.name, err);
    }
  }

  if (importados > 0) {
    guardarRegistros(registrosActuales);
    actualizarContador();
    alert("✅ Se importaron " + importados + " ficha(s) estudiantil(es) correctamente al padrón.");
    alternarVistaRegistros();
  } else {
    alert("No se pudieron importar registros válidos de los archivos seleccionados.");
  }
}

function interpretarPayloadQR(raw) {
  if (!raw || !raw.trim()) {
    throw new Error("El código QR está vacío.");
  }

  var texto = raw.trim();

  // 1. Si viene en formato JSON estructurado
  if (texto.startsWith("{") && texto.endsWith("}")) {
    try {
      var obj = JSON.parse(texto);
      var porc = obj.porc !== undefined ? obj.porc : (obj.notaCognitiva !== undefined ? obj.notaCognitiva * 10 : (obj.puntaje || 0));
      var niv = obj.nivel || (porc >= 80 ? "Logrado" : (porc >= 60 ? "En Desarrollo" : "Acompañamiento"));
      return {
        estudiante: obj.nom || obj.estudiante || obj.nombre || "Estudiante",
        cedula: obj.cedula || obj.ced || "",
        seccionQR: obj.sec || obj.seccion || sesionActiva.seccion,
        fecha: obj.fec || obj.fecha || new Date().toLocaleDateString("es-CR"),
        cognoscitiva: obj.cog ? (porc + "%") : (obj.cognoscitiva || (porc + "%")),
        nivelCognoscitivo: niv,
        tarjetas: obj.tarjetas || "E-P-S",
        puertos: obj.puertos || "Conectados",
        ejecucion: obj.ejecucion || obj.psicomotora || "Autónomo",
        socioafectiva: obj.socioafectiva || "5 actitudes computacionales",
        fortalezas: obj.fortalezas || "Pensamiento computacional y lógica",
        prioridades: obj.prioridades || "Estructuras algorítmicas y circuitos",
        textoOriginal: raw
      };
    } catch (e) {}
  }

  // 2. Parseo por líneas de texto plano
  var lineas = texto.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);

  var datos = {
    estudiante: lineas[0] || (sesionActiva.estudianteInicial || "Estudiante"),
    cedula: "",
    seccionQR: lineas[1] || sesionActiva.seccion,
    fecha: lineas[2] || new Date().toLocaleDateString("es-CR"),
    cognoscitiva: "80%",
    nivelCognoscitivo: "Logrado",
    tarjetas: "E-P-S",
    puertos: "Conectados",
    ejecucion: "Autónomo",
    socioafectiva: "5 actitudes computacionales",
    fortalezas: "Pensamiento computacional y lógica",
    prioridades: "Estructuras algorítmicas",
    textoOriginal: raw
  };

  for (var i = 0; i < lineas.length; i++) {
    var l = lineas[i];
    var upper = l.toUpperCase();
    if (upper.startsWith("COGNOSCITIVA:")) datos.cognoscitiva = l.substring(13).trim();
    else if (upper.startsWith("NIVEL:")) datos.nivelCognoscitivo = l.substring(6).trim();
    else if (upper.startsWith("TARJETAS:")) datos.tarjetas = l.substring(9).trim();
    else if (upper.startsWith("PUERTOS:")) datos.puertos = l.substring(8).trim();
    else if (upper.startsWith("EJECUCIÓN:") || upper.startsWith("EJECUCION:")) datos.ejecucion = l.substring(10).trim();
    else if (l.toLowerCase().includes("actitudes") || l.toLowerCase().includes("indicadores favorables")) datos.socioafectiva = l;
    else if (upper === "FORTALEZAS:" && lineas[i + 1]) datos.fortalezas = lineas[i + 1];
    else if (upper === "PRIORIDADES:" && lineas[i + 1]) datos.prioridades = lineas[i + 1];
  }

  return datos;
}

function renderizarResultado(datos) {
  document.getElementById("contenidoResultado").innerHTML =
    '<div class="result-grid">' +
    '  <div class="result-item">' +
    '    <strong>Nombre del Estudiante:</strong>' +
    '    <input id="editEstudiante" type="text" value="' + escaparHTML(datos.estudiante) + '">' +
    '  </div>' +
    '  <div class="result-item">' +
    '    <strong>Sección:</strong>' +
    '    <input id="editSeccion" type="text" value="' + escaparHTML(datos.seccionQR || sesionActiva.seccion) + '">' +
    '  </div>' +
    '  <div class="result-item">' +
    '    <strong>Dimensión Cognoscitiva:</strong>' +
    '    <span>' + escaparHTML(datos.cognoscitiva || "80%") + ' (' + escaparHTML(datos.nivelCognoscitivo || "Logrado") + ')</span>' +
    '  </div>' +
    '  <div class="result-item">' +
    '    <strong>Dimensión Psicomotora:</strong>' +
    '    <span>' + escaparHTML(datos.ejecucion || datos.tarjetas || "Completado") + '</span>' +
    '  </div>' +
    '  <div class="result-item result-wide">' +
    '    <strong>Dimensión Socioafectiva:</strong>' +
    '    <span>' + escaparHTML(datos.socioafectiva || "Favorable") + '</span>' +
    '  </div>' +
    (datos.fortalezas ? (
      '  <div class="result-item result-wide">' +
      '    <strong>Fortalezas Observadas:</strong>' +
      '    <span>' + escaparHTML(datos.fortalezas) + '</span>' +
      '  </div>'
    ) : '') +
    '</div>';

  document.getElementById("vistaSesion").classList.add("hidden");
  document.getElementById("vistaResultado").classList.remove("hidden");
}

function guardarRegistroActual() {
  if (!resultadoPendiente) return;

  var nombreEditado = document.getElementById("editEstudiante") ? document.getElementById("editEstudiante").value.trim() : resultadoPendiente.estudiante;
  var seccionEditada = document.getElementById("editSeccion") ? document.getElementById("editSeccion").value.trim() : resultadoPendiente.seccionQR;

  var registros = obtenerRegistros();

  var registroNuevo = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    centro: sesionActiva.centro,
    nivel: sesionActiva.nivel,
    seccion: seccionEditada || sesionActiva.seccion,
    estudiante: nombreEditado || resultadoPendiente.estudiante,
    cedula: resultadoPendiente.cedula || "",
    fecha: resultadoPendiente.fecha,
    cognoscitiva: resultadoPendiente.cognoscitiva,
    nivelCognoscitivo: resultadoPendiente.nivelCognoscitivo,
    tarjetas: resultadoPendiente.tarjetas,
    puertos: resultadoPendiente.puertos,
    ejecucion: resultadoPendiente.ejecucion,
    socioafectiva: resultadoPendiente.socioafectiva,
    fortalezas: resultadoPendiente.fortalezas,
    prioridades: resultadoPendiente.prioridades,
    qrOriginal: resultadoPendiente.textoOriginal,
    timestamp: new Date().toISOString()
  };

  registros.push(registroNuevo);
  guardarRegistros(registros);

  resultadoPendiente = null;
  procesandoLectura = false;

  document.getElementById("vistaResultado").classList.add("hidden");
  document.getElementById("vistaSesion").classList.remove("hidden");
  actualizarContador();

  document.getElementById("mensajeCamara").innerHTML =
    '<div class="alert alert-success">' +
    '  ✅ Registro de <strong>' + escaparHTML(registroNuevo.estudiante) + '</strong> (' + escaparHTML(registroNuevo.seccion) + ') guardado con éxito.' +
    '</div>';
}

function descartarYReanudar() {
  resultadoPendiente = null;
  procesandoLectura = false;
  document.getElementById("vistaResultado").classList.add("hidden");
  document.getElementById("vistaSesion").classList.remove("hidden");
}

function obtenerRegistros() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function guardarRegistros(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    alert("Error al guardar en el almacenamiento local.");
  }
}

function actualizarContador() {
  var count = obtenerRegistros().length;
  var el = document.getElementById("contadorEstudiantes");
  if (el) el.textContent = "Estudiantes Registrados: " + count;
}

function alternarVistaRegistros() {
  var vReg = document.getElementById("vistaRegistros");
  var vSes = document.getElementById("vistaSesion");

  if (vReg.classList.contains("hidden")) {
    detenerCamara();
    vSes.classList.add("hidden");
    vReg.classList.remove("hidden");
    renderizarListaPadron();
  } else {
    vReg.classList.add("hidden");
    vSes.classList.remove("hidden");
  }
}

function renderizarListaPadron() {
  var registros = obtenerRegistros().slice().reverse();
  var cont = document.getElementById("listaRegistros");

  if (registros.length === 0) {
    cont.innerHTML = '<div class="alert alert-info">No hay estudiantes registrados aún en este dispositivo.</div>';
    return;
  }

  var html = "";
  registros.forEach(function(r) {
    html +=
      '<div class="record-card">' +
      '  <div class="record-header">' +
      '    <span class="record-name">' + escaparHTML(r.estudiante) + '</span>' +
      '    <span class="record-badge">' + escaparHTML(r.nivel || "9.°") + ' • ' + escaparHTML(r.seccion) + '</span>' +
      '  </div>' +
      '  <div class="record-details">' +
      '    <strong>🏫 Centro:</strong> ' + escaparHTML(r.centro) + '<br>' +
      '    <strong>🧠 Cognitivo:</strong> ' + escaparHTML(r.cognoscitiva || "Completado") + ' (' + escaparHTML(r.nivelCognoscitivo || "Logrado") + ')<br>' +
      '    <strong>⚙️ Psicomotor:</strong> ' + escaparHTML(r.ejecucion || r.tarjetas || "Completado") + '<br>' +
      '    <strong>📅 Fecha:</strong> ' + escaparHTML(r.fecha) +
      '  </div>' +
      '  <button type="button" class="btn-secondary" data-id="' + r.id + '" onclick="eliminarRegistroIndividual(this.getAttribute(\'data-id\'))" style="margin-top: 8px; color: #dc2626; height: 32px; font-size: 11px;">' +
      '    🗑️ Eliminar' +
      '  </button>' +
      '</div>';
  });

  cont.innerHTML = html;
}

function eliminarRegistroIndividual(id) {
  if (!confirm("¿Desea eliminar el registro de este estudiante?")) return;
  var list = obtenerRegistros().filter(function(r) { return r.id !== id; });
  guardarRegistros(list);
  actualizarContador();
  renderizarListaPadron();
}

function eliminarTodosRegistros() {
  if (!confirm("⚠️ ¿Está seguro de eliminar TODOS los registros del padrón?")) return;
  localStorage.removeItem(STORAGE_KEY);
  actualizarContador();
  renderizarListaPadron();
}

function exportarCSV() {
  var registros = obtenerRegistros();
  if (registros.length === 0) {
    alert("No hay registros para exportar. Escanee o ingrese estudiantes primero.");
    return;
  }

  var encabezados = [
    "Centro Educativo", "Nivel", "Sección", "Estudiante", "Cédula", "Fecha",
    "Cognoscitiva", "Nivel Cognoscitivo", "Tarjetas", "Puertos", "Ejecución", "Socioafectiva", "Fortalezas", "Prioridades"
  ];

  var lineas = [];
  lineas.push(encabezados.map(function(c) { return '"' + csvEscapar(c) + '"'; }).join(";"));

  registros.forEach(function(r) {
    var fila = [
      r.centro, r.nivel, r.seccion, r.estudiante, r.cedula || "", r.fecha,
      r.cognoscitiva, r.nivelCognoscitivo, r.tarjetas, r.puertos, r.ejecucion, r.socioafectiva, r.fortalezas, r.prioridades
    ];
    lineas.push(fila.map(function(c) { return '"' + csvEscapar(c) + '"'; }).join(";"));
  });

  var csv = "\uFEFF" + lineas.join("\r\n");
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "padron_diagnostico_FT_" + (sesionActiva.seccion || "grupo") + "_" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportarJSON() {
  var registros = obtenerRegistros();
  if (registros.length === 0) {
    alert("No hay registros para exportar. Escanee o ingrese estudiantes primero.");
    return;
  }

  var jsonStr = JSON.stringify(registros, null, 2);
  var blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "padron_diagnostico_FT_" + (sesionActiva.seccion || "grupo") + "_" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copiarResumenPortapapeles() {
  var registros = obtenerRegistros();
  if (registros.length === 0) {
    alert("No hay registros para copiar.");
    return;
  }

  var lineas = [];
  lineas.push("📊 PADRÓN DIAGNÓSTICO MEP");
  lineas.push("🏫 Centro: " + sesionActiva.centro);
  lineas.push("📚 Nivel: " + sesionActiva.nivel + " | Sección: " + sesionActiva.seccion);
  lineas.push("👥 Total Estudiantes: " + registros.length);
  lineas.push("");

  registros.forEach(function(r, idx) {
    lineas.push((idx + 1) + ". " + r.estudiante + " (" + r.seccion + ") - " + r.cognoscitiva + " [" + r.nivelCognoscitivo + "]");
  });

  var texto = lineas.join("\n");

  navigator.clipboard.writeText(texto).then(function() {
    alert("✅ Resumen copiado al portapapeles listo para WhatsApp o correo.");
  }).catch(function() {
    alert("No se pudo copiar automáticamente. Por favor use la descarga en CSV o JSON.");
  });
}

function csvEscapar(val) {
  if (val === null || val === undefined) return "";
  return String(val).replace(/"/g, '""').replace(/\r?\n/g, " ");
}

function escaparHTML(val) {
  if (val === null || val === undefined) return "";
  return String(val).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function finalizarSesion() {
  detenerCamara();
  document.getElementById("vistaSesion").classList.add("hidden");
  document.getElementById("vistaResultado").classList.add("hidden");
  document.getElementById("vistaRegistros").classList.add("hidden");
  document.getElementById("vistaConfig").classList.remove("hidden");
}
