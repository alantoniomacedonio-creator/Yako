import React from 'react';
import { ShoppingCart, ShieldCheck, Lock, Gamepad2, Plus, LogOut } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenAdminLogin: () => void;
  onOpenNewGameModal: () => void;
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdminLogin,
  onOpenNewGameModal,
  selectedPlatform,
  onSelectPlatform,
}) => {
  const { cartCount, setIsCartOpen, isAdmin, logoutAdmin } = useStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070b14]/95 backdrop-blur-md border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Brand Logo & Name */}
        <a 
          href="#catalogo" 
          className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-display text-lg sm:text-2xl font-black tracking-wider uppercase text-white">
            Total <span className="text-blue-500">Game</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectPlatform('TODOS')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white cursor-pointer ${
              selectedPlatform === 'TODOS' ? 'text-blue-400 font-bold' : 'text-slate-300'
            }`}
          >
            Todos los Juegos
          </button>
          
          {/* PS5 */}
          <button
            onClick={() => onSelectPlatform('PS5')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedPlatform === 'PS5'
                ? 'bg-sky-500 text-slate-950 ring-2 ring-sky-300 shadow-md shadow-sky-500/30'
                : 'bg-sky-950/60 text-sky-300 border border-sky-800/60 hover:bg-sky-900/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            <span>PS5</span>
          </button>

          {/* PS4 */}
          <button
            onClick={() => onSelectPlatform('PS4')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedPlatform === 'PS4'
                ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-md shadow-blue-600/30'
                : 'bg-blue-950/60 text-blue-300 border border-blue-800/60 hover:bg-blue-900/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>PS4</span>
          </button>

          {/* PS3 */}
          <button
            onClick={() => onSelectPlatform('PS3')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedPlatform === 'PS3'
                ? 'bg-red-600 text-white ring-2 ring-red-300 shadow-md shadow-red-600/30'
                : 'bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/60'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span>PS3</span>
          </button>

          {/* Circled Contact Button */}
          <a
            href="#contacto"
            className="transition-all whitespace-nowrap shrink-0 px-3.5 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-950/40 ring-2 ring-emerald-500/20 active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Contacto</span>
          </a>
        </nav>

        {/* Right Section: Admin & Cart Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isAdmin ? (
            <div className="flex items-center gap-1 sm:gap-2 bg-blue-950/80 border border-blue-600/50 rounded-lg p-1 px-1.5 sm:px-2 text-xs">
              <span className="hidden sm:flex items-center gap-1 font-semibold text-blue-400 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Admin</span>
              </span>

              <button
                type="button"
                onClick={onOpenNewGameModal}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-[11px] sm:text-xs transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Agregar nuevo juego al catálogo"
              >
                <Plus className="w-3 h-3" />
                <span className="hidden xs:inline">Juego</span>
              </button>

              <button
                type="button"
                onClick={logoutAdmin}
                className="px-1.5 py-1 text-slate-400 hover:text-rose-400 text-[11px] sm:text-xs transition-colors flex items-center gap-1 cursor-pointer"
                title="Cerrar sesión de administrador"
              >
                <LogOut className="w-3 h-3 sm:hidden" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
              title="Ingreso Administrador"
            >
              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">Admin</span>
            </button>
          )}

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-150 shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer shrink-0"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="bg-white text-blue-900 text-[10px] sm:text-xs font-black rounded-full h-4.5 sm:h-5 min-w-4.5 sm:min-w-5 px-1 flex items-center justify-center tabular-nums leading-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
