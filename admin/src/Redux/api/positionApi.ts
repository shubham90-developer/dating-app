import { baseApi } from './baseApi'

export interface IPosition {
  _id: string
  title: string
  subTitle: string
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

interface IPositionPayload {
  title: string
  subTitle: string
}

export const positionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/position
    getAllPositions: builder.query<ApiResponse<IPosition[]>, void>({
      query: () => '/position',
      providesTags: ['Position'],
    }),

    // GET /v1/api/position/:id
    getPositionById: builder.query<ApiResponse<IPosition>, string>({
      query: (id) => `/position/${id}`,
      providesTags: (result, error, id) => [{ type: 'Position', id }],
    }),

    // POST /v1/api/position (JSON body — { title, subTitle })
    createPosition: builder.mutation<ApiResponse<IPosition>, IPositionPayload>({
      query: (body) => ({
        url: '/position',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Position'],
    }),

    updatePosition: builder.mutation<ApiResponse<IPosition>, { id: string; body: IPositionPayload }>({
      query: ({ id, body }) => ({
        url: `/position/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Position'],
    }),

    // DELETE /v1/api/position/:id
    deletePosition: builder.mutation<ApiResponse<IPosition>, string>({
      query: (id) => ({
        url: `/position/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Position'],
    }),
  }),
})

export const { useGetAllPositionsQuery, useGetPositionByIdQuery, useCreatePositionMutation, useUpdatePositionMutation, useDeletePositionMutation } =
  positionApi
