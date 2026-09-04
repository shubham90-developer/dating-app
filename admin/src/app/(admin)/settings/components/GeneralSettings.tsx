'use client'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from '@/Redux/api/adminApi'
import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'

const GeneralSettings = () => {
  const { data } = useGetAdminProfileQuery()
  const [updateAdminProfile, { isLoading: isSaving }] = useUpdateAdminProfileMutation()

  const admin = data?.data

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  useEffect(() => {
    if (admin) {
      setName(admin.name ?? '')
      setEmail(admin.email ?? '')
      setPhone(admin.phone ?? '')
      if (!avatarFile) setAvatarPreview(admin.avatar ?? '')
    }
  }, [admin])

  useEffect(() => {
    if (!avatarFile) return
    const objectUrl = URL.createObjectURL(avatarFile)
    setAvatarPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [avatarFile])

  const handleAdminProfileSave = async () => {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('phone', phone)
    if (newPassword) formData.append('password', newPassword)
    if (avatarFile) formData.append('avatar', avatarFile)

    await updateAdminProfile(formData)
    setNewPassword('')
  }

  return (
    <Row>
      <Col lg={12}>
        <form>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <CardTitle as={'h4'} className="d-flex align-items-center gap-1">
                    <IconifyIcon icon="solar:user-circle-bold-duotone" className="text-primary fs-20" />
                    Admin Profile
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={6}>
                      <div className="mb-3">
                        <label htmlFor="admin-avatar" className="form-label">
                          Avatar
                        </label>
                        <input
                          type="file"
                          id="admin-avatar"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                        />
                        {avatarPreview && (
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="rounded-circle mt-2"
                            style={{ width: 72, height: 72, objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <label htmlFor="admin-email" className="form-label">
                          Email
                        </label>
                        <input type="email" id="admin-email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <label htmlFor="admin-name" className="form-label">
                          Name
                        </label>
                        <input type="text" id="admin-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <label htmlFor="admin-phone" className="form-label">
                          Phone
                        </label>
                        <input type="text" id="admin-phone" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="mb-3">
                        <label htmlFor="admin-password" className="form-label">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="admin-password"
                          className="form-control"
                          placeholder="Leave blank to keep current password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </Col>
                  </Row>
                  <div className="text-end">
                    <button type="button" className="btn btn-success" disabled={isSaving} onClick={handleAdminProfileSave}>
                      {isSaving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </form>
      </Col>
    </Row>
  )
}

export default GeneralSettings
