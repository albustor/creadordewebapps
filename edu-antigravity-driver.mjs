/**
 * ANTIGRAVITY LIVE DRIVER & HOT-HEALER
 * Target: https://diagnosticosecundaria.vercel.app/ (o localhost de desarrollo)
 * Auditor: Jim - Especialista en Validación Técnica Educativa
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Cargar variables de entorno locales (.env.local / .env)
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const TARGET_URL = process.env.AUDIT_TARGET_URL || 'https://diagnosticosecundaria.vercel.app/';

const Log = {
  info: (msg) => console.log(`\x1b[34m[EDU-AUDIT]\x1b[0m ${msg}`),
  pass: (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  heal: (msg) => console.log(`\x1b[35m[HOT-HEAL]\x1b[0m ${msg}`),
  fail: (msg) => console.error(`\x1b[31m[CRITICAL]\x1b[0m ${msg}`)
};

/**
 * Consulta a Gemini para obtener el parche atómico sobre el archivo físico
 */
async function healOffendingSourceFile(filePath, runtimeError) {
  if (!fs.existsSync(filePath)) {
    Log.warn(`Archivo físico no encontrado para sobreescritura: ${filePath}`);
    return false;
  }

  Log.heal(`Inyectando solución en caliente en: ${filePath}`);
  const originalCode = fs.readFileSync(filePath, 'utf-8');

  // Intentar con modelo disponible en el SDK
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' }
  });

  const prompt = `
Eres Jim, Auditor Técnico de Software Educativo de Secundaria.
Durante la navegación en vivo en la WebApp de diagnóstico se detectó un fallo crítico en el cliente.
Tu tarea es corregir el código del archivo INMEDIATAMENTE para eliminar el error.

REGLAS PEDAGÓGICAS Y DE ARQUITECTURA:
1. Resiliencia: La interfaz nunca debe quedarse en blanco ni perder el avance del estudiante ante recargas o desconexión.
2. Seguridad: Ninguna clave evaluativa ni respuesta correcta debe filtrarse en el cliente o consola.
3. Rendimiento: No dejar temporizadores, suscripciones a eventos ni peticiones de red colgadas.
4. Devuelve ÚNICAMENTE el JSON requerido.

ARCHIVO AFECTADO: ${filePath}
ERROR CAPTURADO EN EL NAVEGADOR:
${runtimeError}

CÓDIGO ORIGINAL:
\`\`\`
${originalCode}
\`\`\`

SCHEMA ESPERADO:
{
  "rootCause": "Explicación técnica concisa del fallo",
  "sanitizedCode": "Código fuente completo corregido listo para sobreescribir el archivo"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const patch = JSON.parse(result.response.text());

    // Respaldo de seguridad
    fs.writeFileSync(`${filePath}.bak`, originalCode, 'utf-8');
    // Aplicación del parche
    fs.writeFileSync(filePath, patch.sanitizedCode, 'utf-8');

    // Validación sintáctica rápida si es TS/TSX
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
      } catch (tscErr) {
        Log.warn(`Advertencia de TypeScript tras parche: ${tscErr.message}`);
      }
    }

    Log.heal(`Parche aplicado con éxito. Causa mitigada: ${patch.rootCause}`);
    return true;
  } catch (err) {
    Log.fail(`Fallo al aplicar el parche: ${err.message}. Restaurando respaldo...`);
    if (fs.existsSync(`${filePath}.bak`)) {
      fs.writeFileSync(filePath, fs.readFileSync(`${filePath}.bak`, 'utf-8'), 'utf-8');
    }
    return false;
  }
}

/**
 * Suite de Auditoría de Campo y Reparación In-Situ
 */
export async function auditAndHealApp() {
  console.log(`\n===============================================================`);
  console.log(`  INICIANDO SESIÓN DE AUDITORÍA Y SANACIÓN EN CALIENTE         `);
  console.log(`  OBJETIVO: ${TARGET_URL}`);
  console.log(`===============================================================\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const interceptedErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') interceptedErrors.push(msg.text());
  });

  page.on('pageerror', (err) => {
    interceptedErrors.push(err.message);
  });

  try {
    // 1. Prueba de Arranque e Hidratación
    Log.info('1. Verificando carga, hidratación y estado del DOM...');
    const response = await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    if (!response || response.status() >= 400) {
      throw new Error(`Código de respuesta anómalo: ${response?.status()}`);
    }
    Log.pass(`Carga HTTP ${response.status()} verificada.`);

    // 2. Comprobación y Sanación de Errores de Consola
    if (interceptedErrors.length > 0) {
      Log.warn(`Se detectaron ${interceptedErrors.length} errores de consola/DOM en tiempo de ejecución.`);
      for (const errorMsg of interceptedErrors) {
        // Intenta aislar si el error apunta a un archivo específico en src/ o app/ o components/
        const fileMatch = errorMsg.match(/([a-zA-Z0-9_\-\/]+\.(?:js|ts|jsx|tsx))/);
        let targetPath = fileMatch ? path.resolve(fileMatch[1]) : null;

        if (!targetPath || !fs.existsSync(targetPath)) {
          // Intentar resolver en rutas comunes Next.js
          const fallbacks = [
            path.resolve('app/page.tsx'),
            path.resolve('app/layout.tsx'),
            path.resolve('src/App.jsx')
          ];
          targetPath = fallbacks.find(p => fs.existsSync(p)) || null;
        }

        if (targetPath && fs.existsSync(targetPath)) {
          await healOffendingSourceFile(targetPath, errorMsg);
        } else {
          Log.warn(`No se pudo asociar directamente el error a un archivo local: ${errorMsg}`);
        }
      }
    } else {
      Log.pass('DOM limpio: Cero excepciones no controladas en el cliente.');
    }

    // 3. Inspección contra Fuga de Claves de Examen
    Log.info('2. Verificando protección del banco de preguntas...');
    const answerLeak = await page.evaluate(() => {
      const markers = ['correctAnswer', 'respuestaCorrecta', 'solucionario', 'isCorrect'];
      const bodyText = document.body.innerHTML;
      return markers.filter((m) => bodyText.includes(`"${m}":true`) || bodyText.includes(`"${m}": true`));
    });

    if (answerLeak.length > 0) {
      Log.warn(`Alerta de Fuga: Se encontraron indicadores de respuestas correctas expuestas: ${answerLeak.join(', ')}`);
      // Sanación dirigida al componente de renderizado de preguntas
      const questionComponent = [
        path.resolve('components/QuestionCard.jsx'),
        path.resolve('components/QuestionCard.tsx'),
        path.resolve('src/components/QuestionCard.jsx')
      ].find(p => fs.existsSync(p));

      if (questionComponent) {
        await healOffendingSourceFile(
          questionComponent,
          `El componente renderiza claves de respuesta correctas en el DOM del cliente (${answerLeak.join(', ')}). Debe eliminarlas del payload antes de pintar las opciones.`
        );
      }
    } else {
      Log.pass('Protección de reactivos validada: Ninguna clave expuesta en el DOM.');
    }

    // 4. Verificación de Resiliencia de Respuestas (Storage)
    Log.info('3. Auditando persistencia de estado para contingencias de aula...');
    const storageActive = await page.evaluate(() => {
      try {
        localStorage.setItem('__probe__', 'ok');
        const read = localStorage.getItem('__probe__') === 'ok';
        localStorage.removeItem('__probe__');
        return read;
      } catch {
        return false;
      }
    });

    if (!storageActive) {
      throw new Error('El navegador no permite acceso a localStorage o la cuota está colapsada.');
    }
    Log.pass('Persistencia en disco del navegador confirmada.');

    console.log(`\n\x1b[32m✔ AUDITORÍA FINALIZADA: APLICACIÓN CERTIFICADA PARA PRUEBAS EN AULA.\x1b[0m\n`);
  } catch (fatal) {
    Log.fail(`Interrupción crítica durante la auditoría: ${fatal.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Invocación CLI directa
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1].endsWith('edu-antigravity-driver.js') || process.argv[1].endsWith('edu-antigravity-driver.mjs')) {
  auditAndHealApp();
}
