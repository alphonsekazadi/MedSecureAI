# Auth0 Setup Guide for MedSecureAI

## 🔐 Setting Up Your Auth0 Tenant for Medical Applications

Follow these steps to configure Auth0 for AI Agents with medical-grade security:

### Step 1: Create Auth0 Account
1. Go to [auth0.com/signup](https://auth0.com/signup?onboard_app=genai&ocid=7014z000001NyoxAAC-aPA4z0000008OZeGAM?utm_source=devto&utm_campaign=amer_namer_usa_all_ciam-dev_dg-plg_auth0_social_devto_other_aud_devtodevchallenge2025_utm2&utm_medium=cpc&utm_id=aNKKZ00000004eK4AQ)
2. Choose "Medical/Healthcare" as your industry
3. Create your tenant: `your-medical-tenant.auth0.com`

### Step 2: Configure Application
1. Navigate to **Applications** → **Create Application**
2. Name: `MedSecureAI`
3. Type: **Single Page Application** (React)
4. Click **Create**

### Step 3: Application Settings
Copy these settings to your application:

#### Basic Information
- **Domain**: `your-medical-tenant.auth0.com`
- **Client ID**: [Copy from dashboard]
- **Client Secret**: [Not needed for SPA]

#### Application URIs
- **Allowed Callback URLs**: 
  ```
  http://localhost:5173, https://your-domain.com
  ```
- **Allowed Logout URLs**: 
  ```
  http://localhost:5173, https://your-domain.com/goodbye
  ```
- **Allowed Web Origins**: 
  ```
  http://localhost:5173, https://your-domain.com
  ```
- **Allowed Origins (CORS)**: 
  ```
  http://localhost:5173, https://your-domain.com
  ```

### Step 4: Configure Auth0 for AI Agents

#### Enable AI Agents Features
1. Go to **Extensions** → **Auth0 for AI Agents**
2. Install and enable the extension
3. Configure the following settings:
   - **Token Vault**: Enable for secure API access
   - **Fine-grained Authorization**: Enable for medical data access
   - **Audit Logging**: Enable for compliance tracking

#### API Configuration
1. Navigate to **APIs** → **Create API**
2. Name: `MedSecureAI API`
3. Identifier: `https://api.medsecureai.com`
4. Signing Algorithm: `RS256`

#### Scopes for Medical Application
Add these scopes to your API:
```
read:health_data - Read patient health information
write:health_data - Update patient health records
read:medical_records - Access medical records
write:medical_records - Create/update medical records
read:patient_data - View patient information
manage:appointments - Schedule and manage appointments
read:audit_logs - View security audit logs (admin only)
manage:users - User administration (admin only)
```

### Step 5: Configure User Roles

#### Create Roles
1. Navigate to **User Management** → **Roles**
2. Create three roles:

##### Patient Role
- **Name**: `Patient`
- **Description**: `Standard patient access to personal health data`
- **Permissions**:
  - `read:health_data`
  - `write:health_data` (own data only)
  - `read:medical_records` (own records only)

##### Doctor Role
- **Name**: `Doctor`
- **Description**: `Healthcare provider with patient management access`
- **Permissions**:
  - `read:health_data`
  - `write:health_data`
  - `read:medical_records`
  - `write:medical_records`
  - `manage:appointments`
  - `read:patient_data`

##### Admin Role
- **Name**: `Admin`
- **Description**: `System administrator with full access`
- **Permissions**:
  - All permissions above
  - `read:audit_logs`
  - `manage:users`

### Step 6: Configure Rules for Medical Compliance

Create a rule to add medical metadata to tokens:

```javascript
function addMedicalClaims(user, context, callback) {
  const namespace = 'https://medsecureai.com/';
  const assignedRoles = (context.authorization || {}).roles;
  
  let userRole = 'patient'; // default
  if (assignedRoles) {
    if (assignedRoles.includes('Admin')) userRole = 'admin';
    else if (assignedRoles.includes('Doctor')) userRole = 'doctor';
  }
  
  // Add medical-specific claims
  const claims = {};
  claims[namespace + 'role'] = userRole;
  claims[namespace + 'medical_license'] = user.app_metadata?.medical_license;
  claims[namespace + 'specialization'] = user.app_metadata?.specialization;
  claims[namespace + 'department'] = user.app_metadata?.department;
  claims[namespace + 'patient_id'] = user.app_metadata?.patient_id || user.user_id;
  
  // Add claims to both ID token and access token
  context.idToken = {...context.idToken, ...claims};
  context.accessToken = {...context.accessToken, ...claims};
  
  callback(null, user, context);
}
```

### Step 7: Security Configurations

#### Multi-Factor Authentication
1. Go to **Security** → **Multi-factor Auth**
2. Enable **SMS**, **Email**, and **Google Authenticator**
3. Set policy to "Always" for healthcare providers
4. Set policy to "Adaptive" for patients (based on risk)

#### Anomaly Detection
1. Enable **Brute Force Protection**
2. Enable **Suspicious IP Throttling**
3. Set up **Breached Password Detection**

#### Session Management
1. **Absolute Timeout**: 8 hours (medical shift)
2. **Inactivity Timeout**: 30 minutes
3. **Require Re-authentication**: Every 4 hours for sensitive operations

### Step 8: Update Environment Variables

Create/update your `.env` file:

```env
# Auth0 Configuration for MedSecureAI
VITE_AUTH0_DOMAIN=your-medical-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_from_dashboard
VITE_AUTH0_AUDIENCE=https://api.medsecureai.com
VITE_AUTH0_REDIRECT_URI=http://localhost:5173

# AI API Configuration (for future implementation)
VITE_OPENAI_API_KEY=your_openai_api_key

# Application Configuration
VITE_APP_NAME=MedSecureAI
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

### Step 9: Test Authentication Flow

#### Test Users
Create test users for each role:

**Patient Test User**
- Email: `patient@test.medsecureai.com`
- Password: `SecurePatient123!`
- Role: Patient

**Doctor Test User**
- Email: `doctor@test.medsecureai.com`
- Password: `SecureDoctor123!`
- Role: Doctor
- Metadata: Medical License, Specialization

**Admin Test User**
- Email: `admin@test.medsecureai.com`
- Password: `SecureAdmin123!`
- Role: Admin

### Step 10: Compliance & Audit Setup

#### Audit Logging
1. Enable **Log Streams** to capture all authentication events
2. Set up log retention for compliance (7 years for medical data)
3. Configure alerts for:
   - Failed login attempts
   - Privilege escalation
   - Unusual access patterns
   - Data export activities

#### HIPAA Compliance Features
- ✅ **Encryption in Transit**: TLS 1.3
- ✅ **Encryption at Rest**: AES-256
- ✅ **Access Controls**: Role-based permissions
- ✅ **Audit Trails**: Complete logging
- ✅ **User Authentication**: MFA required
- ✅ **Session Management**: Automatic timeouts
- ✅ **Data Integrity**: Token verification

### 🧪 Testing Your Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test authentication flows**:
   - Patient login → Patient Dashboard
   - Doctor login → Doctor Dashboard  
   - Admin login → Admin Dashboard

3. **Verify security features**:
   - MFA prompts
   - Role-based access
   - Session timeouts
   - Audit logging

### 📞 Need Help?

If you encounter issues:
1. Check the Auth0 Dashboard logs
2. Verify environment variables
3. Review browser console for errors
4. Test with Auth0 debugging tools

---

## 🏆 Competition Tips

### Demo-Ready Features
- Show the security features prominently
- Demonstrate role-based access
- Highlight HIPAA compliance
- Show audit trails and logging

### Judge Appeal Points
1. **Real Healthcare Problem**: Data breaches cost $10.3M average
2. **Auth0 AI Agents Integration**: Full feature utilization
3. **Professional UI**: Medical-grade design
4. **Security First**: Zero-trust architecture
5. **Compliance Ready**: HIPAA-style protections

Good luck with your winning submission! 🚀