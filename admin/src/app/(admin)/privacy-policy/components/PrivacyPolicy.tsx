'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardBody, CardTitle, Col, Row, Spinner } from 'react-bootstrap'
import { useGetAllPrivacyPolicyQuery, useCreatePrivacyPolicyMutation, useUpdatePrivacyPolicyMutation } from '@/Redux/api/privacyPolicy'

import 'react-quill/dist/quill.snow.css'

// FIX SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

const PrivacyPolicy = () => {
  const { data, isLoading } = useGetAllPrivacyPolicyQuery()
  const existing = data?.data?.[0]

  const [createPrivacyPolicy, { isLoading: isCreating }] = useCreatePrivacyPolicyMutation()
  const [updatePrivacyPolicy, { isLoading: isUpdating }] = useUpdatePrivacyPolicyMutation()

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
        await updatePrivacyPolicy({ id: existing._id, body: payload }).unwrap()
      } else {
        await createPrivacyPolicy(payload).unwrap()
      }

      alert('Privacy policy saved successfully')
    } catch (error) {
      console.error('Failed to save privacy policy:', error)
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
              Privacy Policy
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
                  <input type="text" className="form-control" placeholder="Privacy Policy" value={title} onChange={(e) => setTitle(e.target.value)} />
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

export default PrivacyPolicy
