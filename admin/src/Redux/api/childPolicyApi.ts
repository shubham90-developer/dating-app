import { baseApi } from './baseApi'

export interface IChildPolicy {
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

interface IChildPolicyPayload {
  title: string
  content: string
}

export const childPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/child-policy
    getAllChildPolicy: builder.query<ApiResponse<IChildPolicy[]>, void>({
      query: () => '/child-policy',
      providesTags: ['ChildPolicy'],
    }),

    // GET /v1/api/child-policy/:id
    getChildPolicyById: builder.query<ApiResponse<IChildPolicy>, string>({
      query: (id) => `/child-policy/${id}`,
      providesTags: (result, error, id) => [{ type: 'ChildPolicy', id }],
    }),

    // POST /v1/api/child-policy
    createChildPolicy: builder.mutation<ApiResponse<IChildPolicy>, IChildPolicyPayload>({
      query: (body) => ({
        url: '/child-policy',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ChildPolicy'],
    }),

    // PUT /v1/api/child-policy/:id
    updateChildPolicy: builder.mutation<ApiResponse<IChildPolicy>, { id: string; body: IChildPolicyPayload }>({
      query: ({ id, body }) => ({
        url: `/child-policy/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ChildPolicy'],
    }),
  }),
})

export const { useGetAllChildPolicyQuery, useGetChildPolicyByIdQuery, useCreateChildPolicyMutation, useUpdateChildPolicyMutation } = childPolicyApi
