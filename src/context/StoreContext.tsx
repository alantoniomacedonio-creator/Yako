import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, CartItem } from '../types/game';
import { INITIAL_GAMES } from '../data/initialGames';

interface StoreContextType {
  games: Game[];
  addGame: (gameData: Omit<Game, 'id' | 'createdAt'>) => void;
  updateGame: (id: string, updatedData: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  resetCatalog: () => void;
  syncCatalog: () => void;
  isAdmin: boolean;
  loginAdmin: (user: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  cart: CartItem[];
  addToCart: (game: Game, openDrawer?: boolean) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  cartTotal: number;
  lastAddedGame: Game | null;
  clearLastAddedGame: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Updated version key to force all browsers to discard old localStorage states
const STORAGE_KEY_GAMES = 'total_game_catalog_ps3_v8_fixed';
const STORAGE_KEY_CART = 'total_game_cart_v2';
const STORAGE_KEY_ADMIN = 'total_game_admin_auth_v1';

// Legacy keys to purge automatically from user browsers
const LEGACY_KEYS = [
  'total_game_catalog_v1',
  'total_game_catalog_v2',
  'total_game_catalog_v3',
  'total_game_catalog_v4',
  'total_game_catalog_v5',
  'total_game_catalog_v6',
  'total_game_catalog_v7',
  'total_game_cart_v1',
];

const purgeLegacyStorage = () => {
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    // Also remove any old keys that start with total_game_catalog_ but aren't current
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('total_game_catalog_') && k !== STORAGE_KEY_GAMES) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
};

// Hardcoded admin credentials
export const ADMIN_USERNAME = 'yako';
export const ADMIN_PASSWORD = 'yako';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Games state with auto-migration and stale data detection
  const [games, setGames] = useState<Game[]>(() => {
    try {
      purgeLegacyStorage();
      const saved = localStorage.getItem(STORAGE_KEY_GAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If ANY game has old 4900 price or old 'Primaria'/'Secundaria' conditions,
          // purge and immediately load clean INITIAL_GAMES
          const hasOldData = parsed.some(
            (g: any) =>
              g.price === 4900 ||
              (typeof g.condition === 'string' &&
                (g.condition.toLowerCase().includes('primaria') ||
                  g.condition.toLowerCase().includes('secundaria')))
          );

          if (hasOldData) {
            localStorage.removeItem(STORAGE_KEY_GAMES);
            return INITIAL_GAMES;
          }

          // Otherwise sanitize and return
          return parsed.map((g: Game) => ({
            ...g,
            price: g.price === 4900 ? 5900 : (g.price || 5900),
            condition:
              g.condition === ('Digital Primaria' as any) ||
              g.condition === ('Digital Secundaria' as any)
                ? 'Digital PS3'
                : (g.condition || 'Digital PS3'),
          }));
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_GAMES;
  });

  const [lastAddedGame, setLastAddedGame] = useState<Game | null>(null);

  // Admin login state (hardcoded user)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  // Cart state: Renews fresh every time user enters the page
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Clear any legacy cart or stale cart on mount
  useEffect(() => {
    try {
      purgeLegacyStorage();
      localStorage.removeItem(STORAGE_KEY_CART);
    } catch {
      // ignore
    }
  }, []);

  // Persist games
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games to localStorage', e);
    }
  }, [games]);

  // Persist admin auth
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN, isAdmin ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to save admin state', e);
    }
  }, [isAdmin]);

  const addGame = (gameData: Omit<Game, 'id' | 'createdAt'>) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setGames((prev) => [newGame, ...prev]);
  };

  const updateGame = (id: string, updatedData: Partial<Game>) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedData } : g))
    );
  };

  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    setCart((prev) => prev.filter((item) => item.game.id !== id));
  };

  const resetCatalog = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_GAMES);
      purgeLegacyStorage();
    } catch {}
    setGames(INITIAL_GAMES);
  };

  const syncCatalog = () => {
    resetCatalog();
  };

  const loginAdmin = (user: string, pass: string) => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === ADMIN_USERNAME && cleanPass === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return { success: true };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const addToCart = (game: Game, openDrawer: boolean = false) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.game.id === game.id);
      if (existing) {
        return prev.map((item) =>
          item.game.id === game.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { game, quantity: 1 }];
    });

    setLastAddedGame(game);
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const clearLastAddedGame = () => {
    setLastAddedGame(null);
  };

  const removeFromCart = (gameId: string) => {
    setCart((prev) => prev.filter((item) => item.game.id !== gameId));
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.game.id === gameId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.game.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        games,
        addGame,
        updateGame,
        deleteGame,
        resetCatalog,
        syncCatalog,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartTotal,
        lastAddedGame,
        clearLastAddedGame,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
