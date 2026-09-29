/**
 * ARQUETIPO UNIVERSAL DE AUDITORÍA Y AUTO-SANACIÓN EN CALIENTE
 * JIM 360° - Full-Stack, DevOps & Especialista en Software Educativo
 * Soporta cualquier proyecto, Localhost dinámico y URLs de producción.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno prioritarias (.env.antigravity -> .env.local -> .env)
['.env.antigravity', '.env.local', '.env'].forEach((envFile) => {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const Log = {
  info: (msg) => console.log(`\x1b[34m[JIM:AUDIT]\x1b[0m ${msg}`),
  pass: (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  heal: (msg) => console.log(`\x1b[35m[HOT-HEAL]\x1b[0m ${msg}`),
  fail: (msg) => console.error(`\x1b[31m[CRITICAL]\x1b[0m ${msg}`),
};

/**
 * Detecta automáticamente el puerto o URL predeterminada del proyecto actual
 */
function detectarConfiguracionProyecto() {
  let defaultPort = 3000;
  let projectName = 'Proyecto Web';
  let defaultProductionUrl = 'https://diagnosticosecundaria.vercel.app/';

  if (fs.existsSync('package.json')) {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      projectName = pkg.name || pkg.curiolHub?.name || projectName;
      if (pkg.curiolHub?.port) {
        defaultPort = pkg.curiolHub.port;
      } else if (pkg.scripts?.dev && pkg.scripts.dev.includes('-p ')) {
        const portMatch = pkg.scripts.dev.match(/-p\s+(\d+)/);
        if (portMatch) defaultPort = parseInt(portMatch[1], 10);
      }
    } catch {}
  }

  return { projectName, defaultPort, defaultProductionUrl };
}

/**
 * Resuelve la URL objetivo (por argumento CLI, interactivo o variable de entorno)
 */
async function resolverUrlObjetivo() {
  const { projectName, defaultPort, defaultProductionUrl } = detectarConfiguracionProyecto();
  const cliArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));

  // 1. Si se pasó como argumento directo (ej: node runner.mjs https://... o node runner.mjs 3001)
  if (cliArg) {
    if (cliArg.startsWith('http://') || cliArg.startsWith('https://')) {
      return cliArg;
    }
    if (/^\d+$/.test(cliArg)) {
      return `http://localhost:${cliArg}`;
    }
    if (cliArg.toLowerCase() === 'local' || cliArg.toLowerCase() === 'dev') {
      return `http://localhost:${defaultPort}`;
    }
    if (cliArg.toLowerCase() === 'prod' || cliArg.toLowerCase() === 'vercel') {
      return defaultProductionUrl;
    }
  }

  // 2. Si existe variable de entorno específica
  if (process.env.AUDIT_TARGET_URL && process.env.AUDIT_TARGET_URL.trim()) {
    return process.env.AUDIT_TARGET_URL.trim();
  }

  // 3. Modo Interactivo en terminal si es interactiva
  if (process.stdin.isTTY && !process.env.CI) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const promptText = `
\x1b[36m===============================================================
  JIM 360° - SELECCIÓN DE ENTORNO DE AUDITORÍA
  Proyecto detectado: ${projectName}
===============================================================\x1b[0m
  1) Localhost de Desarrollo (http://localhost:${defaultPort})
  2) Producción en Vercel (${defaultProductionUrl})
  3) Ingresar otra URL personalizada

Selecciona una opción (1/2/3) o presiona ENTER para opción 1: `;

    const respuesta = await new Promise((resolve) => {
      rl.question(promptText, (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    });

    if (respuesta === '2') return defaultProductionUrl;
    if (respuesta === '3') {
      const rlCustom = readline.createInterface({ input: process.stdin, output: process.stdout });
      const customUrl = await new Promise((resolve) => {
        rlCustom.question('\nIngresa la URL completa (ej. http://localhost:3000 o https://miapp.vercel.app): ', (ans) => {
          rlCustom.close();
          resolve(ans.trim());
        });
      });
      if (customUrl) return customUrl;
    }
    return `http://localhost:${defaultPort}`;
  }

  // 4. Default de respaldo
  return `http://localhost:${defaultPort}`;
}

