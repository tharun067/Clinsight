import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  UserPlus,
  Upload,
  Users,
  ShieldCheck,
  LogOut,
  User,
  ArrowLeft,
  ClipboardList,
  BrainCircuit,
} from 'lucide-react'
import type { Role } from '../context/AuthContext'

const SIDEBAR_ITEMS: { path: string; label: string; icon: React.ElementType; roles: Role[] }[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['intake', 'nurse', 'radiologist', 'physician', 'admin', 'compliance', 'patient'] },
  { path: '/register', label: 'Patient Registration', icon: UserPlus, roles: ['intake'] },
  { path: '/upload', label: 'Bulk Upload', icon: Upload, roles: ['intake'] },
  { path: '/worklist', label: 'Patient Worklist', icon: Users, roles: ['intake', 'nurse', 'radiologist', 'physician'] },
  { path: '/diagnostic-lookup', label: 'Diagnostic Support', icon: BrainCircuit, roles: ['physician'] },
  { path: '/audit', label: 'Audit & Activity Log', icon: ShieldCheck, roles: ['admin', 'compliance'] },
  { path: '/profile', label: 'Profile', icon: User, roles: ['intake', 'nurse', 'radiologist', 'physician', 'admin', 'compliance', 'patient'] },
]

export default function Layout() {
  const { user, logout, sessionExpiresIn } = useAuth()
  const navigate = useNavigate()
  const baseItems = SIDEBAR_ITEMS.filter((item) => item.roles.includes(user!.role))
  const patientRecordItem =
    user!.role === 'patient'
      ? [{ path: `/patient/${user!.id}`, label: 'My record', icon: ClipboardList }]
      : []
  const visibleItems = [...baseItems.slice(0, 1), ...patientRecordItem, ...baseItems.slice(1)]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="grid grid-cols-[16rem_1fr] min-h-screen bg-gray-50">
      <aside className="bg-white border-r border-gray-200 py-6 flex flex-col">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-500 text-white flex items-center justify-center text-lg font-semibold">
            C
          </div>
          <span className="text-lg font-semibold text-gray-900">ClinSight</span>
        </div>
        <nav className="flex-1">
          {visibleItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${isActive
                  ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-6 pt-4 border-t border-gray-200 flex items-center gap-3">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 min-w-0 flex-1 rounded-lg p-1 -m-1 transition-colors ${isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
              }`
            }
          >
            <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {user!.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{user!.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user!.role}</p>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>
      <main className="flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Go back"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">ClinSight</h1>
              <p className="text-sm text-gray-500">Clinical Decision Support</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {sessionExpiresIn != null && (
              <span className="text-xs text-gray-500">Session expires in {sessionExpiresIn} min</span>
            )}
            <span className="text-sm font-medium text-gray-700">{user!.name}</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
