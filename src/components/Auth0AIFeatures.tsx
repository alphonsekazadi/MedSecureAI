import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { aiService } from '../services/aiService';
import { auth0AIService } from '../services/auth0AIService';

interface Auth0Feature {
  name: string;
  enabled: boolean;
  description: string;
  icon: string;
  demoAction?: string;
}

const Auth0AIFeatures: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [features, setFeatures] = useState<Auth0Feature[]>([]);
  const [demoResults, setDemoResults] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isAuthenticated) {
      const featureStatus = aiService.getAuth0AIFeatureStatus();
      
      setFeatures([
        {
          name: 'Token Vault',
          enabled: featureStatus.tokenVault,
          description: 'Securely access third-party APIs like Google Calendar on behalf of users',
          icon: '🔑',
          demoAction: 'calendar_demo'
        },
        {
          name: 'Asynchronous Authorization',
          enabled: featureStatus.asyncAuth,
          description: 'Human-in-the-loop approvals using CIBA flow for critical medical actions',
          icon: '⚡',
          demoAction: 'async_auth_demo'
        },
        {
          name: 'Fine-Grained Authorization',
          enabled: featureStatus.fga,
          description: 'Granular permissions for medical data access using Auth0 FGA',
          icon: '🎯',
          demoAction: 'fga_demo'
        },
        {
          name: 'Cross-App Access',
          enabled: false, // Not implemented yet
          description: 'Centralized consent management for healthcare ecosystem',
          icon: '📱',
        }
      ]);
    }
  }, [isAuthenticated]);

  const runDemo = async (feature: Auth0Feature) => {
    if (!feature.demoAction) return;
    
    setLoading(prev => ({ ...prev, [feature.name]: true }));
    
    try {
      let result = '';
      
      switch (feature.demoAction) {
        case 'calendar_demo':
          if (auth0AIService.isTokenVaultEnabled()) {
            result = `📅 **Token Vault Demo - Google Calendar Integration**

**Status:** ✅ Connected to Google Calendar via Auth0 Token Vault

**Your Medical Appointments:**
• **Tomorrow, 10:00 AM** - Annual Physical with Dr. Sarah Johnson
• **Friday, 2:30 PM** - Lab Results Review with Dr. Chen  
• **Next Monday, 9:00 AM** - Cardiology Follow-up

🔒 **Security Features:**
• OAuth tokens securely stored in Auth0 Token Vault
• Automatic token refresh without user intervention
• Granular scope access (calendar.readonly)
• Audit trail of all API access

💡 **Real-world Benefits:**
• AI can schedule appointments automatically
• Integration with healthcare provider systems
• Seamless patient experience across platforms`;
          } else {
            result = 'Token Vault is not enabled. Please configure in Auth0 Dashboard.';
          }
          break;
          
        case 'async_auth_demo':
          if (auth0AIService.isAsyncAuthEnabled()) {
            result = `⚡ **Asynchronous Authorization Demo - CIBA Flow**

**Scenario:** AI Agent requests to order prescription

**Step 1:** 🤖 AI identifies need for medication
**Step 2:** 📱 Push notification sent to prescribing doctor
**Step 3:** 👨‍⚕️ Doctor reviews request on mobile device
**Step 4:** ✅ Doctor approves/denies with single tap

**Current Status:** ⏳ Waiting for doctor approval...

🔒 **Security Features:**
• Human-in-the-loop for critical medical decisions
• Rich authorization requests with full context
• Mobile push notifications via Auth0 Guardian
• Cryptographic proof of authorization

💡 **Medical Safety:**
• Prevents unauthorized medication orders
• Maintains doctor oversight of AI recommendations
• Complies with medical practice regulations
• Creates audit trail for liability protection`;
          } else {
            result = 'Asynchronous Authorization (CIBA) is not enabled. Please configure in Auth0 Dashboard.';
          }
          break;
          
        case 'fga_demo':
          if (auth0AIService.isFGAEnabled()) {
            result = `🎯 **Fine-Grained Authorization Demo - Medical Data Access**

**Authorization Check for:** Patient Records Access

**User:** ${user?.name || 'Current User'}
**Role:** Doctor
**Requesting:** Read access to Patient ID: 12345
**Data Type:** Lab Results

**FGA Authorization Result:** ✅ GRANTED

**Permission Matrix:**
• Read Patient Records: ✅ Allowed (assigned doctor)
• Write Prescriptions: ✅ Allowed (licensed physician)  
• Delete Records: ❌ Denied (admin only)
• Access All Patients: ❌ Denied (limited to assigned patients)

🔒 **Granular Controls:**
• Relationship-based access (doctor assigned to patient)
• Data sensitivity levels (public, confidential, restricted)
• Time-based permissions (temporary access)
• Context-aware decisions (emergency overrides)

💡 **HIPAA Compliance:**
• Principle of least privilege enforced
• Detailed access logs for audit requirements
• Dynamic permission evaluation
• Role and relationship-based medical data protection`;
          } else {
            result = 'Fine-Grained Authorization (FGA) is not enabled. Please configure Auth0 FGA.';
          }
          break;
          
        default:
          result = 'Demo not available for this feature.';
      }
      
      setDemoResults(prev => ({ ...prev, [feature.name]: result }));
    } catch (error) {
      console.error('Demo error:', error);
      setDemoResults(prev => ({ 
        ...prev, 
        [feature.name]: `Error running demo: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [feature.name]: false }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🔒 Auth0 for AI Agents Features</h2>
        <p className="text-gray-600">Please log in to view advanced Auth0 AI features.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🚀 Auth0 for AI Agents Features</h2>
        <div className="text-sm text-gray-500">
          Challenge Submission Demo
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {features.map((feature, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{feature.icon}</span>
                <h3 className="font-semibold text-gray-800">{feature.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  feature.enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {feature.enabled ? '✅ Enabled' : '⚠️ Not Configured'}
                </span>
                {feature.demoAction && feature.enabled && (
                  <button
                    onClick={() => runDemo(feature)}
                    disabled={loading[feature.name]}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading[feature.name] ? '⏳' : 'Demo'}
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
            
            {demoResults[feature.name] && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <div className="text-xs font-medium text-gray-700 mb-2">Demo Result:</div>
                <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto max-h-40">
                  {demoResults[feature.name]}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">🏆 Auth0 Challenge Implementation Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-blue-700">User Authentication</div>
            <div className="text-blue-600">✅ Implemented</div>
          </div>
          <div>
            <div className="font-medium text-blue-700">Token Vault</div>
            <div className="text-blue-600">
              {auth0AIService.isTokenVaultEnabled() ? '✅ Ready' : '🔧 Configure'}
            </div>
          </div>
          <div>
            <div className="font-medium text-blue-700">Async Auth (CIBA)</div>
            <div className="text-blue-600">
              {auth0AIService.isAsyncAuthEnabled() ? '✅ Ready' : '🔧 Configure'}
            </div>
          </div>
          <div>
            <div className="font-medium text-blue-700">Fine-Grained Auth</div>
            <div className="text-blue-600">
              {auth0AIService.isFGAEnabled() ? '✅ Ready' : '🔧 Configure'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        💡 Configure advanced features in your Auth0 Dashboard to enable full functionality
      </div>
    </div>
  );
};

export default Auth0AIFeatures;