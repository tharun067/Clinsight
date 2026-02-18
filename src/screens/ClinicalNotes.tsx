import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { FileText } from 'lucide-react'
import { getPatientById } from '../data/mockPatients'
import { useAuth } from '../context/AuthContext'
import AccessDenied from './AccessDenied'

const MOCK_NOTES = [
  {
    id: '1',
    date: '02/06/2025 14:30',
    author: 'Dr. Sarah Williams',
    version: 'v2',
    subjective: 'Patient reports improved energy and no chest pain.',
    objective: 'Vitals stable. Lungs clear to auscultation.',
    assessment: 'Stable. Continue current plan.',
    plan: 'Follow-up in 2 weeks. Continue medications.',
  },
  {
    id: '2',
    date: '02/01/2025 10:00',
    author: 'Dr. Sarah Williams',
    version: 'v1',
    subjective: '68-year-old male, fever, productive cough, shortness of breath x 3 days.',
    objective: 'T 38.2, HR 92, BP 138/88. Crackles at right base.',
    assessment: 'Community-acquired pneumonia, right lower lobe.',
    plan: 'Chest X-ray, CBC, CRP. Start empiric antibiotics. Admit for observation.',
  },
]

export default function ClinicalNotes() {
  const { id } = useParams()
  const { user } = useAuth()
  const patient = id ? getPatientById(id) : undefined
  const [selectedId, setSelectedId] = useState(MOCK_NOTES[0].id)
  const [adding, setAdding] = useState(false)
  const canEdit = user!.role === 'physician' || user!.role === 'nurse'

  if (user!.role === 'patient' && id !== user!.id) return <AccessDenied />
  if (!patient) {
    return <div className="text-center py-12 text-gray-500">Patient not found.</div>
  }

  const selected = MOCK_NOTES.find((n) => n.id === selectedId) ?? MOCK_NOTES[0]

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinical Notes</h1>
          <p className="text-gray-500 text-sm">Patient ID: {patient.id} · {patient.name} · MRN: {patient.mrn}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Notes</h2>
            {canEdit && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                + Add note
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {MOCK_NOTES.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(n.id)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedId === n.id
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-medium">{n.date}</p>
                  <p className="text-xs text-gray-500">{n.author} · {n.version}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">{selected.date} · {selected.version}</p>
              <p className="text-sm font-medium text-gray-900">{selected.author}</p>
            </div>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subjective</dt>
              <dd className="text-sm text-gray-900">{selected.subjective}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Objective</dt>
              <dd className="text-sm text-gray-900">{selected.objective}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Assessment</dt>
              <dd className="text-sm text-gray-900">{selected.assessment}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Plan</dt>
              <dd className="text-sm text-gray-900">{selected.plan}</dd>
            </div>
          </dl>
        </div>
      </div>

      {adding && (
        <div className="mt-6 bg-white rounded-card shadow-card p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New SOAP note</h3>
          <div className="space-y-4">
            {['Subjective', 'Objective', 'Assessment', 'Plan'].map((label) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-primary-500 text-white font-medium rounded-button hover:bg-primary-600"
            >
              Save note
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-button hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
