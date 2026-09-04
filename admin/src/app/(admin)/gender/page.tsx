import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'
import Gender from './gender'
export const metadata: Metadata = { title: 'Gender' }

const GenderPage = () => {
  return (
    <Row>
      <Col lg={12}>
        <Gender />
      </Col>
    </Row>
  )
}

export default GenderPage
