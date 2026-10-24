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

// Updated version key
const STORAGE_KEY_GAMES = 'total_game_catalog_ps3_v9_stable';
const STORAGE_KEY_CART = 'total_game_cart_v2';
const STORAGE_KEY_ADMIN = 'total_game_admin_auth_v1';

// Safe localStorage wrapper that never throws in Private Browsing / iOS Safari
const isStorageAvailable = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (isStorageAvailable()) {
        return window.localStorage.getItem(key);
      }
    } catch {
      return null;
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (isStorageAvailable()) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore quota exceeded or access denied
    }
  },
  removeItem: (key: string): void => {
    try {
      if (isStorageAvailable()) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
  purgeLegacyKeys: () => {
    try {
      if (!isStorageAvailable()) return;
      const legacyKeys = [
        'total_game_catalog_v1',
        'total_game_catalog_v2',
        'total_game_catalog_v3',
        'total_game_catalog_v4',
        'total_game_catalog_v5',
        'total_game_catalog_v6',
        'total_game_catalog_v7',
        'total_game_catalog_ps3_v8_fixed',
        'total_game_cart_v1',
      ];
      legacyKeys.forEach((k) => {
        try {
          window.localStorage.removeItem(k);
        } catch {}
      });

      // Collect all keys to remove without modifying storage during iteration
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith('total_game_catalog_') && key !== STORAGE_KEY_GAMES) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => {
        try {
          window.localStorage.removeItem(k);
        } catch {}
      });
    } catch {
      // ignore
    }
  },
};

// Hardcoded admin credentials
export const ADMIN_USERNAME = 'yako';
export const ADMIN_PASSWORD = 'yako';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Games state with auto-migration and stale data detection
  const [games, setGames] = useState<Game[]>(() => {
    try {
      safeStorage.purgeLegacyKeys();
      const saved = safeStorage.getItem(STORAGE_KEY_GAMES);
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
            safeStorage.removeItem(STORAGE_KEY_GAMES);
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
      return safeStorage.getItem(STORAGE_KEY_ADMIN) === 'true';
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
      safeStorage.purgeLegacyKeys();
      safeStorage.removeItem(STORAGE_KEY_CART);
    } catch {
      // ignore
    }
  }, []);

  // Persist games safely
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
    } catch (e) {
      console.warn('Failed to save games to storage', e);
    }
  }, [games]);

  // Persist admin auth safely
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_ADMIN, isAdmin ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save admin state', e);
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
      safeStorage.removeItem(STORAGE_KEY_GAMES);
      safeStorage.purgeLegacyKeys();
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
