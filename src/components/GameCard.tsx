import React, { useState } from 'react';
import { ShoppingCart, Edit3, Trash2, Eye, Gamepad2, Check } from 'lucide-react';
import { Game } from '../types/game';
import { formatPrice, formatPublicationDate } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

interface GameCardProps {
  game: Game;
  onViewDetails: (game: Game) => void;
  onEditGame?: (game: Game) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onViewDetails,
  onEditGame,
}) => {
  const { addToCart, isAdmin, deleteGame } = useStore();
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(game);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de eliminar "${game.title}" del catálogo?`)) {
      deleteGame(game.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditGame) {
      onEditGame(game);
    }
  };

  // Determine platform styling badge: High contrast bold PlayStation colors
  const platformBadge = game.platform.includes('PS5') 
    ? 'text-slate-950 bg-sky-400 font-black shadow-md shadow-sky-500/20' 
    : game.platform.includes('PS3')
    ? 'text-white bg-red-600 font-black shadow-md shadow-red-600/30'
    : 'text-white bg-blue-600 font-black shadow-md shadow-blue-600/30';

  return (
    <article
      onClick={() => onViewDetails(game)}
      className="group relative flex flex-col bg-[#0b1222] border border-slate-800/80 hover:border-blue-600/60 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/40 cursor-pointer"
    >
      {/* Admin Quick Action Banner: Highly visible across cards */}
      {isAdmin && (
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="bg-amber-950/90 border-b border-amber-500/40 px-2.5 py-1.5 flex items-center justify-between z-30 relative"
        >
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            Panel Admin
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleEdit}
              className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-[11px] rounded flex items-center gap-1 shadow transition-all cursor-pointer"
              title="Editar esta carta: carátula, datos, tipo de juego"
            >
              <Edit3 className="w-3 h-3" />
              <span>Editar Carta</span>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="p-1 bg-rose-950/80 hover:bg-rose-900 active:scale-95 text-rose-300 hover:text-white rounded border border-rose-800/60 transition-all cursor-pointer"
              title="Eliminar este juego"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Image Area: 65-75% visual weight */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        {!imageError && game.imageUrl ? (
          <img
            src={game.imageUrl}
            alt={game.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950/70 p-3.5 relative select-none">
            {/* Top PlayStation spine branding */}
            <div className="flex items-center justify-between opacity-80 pt-0.5">
              <span className="text-[9px] font-black tracking-widest text-blue-400">PLAYSTATION</span>
              <div className="flex items-center gap-1 text-[9px] font-bold">
                <span className="text-emerald-400">△</span>
                <span className="text-rose-400">◯</span>
                <span className="text-blue-400">✕</span>
                <span className="text-purple-400">□</span>
              </div>
            </div>

            {/* Middle Title badge */}
            <div className="my-auto text-center px-1">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-tight">
                {game.title}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{game.genre}</p>
            </div>

            {/* Bottom details */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
              <span className="font-bold text-blue-300">{game.platform}</span>
              <span className="text-slate-500">{game.releaseYear || 'PS3'}</span>
            </div>
          </div>
        )}

        {/* Top left platform indicator: High impact */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md ${platformBadge} tracking-wider`}>
            {game.platform}
          </span>
          {game.featured && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 tracking-wide uppercase">
              Top
            </span>
          )}
        </div>

        {/* Hover quick inspect overlay */}
        <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-medium border border-blue-500/30 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Ver detalles</span>
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
        <div>
          {/* Metadata: Género y Fecha */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-1 gap-2">
            <span className="truncate text-slate-300 font-medium">{game.genre}</span>
            <span className="text-slate-400 font-medium shrink-0 text-[10px] sm:text-[11px] tabular-nums" title="Fecha de publicación">
              {formatPublicationDate(game.createdAt)}
            </span>
          </div>

          <h3 className="font-semibold text-white text-xs sm:text-base leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>

          <p className="mt-1 text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-1.5 sm:gap-2 mt-auto">
          <div>
            <span className="text-[9px] sm:text-[11px] text-slate-400 block leading-none">Precio</span>
            <span className="text-sm sm:text-lg font-bold text-white tabular-nums tracking-tight">
              {formatPrice(game.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!game.inStock}
            className={`flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : game.inStock
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title={game.inStock ? 'Agregar al carrito' : 'Sin stock'}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Agregar al carrito</span>
                <span className="sm:hidden">Comprar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
