import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import Onboarding from './components/Onboarding'

export const metadata: Metadata = { title: 'Splash Screen' }

const DashboardPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Onboarding />
        </Col>
      </Row>
    </>
  )
}

export default DashboardPage
