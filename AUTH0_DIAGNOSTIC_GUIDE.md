# 🔧 Auth0 Diagnostic Guide - MedSecureAI

## Problem: Custom Claims Not Working (Roles/Permissions Empty)

### Current Symptoms:
- User logs in successfully (`admin@medsecureai.test`)
- `Auth0 Roles: []` (empty array)
- `Auth0 Permissions: []` (empty array)
- Default role becomes "patient" instead of "admin"

## ✅ Step-by-Step Diagnostic Checklist

### 1. Verify User Has Roles Assigned

**Go to:** Auth0 Dashboard → User Management → Users → `admin@medsecureai.test`

**Check:**
- Click on **Roles** tab
- Should see: `Admin` role assigned
- If not assigned, click **Assign Roles** and add `Admin`

### 2. Verify Auth0 Action is Created

**Go to:** Auth0 Dashboard → Actions → Library

**Check:**
- Look for action named: `Add Roles to Token`
- Status should be: **Deployed**

**If not found, create it:**
```javascript
// Action Code:
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://medsecureai.com/';
  
  if (event.authorization) {
    // Add roles to token
    api.idToken.setCustomClaim(`${namespace}roles`, event.authorization.roles);
    api.accessToken.setCustomClaim(`${namespace}roles`, event.authorization.roles);
    
    // Add permissions to token
    api.idToken.setCustomClaim(`${namespace}permissions`, event.authorization.permissions);
    api.accessToken.setCustomClaim(`${namespace}permissions`, event.authorization.permissions);
  }
};
```

### 3. Verify Action is Added to Login Flow

**Go to:** Auth0 Dashboard → Actions → Flows → **Login**

**Check:**
- Should see `Add Roles to Token` action in the flow
- If not, drag it from **Add Action** → **Custom** → `Add Roles to Token`
- Click **Apply** after adding

### 4. Verify API Configuration

**Go to:** Auth0 Dashboard → Applications → APIs → `MedSecureAI API`

**Check:**
- Identifier: `https://api.medsecureai.com`
- Should match `VITE_AUTH0_AUDIENCE` in `.env`

### 5. Verify Application Settings

**Go to:** Auth0 Dashboard → Applications → `MedSecureAI`

**Check APIs tab:**
- `MedSecureAI API` should be **Authorized**
- If not, click **Authorize**

### 6. Test Login Again

After making changes:
1. **Logout** from the app completely
2. Clear browser cache/cookies for localhost
3. **Login** again
4. Check console logs for roles/permissions

## 🐛 Common Issues & Solutions

### Issue 1: Action Not Deployed
**Solution:** Go to Actions → Library → Select action → Deploy

### Issue 2: Action Not in Flow
**Solution:** Go to Actions → Flows → Login → Add the action → Apply

### Issue 3: User Has No Roles
**Solution:** Go to Users → Select user → Roles → Assign roles

### Issue 4: Wrong Namespace
**Solution:** Ensure namespace in action matches: `https://medsecureai.com/`

### Issue 5: API Not Requested
**Solution:** Ensure login requests audience:
```typescript
audience: 'https://api.medsecureai.com'
```

## 🔍 Debug Output Expected

After fixing, console should show:
```
🔍 Raw Auth0 User: {...}
🎭 Auth0 Roles: ["Admin"]
🔐 Auth0 Permissions: ["manage:users", "view:analytics", ...]
```

## 📞 Next Steps

1. Follow checklist above
2. Test login again
3. If still not working, check Auth0 logs:
   - Go to **Monitoring** → **Logs**
   - Look for login events and errors