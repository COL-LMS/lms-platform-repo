'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility, VisibilityOff, Autorenew } from '@mui/icons-material';
import { useResetAdminPasswordMutation } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  admin: { id: string; name: string; email: string } | null;
  onClose: () => void;
}

export default function ResetAdminPasswordModal({ open, admin, onClose }: Props) {
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [resetAdminPassword, { isLoading }] = useResetAdminPasswordMutation();

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let randPassword = '';
    for (let i = 0; i < 10; i++) {
      randPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(randPassword);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!admin) return;
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await resetAdminPassword({
        adminId: admin.id,
        newPassword,
      }).unwrap();

      setSuccess(`Password for ${admin.name} reset successfully!`);
      setTimeout(() => {
        setSuccess('');
        setNewPassword('');
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="font-bold text-slate-800">
        Reset Password for {admin?.name}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 pt-2">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Email ID (Login)"
            fullWidth
            value={admin?.email || ''}
            disabled
          />

          <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Generate random password">
                    <IconButton onClick={generateRandomPassword} edge="end" size="small" className="mr-1">
                      <Autorenew />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={onClose} disabled={isLoading} color="inherit" className="normal-case">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700 normal-case font-semibold"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Reset Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
