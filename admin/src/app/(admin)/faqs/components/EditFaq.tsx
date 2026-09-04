'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useUpdateFaqMutation, IFaq } from '@/Redux/api/faqApi'

const EditFaq = ({ faq }: { faq: IFaq }) => {
  const [open, setOpen] = useState(false)
  const [qustion, setQustion] = useState(faq.qustion)
  const [answer, setAnswer] = useState(faq.answer)

  const [updateFaq, { isLoading }] = useUpdateFaqMutation()

  const handleOpen = () => {
    setQustion(faq.qustion)
    setAnswer(faq.answer)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateFaq({ id: faq._id, body: { qustion, answer } }).unwrap()
      setOpen(false)
    } catch (error) {
      console.error('Failed to update faq:', error)
      alert('Failed to update faq. Please try again.')
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
          width: '520px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: '0.3s ease',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Faq</h5>
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
            <label className="form-label">Question</label>
            <input type="text" className="form-control" value={qustion} onChange={(e) => setQustion(e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="form-label">Answer</label>
            <textarea rows={3} className="form-control" value={answer} onChange={(e) => setAnswer(e.target.value)} />
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

export default EditFaq
