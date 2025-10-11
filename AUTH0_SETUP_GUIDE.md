# 🔐 Auth0 Role Configuration Guide - MedSecureAI

## 🎯 Auth0 Dashboard Setup Instructions

### Step 1: Create Roles in Auth0 Dashboard

Go to: `https://manage.auth0.com/dashboard/us/my-ai-agent/roles`

**Create these roles:**

#### 1. **Patient Role**
- **Name:** `Patient` 
- **Description:** `Standard patient access to personal health information`
- **Permissions:**
  - `read:own_records`
  - `read:appointments`
  - `create:appointments`

#### 2. **Doctor Role**  
- **Name:** `Doctor`
- **Description:** `Healthcare provider with access to patient records and medical tools`
- **Permissions:**
  - `read:patient_records`
  - `write:patient_records`
  - `read:medical_knowledge`
  - `create:prescriptions`
  - `access:token_vault`

#### 3. **Admin Role**
- **Name:** `Admin`
- **Description:** `System administrator with full access to all features`
- **Permissions:**
  - `read:all`
  - `write:all`
  - `delete:all`
  - `manage:users`
  - `access:system_settings`

### Step 2: Configure Permissions

Go to: `https://manage.auth0.com/dashboard/us/my-ai-agent/apis`

**Create these permissions for your API:**

```
read:own_records - Read own medical records
read:patient_records - Read patient medical records  
write:patient_records - Write/update patient records
read:medical_knowledge - Access medical knowledge base
create:prescriptions - Create new prescriptions
access:token_vault - Access Auth0 Token Vault
read:all - Read all system data
write:all - Write all system data
delete:all - Delete system data
manage:users - Manage user accounts
access:system_settings - Access system configuration
```

### Step 3: Assign Roles to Users

1. Go to: `https://manage.auth0.com/dashboard/us/my-ai-agent/users`
2. Select a user
3. Click "Roles" tab
4. Assign appropriate role(s)

### Step 4: Configure Rules/Actions

Create an Auth0 Action to add roles to tokens:

```javascript
/**
* Handler that will be called during the execution of a PostLogin flow.
*/
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://medsecureai.com/';
  
  if (event.authorization) {
    // Add roles to the token
    api.idToken.setCustomClaim(namespace + 'roles', event.authorization.roles);
    api.accessToken.setCustomClaim(namespace + 'roles', event.authorization.roles);
    
    // Add permissions to the token
    if (event.authorization.roles.length > 0) {
      api.idToken.setCustomClaim(namespace + 'permissions', event.request.query.scope.split(' '));
      api.accessToken.setCustomClaim(namespace + 'permissions', event.request.query.scope.split(' '));
    }
    
    // Add medical metadata based on role
    const roles = event.authorization.roles;
    
    if (roles.includes('Doctor')) {
      api.idToken.setCustomClaim(namespace + 'medical_license', 'MD-' + event.user.user_id.slice(-6));
      api.idToken.setCustomClaim(namespace + 'department', 'General Practice');
    }
    
    if (roles.includes('Admin')) {
      api.idToken.setCustomClaim(namespace + 'admin_level', 'system');
      api.idToken.setCustomClaim(namespace + 'department', 'IT & Security');
    }
  }
};
```

### Step 5: Update Environment Variables

Update your `.env` file:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=my-ai-agent.us.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id_here
VITE_AUTH0_AUDIENCE=https://api.medsecureai.com

# Make sure to enable RBAC in your Auth0 API settings
```

## 🧪 Testing the Setup

### Test Users to Create:

1. **Patient Test User:**
   - Email: `patient@medsecureai.test`
   - Role: `Patient`
   - Expected Dashboard: Patient Dashboard

2. **Doctor Test User:**
   - Email: `doctor@medsecureai.test`  
   - Role: `Doctor`
   - Expected Dashboard: Doctor Dashboard

3. **Admin Test User:**
   - Email: `admin@medsecureai.test`
   - Role: `Admin`
   - Expected Dashboard: Admin Dashboard

## 🎯 Challenge Demo Flow

1. **Login as Patient:**
   - See limited knowledge in FGA demo
   - Access only personal medical information
   - Limited Auth0 AI features

2. **Login as Doctor:**
   - See expanded medical knowledge
   - Access patient records (with FGA)
   - Full Token Vault capabilities
   - Advanced medical tools

3. **Login as Admin:**
   - Complete system access
   - User management capabilities
   - All Auth0 AI features enabled
   - System configuration access

## 🔧 Troubleshooting

### Common Issues:

1. **Roles not appearing in token:**
   - Check Auth0 Action is deployed and enabled
   - Verify RBAC is enabled in API settings
   - Check custom claim namespace

2. **Wrong dashboard redirect:**
   - Check role assignment in Auth0 Users
   - Verify role detection logic in `useAuth.ts`
   - Check browser console for role debug logs

3. **Permissions not working:**
   - Verify permissions are assigned to roles
   - Check scope in login request
   - Ensure API audience is correct

---

**This professional Auth0 setup demonstrates enterprise-grade role management for the Auth0 for AI Agents Challenge! 🏆**