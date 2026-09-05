import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  BatteryCharging, 
  Zap, 
  Eye, 
  Activity, 
  RotateCcw,
  MousePointer2,
  Keyboard
} from 'lucide-react';
import { useWritingFxStore, CursorStyle, TypingEffect } from '../../stores/useWritingFxStore';

interface WritingFxPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
  type: 'spark' | 'ripple' | 'matrix';
}

export const WritingFxPopover: React.FC<WritingFxPopoverProps> = ({ isOpen, onClose }) => {
  const { 
    cursorStyle, 
    typingEffect, 
    lowPowerMode, 
    setCursorStyle, 
    setTypingEffect, 
    toggleLowPowerMode,
    resetDefaults
  } = useWritingFxStore();

  const [testInputText, setTestInputText] = useState('');
  const [demoParticles, setDemoParticles] = useState<Particle[]>([]);
  const [inputParticles, setInputParticles] = useState<Particle[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);
  const testInputRef = useRef<HTMLInputElement>(null);

  // Auto-typing animation state for loop preview
  const [demoText, setDemoText] = useState('');
  const [demoIndex, setDemoIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const fullDemoPhrase = 'Markdown is thought rendered into form... ⚡';

  // Spawn particle burst for demo loop
  const spawnDemoParticles = useCallback((x: number, y: number) => {
    if (lowPowerMode || typingEffect === 'none') return;

    const colors = cursorStyle === 'terminal' 
      ? ['#22c55e', '#4ade80', '#86efac'] 
      : cursorStyle === 'amber'
        ? ['#f59e0b', '#fbbf24', '#fde68a']
        : ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

    const count = typingEffect === 'sparks' ? 5 : typingEffect === 'ripple' ? 1 : 4;
    const type = typingEffect === 'ripple' ? 'ripple' : typingEffect === 'matrix' ? 'matrix' : 'spark';

    const newBatch: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = type === 'ripple' ? 0 : 20 + Math.random() * 25;
      return {
        id: Date.now() + Math.random() + i,
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: type === 'ripple' ? 22 : 3 + Math.random() * 3,
        type
      };
    });

    setDemoParticles(prev => [...prev.slice(-20), ...newBatch]);
  }, [lowPowerMode, typingEffect, cursorStyle]);

  // Spawn particle burst for interactive test input
  const spawnInputParticles = useCallback((x: number, y: number) => {
    if (lowPowerMode || typingEffect === 'none') return;

    const colors = cursorStyle === 'terminal' 
      ? ['#22c55e', '#4ade80', '#86efac'] 
      : cursorStyle === 'amber'
        ? ['#f59e0b', '#fbbf24', '#fde68a']
        : ['#38bdf8', '#818cf8', '#c084fc', '#f472b6'];

    const count = typingEffect === 'sparks' ? 5 : typingEffect === 'ripple' ? 1 : 4;
    const type = typingEffect === 'ripple' ? 'ripple' : typingEffect === 'matrix' ? 'matrix' : 'spark';

    const newBatch: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = type === 'ripple' ? 0 : 20 + Math.random() * 25;
      return {
        id: Date.now() + Math.random() + i,
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: type === 'ripple' ? 22 : 3 + Math.random() * 3,
        type
      };
    });

    setInputParticles(prev => [...prev.slice(-20), ...newBatch]);
  }, [lowPowerMode, typingEffect, cursorStyle]);

  // Clean up particles
  useEffect(() => {
    if (demoParticles.length === 0) return;
    const timer = setTimeout(() => {
      setDemoParticles(prev => prev.slice(demoParticles.length));
    }, 450);
    return () => clearTimeout(timer);
  }, [demoParticles]);

  useEffect(() => {
    if (inputParticles.length === 0) return;
    const timer = setTimeout(() => {
      setInputParticles(prev => prev.slice(inputParticles.length));
    }, 450);
    return () => clearTimeout(timer);
  }, [inputParticles]);

  // Auto-typing loop for the one-line live preview
  useEffect(() => {
    if (!isOpen) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && demoIndex < fullDemoPhrase.length) {
      timeout = setTimeout(() => {
        setDemoText(fullDemoPhrase.slice(0, demoIndex + 1));
        setDemoIndex(prev => prev + 1);
        const xPos = Math.min(24 + (demoIndex + 1) * 6.8, 300);
        spawnDemoParticles(xPos, 22);
      }, 75);
    } else if (!isDeleting && demoIndex === fullDemoPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && demoIndex > 0) {
      timeout = setTimeout(() => {
        setDemoText(fullDemoPhrase.slice(0, demoIndex - 1));
        setDemoIndex(prev => prev - 1);
      }, 35);
    } else if (isDeleting && demoIndex === 0) {
      setIsDeleting(false);
      timeout = setTimeout(() => {}, 500);
    }

    return () => clearTimeout(timeout);
  }, [isOpen, demoIndex, isDeleting, spawnDemoParticles, fullDemoPhrase]);

  // Handle keystroke in interactive test input
  const handleTestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTestInputText(e.target.value);
    const caretPos = e.target.selectionStart || e.target.value.length;
    const xPos = Math.min(38 + caretPos * 7.2, 320);
    spawnInputParticles(xPos, 18);
  };

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [isOpen, onClose]);

  const renderCaretPreview = (style: CursorStyle) => {
    switch (style) {
      case 'neon':
        return (
          <span className="inline-block w-1.5 h-4.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] animate-pulse ml-0.5 align-middle" />
        );
      case 'terminal':
        return (
          <span className="inline-block w-2.5 h-4.5 bg-emerald-500 shadow-[0_0_6px_#10b981] ml-0.5 align-middle" style={{ animation: 'caretTerminalBlink 1s steps(2, start) infinite' }} />
        );
      case 'amber':
        return (
          <span className="inline-block w-2.5 h-4.5 bg-amber-500 shadow-[0_0_6px_#f59e0b] ml-0.5 align-middle" style={{ animation: 'caretAmberCrt 1.2s ease-in-out infinite' }} />
        );
      case 'minimal':
        return (
          <span className="inline-block w-0.5 h-4.5 bg-neutral-900 dark:bg-white ml-0.5 align-middle animate-pulse" />
        );
      case 'default':
      default:
        return (
          <span className="inline-block w-px h-4.5 bg-neutral-900 dark:bg-white ml-0.5 align-middle" />
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end sm:p-4 pt-16 pr-6 pointer-events-none">
          {/* Floating Popover Container */}
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', damping: 26, stiffness: 380 }}
            className="w-full max-w-sm sm:max-w-md bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-2xl overflow-hidden pointer-events-auto flex flex-col p-5 space-y-4 text-xs select-none"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-900/50 shadow-inner">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-950 dark:text-white flex items-center gap-1.5">
                    Writing FX & Cursor Studio
                    <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-mono font-bold">60 FPS</span>
                  </h3>
                  <p className="text-[10px] text-neutral-400">Custom caret styles, keystroke physics & live preview</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance / Low Power Toggle */}
            <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${lowPowerMode ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}`}>
                  {lowPowerMode ? <BatteryCharging className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <div className="font-bold text-neutral-900 dark:text-white">Performance / Low-Power Mode</div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {lowPowerMode ? 'Heavy particles disabled (smooth on older PCs)' : 'Full 60fps GPU particle bursts enabled'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleLowPowerMode}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  lowPowerMode ? 'bg-amber-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    lowPowerMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Cursor Styles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <MousePointer2 className="w-3 h-3" />
                  Cursor Styles
                </span>
                <span className="text-[10px] lowercase font-normal text-neutral-400">Active: {cursorStyle}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'neon', name: 'Neon Glow', badge: 'bg-cyan-500', color: 'text-cyan-600 dark:text-cyan-400' },
                  { id: 'terminal', name: 'Terminal', badge: 'bg-emerald-500', color: 'text-emerald-600 dark:text-emerald-400' },
                  { id: 'amber', name: 'Amber CRT', badge: 'bg-amber-500', color: 'text-amber-600 dark:text-amber-400' },
                  { id: 'minimal', name: 'Minimal Line', badge: 'bg-neutral-400', color: 'text-neutral-700 dark:text-neutral-300' },
                  { id: 'default', name: 'Standard OS', badge: 'bg-neutral-300', color: 'text-neutral-500' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCursorStyle(item.id as CursorStyle)}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      cursorStyle === item.id
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span className="truncate">{item.name}</span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${item.badge} ${cursorStyle === item.id ? 'ring-2 ring-white dark:ring-neutral-950' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Typing Effects */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Typing FX
                </span>
                <span className="text-[10px] lowercase font-normal text-neutral-400">Active: {typingEffect}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sparks', name: '✨ Soft Sparks' },
                  { id: 'ripple', name: '💫 Ripple Glow' },
                  { id: 'matrix', name: '🟩 Matrix' },
                  { id: 'float', name: '🎈 Caret Float' },
                  { id: 'none', name: '🚫 Clean (None)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTypingEffect(item.id as TypingEffect)}
                    className={`p-2 rounded-xl border text-left truncate transition-all cursor-pointer ${
                      typingEffect === item.id
                        ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* DUAL LIVE PREVIEW SECTION */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-indigo-500" />
                  Live Effect Demo & Playground
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">Real-time</span>
              </div>

              {/* 1. Looping Auto-Typewriter Preview */}
              <div className="relative p-3 rounded-2xl bg-neutral-950 text-neutral-100 font-mono-code text-[11px] border border-neutral-800 shadow-inner overflow-hidden min-h-[46px] flex items-center">
                <div className="truncate">
                  <span className="text-neutral-500 mr-1.5 select-none">$</span>
                  <span>{demoText}</span>
                  {renderCaretPreview(cursorStyle)}
                </div>

                {/* Particle Canvas Overlay for Demo */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <AnimatePresence>
                    {demoParticles.map(p => (
                      p.type === 'ripple' ? (
                        <motion.span
                          key={p.id}
                          initial={{ opacity: 0.9, scale: 0.3 }}
                          animate={{ opacity: 0, scale: 2.2 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="absolute rounded-full pointer-events-none border-2"
                          style={{
                            left: `${p.x - 11}px`,
                            top: `${p.y - 11}px`,
                            width: '22px',
                            height: '22px',
                            borderColor: p.color,
                            boxShadow: `0 0 8px ${p.color}`
                          }}
                        />
                      ) : (
                        <motion.span
                          key={p.id}
                          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                          animate={{ opacity: 0, scale: 0, x: p.dx, y: p.dy }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.1, 0.9, 0.2, 1] }}
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            left: `${p.x}px`,
                            top: `${p.y}px`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: p.color,
                            boxShadow: `0 0 8px ${p.color}, 0 0 14px ${p.color}`
                          }}
                        />
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* 2. Interactive Test Keystroke Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Keyboard className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
                  <input
                    ref={testInputRef}
                    type="text"
                    value={testInputText}
                    onChange={handleTestInputChange}
                    placeholder="Type here to test keystroke feel..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {testInputText && (
                    <button
                      type="button"
                      onClick={() => setTestInputText('')}
                      className="absolute right-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Particle Canvas Overlay for Test Input */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                  <AnimatePresence>
                    {inputParticles.map(p => (
                      p.type === 'ripple' ? (
                        <motion.span
                          key={p.id}
                          initial={{ opacity: 0.9, scale: 0.3 }}
                          animate={{ opacity: 0, scale: 2.2 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                          className="absolute rounded-full pointer-events-none border-2"
                          style={{
                            left: `${p.x - 11}px`,
                            top: `${p.y - 11}px`,
                            width: '22px',
                            height: '22px',
                            borderColor: p.color,
                            boxShadow: `0 0 8px ${p.color}`
                          }}
                        />
                      ) : (
                        <motion.span
                          key={p.id}
                          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                          animate={{ opacity: 0, scale: 0, x: p.dx, y: p.dy }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.1, 0.9, 0.2, 1] }}
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            left: `${p.x}px`,
                            top: `${p.y}px`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            backgroundColor: p.color,
                            boxShadow: `0 0 8px ${p.color}, 0 0 14px ${p.color}`
                          }}
                        />
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
              <button
                type="button"
                onClick={resetDefaults}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 font-bold cursor-pointer transition-all"
              >
                Done
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
