import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Download, 
  Check, 
  Sparkles, 
  WifiOff, 
  Zap, 
  ShieldCheck
} from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, installApp } = usePwaInstall();
  const [activePlatform, setActivePlatform] = useState<'desktop' | 'ios' | 'android'>('desktop');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [installFeedback, setInstallFeedback] = useState<string | null>(null);

  // Close on Escape key and prevent body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setIsInstalling(true);
    setInstallFeedback(null);
    try {
      const success = await installApp();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setInstallFeedback(
          'Please click the install icon in your browser address bar (⊕ or 🖥️) or select your platform below.'
        );
      }
    } catch {
      setInstallFeedback(
        'Please click the install icon in your browser address bar (⊕ or 🖥️) or select your platform below.'
      );
    } finally {
      setIsInstalling(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 overflow-y-auto max-h-[90vh] text-neutral-900 dark:text-neutral-100 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Logo */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-black text-xl shadow-md shrink-0">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-neutral-950 dark:text-white">
                Install MD Writer
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold font-mono">
                PWA Ready
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Instant launch, offline storage, and dedicated window.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center">
            <WifiOff className="w-4 h-4 text-sky-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold">100% Offline</div>
            <div className="text-[9.5px] text-neutral-400">IndexedDB sync</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center">
            <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold">Instant 60FPS</div>
            <div className="text-[9.5px] text-neutral-400">Zero startup lag</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <div className="text-[11px] font-bold">Local First</div>
            <div className="text-[9.5px] text-neutral-400">100% private</div>
          </div>
        </div>

        {/* Primary Action Button */}
        {installSuccess || isInstalled ? (
          <div className="p-3.5 mb-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center justify-center gap-2 text-xs font-bold">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>MD Writer is installed as an app!</span>
          </div>
        ) : (
          <div className="mb-5 space-y-2">
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="w-full py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-sky-400 dark:text-sky-600" />
              <span>
                {isInstalling
                  ? 'Installing...'
                  : isInstallable
                  ? 'Install Now (1-Click)'
                  : 'Install App'}
              </span>
            </button>

            {installFeedback && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
                {installFeedback}
              </div>
            )}
          </div>
        )}

        {/* Platform Instruction Tabs */}
        <div>
          <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-2 mb-3">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Installation Steps</span>
            </span>

            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setActivePlatform('desktop')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  activePlatform === 'desktop'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Chrome/Edge
              </button>
              <button
                onClick={() => setActivePlatform('ios')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  activePlatform === 'ios'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                iOS / Safari
              </button>
              <button
                onClick={() => setActivePlatform('android')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  activePlatform === 'android'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white font-bold shadow-2xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Android
              </button>
            </div>
          </div>

          {/* Tab 1: Desktop Chrome & Edge */}
          {activePlatform === 'desktop' && (
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Click the <strong>Install</strong> icon in the right side of your browser URL address bar (looks like a monitor or <span className="font-mono font-bold">⊕</span>).</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Or click browser menu (<span className="font-mono font-bold">⋮</span>) &rarr; <strong>&quot;Save and share&quot;</strong> &rarr; <strong>&quot;Install MD Writer&quot;</strong>.</span>
              </div>
            </div>
          )}

          {/* Tab 2: iOS Safari */}
          {activePlatform === 'ios' && (
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Tap the <strong>Share</strong> button (the box with an upward arrow <span className="font-mono">⎋</span>) in Safari.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong> (<span className="font-mono">⊞</span>).</span>
              </div>
            </div>
          )}

          {/* Tab 3: Android Chrome */}
          {activePlatform === 'android' && (
            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-200/70 dark:border-neutral-800/80">
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Tap the three dots menu (<span className="font-mono font-bold">⋮</span>) in top right.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-neutral-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-850 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
