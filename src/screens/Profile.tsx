import { useState } from 'react'
import { User, Lock, Mail, Shield, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error || success) {
      setError('')
      setSuccess('')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!passwordForm.currentPassword) {
      setError('Please enter your current password.')
      return
    }
    if (!passwordForm.newPassword) {
      setError('Please enter a new password.')
      return
    }
    if (passwordForm.newPassword.length < 4) {
      setError('New password must be at least 4 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setLoading(true)

    const result = changePassword(passwordForm.currentPassword, passwordForm.newPassword)

    setLoading(false)

    if (result.success) {
      setSuccess('Password changed successfully.')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      setError(result.error || 'Failed to change password.')
    }
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      intake: 'bg-blue-100 text-blue-700',
      nurse: 'bg-green-100 text-green-700',
      radiologist: 'bg-purple-100 text-purple-700',
      physician: 'bg-primary-100 text-primary-700',
      admin: 'bg-red-100 text-red-700',
      compliance: 'bg-orange-100 text-orange-700',
      patient: 'bg-gray-100 text-gray-700',
    }
    return colors[role] || colors.patient
  }

  if (!user) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-500 text-sm">Manage your account settings</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'info'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <User className="w-4 h-4" />
                  Account Information
                </div>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'security'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Security
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                    {user.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500 capitalize mt-1">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role === 'intake' ? 'Intake Officer' : user.role === 'physician' ? 'Physician' : user.role === 'radiologist' ? 'Radiologist' : user.role === 'admin' ? 'Hospital Admin' : user.role}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <User className="w-4 h-4" />
                      User ID
                    </label>
                    <p className="text-gray-900 font-mono">{user.id}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Shield className="w-4 h-4" />
                      Role
                    </label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Shield className="w-4 h-4" />
                      Status
                    </label>
                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                      Active
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {user.role === 'intake' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Register patients
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Upload documents
                        </div>
                      </>
                    )}
                    {user.role === 'nurse' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          View worklist
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Enter labs & vitals
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Add clinical notes
                        </div>
                      </>
                    )}
                    {user.role === 'radiologist' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Review imaging
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Add interpretations
                        </div>
                      </>
                    )}
                    {user.role === 'physician' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Full clinical access
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          Diagnostic support
                        </div>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          User management
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                          System settings
                        </div>
                      </>
                    )}
                    {user.role === 'compliance' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        View audit logs
                      </div>
                    )}
                    {user.role === 'patient' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        View own records
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Change password</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Update your password to keep your account secure. Password must be at least 4 characters.
                </p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      placeholder="Enter current password"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      New password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      placeholder="Enter new password"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm new password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      placeholder="Confirm new password"
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Updating...' : 'Update password'}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Session information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Session timeout</span>
                      <span className="text-gray-900 font-medium">15 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Authentication method</span>
                      <span className="text-gray-900 font-medium">JWT Token</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
