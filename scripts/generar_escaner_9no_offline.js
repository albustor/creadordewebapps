import fs from "fs";
import path from "path";

const VENDOR_PATH = path.join(process.cwd(), "public", "vendor", "html5-qrcode.min.js");
const OUTPUT_WEBAPPS = path.join(process.cwd(), "public", "webapps", "diagnostico_9no_escaner_datos_locales.html");
const OUTPUT_PUBLIC = path.join(process.cwd(), "public", "diagnostico_9no_escaner_datos_locales.html");

const html5QrcodeSource = fs.existsSync(VENDOR_PATH)
  ? fs.readFileSync(VENDOR_PATH, "utf8")
  : "";

const headPart = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Escáner 9° FT">
<meta name="theme-color" content="#002b49">
<title>Escáner de Datos Locales 9.° Año — Formación Tecnológica MEP</title>

<!-- LIBRERÍA QR EMBEBIDA 100% OFFLINE (CERO DEPENDENCIAS EXTERNAS) -->
<script>
`;

const bodyPart = `
</script>

<style>
:root {
  --mep-azul: #002b49;
  --mep-azul-card: #0f3d63;
  --mep-verde: #059669;
  --mep-verde-dark: #047857;
  --mep-verde-light: #ecfdf5;
  --mep-amber: #d97706;
  --mep-amber-light: #fef3c7;
  --mep-rojo: #dc2626;
  --mep-rojo-light: #fee2e2;
  --mep-bg: #f8fafc;
  --mep-card: #ffffff;
  --mep-texto: #0f172a;
  --mep-subtexto: #475569;
  --mep-borde: #cbd5e1;
  --mep-borde-focus: #0284c7;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--mep-bg);
  color: var(--mep-texto);
  line-height: 1.5;
  min-height: 100vh;
  padding-bottom: 50px;
}

