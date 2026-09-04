'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardBody, CardTitle, Col, Row, Spinner } from 'react-bootstrap'

// QUILL CSS
// @ts-ignore
import 'react-quill/dist/quill.snow.css'

// FIX SSR
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
})

const HelpCenter = () => {
  return (
    <Row>
      <Col xl={12}>
        <Card>
          {/* HEADER */}
          <div className="d-flex card-header justify-content-between align-items-center">
            <CardTitle as="h4" className="mb-0">
              Help Center
            </CardTitle>
          </div>

          {/* BODY */}
          <CardBody>
            <div style={{ height: '300px' }}>
              <ReactQuill theme="snow" style={{ height: '250px' }} />
            </div>

            <div className="d-flex justify-content-end mt-5">
              <button type="button" className="btn btn-primary">
                Create
              </button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default HelpCenter
