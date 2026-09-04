import { baseApi } from './baseApi'

export interface IAdmin {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProfile: builder.query<ApiResponse<IAdmin>, void>({
      query: () => '/admin/me',
      providesTags: ['Admin'],
    }),

    updateAdminProfile: builder.mutation<ApiResponse<IAdmin>, FormData>({
      query: (formData) => ({
        url: '/admin/me',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
})

export const { useGetAdminProfileQuery, useUpdateAdminProfileMutation } = adminApi
