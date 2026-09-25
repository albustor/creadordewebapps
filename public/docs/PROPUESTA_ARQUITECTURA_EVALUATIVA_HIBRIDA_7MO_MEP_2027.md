# Arquitectura de evaluación diagnóstica híbrida para 7.° año (triangulación formativa MEP 2027)
**Programa Nacional de Formación Tecnológica (PNFT) • Módulo 1: CyberQuest 7.° (Misión en parejas)**  
*Ministerio de Educación Pública de Costa Rica • Dirección de Recursos Tecnológicos en Educación (DRTE)*  
*Departamento de Investigación, Desarrollo e Implementación (IDI)*

**Elaborado por:** Allan Morera Araya y Alberto Bustos Ortega  
**Fecha de emisión:** Febrero 2027  
**Versión del documento:** Versión oficial consolidada 1.0 — Enfoque híbrido triangulado para 7.° año

---

## 1. Resumen ejecutivo y diagnóstico del estado actual en 7.° año

En el nivel de séptimo año de secundaria (III Ciclo), la evaluación diagnóstica del **Módulo 1: Fundamentos de algoritmos, pensamiento computacional y trabajo colaborativo** se implementó inicialmente bajo una modalidad en parejas (*Líder y copiloto*) con alta gamificación (*CyberQuest 7.°*).

### Situación actual y oportunidades de mejora identificadas
1. **Sobredependencia de la automatización algorítmica:** La versión preliminar pretende calificar de forma $100\%$ automatizada no solo el área cognoscitiva, sino también el área psicomotora (movimientos en cuadrícula, tiempos de reacción de semáforo) y el área socioafectiva (escalas Likert rígidas).
2. **Riesgo de falsos negativos por barreras de interfaz:** Un estudiante de 7.° año que ingresa por primera vez a la secundaria puede experimentar dificultades con el uso del panel táctil o el ratón en la cuadrícula de navegación, lo cual un algoritmo califica erróneamente como *«falta de razonamiento algorítmico»*, cuando en realidad es una limitación de motricidad fina o adaptación tecnológica.
3. **Ausencia de mediación formativa en el trabajo por parejas:** Al evaluar la colaboración únicamente mediante clics, el sistema no detecta si un estudiante acapara el dispositivo y anula la participación del copiloto, o si existe una dinámica de apoyo mutuo genuina.

### La solución: Implementación del modelo híbrido triangulado
Al igual que en noveno año, se propone estructurar la **Herramienta de Diagnóstico Estudiantes para 7.° año** bajo el principio de **Triangulación Formativa de tres fuentes convergentes**:

```mermaid
flowchart TD
    subgraph Fuentes ["Tres fuentes de evidencia convergentes (7.° año)"]
        F1["💻 Fuente 1: Telemetría algorítmica<br><b>(Métricas objetivas de interacción)</b><br>• Trazado de rutas y secuencias en cuadrícula<br>• Vector cognitivo de 10 reactivos oficiales<br>• Latencia de respuesta y micro-reintentos"]
        F2["❤️ Fuente 2: Autopercepción metacognitiva<br><b>(Reflexión en parejas: Líder y Copiloto)</b><br>• Distribución de roles y escucha activa<br>• Tolerancia a la frustración ante el bloqueo<br>• Resiliencia y aprendizaje del error"]
        F3["👨‍🏫 Fuente 3: Observación docente cualitativa<br><b>(Criterio pedagógico en aula)</b><br>• Dinámica real de interacción en el pupitre<br>• Manipulación motriz y postura ergonómica<br>• Contención socioafectiva y mediación DUA"]
    end

    Fuentes --> Panel["📊 Panel docente en tiempo real<br><b>(Matriz de triangulación y radar de alertas)</b>"]
    Panel --> Salidas["📄 Instrumentos y reportes oficiales<br>• Acta oficial de diagnóstico (Excel / PDF)<br>• Plan de nivelación diferenciada DUA para 7.° año<br>• Reporte institucional de cohorte"]
```

---

## 2. El radar pedagógico en tiempo real para 7.° año

En el laboratorio de informática, el docente visualiza en su panel las alertas generadas por la interacción de las parejas de 7.° año:

