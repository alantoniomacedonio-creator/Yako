import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Gamepad2, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0b1222] border border-blue-900/50 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Total Game</h2>
            <p className="text-xs text-slate-400">
              Ocurrió un inconveniente al cargar la aplicación en este dispositivo.
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recargar aplicación limpia</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
