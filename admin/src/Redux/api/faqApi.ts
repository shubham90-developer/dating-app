import { baseApi } from './baseApi'

export interface IFaq {
  _id: string
  qustion: string
  answer: string
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

interface IFaqPayload {
  qustion: string
  answer: string
}

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqs: builder.query<ApiResponse<IFaq[]>, void>({
      query: () => '/faq',
      providesTags: ['Faq'],
    }),
    getFaqById: builder.query<ApiResponse<IFaq>, string>({
      query: (id) => `/faq/${id}`,
      providesTags: (result, error, id) => [{ type: 'Faq', id }],
    }),
    createFaq: builder.mutation<ApiResponse<IFaq>, IFaqPayload>({
      query: (body) => ({ url: '/faq', method: 'POST', body }),
      invalidatesTags: ['Faq'],
    }),
    updateFaq: builder.mutation<ApiResponse<IFaq>, { id: string; body: IFaqPayload }>({
      query: ({ id, body }) => ({ url: `/faq/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Faq'],
    }),
    deleteFaq: builder.mutation<ApiResponse<IFaq>, string>({
      query: (id) => ({ url: `/faq/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Faq'],
    }),
  }),
})

export const { useGetAllFaqsQuery, useGetFaqByIdQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } = faqApi
