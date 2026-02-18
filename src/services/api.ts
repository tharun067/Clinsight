const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

interface LoginRequest {
  username: string
  password: string
}

interface RegisterRequest {
  username: string
  password: string
  full_name: string
  email: string
  role?: string
}

interface StaffRegisterRequest extends RegisterRequest {
  role: string
}

interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    username: string
    full_name: string
    email: string
    role: string
  }
}

interface Patient {
  id?: string
  uuid?: string
  full_name: string
  mrn: string
  date_of_birth: string
  gender?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  visit_type?: string
  chief_complaint?: string
  visit_date?: string
  status: string
  last_activity: string
}

class ApiService {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('access_token')
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  private extractErrorMessage(errorData: any): string {
    if (typeof errorData === 'string') {
      return errorData
    }

    // Handle Pydantic validation errors (array of error objects)
    if (Array.isArray(errorData)) {
      const messages = errorData
        .map((err: any) => {
          if (typeof err === 'string') return err
          if (err.msg) return `${err.loc?.join('.') || 'Field'}: ${err.msg}`
          return JSON.stringify(err)
        })
        .filter(Boolean)
      return messages.length > 0 ? messages.join(', ') : 'Validation error'
    }

    // Handle error objects
    if (typeof errorData === 'object' && errorData !== null) {
      if (errorData.detail) {
        return this.extractErrorMessage(errorData.detail)
      }
      if (errorData.message) {
        return errorData.message
      }
      if (errorData.msg) {
        return errorData.msg
      }
    }

    return 'An error occurred'
  }

  private formatError(errorResponse: any): string {
    if (!errorResponse) return 'An error occurred'
    const detail = errorResponse.detail || errorResponse.message || errorResponse
    return this.extractErrorMessage(detail)
  }

  private normalizePatient(patient: any): Patient {
    return {
      ...patient,
      id: patient.id || patient.uuid,
      uuid: patient.uuid || patient.id
    }
  }

