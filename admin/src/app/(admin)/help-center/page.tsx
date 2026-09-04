import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import HelpCenter from './components/HelpCenter'

export const metadata: Metadata = { title: 'Splash Screen' }

const HelpCenterPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <HelpCenter />
        </Col>
      </Row>
    </>
  )
}

export default HelpCenterPage
