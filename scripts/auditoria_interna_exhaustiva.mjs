import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3001';

const results = {
  apis: [],
  pages: [],
  webapps: [],
  databaseOperations: [],
  issuesFound: [],
  passedChecks: []
};

function log(section, msg, status = 'INFO') {
  const color = status === 'PASS' ? '\x1b[32m' : status === 'FAIL' ? '\x1b[31m' : status === 'WARN' ? '\x1b[33m' : '\x1b[34m';
  console.log(`${color}[${section}] [${status}]\x1b[0m ${msg}`);
}

async function auditAPIs() {
  console.log('\n--- 1. AUDITORÍA EXHAUSTIVA DE ENDPOINTS Y BASE DE DATOS LOCAL/SERVIDOR ---');
  
  // 1.1 /api/cron/verificador-modelos-ia
  try {
    const res = await fetch(`${BASE_URL}/api/cron/verificador-modelos-ia`);
    const data = await res.json();
    if (res.ok && data.success && data.auditoria) {
      log('API-CRON', `Cron IA operativo. Modelos auditados: ${data.auditoria.totalModelosAuditados}. Operativos: ${data.auditoria.operativos}`, 'PASS');
      results.apis.push({ endpoint: '/api/cron/verificador-modelos-ia', status: 'PASS' });
    } else {
      log('API-CRON', `Respuesta inesperada: ${JSON.stringify(data)}`, 'FAIL');
      results.issuesFound.push('Endpoint /api/cron/verificador-modelos-ia no devolvió éxito');
    }
  } catch (e) {
    log('API-CRON', `Error al consultar: ${e.message}`, 'FAIL');
    results.issuesFound.push(`Error en /api/cron/verificador-modelos-ia: ${e.message}`);
  }

  // 1.2 /api/admin/usuarios (GET)
  let initialUsersCount = 0;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/usuarios`);
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.usuarios)) {
      initialUsersCount = data.usuarios.length;
      log('API-ADMIN-USUARIOS', `Usuarios recuperados: ${initialUsersCount}. SuperAdmin: ${data.superAdmin}`, 'PASS');
      results.apis.push({ endpoint: '/api/admin/usuarios [GET]', status: 'PASS' });
    } else {
      log('API-ADMIN-USUARIOS', `Fallo al obtener usuarios: ${JSON.stringify(data)}`, 'FAIL');
      results.issuesFound.push('Endpoint /api/admin/usuarios GET falló');
    }
  } catch (e) {
    log('API-ADMIN-USUARIOS', `Error en GET usuarios: ${e.message}`, 'FAIL');
  }

  // 1.3 /api/admin/usuarios (POST: Crear, Aprobar y Eliminar Usuario para auditar ciclo de vida DB)
  const testUserId = `TEST-USER-${Date.now()}`;
  try {
    // A) Registro de usuario de prueba
    const resReg = await fetch(`${BASE_URL}/api/admin/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accion: 'solicitar_registro',
        usuarioData: {
          id: testUserId,
          nombreCompleto: 'Prof. Auditor Pruebas',
          correoInstitucional: 'auditor.pruebas@mep.go.cr',
          cedula: '1-9999-8888',
          telefono: '+506 8888-0000',
          dreCodigo: 'DRE-01',
          dreNombre: 'San José Central',
          circuito: 'Circuito 01',
          institucionNombre: 'Liceo Auditoría Test',
          rol: 'Docente'
        }
      })
    });
    const dataReg = await resReg.json();
    if (dataReg.success) {
      log('DB-USUARIOS-CREAR', `Usuario de prueba creado con éxito (${dataReg.usuario?.id})`, 'PASS');
    } else {
      log('DB-USUARIOS-CREAR', `Fallo al registrar usuario de prueba: ${JSON.stringify(dataReg)}`, 'WARN');
    }

    // B) Borrado / Eliminación de usuario en base de datos
    const resDel = await fetch(`${BASE_URL}/api/admin/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accion: 'eliminar',
        idUsuario: dataReg.usuario?.id || testUserId,
        validadorCorreo: 'alberto.bustos.ortega@mep.go.cr',
        motivo: 'Prueba de auditoría de borrado en DB'
      })
    });
    const dataDel = await resDel.json();
    if (dataDel.success) {
      log('DB-USUARIOS-ELIMINAR', `Usuario de prueba eliminado con éxito de la base de datos`, 'PASS');
      results.databaseOperations.push({ op: 'eliminar_usuario', status: 'PASS' });
    } else {
      log('DB-USUARIOS-ELIMINAR', `Fallo al eliminar usuario: ${JSON.stringify(dataDel)}`, 'FAIL');
      results.issuesFound.push(`Fallo al eliminar usuario en /api/admin/usuarios: ${dataDel.error}`);
    }
  } catch (e) {
    log('DB-USUARIOS', `Error en ciclo de usuario: ${e.message}`, 'FAIL');
  }

  // 1.4 /api/telemetria/enviar (POST, GET, DELETE)
  const testEstudiante = `Estudiante Audit Test ${Date.now()}`;
  const testTimestamp = Date.now();
  try {
    // A) Enviar registro de telemetría
    const resTelPost = await fetch(`${BASE_URL}/api/telemetria/enviar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webAppId: 'diagnostico_7mo_modulo01_cyberquest',
        webAppTitulo: 'CyberQuest 7°: Diagnóstico de Fundamentos Digitales',
        docenteId: 'ASESOR-FT-7729',
        docenteCedula: '5-0305-0179',
        docenteNombre: 'Alberto Bustos Ortega',
        docenteEmail: 'alberto.bustos.ortega@mep.go.cr',
        institucionNombre: 'Liceo de Pruebas MEP',
        dreCodigo: 'DRE-01',
        estudianteNombre: testEstudiante,
        seccionOGrupo: 'Sección 7-1',
        nivel: '7°',
        puntaje: 90,
        puntajeMaximo: 100,
        porcentaje: 90,
        totalReactivos: 10,
        aciertos: 9,
        fallos: 1,
        nivelLogro: 'Avanzado',
        tiempoSegundos: 95,
        estadoProgreso: 'completado',
        timestamp: testTimestamp,
        tokenAntiFraude: `TOKEN-TEST-${testTimestamp}`
      })
    });
    const dataTelPost = await resTelPost.json();
    if (dataTelPost.success) {
      log('DB-TELEMETRIA-INSERTAR', `Registro de telemetría insertado (${testEstudiante})`, 'PASS');
    } else {
      log('DB-TELEMETRIA-INSERTAR', `Fallo al insertar telemetría: ${JSON.stringify(dataTelPost)}`, 'FAIL');
      results.issuesFound.push('Inserción de telemetría en /api/telemetria/enviar falló');
    }

    // B) Consultar registro
    const resTelGet = await fetch(`${BASE_URL}/api/telemetria/enviar?docenteId=ASESOR-FT-7729`);
    const dataTelGet = await resTelGet.json();
    const encontrado = dataTelGet.registros?.find(r => r.estudianteNombre === testEstudiante);
    if (encontrado) {
      log('DB-TELEMETRIA-CONSULTAR', `Registro de telemetría localizado en servidor`, 'PASS');
    } else {
      log('DB-TELEMETRIA-CONSULTAR', `Registro no encontrado en la lista`, 'WARN');
    }

    // C) Eliminar registro por estudianteNombre
    const resTelDel = await fetch(`${BASE_URL}/api/telemetria/enviar?estudianteNombre=${encodeURIComponent(testEstudiante)}`, {
      method: 'DELETE'
    });
    const dataTelDel = await resTelDel.json();
    if (dataTelDel.success) {
      log('DB-TELEMETRIA-ELIMINAR', `Registro de estudiante eliminado del servidor con DELETE`, 'PASS');
      results.databaseOperations.push({ op: 'eliminar_telemetria_individual', status: 'PASS' });
    } else {
      log('DB-TELEMETRIA-ELIMINAR', `Fallo al borrar registro: ${JSON.stringify(dataTelDel)}`, 'FAIL');
      results.issuesFound.push('DELETE en /api/telemetria/enviar no borró el registro correctamente');
    }
  } catch (e) {
    log('DB-TELEMETRIA', `Error en operaciones de telemetría: ${e.message}`, 'FAIL');
  }

  // 1.5 /api/webapps (GET)
  try {
    const res = await fetch(`${BASE_URL}/api/webapps`);
    const data = await res.json();
    if (res.ok && data.success) {
      log('API-WEBAPPS', `Catálogo de webapps servidor responde OK`, 'PASS');
      results.apis.push({ endpoint: '/api/webapps', status: 'PASS' });
    }
  } catch (e) {
    log('API-WEBAPPS', `Error en /api/webapps: ${e.message}`, 'WARN');
  }
}

