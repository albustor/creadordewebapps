// ============================================================================
// GENERADOR DE INFORME EJECUTIVO NACIONAL EN PDF OFICIAL (MEP COSTA RICA)
// Soporta jsPDF + jspdf-autotable con membrete institucional, tablas y firma
// ============================================================================

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface DatosInformeMacro {
  titulo: string;
  nivel: string;
  fecha: string;
  totalInstituciones: number;
  totalEstudiantes: number;
  eval7mo: number;
  eval9no: number;
  promedioNacional: number;
  cobertura: number;
  brechaCritica: string;
  indicadores: Array<{
    codigo: string;
    nombre: string;
    subarea: string;
    peso: number;
    pctLogro: number;
    estado: string;
  }>;
  dreResumen: Array<{
    codigo: string;
    nombre: string;
    colegios: number;
    estudiantes: number;
    estado: string;
  }>;
  analisisIA?: {
    tituloDictamen?: string;
    diagnosticoGeneral?: string;
    focosCriticos?: string[];
    orientacionesPedagogicas?: string[];
  };
}

export function exportarInformeEjecutivoPDF(datos: DatosInformeMacro) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;

  // 1. Franja Superior Institucional MEP (Azul y Verde Oficial)
  doc.setFillColor(31, 63, 120); // Azul MEP #1F3F78
  doc.rect(0, 0, pageWidth, 22, "F");

  doc.setFillColor(4, 120, 87); // Verde #047857
  doc.rect(0, 22, pageWidth, 2.5, "F");

  // Membrete Superior
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA", marginX, 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Dirección de Desarrollo Curricular • Asesoría Nacional de Formación Tecnológica", marginX, 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("OBSERVATORIO NACIONAL III CICLO", pageWidth - marginX - 58, 10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generado: ${datos.fecha}`, pageWidth - marginX - 58, 16);

  let currentY = 32;

  // 2. Título Principal
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("INFORME EJECUTIVO NACIONAL DE EVALUACIÓN DIAGNÓSTICA", marginX, currentY);

  currentY += 6;
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Instrumentos de Formación Tecnológica: ${datos.nivel}`, marginX, currentY);

  currentY += 8;

  // 3. Tarjetas / Cuadro de Resumen Ejecutivo de Métricas
  const anchoCard = (pageWidth - marginX * 2 - 9) / 4;
  const altoCard = 18;

  const kpis = [
    { label: "INSTITUCIONES", val: `${datos.totalInstituciones}`, sub: `${datos.cobertura}% Cobertura` },
    { label: "ESTUDIANTES EVALUADOS", val: `${datos.totalEstudiantes}`, sub: `7°: ${datos.eval7mo} | 9°: ${datos.eval9no}` },
    { label: "PROMEDIO NACIONAL", val: `${datos.promedioNacional}%`, sub: "Logro Consolidado" },
    { label: "BRECHA CRÍTICA", val: datos.brechaCritica, sub: "Prioridad de Aula" },
  ];

  kpis.forEach((kpi, idx) => {
    const x = marginX + idx * (anchoCard + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, anchoCard, altoCard, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3, currentY + 5);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, x + 3, currentY + 11);

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(kpi.sub, x + 3, currentY + 15.5);
  });

  currentY += altoCard + 8;

  // 4. Dictamen o Resumen Pedagógico (si existe análisis de IA o predeterminado)
  if (datos.analisisIA && datos.analisisIA.diagnosticoGeneral) {
    doc.setFillColor(240, 253, 244); // Fondo verde claro
    doc.setDrawColor(187, 247, 208);
    const boxHeight = 28;
    doc.roundedRect(marginX, currentY, pageWidth - marginX * 2, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(22, 101, 52);
    doc.text("DICTAMEN CURRICULAR Y ORIENTACIÓN DE MEDIACIÓN NACIONAL:", marginX + 4, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    const lineasTexto = doc.splitTextToSize(datos.analisisIA.diagnosticoGeneral, pageWidth - marginX * 2 - 8);
    doc.text(lineasTexto.slice(0, 4), marginX + 4, currentY + 12);

    currentY += boxHeight + 6;
  }

  // 5. Tabla de Matriz de Indicadores Oficiales
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("MATRIZ DE INDICADORES Y SABERES PREVIOS AUDITADOS", marginX, currentY);

  currentY += 3;

  const filasIndicadores = datos.indicadores.map((ind, i) => [
    `${i + 1}`,
    ind.codigo,
    ind.nombre,
    ind.subarea,
    `${ind.peso} pts`,
    `${ind.pctLogro}%`,
    ind.estado,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["N°", "Código", "Indicador Oficial MEP", "Subárea Curricular", "Peso", "% Logro", "Estado"]],
    body: filasIndicadores,
    theme: "grid",
    headStyles: {
      fillColor: [31, 63, 120],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 16, fontStyle: "bold" },
      2: { cellWidth: 65 },
      3: { cellWidth: 45 },
      4: { cellWidth: 12, halign: "center" },
      5: { cellWidth: 15, halign: "center", fontStyle: "bold" },
      6: { cellWidth: 26 },
    },
    margin: { left: marginX, right: marginX },
  });

  // Pie de Página y Firma Institucional
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Línea de pie
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, 260, pageWidth - marginX, 260);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text("Alberto Bustos Ortega", marginX, 266);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Asesor Nacional de Formación Tecnológica • Administrador General MEP", marginX, 270);

    doc.text(
      `Página ${i} de ${totalPages} • Plataforma Oficial de Diagnóstico Secundaria MEP 2027`,
      pageWidth - marginX - 75,
      270
    );
  }

  // Guardar archivo
  doc.save(`Informe_Ejecutivo_Nacional_MEP_III_Ciclo_${new Date().toISOString().split("T")[0]}.pdf`);
}
