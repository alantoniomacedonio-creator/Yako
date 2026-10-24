export type Platform = 'PS5' | 'PS4' | 'PS3' | 'PS5 / PS4' | 'PS4 / PS3';

export type GameCondition = 'Nuevo Físico' | 'Digital Primaria' | 'Digital Secundaria' | 'Físico Seminuevo';

export type GameGenre = 
  | 'Acción / Aventura'
  | 'RPG / Rol'
  | 'Carreras / Deportes'
  | 'Shooter / FPS'
  | 'Terror / Supervivencia'
  | 'Lucha'
  | 'Familiar / Plataformas';

export interface Game {
  id: string;
  title: string;
  platform: Platform;
  genre: string;
  condition: GameCondition;
  price: number; // in ARS / currency
  description: string;
  imageUrl: string;
  inStock: boolean;
  featured?: boolean;
  rating?: number;
  releaseYear?: number;
  languages?: string;
  createdAt: number;
}

export interface CartItem {
  game: Game;
  quantity: number;
}
