"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Warning, ArrowsClockwise } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-6 text-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Warning size={22} weight="bold" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-950">
                {this.props.fallbackTitle || "Módulo en proceso de carga o actualización"}
              </h4>
              <p className="text-xs text-amber-800">
                {this.props.fallbackMessage ||
                  "Se detectó un ajuste temporal en la visualización de este nivel. Puedes reiniciar la vista sin perder tu sesión."}
              </p>
            </div>
          </div>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <ArrowsClockwise size={15} weight="bold" />
            <span>Reintentar carga</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
