'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { useUpdateUniversityAdminMutation, useGetUniversitiesQuery, UniversityAdmin } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  admin: UniversityAdmin | null;
  onClose: () => void;
}

export default function ManageUniversityAdminModal({ open, admin, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: universities = [] } = useGetUniversitiesQuery();
  const [updateAdmin, { isLoading }] = useUpdateUniversityAdminMutation();

  useEffect(() => {
    if (admin) {
      setName(admin.name || '');
      setEmail(admin.email || '');
      setUniversityId(admin.universityId || '');
      setStatus(admin.status || 'ACTIVE');
      setError('');
      setSuccess('');
    }
  }, [admin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!admin) return;

    try {
      await updateAdmin({
        id: admin.id,
        name,
        email,
        universityId,
        status,
      }).unwrap();

      setSuccess('University Admin updated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to update admin');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-extrabold text-indigo-950 border-b border-slate-100 flex justify-between items-center">
        <span>Manage University Admin</span>
        {admin && (
          <Chip
            label={status}
            size="small"
            color={status === 'ACTIVE' ? 'success' : 'default'}
            className="font-bold text-xs"
          />
        )}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 pt-4">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <TextField
            label="Admin Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />

          <TextField
            label="Email ID (Login ID)"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <FormControl fullWidth required>
            <InputLabel id="manage-admin-uni-label">Assigned University</InputLabel>
            <Select
              labelId="manage-admin-uni-label"
              value={universityId}
              label="Assigned University"
              onChange={(e) => setUniversityId(e.target.value)}
              disabled={isLoading}
            >
              {universities.map((uni) => (
                <MenuItem key={uni.id} value={uni.id}>
                  {uni.name} ({uni.place})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel id="manage-admin-status-label">Account Status</InputLabel>
            <Select
              labelId="manage-admin-status-label"
              value={status}
              label="Account Status"
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="ACTIVE">ACTIVE (Access Enabled)</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE (Access Suspended)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions className="p-4 bg-slate-50 border-t border-slate-100">
          <Button onClick={onClose} disabled={isLoading} className="text-slate-600 font-semibold">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold px-6 py-2 rounded-lg"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
