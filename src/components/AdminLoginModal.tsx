import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = loginAdmin(username, password);
    if (result.success) {
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError(result.error || 'Credenciales inválidas');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-[#0a1020] border border-blue-900/50 rounded-2xl shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors absolute top-4 right-4"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Panel de Administración</h3>
            <p className="text-xs text-slate-400">Ingreso exclusivo para gestionar catálogo</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs flex items-center justify-between text-blue-300">
            <div>
              <span className="font-semibold block text-white">Cuenta de Administrador</span>
              <span className="text-[11px] text-blue-300">Usuario: <strong className="text-white">yako</strong> · Contraseña: <strong className="text-white">yako</strong></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername('yako');
                setPassword('yako');
              }}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded text-[11px] font-bold shadow transition-all cursor-pointer"
            >
              Autocompletar
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Usuario Administrador
            </label>
            <input
              type="text"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yako"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="yako"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ingresar como Administrador (yako)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
