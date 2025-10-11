import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Auth0ProviderWrapper from './auth/Auth0ProviderWrapper';
import LandingPage from './components/LandingPage';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import Auth0ChallengeDemo from './components/Auth0ChallengeDemo';

import LoadingSpinner from './components/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Main App Router Component
const AppRouter = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    const dashboardPath = `/${user.role}-dashboard`;
    return (
      <Routes>
        <Route path="/" element={<Navigate to={dashboardPath} replace />} />
        <Route 
          path="/patient-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/challenge-demo" 
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']}>
              <Auth0ChallengeDemo />
            </ProtectedRoute>
          } 
        />
        <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this resource.</p>
          </div>
        </div>} />
        <Route path="*" element={<Navigate to={dashboardPath} replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Auth0ProviderWrapper>
      <Router>
        <div className="App">
          <AppRouter />
        </div>
      </Router>
    </Auth0ProviderWrapper>
  );
}

export default App;
