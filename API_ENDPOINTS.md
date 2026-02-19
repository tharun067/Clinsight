# ClinSight API Endpoints Reference

This document provides a comprehensive reference for all ClinSight Backend API endpoints that the frontend uses.

## Configuration

**Base URL:** Configurable via environment variable
```
VITE_API_URL=http://localhost:8000/api
```

**Authentication:** JWT Bearer Token
```
Authorization: Bearer {access_token}
```

---

## 1. Authentication Endpoints

### Login
- **Endpoint:** `POST /auth/login`
- **Authentication:** None (public)
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "access_token": "string",
    "token_type": "bearer",
    "user": {
      "id": "string (UUID)",
      "username": "string",
      "full_name": "string",
      "email": "string",
      "role": "intake|nurse|radiologist|physician|admin|compliance|patient"
    }
  }
  ```

### Register (Patient Self-Registration)
- **Endpoint:** `POST /auth/register`
- **Authentication:** None (public)
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "full_name": "string",
    "email": "string",
    "role": "patient" (optional, defaults to patient)
  }
  ```
- **Response:** `201 Created` (same as login response)

### Register Staff (Admin Only)
- **Endpoint:** `POST /auth/register/staff`
- **Authentication:** Required (Bearer token)
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "full_name": "string",
    "email": "string",
    "role": "intake|nurse|radiologist|physician|admin|compliance"
  }
  ```
- **Response:** `201 Created`

### Bootstrap Admin (Initial Setup)
- **Endpoint:** `POST /auth/bootstrap/admin`
- **Authentication:** None (public, only works if no admin exists)
- **Request Body:** (same as Register Staff)
- **Response:** `201 Created`

---

## 2. User Management Endpoints

### Get All Users (Admin Only)
- **Endpoint:** `GET /auth/users`
- **Authentication:** Required
- **Query Parameters:** None
- **Response:** `200 OK` - Array of user objects

### Get User by ID (Admin Only)
- **Endpoint:** `GET /auth/users/{userId}`
- **Authentication:** Required
- **Path Parameters:**
  - `userId` - UUID of user
- **Response:** `200 OK` - User object

### Deactivate User (Admin Only)
- **Endpoint:** `PATCH /auth/users/{userId}/deactivate`
- **Authentication:** Required
- **Response:** `200 OK` - Updated user object

### Activate User (Admin Only)
- **Endpoint:** `PATCH /auth/users/{userId}/activate`
- **Authentication:** Required
- **Response:** `200 OK` - Updated user object

---

## 3. Patient Management Endpoints

### Create Patient
- **Endpoint:** `POST /patients`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "full_name": "string",
    "mrn": "string",
    "date_of_birth": "YYYY-MM-DD",
    "gender": "M|F|O" (optional),
    "phone": "string" (optional),
    "address": "string" (optional),
    "city": "string" (optional),
    "state": "string" (optional),
    "zip_code": "string" (optional),
    "visit_type": "string" (optional),
    "chief_complaint": "string" (optional),
    "visit_date": "YYYY-MM-DD" (optional)
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "string (UUID)",
    "uuid": "string (UUID)",
    "full_name": "string",
    "mrn": "string",
    "date_of_birth": "string",
    "gender": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "zip_code": "string",
    "visit_type": "string",
    "chief_complaint": "string",
    "visit_date": "string",
    "status": "string",
    "last_activity": "string"
  }
  ```

### Get All Patients
- **Endpoint:** `GET /patients`
- **Authentication:** Required
- **Response:** `200 OK` - Array of patient objects
- **Note:** Supports multiple response formats: direct array, results array, data array, or patients object

### Get Patient by ID
- **Endpoint:** `GET /patients/{id}`
- **Authentication:** Required
- **Path Parameters:**
  - `id` - Patient UUID or ID
- **Response:** `200 OK` - Patient object

### Update Patient
- **Endpoint:** `PUT /patients/{id}`
- **Authentication:** Required
- **Request Body:** (any patient fields to update)
- **Response:** `200 OK` - Updated patient object

### Delete Patient
- **Endpoint:** `DELETE /patients/{id}`
- **Authentication:** Required
- **Response:** `204 No Content`

