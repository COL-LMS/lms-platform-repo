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
  Typography,
  Box,
  Chip,
  Divider,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Language, Image as ImageIcon, Business } from '@mui/icons-material';
import { useUpdateUniversityMutation, University } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  university: University | null;
  onClose: () => void;
}

export default function ManageUniversityModal({ open, university, onClose }: Props) {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [updateUniversity, { isLoading }] = useUpdateUniversityMutation();

  useEffect(() => {
    if (university) {
      setName(university.name || '');
      setPlace(university.place || '');
      setUrl(university.url || '');
      setLogo(university.logo || '');
      setDetails(university.details || '');
      setStatus(university.status || 'ACTIVE');
      setError('');
      setSuccess('');
    }
  }, [university]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!university) return;

    try {
      await updateUniversity({
        id: university.id,
        name,
        place,
        url,
        logo,
        details,
        status,
      }).unwrap();

      setSuccess('University updated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to update university');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-extrabold text-indigo-950 border-b border-slate-100 flex justify-between items-center">
        <span>Manage University</span>
        {university && (
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

          {/* Logo Preview */}
          <Box className="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Avatar
              src={logo}
              alt={name || 'University Logo'}
              className="w-14 h-14 bg-indigo-100 text-indigo-800 border-2 border-indigo-200 font-bold"
            >
              <Business />
            </Avatar>
            <div>
              <span className="text-xs font-bold text-slate-700 block">University Logo</span>
              <span className="text-[11px] text-slate-500">Live preview of logo image.</span>
            </div>
          </Box>

          <TextField
            label="University Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />

          <TextField
            label="Place / Location"
            fullWidth
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            disabled={isLoading}
          />

          <TextField
            label="Website URL"
            type="url"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            placeholder="https://dypatil.edu"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Language className="text-indigo-600" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="University Logo URL"
            type="url"
            fullWidth
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            disabled={isLoading}
            placeholder="https://example.com/logo.png"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon className="text-indigo-600" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth required>
            <InputLabel id="manage-uni-status-label">Status</InputLabel>
            <Select
              labelId="manage-uni-status-label"
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="ACTIVE">ACTIVE (Operational)</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE (Suspended)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Additional Details"
            fullWidth
            multiline
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isLoading}
          />

          {university?.admins && university.admins.length > 0 && (
            <div>
              <Divider className="my-3" />
              <Typography variant="caption" className="font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Assigned University Admins ({university.admins.length})
              </Typography>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {university.admins.map((adm) => (
                  <div key={adm.id} className="bg-slate-50 p-2 rounded border border-slate-200 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{adm.name}</span>
                    <span className="text-indigo-700 font-mono font-bold">{adm.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>

        <DialogActions className="p-4 bg-slate-50 border-t border-slate-100">
          <Button onClick={onClose} disabled={isLoading} className="text-slate-600 font-semibold">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-bold px-6 py-2 rounded-lg"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
