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
  Person,
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
    <Box className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-950 text-white shadow-xl border-b border-indigo-700/40 relative z-30">
      <Container maxWidth="xl" className="py-3.5 flex justify-between items-center">
        {/* Left Section: Logo & Interactive System Status */}
        <Box
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => router.push('/dashboard')}
        >
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl text-white border border-white/20 shadow-md group-hover:scale-105 transition-transform duration-300">
            <School style={{ fontSize: 30 }} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Typography variant="h6" className="font-extrabold text-white leading-tight tracking-wide text-lg md:text-xl">
                LMS Super Admin Portal
              </Typography>
              <Chip
                label="SYSTEM LIVE"
                size="small"
                className="bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40 text-[10px] h-5 hidden sm:flex"
              />
            </div>

            <div className="flex items-center space-x-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Typography variant="caption" className="text-cyan-200 font-medium text-xs">
                Active Session & Governance Control
              </Typography>
            </div>
          </div>
        </Box>

        {/* Right Section: Interactive Controls & Profile Menu */}
        <Box className="flex items-center space-x-3">
          {/* Quick Navigation Toggle */}
          {!isSettings ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings fontSize="small" className="text-cyan-300" />}
              onClick={() => router.push('/dashboard/settings')}
              className="text-white border-indigo-400/50 hover:bg-indigo-800/60 hover:border-cyan-400 normal-case font-semibold px-3 py-1.5 rounded-xl transition-all shadow-sm hidden md:flex"
            >
              Settings
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Dashboard fontSize="small" className="text-cyan-300" />}
              onClick={() => router.push('/dashboard')}
              className="text-white border-indigo-400/50 hover:bg-indigo-800/60 hover:border-cyan-400 normal-case font-semibold px-3 py-1.5 rounded-xl transition-all shadow-sm hidden md:flex"
            >
              Dashboard
            </Button>
          )}

          {/* Interactive Notifications Icon Button */}
          <Tooltip title="System Notifications">
            <IconButton className="text-cyan-200 hover:text-white hover:bg-white/10 p-2">
              <Badge badgeContent={2} color="secondary" className="font-bold">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Interactive User Avatar Menu Button */}
          <Box
            onClick={handleOpenMenu}
            className="flex items-center space-x-2.5 bg-indigo-900/80 hover:bg-indigo-800 px-3 py-1.5 rounded-2xl border border-indigo-500/50 cursor-pointer backdrop-blur transition-all duration-200 shadow-md hover:border-cyan-400"
          >
            <Avatar className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-blue-500 text-xs font-extrabold shadow border border-white/30">
              SA
            </Avatar>

            <div className="hidden sm:block text-left">
              <Typography variant="body2" className="font-bold text-white leading-none text-xs">
                {user?.name || 'Super Admin'}
              </Typography>
              <Typography variant="caption" className="text-cyan-300 font-mono text-[10px] block leading-tight mt-0.5">
                @{user?.username || 'sadmin'}
              </Typography>
            </div>

            <KeyboardArrowDown fontSize="small" className={`text-cyan-300 transition-transform duration-300 ${openMenu ? 'rotate-180' : ''}`} />
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
            onClick={handleCloseMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 4,
              className: 'mt-2 rounded-2xl border border-indigo-100 min-w-[220px] shadow-xl overflow-hidden',
            }}
          >
            {/* User Details Header in Menu */}
            <Box className="p-4 bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
              <Box className="flex items-center space-x-2 mb-1">
                <VerifiedUser className="text-emerald-400" style={{ fontSize: 18 }} />
                <Typography variant="subtitle2" className="font-bold text-white">
                  {user?.name || 'Super Admin'}
                </Typography>
              </Box>
              <Typography variant="caption" className="text-cyan-200 font-mono block">
                Role: {user?.role || 'SUPER_ADMIN'}
              </Typography>
            </Box>

            <Divider />

            <MenuItem onClick={() => router.push('/dashboard')} className="py-2.5 hover:bg-indigo-50">
              <ListItemIcon>
                <Dashboard fontSize="small" className="text-indigo-700" />
              </ListItemIcon>
              <ListItemText primary="Governance Dashboard font-medium" />
            </MenuItem>

            <MenuItem onClick={() => router.push('/dashboard/settings')} className="py-2.5 hover:bg-indigo-50">
              <ListItemIcon>
                <Settings fontSize="small" className="text-indigo-700" />
              </ListItemIcon>
              <ListItemText primary="Account & Settings" />
            </MenuItem>

            <MenuItem onClick={() => router.push('/dashboard/settings')} className="py-2.5 hover:bg-indigo-50">
              <ListItemIcon>
                <VpnKey fontSize="small" className="text-indigo-700" />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} className="py-2.5 text-rose-700 hover:bg-rose-50 font-bold">
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
