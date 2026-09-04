'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateOnboardingMutation } from '@/Redux/api/onboardingApi'

const AddOnBoarding = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const [createOnboarding, { isLoading }] = useCreateOnboardingMutation()

  const resetForm = () => {
    setTitle('')
    setSubTitle('')
    setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !subTitle || !file) {
      alert('Please fill title, sub-title and select an image')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('subTitle', subTitle)
      formData.append('img', file)

      await createOnboarding(formData).unwrap()

      resetForm()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create onboarding:', error)
      alert('Failed to add onboarding. Please try again.')
    }
  }

  return (
    <>
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Onboarding
      </button>

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '520px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"> Add Onboarding </h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <form className="p-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Sub-Title</label>
            <input type="text" className="form-control" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Image</label>
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              &nbsp; {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddOnBoarding
