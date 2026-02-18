import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { getPatientById } from '../data/mockPatients'
import { useAuth } from '../context/AuthContext'
import AccessDenied from './AccessDenied'

const MOCK_VITALS = [
  { date: '02/07/2025 10:00', bp: '120/80', hr: 72, temp: 98.6, spo2: 98 },
  { date: '02/06/2025 14:00', bp: '118/78', hr: 70, temp: 98.4, spo2: 99 },
]

const MOCK_LABS = [
  { test: 'WBC', value: 12.3, unit: 'K/uL', ref: '4.0–11.0', flag: 'High' },
  { test: 'RBC', value: 4.8, unit: 'M/uL', ref: '4.5–5.5', flag: null },
  { test: 'Hemoglobin', value: 14.2, unit: 'g/dL', ref: '13.5–17.5', flag: null },
  { test: 'Platelets', value: 245, unit: 'K/uL', ref: '150–400', flag: null },
  { test: 'CRP', value: 8.5, unit: 'mg/L', ref: '0–5', flag: 'High' },
]

export default function LabsAndVitals() {
  const { id } = useParams()
  const { user } = useAuth()
  const patient = id ? getPatientById(id) : undefined
  const [newObs, setNewObs] = useState('')
  const canEdit = user!.role === 'nurse'

  if (user!.role === 'patient' && id !== user!.id) return <AccessDenied />
  if (!patient) {
    return <div className="text-center py-12 text-gray-500">Patient not found.</div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <FlaskConical className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Labs & Vitals</h1>
          <p className="text-gray-500 text-sm">Patient ID: {patient.id} · {patient.name} · MRN: {patient.mrn}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-200">Vitals</h2>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date / time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">BP</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">HR</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Temp (°F)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SpO2</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VITALS.map((v, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">{v.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{v.bp}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{v.hr}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{v.temp}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{v.spo2}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {canEdit && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add observation</label>
              <input
                type="text"
                value={newObs}
                onChange={(e) => setNewObs(e.target.value)}
                placeholder="e.g. BP 122/82, HR 74"
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500"
              />
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-button hover:bg-primary-600"
              >
                Save observation
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-card shadow-card overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-200">Labs</h2>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Test</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reference</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Flag</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LABS.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    row.flag ? 'bg-danger-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.test}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{row.value}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.ref}</td>
                  <td className="px-4 py-3">
                    {row.flag ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-700">
                        {row.flag}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
