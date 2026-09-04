import { baseApi } from './baseApi'

export interface IOnboarding {
  _id: string
  title: string
  subTitle: string
  img: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/onboarding
    getAllOnboarding: builder.query<ApiResponse<IOnboarding[]>, void>({
      query: () => '/onboarding',
      providesTags: ['Onboarding'],
    }),

    // GET /v1/api/onboarding/:id
    getOnboardingById: builder.query<ApiResponse<IOnboarding>, string>({
      query: (id) => `/onboarding/${id}`,
      providesTags: (result, error, id) => [{ type: 'Onboarding', id }],
    }),

    // POST /v1/api/onboarding
    createOnboarding: builder.mutation<ApiResponse<IOnboarding>, FormData>({
      query: (formData) => ({
        url: '/onboarding',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Onboarding'],
    }),

    // PUT /v1/api/onboarding/:id
    updateOnboarding: builder.mutation<ApiResponse<IOnboarding>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/onboarding/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Onboarding', id }, 'Onboarding'],
    }),

    // DELETE /v1/api/onboarding/:id
    deleteOnboarding: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/onboarding/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Onboarding'],
    }),
  }),
})

export const {
  useGetAllOnboardingQuery,
  useGetOnboardingByIdQuery,
  useCreateOnboardingMutation,
  useUpdateOnboardingMutation,
  useDeleteOnboardingMutation,
} = onboardingApi
