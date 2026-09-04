import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import TermsConditions from './components/TermsConditions'

export const metadata: Metadata = { title: 'Terms & Conditions' }

const TermsConditionsPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <TermsConditions />
        </Col>
      </Row>
    </>
  )
}

export default TermsConditionsPage
