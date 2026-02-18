import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FlaskConical } from 'lucide-react'
import { apiService, type Patient } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AccessDenied from './AccessDenied'

export default function LabsAndVitals() {
  const { id } = useParams()
  const { user } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [vitals, setVitals] = useState<any[]>([])
  const [labs, setLabs] = useState<any[]>([])
  const [newObs, setNewObs] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canEdit = user?.role === 'nurse'

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      const patientResult = await apiService.getPatient(id)
      if (patientResult.data) {
        setPatient(patientResult.data)
      }

      const [vitalsResult, labsResult] = await Promise.all([
        apiService.getVitalsForPatient(id),
        apiService.getLabResultsForPatient(id)
      ])
      
      if (vitalsResult.data) {
        const vitalsData = Array.isArray(vitalsResult.data) ? vitalsResult.data : []
        setVitals(vitalsData)
      }
      
      if (labsResult.data) {
        const labsData = Array.isArray(labsResult.data) ? labsResult.data : []
        setLabs(labsData)
      }
      
      if (vitalsResult.error || labsResult.error) {
        setError(vitalsResult.error || labsResult.error || null)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (user?.role === 'patient' && id !== user?.id) return <AccessDenied />
  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading labs and vitals...</div>
  }
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
          <p className="text-gray-500 text-sm">Patient ID: {patient.id} · {patient.full_name} · MRN: {patient.mrn}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
          {error}
        </div>
      )}

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
              {vitals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No vitals available.
                  </td>
                </tr>
              ) : (
                vitals.map((v, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{v.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{v.bp}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{v.hr}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{v.temp}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{v.spo2}</td>
                  </tr>
                ))
              )}
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
              {labs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No labs available.
                  </td>
                </tr>
              ) : (
                labs.map((row, i) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