```mermaid
flowchart LR
    A["💻 Patrón telemétrico en la cuadrícula/canvas<br>(Clics erráticos / Estancamiento >2 min / Bucle infinito)"] --> B["⚠️ Alerta en el panel docente<br>(Insignia amarilla: 'Posible bloqueo o monopolio de rol')"]
    B --> C["👨‍🏫 Intervención pedagógica del docente<br>(Se acerca a la pareja para observar la dinámica)"]
    C --> D["📝 Calificación ajustada por excepción<br>(Nivel A, B o C según el desempeño observado)"]
```

### Indicadores telemétricos específicos para 7.° año:
1. **Alerta de bucle o desorientación espacial:** El robot en la cuadrícula gira sobre sí mismo más de 6 veces sin avanzar hacia el objetivo.
2. **Alerta de estancamiento en el reto procedimental:** La pareja permanece inactiva por más de 2.5 minutos en la fase de trazado o selección de bloques.
3. **Alerta de discrepancia de roles:** Tasa de interacción desbalanceada donde solo uno de los dos integrantes interactúa con la pantalla mientras el otro permanece pasivo.

---

## 3. Desglose de áreas evaluadas: Máquina y docente en 7.° año

### 🧠 Dimensión 1: Área cognoscitiva (100% tecnológico)
* **Contenidos evaluados:** Concepto de algoritmo, secuencias ordenadas, reconocimiento de patrones, noción de variable y modelo entrada-proceso-salida (E-P-S).
* **Mecanismo:** 10 reactivos oficiales de opción múltiple calificados de forma instantánea ($0\%$ a $100\%$) con vector de aciertos.
* **Escala oficial:**
  * **Avanzado:** $\ge 80\%$
  * **Intermedio:** $60\% - 79\%$
  * **Inicial:** $\le 59\%$

---

### 🖐️ Dimensión 2: Área psicomotora y procedimental (Modelo híbrido)

| Criterio | ¿Quién lo evalúa? | ¿Qué se evalúa en 7.° año? |
| :--- | :---: | :--- |
| **P1. Orientación espacial y secuenciación** | 🤖 **Telemetría** | Trazado de trayectorias (adelante, giro izquierda, giro derecha) evitando obstáculos hacia el servidor. |
| **P2. Coordinación visomotriz y tiempos de reacción** | 🤖 **Telemetría** | Respuesta ante eventos dinámicos temporizados (reto de semáforo tecnológico). |
| **P3. Precisión en el uso de periféricos (Mouse/Touchpad)** | 👨‍🏫 **Docente (Observable)** | Manejo fluido del puntero, coordinación mano-ojo y ausencia de temblor o torpeza por falta de hábito. |
| **P4. Disposición ordenada y postura en el equipo** | 👨‍🏫 **Docente (Observable)** | Postura ergonómica en la silla, distancia a la pantalla y uso adecuado del teclado y ratón. |

---

### ❤️ Dimensión 3: Área socioafectiva (Modelo híbrido triangulado)

| Criterio | ¿Quién lo evalúa? | ¿Qué se evalúa en 7.° año? |
| :--- | :---: | :--- |
| **S1. Trabajo colaborativo y alternancia de roles** | 👨‍🏫 **Docente (Observable)** | Si la pareja dialoga antes de pulsar, se alternan el control (líder y copiloto) y respetan los turnos. |
| **S2. Tolerancia a la frustración y gestión emocional** | 👨‍🏫 **Docente (Observable)** | Reacción cuando el robot choca o se equivoca en la secuencia: si se ríen y buscan la solución o se culpan entre sí. |
| **S3. Gusto por la precisión y cuidado del detalle** | 🤖 **Telemetría y estudiante** | Verificación reflexiva en la autoevaluación final y tiempo de comprobación antes de enviar. |
| **S4. Escucha activa y empatía** | 👨‍🏫 **Docente (Observable)** | Apertura para aceptar las ideas del compañero o compañera de mesa ante un desafío de lógica. |

---

## 4. Protocolo de mediación docente y calificación por excepción

El sistema precarga a todas las parejas en **Nivel A (Autónomo por defecto)**. La persona docente solo modifica la calificación cuando su observación en el aula evidencia necesidades formativas particulares:

