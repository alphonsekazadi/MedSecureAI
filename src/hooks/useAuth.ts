import { useAuth0 } from '@auth0/auth0-react';
import { useMemo } from 'react';

// User roles for medical application
export type UserRole = 'patient' | 'doctor' | 'admin';

// User profile with medical information
export interface MedicalUserProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  role: UserRole;
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

  // Extract user role from Auth0 user metadata
  const userProfile: MedicalUserProfile | null = useMemo(() => {
    if (!user) return null;

    const role = user['https://medsecureai.com/role'] || 'patient';
    
    return {
      sub: user.sub!,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: role as UserRole,
      medical_license: user['https://medsecureai.com/medical_license'],
      specialization: user['https://medsecureai.com/specialization'],
      department: user['https://medsecureai.com/department'],
      patient_id: user['https://medsecureai.com/patient_id'],
    };
  }, [user]);

  // Check if user has specific role
  const hasRole = (role: UserRole): boolean => {
    return userProfile?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return userProfile ? roles.includes(userProfile.role) : false;
  };

  // Login with medical-specific parameters
  const loginAsPatient = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup',
        ui_locales: 'en',
        login_hint: 'patient'
      }
    });
  };

  const loginAsDoctor = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login',
        ui_locales: 'en',
        login_hint: 'doctor'
      }
    });
  };

  // Logout with return to medical portal
  const logoutUser = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin + '/goodbye'
      }
    });
  };

  // Get access token for API calls
  const getToken = async (): Promise<string> => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  return {
    user: userProfile,
    isAuthenticated,
    isLoading,
    error,
    hasRole,
    hasAnyRole,
    loginAsPatient,
    loginAsDoctor,
    logout: logoutUser,
    getToken,
    getIdTokenClaims,
  };
};