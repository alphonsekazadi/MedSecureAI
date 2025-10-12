import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import SecureAIChat from './SecureAIChat';
import Auth0ChallengeDemo from './Auth0ChallengeDemo';
import PermissionTest from './PermissionTest';
import Auth0Debug from './Auth0Debug';
import AppointmentManager from './AppointmentManager';
import MedicalRecords from './MedicalRecords';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                  MedSecure<span className="text-blue-600">AI</span>
                </h1>
                <p className="text-xs text-gray-500 font-medium">Healthcare Platform</p>
              </div>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-7H7.5l-3.5 7H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3 bg-white/60 rounded-full px-3 py-2 shadow-sm border border-blue-100">
                <div className="relative">
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-blue-100"
                    src={user?.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format'}
                    alt={user?.name || 'Patient'}
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-semibold text-gray-800">{user?.name || 'Patient'}</p>
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
                      {user?.role?.toUpperCase() || 'PATIENT'}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-8 fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-600 bg-clip-text text-transparent mb-2">
                Welcome back, {user?.name?.split(' ')[0] || 'Patient'}! 👋
              </h1>
              <p className="text-gray-600 text-sm lg:text-base flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your secure health dashboard powered by AI
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Last visit</p>
                <p className="text-sm font-semibold text-gray-800">Today, 2:34 PM</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="mb-8">
          <div className="relative">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-blue-100 shadow-sm p-1">
              <nav className="flex space-x-1 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Health Overview', icon: '📊', color: 'blue' },
                  { id: 'chat', label: 'AI Assistant', icon: '🤖', color: 'purple' },
                  { id: 'records', label: 'Medical Records', icon: '📋', color: 'green' },
                  { id: 'appointments', label: 'Appointments', icon: '📅', color: 'orange' },
                  { id: 'challenge-demo', label: 'Auth0 Demo', icon: '🏆', color: 'red' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 slide-up">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Heart Rate', value: '72', unit: 'bpm', trend: '+2%', color: 'red', icon: '❤️', status: 'Normal' },
                { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', color: 'blue', icon: '🩺', status: 'Optimal' },
                { label: 'Temperature', value: '98.6', unit: '°F', trend: 'normal', color: 'green', icon: '🌡️', status: 'Normal' },
                { label: 'Weight', value: '165', unit: 'lbs', trend: '-1.2%', color: 'purple', icon: '⚖️', status: 'Healthy' }
              ].map((metric, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${metric.color}-50 group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-lg">{metric.icon}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      metric.status === 'Normal' || metric.status === 'Optimal' || metric.status === 'Healthy' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">{metric.label}</p>
                    <div className="flex items-end space-x-1">
                      <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                      <span className="text-sm text-gray-500 mb-1">{metric.unit}</span>
                    </div>
                    <p className={`text-xs flex items-center ${
                      metric.trend.includes('+') ? 'text-green-600' : 
                      metric.trend.includes('-') ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {metric.trend !== 'stable' && metric.trend !== 'normal' && (
                        <svg className={`h-3 w-3 mr-1 ${metric.trend.includes('+') ? 'rotate-0' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {metric.trend}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Health Overview */}
              <div className="lg:col-span-2 space-y-6">
                {/* Recent Activity */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <span className="mr-2">📊</span>
                      Recent Activity
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center group">
                      View All
                      <svg className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { type: 'Appointment', desc: 'Routine checkup with Dr. Smith', time: '2 hours ago', status: 'completed', icon: '👨‍⚕️' },
                      { type: 'Lab Result', desc: 'Blood work results available', time: '1 day ago', status: 'new', icon: '🧪' },
                      { type: 'Prescription', desc: 'Medication refill processed', time: '3 days ago', status: 'processed', icon: '💊' },
                      { type: 'Health Tip', desc: 'AI recommendation: Increase water intake', time: '5 days ago', status: 'suggestion', icon: '💡' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-semibold group-hover:scale-105 transition-transform duration-200">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">{activity.type}</p>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                              activity.status === 'new' ? 'bg-blue-100 text-blue-700' :
                              activity.status === 'processed' ? 'bg-purple-100 text-purple-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{activity.desc}</p>
                          <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Debug (Collapsible) */}
                <div className="space-y-4">
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="text-sm font-semibold text-gray-700 flex items-center">
                          <span className="mr-2">🔧</span>
                          System Debug Info
                        </span>
                        <svg className="h-4 w-4 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-4 space-y-4">
                        <Auth0Debug />
                        <PermissionTest />
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100 p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Book Appointment', icon: '📅', color: 'blue', action: () => setActiveTab('appointments') },
                      { label: 'View Records', icon: '📋', color: 'green', action: () => setActiveTab('records') },
                      { label: 'AI Health Chat', icon: '🤖', color: 'purple', action: () => setActiveTab('chat') },
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-${action.color}-100 bg-${action.color}-50 hover:bg-${action.color}-100 hover:border-${action.color}-200 transition-all duration-200 group`}
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span className={`font-semibold text-${action.color}-700 group-hover:text-${action.color}-800`}>
                          {action.label}
                        </span>
                        <svg className={`h-4 w-4 text-${action.color}-400 ml-auto group-hover:translate-x-1 transition-transform duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💡</span>
                    AI Health Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-800">🚰 Hydration Reminder</p>
                      <p className="text-xs text-blue-600 mt-1">Drink 8 glasses of water daily for optimal health</p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">🏃‍♂️ Exercise Goal</p>
                      <p className="text-xs text-green-600 mt-1">30 minutes of walking can improve cardiovascular health</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <SecureAIChat />
        )}

        {activeTab === 'records' && (
          <MedicalRecords />
        )}

        {activeTab === 'appointments' && (
          <AppointmentManager />
        )}

        {activeTab === 'challenge-demo' && (
          <div>
            <Auth0ChallengeDemo />
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;