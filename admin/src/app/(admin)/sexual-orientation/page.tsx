import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'
import SexualOrientation from './components/SexualOrientation'

export const metadata: Metadata = { title: 'Sexual Orientation' }

const SexualOrientationPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <SexualOrientation />
        </Col>
      </Row>
    </>
  )
}

export default SexualOrientationPage
