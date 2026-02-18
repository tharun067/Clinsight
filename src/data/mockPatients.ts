export interface Patient {
  id: string
  name: string
  mrn: string
  dob: string
  status: 'Active' | 'Pending' | 'Discharged'
  lastActivity: string
}

const INITIAL_PATIENTS: Patient[] = [
  { id: '1', name: 'Jane Doe', mrn: 'MRN-001', dob: '01/15/1980', status: 'Active', lastActivity: '02/07/2025' },
  { id: '2', name: 'John Smith', mrn: 'MRN-002', dob: '05/22/1975', status: 'Active', lastActivity: '02/06/2025' },
  { id: '3', name: 'Maria Garcia', mrn: 'MRN-003', dob: '11/08/1990', status: 'Pending', lastActivity: '02/05/2025' },
]

/** Dynamically added patient records (e.g. from self-registration). */
const dynamicPatients: Patient[] = []

/** All patient records, keyed by patient id. Use this for lookups by patient id. */
export function getAllPatients(): Patient[] {
  return [...INITIAL_PATIENTS, ...dynamicPatients]
}

/** Get a single patient record by patient id. */
export function getPatientById(patientId: string): Patient | undefined {
  return getAllPatients().find((p) => p.id === patientId)
}

/** Add a patient record (e.g. when a patient registers). */
export function addPatientRecord(patient: Patient): void {
  dynamicPatients.push(patient)
}

/** @deprecated Use getAllPatients() or getPatientById() for records keyed by patient id. */
export const MOCK_PATIENTS = INITIAL_PATIENTS
