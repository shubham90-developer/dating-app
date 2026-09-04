import { baseApi } from "./baseApi";

export interface ILoginScreen {
  _id: string;
  loginImg: string;
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

export const loginScreenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /v1/api/login-screen
    getAllLoginScreens: builder.query<ApiResponse<ILoginScreen[]>, void>({
      query: () => "/login-screen",
      providesTags: ["LoginScreen"],
    }),

    // GET /v1/api/login-screen/:id
    getLoginScreenById: builder.query<ApiResponse<ILoginScreen>, string>({
      query: (id) => `/login-screen/${id}`,
      providesTags: (result, error, id) => [{ type: "LoginScreen", id }],
    }),

    // POST /v1/api/login-screen (multipart — FormData with 'loginImg' file)
    createLoginScreen: builder.mutation<ApiResponse<ILoginScreen>, FormData>({
      query: (formData) => ({
        url: "/login-screen",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["LoginScreen"],
    }),

    updateLoginScreen: builder.mutation<
    ApiResponse<ILoginScreen>,
    { id: string; formData: FormData }
    >({
    query: ({ id, formData }) => ({
        url: `/login-screen/${id}`,
        method: "PUT",
        body: formData,
    }),
    invalidatesTags: ["LoginScreen"],
    }),

    // DELETE /v1/api/login-screen/:id
    deleteLoginScreen: builder.mutation<ApiResponse<ILoginScreen>, string>({
      query: (id) => ({
        url: `/login-screen/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LoginScreen"],
    }),
  }),
});

export const {
  useGetAllLoginScreensQuery,
  useGetLoginScreenByIdQuery,
  useCreateLoginScreenMutation,
  useUpdateLoginScreenMutation,
  useDeleteLoginScreenMutation,
} = loginScreenApi;