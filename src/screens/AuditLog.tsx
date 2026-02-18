import { useState } from 'react'
import { ShieldCheck, Search, Download } from 'lucide-react'

const MOCK_LOGS = [
  { id: '1', timestamp: '02/07/2025 10:32:15', user: 'Dr. Sarah Williams', action: 'View patient record', resource: 'MRN-001', result: 'Success' },
  { id: '2', timestamp: '02/07/2025 10:28:00', user: 'Maria Lopez', action: 'Update vitals', resource: 'MRN-001', result: 'Success' },
  { id: '3', timestamp: '02/07/2025 09:15:22', user: 'Jane Smith', action: 'Upload document', resource: 'MRN-002', result: 'Success' },
  { id: '4', timestamp: '02/06/2025 16:45:00', user: 'David Chen', action: 'View imaging', resource: 'MRN-001', result: 'Success' },
]

export default function AuditLog() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit & Activity Log</h1>
          <p className="text-gray-500 text-sm">Read-only. Admin and Compliance only.</p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-button text-gray-900 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-button text-gray-900 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Filter by user"
              className="px-3 py-2 border border-gray-300 rounded-button text-gray-900 text-sm w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              placeholder="Filter by patient / resource"
              className="px-3 py-2 border border-gray-300 rounded-button text-gray-900 text-sm w-48"
            />
          </div>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-button hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export log
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resource
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Result
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-600">{log.timestamp}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.user}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.action}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{log.resource}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                    {log.result}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
