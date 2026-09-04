import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import Faq from './components/Faq'

export const metadata: Metadata = { title: 'Faqs' }

const FaqPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Faq />
        </Col>
      </Row>
    </>
  )
}

export default FaqPage
