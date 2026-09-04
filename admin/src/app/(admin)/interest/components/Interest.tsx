'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import React from 'react'
import { Card, CardBody, CardHeader, Table, Spinner } from 'react-bootstrap'
import AddInterest from './AddInterest'
import EditInterest from './EditInterest'
import { useGetAllInterestsQuery, useDeleteInterestMutation } from '@/Redux/api/interestApi'

const Interest = () => {
  const { data, isLoading } = useGetAllInterestsQuery()
  const [deleteInterest, { isLoading: isDeleting }] = useDeleteInterestMutation()

  const list = data?.data || []

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this interest?')) return
    try {
      await deleteInterest(id).unwrap()
    } catch (error) {
      console.error('Failed to delete interest:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader as={'h5'} className=" text-uppercase fw-bold">
          <div className="d-flex align-items-center justify-content-between gap-2">
            Interest List
            <AddInterest />
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
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No interests found
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        {item.icon ? (
                          <Image src={item.icon} height={36} width={36} className="rounded-circle" alt={item.title} />
                        ) : (
                          <Image src="/assets/images/users/avatar-1.jpg" height={36} width={36} className="rounded-circle" alt="profile" />
                        )}
                      </td>
                      <td>{item.title}</td>

                      <td>
                        <div className="d-flex gap-2">
                          <EditInterest interest={item} />

                          <button type="button" className="btn btn-sm btn-soft-danger" disabled={isDeleting} onClick={() => handleDelete(item._id)}>
                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="me-1" />
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

export default Interest
