'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useAdminCreateProfileMutation } from '@/Redux/api/profileApis'
import { useGetAllGendersQuery } from '@/Redux/api/genderApi'
import { useGetAllPositionsQuery } from '@/Redux/api/positionApi'
import { useGetAllSexualOrientationsQuery } from '@/Redux/api/sexualOrientationApi'
import { useGetAllInterestsQuery } from '@/Redux/api/interestApi'
import { useGetAllSubscriptionsQuery } from '@/Redux/api/subscriptionApi'
import usePhoneAuth from '@/app/(admin)/hooks/usePhoneAuth'
import { useNotificationContext } from '@/context/useNotificationContext'

const initialForm = {
  firstName: '',
  lastName: '',
  nickName: '',
  birthday: '',
  bio: '',
  height: '',
  weight: '',
  position: '',
  gender: '',
  sexOrientation: '',
  looking: '',
  interest: '',
  subscriptionPlanId: '',
  placeToMeet: false,
}

const AddProfile = () => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [photos, setPhotos] = useState<FileList | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const [document, setDocument] = useState<File | null>(null)

  const { sendOtp, verifyOtp, confirmation, firebaseToken, loading: otpLoading, error: otpError } = usePhoneAuth()
  const { showNotification } = useNotificationContext()

  const { data: genders } = useGetAllGendersQuery()
  const { data: positions } = useGetAllPositionsQuery()
  const { data: orientations } = useGetAllSexualOrientationsQuery()
  const { data: interests } = useGetAllInterestsQuery()
  const { data: plans } = useGetAllSubscriptionsQuery()

  const [adminCreateProfile, { isLoading }] = useAdminCreateProfileMutation()

  const resetForm = () => {
    setForm(initialForm)
    setPhone('')
    setOtp('')
    setPhotos(null)
    setSelfie(null)
    setDocument(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firebaseToken) {
      showNotification({ message: 'Please verify the phone number first', variant: 'warning' })
      return
    }
    if (!form.subscriptionPlanId) {
      showNotification({ message: 'Please select a subscription plan', variant: 'warning' })
      return
    }
    if (!photos || photos.length === 0) {
      showNotification({ message: 'At least one photo is required', variant: 'warning' })
      return
    }

    try {
      const formData = new FormData()
      formData.append('firebaseToken', firebaseToken)
      formData.append('subscriptionPlanId', form.subscriptionPlanId)
      formData.append('firstName', form.firstName)
      formData.append('lastName', form.lastName)
      formData.append('nickName', form.nickName)
      formData.append('birthday', form.birthday)
      formData.append('placeToMeet', String(form.placeToMeet))
      formData.append('position', form.position)
      formData.append('gender', form.gender)
      formData.append('sexOrientation', form.sexOrientation)
      formData.append('looking', form.looking)
      formData.append('interest', form.interest)
      formData.append('bio', form.bio)
      formData.append('height', form.height)
      formData.append('weight', form.weight)
      // NOTE: replace with a real map/geocode picker if you have one — placeholder default here
      formData.append('location', JSON.stringify({ type: 'Point', coordinates: [73.8567, 18.5204] }))

      Array.from(photos).forEach((file) => formData.append('photos', file))
      if (selfie) formData.append('selfie', selfie)
      if (document) formData.append('document', document)

      await adminCreateProfile(formData).unwrap()

      showNotification({ message: 'Profile created successfully', variant: 'success' })
      resetForm()
      setOpen(false)
    } catch (error: any) {
      console.error('Failed to create profile:', error)
      showNotification({
        message: error?.data?.message || 'Failed to create profile. Please check all fields and try again.',
        variant: 'danger',
      })
    }
  }

  return (
    <>
      <button className="btn btn-primary d-flex align-items-center gap-2" style={{ height: 38 }} onClick={() => setOpen(true)}>
        <IconifyIcon icon="solar:add-circle-bold-duotone" />
        Add Profile
      </button>

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg overflow-auto"
        style={{ width: '560px', maxWidth: '100%', zIndex: 1050, transform: open ? 'translateX(0)' : 'translateX(100%)', transition: '0.3s ease' }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Add Profile</h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <form className="p-3" onSubmit={handleSubmit}>
          {/* Phone + OTP */}
          <div id="recaptcha-container" />
          <div className="mb-3 border rounded p-3">
            <label className="form-label fw-bold">Phone Verification</label>
            <div className="d-flex gap-2 mb-2">
              <input
                type="tel"
                className="form-control"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!!firebaseToken}
              />
              <button type="button" className="btn btn-outline-primary" onClick={() => sendOtp(phone)} disabled={otpLoading || !!firebaseToken}>
                Send OTP
              </button>
            </div>
            {confirmation && !firebaseToken && (
              <div className="d-flex gap-2">
                <input type="text" className="form-control" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <button type="button" className="btn btn-outline-success" onClick={() => verifyOtp(otp)} disabled={otpLoading}>
                  Verify
                </button>
              </div>
            )}
            {firebaseToken && <div className="text-success mt-2">✓ Phone verified</div>}
            {otpError && <div className="text-danger mt-2">{otpError}</div>}
          </div>

          {/* Subscription plan */}
          <div className="mb-3">
            <label className="form-label">Subscription Plan</label>
            <select
              className="form-select"
              value={form.subscriptionPlanId}
              onChange={(e) => setForm({ ...form, subscriptionPlanId: e.target.value })}>
              <option value="">Select Plan</option>
              {plans?.data.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.planName}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">First Name</label>
              <input className="form-control" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Last Name</label>
              <input className="form-control" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Nickname</label>
              <input className="form-control" value={form.nickName} onChange={(e) => setForm({ ...form, nickName: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Birthday</label>
              <input type="date" className="form-control" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">Gender</label>
              <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select</option>
                {genders?.data.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.gender}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Position</label>
              <select className="form-select" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>
                <option value="">Select</option>
                {positions?.data.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Sexual Orientation</label>
              <select className="form-select" value={form.sexOrientation} onChange={(e) => setForm({ ...form, sexOrientation: e.target.value })}>
                <option value="">Select</option>
                {orientations?.data.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label">Looking For</label>
              <select className="form-select" value={form.looking} onChange={(e) => setForm({ ...form, looking: e.target.value })}>
                <option value="">Select</option>
                {interests?.data.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Interests (free text)</label>
            <input
              className="form-control"
              placeholder="Hiking, Movies"
              value={form.interest}
              onChange={(e) => setForm({ ...form, interest: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Bio</label>
            <textarea className="form-control" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label">Height</label>
              <input className="form-control" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
            </div>
            <div className="col-6">
              <label className="form-label">Weight</label>
              <input className="form-control" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="placeToMeet"
              checked={form.placeToMeet}
              onChange={(e) => setForm({ ...form, placeToMeet: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="placeToMeet">
              Open to meeting in person
            </label>
          </div>

          <div className="mb-3">
            <label className="form-label">Photos (up to 6, at least 1 required)</label>
            <input type="file" accept="image/*" multiple className="form-control" onChange={(e) => setPhotos(e.target.files)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Selfie (verification)</label>
            <input type="file" accept="image/*" className="form-control" onChange={(e) => setSelfie(e.target.files?.[0] || null)} />
          </div>
          <div className="mb-3">
            <label className="form-label">ID Document (verification)</label>
            <input type="file" className="form-control" onChange={(e) => setDocument(e.target.files?.[0] || null)} />
          </div>

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              &nbsp; {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddProfile
