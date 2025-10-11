import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const Auth0Debug: React.FC = () => {
  const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

  const [idToken, setIdToken] = React.useState<any>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(claims => {
        console.log('🪪 ID Token Claims:', claims);
        setIdToken(claims);
      });
    }
  }, [isAuthenticated, getIdTokenClaims]);

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800">🔐 Auth0 Debug</h3>
        <p className="text-yellow-700">User not authenticated</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">🔍 Auth0 Complete Debug Info</h3>
      
      <div className="space-y-4">
        {/* Basic User Info */}
        <div>
          <h4 className="font-medium text-blue-700">User Profile:</h4>
          <div className="bg-white p-3 rounded border text-sm">
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>Sub:</strong> {user.sub}</div>
            <div><strong>Updated:</strong> {user.updated_at}</div>
          </div>
        </div>

        {/* All User Properties */}
        <div>
          <h4 className="font-medium text-blue-700">All User Properties:</h4>
          <div className="bg-white p-3 rounded border text-xs">
            <pre>{JSON.stringify(Object.keys(user), null, 2)}</pre>
          </div>
        </div>

        {/* Custom Claims Check */}
        <div>
          <h4 className="font-medium text-blue-700">Custom Claims (https://medsecureai.com/):</h4>
          <div className="bg-white p-3 rounded border text-sm">
            <div><strong>Roles:</strong> {JSON.stringify(user['https://medsecureai.com/roles'] || 'NOT FOUND')}</div>
            <div><strong>Permissions:</strong> {JSON.stringify(user['https://medsecureai.com/permissions'] || 'NOT FOUND')}</div>
          </div>
        </div>

        {/* Direct Properties Check */}
        <div>
          <h4 className="font-medium text-blue-700">Direct Properties:</h4>
          <div className="bg-white p-3 rounded border text-sm">
            <div><strong>user.roles:</strong> {JSON.stringify(user.roles || 'NOT FOUND')}</div>
            <div><strong>user.permissions:</strong> {JSON.stringify(user.permissions || 'NOT FOUND')}</div>
            <div><strong>user.app_metadata:</strong> {JSON.stringify(user.app_metadata || 'NOT FOUND')}</div>
            <div><strong>user.user_metadata:</strong> {JSON.stringify(user.user_metadata || 'NOT FOUND')}</div>
          </div>
        </div>

        {/* ID Token Claims */}
        {idToken && (
          <div>
            <h4 className="font-medium text-blue-700">ID Token Claims:</h4>
            <div className="bg-white p-3 rounded border text-xs max-h-40 overflow-auto">
              <pre>{JSON.stringify(idToken, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Full User Object */}
        <div>
          <h4 className="font-medium text-blue-700">Complete User Object:</h4>
          <div className="bg-white p-3 rounded border text-xs max-h-60 overflow-auto">
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </div>

        {/* Diagnostic Status */}
        <div className="p-4 bg-white border rounded">
          <h4 className="font-medium text-blue-700 mb-2">🔧 Diagnostic Status:</h4>
          <div className="space-y-1 text-sm">
            <div className={`flex items-center ${user['https://medsecureai.com/roles'] ? 'text-green-600' : 'text-red-600'}`}>
              {user['https://medsecureai.com/roles'] ? '✅' : '❌'} Custom Claims Namespace Found
            </div>
            <div className={`flex items-center ${Array.isArray(user['https://medsecureai.com/roles']) && user['https://medsecureai.com/roles'].length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Array.isArray(user['https://medsecureai.com/roles']) && user['https://medsecureai.com/roles'].length > 0 ? '✅' : '❌'} Roles Found
            </div>
            <div className={`flex items-center ${Array.isArray(user['https://medsecureai.com/permissions']) && user['https://medsecureai.com/permissions'].length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Array.isArray(user['https://medsecureai.com/permissions']) && user['https://medsecureai.com/permissions'].length > 0 ? '✅' : '❌'} Permissions Found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth0Debug;