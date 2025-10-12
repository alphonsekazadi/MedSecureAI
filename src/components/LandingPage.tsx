import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-cycle through features every 4 seconds
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
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

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-blue-800/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Glassmorphism Header */}
      <nav className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className={`flex items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg animate-pulse"></div>
                </div>
                <span className="ml-2 text-2xl font-bold text-white">
                  MedSecure<span className="text-blue-400">AI</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Security Badges */}
              <div className={`hidden md:flex items-center space-x-4 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 text-sm font-medium">Zero-Trust</span>
                </div>
              </div>
              
              {/* Auth Buttons */}
              <div className={`flex items-center space-x-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <button
                  onClick={() => loginWithRedirect()}
                  className="relative px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => loginWithRedirect()}
                  className="relative px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg shadow-blue-500/25 group overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero Title */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="text-white">MedSecure</span>
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">AI</span>
              <span className="text-white/80 text-3xl md:text-4xl block mt-4">Secure AI Health Assistant</span>
            </h1>
          </div>

          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of healthcare with our AI-powered health assistant. 
              <span className="text-blue-400 font-semibold"> Protected by military-grade security </span>
              and Auth0 authentication to keep your medical data safe.
            </p>
          </div>

          {/* Interactive CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button
              onClick={() => loginWithRedirect()}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold text-lg shadow-2xl shadow-blue-500/25 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center">
                🚀 Start Now
                <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-2xl font-semibold text-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300">
              <span className="flex items-center justify-center">
                📋 View Demo
                <svg className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Security Stats avec animation */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-red-400 mb-3 group-hover:scale-110 transition-transform duration-300">45M+</div>
                <div className="text-white/70 text-lg">Patient Records Breached Annually</div>
                <div className="text-red-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Without proper protection
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-green-400 mb-3 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-white/70 text-lg">Secure with MedSecureAI</div>
                <div className="text-green-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Zero-trust architecture
                </div>
              </div>
            </div>
            
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">$10.3M</div>
                <div className="text-white/70 text-lg">Average Cost of Healthcare Breach</div>
                <div className="text-blue-300 text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Avoid these risks
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Features Section */}
          <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-white mb-4">
              Why MedSecureAI is 
              <span className="text-blue-400"> Revolutionary</span>
            </h2>
            <p className="text-xl text-white/60 mb-12 max-w-3xl mx-auto">
              Discover the 3 Auth0 security pillars integrated into our AI solution
            </p>
            
            {/* Interactive Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  id: 0,
                  icon: "🔐",
                  title: "User Authentication",
                  subtitle: "Auth0 Zero-Trust",
                  description: "Every interaction is authenticated and authorized via Auth0 with MFA",
                  details: "Multi-factor protection, secure SSO, complete identity management",
                  color: "from-blue-500/20 to-blue-600/20",
                  borderColor: "border-blue-500/30",
                  glowColor: "shadow-blue-500/25"
                },
                {
                  id: 1,
                  icon: "🔧",
                  title: "Tool Control",
                  subtitle: "Token Vault System",
                  description: "Secure management of API access and tokens via Token Vault",
                  details: "Automatic rotation, end-to-end encryption, complete audit trail",
                  color: "from-green-500/20 to-green-600/20",
                  borderColor: "border-green-500/30",
                  glowColor: "shadow-green-500/25"
                },
                {
                  id: 2,
                  icon: "🧠",
                  title: "Knowledge Limitation",
                  subtitle: "Fine-Grained Authorization",
                  description: "FGA precisely controls access to sensitive medical data",
                  details: "Granular permissions, data separation, HIPAA compliance",
                  color: "from-purple-500/20 to-purple-600/20",
                  borderColor: "border-purple-500/30",
                  glowColor: "shadow-purple-500/25"
                }
              ].map((feature, index) => (
                <div
                  key={feature.id}
                  className={`group relative bg-gradient-to-br ${feature.color} backdrop-blur-xl rounded-2xl border ${feature.borderColor} p-8 cursor-pointer transition-all duration-500 transform hover:scale-105 ${feature.glowColor} ${
                    activeFeature === index ? 'shadow-2xl scale-105' : 'hover:shadow-xl'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-300 font-semibold mb-4">{feature.subtitle}</p>
                  <p className="text-white/80 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className={`transition-all duration-300 ${
                    activeFeature === index ? 'opacity-100 max-h-20' : 'opacity-60 max-h-0 overflow-hidden'
                  }`}>
                    <p className="text-sm text-white/70 border-t border-white/10 pt-4">
                      {feature.details}
                    </p>
                  </div>
                  
                  {/* Interactive indicator */}
                  <div className={`absolute top-4 right-4 w-3 h-3 rounded-full transition-all duration-300 ${
                    activeFeature === index ? 'bg-white scale-100' : 'bg-white/30 scale-75'
                  }`}>
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      activeFeature === index ? 'bg-white' : 'bg-transparent'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Auth0 Challenge Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-full border border-orange-500/30 shadow-lg shadow-orange-500/25">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse mr-3"></div>
              <span className="text-white font-semibold">🏆 Built for Auth0 for AI Agents Challenge</span>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="relative z-10 bg-white/5 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="ml-3 text-xl font-bold text-white">MedSecure<span className="text-blue-400">AI</span></span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                The world's most secure AI health platform. 
                Built with Auth0's zero-trust architecture.
              </p>
            </div>
            
            {/* Security Certifications */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Certifications</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/60 text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/60 text-sm">SOC 2 Type II</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/60 text-sm">ISO 27001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-white/60 text-sm">GDPR Ready</span>
                </div>
              </div>
            </div>
            
            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Challenge</h4>
              <div className="space-y-2">
                <p className="text-white/60 text-sm">Auth0 for AI Agents</p>
                <p className="text-white/60 text-sm">AI Security Innovation</p>
                <div className="flex items-center space-x-3 mt-4">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🏆</span>
                  </div>
                  <span className="text-blue-300 text-sm font-medium">Challenge Entry 2025</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm">
              &copy; 2025 MedSecureAI. Revolutionizing digital health security.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-white/40 text-sm">Powered by</span>
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-300 text-sm font-medium">Auth0</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;