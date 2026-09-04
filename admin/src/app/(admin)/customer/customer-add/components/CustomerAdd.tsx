'use client'

import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap'

const CustomerAdd = () => {
  return (
    <>
      <form>
        <Row>
          <Col lg={4}>
            <Card>
              <CardHeader as={'h6'} className="text-dark text-uppercase fw-bold">
                Add Profile Photos
              </CardHeader>
              <CardBody>
                <div>
                  <label htmlFor="" className="mb-2">
                    Profile Images
                  </label>
                  <input type="file" className="form-control" />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={8}>
            <Card>
              <CardHeader as={'h6'} className="text-dark text-uppercase fw-bold">
                Basic Details
              </CardHeader>
              <CardBody>
                <Row>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        First Name
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Last Name
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Nick Name
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Date Of Birth
                      </label>
                      <input type="date" className="form-control" />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Do you have place to meet?
                      </label>
                      <select name="" id="" className="form-select">
                        <option>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Select Your Position
                      </label>
                      <select name="" id="" className="form-select">
                        <option>Select</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="versatile">Versatile</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Select Gender
                      </label>
                      <select name="" id="" className="form-select">
                        <option>Select</option>
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Select Sexual Opetaions
                      </label>
                      <select className="form-select">
                        <option value="">Select Sexual Orientation</option>
                        <option value="straight">Straight</option>
                        <option value="gay">Gay</option>
                        <option value="lesbian">Lesbian</option>
                        <option value="bisexual">Bisexual</option>
                        <option value="demisexual">Demisexual</option>
                        <option value="pansexual">Pansexual</option>
                        <option value="queer">Queer</option>
                        <option value="questioning">Questioning</option>
                      </select>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Intrest
                      </label>
                      <select className="form-select">
                        <option value="">Select Sexual Orientation</option>
                        <option value="straight">Straight</option>
                        <option value="gay">Gay</option>
                        <option value="lesbian">Lesbian</option>
                        <option value="bisexual">Bisexual</option>
                        <option value="demisexual">Demisexual</option>
                        <option value="pansexual">Pansexual</option>
                        <option value="queer">Queer</option>
                        <option value="questioning">Questioning</option>
                      </select>
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="mb-3">
                      <label htmlFor="" className="mb-2">
                        Bio
                      </label>
                      <textarea name="" id="" cols={30} rows={3} className="form-control"></textarea>
                    </div>
                  </Col>

                  <Col lg={12}>
                    <div className="text-end">
                      <button type="submit" className="btn btn-primary">
                        Submit
                      </button>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </form>
    </>
  )
}

export default CustomerAdd
