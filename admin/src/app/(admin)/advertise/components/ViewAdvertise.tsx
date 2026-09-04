'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { IAdvertisement } from '@/Redux/api/advertisementApi'

const ViewAdvertise = ({ advertisement }: { advertisement: IAdvertisement }) => {
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
          width: '560px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
          overflowY: 'auto',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">View Advertise</h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="p-3">
          <video src={advertisement.backgroundVideo} controls className="w-100 rounded mb-3" style={{ maxHeight: 220, objectFit: 'cover' }} />

          <h5 className="fw-bold">{advertisement.title}</h5>
          <p className="text-muted small mb-3">
            Created: {advertisement.createdAt} &nbsp;|&nbsp; Updated: {advertisement.updatedAt}
          </p>

          <hr />

          <h6 className="fw-bold mb-3">Features ({advertisement.features?.length || 0})</h6>

          {advertisement.features?.length ? (
            advertisement.features.map((feature, index) => (
              <div key={index} className="d-flex gap-3 align-items-start mb-3 border-bottom pb-3">
                {feature.icon && <img src={feature.icon} alt={feature.title} height={36} width={36} className="rounded" />}
                <div>
                  <div className="fw-semibold">{feature.title}</div>
                  <div className="text-muted small">{feature.description}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No features added</p>
          )}
        </div>
      </div>
    </>
  )
}

export default ViewAdvertise
