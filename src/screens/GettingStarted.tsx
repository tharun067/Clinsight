import { useState } from 'react'
import { ChevronDown, ChevronUp, Book, Users, ClipboardList, Upload, Search, Stethoscope, Eye, Settings, Shield, HelpCircle, ArrowRight } from 'lucide-react'

interface GuideSection {
  id: string
  title: string
  icon: React.ElementType
  description: string
  steps: string[]
  roles: string[]
}

const GUIDES: GuideSection[] = [
  {
    id: 'patient-registration',
    title: 'Patient Registration',
    icon: Users,
    description: 'How to register a new patient in the system',
    steps: [
      'Navigate to "Patient Registration" from the home dashboard',
      'Enter patient demographics (name, date of birth, gender, contact info)',
      'Add Medical Record Number (MRN) for unique identification',
      'Fill in visit information (visit type, chief complaint, visit date)',
      'Click "Register Patient" to save to the system',
      'Patient will be available in the worklist immediately'
    ],
    roles: ['intake']
  },
  {
    id: 'document-upload',
    title: 'Bulk Document Upload',
    icon: Upload,
    description: 'How to upload patient documents (insurance, ID, lab results, etc.)',
    steps: [
      'Go to "Bulk Document Upload" from the dashboard',
      'Select a patient from the patient search field',
      'Drag & drop files or click to browse (supports PDF, JPG, PNG)',
      'For each file, select the document type (Insurance, ID, Lab results, Referral, Other)',
      'Click "Upload Documents" to complete the upload',
      'Documents are now linked to the patient record'
    ],
    roles: ['intake']
  },
  {
    id: 'patient-worklist',
    title: 'Patient Worklist',
    icon: Search,
    description: 'How to find and access patient records',
    steps: [
      'Click "Patient Worklist" from the home dashboard',
      'Use the search bar to find patients by name or MRN',
      'Apply filters if needed (status, visit type, date range)',
      'Click on a patient to view their complete record',
      'From the overview, access specific sections (Labs, Imaging, Notes, etc.)',
      'Your actions are automatically logged for compliance'
    ],
    roles: ['intake', 'nurse', 'radiologist', 'physician']
  },
  {
    id: 'labs-vitals',
    title: 'Labs & Vitals Entry',
    icon: ClipboardList,
    description: 'How to enter and view lab results and vital signs',
    steps: [
      'Open a patient record from the worklist',
      'Click on "Labs & Vitals" tab',
      'View previous lab results in the table with reference ranges',
      'Click "Add New Lab Result" to enter new test results',
      'Fill in test name, value, unit, and reference range',
      'Add interpretation notes if needed and save',
      'Vitals follow the same process in the Vitals section'
    ],
    roles: ['nurse', 'physician']
  },
  {
    id: 'clinical-notes',
    title: 'Clinical Notes (SOAP)',
    icon: Book,
    description: 'How to document clinical encounters using SOAP format',
    steps: [
      'Open a patient record and click "Clinical Notes" tab',
      'Click "Add New Note" to create a new encounter',
      'Fill in the SOAP sections:',
      '  • Subjective: Patient-reported symptoms and history',
      '  • Objective: Examination findings, vital signs, test results',
      '  • Assessment: Clinical impression and diagnoses',
      '  • Plan: Treatment plan and follow-up actions',
      'Save the note - a timestamp is automatically recorded'
    ],
    roles: ['nurse', 'physician']
  },
  {
    id: 'imaging-review',
    title: 'Imaging Review',
    icon: Eye,
    description: 'How to review imaging studies and add interpretations',
    steps: [
      'Open a patient record and click "Imaging" tab',
      'View list of imaging studies (X-ray, CT, MRI, Ultrasound)',
      'Click on a study to view details and images',
      'As a radiologist, click "Add Interpretation" to document findings',
      'Fill in Findings: detailed observation of the images',
      'Fill in Impression: summary diagnosis based on findings',
      'Mark as Interpreted when complete'
    ],
    roles: ['radiologist', 'physician']
  },
  {
    id: 'diagnostic-support',
    title: 'AI Diagnostic Support',
    icon: Stethoscope,
    description: 'How to use AI-powered diagnostic suggestions (Physician only)',
    steps: [
      'Open a patient record with physician role',
      'Click "Diagnostic Support" tab',
      'Review the patient summary (labs, imaging, notes)',
      'Enter a diagnostic query (e.g., "patient with chest pain and elevated troponin")',
      'The AI will generate differential diagnoses with citations',
      'Each suggestion includes evidence and references',
      'Use this as clinical support only - final diagnosis is physician responsibility'
    ],
    roles: ['physician']
  },
  {
    id: 'audit-logs',
    title: 'Audit & Compliance Logs',
    icon: Shield,
    description: 'How to view system activity logs (Admin/Compliance only)',
    steps: [
      'Click "Audit Log" from the home dashboard (Admin/Compliance role required)',
      'Filter logs by date range, user, or patient',
      'Each log entry shows: timestamp, user, action, patient, outcome',
      'This maintains HIPAA compliance and security audit trail',
      'Export logs for compliance reporting if needed',
      'Logs are immutable and cannot be edited'
    ],
    roles: ['admin', 'compliance']
  },
  {
    id: 'profile-settings',
    title: 'Profile & Account Settings',
    icon: Settings,
    description: 'How to manage your account settings and password',
    steps: [
      'Click on your profile icon in the top navigation',
      'View your account information (name, email, role)',
      'See all permissions associated with your role',
      'Click "Security" tab to change your password',
      'Enter current password, then new password (minimum 4 characters)',
      'Your session timeout is 15 minutes for security'
    ],
    roles: ['intake', 'nurse', 'radiologist', 'physician', 'admin', 'compliance', 'patient']
  }
]

