import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserPlus, Upload, Users, Stethoscope, ShieldCheck, ClipboardList, Image } from 'lucide-react'
import type { Role } from '../context/AuthContext'

const SHORTCUTS: { path: string; label: string; description: string; icon: React.ElementType; roles: Role[] }[] = [
  { path: '/register', label: 'Patient Registration', description: 'Register a new patient', icon: UserPlus, roles: ['intake'] },
  { path: '/upload', label: 'Bulk Document Upload', description: 'Upload patient documents', icon: Upload, roles: ['intake'] },
  { path: '/worklist', label: 'Patient Worklist', description: 'View and search patients', icon: Users, roles: ['intake', 'nurse', 'radiologist', 'physician'] },
  { path: '/diagnostic-lookup', label: 'Diagnostic Support', description: 'Request decision support', icon: Stethoscope, roles: ['physician'] },
  { path: '/audit', label: 'Audit & Activity Log', description: 'View access logs', icon: ShieldCheck, roles: ['admin', 'compliance'] },
]

export default function HomeDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'User'
  const visibleShortcuts = SHORTCUTS.filter((s) => user && s.roles.includes(user.role))
  const patientShortcut =
    user?.role === 'patient'
      ? [{ path: `/patient/${user.id}`, label: 'My record', description: 'View your patient record', icon: ClipboardList }]
      : []

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {firstName}</h1>
        <p className="text-gray-600">Choose an action below or use the sidebar to navigate.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...patientShortcut, ...visibleShortcuts].map(({ path, label, description, icon: Icon }) => (
          <Link
            key={path + label}
            to={path}
            className="group bg-white rounded-card shadow-card p-6 border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 hover:border-primary-200"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{label}</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {user?.role === 'intake' && (
        <div className="mt-8 bg-gradient-to-br from-white to-primary-50/30 rounded-card shadow-card p-6 border border-primary-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent registrations</h2>
          <p className="text-sm text-gray-600">No recent activity.</p>
        </div>
      )}

      {user?.role === 'physician' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Pending reviews</h3>
              <Users className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 mt-1">patients awaiting review</p>
          </div>
          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">AI suggestions</h3>
              <Stethoscope className="w-5 h-5 text-success-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">8</p>
            <p className="text-xs text-gray-500 mt-1">ready for review</p>
          </div>
          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Imaging studies</h3>
              <Image className="w-5 h-5 text-info-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-500 mt-1">new results available</p>
          </div>
        </div>
      )}
    </div>
  )
}
