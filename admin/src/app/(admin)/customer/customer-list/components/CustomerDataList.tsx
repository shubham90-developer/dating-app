'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card, CardTitle, Col, Row } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Spinner from '@/components/Spinner'
import {
  useGetAllProfilesQuery,
  useDeleteProfileMutation,
  useVerifyProfileMutation,
  useUnverifyProfileMutation,
  useAdminBlockProfileMutation,
  useAdminUnblockProfileMutation,
} from '@/Redux/api/profileApis'
import { useNotificationContext } from '@/context/useNotificationContext'
import AddProfile from './AddProfile'
import EditProfile from './EditProfile'

const Profile = () => {
  const [page, setPage] = useState(1)
  const limit = 20

  const { data, isLoading, isFetching } = useGetAllProfilesQuery({ page, limit })
  const [deleteProfile] = useDeleteProfileMutation()
  const [verifyProfile] = useVerifyProfileMutation()
  const [unverifyProfile] = useUnverifyProfileMutation()
  const [adminBlockProfile] = useAdminBlockProfileMutation()
  const [adminUnblockProfile] = useAdminUnblockProfileMutation()
  const { showNotification } = useNotificationContext()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [editId, setEditId] = useState<string | null>(null)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this profile? This cannot be undone.')) return
    try {
      await deleteProfile(id).unwrap()
      showNotification({ message: 'Profile deleted successfully', variant: 'success' })
    } catch (error: any) {
      showNotification({ message: error?.data?.message || 'Failed to delete profile. Please try again.', variant: 'danger' })
    }
  }

  const handleToggleVerify = async (id: string, isVerified: boolean) => {
    try {
      isVerified ? await unverifyProfile(id).unwrap() : await verifyProfile(id).unwrap()
      showNotification({ message: `Profile ${isVerified ? 'unverified' : 'verified'} successfully`, variant: 'success' })
    } catch (error: any) {
      showNotification({ message: error?.data?.message || 'Failed to update verification. Please try again.', variant: 'danger' })
    }
  }

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    try {
      isBlocked ? await adminUnblockProfile(id).unwrap() : await adminBlockProfile(id).unwrap()
      showNotification({ message: `Profile ${isBlocked ? 'unblocked' : 'blocked'} successfully`, variant: 'success' })
    } catch (error: any) {
      showNotification({ message: error?.data?.message || 'Failed to update block status. Please try again.', variant: 'danger' })
    }
  }

  const filtered = (data?.data || [])
    .filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      filter === 'verified'
        ? p.isVerified
        : filter === 'unverified'
          ? !p.isVerified
          : filter === 'blocked'
            ? p.isBlocked
            : filter === 'active'
              ? !p.isBlocked
              : true,
    )

  const editingProfile = data?.data.find((p) => p._id === editId) || null
  const meta = data?.meta

  return (
    <>
      <Card>
        <div className="d-flex card-header justify-content-between align-items-center">
          <CardTitle as="h4">All Profiles</CardTitle>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <select
              className="form-select form-select-sm"
              style={{ width: 160, height: 38 }}
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="blocked">Blocked</option>
              <option value="active">Active</option>
            </select>
            <AddProfile />
          </div>
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
                  <th>Profile</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Block</th>
                  <th>Joined</th>
                  <th style={{ width: 140 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((profile) => (
                    <tr key={profile._id}>
                      <td>
                        <Image
                          src={profile.photos?.[0]?.image || '/images/user-profile.png'}
                          width={36}
                          height={36}
                          className="avatar-sm rounded-circle me-2"
                          alt={profile.firstName}
                        />
                        {profile.firstName} {profile.lastName}
                      </td>
                      <td>{profile.phone}</td>
                      <td>
                        <span
                          role="button"
                          onClick={() => handleToggleVerify(profile._id, profile.isVerified)}
                          className={`badge px-2 py-1 ${profile.isVerified ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                          {profile.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <span
                          role="button"
                          onClick={() => handleToggleBlock(profile._id, profile.isBlocked)}
                          className={`badge px-2 py-1 ${profile.isBlocked ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`}>
                          {profile.isBlocked ? 'Blocked' : 'Not Blocked'}
                        </span>
                      </td>
                      <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-soft-primary btn-sm" onClick={() => setEditId(profile._id)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>
                          <button className="btn btn-soft-danger btn-sm" onClick={() => handleDelete(profile._id)}>
                            <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No profiles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top">
            <span className="text-muted small">
              Page {meta.page} of {meta.totalPages} &middot; {meta.total} total profiles
            </span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-secondary" disabled={page <= 1 || isFetching} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page >= meta.totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {editingProfile && <EditProfile profile={editingProfile} onClose={() => setEditId(null)} />}
    </>
  )
}

export default Profile
