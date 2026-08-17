'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './index';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9f1239', // Rose 800 (from login page)
      light: '#be123c',
      dark: '#881337',
    },
    secondary: {
      main: '#7e22ce', // Purple 700 (from signin mode)
    },
    background: {
      default: '#fff1f2', // Soft Rose Tint background
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}
