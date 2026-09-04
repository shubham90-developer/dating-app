import { baseApi } from './baseApi'

export const adminNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<any, { unread?: boolean } | void>({
      query: (params) => `/admin-notifications${params?.unread ? '?unread=true' : ''}`,
      providesTags: ['Notification'],
    }),
    markNotificationRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin-notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: `/admin-notifications/read-all`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const { useGetAdminNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } = adminNotificationApi
