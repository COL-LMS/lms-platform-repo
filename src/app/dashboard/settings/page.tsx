'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  Person,
  Palette,
  CheckCircle,
  Shield,
  School,
  VpnKey,
} from '@mui/icons-material';
import { useGetMeQuery } from '@/store/api/lmsApi';

export default function SettingsPage() {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = useGetMeQuery(undefined);

  // Change Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-rose-50/50 pb-16">
      {/* Header */}
      <Box className="bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 text-white shadow-lg">
        <Container maxWidth="xl" className="py-4 flex justify-between items-center">
          <Box className="flex items-center space-x-3">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/dashboard')}
              className="text-rose-100 border-rose-700 hover:bg-rose-800 normal-case mr-2"
            >
              Back to Dashboard
            </Button>
            <div className="p-2 bg-white/10 rounded-xl text-pink-300 border border-white/10 backdrop-blur">
              <Security style={{ fontSize: 28 }} />
            </div>
            <div>
              <Typography variant="h6" className="font-extrabold text-white leading-tight tracking-wide">
                Account & System Settings
              </Typography>
              <Typography variant="caption" className="text-rose-200">
                Manage your credentials and security preferences
              </Typography>
            </div>
          </Box>

          <Box className="flex items-center space-x-2 bg-rose-900/60 px-3 py-1.5 rounded-full border border-rose-700/50 backdrop-blur">
            <Avatar className="w-7 h-7 bg-rose-600 text-xs font-bold">SA</Avatar>
            <Typography variant="body2" className="font-medium text-rose-100">
              {userData?.user?.name || 'Super Admin'}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" className="mt-8">
        <Grid container spacing={4}>
          {/* Left Column: Account Profile & System Status */}
          <Grid item xs={12} md={4}>
            {/* Account Card */}
            <Card className="rounded-2xl border border-rose-100 shadow-sm bg-white overflow-hidden mb-6">
              <Box className="bg-gradient-to-r from-rose-900 to-pink-800 p-6 text-center text-white">
                <Avatar className="w-20 h-20 bg-rose-600 mx-auto border-4 border-white/20 shadow-md text-2xl font-bold mb-3">
                  SA
                </Avatar>
                <Typography variant="h6" className="font-bold text-white">
                  {userData?.user?.name || 'Super Admin'}
                </Typography>
                <Typography variant="body2" className="text-rose-200">
                  @{userData?.user?.username || 'sadmin'}
                </Typography>
                <Chip
                  label={userData?.user?.role || 'SUPER_ADMIN'}
                  size="small"
                  className="mt-3 bg-white/20 text-white font-semibold border border-white/30 text-xs"
                />
              </Box>

              <CardContent className="p-5 space-y-4">
                <Box className="flex items-center justify-between text-sm">
                  <Typography className="text-slate-500 font-medium">Role</Typography>
                  <Typography className="text-slate-800 font-semibold">Super Administrator</Typography>
                </Box>
                <Divider />
                <Box className="flex items-center justify-between text-sm">
                  <Typography className="text-slate-500 font-medium">Authentication</Typography>
                  <Chip label="JWT Cookie" size="small" color="primary" variant="outlined" className="text-xs" />
                </Box>
                <Divider />
                <Box className="flex items-center justify-between text-sm">
                  <Typography className="text-slate-500 font-medium">Status</Typography>
                  <Box className="flex items-center space-x-1 text-emerald-600 font-medium text-xs">
                    <CheckCircle style={{ fontSize: 16 }} />
                    <span>Active Session</span>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* System Info Card */}
            <Card className="rounded-2xl border border-rose-100 shadow-sm bg-white p-5">
              <Typography variant="subtitle1" className="font-bold text-rose-950 flex items-center space-x-2 mb-3">
                <Shield className="text-rose-800" style={{ fontSize: 20 }} />
                <span>Security Overview</span>
              </Typography>
              <Box className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center space-x-2 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                  <VpnKey className="text-rose-700" style={{ fontSize: 18 }} />
                  <span>Password hash: <strong>Bcrypt (Cost 10)</strong></span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                  <Security className="text-purple-700" style={{ fontSize: 18 }} />
                  <span>Session expiry: <strong>7 Days (HTTP-only)</strong></span>
                </div>
                <div className="flex items-center space-x-2 bg-pink-50 p-2.5 rounded-lg border border-pink-100">
                  <Palette className="text-pink-700" style={{ fontSize: 18 }} />
                  <span>Theme: <strong>Rose / Plum / Indigo</strong></span>
                </div>
              </Box>
            </Card>
          </Grid>

          {/* Right Column: Change Password Form */}
          <Grid item xs={12} md={8}>
            <Card className="rounded-2xl border border-rose-100 shadow-sm bg-white overflow-hidden">
              <Box className="border-b border-rose-100 p-5 bg-rose-50/50 flex items-center justify-between">
                <Box className="flex items-center space-x-3">
                  <div className="p-2 bg-rose-100 text-rose-800 rounded-lg">
                    <Lock style={{ fontSize: 24 }} />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold text-rose-950">
                      Change Password
                    </Typography>
                    <Typography variant="caption" className="text-slate-500">
                      Update your account login password
                    </Typography>
                  </div>
                </Box>
              </Box>

              <CardContent className="p-6">
                {error && (
                  <Alert severity="error" className="mb-6 rounded-xl">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" className="mb-6 rounded-xl">
                    {success}
                  </Alert>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <TextField
                    label="Current Password"
                    type={showOld ? 'text' : 'password'}
                    fullWidth
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    disabled={loading}
                    helperText="Enter your existing account password to confirm identity"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowOld(!showOld)} edge="end">
                            {showOld ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="New Password"
                    type={showNew ? 'text' : 'password'}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    helperText="Password must be at least 6 characters long"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowNew(!showNew)} edge="end">
                            {showNew ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Confirm New Password"
                    type={showConfirm ? 'text' : 'password'}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    helperText="Re-enter your new password to verify"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Divider />

                  <Box className="flex justify-end space-x-3 pt-2">
                    <Button
                      variant="outlined"
                      onClick={() => router.push('/dashboard')}
                      disabled={loading}
                      className="normal-case border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      className="normal-case bg-gradient-to-r from-rose-800 to-pink-700 hover:from-rose-900 hover:to-pink-800 text-white px-6 py-2 rounded-lg font-bold shadow"
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
