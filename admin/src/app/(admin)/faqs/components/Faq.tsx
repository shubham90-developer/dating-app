'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import React from 'react'
import { Card, CardBody, CardHeader, Table, Spinner } from 'react-bootstrap'
import EditFaq from './EditFaq'
import AddFaq from './AddFaq'
import { useGetAllFaqsQuery, useDeleteFaqMutation } from '@/Redux/api/faqApi'

const Faq = () => {
  const { data, isLoading } = useGetAllFaqsQuery()
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation()

  const list = data?.data || []

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this faq?')) return
    try {
      await deleteFaq(id).unwrap()
    } catch (error) {
      console.error('Failed to delete faq:', error)
      alert('Failed to delete. Please try again.')
    }
  }

  return (
    <>
      <Card>
        <CardHeader as={'h5'} className="text-uppercase fw-bold">
          <div className="d-flex align-items-center justify-content-between gap-2">
            Faq List
            <AddFaq />
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
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No faqs found
                    </td>
                  </tr>
                ) : (
                  list.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.qustion}</td>
                      <td>{item.answer}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <EditFaq faq={item} />
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

export default Faq
