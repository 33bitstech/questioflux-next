'use client';

import { ThemeProvider, ThemeProviderProps } from 'next-themes';

export function ProviderTheme({ children, ...props}: ThemeProviderProps) {
  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  );
}