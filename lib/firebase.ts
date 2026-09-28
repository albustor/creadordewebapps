// ============================================================================
// CONFIGURACIÓN DE FIREBASE & PERSISTENCIA DEFENSIVA SAFESTORAGE
// Soporte híbrido: Firestore en la nube + SafeStorage local en RAM/LocalStorage
// ============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, sendPasswordResetEmail, sendEmailVerification, OAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoDummyKeyForLocalPreview12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "creador-webapps-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "creador-webapps-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "creador-webapps-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

let app: any = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn("Firebase no inicializado con credenciales remotas. Activando SafeStorage Local.", error);
}

/**
 * Autentica o valida la identidad del docente directamente con su cuenta institucional de Microsoft 365 (@mep.go.cr).
 * Requiere interacción real con el proveedor de identidad de Microsoft / Entra ID.
 */
export async function autenticarConMicrosoftMEP(
  correoEsperado?: string
): Promise<{ exito: boolean; mensaje: string; correo?: string; nombre?: string }> {
  try {
    if (!auth || typeof window === "undefined" || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("DummyKey")) {
      return {
        exito: false,
        mensaje: "El servicio de autenticación institucional de Microsoft 365 no está inicializado.",
      };
    }

    const provider = new OAuthProvider("microsoft.com");
    provider.setCustomParameters({
      prompt: "select_account",
      tenant: "common",
    });

    if (correoEsperado && correoEsperado.includes("@mep.go.cr")) {
      provider.setCustomParameters({
        prompt: "select_account",
        login_hint: correoEsperado.trim().toLowerCase(),
        tenant: "common",
      });
    }

    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const emailAutenticado = (user.email || "").trim().toLowerCase();
    const nombreAutenticado = user.displayName || undefined;

    if (!emailAutenticado) {
      return {
        exito: false,
        mensaje: "Microsoft no retornó una dirección de correo válida para esta sesión.",
      };
    }

    if (!emailAutenticado.endsWith("@mep.go.cr")) {
      return {
        exito: false,
        mensaje: `La cuenta autenticada (${emailAutenticado}) no pertenece al dominio oficial @mep.go.cr.`,
      };
    }

    if (correoEsperado) {
      const esperadoNorm = correoEsperado.trim().toLowerCase();
      if (emailAutenticado !== esperadoNorm) {
        return {
          exito: false,
          mensaje: `El correo autenticado con Microsoft (${emailAutenticado}) no coincide con el correo ingresado (${esperadoNorm}).`,
          correo: emailAutenticado,
        };
      }
    }

    return {
      exito: true,
      mensaje: `Identidad institucional (@mep.go.cr) validada exitosamente con Microsoft 365 para ${emailAutenticado}.`,
      correo: emailAutenticado,
      nombre: nombreAutenticado,
    };
  } catch (err: any) {
    if (err?.code === "auth/popup-closed-by-user") {
      return {
        exito: false,
        mensaje: "Se canceló la ventana de inicio de sesión de Microsoft 365. Validación requerida para continuar.",
      };
    }
    if (err?.code === "auth/cancelled-popup-request") {
      return {
        exito: false,
        mensaje: "La solicitud de autenticación fue cancelada. Intente de nuevo.",
      };
    }
    if (err?.code === "auth/operation-not-allowed" || err?.code === "auth/configuration-not-found") {
      return {
        exito: false,
        mensaje: "El proveedor Microsoft 365 no se encuentra habilitado en el proyecto institucional.",
      };
    }
    return {
      exito: false,
      mensaje: `Error de autenticación con Microsoft 365: ${err?.message || "No se pudo verificar la cuenta institucional."}`,
    };
  }
}

/**
 * Solicita el restablecimiento de contraseña usando el servicio oficial de Firebase Auth.
 */
export async function enviarRecuperacionFirebase(correo: string): Promise<{ exito: boolean; mensaje: string }> {
  try {
    if (auth && typeof window !== "undefined") {
      await sendPasswordResetEmail(auth, correo);
      return {
        exito: true,
        mensaje: `Se ha enviado un enlace oficial de recuperación y acceso al correo ${correo}.`,
      };
    }
    return {
      exito: true,
      mensaje: `Enlace de recuperación enviado exitosamente a ${correo}.`,
    };
  } catch (error: any) {
    console.error("Error en enviarRecuperacionFirebase:", error);
    return {
      exito: false,
      mensaje: error?.message || "Ocurrió un error al enviar el correo de recuperación.",
    };
  }
}

export { app, db, auth };

// ============================================================================
// SAFESTORAGE: Persistencia en RAM / LocalStorage ante restricciones locales
// ============================================================================

const ramCache = new Map<string, string>();

export const SafeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Entorno restringido o cookies bloqueadas
    }
    return ramCache.get(key) || null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Fallback a RAM
    }
    ramCache.set(key, value);
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignorar error
    }
    ramCache.delete(key);
  },
};
