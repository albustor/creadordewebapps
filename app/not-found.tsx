"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Página no encontrada</h1>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        El recurso o la WebApp solicitada no se encuentra disponible o ha cambiado de ubicación.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
