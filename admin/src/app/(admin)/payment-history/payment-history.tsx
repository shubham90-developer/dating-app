'use client'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAllUserSubscriptionsQuery } from '@/Redux/api/userSubscriptionApi'
import { useState } from 'react'
import { Badge, Card, CardBody, CardHeader, CardTitle, Table } from 'react-bootstrap'

const statusVariant: Record<string, string> = {
  charged: 'success',
  active: 'success',
  authenticated: 'info',
  created: 'secondary',
  cancelled: 'danger',
  failed: 'danger',
}

const PaymentHistory = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetAllUserSubscriptionsQuery({ page, limit: 20 })

  const records = data?.data ?? []
  const pagination = data?.pagination

  return (
    <Card>
      <CardHeader>
        <CardTitle as={'h4'} className="d-flex align-items-center gap-1">
          <IconifyIcon icon="solar:card-bold-duotone" className="text-primary fs-20" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="table-responsive">
              <Table className="table-centered mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Source</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.createdAt).toLocaleString('en-IN')}</td>
                      <td>
                        {record.profile ? `${record.profile.firstName ?? ''} ${record.profile.lastName ?? ''}`.trim() || record.profile.phone : '—'}
                      </td>
                      <td>{record.subscriptionPlan?.planName ?? '—'}</td>
                      <td>₹{(record.amount / 100).toFixed(2)}</td>
                      <td>{record.razorpayDetails?.method ?? record.paymentMethod ?? '—'}</td>
                      <td>{record.source === 'admin' ? <Badge bg="secondary">Admin Granted</Badge> : <Badge bg="primary">Razorpay</Badge>}</td>
                      <td>
                        <Badge bg={statusVariant[record.status] ?? 'secondary'}>{record.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </button>
                <span className="align-self-center">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button className="btn btn-sm btn-outline-secondary" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  )
}

export default PaymentHistory
