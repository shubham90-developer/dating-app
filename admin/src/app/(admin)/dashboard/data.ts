import { currency } from '@/context/constants'
import { PageType, StatType } from './types'

export const stateData: StatType[] = [
  {
    icon: 'solar:user-plus-rounded-bold-duotone',
    name: 'Today Users',
    amount: '13,647',
    variant: 'success',
    change: '2.3',
  },
  {
    icon: 'solar:users-group-rounded-bold-duotone',
    name: 'Total Users',
    amount: '13,647',
    variant: 'success',
    change: '2.3',
  },
  {
    icon: 'solar:verified-check-bold-duotone',
    name: 'Verified Users',
    amount: '9,526',
    variant: 'success',
    change: '8.1',
  },
  {
    icon: 'solar:user-block-bold-duotone',
    name: 'Blocked Users',
    amount: '976',
    variant: 'danger',
    change: '0.3',
  },
  {
    icon: 'solar:wallet-money-bold-duotone',
    name: 'Today Revenue',
    amount: '123.6k',
    variant: 'warning',
    change: '10.6',
  },
  {
    icon: 'solar:card-bold-duotone',
    name: 'Total Revenue',
    amount: '123.6k',
    variant: 'primary',
    change: '10.6',
  },
]

export const pagesList: PageType[] = [
  {
    path: 'larkon/ecommerce.html',
    views: 465,
    rate: '4.4',
    variant: 'success',
  },
  {
    path: 'larkon/dashboard.html',
    views: 426,
    rate: '20.4',
    variant: 'danger',
  },
  {
    path: 'larkon/chat.html',
    views: 254,
    rate: '12.25',
    variant: 'warning',
  },
  {
    path: 'larkon/auth-login.html',
    views: 3369,
    rate: '5.2',
    variant: 'success',
  },
  {
    path: 'larkon/email.html',
    views: 985,
    rate: '64.2',
    variant: 'danger',
  },
  {
    path: 'larkon/social.html',
    views: 653,
    rate: '2.4',
    variant: 'success',
  },
  {
    path: 'larkon/blog.html',
    views: 478,
    rate: '1.4',
    variant: 'danger',
  },
]
