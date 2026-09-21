# MINISTERIO DE EDUCACIÓN PÚBLICA
## Dirección de Recursos Tecnológicos en Educación (DRTE)
### Asesoría Regional de Formación Tecnológica - III Ciclo de Secundaria (9° Año)

---

# PROPUESTA TÉCNICA Y PEDAGÓGICA: ARQUITECTURA DE CÓDIGOS QR, EVALUACIÓN FORMATIVA Y SISTEMATIZACIÓN DIAGNÓSTICA (9° AÑO - MÓDULO 1)

**Fecha:** 21 de septiembre de 2026  
**Documento Base:** Diagnóstico Integral de Formación Tecnológica 9° Año - Módulo 1: *«Aula Inteligente y Sistemas Embebidos»*  
**Autor:** Prof. Alberto Bustos Ortega  
**Modalidad Operativa:** Dual (En Línea y 100% Desconectado / Local)

---

## 1. RESUMEN EJECUTIVO Y PROPÓSITO

El presente documento detalla la arquitectura de distribución, aplicación y sistematización del **Diagnóstico de Entrada para 9° Año** en el marco del programa de Formación Tecnológica. 

La solución se estructura a través de **dos Códigos QR independientes y complementarios**:
1. **QR del Estudiante (Diagnóstico Interactivo Autónomo):** Permite al estudiante ejecutar la prueba diagnóstica (reactivos cognoscitivos, simulador de conexionado 2D y reflexión metacognitiva), finalizando con la generación de un código QR individual con sus resultados cifrados localmente.
2. **QR del Docente (Aplicativo Evaluador y Sistematizador por Sección):** Permite al docente configurar su grupo, registrar su nómina, escanear los resultados de los estudiantes, evaluar los indicadores de observación directa (Psicomotriz y Socioafectivo) y obtener la **Sistematización Grupal Inmediata**.

Ambos recursos están concebidos bajo el principio de **Resiliencia Operativa y Offline-First**, funcionando de manera idéntica con o sin conexión a internet.

---

## 2. ARQUITECTURA DE LOS DOS CÓDIGOS QR

```
                               ┌────────────────────────────────────────────────────────┐
                               │             MÓDULO DE DIAGNÓSTICO 9°                   │
                               └──────────────────────────┬─────────────────────────────┘
                                                          │
                       ┌──────────────────────────────────┴─────────────────────────────────┐
                       ▼                                                                    ▼
      ┌─────────────────────────────────┐                                  ┌─────────────────────────────────┐
      │     📱 QR 1: ESTUDIANTE          │                                  │      💻 QR 2: DOCENTE           │
      │  (Prueba Interactiva Autónoma)  │                                  │ (Instrumento & Sistematizador)  │
      └────────────────┬────────────────┘                                  └────────────────┬────────────────┘
                       │                                                                    │
           ┌───────────┴───────────┐                                            ┌───────────┴───────────┐
           ▼                       ▼                                            ▼                       ▼
    [Modo En Línea]         [Modo Local]                                 [Modo En Línea]         [Modo Local]
           │                       │                                            │                       │
           └───────────┬───────────┘                                            └───────────┬───────────┘
                       │                                                                    │
                       ▼                                                                    ▼
        ┌─────────────────────────────┐                                      ┌─────────────────────────────┐
        │  WebApp: Aula Inteligente   │                                      │ 1. Asistente Primer Ingreso │
        │  • 10 Reactivos Cognitivos  │                                      │ 2. Carga Nómina (Excel/CSV) │
        │  • Simulador 2D de Circuitos│                                      │ 3. Opción PWA (Instalar App)│
        │  • Reflexión Parte C        │                                      │ 4. Escáner QR de Alumnos    │
        │  • Guía PWA por S.O.        │                                      └──────────────┬──────────────┘
        └──────────────┬──────────────┘                                                     │
                       │                                                                    │
                       ▼                                                                    │
        ┌─────────────────────────────┐                                                     │
        │ Generación de QR Individual │ ════════════════════════════════════════════════════╝
        │    (Cifrado local SHA-256)  │  (Docente escanea QR del estudiante con su cámara)
        └─────────────────────────────┘                                                     │
                                                                                            ▼
                                                                             ┌─────────────────────────────┐
                                                                             │  Evaluación por Observación │
                                                                             │  • 6 Ítems Psicomotores     │
                                                                             │  • 7 Ítems Socioafectivos   │
                                                                             └──────────────┬──────────────┘
                                                                                            │
                                                                                            ▼
                                                                             ┌─────────────────────────────┐
                                                                             │   SISTEMATIZACIÓN GRUPAL    │
                                                                             │ • Semáforo de Logro Sección │
                                                                             │ • Consolidado por Reactivo  │
                                                                             │ • QR de Reporte Grupal      │
                                                                             │ • Exportación Excel (.xlsx) │
                                                                             └─────────────────────────────┘
```

