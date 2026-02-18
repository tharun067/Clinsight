import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { addPatientRecord } from '../data/mockPatients'

export type Role =
  | 'intake'
  | 'nurse'
  | 'radiologist'
  | 'physician'
  | 'admin'
  | 'compliance'
  | 'patient'

export interface User {
  id: string
  name: string
  role: Role
  email: string
}

export interface RegisterPatientInput {
  fullName: string
  email: string
  username: string
  password: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  registerPatient: (input: RegisterPatientInput) => { success: boolean; error?: string }
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string }
  sessionExpiresIn: number | null
}

const MOCK_USERS: Record<string, { user: User; password: string }> = {
  intake: {
    user: { id: '1', name: 'Jane Smith', role: 'intake', email: 'jane.smith@hospital.demo' },
    password: 'demo',
  },
  nurse: {
    user: { id: '2', name: 'Maria Lopez', role: 'nurse', email: 'maria.lopez@hospital.demo' },
    password: 'demo',
  },
  radiologist: {
    user: { id: '3', name: 'David Chen', role: 'radiologist', email: 'david.chen@hospital.demo' },
    password: 'demo',
  },
  physician: {
    user: { id: '4', name: 'Sarah Williams', role: 'physician', email: 'sarah.williams@hospital.demo' },
    password: 'demo',
  },
  admin: {
    user: { id: '5', name: 'Admin User', role: 'admin', email: 'admin@hospital.demo' },
    password: 'demo',
  },
  compliance: {
    user: { id: '6', name: 'Audit User', role: 'compliance', email: 'compliance@hospital.demo' },
    password: 'demo',
  },
}

// In-memory patient accounts (no login yet); key = username (lowercase)
const PATIENT_ACCOUNTS: Record<string, { user: User; password: string }> = {}
let nextPatientId = 100

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionExpiresIn, setSessionExpiresIn] = useState<number | null>(null)
  const [loginKey, setLoginKey] = useState<string | null>(null)

  const login = useCallback((username: string, password: string): boolean => {
    const key = username.toLowerCase().trim()
    const staffEntry = MOCK_USERS[key]
    if (staffEntry && staffEntry.password === password) {
      setUser(staffEntry.user)
      setLoginKey(key)
      setSessionExpiresIn(15)
      return true
    }
    const patientEntry = PATIENT_ACCOUNTS[key]
    if (patientEntry && patientEntry.password === password) {
      setUser(patientEntry.user)
      setLoginKey(`patient:${key}`)
      setSessionExpiresIn(15)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setLoginKey(null)
    setSessionExpiresIn(null)
  }, [])

  const registerPatient = useCallback((input: RegisterPatientInput) => {
    const key = input.username.toLowerCase().trim()
    if (MOCK_USERS[key]) return { success: false, error: 'This username is reserved.' }
    if (PATIENT_ACCOUNTS[key]) return { success: false, error: 'Username already taken. Please choose another.' }
    if (input.password.length < 4) return { success: false, error: 'Password must be at least 4 characters.' }
    if (!input.fullName.trim()) return { success: false, error: 'Please enter your full name.' }
    if (!input.email.trim()) return { success: false, error: 'Please enter your email.' }
    const id = String(nextPatientId++)
    const name = input.fullName.trim()
    const email = input.email.trim()
    PATIENT_ACCOUNTS[key] = {
      user: { id, name, role: 'patient', email },
      password: input.password,
    }
    addPatientRecord({
      id,
      name,
      mrn: `MRN-${id.padStart(3, '0')}`,
      dob: '—',
      status: 'Active',
      lastActivity: new Date().toLocaleDateString('en-US'),
    })
    return { success: true }
  }, [])

  const changePassword = useCallback((currentPassword: string, newPassword: string) => {
    if (!loginKey) return { success: false, error: 'Not logged in.' }
    if (loginKey.startsWith('patient:')) {
      const key = loginKey.slice(8)
      const entry = PATIENT_ACCOUNTS[key]
      if (!entry || entry.password !== currentPassword) return { success: false, error: 'Current password is incorrect.' }
      if (newPassword.length < 4) return { success: false, error: 'New password must be at least 4 characters.' }
      entry.password = newPassword
      return { success: true }
    }
    const entry = MOCK_USERS[loginKey]
    if (!entry || entry.password !== currentPassword) return { success: false, error: 'Current password is incorrect.' }
    if (newPassword.length < 4) return { success: false, error: 'New password must be at least 4 characters.' }
    entry.password = newPassword
    return { success: true }
  }, [loginKey])

  return (
    <AuthContext.Provider value={{ user, login, logout, registerPatient, changePassword, sessionExpiresIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