header {
  background: linear-gradient(135deg, var(--mep-azul) 0%, var(--mep-azul-card) 100%);
  color: white;
  padding: 20px 16px 18px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.badge-header {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #f1f5f9;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 12px;
  border-radius: 9999px;
  margin-bottom: 8px;
}

header h1 {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
}

header p {
  font-size: 12px;
  color: #cbd5e1;
  font-weight: 500;
}

.container {
  max-width: 700px;
  margin: 16px auto;
  padding: 0 14px;
}

.card {
  background: var(--mep-card);
  border: 1px solid var(--mep-borde);
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card h2 {
  font-size: 17px;
  font-weight: 900;
  color: var(--mep-azul);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: var(--mep-texto);
  margin-top: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

input, select {
  width: 100%;
  height: 46px;
  padding: 10px 14px;
  border: 1.5px solid var(--mep-borde);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  background: #ffffff;
  color: var(--mep-texto);
  transition: all 0.2s;
}

input:focus, select:focus {
  outline: none;
  border-color: var(--mep-borde-focus);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

button {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s ease;
}

button:active {
  transform: scale(0.98);
}

.btn-primary { background: #0284c7; color: #ffffff; }
.btn-primary:hover { background: #0369a1; }
.btn-emerald { background: var(--mep-verde); color: #ffffff; }
.btn-emerald:hover { background: var(--mep-verde-dark); }
.btn-indigo { background: #4f46e5; color: #ffffff; }
.btn-indigo:hover { background: #4338ca; }
.btn-danger { background: var(--mep-rojo); color: #ffffff; }
.btn-secondary { background: #f1f5f9; color: var(--mep-texto); border: 1px solid #cbd5e1; }
.btn-secondary:hover { background: #e2e8f0; }

.session-box {
  background: #f0f9ff;
  border-left: 4px solid #0284c7;
  border-radius: 12px;
  padding: 14px;
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.counter-badge {
  text-align: center;
  font-size: 16px;
  font-weight: 900;
  color: var(--mep-azul);
  padding: 10px;
  background: #f8fafc;
  border: 1px dashed var(--mep-borde);
  border-radius: 12px;
  margin-bottom: 14px;
}

#reader {
  width: 100%;
  max-width: 460px;
  margin: 14px auto;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid var(--mep-azul);
  background: #000000;
}

#reader video {
  width: 100% !important;
  height: auto !important;
  border-radius: 14px;
}

.alert {
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.5;
  margin-top: 10px;
}
.alert-info { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
.alert-success { background: var(--mep-verde-light); color: #065f46; border: 1px solid #a7f3d0; }
.alert-error { background: var(--mep-rojo-light); color: #991b1b; border: 1px solid #fecaca; }

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 16px;
}

.result-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 12px;
}

.result-item strong {
  display: block;
  font-size: 10.5px;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 3px;
  letter-spacing: 0.3px;
}

.result-item span {
  font-size: 13px;
  font-weight: 700;
  color: var(--mep-texto);
}

.result-wide { grid-column: 1 / -1; }

.record-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.record-name {
  font-size: 14px;
  font-weight: 900;
  color: var(--mep-azul);
}

.record-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
}

.record-details {
  font-size: 12px;
  color: var(--mep-subtexto);
  line-height: 1.6;
}

.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.hidden { display: none !important; }

.file-upload-wrapper {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.file-upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
  color: #0284c7;
  padding: 8px 10px;
  background: #f0f9ff;
  border: 1px dashed #0284c7;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

/* Guía de instalación plegable interactiva */
.guide-box {
  background: #ffffff;
  border: 2px solid #cbd5e1;
  border-radius: 18px;
  margin-top: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  overflow: hidden;
  transition: all 0.2s ease;
}
.guide-box:hover {
  border-color: #94a3b8;
}
.guide-header {
  font-weight: 900;
  color: var(--mep-azul);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: #f8fafc;
  user-select: none;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
}
.guide-header:hover {
  background: #f1f5f9;
}
.guide-content {
  padding: 16px;
  line-height: 1.6;
  color: #1e293b;
  background: #ffffff;
}
.guide-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
  margin-bottom: 16px;
}
.guide-tab-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 11.5px;
  font-weight: 800;
  color: #475569;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  height: auto;
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.guide-tab-btn.active {
  background: #002b49;
  color: #ffffff;
  border-color: #002b49;
  box-shadow: 0 2px 6px rgba(0,43,73,0.25);
}
.guide-step-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  margin-top: 12px;
}
.guide-step-card {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-col;
  flex-direction: column;
  justify-content: space-between;
}
.guide-step-header {
  padding: 12px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}
.guide-step-header h4 {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 4px;
}
.guide-step-header p {
  font-size: 11.5px;
  color: #475569;
  margin-top: 4px;
  line-height: 1.5;
}
.guide-step-img-wrap {
  padding: 10px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
}
.guide-img {
  max-width: 100%;
  max-height: 220px;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.guide-note-box {
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 11.5px;
  color: #065f46;
  margin-top: 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.5;
}
.step-pill {
  display: inline-block;
  background: #0284c7;
  color: #fff;
  font-weight: 800;
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 6px;
  margin-bottom: 4px;
}
</style>
</head>
<body>

<header>
  <span class="badge-header">MEP • III Ciclo 2027</span>
  <h1>Escáner de Datos Locales 9.° Año</h1>
  <p>Captura de resultados QR sin conexión para computadoras de aula</p>
</header>

<div class="container">

  <!-- GUÍA DE INSTALACIÓN RÁPIDA EN IPHONE / ANDROID / HUAWEI (RECURSOS PNFT) -->
  <div class="guide-box">
    <div class="guide-header" onclick="alternarGuiaInstalacion()">
      <span>📲 ¿Cómo usar e instalar en iPhone / Android? (En línea y Sin conexión)</span>
      <span id="guideArrow">▼</span>
    </div>
    <div id="guideContent" class="guide-content">
      <!-- Selector de Pestañas de SO -->
      <div class="guide-tabs">
        <button id="tabBtnIos" class="guide-tab-btn active" onclick="cambiarPestanaGuia('ios')">
          <span>🍎 iPhone / iPad (iOS Safari)</span>
        </button>
        <button id="tabBtnAndroid" class="guide-tab-btn" onclick="cambiarPestanaGuia('android')">
          <span>🤖 Android (Chrome)</span>
        </button>
        <button id="tabBtnHuawei" class="guide-tab-btn" onclick="cambiarPestanaGuia('huawei')">
          <span>📱 Huawei / HarmonyOS</span>
        </button>
        <button id="tabBtnModos" class="guide-tab-btn" onclick="cambiarPestanaGuia('modos')">
          <span>⚡ En Línea vs Desconectado</span>
        </button>
      </div>

      <!-- Pestaña 1: iOS Safari -->
      <div id="guiaIos" class="guide-pane">
        <div style="margin-bottom: 10px;">
          <h3 style="font-size: 14px; font-weight: 900; color: #002b49;">
            Manual Visual de Instalación en iPhone y iPad (iOS Safari)
          </h3>
          <p style="font-size: 12px; color: #475569;">
            Configura el Escáner en la pantalla de inicio para ejecutarlo a pantalla completa y sin consumo de internet.
          </p>
        </div>

        <div class="guide-step-grid">
          <!-- Paso 1 -->
          <div class="guide-step-card">
            <div class="guide-step-header">
              <span class="step-pill" style="background:#0284c7;">Paso 1: Detección</span>
              <h4>Apertura y Detección en Safari</h4>
              <p>
                Al abrir el enlace en <strong>Safari</strong> de tu iPhone, toca el botón <strong>Compartir (📤 flecha hacia arriba)</strong> en la barra inferior.
              </p>
            </div>
            <div class="guide-step-img-wrap">
              <img src="/guias/iphone/paso1_instrucciones_ios.png" alt="Paso 1 iOS Safari" class="guide-img" onerror="this.style.display='none'">
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="guide-step-card">
            <div class="guide-step-header">
              <span class="step-pill" style="background:#7c3aed;">Paso 2: Menú Compartir</span>
              <h4>Agregar al Fondo / Pantalla de Inicio</h4>
              <p>
                Desliza hacia abajo en las opciones de Safari y selecciona <strong>[+] "Agregar a Inicio"</strong> (o <em>"Agregar a pantalla de inicio"</em>).
              </p>
            </div>
            <div class="guide-step-img-wrap">
              <img src="/guias/iphone/paso2_menu_compartir.png" alt="Paso 2 Menú Compartir" class="guide-img" onerror="this.style.display='none'">
            </div>
          </div>

          <!-- Paso 3 -->
          <div class="guide-step-card">
            <div class="guide-step-header">
              <span class="step-pill" style="background:#059669;">Paso 3: Confirmación</span>
              <h4>Activar "Abrir como app web"</h4>
              <p>
                Verifica que el interruptor <strong>"Abrir como app web"</strong> esté activo (en verde) y pulsa <strong>"Agregar"</strong> arriba a la derecha.
              </p>
            </div>
            <div class="guide-step-img-wrap">
              <img src="/guias/iphone/paso3_agregar_inicio.png" alt="Paso 3 Agregar a Inicio" class="guide-img" onerror="this.style.display='none'">
            </div>
          </div>
        </div>

        <div class="guide-note-box">
          <div>
            <strong>✨ Ventaja para el Docente en el Aula:</strong><br>
            Al abrir el Escáner desde el icono en la pantalla de inicio, se ocultan las barras de Safari, permitiendo escanear a pantalla completa, con vibración y sonido táctil, sin consumo de datos y guardado automático de todo el grupo.
          </div>
        </div>
      </div>

      <!-- Pestaña 2: Android Chrome -->
      <div id="guiaAndroid" class="guide-pane hidden">
        <div style="margin-bottom: 10px;">
          <h3 style="font-size: 14px; font-weight: 900; color: #002b49;">
            Instalación en Android (Google Chrome)
          </h3>
          <p style="font-size: 12px; color: #475569;">
            Instalación instantánea con tecnología Progressive Web App (PWA) offline.
          </p>
        </div>

        <div class="guide-step-grid">
          <div class="guide-step-card">
            <div class="guide-step-header" style="height: 100%;">
              <span class="step-pill" style="background:#059669;">Paso 1</span>
              <h4>Abrir en Chrome</h4>
              <p>Abre el enlace directo del escáner en tu navegador Google Chrome o escanea el QR desde tu teléfono.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="guide-step-header" style="height: 100%;">
              <span class="step-pill" style="background:#059669;">Paso 2</span>
              <h4>Menú de 3 Puntos (⋮)</h4>
              <p>Toca los tres puntos verticales ubicados en la esquina superior derecha del navegador Chrome.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="guide-step-header" style="height: 100%;">
              <span class="step-pill" style="background:#059669;">Paso 3</span>
              <h4>Instalar Aplicación</h4>
              <p>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong> y confirma.</p>
            </div>
          </div>
        </div>

        <div class="guide-note-box">
          <div>
            <strong>⚡ Ventaja Android:</strong> El escáner quedará guardado como aplicación independiente y funcionará al 100% incluso con modo avión activado.
          </div>
        </div>
      </div>

      <!-- Pestaña 3: Huawei -->
      <div id="guiaHuawei" class="guide-pane hidden">
        <div style="margin-bottom: 10px;">
          <h3 style="font-size: 14px; font-weight: 900; color: #002b49;">
            Instalación en Dispositivos Huawei (Huawei Browser / Petal)
          </h3>
          <p style="font-size: 12px; color: #475569;">
            Configuración directa en sistemas operativos EMUI y HarmonyOS.
          </p>
        </div>

        <div class="guide-step-grid">
          <div class="guide-step-card">
            <div class="guide-step-header" style="height: 100%;">
              <span class="step-pill" style="background:#dc2626;">Paso 1</span>
              <h4>Navegador Huawei</h4>
              <p>Abre el enlace del escáner en el navegador predeterminado de Huawei o Petal Browser.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="guide-step-header" style="height: 100%;">
              <span class="step-pill" style="background:#dc2626;">Paso 2</span>
              <h4>Menú de Ajustes (≡ ó ⠇)</h4>
              <p>Presiona el botón de menú en la barra inferior o superior derecha del navegador.</p>
            </div>
          </div>

          <div class="guide-step-card">
            <div class="guide-step-header" style="height: 100%;">
              <span class="step-pill" style="background:#dc2626;">Paso 3</span>
              <h4>Acceso Directo</h4>
              <p>Selecciona la opción <strong>"Agregar a pantalla de inicio"</strong> o <strong>"Crear acceso directo"</strong>.</p>
            </div>
          </div>
        </div>

        <div class="guide-note-box">
          <div>
            <strong>🛡️ Compatibilidad Garantizada:</strong> Diseñado con Web APIs universales compatibles con todos los modelos Huawei de los últimos 7 años.
          </div>
        </div>
      </div>

      <!-- Pestaña 4: Modos de Operación -->
      <div id="guiaModos" class="guide-pane hidden">
        <div style="margin-bottom: 10px;">
          <h3 style="font-size: 14px; font-weight: 900; color: #002b49;">
            Modos de Operación y Protocolo de Contingencia
          </h3>
          <p style="font-size: 12px; color: #475569;">
            Opciones según la conectividad del centro educativo y las restricciones del aula.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
          <div style="padding: 12px; background: #e0f2fe; border: 1px solid #bae6fd; border-radius: 12px; font-size: 12px;">
            <strong style="color: #0369a1; font-size: 13px;">🌐 1. Modo En Línea (Recomendado si tiene datos o WiFi):</strong><br>
            Abra el enlace web oficial en HTTPS. La cámara trasera se activará de inmediato con auto-enfoque y lectura instantánea de los QR.
          </div>

          <div style="padding: 12px; background: #fef3c7; border: 1px solid #fde68a; border-radius: 12px; font-size: 12px;">
            <strong style="color: #92400e; font-size: 13px;">📸 2. Contingencia por Foto Directa:</strong><br>
            Si el navegador bloquea la cámara continua en local, toque el botón <strong>"📸 Tomar foto / Cargar QR"</strong> para usar la cámara fotográfica estándar del teléfono.
          </div>

          <div style="padding: 12px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; font-size: 12px;">
            <strong style="color: #065f46; font-size: 13px;">📂 3. Contingencia por Llave Maya / USB:</strong><br>
            Los estudiantes pueden presionar "Descargar Ficha (.json)" en sus computadoras. El docente reúne los archivos en su USB y los carga en lote con el botón <strong>"📂 Importar JSONs (USB)"</strong>.
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- PASO 1: CONFIGURACIÓN INICIAL -->
  <section id="vistaConfig" class="card">
    <h2>⚙️ Configuración del Grupo</h2>
    
    <label for="inputCentro">Centro Educativo:</label>
    <input id="inputCentro" type="text" placeholder="Ej. Liceo de Costa Rica" value="Colegio de Secundaria MEP">

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div>
        <label for="inputNivel">Nivel:</label>
        <select id="inputNivel" disabled>
          <option value="9.° año" selected>9.° Año</option>
        </select>
      </div>
      <div>
        <label for="inputSeccion">Sección:</label>
        <input id="inputSeccion" type="text" placeholder="Ej. 9-1" value="9-1">
      </div>
    </div>

    <div style="margin-top: 18px;">
      <button class="btn-emerald" onclick="iniciarSesionDocente()">
        <span>🚀 Iniciar Sesión de Escaneo</span>
      </button>
    </div>
  </section>

  <!-- PASO 2: SESIÓN ACTIVA Y CÁMARA -->
  <section id="vistaSesion" class="card hidden">
    <h2>📷 Escaneo de QR Estudiantes</h2>

    <div id="sessionInfo" class="session-box"></div>

    <div id="contadorEstudiantes" class="counter-badge">
      Estudiantes Registrados: 0
    </div>

    <!-- Botón de apertura de cámara -->
    <button id="btnActivarCamara" class="btn-primary" onclick="iniciarCamaraUniversal()">
      <span>📷 Activar Cámara para Escanear</span>
    </button>

    <button id="btnDetenerCamara" class="btn-secondary hidden" onclick="detenerCamara()" style="margin-top: 8px;">
      <span>⏹️ Pausar Cámara</span>
    </button>

    <!-- Contenedor del video con playsinline para iOS -->
    <div id="reader" class="hidden" playsinline webkit-playsinline></div>

    <!-- Opciones de respaldo: Foto de cámara nativa y Carga de archivos JSON -->
    <div class="file-upload-wrapper">
      <label class="file-upload-btn">
        <span>📸 Tomar foto / Cargar QR</span>
        <input type="file" id="qrFileInput" accept="image/*" capture="environment" style="display: none;" onchange="procesarArchivoImagen(event)">
      </label>
      <label class="file-upload-btn">
        <span>📂 Importar JSONs (USB)</span>
        <input type="file" id="jsonBatchInput" accept=".json" multiple style="display: none;" onchange="importarArchivosJSON(event)">
      </label>
    </div>

    <div id="mensajeCamara"></div>

    <div class="button-grid" style="margin-top: 16px;">
      <button class="btn-secondary" onclick="alternarVistaRegistros()">
        <span>📋 Ver Padrón</span>
      </button>
      <button class="btn-emerald" onclick="exportarCSV()">
        <span>📊 Exportar Excel</span>
      </button>
    </div>

    <div style="margin-top: 8px;">
      <button class="btn-secondary" onclick="finalizarSesion()" style="color: #64748b; font-size: 12px; height: 38px;">
        <span>🔄 Cambiar de Sección / Centro</span>
      </button>
    </div>
  </section>

  <!-- PASO 3: CONFIRMACIÓN DE RESULTADO DETECTADO -->
  <section id="vistaResultado" class="card hidden">
    <h2>✅ Resultado Detectado</h2>

    <div id="contenidoResultado"></div>

    <button class="btn-emerald" onclick="guardarRegistroActual()">
      <span>💾 Guardar Registro de Estudiante</span>
    </button>

    <button class="btn-secondary" onclick="descartarYReanudar()" style="margin-top: 8px;">
      <span>🔄 Descartar y Continuar Escaneando</span>
    </button>
  </section>

  <!-- PASO 4: PADRÓN DE REGISTROS ALMACENADOS -->
  <section id="vistaRegistros" class="card hidden">
    <h2>📋 Padrón de Estudiantes Registrados</h2>

    <div id="listaRegistros"></div>

    <div class="button-grid" style="margin-top: 14px;">
      <button class="btn-emerald" onclick="exportarCSV()">
        <span>📊 Descargar CSV Oficial</span>
      </button>
      <button class="btn-indigo" onclick="exportarJSON()">
        <span>💾 Descargar JSON Oficial</span>
      </button>
    </div>

    <div class="button-grid" style="margin-top: 8px;">
      <button class="btn-danger" onclick="eliminarTodosRegistros()">
        <span>🗑️ Limpiar Todo el Padrón</span>
      </button>
      <button class="btn-secondary" onclick="alternarVistaRegistros()">
        <span>⬅️ Volver al Escáner</span>
      </button>
    </div>
  </section>

</div>

<script>
var STORAGE_KEY = "mep_diagnostico_9no_escaner_v1";

var sesionActiva = {
  centro: "",
  nivel: "9.° año",
  seccion: ""
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

function alternarGuiaInstalacion() {
  var c = document.getElementById("guideContent");
  var a = document.getElementById("guideArrow");
  if (c.style.display === "none") {
    c.style.display = "block";
    a.textContent = "▲";
  } else {
    c.style.display = "none";
    a.textContent = "▼";
  }
}

function cambiarPestanaGuia(tab) {
  var panes = ["guiaIos", "guiaAndroid", "guiaHuawei", "guiaModos"];
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
    document.getElementById("guiaIos").classList.remove("hidden");
    document.getElementById("tabBtnIos").classList.add("active");
  } else if (tab === "android") {
    document.getElementById("guiaAndroid").classList.remove("hidden");
    document.getElementById("tabBtnAndroid").classList.add("active");
  } else if (tab === "huawei") {
    document.getElementById("guiaHuawei").classList.remove("hidden");
    document.getElementById("tabBtnHuawei").classList.add("active");
  } else if (tab === "modos") {
    document.getElementById("guiaModos").classList.remove("hidden");
    document.getElementById("tabBtnModos").classList.add("active");
  }
}

function iniciarSesionDocente() {
  var centro = document.getElementById("inputCentro").value.trim();
  var seccion = document.getElementById("inputSeccion").value.trim();

  if (!centro) {
    alert("Por favor ingrese el Centro Educativo.");
    return;
  }
  if (!seccion) {
    alert("Por favor ingrese la sección.");
    return;
  }

  sesionActiva.centro = centro;
  sesionActiva.seccion = seccion;

  document.getElementById("sessionInfo").innerHTML =
    "<strong>🏫 Centro:</strong> " + escaparHTML(sesionActiva.centro) + "<br>" +
    "<strong>📚 Nivel:</strong> 9.° Año &nbsp;|&nbsp; <strong>👥 Sección:</strong> " + escaparHTML(sesionActiva.seccion);

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

    // Cascada de permisos: 1) FacingMode environment -> 2) enumerateDevices fallback
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
      '<strong>⚠️ No fue posible activar la cámara en vivo.</strong><br>' +
      '• Si usa iPhone o Android en navegador local sin HTTPS, use el botón <strong>"Tomar foto / Cargar QR"</strong> para capturar con la cámara nativa del teléfono.<br>' +
      '• Si tiene acceso a internet en el teléfono, abra la herramienta en línea para acceso inmediato a la cámara.' +
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

  // Si viene en formato JSON estructurado
  if (raw.trim().startsWith("{") && raw.trim().endsWith("}")) {
    try {
      var obj = JSON.parse(raw);
      var porc = obj.porc !== undefined ? obj.porc : (obj.notaCognitiva ? obj.notaCognitiva * 10 : 0);
      var niv = porc >= 80 ? "Logrado" : (porc >= 60 ? "En Desarrollo" : "Acompañamiento");
      return {
        estudiante: obj.nom || obj.estudiante || obj.nombre || "Estudiante",
        cedula: obj.cedula || "",
        seccionQR: obj.sec || obj.seccion || sesionActiva.seccion,
        fecha: obj.fec || obj.fecha || new Date().toLocaleDateString("es-CR"),
        cognoscitiva: obj.cog ? (porc + "%") : (obj.cognoscitiva || (porc + "%")),
        nivelCognoscitivo: obj.nivel || obj.nivelCognoscitivo || niv,
        tarjetas: obj.tarjetas || "E-P-S",
        puertos: obj.puertos || "Conectados",
        ejecucion: obj.ejecucion || "Autónomo",
        socioafectiva: obj.socioafectiva || "5 actitudes computacionales",
        fortalezas: obj.fortalezas || "Pensamiento computacional y lógica",
        prioridades: obj.prioridades || "Estructuras algorítmicas y circuitos",
        textoOriginal: raw
      };
    } catch (e) {}
  }

  // Parseo por líneas de texto plano (Formato oficial autónomo)
  var lineas = raw.split(/\\r?\\n/).map(function(l) { return l.trim(); }).filter(Boolean);

  var datos = {
    estudiante: lineas[0] || "Estudiante",
    seccionQR: lineas[1] || sesionActiva.seccion,
    fecha: lineas[2] || new Date().toLocaleDateString("es-CR"),
    cognoscitiva: "",
    nivelCognoscitivo: "",
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

  if (!datos.estudiante) {
    throw new Error("No se pudo identificar el nombre del estudiante.");
  }

  return datos;
}

function renderizarResultado(datos) {
  document.getElementById("contenidoResultado").innerHTML =
    '<div class="result-grid">' +
    '  <div class="result-item">' +
    '    <strong>Estudiante</strong>' +
    '    <span>' + escaparHTML(datos.estudiante) + '</span>' +
    '  </div>' +
    '  <div class="result-item">' +
    '    <strong>Sección QR</strong>' +
    '    <span>' + escaparHTML(datos.seccionQR || sesionActiva.seccion) + '</span>' +
    '  </div>' +
    '  <div class="result-item">' +
    '    <strong>Dimensión Cognoscitiva</strong>' +
    '    <span>' + escaparHTML(datos.cognoscitiva || "Registrado") + ' (' + escaparHTML(datos.nivelCognoscitivo || "Nivel") + ')</span>' +
    '  </div>' +
    '  <div class="result-item">' +
    '    <strong>Dimensión Psicomotora</strong>' +
    '    <span>' + escaparHTML(datos.ejecucion || datos.tarjetas || "Completado") + '</span>' +
    '  </div>' +
    '  <div class="result-item result-wide">' +
    '    <strong>Dimensión Socioafectiva</strong>' +
    '    <span>' + escaparHTML(datos.socioafectiva || "Favorable") + '</span>' +
    '  </div>' +
    (datos.fortalezas ? (
      '  <div class="result-item result-wide">' +
      '    <strong>Fortalezas Observadas</strong>' +
      '    <span>' + escaparHTML(datos.fortalezas) + '</span>' +
      '  </div>'
    ) : '') +
    '</div>';

  document.getElementById("vistaSesion").classList.add("hidden");
  document.getElementById("vistaResultado").classList.remove("hidden");
}

function guardarRegistroActual() {
  if (!resultadoPendiente) return;

  var registros = obtenerRegistros();

  var registroNuevo = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    centro: sesionActiva.centro,
    nivel: sesionActiva.nivel,
    seccion: sesionActiva.seccion,
    estudiante: resultadoPendiente.estudiante,
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
    '  ✅ Registro de <strong>' + escaparHTML(registroNuevo.estudiante) + '</strong> guardado exitosamente.' +
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
    alert("Error al guardar en el almacenamiento local del teléfono.");
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
    renderizarListaPadrón();
  } else {
    vReg.classList.add("hidden");
    vSes.classList.remove("hidden");
  }
}

function renderizarListaPadrón() {
  var registros = obtenerRegistros().reverse();
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
      '    <span class="record-badge">' + escaparHTML(r.seccion) + '</span>' +
      '  </div>' +
      '  <div class="record-details">' +
      '    <strong>🏫 Centro:</strong> ' + escaparHTML(r.centro) + '<br>' +
      '    <strong>🧠 Cognitivo:</strong> ' + escaparHTML(r.cognoscitiva || "Completado") + ' (' + escaparHTML(r.nivelCognoscitivo || "Inicial") + ')<br>' +
      '    <strong>⚙️ Psicomotor:</strong> ' + escaparHTML(r.ejecucion || "Completado") + '<br>' +
      '    <strong>📅 Fecha:</strong> ' + escaparHTML(r.fecha) +
      '  </div>' +
      '  <button class="btn-secondary" onclick="eliminarRegistroIndividual(\'' + r.id + '\')" style="margin-top: 8px; color: #dc2626; height: 34px; font-size: 11px;">' +
      '    🗑️ Eliminar Registro' +
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
  renderizarListaPadrón();
}

function eliminarTodosRegistros() {
  if (!confirm("⚠️ ¿Está seguro de eliminar TODOS los registros de este dispositivo? Esta acción no se puede deshacer.")) return;
  localStorage.removeItem(STORAGE_KEY);
  actualizarContador();
  renderizarListaPadrón();
}

function exportarCSV() {
  var registros = obtenerRegistros();
  if (registros.length === 0) {
    alert("No hay registros para exportar.");
    return;
  }

  var encabezados = [
    "Centro Educativo", "Nivel", "Sección", "Estudiante", "Fecha",
    "Cognoscitiva", "Nivel Cognoscitivo", "Tarjetas", "Puertos", "Ejecución", "Socioafectiva", "Fortalezas", "Prioridades"
  ];

  var csv = "\uFEFF" + encabezados.map(function(c) { return '"' + csvEscapar(c) + '"'; }).join(";") + "\\n";

  registros.forEach(function(r) {
    var fila = [
      r.centro, r.nivel, r.seccion, r.estudiante, r.fecha,
      r.cognoscitiva, r.nivelCognoscitivo, r.tarjetas, r.puertos, r.ejecucion, r.socioafectiva, r.fortalezas, r.prioridades
    ];
    csv += fila.map(function(c) { return '"' + csvEscapar(c) + '"'; }).join(";") + "\\n";
  });

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "diagnostico_FT_9no_padron_" + new Date().toISOString().slice(0, 10) + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportarJSON() {
  var registros = obtenerRegistros();
  if (registros.length === 0) {
    alert("No hay registros para exportar.");
    return;
  }

  var jsonStr = JSON.stringify(registros, null, 2);
  var blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "diagnostico_FT_9no_padron_" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscapar(val) {
  if (val === null || val === undefined) return "";
  return String(val).replace(/"/g, '""').replace(/\\r?\\n/g, " ");
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
</script>
</body>
</html>`;

const fullHtml = headPart + html5QrcodeSource + bodyPart;

fs.writeFileSync(OUTPUT_WEBAPPS, fullHtml, "utf8");
fs.writeFileSync(OUTPUT_PUBLIC, fullHtml, "utf8");
console.log("✅ Escáner 9.° Año compilado 100% offline con éxito en:");
console.log(" - " + OUTPUT_WEBAPPS);
console.log(" - " + OUTPUT_PUBLIC);
