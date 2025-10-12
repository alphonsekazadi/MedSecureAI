// Auth0 for AI Agents Challenge Demo Component
// Demonstrates the 3 core pillars: User Auth, Token Vault, Fine-Grained Authorization

import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '../hooks/useAuth';
import { medicalRAGService } from '../services/medicalRAGService';
import { executeMedicalTool } from '../services/advancedMedicalTools';

export const Auth0ChallengeDemo: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const { user } = useAuth();
  const [activeDemo, setActiveDemo] = useState<'auth' | 'token-vault' | 'fga' | null>(null);
  const [demoResults, setDemoResults] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeAccess, setKnowledgeAccess] = useState<any>(null);

  // Load user's knowledge access on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadKnowledgeAccess();
    }
  }, [isAuthenticated, user]);

  const loadKnowledgeAccess = async () => {
    if (!user) return;
    
    const userId = user.sub || 'anonymous';
    const userRole = user.role; // Now using the correct role from useAuth hook
    
    const access = await medicalRAGService.getUserKnowledgeAccess(userId, userRole);
    setKnowledgeAccess(access);
  };

  // Pillar 1: User Authentication Demo
  const demoUserAuthentication = async () => {
    setActiveDemo('auth');
    setIsLoading(true);
    setDemoResults('');

    try {
      const result = `
🔐 **AUTH0 USER AUTHENTICATION DEMO**

**Challenge Requirement:** "Authenticate the user - Secure the human who is prompting the agent"

✅ **User Successfully Authenticated via Auth0:**
• User ID: ${user?.sub}
• Email: ${user?.email}
• Name: ${user?.name}
• Role: ${user?.role}
• Authentication Method: Auth0 React SDK
• Session Status: Active and Secure

**Security Features:**
• PKCE Flow for single-page applications
• JWT tokens with proper validation
• Secure session management
• Role-based access control ready

🎯 **Challenge Impact:** This establishes the secure foundation for all AI agent interactions, ensuring only authenticated users can prompt our medical AI assistant.
      `;
      
      setDemoResults(result);
    } catch (error) {
      setDemoResults(`Authentication demo failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pillar 2: Token Vault Demo
  const demoTokenVault = async () => {
    setActiveDemo('token-vault');
    setIsLoading(true);
    setDemoResults('');

    try {
      const result = await executeMedicalTool('google_calendar_medical', {
        action: 'view_appointments'
      });

      const enhancedResult = `
🔑 **AUTH0 TOKEN VAULT DEMO**

**Challenge Requirement:** "Control the tools - Manage which APIs your agent can call on the user's behalf"

✅ **Token Vault Integration Demonstrated:**

${result}

**Technical Implementation:**
• Auth0 Token Vault securely stores Google Calendar OAuth tokens
• AI agent retrieves tokens only when authorized
• Scoped access to specific Google APIs (calendar.readonly)
• No token exposure in client-side code

**Security Benefits:**
• Centralized token management across all AI agents
• Automatic token refresh and revocation
• Audit trail of all API access
• Zero-trust architecture for third-party integrations

🎯 **Challenge Impact:** AI agents can securely access external APIs (Google Calendar, Slack, etc.) on behalf of authenticated users without compromising security.
      `;
      
      setDemoResults(enhancedResult);
    } catch (error) {
      setDemoResults(`Token Vault demo failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pillar 3: Fine-Grained Authorization Demo
  const demoFineGrainedAuth = async () => {
    setActiveDemo('fga');
    setIsLoading(true);
    setDemoResults('');

    try {
      if (!user) throw new Error('User not authenticated');
      
      const userId = user.sub || 'anonymous';
      const userRole = user.role;

      // Test different medical queries to show role-based knowledge filtering
      const testQueries = [
        'Tell me about acetaminophen dosage',
        'What is the morphine sulfate protocol?',
        'Show me John Doe patient records',
        'Emergency Code Blue procedures'
      ];

      let results = `
🛡️ **AUTH0 FINE-GRAINED AUTHORIZATION DEMO**

**Challenge Requirement:** "Limit knowledge - Apply fine-grained authorization directly to your RAG pipelines"

✅ **FGA Applied to Medical Knowledge RAG:**

**Your Role:** ${userRole}
**Knowledge Access Summary:**
• Total Medical Knowledge: ${knowledgeAccess?.totalKnowledge || 0} entries
• Accessible to You: ${knowledgeAccess?.accessibleKnowledge || 0} entries
• Accessible Categories: ${knowledgeAccess?.accessibleCategories?.join(', ') || 'None'}
• Restricted Categories: ${knowledgeAccess?.restrictedCategories?.join(', ') || 'None'}

**RAG Pipeline Testing:**
`;

      // Test each query with FGA filtering
      for (const query of testQueries) {
        const ragResponse = await medicalRAGService.generateSecureResponse(userId, userRole, query);
        const accessStatus = ragResponse.knowledgeSources.length > 0 ? '✅ GRANTED' : '❌ DENIED';
        
        results += `\n📋 **Query:** "${query}"
**Access:** ${accessStatus}
**Sources:** ${ragResponse.knowledgeSources.join(', ') || 'None (insufficient permissions)'}
**Warnings:** ${ragResponse.warnings.join(', ') || 'None'}
`;
      }

      results += `
**Technical Implementation:**
• Auth0 FGA evaluates user permissions before knowledge retrieval
• Role-based access matrix for medical data categories
• Real-time authorization checks for each RAG query
• HIPAA-compliant access controls with audit trails

**Security Benefits:**
• Prevents unauthorized access to sensitive medical knowledge
• Ensures AI responses respect data governance policies
• Enables granular control over information exposure
• Supports compliance with healthcare regulations

🎯 **Challenge Impact:** AI agents only access and share medical knowledge that users are authorized to receive, creating secure and compliant healthcare AI systems.
      `;
      
      setDemoResults(results);
    } catch (error) {
      setDemoResults(`Fine-Grained Authorization demo failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          🏆 Auth0 for AI Agents Challenge Demo
        </h2>
        <p className="text-white/70">
          Please log in to see the demo of all three Auth0 AI pillars in action.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          🏆 Auth0 for AI Agents Challenge Demo
        </h2>
        <p className="text-white/70">
          Interactive demonstration of the three core Auth0 AI pillars working together in a medical AI system.
        </p>
        
        {/* Current Role Debug */}
        <div className="mt-4 p-3 bg-black/20 backdrop-blur-xl rounded-xl border border-white/10">
          <div className="text-sm flex items-center justify-between">
            <div>
              <strong className="text-white">🔍 Current Session:</strong> <span className="text-white/80">{user?.email}</span> | 
              <span className={`ml-2 px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-xl border ${
                user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                user?.role === 'doctor' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                'bg-blue-500/20 text-blue-400 border-blue-500/30'
              }`}>
                {user?.role?.toUpperCase()} ROLE
              </span>
            </div>
            <button
              onClick={() => window.location.href = `/${user?.role}-dashboard`}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 backdrop-blur-xl border ${
                user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30' :
                user?.role === 'doctor' ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30' :
                'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
              }`}
            >
              Go to {user?.role} Dashboard →
            </button>
          </div>
        </div>
      </div>

      {/* Auth0 Professional Role Management */}
      <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">
          🏆 Professional Auth0 Role Management
        </h3>
        <p className="text-xs text-blue-300">
          Your role is determined by Auth0's Role-Based Access Control (RBAC). 
          Contact your system administrator to change roles or access levels.
        </p>
      </div>

      {/* Demo Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={demoUserAuthentication}
          disabled={isLoading}
          className={`p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-xl ${
            activeDemo === 'auth'
              ? 'bg-blue-500/20 border-blue-400/40 text-blue-300 shadow-lg shadow-blue-500/10'
              : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:border-white/30'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🔐</div>
            <div className="font-semibold">1. User Authentication</div>
            <div className="text-sm text-white/60">Secure the human prompting the agent</div>
          </div>
        </button>

        <button
          onClick={demoTokenVault}
          disabled={isLoading}
          className={`p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-xl ${
            activeDemo === 'token-vault'
              ? 'bg-green-500/20 border-green-400/40 text-green-300 shadow-lg shadow-green-500/10'
              : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:border-white/30'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🔑</div>
            <div className="font-semibold">2. Token Vault</div>
            <div className="text-sm text-white/60">Control tools & API access</div>
          </div>
        </button>

        <button
          onClick={demoFineGrainedAuth}
          disabled={isLoading}
          className={`p-4 rounded-xl border-2 transition-all duration-200 backdrop-blur-xl ${
            activeDemo === 'fga'
              ? 'bg-purple-500/20 border-purple-400/40 text-purple-300 shadow-lg shadow-purple-500/10'
              : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15 hover:border-white/30'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="font-semibold">3. Fine-Grained Auth</div>
            <div className="text-sm text-white/60">Limit knowledge & RAG access</div>
          </div>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-white/80">Running Auth0 AI demo...</span>
        </div>
      )}

      {/* Demo Results */}
      {demoResults && !isLoading && (
        <div className="bg-black/20 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <pre className="whitespace-pre-wrap text-sm text-white/90 font-mono">
            {demoResults}
          </pre>
        </div>
      )}

      {/* Challenge Info */}
      <div className="mt-6 p-4 bg-blue-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20">
        <h3 className="font-semibold text-blue-400 mb-2">
          🎯 Auth0 for AI Agents Challenge Compliance
        </h3>
        <p className="text-blue-300 text-sm">
          This MedSecureAI application demonstrates all three required pillars of Auth0 for AI Agents
          in a practical healthcare use case, solving real-world problems around secure medical AI interactions.
        </p>
      </div>
    </div>
  );
};

export default Auth0ChallengeDemo;