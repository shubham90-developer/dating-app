'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateAdvertisementMutation } from '@/Redux/api/advertisementApi'

interface FeatureDraft {
  iconFile: File | null
  title: string
  description: string
}

const emptyFeature = (): FeatureDraft => ({ iconFile: null, title: '', description: '' })

const AddAdvertise = () => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [features, setFeatures] = useState<FeatureDraft[]>([emptyFeature()])

  const [createAdvertisement, { isLoading }] = useCreateAdvertisementMutation()

  const resetForm = () => {
    setTitle('')
    setVideoFile(null)
    setFeatures([emptyFeature()])
  }

  const updateFeature = (index: number, patch: Partial<FeatureDraft>) => {
    setFeatures((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  const addFeatureRow = () => setFeatures((prev) => [...prev, emptyFeature()])

  const removeFeatureRow = (index: number) => setFeatures((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !videoFile) {
      alert('Please fill title and select a background video')
      return
    }

    const incompleteFeature = features.some((f) => !f.title || !f.description)
    if (incompleteFeature) {
      alert('Please fill title and description for every feature (or remove empty rows)')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('backgroundVideo', videoFile)

      features.forEach((f) => {
        if (f.iconFile) formData.append('featureIcons', f.iconFile)
      })

      // Backend expects 'features' as a JSON string array of { icon, title, description }.
      // 'icon' here is the uploaded file's original name so it can be matched server-side;
      // adjust this mapping if your backend links icons differently.
      const featuresPayload = features.map((f) => ({
        icon: f.iconFile?.name || '',
        title: f.title,
        description: f.description,
      }))
      formData.append('features', JSON.stringify(featuresPayload))

      await createAdvertisement(formData).unwrap()

      resetForm()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create advertisement:', error)
      alert('Failed to add advertisement. Please try again.')
    }
  }

  return (
    <>
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Advertise
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
          <h5 className="mb-0 fw-bold">Add Advertise</h5>
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
          </div>

          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Upgrade Your Dating Experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
              </div>

              <div className="mb-2">
                <label className="form-label">Feature Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Unlimited Messages"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, { title: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Feature Description</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="This is how it will appear on your profile."
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
              &nbsp; {isLoading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddAdvertise
