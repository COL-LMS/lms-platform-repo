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
  Avatar,
  Box,
  InputAdornment,
} from '@mui/material';
import { Language, Image as ImageIcon, Business } from '@mui/icons-material';
import { useCreateUniversityMutation } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateUniversityModal({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const [createUniversity, { isLoading }] = useCreateUniversityMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createUniversity({ name, place, url, logo, details }).unwrap();
      setName('');
      setPlace('');
      setUrl('');
      setLogo('');
      setDetails('');
      onClose();
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to create university');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-extrabold text-indigo-950 border-b border-indigo-50 pb-3">Add New University</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 pt-4">
          {error && <Alert severity="error">{error}</Alert>}

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
              <span className="text-xs font-bold text-slate-700 block">University Logo Preview</span>
              <span className="text-[11px] text-slate-500">Provide an image URL below to set the official logo.</span>
            </div>
          </Box>

          <TextField
            label="University Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="e.g., Dr. D.Y. Patil Vidyapeeth"
          />

          <TextField
            label="Place / Location"
            fullWidth
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            disabled={isLoading}
            placeholder="e.g., Pune, Maharashtra"
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
            helperText="Paste direct image link for the university logo"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon className="text-indigo-600" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Additional Details"
            fullWidth
            multiline
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isLoading}
            placeholder="Brief description or accreditation info..."
          />
        </DialogContent>
        <DialogActions className="p-4 border-t border-slate-100">
          <Button onClick={onClose} disabled={isLoading} className="text-slate-600 font-semibold">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white font-bold px-5 py-2 rounded-lg"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Create University'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
