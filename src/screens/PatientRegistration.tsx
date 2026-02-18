import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function PatientRegistration() {
  const navigate = useNavigate()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    visitType: 'Outpatient',
    chiefComplaint: '',
    visitDate: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.fullName.trim()) next.fullName = 'Please enter full name.'
    if (!form.dob) next.dob = 'Please enter date of birth.'
    if (!form.phone.trim()) next.phone = 'Please enter phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    navigate('/worklist')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-gray-500 text-sm">Register a new patient (Intake Officer only)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-card p-6 max-w-2xl space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Demographics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="e.g. Jane Doe"
              />
              {errors.fullName && <p className="mt-1 text-sm text-danger-600">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth *</label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              {errors.dob && <p className="mt-1 text-sm text-danger-600">{errors.dob}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500"
              >
                <option value="">Select</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="(555) 123-4567"
              />
              {errors.phone && <p className="mt-1 text-sm text-danger-600">{errors.phone}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State / ZIP</label>
              <div className="flex gap-2">
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-24 px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
                  placeholder="State"
                />
                <input
                  name="zip"
                  value={form.zip}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
                  placeholder="ZIP"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visit details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit type</label>
              <select
                name="visitType"
                value={form.visitType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
              >
                <option value="Outpatient">Outpatient</option>
                <option value="Emergency">Emergency</option>
                <option value="Inpatient">Inpatient</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit date</label>
              <input
                name="visitDate"
                type="datetime-local"
                value={form.visitDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chief complaint</label>
              <textarea
                name="chiefComplaint"
                value={form.chiefComplaint}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-button text-gray-900"
                placeholder="e.g. Annual check-up"
              />
            </div>
          </div>
        </section>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-500 text-white font-medium rounded-button shadow-sm hover:bg-primary-600 transition"
          >
            Create patient record
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-button hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
