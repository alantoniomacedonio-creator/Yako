import React from 'react';
import { Gamepad2, MessageCircle, Shield, RefreshCw } from 'lucide-react';
import { WHATSAPP_DISPLAY_PHONE, WHATSAPP_PHONE_NUMBER } from '../utils/whatsapp';
import { useStore } from '../context/StoreContext';

interface FooterProps {
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminLogin }) => {
  const { isAdmin, logoutAdmin, resetCatalog } = useStore();

  const handleResetCatalog = () => {
    if (confirm('¿Restablecer el catálogo al estado inicial predeterminado?')) {
      resetCatalog();
    }
  };

  return (
    <footer id="contacto" className="border-t border-blue-950/60 bg-[#050810] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="font-display font-black text-lg text-white uppercase tracking-wider">
                Total <span className="text-blue-500">Game</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Tu tienda de videojuegos de confianza. Especialistas en títulos de PlayStation 3, PlayStation 4 y PlayStation 5 en formato digital con entrega inmediata.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent('¡Hola Total Game! Tengo una consulta sobre los juegos de PlayStation.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/40 text-emerald-300 font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {WHATSAPP_DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Quick links & info */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">
              Información de Compra
            </h4>
            <ul className="space-y-2">
              <li>• Compra directa y rápida sin necesidad de registrarte</li>
              <li>• Envíos digitales inmediatos con instructivo de instalación</li>
              <li>• Envíos a domicilio y puntos de entrega</li>
              <li>• Medios de pago: Transferencia, Mercado Pago y Efectivo</li>
            </ul>
          </div>

          {/* Admin and system */}
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">
              Administración y Estado
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  handleResetCatalog();
                }}
                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors text-xs"
                title="Sincronizar y actualizar a la última versión del catálogo"
              >
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Sincronizar catálogo (185 juegos a $5.900)</span>
              </button>

              {isAdmin ? (
                <div className="space-y-2 pt-1 border-t border-slate-800/80">
                  <span className="text-emerald-400 font-medium block">
                    ✓ Modo Administrador Habilitado
                  </span>
                  <button
                    onClick={logoutAdmin}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors text-xs"
                  >
                    <span>Cerrar sesión de admin</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors text-xs"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Ingresar como Administrador</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Total Game. Todos los derechos reservados.</p>
          <p className="text-center sm:text-right">
            PlayStation, PS5, PS4 y DualSense son marcas registradas de Sony Interactive Entertainment Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};