### Link My Record (Patient Portal)
- **Endpoint:** `POST /patients/link-my-record`
- **Authentication:** Required
- **Query Parameters:**
  - `mrn` - Medical Record Number
- **Response:** `200 OK` - Patient object

### Get My Record (Patient Portal)
- **Endpoint:** `GET /patients/my-record`
- **Authentication:** Required
- **Response:** `200 OK` - Patient object

---

## 4. Labs & Vitals Endpoints

### Create Lab Result
- **Endpoint:** `POST /labs/labs`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (required) - Patient UUID
- **Request Body:**
  ```json
  {
    "test_name": "string",
    "value": "number|string",
    "unit": "string",
    "reference_range": "string" (optional),
    "interpretation": "string" (optional)
  }
  ```
- **Response:** `201 Created` - Lab result object

### Get Lab Results
- **Endpoint:** `GET /labs/labs`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (optional)
  - `test_name` (optional)
- **Response:** `200 OK` - Array of lab objects

### Get Lab Results for Patient
- **Endpoint:** `GET /labs/labs/patient/{patientId}`
- **Authentication:** Required
- **Path Parameters:**
  - `patientId` - Patient UUID
- **Response:** `200 OK` - Array of lab objects

### Get Lab Result by ID
- **Endpoint:** `GET /labs/labs/{labId}`
- **Authentication:** Required
- **Response:** `200 OK` - Lab object

### Update Lab Result
- **Endpoint:** `PUT /labs/labs/{labId}`
- **Authentication:** Required
- **Request Body:** (lab fields to update)
- **Response:** `200 OK` - Updated lab object

### Delete Lab Result
- **Endpoint:** `DELETE /labs/labs/{labId}`
- **Authentication:** Required
- **Response:** `204 No Content`

### Create Vitals
- **Endpoint:** `POST /labs/vitals`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (required)
- **Request Body:**
  ```json
  {
    "heart_rate": "number",
    "blood_pressure_systolic": "number",
    "blood_pressure_diastolic": "number",
    "temperature": "number",
    "respiratory_rate": "number",
    "oxygen_saturation": "number" (optional),
    "weight": "number" (optional),
    "height": "number" (optional)
  }
  ```
- **Response:** `201 Created` - Vitals object

### Get Vitals
- **Endpoint:** `GET /labs/vitals`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (optional)
- **Response:** `200 OK` - Array of vitals objects

### Get Vitals for Patient
- **Endpoint:** `GET /labs/vitals/patient/{patientId}`
- **Authentication:** Required
- **Response:** `200 OK` - Array of vitals objects

### Get Latest Vitals
- **Endpoint:** `GET /labs/vitals/latest/{patientId}`
- **Authentication:** Required
- **Response:** `200 OK` - Latest vitals object

### Delete Vitals
- **Endpoint:** `DELETE /labs/vitals/{vitalsId}`
- **Authentication:** Required
- **Response:** `204 No Content`

### My Vitals (Patient Portal)
- **Endpoint:** `POST /labs/my-vitals` (Create), `GET /labs/my-vitals` (Get)
- **Authentication:** Required
- **Response:** `201 Created` or `200 OK`

### My Labs (Patient Portal)
- **Endpoint:** `POST /labs/my-labs` (Create), `GET /labs/my-labs` (Get)
- **Authentication:** Required
- **Response:** `201 Created` or `200 OK`

---

## 5. Clinical Notes Endpoints

### Create Clinical Note
- **Endpoint:** `POST /notes`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (required)
- **Request Body:**
  ```json
  {
    "note_type": "SOAP|progress|other",
    "subjective": "string",
    "objective": "string",
    "assessment": "string",
    "plan": "string",
    "provider": "string" (optional)
  }
  ```
- **Response:** `201 Created` - Note object

### Get Clinical Notes
- **Endpoint:** `GET /notes`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (optional)
  - `note_type` (optional)
- **Response:** `200 OK` - Array of note objects

### Get Clinical Notes for Patient
- **Endpoint:** `GET /notes/patient/{patientId}`
- **Authentication:** Required
- **Response:** `200 OK` - Array of note objects

### Get Clinical Note by ID
- **Endpoint:** `GET /notes/{noteId}`
- **Authentication:** Required
- **Response:** `200 OK` - Note object

