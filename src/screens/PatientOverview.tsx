import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { User, AlertTriangle, Image, FlaskConical, FileText, Stethoscope } from 'lucide-react'
import { apiService, type Patient } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AccessDenied from './AccessDenied'

export default function PatientOverview() {
  const { id } = useParams()
  const { user } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setLoading(false)
        return
      }
      const result = await apiService.getPatient(id)
      if (result.error) {
        // Handle error silently or show in UI
      } else if (result.data) {
        setPatient(result.data)
      }
      setLoading(false)
    }
    fetchPatient()
  }, [id])

  if (user!.role === 'patient' && id !== user!.id) {
    return <AccessDenied />
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading patient information...</div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-12 text-gray-500">
        Patient not found.{' '}
        <Link to={user!.role === 'patient' ? '/' : '/worklist'} className="text-primary-600 hover:underline">
          {user!.role === 'patient' ? 'Back to dashboard' : 'Back to worklist'}
        </Link>
      </div>
    )
  }

  const links = [
    { to: `/patient/${id}/labs`, label: 'Labs & Vitals', icon: FlaskConical },
    { to: `/patient/${id}/imaging`, label: 'Imaging', icon: Image },
    { to: `/patient/${id}/notes`, label: 'Clinical Notes', icon: FileText },
    ...(user!.role === 'physician'
      ? [{ to: `/patient/${id}/support`, label: 'Diagnostic Support', icon: Stethoscope as React.ElementType }]
      : []),
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{patient.full_name}</h1>
          <p className="text-gray-500 text-sm">Patient ID: {patient.id} · MRN: {patient.mrn} · DOB: {patient.date_of_birth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <dt className="text-gray-500">Patient ID</dt>
              <dd className="text-gray-900 font-mono">{patient.id}</dd>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900 font-medium">{patient.full_name}</dd>
              <dt className="text-gray-500">MRN</dt>
              <dd className="text-gray-900 font-mono">{patient.mrn}</dd>
              <dt className="text-gray-500">DOB</dt>
              <dd className="text-gray-900">{patient.date_of_birth}</dd>
              <dt className="text-gray-500">Gender</dt>
              <dd className="text-gray-900">{patient.gender || '—'}</dd>
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-900">{patient.phone || '—'}</dd>
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                  {patient.status}
                </span>
              </dd>
            </dl>
          </div>

          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts & flags</h2>
            <div className="flex items-start gap-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning-800">Allergy alert</p>
                <p className="text-sm text-warning-700">Penicillin — documented in record.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-sm text-gray-500 w-20 shrink-0">{patient.visit_date || '—'}</span>
                <div className="border-l-4 border-primary-500 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">Last visit</p>
                  <p className="text-xs text-gray-500">{patient.chief_complaint || 'No chief complaint'}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-sm text-gray-500 w-20 shrink-0">{patient.last_activity}</span>
                <div className="border-l-4 border-gray-200 pl-4 py-1">
                  <p className="text-sm font-medium text-gray-900">Last activity</p>
                  <p className="text-xs text-gray-500">—</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-card shadow-card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick links</h2>
            <nav className="space-y-2">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary-200 transition"
                >
                  <Icon className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-info-50 border border-info-200 rounded-lg text-sm text-info-800">
        Patient consent may be required for some data. Contact compliance if unsure.
      </div>
    </div>
  )
}
