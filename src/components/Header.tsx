import React from 'react';
import { ShoppingCart, ShieldCheck, Lock, Gamepad2, Plus, LogOut, MessageCircle, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { generatePS4PS5InquiryUrl } from '../utils/whatsapp';

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
          className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:bg-red-500 transition-colors">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg sm:text-2xl font-black tracking-wider uppercase text-white">
              Total <span className="text-red-500">Game</span>
            </span>
            <span className="text-[10px] text-red-400 font-semibold tracking-wider uppercase">
              Especialistas PS3
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-medium text-slate-300">
          {/* PS3 Catálogo Activo */}
          <button
            onClick={() => onSelectPlatform('PS3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedPlatform === 'PS3' || selectedPlatform === 'TODOS'
                ? 'bg-red-600 text-white ring-2 ring-red-300 shadow-md shadow-red-600/40'
                : 'bg-red-950/60 text-red-300 border border-red-800/60 hover:bg-red-900/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            <span>Catálogo PS3 (+330)</span>
          </button>

          {/* Promo Joysticks 40k */}
          <a
            href="#combo-joystick"
            className="px-3 py-1.5 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Combo Joysticks $40k</span>
          </a>

          {/* PS4 & PS5 Por Consulta */}
          <a
            href={generatePS4PS5InquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-sky-300 border border-slate-700 hover:border-emerald-500/60 hover:text-emerald-300 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Consultar catálogo de PS4 y PS5 por WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>PS4 & PS5 (Por Consulta)</span>
          </a>

          {/* Contact Button */}
          <a
            href="#contacto"
            className="transition-all whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5"
          >
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