interface ExpandedSections {
  [key: string]: boolean
}

export default function GettingStarted() {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    'patient-registration': true
  })

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-lg">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Getting Started Guide</h1>
            <p className="text-gray-600 mt-1">Learn how to use ClinSight effectively</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-4">
          {GUIDES.map(guide => {
            const Icon = guide.icon
            const isExpanded = expandedSections[guide.id]

            return (
              <div key={guide.id} className="bg-white rounded-card shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover transition-shadow">
                <button
                  onClick={() => toggleSection(guide.id)}
                  className="w-full p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900">{guide.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {guide.roles.map(role => (
                        <span key={role} className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
                          {role === 'intake' ? 'Intake Officer' : role === 'radiologist' ? 'Radiologist' : role === 'admin' ? 'Admin' : role}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 pt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                    <div className="space-y-3">
                      {guide.steps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-500 text-white text-sm font-medium shrink-0">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-card shadow-card p-6 border border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
                <span className="text-sm text-gray-700"><strong>Search everywhere:</strong> Use the search bar to quickly find patients or navigate to features</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
                <span className="text-sm text-gray-700"><strong>Context matters:</strong> Your available actions depend on your role</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
                <span className="text-sm text-gray-700"><strong>Audit trail:</strong> All your actions are automatically logged for compliance</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
                <span className="text-sm text-gray-700"><strong>Session timeout:</strong> Your session expires after 15 minutes for security</span>
              </li>
              <li className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-2 shrink-0" />
                <span className="text-sm text-gray-700"><strong>Data safety:</strong> Patient data is encrypted and HIPAA compliant</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-card shadow-card p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-500" />
              FAQ
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">What is MRN?</h4>
                <p className="text-sm text-gray-600">Medical Record Number - a unique identifier for each patient in the system</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Can I edit patient records?</h4>
                <p className="text-sm text-gray-600">Only authorized users can edit patient data. Changes are logged for audit trail</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">How long do I have to update records?</h4>
                <p className="text-sm text-gray-600">There's no time limit, but timely documentation is best practice</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">What if I make a mistake?</h4>
                <p className="text-sm text-gray-600">Contact your administrator to properly amend records - never delete</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-card shadow-card p-6 border border-warning-200 bg-warning-50">
            <h3 className="text-lg font-semibold text-warning-900 mb-3">Important Reminders</h3>
            <ul className="space-y-2 text-sm text-warning-800">
              <li>✓ Never share your login credentials</li>
              <li>✓ Log out when leaving your workstation</li>
              <li>✓ Report suspicious activity immediately</li>
              <li>✓ Maintain patient privacy and confidentiality</li>
              <li>✓ Follow your organization's policies</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-card shadow-card p-8 border border-gray-100">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Role-Based Access Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Intake Officer</h3>
              <p className="text-sm text-gray-600 mb-3">Handles patient registration and document intake</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Register new patients
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Upload bulk documents
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  View patient worklist
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nurse</h3>
              <p className="text-sm text-gray-600 mb-3">Manages patient vitals, labs, and clinical documentation</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Enter labs & vitals
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Add clinical notes
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  View patient records
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Radiologist</h3>
              <p className="text-sm text-gray-600 mb-3">Reviews imaging studies and provides interpretations</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Review imaging studies
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Add interpretations
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  View patient data
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Physician</h3>
              <p className="text-sm text-gray-600 mb-3">Full clinical access and AI diagnostic support</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  All clinical features
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  AI diagnostic support
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Complete patient overview
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital Admin</h3>
              <p className="text-sm text-gray-600 mb-3">Manages users and system settings</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Register staff members
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Manage user permissions
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  System settings
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Officer</h3>
              <p className="text-sm text-gray-600 mb-3">Monitors system activity and compliance</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  View audit logs
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Generate reports
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary-500" />
                  Monitor access patterns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
