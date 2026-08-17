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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  School,
  PersonAdd,
  Add,
  Settings,
  Logout,
  Business,
  SupervisorAccount,
  Key,
} from '@mui/icons-material';
import {
  useGetMeQuery,
  useGetUniversitiesQuery,
  useGetUniversityAdminsQuery,
} from '@/store/api/lmsApi';
import CreateUniversityModal from '@/components/CreateUniversityModal';
import CreateUniversityAdminModal from '@/components/CreateUniversityAdminModal';
import ResetAdminPasswordModal from '@/components/ResetAdminPasswordModal';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [createUniOpen, setCreateUniOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [resetAdminModal, setResetAdminModal] = useState<{ id: string; name: string; email: string } | null>(null);

  const { data: userData, isLoading: userLoading } = useGetMeQuery(undefined);
  const { data: universities = [], isLoading: uniLoading } = useGetUniversitiesQuery();
  const { data: admins = [], isLoading: adminLoading } = useGetUniversityAdminsQuery();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <Box className="min-h-screen bg-slate-100/70 pb-12">
      {/* Header with Professional Academic Navy/Indigo Gradient */}
      <Box className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white shadow-lg">
        <Container maxWidth="xl" className="py-4 flex justify-between items-center">
          <Box className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-sky-300 border border-white/10 backdrop-blur">
              <School style={{ fontSize: 32 }} />
            </div>
            <div>
              <Typography variant="h6" className="font-extrabold text-white leading-tight tracking-wide">
                LMS Super Admin Dashboard
              </Typography>
              <Typography variant="caption" className="text-slate-300">
                System Management Portal
              </Typography>
            </div>
          </Box>

          <Box className="flex items-center space-x-3">
            <Box className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur">
              <Avatar className="w-7 h-7 bg-indigo-600 text-xs font-bold">SA</Avatar>
              <Typography variant="body2" className="font-medium text-slate-100">
                {userData?.user?.name || 'Super Admin'} (sadmin)
              </Typography>
            </Box>

            <Button
              variant="outlined"
              size="small"
              startIcon={<Settings fontSize="small" />}
              onClick={() => router.push('/dashboard/settings')}
              className="text-slate-100 border-indigo-700/60 hover:bg-indigo-900/40 normal-case"
            >
              Settings
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<Logout fontSize="small" />}
              onClick={handleLogout}
              className="normal-case bg-indigo-700 hover:bg-indigo-800 text-white"
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" className="mt-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm border border-indigo-100 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <Typography variant="overline" className="text-indigo-900 font-bold tracking-wider">
                  Total Universities Created
                </Typography>
                <Typography variant="h3" className="font-extrabold text-slate-900 mt-1">
                  {universities.length}
                </Typography>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
                <Business style={{ fontSize: 40 }} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-sky-100 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <Typography variant="overline" className="text-sky-900 font-bold tracking-wider">
                  Total University Admins Assigned
                </Typography>
                <Typography variant="h3" className="font-extrabold text-slate-900 mt-1">
                  {admins.length}
                </Typography>
              </div>
              <div className="p-4 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100">
                <SupervisorAccount style={{ fontSize: 40 }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs & Table Section */}
        <Paper className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white">
          <Box className="border-b border-slate-200 bg-white px-6 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center">
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Universities" className="font-bold normal-case text-base" />
              <Tab label="University Admins" className="font-bold normal-case text-base" />
            </Tabs>

            <Box className="py-2">
              {tabValue === 0 ? (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateUniOpen(true)}
                  className="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white normal-case font-bold shadow-md shadow-indigo-900/20"
                >
                  Create University
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setCreateAdminOpen(true)}
                  className="bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white normal-case font-bold shadow-md shadow-sky-900/20"
                >
                  Add University Admin
                </Button>
              )}
            </Box>
          </Box>

          {/* Universities Tab Content */}
          {tabValue === 0 && (
            <TableContainer className="bg-white">
              <Table>
                <TableHead className="bg-indigo-50/70">
                  <TableRow>
                    <TableCell className="font-bold text-indigo-950">University Name</TableCell>
                    <TableCell className="font-bold text-indigo-950">Location / Place</TableCell>
                    <TableCell className="font-bold text-indigo-950">Details</TableCell>
                    <TableCell className="font-bold text-indigo-950">Assigned Admins</TableCell>
                    <TableCell className="font-bold text-indigo-950">Created Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : universities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8 text-indigo-700/70">
                        No Universities created yet. Click "Create University" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    universities.map((uni: any) => (
                      <TableRow key={uni.id} hover>
                        <TableCell className="font-bold text-slate-800">{uni.name}</TableCell>
                        <TableCell className="text-slate-600 font-medium">{uni.place}</TableCell>
                        <TableCell className="text-slate-500">{uni.details || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${uni.admins?.length || 0} Admin(s)`}
                            size="small"
                            className="bg-indigo-100 text-indigo-900 font-bold border border-indigo-200"
                          />
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {new Date(uni.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* University Admins Tab Content */}
          {tabValue === 1 && (
            <TableContainer className="bg-white">
              <Table>
                <TableHead className="bg-sky-50/70">
                  <TableRow>
                    <TableCell className="font-bold text-sky-950">Admin Name</TableCell>
                    <TableCell className="font-bold text-sky-950">Email (Login ID)</TableCell>
                    <TableCell className="font-bold text-sky-950">Assigned University</TableCell>
                    <TableCell className="font-bold text-sky-950">Created Date</TableCell>
                    <TableCell className="font-bold text-sky-950 text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8 text-slate-500">
                        No University Admins added yet. Click "Add University Admin" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin: any) => (
                      <TableRow key={admin.id} hover>
                        <TableCell className="font-bold text-slate-800">{admin.name}</TableCell>
                        <TableCell className="text-indigo-700 font-mono text-sm font-bold">{admin.email}</TableCell>
                        <TableCell className="text-slate-700 font-medium">
                          {admin.university?.name} ({admin.university?.place})
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Key fontSize="small" />}
                            onClick={() =>
                              setResetAdminModal({
                                id: admin.id,
                                name: admin.name,
                                email: admin.email,
                              })
                            }
                            className="normal-case text-xs border-indigo-300 text-indigo-900 hover:bg-indigo-50 font-semibold"
                          >
                            Reset Password
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* Modals */}
      <CreateUniversityModal open={createUniOpen} onClose={() => setCreateUniOpen(false)} />
      <CreateUniversityAdminModal open={createAdminOpen} onClose={() => setCreateAdminOpen(false)} />
      <ResetAdminPasswordModal
        open={Boolean(resetAdminModal)}
        admin={resetAdminModal}
        onClose={() => setResetAdminModal(null)}
      />
    </Box>
  );
}