### Update Clinical Note
- **Endpoint:** `PUT /notes/{noteId}`
- **Authentication:** Required
- **Request Body:** (note fields to update)
- **Response:** `200 OK` - Updated note object

### Delete Clinical Note
- **Endpoint:** `DELETE /notes/{noteId}`
- **Authentication:** Required
- **Response:** `204 No Content`

### Summarize Clinical Note
- **Endpoint:** `POST /notes/{noteId}/summarize`
- **Authentication:** Required
- **Query Parameters:**
  - `max_length` (optional) - Maximum summary length
- **Response:** `200 OK` - Summary object

### My Notes (Patient Portal)
- **Endpoint:** `POST /notes/my-notes` (Create), `GET /notes/my-notes` (Get)
- **Authentication:** Required
- **Response:** `201 Created` or `200 OK`

---

## 6. Imaging Endpoints

### Create Imaging Study
- **Endpoint:** `POST /imaging`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (required)
- **Request Body:**
  ```json
  {
    "modality": "X-ray|CT|MRI|US|PET",
    "study_date": "YYYY-MM-DD",
    "body_part": "string",
    "study_description": "string" (optional),
    "image_url": "string" (optional)
  }
  ```
- **Response:** `201 Created` - Imaging study object

### Get Imaging Studies
- **Endpoint:** `GET /imaging`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (optional)
  - `modality` (optional)
  - `status_filter` (optional) - pending|interpreted
- **Response:** `200 OK` - Array of imaging objects

### Get Imaging Studies for Patient
- **Endpoint:** `GET /imaging/patient/{patientId}`
- **Authentication:** Required
- **Response:** `200 OK` - Array of imaging objects

### Get Imaging Study by ID
- **Endpoint:** `GET /imaging/{studyId}`
- **Authentication:** Required
- **Response:** `200 OK` - Imaging object

### Update Imaging Study
- **Endpoint:** `PUT /imaging/{studyId}`
- **Authentication:** Required
- **Request Body:** (imaging fields to update)
- **Response:** `200 OK` - Updated imaging object

### Interpret Imaging Study (Radiologist)
- **Endpoint:** `PUT /imaging/{studyId}/interpret`
- **Authentication:** Required (Radiologist role)
- **Request Body:**
  ```json
  {
    "findings": "string",
    "impression": "string",
    "status": "interpreted" (optional)
  }
  ```
- **Response:** `200 OK` - Updated imaging object

### Delete Imaging Study
- **Endpoint:** `DELETE /imaging/{studyId}`
- **Authentication:** Required
- **Response:** `204 No Content`

---

## 7. Documents Endpoints

### Bulk Upload Documents
- **Endpoint:** `POST /documents/bulk-upload`
- **Authentication:** Required
- **Request:** Multipart form data
  - `files` (required) - Multiple files
  - `patient_id` (required)
  - `document_types` (required) - Comma-separated types
- **Response:** `200 OK` - Array of document objects

### Get Documents
- **Endpoint:** `GET /documents`
- **Authentication:** Required
- **Query Parameters:**
  - `patient_id` (optional)
  - `document_type` (optional)
- **Response:** `200 OK` - Array of document objects

### Get Document by ID
- **Endpoint:** `GET /documents/{documentId}`
- **Authentication:** Required
- **Response:** `200 OK` - Document object

### Download Document
- **Endpoint:** `GET /documents/{documentId}/download`
- **Authentication:** Required
- **Response:** `200 OK` - File blob

### Delete Document
- **Endpoint:** `DELETE /documents/{documentId}`
- **Authentication:** Required
- **Response:** `204 No Content`

### My Documents (Patient Portal)
- **Endpoint:** `POST /documents/my-documents/upload` (Upload), `GET /documents/my-documents` (Get)
- **Authentication:** Required
- **Response:** `201 Created` or `200 OK`

---

## 8. Diagnostic (AI) Endpoints

### Generate Diagnostic Report
- **Endpoint:** `POST /diagnostic/generate`
- **Authentication:** Required (Physician role)
- **Request Body:**
  ```json
  {
    "patient_id": "string (UUID)",
    "query": "string" (optional),
    "clinical_notes": "string" (optional),
    "include_images": "boolean" (optional)
  }
  ```
