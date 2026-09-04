'use client'

import React, { useState } from 'react'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAllGendersQuery } from '@/Redux/api/genderApi'
import { useGetAllPositionsQuery } from '@/Redux/api/positionApi'
import { useGetAllSexualOrientationsQuery } from '@/Redux/api/sexualOrientationApi'
import { useGetAllInterestsQuery } from '@/Redux/api/interestApi'
import { useUpdateProfileMutation, IProfile } from '@/Redux/api/profileApis'
import { useNotificationContext } from '@/context/useNotificationContext'

const EditProfile = ({ profile, onClose }: { profile: IProfile; onClose: () => void }) => {
  const [form, setForm] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    nickName: profile.nickName || '',
    bio: profile.bio || '',
    height: profile.height || '',
    weight: profile.weight || '',
    position: profile.position?._id || '',
    gender: profile.gender?._id || '',
    sexOrientation: profile.sexOrientation?._id || '',
    looking: profile.looking?._id || '',
    interest: profile.interest || '',
  })
  const [photos, setPhotos] = useState<FileList | null>(null)

  const { data: genders } = useGetAllGendersQuery()
  const { data: positions } = useGetAllPositionsQuery()
  const { data: orientations } = useGetAllSexualOrientationsQuery()
  const { data: interests } = useGetAllInterestsQuery()
  const { showNotification } = useNotificationContext()

  const [updateProfile, { isLoading }] = useUpdateProfileMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('firstName', form.firstName)
      formData.append('lastName', form.lastName)
      formData.append('nickName', form.nickName)
      formData.append('bio', form.bio)
      formData.append('height', form.height)
      formData.append('weight', form.weight)
      formData.append('position', form.position)
      formData.append('gender', form.gender)
      formData.append('sexOrientation', form.sexOrientation)
      formData.append('looking', form.looking)
      formData.append('interest', form.interest)
      if (photos && photos.length > 0) {
        Array.from(photos).forEach((file) => formData.append('photos', file))
      }

      await updateProfile({ id: profile._id, formData }).unwrap()
      showNotification({ message: 'Profile updated successfully', variant: 'success' })
      onClose()
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      showNotification({
        message: error?.data?.message || 'Failed to update profile. Please try again.',
        variant: 'danger',
      })
    }
  }

  return (
    <>
      <div className="position-fixed top-0 start-0 w-100 h-100" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }} onClick={onClose} />

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg overflow-auto"
        style={{ width: '560px', maxWidth: '100%', zIndex: 1050, transform: 'translateX(0)', transition: '0.3s ease' }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Profile</h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="p-3" onSubmit={handleSubmit}>
          <div className="mb-3 text-muted">
            Phone: <strong>{profile.phone}</strong> (cannot be changed)
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
            <input className="form-control" value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })} />
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

          <div className="mb-3">
            <label className="form-label">Replace Photos (optional — leave empty to keep current)</label>
            <input type="file" accept="image/*" multiple className="form-control" onChange={(e) => setPhotos(e.target.files)} />
          </div>

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              &nbsp; {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditProfile
