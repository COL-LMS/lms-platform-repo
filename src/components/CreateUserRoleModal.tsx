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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility, VisibilityOff, Autorenew } from '@mui/icons-material';
import { useCreateUserMutation } from '@/store/api/lmsApi';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateUserRoleModal({ open, onClose }: Props) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('INSTITUTE_ADMIN');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [createUser, { isLoading }] = useCreateUserMutation();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let rand = '';
    for (let i = 0; i < 10; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(rand);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createUser({
        username,
        name,
        email,
        password,
        role,
      }).unwrap();

      setSuccess(`User with role "${role}" created successfully!`);
      setTimeout(() => {
        setSuccess('');
        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
        setRole('INSTITUTE_ADMIN');
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err?.data?.error || 'Failed to create user role');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="font-extrabold text-indigo-950 border-b border-slate-100">
        Create User & Assign System Role
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-4 pt-4">
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <FormControl fullWidth required>
            <InputLabel id="select-role-label">System Role</InputLabel>
            <Select
              labelId="select-role-label"
              value={role}
              label="System Role"
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <MenuItem value="SUPER_ADMIN">SUPER_ADMIN (Full System Control)</MenuItem>
              <MenuItem value="UNIVERSITY_ADMIN">UNIVERSITY_ADMIN (University Portal)</MenuItem>
              <MenuItem value="INSTITUTE_ADMIN">INSTITUTE_ADMIN (Institute Administrator)</MenuItem>
              <MenuItem value="TECHNICAL_COORDINATOR">TECHNICAL_COORDINATOR (Technical Coordinator)</MenuItem>
              <MenuItem value="FACULTY">FACULTY (Instructor / Course Admin)</MenuItem>
              <MenuItem value="STUDENT">STUDENT (Learner Portal)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="e.g., Dr. Robert Vance"
          />

          <TextField
            label="Username / Login ID"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            placeholder="e.g., robertvance"
          />

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., robert@institute.edu"
          />

          <TextField
            label="Initial Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Set account password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Auto-generate password">
                    <IconButton onClick={generatePassword} edge="end" size="small" className="mr-1">
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

        <DialogActions className="p-4 bg-slate-50 border-t border-slate-100">
          <Button onClick={onClose} disabled={isLoading} className="text-slate-600 font-semibold">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white font-bold px-6 py-2 rounded-lg"
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Create User & Assign Role'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
