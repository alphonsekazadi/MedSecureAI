import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Auth0ChallengeDemo from './Auth0ChallengeDemo';
import SecureAIChat from './SecureAIChat';
import AppointmentManager from './AppointmentManager';
import MedicalRecords from './MedicalRecords';
import PrescriptionManager from './PrescriptionManager';
import MedicalKnowledgeBrowser from './MedicalKnowledgeBrowser';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Modern Navigation Header */}
      <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-xl">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  MedSecure<span className="text-green-400">AI</span>
                </h1>
                <p className="text-xs text-white/70 font-medium">Doctor Portal</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-white/60 hover:text-green-400 hover:bg-white/10 rounded-lg transition-all duration-200 backdrop-blur-xl">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-7H7.5l-3.5 7H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl rounded-full px-3 py-2 border border-white/20">
                <div className="relative">
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-green-400/50"
                    src={user?.picture || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face&auto=format'}
                    alt={user?.name || 'Doctor'}
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-semibold text-white">{user?.name || 'Doctor'}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-xl ${
                      user?.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      user?.role === 'doctor' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        user?.role === 'admin' ? 'bg-purple-400' :
                        user?.role === 'doctor' ? 'bg-green-400' :
                        'bg-blue-400'
                      }`}></div>
                      {user?.role?.toUpperCase() || 'DOCTOR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-all duration-200 group backdrop-blur-xl"
                title="Logout"
              >
                <svg className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, Dr. {user?.name?.split(' ')[user?.name?.split(' ').length - 1] || 'Doctor'}
          </h1>
          <p className="text-white/70">Secure healthcare provider dashboard</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-1 border border-white/10">
            <nav className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Patient Overview', icon: '📊' },
                { id: 'knowledge', label: 'Medical Knowledge', icon: '📚' },
                { id: 'chat', label: 'AI Assistant', icon: '🤖' },
                { id: 'appointments', label: 'Appointments', icon: '📅' },
                { id: 'patients', label: 'Patient Records', icon: '📋' },
                { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
                { id: 'challenge-demo', label: 'Auth0 Challenge Demo', icon: '🏆' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg backdrop-blur-xl'
                      : 'text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-xl'
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Management */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Patient Management</h3>
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-white/70 mb-4">Manage your patients securely</p>
              <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-green-500/30 backdrop-blur-xl">
                View Patients
              </button>
            </div>
          </div>

          {/* AI Medical Insights */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">AI Medical Insights</h3>
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-white/70 mb-4">Advanced diagnostic assistance</p>
              <button className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-purple-500/30 backdrop-blur-xl">
                Access AI Tools
              </button>
            </div>
          </div>

          {/* Secure Communications */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Secure Communications</h3>
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-white/70 mb-4">HIPAA-compliant messaging</p>
              <button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-blue-500/30 backdrop-blur-xl">
                Messages
              </button>
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

        {activeTab === 'appointments' && (
          <AppointmentManager />
        )}

        {activeTab === 'patients' && (
          <MedicalRecords />
        )}

        {activeTab === 'prescriptions' && (
          <PrescriptionManager />
        )}

        {activeTab === 'challenge-demo' && (
          <Auth0ChallengeDemo />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;