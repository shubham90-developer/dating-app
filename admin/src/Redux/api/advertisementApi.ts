import { baseApi } from './baseApi'

export interface IAdFeature {
  icon: string
  title: string
  description: string
}

export interface IAdvertisement {
  _id: string
  title: string
  backgroundVideo: string
  features: IAdFeature[]
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

export const advertisementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/advertisement
    getAllAdvertisements: builder.query<ApiResponse<IAdvertisement[]>, void>({
      query: () => '/advertisement',
      providesTags: ['Advertisement'],
    }),

    // GET /v1/api/advertisement/:id
    getAdvertisementById: builder.query<ApiResponse<IAdvertisement>, string>({
      query: (id) => `/advertisement/${id}`,
      providesTags: (result, error, id) => [{ type: 'Advertisement', id }],
    }),

    // POST /v1/api/advertisement (multipart — 'title', 'backgroundVideo', 'featureIcons', 'features' JSON string)
    createAdvertisement: builder.mutation<ApiResponse<IAdvertisement>, FormData>({
      query: (formData) => ({
        url: '/advertisement',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Advertisement'],
    }),

    updateAdvertisement: builder.mutation<ApiResponse<IAdvertisement>, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/advertisement/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Advertisement'],
    }),

    // DELETE /v1/api/advertisement/:id
    deleteAdvertisement: builder.mutation<ApiResponse<IAdvertisement>, string>({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Advertisement'],
    }),
  }),
})

export const {
  useGetAllAdvertisementsQuery,
  useGetAdvertisementByIdQuery,
  useCreateAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
} = advertisementApi
