import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './screens/Login'
import Signup from './screens/Signup'
import Layout from './components/Layout'
import HomeDashboard from './screens/HomeDashboard'
import PatientRegistration from './screens/PatientRegistration'
import BulkDocumentUpload from './screens/BulkDocumentUpload'
import PatientWorklist from './screens/PatientWorklist'
import PatientOverview from './screens/PatientOverview'
import ImagingReview from './screens/ImagingReview'
import LabsAndVitals from './screens/LabsAndVitals'
import ClinicalNotes from './screens/ClinicalNotes'
import DiagnosticSupport from './screens/DiagnosticSupport'
import AuditLog from './screens/AuditLog'
import Profile from './screens/Profile'
import AccessDenied from './screens/AccessDenied'

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <AccessDenied />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomeDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="register" element={<PrivateRoute allowedRoles={['intake']}><PatientRegistration /></PrivateRoute>} />
        <Route path="upload" element={<PrivateRoute allowedRoles={['intake']}><BulkDocumentUpload /></PrivateRoute>} />
        <Route path="worklist" element={<PrivateRoute allowedRoles={['intake', 'nurse', 'radiologist', 'physician']}><PatientWorklist /></PrivateRoute>} />
        <Route path="patient/:id" element={<PrivateRoute allowedRoles={['intake', 'nurse', 'radiologist', 'physician', 'patient']}><PatientOverview /></PrivateRoute>} />
        <Route path="patient/:id/imaging" element={<PrivateRoute allowedRoles={['intake', 'nurse', 'radiologist', 'physician', 'patient']}><ImagingReview /></PrivateRoute>} />
        <Route path="patient/:id/labs" element={<PrivateRoute allowedRoles={['intake', 'nurse', 'radiologist', 'physician', 'patient']}><LabsAndVitals /></PrivateRoute>} />
        <Route path="patient/:id/notes" element={<PrivateRoute allowedRoles={['intake', 'nurse', 'radiologist', 'physician', 'patient']}><ClinicalNotes /></PrivateRoute>} />
        <Route path="patient/:id/support" element={<PrivateRoute allowedRoles={['physician']}><DiagnosticSupport /></PrivateRoute>} />
        <Route path="audit" element={<PrivateRoute allowedRoles={['admin', 'compliance']}><AuditLog /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
