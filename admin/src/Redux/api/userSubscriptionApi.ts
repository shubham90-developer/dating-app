import { baseApi } from './baseApi'

export interface IUserSubscription {
  _id: string
  profile?: {
    _id: string
    firstName?: string
    lastName?: string
    phone?: string
  }
  subscriptionPlan?: {
    _id: string
    planName?: string
    priceAfterTrial?: string
  }
  razorpayPaymentId?: string
  razorpayPlanId: string
  razorpaySubscriptionId: string
  paymentMethod?: string
  amount: number
  authAmount: number
  status: 'created' | 'authenticated' | 'active' | 'charged' | 'cancelled' | 'failed'
  createdAt: string
  source: 'admin' | 'razorpay'
  razorpayDetails?: {
    method?: string
    captured?: boolean
    fee?: number
    tax?: number
    email?: string
    contact?: string
  } | null
}

interface PaginatedResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const userSubscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserSubscriptions: builder.query<
      PaginatedResponse<IUserSubscription>,
      {
        page?: number
        limit?: number
        status?: string
      }
    >({
      query: ({ page = 1, limit = 20, status }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        })

        if (status) {
          params.append('status', status)
        }

        return `/user-subscription/admin/all?${params.toString()}`
      },
      providesTags: ['Subscription'],
    }),
  }),
})

export const { useGetAllUserSubscriptionsQuery } = userSubscriptionApi
