import React, { createContext, useContext, useState, useEffect } from 'react';
import { Game, CartItem } from '../types/game';
import { INITIAL_GAMES } from '../data/initialGames';
import {
  getSupabaseClient,
  mapRowToGame,
  mapGameToRow,
  saveSupabaseConfig,
} from '../lib/supabase';

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
  isSupabaseConnected: boolean;
  isSyncingToSupabase: boolean;
  syncToSupabase: () => Promise<{ success: boolean; message: string }>;
  saveCloudCredentials: (url: string, anonKey: string) => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Updated version key with categorized genres (Autos, Zombies, Acción, Deportes, etc.)
const STORAGE_KEY_GAMES = 'total_game_catalog_ps3_v13_categorized';
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

  // Supabase cloud database states
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isSyncingToSupabase, setIsSyncingToSupabase] = useState<boolean>(false);

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

  // Initialize Supabase and listen for Realtime broadcast across all devices
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseConnected(false);
      return;
    }

    let isMounted = true;

    const initSupabase = async () => {
      try {
        const { data, error } = await client
          .from('games')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase fetch error:', error);
          if (isMounted) setIsSupabaseConnected(false);
          return;
        }

        if (isMounted) {
          setIsSupabaseConnected(true);
          if (data && data.length > 0) {
            setGames(data.map(mapRowToGame));
          }
        }
      } catch (err) {
        console.warn('Supabase init failed:', err);
        if (isMounted) setIsSupabaseConnected(false);
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

    const client = getSupabaseClient();
    if (client) {
      client.from('games').insert(mapGameToRow(newGame)).then(({ error }) => {
        if (error) console.error('Error inserting to Supabase:', error);
      });
    }
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

  // Upload all 185 initial games to Supabase in batches of 40
  const syncToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase no está configurado.' };
    }
    setIsSyncingToSupabase(true);
    try {
      const rows = games.length > 0 ? games.map(mapGameToRow) : INITIAL_GAMES.map(mapGameToRow);
      const BATCH_SIZE = 40;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);
        const { error } = await client.from('games').upsert(chunk, { onConflict: 'id' });
        if (error) throw error;
      }
      setIsSyncingToSupabase(false);
      setIsSupabaseConnected(true);
      return {
        success: true,
        message: `¡Se cargaron exitosamente ${rows.length} juegos a tu base de datos Supabase!`,
      };
    } catch (err: any) {
      setIsSyncingToSupabase(false);
      return { success: false, message: err.message || 'Error al sincronizar con Supabase' };
    }
  };

  const saveCloudCredentials = async (url: string, anonKey: string): Promise<{ success: boolean; message: string }> => {
    try {
      saveSupabaseConfig(url, anonKey);
      const client = getSupabaseClient();
      if (!client) {
        return { success: false, message: 'No se pudo inicializar Supabase con esas credenciales.' };
      }
      const { data, error } = await client.from('games').select('id').limit(1);
      if (error) {
        return { success: false, message: `Error al conectar: ${error.message}. Asegúrate de haber ejecutado el script SQL en Supabase.` };
      }
      setIsSupabaseConnected(true);
      // If table has data, load it immediately
      const { data: fullData } = await client.from('games').select('*').order('created_at', { ascending: false });
      if (fullData && fullData.length > 0) {
        setGames(fullData.map(mapRowToGame));
      }
      return { success: true, message: '¡Conexión exitosa con Supabase! Los cambios ahora se reflejan en tiempo real.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Error de conexión' };
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
        isSupabaseConnected,
        isSyncingToSupabase,
        syncToSupabase,
        saveCloudCredentials,
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
