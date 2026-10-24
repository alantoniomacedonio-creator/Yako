import { CartItem } from '../types/game';

export const WHATSAPP_PHONE_NUMBER = '5493424866276';
export const WHATSAPP_DISPLAY_PHONE = '+54 9 342 486-6276';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface OrderCustomerInfo {
  name?: string;
  deliveryMethod?: 'Envío a domicilio' | 'Retiro en sucursal' | 'Envío digital (código/cuenta)';
  notes?: string;
}

export function generateWhatsAppOrderUrl(
  items: CartItem[],
  customerInfo?: OrderCustomerInfo
): string {
  if (items.length === 0) return '';

  const total = items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);

  let message = `🎮 *PEDIDO TOTAL GAME - PLAYSTATION*\n\n`;
  message += `¡Hola! Quiero comprar los siguientes juegos de PlayStation:\n\n`;

  items.forEach((item, index) => {
    const itemTotal = item.game.price * item.quantity;
    message += `${index + 1}. *${item.game.title}* [${item.game.platform}]\n`;
    message += `   • Formato: ${item.game.condition}\n`;
    message += `   • Cantidad: ${item.quantity} x ${formatPrice(item.game.price)} = *${formatPrice(itemTotal)}*\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *TOTAL A PAGAR: ${formatPrice(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (customerInfo?.name?.trim()) {
    message += `👤 *Cliente:* ${customerInfo.name.trim()}\n`;
  }
  if (customerInfo?.deliveryMethod) {
    message += `📦 *Modalidad:* ${customerInfo.deliveryMethod}\n`;
  }
  if (customerInfo?.notes?.trim()) {
    message += `📝 *Nota:* ${customerInfo.notes.trim()}\n`;
  }

  message += `\n¿Me confirman disponibilidad y medios de pago? ¡Muchas gracias!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
}

export function generateSingleGameWhatsAppUrl(gameTitle: string, gamePrice: number, platform: string): string {
  const message = `¡Hola Total Game! 👋 Me interesa comprar *${gameTitle}* (${platform}) a ${formatPrice(gamePrice)}. ¿Tienen stock disponible?`;
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}
