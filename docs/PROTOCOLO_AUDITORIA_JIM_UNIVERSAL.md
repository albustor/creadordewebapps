# Protocolo Maestro de Auditoría Jim 360° (Multi-Proyecto)

Este documento detalla la arquitectura universal para auditar cualquier proyecto en Google Project Antigravity mediante automatización (*Heal-In-Place*) e inspección forense manual.

---

## 1. Modos de Ejecución Dinámica

El runner detecta automáticamente el proyecto, puerto y URL, o permite especificarlo en el momento:

### A. Por Línea de Comandos (CLI):
```bash
# 1. Auditar Localhost (detecta automáticamente el puerto del proyecto: 3000, 3001, etc.)
npm run audit -- local
# o especificando el puerto directamente:
npm run audit -- 3001

# 2. Auditar URL de producción (Vercel u otro hosting):
npm run audit -- https://diagnosticosecundaria.vercel.app/
npm run audit -- https://recursodeapoyo.vercel.app/

# 3. Modo Interactivo (Pregunta en terminal qué entorno auditar):
npm run audit
```

### B. En el Chat de Antigravity:
Al escribir la palabra clave **`AUDITAR`**:
1. Antigravity te preguntará si deseas auditar el **Localhost actual**, la **URL de Vercel** o una **URL personalizada**.
2. Al seleccionar el objetivo, se lanzará la suite completa L0–L4 con auto-sanación (*Heal-In-Place*).

---

## 2. Niveles de Validación Automatizada (L0–L4)

1. **L0: Carga e Hidratación:** Respuesta HTTP 200/OK, sin errores de hydration ni pantallas blancas.
2. **L1: Consola Limpia & Auto-Sanación:** Captura de `pageerror` y `console.error`. Si ocurre un fallo, Gemini genera un parche atómico sobre el archivo fuente local (`.tsx`, `.jsx`, `.ts`), respalda (`.bak`), sobreescribe y revalida con `tsc`.
3. **L2: Integridad de Red & Multimedia:** Verificación de CORS (`crossorigin="anonymous"` en Bunny CDN / Video / WebAR), detección de 404s en assets o fallos en endpoints API.
4. **L3: Aislamiento & Fuga de Claves:** Inspección del DOM para asegurar que `correctAnswer`, `respuestaCorrecta`, solucionarios y rúbricas privadas no estén expuestas al rol estudiante.
5. **L4: Resiliencia de Almacenamiento:** Comprobación de cuota y disponibilidad de `localStorage` / `SafeStorage` para tolerancia a microcortes de red en aula.

---

## 3. Protocolo de Auditoría Forense Manual (Checklist Humano)

Para auditorías previas a eventos o despliegues nacionales de alto impacto:

### Paso 1: Red y Consola (DevTools)
1. Abrir ventana de incógnito y acceder a la URL del proyecto.
2. Presionar `F12` > pestaña **Console** (Criterio: Cero errores en rojo).
3. Pestaña **Network** > marcar **Disable cache** > recargar con `Ctrl + F5` (Criterio: Cero respuestas 404, 500 o bloqueos CORS).

### Paso 2: Verificación de Claves Evaluativas
1. En DevTools > **Sources** / **Debugger**.
2. Presionar `Ctrl + Shift + F` y buscar: `correctAnswer`, `respuestaCorrecta`, `solucion`, `isCorrect`.
3. Criterio: Ningún reactivo debe exponer la respuesta en texto plano en el cliente.

### Paso 3: Simulación Offline en Aula
1. Avanzar 2 o 3 preguntas en la WebApp.
2. En DevTools > pestaña **Network**, cambiar *Throttling* a **Offline**.
3. Responder la siguiente pregunta y presionar `F5`.
4. Criterio: La aplicación debe persistir el avance en `localStorage` sin perder respuestas.

### Paso 4: Auditoría de Cuota de Almacenamiento
1. En DevTools > pestaña **Console**, ejecutar:
```javascript
console.log("Bytes en LocalStorage:", new Blob(Object.values(localStorage)).size);
```
2. Criterio: El tamaño total debe ser inferior a **500 KB** para garantizar fluidez en hardware escolar heterogéneo.
