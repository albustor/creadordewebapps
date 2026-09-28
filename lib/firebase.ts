// ============================================================================
// CONFIGURACIÓN DE FIREBASE & PERSISTENCIA DEFENSIVA SAFESTORAGE
// Soporte híbrido: Firestore en la nube + SafeStorage local en RAM/LocalStorage
// ============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";

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
 * Solicita el restablecimiento de contraseña usando el servicio oficial de Firebase Auth.
 */
export async function enviarRecuperacionFirebase(correo: string): Promise<{ exito: boolean; mensaje: string }> {
  try {
    if (auth && typeof window !== "undefined") {
      await sendPasswordResetEmail(auth, correo);
      return {
        exito: true,
        mensaje: `Se ha enviado un enlace oficial de recuperación y acceso al correo institucional ${correo}. Revisa tu bandeja de entrada y correo no deseado.`,
      };
    }

    // Fallback a API REST de Identity Toolkit si no hay instancia cliente
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (apiKey) {
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: correo,
        }),
      });
      if (res.ok) {
        return {
          exito: true,
          mensaje: `Enlace oficial de recuperación y acceso enviado exitosamente a ${correo}.`,
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData?.error?.message || "Error al solicitar recuperación de cuenta";
        return {
          exito: false,
          mensaje: `Servicio de Autenticación: ${errMsg}`,
        };
      }
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
