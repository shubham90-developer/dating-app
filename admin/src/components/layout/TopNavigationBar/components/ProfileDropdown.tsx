'use client'
import avatar1 from '@/assets/images/users/avatar-1.jpg'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAdminProfileQuery } from '@/Redux/api/adminApi'
import Image from 'next/image'
import Link from 'next/link'
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'

const ProfileDropdown = () => {
  const { data } = useGetAdminProfileQuery()
  const admin = data?.data

  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown "
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image className="rounded-circle" width={32} height={32} src={admin?.avatar || avatar1} alt="avatar" />
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as={'h6'} className="dropdown-header">
          {admin?.name ? `Welcome, ${admin.name}` : 'Welcome !'}
        </DropdownHeader>

        <div className="dropdown-divider my-1" />
        <DropdownItem as={Link} href="/my-profile">
          <IconifyIcon icon="bx:user-circle" className="fs-18 align-middle me-1" />
          <span className="align-middle">My Profile</span>
        </DropdownItem>
        <DropdownItem as={Link} className=" text-danger" href="/auth/sign-in">
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default ProfileDropdown
