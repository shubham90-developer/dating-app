'use client'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { ApexOptions } from 'apexcharts'
import Link from 'next/link'
import ReactApexChart from 'react-apexcharts'
import { Card, CardBody, CardFooter, CardTitle, Col, Row } from 'react-bootstrap'
import { useGetDashboardStatsQuery } from '@/Redux/api/profileApis'
import { StatType } from '../types'

const StatsCard = ({ amount, icon, name }: Partial<StatType>) => {
  return (
    <Col md={6}>
      <Card className="overflow-hidden">
        <CardBody>
          <Row>
            <Col xs={6}>
              <div className="avatar-md bg-soft-primary rounded  flex-centered">
                <IconifyIcon icon={icon!} className=" fs-24 text-primary" />
              </div>
            </Col>
            <Col xs={6} className="text-end">
              <p className="text-muted mb-0 text-truncate">{name}</p>
              <h3 className="text-dark mt-1 mb-0">{amount}</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  )
}

const Stats = () => {
  const { data } = useGetDashboardStatsQuery()
  const stats = data?.data

  const cards = [
    {
      icon: 'solar:user-plus-rounded-bold-duotone',
      name: 'Today Users',
      amount: (stats?.todayUsers ?? 0).toLocaleString(),
    },
    {
      icon: 'solar:users-group-rounded-bold-duotone',
      name: 'Total Users',
      amount: (stats?.totalUsers ?? 0).toLocaleString(),
    },
    {
      icon: 'solar:verified-check-bold-duotone',
      name: 'Verified Users',
      amount: (stats?.verifiedUsers ?? 0).toLocaleString(),
    },
    {
      icon: 'solar:user-block-bold-duotone',
      name: 'Blocked Users',
      amount: (stats?.blockedUsers ?? 0).toLocaleString(),
    },
    {
      icon: 'solar:wallet-money-bold-duotone',
      name: 'Today Revenue',
      amount: `₹${(stats?.todayRevenue ?? 0).toLocaleString()}`,
    },
    {
      icon: 'solar:card-bold-duotone',
      name: 'Total Revenue',
      amount: `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
    },
  ]

  const chartOptions: ApexOptions = {
    series: [
      {
        name: 'Page Views',
        type: 'bar',
        data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
      },
      {
        name: 'Clicks',
        type: 'area',
        data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
      },
    ],
    chart: {
      height: 313,
      type: 'line',
      toolbar: {
        show: false,
      },
    },
    stroke: {
      dashArray: [0, 0],
      width: [0, 2],
      curve: 'smooth',
    },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: {
        type: 'vertical',
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90],
      },
    },
    markers: {
      size: [0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: 'center',
      offsetX: 0,
      offsetY: 5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        barHeight: '70%',
        borderRadius: 3,
      },
    },
    colors: ['#ff6c2f', '#22c55e'],
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
        {
          formatter: function (y) {
            if (typeof y !== 'undefined') {
              return y.toFixed(1) + 'k'
            }
            return y
          },
        },
      ],
    },
  }

  return (
    <>
      <Col xxl={12}>
        <Row>
          <Col xs={12}>
            <div className="alert alert-primary text-truncate mb-3" role="alert">
              👋 Welcome to Dashboard{' '}
            </div>
          </Col>
          {cards.map((item, idx) => (
            <StatsCard key={idx} {...item} />
          ))}
        </Row>
      </Col>
      {/* <Col xxl={7}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <CardTitle as={'h4'}>Performance</CardTitle>
              <div>
                <button type="button" className="btn btn-sm btn-outline-light">
                  ALL
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  1M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light">
                  6M
                </button>
                &nbsp;
                <button type="button" className="btn btn-sm btn-outline-light active">
                  1Y
                </button>
              </div>
            </div>
            <div dir="ltr">
              <div id="dash-performance-chart" className="apex-charts" />
              <ReactApexChart options={chartOptions} series={chartOptions.series} height={313} type="line" className="apex-charts" />
            </div>
          </CardBody>
        </Card>
      </Col> */}
    </>
  )
}

export default Stats