---

## 3. ESPECIFICACIÓN TÉCNICA DEL QR DEL ESTUDIANTE

### 3.1. Modalidades de Acceso
* **Opción En Línea:** Abre la WebApp alojada en la nube mediante navegador web estándar.
* **Opción Local (Offline):** Proporciona la descarga o apertura del archivo único autónomo (`.html` Single-File), ejecutable sin internet directamente en laboratorios o dispositivos personales vía Bluetooth / USB.

### 3.2. Contenido del Diagnóstico
1. **Parte A: Conocimientos Cognoscitivos Previos (10 reactivos de selección única con retroalimentación inmediata):**
   * Fuentes de energía y conversión energética.
   * Circuito simple (fuente, interruptor, actuador).
   * Conductores vs. Aislantes.
   * Ley de Ohm cualitativa (voltaje, corriente, resistencia).
   * Identificación y polaridad de componentes (LEDs, servomotores, zumbadores).
   * Concepto de Sensor (LDR / sensor de luz).
   * Microcontrolador / Tarjeta de desarrollo (cerebro del sistema embebido).
   * Estructura básica de control algorítmico (`si... entonces`).
   * Medidas de seguridad y prevención de cortocircuitos.
   * Protocolo de desconexión y orden de trabajo.
2. **Parte B: Aplicación Práctica y Simulación 2D Interactiva:**
   * Entorno visual en Canvas interactivo para conectar una LDR, resistencia, microcontrolador y LED en protoboard virtual, evaluando la lógica de cableado y funcionamiento en tiempo real.
3. **Parte C: Reflexión Metacognitiva y Contextualización:**
   * Autoevaluación guiada donde el estudiante analiza su nivel de familiaridad con componentes electrónicos, desafíos percibidos y aplicación de la tecnología en su entorno cotidiano.

---

## 4. ESPECIFICACIÓN TÉCNICA DEL QR DEL DOCENTE

### 4.1. Flujo de Primer Ingreso y Configuración de Sección
Al escanear el QR o abrir el aplicativo por primera vez, el sistema despliega un asistente intuitivo:
1. **Identificación Básica:** Registro del nombre del docente, institución y año lectivo.
2. **Definición del Grupo:** Selección o escritura de la sección (ejemplo: `9-1`, `9-2`, `9-3`).
3. **Carga de Nómina de Estudiantes:**
   * **Carga por Archivo Excel (`.xlsx` / `.xls`):** Detección automática de columnas de Apellidos, Nombre y Cédula.
   * **Carga por Archivo CSV / Texto:** Importación delimitada por comas o saltos de línea.
   * **Pegado Directo:** Cuadro de texto para copiar y pegar la lista desde el sistema institucional o lista manual.

### 4.2. Sincronización y Escaneo de Resultados
* El docente pulsa el botón **«Escanear Estudiante»**, activando la cámara del dispositivo de forma 100% local.
* Al leer el QR generado por la WebApp del alumno, los 10 reactivos cognoscitivos y la autoevaluación se vinculan al estudiante seleccionado en la nómina.

