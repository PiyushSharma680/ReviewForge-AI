'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import React from 'react';

/**
 * Wrap your application with this provider to enable theme toggling (light/dark/system).
 * It forwards all props to the underlying next-themes ThemeProvider.
 */
export const ThemeProvider: React.FC<React.PropsWithChildren<{
  attribute?: string;
  defaultTheme?: 'system' | 'light' | 'dark';
  enableSystem?: boolean;
}>> = ({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
}) => {
  return (
    <NextThemesProvider attribute={attribute} defaultTheme={defaultTheme} enableSystem={enableSystem}>
      {children}
    </NextThemesProvider>
  );
};
