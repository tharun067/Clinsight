import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Image, Save } from 'lucide-react'
import { getPatientById } from '../data/mockPatients'
import { useAuth } from '../context/AuthContext'
import AccessDenied from './AccessDenied'

const MOCK_STUDIES = [
  { id: '1', date: '02/05/2025', modality: 'X-ray', bodyPart: 'Chest', status: 'Final' },
  { id: '2', date: '02/01/2025', modality: 'CT', bodyPart: 'Abdomen', status: 'Preliminary' },
]

export default function ImagingReview() {
  const { id } = useParams()
  const { user } = useAuth()
  const patient = id ? getPatientById(id) : undefined
  const [selectedStudy, setSelectedStudy] = useState(MOCK_STUDIES[0])
  const [notes, setNotes] = useState('No acute cardiopulmonary process. Heart size normal. Lungs clear.')
  const [saved, setSaved] = useState(false)
  const canEdit = user!.role === 'radiologist'

  if (user!.role === 'patient' && id !== user!.id) return <AccessDenied />
  if (!patient) {
    return (
      <div className="text-center py-12 text-gray-500">Patient not found.</div>
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <Image className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Imaging Review</h1>
          <p className="text-gray-500 text-sm">Patient ID: {patient.id} · {patient.name} · MRN: {patient.mrn}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Studies</h2>
          <ul className="space-y-2">
            {MOCK_STUDIES.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStudy(s)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedStudy.id === s.id
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <p className="text-sm font-medium">{s.modality} — {s.bodyPart}</p>
                  <p className="text-xs text-gray-500">{s.date} · {s.status}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-card shadow-card overflow-hidden">
            <div className="bg-gray-900 aspect-[4/3] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Image className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Image viewer placeholder</p>
                <p className="text-xs mt-1">{selectedStudy.modality} — {selectedStudy.bodyPart}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Study metadata</h2>
            <dl className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <dt>Patient</dt>
              <dd>{patient.name}</dd>
              <dt>Date</dt>
              <dd>{selectedStudy.date}</dd>
              <dt>Modality</dt>
              <dd>{selectedStudy.modality}</dd>
              <dt>Body part</dt>
              <dd>{selectedStudy.bodyPart}</dd>
              <dt>Status</dt>
              <dd>{selectedStudy.status}</dd>
            </dl>
          </div>

          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Radiologist notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              readOnly={!canEdit}
              rows={4}
              className={`w-full px-3 py-2.5 border rounded-button text-gray-900 ${
                canEdit ? 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20' : 'border-gray-200 bg-gray-50'
              }`}
              placeholder="Imaging findings and impression..."
            />
            {canEdit && (
              <button
                type="button"
                onClick={handleSave}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-button hover:bg-primary-600 transition"
              >
                <Save className="w-4 h-4" />
                {saved ? 'Saved' : 'Save notes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
