import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const getSystemPrefersDark = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyThemeClass = (isDark: boolean) => {
  if (typeof document === 'undefined') return;
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('md-writer-theme') as ThemeMode;
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => {
  const initialTheme = getInitialTheme();
  const initialIsDark = initialTheme === 'system' ? getSystemPrefersDark() : initialTheme === 'dark';

  // Apply to DOM on load
  applyThemeClass(initialIsDark);

  return {
    theme: initialTheme,
    isDark: initialIsDark,
    setTheme: (theme: ThemeMode) => {
      const isDark = theme === 'system' ? getSystemPrefersDark() : theme === 'dark';
      localStorage.setItem('md-writer-theme', theme);
      applyThemeClass(isDark);
      set({ theme, isDark });
    },
    toggleTheme: () => {
      const { isDark } = get();
      const nextIsDark = !isDark;
      const newTheme: ThemeMode = nextIsDark ? 'dark' : 'light';
      localStorage.setItem('md-writer-theme', newTheme);
      applyThemeClass(nextIsDark);
      set({ theme: newTheme, isDark: nextIsDark });
    }
  };
});
