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
      <DialogTitle className="font-bold text-slate-800">Add New University</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 pt-2">
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
        <DialogActions className="p-4">
          <Button onClick={onClose} disabled={isLoading} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Create University'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
