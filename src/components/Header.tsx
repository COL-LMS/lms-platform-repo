'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Tooltip,
  IconButton,
  Badge,
} from '@mui/material';
import {
  School,
  Settings,
  Logout,
  Security,
  Notifications,
  KeyboardArrowDown,
  Dashboard,
  VpnKey,
  VerifiedUser,
} from '@mui/icons-material';

interface HeaderProps {
  user?: {
    name?: string;
    username?: string;
    role?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseMenu();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const isSettings = pathname === '/dashboard/settings';

  return (
    <Box className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-xl border-b border-indigo-500/30 relative z-30">
      <Container maxWidth="xl" className="py-3 flex justify-between items-center">
        {/* Left Section: Logo & System Status */}
        <Box
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => router.push('/dashboard')}
        >
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl text-white border border-white/20 shadow-md group-hover:scale-105 transition-transform duration-300">
            <School style={{ fontSize: 32 }} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <Typography variant="h6" sx={{ color: '#ffffff !important', fontWeight: 800, letterSpacing: '0.025em' }}>
                LMS Super Admin Portal
              </Typography>
              <Chip
                label="SYSTEM LIVE"
                size="small"
                variant="outlined"
                sx={{
                  color: '#34d399 !important',
                  backgroundColor: 'rgba(16, 185, 129, 0.15) !important',
                  borderColor: 'rgba(52, 211, 153, 0.4) !important',
                  fontWeight: 800,
                  fontSize: '10px',
                  height: '20px',
                  '& .MuiChip-label': { color: '#34d399 !important', paddingLeft: '6px', paddingRight: '6px' },
                }}
                className="hidden sm:flex"
              />
            </div>

            <div className="flex items-center space-x-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Typography variant="caption" sx={{ color: '#7dd3fc !important', fontWeight: 500 }}>
                Active Session & Governance Control
              </Typography>
            </div>
          </div>
        </Box>

        {/* Right Section: Settings Button, Notifications & Profile */}
        <Box className="flex items-center space-x-3">
          {/* Settings Button */}
          {!isSettings ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings fontSize="small" style={{ color: '#67e8f9' }} />}
              onClick={() => router.push('/dashboard/settings')}
              sx={{
                color: '#ffffff !important',
                borderColor: 'rgba(255, 255, 255, 0.3) !important',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                paddingX: '14px',
                paddingY: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
                  borderColor: '#ffffff !important',
                },
              }}
            >
              SETTINGS
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Dashboard fontSize="small" style={{ color: '#67e8f9' }} />}
              onClick={() => router.push('/dashboard')}
              sx={{
                color: '#ffffff !important',
                borderColor: 'rgba(255, 255, 255, 0.3) !important',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                paddingX: '14px',
                paddingY: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2) !important',
                  borderColor: '#ffffff !important',
                },
              }}
            >
              DASHBOARD
            </Button>
          )}

          {/* Notification Icon */}
          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#ffffff !important', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
              <Badge badgeContent={2} color="error">
                <Notifications fontSize="small" style={{ color: '#ffffff' }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Profile Pill Button */}
          <Box
            onClick={handleOpenMenu}
            sx={{
              backgroundColor: 'rgba(30, 27, 75, 0.8)',
              borderColor: 'rgba(129, 140, 248, 0.4)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '16px',
              paddingX: '12px',
              paddingY: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              '&:hover': {
                backgroundColor: 'rgba(49, 46, 129, 0.9)',
                borderColor: '#67e8f9',
              },
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#4f46e5', color: '#ffffff', fontSize: '13px', fontWeight: 800, border: '1.5px solid rgba(255,255,255,0.4)' }}>
              SA
            </Avatar>

            <div className="hidden sm:block text-left">
              <Typography variant="body2" sx={{ color: '#ffffff !important', fontWeight: 700, fontSize: '12px', lineHeight: 1.1 }}>
                {user?.name || 'Super Admin'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#93c5fd !important', fontFamily: 'monospace', fontSize: '11px', display: 'block', lineHeight: 1.1 }}>
                @{user?.username || 'sadmin'}
              </Typography>
            </div>

            <KeyboardArrowDown fontSize="small" style={{ color: '#93c5fd' }} />
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 6,
              sx: {
                marginTop: '8px',
                borderRadius: '16px',
                minWidth: '220px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              },
            }}
          >
            <Box className="p-4 bg-slate-900 text-white">
              <Box className="flex items-center space-x-2 mb-1">
                <VerifiedUser className="text-emerald-400" style={{ fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ color: '#ffffff !important', fontWeight: 700 }}>
                  {user?.name || 'Super Admin'}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8 !important', fontFamily: 'monospace' }}>
                Role: {user?.role || 'SUPER_ADMIN'}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={() => router.push('/dashboard')} className="py-2.5 hover:bg-slate-50">
              <ListItemIcon>
                <Dashboard fontSize="small" className="text-indigo-600" />
              </ListItemIcon>
              <ListItemText primary="Governance Dashboard" />
            </MenuItem>

            <MenuItem onClick={() => router.push('/dashboard/settings')} className="py-2.5 hover:bg-slate-50">
              <ListItemIcon>
                <Settings fontSize="small" className="text-indigo-600" />
              </ListItemIcon>
              <ListItemText primary="Account & Settings" />
            </MenuItem>

            <MenuItem onClick={() => router.push('/dashboard/settings')} className="py-2.5 hover:bg-slate-50">
              <ListItemIcon>
                <VpnKey fontSize="small" className="text-indigo-600" />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} className="py-2.5 text-rose-600 hover:bg-rose-50 font-bold">
              <ListItemIcon>
                <Logout fontSize="small" className="text-rose-600" />
              </ListItemIcon>
              <ListItemText primary="Logout Session" />
            </MenuItem>
          </Menu>
        </Box>
      </Container>
    </Box>
  );
}
