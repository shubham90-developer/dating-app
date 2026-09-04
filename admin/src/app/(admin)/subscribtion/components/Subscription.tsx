'use client'

import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Spinner } from 'react-bootstrap'
import { useGetAllSubscriptionsQuery, useCreateSubscriptionMutation, useUpdateSubscriptionMutation } from '@/Redux/api/subscriptionApi'

const Subscription = () => {
  const { data, isLoading } = useGetAllSubscriptionsQuery()
  const existing = data?.data?.[0]

  const [createSubscription, { isLoading: isCreating }] = useCreateSubscriptionMutation()
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation()

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [mainTitle, setMainTitle] = useState('')
  const [highlightText, setHighlightText] = useState('')
  const [planName, setPlanName] = useState('')
  const [trialPrice, setTrialPrice] = useState('')
  const [trialText, setTrialText] = useState('')
  const [trialDuration, setTrialDuration] = useState('')
  const [priceAfterTrial, setPriceAfterTrial] = useState('')
  const [afterTrialText, setAfterTrialText] = useState('')
  const [appName, setAppName] = useState('')

  useEffect(() => {
    if (existing) {
      setMainTitle(existing.mainTitle || '')
      setHighlightText(existing.highlightText || '')
      setPlanName(existing.planName || '')
      setTrialPrice(existing.trialPrice || '')
      setTrialText(existing.trialText || '')
      setTrialDuration(existing.trialDuration || '')
      setPriceAfterTrial(existing.priceAfterTrial || '')
      setAfterTrialText(existing.afterTrialText || '')
      setAppName(existing.appName || '')
    }
  }, [existing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const formData = new FormData()
      formData.append('mainTitle', mainTitle)
      formData.append('highlightText', highlightText)
      formData.append('planName', planName)
      formData.append('trialPrice', trialPrice)
      formData.append('trialText', trialText)
      formData.append('trialDuration', trialDuration)
      formData.append('priceAfterTrial', priceAfterTrial)
      formData.append('afterTrialText', afterTrialText)
      formData.append('appName', appName)
      if (videoFile) formData.append('backgroundVideo', videoFile)

      if (existing?._id) {
        await updateSubscription({ id: existing._id, formData }).unwrap()
      } else {
        if (!videoFile) {
          alert('Please select a background video')
          return
        }
        await createSubscription(formData).unwrap()
      }

      alert('Subscription screen saved successfully')
    } catch (error) {
      console.error('Failed to save subscription:', error)
      alert('Failed to save. Please try again.')
    }
  }

  const isSaving = isCreating || isUpdating

  return (
    <>
      <Card>
        <CardHeader as={'h6'} className="text-dark text-uppercase fw-bold">
          Subscription
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" /> Loading...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Background Video */}
              <div className="mb-3">
                <label className="form-label">Background Video</label>
                <input type="file" accept="video/*" className="form-control" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                {existing?.backgroundVideo && !videoFile && (
                  <video src={existing.backgroundVideo} height={80} muted className="mt-2 rounded d-block" />
                )}
              </div>

              {/* Heading */}
              <div className="mb-3">
                <label className="form-label">Main Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Meet with 1000+ singles"
                  value={mainTitle}
                  onChange={(e) => setMainTitle(e.target.value)}
                />
              </div>

              {/* Highlight Text */}
              <div className="mb-3">
                <label className="form-label">Highlight Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="1000+ singles"
                  value={highlightText}
                  onChange={(e) => setHighlightText(e.target.value)}
                />
              </div>

              <hr />

              <h5>Plan Details</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Plan Name</label>
                  <input type="text" className="form-control" placeholder="1 Day" value={planName} onChange={(e) => setPlanName(e.target.value)} />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Trial Price (₹)</label>
                  <input type="number" className="form-control" placeholder="1" value={trialPrice} onChange={(e) => setTrialPrice(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Trial Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="trial for rupee"
                  value={trialText}
                  onChange={(e) => setTrialText(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Trial Duration</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="sign1"
                  value={trialDuration}
                  onChange={(e) => setTrialDuration(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Price After Trial (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="299"
                  value={priceAfterTrial}
                  onChange={(e) => setPriceAfterTrial(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">After Trial Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="after trial"
                  value={afterTrialText}
                  onChange={(e) => setAfterTrialText(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">App Name</label>
                <input type="text" className="form-control" placeholder="Dating Apk" value={appName} onChange={(e) => setAppName(e.target.value)} />
              </div>

              <hr />

              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                <Icon icon="solar:diskette-bold-duotone" className="me-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </form>
          )}
        </CardBody>
      </Card>
    </>
  )
}

export default Subscription
