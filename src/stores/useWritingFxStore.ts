import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CursorStyle = 'neon' | 'terminal' | 'minimal' | 'amber' | 'default';
export type TypingEffect = 'sparks' | 'ripple' | 'matrix' | 'float' | 'none';

interface WritingFxState {
  cursorStyle: CursorStyle;
  typingEffect: TypingEffect;
  lowPowerMode: boolean;
  setCursorStyle: (style: CursorStyle) => void;
  setTypingEffect: (effect: TypingEffect) => void;
  setLowPowerMode: (enabled: boolean) => void;
  toggleLowPowerMode: () => void;
  resetDefaults: () => void;
}

export const useWritingFxStore = create<WritingFxState>()(
  persist(
    (set) => ({
      cursorStyle: 'neon',
      typingEffect: 'sparks',
      lowPowerMode: false,

      setCursorStyle: (cursorStyle) => set({ cursorStyle }),
      setTypingEffect: (typingEffect) => set({ typingEffect }),
      setLowPowerMode: (lowPowerMode) => set({ lowPowerMode }),
      toggleLowPowerMode: () => set((state) => ({ lowPowerMode: !state.lowPowerMode })),
      resetDefaults: () => set({ cursorStyle: 'neon', typingEffect: 'sparks', lowPowerMode: false })
    }),
    {
      name: 'md-writer-writing-fx'
    }
  )
);
