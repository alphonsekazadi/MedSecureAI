import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Auth0ChallengeDemo from './Auth0ChallengeDemo';
import SecureAIChat from './SecureAIChat';
import AppointmentManager from './AppointmentManager';
import MedicalRecords from './MedicalRecords';
import PrescriptionManager from './PrescriptionManager';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Modern Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
                  MedSecure<span className="text-green-600">AI</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium">Doctor Portal</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-7H7.5l-3.5 7H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3 bg-white/60 rounded-full px-3 py-2 shadow-sm border border-green-100">
                <div className="relative">
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-green-100"
                    src={user?.picture || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face&auto=format'}
                    alt={user?.name || 'Doctor'}
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-semibold text-gray-800">{user?.name || 'Doctor'}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user?.role === 'doctor' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        user?.role === 'admin' ? 'bg-purple-500' :
                        user?.role === 'doctor' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}></div>
                      {user?.role?.toUpperCase() || 'DOCTOR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, Dr. {user?.name?.split(' ')[user?.name?.split(' ').length - 1] || 'Doctor'}
          </h1>
          <p className="text-gray-600">Secure healthcare provider dashboard</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Patient Overview', icon: '📊' },
                { id: 'chat', label: 'AI Assistant', icon: '🤖' },
                { id: 'appointments', label: 'Appointments', icon: '📅' },
                { id: 'patients', label: 'Patient Records', icon: '📋' },
                { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
                { id: 'challenge-demo', label: 'Auth0 Challenge Demo', icon: '🏆' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Management</h3>
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 mb-4">Manage your patients securely</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                View Patients
              </button>
            </div>
          </div>

          {/* AI Medical Insights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Medical Insights</h3>
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-gray-500 mb-4">Advanced diagnostic assistance</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                Access AI Tools
              </button>
            </div>
          </div>

          {/* Secure Communications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure Communications</h3>
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-500 mb-4">HIPAA-compliant messaging</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                Messages
              </button>
            </div>
          </div>
        </div>
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