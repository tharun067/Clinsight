import { useState, useEffect } from 'react'
import { FileText, Upload, Heart, Activity, FileCheck, Link as LinkIcon, AlertCircle, CheckCircle, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { apiService } from '../services/api'

type TabType = 'link' | 'overview' | 'documents' | 'notes' | 'vitals' | 'labs'

export default function PatientPortal() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('link')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Link Record State
  const [mrn, setMrn] = useState('')
  const [isLinked, setIsLinked] = useState(false)
  const [patientRecord, setPatientRecord] = useState<any>(null)
  
  // Documents State
  const [documents, setDocuments] = useState<any[]>([])
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [docType, setDocType] = useState('lab_report')
  const [docNotes, setDocNotes] = useState('')
  
  // Notes State
  const [notes, setNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState({ title: '', content: '', note_type: 'patient_note' })
  
  // Vitals State
  const [vitals, setVitals] = useState<any[]>([])
  const [newVital, setNewVital] = useState({
    temperature: '',
    temperature_unit: 'F',
    heart_rate: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    weight: '',
    weight_unit: 'lbs',
    notes: ''
  })
  
  // Labs State
  const [labs, setLabs] = useState<any[]>([])
  const [newLab, setNewLab] = useState({
    test_name: '',
    test_value: '',
    unit: '',
    reference_range_low: '',
    reference_range_high: '',
    notes: ''
  })

  useEffect(() => {
    checkLinkStatus()
  }, [])

  const checkLinkStatus = async () => {
    const result = await apiService.getMyRecord()
    if (result.data) {
      setIsLinked(true)
      setPatientRecord(result.data)
      setActiveTab('overview')
    }
  }

  const handleLinkRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!mrn.trim()) {
      setError('Please enter your Medical Record Number (MRN)')
      return
    }
    
    setLoading(true)
    const result = await apiService.linkMyRecord(mrn.trim())
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Successfully linked to your medical record!')
      setIsLinked(true)
      setTimeout(() => {
        checkLinkStatus()
      }, 1000)
    }
  }

  const loadDocuments = async () => {
    const result = await apiService.getMyDocuments()
    if (result.data) {
      setDocuments(result.data)
    }
  }

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      setError('Please select a file to upload')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    const result = await apiService.uploadMyDocuments(uploadFile, docType, docNotes)
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Document uploaded successfully!')
      setUploadFile(null)
      setDocNotes('')
      loadDocuments()
    }
  }

  const loadNotes = async () => {
    const result = await apiService.getMyNotes()
    if (result.data) {
      setNotes(result.data)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title || !newNote.content) {
      setError('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    const result = await apiService.createMyNote({
      ...newNote,
      note_date: new Date().toISOString()
    })
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Note added successfully!')
      setNewNote({ title: '', content: '', note_type: 'patient_note' })
      loadNotes()
    }
  }

  const loadVitals = async () => {
    const result = await apiService.getMyVitals()
    if (result.data) {
      setVitals(result.data)
    }
  }

  const handleAddVital = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    const result = await apiService.addMyVitals({
      ...newVital,
      temperature: newVital.temperature ? parseFloat(newVital.temperature) : undefined,
      heart_rate: newVital.heart_rate ? parseInt(newVital.heart_rate) : undefined,
      blood_pressure_systolic: newVital.blood_pressure_systolic ? parseInt(newVital.blood_pressure_systolic) : undefined,
      blood_pressure_diastolic: newVital.blood_pressure_diastolic ? parseInt(newVital.blood_pressure_diastolic) : undefined,
      weight: newVital.weight ? parseFloat(newVital.weight) : undefined,
      taken_date: new Date().toISOString()
    })
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Vital signs added successfully!')
      setNewVital({
        temperature: '',
        temperature_unit: 'F',
        heart_rate: '',
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        weight: '',
        weight_unit: 'lbs',
        notes: ''
      })
      loadVitals()
    }
  }

  const loadLabs = async () => {
    const result = await apiService.getMyLabs()
    if (result.data) {
      setLabs(result.data)
    }
  }

  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLab.test_name || !newLab.test_value) {
      setError('Please fill in test name and value')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    const result = await apiService.addMyLabs({
      ...newLab,
      test_value: parseFloat(newLab.test_value),
      reference_range_low: newLab.reference_range_low ? parseFloat(newLab.reference_range_low) : undefined,
      reference_range_high: newLab.reference_range_high ? parseFloat(newLab.reference_range_high) : undefined,
      test_date: new Date().toISOString()
    })
    setLoading(false)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Lab result added successfully!')
      setNewLab({
        test_name: '',
        test_value: '',
        unit: '',
        reference_range_low: '',
        reference_range_high: '',
        notes: ''
      })
      loadLabs()
    }
  }

  useEffect(() => {
    if (isLinked && activeTab === 'documents') {
      loadDocuments()
    } else if (isLinked && activeTab === 'notes') {
      loadNotes()
    } else if (isLinked && activeTab === 'vitals') {
      loadVitals()
    } else if (isLinked && activeTab === 'labs') {
      loadLabs()
    }
  }, [activeTab, isLinked])

  if (user?.role !== 'patient') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">This feature is only available to patients.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
          <p className="text-gray-500 text-sm">Manage your health records</p>
        </div>
      </div>

      {!isLinked ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-card shadow-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Your Medical Record</h2>
              <p className="text-gray-600">
                Enter your Medical Record Number (MRN) provided by the intake desk to access your medical records.
              </p>
            </div>

            <form onSubmit={handleLinkRecord} className="space-y-4">
              <div>
                <label htmlFor="mrn" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Record Number (MRN)
                </label>
                <input
                  id="mrn"
                  type="text"
                  value={mrn}
                  onChange={(e) => setMrn(e.target.value)}
                  placeholder="e.g., MRN-12345"
                  className="w-full px-4 py-3 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Linking...' : 'Link My Record'}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">Don't have your MRN?</p>
              <p className="text-sm text-blue-700">
                Contact the intake desk at your healthcare facility to obtain your Medical Record Number.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white rounded-card shadow-card overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    Overview
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'documents'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Documents
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'notes'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Notes
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('vitals')}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'vitals'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Vitals
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('labs')}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'labs'
                      ? 'border-b-2 border-primary-500 text-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Labs
                  </div>
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && patientRecord && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Your Record is Linked</h2>
                      <p className="text-sm text-gray-600">You have access to your medical records</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900 font-medium">{patientRecord.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">MRN</label>
                      <p className="text-gray-900 font-mono">{patientRecord.mrn}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{patientRecord.date_of_birth}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{patientRecord.gender || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{patientRecord.phone || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-700">
                        {patientRecord.status}
                      </span>
                    </div>
                  </div>

                  {patientRecord.chief_complaint && (
                    <div className="pt-4 border-t border-gray-200">
                      <label className="text-sm font-medium text-gray-500">Chief Complaint</label>
                      <p className="text-gray-900 mt-1">{patientRecord.chief_complaint}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
                    <form onSubmit={handleUploadDocument} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Document Type
                        </label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        >
                          <option value="lab_report">Lab Report</option>
                          <option value="prescription">Prescription</option>
                          <option value="imaging_report">Imaging Report</option>
                          <option value="clinical_note">Clinical Note</option>
                          <option value="discharge_summary">Discharge Summary</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          File
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="w-full px-3 py-2 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={docNotes}
                          onChange={(e) => setDocNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          placeholder="Add any additional notes about this document..."
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm">
                          {success}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Upload className="w-4 h-4" />
                        {loading ? 'Uploading...' : 'Upload Document'}
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Documents</h3>
                    {documents.length === 0 ? (
                      <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc, idx) => (
                          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="font-medium text-gray-900">{doc.document_type}</p>
                                  {doc.notes && (
                                    <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(doc.upload_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
                    <form onSubmit={handleAddNote} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                          placeholder="e.g., Headache today"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <textarea
                          value={newNote.content}
                          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                          rows={4}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          placeholder="Describe your symptoms or concerns..."
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm">
                          {success}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        {loading ? 'Adding...' : 'Add Note'}
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Notes</h3>
                    {notes.length === 0 ? (
                      <p className="text-gray-500 text-sm">No notes added yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {notes.map((note, idx) => (
                          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900">{note.title}</h4>
                            <p className="text-sm text-gray-600 mt-2">{note.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(note.note_date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'vitals' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Vital Signs</h3>
                    <form onSubmit={handleAddVital} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Temperature
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={newVital.temperature}
                              onChange={(e) => setNewVital({ ...newVital, temperature: e.target.value })}
                              placeholder="98.6"
                              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            />
                            <select
                              value={newVital.temperature_unit}
                              onChange={(e) => setNewVital({ ...newVital, temperature_unit: e.target.value })}
                              className="w-20 px-2 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            >
                              <option value="F">°F</option>
                              <option value="C">°C</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Heart Rate (bpm)
                          </label>
                          <input
                            type="number"
                            value={newVital.heart_rate}
                            onChange={(e) => setNewVital({ ...newVital, heart_rate: e.target.value })}
                            placeholder="72"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Blood Pressure (Systolic)
                          </label>
                          <input
                            type="number"
                            value={newVital.blood_pressure_systolic}
                            onChange={(e) => setNewVital({ ...newVital, blood_pressure_systolic: e.target.value })}
                            placeholder="120"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Blood Pressure (Diastolic)
                          </label>
                          <input
                            type="number"
                            value={newVital.blood_pressure_diastolic}
                            onChange={(e) => setNewVital({ ...newVital, blood_pressure_diastolic: e.target.value })}
                            placeholder="80"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={newVital.weight}
                              onChange={(e) => setNewVital({ ...newVital, weight: e.target.value })}
                              placeholder="165.5"
                              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            />
                            <select
                              value={newVital.weight_unit}
                              onChange={(e) => setNewVital({ ...newVital, weight_unit: e.target.value })}
                              className="w-20 px-2 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                            >
                              <option value="lbs">lbs</option>
                              <option value="kg">kg</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={newVital.notes}
                          onChange={(e) => setNewVital({ ...newVital, notes: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          placeholder="Any additional notes..."
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm">
                          {success}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        {loading ? 'Adding...' : 'Add Vitals'}
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Vital Signs</h3>
                    {vitals.length === 0 ? (
                      <p className="text-gray-500 text-sm">No vitals recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {vitals.map((vital, idx) => (
                          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {vital.temperature && (
                                <div>
                                  <p className="text-xs text-gray-500">Temperature</p>
                                  <p className="font-medium text-gray-900">{vital.temperature}°{vital.temperature_unit}</p>
                                </div>
                              )}
                              {vital.heart_rate && (
                                <div>
                                  <p className="text-xs text-gray-500">Heart Rate</p>
                                  <p className="font-medium text-gray-900">{vital.heart_rate} bpm</p>
                                </div>
                              )}
                              {vital.blood_pressure_systolic && (
                                <div>
                                  <p className="text-xs text-gray-500">Blood Pressure</p>
                                  <p className="font-medium text-gray-900">{vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}</p>
                                </div>
                              )}
                              {vital.weight && (
                                <div>
                                  <p className="text-xs text-gray-500">Weight</p>
                                  <p className="font-medium text-gray-900">{vital.weight} {vital.weight_unit}</p>
                                </div>
                              )}
                            </div>
                            {vital.notes && (
                              <p className="text-sm text-gray-600 mt-2">{vital.notes}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(vital.taken_date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'labs' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Lab Result</h3>
                    <form onSubmit={handleAddLab} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Name *
                          </label>
                          <input
                            type="text"
                            value={newLab.test_name}
                            onChange={(e) => setNewLab({ ...newLab, test_name: e.target.value })}
                            placeholder="e.g., Blood Glucose"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Value *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={newLab.test_value}
                            onChange={(e) => setNewLab({ ...newLab, test_value: e.target.value })}
                            placeholder="105"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                          </label>
                          <input
                            type="text"
                            value={newLab.unit}
                            onChange={(e) => setNewLab({ ...newLab, unit: e.target.value })}
                            placeholder="e.g., mg/dL"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reference Range Low
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={newLab.reference_range_low}
                            onChange={(e) => setNewLab({ ...newLab, reference_range_low: e.target.value })}
                            placeholder="70"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reference Range High
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={newLab.reference_range_high}
                            onChange={(e) => setNewLab({ ...newLab, reference_range_high: e.target.value })}
                            placeholder="100"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={newLab.notes}
                          onChange={(e) => setNewLab({ ...newLab, notes: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                          placeholder="Any additional notes..."
                        />
                      </div>

                      {error && (
                        <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm">
                          {success}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        {loading ? 'Adding...' : 'Add Lab Result'}
                      </button>
                    </form>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Lab Results</h3>
                    {labs.length === 0 ? (
                      <p className="text-gray-500 text-sm">No lab results added yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {labs.map((lab, idx) => (
                          <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{lab.test_name}</h4>
                                <p className="text-lg font-semibold text-primary-600 mt-1">
                                  {lab.test_value} {lab.unit}
                                </p>
                                {lab.reference_range_low && lab.reference_range_high && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Reference: {lab.reference_range_low} - {lab.reference_range_high}
                                  </p>
                                )}
                                {lab.notes && (
                                  <p className="text-sm text-gray-600 mt-2">{lab.notes}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(lab.test_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
