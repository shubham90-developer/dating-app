import PaymentHistory from './payment-history'
import PageTItle from '@/components/PageTItle'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Payment History' }

const PaymentHistoryPage = () => {
  return (
    <>
      <PageTItle title="PAYMENT HISTORY" />
      <PaymentHistory />
    </>
  )
}

export default PaymentHistoryPage
