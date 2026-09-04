import { baseApi } from './baseApi'

export interface ISexualOrientation {
  _id: string
  title: string
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

interface ISexualOrientationPayload {
  title: string
}

export const sexualOrientationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/sexual-orientation
    getAllSexualOrientations: builder.query<ApiResponse<ISexualOrientation[]>, void>({
      query: () => '/sexual-orientation',
      providesTags: ['SexualOrientation'],
    }),

    // GET /v1/api/sexual-orientation/:id
    getSexualOrientationById: builder.query<ApiResponse<ISexualOrientation>, string>({
      query: (id) => `/sexual-orientation/${id}`,
      providesTags: (result, error, id) => [{ type: 'SexualOrientation', id }],
    }),

    // POST /v1/api/sexual-orientation (JSON body — { title })
    createSexualOrientation: builder.mutation<ApiResponse<ISexualOrientation>, ISexualOrientationPayload>({
      query: (body) => ({
        url: '/sexual-orientation',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SexualOrientation'],
    }),

    updateSexualOrientation: builder.mutation<ApiResponse<ISexualOrientation>, { id: string; body: ISexualOrientationPayload }>({
      query: ({ id, body }) => ({
        url: `/sexual-orientation/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SexualOrientation'],
    }),

    // DELETE /v1/api/sexual-orientation/:id
    deleteSexualOrientation: builder.mutation<ApiResponse<ISexualOrientation>, string>({
      query: (id) => ({
        url: `/sexual-orientation/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SexualOrientation'],
    }),
  }),
})

export const {
  useGetAllSexualOrientationsQuery,
  useGetSexualOrientationByIdQuery,
  useCreateSexualOrientationMutation,
  useUpdateSexualOrientationMutation,
  useDeleteSexualOrientationMutation,
} = sexualOrientationApi
