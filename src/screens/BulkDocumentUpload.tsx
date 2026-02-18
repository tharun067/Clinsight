import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, FileText } from 'lucide-react'

type DocType = 'Insurance' | 'ID' | 'Lab results' | 'Referral' | 'Other'

interface QueuedFile {
  id: string
  file: File
  docType: DocType
}

export default function BulkDocumentUpload() {
  const navigate = useNavigate()
  const [patientId, setPatientId] = useState('')
  const [files, setFiles] = useState<QueuedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setError('')
    const items = Array.from(e.dataTransfer.files).filter((f) =>
      ['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)
    )
    const invalid = Array.from(e.dataTransfer.files).filter(
      (f) => !['application/pdf', 'image/jpeg', 'image/png'].includes(f.type)
    )
    if (invalid.length) setError('Some file types were skipped. Use PDF, JPG, or PNG.')
    items.forEach((file) => {
      setFiles((prev) => [...prev, { id: crypto.randomUUID(), file, docType: 'Other' }])
    })
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const selected = e.target.files ? Array.from(e.target.files) : []
    selected.forEach((file) => {
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setError('Use PDF, JPG, or PNG only.')
        return
      }
      setFiles((prev) => [...prev, { id: crypto.randomUUID(), file, docType: 'Other' }])
    })
    e.target.value = ''
  }

  const setDocType = (id: string, docType: DocType) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, docType } : f)))
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleUpload = () => {
    if (!patientId.trim()) {
      setError('Please select a patient before uploading.')
      return
    }
    if (files.length === 0) {
      setError('Add at least one file.')
      return
    }
    setError('')
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setUploading(false)
          navigate('/worklist')
          return 100
        }
        return p + 20
      })
    }, 300)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <Upload className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Document Upload</h1>
          <p className="text-gray-500 text-sm">Upload patient documents (Intake Officer only)</p>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-6 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Search or select patient (e.g. MRN-XXXXX)"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-card p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Drag files here or click to browse</p>
          <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG — max 10 MB per file</p>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-button cursor-pointer hover:bg-primary-600"
          >
            Select files
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm">
            {error}
          </div>
        )}

        {files.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Files to upload</h3>
            <ul className="space-y-2">
              {files.map(({ id, file, docType }) => (
                <li
                  key={id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <FileText className="w-5 h-5 text-gray-500 shrink-0" />
                  <span className="flex-1 text-sm text-gray-900 truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(id, e.target.value as DocType)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Insurance">Insurance</option>
                    <option value="ID">ID</option>
                    <option value="Lab results">Lab results</option>
                    <option value="Referral">Referral</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeFile(id)}
                    className="p-1 text-gray-500 hover:text-danger-600"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {uploading && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Uploading…</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            Upload all
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-button hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