### 4.3. Rúbrica de Observación Docente Integrada
En la misma ficha del alumno, el docente evalúa los rubros correspondientes a la mediación presencial:
* **Dimensión Psicomotora (6 indicadores):**
  * Correcta manipulación de herramientas e instrumentos de medición.
  * Conexionado seguro de componentes sin riesgo de cortocircuito.
  * Destreza en el ensamble físico en protoboard.
  * Seguimiento de esquemas y diagramas pictóricos.
  * Hábitos de orden y limpieza en el puesto de trabajo.
  * Ejecución autónoma de procedimientos técnicos.
* **Dimensión Socioafectiva (7 indicadores):**
  * Disposición para el trabajo colaborativo y escucha activa.
  * Respeto a las normas de seguridad del laboratorio.
  * Cuidado responsable del equipo y materiales asignados.
  * Perseverancia ante errores y resolución constructiva de problemas.
  * Actitud ética y uso responsable de recursos tecnológicos.
  * Comunicación asertiva con sus pares y el docente.
  * Puntualidad y compromiso con las tareas asignadas.

*Dispone de opciones rápidas: "Marcar Todos Logrados", "En Proceso" o calificación granular de 1 clic.*

---

## 5. GUÍA MULTIPLATAFORMA: INSTALACIÓN COMO APLICACIÓN (PWA)

Tanto para el estudiante como para el docente, la herramienta incluye un instructivo interactivo para añadir el recurso a la pantalla de inicio y utilizarlo como aplicación nativa sin barras de navegación:

| Sistema Operativo | Navegador Recomendado | Procedimiento de Instalación |
| :--- | :--- | :--- |
| **Android (Celulares y Tablets)** | Google Chrome | 1. Tocar el menú de tres puntos (**⋮**) arriba a la derecha.<br>2. Seleccionar **«Agregar a la pantalla principal»** o **«Instalar aplicación»**.<br>3. Confirmar en **«Instalar»**. |
| **iOS (iPhone e iPad)** | Apple Safari | 1. Tocar el botón de **Compartir** (**⎋** con flecha hacia arriba) en la barra inferior.<br>2. Deslizar hacia abajo y pulsar **«Agregar al inicio»** (**⊞**).<br>3. Tocar **«Agregar»** en la esquina superior derecha. |
| **Windows / Mac (Computadoras)** | Google Chrome o Microsoft Edge | 1. Ubicar el ícono de instalación (**⊕** o monitor con flecha) en la barra de direcciones.<br>2. Hacer clic en **«Instalar Aplicativo Diagnóstico»**.<br>3. Se generará un acceso directo en el escritorio y menú inicio. |

---

## 6. SISTEMATIZACIÓN GRUPAL Y REPORTABILIDAD

Una vez finalizada la aplicación diagnóstica de la sección, el aplicativo genera automáticamente:

1. **Semáforo de Logro Integral por Sección:**
   * **Consolidado (Verde):** Porcentaje de estudiantes con dominio autónomo de saberes y destrezas.
   * **En Desarrollo (Amarillo):** Porcentaje de estudiantes que requieren mediación pedagógica focalizada.
   * **Acompañamiento Requerido (Rojo):** Porcentaje de estudiantes que demandan apoyos curriculares o adaptaciones específicas.
2. **Analítica Reactivo por Reactivo:** Gráfica de calor que identifica cuáles contenidos (ej. Ley de Ohm, polaridad, sensores) presentaron mayor índice de dificultad en el grupo.
3. **QR de Sistematización Grupal:** Código QR único que condensa el reporte ejecutivo de la sección para ser escaneado por asesores pedagógicos, directores o para respaldo institucional.
4. **Exportación a Hoja de Cálculo Excel (`.xlsx`):** Matriz oficial con la nómina completa, desglose de reactivos cognoscitivos, puntajes psicomotores, socioafectivos y nivel de logro final por estudiante.

---

### Instrucciones para Uso en Google Docs:
> Este documento se encuentra listo para ser seleccionado, copiado (`Ctrl + C`) y pegado directamente (`Ctrl + V`) en un nuevo documento de **Google Docs** manteniendo su jerarquía de encabezados, tablas, viñetas y formato estructurado.