```mermaid
flowchart TD
    Inicio["Pareja inicia en Nivel A (Base)"] --> Alerta{"¿Se detectó conflicto, bloqueo<br>o frustración en la pareja?"}
    
    Alerta -- "NO (Trabajaron armónicos y fluidos)" --> NivelA["✅ SE MANTIENE EN NIVEL A<br><b>(Autónomo / Logrado)</b><br>• No requiere acción del docente."]
    
    Alerta -- "SÍ (Docente se acerca a la mesa)" --> Intervencion{"¿Cómo responde la pareja ante<br>la mediación pedagógica?"}
    
    Intervencion -- "Con una pregunta orientadora coordinan<br>roles y corrigen el rumbo por sí mismos" --> NivelB["🟡 SE CAMBIA A NIVEL B<br><b>(Con apoyo ocasional / En proceso)</b><br>• 1 clic en el panel."]
    
    Intervencion -- "Manifiestan frustración, bloqueo severo<br>o incapacidad de ponerse de acuerdo" --> NivelC["🔴 SE CAMBIA A NIVEL C<br><b>(Acompañamiento constante / Inicial)</b><br>• 1 clic + Contención emocional DUA."]
```

### Ejemplo pedagógico en 7.° año:
1. **Alerta en el panel:** La pareja conformada por **Sofía (Líder)** y **Mateo (Copiloto)** muestra 9 colisiones consecutivas en el reto de la cuadrícula.
2. **Aproximación docente:** La persona docente observa que Sofía está haciendo clics desesperados mientras Mateo se cruza de brazos molesto (*«Ella no me deja tocar el ratón»*).
3. **Mediación socioafectiva:**
   * El docente **no resuelve el laberinto ni les indica qué flechas presionar**.
   * Hace una pausa de contención: *«Tranquilos, chicos. Recuerden que este diagnóstico no tiene una nota numérica ni se trata de una competencia. Es un espacio para aprender a coordinar ideas. Sofía, cuéntale a Mateo qué camino pensaste; Mateo, ayúdale a verificar si hay algún obstáculo en esa ruta»*.
4. **Determinación del nivel formativo:**
   * **Si retoman el diálogo y colaboran:** El docente asigna **Nivel B** en trabajo colaborativo.
   * **Si persiste el bloqueo emocional o la desconexión total:** El docente asigna **Nivel C** y anota el caso para trabajar habilidades socioafectivas tempranas en el plan DUA de inicio de año.

---

## 5. Comparativa de impacto: Modelo automatizado previo vs. Modelo híbrido propuesto

| Dimensión | Enfoque previo (100% automatizado) | Enfoque híbrido propuesto (MEP 2027) | Beneficio pedagógico |
| :--- | :--- | :--- | :--- |
| **Área cognoscitiva** | 10 reactivos automáticos. | 10 reactivos automáticos con vector cognitivo. | Mantiene rapidez y cálculo en 0 ms. |
| **Área psicomotora** | El algoritmo califica clics de forma aislada. | Telemetría en simulador + observación docente de motricidad y postura. | Elimina falsos negativos causados por inexperiencia con el ratón/touchpad. |
| **Área socioafectiva** | Escalas Likert frías sin contexto. | Autoevaluación formativa + observación de convivencia y contención emocional. | Valora la empatía real, el trabajo en equipo y la resiliencia en el aula. |
| **Carga docente** | El docente no tiene control ni visibilidad cualitativa. | Radar de alertas tempranas + calificación por excepción en 3 clics. | Ahorra tiempo burocrático y focaliza la atención donde hay necesidad real. |

---

## 6. Conclusión y recomendación para los equipos técnicos del MEP

La adopción de este modelo híbrido en 7.° año unifica la visión metodológica en todo el III Ciclo de la Educación Diversificada (7.°, 8.° y 9.° año), asegurando:
* **Coherencia curricular y evaluativa** en el marco de la política educativa del MEP.
* **Transición armónica de primaria a secundaria**, acogiendo a los estudiantes de 7.° con un diagnóstico humanista, motivador y formativo.
* **Respaldo estadístico robusto** para la toma de decisiones institucionales y el diseño de planes de nivelación pedagógica diferenciada.

---

**Dirección de Recursos Tecnológicos en Educación (DRTE) • Ministerio de Educación Pública**  
*Elaborado por: Allan Morera Araya y Alberto Bustos Ortega • Febrero 2027.*
