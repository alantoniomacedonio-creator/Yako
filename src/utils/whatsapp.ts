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

export function formatPublicationDate(timestamp?: number): string {
  if (!timestamp) return '26/10/2026';
  const date = new Date(timestamp);
  if (isNaN(date.getTime()) || timestamp < 1000000000000) return '26/10/2026';
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export interface OrderCustomerInfo {
  name?: string;
  deliveryMethod?: 'Envío digital (descarga directa)' | 'Envío a domicilio' | 'Retiro en sucursal';
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

export function generatePS4PS5InquiryUrl(): string {
  const message = `¡Hola Total Game! 👋 Quiero consultar catálogo, disponibilidad y precios de juegos para PlayStation 4 y PlayStation 5. ¿Me podrían pasar info?`;
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateJoystickComboWhatsAppUrl(): string {
  const message = `¡Hola Total Game! 👋 Quiero pedir el *Combo Joystick Inalámbrico PS3 + Cable de Carga* en promo por *${formatPrice(40000)}*. ¿Tienen stock disponible?`;
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const JOYSTICK_COMBO_PRODUCT = {
  id: 'combo-joystick-cable-ps3',
  title: 'Combo Joystick Inalámbrico PS3 + Cable de Carga',
  platform: 'PS3' as const,
  genre: 'Accesorios / Joysticks',
  condition: 'Digital' as const,
  price: 40000,
  description: 'Joystick DualShock 3 inalámbrico Bluetooth (batería recargable, doble vibración y sensor de movimiento) + Cable de carga USB reforzado de alta durabilidad para PS3.',
  imageUrl: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?w=800&auto=format&fit=crop&q=80',
  inStock: true,
  featured: true,
  releaseYear: 2026,
  createdAt: Date.now(),
};
