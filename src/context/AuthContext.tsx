import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { apiService } from '../services/api'

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
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  registerPatient: (input: RegisterPatientInput) => Promise<{ success: boolean; error?: string }>
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string }
  sessionExpiresIn: number | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessionExpiresIn, setSessionExpiresIn] = useState<number | null>(null)

  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await apiService.login({ username, password })
        if (result.error) {
          return { success: false, error: result.error }
        }
        if (result.data) {
          const userData: User = {
            id: result.data.user.id,
            name: result.data.user.full_name,
            role: (result.data.user.role as Role) || 'patient',
            email: result.data.user.email,
          }
          setUser(userData)
          setSessionExpiresIn(15)
          return { success: true }
        }
        return { success: false, error: 'Login failed' }
      } catch (err) {
        return { success: false, error: 'Network error. Please check your connection.' }
      }
    },
    []
  )

  const logout = useCallback(() => {
    setUser(null)
    setSessionExpiresIn(null)
    apiService.setToken(null)
  }, [])

  const registerPatient = useCallback(
    async (input: RegisterPatientInput): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await apiService.register({
          username: input.username,
          password: input.password,
          full_name: input.fullName,
          email: input.email,
          role: 'patient',
        })
        if (result.error) {
          return { success: false, error: result.error }
        }
        if (result.data) {
          const userData: User = {
            id: result.data.user.id,
            name: result.data.user.full_name,
            role: (result.data.user.role as Role) || 'patient',
            email: result.data.user.email,
          }
          setUser(userData)
          setSessionExpiresIn(15)
          return { success: true }
        }
        return { success: false, error: 'Registration failed' }
      } catch (err) {
        return { success: false, error: 'Network error. Please check your connection.' }
      }
    },
    []
  )

  const changePassword = useCallback(() => {
    return { success: false, error: 'Not implemented' }
  }, [])

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
