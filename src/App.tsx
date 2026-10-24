import React, { useState, useMemo } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { GameFormModal } from './components/GameFormModal';
import { Footer } from './components/Footer';
import { Game } from './types/game';
import { Search, Plus, Filter, Sparkles, Lock, ShoppingCart } from 'lucide-react';

const CatalogContent: React.FC = () => {
  const { games, isAdmin, lastAddedGame, clearLastAddedGame, setIsCartOpen, cartCount } = useStore();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('TODOS');
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
        if (genreFilter !== 'TODOS' && game.genre !== genreFilter) {
          return false;
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
        
        {/* Admin notice banner when logged in */}
        {isAdmin && (
          <div className="mb-8 p-4 bg-blue-950/50 border border-blue-600/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Panel Administrador Activo
              </h4>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Puedes agregar nuevos juegos al catálogo con imagen, descripción y precio, o modificar los existentes. Los visitantes únicamente podrán explorar y comprar por WhatsApp.
              </p>
            </div>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nuevo Juego</span>
            </button>
          </div>
        )}

        {/* Section Heading & Filter Controls */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-400 tracking-wider uppercase block mb-1">
                Juegos Originales
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Catálogo PlayStation
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
                placeholder="Buscar por nombre, saga o género (ej: Spider-Man, Terror)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#0b1222] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
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

            {/* Prominently Highlighted Platform Filter Buttons: PS5, PS4, PS3 */}
            <div className="flex items-center gap-1.5 p-1 bg-[#0b1222] border border-slate-800 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setPlatformFilter('TODOS')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  platformFilter === 'TODOS'
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos
              </button>

              {/* PS5 */}
              <button
                type="button"
                onClick={() => setPlatformFilter('PS5')}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  platformFilter === 'PS5'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30 ring-2 ring-sky-300'
                    : 'bg-sky-950/60 text-sky-400 hover:bg-sky-900/60 border border-sky-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>PS5</span>
              </button>

              {/* PS4 */}
              <button
                type="button"
                onClick={() => setPlatformFilter('PS4')}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  platformFilter === 'PS4'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400'
                    : 'bg-blue-950/60 text-blue-400 hover:bg-blue-900/60 border border-blue-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span>PS4</span>
              </button>

              {/* PS3 */}
              <button
                type="button"
                onClick={() => setPlatformFilter('PS3')}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  platformFilter === 'PS3'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-400'
                    : 'bg-red-950/60 text-red-400 hover:bg-red-900/60 border border-red-800/50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>PS3</span>
              </button>
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
        </div>

        {/* Product Cards Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onViewDetails={setSelectedGameForDetails}
                onEditGame={handleOpenEdit}
              />
            ))}
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
