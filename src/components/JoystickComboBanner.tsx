import React, { useState } from 'react';
import { ShoppingCart, MessageCircle, Check, Zap, Sparkles, ShieldCheck, BatteryCharging } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, generateJoystickComboWhatsAppUrl, JOYSTICK_COMBO_PRODUCT } from '../utils/whatsapp';

export const JoystickComboBanner: React.FC = () => {
  const { addToCart } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(JOYSTICK_COMBO_PRODUCT, true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-[#120f06] via-[#0d1322] to-[#070b14] shadow-2xl shadow-amber-500/10 p-5 sm:p-7 md:p-8 mb-10">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left: Product Image & Badges */}
        <div className="lg:col-span-5 relative group">
          <div 
            onContextMenu={(e) => e.preventDefault()}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-950 shadow-xl select-none"
          >
            <div 
              className="absolute inset-0 z-10 pointer-events-none select-none" 
              onContextMenu={(e) => e.preventDefault()} 
            />
            <img
              src={JOYSTICK_COMBO_PRODUCT.imageUrl}
              alt="Combo Joystick PS3 y Cable de Carga"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none no-download"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Combo 40k
              </span>
              <span className="px-2 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[11px] shadow">
                PS3
              </span>
            </div>

            {/* Bottom Floating Price */}
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Precio Oferta Combo
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-white tabular-nums">
                    {formatPrice(40000)}
                  </span>
                  <span className="text-xs text-slate-500 line-through tabular-nums">
                    $ 52.000
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-md">
                Ahorrás $12.000
              </span>
            </div>
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SUPER PROMO EXCLUSIVA PS3</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              Combo Joystick Inalámbrico DualShock 3 + Cable de Carga
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Equipá tu PlayStation 3 al mejor precio. Llevate el mando inalámbrico con vibración DualShock y batería recargable, junto con su cable de carga reforzado para jugar sin interrupciones.
            </p>
          </div>

          {/* Features Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <BatteryCharging className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Conexión Bluetooth + Batería recargable</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Doble motor de vibración y Sixaxis</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cable reforzado anti-tirones incluido</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <Check className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Compatible con PS3 Fat, Slim y Super Slim</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer ${
                justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-900/40 ring-2 ring-emerald-400'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 hover:shadow-amber-500/40'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Combo Agregado al Carrito!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Agregar Combo al Carrito ({formatPrice(40000)})</span>
                </>
              )}
            </button>

            <a
              href={generateJoystickComboWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2 cursor-pointer border border-emerald-400/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Pedir por WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
