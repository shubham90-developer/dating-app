import { baseApi } from './baseApi'

export interface IInterest {
  _id: string
  title: string
  icon: string
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

export const interestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/interest
    getAllInterests: builder.query<ApiResponse<IInterest[]>, void>({
      query: () => '/interest',
      providesTags: ['Interest'],
    }),

    // GET /v1/api/interest/:id
    getInterestById: builder.query<ApiResponse<IInterest>, string>({
      query: (id) => `/interest/${id}`,
      providesTags: (result, error, id) => [{ type: 'Interest', id }],
    }),

    // POST /v1/api/interest (multipart — 'title', single 'icon' file)
    createInterest: builder.mutation<ApiResponse<IInterest>, FormData>({
      query: (formData) => ({
        url: '/interest',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Interest'],
    }),

    updateInterest: builder.mutation<ApiResponse<IInterest>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/interest/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Interest'],
    }),

    // DELETE /v1/api/interest/:id
    deleteInterest: builder.mutation<ApiResponse<IInterest>, string>({
      query: (id) => ({
        url: `/interest/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Interest'],
    }),
  }),
})

export const { useGetAllInterestsQuery, useGetInterestByIdQuery, useCreateInterestMutation, useUpdateInterestMutation, useDeleteInterestMutation } =
  interestApi
