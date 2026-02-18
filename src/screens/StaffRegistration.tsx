import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { apiService } from '../services/api'

const STAFF_ROLES = ['admin', 'physician', 'nurse', 'radiologist', 'intake', 'compliance']

export default function StaffRegistration() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error || success) {
      setError('')
      setSuccess('')
    }
  }

  const validate = () => {
    if (!form.fullName.trim()) return 'Please enter the staff member\'s full name.'
    if (!form.email.trim()) return 'Please enter an email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.username.trim()) return 'Please enter a username.'
    if (form.username.length < 3) return 'Username must be at least 3 characters.'
    if (!form.password) return 'Please enter a password.'
    if (form.password.length < 4) return 'Password must be at least 4 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    if (!form.role) return 'Please select a staff role.'
    if (!STAFF_ROLES.includes(form.role)) return 'Please select a valid staff role.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    const result = await apiService.registerStaff({
      username: form.username,
      password: form.password,
      full_name: form.fullName,
      email: form.email,
      role: form.role,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Staff account created successfully.')
      setForm({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: 'admin',
      })
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Registration</h1>
          <p className="text-gray-500 text-sm">Add physicians, nurses, and other staff members</p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
              placeholder="e.g. Dr. Jane Smith"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="name@hospital.org"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="e.g. j.smith"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Temporary password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Staff role
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
              disabled={loading}
            >
              {STAFF_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
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

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Create accounts for physicians, nurses, radiologists, and other hospital staff.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create staff account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
