# ClinSight Frontend - Quick Start Guide

Get up and running with ClinSight in 5 minutes!

---

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Connection
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your backend URL
VITE_API_URL=http://localhost:8000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## 🔐 Demo Credentials

Use these credentials to test different user roles:

| Role | Username | Password |
|------|----------|----------|
| Intake Officer | `intake` | `demo` |
| Nurse | `nurse` | `demo` |
| Radiologist | `radiologist` | `demo` |
| Physician | `physician` | `demo` |
| Hospital Admin | `admin` | `demo` |
| Compliance | `compliance` | `demo` |

**Or create a new patient account** by clicking "Register as a patient" on the login page.

---

## 📚 First Steps

### 1. Explore the Getting Started Guide
After logging in, click **"Getting Started"** in the sidebar to view:
- Interactive task guides
- Quick tips
- FAQ section
- Role-based permissions

### 2. Understand Your Role
- **Intake Officer** → Register patients, upload documents
- **Nurse** → Enter labs, vitals, clinical notes
- **Radiologist** → Review imaging, add interpretations
- **Physician** → Full access + AI diagnostic support
- **Admin** → Manage users and system
- **Compliance** → View audit logs

### 3. Explore Features
- Navigate to features in the sidebar
- Check the home dashboard for role-specific shortcuts
- Click on any patient to view their complete record

---

## 🛠️ Common Tasks

### Register a New Patient (Intake Officer)
1. Click "Patient Registration"
2. Enter patient details (name, date of birth, MRN, etc.)
3. Click "Register Patient"

### Upload Documents (Intake Officer)
1. Click "Bulk Upload"
2. Select patient
3. Drag & drop files (PDF, JPG, PNG)
4. Specify document type for each file
5. Click "Upload Documents"

### View Patient Records
1. Click "Patient Worklist"
2. Search by name or MRN
3. Click patient to view full record
4. Access Labs, Imaging, Notes, etc. from tabs

### Enter Lab Results (Nurse)
1. Open patient record
2. Click "Labs & Vitals" tab
3. Click "Add New Lab Result"
4. Enter test details
5. Save

### Review Imaging (Radiologist)
1. Open patient record
2. Click "Imaging" tab
3. Select a study to view details
4. Click "Add Interpretation" to document findings
5. Save

### Use AI Diagnostic Support (Physician)
1. Open patient record
2. Click "Diagnostic Support" tab
3. Enter a diagnostic query
4. Review AI-generated suggestions with evidence

---

## 🔧 Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build
npm run preview

# The dist/ folder is ready for deployment
```

### Deployment
Upload the `dist/` directory to your web server. The application is a single-page app (SPA), so ensure your server rewrites all requests to `index.html`.

---

## 📱 Responsive Design

The application works on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (landscape orientation recommended)

---

## 🔒 Security Notes

- ✅ Your session expires after 15 minutes for security
- ✅ Always log out when leaving your workstation
- ✅ Patient data is encrypted in transit (HTTPS)
- ✅ All actions are logged for compliance

---

## 🆘 Troubleshooting

### "Network error" message?
1. Check that backend is running: `http://localhost:8000/health`
2. Verify `VITE_API_URL` in `.env`
3. Ensure CORS is enabled in backend

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Forgot password?
Contact your system administrator to reset your password.

---

## 📖 Full Documentation

For more details, see:
- **README.md** - Complete feature overview
- **API_ENDPOINTS.md** - API reference
- **FRONTEND_UPDATES.md** - Technical details
- **In-App Help** - Click "Getting Started" in sidebar

---

## 🎯 Key Features

### For Intake Officers
- Patient registration
- Bulk document upload
- Patient search

### For Nurses
- Labs & vitals entry
- Clinical notes
- Patient monitoring

### For Radiologists
- Imaging study review
- Radiologist interpretations
- Image analysis

### For Physicians
- Complete patient overview
- AI diagnostic support
- Clinical decision making
- Full system access

### For Hospital Admin
- User management
- Staff registration
- System settings

### For Compliance Officers
- Audit log access
- Activity monitoring
- Compliance reporting

---

## 📊 Dashboard Overview

Each user sees a personalized dashboard with:
- **Home** - Quick shortcuts for your role
- **Patient Records** - Access patient data
- **Labs & Vitals** - Track measurements
- **Imaging** - View and interpret images
- **Clinical Notes** - Document encounters
- **Audit Logs** - Monitor activity (Admin/Compliance only)

---

## ⌨️ Keyboard Shortcuts

- `Tab` - Navigate between form fields
- `Enter` - Submit forms
- `Esc` - Close modals
- `Cmd/Ctrl + K` - Quick search (future feature)

---

## 🆕 Create Your First Patient Record

**As an Intake Officer:**

1. Log in with intake credentials
2. Click "Patient Registration" from dashboard
3. Fill in patient information:
   - Full Name
   - Date of Birth
   - Medical Record Number (MRN)
   - Contact Information
   - Visit Details
4. Click "Register Patient"
5. Patient is now in the system!

**As a Nurse:**

1. Click "Patient Worklist"
2. Search for the newly registered patient
3. Click to open their record
4. Add Labs, Vitals, or Notes

**As a Physician:**

1. Access the patient record
2. Review all data
3. Use AI Diagnostic Support if needed
4. Document your assessment

---

## 💡 Pro Tips

1. **Use Search Everywhere** - Type to find patients quickly
2. **Check Your Profile** - See your role and permissions
3. **Read the Help Guide** - Click "Getting Started" for detailed instructions
4. **Audit Trail** - All your actions are automatically logged
5. **Session Timeout** - Log out when done for security
6. **Mobile Friendly** - The app works on tablets and phones

---

## 🚀 Next Steps

1. ✅ Set up the environment
2. ✅ Log in with demo credentials
3. ✅ Read the Getting Started guide
4. ✅ Register a test patient
5. ✅ Explore the features
6. ✅ Configure backend URL for production
7. ✅ Deploy to your server

---

## 📞 Support

For issues or questions:
1. Check the **Getting Started** guide in the app
2. Review **README.md** for setup help
3. Check **API_ENDPOINTS.md** for API issues
4. Contact your system administrator

---

**Happy using ClinSight! 🎉**

For detailed information, navigate to the Getting Started guide inside the application.

---

**Version:** 1.0.0
**Last Updated:** February 2026
**Status:** Production Ready ✅
