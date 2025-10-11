# 🔐 MedSecureAI - User Roles & Authentication Guide

## 👥 User Roles System

### Available Roles
- **Patient** 🏥 - Standard users accessing their health information
- **Doctor** 👨‍⚕️ - Medical professionals with extended access to patient data
- **Admin** 🔧 - System administrators with full access

## 🚪 How to Login with Different Roles

### Current Implementation Status
⚠️ **Important:** The current implementation uses **simulated roles** for demo purposes. In production, roles would be managed through Auth0 user metadata.

### Login Methods

#### 1. **Patient Login** (Default)
- Click "Continue as Patient" on landing page
- **Role assigned:** `patient`
- **Access Level:** Basic health information, AI chat, personal records

#### 2. **Doctor Login**
- Click "Continue as Doctor" on landing page  
- **Role assigned:** `doctor`
- **Access Level:** Patient records, prescription management, advanced medical tools

#### 3. **Admin Login** 
Currently not available on landing page UI, but can be simulated.

## 🔧 Role Assignment Logic

### Current Implementation (`src/hooks/useAuth.ts`)
```typescript
// Simulated role assignment in loginAsPatient()
const userData = {
  ...user,
  role: 'patient'  // Hardcoded for demo
};

// Simulated role assignment in loginAsDoctor()  
const userData = {
  ...user,
  role: 'doctor'   // Hardcoded for demo
};
```

### Production Implementation (Recommended)
In a real Auth0 setup, roles should come from:
- **Auth0 User Metadata:** `user.app_metadata.role`
- **Auth0 Roles/Permissions:** Using Auth0's RBAC system
- **Custom Claims:** Added to JWT tokens

## 🎯 Dashboard Access by Role

### Patient Dashboard (`/patient-dashboard`)
- Health overview
- AI Assistant chat  
- Medical records (own records only)
- Appointments
- **Auth0 Challenge Demo** 🏆

### Doctor Dashboard (`/doctor-dashboard`)
- Patient management
- Medical tools with advanced permissions
- Prescription management
- **Auth0 Challenge Demo** 🏆

### Admin Dashboard (`/admin-dashboard`)
- System management
- User role management
- Audit logs
- **Auth0 Challenge Demo** 🏆

## 🚪 Logout Functionality

### Current Location
- **Patient Dashboard:** Top-right corner (logout button)
- **Other Dashboards:** Should have logout buttons (to be verified)

### Logout Process
1. Click logout button (🚪 icon)
2. Auth0 clears session
3. Redirects to landing page
4. User can login with different role

## 🔄 How to Test Different Roles

### Method 1: Use Landing Page Buttons
1. **Logout** from current session
2. Go to landing page
3. Choose "Continue as Patient" or "Continue as Doctor"

### Method 2: Direct URL Access (if authenticated)
- Patient: `http://localhost:5174/patient-dashboard`
- Doctor: `http://localhost:5174/doctor-dashboard`  
- Admin: `http://localhost:5174/admin-dashboard`

## ⚠️ Current Limitations & TODOs

### Missing Features
- [ ] Admin login button on landing page
- [ ] Logout buttons on all dashboards
- [ ] Role switching without full logout
- [ ] Visual role indicator in navigation
- [ ] Role-based redirect after login

### Recommended Improvements
- [ ] Add role selector on landing page
- [ ] Implement proper Auth0 role management
- [ ] Add role switching functionality
- [ ] Improve visual role indicators
- [ ] Add role-based welcome messages

## 🛠️ Development Notes

### Environment Variables
```env
# Enable all Auth0 AI features for role testing
VITE_ENABLE_TOKEN_VAULT=true
VITE_ENABLE_ASYNC_AUTH=true  
VITE_ENABLE_FGA=true
```

### Testing Auth0 AI Features by Role
- **Patient:** Limited knowledge access in RAG system
- **Doctor:** Full medical knowledge access
- **Admin:** Complete system access + user management

## 🎯 For Auth0 Challenge Judges

### Demo Instructions
1. **Test Patient Role:**
   - Login as Patient
   - Go to "Auth0 Challenge Demo" tab
   - See limited knowledge access in FGA demo

2. **Test Doctor Role:**
   - Logout and login as Doctor
   - Access Doctor dashboard
   - See expanded knowledge access in Auth0 demos

3. **Test Admin Features:**
   - Access admin dashboard (URL: `/admin-dashboard`)
   - Full system access demonstration

---

**Note:** This is a demo implementation. Production systems should use Auth0's built-in role management and RBAC features for security.