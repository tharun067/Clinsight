import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function AccessDenied() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-card shadow-card p-8 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-danger-50 text-danger-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Access denied</h1>
        <p className="text-gray-600 mb-6">You don&apos;t have permission to view this page.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button hover:bg-primary-600 transition"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
