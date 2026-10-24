import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Save, Check, Plus } from 'lucide-react';
import { Game, Platform, GameCondition } from '../types/game';
import { useStore } from '../context/StoreContext';
interface GameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameToEdit?: Game | null;
}

export const GameFormModal: React.FC<GameFormModalProps> = ({
  isOpen,
  onClose,
  gameToEdit,
}) => {
  const { addGame, updateGame } = useStore();

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<Platform>('PS5');
  const [genre, setGenre] = useState('Acción / Aventura');
  const [condition, setCondition] = useState<GameCondition>('Digital PS3');
  const [price, setPrice] = useState<number>(5900);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [languages, setLanguages] = useState('Español Latino, Inglés');
  const [releaseYear, setReleaseYear] = useState<number>(2013);

  useEffect(() => {
    if (gameToEdit) {
      setTitle(gameToEdit.title);
      setPlatform(gameToEdit.platform);
      setGenre(gameToEdit.genre);
      setCondition(gameToEdit.condition);
      setPrice(gameToEdit.price);
      setDescription(gameToEdit.description);
      setImageUrl(gameToEdit.imageUrl);
      setInStock(gameToEdit.inStock);
      setFeatured(!!gameToEdit.featured);
      setLanguages(gameToEdit.languages || 'Español Latino, Inglés');
      setReleaseYear(gameToEdit.releaseYear || 2013);
    } else {
      // Defaults for new game
      setTitle('');
      setPlatform('PS3');
      setGenre('Acción / Aventura');
      setCondition('Digital PS3');
      setPrice(5900);
      setDescription('');
      setImageUrl('');
      setInStock(true);
      setFeatured(false);
      setLanguages('Español Latino, Inglés');
      setReleaseYear(2013);
    }
  }, [gameToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 380;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            setImageUrl(optimizedDataUrl);
          }
        };
        if (typeof event.target?.result === 'string') {
          img.src = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Por favor ingresa el título del juego');
      return;
    }

    const payload = {
      title: title.trim(),
      platform,
      genre,
      condition,
      price: Number(price) || 5900,
      description: description.trim() || 'Juego original para PlayStation en excelente estado.',
      imageUrl: imageUrl.trim(),
      inStock,
      featured,
      languages,
      releaseYear: Number(releaseYear) || 2013,
    };

    if (gameToEdit) {
      updateGame(gameToEdit.id, payload);
    } else {
      addGame(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0a1020] border border-blue-900/50 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              {gameToEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {gameToEdit ? 'Editar Juego en Catálogo' : 'Agregar Nuevo Juego al Catálogo'}
              </h3>
              <p className="text-xs text-slate-400">
                Solo visible y editable por el administrador
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Título del Juego *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Final Fantasy VII Rebirth"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Platform */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Plataforma PlayStation *
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="PS5">PlayStation 5 (PS5)</option>
                <option value="PS4">PlayStation 4 (PS4)</option>
                <option value="PS3">PlayStation 3 (PS3)</option>
                <option value="PS5 / PS4">PS5 & PS4 (Cross-Gen)</option>
                <option value="PS4 / PS3">PS4 & PS3</option>
              </select>
            </div>

            {/* Genre */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Género
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Acción / Aventura">Acción / Aventura</option>
                <option value="RPG / Rol">RPG / Rol</option>
                <option value="Terror / Supervivencia">Terror / Supervivencia</option>
                <option value="Carreras / Deportes">Carreras / Deportes</option>
                <option value="Shooter / FPS">Shooter / FPS</option>
                <option value="Lucha">Lucha</option>
                <option value="Familiar / Plataformas">Familiar / Plataformas</option>
              </select>
            </div>

            {/* Condition / Format */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Formato / Condición
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as GameCondition)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Digital PS3">Digital PS3</option>
                <option value="Digital">Digital</option>
                <option value="Físico">Físico</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Precio (ARS $) *
              </label>
              <input
                type="number"
                required
                min={1}
                step={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="55000"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white tabular-nums focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Descripción del juego
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve reseña del juego, características o detalles del contenido incluido..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Image Selection Area */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 block">
                  URL de Imagen / Portada (Directa de Internet)
                </label>
                <span className="text-[11px] text-blue-400 font-medium">
                  Sin almacenamiento en la nube
                </span>
              </div>

              {/* Direct URL input */}
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Pega la URL directa de la imagen (ej: https://art.gametdb.com/... o https://...)"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-2 font-mono text-[11px]"
              />

              {/* Upload local file */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>Subir archivo local (Optimización automática)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-500">Se guarda directamente en tu catálogo local</span>
              </div>

              {/* Preview */}
              {imageUrl && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="w-12 h-16 rounded overflow-hidden bg-slate-900 shrink-0">
                    <img src={imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    <span className="text-emerald-400 font-medium block">✓ Imagen cargada correctamente</span>
                    <span className="text-[11px] truncate block max-w-sm">{imageUrl.substring(0, 45)}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* In stock and Featured toggles */}
            <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <span>Disponible en Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
                <span>Juego Destacado (Top)</span>
              </label>
            </div>

          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>{gameToEdit ? 'Guardar Cambios' : 'Publicar en Catálogo'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
