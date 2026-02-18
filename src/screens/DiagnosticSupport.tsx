import { useParams } from 'react-router-dom'
import { Stethoscope, AlertTriangle, FileText } from 'lucide-react'
import { getPatientById } from '../data/mockPatients'

const MOCK_SUGGESTIONS = [
  { condition: 'Community-acquired pneumonia', confidence: 78, evidence: 'Chest X-ray opacity RLL; elevated WBC and CRP; clinical presentation.' },
  { condition: 'Acute bronchitis', confidence: 45, evidence: 'Cough and fever; no focal consolidation on imaging.' },
]

const MOCK_CITATIONS = [
  { id: 'PMID-12345', source: 'PubMed', title: 'CAP guidelines 2024' },
  { id: 'SNOMED-233604007', source: 'SNOMED CT', title: 'Pneumonia (disorder)' },
]

export default function DiagnosticSupport() {
  const { id } = useParams()
  const patient = id ? getPatientById(id) : undefined

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
          <p className="text-gray-500 text-sm">{patient.name} · Physician only</p>
        </div>
      </div>

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
            {MOCK_SUGGESTIONS.map((s, i) => (
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
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Evidence summary</h2>
            <p className="text-sm text-gray-700">
              Imaging shows right lower lobe opacity consistent with consolidation. Lab values (elevated WBC, CRP) and clinical presentation (fever, cough, dyspnea) support infectious process. Consider culture-guided therapy and reassessment in 48–72 hours.
            </p>
          </div>

          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Citations
            </h2>
            <ul className="space-y-2">
              {MOCK_CITATIONS.map((c) => (
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
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
