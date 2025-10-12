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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">MedSecure<span className="text-green-600">AI</span> Doctor</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.picture || 'https://via.placeholder.com/32x32?text=D'}
                  alt={user?.name || 'Doctor'}
                />
                <span className="text-sm font-medium text-gray-700">{user?.name || 'Doctor'}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user?.role === 'doctor' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role?.toUpperCase() || 'DOCTOR'}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
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