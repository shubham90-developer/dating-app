import { baseApi } from './baseApi'

export interface IGender {
  _id: string
  gender: string
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

export const genderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/gender
    getAllGenders: builder.query<ApiResponse<IGender[]>, void>({
      query: () => '/gender',
      providesTags: ['Gender'],
    }),

    // GET /v1/api/gender/:id
    getGenderById: builder.query<ApiResponse<IGender>, string>({
      query: (id) => `/gender/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gender', id }],
    }),

    // POST /v1/api/gender
    createGender: builder.mutation<ApiResponse<IGender>, { gender: string }>({
      query: (body) => ({
        url: '/gender',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Gender'],
    }),

    // PUT /v1/api/gender/:id
    updateGender: builder.mutation<ApiResponse<IGender>, { id: string; gender: string }>({
      query: ({ id, gender }) => ({
        url: `/gender/${id}`,
        method: 'PUT',
        body: { gender },
      }),
      invalidatesTags: ['Gender'],
    }),

    // DELETE /v1/api/gender/:id
    deleteGender: builder.mutation<ApiResponse<IGender>, string>({
      query: (id) => ({
        url: `/gender/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gender'],
    }),
  }),
})

export const { useGetAllGendersQuery, useGetGenderByIdQuery, useCreateGenderMutation, useUpdateGenderMutation, useDeleteGenderMutation } = genderApi
