'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutlined,
  LockOutlined,
} from '@mui/icons-material';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signin'>('login');
  const [username, setUsername] = useState('sadmin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLoginMode = mode === 'login';

  return (
    <Box className="min-h-screen bg-slate-100 flex items-center justify-center p-4 transition-colors duration-500">
      {/* Outer Login Container Card matching image design */}
      <Box className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[520px] relative border border-slate-200">
        
        {/* LEFT PANEL - Dynamic Layered Geometric Theme (Rose/Plum vs Indigo/Purple) */}
        <Box
          className={`w-full md:w-5/12 relative flex flex-col justify-center p-8 overflow-hidden min-h-[240px] md:min-h-full transition-all duration-700 ${
            isLoginMode
              ? 'bg-gradient-to-br from-rose-900 via-pink-800 to-rose-700'
              : 'bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-700'
          }`}
        >
          {/* Layered Diagonal Background Shapes */}
          <div
            className={`absolute -top-12 -left-12 w-64 h-64 rounded-full transform -rotate-45 pointer-events-none transition-colors duration-700 ${
              isLoginMode ? 'bg-rose-950/40' : 'bg-indigo-950/50'
            }`}
          />
          <div
            className={`absolute top-1/4 -left-20 w-80 h-96 transform rotate-45 pointer-events-none transition-colors duration-700 ${
              isLoginMode ? 'bg-pink-900/30' : 'bg-purple-950/40'
            }`}
          />
          <div
            className={`absolute -bottom-16 -right-16 w-64 h-64 rounded-full transform pointer-events-none transition-colors duration-700 ${
              isLoginMode ? 'bg-rose-600/30' : 'bg-violet-500/30'
            }`}
          />

          {/* Interactive Floating Tabs on Left Panel */}
          <div className="relative z-10 space-y-4">
            {/* LOGIN TAB */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`font-extrabold text-sm px-7 py-3 rounded-r-full shadow-lg tracking-wider transform translate-x-[-32px] flex items-center space-x-2 transition-all duration-300 ${
                  isLoginMode
                    ? 'bg-white text-rose-950 shadow-rose-950/40 scale-105 border-y border-r border-rose-100'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>LOGIN</span>
              </button>
            </div>

            {/* SIGN IN TAB */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`font-extrabold text-sm px-7 py-3 rounded-r-full tracking-wider transform translate-x-[-32px] flex items-center space-x-2 transition-all duration-300 ${
                  !isLoginMode
                    ? 'bg-white text-indigo-950 shadow-lg shadow-indigo-950/40 scale-105 border-y border-r border-indigo-100'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                <span>SIGN IN</span>
              </button>
            </div>

            <div className="pl-4 pt-2">
              <p className="text-white/70 text-xs max-w-[200px]">
                {isLoginMode
                  ? 'Access the Learning Management System Portal'
                  : 'Welcome back! Sign in to continue your portal session'}
              </p>
            </div>
          </div>
        </Box>

        {/* RIGHT PANEL - Clean Form Area with Dynamic Theme Accents */}
        <Box className="w-full md:w-7/12 bg-white flex flex-col justify-between p-8 md:p-12 relative">
          <div>
            {/* Top User Avatar Icon with Theme Transition */}
            <div className="flex flex-col items-center mb-6">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg mb-3 border-2 border-white transition-all duration-700 ${
                  isLoginMode
                    ? 'bg-gradient-to-tr from-rose-900 via-pink-700 to-rose-500 shadow-rose-900/20'
                    : 'bg-gradient-to-tr from-indigo-950 via-purple-800 to-violet-600 shadow-purple-900/20'
                }`}
              >
                <PersonOutlined className="text-white" style={{ fontSize: 44 }} />
              </div>
              <Typography
                variant="h5"
                component="h1"
                className={`font-extrabold tracking-wider text-xl uppercase transition-colors duration-500 ${
                  isLoginMode ? 'text-rose-900' : 'text-indigo-950'
                }`}
              >
                {isLoginMode ? 'LOGIN' : 'SIGN IN'}
              </Typography>
            </div>

            {error && (
              <Alert severity="error" className="mb-4 text-xs">
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Input */}
              <TextField
                placeholder="Email or Username"
                variant="standard"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined className="text-slate-400 mr-2" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInput-underline:before': { borderBottomColor: '#cbd5e1' },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: isLoginMode ? '#9f1239' : '#4338ca',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: isLoginMode ? '#881337' : '#312e81',
                  },
                }}
              />

              {/* Password Input */}
              <TextField
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                variant="standard"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined className="text-slate-400 mr-2" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInput-underline:before': { borderBottomColor: '#cbd5e1' },
                  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                    borderBottomColor: isLoginMode ? '#9f1239' : '#4338ca',
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: isLoginMode ? '#881337' : '#312e81',
                  },
                }}
              />

              {/* Actions Row: Forgot Password & Pill Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => alert('Default Super Admin credentials: username "sadmin", password "123456"')}
                  className={`text-xs font-semibold transition-colors ${
                    isLoginMode
                      ? 'text-pink-700 hover:text-rose-900'
                      : 'text-purple-700 hover:text-indigo-900'
                  }`}
                >
                  Forgot Password?
                </button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className={`text-white font-bold px-8 py-2.5 rounded-full shadow-md normal-case tracking-wider text-sm transition-all duration-500 ${
                    isLoginMode
                      ? 'bg-gradient-to-r from-rose-800 to-pink-700 hover:from-rose-900 hover:to-pink-800 shadow-rose-900/30'
                      : 'bg-gradient-to-r from-indigo-900 to-purple-700 hover:from-indigo-950 hover:to-purple-800 shadow-indigo-900/30'
                  }`}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : isLoginMode ? 'LOGIN' : 'SIGN IN'}
                </Button>
              </div>
            </form>
          </div>

          {/* Bottom Social Footer Bar */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Or Login With</span>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  setUsername('sadmin');
                  setPassword('123456');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsername('sadmin');
                  setPassword('123456');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-slate-700"
              >
                <svg className="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

        </Box>
      </Box>
    </Box>
  );
}

