import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Stethoscope, AlertTriangle, FileText } from 'lucide-react'
import { apiService, type Patient } from '../services/api'

export default function DiagnosticSupport() {
  const { id } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [citations, setCitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      const reportsResult = await apiService.getDiagnosticReports(id)
      if (reportsResult.data && reportsResult.data.length > 0) {
        const latestReport = reportsResult.data[0]
        setSuggestions(latestReport?.suggestions || [])
        setCitations(latestReport?.citations || [])
      } else if (reportsResult.error) {
        setError(reportsResult.error)
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading diagnostic support...</div>
  }

  if (!patient) {
    return <div className="text-center py-12 text-gray-500">Patient not found.</div>
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagnostic Support</h1>
          <p className="text-gray-500 text-sm">{patient.full_name} · Physician only</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg text-danger-700">
          {error}
        </div>
      )}

      <div className="mb-6 p-4 bg-warning-50 border-l-4 border-warning-500 rounded-r-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-warning-800">For decision support only</p>
          <p className="text-sm text-warning-700">
            The physician is responsible for final diagnosis and treatment. This information does not replace clinical judgment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Suggested conditions (support only)</h2>
          <ul className="space-y-4">
            {suggestions.length === 0 ? (
              <li className="text-gray-500">No diagnostic suggestions available.</li>
            ) : (
              suggestions.map((s, i) => (
                <li key={i} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900">{s.condition}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">Confidence</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${s.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{s.confidence}%</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{s.evidence}</p>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence summary</h2>
            <p className="text-sm text-gray-700">
              Review clinical findings, imaging, and lab values to guide diagnosis and treatment recommendations.
            </p>
          </div>

          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Citations
            </h2>
            <ul className="space-y-2">
              {citations.length === 0 ? (
                <li className="text-gray-500">No citations available.</li>
              ) : (
                citations.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.id}</p>
                      <p className="text-xs text-gray-500">{c.source} — {c.title}</p>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
