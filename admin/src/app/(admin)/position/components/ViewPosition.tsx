'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { IPosition } from '@/Redux/api/positionApi'

const ViewPosition = ({ position }: { position: IPosition }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className="btn btn-sm btn-soft-secondary" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:eye-broken" />
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
          width: '480px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">View Position</h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="p-3">
          <h5 className="fw-bold">{position.title}</h5>
          <p className="text-muted">{position.subTitle}</p>

          <hr />
          <p className="text-muted small mb-0">
            Created: {position.createdAt} &nbsp;|&nbsp; Updated: {position.updatedAt}
          </p>
        </div>
      </div>
    </>
  )
}

export default ViewPosition
