import { useEffect, useState } from 'react'
import { apiService } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface User {
  uuid: string
  username: string
  full_name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
}

export default function StaffManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    const result = await apiService.getUsers()
    if (result.error) {
      setError(result.error)
    } else if (result.data) {
      setUsers(result.data)
    }
    setLoading(false)
  }

  const handleDeactivate = async (userId: string, username: string) => {
    if (confirm(`Are you sure you want to deactivate ${username}?`)) {
      const result = await apiService.deactivateUser(userId)
      if (result.error) {
        setError(result.error)
      } else {
        setUsers(users.map((u) => (u.uuid === userId ? { ...u, is_active: false } : u)))
      }
    }
  }

  const handleActivate = async (userId: string, username: string) => {
    if (confirm(`Are you sure you want to activate ${username}?`)) {
      const result = await apiService.activateUser(userId)
      if (result.error) {
        setError(result.error)
      } else {
        setUsers(users.map((u) => (u.uuid === userId ? { ...u, is_active: true } : u)))
      }
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRole && matchesSearch
  })

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name, Email, or Username</label>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="physician">Physician</option>
                <option value="nurse">Nurse</option>
                <option value="radiologist">Radiologist</option>
                <option value="intake">Intake</option>
                <option value="compliance">Compliance</option>
                <option value="patient">Patient</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-2">Loading staff members...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No staff members found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((staffUser) => (
                    <tr key={staffUser.uuid} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{staffUser.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{staffUser.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">@{staffUser.username}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {staffUser.role.charAt(0).toUpperCase() + staffUser.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {staffUser.is_active ? (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(staffUser.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {staffUser.is_active ? (
                          <button
                            onClick={() => handleDeactivate(staffUser.uuid, staffUser.username)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(staffUser.uuid, staffUser.username)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Staff</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Active Users</p>
            <p className="text-3xl font-bold text-green-600">{users.filter((u) => u.is_active).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Inactive Users</p>
            <p className="text-3xl font-bold text-red-600">{users.filter((u) => !u.is_active).length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Showing Results</p>
            <p className="text-3xl font-bold text-gray-900">{filteredUsers.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