- **Response:** `200 OK` - Diagnostic report object

### Get Diagnostic Reports
- **Endpoint:** `GET /diagnostic/reports/{patientId}`
- **Authentication:** Required
- **Response:** `200 OK` - Array of diagnostic report objects

### Get Diagnostic Report by ID
- **Endpoint:** `GET /diagnostic/reports/detail/{reportId}`
- **Authentication:** Required
- **Response:** `200 OK` - Diagnostic report object

### Analyze Image
- **Endpoint:** `POST /diagnostic/analyze-image`
- **Authentication:** Required
- **Query Parameters:**
  - `image_path` (required)
  - `query` (optional)
- **Response:** `200 OK` - Analysis result object

### Summarize Note
- **Endpoint:** `POST /diagnostic/summarize-note`
- **Authentication:** Required
- **Query Parameters:**
  - `note_text` (required)
  - `max_length` (optional)
- **Response:** `200 OK` - Summary object

### Extract Entities
- **Endpoint:** `POST /diagnostic/extract-entities`
- **Authentication:** Required
- **Query Parameters:**
  - `text` (required)
- **Response:** `200 OK` - Entities object

### Get Diagnostic Capabilities
- **Endpoint:** `GET /diagnostic/capabilities`
- **Authentication:** Required
- **Response:** `200 OK` - Capabilities object

---

## 9. Audit Logging Endpoints

### Get Audit Logs
- **Endpoint:** `GET /audit`
- **Authentication:** Required (Admin/Compliance role)
- **Query Parameters:**
  - `start_date` (optional) - ISO format
  - `end_date` (optional) - ISO format
  - `user` (optional) - Username
- **Response:** `200 OK` - Array of audit log objects

### Get Audit Logs by Patient
- **Endpoint:** `GET /audit/patient/{patientId}`
- **Authentication:** Required (Admin/Compliance role)
- **Query Parameters:**
  - `page` (optional) - Page number
  - `page_size` (optional) - Items per page
- **Response:** `200 OK` - Paginated audit logs

### Get Audit Logs by User
- **Endpoint:** `GET /audit/user/{userId}`
- **Authentication:** Required (Admin/Compliance role)
- **Query Parameters:**
  - `page` (optional)
  - `page_size` (optional)
- **Response:** `200 OK` - Paginated audit logs

### Get Audit Log by ID
- **Endpoint:** `GET /audit/{logId}`
- **Authentication:** Required (Admin/Compliance role)
- **Response:** `200 OK` - Audit log object

### Get Audit Actions Summary
- **Endpoint:** `GET /audit/actions/summary`
- **Authentication:** Required (Admin/Compliance role)
- **Response:** `200 OK` - Summary object

---

## 10. System Endpoints

### Health Check
- **Endpoint:** `GET /health`
- **Authentication:** None (public)
- **Response:** `200 OK` - Health status object

### System Info
- **Endpoint:** `GET /`
- **Authentication:** None (public)
- **Response:** `200 OK` - System information object

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "detail": "string (error message)",
  "message": "string (alternative error message)"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Authenticated but not authorized for this action
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

---

## Authentication Flow

1. **Login** → Receive `access_token`
2. **Store** → Save token in localStorage
3. **Use** → Include in Authorization header for all requests
4. **Refresh** → Token automatically included in API calls
5. **Logout** → Clear token from localStorage

---

## Rate Limiting & Performance

- No explicit rate limiting documented
- Pagination supported on some endpoints (audit logs)
- Recommended page size: 20-50 items

---

## Data Types & Formats

- **UUID:** 36-character format (e.g., `550e8400-e29b-41d4-a716-446655440000`)
- **Dates:** ISO 8601 format (`YYYY-MM-DD`)
- **Timestamps:** ISO 8601 format with timezone
- **Numbers:** JSON numbers (no quotes)
- **Booleans:** `true` or `false`

---

## Implementation Notes

The frontend API service (`src/services/api.ts`) handles:

- Automatic token refresh
- Error extraction and formatting
- Multiple response data formats
- Patient ID normalization (UUID vs ID)
- Multipart form data for file uploads
- Session management

For detailed implementation, refer to the API service code.

---

**Last Updated:** February 2026
**API Version:** 1.0.0
**Status:** Production Ready
