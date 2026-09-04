import React from 'react'
import GeneralSettings from './components/GeneralSettings'

import PageTItle from '@/components/PageTItle'
import Link from 'next/link'

const SettingsPage = () => {
  return (
    <>
      <PageTItle title="SETTINGS" />
      <GeneralSettings />
    </>
  )
}

export default SettingsPage
