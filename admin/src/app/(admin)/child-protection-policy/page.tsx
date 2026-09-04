import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import ChildPolicy from './components/ChildPolicy'

export const metadata: Metadata = { title: 'Child Protection Policy' }

const ChildPolicyPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <ChildPolicy />
        </Col>
      </Row>
    </>
  )
}

export default ChildPolicyPage
