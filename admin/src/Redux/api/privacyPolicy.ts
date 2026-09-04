import { baseApi } from './baseApi'

export interface IPrivacyPolicy {
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

interface IPrivacyPolicyPayload {
  title: string
  content: string
}

export const privacyPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/privacy-policy
    getAllPrivacyPolicy: builder.query<ApiResponse<IPrivacyPolicy[]>, void>({
      query: () => '/privacy-policy',
      providesTags: ['PrivacyPolicy'],
    }),

    // GET /v1/api/privacy-policy/:id
    getPrivacyPolicyById: builder.query<ApiResponse<IPrivacyPolicy>, string>({
      query: (id) => `/privacy-policy/${id}`,
      providesTags: (result, error, id) => [{ type: 'PrivacyPolicy', id }],
    }),

    // POST /v1/api/privacy-policy (JSON body — { title, content })
    createPrivacyPolicy: builder.mutation<ApiResponse<IPrivacyPolicy>, IPrivacyPolicyPayload>({
      query: (body) => ({
        url: '/privacy-policy',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),

    updatePrivacyPolicy: builder.mutation<ApiResponse<IPrivacyPolicy>, { id: string; body: IPrivacyPolicyPayload }>({
      query: ({ id, body }) => ({
        url: `/privacy-policy/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['PrivacyPolicy'],
    }),
  }),
})

export const { useGetAllPrivacyPolicyQuery, useGetPrivacyPolicyByIdQuery, useCreatePrivacyPolicyMutation, useUpdatePrivacyPolicyMutation } =
  privacyPolicyApi
