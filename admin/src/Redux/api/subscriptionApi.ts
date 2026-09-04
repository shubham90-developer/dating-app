import { baseApi } from './baseApi'

export interface ISubscription {
  _id: string
  backgroundVideo: string
  mainTitle: string
  highlightText: string
  planName: string
  trialPrice: string
  trialText: string
  trialDuration: string
  priceAfterTrial: string
  afterTrialText: string
  appName: string
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

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/subscription-screen
    getAllSubscriptions: builder.query<ApiResponse<ISubscription[]>, void>({
      query: () => '/subscription-screen',
      providesTags: ['Subscription'],
    }),

    // GET /v1/api/subscription-screen/:id
    getSubscriptionById: builder.query<ApiResponse<ISubscription>, string>({
      query: (id) => `/subscription-screen/${id}`,
      providesTags: (result, error, id) => [{ type: 'Subscription', id }],
    }),

    // POST /v1/api/subscription-screen (multipart — single 'backgroundVideo' file + text fields)
    createSubscription: builder.mutation<ApiResponse<ISubscription>, FormData>({
      query: (formData) => ({
        url: '/subscription-screen',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Subscription'],
    }),

    updateSubscription: builder.mutation<ApiResponse<ISubscription>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/subscription-screen/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // DELETE /v1/api/subscription-screen/:id
    deleteSubscription: builder.mutation<ApiResponse<ISubscription>, string>({
      query: (id) => ({
        url: `/subscription-screen/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
})

export const {
  useGetAllSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi
