import { baseApi } from './baseApi'

export interface ITerms {
  _id: string
  title: string
  content: string
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

interface ITermsPayload {
  title: string
  content: string
}

export const termsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/terms-and-conditions
    getAllTerms: builder.query<ApiResponse<ITerms[]>, void>({
      query: () => '/terms-and-conditions',
      providesTags: ['Terms'],
    }),

    // GET /v1/api/terms-and-conditions/:id
    getTermsById: builder.query<ApiResponse<ITerms>, string>({
      query: (id) => `/terms-and-conditions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Terms', id }],
    }),

    // POST /v1/api/terms-and-conditions (JSON body — { title, content })
    createTerms: builder.mutation<ApiResponse<ITerms>, ITermsPayload>({
      query: (body) => ({
        url: '/terms-and-conditions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Terms'],
    }),

    updateTerms: builder.mutation<ApiResponse<ITerms>, { id: string; body: ITermsPayload }>({
      query: ({ id, body }) => ({
        url: `/terms-and-conditions/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Terms'],
    }),
  }),
})

export const { useGetAllTermsQuery, useGetTermsByIdQuery, useCreateTermsMutation, useUpdateTermsMutation } = termsApi
