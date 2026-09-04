import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import PrivacyPolicy from './components/PrivacyPolicy'

export const metadata: Metadata = { title: 'Privacy Policy' }

const PrivacyPolicyPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <PrivacyPolicy />
        </Col>
      </Row>
    </>
  )
}

export default PrivacyPolicyPage
