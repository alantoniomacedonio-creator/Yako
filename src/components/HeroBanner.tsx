import React from 'react';
import { ArrowDown, Sparkles, CheckCircle2, Gamepad2 } from 'lucide-react';

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
              Explorá nuestro catálogo completo de juegos PlayStation a solo $5.900 cada uno. Armá tu carrito y coordiná tu pedido directo por WhatsApp con entrega digital rápida.
            </p>

            {/* Direct Action */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 cursor-pointer"
              >
                <span>Explorar Catálogo (+180 Juegos)</span>
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
                    Catálogo Completo
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
                <span>Entrega inmediata</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Precio único: $5.900</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-tech PlayStation Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-blue-900/50 bg-gradient-to-b from-slate-900 via-[#0a1124] to-[#070b14] shadow-2xl shadow-blue-950/80 p-6 flex flex-col justify-between min-h-[360px]">
              
              {/* Geometric PlayStation symbols watermark */}
              <div className="absolute -right-8 -top-8 text-blue-600/10 text-9xl font-mono select-none pointer-events-none">
                ▲●✖■
              </div>

              {/* Header inside card */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-display font-black text-white text-base tracking-wider block">
                      TOTAL GAME
                    </span>
                    <span className="text-[11px] text-blue-400 font-mono">Edición PlayStation</span>
                  </div>
                </div>

                <span className="text-xs font-black px-2.5 py-1 rounded bg-red-600 text-white shadow">
                  PS3 STORE
                </span>
              </div>

              {/* Middle Showcase: Price Tag & Catalog Summary */}
              <div className="py-8 z-10 space-y-3">
                <div className="inline-block px-3 py-1 bg-blue-950/80 border border-blue-800/60 rounded-full text-xs font-semibold text-blue-300">
                  ⚡ Todos los juegos al mismo precio
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums">
                    $ 5.900
                  </span>
                  <span className="text-xs text-slate-400">ARS / unidad</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                  Grand Theft Auto, The Last of Us, Call of Duty, FIFA, Mortal Kombat, Resident Evil, sagas LEGO y más de 180 clásicos.
                </p>
              </div>

              {/* Bottom stats inside card */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center z-10">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-base font-bold text-white block tabular-nums">+180</span>
                  <span className="text-[10px] text-slate-400">Juegos</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-base font-bold text-blue-400 block">100%</span>
                  <span className="text-[10px] text-slate-400">Digital</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-base font-bold text-emerald-400 block">WhatsApp</span>
                  <span className="text-[10px] text-slate-400">Directo</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
