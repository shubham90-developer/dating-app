'use client'

import React, { useState } from 'react'
import { Card, CardTitle } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Spinner from '@/components/Spinner'
import { useGetAllGendersQuery, useCreateGenderMutation, useUpdateGenderMutation, useDeleteGenderMutation, IGender } from '@/Redux/api/genderApi'

const Gender = () => {
  const { data, isLoading } = useGetAllGendersQuery()
  const [createGender, { isLoading: isCreating }] = useCreateGenderMutation()
  const [updateGender, { isLoading: isUpdating }] = useUpdateGenderMutation()
  const [deleteGender] = useDeleteGenderMutation()

  // Drawer state — shared for both Add and Edit
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [genderValue, setGenderValue] = useState('')

  const openAdd = () => {
    setEditingId(null)
    setGenderValue('')
    setOpen(true)
  }

  const openEdit = (item: IGender) => {
    setEditingId(item._id)
    setGenderValue(item.gender)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!genderValue.trim()) {
      alert('Please enter a gender value')
      return
    }

    try {
      if (editingId) {
        await updateGender({ id: editingId, gender: genderValue }).unwrap()
      } else {
        await createGender({ gender: genderValue }).unwrap()
      }
      setOpen(false)
      setEditingId(null)
      setGenderValue('')
    } catch (error) {
      console.error('Failed to save gender:', error)
      alert('Failed to save gender. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this gender option?')) return
    try {
      await deleteGender(id).unwrap()
    } catch (error) {
      console.error('Failed to delete gender:', error)
      alert('Failed to delete gender. Please try again.')
    }
  }

  return (
    <>
      <Card>
        <div className="d-flex card-header justify-content-between align-items-center">
          <CardTitle as="h4">Gender</CardTitle>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={openAdd}>
            <IconifyIcon icon="solar:add-circle-broken" />
            Add Gender
          </button>
        </div>

        <div className="table-responsive">
          {isLoading ? (
            <div className="p-4 text-center">
              <Spinner />
            </div>
          ) : (
            <table className="table align-middle mb-0 table-hover table-centered table-bordered">
              <thead className="bg-light-subtle">
                <tr>
                  <th>Gender</th>
                  <th>Created At</th>
                  <th style={{ width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.length ? (
                  data.data.map((item) => (
                    <tr key={item._id}>
                      <td>{item.gender}</td>
                      <td>{item.createdAt}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-soft-primary btn-sm" onClick={() => openEdit(item)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>
                          <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(item._id)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      No genders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER — used for both Add and Edit */}
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
          <h5 className="mb-0 fw-bold">{editingId ? 'Edit Gender' : 'Add Gender'}</h5>
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
            <label className="form-label">Gender</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Male, Female, Other"
              value={genderValue}
              onChange={(e) => setGenderValue(e.target.value)}
            />
          </div>

          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100" disabled={isCreating || isUpdating}>
              <IconifyIcon icon="solar:diskette-broken" />
              &nbsp; {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Gender
