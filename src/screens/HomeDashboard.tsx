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
  const firstName = user!.name.split(' ')[0]
  const visibleShortcuts = SHORTCUTS.filter((s) => s.roles.includes(user!.role))
  const patientShortcut =
    user!.role === 'patient'
      ? [{ path: `/patient/${user!.id}`, label: 'My record', description: 'View your patient record', icon: ClipboardList }]
      : []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {firstName}</h1>
      <p className="text-gray-500 mb-8">Choose an action below or use the sidebar to navigate.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...patientShortcut, ...visibleShortcuts].map(({ path, label, description, icon: Icon }) => (
          <Link
            key={path + label}
            to={path}
            className="bg-white rounded-card shadow-card p-6 border border-gray-100 hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{label}</h2>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {user!.role === 'intake' && (
        <div className="mt-8 bg-white rounded-card shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent registrations</h2>
          <p className="text-sm text-gray-500">No recent activity.</p>
        </div>
      )}
    </div>
  )
}
