import { currency } from '@/context/constants'

export type CustomerType = {
  title: string
  item: string
  icon: string

  variant?: boolean
}

export const customerData: CustomerType[] = [
  {
    title: 'All Users',
    item: '+22.63k',
    icon: 'solar:users-group-rounded-bold-duotone',
  },
  {
    title: 'Blocked Users',
    item: '+4.5k',
    icon: 'solar:user-block-bold-duotone',
    variant: true,
  },
  {
    title: 'Verified Users',
    item: '+1.03k',
    icon: 'solar:verified-check-bold-duotone',
  },
  {
    title: 'Total Revenue',
    item: `${currency}38,908.00`,
    icon: 'solar:wallet-money-bold-duotone',
  },
]
