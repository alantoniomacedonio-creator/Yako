import React, { useState } from 'react';
import { X, Database, Check, AlertCircle, Copy, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getSupabaseConfig } from '../lib/supabase';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isSupabaseConnected, isSyncingToSupabase, syncToSupabase, saveCloudCredentials } = useStore();
  const currentConfig = getSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor ingresa tanto la Project URL como la Anon Key.' });
      return;
    }

    const res = await saveCloudCredentials(url.trim(), anonKey.trim());
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const handleSyncInitialGames = async () => {
    setStatusMessage(null);
    const res = await syncToSupabase();
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  const sqlScript = `-- 1. Crear tabla de juegos en Supabase
create table if not exists games (
  id text primary key,
  title text not null,
  platform text not null,
  genre text not null,
  condition text not null,
  price numeric not null default 5900,
  description text default '',
  image_url text default '',
  in_stock boolean default true,
  featured boolean default false,
  languages text default 'Español Latino, Inglés',
  release_year integer default 2013,
  created_at bigint default extract(epoch from now()) * 1000
);

-- 2. Habilitar lectura y escritura para tu catálogo
alter table games enable row level security;
create policy "Lectura pública de juegos" on games for select using (true);
create policy "Insertar juegos" on games for insert with check (true);
create policy "Actualizar juegos" on games for update using (true);
create policy "Eliminar juegos" on games for delete using (true);

-- 3. Habilitar tiempo real (cambios en vivo entre celulares)
alter publication supabase_realtime add table games;`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0a1020] border border-emerald-900/50 rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors absolute top-4 right-4"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Base de Datos Supabase (Tiempo Real)</h3>
              {isSupabaseConnected ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Conectado en vivo
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 text-[10px] font-semibold">
                  Sin conectar
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Sincroniza tus cartas para que cuando edites una, cambie al instante en todos los celulares.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className={`mb-4 p-3 rounded-lg text-xs flex items-start gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300' 
              : 'bg-rose-950/60 border border-rose-800/60 text-rose-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto space-y-5 pr-1 text-slate-300 text-xs">
          
          {/* Quick Guide */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Paso 1: Crear la tabla en Supabase
              </span>
              <button
                type="button"
                onClick={copySqlToClipboard}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                <span>{copiedSql ? '¡Copiado!' : 'Copiar código SQL'}</span>
              </button>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              En tu proyecto gratuito de <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a>, abre el <strong>SQL Editor</strong>, pega este script y presiona <strong>RUN</strong>.
            </p>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSave} className="space-y-3.5">
            <span className="font-bold text-white block">
              Paso 2: Conectar tus claves (Settings &gt; API)
            </span>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Project URL de Supabase *
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzabcdefghijklmnop.supabase.co"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Project API Key (anon / public) *
              </label>
              <input
                type="password"
                required
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar y Probar Conexión</span>
              </button>
            </div>
          </form>

          {/* Step 3: Sync Initial Catalog */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="font-bold text-white block">
              Paso 3: Cargar las 185 cartas oficiales a Supabase
            </span>
            <p className="text-slate-400 text-[11px]">
              Una vez conectado, haz clic en el siguiente botón para subir todas las carátulas, precios y juegos a tu base de datos automáticamente:
            </p>

            <button
              type="button"
              onClick={handleSyncInitialGames}
              disabled={isSyncingToSupabase || !isSupabaseConnected}
              className={`w-full py-2.5 px-4 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSupabaseConnected
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-98'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingToSupabase ? 'animate-spin' : ''}`} />
              <span>
                {isSyncingToSupabase
                  ? 'Subiendo 185 juegos a Supabase...'
                  : isSupabaseConnected
                  ? '🚀 Cargar todas las 185 cartas a Supabase'
                  : 'Conecta Supabase primero para subir cartas'}
              </span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-[11px] text-blue-300">
            <strong>Nota para Vercel:</strong> También puedes agregar estas mismas dos claves en las variables de entorno de tu proyecto en Vercel (<code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>) para que cualquier persona que abra tu link ya quede conectada automáticamente.
          </div>

        </div>

      </div>
    </div>
  );
};