  private normalizePatients(patients: any[]): Patient[] {
    return patients.map(p => this.normalizePatient(p))
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      const errorMessage = this.extractErrorMessage(error?.detail || error?.message || error || 'Request failed')
      return { error: errorMessage }
    }
    let data = await response.json()
    // Normalize Patient objects
    if (data && typeof data === 'object' && 'uuid' in data && !('id' in data)) {
      data = this.normalizePatient(data)
    } else if (Array.isArray(data) && data.length > 0 && 'uuid' in data[0]) {
      data = this.normalizePatients(data)
    }
    return { data }
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(credentials),
      })
      const result = await this.handleResponse<AuthResponse>(response)
      if (result.data?.access_token) {
        this.setToken(result.data.access_token)
      }
      return result
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<AuthResponse>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async registerStaff(data: StaffRegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/staff`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<AuthResponse>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async bootstrapAdmin(data: StaffRegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/bootstrap/admin`, {
        method: 'POST',
        headers: this.getHeaders(false),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<AuthResponse>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // User Management Endpoints
  async getUsers(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let users: any[] = []
      if (Array.isArray(data)) {
        users = data
      } else if (data.results && Array.isArray(data.results)) {
        users = data.results
      }
      return { data: users }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getUser(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async deactivateUser(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/deactivate`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async activateUser(userId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/activate`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async createPatient(data: Partial<Patient>): Promise<ApiResponse<Patient>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<Patient>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getPatients(): Promise<ApiResponse<Patient[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      // Handle different response formats
      let patients: Patient[] = []
      if (Array.isArray(data)) {
        patients = data
      } else if (data.results && Array.isArray(data.results)) {
        patients = data.results
      } else if (data.data && Array.isArray(data.data)) {
        patients = data.data
      } else if (data.patients && Array.isArray(data.patients)) {
        patients = data.patients
      }
      return { data: this.normalizePatients(patients) }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<Patient>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async updatePatient(id: string, data: Partial<Patient>): Promise<ApiResponse<Patient>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<Patient>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      return { data: undefined }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // Labs & Vitals Endpoints
  async createLabResult(patientId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/labs?patient_id=${patientId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getLabResults(patientId?: string, testName?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams()
      if (patientId) params.append('patient_id', patientId)
      if (testName) params.append('test_name', testName)
      
      const response = await fetch(`${API_BASE_URL}/labs/labs?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let labs: any[] = []
      if (Array.isArray(data)) {
        labs = data
      } else if (data.results && Array.isArray(data.results)) {
        labs = data.results
      }
      return { data: labs }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getLabResultsForPatient(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/labs/patient/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let labs: any[] = []
      if (Array.isArray(data)) {
        labs = data
      }
      return { data: labs }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getLabResult(labId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/labs/${labId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async updateLabResult(labId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/labs/${labId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async deleteLabResult(labId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/labs/${labId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      return { data: undefined }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async createVitals(patientId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/vitals?patient_id=${patientId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getVitals(patientId?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = patientId ? `?patient_id=${patientId}` : ''
      const response = await fetch(`${API_BASE_URL}/labs/vitals${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let vitals: any[] = []
      if (Array.isArray(data)) {
        vitals = data
      } else if (data.results && Array.isArray(data.results)) {
        vitals = data.results
      }
      return { data: vitals }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getVitalsForPatient(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/vitals/patient/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let vitals: any[] = []
      if (Array.isArray(data)) {
        vitals = data
      }
      return { data: vitals }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getLatestVitals(patientId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/vitals/latest/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async deleteVitals(vitalsId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/vitals/${vitalsId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      return { data: undefined }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // Clinical Notes Endpoints
  async createClinicalNote(patientId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes?patient_id=${patientId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getClinicalNotes(patientId?: string, noteType?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams()
      if (patientId) params.append('patient_id', patientId)
      if (noteType) params.append('note_type', noteType)

      const response = await fetch(`${API_BASE_URL}/notes?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let notes: any[] = []
      if (Array.isArray(data)) {
        notes = data
      } else if (data.results && Array.isArray(data.results)) {
        notes = data.results
      }
      return { data: notes }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getClinicalNotesForPatient(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/patient/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let notes: any[] = []
      if (Array.isArray(data)) {
        notes = data
      }
      return { data: notes }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getClinicalNote(noteId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async updateClinicalNote(noteId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async deleteClinicalNote(noteId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      return { data: undefined }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async summarizeClinicalNote(noteId: string, maxLength?: number): Promise<ApiResponse<any>> {
    try {
      const params = maxLength ? `?max_length=${maxLength}` : ''
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/summarize${params}`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // Imaging Endpoints
  async createImagingStudy(patientId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/imaging?patient_id=${patientId}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getImagingStudies(patientId?: string, modality?: string, statusFilter?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams()
      if (patientId) params.append('patient_id', patientId)
      if (modality) params.append('modality', modality)
      if (statusFilter) params.append('status_filter', statusFilter)

      const response = await fetch(`${API_BASE_URL}/imaging?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let studies: any[] = []
      if (Array.isArray(data)) {
        studies = data
      } else if (data.results && Array.isArray(data.results)) {
        studies = data.results
      }
      return { data: studies }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getImagingStudiesForPatient(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/imaging/patient/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let studies: any[] = []
      if (Array.isArray(data)) {
        studies = data
      }
      return { data: studies }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getImagingStudy(studyId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/imaging/${studyId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async updateImagingStudy(studyId: string, data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/imaging/${studyId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async interpretImagingStudy(studyId: string, data: { findings: string; impression: string; status?: string }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/imaging/${studyId}/interpret`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async deleteImagingStudy(studyId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/imaging/${studyId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      return { data: undefined }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // Documents Endpoints
  async bulkUploadDocuments(patientId: string, files: File[], documentTypes: string[]): Promise<ApiResponse<any[]>> {
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('patient_id', patientId)
      formData.append('document_types', documentTypes.join(','))

      const headers: HeadersInit = {}
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }

      const response = await fetch(`${API_BASE_URL}/documents/bulk-upload`, {
        method: 'POST',
        headers,
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      return { data: Array.isArray(data) ? data : [data] }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getDocuments(patientId?: string, documentType?: string): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams()
      if (patientId) params.append('patient_id', patientId)
      if (documentType) params.append('document_type', documentType)

      const response = await fetch(`${API_BASE_URL}/documents?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let documents: any[] = []
      if (Array.isArray(data)) {
        documents = data
      } else if (data.results && Array.isArray(data.results)) {
        documents = data.results
      }
      return { data: documents }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getDocument(documentId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async downloadDocument(documentId: string): Promise<Blob | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        return null
      }
      return await response.blob()
    } catch (error) {
      return null
    }
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      return { data: undefined }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // AI Diagnostic Endpoints
  async generateDiagnosticReport(data: { patient_id: string; query?: string; clinical_notes?: string; include_images?: boolean }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/diagnostic/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getDiagnosticReports(patientId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/diagnostic/reports/${patientId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let reports: any[] = []
      if (Array.isArray(data)) {
        reports = data
      } else if (data.results && Array.isArray(data.results)) {
        reports = data.results
      }
      return { data: reports }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getDiagnosticReport(reportId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/diagnostic/reports/detail/${reportId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async analyzeImage(imagePath: string, query?: string): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams()
      params.append('image_path', imagePath)
      if (query) params.append('query', query)

      const response = await fetch(`${API_BASE_URL}/diagnostic/analyze-image?${params}`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async summarizeNote(noteText: string, maxLength?: number): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams()
      params.append('note_text', noteText)
      if (maxLength) params.append('max_length', maxLength.toString())

      const response = await fetch(`${API_BASE_URL}/diagnostic/summarize-note?${params}`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async extractEntities(text: string): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams()
      params.append('text', text)

      const response = await fetch(`${API_BASE_URL}/diagnostic/extract-entities?${params}`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getDiagnosticCapabilities(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/diagnostic/capabilities`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // Audit Log Endpoints
  async getAuditLogs(params?: { start_date?: string; end_date?: string; user?: string }): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.start_date) queryParams.append('start_date', params.start_date)
      if (params?.end_date) queryParams.append('end_date', params.end_date)
      if (params?.user) queryParams.append('user', params.user)

      const response = await fetch(`${API_BASE_URL}/audit?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      // Handle different response formats
      let logs: any[] = []
      if (Array.isArray(data)) {
        logs = data
      } else if (data.results && Array.isArray(data.results)) {
        logs = data.results
      } else if (data.data && Array.isArray(data.data)) {
        logs = data.data
      } else if (data.logs && Array.isArray(data.logs)) {
        logs = data.logs
      }
      return { data: logs }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getAuditLogsByPatient(patientId: string, page?: number, pageSize?: number): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (pageSize) params.append('page_size', pageSize.toString())

      const response = await fetch(`${API_BASE_URL}/audit/patient/${patientId}?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getAuditLogsByUser(userId: string, page?: number, pageSize?: number): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams()
      if (page) params.append('page', page.toString())
      if (pageSize) params.append('page_size', pageSize.toString())

      const response = await fetch(`${API_BASE_URL}/audit/user/${userId}?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getAuditLog(logId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/${logId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getAuditActionsSummary(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/actions/summary`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // System Endpoints
  async getHealth(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
        method: 'GET',
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getSystemInfo(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}`, {
        method: 'GET',
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  // Patient Portal Endpoints
  async linkMyRecord(mrn: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/link-my-record?mrn=${mrn}`, {
        method: 'POST',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getMyRecord(): Promise<ApiResponse<Patient>> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/my-record`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      return await this.handleResponse<Patient>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async uploadMyDocuments(file: File, docType: string, notes?: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', docType)
      if (notes) {
        formData.append('notes', notes)
      }

      const headers: HeadersInit = {}
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }

      const response = await fetch(`${API_BASE_URL}/documents/my-documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getMyDocuments(docType?: string): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = docType ? `?document_type=${docType}` : ''
      const response = await fetch(`${API_BASE_URL}/documents/my-documents${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let documents: any[] = []
      if (Array.isArray(data)) {
        documents = data
      } else if (data.documents && Array.isArray(data.documents)) {
        documents = data.documents
      }
      return { data: documents }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async createMyNote(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/my-notes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getMyNotes(noteType?: string): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = noteType ? `?note_type=${noteType}` : ''
      const response = await fetch(`${API_BASE_URL}/notes/my-notes${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let notes: any[] = []
      if (Array.isArray(data)) {
        notes = data
      } else if (data.notes && Array.isArray(data.notes)) {
        notes = data.notes
      }
      return { data: notes }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async addMyVitals(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/my-vitals`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getMyVitals(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/my-vitals`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let vitals: any[] = []
      if (Array.isArray(data)) {
        vitals = data
      } else if (data.vitals && Array.isArray(data.vitals)) {
        vitals = data.vitals
      }
      return { data: vitals }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async addMyLabs(data: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/my-labs`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async getMyLabs(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/labs/my-labs`, {
        method: 'GET',
        headers: this.getHeaders(),
      })
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
        return { error: this.formatError(error) }
      }
      const data = await response.json()
      let labs: any[] = []
      if (Array.isArray(data)) {
        labs = data
      } else if (data.labs && Array.isArray(data.labs)) {
        labs = data.labs
      }
      return { data: labs }
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }
}

export const apiService = new ApiService()
export type { ApiResponse, LoginRequest, RegisterRequest, StaffRegisterRequest, AuthResponse, Patient }
