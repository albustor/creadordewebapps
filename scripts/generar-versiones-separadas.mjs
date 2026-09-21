import fs from "fs";
import path from "path";

const BASE_PATH = path.join(process.cwd(), "public", "webapps", "diagnostico_9no_modulo01_aula_inteligente.html");
const EN_LINEA_PATH = path.join(process.cwd(), "public", "webapps", "diagnostico_9no_modulo01_en_linea.html");
const OFFLINE_PATH = path.join(process.cwd(), "public", "webapps", "diagnostico_9no_modulo01_desconectado_offline.html");

const baseContent = fs.readFileSync(BASE_PATH, "utf8");

// ==========================================
// 1. GENERAR VERSIÓN EN LÍNEA
// ==========================================
let contenidoEnLinea = baseContent;

// Reemplazar títulos y badges
contenidoEnLinea = contenidoEnLinea.replace(
  /<title>.*?<\/title>/,
  "<title>Diagnóstico 9° [EN LÍNEA] - «Aula Inteligente» (Sincronización en Tiempo Real)</title>"
);

// Agregar banner distintivo en línea
const bannerEnLinea = `
    <!-- BANNER MODALIDAD EN LÍNEA -->
    <div style="background: linear-gradient(90deg, #064e3b, #047857); color: white; padding: 6px 14px; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #10b981;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #34d399; border-radius: 50%; box-shadow: 0 0 8px #34d399;"></span>
        <span>🌐 <strong>MODALIDAD EN LÍNEA (CONECTADO)</strong> • Sincronización automática de respuestas e indicadores en tiempo real con el Dashboard Docente.</span>
      </div>
      <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 6px; font-size: 10px;">💻 Uso exclusivo en PC / Laptop</span>
    </div>
`;

contenidoEnLinea = contenidoEnLinea.replace(/<header>/, `${bannerEnLinea}\n    <header>`);

// Modificar CONFIG en JS para forzar modo online
contenidoEnLinea = contenidoEnLinea.replace(
  /var CONFIG = \{[\s\S]*?\};/,
  (match) => match.replace(/modoOperacion:\s*"auto"/, 'modoOperacion: "online"')
);

fs.writeFileSync(EN_LINEA_PATH, contenidoEnLinea, "utf8");
console.log("Generado con éxito:", EN_LINEA_PATH);

// ==========================================
// 2. GENERAR VERSIÓN DESCONECTADA / OFFLINE
// ==========================================
let contenidoOffline = baseContent;

// Reemplazar títulos y badges
contenidoOffline = contenidoOffline.replace(
  /<title>.*?<\/title>/,
  "<title>Diagnóstico 9° [DESCONECTADO - OFFLINE] - «Aula Inteligente» (Laboratorio sin Internet)</title>"
);

// Agregar banner distintivo desconectado
const bannerOffline = `
    <!-- BANNER MODALIDAD DESCONECTADA (OFFLINE) -->
    <div style="background: linear-gradient(90deg, #1e293b, #334155); color: white; padding: 6px 14px; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #64748b;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #f59e0b; border-radius: 50%;"></span>
        <span>💾 <strong>MODALIDAD DESCONECTADA (OFFLINE)</strong> • Funciona 100% sin internet en esta computadora. Al finalizar muestra tu código QR a tu docente.</span>
      </div>
      <span style="background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 6px; font-size: 10px;">💻 Uso exclusivo en PC / Laptop</span>
    </div>
`;

contenidoOffline = contenidoOffline.replace(/<header>/, `${bannerOffline}\n    <header>`);

// Modificar CONFIG en JS para forzar modo offline estricto
contenidoOffline = contenidoOffline.replace(
  /var CONFIG = \{[\s\S]*?\};/,
  (match) => match.replace(/modoOperacion:\s*"auto"/, 'modoOperacion: "offline"')
);

fs.writeFileSync(OFFLINE_PATH, contenidoOffline, "utf8");
console.log("Generado con éxito:", OFFLINE_PATH);
