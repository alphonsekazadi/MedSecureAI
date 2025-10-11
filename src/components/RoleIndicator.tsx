// Role Indicator Component - Shows current user role with styling
import React from 'react';
import type { UserRole } from '../hooks/useAuth';

interface RoleIndicatorProps {
  role: UserRole;
  name?: string;
}

export const RoleIndicator: React.FC<RoleIndicatorProps> = ({ role, name }) => {
  const roleConfig = {
    patient: {
      color: 'bg-blue-100 text-blue-800',
      icon: '👤',
      label: 'Patient',
      description: 'Limited access to personal health data'
    },
    doctor: {
      color: 'bg-green-100 text-green-800',
      icon: '👨‍⚕️',
      label: 'Doctor',
      description: 'Access to patient records and medical tools'
    },
    admin: {
      color: 'bg-purple-100 text-purple-800',
      icon: '⚙️',
      label: 'Admin',
      description: 'Full system access and user management'
    }
  };

  const config = roleConfig[role];

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <span className="text-sm">{config.icon}</span>
        <span className="text-sm font-medium text-gray-700">{name || config.label}</span>
      </div>
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

// Role Switch Component - For demo purposes
export const RoleSwitcher: React.FC = () => {
  // Get the switchRole function from useAuth
  const switchRole = (newRole: UserRole) => {
    console.log('🎭 Role switcher: changing to', newRole);
    localStorage.setItem('medsecure_demo_role', newRole);
    // Force a page reload to apply the new role everywhere
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-yellow-800 mb-2">
        🎭 Demo Role Switcher
      </h3>
      <p className="text-xs text-yellow-700 mb-3">
        For Auth0 Challenge demonstration - switch between user roles to see different access levels
      </p>
      <div className="flex space-x-2">
        <button
          onClick={() => switchRole('patient')}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          👤 Patient
        </button>
        <button
          onClick={() => switchRole('doctor')}
          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          👨‍⚕️ Doctor
        </button>
        <button
          onClick={() => switchRole('admin')}
          className="px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          ⚙️ Admin
        </button>
      </div>
    </div>
  );
};

export default RoleIndicator;