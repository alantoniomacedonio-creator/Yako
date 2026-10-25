import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Game } from '../types/game';

// Hardcoded Supabase credentials - Sin variables de entorno ni configuraciones complejas
export const SUPABASE_URL = 'https://wdwmewojzwqpicfmqesw.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_gw-hg2sJJHxWCFz0k72MZA_A3EQ2Pjt';

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
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
  releaseYear: Math.round(Number(row.release_year) || 2013),
  createdAt: Math.round(Number(row.created_at) || Date.now()),
});

// Maps client Game interface to database row
export const mapGameToRow = (game: Game | (Omit<Game, 'id' | 'createdAt'> & { id?: string; createdAt?: number })) => ({
  id: game.id,
  title: game.title,
  platform: game.platform,
  genre: game.genre,
  condition: game.condition,
  price: game.price,
  description: game.description || '',
  image_url: game.imageUrl || '',
  in_stock: game.inStock !== false,
  featured: !!game.featured,
  languages: game.languages || 'Español Latino, Inglés',
  release_year: Math.round(Number(game.releaseYear) || 2013),
  created_at: Math.round(Number(game.createdAt) || Date.now()),
});
