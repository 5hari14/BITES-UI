import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

/** Resolved color palette that every component reads from */
export interface BiteColors {
  /** Page / phone background */
  bg: string;
  /** Slightly elevated surface (cards, inputs, nav) */
  surface: string;
  /** Even more elevated surface for nested cards */
  surfaceAlt: string;
  /** Primary text */
  text: string;
  /** Secondary / muted text */
  textMuted: string;
  /** Tertiary / dimmed text */
  textDim: string;
  /** Subtle border */
  border: string;
  /** Even subtler divider inside cards */
  divider: string;
  /** Accent orange — stays the same in both themes */
  accent: string;
  /** Bottom nav / status bar gradient start */
  navGradient: string;
  /** Phone frame border */
  frameBorder: string;
  /** Outer page background (behind the phone) */
  outerBg: string;
  /** Overlay for image gradients */
  overlayFrom: string;
  /** Score / badge gold */
  gold: string;
  /** Success green */
  green: string;
  /** Info blue */
  blue: string;
  /** Pink accent */
  pink: string;
}

const darkColors: BiteColors = {
  bg: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceAlt: '#222222',
  text: '#F5F0EB',
  textMuted: '#9A9490',
  textDim: '#5E5A57',
  border: 'rgba(255,255,255,0.06)',
  divider: 'rgba(255,255,255,0.04)',
  accent: '#FF6B35',
  navGradient: '#0D0D0D',
  frameBorder: '#2A2A2A',
  outerBg: '#080808',
  overlayFrom: 'rgba(0,0,0,0.8)',
  gold: '#F5C542',
  green: '#4ADE80',
  blue: '#60A5FA',
  pink: '#F472B6',
};

const lightColors: BiteColors = {
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#F5F3F0',
  text: '#1A1714',
  textMuted: '#6B6560',
  textDim: '#9E9893',
  border: 'rgba(0,0,0,0.08)',
  divider: 'rgba(0,0,0,0.05)',
  accent: '#FF6B35',
  navGradient: '#FAFAF8',
  frameBorder: '#D4D0CC',
  outerBg: '#EEEAE6',
  overlayFrom: 'rgba(0,0,0,0.65)',
  gold: '#D4A017',
  green: '#16A34A',
  blue: '#3B82F6',
  pink: '#EC4899',
};

interface BiteThemeContextType {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  c: BiteColors;
  isDark: boolean;
}

const BiteThemeContext = createContext<BiteThemeContextType | null>(null);

function resolveSystemTheme(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function BiteThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [systemIsDark, setSystemIsDark] = useState(resolveSystemTheme);

  // Listen for system theme changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemIsDark);
  const c = isDark ? darkColors : lightColors;

  return (
    <BiteThemeContext.Provider value={{ mode, setMode, c, isDark }}>
      {children}
    </BiteThemeContext.Provider>
  );
}

export function useBiteTheme() {
  const ctx = useContext(BiteThemeContext);
  if (!ctx) throw new Error('useBiteTheme must be used within BiteThemeProvider');
  return ctx;
}
