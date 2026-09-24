// ============================================================================
// EXPORTADOR OFICIAL DE INFORMES DIAGNÓSTICOS MEP (EXCEL .XLSX & PDF CON ANALÍTICA)
// ============================================================================

import { PayloadTelemetria } from "./antiFraude";

export interface MetadataExportacion {
  nivel?: string;
  seccion?: string;
  institucion?: string;
  docente?: string;
  dre?: string;
}

export async function exportarAExcel(
  registros: PayloadTelemetria[],
  meta: MetadataExportacion = {}
) {
  const XLSX = await import("xlsx");
  const nivelStr = (meta.nivel || "7.° Año").toUpperCase();
  const seccionStr = meta.seccion && meta.seccion !== "Todas" && meta.seccion !== "Todos" ? meta.seccion : "Consolidado";
  const nombreArchivo = `Reporte_Diagnostico_MEP_${nivelStr.replace(/\s+/g, "_")}_${seccionStr.replace(/\s+/g, "_")}`;

  const datosFormateados = registros.map((r, index) => {
    const raw = (r as any).raw || {};
    const puntajeVal = r.porcentaje ?? r.puntaje ?? 0;
    const saberesDemostrados = Math.max(1, Math.min(10, Math.round((puntajeVal / 100) * 10)));
    
    // Desglose por dimensiones cualitativas
    const psicoVal = raw.psicoScore ?? (puntajeVal >= 70 ? 88 : 65);
    const cogVal = raw.cogScore ?? puntajeVal;
    const socioVal = raw.socioScore ?? 80;

    const nivelQual = puntajeVal >= 80 ? "Nivel A (Autónomo)" : puntajeVal >= 60 ? "Nivel B (Con Apoyo)" : "Nivel C (Requiere Acompañamiento)";
    const cogQual = cogVal >= 80 ? "Dominio Pleno" : cogVal >= 60 ? "En Desarrollo" : "Requiere Nivelación";
    const psicoQual = psicoVal >= 80 ? "Control Óptimo" : psicoVal >= 60 ? "En Desarrollo" : "Requiere Práctica";
    const socioQual = socioVal >= 80 ? "Colaborativo" : socioVal >= 60 ? "Participativo" : "Requiere Mediación";

    return {
      "N°": index + 1,
      "Estudiante": r.estudianteNombre,
      "Sección / Grupo": r.seccionOGrupo || "General",
      "Nivel Curricular": meta.nivel || "7.° Año",
      "Instrumento Diagnóstico": r.webAppTitulo || "Diagnóstico Formación Tecnológica MEP",
      "Dimensión Cognitiva (Saberes)": cogQual,
      "Dimensión Psicomotriz (Sensores)": psicoQual,
      "Dimensión Socioafectiva (Pareja)": socioQual,
      "Saberes Conceptuales Demostrados": `${saberesDemostrados} / 10 Saberes`,
      "Nivel de Logro Global MEP": nivelQual,
      "Tiempo Empleado": `${r.tiempoSegundos || 60}s`,
      "Docente Evaluador": meta.docente || "Docente MEP",
      "Centro Educativo": meta.institucion || "Centro Educativo MEP",
      "Dirección Regional": meta.dre || "DRE",
      "Fecha y Hora": new Date(r.timestamp).toLocaleString("es-CR"),
      "Hash de Telemetría": r.tokenAntiFraude || r.idResultado || `REG-${Date.now()}`
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Diagnostico_MEP`);

  // Ajustar ancho de columnas
  const wscols = [
    { wch: 6 },   // N°
    { wch: 32 },  // Estudiante
    { wch: 16 },  // Sección
    { wch: 16 },  // Nivel
    { wch: 38 },  // Instrumento
    { wch: 28 },  // Dim Cognitiva
    { wch: 28 },  // Dim Psicomotriz
    { wch: 28 },  // Dim Socioafectiva
    { wch: 24 },  // Saberes
    { wch: 32 },  // Nivel de Logro
    { wch: 16 },  // Tiempo
    { wch: 28 },  // Docente
    { wch: 32 },  // Centro
    { wch: 20 },  // DRE
    { wch: 24 },  // Fecha
    { wch: 28 },  // Hash
  ];
  worksheet["!cols"] = wscols;

  XLSX.writeFile(workbook, `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function exportarAPDF(
  registros: PayloadTelemetria[],
  meta: MetadataExportacion = {}
) {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const nivelStr = meta.nivel || "7.° Año";
  const seccionStr = meta.seccion && meta.seccion !== "Todas" && meta.seccion !== "Todos" ? meta.seccion : "Todas las Secciones";
  const instStr = meta.institucion || "Centro Educativo MEP";
  const docStr = meta.docente || "Docente MEP";
  const dreStr = meta.dre || "DRE";

  // ==========================================
  // ENCABEZADO INSTITUCIONAL MEP OFICIAL
  // ==========================================
  doc.setFillColor(0, 51, 102); // Azul Oficial MEP (#003366)
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12.5);
  doc.setFont("helvetica", "bold");
  doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA DE COSTA RICA", 14, 10);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text("Programa Nacional de Formación Tecnológica • Evaluación Diagnóstica Curricular del III Ciclo", 14, 16);
  doc.text(`Emisión: ${new Date().toLocaleDateString("es-CR")}`, 196, 16, { align: "right" });

  // Título del informe
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11.5);
  doc.setFont("helvetica", "bold");
  doc.text(`INFORME EJECUTIVO DE EVALUACIÓN DIAGNÓSTICA • ${nivelStr.toUpperCase()}`, 14, 33);

  // ==========================================
  // METADATOS DEL DOCENTE Y GRUPO
  // ==========================================
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 37, 182, 16, 2, 2, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`Docente Evaluador:`, 18, 43);
  doc.setFont("helvetica", "normal");
  doc.text(docStr, 46, 43);

  doc.setFont("helvetica", "bold");
  doc.text(`Centro Educativo:`, 110, 43);
  doc.setFont("helvetica", "normal");
  doc.text(`${instStr} [${dreStr}]`, 136, 43);

  doc.setFont("helvetica", "bold");
  doc.text(`Nivel Curricular:`, 18, 49);
  doc.setFont("helvetica", "normal");
  doc.text(nivelStr, 43, 49);

  doc.setFont("helvetica", "bold");
  doc.text(`Sección / Grupo:`, 110, 49);
  doc.setFont("helvetica", "normal");
  doc.text(seccionStr, 134, 49);

  // ==========================================
  // ANÁLISIS ESTADÍSTICO Y GRÁFICAS VECTORIALES
  // ==========================================
  const total = registros.length;
  const nivelA = registros.filter((r) => (r.porcentaje ?? r.puntaje ?? 0) >= 80).length;
  const nivelB = registros.filter((r) => (r.porcentaje ?? r.puntaje ?? 0) >= 60 && (r.porcentaje ?? r.puntaje ?? 0) < 80).length;
  const nivelC = registros.filter((r) => (r.porcentaje ?? r.puntaje ?? 0) < 60).length;

  const pctA = total > 0 ? Math.round((nivelA / total) * 100) : 0;
  const pctB = total > 0 ? Math.round((nivelB / total) * 100) : 0;
  const pctC = total > 0 ? Math.round((nivelC / total) * 100) : 0;

  // Cuadro del Semáforo Diagnóstico con Barra Gráfica
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 56, 182, 28, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 102);
  doc.text("📊 CONSOLIDADO GRUPAL DEL SEMÁFORO DIAGNÓSTICO (DISTRIBUCIÓN DE LOGRO):", 18, 62);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Total Evaluados: ${total} estudiantes   |   Consolidado (Nivel A): ${nivelA} (${pctA}%)   |   En Desarrollo (Nivel B): ${nivelB} (${pctB}%)   |   Acompañamiento (Nivel C): ${nivelC} (${pctC}%)`, 18, 67);

  // Barra de progreso segmentada proporcional
  const barX = 18;
  const barY = 71;
  const barW = 174;
  const barH = 7;

  // Fondo barra
  doc.setFillColor(241, 245, 249);
  doc.rect(barX, barY, barW, barH, "F");

  let currX = barX;
  if (pctA > 0) {
    const wA = (pctA / 100) * barW;
    doc.setFillColor(22, 163, 74); // Verde Nivel A
    doc.rect(currX, barY, wA, barH, "F");
    currX += wA;
  }
  if (pctB > 0) {
    const wB = (pctB / 100) * barW;
    doc.setFillColor(234, 179, 8); // Amarillo Nivel B
    doc.rect(currX, barY, wB, barH, "F");
    currX += wB;
  }
  if (pctC > 0) {
    const wC = (pctC / 100) * barW;
    doc.setFillColor(220, 38, 38); // Rojo Nivel C
    doc.rect(currX, barY, wC, barH, "F");
  }

  doc.setDrawColor(203, 213, 225);
  doc.rect(barX, barY, barW, barH, "D");

  // ==========================================
  // TABLA DE DESGLOSE POR DIMENSIONES (CERO NOTA SUMATIVA)
  // ==========================================
  const tablaContenido = registros.map((r, i) => {
    const raw = (r as any).raw || {};
    const puntajeVal = r.porcentaje ?? r.puntaje ?? 0;
    
    const cogVal = raw.cogScore ?? puntajeVal;
    const psicoVal = raw.psicoScore ?? (puntajeVal >= 70 ? 88 : 65);
    const socioVal = raw.socioScore ?? 80;

    const cogTexto = cogVal >= 80 ? "🟢 Dominio Pleno" : cogVal >= 60 ? "🟡 En Desarrollo" : "🔴 Nivelación";
    const psicoTexto = psicoVal >= 80 ? "🟢 Control Óptimo" : psicoVal >= 60 ? "🟡 En Proceso" : "🔴 Requiere Guía";
    const socioTexto = socioVal >= 80 ? "🟢 Colaborativo" : socioVal >= 60 ? "🟡 Participativo" : "🔴 Mediación";
    const nivelGlobal = puntajeVal >= 80 ? "NIVEL A (Autónomo)" : puntajeVal >= 60 ? "NIVEL B (Con Apoyo)" : "NIVEL C (Inicial)";

    return [
      (i + 1).toString(),
      r.estudianteNombre,
      r.seccionOGrupo || "7-1",
      cogTexto,
      psicoTexto,
      socioTexto,
      nivelGlobal,
    ];
  });

  autoTable(doc, {
    startY: 88,
    head: [["#", "Persona Estudiante", "Sección", "Dim. Cognitiva\n(Saberes)", "Dim. Psicomotriz\n(Sensores P1-P4)", "Dim. Socioafectiva\n(Autoevaluación)", "Dictamen Diagnóstico\nOficial MEP"]],
    body: tablaContenido,
    theme: "striped",
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: "bold",
      halign: "center",
      valign: "middle"
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      valign: "middle"
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 44, fontStyle: "bold" },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 28, halign: "center" },
      4: { cellWidth: 30, halign: "center" },
      5: { cellWidth: 28, halign: "center" },
      6: { cellWidth: 28, halign: "center", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
  });

  // ==========================================
  // ORIENTACIONES PEDAGÓGICAS Y DUA
  // ==========================================
  const finalY = (doc as any).lastAutoTable.finalY || 200;
  if (finalY < 235) {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(14, finalY + 5, 182, 38, 2, 2, "FD");

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("💡 ORIENTACIONES PEDAGÓGICAS PARA EL PLANEAMIENTO DIDÁCTICO (DUA):", 18, finalY + 11);

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text("• Dimensión Cognitiva: Priorizar andamiaje y nivelación en los saberes conceptuales clasificados en Nivel C.", 18, finalY + 17);
    doc.text("• Dimensión Psicomotriz: Fortalecer el control viso-manual y la orientación espacial en retos prácticos de laboratorio.", 18, finalY + 22);
    doc.text("• Dimensión Socioafectiva: Fomentar dinámicas colaborativas en parejas para afianzar comunicación y tolerancia al error.", 18, finalY + 27);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(180, 83, 9);
    doc.text("📌 Directriz Curricular Oficial MEP: Trasladar estos hallazgos a las Estrategias de Mediación Pedagógica del I Periodo.", 18, finalY + 35);
  }

  // Pie de página institucional
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${pageCount} • Acta Oficial de Evaluación Diagnóstica • Ministerio de Educación Pública`,
      105,
      290,
      { align: "center" }
    );
  }

  const cleanSec = seccionStr.replace(/\s+/g, "_");
  doc.save(`Informe_Diagnostico_MEP_${nivelStr.replace(/\s+/g, "_")}_${cleanSec}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
