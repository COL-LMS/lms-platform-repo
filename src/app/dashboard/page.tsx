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
  TextField,
  InputAdornment,
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
  Search,
  Tune,
  AdminPanelSettings,
  Badge,
} from '@mui/icons-material';
import {
  useGetMeQuery,
  useGetUniversitiesQuery,
  useGetUniversityAdminsQuery,
  useGetUsersQuery,
  University,
  UniversityAdmin,
  User,
} from '@/store/api/lmsApi';
import CreateUniversityModal from '@/components/CreateUniversityModal';
import ManageUniversityModal from '@/components/ManageUniversityModal';
import CreateUniversityAdminModal from '@/components/CreateUniversityAdminModal';
import ManageUniversityAdminModal from '@/components/ManageUniversityAdminModal';
import ResetAdminPasswordModal from '@/components/ResetAdminPasswordModal';
import CreateUserRoleModal from '@/components/CreateUserRoleModal';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [createUniOpen, setCreateUniOpen] = useState(false);
  const [manageUniModal, setManageUniModal] = useState<University | null>(null);

  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [manageAdminModal, setManageAdminModal] = useState<UniversityAdmin | null>(null);
  const [resetAdminModal, setResetAdminModal] = useState<{ id: string; name: string; email: string } | null>(null);

  const [createUserRoleOpen, setCreateUserRoleOpen] = useState(false);

  // Queries
  const { data: userData } = useGetMeQuery(undefined);
  const { data: universities = [], isLoading: uniLoading } = useGetUniversitiesQuery();
  const { data: admins = [], isLoading: adminLoading } = useGetUniversityAdminsQuery();
  const { data: users = [], isLoading: usersLoading } = useGetUsersQuery();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  // Filtered Lists
  const filteredUniversities = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.place.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmins = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.university?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="min-h-screen bg-slate-100/70 pb-12">
      {/* Header */}
      <Box className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white shadow-lg">
        <Container maxWidth="xl" className="py-4 flex justify-between items-center">
          <Box className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-sky-300 border border-white/10 backdrop-blur">
              <School style={{ fontSize: 32 }} />
            </div>
            <div>
              <Typography variant="h6" className="font-extrabold text-white leading-tight tracking-wide">
                LMS Super Admin Governance Portal
              </Typography>
              <Typography variant="caption" className="text-slate-300">
                System Management & Role Administration
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
        {/* Metric Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm border border-indigo-100 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <Typography variant="overline" className="text-indigo-900 font-bold tracking-wider">
                  Total Universities
                </Typography>
                <Typography variant="h3" className="font-extrabold text-slate-900 mt-1">
                  {universities.length}
                </Typography>
              </div>
              <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
                <Business style={{ fontSize: 36 }} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-sky-100 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <Typography variant="overline" className="text-sky-900 font-bold tracking-wider">
                  University Admins
                </Typography>
                <Typography variant="h3" className="font-extrabold text-slate-900 mt-1">
                  {admins.length}
                </Typography>
              </div>
              <div className="p-4 bg-sky-50 text-sky-700 rounded-2xl border border-sky-100">
                <SupervisorAccount style={{ fontSize: 36 }} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-purple-100 rounded-2xl bg-white">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <Typography variant="overline" className="text-purple-900 font-bold tracking-wider">
                  System User Roles
                </Typography>
                <Typography variant="h3" className="font-extrabold text-slate-900 mt-1">
                  {users.length}
                </Typography>
              </div>
              <div className="p-4 bg-purple-50 text-purple-700 rounded-2xl border border-purple-100">
                <AdminPanelSettings style={{ fontSize: 36 }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Tabs Toolbar Section */}
        <Paper className="rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white">
          <Box className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <Tabs
              value={tabValue}
              onChange={(_, val) => setTabValue(val)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Universities" className="font-bold normal-case text-base" />
              <Tab label="University Admins" className="font-bold normal-case text-base" />
              <Tab label="User Roles Management" className="font-bold normal-case text-base" />
            </Tabs>

            <Box className="flex items-center space-x-3">
              <TextField
                size="small"
                placeholder="Search by name, place, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white min-w-[260px]"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-slate-400" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {tabValue === 0 && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setCreateUniOpen(true)}
                  className="bg-gradient-to-r from-indigo-700 to-blue-600 hover:from-indigo-800 hover:to-blue-700 text-white normal-case font-bold shadow-md text-xs whitespace-nowrap py-2"
                >
                  Create University
                </Button>
              )}

              {tabValue === 1 && (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={() => setCreateAdminOpen(true)}
                  className="bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white normal-case font-bold shadow-md text-xs whitespace-nowrap py-2"
                >
                  Add University Admin
                </Button>
              )}

              {tabValue === 2 && (
                <Button
                  variant="contained"
                  startIcon={<Badge />}
                  onClick={() => setCreateUserRoleOpen(true)}
                  className="bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 text-white normal-case font-bold shadow-md text-xs whitespace-nowrap py-2"
                >
                  Create User Role
                </Button>
              )}
            </Box>
          </Box>

          {/* TAB 0: Universities Management */}
          {tabValue === 0 && (
            <TableContainer className="bg-white">
              <Table>
                <TableHead className="bg-indigo-50/70">
                  <TableRow>
                    <TableCell className="font-bold text-indigo-950">University Name</TableCell>
                    <TableCell className="font-bold text-indigo-950">Location / Place</TableCell>
                    <TableCell className="font-bold text-indigo-950">Status</TableCell>
                    <TableCell className="font-bold text-indigo-950">Assigned Admins</TableCell>
                    <TableCell className="font-bold text-indigo-950">Created Date</TableCell>
                    <TableCell className="font-bold text-indigo-950 text-right">Manage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="py-8">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredUniversities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="py-8 text-indigo-700/70">
                        No Universities found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUniversities.map((uni: any) => (
                      <TableRow key={uni.id} hover>
                        <TableCell className="font-bold text-slate-800">{uni.name}</TableCell>
                        <TableCell className="text-slate-600 font-medium">{uni.place}</TableCell>
                        <TableCell>
                          <Chip
                            label={uni.status || 'ACTIVE'}
                            size="small"
                            color={uni.status === 'INACTIVE' ? 'default' : 'success'}
                            className="font-bold text-xs"
                          />
                        </TableCell>
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
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Tune fontSize="small" />}
                            onClick={() => setManageUniModal(uni)}
                            className="normal-case text-xs border-indigo-300 text-indigo-900 hover:bg-indigo-50 font-semibold"
                          >
                            Manage University
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* TAB 1: University Admins Management */}
          {tabValue === 1 && (
            <TableContainer className="bg-white">
              <Table>
                <TableHead className="bg-sky-50/70">
                  <TableRow>
                    <TableCell className="font-bold text-sky-950">Admin Name</TableCell>
                    <TableCell className="font-bold text-sky-950">Email (Login ID)</TableCell>
                    <TableCell className="font-bold text-sky-950">Assigned University</TableCell>
                    <TableCell className="font-bold text-sky-950">Status</TableCell>
                    <TableCell className="font-bold text-sky-950">Created Date</TableCell>
                    <TableCell className="font-bold text-sky-950 text-right">Manage Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="py-8">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" className="py-8 text-slate-500">
                        No University Admins found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((admin: any) => (
                      <TableRow key={admin.id} hover>
                        <TableCell className="font-bold text-slate-800">{admin.name}</TableCell>
                        <TableCell className="text-indigo-700 font-mono text-sm font-bold">{admin.email}</TableCell>
                        <TableCell className="text-slate-700 font-medium">
                          {admin.university?.name} ({admin.university?.place})
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={admin.status || 'ACTIVE'}
                            size="small"
                            color={admin.status === 'INACTIVE' ? 'default' : 'success'}
                            className="font-bold text-xs"
                          />
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right" className="space-x-2">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Tune fontSize="small" />}
                            onClick={() => setManageAdminModal(admin)}
                            className="normal-case text-xs border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                          >
                            Manage
                          </Button>
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

          {/* TAB 2: User Roles Management */}
          {tabValue === 2 && (
            <TableContainer className="bg-white">
              <Table>
                <TableHead className="bg-purple-50/70">
                  <TableRow>
                    <TableCell className="font-bold text-purple-950">User Name</TableCell>
                    <TableCell className="font-bold text-purple-950">Username / Login ID</TableCell>
                    <TableCell className="font-bold text-purple-950">Assigned Role</TableCell>
                    <TableCell className="font-bold text-purple-950">Status</TableCell>
                    <TableCell className="font-bold text-purple-950">Created Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" className="py-8 text-slate-500">
                        No Users found matching search criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((usr: User) => (
                      <TableRow key={usr.id} hover>
                        <TableCell className="font-bold text-slate-800">{usr.name}</TableCell>
                        <TableCell className="text-purple-800 font-mono text-sm font-bold">{usr.username}</TableCell>
                        <TableCell>
                          <Chip
                            label={usr.role}
                            size="small"
                            className={`font-bold text-xs ${
                              usr.role === 'SUPER_ADMIN'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : usr.role === 'UNIVERSITY_ADMIN'
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                : usr.role === 'FACULTY'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usr.status || 'ACTIVE'}
                            size="small"
                            color={usr.status === 'INACTIVE' ? 'default' : 'success'}
                            className="font-bold text-xs"
                          />
                        </TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {new Date(usr.createdAt).toLocaleDateString()}
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
      <ManageUniversityModal
        open={Boolean(manageUniModal)}
        university={manageUniModal}
        onClose={() => setManageUniModal(null)}
      />

      <CreateUniversityAdminModal open={createAdminOpen} onClose={() => setCreateAdminOpen(false)} />
      <ManageUniversityAdminModal
        open={Boolean(manageAdminModal)}
        admin={manageAdminModal}
        onClose={() => setManageAdminModal(null)}
      />

      <ResetAdminPasswordModal
        open={Boolean(resetAdminModal)}
        admin={resetAdminModal}
        onClose={() => setResetAdminModal(null)}
      />

      <CreateUserRoleModal open={createUserRoleOpen} onClose={() => setCreateUserRoleOpen(false)} />
    </Box>
  );
}
