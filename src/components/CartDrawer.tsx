import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingCart, ArrowRight, Copy, Check, ArrowLeft, Gamepad2, Zap, Gift, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  formatPrice,
  generateWhatsAppOrderUrl,
  calculateCartDiscounts,
  OrderCustomerInfo,
  WHATSAPP_DISPLAY_PHONE,
} from '../utils/whatsapp';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen, cartCount } = useStore();
  
  const [customerName, setCustomerName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'Envío digital (descarga directa)' | 'Envío a domicilio' | 'Retiro en sucursal'>('Envío digital (descarga directa)');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  const customerInfo: OrderCustomerInfo = {
    name: customerName,
    deliveryMethod,
    notes,
  };

  const promo = calculateCartDiscounts(cart);
  const whatsappUrl = generateWhatsAppOrderUrl(cart, customerInfo);

  const handleCopyOrder = () => {
    if (cart.length === 0) return;
    
    let text = `🎮 *PEDIDO TOTAL GAME - PLAYSTATION*\n\n`;
    let remainingFree = promo.freeGamesAllowed;

    cart.forEach((item, index) => {
      const isJoystick = item.game.id === 'combo-joystick-cable-ps3' || item.game.title.toLowerCase().includes('joystick');
      if (isJoystick) {
        text += `${index + 1}. 🎮 ${item.game.title} x${item.quantity}: ${formatPrice(item.game.price * item.quantity)}\n`;
      } else {
        const freeForThis = Math.min(remainingFree, item.quantity);
        remainingFree -= freeForThis;
        const paidUnits = item.quantity - freeForThis;
        if (freeForThis > 0 && paidUnits === 0) {
          text += `${index + 1}. 🎁 ${item.game.title} (${item.game.platform}) x${item.quantity}: ¡GRATIS $0! (Regalo con Joystick)\n`;
        } else if (freeForThis > 0) {
          text += `${index + 1}. 🎁 ${item.game.title} (${item.game.platform}) x${item.quantity} (${freeForThis} de regalo a $0): ${formatPrice(paidUnits * item.game.price)}\n`;
        } else {
          text += `${index + 1}. ${item.game.title} (${item.game.platform}) x${item.quantity}: ${formatPrice(item.game.price * item.quantity)}\n`;
        }
      }
    });

    if (promo.discount > 0) {
      text += `\n💵 Subtotal: ${formatPrice(promo.subtotal)}\n`;
      text += `🎁 Descuento Promo Joystick: -${formatPrice(promo.discount)}\n`;
    }
    text += `💰 Total: ${formatPrice(promo.total)}\n`;
    if (customerName.trim()) text += `👤 Cliente: ${customerName}\n`;
    text += `📦 Modalidad: ${deliveryMethod}\n`;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch {
      // fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReturnToCatalog = () => {
    setIsCartOpen(false);
    const catalogElement = document.getElementById('catalogo');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper tracking for rendering items with free badges
  let freeCounter = promo.freeGamesAllowed;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      {/* Background backdrop click to close and return */}
      <div 
        className="fixed inset-0 transition-opacity" 
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true" 
      />

      {/* Drawer content: Full width on mobile, 450px on desktop */}
      <div 
        className="relative w-full sm:max-w-md h-full bg-[#0a1020] border-l border-blue-900/40 shadow-2xl flex flex-col min-h-0 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReturnToCatalog}
              className="p-1.5 -ml-1 text-blue-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Volver al catálogo"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-semibold text-xs">Volver</span>
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-white text-sm sm:text-base">Mi Carrito</h3>
              <span className="bg-blue-950 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-800/50">
                {cartCount}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button to continue collecting */}
        {cart.length > 0 && (
          <div className="px-3.5 py-2 bg-blue-950/50 border-b border-blue-900/40 shrink-0">
            <button
              onClick={handleReturnToCatalog}
              className="w-full py-1.5 px-3 text-xs text-blue-300 hover:text-white font-medium flex items-center justify-center gap-1.5 bg-blue-900/20 hover:bg-blue-900/40 border border-blue-800/40 rounded-lg transition-colors group cursor-pointer"
            >
              <span className="text-blue-400 group-hover:-translate-x-0.5 transition-transform">←</span>
              <span>Seguir agregando más juegos</span>
            </button>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-950/50 border border-blue-900/50 flex items-center justify-center text-blue-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base mb-1">Tu carrito está vacío</h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Explorá el catálogo de PlayStation 3 o llevate el combo de Joystick + 2 juegos gratis a $0.
                </p>
              </div>
              <button
                onClick={handleReturnToCatalog}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                ← Ver Catálogo PlayStation 3
              </button>
            </div>
          ) : (
            <>
              {/* Promo Joystick Status Banner when joystick is in cart */}
              {promo.joystickQuantity > 0 && (
                <div className="animate-in fade-in duration-300">
                  {promo.freeGamesPending > 0 ? (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/90 via-[#181307] to-emerald-950/80 border-2 border-amber-500/80 shadow-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-amber-300 text-xs flex items-center gap-1.5">
                          <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ¡PROMO JOYSTICK ACTIVADA!
                        </span>
                        <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                          2 Juegos Gratis
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-snug">
                        Por llevarte el Combo Joystick + Cable tenés <strong>2 juegos de PS3 de regalo a $0</strong>.
                        {promo.freeGamesPending === 2 
                          ? ' ¡Elegí 2 juegos del catálogo para que te queden a $0!' 
                          : ' ¡Elegí 1 juego más para completar tu regalo!'}
                      </p>
                      <button
                        type="button"
                        onClick={handleReturnToCatalog}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Elegir mis {promo.freeGamesPending} {promo.freeGamesPending === 1 ? 'juego gratis' : 'juegos gratis'} en el catálogo</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-xs flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <span className="font-extrabold text-emerald-300 block">
                            ¡Tus 2 Juegos Gratis están Aplicados a $0!
                          </span>
                          <span className="text-[11px] text-emerald-200/80">
                            Ahorro de {formatPrice(promo.discount)} incluido en tu pedido
                          </span>
                        </div>
                      </div>
                      <span className="font-black text-emerald-300 text-sm tabular-nums">
                        -{formatPrice(promo.discount)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Items List */}
              <div className="space-y-2.5">
                {cart.map((item) => {
                  const isJoystick = item.game.id === 'combo-joystick-cable-ps3' || item.game.title.toLowerCase().includes('joystick');
                  
                  // Calculate free allocation for non-joysticks
                  let freeInThisItem = 0;
                  if (!isJoystick && freeCounter > 0) {
                    freeInThisItem = Math.min(freeCounter, item.quantity);
                    freeCounter -= freeInThisItem;
                  }

                  const paidUnits = item.quantity - freeInThisItem;
                  const itemEffectiveTotal = isJoystick 
                    ? item.game.price * item.quantity 
                    : paidUnits * item.game.price;

                  return (
                    <div
                      key={item.game.id}
                      className={`p-3 border rounded-xl flex gap-3 items-center transition-all ${
                        freeInThisItem > 0
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                          : isJoystick
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/20'
                          : 'bg-slate-900/80 border-slate-800/90 hover:border-blue-700/60'
                      }`}
                    >
                      {/* Thumbnail - Clicking returns to games */}
                      <button
                        type="button"
                        onClick={handleReturnToCatalog}
                        className="w-12 h-16 sm:w-14 sm:h-18 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800 hover:scale-105 transition-transform cursor-pointer flex flex-col items-center justify-center p-1 text-center"
                        title="Hacer clic para volver al catálogo y ver más juegos"
                      >
                        {item.game.imageUrl ? (
                          <img
                            src={item.game.imageUrl}
                            alt={item.game.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-between py-1 bg-gradient-to-b from-slate-900 to-blue-950/70">
                            <span className="text-[8px] font-black text-red-400">{item.game.platform}</span>
                            <Gamepad2 className="w-4 h-4 text-red-500/70" />
                            <span className="text-[7px] text-slate-400 line-clamp-1 max-w-[42px] leading-tight font-medium">{item.game.title}</span>
                          </div>
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                          <span className={`font-semibold ${item.game.platform.includes('PS3') ? 'text-red-400' : 'text-blue-400'}`}>
                            {item.game.platform}
                          </span>
                          <span>·</span>
                          <span className="truncate">{item.game.genre}</span>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleReturnToCatalog}
                          className="text-left font-semibold text-white text-xs sm:text-sm truncate block hover:text-blue-400 transition-colors cursor-pointer w-full"
                          title="Hacer clic para volver a los juegos"
                        >
                          {item.game.title}
                        </button>

                        <div className="flex items-center justify-between gap-2 mt-2">
                          {/* Price & Free Badge */}
                          {freeInThisItem > 0 ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-black text-emerald-400 tabular-nums">
                                  {formatPrice(itemEffectiveTotal)}
                                </span>
                                <span className="text-[10px] text-slate-500 line-through tabular-nums">
                                  {formatPrice(item.game.price * item.quantity)}
                                </span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/60 text-[9px] font-black uppercase inline-block">
                                🎁 {freeInThisItem} de Regalo a $0
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-white tabular-nums">
                              {formatPrice(item.game.price * item.quantity)}
                            </span>
                          )}

                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950">
                              <button
                                onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Reducir cantidad"
                                aria-label="Restar 1"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-bold text-white tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Aumentar cantidad"
                                aria-label="Sumar 1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.game.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Quitar del carrito"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Optional customer info for WhatsApp */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2.5 mt-2">
                <span className="text-xs font-semibold text-blue-300 block">
                  Personalizar pedido (Opcional)
                </span>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nombre o Apodo</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Marcos"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Entrega</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Envío digital (descarga directa)">Envío digital PS3 (descarga directa)</option>
                    <option value="Envío a domicilio">Envío a domicilio</option>
                    <option value="Retiro en sucursal">Retiro en persona</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nota o consulta</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: ¿Aceptan transferencia?"
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleReturnToCatalog}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                >
                  ← Seguir coleccionando juegos
                </button>
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Sticky WhatsApp Checkout */}
        {cart.length > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/95 space-y-2.5 shrink-0 pb-6 sm:pb-4 shadow-lg">
            {/* Price Breakdown */}
            <div className="space-y-1">
              {promo.discount > 0 && (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Subtotal:</span>
                    <span className="tabular-nums">{formatPrice(promo.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>🎁 Promo Joystick (2 juegos a $0):</span>
                    <span className="tabular-nums">-{formatPrice(promo.discount)}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Total a pagar ({cartCount} {cartCount === 1 ? 'producto' : 'productos'}):
                </span>
                <span className="text-xl font-black text-white tabular-nums tracking-tight">
                  {formatPrice(promo.total)}
                </span>
              </div>
            </div>

            {/* Primary Action: Direct WhatsApp Order Link */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white shrink-0" />
              <span>Confirmar pedido por WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
            </a>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>{WHATSAPP_DISPLAY_PHONE}</span>
              <button
                onClick={handleCopyOrder}
                className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                title="Copiar texto del pedido"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
