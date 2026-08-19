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
      main: '#3730a3', // Professional LMS Indigo 800
      light: '#4f46e5', // Indigo 600
      dark: '#1e1b4b', // Indigo 950
    },
    secondary: {
      main: '#0284c7', // Sky 600
      light: '#38bdf8',
      dark: '#0369a1',
    },
    background: {
      default: '#f8fafc', // Clean Slate 50 background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'inherit',
  },
  shape: {
    borderRadius: 12,
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
