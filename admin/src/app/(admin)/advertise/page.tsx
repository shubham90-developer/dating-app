import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import Advertise from './components/Advertise'

export const metadata: Metadata = { title: 'Splash Screen' }

const AdvertisePage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Advertise />
        </Col>
      </Row>
    </>
  )
}

export default AdvertisePage
