'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type PosTheme = 'global' | 'light' | 'dark';

interface ThemeContextProps {
  globalTheme: Theme;
  setGlobalTheme: (theme: Theme) => void;
  posTheme: PosTheme;
  setPosTheme: (theme: PosTheme) => void;
  resolvedPosTheme: Theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [globalTheme, setGlobalThemeState] = useState<Theme>('dark');
  const [posTheme, setPosThemeState] = useState<PosTheme>('global');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedGlobal = localStorage.getItem('kyroz_global_theme') as Theme | null;
    const storedPos = localStorage.getItem('kyroz_pos_theme') as PosTheme | null;

    if (storedGlobal) {
      setGlobalThemeState(storedGlobal);
      document.documentElement.setAttribute('data-theme', storedGlobal);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    if (storedPos) {
      setPosThemeState(storedPos);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('kyroz_global_theme', globalTheme);
      document.documentElement.setAttribute('data-theme', globalTheme);
    }
  }, [globalTheme, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('kyroz_pos_theme', posTheme);
    }
  }, [posTheme, isMounted]);

  const setGlobalTheme = (theme: Theme) => {
    setGlobalThemeState(theme);
  };

  const setPosTheme = (theme: PosTheme) => {
    setPosThemeState(theme);
  };

  const resolvedPosTheme = posTheme === 'global' ? globalTheme : posTheme;

  return (
    <ThemeContext.Provider value={{ globalTheme, setGlobalTheme, posTheme, setPosTheme, resolvedPosTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
