import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import { apiService } from '../services/api'

export default function BootstrapAdmin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const validate = () => {
    if (!form.fullName.trim()) return 'Please enter the administrator\'s full name.'
    if (!form.email.trim()) return 'Please enter an email address.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.username.trim()) return 'Please enter a username.'
    if (form.username.length < 3) return 'Username must be at least 3 characters.'
    if (!form.password) return 'Please enter a password.'
    if (form.password.length < 8) return 'Password must be at least 8 characters for security.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    const result = await apiService.bootstrapAdmin({
      username: form.username,
      password: form.password,
      full_name: form.fullName,
      email: form.email,
      role: 'admin',
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      // Success - redirect to login
      navigate('/login?admin_created=true')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ClinSight</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Create First Admin</h2>
          <p className="text-center text-gray-500 text-sm mb-6">
            Bootstrap the system administrator account
          </p>

          <div className="mb-6 p-3 rounded-lg bg-warning-50 border border-warning-200">
            <p className="text-xs text-warning-700">
              <strong>Important:</strong> This endpoint only works when no admin exists. After creating the first admin, use the Staff Registration page to add other users.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="e.g. System Administrator"
                required
                disabled={loading}
              />
            </div>

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
                placeholder="admin@hospital.com"
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
                placeholder="admin"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
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

            {error && (
              <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-5 bg-red-500 text-white font-medium rounded-button shadow-sm hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating admin...' : 'Create admin account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            This is a one-time setup. The admin can create other staff accounts after logging in.
          </p>
        </div>
      </div>
    </div>
  )
}
