# ClinSight — Frontend

Hospital-grade Clinical Decision Support System (CDSS) frontend application. Built with React, TypeScript, Tailwind CSS, and a professional design system.

## Features

- **Multi-modal medical data visualization**: X-ray images, clinical notes, lab values
- **Role-based access control**: 7 different user roles with specific permissions
- **Patient self-registration**: Patients can create accounts and view their records
- **Document management**: Upload and organize patient documents
- **Real-time diagnostic support**: AI-powered diagnostic suggestions (when connected to backend)
- **Comprehensive audit logging**: HIPAA-compliant activity tracking
- **Responsive design**: Optimized for desktop and tablet devices
- **Modern UI**: Gradient backgrounds, smooth animations, hover effects

## Design

- **UX spec:** See `../FRONTEND_DESIGN.md` for screen-by-screen UX, roles, and edge states.
- **Design system:** Colors, typography, and components follow `docs/design.json` (teal primary, Inter font, professional cards).
- **Accessibility**: WCAG 2.1 compliant with proper contrast ratios and keyboard navigation.

## Setup

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Backend API URL (default: http://localhost:8000/api)
VITE_API_URL=http://localhost:8000/api

# Application Environment
VITE_APP_ENV=development
```

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

## Backend Integration

This frontend is designed to work with the ClinSight Backend API. The API service layer (`src/services/api.ts`) handles:

- **Authentication**: JWT token-based auth with automatic token management
- **Patient management**: CRUD operations for patient records
- **Document uploads**: Multi-file upload with progress tracking
- **Audit logs**: Comprehensive activity logging
- **Error handling**: Graceful error handling with user-friendly messages

### Connecting to Backend

1. Ensure the backend is running on `http://localhost:8000`
2. Set `VITE_API_URL` in `.env` to your backend URL
3. The frontend will automatically connect and use real data

### Fallback Mode

When the backend is unavailable, the frontend uses mock data for demonstration purposes. All screens remain functional with simulated data.

## User Roles & Demo Login

| Username   | Password | Role           | Permissions |
|-----------|----------|----------------|-------------|
| intake    | demo     | Intake Officer | Register patients, upload documents |
| nurse     | demo     | Nurse          | View worklist, enter labs/vitals, add notes |
| radiologist | demo   | Radiologist    | Review imaging, add interpretations |
| physician | demo     | Physician      | Full clinical access, diagnostic support |
| admin     | demo     | Hospital Admin | User management, system settings |
| compliance | demo    | Compliance     | View audit logs |

**New users can self-register as patients** via the signup page.

## Screens

1. **Login** — Username/password authentication with JWT tokens
2. **Signup** — Patient self-registration with email validation
3. **Profile** — Account settings and password management
4. **Home dashboard** — Role-based shortcuts and quick stats
5. **Patient registration** — Complete patient intake (Intake only)
6. **Bulk document upload** — Multi-file drag-and-drop upload (Intake only)
7. **Patient worklist** — Advanced search/filter, patient listing
8. **Patient overview** — Demographics, alerts, timeline, quick links
9. **Imaging review** — Study viewer with radiologist notes
10. **Labs & vitals** — Tables with reference ranges and flags
11. **Clinical notes** — SOAP notes with version history
12. **Diagnostic support** — AI suggestions with confidence scores (Physician only)
13. **Audit log** — Comprehensive activity tracking (Admin/Compliance only)

## Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run build
```

Build output is in `dist/` directory.

## Technology Stack

- **React 18** — Modern React with hooks
- **TypeScript** — Type-safe development
- **Vite** — Lightning-fast build tool
- **React Router 6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Beautiful icons
- **JWT Authentication** — Secure token-based auth

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Layout.tsx   # Main app layout with sidebar
├── context/         # React context providers
│   └── AuthContext.tsx
├── data/            # Mock data (fallback)
│   └── mockPatients.ts
├── screens/         # Page components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Profile.tsx
│   ├── HomeDashboard.tsx
│   ├── PatientRegistration.tsx
│   ├── PatientWorklist.tsx
│   ├── PatientOverview.tsx
│   └── ...
├── services/        # API service layer
│   └── api.ts       # Backend integration
├── App.tsx          # Route configuration
└── main.tsx         # Application entry point
```

## Development Guidelines

### Code Style

- Use TypeScript for all new components
- Follow existing component patterns
- Use Tailwind CSS utility classes
- Keep components focused and reusable

### Adding New Features

1. Create component in `src/screens/` or `src/components/`
2. Add route in `src/App.tsx`
3. Update API service if backend integration needed
4. Add appropriate role checks for access control

### Styling

- Follow the design system in `docs/design.json`
- Use semantic color names (primary, success, danger, etc.)
- Maintain consistent spacing and typography
- Test responsive breakpoints

## Security Considerations

- All routes protected with role-based access control
- JWT tokens stored securely in localStorage
- Automatic token refresh on requests
- Session timeout after 15 minutes of inactivity
- Input validation on all forms
- XSS protection via React's built-in sanitization

## Performance

- Code splitting with React Router
- Lazy loading for route components
- Optimized Tailwind CSS (PurgeCSS in production)
- Fast refresh in development
- Minimal bundle size

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Troubleshooting

### Backend Connection Issues

If you see "Network error" messages:
1. Verify backend is running on port 8000
2. Check `VITE_API_URL` in `.env`
3. Ensure CORS is configured in backend
4. Check browser console for detailed errors

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## Disclaimer

**This is an academic/portfolio project. NOT for production medical use.**

This system is designed for:
- Educational purposes
- Research and development
- Portfolio demonstration
- Academic evaluation

**DO NOT use for actual patient diagnosis or treatment decisions.**

## License

MIT License

## Support

For questions or issues:
- Check backend README for API documentation
- Review `docs/design.json` for design system
- See `FRONTEND_DESIGN.md` for UX specifications

---

**Version**: 1.0.0
**Status**: MVP Development
**Last Updated**: February 2026
