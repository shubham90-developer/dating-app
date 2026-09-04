'use client'

import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { useGetAllSplashScreensQuery, useCreateSplashScreenMutation, useUpdateSplashScreenMutation } from '@/Redux/api/splashScreenApi'

const SplashScreen = () => {
  const { data, isLoading } = useGetAllSplashScreensQuery()
  const [createSplashScreen, { isLoading: isCreating }] = useCreateSplashScreenMutation()
  const [updateSplashScreen, { isLoading: isUpdating }] = useUpdateSplashScreenMutation()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const existing = data?.data?.[0] // treat first record as the current splash screen

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null
    setFile(selected)
    setPreview(selected ? URL.createObjectURL(selected) : null)
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file && !existing) {
      alert('Please select an image')
      return
    }

    try {
      const formData = new FormData()
      if (file) formData.append('splashImg', file)

      if (existing) {
        await updateSplashScreen({ id: existing._id, formData }).unwrap()
      } else {
        await createSplashScreen(formData).unwrap()
      }
      setFile(null)
      setPreview(null)
    } catch (error) {
      console.error('Failed to save splash screen:', error)
    }
  }

  const imageToShow = preview || existing?.splashImg

  return (
    <>
      <Card>
        <CardHeader as={'h6'} className="text-dark text-uppercase fw-bold">
          Splash Screen
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="" className="mb-2">
                Splash Image
              </label>
              <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
            </div>
            {imageToShow && (
              <div className="mt-3">
                <img src={imageToShow} alt="Splash screen preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
              </div>
            )}
            <button type="submit" className="btn btn-primary mt-3" disabled={isCreating || isUpdating || isLoading}>
              <Icon icon="solar:diskette-bold-duotone" className="me-2" />
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </button>
          </form>
        </CardBody>
      </Card>
    </>
  )
}

export default SplashScreen
