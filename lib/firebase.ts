// ============================================================================
// CONFIGURACIÓN DE FIREBASE & PERSISTENCIA DEFENSIVA SAFESTORAGE
// Soporte híbrido: Firestore en la nube + SafeStorage local en RAM/LocalStorage
// ============================================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoDummyKeyForLocalPreview12345",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "creador-webapps-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "creador-webapps-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "creador-webapps-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

let app;
let db: Firestore | null = null;

try {
  if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase no inicializado con credenciales remotas. Activando SafeStorage Local.", error);
}

export { app, db };

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
