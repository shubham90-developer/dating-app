import { Col, Row } from 'react-bootstrap'

import { Metadata } from 'next'
import Subscription from './components/Subscription'

export const metadata: Metadata = { title: 'Splash Screen' }

const SubscriptionPage = () => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Subscription />
        </Col>
      </Row>
    </>
  )
}

export default SubscriptionPage
