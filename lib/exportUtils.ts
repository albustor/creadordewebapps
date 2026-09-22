// ============================================================================
// EXPORTADOR DE REPORTES Y ANALÍTICA (EXCEL .XLSX & PDF OFICIAL)
// ============================================================================

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PayloadTelemetria } from "./antiFraude";

export function exportarAExcel(registros: PayloadTelemetria[], nombreArchivo = "Reporte_Trabajo_Cotidiano_Secundaria") {
  const datosFormateados = registros.map((r, index) => ({
    "N°": index + 1,
    "Estudiante": r.estudianteNombre,
    "Sección / Grupo": r.seccionOGrupo || "Secundaria",
    "Actividad WebApp": r.webAppTitulo,
    "Componente": "Diagnóstico Formativo",
    "Saberes Demostrados": `${r.aciertos ?? Math.round(((r.porcentaje ?? r.puntaje) / 100) * 10)} / 10`,
    "Nivel Formativo": r.nivelLogro,
    "Aciertos": r.aciertos,
    "Fallos": r.fallos,
    "Total Reactivos": r.totalReactivos,
    "Tiempo Empleado (seg)": r.tiempoSegundos,
    "Fecha y Hora": new Date(r.timestamp).toLocaleString("es-CR"),
    "Token Integridad": r.tokenAntiFraude || "Validado-Local",
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trabajo_Cotidiano");

  // Ajustar ancho de columnas
  const wscols = [
    { wch: 6 },
    { wch: 28 },
    { wch: 16 },
    { wch: 30 },
    { wch: 18 },
    { wch: 14 },
    { wch: 16 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
    { wch: 22 },
    { wch: 22 },
    { wch: 25 },
  ];
  worksheet["!cols"] = wscols;

  XLSX.writeFile(workbook, `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportarAPDF(registros: PayloadTelemetria[], tituloReporte = "Informe Oficial de Evidencias de Trabajo Cotidiano (III Ciclo)") {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Encabezado
  doc.setFillColor(0, 51, 102); // Azul institucional
  doc.rect(0, 0, 210, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("CREADOR DE WEBAPPS", 14, 11);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Evidencias de Trabajo Cotidiano - III Ciclo Secundaria (7°, 8° y 9°)", 14, 18);

  doc.text(new Date().toLocaleDateString("es-CR"), 196, 18, { align: "right" });

  // Título del informe
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(tituloReporte, 14, 34);

  // Métricas globales rápidas
  const total = registros.length;
  const promedio = total > 0 ? Math.round(registros.reduce((acc, r) => acc + r.puntaje, 0) / total) : 0;
  const avanzados = registros.filter((r) => r.nivelLogro === "Avanzado").length;
  const intermedios = registros.filter((r) => r.nivelLogro === "Intermedio").length;
  const iniciales = registros.filter((r) => r.nivelLogro === "Inicial").length;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Total Estudiantes: ${total} | Promedio Grupal: ${promedio}% | Avanzado: ${avanzados} | Intermedio: ${intermedios} | Inicial: ${iniciales}`,
    14,
    41
  );

  // Tabla de datos
  const tablaContenido = registros.map((r, i) => [
    (i + 1).toString(),
    r.estudianteNombre,
    r.seccionOGrupo || "General",
    r.webAppTitulo.slice(0, 25),
    `${r.puntaje}%`,
    r.nivelLogro,
    `${r.tiempoSegundos}s`,
  ]);

  autoTable(doc, {
    startY: 46,
    head: [["#", "Estudiante", "Grupo", "Actividad", "Puntaje", "Nivel de Logro", "Tiempo"]],
    body: tablaContenido,
    theme: "striped",
    headStyles: {
      fillColor: [0, 85, 165],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 8.5,
    },
    margin: { left: 14, right: 14 },
  });

  // Sección de Recomendaciones Pedagógicas y Ajustes al Planeamiento Didáctico
  const finalY = (doc as any).lastAutoTable.finalY || 180;
  if (finalY < 230) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 51, 102);
    doc.text("ORIENTACIONES PEDAGÓGICAS Y AJUSTES AL PLANEAMIENTO DIDÁCTICO", 14, finalY + 10);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(
      "1. Saber Conceptual: Afianzar definiciones y modelos abstractos mediante analogías del entorno inmediato para estudiantes en nivel Inicial.",
      14,
      finalY + 16
    );
    doc.text(
      "2. Saber Procedimental: Diseñar estaciones de andamiaje y descomposición de retos en micro-pasos guiados.",
      14,
      finalY + 22
    );
    doc.text(
      "3. Saber Actitudinal: Fomentar la perseverancia y el valor del error en la simulación como oportunidad de aprendizaje.",
      14,
      finalY + 28
    );
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 53, 15);
    doc.text(
      "Directriz Curricular: Trasladar estas evidencias directamente a las Estrategias de Mediación del planeamiento de aula.",
      14,
      finalY + 35
    );
  }

  // Pie de página
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${pageCount} • Documento generado automáticamente por Creador de WebApps`,
      105,
      290,
      { align: "center" }
    );
  }

  doc.save(`Informe_Telemetria_${new Date().toISOString().slice(0, 10)}.pdf`);
}
