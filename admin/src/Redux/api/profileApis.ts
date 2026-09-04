import { baseApi } from './baseApi'

export interface IProfilePhoto {
  id: string
  image: string
}

export interface IProfile {
  _id: string
  phone: number
  photos: IProfilePhoto[]
  firstName: string
  lastName: string
  nickName: string
  birthday: string
  placeToMeet: boolean
  isBlocked: boolean
  position?: { _id: string; title: string }
  gender?: { _id: string; gender: string }
  sexOrientation?: { _id: string; title: string }
  looking?: { _id: string; title: string }
  interest?: string
  bio?: string
  height?: string
  weight?: string
  selfie?: string
  document?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface IDashboardStats {
  totalUsers: number
  todayUsers: number
  verifiedUsers: number
  blockedUsers: number
  totalRevenue: number
  todayRevenue: number
}

interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/profiles/admin/all
    getAllProfiles: builder.query<
      ApiResponse<IProfile[]> & {
        meta?: {
          page: number
          limit: number
          total: number
          totalPages: number
        }
      },
      { page?: number; limit?: number } | void
    >({
      query: (params) => {
        const page = params?.page ?? 1
        const limit = params?.limit ?? 20

        return `/profiles/admin/all?page=${page}&limit=${limit}`
      },
      providesTags: ['Profiles'],
    }),

    // GET /v1/api/profiles/admin/:id
    getProfileById: builder.query<ApiResponse<IProfile>, string>({
      query: (id) => `/profiles/admin/${id}`,
      providesTags: (result, error, id) => [{ type: 'Profiles', id }],
    }),

    // PUT /v1/api/profiles/admin/:id
    updateProfile: builder.mutation<ApiResponse<IProfile>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/profiles/admin/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Profiles', id }, 'Profiles'],
    }),

    // DELETE /v1/api/profiles/admin/:id
    deleteProfile: builder.mutation<ApiResponse<IProfile>, string>({
      query: (id) => ({
        url: `/profiles/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profiles'],
    }),

    // PATCH /v1/api/profiles/:id/verify
    verifyProfile: builder.mutation<ApiResponse<IProfile>, string>({
      query: (id) => ({
        url: `/profiles/${id}/verify`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Profiles', id }, 'Profiles'],
    }),

    // PATCH /v1/api/profiles/:id/unverify
    unverifyProfile: builder.mutation<ApiResponse<IProfile>, string>({
      query: (id) => ({
        url: `/profiles/${id}/unverify`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Profiles', id }, 'Profiles'],
    }),
    adminBlockProfile: builder.mutation<ApiResponse<IProfile>, string>({
      query: (id) => ({ url: `/profiles/${id}/admin-block`, method: 'PATCH' }),
      invalidatesTags: ['Profiles'],
    }),
    adminUnblockProfile: builder.mutation<ApiResponse<IProfile>, string>({
      query: (id) => ({ url: `/profiles/${id}/admin-unblock`, method: 'PATCH' }),
      invalidatesTags: ['Profiles'],
    }),

    // POST /v1/api/profiles/admin-create
    adminCreateProfile: builder.mutation<ApiResponse<IProfile>, FormData>({
      query: (formData) => ({
        url: '/profiles/admin-create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profiles'],
    }),

    // GET /v1/api/admin/dashboard-stats
    getDashboardStats: builder.query<ApiResponse<IDashboardStats>, void>({
      query: () => '/profiles/admin/dashboard-stats',
      providesTags: ['Profiles'],
    }),
  }),
})

export const {
  useGetAllProfilesQuery,
  useGetProfileByIdQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useVerifyProfileMutation,
  useUnverifyProfileMutation,
  useAdminCreateProfileMutation,
  useGetDashboardStatsQuery,
  useAdminBlockProfileMutation,
  useAdminUnblockProfileMutation,
} = profileApi
