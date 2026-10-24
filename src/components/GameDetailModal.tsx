import React, { useState } from 'react';
import { X, ShoppingCart, MessageCircle, Check, Gamepad2, Globe, Calendar, Award } from 'lucide-react';
import { Game } from '../types/game';
import { formatPrice, generateSingleGameWhatsAppUrl } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, onClose }) => {
  const { addToCart } = useStore();

  if (!game) return null;

  const handleAdd = () => {
    // Add to cart and automatically return to the previous page / catalog
    addToCart(game, false);
    onClose();
  };

  const whatsappInquiryUrl = generateSingleGameWhatsAppUrl(game.title, game.price, game.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0b1222] border border-blue-900/50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-full transition-colors border border-slate-700"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Cover Column */}
            <div className="md:col-span-5 relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded tracking-wider shadow ${
                  game.platform.includes('PS3') ? 'bg-red-700 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {game.platform}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-900/90 text-blue-300 border border-blue-900/50">
                  {game.condition}
                </span>
              </div>
            </div>

            {/* Information Column */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                  {game.genre}
                </span>
                <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                  {game.title}
                </h2>
              </div>

              {/* Price display */}
              <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Precio final</span>
                  <span className="text-2xl font-extrabold text-white tabular-nums tracking-tight">
                    {formatPrice(game.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-emerald-400 block">● En Stock</span>
                  <span className="text-[11px] text-slate-400">Entrega rápida</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Descripción
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Technical specs / features */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">{game.languages || 'Español / Inglés'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Año: {game.releaseYear || '2023 / 2024'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Garantía Total Game</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Original PlayStation</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  onClick={handleAdd}
                  disabled={!game.inStock}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] cursor-pointer"
                  title="Agregar al carrito y volver a los juegos"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar al carrito ({formatPrice(game.price)})</span>
                </button>

                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-600/40 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Consultar este juego por WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Seguir explorando más juegos
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
