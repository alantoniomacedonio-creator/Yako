import React from 'react';
import { ArrowDown, Sparkles, CheckCircle2, Gamepad2, MessageCircle, Zap } from 'lucide-react';
import { generatePS4PS5InquiryUrl } from '../utils/whatsapp';

interface HeroBannerProps {
  onSelectPlatform?: (platform: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectPlatform }) => {
  const handleSelectPS3 = () => {
    if (onSelectPlatform) {
      onSelectPlatform('PS3');
    }
    const element = document.getElementById('catalogo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-blue-900/30 bg-[#070b14]">
      {/* Background ambient PlayStation blue & red aura */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-red-400 bg-red-950/60 border border-red-800/50 rounded-full px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Tienda Oficial Total Game · Especialistas en PlayStation 3</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] text-balance">
              El catálogo definitivo para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400">PlayStation 3</span>.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Explorá más de 330 juegos originales de PS3 en formato digital por solo <strong>$5.900</strong> c/u. Además, llevate el <strong>Combo Joystick Inalámbrico + Cable de Carga a $32.000</strong>.
            </p>

            {/* Direct Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
              >
                <span>Ver Catálogo PS3 (+330 Juegos)</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#combo-joystick"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Combo Joystick + Cable $32k</span>
              </a>
            </div>

            {/* PlayStation Generations Selector: Focused on PS3 with PS4/PS5 by consultation */}
            <div className="pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Consolas y pedidos:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                
                {/* PS3 Primary Card */}
                <button
                  type="button"
                  onClick={handleSelectPS3}
                  className="p-3.5 rounded-xl bg-gradient-to-br from-red-950/90 to-slate-900 border-2 border-red-500/80 hover:border-red-400 hover:shadow-lg hover:shadow-red-600/30 text-left transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-xl text-white group-hover:text-red-300">
                      PS3
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-[10px] font-bold text-white uppercase tracking-wider">
                      Catálogo Activo
                    </span>
                  </div>
                  <span className="text-xs text-red-200 block font-bold">
                    PlayStation 3 (Entrega Inmediata)
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    +330 Juegos a $5.900 c/u
                  </span>
                </button>

                {/* PS4 & PS5 Inquiry Card */}
                <a
                  href={generatePS4PS5InquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-[#0a1428] border-2 border-blue-500/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 text-left transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-xl text-white group-hover:text-sky-300">
                      PS4 & PS5
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      Por Consulta
                    </span>
                  </div>
                  <span className="text-xs text-sky-200 block font-bold">
                    PlayStation 4 y 5
                  </span>
                  <span className="text-[11px] text-emerald-400 block mt-0.5 font-medium">
                    Preguntar títulos por WhatsApp ↗
                  </span>
                </a>

              </div>
            </div>

            {/* Trust points */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                <span>Especialistas en PS3</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Joysticks + Cables $32k</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PS4 y PS5 por consulta</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-tech PlayStation Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-red-900/50 bg-gradient-to-b from-slate-900 via-[#140b0f] to-[#070b14] shadow-2xl shadow-red-950/80 p-6 flex flex-col justify-between min-h-[380px]">
              
              {/* Geometric PlayStation symbols watermark */}
              <div className="absolute -right-8 -top-8 text-red-600/10 text-9xl font-mono select-none pointer-events-none">
                ▲●✖■
              </div>

              {/* Header inside card */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-display font-black text-white text-base tracking-wider block">
                      TOTAL GAME
                    </span>
                    <span className="text-[11px] text-red-400 font-mono">Especialistas PS3</span>
                  </div>
                </div>

                <span className="text-xs font-black px-2.5 py-1 rounded bg-red-600 text-white shadow">
                  PS3 STORE
                </span>
              </div>

              {/* Middle Showcase: Price Tag & Catalog Summary */}
              <div className="py-6 z-10 space-y-3">
                <div className="inline-block px-3 py-1 bg-red-950/80 border border-red-800/60 rounded-full text-xs font-semibold text-red-300">
                  ⚡ Catálogo completo con entrega digital
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
                    $ 5.900
                  </span>
                  <span className="text-xs text-slate-400">ARS / juego PS3</span>
                </div>

                {/* Highlight of the Joystick Combo */}
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      COMBO JOYSTICK + CABLE
                    </span>
                    <span className="text-xs font-extrabold text-white bg-amber-600 px-2 py-0.5 rounded">
                      $32.000
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-100/80 leading-snug">
                    DualShock 3 inalámbrico + cable de carga reforzado.
                  </p>
                </div>
              </div>

              {/* Bottom stats inside card */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center z-10">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-base font-bold text-white block tabular-nums">+330</span>
                  <span className="text-[10px] text-slate-400">Juegos PS3</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-base font-bold text-amber-400 block">$32k</span>
                  <span className="text-[10px] text-slate-400">Combo Joy</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-base font-bold text-emerald-400 block">WhatsApp</span>
                  <span className="text-[10px] text-slate-400">PS4 / PS5</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
