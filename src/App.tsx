import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { GameFormModal } from './components/GameFormModal';
import { JoystickComboBanner } from './components/JoystickComboBanner';
import { Footer } from './components/Footer';
import { Game } from './types/game';
import { Search, Plus, Filter, Sparkles, Lock, ShoppingCart, RefreshCw, Save, Check, ShieldAlert, MessageCircle, Zap } from 'lucide-react';
import { generatePS4PS5InquiryUrl } from './utils/whatsapp';

const CatalogContent: React.FC = () => {
  const {
    games,
    isAdmin,
    lastAddedGame,
    clearLastAddedGame,
    setIsCartOpen,
    cartCount,
    resetCatalog,
    isSavingToSupabase,
    saveChangesToSupabase,
  } = useStore();

  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const handleSaveToSupabase = async () => {
    const res = await saveChangesToSupabase();
    if (res.success) {
      setSaveSuccessMessage(res.message);
      setTimeout(() => setSaveSuccessMessage(null), 3500);
    } else {
      alert(res.message);
    }
  };

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('PS3');
  const [genreFilter, setGenreFilter] = useState<string>('TODOS');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

  // Modal states
  const [selectedGameForDetails, setSelectedGameForDetails] = useState<Game | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isGameFormOpen, setIsGameFormOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);

  // Extract unique genres for filter dropdown
  const uniqueGenres = useMemo(() => {
    const genres = new Set<string>();
    games.forEach((g) => {
      if (g.genre) genres.add(g.genre);
    });
    return Array.from(genres);
  }, [games]);

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Platform match
        if (platformFilter !== 'TODOS') {
          if (!game.platform.includes(platformFilter)) {
            return false;
          }
        }
        // Genre match
        if (genreFilter !== 'TODOS') {
          const gLower = (game.genre || '').toLowerCase();
          const filterLower = genreFilter.toLowerCase();
          
          if (genreFilter === 'ZOMBIES') {
            if (!gLower.includes('zombie') && !gLower.includes('terror') && !gLower.includes('resident evil') && !gLower.includes('survival')) {
              return false;
            }
          } else if (genreFilter === 'AUTOS') {
            if (!gLower.includes('auto') && !gLower.includes('carrera') && !gLower.includes('racing') && !gLower.includes('rally')) {
              return false;
            }
          } else if (genreFilter === 'ACCION') {
            if (!gLower.includes('acción') && !gLower.includes('accion') && !gLower.includes('aventura')) {
              return false;
            }
          } else if (genreFilter === 'DEPORTES') {
            if (!gLower.includes('deporte') && !gLower.includes('fútbol') && !gLower.includes('futbol') && !gLower.includes('fifa') && !gLower.includes('pes')) {
              return false;
            }
          } else if (genreFilter === 'SHOOTER') {
            if (!gLower.includes('shooter') && !gLower.includes('disparo') && !gLower.includes('fps')) {
              return false;
            }
          } else if (genreFilter === 'LUCHA') {
            if (!gLower.includes('lucha') && !gLower.includes('pelea') && !gLower.includes('fighting')) {
              return false;
            }
          } else if (genreFilter === 'FAMILIAR') {
            if (!gLower.includes('familiar') && !gLower.includes('niño') && !gLower.includes('plataforma') && !gLower.includes('lego')) {
              return false;
            }
          } else if (genreFilter === 'MUNDO_ABIERTO') {
            if (!gLower.includes('mundo abierto') && !gLower.includes('open world')) {
              return false;
            }
          } else if (genreFilter === 'RPG') {
            if (!gLower.includes('rpg') && !gLower.includes('rol')) {
              return false;
            }
          } else {
            if (!gLower.includes(filterLower)) {
              return false;
            }
          }
        }
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDesc = game.description.toLowerCase().includes(q);
          const matchGenre = game.genre.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchGenre) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'name-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [games, platformFilter, genreFilter, searchQuery, sortBy]);

  // Progressive rendering to ensure instant loading on mobile devices without freezing memory
  const [visibleCount, setVisibleCount] = useState(24);

  React.useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, platformFilter, genreFilter, sortBy]);

  const displayedGames = useMemo(() => {
    return filteredGames.slice(0, visibleCount);
  }, [filteredGames, visibleCount]);

  const handleOpenEdit = (game: Game) => {
    setGameToEdit(game);
    setIsGameFormOpen(true);
  };

  const handleOpenCreate = () => {
    setGameToEdit(null);
    setIsGameFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100">
      {/* Top Bar Header */}
      <Header
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenNewGameModal={handleOpenCreate}
        selectedPlatform={platformFilter}
        onSelectPlatform={setPlatformFilter}
      />

      {/* Hero Showcase */}
      <HeroBanner onSelectPlatform={setPlatformFilter} />

      {/* Main Catalog Section */}
      <main id="catalogo" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        
        {/* Admin notice banner when logged in (EN ROJO) */}
        {isAdmin && (
          <div className="mb-8 p-4 sm:p-5 bg-red-950/40 border-2 border-red-600/70 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-red-950/40">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-red-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                Panel Administrador Activo
              </h4>
              <p className="text-xs text-red-200/80 mt-1 max-w-xl">
                Puedes agregar nuevos juegos al catálogo o modificar precios y fotos. Guarda tus cambios para que se sincronicen en la base de datos de Supabase para todos tus clientes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Botón para guardar los cambios en Supabase (en lugar de restablecer) */}
              <button
                type="button"
                onClick={handleSaveToSupabase}
                disabled={isSavingToSupabase}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs font-bold rounded-lg shadow-md border border-red-400 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                title="Guardar todos los cambios realizados en Supabase"
              >
                {isSavingToSupabase ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                    <span>Guardando en Supabase...</span>
                  </>
                ) : saveSuccessMessage ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>¡Guardado con éxito!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-white" />
                    <span>Guardar cambios en Supabase</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg border border-red-900/60 shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-red-400" />
                <span>Agregar Nuevo Juego</span>
              </button>
            </div>
          </div>
        )}

        {/* Promoción Destacada: Combo Joystick Inalámbrico + Cable de Carga PS3 ($40.000) */}
        <div id="combo-joystick">
          <JoystickComboBanner />
        </div>

        {/* Section Heading & Filter Controls */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-red-400 tracking-wider uppercase block mb-1">
                Especialistas en PlayStation 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Catálogo PlayStation 3
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium tabular-nums">
                {filteredGames.length} de {games.length} juegos
              </span>
              {!isAdmin && (
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Ingreso administrador"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-3 pt-2">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, saga o género (ej: GTA, Resident Evil, Terror)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1222] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* PlayStation Platform Filter Buttons: PS3 Primary + PS4/5 by Consultation */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0b1222] border border-slate-800 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
              {/* PS3 Primary */}
              <button
                type="button"
                onClick={() => setPlatformFilter('PS3')}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  platformFilter === 'PS3'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400'
                    : 'bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                <span>PS3 (Catálogo Activo)</span>
              </button>

              {/* Todos */}
              <button
                type="button"
                onClick={() => setPlatformFilter('TODOS')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  platformFilter === 'TODOS'
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos (+330)
              </button>

              {/* PS4 & PS5 Por Consulta */}
              <a
                href={generatePS4PS5InquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 bg-slate-900 text-sky-300 hover:text-emerald-300 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                title="Consultar por catálogo y juegos de PS4 y PS5 por WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>PS4 & PS5 (Por Consulta ↗)</span>
              </a>
            </div>

            {/* Genre Select */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 bg-[#0b1222] border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="TODOS">Todos los géneros</option>
                  <option value="ZOMBIES">🧟 Zombies / Terror</option>
                  <option value="AUTOS">🏎️ Autos / Carreras</option>
                  <option value="ACCION">⚔️ Acción / Aventura</option>
                  <option value="DEPORTES">⚽ Fútbol / Deportes</option>
                  <option value="SHOOTER">🎯 Shooter / FPS</option>
                  <option value="LUCHA">🥊 Lucha</option>
                  <option value="FAMILIAR">👪 Familiar / Niños</option>
                  <option value="MUNDO_ABIERTO">🗺️ Mundo Abierto</option>
                  <option value="RPG">🧙 RPG / Rol</option>
                  {uniqueGenres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort By Select */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 bg-[#0b1222] border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="name-asc">Nombre A-Z</option>
              </select>
            </div>

          </div>

          {/* Quick Category Chips for One-Click Navigation (Autos, Zombies, Acción, etc.) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-blue-400" /> Géneros:
            </span>
            {[
              { id: 'TODOS', label: 'Todos' },
              { id: 'ZOMBIES', label: '🧟 Zombies' },
              { id: 'AUTOS', label: '🏎️ Autos' },
              { id: 'ACCION', label: '⚔️ Acción' },
              { id: 'DEPORTES', label: '⚽ Deportes' },
              { id: 'SHOOTER', label: '🎯 Shooter' },
              { id: 'LUCHA', label: '🥊 Lucha' },
              { id: 'FAMILIAR', label: '👪 Familiar' },
              { id: 'MUNDO_ABIERTO', label: '🗺️ Mundo Abierto' },
              { id: 'RPG', label: '🧙 RPG' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setGenreFilter(chip.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  genreFilter === chip.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-[#0b1222] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 2 columns on mobile (celular), scaling up on larger screens */}
        {filteredGames.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {displayedGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onViewDetails={setSelectedGameForDetails}
                  onEditGame={handleOpenEdit}
                />
              ))}
            </div>

            {visibleCount < filteredGames.length && (
              <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredGames.length))}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Cargar más juegos ({filteredGames.length - visibleCount} restantes)</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  Mostrando {displayedGames.length} de {filteredGames.length} juegos
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center bg-[#0b1222]/50 border border-slate-800/80 rounded-2xl p-8 max-w-md mx-auto space-y-4">
            <h3 className="font-bold text-white text-lg">No encontramos juegos con esos filtros</h3>
            <p className="text-xs text-slate-400">
              Probá cambiando la búsqueda o restableciendo los filtros de consola y género.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('TODOS');
                setGenreFilter('TODOS');
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

      </main>

      {/* Modals & Drawers */}
      <GameDetailModal
        game={selectedGameForDetails}
        onClose={() => setSelectedGameForDetails(null)}
        onEditGame={handleOpenEdit}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />

      <GameFormModal
        isOpen={isGameFormOpen}
        onClose={() => setIsGameFormOpen(false)}
        gameToEdit={gameToEdit}
      />

      <CartDrawer />

      {/* Floating feedback toast to continue collecting games */}
      {lastAddedGame && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-blue-500/60 text-white px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-3.5 animate-in slide-in-from-bottom-4 duration-300 max-w-[90vw] sm:max-w-md">
          <div className="w-9 h-11 rounded overflow-hidden bg-slate-950 shrink-0 border border-slate-700">
            <img src={lastAddedGame.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs min-w-0 flex-1">
            <span className="font-semibold text-white block truncate">¡Agregado al carrito!</span>
            <span className="text-slate-300 text-[11px] truncate block">{lastAddedGame.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                clearLastAddedGame();
                setIsCartOpen(true);
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Ver Carrito ({cartCount})</span>
            </button>
            <button
              onClick={clearLastAddedGame}
              className="p-1.5 text-slate-400 hover:text-white rounded-md text-xs transition-colors"
              title="Seguir coleccionando"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <CatalogContent />
    </StoreProvider>
  );
}
