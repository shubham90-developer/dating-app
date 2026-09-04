import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import Onboarding from './components/Interest'
import Interest from './components/Interest'

export const metadata: Metadata = { title: 'Splash Screen' }

const InterestPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Interest />
        </Col>
      </Row>
    </>
  )
}

export default InterestPage
