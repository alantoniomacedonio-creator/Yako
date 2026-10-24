import React, { useState } from 'react';
import { ShoppingCart, Edit3, Trash2, Eye, Gamepad2, Check } from 'lucide-react';
import { Game } from '../types/game';
import { formatPrice } from '../utils/whatsapp';
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
      {/* Admin Floating Quick Actions */}
      {isAdmin && (
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1 rounded-lg border border-slate-700 shadow-md">
          <button
            onClick={handleEdit}
            className="p-1.5 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
            title="Editar juego"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="Eliminar juego"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
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
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950/60 text-slate-500 p-4 text-center">
            <Gamepad2 className="w-12 h-12 text-blue-500/50 mb-2" />
            <span className="text-xs font-semibold text-slate-400">{game.title}</span>
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
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Unboxed Metadata discipline */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5 truncate">
            <span className="truncate">{game.genre}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-blue-300 font-medium shrink-0">{game.condition}</span>
          </div>

          <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block leading-none">Precio</span>
            <span className="text-lg font-bold text-white tabular-nums tracking-tight">
              {formatPrice(game.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!game.inStock}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
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
                <span>¡Agregado!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span>Agregar al carrito</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
