import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Users } from 'lucide-react'
import { apiService, type Patient } from '../services/api'

export default function PatientWorklist() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatients = async () => {
      const result = await apiService.getPatients()
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        // Ensure data is always an array
        const patientsData = Array.isArray(result.data) ? result.data : []
        setPatients(patientsData)
      }
      setLoading(false)
    }
    fetchPatients()
  }, [])

  const filtered = (Array.isArray(patients) ? patients : []).filter((p) => {
    const matchSearch =
      !search.trim() ||
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      (p.id?.toLowerCase() || '').includes(search.toLowerCase())
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Worklist</h1>
          <p className="text-gray-500 text-sm">Search and open patient records</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, Patient ID, or MRN"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-button text-gray-700 bg-white"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading patients...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  MRN
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  DOB
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last activity
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    {error ? 'Error loading patients' : 'No patients match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{p.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.mrn}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.date_of_birth}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.status === 'Active'
                            ? 'bg-success-100 text-success-700'
                            : p.status === 'Pending'
                              ? 'bg-warning-100 text-warning-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.last_activity}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/patient/${p.id}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