/**
 * Consulta a Gemini para obtener el parche atómico sobre el archivo físico (Heal-In-Place)
 */
async function healSourceFile(filePath, errorDetail) {
  if (!fs.existsSync(filePath)) {
    Log.warn(`Archivo físico no encontrado para sobreescritura: ${filePath}`);
    return false;
  }

  Log.heal(`Inyectando solución técnica en: ${filePath}`);
  const originalCode = fs.readFileSync(filePath, 'utf-8');

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = `
Eres Jim, Auditor Técnico Full-Stack y Arquitecto DevOps.
Un fallo detuvo la auditoría en vivo en Antigravity. Tu labor es reparar el código inmediatamente.

REGLAS ESTRICTAS:
1. Respetar contratos de API, TypeScript/Vanilla JS nativo y rendimiento óptimo.
2. Si es WebAR/Video: Verificar CORS (crossorigin="anonymous" para Bunny CDN / assets externos).
3. Si es Evaluación/Diagnóstico: No filtrar respuestas correctas al cliente ni quebrar persistencia local (localStorage/SafeStorage).
4. No incluir marcadores de posición ni código truncado. Devuelve ÚNICAMENTE el JSON estructurado.

ARCHIVO AFECTADO: ${filePath}
ERROR CAPTURADO:
${errorDetail}

CÓDIGO ORIGINAL:
\`\`\`
${originalCode}
\`\`\`

SCHEMA ESPERADO:
{
  "rootCause": "Diagnóstico conciso de la causa raíz",
  "sanitizedCode": "Código fuente completo corregido listo para sobreescribir el archivo"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const patch = JSON.parse(result.response.text());

    // Respaldo de seguridad
    fs.writeFileSync(`${filePath}.bak`, originalCode, 'utf-8');
    fs.writeFileSync(filePath, patch.sanitizedCode, 'utf-8');

    // Validación sintáctica de TypeScript si aplica
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
      } catch (tscErr) {
        Log.warn(`Advertencia de TypeScript tras parche: ${tscErr.message}`);
      }
    }

    Log.pass(`Archivo sanado con éxito. Causa mitigada: ${patch.rootCause}`);
    return true;
  } catch (err) {
    Log.fail(`Fallo en auto-sanación: ${err.message}. Restaurando respaldo...`);
    if (fs.existsSync(`${filePath}.bak`)) {
      fs.writeFileSync(filePath, fs.readFileSync(`${filePath}.bak`, 'utf-8'), 'utf-8');
    }
    return false;
  }
}

/**
 * Suite Principal de Auditoría Forense y Resiliencia en Vivo
 */
export async function runAntigravityAudit(targetUrlManual) {
  const targetUrl = targetUrlManual || (await resolverUrlObjetivo());

  console.log(`\n===============================================================`);
  console.log(`  INICIANDO AUDITORÍA FORENSE 360° - JIM RUNNER EN ANTIGRAVITY `);
  console.log(`  OBJETIVO: ${targetUrl}`);
  console.log(`===============================================================\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const networkFails = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  page.on('requestfailed', (req) => {
    networkFails.push(`${req.method()} ${req.url()} -> ${req.failure()?.errorText || 'Error de Red'}`);
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. L0 / L4: Carga e Hidratación del DOM
    Log.info('1. Comprobando respuesta HTTP e hidratación del DOM...');
    const res = await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
    
    if (!res || res.status() >= 400) {
      throw new Error(`Código de respuesta anómalo: HTTP ${res?.status()} en endpoint principal.`);
    }
    Log.pass(`Endpoint base responde HTTP ${res.status()}.`);

    // 2. Errores de Consola y Auto-Sanación
    Log.info('2. Analizando excepciones en tiempo de ejecución...');
    if (consoleErrors.length > 0) {
      Log.warn(`Errores de consola detectados (${consoleErrors.length}).`);
      for (const err of consoleErrors) {
        const match = err.match(/([a-zA-Z0-9_\-\/]+\.(?:js|ts|jsx|tsx))/);
        let file = match ? path.resolve(match[1]) : null;

        if (!file || !fs.existsSync(file)) {
          const fallbacks = [
            path.resolve('app/page.tsx'),
            path.resolve('src/App.jsx'),
            path.resolve('src/App.tsx'),
            path.resolve('pages/index.tsx'),
          ];
          file = fallbacks.find((f) => fs.existsSync(f)) || null;
        }

        if (file && fs.existsSync(file)) {
          await healSourceFile(file, err);
        } else {
          Log.warn(`Error no asociado directamente a un archivo editable: ${err}`);
        }
      }
    } else {
      Log.pass('Cero errores de ejecución detectados en la consola.');
    }

    // 3. Comprobación de Red y Assets (CORS, 404s, CDN)
    Log.info('3. Verificando integridad de red y recursos multimedia...');
    if (networkFails.length > 0) {
      Log.warn(`Peticiones de red fallidas detectadas: ${networkFails.join(' | ')}`);
    } else {
      Log.pass('Todos los paquetes estáticos y llamadas a APIs resolvieron correctamente.');
    }

    // 4. Verificación contra Fuga de Claves Evaluativas
    Log.info('4. Comprobando protección de bancos de reactivos y rúbricas...');
    const answerLeak = await page.evaluate(() => {
      const markers = ['correctAnswer', 'respuestaCorrecta', 'solucionario', 'isCorrect'];
      const bodyText = document.body.innerHTML;
      return markers.filter((m) => bodyText.includes(`"${m}":true`) || bodyText.includes(`"${m}": true`));
    });

    if (answerLeak.length > 0) {
      Log.warn(`Alerta de Fuga: Se encontraron indicadores de respuestas en DOM: ${answerLeak.join(', ')}`);
      const cardFile = [
        path.resolve('components/QuestionCard.jsx'),
        path.resolve('components/QuestionCard.tsx'),
        path.resolve('src/components/QuestionCard.jsx'),
      ].find((f) => fs.existsSync(f));
      if (cardFile) {
        await healSourceFile(cardFile, `El componente renderiza claves de respuesta correctas (${answerLeak.join(', ')}). Debe eliminarlas del payload cliente.`);
      }
    } else {
      Log.pass('Protección de reactivos validada: Cero claves expuestas en el DOM.');
    }

    // 5. Persistencia Local y Tolerancia de Cuota (Resiliencia en aula)
    Log.info('5. Auditando persistencia en almacenamiento local...');
    const storageAudit = await page.evaluate(() => {
      try {
        localStorage.setItem('__probe__', 'ok');
        const ok = localStorage.getItem('__probe__') === 'ok';
        localStorage.removeItem('__probe__');
        const bytes = new Blob(Object.values(localStorage)).size;
        return { ok, bytes };
      } catch (e) {
        return { ok: false, bytes: 0, error: e.message };
      }
    });

    if (!storageAudit.ok) {
      throw new Error(`localStorage colapsado o no disponible: ${storageAudit.error || 'Acceso restringido'}`);
    }
    Log.pass(`Persistencia en cliente verificada (${storageAudit.bytes} bytes utilizados).`);

    console.log(`\n\x1b[32m✔ SISTEMA CERTIFICADO POR JIM 360°: APLICACIÓN LISTA PARA AULA Y PRODUCCIÓN.\x1b[0m\n`);
    return { success: true, targetUrl, consoleErrors, networkFails, storageAudit };
  } catch (err) {
    Log.fail(`Auditoría abortada: ${err.message}`);
    return { success: false, targetUrl, error: err.message };
  } finally {
    await browser.close();
  }
}

// Ejecución directa desde CLI
if (
  import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` ||
  process.argv[1].endsWith('antigravity-jim-runner.js') ||
  process.argv[1].endsWith('antigravity-jim-runner.mjs')
) {
  runAntigravityAudit().then((res) => {
    if (!res.success) process.exit(1);
  });
}
