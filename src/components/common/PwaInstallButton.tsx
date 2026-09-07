import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

const PwaInstallModal = React.lazy(() =>
  import('./PwaInstallModal').then((m) => ({ default: m.PwaInstallModal }))
);

interface PwaInstallButtonProps {
  variant?: 'navbar' | 'compact' | 'badge' | 'drawer';
  className?: string;
}

export const PwaInstallButton: React.FC<PwaInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, installApp } = usePwaInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await installApp();
        if (!success) {
          setIsModalOpen(true);
        }
      } catch {
        setIsModalOpen(true);
      } finally {
        setIsInstalling(false);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {variant === 'badge' && (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="Install MD Writer as Desktop/Mobile App"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'compact' && (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          title="Install Desktop/Mobile App"
          aria-label="Install App"
          className={`w-9 h-9 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 text-sky-500" />
        </button>
      )}

      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all shadow-xs cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-sky-500" />
          <span>Install App</span>
        </button>
      )}

      {variant === 'drawer' && (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 flex items-center justify-center gap-2 transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 text-sky-500" />
          <span>Install MD Writer App</span>
        </button>
      )}

      {/* Branded PWA Install Modal with 1-click & guided steps — Lazy loaded */}
      {isModalOpen && (
        <React.Suspense fallback={null}>
          <PwaInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </React.Suspense>
      )}
    </>
  );
};
