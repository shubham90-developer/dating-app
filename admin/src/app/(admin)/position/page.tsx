import { Col, Row } from 'react-bootstrap'
import { Metadata } from 'next'
import Position from './components/Position'

export const metadata: Metadata = { title: 'Position' }

const PositionPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Position />
        </Col>
      </Row>
    </>
  )
}

export default PositionPage
