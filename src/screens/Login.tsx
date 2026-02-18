import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Stethoscope } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [showMfa, setShowMfa] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = login(username, password)
    if (!ok) {
      setError('Invalid username or password. Try again.')
      return
    }
    navigate('/') // Demo: skip MFA; MFA step still available below if needed
  }

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!mfaCode.trim()) {
      setError('Please enter the code from your authenticator app.')
      return
    }
    if (!/^\d{6}$/.test(mfaCode.trim())) {
      setError('Please enter a valid 6-digit code.')
      return
    }
    navigate('/') // Demo: accepts any valid 6-digit input
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-card shadow-card p-8 border border-gray-100">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-500 text-white flex items-center justify-center">
              <Stethoscope className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ClinSight</span>
          </div>
          <p className="text-center text-gray-500 text-sm mb-6">Clinical Decision Support System</p>

          {!showMfa ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="e.g. physician"
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition"
              >
                Sign in
              </button>
              <p className="mt-4 text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
                  Register as a patient
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">Enter the code from your authenticator app.</p>
              <div>
                <label htmlFor="mfa" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification code
                </label>
                <input
                  id="mfa"
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-danger-50 text-danger-700 text-sm">{error}</div>
              )}
              <button
                type="submit"
                className="w-full py-2.5 px-5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => setShowMfa(false)}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Back to sign in
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-400">
            Authorized use only. Activity may be logged. Do not share credentials.
          </p>
        </div>
      </div>
    </div>
  )
}
