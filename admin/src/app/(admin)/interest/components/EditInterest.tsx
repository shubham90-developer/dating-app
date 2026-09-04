'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useUpdateInterestMutation, IInterest } from '@/Redux/api/interestApi'

const EditInterest = ({ interest }: { interest: IInterest }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(interest.title)
  const [iconFile, setIconFile] = useState<File | null>(null)

  const [updateInterest, { isLoading }] = useUpdateInterestMutation()

  const handleOpen = () => {
    setTitle(interest.title)
    setIconFile(null)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('title', title)
      if (iconFile) formData.append('icon', iconFile)

      await updateInterest({ id: interest._id, formData }).unwrap()

      setOpen(false)
    } catch (error) {
      console.error('Failed to update interest:', error)
      alert('Failed to update interest. Please try again.')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-sm btn-soft-info" onClick={handleOpen}>
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '520px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
        }}>
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold"> Edit Intrest </h5>

          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* BODY */}
        <form className="p-3" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* image */}
          <div className="mb-3">
            <label className="form-label">Icon</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
            {interest.icon && !iconFile && <img src={interest.icon} alt={interest.title} height={40} className="mt-2 rounded" />}
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              &nbsp; {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditInterest
