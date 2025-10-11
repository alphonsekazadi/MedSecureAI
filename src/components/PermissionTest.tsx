import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const PermissionTest: React.FC = () => {
  const { user, hasRole, hasPermission } = useAuth();

  if (!user) return null;

  const permissions = [
    'read:profile',
    'read:patients', 
    'write:patients',
    'read:prescriptions',
    'write:prescriptions',
    'read:appointments',
    'write:appointments',
    'delete:records',
    'manage:users',
    'view:analytics'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">🔐 Auth0 Permissions Test</h3>
      
      <div className="mb-4">
        <h4 className="font-medium">User Info:</h4>
        <p>Email: {user.email}</p>
        <p>Role: <span className="font-semibold text-blue-600">{user.role}</span></p>
        <p>Auth0 Roles: {user.roles?.join(', ') || 'None'}</p>
        <p>Total Permissions: {user.permissions?.length || 0}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-medium">Role Checks:</h4>
        <div className="flex gap-2">
          <span className={`px-2 py-1 rounded text-sm ${hasRole('patient') ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
            Patient: {hasRole('patient') ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${hasRole('doctor') ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
            Doctor: {hasRole('doctor') ? '✅' : '❌'}
          </span>
          <span className={`px-2 py-1 rounded text-sm ${hasRole('admin') ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
            Admin: {hasRole('admin') ? '✅' : '❌'}
          </span>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Permission Checks:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {permissions.map(permission => (
            <div key={permission} className={`px-2 py-1 rounded ${hasPermission(permission) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {permission}: {hasPermission(permission) ? '✅' : '❌'}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="font-medium mb-2">Raw Auth0 Data:</h4>
        <pre className="text-xs overflow-auto">
          Roles: {JSON.stringify(user.roles, null, 2)}
        </pre>
        <pre className="text-xs overflow-auto">
          Permissions: {JSON.stringify(user.permissions, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default PermissionTest;