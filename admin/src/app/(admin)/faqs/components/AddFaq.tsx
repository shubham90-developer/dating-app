'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useCreateFaqMutation } from '@/Redux/api/faqApi'

const AddFaq = () => {
  const [open, setOpen] = useState(false)
  const [qustion, setQustion] = useState('')
  const [answer, setAnswer] = useState('')

  const [createFaq, { isLoading }] = useCreateFaqMutation()

  const resetForm = () => {
    setQustion('')
    setAnswer('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!qustion || !answer) {
      alert('Please fill question and answer')
      return
    }

    try {
      await createFaq({ qustion, answer }).unwrap()
      resetForm()
      setOpen(false)
    } catch (error) {
      console.error('Failed to create faq:', error)
      alert('Failed to add faq. Please try again.')
    }
  }

  return (
    <>
      <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-broken" />
        Add Faq
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
          <h5 className="mb-0 fw-bold">Add Faq</h5>
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
            <input
              type="text"
              className="form-control"
              placeholder="How do I reset my password?"
              value={qustion}
              onChange={(e) => setQustion(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Answer</label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Go to Settings > Account > Reset Password."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
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

export default AddFaq
