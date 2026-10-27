import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Protección anti-descarga y anti-copia de imágenes
if (typeof window !== 'undefined') {
  // 1. Bloquear clic derecho en imágenes y sus contenedores
  window.addEventListener(
    'contextmenu',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.closest('img') ||
          target.closest('.aspect-\\[3\\/4\\]') ||
          target.closest('.aspect-\\[4\\/3\\]') ||
          target.closest('article') ||
          target.classList.contains('no-download'))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { capture: true }
  );

  // 2. Bloquear arrastrar imágenes hacia el escritorio o a otra pestaña
  window.addEventListener(
    'dragstart',
    (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IMG' || target.closest('img'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    { capture: true }
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
