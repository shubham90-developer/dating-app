'use client'

import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'
import React from 'react'
import { Card, CardBody, CardHeader, Table, Spinner } from 'react-bootstrap'
import AddOnBoarding from './AddOnBoarding'
import EditOnBoarding from './EditOnboarding'
import { useGetAllOnboardingQuery, useDeleteOnboardingMutation } from '@/Redux/api/onboardingApi'

const Onboarding = () => {
  const { data, isLoading } = useGetAllOnboardingQuery()
  const [deleteOnboarding, { isLoading: isDeleting }] = useDeleteOnboardingMutation()

  const list = data?.data || []

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this onboarding screen?')) return
    try {
      await deleteOnboarding(id).unwrap()
    } catch (error) {
      console.error('Failed to delete onboarding:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader as={'h5'} className=" text-uppercase fw-bold">
          <div className="d-flex align-items-center justify-content-between gap-2">
            Onboarding List
            <AddOnBoarding />
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
                  <th>Image</th>
                  <th>Title</th>
                  <th>Sub-Title</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No onboarding screens found
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>
                        <Image src={item.img} height={36} width={36} className="rounded-circle" alt={item.title} />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.subTitle}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <EditOnBoarding onboarding={item} />

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

export default Onboarding
