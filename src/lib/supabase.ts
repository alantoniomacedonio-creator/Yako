import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Game } from '../types/game';

const STORAGE_KEY_SB_URL = 'total_game_sb_url';
const STORAGE_KEY_SB_KEY = 'total_game_sb_key';

// User's Supabase project configuration
export const DEFAULT_SUPABASE_URL = 'https://wdwmewojzwqpicfmqesw.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_gw-hg2sJJHxWCFz0k72MZA_A3EQ2Pjt';

// Read from Vercel environment variables or from admin-saved configuration or default
export const getSupabaseConfig = () => {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

  if (envUrl && envKey) {
    return { url: envUrl.trim(), anonKey: envKey.trim() };
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUrl = window.localStorage.getItem(STORAGE_KEY_SB_URL) || '';
      const savedKey = window.localStorage.getItem(STORAGE_KEY_SB_KEY) || '';
      if (savedUrl && savedKey) {
        return { url: savedUrl.trim(), anonKey: savedKey.trim() };
      }
    }
  } catch {}

  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_KEY };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY_SB_URL, url.trim());
      window.localStorage.setItem(STORAGE_KEY_SB_KEY, anonKey.trim());
    }
  } catch {}
};

export const clearSupabaseConfig = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY_SB_URL);
      window.localStorage.removeItem(STORAGE_KEY_SB_KEY);
    }
  } catch {}
};

let cachedClient: SupabaseClient | null = null;
let currentConfigKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const key = `${config.url}|${config.anonKey}`;
  if (cachedClient && currentConfigKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false },
    });
    currentConfigKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

// Maps database row (snake_case) to client Game interface (camelCase)
export const mapRowToGame = (row: any): Game => ({
  id: row.id,
  title: row.title || 'Juego sin título',
  platform: row.platform || 'PS3',
  genre: row.genre || 'Acción / Aventura',
  condition: row.condition || 'Digital PS3',
  price: Number(row.price) || 5900,
  description: row.description || '',
  imageUrl: row.image_url || row.imageUrl || '',
  inStock: row.in_stock !== undefined ? !!row.in_stock : true,
  featured: !!row.featured,
  languages: row.languages || 'Español Latino, Inglés',
  releaseYear: Number(row.release_year) || 2013,
  createdAt: Number(row.created_at) || Date.now(),
});

// Maps client Game interface to database row
export const mapGameToRow = (game: Game | (Omit<Game, 'id' | 'createdAt'> & { id?: string; createdAt?: number })) => ({
  id: game.id,
  title: game.title,
  platform: game.platform,
  genre: game.genre,
  condition: game.condition,
  price: game.price,
  description: game.description,
  image_url: game.imageUrl,
  in_stock: game.inStock,
  featured: game.featured,
  languages: game.languages || 'Español Latino, Inglés',
  release_year: Math.round(Number(game.releaseYear) || 2013),
  created_at: Math.round(Number(game.createdAt) || Date.now()),
});
