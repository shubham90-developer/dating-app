'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardHeader, Table, Spinner, Badge } from 'react-bootstrap'
import AddAdvertise from './AddAdvertise'
import EditAdvertise from './EditAdvertise'
import ViewAdvertise from './ViewAdvertise'

import { useGetAllAdvertisementsQuery, useDeleteAdvertisementMutation } from '@/Redux/api/advertisementApi'

const Advertise = () => {
  const { data, isLoading } = useGetAllAdvertisementsQuery()
  const [deleteAdvertisement, { isLoading: isDeleting }] = useDeleteAdvertisementMutation()

  const list = data?.data || []

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this advertisement?')) return
    try {
      await deleteAdvertisement(id).unwrap()
    } catch (error) {
      console.error('Failed to delete advertisement:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader as={'h5'} className="text-uppercase fw-bold">
          <div className="d-flex align-items-center justify-content-between gap-2">
            Advertise List
            <AddAdvertise />
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" /> Loading...
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Sr.No</th>
                  <th>Background Video</th>
                  <th>Title</th>
                  <th>Features</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No advertisements found
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        <video src={item.backgroundVideo} height={50} width={80} muted className="rounded" style={{ objectFit: 'cover' }} />
                      </td>
                      <td>{item.title}</td>
                      <td>
                        <Badge bg="info">{item.features?.length || 0} features</Badge>
                      </td>
                      <td>{item.createdAt}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <ViewAdvertise advertisement={item} />
                          <EditAdvertise advertisement={item} />

                          <button type="button" className="btn btn-sm btn-soft-danger" disabled={isDeleting} onClick={() => handleDelete(item._id)}>
                            <IconifyIcon icon="solar:trash-bin-trash-bold-duotone" className="me-1" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default Advertise
