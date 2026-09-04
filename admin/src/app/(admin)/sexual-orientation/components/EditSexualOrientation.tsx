'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useUpdateSexualOrientationMutation, ISexualOrientation } from '@/Redux/api/sexualOrientationApi'

const EditSexualOrientation = ({ sexualOrientation }: { sexualOrientation: ISexualOrientation }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(sexualOrientation.title)

  const [updateSexualOrientation, { isLoading }] = useUpdateSexualOrientationMutation()

  const handleOpen = () => {
    setTitle(sexualOrientation.title)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateSexualOrientation({ id: sexualOrientation._id, body: { title } }).unwrap()
      setOpen(false)
    } catch (error) {
      console.error('Failed to update sexual orientation:', error)
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <>
      <button type="button" className="btn btn-sm btn-soft-info" onClick={handleOpen}>
        <IconifyIcon icon="solar:pen-2-broken" />
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
          width: '420px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Sexual Orientation</h5>
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

export default EditSexualOrientation
