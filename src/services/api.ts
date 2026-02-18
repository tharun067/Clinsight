const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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
  id: string
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

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      return { error: error.detail || error.message || 'Request failed' }
    }
    const data = await response.json()
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
      return await this.handleResponse<Patient[]>(response)
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
      return await this.handleResponse<any[]>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }

  async uploadDocument(patientId: string, file: File, docType: string): Promise<ApiResponse<any>> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('patient_id', patientId)
      formData.append('document_type', docType)

      const headers: HeadersInit = {}
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`
      }

      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        headers,
        body: formData,
      })
      return await this.handleResponse<any>(response)
    } catch (error) {
      return { error: 'Network error. Please check your connection.' }
    }
  }
}

export const apiService = new ApiService()
export type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse, Patient }
