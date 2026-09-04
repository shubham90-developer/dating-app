'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useUpdateAdvertisementMutation, IAdvertisement } from '@/Redux/api/advertisementApi'

interface FeatureDraft {
  existingIcon: string
  iconFile: File | null
  title: string
  description: string
}

const EditAdvertise = ({ advertisement }: { advertisement: IAdvertisement }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(advertisement.title)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [features, setFeatures] = useState<FeatureDraft[]>(
    advertisement.features.map((f) => ({ existingIcon: f.icon, iconFile: null, title: f.title, description: f.description })),
  )

  const [updateAdvertisement, { isLoading }] = useUpdateAdvertisementMutation()

  const handleOpen = () => {
    setTitle(advertisement.title)
    setVideoFile(null)
    setFeatures(advertisement.features.map((f) => ({ existingIcon: f.icon, iconFile: null, title: f.title, description: f.description })))
    setOpen(true)
  }

  const updateFeature = (index: number, patch: Partial<FeatureDraft>) => {
    setFeatures((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  const addFeatureRow = () => setFeatures((prev) => [...prev, { existingIcon: '', iconFile: null, title: '', description: '' }])

  const removeFeatureRow = (index: number) => setFeatures((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('title', title)
      if (videoFile) formData.append('backgroundVideo', videoFile)

      features.forEach((f) => {
        if (f.iconFile) formData.append('featureIcons', f.iconFile)
      })

      const featuresPayload = features.map((f) => ({
        icon: f.iconFile?.name || f.existingIcon,
        title: f.title,
        description: f.description,
      }))
      formData.append('features', JSON.stringify(featuresPayload))

      await updateAdvertisement({ id: advertisement._id, formData }).unwrap()

      setOpen(false)
    } catch (error) {
      console.error('Failed to update advertisement:', error)
      alert('Failed to update advertisement. Please try again.')
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
          width: '560px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
          overflowY: 'auto',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Advertise</h5>
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
            <label className="form-label">Background Video</label>
            <input type="file" accept="video/*" className="form-control" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            <video src={advertisement.backgroundVideo} height={60} muted className="mt-2 rounded d-block" />
          </div>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <hr />

          {features.map((feature, index) => (
            <div key={index} className="mb-3 border rounded p-3 position-relative">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Feature {index + 1}</h6>
                {features.length > 1 && (
                  <button type="button" className="btn btn-sm btn-soft-danger" onClick={() => removeFeatureRow(index)}>
                    <IconifyIcon icon="solar:trash-bin-trash-bold-duotone" />
                  </button>
                )}
              </div>

              <div className="mb-2">
                <label className="form-label">Icon</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => updateFeature(index, { iconFile: e.target.files?.[0] || null })}
                />
                {feature.existingIcon && !feature.iconFile && (
                  <img src={feature.existingIcon} alt={feature.title} height={32} className="mt-2 rounded" />
                )}
              </div>

              <div className="mb-2">
                <label className="form-label">Feature Title</label>
                <input type="text" className="form-control" value={feature.title} onChange={(e) => updateFeature(index, { title: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Feature Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={feature.description}
                  onChange={(e) => updateFeature(index, { description: e.target.value })}
                />
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-soft-primary w-100 mb-3" onClick={addFeatureRow}>
            <IconifyIcon icon="solar:add-circle-broken" className="me-1" />
            Add Another Feature
          </button>

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

export default EditAdvertise
