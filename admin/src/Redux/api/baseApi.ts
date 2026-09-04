import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: [
    'Profiles',
    'Subscription',
    'Notification',
    'SplashScreen',
    'LoginScreen',
    'Onboarding',
    'Advertisement',
    'Subscription',
    'Terms',
    'PrivacyPolicy',
    'Position',
    'SexualOrientation',
    'Interest',
    'Faq',
    'ChildPolicy',
    'Gender',
    'Admin',
    'Subscription',
  ],
  endpoints: () => ({}),
})
