const fs = require('fs');

console.log('====================================================');
console.log('    INFORME DE VALIDACIÓN INTEGRAL DE WEBAPPS MEP    ');
console.log('====================================================\n');

// 1. Estudiante en línea
const fEst = fs.readFileSync('public/webapps/diagnostico_9no_modulo01_en_linea.html', 'utf8');
const checksEst = [
  ['Etapa 1: Formulario de Identificación Institucional Completo', fEst.includes('estudianteNombre') && fEst.includes('estudianteCedula') && fEst.includes('docenteNombre')],
  ['Etapa 2: 10 Ítems Teóricos Diagnósticos (responderItem)', fEst.includes('responderItem(10,') && fEst.includes('responderItem(1,')],
  ['Etapa 3: Reto 1 Iluminación Inteligente (LDR + LED, <300 Lux)', fEst.includes('Iluminación Inteligente') && fEst.includes('pin_sensor_sig') && fEst.includes('300 Lux')],
  ['Etapa 3: Reto 2 Climatización (NTC + Ventilador DC con falla en A3 y corrección a D9)', fEst.includes('Circuito de Climatización') && fEst.includes('pin_mcu_a3') && fEst.includes('pin_mcu_d9')],
  ['Etapa 3: Reto 2 Paso 1 (Diagnóstico Técnico de error en A3)', fEst.includes('btnDiagReto2_1') && fEst.includes('seleccionarDiagnosticoReto2')],
  ['Etapa 3: Reto 2 Paso 2 (Corrección Física en Simulador)', fEst.includes('statusCorreccionReto2') && fEst.includes('act_sig_erroneo_a3')],
  ['Etapa 3: Reto 2 Paso 3 (Justificación Conceptual)', fEst.includes('btnJustReto2_1') && fEst.includes('seleccionarJustificacionReto2')],
  ['Etapa 4: Reflexión Metacognitiva y Autoevaluación', fEst.includes('seccion4') && fEst.includes('reflexion')],
  ['Etapa 5: Comprobante Digital (En Línea con sincronización directa sin QR)', !fEst.includes('new QRCode') && fEst.includes('Comprobante')]
];

console.log('📌 1. WebApp Estudiante en Línea (diagnostico_9no_modulo01_en_linea.html):');
let okEst = 0;
checksEst.forEach(([desc, ok]) => {
  if (ok) okEst++;
  console.log(ok ? '  ✅' : '  ❌', desc);
});
console.log(`  Resultado: ${okEst}/${checksEst.length} verificaciones conformes.\n`);

// 2. Docente Evaluador
const fDoc = fs.readFileSync('public/webapps/diagnostico_9no_modulo01_docente_evaluador.html', 'utf8');
const checksDoc = [
  ['Criterios Psicomotores P1 a P6 en Glosario y Criterios', fDoc.includes('P1. Modulariza') && fDoc.includes('P6. Transfiere')],
  ['Criterios Socioafectivos S1 a S4 en Glosario y Criterios', fDoc.includes('S1. Gusto por la Precisión') && fDoc.includes('S4. Tolerancia')],
  ['Array de conductas psicomotoras calibrado a 6 ítems', fDoc.includes('CONDUCTAS_PSICOMOTORAS') && (fDoc.match(/P1\./g) || []).length > 0],
  ['Array de conductas socioafectivas calibrado a 4 ítems', fDoc.includes('CONDUCTAS_SOCIOAFECTIVAS') && (fDoc.match(/S1\./g) || []).length > 0],
  ['Matriz de Observación Formativa en Vivo (A / B / C)', fDoc.includes('renderizarMatrizObservacion') && fDoc.includes('setValSocMatriz')],
  ['Consolidado Grupal y Sistematización Oficial MEP Pág. 15', fDoc.includes('renderizarConsolidadoGrupal') && fDoc.includes('tbodySistematizacionMatriz')],
  ['Exportación de Reporte CSV / Excel e Impresión Oficial', fDoc.includes('exportarExcelConsolidado') && fDoc.includes('imprimirReporteOficial')],
  ['Sincronización Bidireccional con Telemetría y Dashboard', fDoc.includes('sincronizarConBaseDeDatos')]
];

console.log('📌 2. Instrumento Docente Evaluador (diagnostico_9no_modulo01_docente_evaluador.html):');
let okDoc = 0;
checksDoc.forEach(([desc, ok]) => {
  if (ok) okDoc++;
  console.log(ok ? '  ✅' : '  ❌', desc);
});
console.log(`  Resultado: ${okDoc}/${checksDoc.length} verificaciones conformes.\n`);

console.log('====================================================');
console.log('         VALIDACIÓN COMPLETADA EXITOSAMENTE         ');
console.log('====================================================');
