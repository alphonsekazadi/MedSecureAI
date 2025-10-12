import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import SecureAIChat from './SecureAIChat';
import Auth0ChallengeDemo from './Auth0ChallengeDemo';
import PermissionTest from './PermissionTest';
import Auth0Debug from './Auth0Debug';
import AppointmentManager from './AppointmentManager';
import MedicalRecords from './MedicalRecords';

const PatientDashboard = () => {
  const { user, logout, isLoading } = useAuth0();
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Get user roles from Auth0
  const userRoles = user?.['https://medsecureai.com/roles'] || [];
  const userRole = userRoles.includes('admin') ? 'admin' : 
                  userRoles.includes('doctor') ? 'doctor' : 'patient';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-blue-800/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Glassmorphism Navigation Header */}
      <nav className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className={`flex items-center space-x-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">
                  MedSecure<span className="text-blue-400">AI</span>
                </h1>
                <p className="text-xs text-white/60 font-medium">Patient Dashboard</p>
              </div>
            </div>

            {/* User Profile */}
            <div className={`flex items-center space-x-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              {/* Notifications */}
              <button className="relative p-3 text-white/60 hover:text-blue-400 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3.5-7H7.5l-3.5 7H9m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="relative">
                  <img
                    className="h-10 w-10 rounded-full ring-2 ring-blue-400/50"
                    src={user?.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format'}
                    alt={user?.name || 'Patient'}
                  />
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-black animate-pulse"></div>
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-semibold text-white">{user?.name || 'Patient'}</p>
                  <div className="flex items-center space-x-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      userRole === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      userRole === 'doctor' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        userRole === 'admin' ? 'bg-purple-400' :
                        userRole === 'doctor' ? 'bg-green-400' :
                        'bg-blue-400'
                      } animate-pulse`}></div>
                      {userRole.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-3 text-white/60 hover:text-blue-400 hover:bg-white/10 rounded-xl transition-all duration-200"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logout */}
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="hidden sm:block p-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group backdrop-blur-sm border border-red-500/20"
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className={`mb-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 lg:p-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">
                <span className="text-white">Welcome back, </span>
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {user?.name?.split(' ')[0] || 'Patient'}
                </span>
                <span className="text-2xl lg:text-3xl"> 👋</span>
              </h1>
              <p className="text-white/70 text-sm lg:text-base flex items-center">
                <svg className="h-4 w-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your secure health dashboard powered by AI
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-white/50">Last visit</p>
                <p className="text-sm font-semibold text-white">Today, 2:34 PM</p>
              </div>
              <div className="relative">
                <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-blue-500/30 rounded-full blur-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Responsive Tab Navigation */}
        <div className={`mb-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-lg">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-2">
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
                    className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 group ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">{tab.icon}</span>
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </nav>

              {/* Mobile/Tablet Navigation */}
              <nav className="lg:hidden">
                <div className="flex items-center justify-between">
                  {/* Main tabs (visible) */}
                  <div className="flex space-x-1 flex-1">
                    {[
                      { id: 'overview', label: 'Overview', icon: '📊' },
                      { id: 'chat', label: 'AI Chat', icon: '🤖' },
                      { id: 'records', label: 'Records', icon: '📋' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center space-y-1 px-3 py-3 rounded-xl font-medium text-xs transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{tab.icon}</span>
                        <span className="hidden sm:block">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* More menu (three dots) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                      className="flex items-center justify-center w-12 h-12 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {showMobileMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl z-50">
                        {[
                          { id: 'appointments', label: 'Appointments', icon: '📅' },
                          { id: 'challenge-demo', label: 'Auth0 Demo', icon: '🏆' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setShowMobileMenu(false);
                            }}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-sm font-medium transition-all duration-200 ${
                              activeTab === tab.id
                                ? 'bg-blue-500 text-white'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="text-base">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        ))}
                        
                        {/* Logout option in mobile menu */}
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className={`space-y-8 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Heart Rate', value: '72', unit: 'bpm', trend: '+2%', color: 'red', icon: '❤️', status: 'Normal' },
                { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', color: 'blue', icon: '🩺', status: 'Optimal' },
                { label: 'Temperature', value: '98.6', unit: '°F', trend: 'normal', color: 'green', icon: '🌡️', status: 'Normal' },
                { label: 'Weight', value: '165', unit: 'lbs', trend: '-1.2%', color: 'purple', icon: '⚖️', status: 'Healthy' }
              ].map((metric, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 hover:scale-105 transition-all duration-300 group cursor-pointer shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${
                      metric.color === 'red' ? 'from-red-500/20 to-red-600/20 border border-red-500/30' :
                      metric.color === 'blue' ? 'from-blue-500/20 to-blue-600/20 border border-blue-500/30' :
                      metric.color === 'green' ? 'from-green-500/20 to-green-600/20 border border-green-500/30' :
                      'from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                    } group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-2xl">{metric.icon}</span>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm ${
                      metric.status === 'Normal' || metric.status === 'Optimal' || metric.status === 'Healthy' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white/80">{metric.label}</p>
                    <div className="flex items-end space-x-2">
                      <span className="text-3xl font-bold text-white">{metric.value}</span>
                      <span className="text-sm text-white/60 mb-1">{metric.unit}</span>
                    </div>
                    <p className={`text-sm flex items-center ${
                      metric.trend.includes('+') ? 'text-green-400' : 
                      metric.trend.includes('-') ? 'text-red-400' : 'text-white/60'
                    }`}>
                      {metric.trend !== 'stable' && metric.trend !== 'normal' && (
                        <svg className={`h-4 w-4 mr-1 ${metric.trend.includes('+') ? 'rotate-0' : 'rotate-180'}`} fill="currentColor" viewBox="0 0 20 20">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Health Overview */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recent Activity */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <span className="mr-3 text-2xl">📊</span>
                      Recent Activity
                    </h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center group px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-200">
                      View All
                      <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer group">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold group-hover:scale-105 transition-transform duration-200 shadow-lg">
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-white">{activity.type}</p>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold backdrop-blur-sm ${
                              activity.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                              activity.status === 'new' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              activity.status === 'processed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                              'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                          <p className="text-sm text-white/80 mb-1">{activity.desc}</p>
                          <p className="text-xs text-white/50">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions Sidebar */}
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3 text-2xl">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Book Appointment', icon: '📅', color: 'blue', action: () => setActiveTab('appointments') },
                      { label: 'View Records', icon: '📋', color: 'green', action: () => setActiveTab('records') },
                      { label: 'AI Health Chat', icon: '🤖', color: 'purple', action: () => setActiveTab('chat') },
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`w-full flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 group hover:scale-105 ${
                          action.color === 'blue' ? 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/50' :
                          action.color === 'green' ? 'border-green-500/30 bg-green-500/10 hover:bg-green-500/20 hover:border-green-500/50' :
                          'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500/50'
                        }`}
                      >
                        <span className="text-xl">{action.icon}</span>
                        <span className={`font-semibold flex-1 text-left ${
                          action.color === 'blue' ? 'text-blue-300 group-hover:text-blue-200' :
                          action.color === 'green' ? 'text-green-300 group-hover:text-green-200' :
                          'text-purple-300 group-hover:text-purple-200'
                        }`}>
                          {action.label}
                        </span>
                        <svg className={`h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform duration-200 ${
                          action.color === 'blue' ? 'text-blue-400' :
                          action.color === 'green' ? 'text-green-400' :
                          'text-purple-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 hover:bg-white/15 transition-all duration-300 shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <span className="mr-3 text-2xl">💡</span>
                    AI Health Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-200 group">
                      <p className="text-sm font-semibold text-blue-300 flex items-center group-hover:text-blue-200">
                        <span className="mr-2">🚰</span>
                        Hydration Reminder
                      </p>
                      <p className="text-xs text-blue-400 mt-2 leading-relaxed">
                        Drink 8 glasses of water daily for optimal health and improved energy levels
                      </p>
                    </div>
                    <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 hover:bg-green-500/20 transition-all duration-200 group">
                      <p className="text-sm font-semibold text-green-300 flex items-center group-hover:text-green-200">
                        <span className="mr-2">🏃‍♂️</span>
                        Exercise Goal
                      </p>
                      <p className="text-xs text-green-400 mt-2 leading-relaxed">
                        30 minutes of walking can improve cardiovascular health and boost mood
                      </p>
                    </div>
                    <div className="bg-purple-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-200 group">
                      <p className="text-sm font-semibold text-purple-300 flex items-center group-hover:text-purple-200">
                        <span className="mr-2">😴</span>
                        Sleep Quality
                      </p>
                      <p className="text-xs text-purple-400 mt-2 leading-relaxed">
                        Aim for 7-9 hours of quality sleep to support immune function and recovery
                      </p>
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