"use client";

import React, { useEffect } from "react";

export default function EscanerV4StandalonePage() {
  useEffect(() => {
    window.location.replace("/webapps/v4/escaner_datos_v4.html");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#002b49",
        color: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>📷</div>
      <h2 style={{ fontSize: "19px", fontWeight: 800, margin: "0 0 8px 0", color: "#D4AF5A" }}>
        Escáner Universal de Datos V4 — MEP
      </h2>
      <p style={{ fontSize: "13px", color: "#94a3b8", maxWidth: "420px", lineHeight: "1.5", margin: "0 0 16px 0" }}>
        Cargando aplicativo de escaneo óptico autónomo para pruebas de 7.° y 9.° año...
      </p>
      <a
        href="/webapps/v4/escaner_datos_v4.html"
        style={{
          background: "#059669",
          color: "#ffffff",
          padding: "10px 18px",
          borderRadius: "8px",
          fontSize: "13px",
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Entrar directamente
      </a>
    </div>
  );
}
