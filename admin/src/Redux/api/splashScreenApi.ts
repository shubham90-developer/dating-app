import { baseApi } from "./baseApi";

export interface ISplashScreen {
  _id: string;
  splashImg: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const splashScreenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/splash-screen
    getAllSplashScreens: builder.query<ApiResponse<ISplashScreen[]>, void>({
      query: () => "/splash-screen",
      providesTags: ["SplashScreen"],
    }),

    // GET /v1/api/splash-screen/:id
    getSplashScreenById: builder.query<ApiResponse<ISplashScreen>, string>({
      query: (id) => `/splash-screen/${id}`,
      providesTags: (result, error, id) => [{ type: "SplashScreen", id }],
    }),

    // POST /v1/api/splash-screen (multipart — expects FormData with 'splashImg' file)
    createSplashScreen: builder.mutation<ApiResponse<ISplashScreen>, FormData>({
      query: (formData) => ({
        url: "/splash-screen",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SplashScreen"],
    }),

    updateSplashScreen: builder.mutation<
    ApiResponse<ISplashScreen>,
    { id: string; formData: FormData }
    >({
    query: ({ id, formData }) => ({
        url: `/splash-screen/${id}`,
        method: "PUT",
        body: formData,
    }),
    invalidatesTags: ["SplashScreen"],
    }),

    // DELETE /v1/api/splash-screen/:id
    deleteSplashScreen: builder.mutation<ApiResponse<ISplashScreen>, string>({
      query: (id) => ({
        url: `/splash-screen/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SplashScreen"],
    }),
  }),
});

export const {
  useGetAllSplashScreensQuery,
  useGetSplashScreenByIdQuery,
  useCreateSplashScreenMutation,
  useUpdateSplashScreenMutation,
  useDeleteSplashScreenMutation,
} = splashScreenApi;