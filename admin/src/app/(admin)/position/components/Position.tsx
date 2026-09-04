'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardHeader, Table, Spinner } from 'react-bootstrap'
import AddPosition from './AddPosition'
import EditPosition from './EditPosition'
import ViewPosition from './ViewPosition'
import { useGetAllPositionsQuery, useDeletePositionMutation } from '@/Redux/api/positionApi'

const Position = () => {
  const { data, isLoading } = useGetAllPositionsQuery()
  const [deletePosition, { isLoading: isDeleting }] = useDeletePositionMutation()

  const list = data?.data || []

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this position?')) return
    try {
      await deletePosition(id).unwrap()
    } catch (error) {
      console.error('Failed to delete position:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader as={'h5'} className="text-uppercase fw-bold">
          <div className="d-flex align-items-center justify-content-between gap-2">
            Position List
            <AddPosition />
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
                  <th>Title</th>
                  <th>Sub-Title</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No positions found
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.subTitle}</td>
                      <td>{item.createdAt}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <ViewPosition position={item} />
                          <EditPosition position={item} />

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

export default Position
