'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardBody, CardTitle, Col, Row, Spinner } from 'react-bootstrap'
import { useGetAllTermsQuery, useCreateTermsMutation, useUpdateTermsMutation } from '@/Redux/api/termsApi'

// QUILL CSS
// @ts-ignore
import 'react-quill/dist/quill.snow.css'

// FIX SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

const TermsConditions = () => {
  const { data, isLoading } = useGetAllTermsQuery()
  const existing = data?.data?.[0]

  const [createTerms, { isLoading: isCreating }] = useCreateTermsMutation()
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsMutation()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (existing) {
      setTitle(existing.title || '')
      setContent(existing.content || '')
    }
  }, [existing])

  const handleSubmit = async () => {
    if (!title) {
      alert('Please enter a title')
      return
    }

    if (!content || content === '<p><br></p>') {
      alert('Please add some content before saving')
      return
    }

    try {
      const payload = { title, content }

      if (existing?._id) {
        await updateTerms({ id: existing._id, body: payload }).unwrap()
      } else {
        await createTerms(payload).unwrap()
      }

      alert('Terms & conditions saved successfully')
    } catch (error) {
      console.error('Failed to save terms:', error)
      alert('Failed to save. Please try again.')
    }
  }

  const isSaving = isCreating || isUpdating

  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* HEADER */}
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4" className="mb-0">
              Terms & Conditions
            </CardTitle>
          </div>

          {/* BODY */}
          <CardBody>
            {isLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" /> Loading...
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Terms & Conditions"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div style={{ height: '300px' }}>
                  <ReactQuill theme="snow" style={{ height: '250px' }} value={content} onChange={setContent} />
                </div>

                <div className="d-flex justify-content-end mt-5">
                  <button type="button" className="btn btn-primary" disabled={isSaving} onClick={handleSubmit}>
                    {isSaving ? 'Saving...' : existing ? 'Update' : 'Create'}
                  </button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default TermsConditions