async function auditBrowserPages() {
  console.log('\n--- 2. AUDITORÍA E2E DE PÁGINAS Y VISTAS LOCALES EN NAVEGADOR ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const pagesToTest = [
    { url: `${BASE_URL}/`, name: 'Página de Inicio y Login' },
    { url: `${BASE_URL}/diagnostico`, name: 'Módulo de Diagnóstico (7°, 8° y 9°)' },
    { url: `${BASE_URL}/dashboard`, name: 'Dashboard Docente y Telemetría' },
    { url: `${BASE_URL}/admin`, name: 'Panel de Gobernanza y Administración' },
    { url: `${BASE_URL}/registro`, name: 'Configuración de Perfil Docente' },
    { url: `${BASE_URL}/auditoria-ia`, name: 'Auditoría Diaria de Modelos IA' },
    { url: `${BASE_URL}/docente/resultados/ASESOR-FT-7729`, name: 'Espacio Público de Recepción Docente' },
    { url: `${BASE_URL}/play/diagnostico_7mo_modulo01_cyberquest`, name: 'Visor Autónomo Play' },
    { url: `${BASE_URL}/webapps/diagnostico_7mo_modulo01_cyberquest.html`, name: 'WebApp 7mo CyberQuest (HTML Estático)' },
    { url: `${BASE_URL}/webapps/diagnostico_7mo_modulo01_docente_evaluador.html`, name: 'Evaluador Docente 7mo (HTML Estático)' },
    { url: `${BASE_URL}/webapps/diagnostico_8vo_modulo01_docente_evaluador.html`, name: 'Evaluador Docente 8vo (HTML Estático)' },
    { url: `${BASE_URL}/webapps/diagnostico_9no_modulo01_docente_evaluador.html`, name: 'Evaluador Docente 9no (HTML Estático)' },
    { url: `${BASE_URL}/comunidad`, name: 'Comunidad (Ruta Auxiliar)' },
    { url: `${BASE_URL}/manuales`, name: 'Manuales (Ruta Auxiliar)' },
    { url: `${BASE_URL}/publicar`, name: 'Publicar (Ruta Auxiliar)' },
    { url: `${BASE_URL}/taller-webapps`, name: 'Taller WebApps (Ruta Auxiliar)' },
  ];

  for (const item of pagesToTest) {
    const pageErrors = [];
    const consoleErrors = [];

    const handleConsole = (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    };
    const handlePageError = (err) => {
      pageErrors.push(err.message);
    };

    page.on('console', handleConsole);
    page.on('pageerror', handlePageError);

    try {
      const response = await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const status = response ? response.status() : 0;
      const title = await page.title();
      const currentUrl = page.url();

      if (status >= 400) {
        log('PAGE-AUDIT', `${item.name} (${item.url}) devolvió HTTP ${status}`, 'FAIL');
        results.issuesFound.push(`Página ${item.name} falló con status HTTP ${status}`);
      } else if (pageErrors.length > 0) {
        log('PAGE-AUDIT', `${item.name} (${item.url}) tuvo excepciones en cliente: ${pageErrors.join(' | ')}`, 'FAIL');
        results.issuesFound.push(`Errores JS en ${item.name}: ${pageErrors.join(', ')}`);
      } else {
        const redirected = currentUrl !== item.url ? ` (Redirige a: ${currentUrl})` : '';
        log('PAGE-AUDIT', `${item.name} [HTTP ${status}] -> OK: "${title}"${redirected}`, 'PASS');
        results.pages.push({ name: item.name, url: item.url, status: 'PASS', redirected });
      }
    } catch (err) {
      log('PAGE-AUDIT', `${item.name} no pudo cargar: ${err.message}`, 'FAIL');
      results.issuesFound.push(`Página ${item.name} no cargó: ${err.message}`);
    } finally {
      page.off('console', handleConsole);
      page.off('pageerror', handlePageError);
    }
  }

  // 3. Probar flujo de Login como Alberto Bustos Ortega (Super Admin)
  console.log('\n--- 3. AUDITORÍA DE AUTENTICACIÓN Y ROLES EN VIVO ---');
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    
    // Inyectar perfil en localStorage para simular autenticación como Super Admin
    await page.evaluate(() => {
      const superAdminProfile = {
        idDocente: "ASESOR-FT-7729",
        nombreCompleto: "Alberto Bustos Ortega",
        correoInstitucional: "alberto.bustos.ortega@mep.go.cr",
        pin: "2617",
        contrasena: "2617",
        cedula: "5-0305-0179",
        telefono: "+506 8888-9999",
        tipoRol: "Asesor Nacional",
        dreCodigo: "DRE-NACIONAL",
        dreNombre: "Asesoría de Formación Tecnológica",
        circuito: "Nivel Nacional / Ámbito General",
        codigoPresupuestario: "FT-NACIONAL-2026",
        institucionNombre: "Asesoría Nacional de Formación Tecnológica (Dimensión 1 y 2)",
        rol: "Asesor de Formación Tecnológica & Administrador General (Dimensión 1 y 2)",
        asignaturas: ["Formación Tecnológica (Dimensión 1 y 2)"],
        fechaRegistro: new Date().toISOString()
      };
      localStorage.setItem("docente_activo", JSON.stringify(superAdminProfile));
    });

    // Validar acceso al panel /admin con perfil de Super Admin
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' });
    const adminHeading = await page.$('text=Panel de administración');
    const adminIdentidad = await page.$('text=Alberto Bustos Ortega');
    if (adminHeading && adminIdentidad) {
      log('AUTH-ADMIN', 'Acceso al Panel de Administración para SuperAdmin verificado exitosamente', 'PASS');
      results.passedChecks.push('Acceso al Panel de Administración verificado para Alberto Bustos Ortega');
    } else {
      log('AUTH-ADMIN', 'No se visualizó el encabezado de administración tras login', 'WARN');
    }

    // Validar acceso al Dashboard y sus pestañas 7mo, 8vo, 9no
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    const dashHeading = await page.$('text=Dashboard Analítico y Telemetría');
    if (dashHeading) {
      log('AUTH-DASHBOARD', 'Dashboard cargado correctamente para docente', 'PASS');
      results.passedChecks.push('Dashboard y telemetría cargados correctamente');
    }
  } catch (err) {
    log('AUTH-TEST', `Error durante prueba de autenticación: ${err.message}`, 'FAIL');
  }

  await browser.close();

  // Reporte Consolidado
  console.log('\n===============================================================');
  console.log('                 RESUMEN EJECUTIVO DE AUDITORÍA                ');
  console.log('===============================================================');
  console.log(`✅ Pruebas de API y Endpoints pasadas: ${results.apis.length}`);
  console.log(`✅ Páginas y WebApps verificadas: ${results.pages.length}`);
  console.log(`✅ Operaciones de Base de Datos probadas: ${results.databaseOperations.length}`);
  console.log(`⚠️ Anomalías o Problemas Detectados: ${results.issuesFound.length}`);
  if (results.issuesFound.length > 0) {
    console.log('\nDetalle de Anomalías Encontradas:');
    results.issuesFound.forEach((issue, idx) => console.log(`  ${idx + 1}. ${issue}`));
  } else {
    console.log('\n🌟 ¡Todas las páginas, endpoints y operaciones de base de datos están 100% operativas!');
  }
  console.log('===============================================================\n');
}

async function main() {
  await auditAPIs();
  await auditBrowserPages();
}

main().catch(console.error);
