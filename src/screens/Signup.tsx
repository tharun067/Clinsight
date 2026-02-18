import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Stethoscope, ArrowLeft } from 'lucide-react'
import { apiService } from '../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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
    if (!form.fullName.trim()) return 'Please enter your full name.'
    if (!form.email.trim()) return 'Please enter your email.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email address.'
    if (!form.username.trim()) return 'Please enter a username.'
    if (form.username.length < 3) return 'Username must be at least 3 characters.'
    if (!form.password) return 'Please enter a password.'
    if (form.password.length < 4) return 'Password must be at least 4 characters.'
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

    const result = await apiService.register({
      username: form.username,
      password: form.password,
      full_name: form.fullName,
      email: form.email,
      role: 'patient',
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card p-8 border border-gray-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ClinSight</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Create your account</h2>
          <p className="text-center text-gray-500 text-sm mb-6">Register as a patient to access your records</p>

          {success ? (
            <div className="p-4 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm text-center">
              <p className="font-medium mb-1">Registration successful!</p>
              <p>Redirecting to sign in...</p>
            </div>
          ) : (
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
                  placeholder="e.g. John Doe"
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
                  placeholder="you@example.com"
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
                  placeholder="Choose a username"
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
                className="w-full py-2.5 px-5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                  Sign in
                </Link>
              </p>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
