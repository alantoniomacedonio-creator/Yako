import React from 'react';
import { ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/images/hero_total_game_ps5_1792844747027.jpg';

interface HeroBannerProps {
  onSelectPlatform?: (platform: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectPlatform }) => {
  const handleSelectGeneration = (platform: string) => {
    if (onSelectPlatform) {
      onSelectPlatform(platform);
    }
    const element = document.getElementById('catalogo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-blue-900/30 bg-[#070b14]">
      {/* Background ambient PlayStation blue aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-950/60 border border-blue-800/40 rounded-full px-3.5 py-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Tienda Oficial Total Game · PlayStation Especialistas</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] text-balance">
              Tus juegos favoritos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500">PlayStation</span> al instante.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Explorá nuestro catálogo de PS5, PS4 y clásicos de PS3 en formato físico y digital. Armá tu carrito y finalizá tu pedido directamente por WhatsApp con atención personalizada.
            </p>

            {/* Direct Action */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95"
              >
                <span>Explorar Catálogo</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            {/* Prominent PlayStation Generations Strip (PS5, PS4, PS3) */}
            <div className="pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Elegí tu consola PlayStation:
              </span>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-lg">
                
                {/* PS5 Button */}
                <button
                  type="button"
                  onClick={() => handleSelectGeneration('PS5')}
                  className="p-3 rounded-xl bg-gradient-to-br from-sky-950/80 to-slate-900 border-2 border-sky-500/50 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/20 text-left transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-lg text-white group-hover:text-sky-300">
                      PS5
                    </span>
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  </div>
                  <span className="text-[11px] text-sky-200/80 block leading-tight font-medium">
                    PlayStation 5
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Next-Gen 4K
                  </span>
                </button>

                {/* PS4 Button */}
                <button
                  type="button"
                  onClick={() => handleSelectGeneration('PS4')}
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-slate-900 border-2 border-blue-600/50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-600/20 text-left transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-lg text-white group-hover:text-blue-300">
                      PS4
                    </span>
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                  <span className="text-[11px] text-blue-200/80 block leading-tight font-medium">
                    PlayStation 4
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Éxitos & Hits
                  </span>
                </button>

                {/* PS3 Button */}
                <button
                  type="button"
                  onClick={() => handleSelectGeneration('PS3')}
                  className="p-3 rounded-xl bg-gradient-to-br from-red-950/80 to-slate-900 border-2 border-red-600/50 hover:border-red-400 hover:shadow-lg hover:shadow-red-600/20 text-left transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-black text-lg text-white group-hover:text-red-300">
                      PS3
                    </span>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  </div>
                  <span className="text-[11px] text-red-200/80 block leading-tight font-medium">
                    PlayStation 3
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Joyas Retro
                  </span>
                </button>

              </div>
            </div>

            {/* Trust points */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Juegos 100% Originales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Entrega y soporte rápido</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Pago seguro y transparente</span>
              </div>
            </div>
          </div>

          {/* Right Column: PS5 Console Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-blue-900/40 bg-slate-900/50 shadow-2xl shadow-blue-950/60 aspect-[16/10] sm:aspect-[16/10] lg:aspect-auto lg:h-[400px]">
              <img
                src={heroImg}
                alt="Consola PlayStation 5 y DualSense en Total Game"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent opacity-60" />
              
              {/* Floating PlayStation badges on visual */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 rounded bg-sky-500 text-slate-950 font-black text-xs shadow-md">
                  PS5
                </span>
                <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-black text-xs shadow-md">
                  PS4
                </span>
                <span className="px-2.5 py-1 rounded bg-red-600 text-white font-black text-xs shadow-md">
                  PS3
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-300 bg-slate-950/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-white">Catálogo Total Game</span>
                <span className="text-blue-400 font-mono font-medium">PS5 · PS4 · PS3</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
