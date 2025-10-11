import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface MedicalUserProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  role: UserRole;
  roles?: string[];
  permissions?: string[];
  medical_license?: string;
  specialization?: string;
  department?: string;
  patient_id?: string;
}

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  const userProfile: MedicalUserProfile | null = useMemo(() => {
    if (!user) return null;

    console.log('🔍 Raw Auth0 User:', user);
    console.log('🔍 All User Properties:', Object.keys(user));

    // Get roles and permissions from Auth0 custom claims
    const namespace = 'https://medsecureai.com/';
    const auth0Roles = user[`${namespace}roles`] || [];
    const auth0Permissions = user[`${namespace}permissions`] || [];
    
    console.log('🎭 Auth0 Roles:', auth0Roles);
    console.log('🔐 Auth0 Permissions:', auth0Permissions);
    
    // Debug: Check if roles exist in different formats
    console.log('🔍 Direct roles:', user.roles);
    console.log('🔍 App metadata:', user.app_metadata);
    console.log('🔍 User metadata:', user.user_metadata);
    
    let role: UserRole = 'patient'; // Default role
    
    // Determine primary role from Auth0 custom claims (when available)
    if (Array.isArray(auth0Roles) && auth0Roles.length > 0) {
      if (auth0Roles.includes('Admin')) {
        role = 'admin';
      } else if (auth0Roles.includes('Doctor')) {
        role = 'doctor';
      } else if (auth0Roles.includes('Patient')) {
        role = 'patient';
      }
    } else {
      // TEMPORARY: Assign roles based on email for demo purposes
      // TODO: Remove this when Auth0 Action is properly configured
      if (user.email?.includes('admin')) {
        role = 'admin';
      } else if (user.email?.includes('doctor') || user.email?.includes('dr.')) {
        role = 'doctor';
      } else if (user.email === 'alphonsekazadi01@gmail.com') {
        // Assign Admin role to your personal account for testing
        role = 'admin';
      }
    }
    
    console.log('🎯 Determined Role:', role);
    
    // TEMPORARY: Assign permissions based on role for demo
    // TODO: Remove when Auth0 permissions are working
    const tempPermissions = {
      admin: ['read:profile', 'read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments', 'delete:records', 'manage:users', 'view:analytics'],
      doctor: ['read:profile', 'read:patients', 'write:patients', 'read:prescriptions', 'write:prescriptions', 'read:appointments', 'write:appointments'],
      patient: ['read:profile', 'read:appointments']
    };

    const finalPermissions = auth0Permissions.length > 0 ? auth0Permissions : tempPermissions[role];
    const finalRoles = auth0Roles.length > 0 ? auth0Roles : [role.charAt(0).toUpperCase() + role.slice(1)];

    return {
      sub: user.sub!,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: role,
      roles: finalRoles,
      permissions: finalPermissions,
      medical_license: role === 'doctor' ? `MD-${user.sub?.slice(-6)}` : undefined,
      specialization: role === 'doctor' ? 'Internal Medicine' : undefined,
      department: role === 'doctor' ? 'General Practice' : undefined,
      patient_id: role === 'patient' ? `P-${user.sub?.slice(-6)}` : undefined,
    };
  }, [user]);

  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    return userProfile?.permissions?.includes(permission) || false;
  };

  const login = () => {
    loginWithRedirect({
      authorizationParams: {
        scope: 'openid profile email',
        audience: 'https://api.medsecureai.com', // Important: request API access
      }
    });
  };

  const getToken = async (): Promise<string> => {
    try {
      return await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://api.medsecureai.com',
          scope: 'openid profile email',
        }
      });
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return {
    user: userProfile,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    hasPermission,
    login,
    logout: logoutUser,
    getToken,
    getIdTokenClaims,
  };
};
