import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import CustomerAdd from './components/CustomerAdd'

export const metadata: Metadata = { title: 'Add Customer' }

const CustomerAddPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <CustomerAdd />
        </Col>
      </Row>
    </>
  )
}

export default CustomerAddPage
