import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, CartItem } from '../types/game';
import { INITIAL_GAMES } from '../data/initialGames';
import {
  getSupabaseClient,
  mapRowToGame,
  mapGameToRow,
} from '../lib/supabase';

interface StoreContextType {
  games: Game[];
  addGame: (gameData: Omit<Game, 'id' | 'createdAt'>) => void;
  addMultipleGames: (newGames: Array<Omit<Game, 'id' | 'createdAt'> & { id?: string; createdAt?: number }>) => Promise<{ count: number }>;
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
  isSavingToSupabase: boolean;
  saveChangesToSupabase: () => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Updated version key with expanded catalog of 333 PlayStation games
const STORAGE_KEY_GAMES = 'total_game_catalog_ps3_v14_expanded_333';
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
        'total_game_catalog_ps3_v9_stable',
        'total_game_catalog_ps3_v10_urls',
        'total_game_catalog_ps3_v11_re_fixed',
        'total_game_catalog_ps3_v12_covers_audited',
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

  // Admin login state: ALWAYS false by default on entry. Never auto-logins.
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Cart state: Renews fresh every time user enters the page
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Clear any legacy cart or stale admin auth from storage on mount
  useEffect(() => {
    try {
      safeStorage.purgeLegacyKeys();
      safeStorage.removeItem(STORAGE_KEY_CART);
      safeStorage.removeItem(STORAGE_KEY_ADMIN);
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(STORAGE_KEY_ADMIN);
      }
    } catch {
      // ignore
    }
  }, []);

  // Load games from Supabase on mount and listen for Realtime broadcast across all devices
  useEffect(() => {
    let isMounted = true;
    const client = getSupabaseClient();

    const initSupabase = async () => {
      try {
        const { data, error } = await client
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error:', error);
          return;
        }

        if (isMounted && data && data.length > 0) {
          setGames(data.map(mapRowToGame));
        }
      } catch (err) {
        console.warn('Supabase init failed:', err);
      }
    };

    initSupabase();

    // Live Realtime listener: Whenever any device adds, edits, or deletes a game,
    // every other device updates immediately in under 1 second!
    const channel = client
      .channel('public:games')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'games' },
        (payload) => {
          if (!isMounted) return;
          if (payload.eventType === 'INSERT') {
            const newGame = mapRowToGame(payload.new);
            setGames((prev) => [newGame, ...prev.filter((g) => g.id !== newGame.id)]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapRowToGame(payload.new);
            setGames((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setGames((prev) => prev.filter((g) => g.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, []);

  // Persist games to local storage as fallback
  useEffect(() => {
    try {
      safeStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
    } catch (e) {
      console.warn('Failed to save games to storage', e);
    }
  }, [games]);


  const addGame = (gameData: Omit<Game, 'id' | 'createdAt'>) => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    setGames((prev) => [newGame, ...prev]);

    const client = getSupabaseClient();
    if (client) {
      client.from('games').insert(mapGameToRow(newGame)).then(({ error }) => {
        if (error) console.error('Error inserting to Supabase:', error);
      });
    }
  };

  const addMultipleGames = async (
    newGamesList: Array<Omit<Game, 'id' | 'createdAt'> & { id?: string; createdAt?: number }>
  ): Promise<{ count: number }> => {
    const preparedGames: Game[] = newGamesList.map((g, index) => ({
      id: g.id || `game-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: g.createdAt || (Date.now() - index * 100),
      title: g.title?.trim() || 'Juego sin título',
      condition: g.condition || 'Digital',
      platform: g.platform || 'PS3',
      genre: g.genre || 'Acción / Aventura',
      price: Number(g.price) || 5900,
      description: g.description?.trim() || 'Juego original para PlayStation en formato digital.',
      imageUrl: g.imageUrl?.trim() || '',
      inStock: g.inStock !== false,
      featured: !!g.featured,
      releaseYear: Number(g.releaseYear) || 2013,
      languages: g.languages || 'Español Latino, Inglés',
    }));

    setGames((prev) => [...preparedGames, ...prev]);

    // Persist immediately in batches of 40 to Supabase
    try {
      const client = getSupabaseClient();
      if (client) {
        const rows = preparedGames.map(mapGameToRow);
        const BATCH_SIZE = 40;
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const chunk = rows.slice(i, i + BATCH_SIZE);
          await client.from('games').upsert(chunk, { onConflict: 'id' });
        }
      }
    } catch (err) {
      console.error('Error saving multiple games to Supabase:', err);
    }

    return { count: preparedGames.length };
  };

  const updateGame = (id: string, updatedData: Partial<Game>) => {
    let fullUpdatedGame: Game | null = null;
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          fullUpdatedGame = { ...g, ...updatedData };
          return fullUpdatedGame;
        }
        return g;
      })
    );

    const client = getSupabaseClient();
    if (client) {
      const existing = games.find((g) => g.id === id);
      const target = fullUpdatedGame || (existing ? { ...existing, ...updatedData } : null);
      if (target) {
        client.from('games').update(mapGameToRow(target)).eq('id', id).then(({ error }) => {
          if (error) console.error('Error updating to Supabase:', error);
        });
      }
    }
  };

  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    setCart((prev) => prev.filter((item) => item.game.id !== id));

    const client = getSupabaseClient();
    if (client) {
      client.from('games').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Error deleting from Supabase:', error);
      });
    }
  };

  const [isSavingToSupabase, setIsSavingToSupabase] = useState(false);

  // Guarda todos los cambios realizados por el admin en Supabase
  const saveChangesToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsSavingToSupabase(true);
    try {
      const client = getSupabaseClient();
      const rows = games.map(mapGameToRow);
      const BATCH_SIZE = 40;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);
        const { error } = await client.from('games').upsert(chunk, { onConflict: 'id' });
        if (error) throw error;
      }
      setIsSavingToSupabase(false);
      return { success: true, message: `¡${rows.length} juegos guardados en Supabase con éxito!` };
    } catch (err: any) {
      setIsSavingToSupabase(false);
      console.error('Error saving to Supabase:', err);
      return { success: false, message: err.message || 'Error al guardar en Supabase' };
    }
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
        addMultipleGames,
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
        isSavingToSupabase,
        saveChangesToSupabase,
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
