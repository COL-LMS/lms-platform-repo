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
} from '@mui/material';
import { useCreateUniversityMutation } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateUniversityModal({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  const [createUniversity, { isLoading }] = useCreateUniversityMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await createUniversity({ name, place, details }).unwrap();
      setName('');
      setPlace('');
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

          <TextField
            label="University Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="e.g., Stanford University"
          />

          <TextField
            label="Place / Location"
            fullWidth
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
            disabled={isLoading}
            placeholder="e.g., California, USA"
          />

          <TextField
            label="Additional Details"
            fullWidth
            multiline
            rows={3}
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
