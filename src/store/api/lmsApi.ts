import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface University {
  id: string;
  name: string;
  place: string;
  details?: string;
  status: string;
  createdAt: string;
  admins?: Array<{ id: string; name: string; email: string }>;
}

export interface UniversityAdmin {
  id: string;
  name: string;
  email: string;
  status: string;
  universityId: string;
  university?: {
    id: string;
    name: string;
    place?: string;
  };
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

export const lmsApi = createApi({
  reducerPath: 'lmsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['University', 'UniversityAdmin', 'User', 'Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { username: string; passwordHash: string }) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    changePassword: builder.mutation({
      query: (passwords: { oldPassword: string; newPassword: string }) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    // Universities
    getUniversities: builder.query<University[], void>({
      query: () => '/universities',
      providesTags: ['University'],
    }),
    createUniversity: builder.mutation<University, { name: string; place: string; details?: string }>({
      query: (body) => ({
        url: '/universities',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['University'],
    }),
    updateUniversity: builder.mutation<University, { id: string; name: string; place: string; details?: string; status?: string }>({
      query: ({ id, ...body }) => ({
        url: `/universities/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['University', 'UniversityAdmin'],
    }),
    // University Admins
    getUniversityAdmins: builder.query<UniversityAdmin[], void>({
      query: () => '/university-admins',
      providesTags: ['UniversityAdmin'],
    }),
    createUniversityAdmin: builder.mutation<UniversityAdmin, { name: string; email: string; password: string; universityId: string }>({
      query: (body) => ({
        url: '/university-admins',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UniversityAdmin', 'University'],
    }),
    updateUniversityAdmin: builder.mutation<UniversityAdmin, { id: string; name: string; email: string; universityId: string; status?: string }>({
      query: ({ id, ...body }) => ({
        url: `/university-admins/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['UniversityAdmin', 'University'],
    }),
    resetAdminPassword: builder.mutation<{ success: boolean; message: string }, { adminId: string; newPassword: string }>({
      query: (body) => ({
        url: '/university-admins/reset-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UniversityAdmin'],
    }),
    // User Roles Management
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, { username: string; name: string; email?: string; password: string; role: string }>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<User, { id: string; name?: string; role?: string; status?: string }>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useGetMeQuery,
  useGetUniversitiesQuery,
  useCreateUniversityMutation,
  useUpdateUniversityMutation,
  useGetUniversityAdminsQuery,
  useCreateUniversityAdminMutation,
  useUpdateUniversityAdminMutation,
  useResetAdminPasswordMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} = lmsApi;
