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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Autorenew,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { useCreateUniversityAdminMutation, useGetUniversitiesQuery } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateUniversityAdminModal({ open, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [universityId, setUniversityId] = useState('');
  const [error, setError] = useState('');

  // Success state to show created credentials
  const [createdAdmin, setCreatedAdmin] = useState<{
    name: string;
    email: string;
    password: string;
    universityName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: universities = [] } = useGetUniversitiesQuery();
  const [createUniversityAdmin, { isLoading }] = useCreateUniversityAdminMutation();

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let randPassword = '';
    for (let i = 0; i < 10; i++) {
      randPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(randPassword);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!universityId) {
      setError('Please select a university');
      return;
    }

    const selectedUni = universities.find((u) => u.id === universityId);

    try {
      await createUniversityAdmin({
        name,
        email,
        password,
        universityId,
      }).unwrap();

      setCreatedAdmin({
        name,
        email,
        password,
        universityName: selectedUni ? selectedUni.name : '',
      });
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to create university admin');
    }
  };

  const handleCopyCredentials = () => {
    if (createdAdmin) {
      const text = `University Admin Credentials:\nName: ${createdAdmin.name}\nUniversity: ${createdAdmin.universityName}\nEmail / Login ID: ${createdAdmin.email}\nPassword: ${createdAdmin.password}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseAll = () => {
    setName('');
    setEmail('');
    setPassword('');
    setUniversityId('');
    setError('');
    setCreatedAdmin(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseAll} maxWidth="sm" fullWidth>
      <DialogTitle className="font-bold text-slate-800 border-b border-slate-100">
        {createdAdmin ? 'University Admin Created Successfully' : 'Add University Admin'}
      </DialogTitle>

      {createdAdmin ? (
        <div>
          <DialogContent className="space-y-4 pt-4">
            <Box className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="text-emerald-600" style={{ fontSize: 32 }} />
              <div>
                <Typography variant="subtitle1" className="font-bold text-emerald-900">
                  Account Created
                </Typography>
                <Typography variant="body2" className="text-emerald-700">
                  Save or copy the set password for the university admin.
                </Typography>
              </div>
            </Box>

            <Box className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <div>
                <Typography variant="caption" className="text-slate-500 font-semibold uppercase tracking-wider">
                  Admin Name
                </Typography>
                <Typography variant="body1" className="font-semibold text-slate-800">
                  {createdAdmin.name}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" className="text-slate-500 font-semibold uppercase tracking-wider">
                  University
                </Typography>
                <Typography variant="body1" className="text-slate-800">
                  {createdAdmin.universityName}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" className="text-slate-500 font-semibold uppercase tracking-wider">
                  Email ID (Login ID)
                </Typography>
                <Typography variant="body1" className="font-mono text-sky-700 font-bold">
                  {createdAdmin.email}
                </Typography>
              </div>

              <div>
                <Typography variant="caption" className="text-slate-500 font-semibold uppercase tracking-wider">
                  Set Password
                </Typography>
                <Typography variant="body1" className="font-mono bg-white p-2 rounded border border-slate-300 font-bold text-slate-900">
                  {createdAdmin.password}
                </Typography>
              </div>
            </Box>
          </DialogContent>

          <DialogActions className="p-4 bg-slate-50 flex justify-between">
            <Button
              variant="outlined"
              startIcon={<ContentCopy />}
              onClick={handleCopyCredentials}
              className="normal-case border-slate-400 text-slate-700"
            >
              {copied ? 'Copied to Clipboard!' : 'Copy Credentials'}
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseAll}
              className="bg-sky-600 hover:bg-sky-700 normal-case"
            >
              Done
            </Button>
          </DialogActions>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogContent className="space-y-4 pt-4">
            {error && <Alert severity="error">{error}</Alert>}

            <FormControl fullWidth required>
              <InputLabel id="select-university-label">Assign University</InputLabel>
              <Select
                labelId="select-university-label"
                value={universityId}
                label="Assign University"
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

            <TextField
              label="Admin Full Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              placeholder="e.g., Dr. Jane Doe"
            />

            <TextField
              label="Email ID (Acts as Login ID)"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="admin@university.edu"
            />

            <TextField
              label="Assign Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Set initial password for admin"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Generate random secure password">
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
          <DialogActions className="p-4 bg-slate-50">
            <Button onClick={handleCloseAll} disabled={isLoading} color="inherit" className="normal-case">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              className="bg-sky-600 hover:bg-sky-700 normal-case font-semibold"
            >
              {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Create Admin & Set Password'}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}

