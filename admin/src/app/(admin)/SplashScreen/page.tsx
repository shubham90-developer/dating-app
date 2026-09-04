import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import SplashScreen from './components/SplashScreen'
import LoginScreem from './components/LoginScreem'

export const metadata: Metadata = { title: 'Splash Screen' }

const DashboardPage = () => {
  return (
    <>
      <Row>
        <Col lg={6}>
          <SplashScreen />
        </Col>
        <Col lg={6}>
          <LoginScreem />
        </Col>
      </Row>
    </>
  )
}

export default DashboardPage
