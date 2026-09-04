'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'
import { useGetAdminNotificationsQuery, useMarkAllNotificationsReadMutation } from '@/Redux/api/notificationApi'

import { baseApi } from '@/Redux/api/baseApi'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import Link from 'next/link'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'

const NotificationItem = ({ title, message }: { title: string; message: string }) => (
  <DropdownItem className="py-3 border-bottom text-wrap">
    <div className="d-flex">
      <div className="flex-shrink-0">
        <div className="avatar-sm me-2">
          <span className="avatar-title bg-soft-info text-info fs-20 rounded-circle">{title.charAt(0).toUpperCase()}</span>
        </div>
      </div>
      <div className="flex-grow-1">
        <p className="mb-0 fw-semibold">{title}</p>
        <p className="mb-0 text-wrap">{message}</p>
      </div>
    </div>
  </DropdownItem>
)

const Notifications = () => {
  const dispatch = useDispatch()
  const { data } = useGetAdminNotificationsQuery()
  const [markAllRead] = useMarkAllNotificationsReadMutation()

  const notificationList = data?.data ?? []
  const unreadCount = data?.meta?.unreadCount ?? 0

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!.replace('/v1/api', ''), {
      auth: { token },
    })

    socket.on('new-profile', () => {
      dispatch(baseApi.util.invalidateTags(['Notification']))
    })

    return () => {
      socket.disconnect()
    }
  }, [dispatch])

  return (
    <Dropdown className="topbar-item ">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button position-relative content-none"
        id="page-header-notifications-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <IconifyIcon icon="solar:bell-bing-bold-duotone" className="fs-24 align-middle " />
        {unreadCount > 0 && (
          <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
            {unreadCount}
            <span className="visually-hidden">unread messages</span>
          </span>
        )}
      </DropdownToggle>
      <DropdownMenu className="py-0 dropdown-lg dropdown-menu-end" aria-labelledby="page-header-notifications-dropdown">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <Row className="align-items-center">
            <div className="col">
              <h6 className="m-0 fs-16 fw-semibold"> Notifications</h6>
            </div>
            <div className="col-auto">
              <Link href="" className="text-dark text-decoration-underline" onClick={() => markAllRead()}>
                <small>Clear All</small>
              </Link>
            </div>
          </Row>
        </div>
        <SimplebarReactClient style={{ maxHeight: 280 }}>
          {notificationList.map((n: any) => (
            <NotificationItem key={n._id} title={n.title} message={n.message} />
          ))}
        </SimplebarReactClient>
      </DropdownMenu>
    </Dropdown>
  )
}

export default Notifications
