import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Auth0ChallengeDemo from './Auth0ChallengeDemo';
import SecureAIChat from './SecureAIChat';
import UserManagement from './UserManagement';
import AppointmentManager from './AppointmentManager';
import MedicalRecords from './MedicalRecords';
import PrescriptionManager from './PrescriptionManager';
import MedicalKnowledgeBrowser from './MedicalKnowledgeBrowser';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-purple-800/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-purple-500/30 backdrop-blur-xl rounded-lg flex items-center justify-center border border-purple-400/30">
                  <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-white">MedSecure<span className="text-purple-400">AI</span> Admin</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full border border-white/20"
                  src={user?.picture || 'https://via.placeholder.com/32x32?text=A'}
                  alt={user?.name || 'Admin'}
                />
                <span className="text-sm font-medium text-white">{user?.name || 'Admin'}</span>
                <span className={`px-2 py-1 text-xs rounded-lg backdrop-blur-xl border font-semibold ${
                  user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                  user?.role === 'doctor' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {user?.role?.toUpperCase() || 'ADMIN'}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-white/60 hover:text-red-400 transition-colors duration-200 p-2 rounded-xl hover:bg-red-500/10 border border-red-500/20"
                title="Logout"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            System Administration
          </h1>
          <p className="text-white/70">Manage users, security, and compliance</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <nav className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'System Overview', icon: '📊' },
                { id: 'knowledge', label: 'Medical Knowledge', icon: '📚' },
                { id: 'chat', label: 'AI Assistant', icon: '🤖' },
                { id: 'users', label: 'User Management', icon: '👥' },
                { id: 'appointments', label: 'All Appointments', icon: '📅' },
                { id: 'records', label: 'All Records', icon: '📋' },
                { id: 'prescriptions', label: 'All Prescriptions', icon: '💊' },
                { id: 'security', label: 'Security', icon: '🔒' },
                { id: 'challenge-demo', label: 'Auth0 Challenge Demo', icon: '🏆' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 backdrop-blur-xl border ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 border-purple-400/40 text-purple-300 shadow-lg shadow-purple-500/10'
                      : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15 hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Users Stats */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Total Users</p>
                <p className="text-3xl font-bold text-white">1,247</p>
              </div>
              <div className="h-12 w-12 bg-blue-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-blue-400/30">
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Security Alerts</p>
                <p className="text-3xl font-bold text-green-400">0</p>
              </div>
              <div className="h-12 w-12 bg-green-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-green-400/30">
                <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Active Sessions</p>
                <p className="text-3xl font-bold text-orange-400">89</p>
              </div>
              <div className="h-12 w-12 bg-orange-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-orange-400/30">
                <svg className="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Compliance Score */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200 transform hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/60">Compliance Score</p>
                <p className="text-3xl font-bold text-purple-400">98%</p>
              </div>
              <div className="h-12 w-12 bg-purple-500/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-purple-400/30">
                <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-blue-400/30">
                      <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Manage Patients</p>
                      <p className="text-sm text-white/60">View and manage patient accounts</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-green-400/30">
                      <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Manage Doctors</p>
                      <p className="text-sm text-white/60">Healthcare provider administration</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Security & Audit */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security & Audit</h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-red-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-red-400/30">
                      <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Audit Logs</p>
                      <p className="text-sm text-white/60">View security and access logs</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button className="w-full text-left p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-[1.02]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-purple-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-purple-400/30">
                      <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Compliance Reports</p>
                      <p className="text-sm text-white/60">HIPAA and security compliance</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        </div>
        )}

        {activeTab === 'knowledge' && (
          <MedicalKnowledgeBrowser />
        )}

        {activeTab === 'chat' && (
          <SecureAIChat />
        )}

        {activeTab === 'users' && (
          <UserManagement />
        )}

        {activeTab === 'appointments' && (
          <AppointmentManager />
        )}

        {activeTab === 'records' && (
          <MedicalRecords />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionManager />
        )}

        {activeTab === 'security' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Security Dashboard</h3>
            <p className="text-white/70 mb-4">Monitor security events and compliance.</p>
            <div className="text-sm text-white/60">Security dashboard features coming soon...</div>
          </div>
        )}

        {activeTab === 'challenge-demo' && (
          <Auth0ChallengeDemo />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;