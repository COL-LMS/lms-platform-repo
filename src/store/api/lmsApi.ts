import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface University {
  id: string;
  name: string;
  place: string;
  details?: string;
  createdAt: string;
}

export interface UniversityAdmin {
  id: string;
  name: string;
  email: string;
  universityId: string;
  university?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export const lmsApi = createApi({
  reducerPath: 'lmsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['University', 'UniversityAdmin', 'Auth'],
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
      invalidatesTags: ['UniversityAdmin'],
    }),
    resetAdminPassword: builder.mutation<{ success: boolean; message: string }, { adminId: string; newPassword: string }>({
      query: (body) => ({
        url: '/university-admins/reset-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UniversityAdmin'],
    }),
  }),
});

export const {
  useLoginMutation,
  useChangePasswordMutation,
  useGetMeQuery,
  useGetUniversitiesQuery,
  useCreateUniversityMutation,
  useGetUniversityAdminsQuery,
  useCreateUniversityAdminMutation,
  useResetAdminPasswordMutation,
} = lmsApi;

